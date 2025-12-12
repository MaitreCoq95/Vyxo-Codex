-- ═══════════════════════════════════════════════════════════════════════
-- VYXO CODEX 2.0 - MIGRATION COMPLÈTE
-- Learning + Consulting + Décisionnel Multi-niveaux
-- ═══════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────────
-- 1. EXTENSIONS DES TABLES EXISTANTES
-- ───────────────────────────────────────────────────────────────────────

-- Étendre profiles avec gamification (streaks uniquement, XP reste dans codex_user_xp)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_activity_date DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS mentor_level BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS team_id UUID;

-- Étendre companies avec IMO
ALTER TABLE companies ADD COLUMN IF NOT EXISTS imo_score NUMERIC(5,2);
ALTER TABLE companies ADD COLUMN IF NOT EXISTS imo_level TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS last_imo_calculation TIMESTAMPTZ;

-- Créer table modules si elle n'existe pas (référencée par user_progress)
CREATE TABLE IF NOT EXISTS modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT,
  code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Créer table user_progress si elle n'existe pas
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  score INTEGER,
  status TEXT DEFAULT 'in_progress',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Étendre user_progress avec mastery et répétition espacée
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS mastery_level INTEGER DEFAULT 0 CHECK (mastery_level BETWEEN 0 AND 4);
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS next_review_date TIMESTAMPTZ;
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS last_review_date TIMESTAMPTZ;

-- ───────────────────────────────────────────────────────────────────────
-- 2. NOUVELLES TABLES
-- ───────────────────────────────────────────────────────────────────────

-- Teams
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  manager_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Badges
CREATE TABLE IF NOT EXISTS badges (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('skill', 'milestone', 'achievement')),
  icon TEXT,
  linkedin_shareable BOOLEAN DEFAULT FALSE,
  pdf_certificate BOOLEAN DEFAULT FALSE,
  criteria JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Badge Awards
CREATE TABLE IF NOT EXISTS badge_awards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id TEXT REFERENCES badges(id),
  awarded_at TIMESTAMPTZ DEFAULT NOW(),
  certificate_url TEXT,
  UNIQUE(user_id, badge_id)
);

-- Duels (Gamification)
CREATE TABLE IF NOT EXISTS duels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenger_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  challenged_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  questions JSONB NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'expired')),
  scores JSONB DEFAULT '{"challenger": 0, "challenged": 0}'::jsonb,
  deadline TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Daily Challenges
CREATE TABLE IF NOT EXISTS daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('photo_interactive', 'quiz_visual', 'scenario')),
  content JSONB NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  score INTEGER,
  time_spent_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ DEFAULT NOW()
);

-- Vyxo Flashes (Manager Briefings)
CREATE TABLE IF NOT EXISTS vyxo_flashes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  titre TEXT NOT NULL,
  hook TEXT,
  contexte TEXT,
  exercice_pratique JSONB,
  message_cle TEXT,
  action_immediate TEXT,
  critical_gap JSONB,
  affected_users UUID[],
  metrics JSONB,
  completed BOOLEAN DEFAULT FALSE,
  completed_by UUID REFERENCES auth.users(id),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, date)
);

-- Risk Alerts
CREATE TABLE IF NOT EXISTS risk_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  severity TEXT CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  type TEXT CHECK (type IN ('skill_gap', 'incident_pattern', 'compliance_risk', 'turnover')),
  title TEXT NOT NULL,
  description TEXT,
  affected_users UUID[],
  recommendations JSONB,
  potential_impact JSONB,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'in_progress', 'resolved')),
  acknowledged_by UUID REFERENCES auth.users(id),
  acknowledged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Company KPIs (Daily snapshots)
CREATE TABLE IF NOT EXISTS company_kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  
  -- IMO Components
  imo_global INTEGER CHECK (imo_global BETWEEN 0 AND 100),
  imo_competences NUMERIC(5,2),
  imo_regularite NUMERIC(5,2),
  imo_pratique NUMERIC(5,2),
  imo_incidents NUMERIC(5,2),
  
  -- Other metrics
  conformity_rate NUMERIC(5,2),
  incidents_count INTEGER DEFAULT 0,
  training_completion_rate NUMERIC(5,2),
  at_risk_employees INTEGER DEFAULT 0,
  avg_engagement NUMERIC(5,2),
  active_users_count INTEGER,
  
  metrics JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(company_id, date)
);

