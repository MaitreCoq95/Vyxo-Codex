import { QuizQuestion } from "@/types/codex";

/**
 * Base de questions de quiz
 * Cette liste sera enrichie au fil du temps via l'API ChatGPT
 */
export const quizQuestions: QuizQuestion[] = [
  // ISO 9001
  {
    id: "q-iso9001-nc",
    moduleId: "iso-9001",
    difficulty: "easy",
    question: "Dans ISO 9001, que doit-on faire lorsqu'une non-conformité est détectée ?",
    choices: [
      "La corriger si on a le temps",
      "L'ignorer si le client ne s'en rend pas compte",
      "L'enregistrer, analyser les causes, définir et suivre des actions correctives",
      "En parler uniquement à la direction"
    ],
    correctIndex: 2,
    explanation: "La clause 10.2 exige d'enregistrer les non-conformités, d'analyser les causes, de mettre en œuvre des actions correctives et de vérifier leur efficacité.",
    tags: ["nc", "capa"]
  },
  {
    id: "q-iso9001-context",
    moduleId: "iso-9001",
    difficulty: "medium",
    question: "Quelle clause de l'ISO 9001 traite du contexte de l'organisme ?",
    choices: [
      "Clause 3",
      "Clause 4",
      "Clause 5",
      "Clause 6"
    ],
    correctIndex: 1,
    explanation: "La clause 4 de l'ISO 9001 traite du contexte de l'organisme, incluant les enjeux internes/externes et les parties intéressées.",
    tags: ["contexte", "clause-4"]
  },

  // GDP
  {
    id: "q-gdp-temp",
    moduleId: "gdp",
    difficulty: "medium",
    question: "Dans le cadre GDP, que doit-on faire en cas d'excursion de température pendant un transport ?",
    choices: [
      "Livrer quand même et ne rien dire",
      "Remettre le produit au froid et continuer sans analyse",
      "Documenter l'excursion, analyser l'impact produit et décider avec la qualité si le lot reste conforme",
      "Retourner systématiquement tous les produits au fabricant"
    ],
    correctIndex: 2,
    explanation: "Une excursion exige une investigation documentée, une analyse d'impact et une décision qualité justifiable (GDP, CEIV).",
    tags: ["excursion", "cold-chain"]
  },
  {
    id: "q-gdp-objective",
    moduleId: "gdp",
    difficulty: "easy",
    question: "Quel est l'objectif principal des Good Distribution Practices ?",
    choices: [
      "Réduire les coûts de transport",
      "Garantir la qualité et l'intégrité des médicaments tout au long de la distribution",
      "Accélérer les livraisons",
      "Simplifier la documentation"
    ],
    correctIndex: 1,
    explanation: "Les GDP visent à garantir que la qualité et l'intégrité des médicaments sont maintenues tout au long de la chaîne de distribution jusqu'au patient.",
    tags: ["gdp", "distribution"]
  },

  // CEIV Pharma
  {
    id: "q-ceiv-scope",
    moduleId: "ceiv-pharma",
    difficulty: "medium",
    question: "Que certifie principalement CEIV Pharma pour un opérateur de fret aérien ?",
    choices: [
      "Uniquement la qualité de la relation client",
      "La conformité aux GDP, aux exigences IATA TCR et la maîtrise de la chaîne du froid pour les produits pharma",
      "La rapidité de traitement de tout type de colis",
      "Le plus bas coût de transport"
    ],
    correctIndex: 1,
    explanation: "CEIV Pharma vise à harmoniser et élever le niveau de conformité GDP/IATA pour la chaîne logistique aérienne des produits de santé.",
    tags: ["ceiv", "iata", "gdp"]
  },

  // Cold Chain Packaging
  {
    id: "q-cold-chain-passive-vs-active",
    moduleId: "cold-chain-packaging",
    difficulty: "medium",
    question: "Quel est l'avantage principal d'un emballage actif par rapport à un emballage passif ?",
    choices: [
      "Il est toujours moins cher",
      "Il ne nécessite aucune qualification",
      "Il régule la température de manière autonome sur de longues durées",
      "Il ne nécessite aucun pré-conditionnement de la part des équipes"
    ],
    correctIndex: 2,
    explanation: "Les emballages actifs embarquent un système de régulation (batterie, compresseur) offrant une meilleure stabilité sur des trajets longs ou complexes.",
    tags: ["emballage-actif"]
  },
  {
    id: "q-cold-chain-passive",
    moduleId: "cold-chain-packaging",
    difficulty: "easy",
    question: "Sur quoi s'appuient principalement les emballages passifs ?",
    choices: [
      "Des batteries électriques",
      "L'isolation et des éléments frigorigènes pré-conditionnés (PCM)",
      "Un système de compresseur",
      "Des ventilateurs actifs"
    ],
    correctIndex: 1,
    explanation: "Les emballages passifs utilisent l'isolation thermique et des éléments frigorigènes comme les PCM (Phase Change Materials) ou gels.",
    tags: ["emballage-passif", "pcm"]
  },

  // ISO 14001
  {
    id: "q-iso14001-aspects",
    moduleId: "iso-14001",
    difficulty: "medium",
    question: "Que sont les 'aspects environnementaux' dans ISO 14001 ?",
    choices: [
      "Les audits environnementaux",
      "Les éléments des activités, produits ou services qui peuvent interagir avec l'environnement",
      "Les certifications obtenues",
      "Les sanctions environnementales"
    ],
    correctIndex: 1,
    explanation: "Les aspects environnementaux sont les éléments des activités de l'organisation (émissions, déchets, consommation) qui peuvent avoir un impact sur l'environnement.",
    tags: ["aspects", "environnement"]
  },

  // ISO 45001
  {
    id: "q-iso45001-duerp",
    moduleId: "iso-45001",
    difficulty: "medium",
    question: "Que signifie DUERP ?",
    choices: [
      "Document Unique d'Évaluation des Risques Professionnels",
      "Directive Unique d'Entreprise pour les Risques Potentiels",
      "Document d'Urgence et de Réponse aux Problèmes",
      "Dossier Universel d'Enregistrement des Risques Particuliers"
    ],
    correctIndex: 0,
    explanation: "Le DUERP est le Document Unique d'Évaluation des Risques Professionnels, obligatoire en France pour toute entreprise ayant au moins un salarié.",
    tags: ["duerp", "sst"]
  },

  // GAMP 5
  {
    id: "q-gamp5-purpose",
    moduleId: "gamp-5",
    difficulty: "medium",
    question: "Quel est le principe fondamental de GAMP 5 ?",
    choices: [
      "Valider tous les systèmes de la même manière",
      "Adapter l'effort de validation en fonction du risque et de la catégorie du système",
      "Ne valider que les systèmes critiques",
      "Externaliser toutes les validations"
    ],
    correctIndex: 1,
    explanation: "GAMP 5 préconise une approche basée sur les risques, adaptant l'effort de validation selon la catégorie du système et son impact sur la qualité produit.",
    tags: ["gamp5", "validation", "risque"]
  },

  // ISO 42001
  {
    id: "q-iso42001-definition",
    moduleId: "iso-42001",
    difficulty: "easy",
    question: "Qu'est-ce que l'ISO 42001 ?",
    choices: [
      "Une norme sur la cybersécurité",
      "Une norme sur les systèmes de management de l'intelligence artificielle",
      "Une norme sur la gestion de la qualité",
      "Une norme sur la protection des données personnelles"
    ],
    correctIndex: 1,
    explanation: "L'ISO 42001 est la première norme internationale sur les systèmes de management de l'intelligence artificielle (AIMS), publiée en décembre 2023.",
    tags: ["definition", "aims", "base"]
  },
  {
    id: "q-iso42001-objectif",
    moduleId: "iso-42001",
    difficulty: "easy",
    question: "Quel est l'objectif principal de l'ISO 42001 ?",
    choices: [
      "Développer des algorithmes plus performants",
      "Garantir une utilisation responsable et éthique de l'IA",
      "Réduire les coûts de développement IA",
      "Accélérer le déploiement des systèmes IA"
    ],
    correctIndex: 1,
    explanation: "L'ISO 42001 vise à établir un cadre de gouvernance pour une utilisation responsable de l'IA, gérer les risques associés et assurer la conformité réglementaire.",
    tags: ["objectif", "éthique", "gouvernance"]
  },
  {
    id: "q-iso42001-biais",
    moduleId: "iso-42001",
    difficulty: "medium",
    question: "Que sont les biais algorithmiques dans le contexte de l'ISO 42001 ?",
    choices: [
      "Des erreurs de programmation dans le code",
      "Des distorsions systématiques qui peuvent mener à des discriminations injustes",
      "Des bugs dans les algorithmes",
      "Des ralentissements de performance"
    ],
    correctIndex: 1,
    explanation: "Les biais algorithmiques sont des distorsions systématiques qui peuvent provenir des données d'entraînement ou de la conception du modèle, et peuvent conduire à des discriminations injustes envers certains groupes.",
    tags: ["biais", "discrimination", "équité"]
  },
  {
    id: "q-iso42001-transparence",
    moduleId: "iso-42001",
    difficulty: "medium",
    question: "Pourquoi l'explicabilité des systèmes IA est-elle importante selon l'ISO 42001 ?",
    choices: [
      "Pour accélérer les calculs",
      "Pour permettre de comprendre et justifier les décisions prises par l'IA, notamment pour les décisions critiques",
      "Pour réduire la consommation énergétique",
      "Pour faciliter la programmation"
    ],
    correctIndex: 1,
    explanation: "L'explicabilité (XAI - Explainable AI) permet de comprendre comment l'IA arrive à ses décisions, ce qui est essentiel pour la confiance, la responsabilité et la conformité, particulièrement pour les décisions à fort impact.",
    tags: ["explicabilité", "transparence", "xai"]
  },
  {
    id: "q-iso42001-registre",
    moduleId: "iso-42001",
    difficulty: "medium",
    question: "Que doit contenir un registre des systèmes IA selon l'ISO 42001 ?",
    choices: [
      "Uniquement le code source des algorithmes",
      "Uniquement les performances des modèles",
      "L'inventaire complet des systèmes avec description, criticité, données, responsables et évaluations",
      "Uniquement les coûts de développement"
    ],
    correctIndex: 2,
    explanation: "Le registre des systèmes IA doit répertorier tous les systèmes avec leurs caractéristiques, niveau de criticité, données utilisées, responsables, statut et résultats des évaluations de risques.",
    tags: ["registre", "inventaire", "documentation"]
  },
  {
    id: "q-iso42001-risques",
    moduleId: "iso-42001",
    difficulty: "medium",
    question: "Parmi les risques suivants, lequel est spécifique aux systèmes d'IA ?",
    choices: [
      "Les cyberattaques",
      "Les hallucinations (génération de fausses informations plausibles)",
      "Les pannes matérielles",
      "Les erreurs de saisie utilisateur"
    ],
    correctIndex: 1,
    explanation: "Les hallucinations sont un risque spécifique aux systèmes d'IA, particulièrement les LLM (Large Language Models), où le modèle génère des informations qui semblent plausibles mais qui sont factuellement incorrectes.",
    tags: ["risques", "hallucinations", "llm"]
  },
  {
    id: "q-iso42001-cycle-vie",
    moduleId: "iso-42001",
    difficulty: "hard",
    question: "Quelle phase du cycle de vie IA est critique pour détecter le 'model drift' ?",
    choices: [
      "La conception initiale",
      "L'entraînement du modèle",
      "La surveillance continue en production",
      "La collecte des données"
    ],
    correctIndex: 2,
    explanation: "Le model drift (dérive du modèle) se produit lorsque les performances d'un modèle IA se dégradent au fil du temps en production, souvent parce que les données réelles évoluent. La surveillance continue est essentielle pour le détecter et y remédier.",
    tags: ["cycle-de-vie", "drift", "surveillance", "production"]
  },
  {
    id: "q-iso42001-gouvernance",
    moduleId: "iso-42001",
    difficulty: "medium",
    question: "Qui doit être impliqué dans la gouvernance des systèmes IA selon l'ISO 42001 ?",
    choices: [
      "Uniquement les data scientists",
      "Uniquement la direction",
      "Un comité pluridisciplinaire incluant direction, experts IA, experts métier, responsables éthique et conformité",
      "Uniquement les développeurs"
    ],
    correctIndex: 2,
    explanation: "L'ISO 42001 exige une gouvernance pluridisciplinaire avec des rôles clairs : comité de gouvernance IA, responsable IA, data scientists, experts métier, responsables éthique et conformité, avec l'engagement de la direction.",
    tags: ["gouvernance", "rôles", "multidisciplinaire"]
  },
  {
    id: "q-iso42001-data-quality",
    moduleId: "iso-42001",
    difficulty: "hard",
    question: "Un modèle d'IA de recrutement a été entraîné sur 10 ans d'historique de CV acceptés. Quel risque principal doit être évalué selon l'ISO 42001 ?",
    choices: [
      "Le modèle sera trop lent",
      "Le modèle pourrait reproduire des biais historiques de discrimination présents dans les données d'entraînement",
      "Le modèle nécessitera trop de mémoire",
      "Le modèle sera trop complexe à programmer"
    ],
    correctIndex: 1,
    explanation: "Si les données historiques contiennent des biais (par exemple, discrimination de genre ou d'origine dans les recrutements passés), le modèle IA apprendra et reproduira ces biais. L'ISO 42001 exige d'identifier et d'atténuer ces risques de discrimination algorithmique.",
    tags: ["biais", "données", "discrimination", "cas-pratique"]
  },
  {
    id: "q-iso42001-monitoring",
    moduleId: "iso-42001",
    difficulty: "hard",
    question: "Quelles métriques doivent être surveillées en production pour un système IA selon l'ISO 42001 ?",
    choices: [
      "Uniquement la précision (accuracy) du modèle",
      "Uniquement le temps de réponse",
      "Performance, équité (fairness), fiabilité, détection de drift, anomalies de sécurité",
      "Uniquement les coûts d'infrastructure"
    ],
    correctIndex: 2,
    explanation: "L'ISO 42001 exige une surveillance multidimensionnelle : performance technique (précision, rappel), équité (absence de biais), fiabilité, détection de drift, anomalies dans les entrées et incidents de sécurité.",
    tags: ["monitoring", "métriques", "performance", "équité"]
  },

  // Clause 4 : Contexte de l'organisation
  {
    id: "q-iso42001-clause4-context",
    moduleId: "iso-42001",
    difficulty: "medium",
    question: "Selon la clause 4 de l'ISO 42001, quels enjeux externes doivent être analysés pour un AIMS ?",
    choices: [
      "Uniquement les concurrents directs",
      "Uniquement les technologies disponibles",
      "Les exigences légales (RGPD, AI Act), les régulateurs, les valeurs éthiques, le paysage concurrentiel et le changement climatique si pertinent",
      "Uniquement les fournisseurs de cloud"
    ],
    correctIndex: 2,
    explanation: "La clause 4 exige d'identifier les enjeux externes pertinents incluant : exigences légales (RGPD, AI Act), politiques des régulateurs, valeurs culturelles et éthiques, concurrence, tendances IA, et changement climatique si applicable.",
    tags: ["clause-4", "contexte", "enjeux-externes", "réglementation"]
  },
  {
    id: "q-iso42001-clause4-parties",
    moduleId: "iso-42001",
    difficulty: "easy",
    question: "Qui sont les parties intéressées à considérer dans un AIMS selon la clause 4 ?",
    choices: [
      "Uniquement les actionnaires",
      "Uniquement les clients",
      "Clients, utilisateurs finaux, régulateurs, fournisseurs, partenaires, employés, communautés affectées, ONG, syndicats",
      "Uniquement les développeurs IA"
    ],
    correctIndex: 2,
    explanation: "L'ISO 42001 clause 4.2 exige d'identifier toutes les parties intéressées pertinentes : clients, utilisateurs finaux, régulateurs, fournisseurs, employés, communautés impactées, ONG, syndicats, etc., et leurs exigences.",
    tags: ["clause-4", "parties-intéressées", "stakeholders"]
  },
  {
    id: "q-iso42001-clause4-scope",
    moduleId: "iso-42001",
    difficulty: "medium",
    question: "Que doit inclure le périmètre (scope) d'un AIMS selon la clause 4.3 ?",
    choices: [
      "Uniquement les systèmes IA déjà en production",
      "Les limites physiques et organisationnelles, les activités/produits/services incluant l'IA, et les justifications d'exclusions",
      "Uniquement les nouveaux projets IA",
      "Uniquement les systèmes IA critiques"
    ],
    correctIndex: 1,
    explanation: "La clause 4.3 exige de documenter clairement le périmètre de l'AIMS avec : les limites physiques et organisationnelles, les activités/produits/services incluant l'IA, et toute justification pour les exclusions du périmètre.",
    tags: ["clause-4", "périmètre", "scope"]
  },

  // Clause 5 : Leadership
  {
    id: "q-iso42001-clause5-engagement",
    moduleId: "iso-42001",
    difficulty: "easy",
    question: "Selon la clause 5, quel est le rôle de la direction dans un AIMS ?",
    choices: [
      "Déléguer entièrement la gestion IA aux data scientists",
      "Seulement approuver le budget",
      "Démontrer son engagement : établir la politique IA, allouer les ressources, promouvoir l'amélioration continue et assurer l'intégration dans les processus métier",
      "Seulement signer les documents"
    ],
    correctIndex: 2,
    explanation: "La clause 5.1 exige que la direction démontre son leadership et engagement en établissant la politique IA, en allouant les ressources nécessaires, en promouvant l'amélioration continue et en assurant l'intégration de l'AIMS dans les processus métier.",
    tags: ["clause-5", "leadership", "engagement-direction"]
  },
  {
    id: "q-iso42001-clause5-politique",
    moduleId: "iso-42001",
    difficulty: "medium",
    question: "Que doit contenir la politique IA selon la clause 5.2 de l'ISO 42001 ?",
    choices: [
      "Uniquement les objectifs techniques",
      "L'engagement d'utiliser l'IA, de satisfaire les exigences applicables, d'améliorer continuellement l'AIMS, et être adaptée au contexte de l'organisation",
      "Uniquement les règles de sécurité informatique",
      "Uniquement la liste des outils IA autorisés"
    ],
    correctIndex: 1,
    explanation: "La clause 5.2 exige que la politique IA : soit adaptée au contexte de l'organisation, fournisse un cadre pour les objectifs IA, inclue l'engagement de satisfaire les exigences applicables, et d'améliorer continuellement l'AIMS.",
    tags: ["clause-5", "politique-ia", "politique"]
  },
  {
    id: "q-iso42001-clause5-roles",
    moduleId: "iso-42001",
    difficulty: "hard",
    question: "Votre organisation lance un AIMS. Qui doit être responsable de l'évaluation des risques IA selon la clause 5.3 ?",
    choices: [
      "N'importe qui dans l'équipe IT",
      "Uniquement le responsable sécurité",
      "Des rôles et responsabilités clairement assignés et documentés, avec l'autorité appropriée pour gérer l'AIMS et rapporter à la direction",
      "Uniquement les consultants externes"
    ],
    correctIndex: 2,
    explanation: "La clause 5.3 exige que la direction assigne les rôles, responsabilités et autorités pour l'AIMS. Les responsabilités doivent être clairement documentées, avec l'autorité appropriée pour gérer les risques IA et rapporter les performances de l'AIMS à la direction.",
    tags: ["clause-5", "rôles", "responsabilités", "cas-pratique"]
  },

  // Clause 6 : Planification
  {
    id: "q-iso42001-clause6-risques-opportunites",
    moduleId: "iso-42001",
    difficulty: "medium",
    question: "Selon la clause 6.1, que doit faire l'organisation avec les risques et opportunités liés à l'AIMS ?",
    choices: [
      "Les ignorer si les systèmes IA fonctionnent bien",
      "Les identifier, les évaluer et planifier des actions pour y répondre, tout en évaluant l'efficacité de ces actions",
      "Les documenter une seule fois lors de la certification",
      "Les traiter uniquement après un incident"
    ],
    correctIndex: 1,
    explanation: "La clause 6.1 exige que l'organisation détermine les risques et opportunités à traiter pour : assurer que l'AIMS atteigne ses résultats escomptés, prévenir/réduire les effets indésirables, et atteindre l'amélioration continue. Des actions doivent être planifiées et leur efficacité évaluée.",
    tags: ["clause-6", "risques", "opportunités", "planification"]
  },
  {
    id: "q-iso42001-clause6-objectives",
    moduleId: "iso-42001",
    difficulty: "easy",
    question: "Les objectifs IA définis dans la clause 6.2 doivent-ils être mesurables ?",
    choices: [
      "Non, ils peuvent rester qualitatifs",
      "Oui, ils doivent être mesurables, surveillés, communiqués et mis à jour",
      "Uniquement pour les grandes organisations",
      "Uniquement si exigé par les régulateurs"
    ],
    correctIndex: 1,
    explanation: "La clause 6.2 exige que les objectifs IA soient : cohérents avec la politique IA, mesurables, surveillés, communiqués aux personnes pertinentes, et mis à jour selon les besoins.",
    tags: ["clause-6", "objectifs", "mesurables"]
  },
  {
    id: "q-iso42001-ai-risk-assessment",
    moduleId: "iso-42001",
    difficulty: "hard",
    question: "Un système IA de recommandation de crédits est en cours de développement. Selon le processus d'évaluation des risques IA (clause 6.1.2), que faut-il analyser ?",
    choices: [
      "Uniquement les risques techniques (pannes serveur)",
      "Les conséquences potentielles pour l'organisation, les individus et la société, la probabilité des risques, et les niveaux de risque par rapport aux critères établis",
      "Uniquement les coûts de développement",
      "Uniquement la conformité RGPD"
    ],
    correctIndex: 1,
    explanation: "Le processus d'évaluation des risques IA doit : identifier les risques qui aident ou empêchent d'atteindre les objectifs, analyser en évaluant les conséquences pour l'organisation/individus/société ET la probabilité, déterminer les niveaux de risque, puis comparer aux critères et prioriser pour traitement.",
    tags: ["clause-6", "évaluation-risques", "risk-assessment", "cas-pratique"]
  },
  {
    id: "q-iso42001-ai-risk-treatment",
    moduleId: "iso-42001",
    difficulty: "medium",
    question: "Quelles sont les options de traitement des risques IA selon l'ISO 42001 ?",
    choices: [
      "Uniquement accepter ou transférer les risques",
      "Éviter, réduire, transférer ou accepter les risques, avec documentation des décisions",
      "Uniquement réduire les risques par des contrôles techniques",
      "Uniquement acheter des assurances"
    ],
    correctIndex: 1,
    explanation: "Le traitement des risques IA peut inclure : éviter le risque (ne pas développer/déployer), réduire le risque (contrôles techniques/organisationnels), transférer le risque (assurance, contractualisation), ou accepter le risque (décision documentée avec justification).",
    tags: ["clause-6", "traitement-risques", "risk-treatment"]
  },
  {
    id: "q-iso42001-ai-impact-assessment",
    moduleId: "iso-42001",
    difficulty: "hard",
    question: "Votre organisation développe un système IA de reconnaissance faciale pour contrôle d'accès. Que doit inclure l'AI System Impact Assessment selon la clause 6.1.3 ?",
    choices: [
      "Uniquement le coût du projet",
      "Uniquement les performances techniques",
      "L'évaluation des impacts négatifs sur les droits humains, la démocratie, l'environnement et la société, avec des mesures d'atténuation appropriées",
      "Uniquement la conformité légale"
    ],
    correctIndex: 2,
    explanation: "L'AI System Impact Assessment doit évaluer les impacts négatifs potentiels sur : les droits fondamentaux (vie privée, non-discrimination), la démocratie et les processus démocratiques, l'environnement (consommation énergétique), et la société. Des mesures d'atténuation doivent être identifiées et documentées.",
    tags: ["clause-6", "impact-assessment", "évaluation-impact", "droits-humains", "cas-pratique"]
  },

  // Clause 7 : Support
  {
    id: "q-iso42001-clause7-resources",
    moduleId: "iso-42001",
    difficulty: "easy",
    question: "Selon la clause 7.1, quels types de ressources doivent être déterminées et fournies pour l'AIMS ?",
    choices: [
      "Uniquement le budget informatique",
      "Uniquement les serveurs GPU",
      "Ressources humaines, infrastructure, environnement de travail et ressources de surveillance/mesure",
      "Uniquement les licences logicielles"
    ],
    correctIndex: 2,
    explanation: "La clause 7.1 exige de déterminer et fournir les ressources nécessaires : personnes compétentes, infrastructure (GPU, stockage, cloud), environnement de travail approprié, et ressources pour la surveillance et mesure des performances.",
    tags: ["clause-7", "ressources", "infrastructure"]
  },
  {
    id: "q-iso42001-clause7-competence",
    moduleId: "iso-42001",
    difficulty: "medium",
    question: "Un nouveau data scientist rejoint l'équipe IA. Que doit faire l'organisation selon la clause 7.2 ?",
    choices: [
      "Lui donner uniquement accès aux outils IA",
      "Déterminer les compétences nécessaires, s'assurer qu'il est compétent, fournir la formation si nécessaire, et conserver des preuves de compétence",
      "Uniquement vérifier son diplôme",
      "Attendre qu'il apprenne sur le tas"
    ],
    correctIndex: 1,
    explanation: "La clause 7.2 exige que l'organisation : détermine les compétences nécessaires pour les personnes affectant les performances de l'AIMS, s'assure qu'elles sont compétentes (éducation, formation, expérience), prenne des actions pour acquérir les compétences manquantes (formation, mentorat), et conserve les informations documentées comme preuves.",
    tags: ["clause-7", "compétence", "formation", "cas-pratique"]
  },
  {
    id: "q-iso42001-clause7-awareness",
    moduleId: "iso-42001",
    difficulty: "medium",
    question: "Selon la clause 7.3, de quoi les personnes travaillant sous le contrôle de l'organisation doivent-elles être sensibilisées ?",
    choices: [
      "Uniquement des procédures informatiques",
      "De la politique IA, de leur contribution à l'efficacité de l'AIMS, des bénéfices d'améliorer les performances, et des implications de non-conformité",
      "Uniquement des horaires de travail",
      "Uniquement des outils utilisés"
    ],
    correctIndex: 1,
    explanation: "La clause 7.3 exige que les personnes soient sensibilisées à : la politique IA, les objectifs IA pertinents pour eux, leur contribution à l'efficacité de l'AIMS (y compris les bénéfices d'améliorer les performances), et les implications de ne pas se conformer aux exigences de l'AIMS.",
    tags: ["clause-7", "sensibilisation", "awareness"]
  },
  {
    id: "q-iso42001-clause7-communication",
    moduleId: "iso-42001",
    difficulty: "easy",
    question: "La clause 7.4 exige-t-elle de définir un processus de communication pour l'AIMS ?",
    choices: [
      "Non, la communication est informelle",
      "Oui, incluant quoi communiquer, quand, à qui, comment et qui communique",
      "Uniquement pour les grandes organisations",
      "Uniquement pour les incidents"
    ],
    correctIndex: 1,
    explanation: "La clause 7.4 exige que l'organisation détermine les besoins de communication interne et externe pertinents pour l'AIMS, incluant : sur quoi communiquer, quand communiquer, avec qui communiquer, comment communiquer, et qui communique.",
    tags: ["clause-7", "communication", "processus"]
  },
  {
    id: "q-iso42001-clause7-documentation",
    moduleId: "iso-42001",
    difficulty: "medium",
    question: "Que doit inclure l'information documentée exigée par la clause 7.5 ?",
    choices: [
      "Uniquement le manuel qualité",
      "Celle exigée par la norme ET celle déterminée par l'organisation comme nécessaire pour l'efficacité de l'AIMS",
      "Uniquement les procédures obligatoires",
      "Uniquement les enregistrements d'audit"
    ],
    correctIndex: 1,
    explanation: "La clause 7.5 exige que l'AIMS inclue l'information documentée : exigée par l'ISO 42001 ET déterminée par l'organisation comme nécessaire pour l'efficacité de l'AIMS. Elle doit être contrôlée pour assurer disponibilité, protection et maîtrise des modifications.",
    tags: ["clause-7", "documentation", "informations-documentées"]
  },

  // Clause 8 : Opération
  {
    id: "q-iso42001-clause8-operational-planning",
    moduleId: "iso-42001",
    difficulty: "medium",
    question: "Selon la clause 8.1, que doit faire l'organisation avant de déployer un nouveau système IA ?",
    choices: [
      "Uniquement tester les fonctionnalités de base",
      "Planifier, implémenter et maîtriser les processus nécessaires pour satisfaire les exigences et mettre en œuvre les actions de traitement des risques",
      "Uniquement obtenir l'approbation budgétaire",
      "Uniquement former les utilisateurs finaux"
    ],
    correctIndex: 1,
    explanation: "La clause 8.1 exige de planifier, implémenter et maîtriser les processus nécessaires pour : satisfaire les exigences de l'AIMS, mettre en œuvre les actions déterminées (traitement des risques, objectifs), établir des critères pour les processus, et maîtriser les modifications planifiées.",
    tags: ["clause-8", "planification-opérationnelle", "déploiement"]
  },
  {
    id: "q-iso42001-clause8-impact-new-system",
    moduleId: "iso-42001",
    difficulty: "hard",
    question: "Votre entreprise veut déployer un chatbot IA pour le service client. Selon la clause 8.2, que doit inclure l'AI System Impact Assessment avant déploiement ?",
    choices: [
      "Uniquement le ROI financier",
      "L'objectif du système, l'évaluation des risques IA, l'analyse des impacts (droits, démocratie, environnement, société), les mesures d'atténuation et les métriques de surveillance",
      "Uniquement les tests de performance technique",
      "Uniquement l'avis des développeurs"
    ],
    correctIndex: 1,
    explanation: "La clause 8.2 exige que l'AI System Impact Assessment inclue : l'objectif et le contexte, l'évaluation des risques IA, l'analyse des impacts négatifs potentiels (droits fondamentaux, démocratie, environnement, société), les mesures d'atténuation appropriées, et les métriques de surveillance pour les impacts identifiés.",
    tags: ["clause-8", "impact-assessment", "déploiement", "chatbot", "cas-pratique"]
  },
  {
    id: "q-iso42001-clause8-external-providers",
    moduleId: "iso-42001",
    difficulty: "medium",
    question: "Votre organisation utilise une API IA fournie par un tiers. Selon la clause 8.3, que devez-vous faire ?",
    choices: [
      "Faire confiance au fournisseur sans vérification",
      "Déterminer et appliquer des critères d'évaluation, de sélection et de surveillance des fournisseurs externes",
      "Uniquement signer un contrat standard",
      "Uniquement vérifier le prix"
    ],
    correctIndex: 1,
    explanation: "La clause 8.3 exige que l'organisation détermine et applique des critères pour : l'évaluation et la sélection des fournisseurs externes (capacités IA, sécurité, éthique), et la surveillance de la performance des fournisseurs. Cela inclut l'évaluation des risques des services externalisés.",
    tags: ["clause-8", "fournisseurs-externes", "sous-traitance", "cas-pratique"]
  },

  // Clause 9 : Évaluation des performances
  {
    id: "q-iso42001-clause9-monitoring",
    moduleId: "iso-42001",
    difficulty: "easy",
    question: "Selon la clause 9.1, que doit surveiller l'organisation pour l'AIMS ?",
    choices: [
      "Uniquement les coûts",
      "Les performances de l'AIMS, l'efficacité des contrôles, la conformité aux exigences et l'efficacité du traitement des risques",
      "Uniquement les temps de réponse des systèmes",
      "Uniquement les réclamations clients"
    ],
    correctIndex: 1,
    explanation: "La clause 9.1 exige de déterminer : ce qui doit être surveillé et mesuré (performances AIMS, efficacité des contrôles, conformité, traitement des risques), les méthodes de surveillance/mesure/analyse/évaluation, quand surveiller et mesurer, quand analyser et évaluer les résultats.",
    tags: ["clause-9", "surveillance", "monitoring", "performance"]
  },
  {
    id: "q-iso42001-clause9-audit",
    moduleId: "iso-42001",
    difficulty: "medium",
    question: "À quelle fréquence doivent être réalisés les audits internes de l'AIMS selon la clause 9.2 ?",
    choices: [
      "Une fois par an obligatoirement",
      "À des intervalles planifiés pour déterminer si l'AIMS est conforme et efficacement mis en œuvre et maintenu",
      "Uniquement avant l'audit de certification",
      "Uniquement en cas de problème"
    ],
    correctIndex: 1,
    explanation: "La clause 9.2 exige de réaliser des audits internes à intervalles planifiés pour vérifier que l'AIMS : est conforme aux exigences de l'organisation et de l'ISO 42001, est efficacement mis en œuvre et maintenu. La fréquence dépend de l'importance des processus et des résultats d'audits précédents.",
    tags: ["clause-9", "audit-interne", "conformité"]
  },
  {
    id: "q-iso42001-clause9-management-review",
    moduleId: "iso-42001",
    difficulty: "hard",
    question: "Votre direction réalise la revue de direction annuelle de l'AIMS. Selon la clause 9.3, quels éléments d'entrée sont obligatoires ?",
    choices: [
      "Uniquement le budget de l'année suivante",
      "Uniquement les résultats d'audits",
      "Le statut des actions des revues précédentes, les changements de contexte, les performances et efficacité de l'AIMS, les retours des parties intéressées, les résultats d'audits, les non-conformités, les résultats de surveillance, les objectifs atteints, les risques et opportunités, les opportunités d'amélioration",
      "Uniquement les nouvelles réglementations"
    ],
    correctIndex: 2,
    explanation: "La clause 9.3 exige que la revue de direction considère : le statut des actions des revues précédentes, les changements dans les enjeux externes/internes et les exigences des parties intéressées, les performances et l'efficacité de l'AIMS, les retours des parties intéressées, les résultats d'évaluation des risques, les résultats d'audits, les non-conformités et actions correctives, les résultats de surveillance et mesure, la réalisation des objectifs, les opportunités d'amélioration continue.",
    tags: ["clause-9", "revue-direction", "management-review"]
  },

  // Clause 10 : Amélioration
  {
    id: "q-iso42001-clause10-nonconformity",
    moduleId: "iso-42001",
    difficulty: "medium",
    question: "Un audit interne révèle qu'un système IA en production n'a pas d'évaluation des risques documentée. Selon la clause 10.1, que doit faire l'organisation ?",
    choices: [
      "Ignorer si le système fonctionne bien",
      "Attendre le prochain audit",
      "Réagir immédiatement, évaluer les actions correctives, mettre en œuvre les actions nécessaires, examiner l'efficacité et modifier l'AIMS si nécessaire",
      "Uniquement documenter le constat"
    ],
    correctIndex: 2,
    explanation: "La clause 10.1 exige que lors d'une non-conformité, l'organisation : réagisse et prenne des actions pour la maîtriser et corriger, évalue le besoin d'actions pour éliminer les causes (pour éviter la récurrence), mette en œuvre toute action nécessaire, examine l'efficacité des actions correctives, et modifie l'AIMS si nécessaire.",
    tags: ["clause-10", "non-conformité", "actions-correctives", "cas-pratique"]
  },
  {
    id: "q-iso42001-clause10-improvement",
    moduleId: "iso-42001",
    difficulty: "easy",
    question: "Selon la clause 10.2, l'organisation doit-elle chercher à améliorer continuellement l'AIMS ?",
    choices: [
      "Non, uniquement lors des audits",
      "Oui, en améliorant continuellement la pertinence, l'adéquation et l'efficacité de l'AIMS",
      "Uniquement si exigé par les clients",
      "Uniquement tous les 3 ans"
    ],
    correctIndex: 1,
    explanation: "La clause 10.2 exige que l'organisation améliore continuellement la pertinence, l'adéquation et l'efficacité de l'AIMS. Cela inclut l'amélioration des processus, des contrôles, et des performances globales du système de management de l'IA.",
    tags: ["clause-10", "amélioration-continue", "efficacité"]
  },

  // Annex A Controls
  {
    id: "q-iso42001-annexa-a2-policies",
    moduleId: "iso-42001",
    difficulty: "medium",
    question: "Selon l'Annexe A.2, quels sujets doivent être couverts par les politiques de sécurité de l'information pour l'IA ?",
    choices: [
      "Uniquement les mots de passe",
      "Uniquement le chiffrement des données",
      "Sécurité de l'information, classification et traitement de l'information, sécurité des ressources humaines, contrôle d'accès, sécurité opérationnelle et communications",
      "Uniquement les sauvegardes"
    ],
    correctIndex: 2,
    explanation: "L'Annexe A.2 exige des politiques couvrant : sécurité de l'information (A.2.1.1), classification et traitement de l'information (A.2.1.2), sécurité des ressources humaines (A.2.2), contrôle d'accès (A.2.3), sécurité opérationnelle (A.2.4), sécurité des communications (A.2.5).",
    tags: ["annexe-a", "a2", "politiques", "sécurité"]
  },
  {
    id: "q-iso42001-annexa-a3-governance",
    moduleId: "iso-42001",
    difficulty: "hard",
    question: "Votre organisation met en place la gouvernance IA selon l'Annexe A.3. Que doit documenter le contrôle A.3.1.1 sur la structure de gouvernance ?",
    choices: [
      "Uniquement l'organigramme informatique",
      "Les rôles, responsabilités et autorités pour l'utilisation de l'IA, incluant la direction et les personnes responsables de la sécurité de l'information et des systèmes IA",
      "Uniquement les budgets alloués",
      "Uniquement les outils utilisés"
    ],
    correctIndex: 1,
    explanation: "Le contrôle A.3.1.1 exige de documenter et attribuer les rôles, responsabilités et autorités pour l'utilisation de l'IA dans l'organisation, incluant spécifiquement les responsabilités de la direction et des personnes responsables de la sécurité de l'information et des systèmes IA.",
    tags: ["annexe-a", "a3", "gouvernance", "rôles", "cas-pratique"]
  },
  {
    id: "q-iso42001-annexa-a4-hr",
    moduleId: "iso-42001",
    difficulty: "easy",
    question: "Selon l'Annexe A.4, que doit-on vérifier avant d'embaucher une personne pour travailler sur des systèmes IA critiques ?",
    choices: [
      "Uniquement son diplôme",
      "Uniquement son CV",
      "Les vérifications d'antécédents (background checks) pour tous les candidats, proportionnellement aux exigences métier et aux risques",
      "Uniquement ses références"
    ],
    correctIndex: 2,
    explanation: "Le contrôle A.4.1.2 de l'Annexe A.4 exige que des vérifications d'antécédents (background checks) soient menées pour tous les candidats selon les lois applicables, proportionnellement aux exigences métier, à la classification de l'information accessible, et aux risques perçus.",
    tags: ["annexe-a", "a4", "ressources-humaines", "recrutement"]
  },
  {
    id: "q-iso42001-annexa-a5-asset",
    moduleId: "iso-42001",
    difficulty: "medium",
    question: "Selon l'Annexe A.5, que doit contenir l'inventaire des actifs pour les systèmes IA ?",
    choices: [
      "Uniquement les serveurs physiques",
      "Uniquement les logiciels IA",
      "Tous les actifs IA : systèmes, modèles, données d'entraînement, jeux de données de test, code source, documentation, avec leurs propriétaires et classification",
      "Uniquement les licences"
    ],
    correctIndex: 2,
    explanation: "Le contrôle A.5.1.1 exige d'identifier et maintenir un inventaire de tous les actifs associés à l'information et au traitement de l'information pour les systèmes IA, incluant : systèmes IA, modèles, données d'entraînement et de test, code source, documentation technique, avec leurs propriétaires et niveau de classification.",
    tags: ["annexe-a", "a5", "actifs", "inventaire"]
  },
  {
    id: "q-iso42001-annexa-a6-dev-lifecycle",
    moduleId: "iso-42001",
    difficulty: "hard",
    question: "Un système IA de diagnostic médical est en développement. Selon le contrôle A.6.2.4 de l'Annexe A.6, que doit inclure la vérification et validation ?",
    choices: [
      "Uniquement tester l'interface utilisateur",
      "Uniquement la précision du modèle",
      "Les mesures de vérification et validation définies et documentées, avec critères d'utilisation pour confirmer que les exigences sont satisfaites et que le système fonctionne comme prévu",
      "Uniquement l'avis du chef de projet"
    ],
    correctIndex: 2,
    explanation: "Le contrôle A.6.2.4 exige de définir et documenter les mesures de vérification et validation pour le système IA et spécifier les critères pour leur utilisation. Cela permet de confirmer que les exigences du système IA sont satisfaites et que le système fonctionne comme prévu.",
    tags: ["annexe-a", "a6", "vérification", "validation", "cycle-de-vie", "cas-pratique"]
  },
  {
    id: "q-iso42001-annexa-a7-data-quality",
    moduleId: "iso-42001",
    difficulty: "hard",
    question: "Votre système IA de recommandation e-commerce montre des performances dégradées. Selon l'Annexe A.7.2, quels aspects de qualité des données devez-vous vérifier ?",
    choices: [
      "Uniquement la quantité de données",
      "Uniquement la vitesse de traitement",
      "Exactitude, complétude, cohérence, actualité, validité, intégrité et disponibilité des données, ainsi que leur provenance",
      "Uniquement le format des fichiers"
    ],
    correctIndex: 2,
    explanation: "L'Annexe A.7.2 exige de définir et documenter les objectifs de qualité des données pour les systèmes IA, incluant : exactitude, complétude, cohérence, actualité (timeliness), validité, intégrité, et disponibilité. La provenance des données (A.7.3) doit aussi être tracée.",
    tags: ["annexe-a", "a7", "qualité-données", "provenance", "cas-pratique"]
  },
  {
    id: "q-iso42001-annexa-a9-third-party",
    moduleId: "iso-42001",
    difficulty: "medium",
    question: "Selon l'Annexe A.9, que doit inclure l'accord avec un fournisseur de services IA cloud ?",
    choices: [
      "Uniquement le prix du service",
      "Uniquement le SLA de disponibilité",
      "Les exigences de sécurité de l'information, les exigences IA spécifiques, la gestion de la chaîne logistique des services et la surveillance/revue des services tiers",
      "Uniquement les conditions de paiement"
    ],
    correctIndex: 2,
    explanation: "L'Annexe A.9 exige que les accords avec fournisseurs tiers incluent : les exigences de sécurité de l'information (A.9.1), les exigences spécifiques aux systèmes IA (performance, équité, explicabilité), la gestion de la chaîne logistique des services IA (A.9.2), et la surveillance/revue régulière des services tiers (A.9.3).",
    tags: ["annexe-a", "a9", "tiers", "fournisseurs", "cloud"]
  },
  {
    id: "q-iso42001-annexa-a10-customer",
    moduleId: "iso-42001",
    difficulty: "medium",
    question: "Votre entreprise fournit une solution IA SaaS à des clients. Selon l'Annexe A.10, que devez-vous documenter pour les clients ?",
    choices: [
      "Uniquement le manuel utilisateur",
      "Uniquement le prix d'abonnement",
      "Les capacités et limitations du système IA, les cas d'utilisation appropriés, les exigences de qualité des données d'entrée, et les informations sur la surveillance humaine nécessaire",
      "Uniquement les conditions générales de vente"
    ],
    correctIndex: 2,
    explanation: "Le contrôle A.10.1.1 exige de fournir aux clients une documentation claire sur : les capacités et limitations du système IA, les cas d'utilisation appropriés et inappropriés, les exigences de qualité des données d'entrée, le niveau de surveillance humaine nécessaire, et comment interpréter les résultats de l'IA.",
    tags: ["annexe-a", "a10", "clients", "documentation", "saas"]
  },

  // Questions avancées et cas pratiques ISO 42001
  {
    id: "q-iso42001-bias-detection",
    moduleId: "iso-42001",
    difficulty: "hard",
    question: "Votre système IA de notation de crédit montre un taux d'approbation de 75% pour le groupe A et 45% pour le groupe B à profils équivalents. Quelle action l'ISO 42001 exige-t-elle ?",
    choices: [
      "Continuer si les deux groupes sont rentables",
      "Analyser les causes du biais, évaluer l'impact sur l'équité, documenter les risques de discrimination, et mettre en œuvre des mesures correctives",
      "Uniquement ajuster les seuils de notation",
      "Ignorer car c'est un résultat statistique"
    ],
    correctIndex: 1,
    explanation: "L'ISO 42001 exige d'identifier et traiter les biais discriminatoires. L'organisation doit : analyser les causes (données d'entraînement biaisées, features corrélées), évaluer l'impact sur l'équité et les droits fondamentaux, documenter les risques, et mettre en œuvre des mesures (rééquilibrage des données, fairness constraints, surveillance continue).",
    tags: ["biais", "équité", "discrimination", "fairness", "cas-pratique"]
  },
  {
    id: "q-iso42001-explainability",
    moduleId: "iso-42001",
    difficulty: "hard",
    question: "Selon l'ISO 42001, quand l'explicabilité (explainability) d'un système IA est-elle particulièrement critique ?",
    choices: [
      "Uniquement pour les modèles de machine learning",
      "Jamais, seule la performance compte",
      "Pour les décisions à fort impact (crédit, recrutement, santé, justice) et quand exigé par les régulations (RGPD, AI Act)",
      "Uniquement pour les systèmes publics"
    ],
    correctIndex: 2,
    explanation: "L'explicabilité est critique pour : les décisions à fort impact sur les individus (crédit, emploi, santé, justice), la conformité réglementaire (RGPD droit à l'explication, AI Act pour systèmes à haut risque), la détection et correction de biais, et la confiance des parties intéressées. L'organisation doit déterminer le niveau d'explicabilité nécessaire.",
    tags: ["explicabilité", "explainability", "transparence", "haut-risque"]
  },
  {
    id: "q-iso42001-human-oversight",
    moduleId: "iso-42001",
    difficulty: "medium",
    question: "Qu'est-ce que la surveillance humaine (human oversight) selon l'ISO 42001 ?",
    choices: [
      "Avoir un humain qui observe l'écran",
      "Des mesures pour s'assurer qu'une personne compétente peut comprendre, surveiller et intervenir sur les décisions du système IA",
      "Uniquement former les utilisateurs",
      "Uniquement lire les logs système"
    ],
    correctIndex: 1,
    explanation: "La surveillance humaine (human oversight) inclut : la capacité pour des personnes compétentes de comprendre le fonctionnement du système IA, surveiller ses performances et comportements, intervenir sur les décisions ou arrêter le système si nécessaire, et maintenir un contrôle humain approprié selon les risques.",
    tags: ["surveillance-humaine", "human-oversight", "contrôle-humain"]
  },
  {
    id: "q-iso42001-ai-incident",
    moduleId: "iso-42001",
    difficulty: "hard",
    question: "Votre chatbot IA client génère des réponses inappropriées et offensantes en production. Quelle est la procédure ISO 42001 ?",
    choices: [
      "Attendre les retours clients pour évaluer l'ampleur",
      "Désactiver immédiatement le système, documenter l'incident, analyser les causes racines, notifier les parties intéressées, mettre en œuvre des actions correctives et préventives",
      "Uniquement modifier les prompts",
      "Continuer et corriger progressivement"
    ],
    correctIndex: 1,
    explanation: "La gestion d'incident IA selon ISO 42001 exige : action immédiate pour limiter l'impact (désactivation, mode dégradé), documentation complète de l'incident, analyse des causes racines (données, modèle, prompts), notification des parties intéressées affectées, actions correctives (retraining, filtres), actions préventives pour éviter récurrence, et revue de l'évaluation des risques.",
    tags: ["incident", "gestion-crise", "actions-correctives", "cas-pratique"]
  },
  {
    id: "q-iso42001-data-minimization",
    moduleId: "iso-42001",
    difficulty: "medium",
    question: "Selon les principes ISO 42001 et RGPD, que signifie la minimisation des données pour l'IA ?",
    choices: [
      "Collecter le minimum de données possible",
      "Ne collecter que les données adéquates, pertinentes et limitées à ce qui est nécessaire pour les objectifs IA",
      "Uniquement supprimer les doublons",
      "Compresser les fichiers de données"
    ],
    correctIndex: 1,
    explanation: "La minimisation des données exige de : collecter uniquement les données adéquates, pertinentes et strictement nécessaires aux objectifs IA définis, éviter la sur-collecte de données 'au cas où', justifier la nécessité de chaque attribut collecté, et réviser régulièrement les besoins en données.",
    tags: ["données", "minimisation", "rgpd", "privacy"]
  },
  {
    id: "q-iso42001-model-versioning",
    moduleId: "iso-42001",
    difficulty: "medium",
    question: "Pourquoi le versioning des modèles IA est-il important selon l'ISO 42001 ?",
    choices: [
      "Uniquement pour gagner de l'espace disque",
      "Pour la traçabilité, la reproductibilité, le rollback en cas de problème, et la conformité aux audits",
      "Uniquement pour l'organisation des fichiers",
      "Ce n'est pas important"
    ],
    correctIndex: 1,
    explanation: "Le versioning des modèles IA permet : la traçabilité complète (quel modèle, quelles données, quels hyperparamètres), la reproductibilité des résultats, le rollback rapide en cas de dégradation de performance, la comparaison de performances entre versions, et la conformité lors des audits (preuves documentées).",
    tags: ["versioning", "traçabilité", "mlops", "documentation"]
  },
  {
    id: "q-iso42001-ai-act-alignment",
    moduleId: "iso-42001",
    difficulty: "hard",
    question: "Comment l'ISO 42001 s'aligne-t-elle avec l'AI Act européen ?",
    choices: [
      "Elles sont contradictoires",
      "L'ISO 42001 fournit un cadre de management qui aide à démontrer la conformité aux exigences de l'AI Act (gouvernance, risques, documentation, surveillance)",
      "L'AI Act remplace l'ISO 42001",
      "Elles ne sont pas liées"
    ],
    correctIndex: 1,
    explanation: "L'ISO 42001 et l'AI Act sont complémentaires : l'AI Act établit des exigences légales obligatoires (notamment pour les systèmes à haut risque), tandis que l'ISO 42001 fournit un cadre de management systématique pour y répondre via : gouvernance structurée, gestion des risques, documentation technique, surveillance continue, et amélioration. L'ISO 42001 facilite la démonstration de conformité à l'AI Act.",
    tags: ["ai-act", "réglementation", "conformité", "gouvernance"]
  },
  {
    id: "q-iso42001-environmental-impact",
    moduleId: "iso-42001",
    difficulty: "medium",
    question: "Pourquoi l'ISO 42001 exige-t-elle de considérer l'impact environnemental des systèmes IA ?",
    choices: [
      "Ce n'est pas exigé",
      "Uniquement pour l'image de marque",
      "Les systèmes IA peuvent avoir une empreinte carbone significative (entraînement, inférence), et cela fait partie de l'évaluation d'impact et de la responsabilité sociétale",
      "Uniquement pour les datacenters physiques"
    ],
    correctIndex: 2,
    explanation: "L'ISO 42001 exige de considérer l'impact environnemental car : l'entraînement de grands modèles consomme beaucoup d'énergie et génère du CO2, l'inférence à large échelle a aussi un impact, cela fait partie de l'AI System Impact Assessment, et la responsabilité sociétale inclut la durabilité environnementale. L'organisation doit évaluer et, si pertinent, atténuer cet impact.",
    tags: ["environnement", "durabilité", "empreinte-carbone", "impact"]
  },
  {
    id: "q-iso42001-third-party-model",
    moduleId: "iso-42001",
    difficulty: "hard",
    question: "Votre organisation utilise GPT-4 via API OpenAI pour une application critique. Quelles responsabilités ISO 42001 conservez-vous ?",
    choices: [
      "Aucune, c'est la responsabilité d'OpenAI",
      "Uniquement payer la facture",
      "Évaluer les risques de l'utilisation, définir les cas d'usage appropriés, surveiller les performances et biais, assurer la qualité des prompts/données, et documenter la chaîne de responsabilité",
      "Uniquement lire la documentation OpenAI"
    ],
    correctIndex: 2,
    explanation: "Même avec un modèle tiers, l'organisation reste responsable de : l'évaluation des risques spécifiques à son cas d'usage, la définition des cas d'usage appropriés et inappropriés, la surveillance des performances et détection de biais dans le contexte d'utilisation, la qualité des prompts et données d'entrée, la surveillance humaine appropriée, la documentation de la chaîne de responsabilité, et la conformité aux exigences applicables (RGPD, etc.).",
    tags: ["tiers", "api", "responsabilité", "modèles-externes", "cas-pratique"]
  },
  {
    id: "q-iso42001-data-poisoning",
    moduleId: "iso-42001",
    difficulty: "hard",
    question: "Qu'est-ce que le data poisoning et comment l'ISO 42001 exige-t-elle de s'en protéger ?",
    choices: [
      "C'est une attaque où des données malveillantes sont injectées pour corrompre le modèle; l'ISO 42001 exige des contrôles sur la provenance, validation et intégrité des données",
      "C'est simplement des données de mauvaise qualité",
      "Cela n'existe pas pour l'IA",
      "Uniquement un problème de base de données"
    ],
    correctIndex: 0,
    explanation: "Le data poisoning est une attaque où des données malveillantes sont injectées dans les données d'entraînement ou de fine-tuning pour corrompre le comportement du modèle. L'ISO 42001 exige : traçabilité de la provenance des données (Annexe A.7.3), validation et vérification de l'intégrité des données, contrôles d'accès stricts, détection d'anomalies dans les données, et surveillance du comportement du modèle.",
    tags: ["sécurité", "data-poisoning", "attaque", "intégrité-données"]
  },
  {
    id: "q-iso42001-adversarial-attacks",
    moduleId: "iso-42001",
    difficulty: "hard",
    question: "Un système de reconnaissance d'images est vulnérable aux adversarial attacks (images modifiées imperceptiblement pour tromper le modèle). Que doit faire l'organisation ?",
    choices: [
      "Ignorer car les attaques sont théoriques",
      "Uniquement améliorer la précision",
      "Évaluer le risque de ces attaques dans le contexte d'utilisation, implémenter des défenses (détection d'anomalies, adversarial training), surveiller les comportements suspects, et documenter les limitations",
      "Changer de technologie"
    ],
    correctIndex: 2,
    explanation: "Face aux adversarial attacks, l'ISO 42001 exige : évaluer le risque dans le contexte (criticité du système, exposition aux attaquants), implémenter des défenses appropriées (détection d'anomalies dans les inputs, adversarial training, input sanitization), surveiller les comportements suspects, documenter les limitations connues du système, et informer les parties intéressées des risques résiduels.",
    tags: ["sécurité", "adversarial-attacks", "robustesse", "cas-pratique"]
  },
  {
    id: "q-iso42001-continuous-learning",
    moduleId: "iso-42001",
    difficulty: "medium",
    question: "Votre système IA apprend continuellement des interactions utilisateurs (online learning). Quels risques ISO 42001 faut-il particulièrement surveiller ?",
    choices: [
      "Aucun risque spécifique",
      "Uniquement les coûts de calcul",
      "Dérive du modèle, apprentissage de biais via feedback malveillant, dégradation de performance, et perte de contrôle sur le comportement",
      "Uniquement la vitesse d'apprentissage"
    ],
    correctIndex: 2,
    explanation: "Le continuous learning introduit des risques spécifiques : dérive non contrôlée du comportement du modèle, apprentissage de biais ou comportements malveillants via feedback utilisateurs (manipulation), dégradation progressive de performance, difficulté de traçabilité et reproductibilité. L'ISO 42001 exige une surveillance renforcée, des mécanismes de validation continue, et des capacités de rollback.",
    tags: ["continuous-learning", "online-learning", "risques", "surveillance"]
  },
  {
    id: "q-iso42001-synthetic-data",
    moduleId: "iso-42001",
    difficulty: "medium",
    question: "L'utilisation de données synthétiques pour entraîner des modèles IA présente quels avantages et risques selon l'ISO 42001 ?",
    choices: [
      "Uniquement des avantages",
      "Avantages: respect de la vie privée, augmentation de données. Risques: biais du générateur, manque de réalisme, sur-ajustement aux données synthétiques",
      "Uniquement des risques",
      "Aucune différence avec des données réelles"
    ],
    correctIndex: 1,
    explanation: "Données synthétiques - Avantages : protection de la vie privée (pas de données personnelles réelles), augmentation de données rares, contournement de restrictions d'accès. Risques : reproduction des biais du modèle générateur, manque de réalisme et edge cases, sur-ajustement aux artefacts synthétiques, validation difficile. L'ISO 42001 exige de documenter l'utilisation, valider la qualité, et surveiller les performances.",
    tags: ["données-synthétiques", "privacy", "qualité-données"]
  },
  {
    id: "q-iso42001-federated-learning",
    moduleId: "iso-42001",
    difficulty: "hard",
    question: "Le federated learning (apprentissage fédéré) où les modèles s'entraînent sur des données décentralisées présente quels défis de gouvernance ISO 42001 ?",
    choices: [
      "Aucun défi particulier",
      "Contrôle de la qualité des données distribuées, traçabilité de la provenance, gestion des droits d'accès multi-parties, et vérification de l'intégrité des contributions",
      "Uniquement des problèmes techniques",
      "Uniquement la latence réseau"
    ],
    correctIndex: 1,
    explanation: "Le federated learning pose des défis : contrôle de la qualité des données distribuées (sans accès direct), traçabilité de la provenance des données et contributions, gestion complexe des droits et responsabilités multi-parties, détection de contributions malveillantes (data poisoning distribué), vérification de l'intégrité, et documentation de la chaîne de responsabilité. L'ISO 42001 exige des contrôles adaptés.",
    tags: ["federated-learning", "distribué", "gouvernance", "multi-parties"]
  },
  {
    id: "q-iso42001-transfer-learning",
    moduleId: "iso-42001",
    difficulty: "medium",
    question: "Vous utilisez un modèle pré-entraîné et le fine-tunez pour votre usage. Quelles informations ISO 42001 devez-vous documenter ?",
    choices: [
      "Uniquement le nom du modèle",
      "Uniquement vos données de fine-tuning",
      "Le modèle source (provenance, entraînement initial, limitations connues), les données de fine-tuning, les modifications, les tests de validation, et l'évaluation des risques transférés",
      "Uniquement les performances finales"
    ],
    correctIndex: 2,
    explanation: "Pour le transfer learning/fine-tuning, l'ISO 42001 exige de documenter : le modèle source (provenance, données d'entraînement initial si disponibles, limitations et biais connus), les données de fine-tuning (qualité, représentativité), les modifications apportées, les tests de validation effectués, l'évaluation des risques hérités et nouveaux, et les performances dans le contexte d'utilisation cible.",
    tags: ["transfer-learning", "fine-tuning", "documentation", "traçabilité"]
  },
  {
    id: "q-iso42001-ai-transparency",
    moduleId: "iso-42001",
    difficulty: "medium",
    question: "Que doit inclure la transparence d'un système IA selon l'ISO 42001 ?",
    choices: [
      "Uniquement le code source public",
      "Information sur l'objectif du système, les données utilisées, les limitations, les décisions automatisées, et comment contester une décision",
      "Uniquement le manuel utilisateur",
      "Aucune exigence de transparence"
    ],
    correctIndex: 1,
    explanation: "La transparence selon ISO 42001 inclut : informer sur l'objectif et le fonctionnement du système IA, les types de données utilisées, les limitations et précision connues, l'existence de décisions automatisées, les modalités de surveillance humaine, et comment contester ou obtenir une explication d'une décision. Le niveau de transparence dépend du contexte et des parties intéressées.",
    tags: ["transparence", "communication", "parties-intéressées"]
  },
  {
    id: "q-iso42001-ai-system-retirement",
    moduleId: "iso-42001",
    difficulty: "medium",
    question: "Lors de la mise hors service (retirement) d'un système IA, que doit prévoir l'ISO 42001 ?",
    choices: [
      "Simplement éteindre les serveurs",
      "Planifier la transition, préserver les données nécessaires à la conformité, supprimer/anonymiser les données personnelles, documenter les raisons, et notifier les parties intéressées",
      "Uniquement archiver le code",
      "Aucune exigence particulière"
    ],
    correctIndex: 1,
    explanation: "Le retirement d'un système IA exige : planifier la transition (système alternatif, impact sur les utilisateurs), préserver les données et logs nécessaires à la conformité réglementaire et aux audits, supprimer ou anonymiser les données personnelles selon RGPD, documenter les raisons du retirement, notifier les parties intéressées affectées, et conserver la documentation pour traçabilité.",
    tags: ["cycle-de-vie", "retirement", "fin-de-vie", "transition"]
  },
  {
    id: "q-iso42001-prompt-injection",
    moduleId: "iso-42001",
    difficulty: "hard",
    question: "Les systèmes LLM peuvent être vulnérables au prompt injection. Comment l'ISO 42001 aborde-t-elle ce risque ?",
    choices: [
      "Ce n'est pas couvert par l'ISO 42001",
      "Via l'évaluation des risques IA (identifier la vulnérabilité), le traitement des risques (validation des inputs, sandboxing), la surveillance (détection d'anomalies), et la documentation des limitations",
      "Uniquement par des firewalls",
      "C'est impossible à prévenir"
    ],
    correctIndex: 1,
    explanation: "Le prompt injection est abordé via : évaluation des risques IA (identifier la vulnérabilité et les impacts potentiels), traitement des risques (validation et sanitization des inputs utilisateurs, sandboxing des exécutions, limitation des privilèges, prompts système robustes), surveillance (détection d'anomalies dans les requêtes et réponses), documentation des limitations connues, et formation des utilisateurs.",
    tags: ["llm", "prompt-injection", "sécurité", "vulnérabilités"]
  },
  {
    id: "q-iso42001-model-cards",
    moduleId: "iso-42001",
    difficulty: "easy",
    question: "Qu'est-ce qu'une Model Card et pourquoi est-elle utile pour la conformité ISO 42001 ?",
    choices: [
      "Une carte de visite du data scientist",
      "Un document standardisé décrivant un modèle IA (objectif, données, performances, limitations, biais connus, usage approprié)",
      "Une carte de paiement pour les API",
      "Un schéma d'architecture technique"
    ],
    correctIndex: 1,
    explanation: "Une Model Card est un document standardisé qui décrit : l'objectif du modèle, les données d'entraînement, les performances (métriques, sur quels datasets), les limitations connues, les biais identifiés, les usages appropriés et inappropriés. Elle facilite la transparence, la documentation exigée par l'ISO 42001, et la communication avec les parties intéressées.",
    tags: ["model-card", "documentation", "transparence", "bonnes-pratiques"]
  },
  {
    id: "q-iso42001-ai-literacy",
    moduleId: "iso-42001",
    difficulty: "easy",
    question: "Pourquoi la sensibilisation à l'IA (AI literacy) de tous les employés est-elle importante selon l'ISO 42001 ?",
    choices: [
      "Pour qu'ils sachent coder",
      "Pour qu'ils comprennent les capacités et limitations de l'IA, les risques, l'utilisation responsable, et leur rôle dans l'AIMS",
      "Pour réduire les coûts IT",
      "Ce n'est pas important"
    ],
    correctIndex: 1,
    explanation: "La clause 7.3 (Sensibilisation) exige que les personnes comprennent : la politique IA et les objectifs, les capacités et limitations des systèmes IA utilisés, les risques associés et l'utilisation responsable, leur rôle et contribution à l'efficacité de l'AIMS, et les implications de non-conformité. Cela réduit les usages inappropriés et les risques.",
    tags: ["sensibilisation", "ai-literacy", "formation", "culture"]
  },
  {
    id: "q-iso42001-benchmark-datasets",
    moduleId: "iso-42001",
    difficulty: "medium",
    question: "Pourquoi utiliser des benchmark datasets standardisés est-il une bonne pratique ISO 42001 ?",
    choices: [
      "Pour économiser le temps de collecte de données",
      "Pour permettre la comparaison objective des performances, la reproductibilité, et la validation sur des données représentatives et documentées",
      "Uniquement pour les publications académiques",
      "Ce n'est pas recommandé"
    ],
    correctIndex: 1,
    explanation: "Les benchmark datasets standardisés permettent : comparaison objective avec d'autres modèles et versions, reproductibilité des résultats, validation sur des données représentatives et bien documentées, détection de régressions de performance, et crédibilité auprès des parties intéressées. Ils facilitent la démonstration de conformité aux exigences de performance.",
    tags: ["validation", "benchmarks", "performances", "reproductibilité"]
  },
  {
    id: "q-iso42001-edge-ai",
    moduleId: "iso-42001",
    difficulty: "hard",
    question: "Les systèmes IA embarqués (Edge AI) sur devices (smartphones, IoT) présentent quels défis spécifiques ISO 42001 ?",
    choices: [
      "Aucun défi particulier",
      "Surveillance et mise à jour difficiles, contraintes de ressources, exposition physique, difficulté de traçabilité et de contrôle à distance",
      "Uniquement la taille du modèle",
      "Uniquement la latence"
    ],
    correctIndex: 1,
    explanation: "Edge AI pose des défis : surveillance et monitoring difficiles (devices distribués, parfois offline), mise à jour et patching complexes, contraintes de ressources (puissance de calcul, mémoire, batterie), exposition physique et risques de tampering, difficulté de traçabilité des décisions locales, et contrôle à distance limité. L'ISO 42001 exige des contrôles adaptés à ces contraintes.",
    tags: ["edge-ai", "embarqué", "iot", "défis-techniques"]
  },
  {
    id: "q-iso42001-ai-testing",
    moduleId: "iso-42001",
    difficulty: "medium",
    question: "Quels types de tests doivent être réalisés pour un système IA selon l'ISO 42001 ?",
    choices: [
      "Uniquement les tests unitaires du code",
      "Tests de performance (précision, rappel), tests d'équité (fairness), tests de robustesse (adversarial), tests de sécurité, tests d'intégration, et tests en conditions réelles",
      "Uniquement les tests de charge",
      "Aucun test n'est requis"
    ],
    correctIndex: 1,
    explanation: "Les tests d'un système IA doivent couvrir : performance technique (précision, rappel, F1-score sur différents datasets), équité (métriques de fairness sur différents groupes), robustesse (adversarial attacks, edge cases, distribution shift), sécurité (vulnérabilités, injections), intégration (avec autres systèmes), et validation en conditions réelles. Le contrôle A.6.2.4 exige de définir ces mesures de vérification et validation.",
    tags: ["tests", "validation", "vérification", "qualité"]
  },
  {
    id: "q-iso42001-responsible-ai",
    moduleId: "iso-42001",
    difficulty: "easy",
    question: "Que signifie 'IA responsable' (Responsible AI) dans le contexte ISO 42001 ?",
    choices: [
      "Avoir une assurance pour l'IA",
      "Développer et utiliser l'IA de manière éthique, équitable, transparente, sécurisée et respectueuse des droits humains",
      "Uniquement respecter les lois",
      "Uniquement optimiser les performances"
    ],
    correctIndex: 1,
    explanation: "L'IA responsable selon ISO 42001 signifie : développement et utilisation éthiques (respect des valeurs), équité (absence de discrimination), transparence (explicabilité appropriée), sécurité (protection contre les risques), respect des droits humains et de la vie privée, durabilité environnementale, et accountability (responsabilité documentée). C'est un principe transversal de l'AIMS.",
    tags: ["responsible-ai", "éthique", "principes", "valeurs"]
  },
  {
    id: "q-iso42001-regulatory-compliance",
    moduleId: "iso-42001",
    difficulty: "hard",
    question: "Une entreprise européenne déploie un système IA de screening RH. Quelles régulations doit-elle considérer avec l'ISO 42001 ?",
    choices: [
      "Uniquement l'ISO 42001",
      "RGPD (données personnelles, profilage), AI Act (système à haut risque RH), législation anti-discrimination, et droit du travail",
      "Uniquement le code du travail",
      "Aucune réglementation spécifique"
    ],
    correctIndex: 1,
    explanation: "Pour un système IA RH en Europe : RGPD (traitement de données personnelles, décisions automatisées, profilage), AI Act européen (RH classé comme système à haut risque avec exigences strictes), législation anti-discrimination (égalité de traitement), droit du travail (information des employés/candidats). L'ISO 42001 fournit le cadre pour gérer ces exigences de conformité.",
    tags: ["conformité", "rgpd", "ai-act", "rh", "réglementation", "cas-pratique"]
  },
  {
    id: "q-iso42001-carbon-footprint",
    moduleId: "iso-42001",
    difficulty: "medium",
    question: "Comment mesurer et réduire l'empreinte carbone d'un projet IA selon les bonnes pratiques ISO 42001 ?",
    choices: [
      "C'est impossible à mesurer",
      "Mesurer via outils de tracking énergétique (entraînement, inférence), optimiser l'efficience des modèles, utiliser des datacenters verts, et documenter dans l'impact assessment",
      "Uniquement éteindre les serveurs la nuit",
      "Acheter des crédits carbone"
    ],
    correctIndex: 1,
    explanation: "Mesure et réduction de l'empreinte carbone : mesurer via outils de tracking de consommation énergétique (entraînement et inférence), optimiser l'efficience des modèles (compression, quantization, distillation), choisir des datacenters alimentés par énergies renouvelables, planifier les entraînements dans des plages basse-consommation, et documenter l'impact environnemental dans l'AI System Impact Assessment.",
    tags: ["environnement", "carbone", "durabilité", "green-ai"]
  },
  {
    id: "q-iso42001-ai-skills-gap",
    moduleId: "iso-42001",
    difficulty: "medium",
    question: "L'organisation identifie un manque de compétences IA (AI skills gap). Quelles actions ISO 42001 clause 7.2 exige-t-elle ?",
    choices: [
      "Embaucher uniquement des externes",
      "Ignorer et continuer avec les compétences actuelles",
      "Déterminer les compétences requises, évaluer les écarts, mettre en œuvre des actions (formation, recrutement, mentorat, partenariats), et évaluer l'efficacité",
      "Uniquement acheter des outils IA no-code"
    ],
    correctIndex: 2,
    explanation: "La clause 7.2 (Compétence) exige : déterminer précisément les compétences IA nécessaires (techniques, éthiques, métier), évaluer les écarts de compétences actuels, mettre en œuvre des actions pour combler les écarts (formation interne, recrutement ciblé, mentorat, partenariats académiques/industriels), et évaluer l'efficacité des actions. Conserver les preuves documentées.",
    tags: ["compétences", "formation", "skills-gap", "ressources-humaines"]
  },
  {
    id: "q-iso42001-multi-stakeholder",
    moduleId: "iso-42001",
    difficulty: "hard",
    question: "Un système IA de santé implique des patients, médecins, hôpitaux, régulateurs et assureurs. Comment gérer ces parties intéressées multiples selon ISO 42001 ?",
    choices: [
      "Prioriser uniquement les payeurs",
      "Identifier toutes les parties, déterminer leurs exigences respectives, gérer les conflits d'intérêts, établir la communication appropriée, et documenter la prise en compte",
      "Uniquement consulter les médecins",
      "Ignorer les régulateurs jusqu'à l'audit"
    ],
    correctIndex: 1,
    explanation: "La clause 4.2 exige : identifier toutes les parties intéressées pertinentes (patients, cliniciens, établissements, régulateurs, payeurs), déterminer leurs exigences et attentes (parfois conflictuelles), gérer les arbitrages (ex: performance vs explicabilité vs coût), établir une communication adaptée à chaque partie, et documenter comment leurs exigences sont prises en compte dans l'AIMS.",
    tags: ["parties-intéressées", "multi-stakeholder", "santé", "conflits", "cas-pratique"]
  },
  {
    id: "q-iso42001-ai-procurement",
    moduleId: "iso-42001",
    difficulty: "medium",
    question: "Lors de l'achat d'une solution IA commerciale, quelles questions ISO 42001 doit-on poser au fournisseur ?",
    choices: [
      "Uniquement le prix et le SLA",
      "Documentation du modèle, données d'entraînement, performances et limitations, biais connus, mesures de sécurité, conformité RGPD/AI Act, et responsabilités respectives",
      "Uniquement les fonctionnalités",
      "Uniquement la roadmap produit"
    ],
    correctIndex: 1,
    explanation: "Questions essentielles pour procurement IA : documentation du modèle (Model Card), données d'entraînement utilisées, performances et métriques (accuracy, fairness), limitations et biais connus, mesures de sécurité et confidentialité, conformité RGPD/AI Act, responsabilités et liability (qui est responsable en cas d'erreur), capacité d'audit, possibilités de personnalisation, et plan de support/maintenance.",
    tags: ["procurement", "achat", "fournisseurs", "due-diligence"]
  },
  {
    id: "q-iso42001-ai-patents",
    moduleId: "iso-42001",
    difficulty: "medium",
    question: "Les aspects de propriété intellectuelle (brevets, droits d'auteur) des systèmes IA doivent-ils être considérés dans l'AIMS ?",
    choices: [
      "Non, ce n'est pas lié",
      "Oui, pour identifier les droits sur les modèles/données, éviter les infractions, et clarifier la propriété des outputs IA",
      "Uniquement pour les grandes entreprises",
      "Uniquement si on veut breveter"
    ],
    correctIndex: 1,
    explanation: "La propriété intellectuelle doit être considérée : droits sur les données utilisées (licenses, RGPD), droits sur les modèles (propriété, open-source vs propriétaire), respect des brevets et copyrights de tiers, propriété des outputs générés par l'IA (question juridique évolutive), et documentation des droits dans la chaîne de valeur. Cela fait partie de la gouvernance et de la gestion des risques légaux.",
    tags: ["propriété-intellectuelle", "brevets", "droits", "légal"]
  },
  {
    id: "q-iso42001-shadow-ai",
    moduleId: "iso-42001",
    difficulty: "hard",
    question: "Le 'Shadow AI' (utilisation non autorisée d'outils IA par les employés comme ChatGPT) pose quels risques ISO 42001 ?",
    choices: [
      "Aucun risque, c'est de l'innovation",
      "Fuite de données confidentielles, non-conformité RGPD, manque de gouvernance, risques de sécurité, et perte de traçabilité",
      "Uniquement des coûts supplémentaires",
      "Uniquement de la productivité en plus"
    ],
    correctIndex: 1,
    explanation: "Shadow AI pose des risques majeurs : fuite de données confidentielles/personnelles vers des tiers (violation RGPD), absence de contrôle et gouvernance, non-conformité aux politiques de sécurité, risques de prompts malveillants ou d'outputs biaisés/inexacts utilisés pour des décisions, perte de traçabilité. L'ISO 42001 exige : politique claire sur l'usage d'outils IA, sensibilisation des employés (clause 7.3), et contrôles appropriés.",
    tags: ["shadow-ai", "gouvernance", "risques", "conformité", "sensibilisation"]
  },
  {
    id: "q-iso42001-ai-ethics-committee",
    moduleId: "iso-42001",
    difficulty: "medium",
    question: "Quel est le rôle d'un comité d'éthique IA dans le cadre ISO 42001 ?",
    choices: [
      "Ralentir tous les projets IA",
      "Évaluer les implications éthiques des systèmes IA, conseiller sur les dilemmes, valider les AI Impact Assessments, et promouvoir l'IA responsable",
      "Uniquement approuver les budgets",
      "Uniquement gérer les réclamations"
    ],
    correctIndex: 1,
    explanation: "Le comité d'éthique IA (qui peut faire partie de la gouvernance A.3) : évalue les implications éthiques des projets IA (équité, droits humains, impact sociétal), conseille sur les dilemmes éthiques complexes, valide ou challenge les AI System Impact Assessments, promeut la culture d'IA responsable, et assure l'alignement avec les valeurs de l'organisation. Composition pluridisciplinaire recommandée.",
    tags: ["éthique", "comité", "gouvernance", "responsible-ai"]
  },

  // FORMATIONS SÛRETÉ – RÉFÉRENTIEL 11.2.x
  {
    id: "q-surete-reglementation",
    moduleId: "surete-112x",
    difficulty: "easy",
    question: "Quel règlement européen régit les formations de sûreté aérienne ?",
    choices: [
      "Règlement (UE) 2015/1998",
      "Règlement (UE) 2016/679 (RGPD)",
      "Règlement (CE) 300/2008",
      "Règlement (UE) 2018/1139"
    ],
    correctIndex: 0,
    explanation: "Le Règlement (UE) 2015/1998 de la Commission du 5 novembre 2015, complété par l'arrêté français du 21 septembre 2012, définit les exigences de formation pour le personnel ayant accès aux zones de sûreté ou effectuant des contrôles de sûreté dans l'aviation civile.",
    tags: ["réglementation", "ue-2015-1998", "base"]
  },
  {
    id: "q-surete-zsar-definition",
    moduleId: "surete-112x",
    difficulty: "easy",
    question: "Que signifie l'acronyme ZSAR ?",
    choices: [
      "Zone Sécurisée d'Accès Restreint",
      "Zone de Sûreté à Accès Réglementé",
      "Zone Sensible d'Aviation Régionale",
      "Zone de Surveillance Aérienne Renforcée"
    ],
    correctIndex: 1,
    explanation: "ZSAR signifie Zone de Sûreté à Accès Réglementé. Ce sont des zones côté piste où l'accès est strictement contrôlé et soumis à autorisation préalable. Seules les personnes munies d'un titre de circulation et ayant suivi une formation sûreté peuvent y accéder.",
    tags: ["zsar", "zones", "définition"]
  },
  {
    id: "q-surete-11-2-2-objectif",
    moduleId: "surete-112x",
    difficulty: "easy",
    question: "Quel est l'objectif principal du MODULE 11.2.2 ?",
    choices: [
      "Former au filtrage du fret aérien",
      "Former au contrôle d'accès et aux inspections visuelles",
      "Former à la supervision des équipes",
      "Former à la gestion de crise"
    ],
    correctIndex: 1,
    explanation: "Le MODULE 11.2.2 a pour objectif de former les personnels chargés de contrôler les accès aux zones de sûreté, de vérifier l'identité et les autorisations, et d'effectuer des inspections visuelles basiques.",
    tags: ["11.2.2", "objectif", "contrôle-accès"]
  },
  {
    id: "q-surete-controle-acces-procedure",
    moduleId: "surete-112x",
    difficulty: "medium",
    question: "Un agent de contrôle d'accès détecte un badge expiré. Quelle est la procédure correcte selon le MODULE 11.2.2 ?",
    choices: [
      "Laisser passer la personne si elle est connue",
      "Refuser l'accès et orienter vers les services administratifs pour régularisation",
      "Appeler la police immédiatement",
      "Laisser entrer mais noter l'incident"
    ],
    correctIndex: 1,
    explanation: "Selon les procédures du MODULE 11.2.2, un badge expiré ne permet pas l'accès en ZSAR/ZES. L'agent doit refuser l'accès de manière courtoise mais ferme, et orienter la personne vers les services administratifs compétents pour régulariser sa situation.",
    tags: ["11.2.2", "procédure", "badge", "cas-pratique"]
  },
  {
    id: "q-surete-ra-definition",
    moduleId: "surete-112x",
    difficulty: "medium",
    question: "Qu'est-ce qu'un RA (Regulated Agent / Agent Habilité) ?",
    choices: [
      "Un agent de sécurité privée",
      "Une entreprise agréée pour appliquer des contrôles de sûreté du fret aérien",
      "Un régulateur européen de l'aviation",
      "Un responsable d'aéroport"
    ],
    correctIndex: 1,
    explanation: "Un RA (Regulated Agent / Agent Habilité) est une entreprise agréée par l'autorité nationale pour appliquer des contrôles de sûreté du fret aérien selon la réglementation. Le RA est responsable de filtrer, sécuriser et documenter le fret avant remise à la compagnie aérienne.",
    tags: ["ra", "agent-habilité", "fret", "définition"]
  },
  {
    id: "q-surete-ca-definition",
    moduleId: "surete-112x",
    difficulty: "medium",
    question: "Quel est le rôle d'un CA (Known Consignor / Chargeur Connu) ?",
    choices: [
      "Transporter le fret vers l'aéroport",
      "Expéditeur dont les procédures de sûreté sont validées et qui peut remettre du fret sécurisé directement à un RA",
      "Contrôler tous les colis à l'aéroport",
      "Gérer les douanes"
    ],
    correctIndex: 1,
    explanation: "Un CA (Known Consignor / Chargeur Connu) est un expéditeur dont les procédures de sûreté sont validées et qui peut remettre du fret sécurisé directement à un RA. Le statut CA garantit la traçabilité et l'intégrité de la chaîne de sûreté du fret aérien.",
    tags: ["ca", "chargeur-connu", "fret", "définition"]
  },
  {
    id: "q-surete-methodes-filtrage",
    moduleId: "surete-112x",
    difficulty: "hard",
    question: "Parmi les méthodes suivantes, lesquelles sont des méthodes de filtrage agréées pour le fret aérien ?",
    choices: [
      "Uniquement inspection visuelle et vérification documentaire",
      "Inspection visuelle, vérification documentaire, ETD, EDD et X-ray",
      "Uniquement X-ray et ETD",
      "Uniquement EDD (chiens détecteurs)"
    ],
    correctIndex: 1,
    explanation: "Les méthodes de filtrage agréées pour le contrôle de sûreté du fret aérien incluent : inspection visuelle, vérification documentaire, ETD (Explosive Trace Detection), EDD (Explosive Detection Dog - chiens détecteurs), et X-ray. Le choix dépend du type de fret et du niveau de risque.",
    tags: ["filtrage", "méthodes", "fret", "11.2.3.9"]
  },
  {
    id: "q-surete-etd",
    moduleId: "surete-112x",
    difficulty: "medium",
    question: "Que signifie l'acronyme ETD dans le contexte du filtrage fret ?",
    choices: [
      "Electronic Transport Document",
      "Explosive Trace Detection (détection de traces d'explosifs)",
      "Emergency Transport Directive",
      "European Trade Database"
    ],
    correctIndex: 1,
    explanation: "ETD signifie Explosive Trace Detection (détection de traces d'explosifs). C'est une méthode de filtrage qui détecte les traces d'explosifs par prélèvement et analyse chimique sur les colis, emballages ou surfaces.",
    tags: ["etd", "filtrage", "explosifs", "méthode"]
  },
  {
    id: "q-surete-edd",
    moduleId: "surete-112x",
    difficulty: "easy",
    question: "Que signifie EDD dans le filtrage de sûreté ?",
    choices: [
      "Electronic Detection Device",
      "Explosive Detection Dog (chien détecteur d'explosifs)",
      "Emergency Detection Directive",
      "European Defense Database"
    ],
    correctIndex: 1,
    explanation: "EDD signifie Explosive Detection Dog (chien détecteur d'explosifs). Les chiens détecteurs certifiés sont une méthode de filtrage agréée très efficace pour détecter les explosifs dans le fret aérien.",
    tags: ["edd", "chiens", "filtrage", "méthode"]
  },
  {
    id: "q-surete-colis-suspect",
    moduleId: "surete-112x",
    difficulty: "hard",
    question: "Lors du filtrage X-ray, vous détectez un objet suspect non identifiable dans un colis. Quelle est la procédure selon le MODULE 11.2.3.9 ?",
    choices: [
      "Ouvrir le colis immédiatement pour vérifier",
      "Mettre le colis de côté et continuer le filtrage",
      "Isoler le colis, alerter le superviseur, ne pas manipuler, documenter l'anomalie et suivre la procédure de gestion des colis suspects",
      "Renvoyer le colis à l'expéditeur"
    ],
    correctIndex: 2,
    explanation: "En cas de détection d'un objet suspect non identifiable : isoler immédiatement le colis dans une zone dédiée, alerter le superviseur sûreté, ne PAS manipuler ou ouvrir le colis, documenter précisément l'anomalie détectée, et suivre la procédure de gestion des colis suspects (qui peut inclure l'intervention d'unités spécialisées).",
    tags: ["11.2.3.9", "colis-suspect", "procédure", "x-ray", "cas-pratique"]
  },
  {
    id: "q-surete-chaine-surete",
    moduleId: "surete-112x",
    difficulty: "medium",
    question: "Que signifie 'garantir la chaîne de sûreté du fret' ?",
    choices: [
      "Uniquement utiliser des scellés",
      "Assurer la traçabilité, l'intégrité et la documentation du fret de l'expéditeur CA/RA jusqu'à l'aéronef, sans rupture de sécurisation",
      "Uniquement vérifier les documents de transport",
      "Uniquement inspecter visuellement le fret"
    ],
    correctIndex: 1,
    explanation: "Garantir la chaîne de sûreté du fret signifie assurer la traçabilité complète, l'intégrité et la documentation du fret depuis l'expéditeur CA/RA jusqu'à l'aéronef, sans rupture de sécurisation. Cela inclut les scellés, la documentation, les contrôles à chaque étape, et la protection contre toute manipulation non autorisée.",
    tags: ["chaîne-sûreté", "traçabilité", "fret", "11.2.3.9"]
  },
  {
    id: "q-surete-11-2-6-2-objectif",
    moduleId: "surete-112x",
    difficulty: "easy",
    question: "Quel est l'objectif du MODULE 11.2.6.2 ?",
    choices: [
      "Former au filtrage du fret",
      "Former à la surveillance des zones sensibles et marchandises",
      "Former au contrôle d'accès",
      "Former à la supervision"
    ],
    correctIndex: 1,
    explanation: "Le MODULE 11.2.6.2 a pour objectif de former le personnel chargé de surveiller les zones sensibles et marchandises pour prévenir les intrusions, sabotages et interférences illicites.",
    tags: ["11.2.6.2", "surveillance", "objectif"]
  },
  {
    id: "q-surete-rondes-surveillance",
    moduleId: "surete-112x",
    difficulty: "medium",
    question: "Lors d'une ronde de surveillance en zone de stockage fret, vous constatez qu'un scellé est brisé. Quelle est la procédure correcte ?",
    choices: [
      "Remettre un nouveau scellé immédiatement",
      "Ignorer si le colis semble intact",
      "Isoler le colis, alerter immédiatement le superviseur, documenter l'anomalie (photo, heure, localisation), ne pas manipuler le colis",
      "Ouvrir le colis pour vérifier le contenu"
    ],
    correctIndex: 2,
    explanation: "Selon le MODULE 11.2.6.2, un scellé brisé est une anomalie de sûreté majeure. Procédure : isoler le colis concerné, alerter immédiatement le superviseur sûreté, documenter précisément l'anomalie (photo si possible, heure, localisation exacte), ne PAS manipuler le colis, et suivre les instructions du superviseur pour la suite (réinspection complète, enquête).",
    tags: ["11.2.6.2", "surveillance", "scellés", "anomalie", "cas-pratique"]
  },
  {
    id: "q-surete-anomalies-marchandises",
    moduleId: "surete-112x",
    difficulty: "medium",
    question: "Quels types d'anomalies doit détecter un agent de surveillance selon le MODULE 11.2.6.2 ?",
    choices: [
      "Uniquement les scellés brisés",
      "Scellés brisés, emballages altérés, positions de marchandises modifiées, présence de personnes non autorisées",
      "Uniquement les intrusions",
      "Uniquement les vols"
    ],
    correctIndex: 1,
    explanation: "Un agent de surveillance formé au MODULE 11.2.6.2 doit détecter plusieurs types d'anomalies : scellés brisés ou manquants, emballages altérés ou endommagés, positions de marchandises modifiées (déplacement suspect), présence de personnes non autorisées, traces d'effraction, et tout élément inhabituel dans les zones sensibles.",
    tags: ["11.2.6.2", "anomalies", "détection", "surveillance"]
  },
  {
    id: "q-surete-11-2-3-10-objectif",
    moduleId: "surete-112x",
    difficulty: "easy",
    question: "À qui s'adresse le MODULE 11.2.3.10 ?",
    choices: [
      "Aux agents de contrôle d'accès",
      "Aux agents de filtrage fret",
      "Aux superviseurs et encadrants d'équipes sûreté",
      "Aux pilotes"
    ],
    correctIndex: 2,
    explanation: "Le MODULE 11.2.3.10 s'adresse aux superviseurs et encadrants chargés de superviser les équipes effectuant le contrôle de sûreté. Cette formation permet de garantir la qualité et la conformité des opérations de filtrage.",
    tags: ["11.2.3.10", "supervision", "public-cible"]
  },
  {
    id: "q-surete-superviseur-role",
    moduleId: "surete-112x",
    difficulty: "medium",
    question: "Quelles sont les responsabilités d'un superviseur sûreté formé au MODULE 11.2.3.10 ?",
    choices: [
      "Uniquement contrôler les badges",
      "Contrôle qualité des opérations, gestion des incidents, briefing/débriefing équipes, audits internes, rédaction de rapports",
      "Uniquement former les nouveaux agents",
      "Uniquement gérer les plannings"
    ],
    correctIndex: 1,
    explanation: "Un superviseur sûreté formé au MODULE 11.2.3.10 a pour responsabilités : le contrôle qualité des opérations de sûreté, la gestion des incidents et escalade, le briefing/débriefing des équipes, la conduite d'audits internes, la rédaction de rapports, l'analyse des écarts et la mise en place d'actions correctives.",
    tags: ["11.2.3.10", "supervision", "responsabilités"]
  },
  {
    id: "q-surete-audit-interne",
    moduleId: "surete-112x",
    difficulty: "hard",
    question: "Un superviseur réalise un audit interne sûreté et constate que 30% des contrôles fret ne sont pas documentés correctement. Quelle action selon le MODULE 11.2.3.10 ?",
    choices: [
      "Ignorer si les contrôles ont été effectués",
      "Analyser les causes, former/recadrer les agents concernés, mettre en place des actions correctives (procédures renforcées, check-lists), suivre l'efficacité, et documenter dans le rapport d'audit",
      "Sanctionner immédiatement tous les agents",
      "Attendre le prochain audit"
    ],
    correctIndex: 1,
    explanation: "Face à un écart de conformité détecté en audit interne, le superviseur doit : analyser les causes racines (formation insuffisante, procédure peu claire, manque de temps), former ou recadrer les agents concernés, mettre en place des actions correctives (renforcement des procédures, check-lists obligatoires, vérifications aléatoires), suivre l'efficacité des actions, et documenter l'ensemble dans le rapport d'audit avec plan d'actions.",
    tags: ["11.2.3.10", "audit", "non-conformité", "actions-correctives", "cas-pratique"]
  },
  {
    id: "q-surete-11-2-5-objectif",
    moduleId: "surete-112x",
    difficulty: "medium",
    question: "Quelle est la spécificité du MODULE 11.2.5 par rapport aux autres modules ?",
    choices: [
      "C'est une formation de base",
      "C'est une formation de niveau renforcé pour accéder à des zones très sensibles avec un niveau de connaissance élevé",
      "C'est uniquement pour les pilotes",
      "C'est une formation optionnelle"
    ],
    correctIndex: 1,
    explanation: "Le MODULE 11.2.5 est une formation de niveau renforcé destinée aux personnels ayant besoin d'un niveau de connaissance élevé pour accéder à des zones très sensibles. Elle approfondit la compréhension du contexte géopolitique, de la menace terroriste, et des procédures de sûreté renforcées.",
    tags: ["11.2.5", "niveau-renforcé", "spécificité"]
  },
  {
    id: "q-surete-analyse-comportementale",
    moduleId: "surete-112x",
    difficulty: "hard",
    question: "Qu'est-ce que l'analyse comportementale enseignée dans le MODULE 11.2.5 ?",
    choices: [
      "Observer uniquement les vêtements des personnes",
      "Détecter les signaux faibles et comportements suspects (nervosité excessive, incohérences, hésitation, évitement du regard) pouvant indiquer une menace",
      "Uniquement vérifier les documents d'identité",
      "Interroger systématiquement toutes les personnes"
    ],
    correctIndex: 1,
    explanation: "L'analyse comportementale (profiling comportemental) enseignée dans le MODULE 11.2.5 consiste à détecter les signaux faibles et comportements suspects pouvant indiquer une menace : nervosité excessive, incohérences dans les réponses, hésitation, évitement du regard, transpiration anormale, gestes suspects. C'est une compétence avancée nécessitant formation et expérience.",
    tags: ["11.2.5", "analyse-comportementale", "signaux-faibles", "détection"]
  },
  {
    id: "q-surete-niveau-renforce-contexte",
    moduleId: "surete-112x",
    difficulty: "medium",
    question: "Pourquoi le MODULE 11.2.5 inclut-il une formation sur le contexte géopolitique et la menace terroriste ?",
    choices: [
      "Pour la culture générale",
      "Pour comprendre l'évolution des menaces, adapter les mesures de sûreté, et identifier les signaux faibles dans un contexte spécifique",
      "Uniquement pour les rapports",
      "Ce n'est pas inclus dans le module"
    ],
    correctIndex: 1,
    explanation: "La formation sur le contexte géopolitique et la menace terroriste dans le MODULE 11.2.5 permet aux agents de : comprendre l'évolution des menaces actuelles, adapter les mesures de sûreté au contexte spécifique, identifier les signaux faibles en connaissance de cause, et maintenir un niveau de vigilance approprié selon le niveau de menace.",
    tags: ["11.2.5", "géopolitique", "menace", "contexte"]
  },
  {
    id: "q-surete-gestion-crise",
    moduleId: "surete-112x",
    difficulty: "hard",
    question: "Un agent formé au MODULE 11.2.5 détecte un comportement très suspect en zone ZSAR. Quelle est la procédure de gestion de crise ?",
    choices: [
      "Ignorer et continuer la surveillance",
      "Confronter directement la personne",
      "Observer discrètement, alerter immédiatement le superviseur et les autorités compétentes (DGAC, forces de l'ordre), ne pas intervenir seul, documenter précisément, suivre les instructions reçues",
      "Prendre une photo et la poster sur les réseaux sociaux"
    ],
    correctIndex: 2,
    explanation: "Face à un comportement très suspect en zone sensible, la procédure de gestion de crise inclut : observer discrètement sans alerter la personne, alerter IMMÉDIATEMENT le superviseur sûreté et les autorités compétentes (DGAC, forces de l'ordre selon protocole), NE PAS intervenir seul sauf danger immédiat, documenter précisément (description, localisation, heure, comportement observé), et suivre strictement les instructions reçues.",
    tags: ["11.2.5", "gestion-crise", "urgence", "procédure", "cas-pratique"]
  },
  {
    id: "q-surete-vyxo-avantage",
    moduleId: "surete-112x",
    difficulty: "medium",
    question: "Quel avantage stratégique offre la maîtrise des formations sûreté 11.2.x pour Vyxo Consult ?",
    choices: [
      "Aucun avantage particulier",
      "Uniquement vendre des formations",
      "Proposer des missions QSE + Sûreté intégrées, audits sûreté aérienne, accompagnement certification RA/CA, et offres premium 'Sûreté + GDP + ISO 9001'",
      "Uniquement travailler dans les aéroports"
    ],
    correctIndex: 2,
    explanation: "La maîtrise des formations sûreté 11.2.x offre à Vyxo Consult un avantage stratégique majeur : différenciation par des missions QSE + Sûreté intégrées (approche unique), nouvelles missions (audits sûreté aérienne, accompagnement certification RA/CA), secteurs ciblés (fret aérien, logistique internationale), et offres premium 'Sûreté + GDP + ISO 9001' pour clients transport/logistique pharma.",
    tags: ["vyxo-consult", "stratégie", "avantage", "missions"]
  },
  {
    id: "q-surete-missions-vyxo",
    moduleId: "surete-112x",
    difficulty: "easy",
    question: "Quels types de missions sûreté Vyxo Consult peut-il proposer grâce aux compétences 11.2.x ?",
    choices: [
      "Uniquement des formations",
      "Audit de conformité sûreté, accompagnement certification RA, élaboration de plans de sûreté, évaluation des risques, audits internes DGAC",
      "Uniquement du conseil",
      "Uniquement de la surveillance"
    ],
    correctIndex: 1,
    explanation: "Grâce aux compétences 11.2.x, Vyxo Consult peut proposer : audit de conformité sûreté aérienne (Règlement UE 2015/1998), accompagnement certification RA (Regulated Agent), élaboration de plans de sûreté d'entreprise, formation des équipes, évaluation des risques sûreté, audits internes et préparation aux inspections DGAC, conseil en organisation sûreté, et offres intégrées QSE + Sûreté + GDP.",
    tags: ["vyxo-consult", "missions", "services", "conseil"]
  },

  // Excellence Opérationnelle
  {
    id: "q-exop-5s",
    moduleId: "exop",
    difficulty: "easy",
    question: "Combien de S y a-t-il dans la méthode 5S ?",
    choices: [
      "3",
      "5",
      "7",
      "10"
    ],
    correctIndex: 1,
    explanation: "La méthode 5S comprend 5 étapes : Seiri (Trier), Seiton (Ranger), Seiso (Nettoyer), Seiketsu (Standardiser), Shitsuke (Pérenniser).",
    tags: ["5s", "lean"]
  },
  {
    id: "q-exop-dmaic",
    moduleId: "exop",
    difficulty: "medium",
    question: "Que signifie l'acronyme DMAIC en Six Sigma ?",
    choices: [
      "Design, Make, Analyze, Improve, Control",
      "Define, Measure, Analyze, Improve, Control",
      "Develop, Monitor, Act, Implement, Check",
      "Document, Measure, Apply, Inspect, Correct"
    ],
    correctIndex: 1,
    explanation: "DMAIC est l'acronyme de Define (Définir), Measure (Mesurer), Analyze (Analyser), Improve (Améliorer), Control (Contrôler).",
    tags: ["dmaic", "six-sigma"]
  },

  // HACCP
  {
    id: "q-haccp-principes",
    moduleId: "haccp",
    difficulty: "easy",
    question: "Combien de principes fondamentaux comporte la méthode HACCP ?",
    choices: [
      "5 principes",
      "7 principes",
      "10 principes",
      "12 principes"
    ],
    correctIndex: 1,
    explanation: "L'HACCP repose sur 7 principes fondamentaux établis par le Codex Alimentarius : analyse des dangers, détermination des CCP, établissement des limites critiques, surveillance, actions correctives, vérification, et documentation.",
    tags: ["7-principes", "base", "haccp"]
  },
  {
    id: "q-haccp-ccp",
    moduleId: "haccp",
    difficulty: "medium",
    question: "Que signifie l'acronyme CCP dans la méthode HACCP ?",
    choices: [
      "Contrôle Continu du Processus",
      "Point Critique de Contrôle",
      "Certification de Conformité des Produits",
      "Contrôle Critique Préventif"
    ],
    correctIndex: 1,
    explanation: "CCP signifie Point Critique de Contrôle (Critical Control Point en anglais). C'est une étape où une mesure de maîtrise peut être appliquée et est essentielle pour prévenir, éliminer ou réduire un danger pour la sécurité des aliments.",
    tags: ["ccp", "point-critique", "definition"]
  },
  {
    id: "q-haccp-limite-critique",
    moduleId: "haccp",
    difficulty: "medium",
    question: "Lors d'une cuisson (CCP), la température mesurée à cœur est de 68°C alors que la limite critique est fixée à 75°C. Que doit-on faire ?",
    choices: [
      "Accepter le produit car la différence est faible",
      "Prolonger la cuisson puis remettre en surveillance",
      "Déclencher immédiatement l'action corrective prévue (prolonger cuisson, isoler le lot, analyser la cause)",
      "Attendre la prochaine mesure pour confirmer"
    ],
    correctIndex: 2,
    explanation: "Lorsqu'une limite critique est dépassée, l'action corrective doit être déclenchée immédiatement selon le principe 5 de l'HACCP. On doit corriger le processus (prolonger la cuisson), maîtriser le lot concerné, identifier la cause et documenter l'événement.",
    tags: ["limite-critique", "action-corrective", "ccp"]
  },
  {
    id: "q-haccp-prerequis",
    moduleId: "haccp",
    difficulty: "medium",
    question: "Quelle est la différence entre un Programme Pré-Requis (PRP) et un Point Critique de Contrôle (CCP) ?",
    choices: [
      "Il n'y a pas de différence, ce sont des synonymes",
      "Les PRP sont les conditions de base nécessaires avant d'appliquer l'HACCP, les CCP sont spécifiques au produit/procédé",
      "Les CCP concernent l'hygiène, les PRP concernent la sécurité alimentaire",
      "Les PRP sont optionnels, les CCP sont obligatoires"
    ],
    correctIndex: 1,
    explanation: "Les Programmes Pré-Requis (PRP) sont les conditions de base et activités nécessaires pour maintenir un environnement hygiénique (nettoyage, maintenance, lutte contre les nuisibles, etc.). Les CCP sont des étapes spécifiques au processus de fabrication où un contrôle est essentiel pour maîtriser un danger identifié.",
    tags: ["prp", "ccp", "difference"]
  },
  {
    id: "q-haccp-arbre-decision",
    moduleId: "haccp",
    difficulty: "hard",
    question: "Lors de l'analyse HACCP d'un processus de fabrication de yaourt, la fermentation à 42°C est-elle un CCP ?",
    choices: [
      "Non, car il n'y a pas de danger à cette étape",
      "Oui, car la température et la durée de fermentation doivent être maîtrisées pour garantir l'acidification et inhiber les pathogènes",
      "Non, c'est uniquement un paramètre qualité",
      "Oui, mais seulement pour le contrôle de la texture"
    ],
    correctIndex: 1,
    explanation: "La fermentation est typiquement un CCP car la température (42°C) et la durée permettent aux ferments lactiques de produire de l'acide lactique qui abaisse le pH (<4.6), créant ainsi un environnement défavorable aux pathogènes. C'est une étape critique pour la sécurité microbiologique du produit.",
    tags: ["ccp", "fermentation", "application"]
  },
  {
    id: "q-haccp-validation",
    moduleId: "haccp",
    difficulty: "hard",
    question: "Quelle est la différence entre la 'surveillance' (principe 4) et la 'vérification' (principe 6) dans l'HACCP ?",
    choices: [
      "Il n'y a pas de différence",
      "La surveillance est continue/régulière pour s'assurer que les CCP sont maîtrisés ; la vérification confirme périodiquement que le système HACCP fonctionne efficacement",
      "La surveillance est faite par la production, la vérification par le laboratoire",
      "La surveillance concerne les CCP, la vérification concerne les PRP"
    ],
    correctIndex: 1,
    explanation: "La surveillance (monitoring) est l'observation ou la mesure planifiée et continue des paramètres des CCP pour s'assurer qu'ils restent dans les limites critiques. La vérification est l'application de méthodes, procédures, tests et audits supplémentaires pour confirmer périodiquement que le système HACCP fonctionne comme prévu (ex: audits, calibration, analyses).",
    tags: ["surveillance", "verification", "difference", "principes"]
  }
];

/**
 * Helper pour récupérer les questions d'un module
 */
export function getQuestionsByModule(moduleId: string): QuizQuestion[] {
  return quizQuestions.filter(q => q.moduleId === moduleId);
}

/**
 * Helper pour récupérer des questions aléatoires
 */
export function getRandomQuestions(count: number, moduleId?: string): QuizQuestion[] {
  let pool = quizQuestions;

  if (moduleId) {
    pool = pool.filter(q => q.moduleId === moduleId);
  }

  // Shuffle et prendre les n premières
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Helper pour récupérer des questions par difficulté
 */
export function getQuestionsByDifficulty(
  difficulty: QuizQuestion['difficulty'],
  moduleId?: string
): QuizQuestion[] {
  let pool = quizQuestions;

  if (moduleId) {
    pool = pool.filter(q => q.moduleId === moduleId);
  }

  return pool.filter(q => q.difficulty === difficulty);
}

/**
 * Helper pour récupérer une question par ID
 */
export function getQuestionById(id: string): QuizQuestion | undefined {
  return quizQuestions.find(q => q.id === id);
}
