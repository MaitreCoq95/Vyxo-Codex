/**
 * API Route: Vyxo Finance Hub - CFO Dashboard
 * GET /api/finance/dashboard
 */

import { NextRequest, NextResponse } from 'next/server'
import { createFinanceClient } from '@/lib/finance/supabase-client'
import type { CFODashboard, ApiResponse } from '@/types/finance'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('company_id')
    const periodId = searchParams.get('period_id')

    if (!companyId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'company_id is required' },
        { status: 400 }
      )
    }

    const supabase = createFinanceClient()

    // 1. Récupérer la période courante ou spécifiée
    let currentPeriod
    if (periodId) {
      const { data } = await supabase
        .from('finance_periods')
        .select('*')
        .eq('id', periodId)
        .single()
      currentPeriod = data
    } else {
      // Période la plus récente
      const { data } = await supabase
        .from('finance_periods')
        .select('*')
        .eq('company_id', companyId)
        .eq('period_type', 'month')
        .order('start_date', { ascending: false })
        .limit(1)
        .single()
      currentPeriod = data
    }

    if (!currentPeriod) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'No period found' },
        { status: 404 }
      )
    }

    // 2. Récupérer le snapshot KPI pour la période
    const { data: kpiSnapshot } = await supabase
      .from('finance_kpi_snapshots')
      .select('*')
      .eq('company_id', companyId)
      .eq('period_id', currentPeriod.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    // 3. Calculer le YTD revenue
    const startOfYear = new Date(currentPeriod.start_date)
    startOfYear.setMonth(0, 1)

    const { data: ytdPeriods } = await supabase
      .from('finance_periods')
      .select('id')
      .eq('company_id', companyId)
      .eq('period_type', 'month')
      .gte('start_date', startOfYear.toISOString().split('T')[0])
      .lte('end_date', currentPeriod.end_date)

    const periodIds = ytdPeriods?.map((p) => p.id) || []

    const { data: ytdRevenue } = await supabase
      .from('finance_pl_entries')
      .select('actual_amount')
      .eq('company_id', companyId)
      .eq('line_type', 'revenue')
      .in('period_id', periodIds)

    const revenueYTD = ytdRevenue?.reduce((sum, entry) => sum + (entry.actual_amount || 0), 0) || 0

    // 4. Récupérer les tendances (12 derniers mois)
    const { data: last12Periods } = await supabase
      .from('finance_periods')
      .select('*')
      .eq('company_id', companyId)
      .eq('period_type', 'month')
      .order('start_date', { ascending: false })
      .limit(12)

    const trendsPromises = (last12Periods || []).map(async (period) => {
      const { data: snapshot } = await supabase
        .from('finance_kpi_snapshots')
        .select('*')
        .eq('period_id', period.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      return {
        period_label: period.period_label,
        revenue: snapshot?.revenue || 0,
        gross_margin: snapshot?.gross_margin || 0,
        net_income: snapshot?.net_income || 0,
        cash_balance: snapshot?.cash_balance || 0,
      }
    })

    const trends = await Promise.all(trendsPromises)

    // 5. Top products (Unit Economics)
    const { data: unitEconomics } = await supabase
      .from('finance_unit_economics')
      .select('*')
      .eq('company_id', companyId)
      .eq('period_id', currentPeriod.id)
      .order('revenue', { ascending: false })
      .limit(5)

    const topProducts = (unitEconomics || []).map((ue, index) => ({
      product_name: ue.product_name,
      units_sold: ue.units_sold || 0,
      revenue: ue.revenue || 0,
      contribution_margin: ue.contribution_margin || 0,
      contribution_margin_pct:
        ue.unit_price > 0 ? ((ue.contribution_margin || 0) / ue.unit_price) * 100 : 0,
      net_margin: ue.net_margin || 0,
      net_margin_pct: ue.unit_price > 0 ? ((ue.net_margin || 0) / ue.unit_price) * 100 : 0,
      breakeven_units: ue.breakeven_units || 0,
      profitability_rank: index + 1,
    }))

    // 6. Anomalies récentes
    const { data: anomalies } = await supabase
      .from('finance_anomalies')
      .select('*')
      .eq('company_id', companyId)
      .eq('status', 'open')
      .order('severity', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(5)

    // 7. Construire le dashboard
    const dashboard: CFODashboard = {
      current_period: currentPeriod,
      kpis: {
        revenue: kpiSnapshot?.revenue || 0,
        revenue_ytd: revenueYTD,
        revenue_growth: 0, // TODO: Calculer vs période précédente
        gross_margin: kpiSnapshot?.gross_margin || 0,
        gross_margin_pct:
          kpiSnapshot?.revenue > 0
            ? ((kpiSnapshot?.gross_margin || 0) / kpiSnapshot.revenue) * 100
            : 0,
        operating_margin: kpiSnapshot?.operating_margin || 0,
        operating_margin_pct:
          kpiSnapshot?.revenue > 0
            ? ((kpiSnapshot?.operating_margin || 0) / kpiSnapshot.revenue) * 100
            : 0,
        net_income: kpiSnapshot?.net_income || 0,
        net_income_pct:
          kpiSnapshot?.revenue > 0
            ? ((kpiSnapshot?.net_income || 0) / kpiSnapshot.revenue) * 100
            : 0,
        ebitda: kpiSnapshot?.ebitda || 0,
        ebitda_pct:
          kpiSnapshot?.revenue > 0 ? ((kpiSnapshot?.ebitda || 0) / kpiSnapshot.revenue) * 100 : 0,
        cash_balance: kpiSnapshot?.cash_balance || 0,
        cash_forecast_30d: kpiSnapshot?.cash_forecast_30d || 0,
        cash_forecast_60d: kpiSnapshot?.cash_forecast_60d || 0,
        cash_forecast_90d: kpiSnapshot?.cash_forecast_90d || 0,
        wc_days: kpiSnapshot?.wc_days || 0,
        dso: kpiSnapshot?.dso || 0,
        dpo: kpiSnapshot?.dpo || 0,
        dio: kpiSnapshot?.dio || 0,
        current_ratio: kpiSnapshot?.current_ratio || 0,
        quick_ratio: kpiSnapshot?.quick_ratio || 0,
      },
      trends: trends.reverse(), // Ordre chronologique
      top_products: topProducts,
      recent_anomalies: anomalies || [],
    }

    return NextResponse.json<ApiResponse<CFODashboard>>({
      success: true,
      data: dashboard,
    })
  } catch (error) {
    console.error('Error fetching CFO dashboard:', error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
