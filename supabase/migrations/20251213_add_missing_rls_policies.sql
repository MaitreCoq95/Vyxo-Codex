-- ═══════════════════════════════════════════════════════════════════════
-- VYXO CODEX 2.0 - CORRECTION RLS POLICIES MANQUANTES
-- Sécurisation des tables teams, incidents, duels
-- ═══════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────────
-- 1. RLS POLICIES POUR TEAMS
-- ───────────────────────────────────────────────────────────────────────

-- Politique: Les membres voient leur propre équipe
CREATE POLICY "Users view own team" ON teams
  FOR SELECT USING (
    -- Manager voit son équipe
    manager_id = auth.uid()
    OR
    -- Membre voit son équipe
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND team_id = teams.id
    )
  );

-- Politique: Seuls les managers peuvent mettre à jour leur équipe
CREATE POLICY "Managers update own team" ON teams
  FOR UPDATE USING (
    manager_id = auth.uid()
  );

-- Politique: Les admins/directors créent des équipes
CREATE POLICY "Directors create teams" ON teams
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'director'
    )
  );

-- ───────────────────────────────────────────────────────────────────────
-- 2. RLS POLICIES POUR INCIDENTS
-- ───────────────────────────────────────────────────────────────────────

-- Activer RLS sur incidents
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

-- Politique: Les membres d'équipe voient les incidents de leur équipe
CREATE POLICY "Team members view team incidents" ON incidents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.team_id = incidents.team_id
    )
    OR
    -- Le manager voit les incidents de son équipe
    EXISTS (
      SELECT 1 FROM teams t
      WHERE t.id = incidents.team_id
      AND t.manager_id = auth.uid()
    )
  );

-- Politique: Les membres d'équipe peuvent créer des incidents
CREATE POLICY "Team members create incidents" ON incidents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.team_id = incidents.team_id
    )
  );

-- Politique: Les managers mettent à jour les incidents de leur équipe
CREATE POLICY "Managers update team incidents" ON incidents
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM teams t
      WHERE t.id = incidents.team_id
      AND t.manager_id = auth.uid()
    )
  );

-- ───────────────────────────────────────────────────────────────────────
-- 3. RLS POLICIES POUR DUELS
-- ───────────────────────────────────────────────────────────────────────

-- Politique: Les utilisateurs voient leurs propres duels
CREATE POLICY "Users view own duels" ON duels
  FOR SELECT USING (
    auth.uid() = challenger_id
    OR
    auth.uid() = challenged_id
  );

-- Politique: Les utilisateurs créent des duels (challenger)
CREATE POLICY "Users create duels" ON duels
  FOR INSERT WITH CHECK (
    auth.uid() = challenger_id
  );

-- Politique: Les participants mettent à jour le duel
CREATE POLICY "Participants update duels" ON duels
  FOR UPDATE USING (
    auth.uid() = challenger_id
    OR
    auth.uid() = challenged_id
  );

-- ───────────────────────────────────────────────────────────────────────
-- 4. AMÉLIORATION: Ajouter INDEX pour performances RLS
-- ───────────────────────────────────────────────────────────────────────

-- Index composite pour optimiser les requêtes RLS
CREATE INDEX IF NOT EXISTS idx_profiles_user_team ON profiles(id, team_id);
CREATE INDEX IF NOT EXISTS idx_teams_manager ON teams(manager_id);
CREATE INDEX IF NOT EXISTS idx_incidents_team ON incidents(team_id);
CREATE INDEX IF NOT EXISTS idx_duels_participants ON duels(challenger_id, challenged_id);

-- Index pour optimiser les requêtes WHERE completed = FALSE
CREATE INDEX IF NOT EXISTS idx_vyxo_flashes_team_completed
ON vyxo_flashes(team_id, completed)
WHERE completed = FALSE;
