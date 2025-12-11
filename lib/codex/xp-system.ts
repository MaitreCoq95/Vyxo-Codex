import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { UserXP, UserLearningProgress, XP_REWARDS } from "@/types/codex";

/**
 * Système XP pour le Vyxo Codex
 * Gestion de la gamification : XP, niveaux, badges, progression
 */

// ═══════════════════════════════════════════════════════════════════════
// GESTION DE L'XP UTILISATEUR
// ═══════════════════════════════════════════════════════════════════════

/**
 * Récupère l'XP actuel de l'utilisateur
 */
export async function getUserXP(): Promise<UserXP | null> {
  try {
    const supabase = createClientComponentClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } = await supabase
      .from("codex_user_xp")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error) {
      // Si l'utilisateur n'existe pas encore, l'initialiser
      if (error.code === "PGRST116") {
        return await initializeUserXP();
      }
      console.error("Error fetching user XP:", error);
      return null;
    }

    return {
      totalXp: data.total_xp,
      level: data.level,
      badgesEarned: data.badges_earned || [],
      currentPath: data.current_path_id,
    };
  } catch (error) {
    console.error("Error in getUserXP:", error);
    return null;
  }
}

/**
 * Initialise l'XP pour un nouvel utilisateur
 */
export async function initializeUserXP(): Promise<UserXP> {
  const supabase = createClientComponentClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const newUserXP = {
    user_id: user.id,
    total_xp: 0,
    level: 1,
    badges_earned: [],
    current_path_id: null,
  };

  const { error } = await supabase
    .from("codex_user_xp")
    .insert(newUserXP);

  if (error) {
    console.error("Error initializing user XP:", error);
    throw error;
  }

  return {
    totalXp: 0,
    level: 1,
    badgesEarned: [],
  };
}

/**
 * Ajoute de l'XP à l'utilisateur
 */
export async function addXP(
  amount: number,
  xpType: keyof typeof XP_REWARDS,
  entityId?: string,
  entityType?: string
): Promise<{ success: boolean; newXp?: UserXP; levelUp?: boolean }> {
  try {
    const supabase = createClientComponentClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false };
    }

    // Récupérer l'XP actuel
    const currentXP = await getUserXP();
    if (!currentXP) {
      return { success: false };
    }

    const newTotalXp = currentXP.totalXp + amount;
    const newLevel = calculateLevel(newTotalXp);
    const levelUp = newLevel > currentXP.level;

    // Mettre à jour l'XP
    const { error: updateError } = await supabase
      .from("codex_user_xp")
      .update({
        total_xp: newTotalXp,
        level: newLevel,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (updateError) {
      console.error("Error updating XP:", updateError);
      return { success: false };
    }

    // Enregistrer dans l'historique
    await supabase.from("codex_xp_history").insert({
      user_id: user.id,
      xp_amount: amount,
      xp_type: xpType,
      entity_id: entityId,
      entity_type: entityType,
    });

    return {
      success: true,
      newXp: {
        totalXp: newTotalXp,
        level: newLevel,
        badgesEarned: currentXP.badgesEarned,
        currentPath: currentXP.currentPath,
      },
      levelUp,
    };
  } catch (error) {
    console.error("Error in addXP:", error);
    return { success: false };
  }
}

/**
 * Calcule le niveau basé sur l'XP total
 * Formule : Level = floor(sqrt(total_xp / 50))
 */
export function calculateLevel(totalXp: number): number {
  return Math.max(1, Math.floor(Math.sqrt(totalXp / 50)));
}

/**
 * Calcule l'XP nécessaire pour le prochain niveau
 */
export function xpNeededForNextLevel(currentLevel: number): number {
  const nextLevel = currentLevel + 1;
  return nextLevel * nextLevel * 50;
}

/**
 * Calcule la progression vers le prochain niveau (0-100%)
 */
export function calculateLevelProgress(totalXp: number): number {
  const currentLevel = calculateLevel(totalXp);
  const currentLevelXp = currentLevel * currentLevel * 50;
  const nextLevelXp = xpNeededForNextLevel(currentLevel);
  const xpInCurrentLevel = totalXp - currentLevelXp;
  const xpNeededInLevel = nextLevelXp - currentLevelXp;

  return Math.round((xpInCurrentLevel / xpNeededInLevel) * 100);
}

/**
 * Ajoute un badge à l'utilisateur
 */
