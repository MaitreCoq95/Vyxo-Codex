import { LearningPath, Badge, LearningStep } from "../types/codex";

// ═══════════════════════════════════════════════════════════════════════
// BADGES SYSTÈME
// ═══════════════════════════════════════════════════════════════════════

export const badges: Record<string, Badge> = {
  "iso-starter": {
    id: "iso-starter",
    name: "Initié ISO",
    description: "Premiers pas dans les normes ISO de management",
    icon: "🎓",
    rarity: "common",
  },
  "iso-master": {
    id: "iso-master",
    name: "Maître ISO",
    description: "Expertise complète des normes ISO 9001, 14001, 45001",
    icon: "🏆",
    rarity: "epic",
  },
  "gdp-expert": {
    id: "gdp-expert",
    name: "Expert GDP",
    description: "Maîtrise totale des Bonnes Pratiques de Distribution",
    icon: "🚚",
    rarity: "rare",
  },
  "lean-sensei": {
    id: "lean-sensei",
    name: "Sensei Lean",
    description: "Maître en excellence opérationnelle et Lean Six Sigma",
    icon: "⚡",
    rarity: "legendary",
  },
  "quality-champion": {
    id: "quality-champion",
    name: "Champion Qualité",
    description: "Leader de la qualité tous domaines confondus",
    icon: "💎",
    rarity: "legendary",
  },
  "haccp-guardian": {
    id: "haccp-guardian",
    name: "Gardien HACCP",
    description: "Expert en sécurité alimentaire et points critiques",
    icon: "🛡️",
    rarity: "rare",
  },
};

// ═══════════════════════════════════════════════════════════════════════
// PARCOURS D'APPRENTISSAGE
// ═══════════════════════════════════════════════════════════════════════

