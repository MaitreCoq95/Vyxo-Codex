-- Créer la table pour les questions générées par l'IA
CREATE TABLE IF NOT EXISTS codex_quiz_questions (
  id TEXT PRIMARY KEY,
  module_id TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  question TEXT NOT NULL,
  choices JSONB NOT NULL,
  correct_index INTEGER NOT NULL,
  explanation TEXT NOT NULL,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_codex_questions_module ON codex_quiz_questions(module_id);
CREATE INDEX IF NOT EXISTS idx_codex_questions_difficulty ON codex_quiz_questions(difficulty);

-- Enable RLS (Row Level Security)
ALTER TABLE codex_quiz_questions ENABLE ROW LEVEL SECURITY;

-- Policy pour permettre la lecture publique
CREATE POLICY "Allow public read access" ON codex_quiz_questions
  FOR SELECT USING (true);

-- Policy pour permettre l'insertion (vous pouvez ajuster selon vos besoins)
CREATE POLICY "Allow insert for authenticated users" ON codex_quiz_questions
  FOR INSERT WITH CHECK (true);

-- Commentaires
COMMENT ON TABLE codex_quiz_questions IS 'Questions de quiz générées par IA pour le module Vyxo Codex';
COMMENT ON COLUMN codex_quiz_questions.id IS 'ID unique de la question (format: ai-moduleId-timestamp-index)';
COMMENT ON COLUMN codex_quiz_questions.module_id IS 'Référence au module de connaissance';
COMMENT ON COLUMN codex_quiz_questions.choices IS 'Array JSON des 4 choix de réponse';
COMMENT ON COLUMN codex_quiz_questions.correct_index IS 'Index de la bonne réponse (0-3)';
COMMENT ON COLUMN codex_quiz_questions.tags IS 'Array JSON des tags';
