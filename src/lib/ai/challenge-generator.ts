import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

interface DailyChallenge {
  id: string;
  userId: string;
  skillId: string;
  type: 'photo_interactive' | 'quiz_visual' | 'scenario';
  content: {
    teaser: string;
    image_description?: string;
    question: string;
    options: Array<{
      text: string;
      correct: boolean;
      explanation: string;
    }>;
    feedback_correct: string;
    feedback_incorrect: string;
  };
  scheduledFor: Date;
}

export async function generateContextualChallenge(
  userId: string,
  weakestSkill: any
): Promise<DailyChallenge> {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
  
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1500,
    temperature: 0.7,
    messages: [{
      role: 'user',
      content: `Génère un micro-challenge de 3 minutes pour renforcer cette compétence :

Compétence : ${weakestSkill.module_title}
Niveau actuel : ${weakestSkill.mastery_level}/4
Score récent : ${weakestSkill.score}/100

Format JSON strict :
{
  "type": "photo_interactive",
  "teaser": "Phrase accroche courte et motivante",
  "image_description": "Description détaillée d'une situation terrain à visualiser",
  "question": "Question claire et concrète sur la situation",
  "options": [
    { "text": "Option A", "correct": true, "explanation": "Explication détaillée pourquoi c'est correct" },
    { "text": "Option B", "correct": false, "explanation": "Explication pourquoi c'est incorrect" },
    { "text": "Option C", "correct": false, "explanation": "Explication pourquoi c'est incorrect" },
    { "text": "Option D", "correct": false, "explanation": "Explication pourquoi c'est incorrect" }
  ],
  "feedback_correct": "Bravo ! +10 pts. [explication complémentaire]",
  "feedback_incorrect": "Pas grave ! Voici pourquoi : [explication pédagogique]"
}

**RÈGLES :**
- Situation terrain réaliste et concrète
- Question claire, pas de piège
- 4 options de réponse
- Explications pédagogiques
- Ton encourageant et positif`
    }],
  });
  
  const challengeData = JSON.parse(message.content[0].text);
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  // Stocker en base
  const { data, error } = await supabase
    .from('daily_challenges')
    .insert({
      user_id: userId,
      skill_id: weakestSkill.module_id,
      type: challengeData.type,
      content: challengeData,
      scheduled_for: new Date().toISOString()
    })
    .select()
    .single();
    
  if (error) throw error;
  
  return {
    id: data.id,
    userId,
    skillId: weakestSkill.module_id,
    type: challengeData.type,
    content: challengeData,
    scheduledFor: new Date()
  };
}

export async function getWeakestSkill(userId: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  // Trouver la compétence la plus faible (score < 70 ou mastery_level < 2)
  const { data: progress } = await supabase
    .from('user_progress')
    .select(`
      *,
      modules(id, title)
    `)
    .eq('user_id', userId)
    .or('score.lt.70,mastery_level.lt.2')
    .order('score', { ascending: true })
    .limit(1)
    .single();
    
  if (!progress) {
    // Pas de lacune, prendre une compétence au hasard pour révision
    const { data: randomProgress } = await supabase
      .from('user_progress')
      .select(`
        *,
        modules(id, title)
      `)
      .eq('user_id', userId)
      .limit(1)
      .single();
      
    return randomProgress ? {
      module_id: randomProgress.modules.id,
      module_title: randomProgress.modules.title,
      mastery_level: randomProgress.mastery_level,
      score: randomProgress.score
    } : null;
  }
  
  return {
    module_id: progress.modules.id,
    module_title: progress.modules.title,
    mastery_level: progress.mastery_level,
    score: progress.score
  };
}

export async function scheduleDailyChallenges() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  // Récupérer tous les utilisateurs actifs
  const { data: users } = await supabase
    .from('profiles')
    .select('id')
    .gte('last_activity_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
    
  for (const user of users || []) {
    try {
      const weakestSkill = await getWeakestSkill(user.id);
      
      if (weakestSkill) {
        await generateContextualChallenge(user.id, weakestSkill);
        console.log(`✅ Challenge généré pour utilisateur ${user.id}`);
      }
    } catch (error) {
      console.error(`❌ Erreur pour utilisateur ${user.id}:`, error);
    }
  }
}
