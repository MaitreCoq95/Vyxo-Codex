import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const DEMO_ORG_ID = '00000000-0000-0000-0000-000000000001'

/**
 * POST /api/vyxhunter/emails/[id]/send
 * Send email via Resend
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
    console.log('📤 Sending email:', id)

    // Parse request body for overrides
    let bodyOverrides: { subject?: string; body?: string } = {}
    try {
      const json = await request.json()
      if (json && (json.subject || json.body)) {
        bodyOverrides = {
          subject: json.subject,
          body: json.body
        }
      }
    } catch (e) {
      // Ignore if no body or invalid JSON
    }

    // Check Resend API key
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'RESEND_API_KEY not configured' },
        { status: 500 }
      )
    }

    // Fetch email
    const { data: email, error: emailError } = await supabase
      .from('vch_vyxhunter_emails')
      .select('*, vch_vyxhunter_companies(*)')
      .eq('id', id)
      .eq('organization_id', DEMO_ORG_ID)
      .single()

    if (emailError) throw emailError
    if (!email) {
      return NextResponse.json(
        { error: 'Email not found' },
        { status: 404 }
      )
    }

    // Check if already sent
    if (email.status === 'sent') {
      return NextResponse.json(
        { error: 'Email already sent' },
        { status: 400 }
      )
    }

    // Update email with overrides if provided
    let subjectToSend = email.subject
    let bodyToSend = email.body_text // Assuming body_text is the main body for now
    let htmlToSend = email.body_html

    if (bodyOverrides.subject || bodyOverrides.body) {
      const updates: any = {}
      if (bodyOverrides.subject) {
        updates.subject = bodyOverrides.subject
        subjectToSend = bodyOverrides.subject
      }
      if (bodyOverrides.body) {
        updates.body_text = bodyOverrides.body
        // Simple HTML conversion for the override
        updates.body_html = bodyOverrides.body.replace(/\n/g, '<br/>')
        
        bodyToSend = updates.body_text
        htmlToSend = updates.body_html
      }

      await supabase
        .from('vch_vyxhunter_emails')
        .update(updates)
        .eq('id', id)
    }

    // Send via Resend
    const resend = new Resend(process.env.RESEND_API_KEY)
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Vivien - Vyxo Consulting <contact@vyxoconsult.com>'
    
    const { data: resendData, error: resendError } = await resend.emails.send({
      from: fromEmail,
      to: email.recipient_email,
      subject: subjectToSend,
      html: htmlToSend,
      text: bodyToSend,
      tags: [
        { name: 'campaign', value: 'vyxhunter' },
        { name: 'company_id', value: email.company_id },
        { name: 'email_type', value: email.email_type }
      ]
    })

    if (resendError) {
      console.error('❌ Resend error:', resendError)
      
      // Update email status to failed
      await supabase
        .from('vch_vyxhunter_emails')
        .update({ 
          status: 'failed',
          metadata: { error: resendError.message }
        })
        .eq('id', id)

      throw resendError
    }

    // Update email status to sent
    const { data: updatedEmail, error: updateError } = await supabase
      .from('vch_vyxhunter_emails')
      .update({ 
        status: 'sent',
        sent_at: new Date().toISOString(),
        resend_email_id: resendData?.id
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) throw updateError

    // Update company status to 'contacted'
    await supabase
      .from('vch_vyxhunter_companies')
      .update({ status: 'contacted' })
      .eq('id', email.company_id)

    // Create interaction record
    await supabase.from('vch_vyxhunter_interactions').insert([{
      organization_id: DEMO_ORG_ID,
      company_id: email.company_id,
      email_id: id,
      type: 'email_sent',
      details: { 
        email_type: email.email_type,
        resend_id: resendData?.id
      }
    }])

    console.log('✅ Email sent successfully:', resendData?.id)

    return NextResponse.json({ 
      success: true,
      email: updatedEmail,
      resendId: resendData?.id
    })
  } catch (error: any) {
    console.error('💥 Error sending email:', error)
    return NextResponse.json(
      { error: 'Failed to send email', details: error.message },
      { status: 500 }
    )
  }
}
