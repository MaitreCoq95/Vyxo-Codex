import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { withRateLimit, RateLimitPresets } from '@/lib/api/rate-limit';
import { z } from 'zod';
import { ApiError } from '@/lib/api/error-handler';

// Edge runtime pour les meilleures performances
export const runtime = 'edge';

const AssistantRequestSchema = z.object({
  question: z.string().min(3, 'La question doit contenir au moins 3 caractères').max(2000),
  moduleId: z.string().optional(),
  moduleName: z.string().optional(),
  context: z.record(z.any()).optional(),
});

export const POST = withRateLimit(
  async (req: Request) => {
    try {
      const body = await req.json();

      // Valider avec Zod
      const { question, moduleId, moduleName, context } = AssistantRequestSchema.parse(body);

      // Vérifier la clé API
      if (!process.env.OPENAI_API_KEY) {
        throw new ApiError(500, 'OpenAI API key not configured', 'CONFIG_ERROR');
      }

      const systemPrompt = `Tu es l'assistant expert Vyxo Codex, spécialisé dans les systèmes de management (ISO 9001, 14001, 45001, 27001),
les bonnes pratiques pharmaceutiques (GDP, GMP, GAMP 5), le transport spécialisé (CEIV Pharma, chaîne du froid),
et l'excellence opérationnelle (Lean, Six Sigma).

STYLE :
- Professionnel mais accessible
- Explications claires et structurées
- Exemples concrets et applicables
- Références aux normes et standards pertinents

FOCUS :
- Valeur pédagogique
- Applications pratiques
- Points d'attention importants
- Conseils d'audit si pertinent

${moduleName ? `MODULE ACTUEL : ${moduleName} (ID: ${moduleId})` : 'MODE GLOBAL : Tous les modules'}

${context ? `CONTEXTE ADDITIONNEL : ${JSON.stringify(context)}` : ''}

Fournis des réponses structurées, avec des listes à puces quand c'est approprié.`;

      const result = await streamText({
        model: openai('gpt-4o'),
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: question
          }
        ],
      });

      return result.toTextStreamResponse();
    } catch (error) {
      // Gérer les erreurs de validation Zod
      if (error instanceof z.ZodError) {
        return new Response(
          JSON.stringify({
            error: 'Validation failed',
            details: error.errors,
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      // Gérer les erreurs personnalisées
      if (error instanceof ApiError) {
        return new Response(
          JSON.stringify({
            error: error.message,
            code: error.code,
          }),
          {
            status: error.statusCode,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      // Erreur générique
      console.error('Assistant API error:', error);
      return new Response(
        JSON.stringify({
          error: 'Internal server error',
          message: error instanceof Error ? error.message : 'Unknown error',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  },
  RateLimitPresets.ai // 5 requêtes max par minute
);
