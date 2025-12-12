-- ═══════════════════════════════════════════════════════════════════════
-- VYXO CODEX 2.0 - QUIZ QUESTIONS TABLE
-- Table pour stocker les questions générées par IA et manuelles
-- ═══════════════════════════════════════════════════════════════════════

-- Table principale des questions
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
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  active BOOLEAN NOT NULL DEFAULT true,
  times_answered INTEGER NOT NULL DEFAULT 0,
  times_correct INTEGER NOT NULL DEFAULT 0,
  avg_time_seconds DECIMAL(10,2)
);

-- Index pour performance
CREATE INDEX idx_quiz_questions_module ON quiz_questions(module_id);
CREATE INDEX idx_quiz_questions_difficulty ON quiz_questions(difficulty);
CREATE INDEX idx_quiz_questions_source ON quiz_questions(source);
CREATE INDEX idx_quiz_questions_active ON quiz_questions(active) WHERE active = true;
CREATE INDEX idx_quiz_questions_tags ON quiz_questions USING GIN(tags);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_quiz_questions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_quiz_questions_updated_at
  BEFORE UPDATE ON quiz_questions
  FOR EACH ROW
  EXECUTE FUNCTION update_quiz_questions_updated_at();

-- RLS Policies
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

-- Tous peuvent voir les questions actives
CREATE POLICY "Users view active questions" ON quiz_questions
  FOR SELECT USING (active = true);

-- Seuls les directors peuvent créer/modifier
CREATE POLICY "Directors create questions" ON quiz_questions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'director'
    )
  );

CREATE POLICY "Directors update questions" ON quiz_questions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'director'
    )
  );

CREATE POLICY "Directors delete questions" ON quiz_questions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'director'
    )
  );

-- Fonction pour calculer les stats de questions
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
    ) / (times_answered + 1)
  WHERE id = p_question_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE quiz_questions IS 'Questions de quiz pour Vyxo Codex - générées par IA ou créées manuellement';
