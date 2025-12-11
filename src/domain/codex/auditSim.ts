import { AuditSimQuestion, AuditType, NonConformity, AuditResult, AuditResponse } from "../types/codex";

// ═══════════════════════════════════════════════════════════════════════
// AUDIT SIMULATOR - Questions d'audit par type
// ═══════════════════════════════════════════════════════════════════════

// ────────────────────────────────────────────────────────────────────
// ISO 9001 - Audit Qualité
// ────────────────────────────────────────────────────────────────────
export const iso9001AuditQuestions: AuditSimQuestion[] = [
  {
    id: "iso9001-q1",
    text: "L'organisme a-t-il identifié son contexte (enjeux internes/externes, parties intéressées) ?",
    moduleId: "iso-9001",
    auditType: "iso-9001",
    clause: "4.1 / 4.2",
    severity: "major",
    expectedEvidence: [
      "Analyse SWOT ou similaire",
      "Cartographie des parties intéressées",
      "Revue de direction incluant le contexte"
    ]
  },
  {
    id: "iso9001-q2",
    text: "Le système qualité est-il documenté (politique, objectifs, processus, procédures) ?",
    moduleId: "iso-9001",
    auditType: "iso-9001",
    clause: "4.4 / 7.5",
    severity: "major",
    expectedEvidence: [
      "Manuel qualité ou équivalent",
      "Politique qualité signée",
      "Cartographie des processus",
      "Procédures documentées"
    ]
  },
  {
    id: "iso9001-q3",
    text: "Les exigences client sont-elles revues avant acceptation de commande ?",
    moduleId: "iso-9001",
    auditType: "iso-9001",
    clause: "8.2.3",
    severity: "major",
    expectedEvidence: [
      "Procédure de revue de contrat",
      "Formulaires de revue de commande",
      "Enregistrements de revue"
    ]
  },
  {
    id: "iso9001-q4",
    text: "Les équipements de mesure sont-ils étalonnés et vérifiés régulièrement ?",
    moduleId: "iso-9001",
    auditType: "iso-9001",
    clause: "7.1.5",
    severity: "major",
    expectedEvidence: [
      "Plan d'étalonnage",
      "Certificats d'étalonnage valides",
      "Étiquetage sur les équipements",
      "Traçabilité métrologique"
    ]
  },
  {
    id: "iso9001-q5",
    text: "Un système de gestion des non-conformités et actions correctives est-il en place ?",
    moduleId: "iso-9001",
    auditType: "iso-9001",
    clause: "10.2",
    severity: "critical",
    expectedEvidence: [
      "Procédure NC/AC",
      "Registre des NC",
      "Fiches d'actions correctives avec analyse des causes",
      "Preuve d'efficacité des actions"
    ]
  },
  {
    id: "iso9001-q6",
    text: "Des audits internes sont-ils réalisés selon un programme planifié ?",
    moduleId: "iso-9001",
    auditType: "iso-9001",
    clause: "9.2",
    severity: "major",
    expectedEvidence: [
      "Programme d'audits annuel",
      "Rapports d'audit datés et signés",
      "Preuves de suivi des écarts",
      "Auditeurs qualifiés"
    ]
  },
  {
    id: "iso9001-q7",
    text: "Une revue de direction est-elle menée au moins annuellement ?",
    moduleId: "iso-9001",
    auditType: "iso-9001",
    clause: "9.3",
    severity: "major",
    expectedEvidence: [
      "Compte-rendu de revue de direction",
      "Analyse des indicateurs",
      "Décisions et actions issues de la revue"
    ]
  },
  {
    id: "iso9001-q8",
    text: "Le personnel est-il qualifié, formé et sensibilisé à la qualité ?",
    moduleId: "iso-9001",
    auditType: "iso-9001",
    clause: "7.2 / 7.3",
    severity: "major",
    expectedEvidence: [
      "Matrices de compétences",
      "Fiches de poste",
      "Plan de formation",
      "Enregistrements de formations"
    ]
  },
  {
    id: "iso9001-q9",
    text: "Les fournisseurs critiques sont-ils évalués et surveillés ?",
    moduleId: "iso-9001",
    auditType: "iso-9001",
    clause: "8.4",
    severity: "minor",
    expectedEvidence: [
      "Liste des fournisseurs critiques",
      "Grille d'évaluation",
      "Audits fournisseurs",
      "Revue des performances"
    ]
  },
  {
    id: "iso9001-q10",
    text: "Des indicateurs de performance sont-ils suivis et analysés ?",
    moduleId: "iso-9001",
    auditType: "iso-9001",
    clause: "9.1",
    severity: "minor",
    expectedEvidence: [
      "Tableau de bord qualité",
      "Objectifs chiffrés",
      "Analyse des tendances",
      "Actions d'amélioration"
    ]
  }
];

