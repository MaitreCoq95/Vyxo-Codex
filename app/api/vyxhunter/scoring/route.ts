import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

/**
 * POST /api/vyxhunter/scoring
 * Calculate lead score for a company
 */
export async function POST(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  
  try {
    const { companyId } = await request.json()

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      )
    }

    // Fetch company data
    const { data: company, error: companyError } = await supabase
      .from('vch_vyxhunter_companies')
      .select('*')
      .eq('id', companyId)
      .single()

    if (companyError) throw companyError
    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    // Calculate score using database function
    const { data: scoreData, error: scoreError } = await supabase
      .rpc('calculate_company_score', { company_uuid: companyId })

    if (scoreError) throw scoreError

    const totalScore = scoreData || 0

    // Classify lead
    const { data: classification, error: classifyError } = await supabase
      .rpc('classify_lead', { score: totalScore })

    if (classifyError) throw classifyError

    // Build score breakdown
    const scoreBreakdown = {
      sector: 0,
      painPoints: 0,
      maturity: 0,
      regulations: 0,
      total: totalScore
    }

    // Calculate sector score
    if (company.icp_sector_id) {
      const { data: sector } = await supabase
        .from('vch_icp_sectors')
        .select('priority_level')
        .eq('id', company.icp_sector_id)
        .single()
      
      if (sector) {
        scoreBreakdown.sector = sector.priority_level * 2
      }
    }

    // Calculate pain points score
    if (company.detected_pain_points && company.detected_pain_points.length > 0) {
      scoreBreakdown.painPoints = Math.min(company.detected_pain_points.length, 5) * 5
    }

    // Calculate maturity score
    switch (company.maturity_level) {
      case 'none':
        scoreBreakdown.maturity = 15
        break
      case 'low':
        scoreBreakdown.maturity = 12
        break
      case 'medium':
        scoreBreakdown.maturity = 8
        break
      case 'high':
        scoreBreakdown.maturity = 5
        break
    }

    // Calculate regulations score
    if (company.applicable_regulations && company.applicable_regulations.length > 0) {
      scoreBreakdown.regulations = Math.min(company.applicable_regulations.length, 3) * 5
    }

    // Save or update score
    const { data: savedScore, error: saveError } = await supabase
      .from('vch_company_scores')
      .upsert({
        company_id: companyId,
        total_score: totalScore,
        classification: classification,
        score_breakdown: scoreBreakdown,
        detected_pain_points: company.detected_pain_points || [],
        calculated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (saveError) throw saveError

    console.log(`✅ Score calculated for company ${companyId}: ${totalScore} (${classification})`)

    return NextResponse.json({
      success: true,
      score: {
        total: totalScore,
        classification: classification,
        breakdown: scoreBreakdown
      },
      company: {
        id: company.id,
        name: company.name,
        sector: company.icp_sector_id,
        painPoints: company.detected_pain_points,
        maturity: company.maturity_level
      }
    })

  } catch (error: any) {
    console.error('💥 Error calculating score:', error)
    return NextResponse.json(
      { error: 'Failed to calculate score', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * GET /api/vyxhunter/scoring?companyId=xxx
 * Get existing score for a company
 */
export async function GET(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      )
    }

    // Fetch existing score
    const { data: score, error: scoreError } = await supabase
      .from('vch_company_scores')
      .select('*')
      .eq('company_id', companyId)
      .single()

    if (scoreError && scoreError.code !== 'PGRST116') { // PGRST116 = not found
      throw scoreError
    }

    if (!score) {
      return NextResponse.json(
        { error: 'Score not found. Calculate score first.' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      score: score
    })

  } catch (error: any) {
    console.error('💥 Error fetching score:', error)
    return NextResponse.json(
      { error: 'Failed to fetch score', details: error.message },
      { status: 500 }
    )
  }
}
