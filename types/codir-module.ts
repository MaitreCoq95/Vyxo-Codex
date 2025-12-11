// =====================================================
// VYXO CODIR MODULE - TYPESCRIPT TYPES
// =====================================================

// =====================================================
// DATABASE TYPES (matching SQL schema)
// =====================================================

export interface CodirReunionDB {
  id: string;
  date: string;
  titre: string;
  lieu: string | null;
  participants: string[];
  objectifs: string | null;
  points_discutes: string | null;
  synthese: string | null;
  prochaines_etapes: string | null;
  statut: 'planifiee' | 'en_cours' | 'terminee';
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CodirDecisionDB {
  id: string;
  reunion_id: string | null;
  titre: string;
  description: string | null;
  responsable: string;
  impact: 'low' | 'medium' | 'high';
  theme: 'Produit' | 'Finance' | 'Commercial' | 'Ops' | 'Organisation' | 'Tech';
  etat: 'idee' | 'validee' | 'en_cours' | 'terminee' | 'abandonnee';
  priorite: number; // 1=haute, 2=moyenne, 3=basse
  date_decision: string;
  date_echeance: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CodirActionDB {
  id: string;
  decision_id: string | null;
  reunion_id: string | null;
  description: string;
  responsable: string;
  deadline: string | null;
  etat: 'pending' | 'in_progress' | 'completed' | 'blocked';
  priorite: number;
  notes: string | null;
  pourcentage_avancement: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface CodirProjetDB {
  id: string;
  decision_source: string | null;
  nom: string;
  objectif: string | null;
  description: string | null;
  responsable: string;
  equipe: string[];
  kpi: string | null;
  budget: number | null;
  avancement: number;
  deadline: string | null;
  date_debut: string;
  risques: string | null;
  etat: 'en_cours' | 'termine' | 'suspendu' | 'annule';
  priorite: number;
  tags: string[];
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CodirSubtaskDB {
  id: string;
  projet_id: string;
  description: string;
  responsable: string | null;
  etat: 'pending' | 'in_progress' | 'completed';
  deadline: string | null;
  ordre: number;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface CodirKpiDB {
  id: string;
  periode: string;
  type_periode: 'month' | 'quarter' | 'year';

  // Decisions metrics
  decisions_prises: number;
  decisions_validees: number;
  decisions_terminees: number;
  taux_transformation: number | null;

  // Projects metrics
  projets_actifs: number;
  projets_termines: number;
  avancement_global: number | null;

  // Actions metrics
  actions_assignees: number;
  actions_completees: number;
  taux_completion_actions: number | null;

  // Business metrics
  diagnostics_vendus: number;
  scores_codex_generes: number;
  abonnements_uniq: number;
  ca_mensuel: number | null;

  // Capacity metrics
  charge_projets: number | null;
  capacite_disponible: number | null;

  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CodirTemplateDB {
  id: string;
  nom: string;
  type: 'cr' | 'decision' | 'action' | 'projet' | 'business_plan' | 'pitch';
  description: string | null;
  contenu_markdown: string;
  contenu_json: Record<string, any> | null;
  is_default: boolean;
  tags: string[];
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

// =====================================================
// FRONTEND TYPES (enhanced for UI)
// =====================================================

export interface CodirReunion extends CodirReunionDB {
  decisions?: CodirDecision[];
  actions?: CodirAction[];
}

export interface CodirDecision extends CodirDecisionDB {
  reunion?: CodirReunion;
  actions?: CodirAction[];
  projets?: CodirProjet[];
}

export interface CodirAction extends CodirActionDB {
  decision?: CodirDecision;
  reunion?: CodirReunion;
}

export interface CodirProjet extends CodirProjetDB {
  decision?: CodirDecision;
  subtasks?: CodirSubtask[];
}

export interface CodirSubtask extends CodirSubtaskDB {
  projet?: CodirProjet;
}

export interface CodirKpi extends CodirKpiDB {}

export interface CodirTemplate extends CodirTemplateDB {}

// =====================================================
// FORM TYPES (for creating/editing)
// =====================================================

export interface CodirReunionForm {
  date: string;
  titre: string;
  lieu?: string;
  participants: string[];
  objectifs?: string;
  points_discutes?: string;
  synthese?: string;
  prochaines_etapes?: string;
  statut: 'planifiee' | 'en_cours' | 'terminee';
}

export interface CodirDecisionForm {
  reunion_id?: string;
  titre: string;
  description?: string;
  responsable: string;
  impact: 'low' | 'medium' | 'high';
  theme: 'Produit' | 'Finance' | 'Commercial' | 'Ops' | 'Organisation' | 'Tech';
  etat: 'idee' | 'validee' | 'en_cours' | 'terminee' | 'abandonnee';
  priorite: number;
  date_decision: string;
  date_echeance?: string;
  notes?: string;
}

export interface CodirActionForm {
  decision_id?: string;
  reunion_id?: string;
  description: string;
  responsable: string;
  deadline?: string;
  etat: 'pending' | 'in_progress' | 'completed' | 'blocked';
  priorite: number;
  notes?: string;
  pourcentage_avancement: number;
}

export interface CodirProjetForm {
  decision_source?: string;
  nom: string;
  objectif?: string;
  description?: string;
  responsable: string;
  equipe: string[];
  kpi?: string;
  budget?: number;
  deadline?: string;
  date_debut: string;
  risques?: string;
  etat: 'en_cours' | 'termine' | 'suspendu' | 'annule';
  priorite: number;
  tags: string[];
}

export interface CodirSubtaskForm {
  projet_id: string;
  description: string;
  responsable?: string;
  etat: 'pending' | 'in_progress' | 'completed';
  deadline?: string;
  ordre: number;
}

// =====================================================
// DASHBOARD TYPES
// =====================================================

export interface CodirDashboardStats {
  reunions: {
    total: number;
    prochaine?: CodirReunion;
    derniere?: CodirReunion;
  };
  decisions: {
    total: number;
    en_cours: number;
    terminees: number;
    par_theme: Record<string, number>;
  };
  actions: {
    total: number;
    pending: number;
    in_progress: number;
    completed: number;
    en_retard: number;
  };
  projets: {
    total: number;
    en_cours: number;
    termines: number;
    avancement_moyen: number;
  };
}

// =====================================================
// ROADMAP TYPES
// =====================================================

export type RoadmapPeriod = '7j' | '30j' | '90j';

export interface RoadmapItem {
  id: string;
  type: 'decision' | 'action' | 'projet';
  titre: string;
  responsable: string;
  deadline: string;
  priorite: number;
  etat: string;
  avancement?: number;
}

export interface RoadmapData {
  period: RoadmapPeriod;
  items: RoadmapItem[];
  stats: {
    total: number;
    par_type: Record<string, number>;
    par_priorite: Record<string, number>;
  };
}

// =====================================================
// CONSTANTS
// =====================================================

export const CODIR_THEMES = [
  'Produit',
  'Finance',
  'Commercial',
  'Ops',
  'Organisation',
  'Tech',
] as const;

export const CODIR_IMPACTS = ['low', 'medium', 'high'] as const;

export const CODIR_DECISION_ETATS = [
  'idee',
  'validee',
  'en_cours',
  'terminee',
  'abandonnee',
] as const;

export const CODIR_ACTION_ETATS = [
  'pending',
  'in_progress',
  'completed',
  'blocked',
] as const;

export const CODIR_PROJET_ETATS = [
  'en_cours',
  'termine',
  'suspendu',
  'annule',
] as const;

export const CODIR_REUNION_STATUTS = [
  'planifiee',
  'en_cours',
  'terminee',
] as const;

export const CODIR_PRIORITES = [
  { value: 1, label: 'Haute' },
  { value: 2, label: 'Moyenne' },
  { value: 3, label: 'Basse' },
] as const;

export const CODIR_MEMBRES = [
  'Vivien Closse',
  'Nicolas Lemoine',
  'Wyssam Housseine',
  'Rafael Moreira Ferreira',
  'Aurore Chardon',
] as const;

// =====================================================
// HELPER TYPES
// =====================================================

export type CodirTheme = typeof CODIR_THEMES[number];
export type CodirImpact = typeof CODIR_IMPACTS[number];
export type CodirDecisionEtat = typeof CODIR_DECISION_ETATS[number];
export type CodirActionEtat = typeof CODIR_ACTION_ETATS[number];
export type CodirProjetEtat = typeof CODIR_PROJET_ETATS[number];
export type CodirReunionStatut = typeof CODIR_REUNION_STATUTS[number];
export type CodirMembre = typeof CODIR_MEMBRES[number];
