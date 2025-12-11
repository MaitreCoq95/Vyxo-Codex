-- ═══════════════════════════════════════════════════════════════════════
-- VYXO FINANCE HUB - CFO COCKPIT & FINANCIAL ANALYSIS
-- Tables Supabase pour VyxoFinance - Module de pilotage financier complet
-- ═══════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────────
-- 1. TABLE: companies
-- Entités / entreprises (multi-tenant si besoin)
-- ───────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS finance_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  legal_name TEXT,
  currency TEXT NOT NULL DEFAULT 'EUR',
  fiscal_year_start INTEGER NOT NULL DEFAULT 1, -- Mois de début d'exercice (1-12)
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_finance_companies_name ON finance_companies(name);

ALTER TABLE finance_companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read companies" ON finance_companies
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage own companies" ON finance_companies
  FOR ALL USING (auth.uid() = created_by);

-- ───────────────────────────────────────────────────────────────────────
-- 2. TABLE: financial_periods
-- Périodes financières (mois, trimestre, année)
-- ───────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS finance_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES finance_companies(id) ON DELETE CASCADE,
  period_type TEXT NOT NULL CHECK (period_type IN ('month', 'quarter', 'year')),
  period_label TEXT NOT NULL, -- ex: "2024-01", "2024-Q1", "2024"
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_closed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, period_type, period_label)
);

CREATE INDEX IF NOT EXISTS idx_finance_periods_company ON finance_periods(company_id);
CREATE INDEX IF NOT EXISTS idx_finance_periods_dates ON finance_periods(start_date, end_date);

ALTER TABLE finance_periods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read periods" ON finance_periods
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage periods" ON finance_periods
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM finance_companies
      WHERE id = finance_periods.company_id
      AND created_by = auth.uid()
    )
  );

-- ───────────────────────────────────────────────────────────────────────
-- 3. TABLE: pl_entries (Profit & Loss)
-- Compte de résultat détaillé
-- ───────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS finance_pl_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES finance_companies(id) ON DELETE CASCADE,
  period_id UUID NOT NULL REFERENCES finance_periods(id) ON DELETE CASCADE,

  -- Type de ligne P&L
  line_type TEXT NOT NULL CHECK (line_type IN (
    'revenue', 'cogs', 'gross_margin', 'opex', 'ebitda', 'depreciation',
    'ebit', 'financial_result', 'tax', 'net_income'
  )),

  -- Catégorie / sous-catégorie (ex: "Product A", "Marketing", etc.)
  category TEXT,
  subcategory TEXT,

  -- Valeurs
  actual_amount DECIMAL(15,2) DEFAULT 0,
  budget_amount DECIMAL(15,2) DEFAULT 0,
  forecast_amount DECIMAL(15,2) DEFAULT 0,

  -- Méta
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pl_company_period ON finance_pl_entries(company_id, period_id);
CREATE INDEX IF NOT EXISTS idx_pl_line_type ON finance_pl_entries(line_type);

ALTER TABLE finance_pl_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read PL" ON finance_pl_entries
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage PL" ON finance_pl_entries
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM finance_companies
      WHERE id = finance_pl_entries.company_id
      AND created_by = auth.uid()
    )
  );

-- ───────────────────────────────────────────────────────────────────────
-- 4. TABLE: cashflow_entries
-- Flux de trésorerie
-- ───────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS finance_cashflow_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES finance_companies(id) ON DELETE CASCADE,
  period_id UUID NOT NULL REFERENCES finance_periods(id) ON DELETE CASCADE,

  -- Type de flux
  flow_type TEXT NOT NULL CHECK (flow_type IN (
    'operating', 'investing', 'financing'
  )),

  category TEXT NOT NULL,
  description TEXT,

  -- Valeurs
  actual_amount DECIMAL(15,2) DEFAULT 0,
  budget_amount DECIMAL(15,2) DEFAULT 0,
  forecast_amount DECIMAL(15,2) DEFAULT 0,

  -- Date de transaction effective (pour forecast précis)
  transaction_date DATE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cashflow_company_period ON finance_cashflow_entries(company_id, period_id);
CREATE INDEX IF NOT EXISTS idx_cashflow_flow_type ON finance_cashflow_entries(flow_type);

ALTER TABLE finance_cashflow_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read cashflow" ON finance_cashflow_entries
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage cashflow" ON finance_cashflow_entries
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM finance_companies
      WHERE id = finance_cashflow_entries.company_id
      AND created_by = auth.uid()
    )
  );

