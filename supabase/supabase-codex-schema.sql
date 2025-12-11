
-- CODEX MODULE SCHEMA
-- Stores user quiz results, scoring analyses, and XP/Gamification data.

-- ═══════════════════════════════════════════════════════════════════════
-- 1. QUIZ & SCORING
-- ═══════════════════════════════════════════════════════════════════════

-- Table: codex_quiz_results
CREATE TABLE IF NOT EXISTS public.codex_quiz_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    module_id TEXT NOT NULL,
    question_id TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT false,
    time_spent INTEGER, -- in seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.codex_quiz_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own results" ON public.codex_quiz_results FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own results" ON public.codex_quiz_results FOR SELECT USING (auth.uid() = user_id);


-- View: codex_user_module_scores
CREATE OR REPLACE VIEW public.codex_user_module_scores AS
SELECT 
    user_id,
    module_id,
    COUNT(*) as total_questions_answered,
    COUNT(*) FILTER (WHERE is_correct = true) as correct_answers,
    ROUND(
        (COUNT(*) FILTER (WHERE is_correct = true)::decimal / COUNT(*)::decimal) * 100, 
        2
    ) as score_percentage,
    MIN(created_at) as first_attempt,
    MAX(created_at) as last_attempt
FROM 
    public.codex_quiz_results
GROUP BY 
    user_id, module_id;


-- View: codex_user_global_score
CREATE OR REPLACE VIEW public.codex_user_global_score AS
SELECT 
    user_id,
    COUNT(*) as total_questions_answered,
    COUNT(*) FILTER (WHERE is_correct = true) as correct_answers,
    ROUND(
        (COUNT(*) FILTER (WHERE is_correct = true)::decimal / COUNT(*)::decimal) * 100, 
        2
    ) as score_percentage,
    COUNT(DISTINCT module_id) as modules_attempted,
    MIN(created_at) as first_quiz,
    MAX(created_at) as last_quiz
FROM 
    public.codex_quiz_results
GROUP BY 
    user_id;


-- Function: get_user_progress_trend
CREATE OR REPLACE FUNCTION public.get_user_progress_trend(
    p_user_id UUID,
    p_module_id TEXT DEFAULT NULL
)
RETURNS TABLE (
    period TEXT,
    score_percentage DECIMAL,
    questions_count BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        TO_CHAR(created_at, 'YYYY-MM-DD') as period,
        ROUND(
            (COUNT(*) FILTER (WHERE is_correct = true)::decimal / COUNT(*)::decimal) * 100, 
            2
        ) as score_percentage,
        COUNT(*) as questions_count
    FROM 
        public.codex_quiz_results
    WHERE 
        user_id = p_user_id
        AND (p_module_id IS NULL OR module_id = p_module_id)
    GROUP BY 
        TO_CHAR(created_at, 'YYYY-MM-DD')
    ORDER BY 
        period ASC
    LIMIT 30;
END;
$$;


-- ═══════════════════════════════════════════════════════════════════════
-- 2. XP & GAMIFICATION
-- ═══════════════════════════════════════════════════════════════════════

-- Table: codex_user_xp
CREATE TABLE IF NOT EXISTS public.codex_user_xp (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    total_xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    badges_earned TEXT[] DEFAULT '{}',
    current_path_id TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.codex_user_xp ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own XP" ON public.codex_user_xp FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own XP" ON public.codex_user_xp FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own XP" ON public.codex_user_xp FOR INSERT WITH CHECK (auth.uid() = user_id);


-- Table: codex_xp_history
CREATE TABLE IF NOT EXISTS public.codex_xp_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    xp_amount INTEGER NOT NULL,
    xp_type TEXT NOT NULL, -- 'QUIZ_COMPLETED', 'READ_ITEM', etc.
    entity_id TEXT,
    entity_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.codex_xp_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own XP history" ON public.codex_xp_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own XP history" ON public.codex_xp_history FOR INSERT WITH CHECK (auth.uid() = user_id);


-- Table: codex_learning_progress
CREATE TABLE IF NOT EXISTS public.codex_learning_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    path_id TEXT NOT NULL,
    current_step_index INTEGER DEFAULT 0,
    completed_steps TEXT[] DEFAULT '{}',
    xp_earned INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.codex_learning_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own learning progress" ON public.codex_learning_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own learning progress" ON public.codex_learning_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own learning progress" ON public.codex_learning_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

