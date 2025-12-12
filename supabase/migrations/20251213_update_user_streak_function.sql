-- Fonction pour mettre à jour le streak utilisateur
CREATE OR REPLACE FUNCTION update_user_streak(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_profile RECORD;
  v_last_activity DATE;
  v_today DATE := CURRENT_DATE;
  v_new_streak INTEGER;
  v_message TEXT;
BEGIN
  -- Récupérer le profil utilisateur
  SELECT * INTO v_profile
  FROM profiles
  WHERE id = p_user_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'User not found');
  END IF;
  
  v_last_activity := v_profile.last_activity_date::DATE;
  
  -- Calculer le nouveau streak
  IF v_last_activity IS NULL THEN
    -- Première activité
    v_new_streak := 1;
    v_message := '🔥 Série commencée !';
  ELSIF v_last_activity = v_today THEN
    -- Déjà actif aujourd'hui, pas de changement
    RETURN jsonb_build_object(
      'success', true,
      'streak', v_profile.current_streak,
      'message', 'Déjà actif aujourd''hui'
    );
  ELSIF v_last_activity = v_today - INTERVAL '1 day' THEN
    -- Continuité du streak
    v_new_streak := COALESCE(v_profile.current_streak, 0) + 1;
    
    -- Messages jalons
    IF v_new_streak = 7 THEN
      v_message := '🎯 7 jours d''affilée ! Bon rythme !';
    ELSIF v_new_streak = 30 THEN
      v_message := '🏆 30 jours d''affilée ! Expert en devenir !';
      -- Attribuer badge streak-30
      INSERT INTO badge_awards (user_id, badge_id)
      VALUES (p_user_id, 'streak-30')
      ON CONFLICT DO NOTHING;
    ELSIF v_new_streak = 100 THEN
      v_message := '👑 100 jours ! LÉGENDE !';
    ELSE
      v_message := format('🔥 %s jours de série !', v_new_streak);
    END IF;
  ELSE
    -- Streak cassé
    v_new_streak := 1;
    v_message := '💔 Série cassée. On recommence !';
  END IF;
  
  -- Mettre à jour le profil
  UPDATE profiles
  SET 
    current_streak = v_new_streak,
    longest_streak = GREATEST(COALESCE(longest_streak, 0), v_new_streak),
    last_activity_date = v_today
  WHERE id = p_user_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'streak', v_new_streak,
    'message', v_message,
    'is_milestone', v_new_streak IN (7, 30, 100)
  );
END;
$$ LANGUAGE plpgsql;
