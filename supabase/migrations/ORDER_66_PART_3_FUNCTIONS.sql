-- ═══════════════════════════════════════════════════════════════════════
-- VYXO CODEX 2.0 - ORDER 66 - PARTIE 3/3
-- "Good soldiers follow orders." - Fonctions & Triggers & Données Initiales
-- ═══════════════════════════════════════════════════════════════════════
--
-- INSTRUCTIONS:
-- 1. Assurez-vous que ORDER_66_PART_1_TABLES.sql a été exécuté ✅
-- 2. Assurez-vous que ORDER_66_PART_2_INDEXES.sql a été exécuté ✅
-- 3. Exécutez CE fichier maintenant
--
-- "The mission... the nightmares... they're finally... over." 🎖️
-- ═══════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────────
-- ÉTAPE 1: FONCTIONS UTILITAIRES
-- ───────────────────────────────────────────────────────────────────────

-- 1.1 Fonction: updated_at automatique
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1.2 Fonction: Créer profile automatique à l'inscription
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1.3 Fonction: Mettre à jour les stats de questions
CREATE OR REPLACE FUNCTION update_question_stats(
  p_question_id TEXT,
  p_correct BOOLEAN,
  p_time_seconds INTEGER
)
RETURNS void AS $$
BEGIN
  UPDATE quiz_questions
  SET
    times_answered = times_answered + 1,
    times_correct = CASE WHEN p_correct THEN times_correct + 1 ELSE times_correct END,
    avg_time_seconds = (
      COALESCE(avg_time_seconds, 0) * times_answered + p_time_seconds
    ) / (times_answered + 1),
    updated_at = now()
  WHERE id = p_question_id;
END;
$$ LANGUAGE plpgsql;

-- 1.4 Fonction: Mettre à jour le streak utilisateur
CREATE OR REPLACE FUNCTION update_user_streak(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_profile RECORD;
  v_last_activity DATE;
  v_today DATE := CURRENT_DATE;
  v_new_streak INTEGER;
  v_message TEXT;
BEGIN
  -- Récupérer le profil
  SELECT * INTO v_profile
  FROM profiles
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'User not found');
  END IF;

  v_last_activity := v_profile.last_activity_date;

  -- Calculer le nouveau streak
  IF v_last_activity IS NULL THEN
    v_new_streak := 1;
    v_message := '🔥 Série commencée !';
  ELSIF v_last_activity = v_today THEN
    -- Déjà actif aujourd'hui
    RETURN jsonb_build_object(
      'success', true,
      'streak', v_profile.current_streak,
      'message', 'Déjà actif aujourd''hui'
    );
  ELSIF v_last_activity = v_today - INTERVAL '1 day' THEN
    -- Continuité
    v_new_streak := COALESCE(v_profile.current_streak, 0) + 1;

    IF v_new_streak = 7 THEN
      v_message := '🎯 7 jours d''affilée !';
    ELSIF v_new_streak = 30 THEN
      v_message := '🏆 30 jours d''affilée !';
      -- Attribuer badge
      INSERT INTO user_badges (user_id, badge_id)
      VALUES (p_user_id, 'streak-30')
      ON CONFLICT DO NOTHING;
    ELSIF v_new_streak = 100 THEN
      v_message := '👑 100 jours !';
      INSERT INTO user_badges (user_id, badge_id)
      VALUES (p_user_id, 'streak-100')
      ON CONFLICT DO NOTHING;
    ELSE
      v_message := format('🔥 %s jours de série !', v_new_streak);
    END IF;
  ELSE
    -- Streak cassé
    v_new_streak := 1;
    v_message := '💔 Série cassée. On recommence !';
  END IF;

  -- Mettre à jour
  UPDATE profiles
  SET
    current_streak = v_new_streak,
    longest_streak = GREATEST(COALESCE(longest_streak, 0), v_new_streak),
    last_activity_date = v_today,
    updated_at = now()
  WHERE id = p_user_id;

  RETURN jsonb_build_object(
    'success', true,
    'streak', v_new_streak,
    'message', v_message,
    'is_milestone', v_new_streak IN (7, 30, 100)
  );
END;
$$ LANGUAGE plpgsql;

-- ───────────────────────────────────────────────────────────────────────
-- ÉTAPE 2: FONCTIONS ANALYTICS
-- ───────────────────────────────────────────────────────────────────────

