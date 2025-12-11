/**
 * API Route: Vyxo Finance Hub - Scenarios
 * GET /api/finance/scenarios - Récupérer les scénarios
 * POST /api/finance/scenarios - Créer un nouveau scénario
 */

import { NextRequest, NextResponse } from 'next/server'
import { createFinanceClient } from '@/lib/finance/supabase-client'
import type { FinanceScenario, ScenarioResults, ApiResponse } from '@/types/finance'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('company_id')

    if (!companyId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'company_id is required' },
        { status: 400 }
      )
    }

    const supabase = createFinanceClient()

    const { data: scenarios, error } = await supabase
      .from('finance_scenarios')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json<ApiResponse<FinanceScenario[]>>({
      success: true,
      data: scenarios || [],
    })
  } catch (error) {
    console.error('Error fetching scenarios:', error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to fetch scenarios' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { company_id, name, scenario_type, parameters } = body

    if (!company_id || !name || !scenario_type || !parameters) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = createFinanceClient()

    // Calculer les résultats du scénario
    const results = await calculateScenarioResults(company_id, parameters)

    const { data, error } = await supabase
      .from('finance_scenarios')
      .insert({
        company_id,
        name,
        scenario_type,
        parameters,
        results,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json<ApiResponse<FinanceScenario>>({
      success: true,
      data: data,
      message: 'Scenario created successfully',
    })
  } catch (error) {
    console.error('Error creating scenario:', error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to create scenario' },
      { status: 500 }
    )
  }
}

/**
 * Calculer les résultats d'un scénario
 * Cette fonction peut être enrichie avec des modèles financiers plus sophistiqués
 */
async function calculateScenarioResults(
  companyId: string,
  parameters: any
): Promise<ScenarioResults> {
  const supabase = createFinanceClient()

  // Récupérer les dernières KPI comme base
  const { data: lastKPI } = await supabase
    .from('finance_kpi_snapshots')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!lastKPI) {
    // Valeurs par défaut si pas de données
    return {
      projected_revenue: 0,
      projected_gross_margin: 0,
      projected_net_income: 0,
      projected_cash: 0,
      projected_wc_days: 0,
    }
  }

  // Appliquer les variations du scénario
  const revenueGrowth = parameters.revenue_growth || 0
  const costVariation = parameters.cost_variation || 0
  const opexVariation = parameters.opex_variation || 0

  const projectedRevenue = (lastKPI.revenue || 0) * (1 + revenueGrowth)
  const projectedGrossMargin = (lastKPI.gross_margin || 0) * (1 + revenueGrowth) * (1 - costVariation)
  const projectedNetIncome = (lastKPI.net_income || 0) * (1 + revenueGrowth) * (1 - costVariation) * (1 - opexVariation)
  const projectedCash = (lastKPI.cash_balance || 0) + projectedNetIncome

  const dsoChange = parameters.dso_days ? parameters.dso_days - (lastKPI.dso || 0) : 0
  const dpoChange = parameters.dpo_days ? parameters.dpo_days - (lastKPI.dpo || 0) : 0
  const projectedWCDays = (lastKPI.wc_days || 0) + dsoChange - dpoChange

  return {
    projected_revenue: Math.round(projectedRevenue),
    projected_gross_margin: Math.round(projectedGrossMargin),
    projected_net_income: Math.round(projectedNetIncome),
    projected_cash: Math.round(projectedCash),
    projected_wc_days: Math.round(projectedWCDays),
  }
}
