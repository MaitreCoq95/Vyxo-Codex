import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

/**
 * Système de scoring pour le Vyxo Codex
 * Calcule les performances par module et globalement
 */

// ═══════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════

export type QuizResultSubmission = {
  moduleId: string;
  questionId: string;
  isCorrect: boolean;
  timeSpent?: number;
};

export type ModuleScore = {
  moduleId: string;
  totalQuestionsAnswered: number;
  correctAnswers: number;
  scorePercentage: number;
  firstAttempt: Date;
  lastAttempt: Date;
};

export type GlobalScore = {
  totalQuestionsAnswered: number;
  correctAnswers: number;
  scorePercentage: number;
  modulesAttempted: number;
  firstQuiz: Date;
  lastQuiz: Date;
};

export type ScoreTrend = {
  period: string;
  scorePercentage: number;
  questionsCount: number;
};

// ═══════════════════════════════════════════════════════════════════════
// ENREGISTREMENT DES RÉSULTATS
// ═══════════════════════════════════════════════════════════════════════

/**
 * Enregistre les résultats d'un quiz complet
 */
export async function saveQuizResults(
  results: QuizResultSubmission[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClientComponentClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Utilisateur non authentifié" };
    }

    // Préparer les données pour l'insertion
    const dbResults = results.map((result) => ({
      user_id: user.id,
      module_id: result.moduleId,
      question_id: result.questionId,
      is_correct: result.isCorrect,
      time_spent: result.timeSpent,
    }));

    // Insérer dans Supabase
    const { error } = await supabase
      .from("codex_quiz_results")
      .insert(dbResults);

    if (error) {
      console.error("Erreur lors de la sauvegarde des résultats:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Erreur dans saveQuizResults:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Enregistre un seul résultat de question
 */
export async function saveQuestionResult(
  result: QuizResultSubmission
): Promise<boolean> {
  const response = await saveQuizResults([result]);
  return response.success;
}

// ═══════════════════════════════════════════════════════════════════════
// RÉCUPÉRATION DES SCORES
// ═══════════════════════════════════════════════════════════════════════

/**
 * Récupère le score global de l'utilisateur
 */
export async function getGlobalScore(): Promise<GlobalScore | null> {
  try {
    const supabase = createClientComponentClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } = await supabase
      .from("codex_user_global_score")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null; // Pas encore de résultats
      console.error("Erreur lors de la récupération du score global:", error);
      return null;
    }

    return {
      totalQuestionsAnswered: data.total_questions_answered,
      correctAnswers: data.correct_answers,
      scorePercentage: parseFloat(data.score_percentage),
      modulesAttempted: data.modules_attempted,
      firstQuiz: new Date(data.first_quiz),
      lastQuiz: new Date(data.last_quiz),
    };
  } catch (error) {
    console.error("Erreur dans getGlobalScore:", error);
    return null;
  }
}

/**
 * Récupère tous les scores par module de l'utilisateur
 */
export async function getAllModuleScores(): Promise<ModuleScore[]> {
  try {
    const supabase = createClientComponentClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
      .from("codex_user_module_scores")
      .select("*")
      .eq("user_id", user.id)
      .order("score_percentage", { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des scores par module:", error);
      return [];
    }

    return (data || []).map((row) => ({
      moduleId: row.module_id,
      totalQuestionsAnswered: row.total_questions_answered,
      correctAnswers: row.correct_answers,
      scorePercentage: parseFloat(row.score_percentage),
      firstAttempt: new Date(row.first_attempt),
      lastAttempt: new Date(row.last_attempt),
    }));
  } catch (error) {
    console.error("Erreur dans getAllModuleScores:", error);
    return [];
  }
}

/**
 * Récupère le score pour un module spécifique
 */
export async function getModuleScore(moduleId: string): Promise<ModuleScore | null> {
  try {
    const supabase = createClientComponentClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } = await supabase
      .from("codex_user_module_scores")
      .select("*")
      .eq("user_id", user.id)
      .eq("module_id", moduleId)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null; // Pas encore de résultats pour ce module
      console.error("Erreur lors de la récupération du score du module:", error);
      return null;
    }

    return {
      moduleId: data.module_id,
      totalQuestionsAnswered: data.total_questions_answered,
      correctAnswers: data.correct_answers,
      scorePercentage: parseFloat(data.score_percentage),
      firstAttempt: new Date(data.first_attempt),
      lastAttempt: new Date(data.last_attempt),
    };
  } catch (error) {
    console.error("Erreur dans getModuleScore:", error);
    return null;
  }
}

/**
 * Récupère les top 5 modules de l'utilisateur
 */
export async function getTopModules(limit: number = 5): Promise<ModuleScore[]> {
  const allScores = await getAllModuleScores();
  return allScores.slice(0, limit);
}

/**
 * Récupère les modules à améliorer (score le plus bas)
 */
export async function getWeakModules(limit: number = 5): Promise<ModuleScore[]> {
  const allScores = await getAllModuleScores();
  // Filtrer les modules avec au moins 5 questions pour être significatif
  return allScores
    .filter((score) => score.totalQuestionsAnswered >= 5)
    .sort((a, b) => a.scorePercentage - b.scorePercentage)
    .slice(0, limit);
}

/**
 * Récupère la tendance de progression dans le temps
 */
export async function getProgressTrend(
  moduleId?: string
): Promise<ScoreTrend[]> {
  try {
    const supabase = createClientComponentClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase.rpc("get_user_progress_trend", {
      p_user_id: user.id,
      p_module_id: moduleId || null,
    });

    if (error) {
      console.error("Erreur lors de la récupération de la tendance:", error);
      return [];
    }

    return (data || []).map((row: any) => ({
      period: row.period,
      scorePercentage: parseFloat(row.score_percentage),
      questionsCount: row.questions_count,
    }));
  } catch (error) {
    console.error("Erreur dans getProgressTrend:", error);
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════════════
// UTILITAIRES
// ═══════════════════════════════════════════════════════════════════════

/**
 * Obtient la couleur associée à un score
 */
export function getScoreColor(scorePercentage: number): {
  bg: string;
  text: string;
  border: string;
} {
  if (scorePercentage >= 90) {
    return {
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-700 dark:text-green-300",
      border: "border-green-500 dark:border-green-700",
    };
  } else if (scorePercentage >= 75) {
    return {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-700 dark:text-blue-300",
      border: "border-blue-500 dark:border-blue-700",
    };
  } else if (scorePercentage >= 60) {
    return {
      bg: "bg-amber-100 dark:bg-amber-900/30",
      text: "text-amber-700 dark:text-amber-300",
      border: "border-amber-500 dark:border-amber-700",
    };
  } else {
    return {
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-700 dark:text-red-300",
      border: "border-red-500 dark:border-red-700",
    };
  }
}

/**
 * Obtient une évaluation textuelle du score
 */
export function getScoreLabel(scorePercentage: number): string {
  if (scorePercentage >= 90) return "Excellence";
  if (scorePercentage >= 75) return "Très bien";
  if (scorePercentage >= 60) return "Bien";
  if (scorePercentage >= 50) return "Passable";
  return "À améliorer";
}

/**
 * Obtient une icône associée au score
 */
export function getScoreIcon(scorePercentage: number): string {
  if (scorePercentage >= 90) return "🏆";
  if (scorePercentage >= 75) return "⭐";
  if (scorePercentage >= 60) return "✅";
  if (scorePercentage >= 50) return "📊";
  return "📈";
}
