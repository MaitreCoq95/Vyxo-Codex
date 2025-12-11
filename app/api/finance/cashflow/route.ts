/**
 * API Route: Vyxo Finance Hub - Cash Flow
 * GET /api/finance/cashflow - Récupérer les flux de trésorerie
 * POST /api/finance/cashflow - Créer/Mettre à jour des flux
 */

import { NextRequest, NextResponse } from 'next/server'
import { createFinanceClient } from '@/lib/finance/supabase-client'
import type { CashFlowEntry, CashFlowSummary, ApiResponse } from '@/types/finance'

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

    const { data: cashflowEntries, error } = await supabase
      .from('finance_cashflow_entries')
      .select('*')
      .eq('company_id', companyId)
      .eq('period_id', periodId)
      .order('flow_type', { ascending: true })

    if (error) throw error

    // Calculer le summary
    const operating = cashflowEntries?.filter((e) => e.flow_type === 'operating').reduce((sum, e) => sum + (e.actual_amount || 0), 0) || 0
    const investing = cashflowEntries?.filter((e) => e.flow_type === 'investing').reduce((sum, e) => sum + (e.actual_amount || 0), 0) || 0
    const financing = cashflowEntries?.filter((e) => e.flow_type === 'financing').reduce((sum, e) => sum + (e.actual_amount || 0), 0) || 0

    const summary: CashFlowSummary = {
      period_label: '', // TODO: récupérer depuis period
      cash_from_operations: operating,
      cash_from_investing: investing,
      cash_from_financing: financing,
      net_cash_flow: operating + investing + financing,
      cash_balance: 0, // TODO: récupérer depuis KPI snapshot
    }

    return NextResponse.json<ApiResponse<{ entries: CashFlowEntry[]; summary: CashFlowSummary }>>({
      success: true,
      data: {
        entries: cashflowEntries || [],
        summary,
      },
    })
  } catch (error) {
    console.error('Error fetching cashflow:', error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to fetch cashflow data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { company_id, period_id, entries } = body

    if (!company_id || !period_id || !entries) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const supabase = createFinanceClient()

    const cashflowEntries = entries.map((entry: any) => ({
      company_id,
      period_id,
      flow_type: entry.flow_type,
      category: entry.category,
      description: entry.description,
      actual_amount: entry.actual_amount || 0,
      budget_amount: entry.budget_amount || 0,
      forecast_amount: entry.forecast_amount || 0,
      transaction_date: entry.transaction_date,
    }))

    const { data, error } = await supabase
      .from('finance_cashflow_entries')
      .upsert(cashflowEntries)
      .select()

    if (error) throw error

    return NextResponse.json<ApiResponse<CashFlowEntry[]>>({
      success: true,
      data: data || [],
      message: 'Cashflow entries saved successfully',
    })
  } catch (error) {
    console.error('Error saving cashflow:', error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to save cashflow data' },
      { status: 500 }
    )
  }
}
