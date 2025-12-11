import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { jobTitle, location, industry, companySize, seniority, department, revenueMin, revenueMax, companyName, personName, page = 1 } = body

    const apiKey = process.env.APOLLO_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: 'Apollo API key not configured' }, { status: 500 })
    }

    // Expand job title to include common variations for better results
    const expandedTitles = jobTitle ? [
      jobTitle,
      // Add common variations if it's a simple title
      ...(jobTitle.toLowerCase().includes('ceo') ? ['Chief Executive Officer', 'Founder', 'Co-Founder'] : []),
      ...(jobTitle.toLowerCase().includes('cto') ? ['Chief Technology Officer', 'VP Technology'] : []),
      ...(jobTitle.toLowerCase().includes('cfo') ? ['Chief Financial Officer', 'VP Finance'] : []),
      ...(jobTitle.toLowerCase().includes('cmo') ? ['Chief Marketing Officer', 'VP Marketing'] : []),
      ...(jobTitle.toLowerCase().includes('director') ? ['Head of', 'Manager'] : []),
    ].filter((v, i, a) => a.indexOf(v) === i) : [] // Remove duplicates

    // Process company size - Don't send if all sizes are selected (prevents 422 error)
    const allSizes = ['1,10', '11,50', '51,200', '201,500', '501,1000', '1001,5000', '5001,10000', '10001']
    const companySizeRanges = companySize && companySize.length > 0 && companySize.length < allSizes.length
      ? companySize.map((range: string) => range.replace(',', '-'))
      : undefined

    console.log('­ƒòÁ´©ÅÔÇìÔÖé´©Å Searching Apollo for:', { jobTitle, location, industry, companySize: companySizeRanges, seniority, department })

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey
      },
      body: JSON.stringify({
        api_key: apiKey,
        q_organization_domains: null,
        page: page,
        person_titles: expandedTitles.length > 0 ? expandedTitles : undefined,
        person_seniorities: seniority ? [seniority] : undefined,
        person_department: department || undefined,
        organization_locations: location ? [location] : undefined,
        organization_num_employees_ranges: companySizeRanges,
        revenue_range: (revenueMin || revenueMax) ? {
          min: revenueMin ? parseInt(revenueMin) : undefined,
          max: revenueMax ? parseInt(revenueMax) : undefined
        } : undefined,
        q_organization_industries: (industry && Array.isArray(industry) && industry.length > 0) ? industry : undefined,
        // New filters
        organization_names: companyName ? [companyName] : undefined,
        person_names: personName ? [personName] : undefined,
        per_page: 100
      })
    }

    const response = await fetch('https://api.apollo.io/v1/mixed_people/search', options)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('ÔØî Apollo API Error:', response.status, errorText)
      return NextResponse.json(
        { error: 'Apollo API error', message: `API returned ${response.status}. Please check your API key.` },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Check if data structure is valid
    if (!data.people || !Array.isArray(data.people)) {
      console.error('ÔØî Invalid Apollo response structure:', data)
      return NextResponse.json(
        { error: 'Invalid response from Apollo', prospects: [] },
        { status: 200 }
      )
    }
    
    // Transform data to our format
    const prospects = data.people.map((p: any) => ({
      id: p.id,
      first_name: p.first_name,
      last_name: p.last_name,
      title: p.title,
      email: p.email || 'Not available',
      linkedin_url: p.linkedin_url,
      organization: p.organization?.name,
      organization_name: p.organization?.name,
      organization_url: p.organization?.website_url,
      organization_website: p.organization?.website_url,
      organization_industry: p.organization?.industry,
      organization_num_employees: p.organization?.estimated_num_employees,
      city: p.city,
      state: p.state,
      country: p.country,
      location: p.city ? `${p.city}, ${p.state}` : p.country,
      photo_url: p.photo_url,
      headline: p.headline,
      phone_numbers: p.phone_numbers,
      website_url: p.organization?.website_url
    }))

    return NextResponse.json({ prospects, total: data.pagination?.total_entries })

  } catch (error: any) {
    console.error('­ƒÆÑ Prospect search error:', error)
    return NextResponse.json(
      { error: 'Failed to search prospects', message: error.message || 'Unknown error' },
      { status: 500 }
    )
  }
}
