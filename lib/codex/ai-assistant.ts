/**
 * Helper IA pour le module Vyxo Codex
 * Intégration avec l'API ChatGPT pour générer des questions, enrichir les connaissances, etc.
 * Utilise la même clé API OPENAI_API_KEY configurée sur Vercel pour les autres modules.
 */

import { QuizQuestion } from '@/types/codex';

/**
 * Configuration de l'API ChatGPT
 * Utilise la clé API OpenAI déjà configurée sur Vercel (même que pour les emails, audits, etc.)
 */
export const CODEX_AI_CONFIG = {
  model: 'gpt-4o', // Même modèle que les autres modules
  temperature: 0.7,
  maxTokens: 2000,
};

/**
 * Interface pour les requêtes à l'assistant IA
 */
export interface CodexAIRequest {
  prompt: string;
  moduleId?: string;
  moduleName?: string;
  context?: string;
  type?: 'question-generation' | 'knowledge-enrichment' | 'general-query';
}

/**
 * Interface pour les réponses de l'assistant IA
 */
export interface CodexAIResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

/**
 * Générer des questions de quiz via IA
 * Utilise l'API route /api/codex/generate-questions
 *
 * @param moduleId - ID du module pour lequel générer des questions
 * @param moduleName - Nom du module (pour le contexte IA)
 * @param count - Nombre de questions à générer
 * @param difficulty - Niveau de difficulté
 */
export async function generateQuizQuestions(
  moduleId: string,
  moduleName: string,
  count: number = 5,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): Promise<QuizQuestion[]> {
  try {
    const response = await fetch('/api/codex/generate-questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        moduleId,
        moduleName,
        count,
        difficulty,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate questions');
    }

    const data = await response.json();
    return data.questions || [];
  } catch (error: any) {
    console.error('[Codex AI] Error generating questions:', error);
    throw error;
  }
}

/**
 * Poser une question à l'assistant (streaming)
 * Utilise l'API route /api/codex/ask-assistant
 *
 * @param question - La question à poser
 * @param moduleId - (Optionnel) Contexte du module
 * @param moduleName - (Optionnel) Nom du module
 * @param context - (Optionnel) Contexte additionnel
 * @returns ReadableStream pour la réponse en streaming
 */
export async function askAssistant(
  question: string,
  moduleId?: string,
  moduleName?: string,
  context?: any
): Promise<ReadableStream> {
  const response = await fetch('/api/codex/ask-assistant', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      question,
      moduleId,
      moduleName,
      context,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get assistant response');
  }

  return response.body!;
}

/**
 * Enrichir les connaissances d'un module via IA
 * Utilise l'assistant pour générer du contenu éducatif
 *
 * @param moduleId - ID du module à enrichir
 * @param moduleName - Nom du module
 * @param topic - Sujet spécifique à développer
 */
export async function enrichKnowledge(
  moduleId: string,
  moduleName: string,
  topic: string
): Promise<ReadableStream> {
  const question = `Développe en détail le sujet "${topic}" dans le contexte de ${moduleName}.
Fournis des explications claires, des exemples concrets, et des points d'attention importants.`;

  return askAssistant(question, moduleId, moduleName);
}

/**
 * Utilitaire pour convertir un ReadableStream en texte
 * Utile pour consommer les réponses streaming
 */
export async function streamToText(stream: ReadableStream): Promise<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let text = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      text += decoder.decode(value, { stream: true });
    }
  } finally {
    reader.releaseLock();
  }

  return text;
}

/**
 * Hook React personnalisé pour utiliser l'assistant en streaming
 * Exemple d'utilisation dans un composant :
 *
 * ```tsx
 * const { askQuestion, response, isLoading, error } = useCodexAssistant();
 *
 * const handleSubmit = () => {
 *   askQuestion("Explique-moi ISO 9001", "iso-9001", "ISO 9001");
 * };
 * ```
 */
export function useCodexAssistant() {
  // Cette fonction sera implémentée côté composant si nécessaire
  // Pour l'instant, c'est juste une référence pour montrer comment l'utiliser
}
