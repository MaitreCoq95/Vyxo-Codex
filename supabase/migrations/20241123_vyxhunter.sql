-- =====================================================
-- VyxHunter Module - AI-Powered Prospection Agent
-- Created: 2024-11-23
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE 1: vch_vyxhunter_companies
-- Stores identified target companies
-- =====================================================
CREATE TABLE vch_vyxhunter_companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Company Info
  name TEXT NOT NULL,
  website TEXT,
  sector TEXT,
  size_range TEXT, -- "1-10", "11-50", "51-200", etc.
  location TEXT,
  employee_count INTEGER,
  revenue_estimate NUMERIC,
  
  -- Enrichment Data
  linkedin_url TEXT,
  description TEXT,
  maturity_transition TEXT, -- "Agro → Pharma Ready", "Transport → GDP Ready"
  
  -- Scoring
  relevance_score INTEGER CHECK (relevance_score >= 0 AND relevance_score <= 100),
  
  -- Status
  status TEXT DEFAULT 'identified', -- identified, analyzed, contacted, responded, qualified, lost
  assigned_to UUID REFERENCES auth.users(id),
  
  -- Metadata
  source TEXT, -- "apollo", "manual", "sirene"
  external_id TEXT,
  metadata JSONB,
  
  -- RLS
  organization_id UUID REFERENCES vch_organizations(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_vyxhunter_companies_org ON vch_vyxhunter_companies(organization_id);
CREATE INDEX idx_vyxhunter_companies_status ON vch_vyxhunter_companies(status);
CREATE INDEX idx_vyxhunter_companies_score ON vch_vyxhunter_companies(relevance_score DESC NULLS LAST);
CREATE INDEX idx_vyxhunter_companies_created ON vch_vyxhunter_companies(created_at DESC);

-- RLS Policies
ALTER TABLE vch_vyxhunter_companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view companies in their organization"
  ON vch_vyxhunter_companies FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM vch_user_organizations WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert companies in their organization"
  ON vch_vyxhunter_companies FOR INSERT
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM vch_user_organizations WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update companies in their organization"
  ON vch_vyxhunter_companies FOR UPDATE
  USING (organization_id IN (
    SELECT organization_id FROM vch_user_organizations WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can delete companies in their organization"
  ON vch_vyxhunter_companies FOR DELETE
  USING (organization_id IN (
    SELECT organization_id FROM vch_user_organizations WHERE user_id = auth.uid()
  ));

-- =====================================================
-- TABLE 2: vch_vyxhunter_analyses
-- Stores AI-generated company analyses
-- =====================================================
CREATE TABLE vch_vyxhunter_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  company_id UUID REFERENCES vch_vyxhunter_companies(id) ON DELETE CASCADE,
  
  -- AI Analysis
  business_summary TEXT, -- 3 lines max
  pains JSONB, -- ["Pain 1", "Pain 2", ...]
  opportunities JSONB, -- ["Opportunity 1", "Opportunity 2"]
  entry_angle TEXT, -- 1-2 lines
  quick_wins JSONB, -- ["Win 1", "Win 2", "Win 3"]
  
  -- Scoring Details
  relevance_score INTEGER CHECK (relevance_score >= 0 AND relevance_score <= 100),
  confidence_level TEXT CHECK (confidence_level IN ('high', 'medium', 'low')),
  
  -- AI Metadata
  model_used TEXT DEFAULT 'gpt-4o',
  prompt_version TEXT DEFAULT 'v1',
  tokens_used INTEGER,
  
  organization_id UUID REFERENCES vch_organizations(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_vyxhunter_analyses_company ON vch_vyxhunter_analyses(company_id);
CREATE INDEX idx_vyxhunter_analyses_org ON vch_vyxhunter_analyses(organization_id);

-- RLS Policies
ALTER TABLE vch_vyxhunter_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view analyses in their organization"
  ON vch_vyxhunter_analyses FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM vch_user_organizations WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert analyses in their organization"
  ON vch_vyxhunter_analyses FOR INSERT
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM vch_user_organizations WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update analyses in their organization"
  ON vch_vyxhunter_analyses FOR UPDATE
  USING (organization_id IN (
    SELECT organization_id FROM vch_user_organizations WHERE user_id = auth.uid()
  ));

-- =====================================================
-- TABLE 3: vch_vyxhunter_gamma_slides
-- Stores generated Gamma presentation slides
-- =====================================================
CREATE TABLE vch_vyxhunter_gamma_slides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  company_id UUID REFERENCES vch_vyxhunter_companies(id) ON DELETE CASCADE,
  analysis_id UUID REFERENCES vch_vyxhunter_analyses(id) ON DELETE SET NULL,
  
  -- Gamma Data
  gamma_slide_id TEXT,
  gamma_url TEXT,
  gamma_prompt TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'ready', 'failed')),
  error_message TEXT,
  
  -- Tracking
  views_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  
  organization_id UUID REFERENCES vch_organizations(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_vyxhunter_gamma_company ON vch_vyxhunter_gamma_slides(company_id);
CREATE INDEX idx_vyxhunter_gamma_org ON vch_vyxhunter_gamma_slides(organization_id);
CREATE INDEX idx_vyxhunter_gamma_status ON vch_vyxhunter_gamma_slides(status);

-- RLS Policies
ALTER TABLE vch_vyxhunter_gamma_slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view gamma slides in their organization"
  ON vch_vyxhunter_gamma_slides FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM vch_user_organizations WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert gamma slides in their organization"
  ON vch_vyxhunter_gamma_slides FOR INSERT
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM vch_user_organizations WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update gamma slides in their organization"
  ON vch_vyxhunter_gamma_slides FOR UPDATE
  USING (organization_id IN (
    SELECT organization_id FROM vch_user_organizations WHERE user_id = auth.uid()
  ));

-- =====================================================
-- TABLE 4: vch_vyxhunter_emails
-- Stores generated and sent emails
-- =====================================================
CREATE TABLE vch_vyxhunter_emails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ,
  
  company_id UUID REFERENCES vch_vyxhunter_companies(id) ON DELETE CASCADE,
  gamma_slide_id UUID REFERENCES vch_vyxhunter_gamma_slides(id) ON DELETE SET NULL,
  
  -- Email Content
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  body_text TEXT,
  
  -- Type
  email_type TEXT DEFAULT 'initial' CHECK (email_type IN ('initial', 'follow_up_1', 'follow_up_2', 'follow_up_3')),
  parent_email_id UUID REFERENCES vch_vyxhunter_emails(id) ON DELETE SET NULL,
  
  -- Sending
  resend_email_id TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'queued', 'sent', 'delivered', 'bounced', 'failed')),
  
  -- Tracking
  opened_at TIMESTAMPTZ,
  open_count INTEGER DEFAULT 0,
  clicked_gamma_at TIMESTAMPTZ,
  clicked_audit_at TIMESTAMPTZ,
  click_count INTEGER DEFAULT 0,
  replied_at TIMESTAMPTZ,
  
  -- Metadata
  metadata JSONB,
  
  organization_id UUID REFERENCES vch_organizations(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_vyxhunter_emails_company ON vch_vyxhunter_emails(company_id);
CREATE INDEX idx_vyxhunter_emails_org ON vch_vyxhunter_emails(organization_id);
CREATE INDEX idx_vyxhunter_emails_status ON vch_vyxhunter_emails(status);
CREATE INDEX idx_vyxhunter_emails_type ON vch_vyxhunter_emails(email_type);
CREATE INDEX idx_vyxhunter_emails_resend ON vch_vyxhunter_emails(resend_email_id);

-- RLS Policies
ALTER TABLE vch_vyxhunter_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view emails in their organization"
  ON vch_vyxhunter_emails FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM vch_user_organizations WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert emails in their organization"
  ON vch_vyxhunter_emails FOR INSERT
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM vch_user_organizations WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update emails in their organization"
  ON vch_vyxhunter_emails FOR UPDATE
  USING (organization_id IN (
    SELECT organization_id FROM vch_user_organizations WHERE user_id = auth.uid()
  ));

-- =====================================================
-- TABLE 5: vch_vyxhunter_interactions
-- Stores all interactions with prospects
-- =====================================================
CREATE TABLE vch_vyxhunter_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  company_id UUID REFERENCES vch_vyxhunter_companies(id) ON DELETE CASCADE,
  email_id UUID REFERENCES vch_vyxhunter_emails(id) ON DELETE SET NULL,
  
  -- Interaction Type
  type TEXT NOT NULL CHECK (type IN (
    'company_added',
    'analysis_generated',
    'gamma_generated',
    'email_drafted',
    'email_sent',
    'email_opened',
    'link_clicked',
    'replied',
    'call_scheduled',
    'call_completed',
    'status_changed',
    'note_added'
  )),
  details JSONB,
  
  -- Context
  user_id UUID REFERENCES auth.users(id),
  notes TEXT,
  
  organization_id UUID REFERENCES vch_organizations(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_vyxhunter_interactions_company ON vch_vyxhunter_interactions(company_id);
CREATE INDEX idx_vyxhunter_interactions_org ON vch_vyxhunter_interactions(organization_id);
CREATE INDEX idx_vyxhunter_interactions_type ON vch_vyxhunter_interactions(type);
CREATE INDEX idx_vyxhunter_interactions_created ON vch_vyxhunter_interactions(created_at DESC);

-- RLS Policies
ALTER TABLE vch_vyxhunter_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view interactions in their organization"
  ON vch_vyxhunter_interactions FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM vch_user_organizations WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert interactions in their organization"
  ON vch_vyxhunter_interactions FOR INSERT
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM vch_user_organizations WHERE user_id = auth.uid()
  ));

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_vyxhunter_company_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER trigger_update_vyxhunter_company_timestamp
  BEFORE UPDATE ON vch_vyxhunter_companies
  FOR EACH ROW
  EXECUTE FUNCTION update_vyxhunter_company_updated_at();

-- Function to auto-update company relevance score when analysis is created
CREATE OR REPLACE FUNCTION sync_company_relevance_score()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE vch_vyxhunter_companies
  SET relevance_score = NEW.relevance_score
  WHERE id = NEW.company_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to sync relevance score
CREATE TRIGGER trigger_sync_relevance_score
  AFTER INSERT OR UPDATE ON vch_vyxhunter_analyses
  FOR EACH ROW
  EXECUTE FUNCTION sync_company_relevance_score();

-- =====================================================
-- VIEWS FOR ANALYTICS
-- =====================================================

-- View: Hot Leads (multiple opens/clicks)
CREATE OR REPLACE VIEW vch_vyxhunter_hot_leads AS
SELECT 
  c.id,
  c.name,
  c.sector,
  c.relevance_score,
  e.open_count,
  e.click_count,
  e.clicked_gamma_at,
  e.clicked_audit_at,
  e.sent_at,
  c.organization_id
FROM vch_vyxhunter_companies c
JOIN vch_vyxhunter_emails e ON e.company_id = c.id
WHERE e.status = 'sent'
  AND (e.open_count >= 2 OR e.click_count >= 1)
  AND c.status NOT IN ('qualified', 'lost')
ORDER BY e.open_count DESC, e.click_count DESC;

-- View: Follow-up Needed (sent > 7 days ago, no response)
CREATE OR REPLACE VIEW vch_vyxhunter_followup_needed AS
SELECT 
  c.id,
  c.name,
  c.sector,
  e.sent_at,
  e.open_count,
  e.email_type,
  c.organization_id
FROM vch_vyxhunter_companies c
JOIN vch_vyxhunter_emails e ON e.company_id = c.id
WHERE e.status = 'sent'
  AND e.replied_at IS NULL
  AND e.sent_at < NOW() - INTERVAL '7 days'
  AND c.status = 'contacted'
  AND e.email_type IN ('initial', 'follow_up_1')
ORDER BY e.sent_at ASC;

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Uncomment to insert sample data
-- INSERT INTO vch_vyxhunter_companies (name, sector, size_range, location, status, organization_id)
-- VALUES 
--   ('Acme Pharma', 'Pharmaceutique', '51-200', 'Lyon, France', 'identified', (SELECT id FROM vch_organizations LIMIT 1)),
--   ('TechCorp Industries', 'Industrie', '201-500', 'Paris, France', 'identified', (SELECT id FROM vch_organizations LIMIT 1));

-- =====================================================
-- END OF MIGRATION
-- =====================================================
