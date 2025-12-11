/**
 * API Route: Vyxo Finance Hub - Profit & Loss (P&L)
 * GET /api/finance/pl - Récupérer le P&L
 * POST /api/finance/pl - Créer/Mettre à jour des entrées P&L
 */

import { NextRequest, NextResponse } from 'next/server'
import { createFinanceClient } from '@/lib/finance/supabase-client'
import type { PLEntry, PLComparison, ApiResponse } from '@/types/finance'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('company_id')
    const periodId = searchParams.get('period_id')

    if (!companyId || !periodId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'company_id and period_id are required' },
        { status: 400 }
      )
    }

    const supabase = createFinanceClient()

    // Récupérer toutes les entrées P&L pour la période
    const { data: plEntries, error } = await supabase
      .from('finance_pl_entries')
      .select('*')
      .eq('company_id', companyId)
      .eq('period_id', periodId)
      .order('line_type', { ascending: true })

    if (error) throw error

    // Agréger par line_type
    const aggregated: Record<string, PLComparison> = {}

    plEntries?.forEach((entry) => {
      if (!aggregated[entry.line_type]) {
        aggregated[entry.line_type] = {
          line_type: entry.line_type,
          label: formatLineTypeLabel(entry.line_type),
          actual: 0,
          budget: 0,
          forecast: 0,
          variance_actual_budget: 0,
          variance_actual_budget_pct: 0,
          variance_actual_forecast: 0,
          variance_actual_forecast_pct: 0,
        }
      }

      aggregated[entry.line_type].actual += entry.actual_amount || 0
      aggregated[entry.line_type].budget += entry.budget_amount || 0
      aggregated[entry.line_type].forecast += entry.forecast_amount || 0
    })

    // Calculer les variances
    const comparison: PLComparison[] = Object.values(aggregated).map((item) => {
      const variance_actual_budget = item.actual - item.budget
      const variance_actual_forecast = item.actual - item.forecast

      return {
        ...item,
        variance_actual_budget,
        variance_actual_budget_pct: item.budget !== 0 ? (variance_actual_budget / Math.abs(item.budget)) * 100 : 0,
        variance_actual_forecast,
        variance_actual_forecast_pct:
          item.forecast !== 0 ? (variance_actual_forecast / Math.abs(item.forecast)) * 100 : 0,
      }
    })

    return NextResponse.json<ApiResponse<{ entries: PLEntry[]; comparison: PLComparison[] }>>({
      success: true,
      data: {
        entries: plEntries || [],
        comparison,
      },
    })
  } catch (error) {
    console.error('Error fetching P&L:', error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to fetch P&L data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { company_id, period_id, entries } = body

    if (!company_id || !period_id || !entries || !Array.isArray(entries)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const supabase = createFinanceClient()

    // Préparer les entrées
    const plEntries = entries.map((entry) => ({
      company_id,
      period_id,
      line_type: entry.line_type,
      category: entry.category,
      subcategory: entry.subcategory,
      actual_amount: entry.actual_amount || 0,
      budget_amount: entry.budget_amount || 0,
      forecast_amount: entry.forecast_amount || 0,
      notes: entry.notes,
    }))

    // Insérer ou mettre à jour
    const { data, error } = await supabase
      .from('finance_pl_entries')
      .upsert(plEntries, {
        onConflict: 'company_id,period_id,line_type,category',
      })
      .select()

    if (error) throw error

    return NextResponse.json<ApiResponse<PLEntry[]>>({
      success: true,
      data: data || [],
      message: 'P&L entries saved successfully',
    })
  } catch (error) {
    console.error('Error saving P&L:', error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to save P&L data' },
      { status: 500 }
    )
  }
}

function formatLineTypeLabel(lineType: string): string {
  const labels: Record<string, string> = {
    revenue: 'Chiffre d\'affaires',
    cogs: 'Coût des ventes',
    gross_margin: 'Marge brute',
    opex: 'Charges opérationnelles',
    ebitda: 'EBITDA',
    depreciation: 'Amortissements',
    ebit: 'EBIT',
    financial_result: 'Résultat financier',
    tax: 'Impôts',
    net_income: 'Résultat net',
  }
  return labels[lineType] || lineType
}
