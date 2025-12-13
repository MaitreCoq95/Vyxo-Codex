-- ═══════════════════════════════════════════════════════════════════════
-- VYXO CODEX 2.0 - ORDER 66 - PARTIE 2/3
-- "The time has come. Execute Order 66." - Index & RLS Policies
-- ═══════════════════════════════════════════════════════════════════════
--
-- INSTRUCTIONS:
-- 1. Assurez-vous que ORDER_66_PART_1_TABLES.sql a été exécuté ✅
-- 2. Exécutez CE fichier maintenant
-- 3. Puis ORDER_66_PART_3_FUNCTIONS.sql
--
-- "It will be done, my Lord." 👨‍✈️
-- ═══════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────────
-- ÉTAPE 1: INDEX POUR PERFORMANCE
-- ───────────────────────────────────────────────────────────────────────

-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_company ON profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_profiles_team ON profiles(team_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_streak ON profiles(current_streak DESC);

-- Teams
CREATE INDEX IF NOT EXISTS idx_teams_company ON teams(company_id);
CREATE INDEX IF NOT EXISTS idx_teams_manager ON teams(manager_id);

-- Team Members
CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON team_members(user_id);

-- Modules
CREATE INDEX IF NOT EXISTS idx_modules_difficulty ON modules(difficulty);
CREATE INDEX IF NOT EXISTS idx_modules_active ON modules(active) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_modules_tags ON modules USING GIN(tags);

-- Quiz Questions
CREATE INDEX IF NOT EXISTS idx_quiz_questions_module ON quiz_questions(module_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_difficulty ON quiz_questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_source ON quiz_questions(source);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_active ON quiz_questions(active) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_quiz_questions_tags ON quiz_questions USING GIN(tags);

-- User Modules
CREATE INDEX IF NOT EXISTS idx_user_modules_user ON user_modules(user_id);
CREATE INDEX IF NOT EXISTS idx_user_modules_module ON user_modules(module_id);
CREATE INDEX IF NOT EXISTS idx_user_modules_user_module ON user_modules(user_id, module_id);
CREATE INDEX IF NOT EXISTS idx_user_modules_next_review ON user_modules(next_review_date)
  WHERE status = 'completed' AND next_review_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_modules_mastery ON user_modules(mastery_level)
  WHERE mastery_level < 3;

-- Codex
CREATE INDEX IF NOT EXISTS idx_codex_user_xp_level ON codex_user_xp(level DESC);
CREATE INDEX IF NOT EXISTS idx_codex_learning_progress_user ON codex_learning_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_codex_learning_progress_path ON codex_learning_progress(path_id);
CREATE INDEX IF NOT EXISTS idx_codex_xp_history_user ON codex_xp_history(user_id);
CREATE INDEX IF NOT EXISTS idx_codex_xp_history_type ON codex_xp_history(xp_type);

-- Challenges
CREATE INDEX IF NOT EXISTS idx_challenges_type ON challenges(type);
CREATE INDEX IF NOT EXISTS idx_challenges_active ON challenges(active) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_challenges_dates ON challenges(starts_at, ends_at);
CREATE INDEX IF NOT EXISTS idx_user_challenges_user ON user_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_challenges_challenge ON user_challenges(challenge_id);

-- Badges
CREATE INDEX IF NOT EXISTS idx_badges_category ON badges(category);
CREATE INDEX IF NOT EXISTS idx_badges_rarity ON badges(rarity);
CREATE INDEX IF NOT EXISTS idx_user_badges_user ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge ON user_badges(badge_id);

-- Streaks
CREATE INDEX IF NOT EXISTS idx_streaks_user ON streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_streaks_current ON streaks(current_streak DESC);

-- Duels
CREATE INDEX IF NOT EXISTS idx_duels_challenger ON duels(challenger_id);
CREATE INDEX IF NOT EXISTS idx_duels_challenged ON duels(challenged_id);
CREATE INDEX IF NOT EXISTS idx_duels_participants ON duels(challenger_id, challenged_id);
CREATE INDEX IF NOT EXISTS idx_duels_status ON duels(status);

-- Daily Challenges
CREATE INDEX IF NOT EXISTS idx_daily_challenges_user ON daily_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_challenges_user_date ON daily_challenges(user_id, scheduled_for);
CREATE INDEX IF NOT EXISTS idx_daily_challenges_pending ON daily_challenges(user_id, completed)
  WHERE completed = FALSE;

-- Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, read)
  WHERE read = false;

-- Vyxo Flashes
CREATE INDEX IF NOT EXISTS idx_vyxo_flashes_team ON vyxo_flashes(team_id);
CREATE INDEX IF NOT EXISTS idx_vyxo_flashes_team_date ON vyxo_flashes(team_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_vyxo_flashes_completed ON vyxo_flashes(completed)
  WHERE completed = FALSE;
CREATE INDEX IF NOT EXISTS idx_vyxo_flashes_team_completed ON vyxo_flashes(team_id, completed)
  WHERE completed = FALSE;

-- Incidents
CREATE INDEX IF NOT EXISTS idx_incidents_team ON incidents(team_id);
CREATE INDEX IF NOT EXISTS idx_incidents_team_date ON incidents(team_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_incidents_type ON incidents(type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_incidents_severity ON incidents(severity);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);

-- Risk Alerts
CREATE INDEX IF NOT EXISTS idx_risk_alerts_team ON risk_alerts(team_id);
CREATE INDEX IF NOT EXISTS idx_risk_alerts_team_status ON risk_alerts(team_id, status, severity);
CREATE INDEX IF NOT EXISTS idx_risk_alerts_active ON risk_alerts(created_at DESC)
  WHERE status = 'active';

-- Company KPIs
CREATE INDEX IF NOT EXISTS idx_company_kpis_company ON company_kpis(company_id);
CREATE INDEX IF NOT EXISTS idx_company_kpis_date ON company_kpis(company_id, date DESC);

-- Practical Validations
CREATE INDEX IF NOT EXISTS idx_practical_validations_user ON practical_validations(user_id);
CREATE INDEX IF NOT EXISTS idx_practical_validations_module ON practical_validations(module_id);
CREATE INDEX IF NOT EXISTS idx_practical_validations_status ON practical_validations(validation_status);
CREATE INDEX IF NOT EXISTS idx_practical_validations_pending ON practical_validations(validation_status, created_at DESC)
  WHERE validation_status = 'pending';

-- CRM
CREATE INDEX IF NOT EXISTS idx_clients_organization ON clients(organization_id);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_engagements_client ON engagements(client_id);
CREATE INDEX IF NOT EXISTS idx_engagements_organization ON engagements(organization_id);
CREATE INDEX IF NOT EXISTS idx_audits_engagement ON audits(engagement_id);
CREATE INDEX IF NOT EXISTS idx_invoices_client ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_activities_user ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_entity ON activities(entity_type, entity_id);

-- Index composite pour optimiser les requêtes RLS
CREATE INDEX IF NOT EXISTS idx_profiles_user_team ON profiles(id, team_id);

-- ───────────────────────────────────────────────────────────────────────
-- ÉTAPE 2: ACTIVER RLS SUR TOUTES LES TABLES
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
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
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

-- ───────────────────────────────────────────────────────────────────────
-- ÉTAPE 3: RLS POLICIES - PROFILES
-- ───────────────────────────────────────────────────────────────────────

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view profiles in their company" ON profiles
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

-- ───────────────────────────────────────────────────────────────────────
-- ÉTAPE 4: RLS POLICIES - TEAMS
-- ───────────────────────────────────────────────────────────────────────

CREATE POLICY "Users view own team" ON teams
  FOR SELECT USING (
    manager_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND team_id = teams.id
    )
  );

CREATE POLICY "Managers update own team" ON teams
  FOR UPDATE USING (manager_id = auth.uid());

CREATE POLICY "Directors create teams" ON teams
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'director'
    )
  );

