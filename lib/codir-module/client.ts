// =====================================================
// VYXO CODIR MODULE - SUPABASE CLIENT
// =====================================================

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type {
  CodirReunion,
  CodirDecision,
  CodirAction,
  CodirProjet,
  CodirSubtask,
  CodirKpi,
  CodirTemplate,
  CodirDashboardStats,
  RoadmapData,
  RoadmapPeriod,
} from '@/types/codir-module';

const supabase = createClientComponentClient();

// =====================================================
// RÉUNIONS
// =====================================================

export async function getReunions(): Promise<CodirReunion[]> {
  const { data, error } = await supabase
    .from('codir_reunions')
    .select('*')
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getReunion(id: string): Promise<CodirReunion | null> {
  const { data, error } = await supabase
    .from('codir_reunions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createReunion(reunion: Partial<CodirReunion>): Promise<CodirReunion> {
  const { data, error } = await supabase
    .from('codir_reunions')
    .insert(reunion)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateReunion(id: string, updates: Partial<CodirReunion>): Promise<CodirReunion> {
  const { data, error } = await supabase
    .from('codir_reunions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteReunion(id: string): Promise<void> {
  const { error } = await supabase
    .from('codir_reunions')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// =====================================================
// DÉCISIONS
// =====================================================

export async function getDecisions(): Promise<CodirDecision[]> {
  const { data, error } = await supabase
    .from('codir_decisions')
    .select('*')
    .order('date_decision', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getDecision(id: string): Promise<CodirDecision | null> {
  const { data, error } = await supabase
    .from('codir_decisions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getDecisionsByReunion(reunionId: string): Promise<CodirDecision[]> {
  const { data, error } = await supabase
    .from('codir_decisions')
    .select('*')
    .eq('reunion_id', reunionId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createDecision(decision: Partial<CodirDecision>): Promise<CodirDecision> {
  const { data, error } = await supabase
    .from('codir_decisions')
    .insert(decision)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateDecision(id: string, updates: Partial<CodirDecision>): Promise<CodirDecision> {
  const { data, error } = await supabase
    .from('codir_decisions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteDecision(id: string): Promise<void> {
  const { error } = await supabase
    .from('codir_decisions')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// =====================================================
// ACTIONS
// =====================================================

export async function getActions(): Promise<CodirAction[]> {
  const { data, error } = await supabase
    .from('codir_actions')
    .select('*')
    .order('deadline', { ascending: true, nullsFirst: false });

  if (error) throw error;
  return data || [];
}

export async function getAction(id: string): Promise<CodirAction | null> {
  const { data, error } = await supabase
    .from('codir_actions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getActionsByDecision(decisionId: string): Promise<CodirAction[]> {
  const { data, error } = await supabase
    .from('codir_actions')
    .select('*')
    .eq('decision_id', decisionId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getActionsByReunion(reunionId: string): Promise<CodirAction[]> {
  const { data, error } = await supabase
    .from('codir_actions')
    .select('*')
    .eq('reunion_id', reunionId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createAction(action: Partial<CodirAction>): Promise<CodirAction> {
  const { data, error } = await supabase
    .from('codir_actions')
    .insert(action)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateAction(id: string, updates: Partial<CodirAction>): Promise<CodirAction> {
  const { data, error } = await supabase
    .from('codir_actions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteAction(id: string): Promise<void> {
  const { error } = await supabase
    .from('codir_actions')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// =====================================================
// PROJETS
// =====================================================

export async function getProjets(): Promise<CodirProjet[]> {
  const { data, error } = await supabase
    .from('codir_projets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getProjet(id: string): Promise<CodirProjet | null> {
  const { data, error } = await supabase
    .from('codir_projets')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createProjet(projet: Partial<CodirProjet>): Promise<CodirProjet> {
  const { data, error } = await supabase
    .from('codir_projets')
    .insert(projet)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProjet(id: string, updates: Partial<CodirProjet>): Promise<CodirProjet> {
  const { data, error } = await supabase
    .from('codir_projets')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProjet(id: string): Promise<void> {
  const { error } = await supabase
    .from('codir_projets')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// =====================================================
// SUBTASKS
// =====================================================

export async function getSubtasksByProjet(projetId: string): Promise<CodirSubtask[]> {
  const { data, error } = await supabase
    .from('codir_subtasks')
    .select('*')
    .eq('projet_id', projetId)
    .order('ordre', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function createSubtask(subtask: Partial<CodirSubtask>): Promise<CodirSubtask> {
  const { data, error } = await supabase
    .from('codir_subtasks')
    .insert(subtask)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateSubtask(id: string, updates: Partial<CodirSubtask>): Promise<CodirSubtask> {
  const { data, error } = await supabase
    .from('codir_subtasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteSubtask(id: string): Promise<void> {
  const { error } = await supabase
    .from('codir_subtasks')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// =====================================================
// KPIs
// =====================================================

export async function getKpis(): Promise<CodirKpi[]> {
  const { data, error } = await supabase
    .from('codir_kpis')
    .select('*')
    .order('periode', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getKpiByPeriod(periode: string, typePeriode: 'month' | 'quarter' | 'year'): Promise<CodirKpi | null> {
  const { data, error } = await supabase
    .from('codir_kpis')
    .select('*')
    .eq('periode', periode)
    .eq('type_periode', typePeriode)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
  return data;
}

export async function createKpi(kpi: Partial<CodirKpi>): Promise<CodirKpi> {
  const { data, error } = await supabase
    .from('codir_kpis')
    .insert(kpi)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateKpi(id: string, updates: Partial<CodirKpi>): Promise<CodirKpi> {
  const { data, error } = await supabase
    .from('codir_kpis')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// =====================================================
// TEMPLATES
// =====================================================

export async function getTemplates(): Promise<CodirTemplate[]> {
  const { data, error } = await supabase
    .from('codir_templates')
    .select('*')
    .order('nom', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getTemplatesByType(type: string): Promise<CodirTemplate[]> {
  const { data, error } = await supabase
    .from('codir_templates')
    .select('*')
    .eq('type', type)
    .order('nom', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getDefaultTemplate(type: string): Promise<CodirTemplate | null> {
  const { data, error } = await supabase
    .from('codir_templates')
    .select('*')
    .eq('type', type)
    .eq('is_default', true)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function createTemplate(template: Partial<CodirTemplate>): Promise<CodirTemplate> {
  const { data, error } = await supabase
    .from('codir_templates')
    .insert(template)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTemplate(id: string, updates: Partial<CodirTemplate>): Promise<CodirTemplate> {
  const { data, error } = await supabase
    .from('codir_templates')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTemplate(id: string): Promise<void> {
  const { error } = await supabase
    .from('codir_templates')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// =====================================================
// DASHBOARD STATS
// =====================================================

export async function getDashboardStats(): Promise<CodirDashboardStats> {
  // Get all data in parallel
  const [reunions, decisions, actions, projets] = await Promise.all([
    getReunions(),
    getDecisions(),
    getActions(),
    getProjets(),
  ]);

  // Process reunions
  const reunionsStats = {
    total: reunions.length,
    prochaine: reunions.find(r => new Date(r.date) > new Date() && r.statut !== 'terminee'),
    derniere: reunions.find(r => r.statut === 'terminee'),
  };

  // Process decisions
  const decisionsParTheme: Record<string, number> = {};
  decisions.forEach(d => {
    decisionsParTheme[d.theme] = (decisionsParTheme[d.theme] || 0) + 1;
  });

  const decisionsStats = {
    total: decisions.length,
    en_cours: decisions.filter(d => d.etat === 'en_cours').length,
    terminees: decisions.filter(d => d.etat === 'terminee').length,
    par_theme: decisionsParTheme,
  };

  // Process actions
  const today = new Date().toISOString().split('T')[0];
  const actionsStats = {
    total: actions.length,
    pending: actions.filter(a => a.etat === 'pending').length,
    in_progress: actions.filter(a => a.etat === 'in_progress').length,
    completed: actions.filter(a => a.etat === 'completed').length,
    en_retard: actions.filter(a => a.deadline && a.deadline < today && a.etat !== 'completed').length,
  };

  // Process projets
  const projetsEnCours = projets.filter(p => p.etat === 'en_cours');
  const avancementMoyen = projetsEnCours.length > 0
    ? projetsEnCours.reduce((sum, p) => sum + p.avancement, 0) / projetsEnCours.length
    : 0;

  const projetsStats = {
    total: projets.length,
    en_cours: projetsEnCours.length,
    termines: projets.filter(p => p.etat === 'termine').length,
    avancement_moyen: Math.round(avancementMoyen),
  };

  return {
    reunions: reunionsStats,
    decisions: decisionsStats,
    actions: actionsStats,
    projets: projetsStats,
  };
}

// =====================================================
// ROADMAP
// =====================================================

export async function getRoadmapData(period: RoadmapPeriod): Promise<RoadmapData> {
  const today = new Date();
  let endDate: Date;

  switch (period) {
    case '7j':
      endDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      break;
    case '30j':
      endDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
      break;
    case '90j':
      endDate = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
      break;
  }

  const endDateStr = endDate.toISOString().split('T')[0];

  // Get all relevant items in parallel
  const [decisions, actions, projets] = await Promise.all([
    supabase
      .from('codir_decisions')
      .select('*')
      .lte('date_echeance', endDateStr)
      .neq('etat', 'terminee')
      .order('date_echeance', { ascending: true }),
    supabase
      .from('codir_actions')
      .select('*')
      .lte('deadline', endDateStr)
      .neq('etat', 'completed')
      .order('deadline', { ascending: true }),
    supabase
      .from('codir_projets')
      .select('*')
      .lte('deadline', endDateStr)
      .eq('etat', 'en_cours')
      .order('deadline', { ascending: true }),
  ]);

  // Combine and transform items
  const items = [
    ...(decisions.data || []).map(d => ({
      id: d.id,
      type: 'decision' as const,
      titre: d.titre,
      responsable: d.responsable,
      deadline: d.date_echeance || '',
      priorite: d.priorite,
      etat: d.etat,
    })),
    ...(actions.data || []).map(a => ({
      id: a.id,
      type: 'action' as const,
      titre: a.description,
      responsable: a.responsable,
      deadline: a.deadline || '',
      priorite: a.priorite,
      etat: a.etat,
      avancement: a.pourcentage_avancement,
    })),
    ...(projets.data || []).map(p => ({
      id: p.id,
      type: 'projet' as const,
      titre: p.nom,
      responsable: p.responsable,
      deadline: p.deadline || '',
      priorite: p.priorite,
      etat: p.etat,
      avancement: p.avancement,
    })),
  ].filter(item => item.deadline); // Filter out items without deadline

  // Sort by deadline
  items.sort((a, b) => a.deadline.localeCompare(b.deadline));

  // Calculate stats
  const parType: Record<string, number> = {};
  const parPriorite: Record<string, number> = {};

  items.forEach(item => {
    parType[item.type] = (parType[item.type] || 0) + 1;
    parPriorite[item.priorite] = (parPriorite[item.priorite] || 0) + 1;
  });

  return {
    period,
    items,
    stats: {
      total: items.length,
      par_type: parType,
      par_priorite: parPriorite,
    },
  };
}