export async function awardBadge(badgeId: string): Promise<boolean> {
  try {
    const supabase = createClientComponentClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return false;

    const currentXP = await getUserXP();
    if (!currentXP) return false;

    // Vérifier si le badge n'est pas déjà obtenu
    if (currentXP.badgesEarned.includes(badgeId)) {
      return true; // Déjà obtenu
    }

    const newBadges = [...currentXP.badgesEarned, badgeId];

    const { error } = await supabase
      .from("codex_user_xp")
      .update({
        badges_earned: newBadges,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    return !error;
  } catch (error) {
    console.error("Error awarding badge:", error);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════════
// GESTION DES PARCOURS D'APPRENTISSAGE
// ═══════════════════════════════════════════════════════════════════════

/**
 * Récupère la progression de l'utilisateur pour tous les parcours
 */
export async function getAllUserProgress(): Promise<UserLearningProgress[]> {
  try {
    const supabase = createClientComponentClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
      .from("codex_learning_progress")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching user progress:", error);
      return [];
    }

    return (data || []).map((row) => ({
      pathId: row.path_id,
      currentStepIndex: row.current_step_index,
      completedSteps: row.completed_steps || [],
      startedAt: new Date(row.started_at),
      completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
      xpEarned: row.xp_earned,
    }));
  } catch (error) {
    console.error("Error in getAllUserProgress:", error);
    return [];
  }
}

/**
 * Récupère la progression pour un parcours spécifique
 */
export async function getPathProgress(
  pathId: string
): Promise<UserLearningProgress | null> {
  try {
    const supabase = createClientComponentClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } = await supabase
      .from("codex_learning_progress")
      .select("*")
      .eq("user_id", user.id)
      .eq("path_id", pathId)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null; // Pas encore commencé
      console.error("Error fetching path progress:", error);
      return null;
    }

    return {
      pathId: data.path_id,
      currentStepIndex: data.current_step_index,
      completedSteps: data.completed_steps || [],
      startedAt: new Date(data.started_at),
      completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
      xpEarned: data.xp_earned,
    };
  } catch (error) {
    console.error("Error in getPathProgress:", error);
    return null;
  }
}

/**
 * Démarre un nouveau parcours
 */
export async function startLearningPath(pathId: string): Promise<boolean> {
  try {
    const supabase = createClientComponentClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return false;

    // Mettre à jour le parcours actuel dans codex_user_xp
    await supabase
      .from("codex_user_xp")
      .update({ current_path_id: pathId })
      .eq("user_id", user.id);

    // Créer l'entrée de progression
    const { error } = await supabase.from("codex_learning_progress").insert({
      user_id: user.id,
      path_id: pathId,
      current_step_index: 0,
      completed_steps: [],
      xp_earned: 0,
    });

    return !error;
  } catch (error) {
    console.error("Error starting learning path:", error);
    return false;
  }
}

/**
 * Marque une étape comme complétée
 */
export async function completeStep(
  pathId: string,
  stepId: string,
  xpReward: number
): Promise<boolean> {
  try {
    const supabase = createClientComponentClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return false;

    const progress = await getPathProgress(pathId);
    if (!progress) return false;

    // Vérifier si déjà complété
    if (progress.completedSteps.includes(stepId)) {
      return true;
    }

    const newCompletedSteps = [...progress.completedSteps, stepId];
    const newXpEarned = progress.xpEarned + xpReward;

    // Mettre à jour la progression
    const { error } = await supabase
      .from("codex_learning_progress")
      .update({
        completed_steps: newCompletedSteps,
        current_step_index: progress.currentStepIndex + 1,
        xp_earned: newXpEarned,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .eq("path_id", pathId);

    if (error) {
      console.error("Error completing step:", error);
      return false;
    }

    // Ajouter l'XP à l'utilisateur
    await addXP(xpReward, "STEP_COMPLETED", stepId, "step");

    return true;
  } catch (error) {
    console.error("Error in completeStep:", error);
    return false;
  }
}

/**
 * Marque un parcours comme terminé et attribue le badge
 */
export async function completeLearningPath(
  pathId: string,
  badgeId: string
): Promise<boolean> {
  try {
    const supabase = createClientComponentClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return false;

    // Marquer comme terminé
    const { error } = await supabase
      .from("codex_learning_progress")
      .update({
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .eq("path_id", pathId);

    if (error) {
      console.error("Error completing path:", error);
      return false;
    }

    // Ajouter XP bonus
    await addXP(XP_REWARDS.PATH_COMPLETED, "PATH_COMPLETED", pathId, "path");

    // Attribuer le badge
    await awardBadge(badgeId);

    // Retirer le parcours actuel
    await supabase
      .from("codex_user_xp")
      .update({ current_path_id: null })
      .eq("user_id", user.id);

    return true;
  } catch (error) {
    console.error("Error in completeLearningPath:", error);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════════
// ACTIONS XP SPÉCIFIQUES
// ═══════════════════════════════════════════════════════════════════════

/**
 * Enregistre la lecture d'un item de connaissance
 */
export async function recordItemRead(itemId: string): Promise<void> {
  await addXP(XP_REWARDS.READ_ITEM, "READ_ITEM", itemId, "item");
}

/**
 * Enregistre la complétion d'un quiz
 */
export async function recordQuizCompleted(
  quizId: string,
  score: number
): Promise<void> {
  const isPerfect = score >= 100;
  const xpAmount = isPerfect
    ? XP_REWARDS.PERFECT_QUIZ
    : XP_REWARDS.QUIZ_COMPLETED;

  await addXP(
    xpAmount,
    isPerfect ? "PERFECT_QUIZ" : "QUIZ_COMPLETED",
    quizId,
    "quiz"
  );
}
