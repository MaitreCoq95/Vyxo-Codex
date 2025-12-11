import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { QuizQuestion } from "@/types/codex";

/**
 * Sauvegarder les questions générées dans Supabase
 */
export async function saveQuestionsToSupabase(questions: QuizQuestion[]): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    const supabase = createClientComponentClient();

    // Transformer les questions pour Supabase
    const dbQuestions = questions.map(q => ({
      id: q.id,
      module_id: q.moduleId,
      difficulty: q.difficulty,
      question: q.question,
      choices: q.choices,
      correct_index: q.correctIndex,
      explanation: q.explanation,
      tags: q.tags,
    }));

    // Insérer dans Supabase
    const { data, error } = await supabase
      .from('codex_quiz_questions')
      .insert(dbQuestions);

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }

    return {
      success: true,
      count: questions.length,
    };
  } catch (error: any) {
    return {
      success: false,
      count: 0,
      error: error.message || 'Erreur lors de la sauvegarde',
    };
  }
}

/**
 * Charger toutes les questions depuis Supabase
 */
export async function loadQuestionsFromSupabase(): Promise<QuizQuestion[]> {
  try {
    const supabase = createClientComponentClient();

    const { data, error } = await supabase
      .from('codex_quiz_questions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading questions:', error);
      return [];
    }

    // Transformer au format QuizQuestion
    return (data || []).map(q => ({
      id: q.id,
      moduleId: q.module_id,
      difficulty: q.difficulty as 'easy' | 'medium' | 'hard',
      question: q.question,
      choices: q.choices as string[],
      correctIndex: q.correct_index,
      explanation: q.explanation,
      tags: q.tags as string[],
    }));
  } catch (error) {
    console.error('Error loading questions:', error);
    return [];
  }
}

/**
 * Charger les questions d'un module spécifique
 */
export async function loadQuestionsByModule(moduleId: string): Promise<QuizQuestion[]> {
  try {
    const supabase = createClientComponentClient();

    const { data, error } = await supabase
      .from('codex_quiz_questions')
      .select('*')
      .eq('module_id', moduleId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading questions:', error);
      return [];
    }

    return (data || []).map(q => ({
      id: q.id,
      moduleId: q.module_id,
      difficulty: q.difficulty as 'easy' | 'medium' | 'hard',
      question: q.question,
      choices: q.choices as string[],
      correctIndex: q.correct_index,
      explanation: q.explanation,
      tags: q.tags as string[],
    }));
  } catch (error) {
    console.error('Error loading questions:', error);
    return [];
  }
}

/**
 * Supprimer toutes les questions générées (utile pour reset)
 */
export async function deleteAllGeneratedQuestions(): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClientComponentClient();

    const { error } = await supabase
      .from('codex_quiz_questions')
      .delete()
      .neq('id', ''); // Delete all

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Erreur lors de la suppression',
    };
  }
}
