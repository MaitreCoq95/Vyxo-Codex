import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
import { generateVyxHunterEmail } from '@/lib/vyxhunter/email-generator'

const DEMO_ORG_ID = '00000000-0000-0000-0000-000000000001'

/**
 * POST /api/vyxhunter/companies/[id]/email
 * Generate personalized email for a company
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
      emailType = 'initial',
      contactName,
      emailStyle
    } = body

    console.log('✉️ Generating email for company:', id)

    // Validate email type
    if (!['initial', 'follow_up_1', 'follow_up_2', 'follow_up_3'].includes(emailType)) {
      return NextResponse.json(
        { error: 'Invalid email type' },
        { status: 400 }
      )
    }

    // Fetch company
    const { data: company, error: companyError } = await supabase
      .from('vch_vyxhunter_companies')
      .select('*')
      .eq('id', id)
      .eq('organization_id', DEMO_ORG_ID)
      .single()

    if (companyError) throw companyError
    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    // Fetch latest analysis
    const { data: analysis, error: analysisError } = await supabase
      .from('vch_vyxhunter_analyses')
      .select('*')
      .eq('company_id', id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (analysisError || !analysis) {
      return NextResponse.json(
        { error: 'No analysis found. Please analyze the company first.' },
        { status: 400 }
      )
    }

    // Fetch latest Gamma slide (optional)
    const { data: gammaSlide } = await supabase
      .from('vch_vyxhunter_gamma_slides')
      .select('*')
      .eq('company_id', id)
      .eq('status', 'ready')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    // Generate email
    const emailData = await generateVyxHunterEmail(
      company,
      analysis,
      gammaSlide?.gamma_url,
      emailType as any,
      contactName,
      emailStyle
    )

    // Save draft email to database
    const { data: newEmail, error: emailError } = await supabase
      .from('vch_vyxhunter_emails')
      .insert([{
        organization_id: DEMO_ORG_ID,
        company_id: id,
        gamma_slide_id: gammaSlide?.id,
        recipient_email: recipientEmail || 'contact@example.com',
        recipient_name: recipientName || company.name,
        subject: emailData.subject,
        body_html: emailData.bodyHtml,
        body_text: emailData.bodyText,
        email_type: emailType,
        status: 'draft'
      }])
      .select()
      .single()

    if (emailError) throw emailError

    // Create interaction record
    await supabase.from('vch_vyxhunter_interactions').insert([{
      organization_id: DEMO_ORG_ID,
      company_id: id,
      email_id: newEmail.id,
      type: 'email_drafted',
      details: { 
        email_type: emailType,
        has_gamma: !!gammaSlide
      }
    }])

    console.log('✅ Email generated:', newEmail.id)

    return NextResponse.json({ 
      success: true,
      email: newEmail 
    })
  } catch (error: any) {
    console.error('💥 Error generating email:', error)
    return NextResponse.json(
      { error: 'Failed to generate email', details: error.message },
      { status: 500 }
    )
  }
}