export const learningPaths: LearningPath[] = [
  // ────────────────────────────────────────────────────────────────────
  // 1. ISO EN 7 JOURS - Débutant
  // ────────────────────────────────────────────────────────────────────
  {
    id: "iso-7days",
    title: "ISO 9001/14001/45001 en 7 Jours",
    description:
      "Découvrez les fondamentaux des 3 principales normes ISO en une semaine. " +
      "Ce parcours vous donne une vision complète des systèmes de management qualité, " +
      "environnement et santé-sécurité au travail.",
    difficulty: "beginner",
    estimatedDuration: "7 jours (1h/jour)",
    totalXp: 140,
    rewardBadge: badges["iso-starter"],
    steps: [
      {
        id: "iso7d-step1",
        title: "Jour 1 : Introduction aux normes ISO",
        description: "Comprendre ce qu'est une norme ISO et son utilité",
        moduleId: "iso-9001",
        itemIds: ["iso9001-introduction", "iso9001-principes"],
        xpReward: 20,
      },
      {
        id: "iso7d-step2",
        title: "Jour 2 : ISO 9001 - Système qualité",
        description: "Les bases de la gestion de la qualité selon ISO 9001",
        moduleId: "iso-9001",
        itemIds: ["iso9001-contexte", "iso9001-leadership"],
        quizIds: ["q-iso9001-1", "q-iso9001-2"],
        xpReward: 20,
      },
      {
        id: "iso7d-step3",
        title: "Jour 3 : ISO 9001 - Opérations",
        description: "Planification et réalisation des opérations",
        moduleId: "iso-9001",
        itemIds: ["iso9001-processus", "iso9001-amelioration"],
        quizIds: ["q-iso9001-3"],
        xpReward: 20,
      },
      {
        id: "iso7d-step4",
        title: "Jour 4 : ISO 14001 - Management environnemental",
        description: "Introduction au système de management environnemental",
        moduleId: "iso-14001",
        itemIds: ["iso14001-introduction", "iso14001-aspects-environnementaux"],
        xpReward: 20,
      },
      {
        id: "iso7d-step5",
        title: "Jour 5 : ISO 14001 - Conformité légale",
        description: "Obligations de conformité et surveillance",
        moduleId: "iso-14001",
        itemIds: ["iso14001-conformite-legale", "iso14001-urgences"],
        quizIds: ["q-iso14001-1"],
        xpReward: 20,
      },
      {
        id: "iso7d-step6",
        title: "Jour 6 : ISO 45001 - Santé et sécurité",
        description: "Système de management de la santé-sécurité au travail",
        moduleId: "iso-45001",
        itemIds: ["iso45001-introduction", "iso45001-dangers"],
        quizIds: ["q-iso45001-1"],
        xpReward: 20,
      },
      {
        id: "iso7d-step7",
        title: "Jour 7 : Audit et amélioration continue",
        description: "Les audits internes et l'amélioration continue",
        moduleId: "iso-9001",
        itemIds: ["iso9001-audit", "iso9001-nc-ac"],
        quizIds: ["q-iso9001-4", "q-iso9001-5"],
        xpReward: 20,
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // 2. GDP - De débutant à expert
  // ────────────────────────────────────────────────────────────────────
  {
    id: "gdp-beginner-to-expert",
    title: "GDP Transport : De Débutant à Expert",
    description:
      "Maîtrisez les Bonnes Pratiques de Distribution pharmaceutique et devenez expert " +
      "en logistique sécurisée, gestion des températures, et conformité GDP.",
    difficulty: "intermediate",
    estimatedDuration: "3 semaines",
    totalXp: 200,
    rewardBadge: badges["gdp-expert"],
    steps: [
      {
        id: "gdp-step1",
        title: "Fondamentaux GDP",
        description: "Introduction aux GDP et au contexte réglementaire",
        moduleId: "gdp",
        itemIds: ["gdp-introduction", "gdp-textes-ref"],
        xpReward: 20,
      },
      {
        id: "gdp-step2",
        title: "Organisation et qualité",
        description: "Système qualité et gestion documentaire GDP",
        moduleId: "gdp",
        itemIds: ["gdp-qualite", "gdp-personnel"],
        quizIds: ["q-gdp-1"],
        xpReward: 25,
      },
      {
        id: "gdp-step3",
        title: "Locaux et équipements",
        description: "Qualification des infrastructures et équipements",
        moduleId: "gdp",
        itemIds: ["gdp-locaux", "gdp-vehicules"],
        quizIds: ["q-gdp-2", "q-gdp-3"],
        xpReward: 25,
      },
      {
        id: "gdp-step4",
        title: "Gestion de la chaîne du froid",
        description: "Maîtrise des températures et cartographies thermiques",
        moduleId: "gdp",
        itemIds: ["gdp-chaine-froid", "gdp-cartographies"],
        quizIds: ["q-gdp-4"],
        xpReward: 30,
      },
      {
        id: "gdp-step5",
        title: "Opérations de transport",
        description: "Gestion des opérations et traçabilité",
        moduleId: "gdp",
        itemIds: ["gdp-operations", "gdp-tracabilite"],
        quizIds: ["q-gdp-5"],
        xpReward: 30,
      },
      {
        id: "gdp-step6",
        title: "Gestion des excursions et déviations",
        description: "Actions correctives et gestion des non-conformités",
        moduleId: "gdp",
        itemIds: ["gdp-excursions", "gdp-reclamations"],
        quizIds: ["q-gdp-6"],
        xpReward: 30,
      },
      {
        id: "gdp-step7",
        title: "Audits et inspections GDP",
        description: "Préparation et gestion des audits GDP",
        moduleId: "gdp",
        itemIds: ["gdp-audits", "gdp-auto-inspections"],
        quizIds: ["q-gdp-7"],
        xpReward: 40,
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // 3. LEAN - 5S, Kaizen, DMAIC
  // ────────────────────────────────────────────────────────────────────
  {
    id: "lean-5s-kaizen-dmaic",
    title: "Excellence Opérationnelle : 5S, Kaizen & DMAIC",
    description:
      "Devenez un expert en Lean Management et Six Sigma. Maîtrisez les outils " +
      "d'amélioration continue, de résolution de problèmes et d'optimisation des processus.",
    difficulty: "expert",
    estimatedDuration: "4 semaines",
    totalXp: 280,
    rewardBadge: badges["lean-sensei"],
    steps: [
      {
        id: "lean-step1",
        title: "Introduction au Lean",
        description: "Philosophie Lean et principes fondamentaux",
        moduleId: "lean",
        itemIds: ["lean-introduction", "lean-philosophie"],
        xpReward: 20,
      },
      {
        id: "lean-step2",
        title: "Les 8 Gaspillages (Muda)",
        description: "Identifier et éliminer les gaspillages",
        moduleId: "lean",
        itemIds: ["lean-8-gaspillages", "lean-muda-mura-muri"],
        quizIds: ["q-lean-1"],
        xpReward: 30,
      },
      {
        id: "lean-step3",
        title: "Méthode 5S - Organisation et discipline",
        description: "Maîtriser la méthode 5S pour organiser l'espace de travail",
        moduleId: "lean",
        itemIds: ["lean-5s", "lean-5s-checklist"],
        quizIds: ["q-lean-2", "q-lean-3"],
        xpReward: 40,
      },
      {
        id: "lean-step4",
        title: "Kaizen - Amélioration continue",
        description: "Culture Kaizen et événements d'amélioration",
        moduleId: "lean",
        itemIds: ["lean-kaizen", "lean-pdca"],
        quizIds: ["q-lean-4"],
        xpReward: 40,
      },
      {
        id: "lean-step5",
        title: "VSM - Value Stream Mapping",
        description: "Cartographier et optimiser la chaîne de valeur",
        moduleId: "lean",
        itemIds: ["lean-vsm", "lean-takt-time"],
        quizIds: ["q-lean-5"],
        xpReward: 40,
      },
      {
        id: "lean-step6",
        title: "Six Sigma - DMAIC (1/2)",
        description: "Méthodologie DMAIC : Define, Measure, Analyze",
        moduleId: "six-sigma",
        itemIds: ["sixsigma-dmaic", "sixsigma-define", "sixsigma-measure"],
        quizIds: ["q-sixsigma-1"],
        xpReward: 50,
      },
      {
        id: "lean-step7",
        title: "Six Sigma - DMAIC (2/2)",
        description: "Méthodologie DMAIC : Improve, Control",
        moduleId: "six-sigma",
        itemIds: ["sixsigma-analyze", "sixsigma-improve", "sixsigma-control"],
        quizIds: ["q-sixsigma-2", "q-sixsigma-3"],
        xpReward: 60,
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // 4. HACCP - Sécurité alimentaire
  // ────────────────────────────────────────────────────────────────────
  {
    id: "haccp-fundamentals",
    title: "HACCP : Maîtrise de la Sécurité Alimentaire",
    description:
      "Devenez expert en sécurité sanitaire des aliments. Maîtrisez les 7 principes " +
      "HACCP, l'identification des CCP et la gestion des dangers alimentaires.",
    difficulty: "intermediate",
    estimatedDuration: "2 semaines",
    totalXp: 170,
    rewardBadge: badges["haccp-guardian"],
    steps: [
      {
        id: "haccp-step1",
        title: "Introduction à l'HACCP",
        description: "Historique et principes de base",
        moduleId: "haccp",
        itemIds: ["haccp-7-principes"],
        xpReward: 20,
      },
      {
        id: "haccp-step2",
        title: "Analyse des dangers",
        description: "Identification et évaluation des dangers",
        moduleId: "haccp",
        itemIds: ["haccp-7-principes"],
        quizIds: ["q-haccp-1"],
        xpReward: 30,
      },
      {
        id: "haccp-step3",
        title: "Points Critiques de Contrôle (CCP)",
        description: "Détermination et gestion des CCP",
        moduleId: "haccp",
        itemIds: ["haccp-ccp", "haccp-arbre-decision"],
        quizIds: ["q-haccp-2"],
        xpReward: 30,
      },
      {
        id: "haccp-step4",
        title: "Limites critiques et surveillance",
        description: "Établir les limites et systèmes de surveillance",
        moduleId: "haccp",
        itemIds: ["haccp-limites-critiques", "haccp-surveillance"],
        quizIds: ["q-haccp-3", "q-haccp-4"],
        xpReward: 30,
      },
      {
        id: "haccp-step5",
        title: "Actions correctives et vérification",
        description: "Gérer les écarts et vérifier l'efficacité",
        moduleId: "haccp",
        itemIds: ["haccp-actions-correctives", "haccp-verification"],
        quizIds: ["q-haccp-5"],
        xpReward: 30,
      },
      {
        id: "haccp-step6",
        title: "Programmes Pré-Requis (PRP)",
        description: "Fondations du système HACCP",
        moduleId: "haccp",
        itemIds: ["haccp-prp"],
        quizIds: ["q-haccp-6"],
        xpReward: 30,
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════
// FONCTIONS UTILITAIRES
// ═══════════════════════════════════════════════════════════════════════

export function getAllLearningPaths(): LearningPath[] {
  return learningPaths;
}

export function getLearningPathById(id: string): LearningPath | undefined {
  return learningPaths.find((path) => path.id === id);
}

export function getLearningPathsByDifficulty(
  difficulty: "beginner" | "intermediate" | "expert"
): LearningPath[] {
  return learningPaths.filter((path) => path.difficulty === difficulty);
}

export function calculatePathProgress(
  completedStepIds: string[],
  path: LearningPath
): number {
  if (path.steps.length === 0) return 0;
  const completedCount = path.steps.filter((step) =>
    completedStepIds.includes(step.id)
  ).length;
  return Math.round((completedCount / path.steps.length) * 100);
}

export function getNextStep(
  path: LearningPath,
  completedStepIds: string[]
): LearningStep | undefined {
  return path.steps.find((step) => !completedStepIds.includes(step.id));
}