-- 2.1 Fonction: Analyser les gaps d'une équipe
CREATE OR REPLACE FUNCTION analyze_team_gaps(
  p_team_id UUID,
  p_period INTERVAL DEFAULT '24 hours'
)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  WITH team_users AS (
    SELECT id FROM profiles WHERE team_id = p_team_id
  ),
  recent_attempts AS (
    SELECT
      um.user_id,
      m.id as module_id,
      m.title as skill_name,
      um.quiz_score,
      um.mastery_level,
      um.started_at
    FROM user_modules um
    JOIN modules m ON m.id = um.module_id
    WHERE um.user_id IN (SELECT id FROM team_users)
      AND um.started_at > NOW() - p_period
  ),
  skill_performance AS (
    SELECT
      skill_name,
      module_id,
      COUNT(*) as attempts,
      AVG(quiz_score) as avg_score,
      COUNT(*) FILTER (WHERE quiz_score < 0.70) as failures,
      ARRAY_AGG(DISTINCT user_id) FILTER (WHERE quiz_score < 0.70) as failed_users
    FROM recent_attempts
    GROUP BY skill_name, module_id
  )
  SELECT jsonb_build_object(
    'criticalSkills', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'skill', skill_name,
          'moduleId', module_id,
          'failureRate', ROUND((failures::numeric / NULLIF(attempts, 0) * 100)::numeric, 1),
          'affectedUsers', failed_users,
          'avgScore', ROUND(avg_score::numeric, 1)
        )
        ORDER BY (failures::numeric / NULLIF(attempts, 0)) DESC
      )
      FROM skill_performance
      WHERE failures > 0
    ),
    'recentIncidents', (
      SELECT COUNT(*)
      FROM incidents i
      WHERE i.team_id = p_team_id
        AND i.created_at > NOW() - p_period
    ),
    'overallScore', (
      SELECT ROUND(AVG(quiz_score)::numeric, 1)
      FROM recent_attempts
    )
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 2.2 Fonction: Calculer l'IMO (Indice Maturité Opérationnelle)
CREATE OR REPLACE FUNCTION calculate_imo(p_company_id UUID)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  v_competences NUMERIC;
  v_regularite NUMERIC;
  v_pratique NUMERIC;
  v_incidents NUMERIC;
  v_global INTEGER;
BEGIN
  -- Composante Compétences (40%)
  WITH comp AS (
    SELECT
      AVG(CASE
        WHEN quiz_score >= 0.70 THEN quiz_score * 100
        ELSE quiz_score * 50
      END) as quiz_score,
      COUNT(*) FILTER (WHERE mastery_level >= 3) * 100.0 / NULLIF(COUNT(*), 0) as mastery_rate
    FROM user_modules um
    JOIN profiles p ON p.id = um.user_id
    WHERE p.company_id = p_company_id
      AND um.status = 'completed'
  )
  SELECT COALESCE(ROUND((quiz_score * 0.6 + mastery_rate * 0.4)::numeric, 2), 50)
  INTO v_competences
  FROM comp;

  -- Composante Régularité (20%)
  WITH reg AS (
    SELECT
      AVG(current_streak) as avg_streak,
      COUNT(*) FILTER (WHERE last_activity_date >= CURRENT_DATE - 7) * 100.0 / NULLIF(COUNT(*), 0) as weekly_active
    FROM profiles
    WHERE company_id = p_company_id
  )
  SELECT COALESCE(ROUND((LEAST(avg_streak * 10, 100) * 0.4 + weekly_active * 0.6)::numeric, 2), 50)
  INTO v_regularite
  FROM reg;

  -- Composante Pratique (25%)
  WITH prat AS (
    SELECT
      COUNT(*) FILTER (WHERE validation_status = 'approved') * 100.0 / NULLIF(COUNT(*), 0) as approval_rate
    FROM practical_validations pv
    JOIN profiles p ON p.id = pv.user_id
    WHERE p.company_id = p_company_id
      AND pv.created_at > NOW() - INTERVAL '90 days'
  )
  SELECT COALESCE(ROUND(approval_rate::numeric, 2), 50)
  INTO v_pratique
  FROM prat;

  -- Composante Incidents (15%)
  WITH inc AS (
    SELECT COUNT(*) as incident_count
    FROM incidents i
    JOIN teams t ON t.id = i.team_id
    WHERE t.company_id = p_company_id
      AND i.created_at > NOW() - INTERVAL '90 days'
  )
  SELECT GREATEST(100 - (incident_count * 5), 0)
  INTO v_incidents
  FROM inc;

  -- Score global
  v_global := ROUND(
    v_competences * 0.40 +
    v_regularite * 0.20 +
    v_pratique * 0.25 +
    v_incidents * 0.15
  );

  result := jsonb_build_object(
    'globalScore', v_global,
    'level', CASE
      WHEN v_global >= 85 THEN 'Excellence'
      WHEN v_global >= 70 THEN 'Opérationnel'
      WHEN v_global >= 55 THEN 'Fragile'
      ELSE 'Critique'
    END,
    'components', jsonb_build_object(
      'competences', v_competences,
      'regularite', v_regularite,
      'pratique', v_pratique,
      'incidents', v_incidents
    ),
    'calculatedAt', NOW()
  );

  -- Mise à jour company
  UPDATE companies
  SET
    imo_score = v_global,
    imo_level = (result->>'level'),
    last_imo_calculation = NOW(),
    updated_at = NOW()
  WHERE id = p_company_id;

  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 2.3 Fonction: Récupérer XP total utilisateur