// ────────────────────────────────────────────────────────────────────
// ISO 14001 - Audit Environnemental
// ────────────────────────────────────────────────────────────────────
export const iso14001AuditQuestions: AuditSimQuestion[] = [
  {
    id: "iso14001-q1",
    text: "Les aspects environnementaux ont-ils été identifiés et évalués ?",
    moduleId: "iso-14001",
    auditType: "iso-14001",
    clause: "6.1.2",
    severity: "critical",
    expectedEvidence: [
      "Registre des aspects environnementaux",
      "Cotation des impacts",
      "Mise à jour régulière"
    ]
  },
  {
    id: "iso14001-q2",
    text: "Les obligations de conformité légales environnementales sont-elles identifiées ?",
    moduleId: "iso-14001",
    auditType: "iso-14001",
    clause: "6.1.3",
    severity: "critical",
    expectedEvidence: [
      "Veille réglementaire",
      "Registre des exigences légales",
      "Preuves de conformité"
    ]
  },
  {
    id: "iso14001-q3",
    text: "Un plan de gestion des situations d'urgence environnementales existe-t-il ?",
    moduleId: "iso-14001",
    auditType: "iso-14001",
    clause: "8.2",
    severity: "major",
    expectedEvidence: [
      "Procédure d'urgence",
      "Plans d'évacuation",
      "Kits anti-pollution",
      "Tests/exercices documentés"
    ]
  },
  {
    id: "iso14001-q4",
    text: "Les déchets sont-ils triés, stockés et éliminés conformément à la réglementation ?",
    moduleId: "iso-14001",
    auditType: "iso-14001",
    clause: "8.1",
    severity: "major",
    expectedEvidence: [
      "Bons d'élimination (BSD)",
      "Contrats avec prestataires autorisés",
      "Zones de tri identifiées"
    ]
  },
  {
    id: "iso14001-q5",
    text: "Des objectifs environnementaux sont-ils définis et suivis ?",
    moduleId: "iso-14001",
    auditType: "iso-14001",
    clause: "6.2",
    severity: "minor",
    expectedEvidence: [
      "Programme environnemental",
      "Objectifs chiffrés",
      "Suivi des indicateurs"
    ]
  }
];

// ────────────────────────────────────────────────────────────────────
// ISO 45001 - Audit Santé-Sécurité
// ────────────────────────────────────────────────────────────────────
export const iso45001AuditQuestions: AuditSimQuestion[] = [
  {
    id: "iso45001-q1",
    text: "Les dangers et risques SST ont-ils été identifiés et évalués (DUERP) ?",
    moduleId: "iso-45001",
    auditType: "iso-45001",
    clause: "6.1.2",
    severity: "critical",
    expectedEvidence: [
      "Document Unique (DUERP)",
      "Évaluation des risques par poste",
      "Mise à jour annuelle"
    ]
  },
  {
    id: "iso45001-q2",
    text: "Les EPI nécessaires sont-ils fournis et utilisés ?",
    moduleId: "iso-45001",
    auditType: "iso-45001",
    clause: "8.1.4",
    severity: "major",
    expectedEvidence: [
      "Liste des EPI par poste",
      "Bons de remise",
      "Formation au port des EPI",
      "Contrôle du port effectif"
    ]
  },
  {
    id: "iso45001-q3",
    text: "Les accidents du travail sont-ils enregistrés et analysés ?",
    moduleId: "iso-45001",
    auditType: "iso-45001",
    clause: "10.2",
    severity: "major",
    expectedEvidence: [
      "Registre des accidents",
      "Déclarations AT",
      "Analyses des causes",
      "Actions correctives"
    ]
  },
  {
    id: "iso45001-q4",
    text: "Les travailleurs sont-ils consultés sur les questions SST ?",
    moduleId: "iso-45001",
    auditType: "iso-45001",
    clause: "5.4",
    severity: "minor",
    expectedEvidence: [
      "PV de réunions CSSCT",
      "Procédure de remontée d'alertes",
      "Consultations documentées"
    ]
  },
  {
    id: "iso45001-q5",
    text: "Un plan de prévention est-il établi pour les entreprises extérieures ?",
    moduleId: "iso-45001",
    auditType: "iso-45001",
    clause: "8.1.4",
    severity: "major",
    expectedEvidence: [
      "Plans de prévention signés",
      "Inspections communes",
      "Permis de feu/travail en hauteur"
    ]
  }
];