-- ───────────────────────────────────────────────────────────────────────
-- ÉTAPE 5: RLS POLICIES - CODEX (Learning)
-- ───────────────────────────────────────────────────────────────────────

-- User XP
CREATE POLICY "Users view own XP" ON codex_user_xp
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own XP" ON codex_user_xp
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own XP" ON codex_user_xp
  FOR UPDATE USING (auth.uid() = user_id);

-- Learning Progress
CREATE POLICY "Users view own progress" ON codex_learning_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own progress" ON codex_learning_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own progress" ON codex_learning_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- XP History
CREATE POLICY "Users view own history" ON codex_xp_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own history" ON codex_xp_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Modules (public read)
CREATE POLICY "Everyone views active modules" ON modules
  FOR SELECT USING (active = true);

CREATE POLICY "Directors manage modules" ON modules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'director'
    )
  );

-- Quiz Questions
CREATE POLICY "Users view active questions" ON quiz_questions
  FOR SELECT USING (active = true);

CREATE POLICY "Directors create questions" ON quiz_questions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'director'
    )
  );

CREATE POLICY "Directors update questions" ON quiz_questions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'director'
    )
  );

CREATE POLICY "Directors delete questions" ON quiz_questions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'director'
    )
  );

-- User Modules
CREATE POLICY "Users view own modules" ON user_modules
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own modules" ON user_modules
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own modules" ON user_modules
  FOR UPDATE USING (auth.uid() = user_id);

