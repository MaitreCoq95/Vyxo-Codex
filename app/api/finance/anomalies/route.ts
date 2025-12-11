/**
 * API Route: Vyxo Finance Hub - Anomalies Detection
 * GET /api/finance/anomalies - Récupérer les anomalies
 * POST /api/finance/anomalies - Créer une anomalie
 * PATCH /api/finance/anomalies - Mettre à jour le statut
 */

import { NextRequest, NextResponse } from 'next/server'
import { createFinanceClient } from '@/lib/finance/supabase-client'
import type { FinanceAnomaly, ApiResponse } from '@/types/finance'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('company_id')
    const status = searchParams.get('status')
    const severity = searchParams.get('severity')

    if (!companyId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'company_id is required' },
        { status: 400 }
      )
    }

    const supabase = createFinanceClient()

    let query = supabase
      .from('finance_anomalies')
      .select('*')
      .eq('company_id', companyId)

    if (status) {
      query = query.eq('status', status)
    }

    if (severity) {
      query = query.eq('severity', severity)
    }

    const { data: anomalies, error } = await query.order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json<ApiResponse<FinanceAnomaly[]>>({
      success: true,
      data: anomalies || [],
    })
  } catch (error) {
    console.error('Error fetching anomalies:', error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to fetch anomalies' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      company_id,
      period_id,
      anomaly_type,
      severity,
      title,
      description,
      context,
    } = body

    if (!company_id || !anomaly_type || !severity || !title) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = createFinanceClient()

    const { data, error } = await supabase
      .from('finance_anomalies')
      .insert({
        company_id,
        period_id,
        anomaly_type,
        severity,
        title,
        description,
        context,
        status: 'open',
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json<ApiResponse<FinanceAnomaly>>({
      success: true,
      data: data,
      message: 'Anomaly created successfully',
    })
  } catch (error) {
    console.error('Error creating anomaly:', error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to create anomaly' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, resolution_notes } = body

    if (!id || !status) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'id and status are required' },
        { status: 400 }
      )
    }

    const supabase = createFinanceClient()

    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    }

    if (status === 'resolved') {
      updateData.resolved_at = new Date().toISOString()
      updateData.resolution_notes = resolution_notes
    }

    const { data, error } = await supabase
      .from('finance_anomalies')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json<ApiResponse<FinanceAnomaly>>({
      success: true,
      data: data,
      message: 'Anomaly updated successfully',
    })
  } catch (error) {
    console.error('Error updating anomaly:', error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to update anomaly' },
      { status: 500 }
    )
  }
}
