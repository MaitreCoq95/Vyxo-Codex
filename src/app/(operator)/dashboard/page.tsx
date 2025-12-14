import * as React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/infrastructure/supabase/server';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  AlertCard,
  StatCard,
  ProgressBar,
  Button,
  Badge,
} from '@/components/ui';

/* ==========================================
 * OPERATOR DASHBOARD
 * Home page for field operators
 * Design: Action-first, minimal text, clear priorities
 * ========================================== */

async function getOperatorDashboardData(userId: string) {
  const supabase = createClient();

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  // Fetch in-progress modules
  const { data: inProgressModules } = await supabase
    .from('user_progress')
    .select(`
      id,
      score,
      status,
      module:modules (
        id,
        title,
        total_questions
      )
    `)
    .eq('user_id', userId)
    .eq('status', 'in_progress')
    .limit(3)
    .order('updated_at', { ascending: false });

  // Fetch pending practical validations
  const { data: pendingValidations } = await supabase
    .from('practical_validations')
    .select(`
      id,
      type,
      validation_status,
      module:modules (
        id,
        title
      )
    `)
    .eq('user_id', userId)
    .eq('validation_status', 'pending')
    .limit(2);

  // Calculate weekly stats (last 7 days)
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const { data: weeklyCompletions, count: weeklyCount } = await supabase
    .from('user_progress')
    .select('id', { count: 'exact' })
    .eq('user_id', userId)
    .eq('status', 'completed')
    .gte('updated_at', weekAgo.toISOString());

  // Calculate XP from XP events (if you have an xp_events table)
  // For now, use a simple calculation based on completions
  const weeklyXP = (weeklyCount || 0) * 50; // 50 XP per module

  return {
    profile,
    inProgressModules: inProgressModules || [],
    pendingValidations: pendingValidations || [],
    weekStats: {
      modulesCompleted: weeklyCount || 0,
      xpEarned: weeklyXP,
      streak: profile?.current_streak || 0,
    },
  };
}

export default async function OperatorDashboardPage() {
  const supabase = createClient();

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch all data
  const { profile, inProgressModules, pendingValidations, weekStats } =
    await getOperatorDashboardData(user.id);

  if (!profile) {
    redirect('/setup');
  }

  // Build priority actions from real data
  const priorityActions: Array<{
    id: string | number;
    type: 'warning' | 'info' | 'error';
    title: string;
    description: string;
    action: string;
    href?: string;
  }> = [];

  // Add pending validations
  pendingValidations.forEach((validation) => {
    priorityActions.push({
      id: validation.id,
      type: 'info',
      title: `Upload evidence for "${validation.module?.title}"`,
      description: 'Awaiting manager validation',
      action: 'Upload →',
      href: `/learning/${validation.module?.id}/validate`,
    });
  });

  // Add in-progress modules that are close to completion
  inProgressModules.forEach((progress) => {
    if (progress.score >= 60) {
      priorityActions.push({
        id: progress.id,
        type: 'warning',
        title: `Complete "${progress.module?.title}" Module`,
        description: `${progress.score}% complete - almost there!`,
        action: 'Continue →',
        href: `/learning/${progress.module?.id}`,
      });
    }
  });

  return (
    <DashboardShell role="operator">
      <PageHeader
        title={`Hello, ${profile.full_name.split(' ')[0]}`}
        description="Here's what needs your attention today"
      />

      <div className="space-y-6 p-4 mobile:p-6">
        {/* Priority Actions */}
        {priorityActions.length > 0 && (
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-text-primary">
              <span>🎯</span>
              <span>Your Priority Actions</span>
            </h2>
            <div className="space-y-3">
              {priorityActions.map((action) => (
                <AlertCard
                  key={action.id}
                  variant={action.type}
                  title={action.title}
                  dismissible={false}
                >
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-sm">{action.description}</p>
                    {action.href ? (
                      <Link href={action.href}>
                        <Button size="sm" variant="ghost">
                          {action.action}
                        </Button>
                      </Link>
                    ) : (
                      <Button size="sm" variant="ghost">
                        {action.action}
                      </Button>
                    )}
                  </div>
                </AlertCard>
              ))}
            </div>
          </section>
        )}

        {/* Learning in Progress */}
        {inProgressModules.length > 0 && (
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-text-primary">
              <span>📚</span>
              <span>Learning in Progress</span>
            </h2>
            <div className="space-y-4">
              {inProgressModules.map((progress) => (
                <Card key={progress.id}>
                  <CardHeader>
                    <CardTitle>{progress.module?.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ProgressBar
                      value={progress.score}
                      fraction={{
                        current: Math.round((progress.score / 100) * (progress.module?.total_questions || 0)),
                        total: progress.module?.total_questions || 0,
                      }}
                      showLabel
                      labelPosition="above"
                    />
                    <Link href={`/learning/${progress.module?.id}`}>
                      <Button fullWidth variant="primary">
                        Continue Module →
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Weekly Progress */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-text-primary">
            <span>🏆</span>
            <span>Your Progress This Week</span>
          </h2>
          <div className="grid gap-4 mobile:grid-cols-3">
            <StatCard
              value={weekStats.modulesCompleted}
              label="Modules Completed"
              trend={{ value: '+2', direction: 'up' }}
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            />
            <StatCard
              value={`${weekStats.xpEarned} XP`}
              label="XP Earned"
              trend={{ value: '+50', direction: 'up' }}
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              }
            />
            <StatCard
              value={
                <div className="flex items-center gap-1">
                  <span>{weekStats.streak}-day</span>
                  <span className="text-2xl">🔥</span>
                </div>
              }
              label="Learning Streak"
              trend={{ value: 'Keep it up!', direction: 'neutral' }}
            />
          </div>
        </section>

        {/* Quick Access */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-text-primary">Quick Access</h2>
          <div className="grid gap-4 mobile:grid-cols-2">
            <Card interactive>
              <CardContent className="flex items-center gap-4 py-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-accent-primary/10 text-accent-primary">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">Browse Knowledge Base</h3>
                  <p className="text-sm text-text-secondary">Search procedures and guides</p>
                </div>
              </CardContent>
            </Card>

            <Card interactive>
              <CardContent className="flex items-center gap-4 py-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-status-success/10 text-status-success">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">My Skills Matrix</h3>
                  <p className="text-sm text-text-secondary">View validated skills</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
