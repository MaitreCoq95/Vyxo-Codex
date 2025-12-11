import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing prospect ID' }, { status: 400 })
    }

    const apiKey = process.env.APOLLO_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: 'Apollo API key not configured' }, { status: 500 })
    }

    // We use the /v1/people/match endpoint to enrich/reveal data
    // Even though we have the ID, this endpoint allows specifying 'reveal_personal_emails'
    // However, usually just fetching the person by ID with the right plan reveals it if available.
    // But to be safe and explicit about credit usage, we use the enrichment endpoint.
    // Actually, v1/people/{id} is cleaner if we just want details, but match is robust.
    // Let's use v1/people/match with the ID.
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'X-Api-Key': apiKey
      },
      body: JSON.stringify({
        id: id,
        reveal_personal_emails: true,
        reveal_phone_number: false // We focus on email for now
      })
    }

    const response = await fetch('https://api.apollo.io/v1/people/match', options)
    
    if (!response.ok) {
        // Fallback: try v1/people/{id} if match fails or returns 404 for ID
        // But match should work.
        const errorText = await response.text()
        console.error('❌ Apollo Reveal Error:', response.status, errorText)
        return NextResponse.json(
            { error: 'Failed to reveal email', details: errorText }, 
            { status: response.status }
        )
    }

    const data = await response.json()
    
    // The structure usually has 'person' object
    const person = data.person || data

    return NextResponse.json({ 
        email: person.email,
        // Also return other fields that might be enriched
        phone_numbers: person.phone_numbers,
        personal_emails: person.personal_emails
    })

  } catch (error: any) {
    console.error('💥 Prospect reveal error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}