-- ───────────────────────────────────────────────────────────────────────
-- ÉTAPE 6: RLS POLICIES - GAMIFICATION
-- ───────────────────────────────────────────────────────────────────────

-- Challenges (public read)
CREATE POLICY "Everyone views active challenges" ON challenges
  FOR SELECT USING (active = true);

CREATE POLICY "Directors manage challenges" ON challenges
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'director'
    )
  );

-- User Challenges
CREATE POLICY "Users view own challenges" ON user_challenges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own challenges" ON user_challenges
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own challenges" ON user_challenges
  FOR UPDATE USING (auth.uid() = user_id);

-- Badges (public read)
CREATE POLICY "Everyone views badges" ON badges
  FOR SELECT USING (true);

CREATE POLICY "Directors manage badges" ON badges
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'director'
    )
  );

-- User Badges
CREATE POLICY "Users view own badges" ON user_badges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System insert badges" ON user_badges
  FOR INSERT WITH CHECK (true);

-- Streaks
CREATE POLICY "Users view own streak" ON streaks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users manage own streak" ON streaks
  FOR ALL USING (auth.uid() = user_id);

-- Duels
CREATE POLICY "Users view own duels" ON duels
  FOR SELECT USING (
    auth.uid() = challenger_id
    OR
    auth.uid() = challenged_id
  );

CREATE POLICY "Users create duels" ON duels
  FOR INSERT WITH CHECK (auth.uid() = challenger_id);

CREATE POLICY "Participants update duels" ON duels
  FOR UPDATE USING (
    auth.uid() = challenger_id
    OR
    auth.uid() = challenged_id
  );

-- Daily Challenges
CREATE POLICY "Users view own daily challenges" ON daily_challenges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own daily challenges" ON daily_challenges
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own daily challenges" ON daily_challenges
  FOR UPDATE USING (auth.uid() = user_id);

-- ───────────────────────────────────────────────────────────────────────
-- ÉTAPE 7: RLS POLICIES - NOTIFICATIONS
-- ───────────────────────────────────────────────────────────────────────

CREATE POLICY "Users view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System insert notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- ───────────────────────────────────────────────────────────────────────
-- ÉTAPE 8: RLS POLICIES - VYXO FLASHES & INCIDENTS
-- ───────────────────────────────────────────────────────────────────────

-- Vyxo Flashes
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

CREATE POLICY "System insert flashes" ON vyxo_flashes
  FOR INSERT WITH CHECK (true);

-- Incidents
CREATE POLICY "Team members view team incidents" ON incidents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.team_id = incidents.team_id
    )
    OR
    EXISTS (
      SELECT 1 FROM teams t
      WHERE t.id = incidents.team_id
      AND t.manager_id = auth.uid()
    )
  );

CREATE POLICY "Team members create incidents" ON incidents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.team_id = incidents.team_id
    )
  );

CREATE POLICY "Managers update team incidents" ON incidents
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM teams t
      WHERE t.id = incidents.team_id
      AND t.manager_id = auth.uid()
    )
  );

-- ───────────────────────────────────────────────────────────────────────
-- ÉTAPE 9: RLS POLICIES - ANALYTICS
-- ───────────────────────────────────────────────────────────────────────

-- Risk Alerts
CREATE POLICY "Managers view team alerts" ON risk_alerts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM teams t
      WHERE t.id = risk_alerts.team_id
      AND t.manager_id = auth.uid()
    )
  );

CREATE POLICY "Managers update alerts" ON risk_alerts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM teams t
      WHERE t.id = risk_alerts.team_id
      AND t.manager_id = auth.uid()
    )
  );

-- Company KPIs
CREATE POLICY "Directors view company KPIs" ON company_kpis
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.company_id = company_kpis.company_id
      AND p.role IN ('director', 'manager')
    )
  );

-- Practical Validations
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
-- ÉTAPE 10: RLS POLICIES - CRM (Simple auth for now)
-- ───────────────────────────────────────────────────────────────────────

-- Note: En production, vous devriez filtrer par organization_id
-- Pour simplifier, on donne accès complet aux utilisateurs authentifiés

CREATE POLICY "Authenticated users access clients" ON clients
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users access engagements" ON engagements
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users access audits" ON audits
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users access invoices" ON invoices
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users access activities" ON activities
  FOR ALL USING (auth.role() = 'authenticated');

-- ═══════════════════════════════════════════════════════════════════════
-- FIN PARTIE 2/3 - INDEX ET RLS CRÉÉS ✅
--
-- PROCHAINE ÉTAPE: Exécutez ORDER_66_PART_3_FUNCTIONS.sql
-- ═══════════════════════════════════════════════════════════════════════
