-- ═══════════════════════════════════════════════════════════════════════
-- VYXO CODEX 2.0 - ORDER 66 - PARTIE 1/3
-- "Execute Order 66" - Création des Tables
-- ═══════════════════════════════════════════════════════════════════════
--
-- INSTRUCTIONS:
-- 1. Exécutez ce fichier EN PREMIER
-- 2. Puis ORDER_66_PART_2_INDEXES.sql
-- 3. Puis ORDER_66_PART_3_FUNCTIONS.sql
--
-- "Good soldiers follow orders." 🎖️
-- ═══════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────────
-- ÉTAPE 1: NETTOYAGE (Supprimer les doublons et conflits)
-- ───────────────────────────────────────────────────────────────────────

-- Désactiver temporairement RLS pour nettoyage
SET session_replication_role = 'replica';

-- Supprimer les policies en conflit
DROP POLICY IF EXISTS "Users view own team" ON teams;
DROP POLICY IF EXISTS "Managers update own team" ON teams;
DROP POLICY IF EXISTS "Directors create teams" ON teams;
DROP POLICY IF EXISTS "Team members view team incidents" ON incidents;
DROP POLICY IF EXISTS "Team members create incidents" ON incidents;
DROP POLICY IF EXISTS "Managers update team incidents" ON incidents;
DROP POLICY IF EXISTS "Users view own duels" ON duels;
DROP POLICY IF EXISTS "Users create duels" ON duels;
DROP POLICY IF EXISTS "Participants update duels" ON duels;

-- Supprimer les fonctions en double
DROP FUNCTION IF EXISTS update_user_streak(UUID);
DROP FUNCTION IF EXISTS update_question_stats(TEXT, BOOLEAN, INTEGER);
DROP FUNCTION IF EXISTS analyze_team_gaps(UUID, INTERVAL);
DROP FUNCTION IF EXISTS calculate_imo(UUID);
DROP FUNCTION IF EXISTS get_user_total_xp(UUID);
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS handle_new_user();

-- Supprimer les triggers en conflit
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS trigger_quiz_questions_updated_at ON quiz_questions;
DROP TRIGGER IF EXISTS update_quiz_questions_updated_at ON quiz_questions;

-- Réactiver RLS
SET session_replication_role = 'origin';

-- ───────────────────────────────────────────────────────────────────────
-- ÉTAPE 2: EXTENSIONS
-- ───────────────────────────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- ───────────────────────────────────────────────────────────────────────
-- ÉTAPE 3: TABLES CORE (dans l'ordre de dépendance)
-- ───────────────────────────────────────────────────────────────────────

-- 3.1 Companies
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  siren TEXT,
  sector TEXT,
  logo_url TEXT,
  city TEXT,
  country TEXT,
  imo_score NUMERIC(5,2),
  imo_level TEXT,
  last_imo_calculation TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3.2 Profiles (table principale utilisateurs)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'operator' CHECK (role IN ('operator', 'manager', 'director')),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  team_id UUID, -- FK ajouté après création de teams

  -- Gamification
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  mentor_level BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3.3 Teams
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  manager_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ajouter FK team_id sur profiles (maintenant que teams existe)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_profiles_team'
  ) THEN
    ALTER TABLE profiles
      ADD CONSTRAINT fk_profiles_team
      FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 3.4 Team Members
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(team_id, user_id)
);

-- ───────────────────────────────────────────────────────────────────────
-- ÉTAPE 4: TABLES LEARNING (Codex)
-- ───────────────────────────────────────────────────────────────────────

-- 4.1 Modules
CREATE TABLE IF NOT EXISTS modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  code TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  estimated_duration INTEGER, -- minutes
  xp_reward INTEGER NOT NULL DEFAULT 0,
  content JSONB NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  prerequisites UUID[] NOT NULL DEFAULT '{}',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4.2 Quiz Questions (TABLE UNIFIÉE)
CREATE TABLE IF NOT EXISTS quiz_questions (
  id TEXT PRIMARY KEY,
  module_id TEXT NOT NULL,
  question TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  choices TEXT[] NOT NULL CHECK (array_length(choices, 1) = 4),
  correct_index INTEGER NOT NULL CHECK (correct_index >= 0 AND correct_index <= 3),
  explanation TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'ai_generated', 'imported')),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  active BOOLEAN NOT NULL DEFAULT true,
  times_answered INTEGER NOT NULL DEFAULT 0,
  times_correct INTEGER NOT NULL DEFAULT 0,
  avg_time_seconds DECIMAL(10,2)
);

