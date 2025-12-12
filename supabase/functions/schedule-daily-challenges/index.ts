import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // Récupérer tous les utilisateurs actifs (dernière activité < 7 jours)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id')
      .gte('last_activity_date', sevenDaysAgo.toISOString());
      
    if (usersError) throw usersError;
    
    const results = [];
    
    for (const user of users || []) {
      try {
        // Trouver la compétence la plus faible
        const { data: progress } = await supabase
          .from('user_progress')
          .select(`
            *,
            modules(id, title)
          `)
          .eq('user_id', user.id)
          .or('score.lt.70,mastery_level.lt.2')
          .order('score', { ascending: true })
          .limit(1)
          .single();
          
        if (!progress) {
          results.push({ user: user.id, status: 'no_weak_skill' });
          continue;
        }
        
        const weakestSkill = {
          module_id: progress.modules.id,
          module_title: progress.modules.title,
          mastery_level: progress.mastery_level,
          score: progress.score
        };
        
        // Appeler API Anthropic pour générer le challenge
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
            }]
          })
        });
        
        const anthropicData = await anthropicResponse.json();
        const challengeData = JSON.parse(anthropicData.content[0].text);
        
        // Stocker le challenge
        const { error: insertError } = await supabase
          .from('daily_challenges')
          .insert({
            user_id: user.id,
            skill_id: weakestSkill.module_id,
            type: challengeData.type,
            content: challengeData,
            scheduled_for: new Date().toISOString()
          });
          
        if (insertError) throw insertError;
        
        results.push({ user: user.id, status: 'generated' });
        
      } catch (error) {
        results.push({ user: user.id, status: 'error', error: error.message });
      }
    }
    
    return new Response(
      JSON.stringify({ success: true, results, total: users?.length || 0 }),
      { headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
