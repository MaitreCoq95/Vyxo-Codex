/**
 * ═══════════════════════════════════════════════════════════════════════
 * VYXO FINANCE HUB - TypeScript Types
 * Types pour le module de pilotage financier VyxoFinance
 * ═══════════════════════════════════════════════════════════════════════
 */

// ───────────────────────────────────────────────────────────────────────
// CORE TYPES
// ───────────────────────────────────────────────────────────────────────

export interface FinanceCompany {
  id: string
  name: string
  legal_name?: string
  currency: string
  fiscal_year_start: number
  created_by?: string
  created_at: string
  updated_at: string
}

export interface FinancePeriod {
  id: string
  company_id: string
  period_type: 'month' | 'quarter' | 'year'
  period_label: string // "2024-01", "2024-Q1", "2024"
  start_date: string
  end_date: string
  is_closed: boolean
  created_at: string
  updated_at: string
}

// ───────────────────────────────────────────────────────────────────────
// P&L (PROFIT & LOSS)
// ───────────────────────────────────────────────────────────────────────

export type PLLineType =
  | 'revenue'
  | 'cogs'
  | 'gross_margin'
  | 'opex'
  | 'ebitda'
  | 'depreciation'
  | 'ebit'
  | 'financial_result'
  | 'tax'
  | 'net_income'

