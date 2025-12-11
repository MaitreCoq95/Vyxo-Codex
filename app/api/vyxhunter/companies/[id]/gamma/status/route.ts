import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
import { getGammaSlide } from '@/lib/vyxhunter/gamma'

const DEMO_ORG_ID = '00000000-0000-0000-0000-000000000001'

/**
 * GET /api/vyxhunter/companies/[id]/gamma/status
 * Check status of the latest Gamma slide generation
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  try {
    const { id } = await params
    
    // Fetch latest Gamma slide record
    const { data: slide, error: slideError } = await supabase
      .from('vch_vyxhunter_gamma_slides')
      .select('*')
      .eq('company_id', id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (slideError || !slide) {
      return NextResponse.json({ status: 'none' })
    }

    // If already ready or failed, return as is
    if (slide.status === 'ready' || slide.status === 'failed') {
      return NextResponse.json({ 
        status: slide.status,
        gamma_url: slide.gamma_url,
        error_message: slide.error_message
      })
    }

    // Check status with Gamma API
    const gammaDetails = await getGammaSlide(slide.gamma_slide_id)

    // If status changed to ready, update DB
    if (gammaDetails.status === 'ready' && slide.status !== 'ready') {
      console.log('✅ Gamma generation completed, updating DB...')
      
      const { error: updateError } = await supabase
        .from('vch_vyxhunter_gamma_slides')
        .update({
          status: 'ready',
          gamma_url: gammaDetails.url,
          // If the ID changed (generation ID -> document ID), we could update it, 
          // but keeping the generation ID as reference might be safer unless we have a separate column.
          // For now, we just update the URL and status.
        })
        .eq('id', slide.id)

      if (updateError) console.error('Error updating slide status:', updateError)
      
      return NextResponse.json({
        status: 'ready',
        gamma_url: gammaDetails.url
      })
    }

    return NextResponse.json({
      status: 'generating'
    })

  } catch (error: any) {
    console.error('Error checking Gamma status:', error)
    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    )
  }
}
