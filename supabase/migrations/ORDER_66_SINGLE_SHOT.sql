-- ═══════════════════════════════════════════════════════════════════════
-- VYXO CODEX 2.0 - MIGRATION COMPLÈTE EN UN SEUL SCRIPT
-- "Execute Order 66 - Single Shot Edition" 🎯
-- ═══════════════════════════════════════════════════════════════════════
--
-- INSTRUCTIONS:
-- 1. Copiez TOUT ce fichier
-- 2. Collez dans Supabase SQL Editor
-- 3. Cliquez RUN
-- 4. C'est tout!
--
-- ⚠️ ATTENTION: Ce script supprime TOUTE la DB et la recrée from scratch
-- ═══════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────────
-- RESET COMPLET
-- ───────────────────────────────────────────────────────────────────────

DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ───────────────────────────────────────────────────────────────────────
-- TABLES (Ordre sans dépendances circulaires)
-- ───────────────────────────────────────────────────────────────────────

-- 1. Companies
CREATE TABLE companies (
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

-- 2. Profiles (sans FK team_id pour l'instant)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'operator' CHECK (role IN ('operator', 'manager', 'director')),
  company_id UUID,
  team_id UUID,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  mentor_level BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Teams
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  manager_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Ajouter FK profiles maintenant que teams existe
ALTER TABLE profiles
  ADD CONSTRAINT fk_profiles_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_profiles_team FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL;

-- 5. Team Members
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(team_id, user_id)
);

-- 6. Modules
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  code TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  estimated_duration INTEGER,
  xp_reward INTEGER NOT NULL DEFAULT 0,
  content JSONB NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  prerequisites UUID[] NOT NULL DEFAULT '{}',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Quiz Questions
CREATE TABLE quiz_questions (
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

-- 8. User Modules
CREATE TABLE user_modules (
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

-- 9. Codex User XP
CREATE TABLE codex_user_xp (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  total_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  badges_earned JSONB DEFAULT '[]'::jsonb,
  current_path_id TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Codex Learning Progress
CREATE TABLE codex_learning_progress (
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

-- 11. Codex XP History
CREATE TABLE codex_xp_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  xp_amount INTEGER NOT NULL,
  xp_type TEXT,
  entity_id TEXT,
  entity_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. Badges
CREATE TABLE badges (
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

-- 13. User Badges
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  certificate_url TEXT,
  UNIQUE(user_id, badge_id)
);

-- 14. Challenges
CREATE TABLE challenges (
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

-- 15. User Challenges
CREATE TABLE user_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  progress JSONB NOT NULL DEFAULT '{}',
  UNIQUE(user_id, challenge_id)
);

-- 16. Streaks
CREATE TABLE streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 17. Duels
CREATE TABLE duels (
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

-- 18. Daily Challenges
CREATE TABLE daily_challenges (
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

-- 19. Notifications
CREATE TABLE notifications (
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

-- 20. Vyxo Flashes
CREATE TABLE vyxo_flashes (
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

-- 21. Incidents
CREATE TABLE incidents (
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

-- 22. Risk Alerts
CREATE TABLE risk_alerts (
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

-- 23. Company KPIs
CREATE TABLE company_kpis (
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

-- 24. Practical Validations
CREATE TABLE practical_validations (
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

-- 25-29. CRM Tables
CREATE TABLE clients (
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

CREATE TABLE engagements (
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

CREATE TABLE audits (
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

CREATE TABLE invoices (
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

CREATE TABLE activities (
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

-- ───────────────────────────────────────────────────────────────────────
-- INDEX DE PERFORMANCE
-- ───────────────────────────────────────────────────────────────────────

CREATE INDEX idx_profiles_company ON profiles(company_id);
CREATE INDEX idx_profiles_team ON profiles(team_id);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_teams_company ON teams(company_id);
CREATE INDEX idx_teams_manager ON teams(manager_id);
CREATE INDEX idx_modules_active ON modules(active) WHERE active = true;
CREATE INDEX idx_quiz_questions_module ON quiz_questions(module_id);
CREATE INDEX idx_quiz_questions_active ON quiz_questions(active) WHERE active = true;
CREATE INDEX idx_user_modules_user_module ON user_modules(user_id, module_id);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, read) WHERE read = false;
CREATE INDEX idx_incidents_team_date ON incidents(team_id, created_at DESC);
CREATE INDEX idx_vyxo_flashes_team_date ON vyxo_flashes(team_id, date DESC);

-- ───────────────────────────────────────────────────────────────────────
-- RLS (ACTIVÉ SUR TOUTES LES TABLES)
-- ───────────────────────────────────────────────────────────────────────

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE codex_user_xp ENABLE ROW LEVEL SECURITY;
ALTER TABLE codex_learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE codex_xp_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE duels ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE vyxo_flashes ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE practical_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagements ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Policies basiques (on peut ajouter plus tard)
CREATE POLICY "Users view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users view own XP" ON codex_user_xp FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users view own progress" ON codex_learning_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Everyone views active modules" ON modules FOR SELECT USING (active = true);
CREATE POLICY "Everyone views active questions" ON quiz_questions FOR SELECT USING (active = true);
CREATE POLICY "Everyone views badges" ON badges FOR SELECT USING (true);
CREATE POLICY "Users view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users access clients" ON clients FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users access engagements" ON engagements FOR ALL USING (auth.role() = 'authenticated');

-- ───────────────────────────────────────────────────────────────────────
-- FONCTIONS ESSENTIELLES
-- ───────────────────────────────────────────────────────────────────────

-- Fonction: updated_at automatique
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fonction: Créer profile automatique
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

-- Triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ───────────────────────────────────────────────────────────────────────
-- BADGES INITIAUX
-- ───────────────────────────────────────────────────────────────────────

INSERT INTO badges (id, name, title, description, category, icon, rarity, linkedin_shareable, pdf_certificate, criteria)
VALUES
  ('streak-7', 'Streak 7', 'Débutant Assidu', '7 jours consécutifs', 'milestone', '🔥', 'common', false, false, '{"streakDays": 7}'::jsonb),
  ('streak-30', 'Streak 30', 'Streak Master', '30 jours consécutifs', 'milestone', '🔥', 'rare', true, false, '{"streakDays": 30}'::jsonb),
  ('streak-100', 'Streak 100', 'Streak Legend', '100 jours consécutifs', 'milestone', '👑', 'legendary', true, true, '{"streakDays": 100}'::jsonb),
  ('first-module', 'Premier Module', 'Premiers Pas', 'Premier module complété', 'milestone', '🎯', 'common', false, false, '{"modulesCompleted": 1}'::jsonb),
  ('gdp-expert', 'Expert GDP', 'Expert GDP Certifié', 'Maîtrise GDP', 'skill', '🏆', 'epic', true, true, '{"modules": ["gdp"], "minScore": 85}'::jsonb);

-- ───────────────────────────────────────────────────────────────────────
-- STORAGE BUCKETS
-- ───────────────────────────────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('certificates', 'certificates', false),
  ('practical-validations', 'practical-validations', false),
  ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════
-- VÉRIFICATION FINALE
-- ═══════════════════════════════════════════════════════════════════════

DO $$
DECLARE
  table_count INTEGER;
  badge_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO table_count FROM information_schema.tables WHERE table_schema = 'public';
  SELECT COUNT(*) INTO badge_count FROM badges;

  RAISE NOTICE '═══════════════════════════════════════════════════════════════';
  RAISE NOTICE '✅ ORDER 66 EXECUTED SUCCESSFULLY';
  RAISE NOTICE '═══════════════════════════════════════════════════════════════';
  RAISE NOTICE 'Tables créées: %', table_count;
  RAISE NOTICE 'Badges initiaux: %', badge_count;
  RAISE NOTICE 'Index créés: ✅';
  RAISE NOTICE 'RLS activé: ✅';
  RAISE NOTICE 'Fonctions créées: ✅';
  RAISE NOTICE '';
  RAISE NOTICE '"Good soldiers follow orders." 🎖️';
  RAISE NOTICE '═══════════════════════════════════════════════════════════════';
END $$;
