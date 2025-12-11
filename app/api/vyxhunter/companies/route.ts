import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const DEMO_ORG_ID = '00000000-0000-0000-0000-000000000001'

/**
 * GET /api/vyxhunter/companies
 * List all companies with optional filters
 */
export async function GET(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const sector = searchParams.get('sector')
    const minScore = searchParams.get('minScore')
    const maxScore = searchParams.get('maxScore')

    console.log('📋 Fetching VyxHunter companies...')

    let query = supabase
      .from('vch_vyxhunter_companies')
      .select(`
        *,
        vch_vyxhunter_analyses (
          id,
          business_summary,
          relevance_score,
          confidence_level,
          created_at
        )
      `)
      .eq('organization_id', DEMO_ORG_ID)
      .order('created_at', { ascending: false })

    // Apply filters
    if (status) {
      query = query.eq('status', status)
    }
    if (sector) {
      query = query.eq('sector', sector)
    }
    if (minScore) {
      query = query.gte('relevance_score', parseInt(minScore))
    }
    if (maxScore) {
      query = query.lte('relevance_score', parseInt(maxScore))
    }

    const { data: companies, error } = await query

    if (error) {
      console.error('❌ Companies fetch error:', error)
      throw error
    }

    console.log('✅ Companies fetched:', companies?.length || 0)

    return NextResponse.json({ companies })
  } catch (error: any) {
    console.error('💥 Error fetching companies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch companies', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * POST /api/vyxhunter/companies
 * Create a new company
 */
export async function POST(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  try {
    const body = await request.json()
    console.log('📝 Creating new VyxHunter company:', body)

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    // Prepare company data
    const companyData = {
      organization_id: DEMO_ORG_ID,
      name: body.name,
      website: body.website,
      sector: body.sector,
      size_range: body.size_range,
      location: body.location,
      employee_count: body.employee_count,
      revenue_estimate: body.revenue_estimate,
      linkedin_url: body.linkedin_url,
      description: body.description,
      maturity_transition: body.maturity_transition,
      status: body.status || 'identified',
      assigned_to: body.assigned_to,
      source: body.source || 'manual',
      external_id: body.external_id,
      metadata: body.metadata
    }

    const { data: newCompany, error } = await supabase
      .from('vch_vyxhunter_companies')
      .insert([companyData])
      .select()
      .single()

    if (error) {
      console.error('❌ Create company error:', error)
      throw error
    }

    console.log('✅ Company created:', newCompany)

    // Create interaction record
    await supabase.from('vch_vyxhunter_interactions').insert([{
      organization_id: DEMO_ORG_ID,
      company_id: newCompany.id,
      type: 'company_added',
      details: { source: companyData.source }
    }])

    return NextResponse.json({ company: newCompany })
  } catch (error: any) {
    console.error('💥 Error creating company:', error)
    return NextResponse.json(
      { error: 'Failed to create company', details: error.message },
      { status: 500 }
    )
  }
}
