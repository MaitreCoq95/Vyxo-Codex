import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'



export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  try {
    console.log('👥 Fetching clients from Supabase...')

    const { data: clients, error } = await supabase
      .from('vch_clients')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Clients error:', error)
      throw error
    }

    console.log('✅ Clients fetched:', clients?.length || 0)

    return NextResponse.json({ clients })
  } catch (error) {
    console.error('💥 Error fetching clients:', error)
    return NextResponse.json(
      { error: 'Failed to fetch clients', details: error },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  try {
    const body = await request.json()
    console.log('📝 Creating new client:', body)

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    // Prepare client data
    const clientData = {
      organization_id: '00000000-0000-0000-0000-000000000001', // Demo Org ID
      name: body.name,
      sector: body.sector,
      status: body.status || 'lead',
      city: body.city,
      contact_email: body.email,
      contact_phone: body.phone,
      logo_url: body.logo
    }

    const { data: newClient, error } = await supabase
      .from('vch_clients')
      .insert([clientData])
      .select()
      .single()

    if (error) {
      console.error('❌ Create client error:', error)
      throw error
    }

    console.log('✅ Client created:', newClient)

    return NextResponse.json({ client: newClient })
  } catch (error) {
    console.error('💥 Error creating client:', error)
    return NextResponse.json(
      { error: 'Failed to create client', details: error },
      { status: 500 }
    )
  }
}
