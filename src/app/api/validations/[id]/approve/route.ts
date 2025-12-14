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
    const { validity_years, notes } = body;

    // Calculate expiry date
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + validity_years);

    // Update validation status
    const { data: validation, error } = await supabase
      .from('practical_validations')
      .update({
        validation_status: 'approved',
        validator_id: user.id,
        validator_notes: notes || null,
        validated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select('module_id, user_id')
      .single();

    if (error) {
      console.error('Validation update error:', error);
      return NextResponse.json({ error: 'Failed to approve validation' }, { status: 500 });
    }

    // Update or create user_progress
    const { error: progressError } = await supabase
      .from('user_progress')
      .upsert({
        user_id: validation.user_id,
        module_id: validation.module_id,
        status: 'completed',
        score: 100,
        updated_at: new Date().toISOString(),
      });

    if (progressError) {
      console.error('Progress update error:', progressError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
