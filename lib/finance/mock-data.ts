/**
 * Vyxo Finance Hub - Mock Data
 * Données mockées pour développement et tests
 */

import type {
  FinanceCompany,
  FinancePeriod,
  CFODashboard,
  PLComparison,
  UnitEconomicsAnalysis,
  FinanceAnomaly,
} from '@/types/finance'

// ───────────────────────────────────────────────────────────────────────
// MOCK COMPANY
// ───────────────────────────────────────────────────────────────────────

export const mockCompany: FinanceCompany = {
  id: 'mock-company-1',
  name: 'Vyxo SAS',
  legal_name: 'Vyxo Solutions SAS',
  currency: 'EUR',
  fiscal_year_start: 1,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-12-01T00:00:00Z',
}

// ───────────────────────────────────────────────────────────────────────
// MOCK PERIODS
// ───────────────────────────────────────────────────────────────────────

export const mockPeriods: FinancePeriod[] = [
  {
    id: 'period-2024-01',
    company_id: 'mock-company-1',
    period_type: 'month',
    period_label: '2024-01',
    start_date: '2024-01-01',
    end_date: '2024-01-31',
    is_closed: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-31T23:59:59Z',
  },
  // ... autres mois
  {
    id: 'period-2024-12',
    company_id: 'mock-company-1',
    period_type: 'month',
    period_label: '2024-12',
    start_date: '2024-12-01',
    end_date: '2024-12-31',
    is_closed: false,
    created_at: '2024-12-01T00:00:00Z',
    updated_at: '2024-12-09T00:00:00Z',
  },
]

// ───────────────────────────────────────────────────────────────────────
// MOCK CFO DASHBOARD
// ───────────────────────────────────────────────────────────────────────

export const mockCFODashboard: CFODashboard = {
  current_period: mockPeriods[mockPeriods.length - 1],
  kpis: {
    revenue: 300000,
    revenue_ytd: 3200000,
    revenue_growth: 12.5,
    gross_margin: 210000,
    gross_margin_pct: 70,
    operating_margin: 80000,
    operating_margin_pct: 26.7,
    net_income: 45000,
    net_income_pct: 15,
    ebitda: 65000,
    ebitda_pct: 21.7,
    cash_balance: 250000,
    cash_forecast_30d: 270000,
    cash_forecast_60d: 290000,
    cash_forecast_90d: 310000,
    wc_days: 32,
    dso: 48,
    dpo: 36,
    dio: 20,
    current_ratio: 3.82,
    quick_ratio: 3.36,
  },
  trends: [
    { period_label: '2024-01', revenue: 250000, gross_margin: 175000, net_income: 35000, cash_balance: 180000 },
    { period_label: '2024-02', revenue: 260000, gross_margin: 182000, net_income: 38000, cash_balance: 195000 },
    { period_label: '2024-03', revenue: 275000, gross_margin: 192500, net_income: 42000, cash_balance: 210000 },
    { period_label: '2024-04', revenue: 280000, gross_margin: 196000, net_income: 40000, cash_balance: 215000 },
    { period_label: '2024-05', revenue: 265000, gross_margin: 185500, net_income: 36000, cash_balance: 220000 },
    { period_label: '2024-06', revenue: 290000, gross_margin: 203000, net_income: 44000, cash_balance: 230000 },
    { period_label: '2024-07', revenue: 285000, gross_margin: 199500, net_income: 41000, cash_balance: 235000 },
    { period_label: '2024-08', revenue: 270000, gross_margin: 189000, net_income: 37000, cash_balance: 228000 },
    { period_label: '2024-09', revenue: 295000, gross_margin: 206500, net_income: 46000, cash_balance: 240000 },
    { period_label: '2024-10', revenue: 310000, gross_margin: 217000, net_income: 48000, cash_balance: 245000 },
    { period_label: '2024-11', revenue: 305000, gross_margin: 213500, net_income: 47000, cash_balance: 248000 },
    { period_label: '2024-12', revenue: 300000, gross_margin: 210000, net_income: 45000, cash_balance: 250000 },
  ],
  top_products: [
    {
      product_name: 'Produit A',
      units_sold: 150,
      revenue: 150000,
      contribution_margin: 600,
      contribution_margin_pct: 60,
      net_margin: 400,
      net_margin_pct: 40,
      breakeven_units: 100,
      profitability_rank: 1,
    },
    {
      product_name: 'Produit B',
      units_sold: 40,
      revenue: 80000,
      contribution_margin: 1200,
      contribution_margin_pct: 60,
      net_margin: 800,
      net_margin_pct: 40,
      breakeven_units: 30,
      profitability_rank: 2,
    },
    {
      product_name: 'Service Premium',
      units_sold: 70,
      revenue: 70000,
      contribution_margin: 700,
      contribution_margin_pct: 70,
      net_margin: 400,
      net_margin_pct: 40,
      breakeven_units: 50,
      profitability_rank: 3,
    },
  ],
  recent_anomalies: [
    {
      id: 'anomaly-1',
      company_id: 'mock-company-1',
      period_id: 'period-2024-12',
      anomaly_type: 'trend_break',
      severity: 'high',
      title: 'Rupture tendance DSO',
      description: 'Le DSO est passé de 35 à 48 jours',
      context: { metric: 'dso', expected: 35, actual: 48, deviation: 37 },
      status: 'open',
      created_at: '2024-12-05T10:30:00Z',
      updated_at: '2024-12-05T10:30:00Z',
    },
    {
      id: 'anomaly-2',
      company_id: 'mock-company-1',
      period_id: 'period-2024-12',
      anomaly_type: 'margin_variation',
      severity: 'medium',
      title: 'Baisse de marge brute Produit B',
      description: 'La marge a diminué de 15% par rapport au mois précédent',
      context: { metric: 'gross_margin', product: 'Produit B', expected: 60, actual: 51, deviation: -15 },
      status: 'open',
      created_at: '2024-12-06T14:20:00Z',
      updated_at: '2024-12-06T14:20:00Z',
    },
  ],
}

