import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const DEMO_ORG_ID = '00000000-0000-0000-0000-000000000001'

export async function GET(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { searchParams } = new URL(request.url)
  const entityId = searchParams.get('entityId')
  const entityType = searchParams.get('entityType')

  let query = supabase
    .from('vch_activities')
    .select('*')
    .order('created_at', { ascending: false })

  if (entityId) query = query.eq('entity_id', entityId)
  if (entityType) query = query.eq('entity_type', entityType)

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const body = await request.json()

  const { data, error } = await supabase
    .from('vch_activities')
    .insert([
      {
        ...body,
        organization_id: DEMO_ORG_ID,
      }
    ])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
