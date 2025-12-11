-- ═══════════════════════════════════════════════════════════════════════
-- VYXO CODEX - QUIZ RESULTS & SCORING SYSTEM
-- Table pour stocker les résultats de quiz et calculer les scores
-- ═══════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────────
-- TABLE: codex_quiz_results
-- Stocke chaque résultat de quiz individuel pour calculer les scores
-- ───────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS codex_quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL, -- ID du module (ex: "iso-9001", "gdp", etc.)
  question_id TEXT NOT NULL, -- ID de la question répondue
  is_correct BOOLEAN NOT NULL, -- Question correcte ou non
  time_spent INTEGER, -- Temps passé en secondes (optionnel)
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Index composite pour éviter les doublons de question par session
  UNIQUE(user_id, question_id, completed_at)
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_codex_quiz_results_user ON codex_quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_codex_quiz_results_module ON codex_quiz_results(module_id);
CREATE INDEX IF NOT EXISTS idx_codex_quiz_results_user_module ON codex_quiz_results(user_id, module_id);
CREATE INDEX IF NOT EXISTS idx_codex_quiz_results_completed ON codex_quiz_results(completed_at DESC);

-- RLS (Row Level Security)
ALTER TABLE codex_quiz_results ENABLE ROW LEVEL SECURITY;

-- Politique : Les utilisateurs peuvent lire leurs propres résultats
CREATE POLICY "Users can read own quiz results" ON codex_quiz_results
  FOR SELECT USING (auth.uid() = user_id);

-- Politique : Les utilisateurs peuvent insérer leurs propres résultats
CREATE POLICY "Users can insert own quiz results" ON codex_quiz_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ───────────────────────────────────────────────────────────────────────
-- VUE: codex_user_module_scores
-- Calcule automatiquement le score par module pour chaque utilisateur
-- ───────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW codex_user_module_scores AS
SELECT
  user_id,
  module_id,
  COUNT(*) as total_questions_answered,
  SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as correct_answers,
  ROUND((SUM(CASE WHEN is_correct THEN 1 ELSE 0 END)::DECIMAL / COUNT(*)) * 100, 1) as score_percentage,
  MIN(completed_at) as first_attempt,
  MAX(completed_at) as last_attempt
FROM codex_quiz_results
GROUP BY user_id, module_id;

-- ───────────────────────────────────────────────────────────────────────
-- VUE: codex_user_global_score
-- Calcule le score global tous modules confondus
-- ───────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW codex_user_global_score AS
SELECT
  user_id,
  COUNT(*) as total_questions_answered,
  SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as correct_answers,
  ROUND((SUM(CASE WHEN is_correct THEN 1 ELSE 0 END)::DECIMAL / COUNT(*)) * 100, 1) as score_percentage,
  COUNT(DISTINCT module_id) as modules_attempted,
  MIN(completed_at) as first_quiz,
  MAX(completed_at) as last_quiz
FROM codex_quiz_results
GROUP BY user_id;

-- ───────────────────────────────────────────────────────────────────────
-- FONCTION: Obtenir le top 5 des modules pour un utilisateur
-- ───────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_user_top_modules(p_user_id UUID, p_limit INTEGER DEFAULT 5)
RETURNS TABLE (
  module_id TEXT,
  score_percentage NUMERIC,
  total_questions INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    cums.module_id,
    cums.score_percentage,
    cums.total_questions_answered::INTEGER as total_questions
  FROM codex_user_module_scores cums
  WHERE cums.user_id = p_user_id
  ORDER BY cums.score_percentage DESC, cums.total_questions_answered DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;

-- ───────────────────────────────────────────────────────────────────────
-- FONCTION: Obtenir les modules à améliorer pour un utilisateur
-- ───────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_user_weak_modules(p_user_id UUID, p_limit INTEGER DEFAULT 5)
RETURNS TABLE (
  module_id TEXT,
  score_percentage NUMERIC,
  total_questions INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    cums.module_id,
    cums.score_percentage,
    cums.total_questions_answered::INTEGER as total_questions
  FROM codex_user_module_scores cums
  WHERE cums.user_id = p_user_id
    AND cums.total_questions_answered >= 5 -- Au moins 5 questions pour être significatif
  ORDER BY cums.score_percentage ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;

-- ───────────────────────────────────────────────────────────────────────
-- FONCTION: Calculer le taux de progression (amélioration dans le temps)
-- ───────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_user_progress_trend(p_user_id UUID, p_module_id TEXT DEFAULT NULL)
RETURNS TABLE (
  period TEXT,
  score_percentage NUMERIC,
  questions_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    TO_CHAR(DATE_TRUNC('week', completed_at), 'YYYY-WW') as period,
    ROUND((SUM(CASE WHEN is_correct THEN 1 ELSE 0 END)::DECIMAL / COUNT(*)) * 100, 1) as score_percentage,
    COUNT(*)::INTEGER as questions_count
  FROM codex_quiz_results
  WHERE user_id = p_user_id
    AND (p_module_id IS NULL OR module_id = p_module_id)
    AND completed_at >= NOW() - INTERVAL '12 weeks'
  GROUP BY DATE_TRUNC('week', completed_at)
  ORDER BY period DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- ═══════════════════════════════════════════════════════════════════════
-- DONNÉES D'EXEMPLE (à retirer en production)
-- ═══════════════════════════════════════════════════════════════════════

-- Exemple d'insertion de résultat
-- INSERT INTO codex_quiz_results (user_id, module_id, question_id, is_correct, time_spent)
-- VALUES (auth.uid(), 'iso-9001', 'q-iso9001-1', true, 45);

-- Exemple de requête pour obtenir le score global d'un utilisateur
-- SELECT * FROM codex_user_global_score WHERE user_id = auth.uid();

-- Exemple de requête pour obtenir les scores par module
-- SELECT * FROM codex_user_module_scores WHERE user_id = auth.uid() ORDER BY score_percentage DESC;
