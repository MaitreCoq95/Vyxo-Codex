import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

/**
 * POST /api/prospecting/send-to-vyxhunter
 * Transfer selected Apollo contacts to VyxHunter
 */
export async function POST(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    const { contacts, autoEnrich = false } = await request.json()

    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
      return NextResponse.json(
        { error: 'No contacts provided' },
        { status: 400 }
      )
    }

    console.log(`📤 Transferring ${contacts.length} contacts to VyxHunter...`)

    // Get a valid organization ID (fallback to first available if not provided)
    // In a real multi-tenant app, we should get this from the user's session or request
    const { data: orgs } = await supabase
      .from('vch_organizations')
      .select('id')
      .limit(1)
    
    const organizationId = orgs?.[0]?.id

    if (!organizationId) {
      console.error('❌ No organization found in vch_organizations table')
      return NextResponse.json(
        { error: 'Configuration error: No organization found' },
        { status: 500 }
      )
    }

    console.log(`Using Organization ID: ${organizationId}`)

    const createdCompanies = []
    const errors = []

    // Process each contact
    for (const contact of contacts) {
      try {
        // Check if company already exists in VyxHunter
        const { data: existing } = await supabase
          .from('vch_vyxhunter_companies')
          .select('id, name')
          .eq('name', contact.organization_name || contact.name)
          .single()

        if (existing) {
          console.log(`⏭️  Company "${existing.name}" already exists, skipping...`)
          continue
        }

        // Create company in VyxHunter
        const { data: newCompany, error: createError } = await supabase
          .from('vch_vyxhunter_companies')
          .insert({
            name: contact.organization_name || contact.organization || contact.name || 'Unknown Company',
            website: contact.website_url || contact.organization_website || contact.organization_url,
            sector: contact.industry || contact.organization_industry,
            size_range: contact.organization_num_employees 
              ? `${contact.organization_num_employees} employés`
              : undefined,
            location: contact.city || contact.state || contact.country || contact.location,
            employee_count: contact.organization_num_employees,
            linkedin_url: contact.linkedin_url,
            description: contact.headline || contact.organization_description,
            status: 'identified',
            source: 'apollo',
            external_id: contact.id,
            organization_id: organizationId,
            metadata: {
              apollo_contact: {
                name: `${contact.first_name} ${contact.last_name}`,
                title: contact.title,
                email: contact.email,
                phone: contact.phone_numbers?.[0],
              }
            }
          })
          .select()
          .single()

        if (createError) {
          console.error(`❌ Supabase error for ${contact.organization_name}:`, createError)
          throw createError
        }

        console.log(`✅ Created company: ${newCompany.name}`)
        createdCompanies.push(newCompany)

        // Auto-enrich if requested
        if (autoEnrich && newCompany.id) {
          try {
            const enrichResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/vyxhunter/enrich`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ companyId: newCompany.id })
            })

            if (enrichResponse.ok) {
              console.log(`🤖 Auto-enriched: ${newCompany.name}`)
            }
          } catch (enrichError) {
            console.error(`⚠️  Enrichment failed for ${newCompany.name}:`, enrichError)
            // Don't fail the whole operation if enrichment fails
          }
        }

      } catch (error: any) {
        console.error(`❌ Error creating company from contact:`, error)
        errors.push({
          contact: contact.name || contact.organization_name,
          error: error.message
        })
      }
    }

    console.log(`✅ Transfer complete: ${createdCompanies.length} companies created`)

    return NextResponse.json({
      success: true,
      created: createdCompanies.length,
      skipped: contacts.length - createdCompanies.length - errors.length,
      errors: errors.length,
      companies: createdCompanies.map(c => ({
        id: c.id,
        name: c.name,
        status: c.status
      })),
      errorDetails: errors
    })

  } catch (error: any) {
    console.error('💥 Error transferring to VyxHunter:', error)
    return NextResponse.json(
      { error: 'Failed to transfer contacts', details: error.message },
      { status: 500 }
    )
  }
}
