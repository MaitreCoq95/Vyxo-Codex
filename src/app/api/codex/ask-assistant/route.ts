import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Edge runtime pour les meilleures performances
export const runtime = 'edge';

export async function POST(req: Request) {
  const { question, moduleId, moduleName, context } = await req.json();

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
}
