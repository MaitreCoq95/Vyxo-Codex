import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const DEMO_ORG_ID = '00000000-0000-0000-0000-000000000001'

/**
 * GET /api/vyxhunter/stats
 * Get dashboard statistics
 */
export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  try {
    console.log('📊 Fetching VyxHunter stats...')

    // Get date 7 days ago
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    // New prospects (last 7 days)
    const { count: newProspects } = await supabase
      .from('vch_vyxhunter_companies')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', DEMO_ORG_ID)
      .gte('created_at', sevenDaysAgo.toISOString())

    // Analyzed companies
    const { count: analyzed } = await supabase
      .from('vch_vyxhunter_companies')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', DEMO_ORG_ID)
      .eq('status', 'analyzed')

    // Emails sent
    const { count: emailsSent } = await supabase
      .from('vch_vyxhunter_emails')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', DEMO_ORG_ID)
      .eq('status', 'sent')

    // Responses (emails with replied_at)
    const { count: responses } = await supabase
      .from('vch_vyxhunter_emails')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', DEMO_ORG_ID)
      .not('replied_at', 'is', null)

    // Calculate response rate
    const responseRate = emailsSent && emailsSent > 0 
      ? Math.round((responses || 0) / emailsSent * 100) 
      : 0

    // Hot leads (from view)
    const { data: hotLeadsData } = await supabase
      .from('vch_vyxhunter_hot_leads')
      .select('*', { count: 'exact' })
      .eq('organization_id', DEMO_ORG_ID)

    const hotLeads = hotLeadsData?.length || 0

    // Follow-up needed (from view)
    const { data: followUpData } = await supabase
      .from('vch_vyxhunter_followup_needed')
      .select('*')
      .eq('organization_id', DEMO_ORG_ID)

    const stats = {
      newProspects: newProspects || 0,
      analyzed: analyzed || 0,
      emailsSent: emailsSent || 0,
      responses: responses || 0,
      responseRate,
      hotLeads,
      followUpNeeded: followUpData?.length || 0
    }

    console.log('✅ Stats fetched:', stats)

    return NextResponse.json({ stats })
  } catch (error: any) {
    console.error('💥 Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats', details: error.message },
      { status: 500 }
    )
  }
}