-- Practical Validations (terrain)
CREATE TABLE IF NOT EXISTS practical_validations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES daily_challenges(id) ON DELETE SET NULL,
  type TEXT CHECK (type IN ('photo', 'video', 'document', 'checklist')),
  file_url TEXT,
  metadata JSONB,
  validation_status TEXT DEFAULT 'pending' CHECK (validation_status IN ('pending', 'approved', 'rejected', 'needs_revision')),
  validator_id UUID REFERENCES auth.users(id),
  validator_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  validated_at TIMESTAMPTZ
);

-- Incidents
CREATE TABLE IF NOT EXISTS incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  description TEXT NOT NULL,
  cost NUMERIC(10,2),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  root_cause TEXT,
  corrective_actions JSONB,
  related_modules UUID[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- ───────────────────────────────────────────────────────────────────────
-- 3. INDEXES POUR PERFORMANCE
-- ───────────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_profiles_team ON profiles(team_id);
CREATE INDEX IF NOT EXISTS idx_profiles_streak ON profiles(current_streak DESC);

CREATE INDEX IF NOT EXISTS idx_user_progress_user_module ON user_progress(user_id, module_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_next_review ON user_progress(next_review_date) WHERE status = 'completed' AND next_review_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_progress_mastery ON user_progress(mastery_level) WHERE mastery_level < 3;

CREATE INDEX IF NOT EXISTS idx_vyxo_flashes_team_date ON vyxo_flashes(team_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_vyxo_flashes_completed ON vyxo_flashes(completed) WHERE completed = FALSE;

CREATE INDEX IF NOT EXISTS idx_risk_alerts_team_status ON risk_alerts(team_id, status, severity);
CREATE INDEX IF NOT EXISTS idx_risk_alerts_active ON risk_alerts(created_at DESC) WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_company_kpis_date ON company_kpis(company_id, date DESC);

CREATE INDEX IF NOT EXISTS idx_daily_challenges_user_date ON daily_challenges(user_id, scheduled_for);
CREATE INDEX IF NOT EXISTS idx_daily_challenges_pending ON daily_challenges(user_id, completed) WHERE completed = FALSE;

CREATE INDEX IF NOT EXISTS idx_incidents_team_date ON incidents(team_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_incidents_type ON incidents(type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_practical_validations_pending ON practical_validations(validation_status, created_at DESC) WHERE validation_status = 'pending';

-- ───────────────────────────────────────────────────────────────────────
-- 4. FONCTIONS SQL CRITIQUES
-- ───────────────────────────────────────────────────────────────────────

-- Function: Analyser les gaps d'une équipe
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
      up.user_id,
      m.id as module_id,
      m.title as skill_name,
      up.score,
      up.mastery_level,
      up.created_at
    FROM user_progress up
    JOIN modules m ON m.id = up.module_id
    WHERE up.user_id IN (SELECT id FROM team_users)
      AND up.updated_at > NOW() - p_period
  ),
  skill_performance AS (
    SELECT 
      skill_name,
      module_id,
      COUNT(*) as attempts,
      AVG(score) as avg_score,
      COUNT(*) FILTER (WHERE score < 70) as failures,
      ARRAY_AGG(DISTINCT user_id) FILTER (WHERE score < 70) as failed_users
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
      SELECT ROUND(AVG(score)::numeric, 1)
      FROM recent_attempts
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function: Calculer l'IMO (Indice Maturité Opérationnelle)
CREATE OR REPLACE FUNCTION calculate_imo(
  p_company_id UUID
)
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
      AVG(CASE WHEN score >= 70 THEN score ELSE score * 0.5 END) as quiz_score,
      COUNT(*) FILTER (WHERE mastery_level >= 3) * 100.0 / NULLIF(COUNT(*), 0) as mastery_rate
    FROM user_progress up
    JOIN profiles p ON p.id = up.user_id
    WHERE p.company_id = p_company_id
      AND up.status = 'completed'
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
  
  -- Score global pondéré
  v_global := ROUND(
    v_competences * 0.40 +
    v_regularite * 0.20 +
    v_pratique * 0.25 +
    v_incidents * 0.15
  );
  
  -- Niveau qualitatif
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
  SET imo_score = v_global,
      imo_level = (result->>'level'),
      last_imo_calculation = NOW()
  WHERE id = p_company_id;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function: Récupérer XP total utilisateur (utilise codex_xp_history existant)
CREATE OR REPLACE FUNCTION get_user_total_xp(p_user_id UUID)
RETURNS INTEGER AS $$
  SELECT COALESCE(SUM(xp_amount), 0)::INTEGER
  FROM codex_xp_history
  WHERE user_id = p_user_id;
$$ LANGUAGE sql;

-- ───────────────────────────────────────────────────────────────────────
-- 5. RLS (Row Level Security)
-- ───────────────────────────────────────────────────────────────────────

-- Activer RLS sur nouvelles tables
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE vyxo_flashes ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE practical_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE badge_awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE duels ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

-- Policies: Users view own challenges
CREATE POLICY "Users view own challenges" ON daily_challenges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own challenges" ON daily_challenges
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own challenges" ON daily_challenges
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies: Managers view team flashes
CREATE POLICY "Managers view team flashes" ON vyxo_flashes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM teams t
      WHERE t.id = vyxo_flashes.team_id
      AND t.manager_id = auth.uid()
    )
  );

CREATE POLICY "Managers update team flashes" ON vyxo_flashes
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM teams t
      WHERE t.id = vyxo_flashes.team_id
      AND t.manager_id = auth.uid()
    )
  );

-- Policies: Directors view company KPIs
CREATE POLICY "Directors view company KPIs" ON company_kpis
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.company_id = company_kpis.company_id
    )
  );

