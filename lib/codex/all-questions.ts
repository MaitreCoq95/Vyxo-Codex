import { QuizQuestion } from "@/types/codex";
import { quizQuestions as hardcodedQuestions } from "./questions";
import { loadQuestionsFromSupabase, loadQuestionsByModule as loadSupabaseQuestionsByModule } from "./supabase-questions";

/**
 * Cache pour les questions Supabase
 */
let supabaseQuestionsCache: QuizQuestion[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Charger TOUTES les questions (hardcodées + Supabase)
 */
export async function getAllQuestions(): Promise<QuizQuestion[]> {
  // Vérifier le cache
  const now = Date.now();
  if (supabaseQuestionsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return [...hardcodedQuestions, ...supabaseQuestionsCache];
  }

  // Charger depuis Supabase
  const supabaseQuestions = await loadQuestionsFromSupabase();
  supabaseQuestionsCache = supabaseQuestions;
  cacheTimestamp = now;

  // Combiner
  return [...hardcodedQuestions, ...supabaseQuestions];
}

/**
 * Charger les questions d'un module spécifique (hardcodées + Supabase)
 */
export async function getAllQuestionsByModule(moduleId: string): Promise<QuizQuestion[]> {
  const allQuestions = await getAllQuestions();
  return allQuestions.filter(q => q.moduleId === moduleId);
}

/**
 * Charger des questions aléatoires (hardcodées + Supabase)
 */
export async function getAllRandomQuestions(count: number, moduleId?: string): Promise<QuizQuestion[]> {
  let pool = await getAllQuestions();

  if (moduleId) {
    pool = pool.filter(q => q.moduleId === moduleId);
  }

  // Shuffle et prendre les n premières
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Invalider le cache (forcer le rechargement)
 */
export function invalidateQuestionsCache() {
  supabaseQuestionsCache = null;
  cacheTimestamp = 0;
}

/**
 * Obtenir les statistiques
 */
export async function getQuestionsStats() {
  const allQuestions = await getAllQuestions();

  return {
    total: allQuestions.length,
    hardcoded: hardcodedQuestions.length,
    generated: allQuestions.length - hardcodedQuestions.length,
    byModule: allQuestions.reduce((acc, q) => {
      acc[q.moduleId] = (acc[q.moduleId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };
}
