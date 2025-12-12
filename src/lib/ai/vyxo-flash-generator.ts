import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { notifyVyxoFlashReady } from '@/lib/notifications/notification-service';

interface VyxoFlash {
  id: string;
  teamId: string;
  date: Date;
  titre: string;
  hook: string;
  contexte: string;
  exercice_pratique: {
    description: string;
    question: string;
    points_cles: string[];
  };
  message_cle: string;
  action_immediate: string;
  temps_estime: string;
  criticalGap: any;
  affectedUsers: string[];
}

export async function generateDailyVyxoFlash(teamId: string): Promise<VyxoFlash> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  // 1. Analyser les gaps de l'équipe (dernières 24h)
  const { data: gaps } = await supabase.rpc('analyze_team_gaps', {
    p_team_id: teamId,
    p_period: '24 hours'
  });
  
  if (!gaps?.criticalSkills || gaps.criticalSkills.length === 0) {
    // Pas de gap critique, générer un flash de révision
    return generateReviewFlash(teamId);
  }
  
  const criticalGap = gaps.criticalSkills[0]; // Top priority
  
  // 2. Générer le contenu avec Claude
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
  
  const message = await anthropic.messages.create({
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
    }],
  });
  
  const flashContent = JSON.parse(message.content[0].text);
  
  // 3. Enrichir et stocker
  const vyxoFlash: VyxoFlash = {
    id: crypto.randomUUID(),
    teamId,
    date: new Date(),
    ...flashContent,
    criticalGap,
    affectedUsers: criticalGap.affectedUsers,
  };
  
  const { error } = await supabase
    .from('vyxo_flashes')
    .insert({
      team_id: teamId,
      date: new Date().toISOString().split('T')[0],
      titre: vyxoFlash.titre,
      hook: vyxoFlash.hook,
      contexte: vyxoFlash.contexte,
      exercice_pratique: vyxoFlash.exercice_pratique,
      message_cle: vyxoFlash.message_cle,
      action_immediate: vyxoFlash.action_immediate,
      critical_gap: criticalGap,
      affected_users: criticalGap.affectedUsers,
    });
    
  if (error) throw error;
  
  // 4. Notifier le manager
  await notifyManager(teamId, vyxoFlash);
  
  return vyxoFlash;
}

async function generateReviewFlash(teamId: string): Promise<VyxoFlash> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  // Flash de révision générique
  const reviewFlash: VyxoFlash = {
    id: crypto.randomUUID(),
    teamId,
    date: new Date(),
    titre: "Journée de consolidation",
    hook: "Aucune lacune critique détectée aujourd'hui - Bravo à l'équipe ! 🎉",
    contexte: "Votre équipe maintient un bon niveau de compétences. Profitons-en pour consolider les acquis et partager les bonnes pratiques.",
    exercice_pratique: {
      description: "Tour de table rapide : chaque personne partage une bonne pratique qu'elle a appliquée cette semaine",
      question: "Quelle action qualité/sécurité vous a le plus aidé cette semaine ?",
      points_cles: [
        "Valoriser les bonnes pratiques terrain",
        "Encourager le partage d'expérience",
        "Maintenir la vigilance collective"
      ]
    },
    message_cle: "La qualité se construit jour après jour, ensemble",
    action_immediate: "Continuer à appliquer les standards avec rigueur",
    temps_estime: "2 min",
    criticalGap: null,
    affectedUsers: [],
  };
  
  await supabase.from('vyxo_flashes').insert({
    team_id: teamId,
    date: new Date().toISOString().split('T')[0],
    titre: reviewFlash.titre,
    hook: reviewFlash.hook,
    contexte: reviewFlash.contexte,
    exercice_pratique: reviewFlash.exercice_pratique,
    message_cle: reviewFlash.message_cle,
    action_immediate: reviewFlash.action_immediate,
    critical_gap: null,
    affected_users: [],
  });
  
  return reviewFlash;
}

async function notifyManager(teamId: string, flash: VyxoFlash) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: team } = await supabase
    .from('teams')
    .select('manager_id, name')
    .eq('id', teamId)
    .single();

  if (!team?.manager_id) return;

  // Envoyer notification au manager
  await notifyVyxoFlashReady(
    team.manager_id,
    team.name,
    flash.titre,
    ['in_app', 'push', 'email']
  );

  console.log(`✅ Vyxo Flash généré pour équipe ${team.name} - Manager notifié`);
}

export async function scheduleVyxoFlashGeneration() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  // Récupérer toutes les équipes actives
  const { data: teams } = await supabase
    .from('teams')
    .select('id, name, manager_id')
    .not('manager_id', 'is', null);
    
  for (const team of teams || []) {
    try {
      await generateDailyVyxoFlash(team.id);
      console.log(`✅ Flash généré pour ${team.name}`);
    } catch (error) {
      console.error(`❌ Erreur pour ${team.name}:`, error);
    }
  }
}