-- ───────────────────────────────────────────────────────────────────────
-- 5. TABLE: balance_entries
-- Bilan (Balance Sheet)
-- ───────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS finance_balance_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES finance_companies(id) ON DELETE CASCADE,
  period_id UUID NOT NULL REFERENCES finance_periods(id) ON DELETE CASCADE,

  -- Actif ou Passif
  sheet_side TEXT NOT NULL CHECK (sheet_side IN ('asset', 'liability', 'equity')),

  -- Type
  entry_type TEXT NOT NULL CHECK (entry_type IN (
    'current_asset', 'non_current_asset',
    'current_liability', 'non_current_liability',
    'equity'
  )),

  category TEXT NOT NULL,
  description TEXT,

  -- Valeur au moment de clôture de la période
  amount DECIMAL(15,2) DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_balance_company_period ON finance_balance_entries(company_id, period_id);
CREATE INDEX IF NOT EXISTS idx_balance_sheet_side ON finance_balance_entries(sheet_side);

ALTER TABLE finance_balance_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read balance" ON finance_balance_entries
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage balance" ON finance_balance_entries
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM finance_companies
      WHERE id = finance_balance_entries.company_id
      AND created_by = auth.uid()
    )
  );

-- ───────────────────────────────────────────────────────────────────────
-- 6. TABLE: unit_economics
-- Économies unitaires par produit / service
-- ───────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS finance_unit_economics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES finance_companies(id) ON DELETE CASCADE,
  period_id UUID NOT NULL REFERENCES finance_periods(id) ON DELETE CASCADE,

  product_name TEXT NOT NULL,
  product_category TEXT,

  -- Volumes
  units_sold INTEGER DEFAULT 0,

  -- Prix & Coûts unitaires
  unit_price DECIMAL(15,2) DEFAULT 0,
  unit_cogs DECIMAL(15,2) DEFAULT 0,
  unit_allocated_opex DECIMAL(15,2) DEFAULT 0,

  -- Calculs automatiques
  revenue DECIMAL(15,2) GENERATED ALWAYS AS (units_sold * unit_price) STORED,
  contribution_margin DECIMAL(15,2) GENERATED ALWAYS AS (unit_price - unit_cogs) STORED,
  net_margin DECIMAL(15,2) GENERATED ALWAYS AS (unit_price - unit_cogs - unit_allocated_opex) STORED,

  -- Seuil de rentabilité
  breakeven_units INTEGER,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_unit_eco_company_period ON finance_unit_economics(company_id, period_id);
CREATE INDEX IF NOT EXISTS idx_unit_eco_product ON finance_unit_economics(product_name);

ALTER TABLE finance_unit_economics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read unit economics" ON finance_unit_economics
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage unit economics" ON finance_unit_economics
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM finance_companies
      WHERE id = finance_unit_economics.company_id
      AND created_by = auth.uid()
    )
  );

-- ───────────────────────────────────────────────────────────────────────
-- 7. TABLE: kpi_snapshots
-- Snapshots de KPIs calculés (pour historique et charts)
-- ───────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS finance_kpi_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES finance_companies(id) ON DELETE CASCADE,
  period_id UUID NOT NULL REFERENCES finance_periods(id) ON DELETE CASCADE,

  -- KPIs Financiers
  revenue DECIMAL(15,2),
  gross_margin DECIMAL(15,2),
  operating_margin DECIMAL(15,2),
  net_income DECIMAL(15,2),
  ebitda DECIMAL(15,2),

  -- KPIs Cash
  cash_balance DECIMAL(15,2),
  cash_forecast_30d DECIMAL(15,2),
  cash_forecast_60d DECIMAL(15,2),
  cash_forecast_90d DECIMAL(15,2),

  -- KPIs BFR
  dso INTEGER, -- Days Sales Outstanding
  dpo INTEGER, -- Days Payable Outstanding
  dio INTEGER, -- Days Inventory Outstanding
  wc_days INTEGER, -- Working Capital in days

  -- Ratios
  current_ratio DECIMAL(10,4),
  quick_ratio DECIMAL(10,4),
  debt_to_equity DECIMAL(10,4),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kpi_company_period ON finance_kpi_snapshots(company_id, period_id);
CREATE INDEX IF NOT EXISTS idx_kpi_created ON finance_kpi_snapshots(created_at DESC);

ALTER TABLE finance_kpi_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read KPI" ON finance_kpi_snapshots
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create KPI" ON finance_kpi_snapshots
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM finance_companies
      WHERE id = finance_kpi_snapshots.company_id
      AND created_by = auth.uid()
    )
  );

-- ───────────────────────────────────────────────────────────────────────
-- 8. TABLE: scenarios
-- Scénarios de simulation financière
-- ───────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS finance_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES finance_companies(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  scenario_type TEXT NOT NULL CHECK (scenario_type IN ('pessimistic', 'realistic', 'optimistic', 'custom')),

  -- Paramètres de simulation (JSON flexible)
  parameters JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- Ex: { "revenue_growth": 0.20, "cost_variation": 0.05, "dso_days": 45 }

  -- Résultats calculés (JSON)
  results JSONB,
  -- Ex: { "projected_revenue": 1000000, "projected_cash": 150000 }

  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scenarios_company ON finance_scenarios(company_id);

ALTER TABLE finance_scenarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read scenarios" ON finance_scenarios
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage scenarios" ON finance_scenarios
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM finance_companies
      WHERE id = finance_scenarios.company_id
      AND created_by = auth.uid()
    )
  );

