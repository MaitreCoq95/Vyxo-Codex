import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/infrastructure/supabase/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request body
    const body = await request.json();
    const { notes } = body;

    // Update validation status
    const { error } = await supabase
      .from('practical_validations')
      .update({
        validation_status: 'rejected',
        validator_id: user.id,
        validator_notes: notes || null,
        validated_at: new Date().toISOString(),
      })
      .eq('id', params.id);

    if (error) {
      console.error('Validation rejection error:', error);
      return NextResponse.json({ error: 'Failed to reject validation' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
