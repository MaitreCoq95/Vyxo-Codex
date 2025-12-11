-- ═══════════════════════════════════════════════════════════════════════
-- VYXO FINANCE HUB - SEED DATA
-- Données de test pour développement et démonstration
-- ═══════════════════════════════════════════════════════════════════════

-- IMPORTANT: Adapter les UUIDs selon votre configuration auth.users
-- Remplacer 'your-user-id-here' par un vrai UUID utilisateur

-- ───────────────────────────────────────────────────────────────────────
-- 1. Créer une entreprise de test
-- ───────────────────────────────────────────────────────────────────────

INSERT INTO finance_companies (id, name, legal_name, currency, fiscal_year_start, created_by)
VALUES (
  'c1111111-1111-1111-1111-111111111111',
  'Vyxo SAS',
  'Vyxo Solutions SAS',
  'EUR',
  1, -- Janvier
  'your-user-id-here' -- À remplacer
)
ON CONFLICT (id) DO NOTHING;

-- ───────────────────────────────────────────────────────────────────────
-- 2. Créer des périodes financières (12 derniers mois)
-- ───────────────────────────────────────────────────────────────────────

-- 2024-01
INSERT INTO finance_periods (id, company_id, period_type, period_label, start_date, end_date, is_closed)
VALUES (
  'p1111111-1111-1111-1111-111111111101',
  'c1111111-1111-1111-1111-111111111111',
  'month',
  '2024-01',
  '2024-01-01',
  '2024-01-31',
  true
) ON CONFLICT DO NOTHING;

-- 2024-02
INSERT INTO finance_periods (id, company_id, period_type, period_label, start_date, end_date, is_closed)
VALUES (
  'p1111111-1111-1111-1111-111111111102',
  'c1111111-1111-1111-1111-111111111111',
  'month',
  '2024-02',
  '2024-02-01',
  '2024-02-29',
  true
) ON CONFLICT DO NOTHING;

-- 2024-03
INSERT INTO finance_periods (id, company_id, period_type, period_label, start_date, end_date, is_closed)
VALUES (
  'p1111111-1111-1111-1111-111111111103',
  'c1111111-1111-1111-1111-111111111111',
  'month',
  '2024-03',
  '2024-03-01',
  '2024-03-31',
  true
) ON CONFLICT DO NOTHING;