// ────────────────────────────────────────────────────────────────────
// GDP Transport - Audit Bonnes Pratiques de Distribution
// ────────────────────────────────────────────────────────────────────
export const gdpAuditQuestions: AuditSimQuestion[] = [
  {
    id: "gdp-q1",
    text: "L'établissement dispose-t-il d'une autorisation d'exploitation GDP valide ?",
    moduleId: "gdp",
    auditType: "gdp-transport",
    severity: "critical",
    expectedEvidence: [
      "Autorisation ANSM/ARS",
      "Licence de distribution",
      "Personne qualifiée identifiée"
    ]
  },
  {
    id: "gdp-q2",
    text: "Les véhicules de transport sont-ils qualifiés thermiquement (PV de cartographie) ?",
    moduleId: "gdp",
    auditType: "gdp-transport",
    severity: "critical",
    expectedEvidence: [
      "PV de cartographies thermiques (été/hiver)",
      "Validation des emballages",
      "Relevés de température",
      "Protocole de qualification"
    ]
  },
  {
    id: "gdp-q3",
    text: "Les enregistreurs de température (data loggers) sont-ils étalonnés annuellement ?",
    moduleId: "gdp",
    auditType: "gdp-transport",
    severity: "major",
    expectedEvidence: [
      "Certificats d'étalonnage valides",
      "Programme d'étalonnage",
      "Traçabilité COFRAC/ISO 17025"
    ]
  },
  {
    id: "gdp-q4",
    text: "Une procédure de gestion des excursions de température est-elle en place et appliquée ?",
    moduleId: "gdp",
    auditType: "gdp-transport",
    severity: "critical",
    expectedEvidence: [
      "Procédure excursions",
      "Registre des excursions",
      "Analyse d'impact",
      "Actions correctives/CAPA"
    ]
  },
  {
    id: "gdp-q5",
    text: "Les chauffeurs sont-ils formés aux GDP et à la gestion de la chaîne du froid ?",
    moduleId: "gdp",
    auditType: "gdp-transport",
    severity: "major",
    expectedEvidence: [
      "Plan de formation GDP",
      "Attestations de formation",
      "Instructions de travail",
      "Évaluations des compétences"
    ]
  },
  {
    id: "gdp-q6",
    text: "La traçabilité des expéditions est-elle assurée (BL, destinataire, température) ?",
    moduleId: "gdp",
    auditType: "gdp-transport",
    severity: "major",
    expectedEvidence: [
      "Bons de livraison conformes",
      "Données de température jointes",
      "Signature du destinataire",
      "Conservation 5 ans minimum"
    ]
  },
  {
    id: "gdp-q7",
    text: "Les locaux de stockage sont-ils sécurisés et surveillés en température 24/7 ?",
    moduleId: "gdp",
    auditType: "gdp-transport",
    severity: "major",
    expectedEvidence: [
      "Système d'alarme température",
      "Contrôle d'accès",
      "Enregistrements continus",
      "Astreinte pour alertes"
    ]
  },
  {
    id: "gdp-q8",
    text: "Un système de gestion des réclamations clients est-il en place ?",
    moduleId: "gdp",
    auditType: "gdp-transport",
    severity: "minor",
    expectedEvidence: [
      "Procédure réclamations",
      "Registre des réclamations",
      "Délais de traitement",
      "Actions correctives"
    ]
  },
  {
    id: "gdp-q9",
    text: "Des audits internes GDP sont-ils réalisés au moins annuellement ?",
    moduleId: "gdp",
    auditType: "gdp-transport",
    severity: "major",
    expectedEvidence: [
      "Programme d'audits",
      "Rapports d'audit",
      "Plan d'actions",
      "Auditeurs formés GDP"
    ]
  },
  {
    id: "gdp-q10",
    text: "Les sous-traitants de transport sont-ils qualifiés et audités ?",
    moduleId: "gdp",
    auditType: "gdp-transport",
    severity: "major",
    expectedEvidence: [
      "Contrats qualité",
      "Audits des sous-traitants",
      "Évaluation des performances",
      "Autorisation GDP des sous-traitants"
    ]
  }
];