// ───────────────────────────────────────────────────────────────────────
// MOCK P&L COMPARISON
// ───────────────────────────────────────────────────────────────────────

export const mockPLComparison: PLComparison[] = [
  {
    line_type: 'revenue',
    label: "Chiffre d'affaires",
    actual: 300000,
    budget: 290000,
    forecast: 295000,
    variance_actual_budget: 10000,
    variance_actual_budget_pct: 3.45,
    variance_actual_forecast: 5000,
    variance_actual_forecast_pct: 1.69,
  },
  {
    line_type: 'cogs',
    label: 'Coût des ventes',
    actual: -90000,
    budget: -85000,
    forecast: -87000,
    variance_actual_budget: -5000,
    variance_actual_budget_pct: -5.88,
    variance_actual_forecast: -3000,
    variance_actual_forecast_pct: -3.45,
  },
  {
    line_type: 'gross_margin',
    label: 'Marge brute',
    actual: 210000,
    budget: 205000,
    forecast: 208000,
    variance_actual_budget: 5000,
    variance_actual_budget_pct: 2.44,
    variance_actual_forecast: 2000,
    variance_actual_forecast_pct: 0.96,
  },
  {
    line_type: 'opex',
    label: 'Charges opérationnelles',
    actual: -145000,
    budget: -140000,
    forecast: -143000,
    variance_actual_budget: -5000,
    variance_actual_budget_pct: -3.57,
    variance_actual_forecast: -2000,
    variance_actual_forecast_pct: -1.40,
  },
  {
    line_type: 'ebitda',
    label: 'EBITDA',
    actual: 65000,
    budget: 65000,
    forecast: 65000,
    variance_actual_budget: 0,
    variance_actual_budget_pct: 0,
    variance_actual_forecast: 0,
    variance_actual_forecast_pct: 0,
  },
  {
    line_type: 'net_income',
    label: 'Résultat net',
    actual: 45000,
    budget: 50000,
    forecast: 48000,
    variance_actual_budget: -5000,
    variance_actual_budget_pct: -10,
    variance_actual_forecast: -3000,
    variance_actual_forecast_pct: -6.25,
  },
]

// ───────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ───────────────────────────────────────────────────────────────────────

export function getMockDashboard(): CFODashboard {
  return mockCFODashboard
}

export function getMockPLComparison(): PLComparison[] {
  return mockPLComparison
}

export function generateRandomVariation(base: number, variationPct: number = 10): number {
  const variation = base * (variationPct / 100)
  return base + (Math.random() * variation * 2 - variation)
}
