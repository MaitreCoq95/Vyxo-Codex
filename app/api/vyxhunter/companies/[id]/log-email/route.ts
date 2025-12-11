import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const DEMO_ORG_ID = '00000000-0000-0000-0000-000000000001'

/**
 * POST /api/vyxhunter/companies/[id]/log-email
 * Manually log an email sent to a company
 */
export async function POST(
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
    const { 
      recipientEmail, 
      recipientName, 
      subject,
      emailType = 'initial'
    } = body

    console.log('📝 Logging manual email for company:', id)

    // Check if company exists
    const { data: company, error: companyError } = await supabase
      .from('vch_vyxhunter_companies')
      .select('id, name')
      .eq('id', id)
      .eq('organization_id', DEMO_ORG_ID)
      .single()

    if (companyError || !company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    // Insert email record
    const { data: newEmail, error: emailError } = await supabase
      .from('vch_vyxhunter_emails')
      .insert([{
        organization_id: DEMO_ORG_ID,
        company_id: id,
        recipient_email: recipientEmail || 'manual@log.com',
        recipient_name: recipientName || company.name,
        subject: subject || 'Email envoyé manuellement',
        body_html: '<p>Email envoyé manuellement depuis votre boîte mail.</p>',
        body_text: 'Email envoyé manuellement depuis votre boîte mail.',
        email_type: emailType,
        status: 'sent',
        sent_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (emailError) throw emailError

    // Update company status to 'contacted'
    await supabase
      .from('vch_vyxhunter_companies')
      .update({ status: 'contacted' })
      .eq('id', id)

    // Create interaction record
    await supabase.from('vch_vyxhunter_interactions').insert([{
      organization_id: DEMO_ORG_ID,
      company_id: id,
      email_id: newEmail.id,
      type: 'email_sent',
      details: { 
        method: 'manual_log',
        email_type: emailType
      }
    }])

    console.log('✅ Manual email logged:', newEmail.id)

    return NextResponse.json({ 
      success: true,
      email: newEmail 
    })
  } catch (error: any) {
    console.error('💥 Error logging email:', error)
    return NextResponse.json(
      { error: 'Failed to log email', details: error.message },
      { status: 500 }
    )
  }
}