export interface PLEntry {
  id: string
  company_id: string
  period_id: string
  line_type: PLLineType
  category?: string
  subcategory?: string
  actual_amount: number
  budget_amount: number
  forecast_amount: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface PLSummary {
  period_label: string
  revenue: number
  cogs: number
  gross_margin: number
  gross_margin_pct: number
  opex: number
  ebitda: number
  ebitda_pct: number
  net_income: number
  net_income_pct: number
}

export interface PLComparison {
  line_type: PLLineType
  label: string
  actual: number
  budget: number
  forecast: number
  variance_actual_budget: number
  variance_actual_budget_pct: number
  variance_actual_forecast: number
  variance_actual_forecast_pct: number
}

// ───────────────────────────────────────────────────────────────────────
// CASHFLOW
// ───────────────────────────────────────────────────────────────────────

export type CashFlowType = 'operating' | 'investing' | 'financing'

export interface CashFlowEntry {
  id: string
  company_id: string
  period_id: string
  flow_type: CashFlowType
  category: string
  description?: string
  actual_amount: number
  budget_amount: number
  forecast_amount: number
  transaction_date?: string
  created_at: string
  updated_at: string
}

export interface CashFlowSummary {
  period_label: string
  cash_from_operations: number
  cash_from_investing: number
  cash_from_financing: number
  net_cash_flow: number
  cash_balance: number
}

export interface CashForecast {
  forecast_30d: number
  forecast_60d: number
  forecast_90d: number
  projected_dates: {
    date: string
    projected_balance: number
    inflows: number
    outflows: number
  }[]
}

// ───────────────────────────────────────────────────────────────────────
// BALANCE SHEET
// ───────────────────────────────────────────────────────────────────────

export type SheetSide = 'asset' | 'liability' | 'equity'

export type BalanceEntryType =
  | 'current_asset'
  | 'non_current_asset'
  | 'current_liability'
  | 'non_current_liability'
  | 'equity'

export interface BalanceEntry {
  id: string
  company_id: string
  period_id: string
  sheet_side: SheetSide
  entry_type: BalanceEntryType
  category: string
  description?: string
  amount: number
  created_at: string
  updated_at: string
}

export interface BalanceSheetSummary {
  period_label: string
  total_assets: number
  current_assets: number
  non_current_assets: number
  total_liabilities: number
  current_liabilities: number
  non_current_liabilities: number
  total_equity: number
  // Ratios
  current_ratio: number
  quick_ratio: number
  debt_to_equity: number
}

// ───────────────────────────────────────────────────────────────────────
// UNIT ECONOMICS
// ───────────────────────────────────────────────────────────────────────

export interface UnitEconomics {
  id: string
  company_id: string
  period_id: string
  product_name: string
  product_category?: string
  units_sold: number
  unit_price: number
  unit_cogs: number
  unit_allocated_opex: number
  revenue: number // Calculé
  contribution_margin: number // Calculé
  net_margin: number // Calculé
  breakeven_units?: number
  created_at: string
  updated_at: string
}

export interface UnitEconomicsAnalysis {
  product_name: string
  units_sold: number
  revenue: number
  contribution_margin: number
  contribution_margin_pct: number
  net_margin: number
  net_margin_pct: number
  breakeven_units: number
  profitability_rank: number
}

// ───────────────────────────────────────────────────────────────────────
// KPI SNAPSHOTS
// ───────────────────────────────────────────────────────────────────────

export interface KPISnapshot {
  id: string
  company_id: string
  period_id: string
  // Financier
  revenue?: number
  gross_margin?: number
  operating_margin?: number
  net_income?: number
  ebitda?: number
  // Cash
  cash_balance?: number
  cash_forecast_30d?: number
  cash_forecast_60d?: number
  cash_forecast_90d?: number
  // BFR
  dso?: number // Days Sales Outstanding
  dpo?: number // Days Payable Outstanding
  dio?: number // Days Inventory Outstanding
  wc_days?: number // Working Capital Days
  // Ratios
  current_ratio?: number
  quick_ratio?: number
  debt_to_equity?: number
  created_at: string
}

export interface CFODashboard {
  current_period: FinancePeriod
  kpis: {
    revenue: number
    revenue_ytd: number
    revenue_growth: number
    gross_margin: number
    gross_margin_pct: number
    operating_margin: number
    operating_margin_pct: number
    net_income: number
    net_income_pct: number
    ebitda: number
    ebitda_pct: number
    cash_balance: number
    cash_forecast_30d: number
    cash_forecast_60d: number
    cash_forecast_90d: number
    wc_days: number
    dso: number
    dpo: number
    dio: number
    current_ratio: number
    quick_ratio: number
  }
  trends: {
    period_label: string
    revenue: number
    gross_margin: number
    net_income: number
    cash_balance: number
  }[]
  top_products: UnitEconomicsAnalysis[]
  recent_anomalies: FinanceAnomaly[]
}

// ───────────────────────────────────────────────────────────────────────
// SCENARIOS
// ───────────────────────────────────────────────────────────────────────

export type ScenarioType = 'pessimistic' | 'realistic' | 'optimistic' | 'custom'

export interface ScenarioParameters {
  revenue_growth?: number // En %
  cost_variation?: number // En %
  dso_days?: number
  dpo_days?: number
  opex_variation?: number // En %
  [key: string]: any
}

export interface ScenarioResults {
  projected_revenue: number
  projected_gross_margin: number
  projected_net_income: number
  projected_cash: number
  projected_wc_days: number
  [key: string]: any
}

export interface FinanceScenario {
  id: string
  company_id: string
  name: string
  scenario_type: ScenarioType
  parameters: ScenarioParameters
  results?: ScenarioResults
  is_active: boolean
  created_at: string
  updated_at: string
}

// ───────────────────────────────────────────────────────────────────────
// ANOMALIES
// ───────────────────────────────────────────────────────────────────────

export type AnomalyType =
  | 'trend_break'
  | 'margin_variation'
  | 'missing_data'
  | 'inconsistent_data'
  | 'outlier'

export type AnomalySeverity = 'low' | 'medium' | 'high' | 'critical'

export type AnomalyStatus = 'open' | 'investigating' | 'resolved' | 'ignored'

export interface AnomalyContext {
  metric?: string
  expected?: number
  actual?: number
  deviation?: number
  [key: string]: any
}

export interface FinanceAnomaly {
  id: string
  company_id: string
  period_id?: string
  anomaly_type: AnomalyType
  severity: AnomalySeverity
  title: string
  description?: string
  context?: AnomalyContext
  status: AnomalyStatus
  resolved_by?: string
  resolved_at?: string
  resolution_notes?: string
  created_at: string
  updated_at: string
}

// ───────────────────────────────────────────────────────────────────────
// AI ASSISTANT
// ───────────────────────────────────────────────────────────────────────

export interface AIConversation {
  id: string
  company_id: string
  user_id: string
  question: string
  answer?: string
  context_data?: any
  helpful?: boolean
  feedback_notes?: string
  created_at: string
}

export interface AIFinanceQuery {
  question: string
  company_id: string
  context?: {
    period_id?: string
    metrics?: string[]
    include_trends?: boolean
  }
}

export interface AIFinanceResponse {
  answer: string
  data_summary?: any
  suggestions?: string[]
  confidence_score?: number
}

// ───────────────────────────────────────────────────────────────────────
// API RESPONSE TYPES
// ───────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// ───────────────────────────────────────────────────────────────────────
// FILTER & QUERY TYPES
// ───────────────────────────────────────────────────────────────────────

export interface FinanceFilters {
  company_id?: string
  period_type?: 'month' | 'quarter' | 'year'
  start_date?: string
  end_date?: string
  period_ids?: string[]
}

export interface VarianceAnalysis {
  metric: string
  label: string
  actual: number
  budget: number
  variance: number
  variance_pct: number
  status: 'outperform' | 'underperform' | 'on_track'
}

// ───────────────────────────────────────────────────────────────────────
// CHART DATA TYPES
// ───────────────────────────────────────────────────────────────────────

export interface ChartDataPoint {
  label: string
  value: number
  [key: string]: any
}

export interface MultiSeriesDataPoint {
  label: string
  [key: string]: any // Flexible pour plusieurs séries
}

export interface PLChartData {
  periods: string[]
  revenue: number[]
  gross_margin: number[]
  operating_margin: number[]
  net_income: number[]
}

export interface CashFlowChartData {
  periods: string[]
  operating: number[]
  investing: number[]
  financing: number[]
  net_cash: number[]
  balance: number[]
}
