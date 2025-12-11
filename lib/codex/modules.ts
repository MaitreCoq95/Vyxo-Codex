import { KnowledgeModule } from "@/types/codex";

/**
 * Liste complète des modules de connaissance Vyxo Codex
 */
export const knowledgeModules: KnowledgeModule[] = [
  {
    id: "iso-9001",
    code: "ISO 9001",
    title: "ISO 9001 – Système de management de la qualité",
    category: "ISO",
    shortDescription: "Exigences pour structurer un système de management de la qualité orienté client, amélioration continue et maîtrise des processus.",
    sectors: ["Industrie", "Transport", "Services"],
    level: "intermediate",
    tags: ["qualité", "smq", "processus"]
  },
  {
    id: "iso-14001",
    code: "ISO 14001",
    title: "ISO 14001 – Management environnemental",
    category: "ISO",
    shortDescription: "Exigences pour maîtriser les impacts environnementaux, les aspects significatifs et la conformité réglementaire.",
    sectors: ["Industrie", "Logistique"],
    level: "intermediate",
    tags: ["environnement", "icpe", "aspects-impacts"]
  },
  {
    id: "iso-45001",
    code: "ISO 45001",
    title: "ISO 45001 – Santé et sécurité au travail",
    category: "ISO",
    shortDescription: "Cadre pour identifier les dangers, évaluer les risques et améliorer les conditions de travail.",
    sectors: ["Industrie", "Transport", "Logistique"],
    level: "intermediate",
    tags: ["sst", "risques", "duerp"]
  },
  {
    id: "iso-27001",
    code: "ISO 27001",
    title: "ISO 27001 – Sécurité de l'information",
    category: "ITSec",
    shortDescription: "Système de management pour la sécurité de l'information et la protection des données critiques.",
    sectors: ["IT", "SaaS", "Services"],
    level: "advanced",
    tags: ["cybersécurité", "risques", "annexe-a"]
  },
  {
    id: "iso-42001",
    code: "ISO 42001",
    title: "ISO 42001 – Système de management de l'intelligence artificielle",
    category: "ITSec",
    shortDescription: "Cadre de gouvernance pour développer, déployer et utiliser des systèmes d'IA de manière responsable et éthique.",
    sectors: ["IT", "SaaS", "Services", "Industrie"],
    level: "advanced",
    tags: ["ia", "ai", "gouvernance", "éthique", "risques-ia"]
  },
  {
    id: "gamp-5",
    code: "GAMP 5",
    title: "GAMP 5 – Validation des systèmes informatisés",
    category: "ITSec",
    shortDescription: "Approche basée sur les risques pour la validation des systèmes GxP.",
    sectors: ["Pharma", "Biotech", "Labos"],
    level: "advanced",
    tags: ["csv", "validation", "gxp"]
  },
  {
    id: "exop",
    title: "Excellence Opérationnelle",
    category: "ExOp",
    shortDescription: "Approche globale Lean / Six Sigma / management visuel pour améliorer la performance durablement.",
    sectors: ["Industrie", "Logistique", "Services"],
    level: "advanced",
    tags: ["lean", "six-sigma", "performance"]
  },
  {
    id: "gdp",
    code: "GDP",
    title: "GDP – Good Distribution Practice",
    category: "Pharma",
    shortDescription: "Référentiel pour sécuriser la distribution et le transport des produits de santé.",
    sectors: ["Transport", "Logistique", "Pharma"],
    level: "advanced",
    tags: ["distribution", "transport", "qualité"]
  },
  {
    id: "gmp",
    code: "GMP",
    title: "GMP – Good Manufacturing Practice",
    category: "Pharma",
    shortDescription: "Exigences pour garantir que les médicaments sont produits et contrôlés de manière conforme.",
    sectors: ["Production pharma", "Biotech"],
    level: "advanced",
    tags: ["production", "qualité", "bpf"]
  },
  {
    id: "ceiv-pharma",
    title: "CEIV Pharma – Fret aérien & chaîne du froid",
    category: "Transport",
    shortDescription: "Standard IATA pour sécuriser le transport aérien de produits pharmaceutiques sensibles.",
    sectors: ["Fret aérien", "Transport international"],
    level: "advanced",
    tags: ["iata", "air-cargo", "cold-chain"]
  },
  {
    id: "cold-chain-packaging",
    title: "Chaîne du froid & Emballages actifs/passifs",
    category: "Transport",
    shortDescription: "Conception, qualification et utilisation d'emballages pour le transport sous température dirigée.",
    sectors: ["Pharma", "Agro", "Logistique"],
    level: "advanced",
    tags: ["emballages", "passif", "actif", "température"]
  },
  {
    id: "lean-six-sigma",
    title: "Lean / Six Sigma",
    category: "ExOp",
    shortDescription: "Méthodologies d'amélioration continue pour réduire les gaspillages et la variabilité.",
    sectors: ["Industrie", "Logistique", "Services"],
    level: "advanced",
    tags: ["lean", "six-sigma", "dmaic", "5s"]
  },
  {
    id: "audit-methodologies",
    title: "Audit & Méthodologies",
    category: "ISO",
    shortDescription: "Techniques d'audit interne et externe pour évaluer la conformité et l'efficacité des systèmes de management.",
    sectors: ["Tous secteurs"],
    level: "intermediate",
    tags: ["audit", "conformité", "iso-19011"]
  },
  {
    id: "haccp",
    code: "HACCP",
    title: "HACCP – Analyse des dangers et points critiques",
    category: "Pharma",
    shortDescription: "Système préventif de maîtrise de la sécurité sanitaire des aliments basé sur l'identification, l'évaluation et la maîtrise des dangers.",
    sectors: ["Agroalimentaire", "Restauration", "Industrie alimentaire", "Distribution alimentaire"],
    level: "advanced",
    tags: ["haccp", "sécurité-alimentaire", "7-principes", "pcc", "codex-alimentarius"]
  },
  {
    id: "surete-112x",
    code: "11.2.x",
    title: "Formations Sûreté – Référentiel 11.2.x",
    category: "Sûreté",
    shortDescription: "Formations obligatoires de sûreté aérienne selon le Règlement (UE) 2015/1998 : contrôle d'accès, filtrage fret, surveillance zones sensibles, supervision et niveau renforcé.",
    sectors: ["Fret aérien", "Transport", "Logistique", "Aviation"],
    level: "advanced",
    tags: ["sûreté", "aviation", "fret", "contrôle-accès", "filtrage", "zsar", "supervision"]
  }
];

/**
 * Helper pour récupérer tous les modules
 */
export function getAllModules(): KnowledgeModule[] {
  return knowledgeModules;
}

/**
 * Helper pour récupérer un module par son ID
 */
export function getModuleById(id: string): KnowledgeModule | undefined {
  return knowledgeModules.find(m => m.id === id);
}

/**
 * Helper pour filtrer les modules par catégorie
 */
export function getModulesByCategory(category: KnowledgeModule['category']): KnowledgeModule[] {
  return knowledgeModules.filter(m => m.category === category);
}

/**
 * Helper pour rechercher des modules par tags
 */
export function searchModules(query: string): KnowledgeModule[] {
  const lowerQuery = query.toLowerCase();
  return knowledgeModules.filter(m =>
    m.title.toLowerCase().includes(lowerQuery) ||
    m.shortDescription.toLowerCase().includes(lowerQuery) ||
    m.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    (m.code && m.code.toLowerCase().includes(lowerQuery))
  );
}