-- ───────────────────────────────────────────────────────────────────────
-- 9. TABLE: anomalies
-- Détection d'anomalies et data quality
-- ───────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS finance_anomalies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES finance_companies(id) ON DELETE CASCADE,
  period_id UUID REFERENCES finance_periods(id) ON DELETE CASCADE,

  anomaly_type TEXT NOT NULL CHECK (anomaly_type IN (
    'trend_break', 'margin_variation', 'missing_data', 'inconsistent_data', 'outlier'
  )),

  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),

  title TEXT NOT NULL,
  description TEXT,

  -- Données contextuelles (JSON)
  context JSONB,
  -- Ex: { "metric": "revenue", "expected": 100000, "actual": 50000, "deviation": -50 }

  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'ignored')),

  resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolution_notes TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_anomalies_company ON finance_anomalies(company_id);
CREATE INDEX IF NOT EXISTS idx_anomalies_severity ON finance_anomalies(severity);
CREATE INDEX IF NOT EXISTS idx_anomalies_status ON finance_anomalies(status);

ALTER TABLE finance_anomalies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read anomalies" ON finance_anomalies
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage anomalies" ON finance_anomalies
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM finance_companies
      WHERE id = finance_anomalies.company_id
      AND created_by = auth.uid()
    )
  );

-- ───────────────────────────────────────────────────────────────────────
-- 10. TABLE: ai_assistant_conversations
-- Historique des conversations avec l'assistant IA Finance
-- ───────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS finance_ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES finance_companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  question TEXT NOT NULL,
  answer TEXT,

  -- Contexte utilisé pour la réponse
  context_data JSONB,

  -- Feedback utilisateur
  helpful BOOLEAN,
  feedback_notes TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_conv_company ON finance_ai_conversations(company_id);
CREATE INDEX IF NOT EXISTS idx_ai_conv_user ON finance_ai_conversations(user_id);

ALTER TABLE finance_ai_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own conversations" ON finance_ai_conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create conversations" ON finance_ai_conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════════
-- FONCTIONS UTILITAIRES
-- ═══════════════════════════════════════════════════════════════════════

-- Fonction pour calculer automatiquement les KPIs
CREATE OR REPLACE FUNCTION calculate_kpi_snapshot(
  p_company_id UUID,
  p_period_id UUID
) RETURNS UUID AS $$
DECLARE
  v_snapshot_id UUID;
  v_revenue DECIMAL(15,2);
  v_gross_margin DECIMAL(15,2);
  v_net_income DECIMAL(15,2);
BEGIN
  -- Calcul du CA
  SELECT COALESCE(SUM(actual_amount), 0) INTO v_revenue
  FROM finance_pl_entries
  WHERE company_id = p_company_id
    AND period_id = p_period_id
    AND line_type = 'revenue';

  -- Calcul de la marge brute
  SELECT COALESCE(SUM(actual_amount), 0) INTO v_gross_margin
  FROM finance_pl_entries
  WHERE company_id = p_company_id
    AND period_id = p_period_id
    AND line_type = 'gross_margin';

  -- Calcul du résultat net
  SELECT COALESCE(SUM(actual_amount), 0) INTO v_net_income
  FROM finance_pl_entries
  WHERE company_id = p_company_id
    AND period_id = p_period_id
    AND line_type = 'net_income';

  -- Insertion du snapshot
  INSERT INTO finance_kpi_snapshots (
    company_id, period_id, revenue, gross_margin, net_income
  ) VALUES (
    p_company_id, p_period_id, v_revenue, v_gross_margin, v_net_income
  )
  RETURNING id INTO v_snapshot_id;

  RETURN v_snapshot_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour détecter une anomalie de tendance
CREATE OR REPLACE FUNCTION detect_trend_anomaly(
  p_company_id UUID,
  p_metric TEXT,
  p_threshold DECIMAL DEFAULT 0.30 -- 30% de variation
) RETURNS VOID AS $$
DECLARE
  v_current_value DECIMAL(15,2);
  v_previous_value DECIMAL(15,2);
  v_deviation DECIMAL(10,4);
BEGIN
  -- Logique simplifiée : comparer les 2 dernières périodes
  -- À adapter selon les besoins réels

  -- TODO: Implémenter la logique de détection
  -- et insertion dans finance_anomalies si anomalie détectée

  RAISE NOTICE 'Anomaly detection for % on company %', p_metric, p_company_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ═══════════════════════════════════════════════════════════════════════
-- FIN DU SCHÉMA FINANCE HUB
-- ═══════════════════════════════════════════════════════════════════════
