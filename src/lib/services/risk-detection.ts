import { createClient } from '@/infrastructure/supabase/client';

export async function detectTeamRisks(teamId: string) {
  const supabase = createClient();
  const alerts = [];
  
  // 1. Détecter patterns compétences
  const { data: skillGaps } = await supabase.rpc('analyze_team_gaps', {
    p_team_id: teamId,
    p_period: '7 days'
  });
  
  if (skillGaps?.criticalSkills) {
    for (const gap of skillGaps.criticalSkills) {
      if (gap.affectedUsers.length >= 3 && gap.failureRate >= 50) {
        alerts.push({
          id: crypto.randomUUID(),
          severity: gap.failureRate >= 70 ? 'critical' : 'high',
          type: 'skill_gap',
          title: `⚠️ ${gap.affectedUsers.length} personnes en difficulté : ${gap.skill}`,
          description: `Attention, ${gap.affectedUsers.length} collaborateurs ont échoué sur "${gap.skill}" cette semaine. Taux d'échec : ${gap.failureRate}%. Risque opérationnel élevé.`,
          affectedUsers: gap.affectedUsers,
          recommendations: [
            "Formation express immédiate (2-4h)",
            "Contrôle renforcé avant missions",
            "Vidéo de rappel à visionner ce soir",
            "Accompagnement terrain par un référent"
          ],
          potentialImpact: {
            financial: 15000,
            operational: "Retards, insatisfaction client, risque incident",
            compliance: "Responsabilité en cas d'accident ou avarie"
          }
        });
      }
    }
  }
  
  // 2. Détecter patterns incidents
  const { data: incidents } = await supabase
    .from('incidents')
    .select('*')
    .eq('team_id', teamId)
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: false });
    
  if (incidents && incidents.length > 0) {
    // Grouper par type
    const incidentsByType = incidents.reduce((acc: any, inc: any) => {
      acc[inc.type] = (acc[inc.type] || []).concat(inc);
      return acc;
    }, {} as Record<string, any[]>);
    
    for (const [type, incs] of Object.entries(incidentsByType)) {
      if (incs.length >= 3) {
        const totalCost = incs.reduce((sum: number, inc: any) => sum + (inc.cost || 0), 0);
        
        alerts.push({
          id: crypto.randomUUID(),
          severity: 'critical',
          type: 'incident_pattern',
          title: `🚨 Pattern détecté : ${incs.length} incidents "${type}" en 30 jours`,
          description: `Un pattern préoccupant émerge : ${incs.length} incidents de type "${type}" ce mois-ci. Coût cumulé : ${totalCost.toLocaleString('fr-FR')}€. Analyse des causes racines recommandée.`,
          affectedUsers: [...new Set(incs.map((i: any) => i.user_id).filter(Boolean))],
          recommendations: [
            "Réunion analyse causes racines (méthode 5 Pourquoi)",
            "Audit approfondi du process concerné",
            "Formation corrective ciblée",
            "Mise en place actions préventives"
          ],
          potentialImpact: {
            financial: totalCost * 2, // Projection
            operational: "Perte confiance client + charge administrative",
            compliance: "Risque audit / suspension certification"
          }
        });
      }
    }
  }
  
  // 3. Risque conformité (si score IMO bas)
  const { data: team } = await supabase
    .from('teams')
    .select('company_id')
    .eq('id', teamId)
    .single();
    
  if (team) {
    const { data: kpis } = await supabase
      .from('company_kpis')
      .select('*')
      .eq('company_id', team.company_id)
      .order('date', { ascending: false })
      .limit(1)
      .single();
      
    if (kpis && kpis.imo_global < 60) {
      alerts.push({
        id: crypto.randomUUID(),
        severity: 'critical',
        type: 'compliance_risk',
        title: `🚨 Conformité critique : Score IMO ${kpis.imo_global}/100`,
        description: `Le niveau de maturité opérationnelle est passé sous le seuil critique. Risque élevé d'échec audit et de non-conformité réglementaire.`,
        affectedUsers: [],
        recommendations: [
          "Audit blanc express dans 48h",
          "Plan d'action correctif 30 jours",
          "Formation équipe prioritaire",
          "Assistance externe si nécessaire"
        ],
        potentialImpact: {
          financial: 75000,
          operational: "Suspension activité possible",
          compliance: "Perte licence / Amendes ANSM"
        }
      });
    }
  }
  
  // Stocker les alertes
  for (const alert of alerts) {
    await supabase.from('risk_alerts').insert({
      team_id: teamId,
      severity: alert.severity,
      type: alert.type,
      title: alert.title,
      description: alert.description,
      affected_users: alert.affectedUsers,
      recommendations: alert.recommendations,
      potential_impact: alert.potentialImpact,
    });
  }
  
  return alerts.sort((a: any, b: any) => {
    const severityOrder: any = { critical: 0, high: 1, medium: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
}

export async function monitorAllTeamsRisks() {
  const supabase = createClient();
  
  const { data: teams } = await supabase
    .from('teams')
    .select('id, name, manager_id');
    
  for (const team of teams || []) {
    const alerts = await detectTeamRisks(team.id);
    
    if (alerts.length > 0) {
      console.log(`⚠️ ${alerts.length} alerte(s) pour équipe ${team.name}`);
    }
  }
}
