import { createClient } from '@/infrastructure/supabase/client';

/**
 * Algorithme de répétition espacée SM-2 (SuperMemo 2)
 * Calcule la prochaine date de révision basée sur la performance
 */

interface ReviewResult {
  userId: string;
  moduleId: string;
  score: number; // 0-100
  previousMasteryLevel: number; // 0-4
}

interface ReviewSchedule {
  nextReviewDate: Date;
  newMasteryLevel: number;
  reviewCount: number;
}

/**
 * Calcule la prochaine date de révision selon l'algorithme SM-2
 * @param quality - Qualité de la réponse (0-5)
 * @param repetitions - Nombre de répétitions réussies
 * @param easeFactor - Facteur de facilité (min 1.3)
 * @param interval - Intervalle actuel en jours
 */
function calculateSM2(
  quality: number,
  repetitions: number,
  easeFactor: number,
  interval: number
): { newInterval: number; newEaseFactor: number; newRepetitions: number } {
  let newEaseFactor = easeFactor;
  let newRepetitions = repetitions;
  let newInterval = interval;
  
  // Mise à jour du facteur de facilité
  newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  
  // Minimum de 1.3
  if (newEaseFactor < 1.3) {
    newEaseFactor = 1.3;
  }
  
  // Calcul du nouvel intervalle
  if (quality < 3) {
    // Échec - recommencer
    newRepetitions = 0;
    newInterval = 1;
  } else {
    newRepetitions = repetitions + 1;
    
    if (newRepetitions === 1) {
      newInterval = 1;
    } else if (newRepetitions === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * newEaseFactor);
    }
  }
  
  return { newInterval, newEaseFactor, newRepetitions };
}

/**
 * Convertit un score (0-100) en qualité SM-2 (0-5)
 */
function scoreToQuality(score: number): number {
  if (score >= 90) return 5; // Parfait
  if (score >= 80) return 4; // Correct avec hésitation
  if (score >= 70) return 3; // Correct avec difficulté
  if (score >= 60) return 2; // Incorrect mais rappel partiel
  if (score >= 40) return 1; // Incorrect, vague souvenir
  return 0; // Blackout complet
}

/**
 * Convertit le mastery_level (0-4) en nombre de répétitions
 */
function masteryToRepetitions(masteryLevel: number): number {
  return masteryLevel;
}

/**
 * Calcule le nouveau mastery_level basé sur les répétitions
 */
function repetitionsToMastery(repetitions: number): number {
  return Math.min(4, repetitions);
}

/**
 * Planifie la prochaine révision pour un utilisateur
 */
export async function scheduleNextReview(result: ReviewResult): Promise<ReviewSchedule> {
  const supabase = createClient();
  
  // Récupérer les données actuelles de progression
  const { data: progress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', result.userId)
    .eq('module_id', result.moduleId)
    .single();
    
  if (!progress) {
    throw new Error('Progress not found');
  }
  
  const quality = scoreToQuality(result.score);
  const currentRepetitions = masteryToRepetitions(result.previousMasteryLevel);
  const currentEaseFactor = 2.5; // Valeur par défaut SM-2
  const currentInterval = progress.review_count > 0 
    ? Math.ceil((new Date().getTime() - new Date(progress.last_review_date || new Date()).getTime()) / (1000 * 60 * 60 * 24))
    : 1;
  
  // Calculer selon SM-2
  const { newInterval, newEaseFactor, newRepetitions } = calculateSM2(
    quality,
    currentRepetitions,
    currentEaseFactor,
    currentInterval
  );
  
  // Calculer la prochaine date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);
  
  const newMasteryLevel = repetitionsToMastery(newRepetitions);
  
  // Mettre à jour en base
  await supabase
    .from('user_progress')
    .update({
      mastery_level: newMasteryLevel,
      next_review_date: nextReviewDate.toISOString(),
      review_count: (progress.review_count || 0) + 1,
      last_review_date: new Date().toISOString()
    })
    .eq('user_id', result.userId)
    .eq('module_id', result.moduleId);
  
  return {
    nextReviewDate,
    newMasteryLevel,
    reviewCount: (progress.review_count || 0) + 1
  };
}

/**
 * Récupère les modules à réviser aujourd'hui pour un utilisateur
 */
export async function getModulesToReview(userId: string) {
  const supabase = createClient();
  
  const today = new Date().toISOString().split('T')[0];
  
  const { data: modules } = await supabase
    .from('user_progress')
    .select(`
      *,
      modules(id, title, category)
    `)
    .eq('user_id', userId)
    .lte('next_review_date', today)
    .order('next_review_date', { ascending: true });
    
  return modules || [];
}

/**
 * Priorise les révisions par urgence et importance
 */
export async function getPrioritizedReviews(userId: string) {
  const modules = await getModulesToReview(userId);
  
  // Calculer score de priorité
  const prioritized = modules.map(m => {
    const daysOverdue = Math.ceil(
      (new Date().getTime() - new Date(m.next_review_date).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    // Plus c'est en retard et bas niveau, plus c'est prioritaire
    const urgencyScore = daysOverdue * 10;
    const importanceScore = (4 - m.mastery_level) * 5;
    const priorityScore = urgencyScore + importanceScore;
    
    return {
      ...m,
      daysOverdue,
      priorityScore
    };
  });
  
  // Trier par priorité décroissante
  return prioritized.sort((a, b) => b.priorityScore - a.priorityScore);
}