-- Policies: Users view own badge awards
CREATE POLICY "Users view own badges" ON badge_awards
  FOR SELECT USING (auth.uid() = user_id);

-- Policies: Everyone can view badge definitions
CREATE POLICY "Everyone views badges" ON badges
  FOR SELECT USING (true);

-- Policies: Practical validations
CREATE POLICY "Users view own validations" ON practical_validations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own validations" ON practical_validations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Managers view team validations" ON practical_validations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN teams t ON t.id = p.team_id
      WHERE p.id = practical_validations.user_id
      AND t.manager_id = auth.uid()
    )
  );

CREATE POLICY "Managers update validations" ON practical_validations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN teams t ON t.id = p.team_id
      WHERE p.id = practical_validations.user_id
      AND t.manager_id = auth.uid()
    )
  );

-- ───────────────────────────────────────────────────────────────────────
-- 6. DONNÉES INITIALES - BADGES PRÉDÉFINIS
-- ───────────────────────────────────────────────────────────────────────

INSERT INTO badges (id, title, description, category, icon, linkedin_shareable, pdf_certificate, criteria)
VALUES 
  (
    'gdp-expert-2025',
    'Expert GDP Certifié 2025',
    'Maîtrise complète des Good Distribution Practices pour transport pharmaceutique',
    'skill',
    '🏆',
    true,
    true,
    '{"modules": ["gdp-basics", "gdp-temperature", "gdp-documentation"], "minScore": 85, "practicalValidation": true}'::jsonb
  ),
  (
    'streak-30',
    'Streak Master - 30 jours',
    'Engagement quotidien exceptionnel pendant 30 jours consécutifs',
    'milestone',
    '🔥',
    true,
    false,
    '{"streakDays": 30}'::jsonb
  ),
  (
    'streak-100',
    'Streak Legend - 100 jours',
    'Engagement quotidien légendaire pendant 100 jours consécutifs',
    'milestone',
    '👑',
    true,
    true,
    '{"streakDays": 100}'::jsonb
  ),
  (
    'mentor-level',
    'Mentor Vyxo',
    'Expert reconnu et contributeur actif de la plateforme',
    'achievement',
    '👨‍🏫',
    true,
    true,
    '{"minScore": 90, "practicalValidation": true, "contributionCount": 10}'::jsonb
  )
ON CONFLICT (id) DO NOTHING;
