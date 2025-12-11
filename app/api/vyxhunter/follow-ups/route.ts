import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const DEMO_ORG_ID = '00000000-0000-0000-0000-000000000001'

/**
 * GET /api/vyxhunter/follow-ups
 * Get list of companies needing follow-up
 */
export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  try {
    console.log('🔔 Fetching follow-ups...')

    const { data: followUps, error } = await supabase
      .from('vch_vyxhunter_followup_needed')
      .select('*')
      .eq('organization_id', DEMO_ORG_ID)
      .order('sent_at', { ascending: true })

    if (error) throw error

    console.log(`✅ Found ${followUps?.length || 0} follow-ups needed`)

    return NextResponse.json({ followUps: followUps || [] })
  } catch (error: any) {
    console.error('💥 Error fetching follow-ups:', error)
    return NextResponse.json(
      { error: 'Failed to fetch follow-ups', details: error.message },
      { status: 500 }
    )
  }
}
