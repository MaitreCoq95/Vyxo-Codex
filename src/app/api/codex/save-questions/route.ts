import { withErrorHandling, ApiError, AuthorizationError } from '@/lib/api/error-handler';
import { withRateLimit } from '@/lib/api/rate-limit';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

const QuestionSchema = z.object({
  question: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  choices: z.array(z.string()).length(4),
  correctIndex: z.number().int().min(0).max(3),
  explanation: z.string().min(10),
  tags: z.array(z.string()),
  moduleId: z.string().optional(),
});

const SaveQuestionsSchema = z.object({
  questions: z.array(QuestionSchema).min(1).max(50),
  moduleId: z.string().optional(),
});

/**
 * Sauvegarde les questions générées dans Supabase
 * Plus sûr que l'écriture de fichiers
 */
export const POST = withRateLimit(
  withErrorHandling(async (req: Request) => {
    const body = await req.json();

    // Valider avec Zod
    const { questions, moduleId } = SaveQuestionsSchema.parse(body);

    // Vérifier l'authentification (service role ou user admin)
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AuthorizationError('Authentication required to save questions');
    }

    const token = authHeader.substring(7);

    // Vérifier si c'est le service role OU un utilisateur authentifié
    const isServiceRole = token === process.env.SUPABASE_SERVICE_ROLE_KEY;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      isServiceRole
        ? process.env.SUPABASE_SERVICE_ROLE_KEY!
        : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Si ce n'est pas le service role, vérifier que l'utilisateur est director
    if (!isServiceRole) {
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);

      if (authError || !user) {
        throw new AuthorizationError('Invalid authentication token');
      }

      // Vérifier le rôle
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'director') {
        throw new AuthorizationError('Only directors can save AI-generated questions');
      }
    }

    // Sauvegarder dans Supabase
    const questionsToInsert = questions.map((q, index) => ({
      id: `ai-${moduleId || 'global'}-${Date.now()}-${index}`,
      module_id: q.moduleId || moduleId,
      question: q.question,
      difficulty: q.difficulty,
      choices: q.choices,
      correct_index: q.correctIndex,
      explanation: q.explanation,
      tags: q.tags,
      source: 'ai_generated',
      created_at: new Date().toISOString(),
    }));

    const { data, error } = await supabase
      .from('quiz_questions')
      .insert(questionsToInsert)
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      throw new ApiError(
        500,
        'Failed to save questions to database',
        'DATABASE_ERROR',
        { supabaseError: error.message }
      );
    }

    return Response.json({
      success: true,
      message: `${questions.length} questions sauvegardées avec succès !`,
      count: questions.length,
      savedQuestions: data,
    });
  }),
  {
    maxRequests: 10,
    windowSeconds: 300, // 10 sauvegardes max toutes les 5 minutes
    message: 'Trop de sauvegardes. Maximum 10 toutes les 5 minutes.',
  }
);
