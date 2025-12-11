-- ═══════════════════════════════════════════════════════════════════════
-- VYXO CODEX - LEARNING PATHS & XP SYSTEM
-- Tables Supabase pour le système d'apprentissage gamifié
-- ═══════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────────
-- 1. TABLE: codex_user_xp
-- Stocke le niveau XP global de chaque utilisateur
-- ───────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS codex_user_xp (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  badges_earned JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array de badge IDs
  current_path_id TEXT, -- ID du parcours en cours
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_codex_user_xp_level ON codex_user_xp(level DESC);
CREATE INDEX IF NOT EXISTS idx_codex_user_xp_total_xp ON codex_user_xp(total_xp DESC);

-- RLS (Row Level Security)
ALTER TABLE codex_user_xp ENABLE ROW LEVEL SECURITY;

-- Politique : Les utilisateurs peuvent lire leur propre progression
CREATE POLICY "Users can read own XP" ON codex_user_xp
  FOR SELECT USING (auth.uid() = user_id);

-- Politique : Les utilisateurs peuvent insérer/update leur propre progression
CREATE POLICY "Users can update own XP" ON codex_user_xp
  FOR ALL USING (auth.uid() = user_id);

-- ───────────────────────────────────────────────────────────────────────
-- 2. TABLE: codex_learning_progress
-- Stocke la progression dans les parcours d'apprentissage
-- ───────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS codex_learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  path_id TEXT NOT NULL, -- ID du parcours (ex: "iso-7days")
  current_step_index INTEGER NOT NULL DEFAULT 0,
  completed_steps JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array de step IDs complétés
  xp_earned INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Contrainte : un utilisateur ne peut avoir qu'une seule progression par parcours
  UNIQUE(user_id, path_id)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_codex_learning_progress_user ON codex_learning_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_codex_learning_progress_path ON codex_learning_progress(path_id);
CREATE INDEX IF NOT EXISTS idx_codex_learning_progress_completed ON codex_learning_progress(completed_at);

-- RLS
ALTER TABLE codex_learning_progress ENABLE ROW LEVEL SECURITY;

-- Politique : Les utilisateurs peuvent lire leur propre progression
CREATE POLICY "Users can read own learning progress" ON codex_learning_progress
  FOR SELECT USING (auth.uid() = user_id);

-- Politique : Les utilisateurs peuvent gérer leur propre progression
CREATE POLICY "Users can manage own learning progress" ON codex_learning_progress
  FOR ALL USING (auth.uid() = user_id);

-- ───────────────────────────────────────────────────────────────────────
-- 3. TABLE: codex_xp_history
-- Historique des gains d'XP pour tracking et analytics
-- ───────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS codex_xp_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  xp_amount INTEGER NOT NULL,
  xp_type TEXT NOT NULL, -- "READ_ITEM" | "QUIZ_COMPLETED" | "STEP_COMPLETED" | "PATH_COMPLETED" | "PERFECT_QUIZ"
  entity_id TEXT, -- ID de l'item/quiz/step concerné
  entity_type TEXT, -- "item" | "quiz" | "step" | "path"
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_codex_xp_history_user ON codex_xp_history(user_id);
CREATE INDEX IF NOT EXISTS idx_codex_xp_history_created ON codex_xp_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_codex_xp_history_type ON codex_xp_history(xp_type);

-- RLS
ALTER TABLE codex_xp_history ENABLE ROW LEVEL SECURITY;

-- Politique : Les utilisateurs peuvent lire leur propre historique
CREATE POLICY "Users can read own XP history" ON codex_xp_history
  FOR SELECT USING (auth.uid() = user_id);

-- Politique : Les utilisateurs peuvent insérer leur propre historique
CREATE POLICY "Users can insert own XP history" ON codex_xp_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ───────────────────────────────────────────────────────────────────────
-- 4. FONCTION: Calculer le niveau basé sur l'XP total
-- ───────────────────────────────────────────────────────────────────────
-- Formule : Niveau = floor(sqrt(total_xp / 50))
-- Niveau 1 = 0-49 XP
-- Niveau 2 = 50-199 XP
-- Niveau 3 = 200-449 XP
-- Niveau 4 = 450-799 XP
-- Niveau 5 = 800-1249 XP
-- ...etc

CREATE OR REPLACE FUNCTION calculate_level_from_xp(xp INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN GREATEST(1, FLOOR(SQRT(xp / 50.0))::INTEGER);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ───────────────────────────────────────────────────────────────────────
-- 5. FONCTION: Obtenir l'XP nécessaire pour le prochain niveau
-- ───────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION xp_needed_for_next_level(current_level INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN ((current_level + 1) * (current_level + 1) * 50);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ───────────────────────────────────────────────────────────────────────
-- 6. TRIGGER: Auto-update du niveau lors de l'ajout d'XP
-- ───────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_level_on_xp_change()
RETURNS TRIGGER AS $$
BEGIN
  NEW.level := calculate_level_from_xp(NEW.total_xp);
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_level_on_xp
  BEFORE UPDATE OF total_xp ON codex_user_xp
  FOR EACH ROW
  EXECUTE FUNCTION update_level_on_xp_change();

-- ───────────────────────────────────────────────────────────────────────
-- 7. VUES UTILITAIRES
-- ───────────────────────────────────────────────────────────────────────

-- Vue: Leaderboard global (Top 100)
CREATE OR REPLACE VIEW codex_leaderboard AS
SELECT
  user_id,
  total_xp,
  level,
  badges_earned,
  ROW_NUMBER() OVER (ORDER BY total_xp DESC) as rank
FROM codex_user_xp
ORDER BY total_xp DESC
LIMIT 100;

-- Vue: Statistiques de progression par parcours
CREATE OR REPLACE VIEW codex_path_stats AS
SELECT
  path_id,
  COUNT(DISTINCT user_id) as total_users_started,
  COUNT(DISTINCT CASE WHEN completed_at IS NOT NULL THEN user_id END) as total_users_completed,
  AVG(xp_earned) as avg_xp_earned,
  AVG(EXTRACT(EPOCH FROM (completed_at - started_at)) / 86400.0) as avg_completion_days
FROM codex_learning_progress
GROUP BY path_id;

-- ═══════════════════════════════════════════════════════════════════════
-- DONNÉES DE TEST (Optionnel - à retirer en production)
-- ═══════════════════════════════════════════════════════════════════════

-- Exemple: Initialiser l'XP pour l'utilisateur actuel (à exécuter après l'insertion)
-- INSERT INTO codex_user_xp (user_id, total_xp, level)
-- VALUES (auth.uid(), 0, 1)
-- ON CONFLICT (user_id) DO NOTHING;
