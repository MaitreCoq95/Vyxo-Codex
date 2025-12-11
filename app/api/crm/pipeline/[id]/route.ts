import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'



export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  try {
    const { id } = await params
    const body = await request.json()
    console.log('📝 Updating engagement:', id, body)

    const { data: updatedEngagement, error } = await supabase
      .from('vch_engagements')
      .update({
        status: body.status,
        // Add other fields here if needed (e.g., budget, timeline)
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('❌ Update engagement error:', error)
      throw error
    }

    console.log('✅ Engagement updated:', updatedEngagement)

    return NextResponse.json({ engagement: updatedEngagement })
  } catch (error) {
    console.error('💥 Error updating engagement:', error)
    return NextResponse.json(
      { error: 'Failed to update engagement', details: error },
      { status: 500 }
    )
  }
}
