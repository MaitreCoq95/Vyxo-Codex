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
  StatCard,
  AlertCard,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  ProgressBar,
  Button,
  StatusBadge,
} from '@/components/ui';

/* ==========================================
 * MANAGER OVERVIEW PAGE
 * Team dashboard with KPIs and alerts
 * ========================================== */

async function getManagerData(managerId: string, teamId: string) {
  const supabase = createClient();

  // Fetch team members
  const { data: teamMembers, count: teamCount } = await supabase
    .from('profiles')
    .select('id, full_name, last_activity_date', { count: 'exact' })
    .eq('team_id', teamId);

  // Count active learners (users with in_progress modules)
  const { count: activeLearningCount } = await supabase
    .from('user_progress')
    .select('user_id', { count: 'exact', head: true })
    .eq('status', 'in_progress')
    .in('user_id', (teamMembers || []).map(m => m.id));

  // Count pending validations
  const { count: pendingValidationsCount } = await supabase
    .from('practical_validations')
    .select('id', { count: 'exact', head: true })
    .eq('validation_status', 'pending')
    .in('user_id', (teamMembers || []).map(m => m.id));

  // Fetch active risk alerts
  const { data: riskAlerts } = await supabase
    .from('risk_alerts')
    .select('*')
    .eq('team_id', teamId)
    .eq('status', 'active')
    .order('severity', { ascending: false })
    .limit(3);

  // Fetch team progress with detailed stats
  const { data: teamProgress } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      last_activity_date,
      progress:user_progress (
        id,
        score,
        status
      )
    `)
    .eq('team_id', teamId)
    .limit(4)
    .order('last_activity_date', { ascending: false });

  // Calculate individual progress
  const teamProgressWithStats = (teamProgress || []).map((member: any) => {
    const allProgress = member.progress || [];
    const totalScore = allProgress.reduce((sum: number, p: any) => sum + (p.score || 0), 0);
    const avgProgress = allProgress.length > 0 ? Math.round(totalScore / allProgress.length) : 0;
    const completedSkills = allProgress.filter((p: any) => p.status === 'completed').length;
    const totalSkills = allProgress.length;

    return {
      id: member.id,
      name: member.full_name,
      progress: avgProgress,
      skills: `${completedSkills}/${totalSkills}`,
      lastActivity: member.last_activity_date
        ? getRelativeTime(new Date(member.last_activity_date))
        : 'Never',
      status: avgProgress >= 80 ? 'active' : avgProgress >= 50 ? 'warning' : 'error',
    };
  });

  return {
    kpis: {
      teamMembers: teamCount || 0,
      activeLearning: activeLearningCount || 0,
      pendingValidations: pendingValidationsCount || 0,
      alerts: riskAlerts?.length || 0,
    },
    riskAlerts: riskAlerts || [],
    teamProgress: teamProgressWithStats,
  };
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

export default async function ManagerOverviewPage() {
  const supabase = createClient();

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get manager profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('team_id, full_name')
    .eq('id', user.id)
    .single();

  if (!profile || !profile.team_id) {
    redirect('/dashboard');
  }

  const { kpis, riskAlerts, teamProgress } = await getManagerData(user.id, profile.team_id);

  const currentWeek = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <DashboardShell role="manager">
      <PageHeader
        title="Team Overview"
        description={`Week of ${currentWeek}`}
        breadcrumbs={[{ label: 'Manager' }, { label: 'Overview' }]}
        actions={<Button variant="secondary">Export Report</Button>}
      />

      <div className="space-y-6 p-4 mobile:p-6">
        {/* KPIs */}
        <div className="grid gap-4 mobile:grid-cols-2 desktop:grid-cols-4">
          <StatCard
            value={kpis.teamMembers}
            label="Team Members"
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            }
          />
          <StatCard
            value={kpis.activeLearning}
            label="Active Learning"
            trend={{ value: `${kpis.activeLearning} users`, direction: 'up' }}
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            }
          />
          <StatCard
            value={kpis.pendingValidations}
            label="Pending Validations"
            trend={{ value: kpis.pendingValidations > 0 ? 'Action needed' : 'All clear', direction: 'neutral' }}
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
            value={kpis.alerts}
            label="Alerts"
            trend={{
              value: kpis.alerts > 0 ? 'Review needed' : 'No alerts',
              direction: kpis.alerts > 0 ? 'down' : 'up',
            }}
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            }
          />
        </div>

        {/* Actions Needed */}
        {(riskAlerts.length > 0 || kpis.pendingValidations > 0) && (
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-text-primary">
              <span>⚠️</span>
              <span>Actions Needed</span>
            </h2>
            <div className="space-y-3">
              {riskAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  variant={alert.severity === 'critical' ? 'error' : 'warning'}
                  title={alert.title}
                  dismissible={false}
                >
                  <div className="mt-2">
                    <p className="text-sm text-text-secondary">{alert.description}</p>
                    <Link href={`/manager/alerts/${alert.id}`}>
                      <Button size="sm" variant="ghost" className="mt-2">
                        View Details →
                      </Button>
                    </Link>
                  </div>
                </AlertCard>
              ))}
              {kpis.pendingValidations > 0 && (
                <AlertCard variant="warning" title={`${kpis.pendingValidations} skill validations awaiting your approval`} dismissible={false}>
                  <div className="mt-2">
                    <Link href="/manager/validations">
                      <Button size="sm" variant="ghost">
                        Review →
                      </Button>
                    </Link>
                  </div>
                </AlertCard>
              )}
            </div>
          </section>
        )}

        {/* Team Progress */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Team Progress</CardTitle>
              <Link href="/manager/team">
                <Button size="sm" variant="secondary">
                  View All ({kpis.teamMembers}) →
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamProgress.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <ProgressBar value={member.progress} size="sm" className="w-24" />
                        <span className="text-sm">{member.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{member.skills}</TableCell>
                    <TableCell className="text-text-secondary">{member.lastActivity}</TableCell>
                    <TableCell>
                      <Link href={`/manager/team/${member.id}`}>
                        <Button size="sm" variant="ghost">
                          View →
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 mobile:grid-cols-2">
          <Card interactive>
            <CardContent className="flex items-center gap-4 py-6">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-accent-primary/10 text-accent-primary">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">Assign Module</h3>
                <p className="text-sm text-text-secondary">Assign training to team members</p>
              </div>
            </CardContent>
          </Card>

          <Link href="/manager/validations">
            <Card interactive>
              <CardContent className="flex items-center gap-4 py-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-status-success/10 text-status-success">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">Validate Skills</h3>
                  <p className="text-sm text-text-secondary">Review pending validations</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </DashboardShell>
  );
}
