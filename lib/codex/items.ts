import { KnowledgeItem } from "@/types/codex";

/**
 * Base de connaissances - Items par module
 * Cette liste sera enrichie au fil du temps
 */
export const knowledgeItems: KnowledgeItem[] = [
  // ISO 9001
  {
    id: "iso9001-context",
    moduleId: "iso-9001",
    type: "concept",
    topic: "Contexte de l'organisme (clause 4)",
    body: "ISO 9001 exige d'identifier les enjeux internes et externes, les parties intéressées pertinentes et le périmètre du système de management de la qualité. Cela permet d'aligner le SMQ avec la réalité de l'entreprise et sa stratégie.",
    tags: ["contexte", "clause-4", "smq"]
  },
  {
    id: "iso9001-leadership",
    moduleId: "iso-9001",
    type: "requirement",
    topic: "Leadership et engagement (clause 5)",
    body: "La direction doit démontrer son engagement envers le SMQ, définir la politique qualité, attribuer les responsabilités, s'assurer de la disponibilité des ressources et promouvoir l'amélioration continue.",
    tags: ["leadership", "direction", "clause-5"]
  },
  {
    id: "iso9001-nc-capa",
    moduleId: "iso-9001",
    type: "checklist",
    topic: "Non-conformités et actions correctives (clause 10.2)",
    body: "Vérifier : enregistrement des non-conformités, analyse des causes, actions immédiates, actions correctives, validation de l'efficacité, mise à jour des risques et des documents si nécessaire.",
    tags: ["nc", "capa", "amelioration"]
  },

  // ISO 14001
  {
    id: "iso14001-aspects",
    moduleId: "iso-14001",
    type: "concept",
    topic: "Aspects environnementaux",
    body: "Identifier les aspects environnementaux de l'activité (émissions, rejets, déchets, consommation de ressources) et déterminer ceux qui sont significatifs pour prioriser les actions.",
    tags: ["aspects", "impacts", "environnement"]
  },

  // ISO 45001
  {
    id: "iso45001-duerp",
    moduleId: "iso-45001",
    type: "checklist",
    topic: "Évaluation des risques professionnels",
    body: "Vérifier l'existence d'un DUERP à jour, la méthodologie d'évaluation des risques (gravité, probabilité, maîtrise), les plans d'action associés et la revue régulière.",
    tags: ["duerp", "risques", "sst"]
  },

  // ISO 27001
  {
    id: "iso27001-annexe-a",
    moduleId: "iso-27001",
    type: "concept",
    topic: "Annexe A – Mesures de sécurité",
    body: "L'annexe A d'ISO 27001 fournit un catalogue de mesures de sécurité (contrôles) pour traiter les risques identifiés dans l'Analyse de Risques SSI (informations, systèmes, processus).",
    tags: ["annexe-a", "controle", "ssi"]
  },

  // ISO 42001
  {
    id: "iso42001-objectifs",
    moduleId: "iso-42001",
    type: "concept",
    topic: "Objectifs de l'ISO 42001",
    body: "ISO 42001 fournit un cadre pour établir, mettre en œuvre, maintenir et améliorer en continu un système de management de l'IA (AIMS). Elle vise à garantir une utilisation responsable de l'IA, gérer les risques associés et assurer la conformité réglementaire tout en maximisant les bénéfices.",
    tags: ["aims", "objectifs", "gouvernance"]
  },
  {
    id: "iso42001-risques-ia",
    moduleId: "iso-42001",
    type: "concept",
    topic: "Gestion des risques IA",
    body: "L'ISO 42001 exige une approche systématique pour identifier, évaluer et traiter les risques spécifiques à l'IA : biais algorithmiques, manque de transparence, erreurs de prédiction, impacts sociétaux, dérives éthiques, sécurité et confidentialité des données, dépendance excessive à l'IA.",
    tags: ["risques", "analyse-risques", "biais"]
  },
  {
    id: "iso42001-transparence",
    moduleId: "iso-42001",
    type: "requirement",
    topic: "Transparence et explicabilité",
    body: "Les systèmes d'IA doivent être transparents et explicables. L'organisation doit documenter la logique de décision, les données d'entraînement utilisées, les limites du système et fournir des explications compréhensibles sur les résultats générés par l'IA, notamment pour les décisions critiques.",
    tags: ["transparence", "explicabilité", "xai"]
  },
  {
    id: "iso42001-biais",
    moduleId: "iso-42001",
    type: "concept",
    topic: "Biais et équité algorithmique",
    body: "Les biais algorithmiques peuvent provenir des données d'entraînement, de la conception du modèle ou du contexte d'utilisation. L'ISO 42001 exige d'identifier, mesurer et atténuer les biais pour garantir l'équité et éviter la discrimination envers certains groupes de personnes.",
    tags: ["biais", "équité", "fairness", "discrimination"]
  },
  {
    id: "iso42001-checklist",
    moduleId: "iso-42001",
    type: "checklist",
    topic: "Checklist d'évaluation d'un système IA",
    body: "Vérifier : objectif et cas d'usage définis, analyse des risques IA documentée, données d'entraînement qualifiées et représentatives, tests de performance et de biais effectués, transparence et explicabilité assurées, plan de surveillance continue, responsabilités assignées, conformité réglementaire (RGPD, AI Act), documentation complète du cycle de vie.",
    tags: ["checklist", "évaluation", "conformité"]
  },
  {
    id: "iso42001-documentation",
    moduleId: "iso-42001",
    type: "requirement",
    topic: "Documentation et traçabilité",
    body: "L'ISO 42001 exige une documentation complète tout au long du cycle de vie de l'IA : spécifications initiales, données utilisées, architecture du modèle, résultats des tests, décisions de validation, modifications apportées, incidents survenus et actions correctives. Cette traçabilité est essentielle pour les audits et la conformité.",
    tags: ["documentation", "traçabilité", "cycle-de-vie"]
  },
  {
    id: "iso42001-registre",
    moduleId: "iso-42001",
    type: "tool",
    topic: "Registre des systèmes IA",
    body: "Un registre centralisé doit répertorier tous les systèmes d'IA de l'organisation avec : identifiant unique, description et objectif, niveau de criticité, données utilisées, propriétaire et responsable, date de mise en production, statut (développement/production/retiré), résultats des évaluations de risques et conformité.",
    tags: ["registre", "inventaire", "gouvernance"]
  },
  {
    id: "iso42001-cycle-vie",
    moduleId: "iso-42001",
    type: "concept",
    topic: "Cycle de vie des systèmes IA",
    body: "Le cycle de vie IA comprend : conception et planification, collecte et préparation des données, développement et entraînement du modèle, validation et tests, déploiement, surveillance continue, maintenance et mise à jour, retrait éventuel. Chaque phase doit intégrer des contrôles de qualité, sécurité et éthique.",
    tags: ["cycle-de-vie", "mlops", "développement"]
  },
  {
    id: "iso42001-gouvernance",
    moduleId: "iso-42001",
    type: "requirement",
    topic: "Gouvernance et responsabilités",
    body: "L'ISO 42001 exige la désignation claire des rôles et responsabilités : comité de gouvernance IA, responsable IA (AI Officer), data scientists, experts métier, responsables éthique et conformité. La direction doit démontrer son engagement et allouer les ressources nécessaires.",
    tags: ["gouvernance", "rôles", "responsabilités", "leadership"]
  },
  {
    id: "iso42001-risques-specifiques",
    moduleId: "iso-42001",
    type: "risk",
    topic: "Risques spécifiques à l'IA",
    body: "Risques à surveiller : hallucinations (génération de fausses informations), adversarial attacks (manipulation malveillante), data poisoning (corruption des données d'entraînement), model drift (dégradation des performances), surconfiance dans les prédictions, impacts environnementaux (consommation énergétique), dépendance à des fournisseurs tiers.",
    tags: ["risques", "hallucinations", "attacks", "drift"]
  },
  {
    id: "iso42001-surveillance",
    moduleId: "iso-42001",
    type: "requirement",
    topic: "Surveillance et monitoring continu",
    body: "Les systèmes IA en production doivent être surveillés en continu pour détecter : dégradation des performances, apparition de biais, dérives du modèle (drift), anomalies dans les données d'entrée, incidents de sécurité. Des métriques de performance, d'équité et de fiabilité doivent être définies et suivies régulièrement.",
    tags: ["surveillance", "monitoring", "drift", "performance"]
  },

  // GAMP 5
  {
    id: "gamp5-categories",
    moduleId: "gamp-5",
    type: "concept",
    topic: "Catégories GAMP 5",
    body: "GAMP 5 classe les systèmes en catégories (infrastructure, logiciels non configurables, logiciels configurables, développement spécifique) afin d'ajuster l'effort de validation en fonction du risque.",
    tags: ["gamp5", "validation", "csv"]
  },

  // Excellence Opérationnelle
  {
    id: "exop-lean-5s",
    moduleId: "exop",
    type: "tool",
    topic: "5S",
    body: "Méthode pour structurer un poste de travail : Seiri (Trier), Seiton (Ranger), Seiso (Nettoyer), Seiketsu (Standardiser), Shitsuke (Pérenniser). Sert de fondation à la performance, la qualité et la sécurité.",
    tags: ["lean", "5s", "terrain"]
  },
  {
    id: "exop-dmaic",
    moduleId: "exop",
    type: "concept",
    topic: "DMAIC",
    body: "Démarche Six Sigma structurée : Define, Measure, Analyze, Improve, Control. Approche projet orientée réduction de la variabilité et des défauts.",
    tags: ["six-sigma", "dmaic", "amelioration"]
  },

  // GDP
  {
    id: "gdp-principes",
    moduleId: "gdp",
    type: "concept",
    topic: "Objectif des GDP",
    body: "Les Good Distribution Practices visent à garantir que la qualité et l'intégrité des médicaments sont maintenues tout au long de la chaîne de distribution jusqu'au patient.",
    tags: ["gdp", "distribution", "pharma"]
  },
  {
    id: "gdp-cold-chain-checklist",
    moduleId: "gdp",
    type: "checklist",
    topic: "Checklist Cold Chain – Route & Air",
    body: "Vérifier : QMS documenté, personnel formé, véhicules et emballages qualifiés, enregistreurs de température, SOP excursions, traçabilité complète, validation des flux, maîtrise des sous-traitants, conformité GDP/CEIV/IATA, audits réguliers.",
    tags: ["cold-chain", "transport", "checklist"]
  },

  // GMP
  {
    id: "gmp-batch-record",
    moduleId: "gmp",
    type: "requirement",
    topic: "Dossier de lot (Batch Record)",
    body: "Chaque lot doit disposer d'un dossier complet permettant de reconstituer l'historique de fabrication et de contrôle. Les enregistrements doivent être contemporains, lisibles, exacts et revus par la qualité avant libération.",
    tags: ["gmp", "batch-record", "documentation"]
  },

  // CEIV Pharma
  {
    id: "ceiv-pharma-scope",
    moduleId: "ceiv-pharma",
    type: "concept",
    topic: "Portée CEIV Pharma",
    body: "CEIV Pharma (IATA) couvre l'ensemble de la chaîne logistique aérienne : acceptance, handling, stockage, transport, gestion des températures, documentation et formation du personnel pour les produits de santé.",
    tags: ["ceiv", "iata", "air-cargo"]
  },

  // Cold Chain Packaging
  {
    id: "cold-chain-passive-packaging",
    moduleId: "cold-chain-packaging",
    type: "concept",
    topic: "Emballages passifs",
    body: "Les emballages passifs s'appuient sur l'isolation et des éléments frigorigènes pré-conditionnés (PCM, gels). Ils n'utilisent pas de source d'énergie active et doivent être qualifiés pour un profil temps/température donné.",
    tags: ["emballage-passif", "pcm", "qualification"]
  },
  {
    id: "cold-chain-active-packaging",
    moduleId: "cold-chain-packaging",
    type: "concept",
    topic: "Emballages actifs",
    body: "Les emballages actifs utilisent une source d'énergie (batterie, compresseur) pour réguler automatiquement la température. Ils sont adaptés aux trajets longs et aux conditions extrêmes, mais nécessitent une gestion rigoureuse (batteries, paramétrage, pré-refroidissement).",
    tags: ["emballage-actif", "envirotainer", "regulation"]
  },

  // HACCP
  {
    id: "haccp-7-principes",
    moduleId: "haccp",
    type: "concept",
    topic: "Les 7 principes de l'HACCP",
    body: "L'HACCP repose sur 7 principes fondamentaux : 1) Identifier les dangers et analyser les risques, 2) Déterminer les Points Critiques de Contrôle (CCP), 3) Établir les limites critiques, 4) Mettre en place un système de surveillance, 5) Définir les actions correctives, 6) Établir des procédures de vérification, 7) Constituer un système documentaire.",
    tags: ["7-principes", "ccp", "codex-alimentarius"]
  },
  {
    id: "haccp-pcc",
    moduleId: "haccp",
    type: "concept",
    topic: "Point Critique de Contrôle (CCP)",
    body: "Un CCP est une étape du processus où une mesure de maîtrise peut être appliquée et est essentielle pour prévenir, éliminer ou réduire un danger pour la sécurité des aliments à un niveau acceptable. Exemples : température de cuisson, pH, détection de métaux.",
    tags: ["ccp", "point-critique", "maitrise"]
  },
  {
    id: "haccp-arbre-decision",
    moduleId: "haccp",
    type: "tool",
    topic: "Arbre de décision CCP",
    body: "L'arbre de décision du Codex Alimentarius est un outil systématique pour déterminer si une étape est un CCP. Il pose une série de questions : Q1) Existe-t-il une mesure préventive ? Q2) L'étape élimine-t-elle ou réduit-elle le danger ? Q3) Une contamination peut-elle survenir ? Q4) Une étape ultérieure éliminera-t-elle le danger ?",
    tags: ["arbre-decision", "ccp", "methodologie"]
  },
  {
    id: "haccp-limites-critiques",
    moduleId: "haccp",
    type: "requirement",
    topic: "Limites critiques",
    body: "Les limites critiques sont les valeurs qui séparent l'acceptabilité de la non-acceptabilité pour chaque CCP. Elles doivent être mesurables (température ≥75°C, pH ≤4.6, aw ≤0.85) et basées sur des références scientifiques ou réglementaires. Elles permettent de déterminer si un CCP est maîtrisé.",
    tags: ["limites-critiques", "ccp", "mesures"]
  },
  {
    id: "haccp-surveillance",
    moduleId: "haccp",
    type: "checklist",
    topic: "Surveillance des CCP",
    body: "Vérifier : méthodes de surveillance définies (continue ou discontinue), fréquence adaptée au risque, responsabilités assignées, équipements calibrés, enregistrements des mesures, système d'alerte en cas de dérive, traçabilité des lots.",
    tags: ["surveillance", "monitoring", "ccp"]
  },
  {
    id: "haccp-actions-correctives",
    moduleId: "haccp",
    type: "requirement",
    topic: "Actions correctives",
    body: "Des actions correctives doivent être définies pour chaque CCP en cas de dépassement des limites critiques. Elles incluent : correction immédiate du processus, identification et maîtrise des produits non conformes, analyse des causes, mesures pour éviter la récurrence, enregistrement documenté.",
    tags: ["actions-correctives", "non-conformite", "ccp"]
  },
  {
    id: "haccp-verification",
    moduleId: "haccp",
    type: "checklist",
    topic: "Vérification du système HACCP",
    body: "Vérifier : audits HACCP réguliers, validation des limites critiques, calibration des équipements de mesure, analyses microbiologiques/chimiques, revue des enregistrements, tests challenge, formation du personnel, mise à jour du plan HACCP lors de modifications.",
    tags: ["verification", "audit", "validation"]
  },
  {
    id: "haccp-prerequis",
    moduleId: "haccp",
    type: "concept",
    topic: "Programmes Pré-Requis (PRP)",
    body: "Les PRP sont les conditions de base et les activités nécessaires pour maintenir un environnement hygiénique. Ils incluent : conception des locaux, nettoyage et désinfection, lutte contre les nuisibles, hygiène du personnel, maintenance des équipements, gestion des déchets, approvisionnement en eau, maîtrise des fournisseurs.",
    tags: ["prp", "prerequis", "hygiene"]
  },

  // ISO 42001 - Enrichissement détaillé basé sur ISO/IEC 42001:2023

  // Clause 4: Context of the organization
  {
    id: "iso42001-clause4-context",
    moduleId: "iso-42001",
    type: "requirement",
    topic: "Clause 4 : Contexte de l'organisation",
    body: "L'organisation doit déterminer les enjeux externes et internes pertinents pour son système de management de l'IA. Cela inclut : les exigences légales applicables (RGPD, AI Act européen), les politiques et décisions des régulateurs sur l'IA, les valeurs culturelles et éthiques, le paysage concurrentiel et les tendances des nouveaux produits/services utilisant l'IA. Le changement climatique doit également être considéré si pertinent.",
    tags: ["clause-4", "contexte", "enjeux", "réglementation"]
  },
  {
    id: "iso42001-interested-parties",
    moduleId: "iso-42001",
    type: "concept",
    topic: "Parties intéressées de l'IA",
    body: "Les parties intéressées pertinentes pour un AIMS incluent : les fournisseurs d'IA (plateformes, produits, services), les producteurs d'IA (développeurs, concepteurs, opérateurs, testeurs, évaluateurs, déployeurs), les utilisateurs finaux, les partenaires (intégrateurs de systèmes, fournisseurs de données), les sujets de données, les autorités compétentes (régulateurs, décideurs politiques). Leurs exigences peuvent être liées au changement climatique.",
    tags: ["parties-intéressées", "stakeholders", "clause-4"]
  },
  {
    id: "iso42001-scope-aims",
    moduleId: "iso-42001",
    type: "requirement",
    topic: "Périmètre du système de management IA",
    body: "L'organisation doit déterminer les limites et l'applicabilité de l'AIMS pour établir son périmètre. Ce périmètre doit considérer : les enjeux internes/externes (clause 4.1), les exigences des parties intéressées (clause 4.2), les activités de l'organisation concernant l'IA (leadership, planification, support, opération, évaluation, amélioration, contrôles, objectifs). Le périmètre doit être disponible comme information documentée.",
    tags: ["périmètre", "scope", "clause-4", "aims"]
  },

  // Clause 5: Leadership
  {
    id: "iso42001-clause5-leadership",
    moduleId: "iso-42001",
    type: "requirement",
    topic: "Clause 5 : Leadership et engagement de la direction",
    body: "La direction doit démontrer son leadership et engagement envers l'AIMS en : s'assurant que la politique et les objectifs IA sont établis et compatibles avec la stratégie, intégrant les exigences AIMS dans les processus métier, s'assurant de la disponibilité des ressources, communiquant l'importance d'un management IA efficace et conforme, s'assurant que l'AIMS atteint ses résultats attendus, dirigeant et soutenant les personnes pour contribuer à l'efficacité de l'AIMS, promouvant l'amélioration continue, soutenant les autres rôles de management pertinents.",
    tags: ["clause-5", "leadership", "direction", "engagement"]
  },
  {
    id: "iso42001-ai-policy",
    moduleId: "iso-42001",
    type: "requirement",
    topic: "Politique IA (AI Policy)",
    body: "La direction doit établir une politique IA qui : soit appropriée à l'objectif de l'organisation, fournisse un cadre pour définir les objectifs IA, inclue un engagement à satisfaire les exigences applicables, inclue un engagement à l'amélioration continue de l'AIMS. La politique IA doit : être disponible comme information documentée, être communiquée au sein de l'organisation, être disponible aux parties intéressées si approprié. Elle doit considérer la stratégie métier, les valeurs/culture organisationnelles et le niveau de risque accepté, les exigences légales, l'environnement de risque, l'impact sur les parties intéressées.",
    tags: ["politique-ia", "ai-policy", "clause-5"]
  },
  {
    id: "iso42001-roles-responsibilities",
    moduleId: "iso-42001",
    type: "requirement",
    topic: "Rôles et responsabilités IA",
    body: "La direction doit s'assurer que les responsabilités et autorités pour les rôles pertinents sont assignées et communiquées. Elle doit assigner la responsabilité et autorité pour : s'assurer que l'AIMS est conforme aux exigences de la norme, rapporter sur la performance de l'AIMS à la direction. Les rôles peuvent inclure : management des risques, évaluations d'impact des systèmes IA, gestion des actifs et ressources, sécurité, sûreté, privacy, développement, performance, surveillance humaine (human oversight), relations fournisseurs, respect constant des exigences légales, gestion de la qualité des données (tout au long du cycle de vie).",
    tags: ["rôles", "responsabilités", "clause-5", "gouvernance"]
  },

  // Clause 6: Planning
  {
    id: "iso42001-clause6-planning",
    moduleId: "iso-42001",
    type: "concept",
    topic: "Clause 6 : Planification et gestion des risques IA",
    body: "Lors de la planification de l'AIMS, l'organisation doit considérer les enjeux (clause 4.1) et les exigences (clause 4.2) et déterminer les risques et opportunités à traiter pour : donner l'assurance que l'AIMS peut atteindre ses résultats attendus, prévenir ou réduire les effets indésirables, atteindre l'amélioration continue. L'organisation doit établir et maintenir des critères de risque IA qui soutiennent : la distinction entre risques acceptables et non-acceptables, la réalisation d'évaluations de risques IA, la conduite de traitement des risques IA, l'évaluation des impacts des systèmes IA.",
    tags: ["clause-6", "planification", "risques", "opportunités"]
  },
  {
    id: "iso42001-ai-risk-assessment",
    moduleId: "iso-42001",
    type: "requirement",
    topic: "Évaluation des risques IA (AI Risk Assessment)",
    body: "L'organisation doit définir et établir un processus d'évaluation des risques IA qui : soit informé et aligné avec la politique IA et les objectifs IA, soit conçu pour produire des résultats d'évaluation répétables, valides et comparables, identifie les risques qui aident ou empêchent d'atteindre les objectifs IA, analyse les risques IA en : évaluant les conséquences potentielles pour l'organisation, les individus et les sociétés si les risques se matérialisaient, évaluant la probabilité réaliste des risques identifiés, déterminant les niveaux de risque, évalue les risques IA en : comparant les résultats de l'analyse des risques avec les critères de risque, priorisant les risques évalués pour le traitement. L'organisation doit conserver des informations documentées sur le processus d'évaluation des risques IA.",
    tags: ["évaluation-risques", "risk-assessment", "clause-6"]
  },
  {
    id: "iso42001-ai-risk-treatment",
    moduleId: "iso-42001",
    type: "requirement",
    topic: "Traitement des risques IA (AI Risk Treatment)",
    body: "En tenant compte des résultats de l'évaluation des risques, l'organisation doit définir un processus de traitement des risques IA pour : sélectionner les options de traitement appropriées, déterminer tous les contrôles nécessaires pour implémenter les options de traitement choisies et comparer les contrôles avec ceux de l'Annexe A pour vérifier qu'aucun contrôle nécessaire n'a été omis, considérer les contrôles de l'Annexe A pertinents pour l'implémentation, identifier si des contrôles supplémentaires sont nécessaires au-delà de ceux de l'Annexe A, considérer les orientations de l'Annexe B pour l'implémentation, produire une déclaration d'applicabilité contenant les contrôles nécessaires et la justification d'inclusion/exclusion, formuler un plan de traitement des risques IA. L'organisation doit obtenir l'approbation de la direction pour le plan et l'acceptation des risques résiduels.",
    tags: ["traitement-risques", "risk-treatment", "clause-6", "annexe-a"]
  },
  {
    id: "iso42001-ai-system-impact-assessment",
    moduleId: "iso-42001",
    type: "requirement",
    topic: "Évaluation d'impact des systèmes IA (AI System Impact Assessment)",
    body: "L'organisation doit définir un processus pour évaluer les conséquences potentielles pour les individus ou groupes d'individus, ou les deux, et les sociétés qui peuvent résulter du développement, de la fourniture ou de l'utilisation de systèmes IA tout au long de leur cycle de vie. L'évaluation doit déterminer les conséquences potentielles sur l'utilisation prévue du système IA et les risques prévisibles qu'il a sur les individus ou groupes d'individus, ou les deux, et les sociétés. Elle doit prendre en compte le contexte technique et sociétal spécifique où le système IA est déployé et les juridictions applicables. Le résultat doit être documenté et peut être rendu disponible aux parties intéressées pertinentes selon la définition de l'organisation. L'organisation doit considérer les résultats dans l'évaluation des risques (clause 6.1.2).",
    tags: ["impact-assessment", "clause-6", "conséquences", "société"]
  },
  {
    id: "iso42001-ai-objectives",
    moduleId: "iso-42001",
    type: "requirement",
    topic: "Objectifs IA et planification",
    body: "L'organisation doit établir des objectifs IA aux fonctions et niveaux pertinents. Les objectifs IA doivent : être cohérents avec la politique IA, être mesurables (si praticable), tenir compte des exigences applicables, être surveillés, être communiqués, être mis à jour si approprié, être disponibles comme information documentée. Lors de la planification pour atteindre les objectifs IA, l'organisation doit déterminer : ce qui sera fait, quelles ressources seront requises, qui sera responsable, quand ce sera complété, comment les résultats seront évalués. Une liste non-exhaustive d'objectifs IA liés au management des risques est fournie en A.6.1 et A.9.3 dans l'Annexe A.",
    tags: ["objectifs-ia", "clause-6", "planification", "mesurables"]
  },
  {
    id: "iso42001-planning-changes",
    moduleId: "iso-42001",
    type: "requirement",
    topic: "Planification des changements",
    body: "Quand l'organisation détermine le besoin de changements au système de management IA, les changements doivent être réalisés de manière planifiée. L'organisation doit considérer : l'objectif des changements et leurs conséquences potentielles, l'intégrité de l'AIMS, la disponibilité des ressources, l'allocation ou réallocation des responsabilités et autorités.",
    tags: ["changements", "clause-6", "planification"]
  },

  // Clause 7: Support
  {
    id: "iso42001-clause7-resources",
    moduleId: "iso-42001",
    type: "requirement",
    topic: "Clause 7 : Ressources pour l'AIMS",
    body: "L'organisation doit déterminer et fournir les ressources nécessaires pour l'établissement, l'implémentation, la maintenance et l'amélioration continue de l'AIMS. Les ressources incluent (A.4 dans l'Annexe A) : composants de systèmes IA, ressources de données (data utilisée à toute étape du cycle de vie), ressources d'outillage (algorithmes, modèles ML, outils), ressources système et informatiques (matériel pour développer et exécuter les modèles IA, stockage pour données et ressources de calcul), ressources humaines (personnes avec l'expertise nécessaire pour le développement, les ventes, la formation, l'opération, la maintenance, le transfert, la décommission, la vérification et l'intégration du système IA).",
    tags: ["clause-7", "ressources", "support", "annexe-a"]
  },
  {
    id: "iso42001-competence",
    moduleId: "iso-42001",
    type: "requirement",
    topic: "Compétence",
    body: "L'organisation doit : déterminer la compétence nécessaire des personnes effectuant un travail sous son contrôle qui affecte sa performance IA, s'assurer que ces personnes sont compétentes sur la base d'une éducation, formation ou expérience appropriées, le cas échéant, prendre des actions pour acquérir la compétence nécessaire et évaluer l'efficacité des actions prises. L'organisation doit considérer le besoin d'expertise diverse et inclure les types de rôles nécessaires pour le système. Les ressources humaines nécessaires peuvent inclure mais ne sont pas limitées à : data scientists, rôles liés à la surveillance humaine des systèmes IA, experts en trustworthiness (safety, security, privacy), chercheurs IA et spécialistes, experts du domaine pertinents aux systèmes IA. Des informations documentées appropriées doivent être disponibles comme preuve de compétence.",
    tags: ["compétence", "clause-7", "formation", "expertise"]
  },
  {
    id: "iso42001-awareness",
    moduleId: "iso-42001",
    type: "requirement",
    topic: "Sensibilisation (Awareness)",
    body: "Les personnes effectuant un travail sous le contrôle de l'organisation doivent être conscientes de : la politique IA, leur contribution à l'efficacité de l'AIMS, incluant les bénéfices d'une performance IA améliorée, les implications de ne pas se conformer aux exigences de l'AIMS.",
    tags: ["sensibilisation", "awareness", "clause-7", "personnel"]
  },
  {
    id: "iso42001-communication",
    moduleId: "iso-42001",
    type: "requirement",
    topic: "Communication",
    body: "L'organisation doit déterminer les communications internes et externes pertinentes pour l'AIMS, incluant : ce qui sera communiqué, quand communiquer, avec qui communiquer, comment communiquer. La communication doit couvrir les aspects techniques et les attentes des parties intéressées concernant les systèmes IA.",
    tags: ["communication", "clause-7", "parties-intéressées"]
  },
  {
    id: "iso42001-documented-information",
    moduleId: "iso-42001",
    type: "requirement",
    topic: "Informations documentées",
    body: "L'AIMS de l'organisation doit inclure : les informations documentées requises par ce document, les informations documentées déterminées par l'organisation comme étant nécessaires pour l'efficacité de l'AIMS. L'étendue peut différer d'une organisation à l'autre en fonction de : la taille de l'organisation et son type d'activités/processus/produits/services, la complexité des processus et leurs interactions, la compétence des personnes. Lors de la création et mise à jour des informations documentées, l'organisation doit assurer l'identification et description appropriées (titre, date, auteur, numéro de référence), le format (langage, version logicielle, graphiques) et média (papier, électronique), la revue et approbation pour convenance et adéquation.",
    tags: ["documentation", "clause-7", "informations-documentées"]
  },

  // Clause 8: Operation
  {
    id: "iso42001-clause8-operational-planning",
    moduleId: "iso-42001",
    type: "requirement",
    topic: "Clause 8 : Planification et contrôle opérationnels",
    body: "L'organisation doit planifier, implémenter et contrôler les processus nécessaires pour satisfaire les exigences, et implémenter les actions déterminées en Clause 6, en : établissant des critères pour les processus, implémentant le contrôle des processus conformément aux critères. L'organisation doit implémenter les contrôles déterminés selon 6.1.3 qui sont liés à l'opération de l'AIMS (par exemple, développement et cycle de vie d'utilisation de systèmes IA). L'efficacité de ces contrôles doit être surveillée et des actions correctives doivent être considérées si les résultats attendus ne sont pas atteints. L'Annexe A liste les contrôles de référence et l'Annexe B fournit des orientations d'implémentation. Les informations documentées doivent être disponibles dans la mesure nécessaire pour avoir confiance que les processus ont été réalisés comme planifié. L'organisation doit contrôler les changements planifiés et revoir les conséquences des changements non intentionnels, prenant des actions pour atténuer tout effet adverse si nécessaire. L'organisation doit s'assurer que les processus, produits ou services fournis externellement qui sont pertinents pour l'AIMS sont contrôlés.",
    tags: ["clause-8", "opération", "contrôle", "processus"]
  },
  {
    id: "iso42001-ai-risk-assessment-operation",
    moduleId: "iso-42001",
    type: "requirement",
    topic: "Évaluation des risques IA en opération",
    body: "L'organisation doit réaliser des évaluations de risques IA conformément à 6.1.2 à des intervalles planifiés ou quand des changements significatifs sont proposés ou surviennent. L'organisation doit conserver des informations documentées sur les résultats de toutes les évaluations de risques IA.",
    tags: ["clause-8", "évaluation-risques", "opération"]
  },
  {
    id: "iso42001-ai-risk-treatment-operation",
    moduleId: "iso-42001",
    type: "requirement",
    topic: "Traitement des risques IA en opération",
    body: "L'organisation doit implémenter le plan de traitement des risques IA selon 6.1.3 et vérifier son efficacité. Quand les évaluations de risques identifient de nouveaux risques nécessitant un traitement, un processus de traitement des risques selon 6.1.3 doit être réalisé pour ces risques. Quand les options de traitement définies par le plan ne sont pas efficaces, ces options doivent être revues et revalidées en suivant le processus de traitement des risques selon 6.1.3 et le plan de traitement des risques IA doit être mis à jour. L'organisation doit conserver des informations documentées sur les résultats de tous les traitements de risques IA.",
    tags: ["clause-8", "traitement-risques", "opération"]
  },
  {
    id: "iso42001-ai-impact-assessment-operation",
    moduleId: "iso-42001",
    type: "requirement",
    topic: "Évaluation d'impact des systèmes IA en opération",
    body: "L'organisation doit réaliser des évaluations d'impact de systèmes IA selon 6.1.4 à des intervalles planifiés ou quand des changements significatifs sont proposés ou surviennent. L'organisation doit conserver des informations documentées sur les résultats de toutes les évaluations d'impact de systèmes IA.",
    tags: ["clause-8", "impact-assessment", "opération"]
  },

  // Clause 9: Performance evaluation
  {
    id: "iso42001-clause9-monitoring",
    moduleId: "iso-42001",
    type: "requirement",
    topic: "Clause 9 : Surveillance et mesure",
    body: "L'organisation doit déterminer : ce qui doit être surveillé et mesuré, les méthodes de surveillance, mesure, analyse et évaluation applicables pour assurer des résultats valides, quand la surveillance et la mesure doivent être réalisées, quand les résultats de la surveillance et de la mesure doivent être analysés et évalués. Des informations documentées doivent être disponibles comme preuve des résultats. L'organisation doit évaluer la performance et l'efficacité de l'AIMS.",
    tags: ["clause-9", "surveillance", "mesure", "performance"]
  },
  {
    id: "iso42001-internal-audit",
    moduleId: "iso-42001",
    type: "requirement",
    topic: "Audit interne",
    body: "L'organisation doit conduire des audits internes à des intervalles planifiés pour fournir des informations sur le fait que l'AIMS : est conforme aux propres exigences de l'organisation pour son AIMS, aux exigences de ce document, est efficacement implémenté et maintenu. L'organisation doit : définir les objectifs, critères et périmètre de chaque audit, sélectionner les auditeurs et conduire les audits pour assurer l'objectivité et l'impartialité du processus d'audit, s'assurer que les résultats des audits sont rapportés aux managers pertinents. Des informations documentées doivent être disponibles comme preuve de l'implémentation du programme d'audit et des résultats d'audit.",
    tags: ["clause-9", "audit-interne", "conformité"]
  },
  {
    id: "iso42001-management-review",
    moduleId: "iso-42001",
    type: "requirement",
    topic: "Revue de direction",
    body: "La direction doit revoir l'AIMS de l'organisation à des intervalles planifiés pour assurer sa convenance, adéquation et efficacité continues. La revue de direction doit inclure des considérations sur : le statut des actions des revues de direction précédentes, les changements dans les enjeux externes/internes pertinents pour l'AIMS, les changements dans les besoins et attentes des parties intéressées pertinentes pour l'AIMS, les informations sur la performance de l'AIMS incluant les tendances en : non-conformités et actions correctives, résultats de surveillance et mesure, résultats d'audit, les opportunités d'amélioration continue. Les résultats de la revue de direction doivent inclure des décisions relatives aux opportunités d'amélioration continue et tout besoin de changements à l'AIMS. Des informations documentées doivent être disponibles comme preuve des résultats des revues de direction.",
    tags: ["clause-9", "revue-direction", "amélioration"]
  },

  // Clause 10: Improvement
  {
    id: "iso42001-clause10-improvement",
    moduleId: "iso-42001",
    type: "requirement",
    topic: "Clause 10 : Amélioration continue",
    body: "L'organisation doit continuellement améliorer la convenance, l'adéquation et l'efficacité de l'AIMS. L'amélioration continue doit porter sur : l'optimisation de la performance globale, la réduction des risques, l'augmentation de la valeur pour les parties intéressées.",
    tags: ["clause-10", "amélioration-continue", "performance"]
  },
  {
    id: "iso42001-nonconformity-corrective-action",
    moduleId: "iso-42001",
    type: "requirement",
    topic: "Non-conformité et action corrective",
    body: "Quand une non-conformité survient, l'organisation doit : réagir à la non-conformité et selon applicable : prendre des actions pour la contrôler et la corriger, traiter les conséquences, évaluer le besoin d'actions pour éliminer les causes de la non-conformité pour qu'elle ne se reproduise pas ou ne survienne pas ailleurs, en : revoyant la non-conformité, déterminant les causes de la non-conformité, déterminant si des non-conformités similaires existent ou pourraient potentiellement survenir, implémenter toute action nécessaire, revoir l'efficacité de toute action corrective prise, faire des changements à l'AIMS si nécessaire. Les actions correctives doivent être appropriées aux effets des non-conformités rencontrées. Des informations documentées doivent être disponibles comme preuve de : la nature des non-conformités et toutes actions subséquentes prises, les résultats de toute action corrective.",
    tags: ["clause-10", "non-conformité", "action-corrective"]
  },

  // Annex A Controls - A.2 Policies related to AI
  {
    id: "iso42001-annexa-a2-ai-policy-control",
    moduleId: "iso-42001",
    type: "requirement",
    topic: "Annexe A.2 : Contrôle de la politique IA",
    body: "Objectif : Fournir une direction de management et un support pour les systèmes IA selon les exigences métier. Contrôles : A.2.2 Politique IA - L'organisation doit documenter une politique pour le développement ou l'utilisation de systèmes IA. A.2.3 Alignement avec d'autres politiques organisationnelles - L'organisation doit déterminer où d'autres politiques peuvent être affectées par ou s'appliquer aux objectifs de l'organisation concernant les systèmes IA. A.2.4 Revue de la politique IA - La politique IA doit être revue à des intervalles planifiés ou additionnellement si nécessaire pour assurer sa convenance, adéquation et efficacité continues.",
    tags: ["annexe-a", "a2", "politique-ia", "contrôles"]
  },

  // Annex A Controls - A.3 Internal organization
  {
    id: "iso42001-annexa-a3-internal-organization",
    moduleId: "iso-42001",
    type: "requirement",
    topic: "Annexe A.3 : Organisation interne",
    body: "Objectif : Établir la responsabilité au sein de l'organisation pour soutenir son approche responsable pour l'implémentation, l'opération et le management des systèmes IA. Contrôles : A.3.2 Rôles et responsabilités IA - Les rôles et responsabilités pour l'IA doivent être définis et alloués selon les besoins de l'organisation. A.3.3 Rapport de préoccupations (Reporting of concerns) - L'organisation doit définir et mettre en place un processus pour rapporter les préoccupations concernant le rôle de l'organisation par rapport à un système IA tout au long de son cycle de vie.",
    tags: ["annexe-a", "a3", "organisation-interne", "rôles"]
  },

  // Annex A Controls - A.4 Resources for AI systems
  {
    id: "iso42001-annexa-a4-resources",
    moduleId: "iso-42001",
    type: "requirement",
    topic: "Annexe A.4 : Ressources pour les systèmes IA",
    body: "Objectif : S'assurer que l'organisation comptabilise les ressources (incluant les composants et actifs de systèmes IA) du système IA afin de pleinement comprendre et traiter les risques et impacts. Contrôles : A.4.2 Documentation des ressources - L'organisation doit identifier et documenter les ressources pertinentes requises pour les activités à des étapes de cycle de vie de système IA données et autres activités liées à l'IA pertinentes pour l'organisation. A.4.3 Ressources de données - Dans le cadre de l'identification des ressources, l'organisation doit documenter les informations sur les ressources de données utilisées pour le système IA. A.4.4 Ressources d'outillage - Dans le cadre de l'identification des ressources, l'organisation doit documenter les informations sur les ressources d'outillage utilisées pour le système IA. A.4.5 Ressources système et informatiques - Dans le cadre de l'identification des ressources, l'organisation doit documenter les informations sur les ressources système et informatiques utilisées pour le système IA. A.4.6 Ressources humaines - Dans le cadre de l'identification des ressources, l'organisation doit documenter les informations sur les ressources humaines et leurs compétences utilisées pour le développement, déploiement, opération, changement, maintenance, transfert et décommission ainsi que vérification et intégration du système IA.",
    tags: ["annexe-a", "a4", "ressources", "actifs"]
  },

  // Annex A Controls - A.5 Assessing impacts of AI systems
  {
    id: "iso42001-annexa-a5-impact-assessment",
    moduleId: "iso-42001",
    type: "requirement",
    topic: "Annexe A.5 : Évaluation des impacts des systèmes IA",
    body: "Objectif : Évaluer les impacts des systèmes IA sur les individus ou groupes d'individus, ou les deux, et les sociétés affectés par le système IA tout au long de son cycle de vie. Contrôles : A.5.2 Processus d'évaluation d'impact de système IA - L'organisation doit établir un processus pour évaluer les conséquences potentielles pour les individus ou groupes d'individus, ou les deux, et les sociétés qui peuvent résulter de l'utilisation prévue du système IA et des risques prévisibles tout au long de son cycle de vie. A.5.3 Documentation des évaluations d'impact de systèmes IA - L'organisation doit documenter les résultats des évaluations d'impact de systèmes IA et conserver les résultats pour une période définie. A.5.4 Évaluation de l'impact des systèmes IA sur les individus ou groupes d'individus - L'organisation doit évaluer et documenter les impacts potentiels des systèmes IA sur les individus ou groupes d'individus tout au long du cycle de vie du système. A.5.5 Évaluation des impacts sociétaux des systèmes IA - L'organisation doit évaluer et documenter les impacts sociétaux potentiels de leurs systèmes IA tout au long de leur cycle de vie.",
    tags: ["annexe-a", "a5", "impact-assessment", "société"]
  },

  // Annex A Controls - A.6 AI system life cycle
  {
    id: "iso42001-annexa-a6-lifecycle",
    moduleId: "iso-42001",
    type: "requirement",
    topic: "Annexe A.6 : Cycle de vie des systèmes IA",
    body: "Objectif : S'assurer que l'organisation identifie et documente les objectifs et implémente les processus pour la conception et le développement responsables des systèmes IA. Contrôles principaux : A.6.1.2 Objectifs pour le développement responsable de systèmes IA - L'organisation doit identifier et documenter les objectifs pour guider le développement responsable des systèmes IA, et prendre ces objectifs en compte et intégrer des mesures pour les atteindre dans le cycle de vie du développement. A.6.1.3 Processus pour la conception et le développement responsables de systèmes IA - L'organisation doit définir et documenter les processus spécifiques pour la conception et le développement responsables du système IA. A.6.2.2 Exigences et spécifications de systèmes IA - L'organisation doit spécifier et documenter les exigences pour les nouveaux systèmes IA ou améliorations matérielles aux systèmes existants. A.6.2.4 Vérification et validation de systèmes IA - L'organisation doit définir et documenter les mesures de vérification et validation pour le système IA et spécifier les critères pour leur utilisation. A.6.2.5 Déploiement de systèmes IA - L'organisation doit documenter un plan de déploiement et s'assurer que les exigences appropriées sont satisfaites avant le déploiement. A.6.2.6 Opération et surveillance de systèmes IA - L'organisation doit définir et documenter les éléments nécessaires pour l'opération continue du système IA. Au minimum, cela doit inclure la surveillance système et de performance, les réparations, mises à jour et support. A.6.2.7 Documentation technique de systèmes IA - L'organisation doit déterminer quelle documentation technique de système IA est nécessaire pour chaque catégorie pertinente de parties intéressées. A.6.2.8 Enregistrement des événements de systèmes IA - L'organisation doit déterminer à quelles phases du cycle de vie du système IA, la conservation d'enregistrements d'événements doit être activée, mais au minimum quand le système IA est en utilisation.",
    tags: ["annexe-a", "a6", "cycle-de-vie", "développement"]
  },

  // Annex A Controls - A.7 Data for AI systems
  {
    id: "iso42001-annexa-a7-data-management",
    moduleId: "iso-42001",
    type: "requirement",
    topic: "Annexe A.7 : Données pour les systèmes IA",
    body: "Objectif : S'assurer que l'organisation comprend le rôle et les impacts des données dans les systèmes IA dans l'application et le développement, la fourniture ou l'utilisation de systèmes IA tout au long de leurs cycles de vie. Contrôles principaux : A.7.2 Données pour le développement et l'amélioration de systèmes IA - L'organisation doit définir, documenter et implémenter des processus de gestion de données liés au développement de systèmes IA. A.7.3 Acquisition de données - L'organisation doit déterminer et documenter les détails sur l'acquisition et la sélection des données utilisées dans les systèmes IA. A.7.4 Qualité des données pour les systèmes IA - L'organisation doit définir et documenter les exigences pour la qualité des données et s'assurer que les données utilisées pour développer et opérer le système IA satisfont ces exigences. A.7.5 Provenance des données - L'organisation doit définir et documenter un processus pour enregistrer la provenance des données utilisées dans ses systèmes IA sur les cycles de vie des données et du système IA. A.7.6 Préparation des données - L'organisation doit définir et documenter ses critères pour sélectionner les préparations de données et les méthodes de préparation de données à utiliser.",
    tags: ["annexe-a", "a7", "données", "data-quality"]
  },

  // Annex A Controls - A.9 Use of AI systems
  {
    id: "iso42001-annexa-a9-use",
    moduleId: "iso-42001",
    type: "requirement",
    topic: "Annexe A.9 : Utilisation des systèmes IA",
    body: "Objectif : S'assurer que l'organisation utilise les systèmes IA de manière responsable et selon les politiques organisationnelles. Contrôles principaux : A.9.2 Processus pour l'utilisation responsable de systèmes IA - L'organisation doit définir et documenter les processus pour l'utilisation responsable de systèmes IA. A.9.3 Objectifs pour l'utilisation responsable de systèmes IA - L'organisation doit identifier et documenter les objectifs pour guider l'utilisation responsable de systèmes IA. A.9.4 Utilisation prévue du système IA - L'organisation doit s'assurer que le système IA est utilisé conformément aux utilisations prévues du système IA et sa documentation accompagnante.",
    tags: ["annexe-a", "a9", "utilisation", "usage-responsable"]
  },

  // Annex A Controls - A.10 Third-party and customer relationships
  {
    id: "iso42001-annexa-a10-third-parties",
    moduleId: "iso-42001",
    type: "requirement",
    topic: "Annexe A.10 : Relations avec les tiers et clients",
    body: "Objectif : S'assurer que l'organisation comprend ses responsabilités et reste responsable, et que les risques sont appropriés quand des tiers sont impliqués à toute étape du cycle de vie du système IA. Contrôles principaux : A.10.2 Allocation de responsabilités - L'organisation doit s'assurer que les responsabilités au sein de leur cycle de vie de système IA sont allouées entre l'organisation, ses partenaires, fournisseurs, clients et tiers. A.10.3 Fournisseurs - L'organisation doit établir un processus pour s'assurer que son utilisation de services, produits ou matériels fournis par les fournisseurs s'aligne avec l'approche de l'organisation pour le développement et l'utilisation responsables de systèmes IA. A.10.4 Clients - L'organisation doit s'assurer que son approche responsable pour le développement et l'utilisation de systèmes IA considère les attentes et besoins de ses clients.",
    tags: ["annexe-a", "a10", "tiers", "fournisseurs", "clients"]
  },

  // FORMATIONS SÛRETÉ – RÉFÉRENTIEL 11.2.x
  {
    id: "surete-contexte-reglementaire",
    moduleId: "surete-112x",
    type: "concept",
    topic: "Contexte réglementaire de la sûreté aérienne",
    body: "Les formations de sûreté aérienne sont régies par le Règlement (UE) 2015/1998 de la Commission du 5 novembre 2015 et l'arrêté français du 21 septembre 2012. Ces textes définissent les exigences de formation pour tout personnel ayant accès aux zones de sûreté à accès réglementé (ZSAR) ou effectuant des contrôles de sûreté. Les modules 11.2.x constituent le référentiel de formation obligatoire pour garantir la sécurité du transport aérien face aux menaces terroristes et actes d'interférence illicite.",
    tags: ["réglementation", "ue-2015-1998", "sûreté-aérienne", "formation-obligatoire"]
  },
  {
    id: "surete-zones-reglementees",
    moduleId: "surete-112x",
    type: "concept",
    topic: "Zones de sûreté à accès réglementé (ZSAR/ZES)",
    body: "ZSAR (Zone de Sûreté à Accès Réglementé) : zones côté piste où l'accès est strictement contrôlé et soumis à autorisation préalable. Seules les personnes munies d'un titre de circulation et ayant suivi une formation sûreté peuvent y accéder. ZES (Zone d'Exclusion de Sûreté) : zones encore plus sensibles avec des exigences de sûreté renforcées. L'accès à ces zones requiert des contrôles d'identité, de badges, et potentiellement des inspections visuelles ou physiques.",
    tags: ["zsar", "zes", "zones-réglementées", "contrôle-accès"]
  },

  // MODULE 11.2.2 — Contrôle d'accès et inspections visuelles
  {
    id: "surete-11-2-2-objectif",
    moduleId: "surete-112x",
    type: "requirement",
    topic: "MODULE 11.2.2 — Contrôle d'accès et inspections visuelles",
    body: "Objectif : Former les personnels chargés de contrôler les accès aux zones de sûreté, de vérifier l'identité et les autorisations, et d'effectuer des inspections visuelles basiques. Cette formation permet de tenir un poste de contrôle d'accès en zone ZSAR/ZES et de gérer les flux entrants et sortants en appliquant les protocoles de sûreté.",
    tags: ["11.2.2", "contrôle-accès", "inspection-visuelle", "objectif"]
  },
  {
    id: "surete-11-2-2-contenu",
    moduleId: "surete-112x",
    type: "checklist",
    topic: "Contenu formation 11.2.2 — Contrôle d'accès",
    body: "Contenu de la formation 11.2.2 : ✓ Notions fondamentales de sûreté de l'aviation civile, ✓ Typologie des zones réglementées (ZSAR, ZES), ✓ Vérification identité, badges, permissions, ✓ Authentification documentaire (CNI, passeport, titre de circulation), ✓ Gestion des flux entrants/sortants, ✓ Détection comportements suspects (nervosité, hésitation, incohérences), ✓ Procédures d'inspection visuelle des personnes et effets personnels, ✓ Gestion des situations non conformes (refus d'accès, escalade), ✓ Communication avec la CA (Compagnie Aérienne) / superviseur sûreté.",
    tags: ["11.2.2", "contenu-formation", "programme", "checklist"]
  },
  {
    id: "surete-11-2-2-competences",
    moduleId: "surete-112x",
    type: "concept",
    topic: "Compétences acquises — MODULE 11.2.2",
    body: "Compétences opérationnelles acquises à l'issue du MODULE 11.2.2 : ➤ Tenir un poste de contrôle d'accès en zone ZSAR/ZES, ➤ Refuser un accès illégitime en appliquant la réglementation, ➤ Appliquer les contrôles de premier niveau (identité, badge, autorisation), ➤ Réagir face à une anomalie ou suspicion (comportement suspect, document falsifié), ➤ Communiquer efficacement avec les autorités compétentes et superviseurs.",
    tags: ["11.2.2", "compétences", "opérationnel"]
  },

  // MODULE 11.2.3.9 — Contrôle de sûreté du fret & courrier
  {
    id: "surete-11-2-3-9-objectif",
    moduleId: "surete-112x",
    type: "requirement",
    topic: "MODULE 11.2.3.9 — Contrôle de sûreté du fret & courrier",
    body: "Objectif : Former les agents à inspecter, filtrer et sécuriser le fret aérien et le courrier, détecter les articles prohibés, et appliquer les méthodes de filtrage agréées. Cette formation est essentielle pour garantir la sûreté de la chaîne du fret aérien et prévenir l'introduction d'articles dangereux ou prohibés à bord des aéronefs.",
    tags: ["11.2.3.9", "fret", "courrier", "filtrage", "objectif"]
  },
  {
    id: "surete-ra-ca",
    moduleId: "surete-112x",
    type: "concept",
    topic: "RA/CA — Agent habilité et Chargeur connu",
    body: "RA (Regulated Agent / Agent Habilité) : entreprise agréée par l'autorité nationale pour appliquer des contrôles de sûreté du fret aérien selon la réglementation. Le RA est responsable de filtrer, sécuriser et documenter le fret avant remise à la compagnie aérienne. CA (Known Consignor / Chargeur Connu) : expéditeur dont les procédures de sûreté sont validées et qui peut remettre du fret sécurisé directement à un RA. Le statut RA/CA garantit la traçabilité et l'intégrité de la chaîne de sûreté du fret aérien.",
    tags: ["ra", "ca", "agent-habilité", "chargeur-connu", "fret-sécurisé"]
  },
  {
    id: "surete-methodes-filtrage",
    moduleId: "surete-112x",
    type: "tool",
    topic: "Méthodes de filtrage du fret agréées",
    body: "Méthodes de filtrage agréées pour le contrôle de sûreté du fret aérien : 🔎 Inspection visuelle : examen physique du colis, de l'emballage et du contenu, 📄 Vérification documentaire : cohérence entre documents de transport et contenu réel, 💥 ETD (Explosive Trace Detection) : détection de traces d'explosifs par prélèvement et analyse chimique, 🐕 EDD (Explosive Detection Dog) : chiens détecteurs d'explosifs certifiés, 🔬 X-ray : radiographie pour visualiser le contenu sans ouverture du colis. Le choix de la méthode dépend du type de fret, du niveau de risque et des équipements disponibles.",
    tags: ["filtrage", "etd", "edd", "x-ray", "méthodes", "inspection"]
  },
  {
    id: "surete-11-2-3-9-contenu",
    moduleId: "surete-112x",
    type: "checklist",
    topic: "Contenu formation 11.2.3.9 — Fret & courrier",
    body: "Contenu de la formation 11.2.3.9 : ✓ Règlementation UE & française sur le fret sécurisé, ✓ Chaîne de sûreté du fret aérien (de l'expéditeur à l'aéronef), ✓ Exigences RA/CA (Agent habilité / Chargeur connu), ✓ Méthodes de filtrage (inspection visuelle, vérification documentaire, ETD, EDD, X-ray), ✓ Reconnaissance des articles prohibés / dangereux (armes, explosifs, matières dangereuses), ✓ Manipulation & sécurisation des marchandises sensibles, ✓ Documentation et traçabilité des contrôles (certificats de sûreté), ✓ Gestion d'anomalies, suspicion, refus d'embarquement.",
    tags: ["11.2.3.9", "contenu-formation", "fret", "programme"]
  },
  {
    id: "surete-11-2-3-9-competences",
    moduleId: "surete-112x",
    type: "concept",
    topic: "Compétences acquises — MODULE 11.2.3.9",
    body: "Compétences opérationnelles acquises à l'issue du MODULE 11.2.3.9 : ➤ Contrôler et filtrer du fret aérien selon les méthodes agréées, ➤ Appliquer les méthodes de sûreté (ETD, EDD, X-ray, inspection visuelle), ➤ Identifier un colis suspect et appliquer les procédures appropriées, ➤ Garantir la chaîne sécurisée du fret (traçabilité, documentation, scellés), ➤ Documenter les contrôles de sûreté et gérer les non-conformités.",
    tags: ["11.2.3.9", "compétences", "filtrage-fret", "opérationnel"]
  },

  // MODULE 11.2.6.2 — Surveillance des zones sensibles & marchandises
  {
    id: "surete-11-2-6-2-objectif",
    moduleId: "surete-112x",
    type: "requirement",
    topic: "MODULE 11.2.6.2 — Surveillance zones sensibles & marchandises",
    body: "Objectif : Former le personnel chargé de surveiller les zones sensibles et marchandises pour prévenir les intrusions, sabotages et interférences illicites. Cette formation permet de réaliser des rondes de surveillance, contrôler l'intégrité des marchandises sensibles, et détecter les anomalies (scellés brisés, emballages altérés, positions inhabituelles).",
    tags: ["11.2.6.2", "surveillance", "zones-sensibles", "objectif"]
  },
  {
    id: "surete-11-2-6-2-contenu",
    moduleId: "surete-112x",
    type: "checklist",
    topic: "Contenu formation 11.2.6.2 — Surveillance",
    body: "Contenu de la formation 11.2.6.2 : ✓ Définition des zones critiques / sensibles (zones de stockage fret, zones ZSAR/ZES), ✓ Risques liés aux intrusions et manipulations frauduleuses, ✓ Sécurisation des zones de stockage (contrôle d'accès, périmètres, éclairage), ✓ Rondes de surveillance, points de contrôle, fréquences, ✓ Reconnaissance des anomalies (scellés brisés, emballages altérés, positions de marchandises modifiées), ✓ Gestion de la vigilance en environnement logistique, ✓ Processus d'alerte et remontées d'information, ✓ Protocoles en cas d'incident de sûreté.",
    tags: ["11.2.6.2", "contenu-formation", "surveillance", "programme"]
  },
  {
    id: "surete-11-2-6-2-competences",
    moduleId: "surete-112x",
    type: "concept",
    topic: "Compétences acquises — MODULE 11.2.6.2",
    body: "Compétences opérationnelles acquises à l'issue du MODULE 11.2.6.2 : ➤ Réaliser des rondes de surveillance et contrôles sûreté en zones sensibles, ➤ Détecter les anomalies sur marchandises sensibles (scellés, emballages, positions), ➤ Appliquer des mesures préventives contre les intrusions et manipulations, ➤ Alerter et remonter les incidents de sûreté selon les protocoles établis.",
    tags: ["11.2.6.2", "compétences", "surveillance", "opérationnel"]
  },

  // MODULE 11.2.3.10 — Supervision du contrôle de sûreté
  {
    id: "surete-11-2-3-10-objectif",
    moduleId: "surete-112x",
    type: "requirement",
    topic: "MODULE 11.2.3.10 — Supervision du contrôle de sûreté",
    body: "Objectif : Former les encadrants à superviser les équipes effectuant le contrôle de sûreté. Cette formation permet de garantir la qualité et la conformité des opérations de filtrage, de manager les incidents sûreté, et d'assurer le respect des protocoles. Le superviseur sûreté est garant de l'efficacité du dispositif de contrôle et de la remontée d'informations vers les autorités compétentes.",
    tags: ["11.2.3.10", "supervision", "management", "objectif"]
  },
  {
    id: "surete-11-2-3-10-contenu",
    moduleId: "surete-112x",
    type: "checklist",
    topic: "Contenu formation 11.2.3.10 — Supervision",
    body: "Contenu de la formation 11.2.3.10 : ✓ Cadre légal & responsabilités du superviseur sûreté, ✓ Contrôle qualité des opérations de sûreté (vérification de la conformité des contrôles), ✓ Vérification de la conformité des procédures de filtrage, ✓ Briefing / débriefing des équipes sûreté, ✓ Gestion des incidents de sûreté / escalade vers autorités, ✓ Rédaction de rapports & traçabilité des opérations de sûreté, ✓ Analyse des écarts / mise en place d'actions correctives, ✓ Conduite d'audits internes sûreté, ✓ Gestion des comportements non conformes des agents.",
    tags: ["11.2.3.10", "contenu-formation", "supervision", "programme"]
  },
  {
    id: "surete-11-2-3-10-competences",
    moduleId: "surete-112x",
    type: "concept",
    topic: "Compétences acquises — MODULE 11.2.3.10",
    body: "Compétences opérationnelles acquises à l'issue du MODULE 11.2.3.10 : ➤ Superviser une équipe de contrôle sûreté, ➤ Garantir la qualité et la conformité du filtrage des personnes et du fret, ➤ Manager les incidents de sûreté et gérer l'escalade, ➤ Assurer le respect des protocoles et procédures de sûreté, ➤ Réaliser des audits internes et mettre en place des actions correctives.",
    tags: ["11.2.3.10", "compétences", "supervision", "opérationnel"]
  },

  // MODULE 11.2.5 — Niveau de sûreté renforcé
  {
    id: "surete-11-2-5-objectif",
    moduleId: "surete-112x",
    type: "requirement",
    topic: "MODULE 11.2.5 — Niveau de sûreté renforcé",
    body: "Objectif : Former les personnels ayant besoin d'un niveau de connaissance élevé pour accéder à des zones très sensibles. Cette formation approfondit la compréhension du contexte géopolitique, de la menace terroriste, de l'analyse comportementale et des procédures de sûreté renforcées. Elle permet d'intervenir en zone à haute sensibilité et de gérer des situations d'urgence sûreté.",
    tags: ["11.2.5", "niveau-renforcé", "haute-sensibilité", "objectif"]
  },
  {
    id: "surete-11-2-5-contenu",
    moduleId: "surete-112x",
    type: "checklist",
    topic: "Contenu formation 11.2.5 — Niveau renforcé",
    body: "Contenu de la formation 11.2.5 : ✓ Contexte géopolitique & évolution de la menace terroriste, ✓ Analyse comportementale & détection de signaux faibles (profiling comportemental), ✓ Identification des incidents potentiels de sûreté, ✓ Risques intentionnels (sabotage, intrusion, corruption, espionnage), ✓ Procédures de sûreté niveau renforcé (fouilles approfondies, contrôles aléatoires), ✓ Gestion des situations d'urgence et de crise sûreté, ✓ Communication avec l'autorité compétente (DGAC, Préfecture), ✓ Protection des infrastructures / marchandises critiques, ✓ Lecture et application des plans de sûreté d'entreprise.",
    tags: ["11.2.5", "contenu-formation", "niveau-renforcé", "programme"]
  },
  {
    id: "surete-11-2-5-competences",
    moduleId: "surete-112x",
    type: "concept",
    topic: "Compétences acquises — MODULE 11.2.5",
    body: "Compétences opérationnelles acquises à l'issue du MODULE 11.2.5 : ➤ Accéder et opérer en zone très sensible avec niveau de sûreté renforcé, ➤ Détecter les comportements suspects via analyse comportementale, ➤ Gérer des incidents de sûreté de haut niveau, ➤ Appliquer des mesures de sûreté renforcées (fouilles, contrôles aléatoires, procédures d'urgence), ➤ Communiquer efficacement avec les autorités compétentes en situation de crise.",
    tags: ["11.2.5", "compétences", "niveau-renforcé", "opérationnel"]
  },

  // Avantage stratégique pour Vyxo Consult
  {
    id: "surete-avantage-vyxo",
    moduleId: "surete-112x",
    type: "concept",
    topic: "Avantage stratégique pour Vyxo Consult",
    body: "Détenir les compétences sur les formations sûreté 11.2.x offre à Vyxo Consult un avantage stratégique majeur : ✅ DIFFÉRENCIATION : proposer des missions QSE + Sûreté intégrées (approche unique sur le marché), ✅ NOUVELLES MISSIONS : audits sûreté aérienne, accompagnement certification RA/CA, formation des équipes sûreté clients, ✅ SECTEURS CIBLÉS : fret aérien, logistique internationale, aéroports, plateformes cargo, ✅ CONFORMITÉ : accompagner les clients dans la conformité au Règlement (UE) 2015/1998, ✅ OFFRES PREMIUM : packages 'Sûreté + GDP + ISO 9001' pour clients logistique pharma/fret aérien, ✅ LÉGITIMITÉ : expertise reconnue pour intervenir en zones sensibles ZSAR/ZES.",
    tags: ["vyxo-consult", "stratégie", "différenciation", "missions"]
  },
  {
    id: "surete-missions-vendables",
    moduleId: "surete-112x",
    type: "tool",
    topic: "Missions sûreté vendables par Vyxo Consult",
    body: "Exemples de missions sûreté que Vyxo Consult peut vendre grâce aux compétences 11.2.x : 🎯 Audit de conformité sûreté aérienne (conformité Règlement UE 2015/1998), 🎯 Accompagnement certification RA (Regulated Agent / Agent Habilité), 🎯 Élaboration de plans de sûreté d'entreprise, 🎯 Formation des équipes contrôle d'accès, filtrage fret, surveillance, 🎯 Évaluation des risques sûreté (analyse de menace, vulnérabilités), 🎯 Audits internes sûreté et préparation aux inspections DGAC, 🎯 Conseil en organisation sûreté (procédures, flux, zones sécurisées), 🎯 Offres intégrées QSE + Sûreté + GDP pour clients transport/logistique pharma, 🎯 Support conformité réglementaire sûreté pour plateformes cargo et aéroports.",
    tags: ["missions", "audit", "formation", "conseil", "ra-ca"]
  }
];