-- 2024-04 à 2024-12 (on simplifie pour l'exemple)
-- À dupliquer pour chaque mois...

-- 2024-12 (mois courant pour l'exemple)
INSERT INTO finance_periods (id, company_id, period_type, period_label, start_date, end_date, is_closed)
VALUES (
  'p1111111-1111-1111-1111-111111111112',
  'c1111111-1111-1111-1111-111111111111',
  'month',
  '2024-12',
  '2024-12-01',
  '2024-12-31',
  false
) ON CONFLICT DO NOTHING;

-- ───────────────────────────────────────────────────────────────────────
-- 3. P&L Entries - Données pour 2024-12
-- ───────────────────────────────────────────────────────────────────────

INSERT INTO finance_pl_entries (company_id, period_id, line_type, category, actual_amount, budget_amount, forecast_amount)
VALUES
  -- Revenus
  ('c1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111112', 'revenue', 'Produit A', 150000, 140000, 145000),
  ('c1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111112', 'revenue', 'Produit B', 80000, 90000, 85000),
  ('c1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111112', 'revenue', 'Services', 70000, 70000, 70000),

  -- Coûts des ventes
  ('c1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111112', 'cogs', 'Coûts variables', -90000, -85000, -87000),

  -- Marge brute
  ('c1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111112', 'gross_margin', 'Marge brute', 210000, 215000, 213000),

  -- OPEX
  ('c1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111112', 'opex', 'Salaires', -80000, -80000, -80000),
  ('c1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111112', 'opex', 'Marketing', -30000, -25000, -28000),
  ('c1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111112', 'opex', 'R&D', -20000, -20000, -20000),
  ('c1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111112', 'opex', 'Autres', -15000, -15000, -15000),

  -- EBITDA
  ('c1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111112', 'ebitda', 'EBITDA', 65000, 75000, 70000),

  -- Résultat net
  ('c1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111112', 'net_income', 'Résultat net', 45000, 52000, 48000)
ON CONFLICT DO NOTHING;

-- ───────────────────────────────────────────────────────────────────────
-- 4. Cash Flow Entries - 2024-12
-- ───────────────────────────────────────────────────────────────────────

INSERT INTO finance_cashflow_entries (company_id, period_id, flow_type, category, actual_amount, budget_amount)
VALUES
  -- Operating
  ('c1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111112', 'operating', 'Encaissements clients', 280000, 300000),
  ('c1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111112', 'operating', 'Décaissements fournisseurs', -120000, -110000),
  ('c1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111112', 'operating', 'Salaires', -80000, -80000),

  -- Investing
  ('c1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111112', 'investing', 'Achat équipements', -25000, -30000),

  -- Financing
  ('c1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111112', 'financing', 'Emprunt', 50000, 0),
  ('c1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111112', 'financing', 'Remboursement emprunt', -10000, -10000)
ON CONFLICT DO NOTHING;

-- ───────────────────────────────────────────────────────────────────────
-- 5. Balance Sheet Entries - 2024-12
-- ───────────────────────────────────────────────────────────────────────

INSERT INTO finance_balance_entries (company_id, period_id, sheet_side, entry_type, category, amount)
VALUES
  -- Actifs courants
  ('c1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111112', 'asset', 'current_asset', 'Trésorerie', 250000),
  ('c1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111112', 'asset', 'current_asset', 'Créances clients', 120000),
  ('c1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111112', 'asset', 'current_asset', 'Stock', 50000),

  -- Actifs non courants
  ('c1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111112', 'asset', 'non_current_asset', 'Immobilisations', 200000),

  -- Passifs courants
  ('c1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111112', 'liability', 'current_liability', 'Dettes fournisseurs', 80000),
  ('c1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111112', 'liability', 'current_liability', 'Dettes fiscales', 30000),

  -- Passifs non courants
  ('c1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111112', 'liability', 'non_current_liability', 'Emprunts LT', 150000),

  -- Capitaux propres
  ('c1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111112', 'equity', 'equity', 'Capital', 200000),
  ('c1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111112', 'equity', 'equity', 'Résultats reportés', 160000)
ON CONFLICT DO NOTHING;

-- ───────────────────────────────────────────────────────────────────────
-- 6. Unit Economics - 2024-12
-- ───────────────────────────────────────────────────────────────────────

INSERT INTO finance_unit_economics (company_id, period_id, product_name, product_category, units_sold, unit_price, unit_cogs, unit_allocated_opex, breakeven_units)
VALUES
  ('c1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111112', 'Produit A', 'Software', 150, 1000, 400, 200, 100),
  ('c1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111112', 'Produit B', 'Consulting', 40, 2000, 800, 400, 30),
  ('c1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111112', 'Service Premium', 'Service', 70, 1000, 300, 300, 50)
ON CONFLICT DO NOTHING;

-- ───────────────────────────────────────────────────────────────────────
-- 7. KPI Snapshots - 2024-12
-- ───────────────────────────────────────────────────────────────────────

INSERT INTO finance_kpi_snapshots (
  company_id, period_id,
  revenue, gross_margin, operating_margin, net_income, ebitda,
  cash_balance, cash_forecast_30d, cash_forecast_60d, cash_forecast_90d,
  dso, dpo, dio, wc_days,
  current_ratio, quick_ratio, debt_to_equity
)
VALUES (
  'c1111111-1111-1111-1111-111111111111',
  'p1111111-1111-1111-1111-111111111112',
  300000, -- revenue
  210000, -- gross_margin
  80000, -- operating_margin
  45000, -- net_income
  65000, -- ebitda
  250000, -- cash_balance
  270000, -- forecast_30d
  290000, -- forecast_60d
  310000, -- forecast_90d
  48, -- dso (jours)
  36, -- dpo (jours)
  20, -- dio (jours)
  32, -- wc_days (DSO + DIO - DPO)
  3.82, -- current_ratio (420k / 110k)
  3.36, -- quick_ratio ((420k-50k) / 110k)
  0.54 -- debt_to_equity (150k+80k+30k) / 360k
)
ON CONFLICT DO NOTHING;

-- ───────────────────────────────────────────────────────────────────────
-- 8. Anomalies - Exemples
-- ───────────────────────────────────────────────────────────────────────

INSERT INTO finance_anomalies (
  company_id, period_id, anomaly_type, severity, title, description, context, status
)
VALUES
  (
    'c1111111-1111-1111-1111-111111111111',
    'p1111111-1111-1111-1111-111111111112',
    'margin_variation',
    'medium',
    'Baisse de marge brute Produit B',
    'La marge sur le Produit B a diminué de 15% par rapport au mois précédent',
    '{"metric": "gross_margin", "product": "Produit B", "expected": 60, "actual": 51, "deviation": -15}'::jsonb,
    'open'
  ),
  (
    'c1111111-1111-1111-1111-111111111111',
    'p1111111-1111-1111-1111-111111111112',
    'trend_break',
    'high',
    'Rupture tendance DSO',
    'Le DSO est passé de 35 à 48 jours, indiquant un rallongement des délais de paiement clients',
    '{"metric": "dso", "expected": 35, "actual": 48, "deviation": 37}'::jsonb,
    'open'
  ),
  (
    'c1111111-1111-1111-1111-111111111111',
    'p1111111-1111-1111-1111-111111111112',
    'outlier',
    'low',
    'Dépenses marketing élevées',
    'Les dépenses marketing sont 20% au-dessus du budget',
    '{"metric": "marketing_opex", "budget": 25000, "actual": 30000, "deviation": 20}'::jsonb,
    'investigating'
  )
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════
-- FIN DES SEEDS
-- ═══════════════════════════════════════════════════════════════════════

-- Pour générer des données pour les autres mois, répéter les INSERT avec :
-- - Variations réalistes des montants
-- - IDs de périodes différents
-- - Tendances cohérentes (croissance progressive, saisonnalité, etc.)