CREATE OR REPLACE FUNCTION get_user_total_xp(p_user_id UUID)
RETURNS INTEGER AS $$
  SELECT COALESCE(SUM(xp_amount), 0)::INTEGER
  FROM codex_xp_history
  WHERE user_id = p_user_id;
$$ LANGUAGE sql;

-- ───────────────────────────────────────────────────────────────────────
-- ÉTAPE 3: TRIGGERS
-- ───────────────────────────────────────────────────────────────────────

-- 3.1 Trigger: updated_at sur profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 3.2 Trigger: updated_at sur companies
DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 3.3 Trigger: updated_at sur teams
DROP TRIGGER IF EXISTS update_teams_updated_at ON teams;
CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 3.4 Trigger: updated_at sur modules
DROP TRIGGER IF EXISTS update_modules_updated_at ON modules;
CREATE TRIGGER update_modules_updated_at
  BEFORE UPDATE ON modules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 3.5 Trigger: updated_at sur quiz_questions
DROP TRIGGER IF EXISTS update_quiz_questions_updated_at ON quiz_questions;
CREATE TRIGGER update_quiz_questions_updated_at
  BEFORE UPDATE ON quiz_questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 3.6 Trigger: Auto-création profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ───────────────────────────────────────────────────────────────────────
-- ÉTAPE 4: DONNÉES INITIALES - BADGES
-- ───────────────────────────────────────────────────────────────────────

INSERT INTO badges (id, name, title, description, category, icon, rarity, linkedin_shareable, pdf_certificate, criteria)
VALUES
  (
    'streak-7',
    'Streak 7 jours',
    'Débutant Assidu',
    'Activité quotidienne pendant 7 jours consécutifs',
    'milestone',
    '🔥',
    'common',
    false,
    false,
    '{"streakDays": 7}'::jsonb
  ),
  (
    'streak-30',
    'Streak 30 jours',
    'Streak Master',
    'Engagement quotidien exceptionnel pendant 30 jours consécutifs',
    'milestone',
    '🔥',
    'rare',
    true,
    false,
    '{"streakDays": 30}'::jsonb
  ),
  (
    'streak-100',
    'Streak 100 jours',
    'Streak Legend',
    'Engagement quotidien légendaire pendant 100 jours consécutifs',
    'milestone',
    '👑',
    'legendary',
    true,
    true,
    '{"streakDays": 100}'::jsonb
  ),
  (
    'gdp-expert-2025',
    'Expert GDP Certifié 2025',
    'Expert GDP 2025',
    'Maîtrise complète des Good Distribution Practices pour transport pharmaceutique',
    'skill',
    '🏆',
    'epic',
    true,
    true,
    '{"modules": ["gdp-basics", "gdp-temperature", "gdp-documentation"], "minScore": 85, "practicalValidation": true}'::jsonb
  ),
  (
    'mentor-level',
    'Mentor Vyxo',
    'Mentor Vyxo',
    'Expert reconnu et contributeur actif de la plateforme',
    'achievement',
    '👨‍🏫',
    'legendary',
    true,
    true,
    '{"minScore": 90, "practicalValidation": true, "contributionCount": 10}'::jsonb
  ),
  (
    'first-module',
    'Premier Module',
    'Premiers Pas',
    'Complétion du premier module de formation',
    'milestone',
    '🎯',
    'common',
    false,
    false,
    '{"modulesCompleted": 1}'::jsonb
  ),
  (
    'fast-learner',
    'Apprenant Rapide',
    'Apprentissage Express',
    'Complétion de 5 modules en moins de 24h',
    'achievement',
    '⚡',
    'rare',
    true,
    false,
    '{"modulesCompleted": 5, "timeLimit": "24h"}'::jsonb
  ),
  (
    'perfect-score',
    'Score Parfait',
    'Sans Faute',
    'Score de 100% sur un quiz difficile',
    'achievement',
    '💯',
    'epic',
    true,
    false,
    '{"perfectScore": true, "difficulty": "hard"}'::jsonb
  )