/**
 * Helper pour récupérer tous les items
 */
export function getAllItems(): KnowledgeItem[] {
  return knowledgeItems;
}

/**
 * Helper pour récupérer les items d'un module
 */
export function getItemsByModule(moduleId: string): KnowledgeItem[] {
  return knowledgeItems.filter(item => item.moduleId === moduleId);
}

/**
 * Helper pour récupérer les items par type
 */
export function getItemsByType(moduleId: string, type: KnowledgeItem['type']): KnowledgeItem[] {
  return knowledgeItems.filter(item => item.moduleId === moduleId && item.type === type);
}

/**
 * Helper pour rechercher dans les items
 */
export function searchItems(query: string, moduleId?: string): KnowledgeItem[] {
  const lowerQuery = query.toLowerCase();
  let items = knowledgeItems;

  if (moduleId) {
    items = items.filter(item => item.moduleId === moduleId);
  }

  return items.filter(item =>
    item.topic.toLowerCase().includes(lowerQuery) ||
    item.body.toLowerCase().includes(lowerQuery) ||
    item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Helper pour grouper les items par type
 */
export function groupItemsByType(moduleId: string): Record<KnowledgeItem['type'], KnowledgeItem[]> {
  const items = getItemsByModule(moduleId);
  return {
    concept: items.filter(i => i.type === 'concept'),
    requirement: items.filter(i => i.type === 'requirement'),
    checklist: items.filter(i => i.type === 'checklist'),
    tool: items.filter(i => i.type === 'tool'),
    risk: items.filter(i => i.type === 'risk'),
  };
}