-- 4.3 User Modules (progression)
CREATE TABLE IF NOT EXISTS user_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  progress_percentage INTEGER NOT NULL DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  time_spent_minutes INTEGER NOT NULL DEFAULT 0,
  quiz_score DECIMAL(3,2),
  mastery_level INTEGER DEFAULT 0 CHECK (mastery_level BETWEEN 0 AND 4),
  next_review_date TIMESTAMPTZ,
  review_count INTEGER DEFAULT 0,
  last_review_date TIMESTAMPTZ,
  status TEXT DEFAULT 'in_progress',
  UNIQUE(user_id, module_id)
);

-- 4.4 Codex User XP
CREATE TABLE IF NOT EXISTS codex_user_xp (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  total_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  badges_earned JSONB DEFAULT '[]'::jsonb,
  current_path_id TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4.5 Codex Learning Progress
CREATE TABLE IF NOT EXISTS codex_learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  path_id TEXT NOT NULL,
  current_step_index INTEGER DEFAULT 0,
  completed_steps JSONB DEFAULT '[]'::jsonb,
  xp_earned INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, path_id)
);

-- 4.6 Codex XP History
CREATE TABLE IF NOT EXISTS codex_xp_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  xp_amount INTEGER NOT NULL,
  xp_type TEXT,
  entity_id TEXT,
  entity_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ───────────────────────────────────────────────────────────────────────
-- ÉTAPE 5: GAMIFICATION
-- ───────────────────────────────────────────────────────────────────────

-- 5.1 Challenges
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('daily', 'weekly', 'special')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  xp_reward INTEGER NOT NULL DEFAULT 0,
  badge_reward TEXT,
  time_limit_minutes INTEGER,
  requirements JSONB NOT NULL DEFAULT '{}',
  starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at TIMESTAMPTZ NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5.2 User Challenges
CREATE TABLE IF NOT EXISTS user_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  progress JSONB NOT NULL DEFAULT '{}',
  UNIQUE(user_id, challenge_id)
);

-- 5.3 Badges
CREATE TABLE IF NOT EXISTS badges (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT CHECK (category IN ('skill', 'milestone', 'achievement')),
  icon TEXT,
  icon_url TEXT,
  rarity TEXT CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  linkedin_shareable BOOLEAN DEFAULT FALSE,
  pdf_certificate BOOLEAN DEFAULT FALSE,
  criteria JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5.4 User Badges
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  certificate_url TEXT,
  UNIQUE(user_id, badge_id)
);

-- 5.5 Streaks
CREATE TABLE IF NOT EXISTS streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5.6 Duels
CREATE TABLE IF NOT EXISTS duels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenger_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  challenged_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  questions JSONB NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'expired')),
  scores JSONB DEFAULT '{"challenger": 0, "challenged": 0}'::jsonb,
  deadline TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- 5.7 Daily Challenges
CREATE TABLE IF NOT EXISTS daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('photo_interactive', 'quiz_visual', 'scenario')),
  content JSONB NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  score INTEGER,
  time_spent_seconds INTEGER,
  scheduled_for TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- ───────────────────────────────────────────────────────────────────────
-- ÉTAPE 6: NOTIFICATIONS & COMMUNICATIONS
-- ───────────────────────────────────────────────────────────────────────

-- 6.1 Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6.2 Vyxo Flashes (Manager Briefings)
CREATE TABLE IF NOT EXISTS vyxo_flashes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
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
  completed_by UUID REFERENCES profiles(id),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(team_id, date)
);

-- ───────────────────────────────────────────────────────────────────────
-- ÉTAPE 7: ANALYTICS & MONITORING
-- ───────────────────────────────────────────────────────────────────────

-- 7.1 Incidents
CREATE TABLE IF NOT EXISTS incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  description TEXT NOT NULL,
  cost NUMERIC(10,2),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  root_cause TEXT,
  corrective_actions JSONB,
  related_modules UUID[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

-- 7.2 Risk Alerts
CREATE TABLE IF NOT EXISTS risk_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  severity TEXT CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  type TEXT CHECK (type IN ('skill_gap', 'incident_pattern', 'compliance_risk', 'turnover')),
  title TEXT NOT NULL,
  description TEXT,
  affected_users UUID[],
  recommendations JSONB,
  potential_impact JSONB,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'in_progress', 'resolved')),
  acknowledged_by UUID REFERENCES profiles(id),
  acknowledged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

