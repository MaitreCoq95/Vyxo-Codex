import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const DEMO_ORG_ID = '00000000-0000-0000-0000-000000000001'

/**
 * GET /api/vyxhunter/companies/[id]
 * Get single company with full details
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  try {
    const { id } = await params
    console.log('🔍 Fetching company:', id)

    // Fetch company with all related data
    const { data: company, error: companyError } = await supabase
      .from('vch_vyxhunter_companies')
      .select('*')
      .eq('id', id)
      .eq('organization_id', DEMO_ORG_ID)
      .single()

    if (companyError) throw companyError

    // Fetch analyses
    const { data: analyses } = await supabase
      .from('vch_vyxhunter_analyses')
      .select('*')
      .eq('company_id', id)
      .order('created_at', { ascending: false })

    // Fetch gamma slides
    const { data: gammaSlides } = await supabase
      .from('vch_vyxhunter_gamma_slides')
      .select('*')
      .eq('company_id', id)
      .order('created_at', { ascending: false })

    // Fetch emails
    const { data: emails } = await supabase
      .from('vch_vyxhunter_emails')
      .select('*')
      .eq('company_id', id)
      .order('created_at', { ascending: false })

    // Fetch interactions
    const { data: interactions } = await supabase
      .from('vch_vyxhunter_interactions')
      .select('*')
      .eq('company_id', id)
      .order('created_at', { ascending: false })

    const fullCompany = {
      ...company,
      analyses: analyses || [],
      gammaSlides: gammaSlides || [],
      emails: emails || [],
      interactions: interactions || []
    }

    console.log('✅ Company fetched with full details')

    return NextResponse.json({ company: fullCompany })
  } catch (error: any) {
    console.error('💥 Error fetching company:', error)
    return NextResponse.json(
      { error: 'Failed to fetch company', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/vyxhunter/companies/[id]
 * Update company
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  try {
    const { id } = await params
    const body = await request.json()
    console.log('📝 Updating company:', id, body)

    const { data: updatedCompany, error } = await supabase
      .from('vch_vyxhunter_companies')
      .update(body)
      .eq('id', id)
      .eq('organization_id', DEMO_ORG_ID)
      .select()
      .single()

    if (error) throw error

    console.log('✅ Company updated')

    // Create interaction if status changed
    if (body.status) {
      await supabase.from('vch_vyxhunter_interactions').insert([{
        organization_id: DEMO_ORG_ID,
        company_id: id,
        type: 'status_changed',
        details: { new_status: body.status }
      }])
    }

    return NextResponse.json({ company: updatedCompany })
  } catch (error: any) {
    console.error('💥 Error updating company:', error)
    return NextResponse.json(
      { error: 'Failed to update company', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/vyxhunter/companies/[id]
 * Delete company
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  try {
    const { id } = await params
    console.log('🗑️ Deleting company:', id)

    const { error } = await supabase
      .from('vch_vyxhunter_companies')
      .delete()
      .eq('id', id)
      .eq('organization_id', DEMO_ORG_ID)

    if (error) throw error

    console.log('✅ Company deleted')

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('💥 Error deleting company:', error)
    return NextResponse.json(
      { error: 'Failed to delete company', details: error.message },
      { status: 500 }
    )
  }
}
