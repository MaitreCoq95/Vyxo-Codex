import * as React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/infrastructure/supabase/server';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { ValidationsClient } from './ValidationsClient';

/* ==========================================
 * MANAGER VALIDATIONS PAGE
 * Skill validation workflow
 * ========================================== */

async function getValidationRequests(teamId: string) {
  const supabase = createClient();

  // Get team member IDs
  const { data: teamMembers } = await supabase
    .from('profiles')
    .select('id')
    .eq('team_id', teamId);

  const memberIds = (teamMembers || []).map(m => m.id);

  if (memberIds.length === 0) {
    return [];
  }

  // Fetch pending practical validations for team members
  const { data: validations } = await supabase
    .from('practical_validations')
    .select(`
      id,
      user_id,
      module_id,
      type,
      file_url,
      metadata,
      validation_status,
      created_at,
      user:profiles!practical_validations_user_id_fkey (
        full_name,
        email
      ),
      module:modules (
        title
      )
    `)
    .in('user_id', memberIds)
    .eq('validation_status', 'pending')
    .order('created_at', { ascending: false });

  return validations || [];
}

export default async function ManagerValidationsPage() {
  const supabase = createClient();

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get manager profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('team_id')
    .eq('id', user.id)
    .single();

  if (!profile || !profile.team_id) {
    redirect('/manager/overview');
  }

  const validations = await getValidationRequests(profile.team_id);

  return (
    <DashboardShell role="manager">
      <PageHeader
        title="Skill Validations"
        description="Review and approve skill validation requests"
        breadcrumbs={[
          { label: 'Manager', href: '/manager/overview' },
          { label: 'Validations' },
        ]}
      />

      <ValidationsClient validations={validations} />
    </DashboardShell>
  );
}
