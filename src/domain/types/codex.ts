/**
 * Types pour le module Vyxo Codex
 * Système de gestion de connaissances et d'entraînement quotidien
 */

export type KnowledgeCategory = "ISO" | "ExOp" | "Pharma" | "Transport" | "ITSec" | "Sûreté";

export type KnowledgeModule = {
  id: string;            // ex: "iso-9001"
  code?: string;         // ex: "ISO 9001"
  title: string;         // ex: "ISO 9001 – Système de management de la qualité"
  category: KnowledgeCategory;
  shortDescription: string;
  sectors?: string[];    // ex: ["Industrie", "Transport", "Pharma"]
  level: "basic" | "intermediate" | "advanced";
  tags: string[];
};

export type KnowledgeItemType =
  | "concept"
  | "requirement"
  | "checklist"
  | "tool"
  | "risk";

export type KnowledgeItem = {
  id: string;
  moduleId: string;      // référence à KnowledgeModule.id
  type: KnowledgeItemType;
  topic: string;
  body: string;          // texte explicatif
  tags: string[];
};

export type QuizQuestion = {
  id: string;
  moduleId: string;
  question: string;
  difficulty: "easy" | "medium" | "hard";
  choices: string[];
  correctIndex: number;
  explanation: string;
  tags: string[];
};

/**
 * Type pour les résultats de quiz
 */
export type QuizResult = {
  questionId: string;
  userAnswer: number;
  isCorrect: boolean;
  timeSpent?: number; // en secondes
};

/**
 * Type pour une session de quiz
 */
export type QuizSession = {
  id: string;
  moduleId?: string; // undefined pour quiz global
  questions: QuizQuestion[];
  results: QuizResult[];
  startedAt: Date;
  completedAt?: Date;
  score?: number; // pourcentage
};

/**
 * Type pour les statistiques utilisateur
 */
export type UserStats = {
  totalQuizzes: number;
  averageScore: number;
  moduleStats: Record<string, {
    quizzesTaken: number;
    averageScore: number;
    lastAttempt?: Date;
  }>;
};

// ═══════════════════════════════════════════════════════════════════════
// AI SEARCH - Recherche intelligente dans le Codex
// ═══════════════════════════════════════════════════════════════════════

export type AISearchRequest = {
  query: string;
  moduleIds?: string[]; // Optionnel : limiter à certains modules
};

export type AISearchResult = {
  answerSummary: string;
  relatedItems: KnowledgeItem[];
  relatedModules: KnowledgeModule[];
  suggestedQuiz: QuizQuestion[];
  sources: string[]; // Liste des sources utilisées
};

// ═══════════════════════════════════════════════════════════════════════
// LEARNING PATHS - Parcours d'apprentissage avec XP et badges
// ═══════════════════════════════════════════════════════════════════════

export type LearningStep = {
  id: string;
  title: string;
  description: string;
  moduleId: string;
  itemIds: string[];      // Knowledge items à lire
  quizIds?: string[];     // Questions de quiz à compléter
  xpReward: number;       // XP gagnés à la fin de l'étape
};

export type LearningPath = {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "expert";
  estimatedDuration: string; // ex: "2 semaines", "1 mois"
  steps: LearningStep[];
  rewardBadge: Badge;
  totalXp: number;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;           // emoji ou icon name
  rarity: "common" | "rare" | "epic" | "legendary";
};

export type UserLearningProgress = {
  pathId: string;
  currentStepIndex: number;
  completedSteps: string[]; // IDs des steps complétés
  startedAt: Date;
  completedAt?: Date;
  xpEarned: number;
};

export type UserXP = {
  totalXp: number;
  level: number;
  badgesEarned: string[]; // IDs des badges
  currentPath?: string;   // ID du parcours en cours
};

// XP Constants
export const XP_REWARDS = {
  READ_ITEM: 2,
  QUIZ_COMPLETED: 10,
  STEP_COMPLETED: 20,
  PATH_COMPLETED: 50,
  PERFECT_QUIZ: 15, // Bonus pour 100%
} as const;

// ═══════════════════════════════════════════════════════════════════════
// AUDIT SIMULATOR - Simulateur d'audit ISO/GDP
// ═══════════════════════════════════════════════════════════════════════

export type AuditType = "iso-9001" | "iso-14001" | "iso-45001" | "gdp-transport" | "gmp-pharma";

export type AuditSimQuestion = {
  id: string;
  text: string;
  moduleId: string;
  auditType: AuditType;
  clause?: string;        // ex: "8.5.1" pour ISO
  severity: "minor" | "major" | "critical";
  expectedEvidence: string[]; // Preuves attendues
};

export type AuditResponse = {
  questionId: string;
  status: "conforme" | "non-conforme" | "non-applicable";
  comment?: string;
  evidence?: string;      // Description des preuves fournies
};

export type NonConformity = {
  questionId: string;
  severity: "minor" | "major" | "critical";
  description: string;
  recommendation: string; // Action CAPA recommandée
  clause?: string;
};

export type AuditResult = {
  auditType: AuditType;
  completedAt: Date;
  totalQuestions: number;
  conformeCount: number;
  nonConformeCount: number;
  naCount: number;
  totalScore: number;     // Score de conformité en %
  ncList: NonConformity[];
  summary: string;
  recommendations: string[];
};

export type AuditSession = {
  id: string;
  auditType: AuditType;
  questions: AuditSimQuestion[];
  responses: AuditResponse[];
  startedAt: Date;
  completedAt?: Date;
  result?: AuditResult;
};
