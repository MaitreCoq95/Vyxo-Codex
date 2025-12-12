import { NextRequest, NextResponse } from 'next/server';
import { getAllModules } from '@/domain/codex/modules';
import { getAllItems } from '@/domain/codex/items';
import { getAllQuestions } from '@/domain/codex/all-questions';
import { AISearchRequest, AISearchResult, KnowledgeItem, KnowledgeModule, QuizQuestion } from '@/domain/types/codex';
import { withErrorHandling, ValidationError } from '@/lib/api/error-handler';
import { z } from 'zod';

const SearchRequestSchema = z.object({
  query: z.string().min(3, 'La requête doit contenir au moins 3 caractères').max(500),
  moduleIds: z.array(z.string()).optional(),
});

/**
 * Endpoint de recherche IA dans le Codex
 * POST /api/codex/ask
 *
 * Permet de poser une question en langage naturel et obtenir :
 * - Un résumé de réponse
 * - Les items de connaissance pertinents
 * - Les modules liés
 * - Des questions de quiz suggérées
 */
export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json();

  // Valider la requête avec Zod
  const validatedData = SearchRequestSchema.parse(body);
  const { query, moduleIds } = validatedData;

  // Charger toutes les données
  const allModules = getAllModules();
  const allItems = getAllItems();
  const allQuestions = await getAllQuestions();

  // Filtrer par modules si spécifié
  const modules = moduleIds && moduleIds.length > 0
    ? allModules.filter(m => moduleIds.includes(m.id))
    : allModules;

  const items = moduleIds && moduleIds.length > 0
    ? allItems.filter(item => moduleIds.includes(item.moduleId))
    : allItems;

  const questions = moduleIds && moduleIds.length > 0
    ? allQuestions.filter(q => moduleIds.includes(q.moduleId))
    : allQuestions;

  // Effectuer la recherche
  const searchResults = performSearch(query.toLowerCase(), modules, items, questions);

  // Générer la réponse
  const result: AISearchResult = {
    answerSummary: generateAnswerSummary(query, searchResults),
    relatedItems: searchResults.items.slice(0, 10), // Top 10
    relatedModules: searchResults.modules.slice(0, 5), // Top 5
    suggestedQuiz: searchResults.questions.slice(0, 5), // Top 5
    sources: searchResults.sources,
  };

  return NextResponse.json(result);
});

/**
 * Calcule un score de pertinence pour une chaîne donnée
 */
function calculateRelevance(text: string, query: string): number {
  const lowerText = text.toLowerCase();
  const queryTerms = query.toLowerCase().split(/\s+/);

  let score = 0;

  // Correspondance exacte = score élevé
  if (lowerText.includes(query)) {
    score += 100;
  }

  // Correspondance de chaque terme
  queryTerms.forEach(term => {
    if (term.length < 2) return;

    if (lowerText.includes(term)) {
      score += 10;

      // Bonus si le terme est au début
      if (lowerText.startsWith(term)) {
        score += 20;
      }
    }

    // Correspondance partielle (fuzzy)
    const words = lowerText.split(/\s+/);
    words.forEach(word => {
      if (word.includes(term) || term.includes(word)) {
        score += 5;
      }
    });
  });

  return score;
}

/**
 * Effectue la recherche dans toutes les données
 */
function performSearch(
  query: string,
  modules: KnowledgeModule[],
  items: KnowledgeItem[],
  questions: QuizQuestion[]
) {
  // Recherche dans les modules
  const moduleResults = modules.map(module => ({
    module,
    score: calculateRelevance(`${module.title} ${module.shortDescription} ${module.tags.join(' ')}`, query)
  }))
  .filter(r => r.score > 0)
  .sort((a, b) => b.score - a.score)
  .map(r => r.module);

  // Recherche dans les items
  const itemResults = items.map(item => ({
    item,
    score: calculateRelevance(`${item.topic} ${item.body} ${item.tags.join(' ')}`, query)
  }))
  .filter(r => r.score > 0)
  .sort((a, b) => b.score - a.score)
  .map(r => r.item);

  // Recherche dans les questions
  const questionResults = questions.map(question => ({
    question,
    score: calculateRelevance(`${question.question} ${question.explanation} ${question.tags.join(' ')}`, query)
  }))
  .filter(r => r.score > 0)
  .sort((a, b) => b.score - a.score)
  .map(r => r.question);

  // Extraire les sources (modules concernés)
  const sourceModuleIds = new Set([
    ...itemResults.slice(0, 10).map(i => i.moduleId),
    ...questionResults.slice(0, 5).map(q => q.moduleId)
  ]);

  const sources = Array.from(sourceModuleIds)
    .map(id => modules.find(m => m.id === id))
    .filter(Boolean)
    .map(m => m!.title);

  return {
    modules: moduleResults,
    items: itemResults,
    questions: questionResults,
    sources,
  };
}

/**
 * Génère un résumé de réponse basé sur les résultats
 */
function generateAnswerSummary(query: string, searchResults: any): string {
  const { items, modules, questions } = searchResults;

  if (items.length === 0 && modules.length === 0) {
    return `Aucun résultat trouvé pour "${query}". Essayez de reformuler votre question ou d'utiliser d'autres termes de recherche.`;
  }

  let summary = `🔍 **Résultats pour : "${query}"**\n\n`;

  if (modules.length > 0) {
    const topModule = modules[0];
    summary += `📚 **Module principal concerné :** ${topModule.title}\n`;
    summary += `${topModule.shortDescription}\n\n`;
  }

  if (items.length > 0) {
    summary += `✅ **${items.length} éléments de connaissance trouvés**\n\n`;

    // Résumer les 3 premiers items
    items.slice(0, 3).forEach((item: KnowledgeItem, idx: number) => {
      summary += `${idx + 1}. **${item.topic}**\n`;
      const preview = item.body.substring(0, 150);
      summary += `   ${preview}${item.body.length > 150 ? '...' : ''}\n\n`;
    });

    if (items.length > 3) {
      summary += `... et ${items.length - 3} autre(s) élément(s).\n\n`;
    }
  }

  if (questions.length > 0) {
    summary += `❓ **${questions.length} questions de quiz disponibles** pour tester vos connaissances.\n\n`;
  }

  summary += `💡 *Explorez les résultats ci-dessous pour plus de détails.*`;

  return summary;
}