// ────────────────────────────────────────────────────────────────────
// GMP Pharma - Audit Bonnes Pratiques de Fabrication
// ────────────────────────────────────────────────────────────────────
export const gmpAuditQuestions: AuditSimQuestion[] = [
  {
    id: "gmp-q1",
    text: "Les locaux de production respectent-ils les principes de marche en avant et zonage ?",
    moduleId: "gmp",
    auditType: "gmp-pharma",
    severity: "major",
    expectedEvidence: [
      "Plans de zonage (zones grises/blanches)",
      "SAS et différentiels de pression",
      "Contrôle d'accès par zones"
    ]
  },
  {
    id: "gmp-q2",
    text: "Les équipements de production sont-ils qualifiés (QI/QO/QP) ?",
    moduleId: "gmp",
    auditType: "gmp-pharma",
    severity: "critical",
    expectedEvidence: [
      "Protocoles et rapports de qualification",
      "Maintenance préventive",
      "Registres d'utilisation"
    ]
  },
  {
    id: "gmp-q3",
    text: "Les dossiers de lots (batch records) sont-ils complets et signés ?",
    moduleId: "gmp",
    auditType: "gmp-pharma",
    severity: "critical",
    expectedEvidence: [
      "Dossiers de fabrication complets",
      "Double signatures",
      "Traçabilité des déviations",
      "Libération par PQ"
    ]
  },
  {
    id: "gmp-q4",
    text: "Un système de gestion des changements (change control) est-il en place ?",
    moduleId: "gmp",
    auditType: "gmp-pharma",
    severity: "major",
    expectedEvidence: [
      "Procédure change control",
      "Analyse d'impact",
      "Validation si nécessaire",
      "Approbation PQ"
    ]
  },
  {
    id: "gmp-q5",
    text: "Les déviations et OOS (Out of Specification) sont-ils investigués ?",
    moduleId: "gmp",
    auditType: "gmp-pharma",
    severity: "critical",
    expectedEvidence: [
      "Fiches de déviation",
      "Investigation des causes racines",
      "CAPA",
      "Revue PQ"
    ]
  }
];

// ═══════════════════════════════════════════════════════════════════════
// FONCTIONS UTILITAIRES
// ═══════════════════════════════════════════════════════════════════════

export function getAuditQuestions(auditType: AuditType): AuditSimQuestion[] {
  switch (auditType) {
    case "iso-9001":
      return iso9001AuditQuestions;
    case "iso-14001":
      return iso14001AuditQuestions;
    case "iso-45001":
      return iso45001AuditQuestions;
    case "gdp-transport":
      return gdpAuditQuestions;
    case "gmp-pharma":
      return gmpAuditQuestions;
    default:
      return [];
  }
}

export function generateAuditReport(
  auditType: AuditType,
  questions: AuditSimQuestion[],
  responses: AuditResponse[]
): AuditResult {
  const totalQuestions = questions.length;
  const conformeCount = responses.filter(r => r.status === "conforme").length;
  const nonConformeCount = responses.filter(r => r.status === "non-conforme").length;
  const naCount = responses.filter(r => r.status === "non-applicable").length;

  // Calculer le score (% de conformité sur les questions applicables)
  const applicableCount = totalQuestions - naCount;
  const totalScore = applicableCount > 0 ? Math.round((conformeCount / applicableCount) * 100) : 0;

  // Générer la liste des NC
  const ncList: NonConformity[] = responses
    .filter(r => r.status === "non-conforme")
    .map(response => {
      const question = questions.find(q => q.id === response.questionId)!;
      return {
        questionId: question.id,
        severity: question.severity,
        description: question.text,
        recommendation: generateRecommendation(question),
        clause: question.clause,
      };
    });

  // Générer le résumé
  const summary = generateAuditSummary(auditType, totalScore, conformeCount, nonConformeCount, naCount, ncList);

  // Générer les recommandations CAPA
  const recommendations = generateCAPARecommendations(ncList);

  return {
    auditType,
    completedAt: new Date(),
    totalQuestions,
    conformeCount,
    nonConformeCount,
    naCount,
    totalScore,
    ncList,
    summary,
    recommendations,
  };
}

