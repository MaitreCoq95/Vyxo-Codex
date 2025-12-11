import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { domain, name } = await request.json()
    const apiKey = process.env.APOLLO_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: 'Apollo API key not configured' }, { status: 500 })
    }

    if (!domain && !name) {
      return NextResponse.json({ error: 'Domain or Company Name required' }, { status: 400 })
    }

    console.log('🕵️‍♂️ Searching Decision Makers for:', domain || name)

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey
      },
      body: JSON.stringify({
        api_key: apiKey,
        q_organization_domains: domain ? [domain] : undefined,
        q_organization_names: !domain && name ? [name] : undefined,
        person_seniorities: ['director', 'executive', 'manager', 'c_suite'], // Focus on decision makers
        per_page: 10, // Limit to 10 to save credits/bandwidth, user can load more if needed
        page: 1
      })
    }

    const response = await fetch('https://api.apollo.io/v1/mixed_people/search', options)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Apollo API Error:', response.status, errorText)
      return NextResponse.json(
        { error: 'Apollo API error', message: `API returned ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    const people = data.people?.map((p: any) => ({
      id: p.id,
      first_name: p.first_name,
      last_name: p.last_name,
      name: `${p.first_name} ${p.last_name}`,
      title: p.title,
      email: p.email || 'Not available',
      email_status: p.email_status, // 'verified', 'unavailable', etc.
      linkedin_url: p.linkedin_url,
      photo_url: p.photo_url,
      city: p.city,
      country: p.country,
      is_email_unlocked: p.email && p.email !== 'email_not_unlocked'
    })) || []

    return NextResponse.json({ people, total: data.pagination?.total_entries })

  } catch (error: any) {
    console.error('💥 Decision maker search error:', error)
    return NextResponse.json(
      { error: 'Failed to search people', message: error.message },
      { status: 500 }
    )
  }
}
