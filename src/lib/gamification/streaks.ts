import { createClient } from '@supabase/supabase-js';
import { startOfDay, differenceInDays } from 'date-fns';

export async function updateUserStreak(userId: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  // Récupérer profil utilisateur
  const { data: user } = await supabase
    .from('profiles')
    .select('current_streak, last_activity_date, longest_streak')
    .eq('id', userId)
    .single();
    
  const today = startOfDay(new Date());
  const lastActivity = user?.last_activity_date 
    ? startOfDay(new Date(user.last_activity_date)) 
    : null;
    
  let newStreak = user?.current_streak || 0;
  let message = null;
  let shouldNotify = false;
  let badgeAwarded = null;
  
  if (!lastActivity) {
    // Premier jour
    newStreak = 1;
    message = "🔥 Série commencée ! Reviens demain pour continuer.";
  } else {
    const daysDiff = differenceInDays(today, lastActivity);
    
    if (daysDiff === 0) {
      // Déjà actif aujourd'hui
      return { streak: newStreak, message: null, badgeAwarded: null };
    } else if (daysDiff === 1) {
      // Jour consécutif
      newStreak++;
      
      // Messages jalons
      if (newStreak === 7) {
        message = "🎉 Une semaine complète ! Continue comme ça !";
        shouldNotify = true;
      } else if (newStreak === 30) {
        message = "🏆 30 jours d'affilée ! Expert en devenir !";
        shouldNotify = true;
        // Awarding badge
        badgeAwarded = await awardBadge(userId, 'streak-30');
      } else if (newStreak === 100) {
        message = "👑 100 jours ! Tu es une LÉGENDE !";
        shouldNotify = true;
        badgeAwarded = await awardBadge(userId, 'streak-100');
      } else {
        message = `🔥 Série de ${newStreak} jours !`;
      }
      
      // Nouveau record personnel
      if (newStreak > (user?.longest_streak || 0)) {
        await supabase
          .from('profiles')
          .update({ longest_streak: newStreak })
          .eq('id', userId);
      }
    } else {
      // Série cassée
      if (newStreak >= 7) {
        // Notifier perte si série significative
        shouldNotify = true;
        message = `😢 Ta série de ${newStreak} jours s'est arrêtée. Recommence aujourd'hui !`;
      }
      newStreak = 1;
    }
  }
  
  // Mise à jour
  await supabase
    .from('profiles')
    .update({
      current_streak: newStreak,
      last_activity_date: today.toISOString()
    })
    .eq('id', userId);
    
  // Notification si pertinent
  if (shouldNotify && message) {
    // TODO: Implémenter sendPushNotification
    console.log(`📱 Notification pour ${userId}: ${message}`);
  }
    
  return { streak: newStreak, message, badgeAwarded };
}

async function awardBadge(userId: string, badgeId: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  // Vérifier si déjà obtenu
  const { data: existing } = await supabase
    .from('badge_awards')
    .select('id')
    .eq('user_id', userId)
    .eq('badge_id', badgeId)
    .single();
    
  if (existing) {
    return null;
  }
  
  // Créer l'attribution
  const { data: award, error } = await supabase
    .from('badge_awards')
    .insert({
      user_id: userId,
      badge_id: badgeId,
      awarded_at: new Date().toISOString(),
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error awarding badge:', error);
    return null;
  }
  
  console.log(`✅ Badge ${badgeId} awarded to user ${userId}`);
  return award;
}

export async function alertStreakRisk() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  const today = startOfDay(new Date());
  
  // Utilisateurs avec streak >7 jours et pas d'activité aujourd'hui
  const { data: atRisk } = await supabase
    .from('profiles')
    .select('id, current_streak, full_name')
    .gt('current_streak', 7)
    .lt('last_activity_date', today.toISOString());
    
  for (const user of atRisk || []) {
    // TODO: Implémenter sendPushNotification
    console.log(`⚠️ Alerte streak pour ${user.full_name} (${user.current_streak} jours)`);
  }
  
  return atRisk || [];
}
