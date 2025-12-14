import * as React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/infrastructure/supabase/server';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { LearningClient } from './LearningClient';

/* ==========================================
 * OPERATOR LEARNING PAGE
 * All learning modules and progress
 * ========================================== */

async function getLearningData(userId: string, companyId: string) {
  const supabase = createClient();

  // Fetch all modules for this company with user's progress
  const { data: modules } = await supabase
    .from('modules')
    .select(`
      id,
      title,
      category,
      difficulty,
      total_questions,
      estimated_duration_minutes,
      progress:user_progress!left (
        id,
        score,
        status,
        updated_at
      )
    `)
    .eq('company_id', companyId)
    .eq('is_active', true)
    .eq('progress.user_id', userId)
    .order('category', { ascending: true })
    .order('title', { ascending: true });

  // Get unique categories
  const categories = Array.from(new Set((modules || []).map((m) => m.category)));

  return {
    modules: modules || [],
    categories,
  };
}

export default async function OperatorLearningPage() {
  const supabase = createClient();

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get user profile for company_id
  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', user.id)
    .single();

  if (!profile) {
    redirect('/setup');
  }

  const { modules, categories } = await getLearningData(user.id, profile.company_id);

  return (
    <DashboardShell role="operator">
      <PageHeader
        title="My Learning"
        description="Track your progress and complete required modules"
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Learning' }]}
      />

      <LearningClient modules={modules} categories={categories} />
    </DashboardShell>
  );
}
