-- ══════════════════════════════════════════════════════════════════════════════
-- VYXO FINANCE HUB SCHEMA
-- Tables pour le module de pilotage financier
-- ══════════════════════════════════════════════════════════════════════════════

-- 1. FINANCE PERIODS
-- Périodes comptables (Mois, Trimestres, Années)
CREATE TABLE IF NOT EXISTS finance_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id TEXT NOT NULL, -- Pour l'instant on garde string pour matcher le code, idealement UUID
  period_type TEXT NOT NULL CHECK (period_type IN ('month', 'quarter', 'year')),
  period_label TEXT NOT NULL, -- "2024-01", "2024-Q1"
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_closed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_finance_periods_company ON finance_periods(company_id);
CREATE INDEX IF NOT EXISTS idx_finance_periods_dates ON finance_periods(start_date, end_date);

-- 2. KPI SNAPSHOTS
-- Vue d'ensemble des indicateurs clés pour une période donnée
CREATE TABLE IF NOT EXISTS finance_kpi_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id TEXT NOT NULL,
  period_id UUID REFERENCES finance_periods(id) ON DELETE CASCADE,
  
  -- Financier
  revenue DECIMAL(15, 2) DEFAULT 0,
  gross_margin DECIMAL(15, 2) DEFAULT 0,
  operating_margin DECIMAL(15, 2) DEFAULT 0,
  net_income DECIMAL(15, 2) DEFAULT 0,
  ebitda DECIMAL(15, 2) DEFAULT 0,
  
  -- Cash
  cash_balance DECIMAL(15, 2) DEFAULT 0,
  cash_forecast_30d DECIMAL(15, 2) DEFAULT 0,
  cash_forecast_60d DECIMAL(15, 2) DEFAULT 0,
  cash_forecast_90d DECIMAL(15, 2) DEFAULT 0,
  
  -- BFR (Besoin en Fonds de Roulement)
  dso DECIMAL(10, 2) DEFAULT 0, -- Days Sales Outstanding
  dpo DECIMAL(10, 2) DEFAULT 0, -- Days Payable Outstanding
  dio DECIMAL(10, 2) DEFAULT 0, -- Days Inventory Outstanding
  wc_days DECIMAL(10, 2) DEFAULT 0, -- Working Capital Days
  
  -- Ratios
  current_ratio DECIMAL(10, 2) DEFAULT 0,
  quick_ratio DECIMAL(10, 2) DEFAULT 0,
  debt_to_equity DECIMAL(10, 2) DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_finance_kpi_period ON finance_kpi_snapshots(period_id);

-- 3. P&L ENTRIES (Profit & Loss)
-- Détail des lignes du compte de résultat
CREATE TABLE IF NOT EXISTS finance_pl_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id TEXT NOT NULL,
  period_id UUID REFERENCES finance_periods(id) ON DELETE CASCADE,
  
  line_type TEXT NOT NULL CHECK (line_type IN (
    'revenue', 'cogs', 'gross_margin', 'opex', 'ebitda', 
    'depreciation', 'ebit', 'financial_result', 'tax', 'net_income'
  )),
  category TEXT, -- Ex: "Licences", "Services", "Salaires"
  subcategory TEXT,
  
  actual_amount DECIMAL(15, 2) DEFAULT 0,
  budget_amount DECIMAL(15, 2) DEFAULT 0,
  forecast_amount DECIMAL(15, 2) DEFAULT 0,
  
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_finance_pl_period ON finance_pl_entries(period_id);
CREATE INDEX IF NOT EXISTS idx_finance_pl_type ON finance_pl_entries(line_type);

-- 4. UNIT ECONOMICS
-- Rentabilité par produit/service
CREATE TABLE IF NOT EXISTS finance_unit_economics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id TEXT NOT NULL,
  period_id UUID REFERENCES finance_periods(id) ON DELETE CASCADE,
  
  product_name TEXT NOT NULL,
  product_category TEXT,
  
  units_sold INTEGER DEFAULT 0,
  unit_price DECIMAL(15, 2) DEFAULT 0,
  unit_cogs DECIMAL(15, 2) DEFAULT 0,
  unit_allocated_opex DECIMAL(15, 2) DEFAULT 0,
  
  revenue DECIMAL(15, 2) GENERATED ALWAYS AS (units_sold * unit_price) STORED,
  contribution_margin DECIMAL(15, 2) GENERATED ALWAYS AS (units_sold * (unit_price - unit_cogs)) STORED,
  net_margin DECIMAL(15, 2) GENERATED ALWAYS AS (units_sold * (unit_price - unit_cogs - unit_allocated_opex)) STORED,
  
  breakeven_units INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_finance_ue_period ON finance_unit_economics(period_id);

-- 5. FINANCE ANOMALIES
-- Alertes et anomalies détectées
CREATE TABLE IF NOT EXISTS finance_anomalies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id TEXT NOT NULL,
  period_id UUID REFERENCES finance_periods(id) ON DELETE SET NULL,
  
  anomaly_type TEXT NOT NULL, -- 'trend_break', 'margin_variation', etc.
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'ignored')),
  
  title TEXT NOT NULL,
  description TEXT,
  context JSONB, -- Stocke les détails techniques (metric, expected vs actual)
  
  resolved_by TEXT,
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- DATA SEEDING (Données de démo pour tests)
-- Insère une période démo si elle n'existe pas
INSERT INTO finance_periods (id, company_id, period_type, period_label, start_date, end_date)
VALUES 
  (gen_random_uuid(), 'default-company-id', 'month', '2024-01', '2024-01-01', '2024-01-31'),
  (gen_random_uuid(), 'default-company-id', 'month', '2024-02', '2024-02-01', '2024-02-29')
ON CONFLICT DO NOTHING;

-- Note: Ce script ne remplit pas tout, mais initialise la structure.
