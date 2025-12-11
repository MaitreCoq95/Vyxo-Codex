import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
import { analyzeCompany } from '@/lib/vyxhunter/ai-analysis'

const DEMO_ORG_ID = '00000000-0000-0000-0000-000000000001'

/**
 * POST /api/vyxhunter/companies/[id]/analyze
 * Generate AI analysis for a company
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
    console.log('🤖 Analyzing company:', id)

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

    // 1. Check for Quality Manager presence via Apollo
    let qualityManagerDetected = false
    try {
      const apolloKey = process.env.APOLLO_API_KEY
      if (apolloKey && (company.website || company.name)) {
        const response = await fetch('https://api.apollo.io/v1/mixed_people/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Api-Key': apolloKey },
          body: JSON.stringify({
            api_key: apolloKey,
            q_organization_domains: company.website ? [company.website] : undefined,
            q_organization_names: !company.website && company.name ? [company.name] : undefined,
            person_titles: ['quality manager', 'responsable qualité', 'directeur qualité', 'qhse', 'assurance qualité', 'quality director', 'head of quality'],
            per_page: 1
          })
        })
        
        if (response.ok) {
          const data = await response.json()
          qualityManagerDetected = (data.pagination?.total_entries || 0) > 0
          console.log(`🕵️‍♂️ Quality Manager check for ${company.name}: ${qualityManagerDetected ? 'DETECTED ✅' : 'NOT FOUND ❌'}`)
        }
      }
    } catch (err) {
      console.warn('⚠️ Failed to check for Quality Manager:', err)
    }

    // 2. Scrape website content (if available)
    let websiteContent = ''
    if (company.website) {
      try {
        const websiteUrl = company.website.startsWith('http') ? company.website : `https://${company.website}`
        console.log(`🌐 Scraping website: ${websiteUrl}`)
        
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000) // 5s timeout
        
        const webRes = await fetch(websiteUrl, { 
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; VyxHunterBot/1.0; +https://vyxo.com)'
          }
        })
        clearTimeout(timeoutId)
        
        if (webRes.ok) {
          const html = await webRes.text()
          // Basic cleanup: remove scripts, styles, and tags, keep text
          websiteContent = html
            .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gm, "")
            .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gm, "")
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 5000) // Limit to 5000 chars to save tokens
          
          console.log(`✅ Website scraped (${websiteContent.length} chars)`)
        }
      } catch (err) {
        console.warn('⚠️ Failed to scrape website:', err)
      }
    }

    // 3. Generate AI analysis
    const analysisData = await analyzeCompany(company, qualityManagerDetected, websiteContent)

    // Prepare data for insertion (map new fields to JSONB to avoid schema changes)
    const { recommended_hat, skill_match_reasoning, quality_manager_detected, ...restAnalysis } = analysisData
    
    const sectorSpecificInsights = {
      ...(analysisData.sector_specific_insights || {}),
      recommended_hat,
      skill_match_reasoning,
      quality_manager_detected
    }

    // Save analysis to database
    const { data: newAnalysis, error: analysisError } = await supabase
      .from('vch_vyxhunter_analyses')
      .insert([{
        organization_id: DEMO_ORG_ID,
        company_id: id,
        ...restAnalysis,
        sector_specific_insights: sectorSpecificInsights
      }])
      .select()
      .single()

    if (analysisError) throw analysisError

    // Update company status to 'analyzed'
    await supabase
      .from('vch_vyxhunter_companies')
      .update({ status: 'analyzed' })
      .eq('id', id)

    // Create interaction record
    await supabase.from('vch_vyxhunter_interactions').insert([{
      organization_id: DEMO_ORG_ID,
      company_id: id,
      type: 'analysis_generated',
      details: { 
        relevance_score: analysisData.relevance_score,
        confidence_level: analysisData.confidence_level
      }
    }])

    console.log('✅ Analysis generated:', newAnalysis.id)

    return NextResponse.json({ 
      success: true,
      analysis: newAnalysis 
    })
  } catch (error: any) {
    console.error('💥 Error analyzing company:', error)
    return NextResponse.json(
      { error: 'Failed to analyze company', details: error.message },
      { status: 500 }
    )
  }
}