function generateRecommendation(question: AuditSimQuestion): string {
  const baseRecommendations: Record<string, string> = {
    "major": "Mettre en place les preuves manquantes dans un délai de 30 jours. Désigner un responsable et planifier une vérification.",
    "critical": "Action immédiate requise. Risque de non-conformité majeure. Suspension d'activité possible. Correction sous 7 jours maximum.",
    "minor": "Amélioration recommandée. À corriger lors de la prochaine revue. Pas d'impact immédiat sur la conformité."
  };

  let recommendation = baseRecommendations[question.severity] + "\n\n";
  recommendation += "**Preuves attendues :**\n";
  question.expectedEvidence.forEach(evidence => {
    recommendation += `• ${evidence}\n`;
  });

  return recommendation;
}

function generateAuditSummary(
  auditType: AuditType,
  score: number,
  conforme: number,
  nonConforme: number,
  na: number,
  ncList: NonConformity[]
): string {
  const auditNames: Record<AuditType, string> = {
    "iso-9001": "ISO 9001:2015 - Système de Management de la Qualité",
    "iso-14001": "ISO 14001:2015 - Système de Management Environnemental",
    "iso-45001": "ISO 45001:2018 - Système de Management Santé-Sécurité",
    "gdp-transport": "GDP - Bonnes Pratiques de Distribution Pharmaceutique",
    "gmp-pharma": "GMP - Bonnes Pratiques de Fabrication Pharmaceutique"
  };

  let summary = `# Rapport d'Audit ${auditNames[auditType]}\n\n`;
  summary += `**Date :** ${new Date().toLocaleDateString('fr-FR')}\n\n`;
  summary += `## Score Global : ${score}%\n\n`;

  // Interprétation du score
  if (score >= 90) {
    summary += `✅ **Conformité Excellente** - Le système est globalement conforme. Quelques points d'amélioration mineurs.\n\n`;
  } else if (score >= 75) {
    summary += `⚠️ **Conformité Satisfaisante** - Le système est conforme mais nécessite des améliorations.\n\n`;
  } else if (score >= 50) {
    summary += `❌ **Conformité Insuffisante** - Des non-conformités majeures ont été identifiées. Plan d'action urgent requis.\n\n`;
  } else {
    summary += `🚨 **Conformité Critique** - Non-conformités graves. Risque de suspension d'activité. Actions immédiates nécessaires.\n\n`;
  }

  summary += `## Résultats Détaillés\n\n`;
  summary += `- ✅ **Conforme :** ${conforme} points\n`;
  summary += `- ❌ **Non-conforme :** ${nonConforme} points\n`;
  summary += `- ⊘ **Non applicable :** ${na} points\n\n`;

  // Analyse par gravité
  const critical = ncList.filter(nc => nc.severity === "critical").length;
  const major = ncList.filter(nc => nc.severity === "major").length;
  const minor = ncList.filter(nc => nc.severity === "minor").length;

  if (nonConforme > 0) {
    summary += `## Non-Conformités par Gravité\n\n`;
    if (critical > 0) summary += `- 🚨 **Critiques :** ${critical}\n`;
    if (major > 0) summary += `- ⚠️ **Majeures :** ${major}\n`;
    if (minor > 0) summary += `- ℹ️ **Mineures :** ${minor}\n`;
    summary += `\n`;
  }

  return summary;
}

function generateCAPARecommendations(ncList: NonConformity[]): string[] {
  const recommendations: string[] = [];

  // Recommandations par gravité
  const critical = ncList.filter(nc => nc.severity === "critical");
  const major = ncList.filter(nc => nc.severity === "major");

  if (critical.length > 0) {
    recommendations.push(
      "🚨 **URGENT** - Traiter immédiatement les NC critiques (délai max : 7 jours). Désigner un pilote CAPA."
    );
  }

  if (major.length > 0) {
    recommendations.push(
      "⚠️ Ouvrir des fiches CAPA pour chaque NC majeure avec analyse 5 Pourquoi ou Ishikawa."
    );
  }

  if (ncList.length >= 5) {
    recommendations.push(
      "📊 Analyser les causes racines communes à plusieurs NC (analyse transversale recommandée)."
    );
  }

  recommendations.push(
    "📝 Planifier un audit de suivi dans 3 mois pour vérifier l'efficacité des actions correctives."
  );

  recommendations.push(
    "👥 Former les équipes concernées par les écarts identifiés (sensibilisation ciblée)."
  );

  return recommendations;
}
