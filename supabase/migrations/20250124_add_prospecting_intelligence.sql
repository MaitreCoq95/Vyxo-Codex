-- =====================================================
-- VYXO PROSPECTING INTELLIGENCE SYSTEM
-- Migration: Add ICP sectors, scoring, and templates
-- =====================================================

-- =====================================================
-- 1. ICP SECTORS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS vch_icp_sectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  target_company_size_min INTEGER,
  target_company_size_max INTEGER,
  typical_pain_points TEXT[],
  typical_regulations TEXT[],
  decision_makers TEXT[],
  priority_level INTEGER DEFAULT 5, -- 1-10, 10 = highest priority
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. PAIN POINTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS vch_pain_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sector_id UUID REFERENCES vch_icp_sectors(id) ON DELETE CASCADE,
  pain_point TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  business_impact TEXT,
  typical_triggers TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. SOLUTIONS MAPPING TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS vch_solutions_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pain_point_id UUID REFERENCES vch_pain_points(id) ON DELETE CASCADE,
  solution_title TEXT NOT NULL,
  solution_description TEXT,
  vyxo_offering TEXT, -- Which Vyxo service addresses this
  expected_roi TEXT,
  duration_months INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. SCORING RULES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS vch_scoring_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name TEXT NOT NULL,
  rule_type TEXT CHECK (rule_type IN ('sector', 'pain_points', 'maturity', 'regulations', 'roi', 'risk', 'size')),
  condition JSONB, -- Flexible condition storage
  points INTEGER NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. COMPANY SCORES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS vch_company_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES vch_vyxhunter_companies(id) ON DELETE CASCADE,
  total_score INTEGER DEFAULT 0,
  classification TEXT CHECK (classification IN ('hot', 'warm', 'cold')),
  score_breakdown JSONB, -- Details of how score was calculated
  detected_pain_points TEXT[],
  recommended_solutions TEXT[],
  talking_points TEXT[],
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id)
);

-- =====================================================
-- 6. EMAIL TEMPLATES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS vch_email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sector_id UUID REFERENCES vch_icp_sectors(id) ON DELETE CASCADE,
  template_name TEXT NOT NULL,
  subject_template TEXT NOT NULL,
  body_template TEXT NOT NULL,
  pain_point_focus TEXT,
  tone TEXT DEFAULT 'direct', -- direct, consultative, urgent
  variables TEXT[], -- List of variables to replace: [PRÉNOM], [ENTREPRISE], etc.
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. GAMMA TEMPLATES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS vch_gamma_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sector_id UUID REFERENCES vch_icp_sectors(id) ON DELETE CASCADE,
  template_name TEXT NOT NULL,
  slide_structure JSONB, -- Structure of slides specific to sector
  key_messages TEXT[],
  visual_style TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. ADD COLUMNS TO EXISTING TABLES
-- =====================================================

-- Add to vch_vyxhunter_companies
ALTER TABLE vch_vyxhunter_companies
ADD COLUMN IF NOT EXISTS icp_sector_id UUID REFERENCES vch_icp_sectors(id),
ADD COLUMN IF NOT EXISTS detected_pain_points TEXT[],
ADD COLUMN IF NOT EXISTS maturity_level TEXT CHECK (maturity_level IN ('none', 'low', 'medium', 'high')),
ADD COLUMN IF NOT EXISTS applicable_regulations TEXT[];

-- Add to vch_vyxhunter_analyses
ALTER TABLE vch_vyxhunter_analyses
ADD COLUMN IF NOT EXISTS sector_specific_insights JSONB,
ADD COLUMN IF NOT EXISTS recommended_solutions TEXT[],
ADD COLUMN IF NOT EXISTS talking_points TEXT[];

-- =====================================================
-- 9. INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_company_scores_classification ON vch_company_scores(classification);
CREATE INDEX IF NOT EXISTS idx_company_scores_total_score ON vch_company_scores(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_companies_icp_sector ON vch_vyxhunter_companies(icp_sector_id);
CREATE INDEX IF NOT EXISTS idx_pain_points_sector ON vch_pain_points(sector_id);
CREATE INDEX IF NOT EXISTS idx_email_templates_sector ON vch_email_templates(sector_id);
CREATE INDEX IF NOT EXISTS idx_gamma_templates_sector ON vch_gamma_templates(sector_id);

-- =====================================================
-- 10. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on new tables
ALTER TABLE vch_icp_sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vch_pain_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE vch_solutions_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE vch_scoring_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE vch_company_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE vch_email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE vch_gamma_templates ENABLE ROW LEVEL SECURITY;

-- Policies: Allow service role full access
CREATE POLICY "Service role has full access to icp_sectors"
  ON vch_icp_sectors FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to pain_points"
  ON vch_pain_points FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to solutions_mapping"
  ON vch_solutions_mapping FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to scoring_rules"
  ON vch_scoring_rules FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to company_scores"
  ON vch_company_scores FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to email_templates"
  ON vch_email_templates FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to gamma_templates"
  ON vch_gamma_templates FOR ALL
  USING (auth.role() = 'service_role');

-- =====================================================
-- 11. FUNCTIONS
-- =====================================================

-- Function to calculate company score
CREATE OR REPLACE FUNCTION calculate_company_score(company_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  total_score INTEGER := 0;
  company_record RECORD;
BEGIN
  -- Get company data
  SELECT * INTO company_record
  FROM vch_vyxhunter_companies
  WHERE id = company_uuid;

  -- Sector scoring (0-20 points)
  IF company_record.icp_sector_id IS NOT NULL THEN
    SELECT priority_level * 2 INTO total_score
    FROM vch_icp_sectors
    WHERE id = company_record.icp_sector_id;
  END IF;

  -- Pain points scoring (0-25 points)
  IF company_record.detected_pain_points IS NOT NULL THEN
    total_score := total_score + (LEAST(array_length(company_record.detected_pain_points, 1), 5) * 5);
  END IF;

  -- Maturity scoring (0-15 points)
  CASE company_record.maturity_level
    WHEN 'none' THEN total_score := total_score + 15;
    WHEN 'low' THEN total_score := total_score + 12;
    WHEN 'medium' THEN total_score := total_score + 8;
    WHEN 'high' THEN total_score := total_score + 5;
    ELSE total_score := total_score + 0;
  END CASE;

  -- Regulations scoring (0-15 points)
  IF company_record.applicable_regulations IS NOT NULL THEN
    total_score := total_score + (LEAST(array_length(company_record.applicable_regulations, 1), 3) * 5);
  END IF;

  RETURN total_score;
END;
$$ LANGUAGE plpgsql;

-- Function to classify lead based on score
CREATE OR REPLACE FUNCTION classify_lead(score INTEGER)
RETURNS TEXT AS $$
BEGIN
  IF score >= 80 THEN
    RETURN 'hot';
  ELSIF score >= 60 THEN
    RETURN 'warm';
  ELSE
    RETURN 'cold';
  END IF;
END;
$$ LANGUAGE plpgsql;
