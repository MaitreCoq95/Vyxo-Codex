

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateGammaSlide, buildGammaPrompt } from '@/lib/vyxhunter/gamma'

export const dynamic = 'force-dynamic'

const DEMO_ORG_ID = '00000000-0000-0000-0000-000000000001'

/**
 * POST /api/vyxhunter/companies/[id]/gamma
 * Generate Gamma presentation slide for a company
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let newGammaSlide: any = null; // Declare newGammaSlide outside try block
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  try {
    const { id } = await params
    console.log('📊 Generating Gamma slide for company:', id)

    // Parse customization options from request body
    const body = await request.json().catch(() => ({}))
    const customizationOptions = {
      tone: body.tone,
      audience: body.audience,
      imageStyle: body.imageStyle,
      imageInstructions: body.imageInstructions,
      numSlides: body.numSlides
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

    // Build Gamma prompt with full analysis data
    const gammaPrompt = buildGammaPrompt(
      company.name,
      company.sector || 'Business',
      {
        mainPain: analysis.pains?.[0] || analysis.main_pain || 'Optimisation des process',
        solution: analysis.entry_angle || analysis.solution || 'Excellence opérationnelle',
        quickWins: analysis.quick_wins || ['Gain de temps', 'Réduction erreurs', 'Clarté process'],
        pains: analysis.pains,
        opportunities: analysis.opportunities,
        relevance_score: analysis.relevance_score,
        business_summary: analysis.business_summary
      }
    )

    // Generate Gamma slide with customization options
    const gammaResult = await generateGammaSlide(gammaPrompt, customizationOptions)

    // Save to database
    const { data: slideData, error: gammaError } = await supabase // Assign to slideData first
      .from('vch_vyxhunter_gamma_slides')
      .insert([{
        organization_id: DEMO_ORG_ID,
        company_id: id,
        analysis_id: analysis.id,
        gamma_slide_id: gammaResult.slideId,
        gamma_url: gammaResult.url,
        gamma_prompt: gammaPrompt,
        status: gammaResult.status,
        error_message: gammaResult.error
      }])
      .select()
      .single()
    
    newGammaSlide = slideData; // Assign to newGammaSlide after successful insert

    if (gammaError) throw gammaError

    // Create interaction record
    await supabase.from('vch_vyxhunter_interactions').insert([{
      organization_id: DEMO_ORG_ID,
      company_id: id,
      type: 'gamma_generated',
      details: { 
        gamma_url: gammaResult.url,
        status: gammaResult.status
      }
    }])

    console.log('✅ Gamma slide generated:', newGammaSlide.id)

    return NextResponse.json({ 
      success: true,
      gammaSlide: newGammaSlide 
    })
  } catch (error: any) {
    console.error('💥 Error generating Gamma slide:', error)
    
    // Update slide status to failed with error message
    if (newGammaSlide?.id) {
      await supabase
        .from('vch_vyxhunter_gamma_slides')
        .update({ 
          status: 'failed',
          error_message: error.message || 'Unknown error'
        })
        .eq('id', newGammaSlide.id)
    }

    return NextResponse.json(
      { error: 'Failed to generate Gamma slide', details: error.message },
      { status: 500 }
    )
  }
}
