import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // Récupérer toutes les équipes
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select('id, name, manager_id')
      .not('manager_id', 'is', null);
      
    if (teamsError) throw teamsError;
    
    const results = [];
    
    for (const team of teams) {
      // Analyser gaps
      const { data: gaps } = await supabase.rpc('analyze_team_gaps', {
        p_team_id: team.id,
        p_period: '24 hours'
      });
      
      if (!gaps?.criticalSkills || gaps.criticalSkills.length === 0) {
        results.push({ team: team.name, status: 'no_gaps' });
        continue;
      }
      
      const criticalGap = gaps.criticalSkills[0];
      
      // Appeler API Anthropic pour générer le flash
      const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': Deno.env.get('ANTHROPIC_API_KEY') ?? '',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1500,
          temperature: 0.7,
          messages: [{
            role: 'user',
            content: `Tu es un expert en formation opérationnelle transport/logistique avec 15 ans d'expérience.

Génère un briefing de 2 minutes pour un manager d'équipe, basé sur ces données :

**LACUNE CRITIQUE DÉTECTÉE :**
- Compétence : ${criticalGap.skill}
- Taux d'échec : ${criticalGap.failureRate}%
- Collaborateurs concernés : ${criticalGap.affectedUsers.length} personnes
- Score moyen : ${criticalGap.avgScore}/100

**CONTEXTE ÉQUIPE :**
- Incidents récents liés : ${gaps.recentIncidents}
- Score global équipe : ${gaps.overallScore}/100

**FORMAT REQUIS (JSON strict) :**
{
  "titre": "Titre accrocheur 5-7 mots",
  "hook": "Phrase d'accroche percutante qui capte l'attention immédiatement",
  "contexte": "2-3 phrases expliquant pourquoi c'est important MAINTENANT. Utilise des chiffres concrets.",
  "exercice_pratique": {
    "description": "Activité interactive 60-90 secondes que le manager peut faire avec son équipe",
    "question": "Question concrète à poser à l'équipe pour les engager",
    "points_cles": [
      "Point clé #1 - Action concrète",
      "Point clé #2 - Comportement à adopter",
      "Point clé #3 - Erreur à éviter"
    ]
  },
  "message_cle": "Phrase à retenir, maximum 1 ligne, percutante",
  "action_immediate": "Ce que chaque personne doit faire AUJOURD'HUI",
  "temps_estime": "2 min"
}

**RÈGLES IMPORTANTES :**
- Langage terrain, pas de jargon technique
- Ton positif et constructif (jamais accusateur)
- Focus sécurité/qualité/client
- Concret et actionnable
- Pas de généralités, que des exemples précis`
          }]
        })
      });
      
      const anthropicData = await anthropicResponse.json();

      // Validation de la réponse Anthropic
      if (!anthropicData?.content?.[0]?.text) {
        console.error('Invalid Anthropic response:', anthropicData);
        results.push({ team: team.name, status: 'error', error: 'Invalid AI response' });
        continue;
      }

      // Parse avec gestion d'erreur
      let flashContent;
      try {
        flashContent = JSON.parse(anthropicData.content[0].text);

        // Validation de la structure
        if (!flashContent.titre || !flashContent.hook || !flashContent.exercice_pratique) {
          throw new Error('Missing required fields in AI response');
        }
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        results.push({ team: team.name, status: 'error', error: 'Failed to parse AI response' });
        continue;
      }
      
      // Stocker le flash
      const { error: insertError } = await supabase
        .from('vyxo_flashes')
        .insert({
          team_id: team.id,
          date: new Date().toISOString().split('T')[0],
          titre: flashContent.titre,
          hook: flashContent.hook,
          contexte: flashContent.contexte,
          exercice_pratique: flashContent.exercice_pratique,
          message_cle: flashContent.message_cle,
          action_immediate: flashContent.action_immediate,
          critical_gap: criticalGap,
          affected_users: criticalGap.affectedUsers,
        });
        
      if (insertError) throw insertError;
      
      results.push({ team: team.name, status: 'generated' });
    }
    
    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