ON CONFLICT (id) DO NOTHING;

-- ───────────────────────────────────────────────────────────────────────
-- ÉTAPE 5: STORAGE BUCKETS (si pas déjà créés)
-- ───────────────────────────────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('certificates', 'certificates', false),
  ('practical-validations', 'practical-validations', false),
  ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- ───────────────────────────────────────────────────────────────────────
-- ÉTAPE 6: STORAGE RLS POLICIES
-- ───────────────────────────────────────────────────────────────────────

-- Certificates
DROP POLICY IF EXISTS "Users view own certificates" ON storage.objects;
CREATE POLICY "Users view own certificates"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'certificates'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Users upload own certificates" ON storage.objects;
CREATE POLICY "Users upload own certificates"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'certificates'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Practical Validations
DROP POLICY IF EXISTS "Users view own validations" ON storage.objects;
CREATE POLICY "Users view own validations"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'practical-validations'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Users upload own validations" ON storage.objects;
CREATE POLICY "Users upload own validations"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'practical-validations'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Avatars (public)
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ───────────────────────────────────────────────────────────────────────
-- ÉTAPE 7: VUES UTILES (Optionnel mais pratique)
-- ───────────────────────────────────────────────────────────────────────

-- Vue: Leaderboard global
CREATE OR REPLACE VIEW leaderboard_global AS
SELECT
  p.id,
  p.full_name,
  p.avatar_url,
  COALESCE(xp.total_xp, 0) as total_xp,
  COALESCE(xp.level, 1) as level,
  p.current_streak,
  p.longest_streak,
  COUNT(DISTINCT ub.badge_id) as badges_count,
  RANK() OVER (ORDER BY COALESCE(xp.total_xp, 0) DESC) as rank
FROM profiles p
LEFT JOIN codex_user_xp xp ON xp.user_id = p.id
LEFT JOIN user_badges ub ON ub.user_id = p.id
GROUP BY p.id, p.full_name, p.avatar_url, xp.total_xp, xp.level, p.current_streak, p.longest_streak
ORDER BY total_xp DESC;

-- Vue: Stats équipe
CREATE OR REPLACE VIEW team_stats AS
SELECT
  t.id as team_id,
  t.name as team_name,
  COUNT(DISTINCT p.id) as members_count,
  AVG(p.current_streak) as avg_streak,
  SUM(COALESCE(xp.total_xp, 0)) as team_total_xp,
  COUNT(DISTINCT um.module_id) FILTER (WHERE um.status = 'completed') as modules_completed,
  COUNT(DISTINCT i.id) FILTER (WHERE i.created_at > NOW() - INTERVAL '30 days') as incidents_last_30d
FROM teams t
LEFT JOIN profiles p ON p.team_id = t.id
LEFT JOIN codex_user_xp xp ON xp.user_id = p.id
LEFT JOIN user_modules um ON um.user_id = p.id
LEFT JOIN incidents i ON i.team_id = t.id
GROUP BY t.id, t.name;

-- ═══════════════════════════════════════════════════════════════════════
-- FIN PARTIE 3/3 - ORDER 66 EXÉCUTÉ AVEC SUCCÈS ✅
--
-- "The Republic will be reorganized into the first Galactic Empire!" 🎖️
--
-- Votre base de données Vyxo Codex 2.0 est maintenant complète et prête!
-- ═══════════════════════════════════════════════════════════════════════

-- Vérification finale
DO $$
BEGIN
  RAISE NOTICE '═══════════════════════════════════════════════════════════════';
  RAISE NOTICE 'ORDER 66 COMPLETED SUCCESSFULLY';
  RAISE NOTICE '═══════════════════════════════════════════════════════════════';
  RAISE NOTICE 'Tables créées: %', (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public');
  RAISE NOTICE 'Index créés: %', (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public');
  RAISE NOTICE 'Fonctions créées: 6';
  RAISE NOTICE 'Triggers créés: 6';
  RAISE NOTICE 'Badges initiaux: 8';
  RAISE NOTICE 'Storage buckets: 3';
  RAISE NOTICE '';
  RAISE NOTICE '"Good soldiers follow orders." ✅';
  RAISE NOTICE '═══════════════════════════════════════════════════════════════';
END $$;
