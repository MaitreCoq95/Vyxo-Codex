import { NextResponse } from 'next/server'
import { Resend } from 'resend'



export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { to, subject, html, text } = body

    console.log('📧 Sending email to:', to)

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: 'Resend API key not configured' }, { status: 500 })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: [to],
      subject: subject,
      html: html,
      text: text
    })

    if (error) {
      console.error('❌ Resend API Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('✅ Email sent:', data)

    return NextResponse.json(data)
  } catch (error) {
    console.error('💥 Email sending error:', error)
    return NextResponse.json(
      { error: 'Failed to send email', details: error },
      { status: 500 }
    )
  }
}