-- 7.3 Company KPIs
CREATE TABLE IF NOT EXISTS company_kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  imo_global INTEGER CHECK (imo_global BETWEEN 0 AND 100),
  imo_competences NUMERIC(5,2),
  imo_regularite NUMERIC(5,2),
  imo_pratique NUMERIC(5,2),
  imo_incidents NUMERIC(5,2),
  conformity_rate NUMERIC(5,2),
  incidents_count INTEGER DEFAULT 0,
  training_completion_rate NUMERIC(5,2),
  at_risk_employees INTEGER DEFAULT 0,
  avg_engagement NUMERIC(5,2),
  active_users_count INTEGER,
  metrics JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(company_id, date)
);

-- 7.4 Practical Validations
CREATE TABLE IF NOT EXISTS practical_validations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES daily_challenges(id) ON DELETE SET NULL,
  type TEXT CHECK (type IN ('photo', 'video', 'document', 'checklist')),
  file_url TEXT,
  metadata JSONB,
  validation_status TEXT DEFAULT 'pending' CHECK (validation_status IN ('pending', 'approved', 'rejected', 'needs_revision')),
  validator_id UUID REFERENCES profiles(id),
  validator_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  validated_at TIMESTAMPTZ
);

-- ───────────────────────────────────────────────────────────────────────
-- ÉTAPE 8: CRM (Tables business)
-- ───────────────────────────────────────────────────────────────────────

-- 8.1 Clients (CRM - différent de profiles)
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID,
  name TEXT NOT NULL,
  siren TEXT,
  sector TEXT,
  status TEXT CHECK (status IN ('lead', 'active', 'inactive', 'archived')),
  logo_url TEXT,
  city TEXT,
  country TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8.2 Engagements
CREATE TABLE IF NOT EXISTS engagements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('audit', 'consulting', 'training', 'support')),
  status TEXT CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
  start_date DATE,
  end_date DATE,
  budget_amount NUMERIC,
  currency TEXT DEFAULT 'EUR',
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8.3 Audits
CREATE TABLE IF NOT EXISTS audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID,
  engagement_id UUID REFERENCES engagements(id) ON DELETE CASCADE,
  template_name TEXT,
  template_data JSONB,
  score NUMERIC,
  status TEXT CHECK (status IN ('draft', 'in_progress', 'review', 'completed', 'approved')),
  auditor_id UUID REFERENCES profiles(id),
  audit_date DATE,
  findings TEXT,
  recommendations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8.4 Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID,
  engagement_id UUID REFERENCES engagements(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'EUR',
  status TEXT CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  issue_date DATE,
  due_date DATE,
  paid_date DATE,
  payment_method TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8.5 Activities
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID,
  user_id UUID REFERENCES profiles(id),
  entity_type TEXT,
  entity_id UUID,
  action TEXT NOT NULL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════════════
-- FIN PARTIE 1/3 - TABLES CRÉÉES ✅
--
-- PROCHAINE ÉTAPE: Exécutez ORDER_66_PART_2_INDEXES.sql
-- ═══════════════════════════════════════════════════════════════════════

COMMENT ON TABLE companies IS 'Entreprises utilisant Vyxo Codex';
COMMENT ON TABLE profiles IS 'Profils utilisateurs (unifié avec clients)';
COMMENT ON TABLE teams IS 'Équipes au sein des entreprises';
COMMENT ON TABLE modules IS 'Modules de formation';
COMMENT ON TABLE quiz_questions IS 'Questions de quiz (IA ou manuelles)';
COMMENT ON TABLE challenges IS 'Défis quotidiens/hebdomadaires';
COMMENT ON TABLE badges IS 'Badges et certifications';
COMMENT ON TABLE vyxo_flashes IS 'Briefings quotidiens managers';
COMMENT ON TABLE incidents IS 'Incidents opérationnels';
COMMENT ON TABLE company_kpis IS 'KPIs entreprise (snapshots quotidiens)';
