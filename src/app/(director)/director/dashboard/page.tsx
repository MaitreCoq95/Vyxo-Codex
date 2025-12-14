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
  CircularProgress,
  ProgressBar,
  Button,
} from '@/components/ui';

/* ==========================================
 * DIRECTOR DASHBOARD
 * Executive overview with company-wide metrics
 * ========================================== */

async function getDirectorData(companyId: string) {
  const supabase = createClient();

  // Total users count
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('company_id', companyId);

  // Active teams count
  const { count: activeTeams } = await supabase
    .from('teams')
    .select('id', { count: 'exact', head: true })
    .eq('company_id', companyId);

  // Active modules count
  const { count: activeModules } = await supabase
    .from('modules')
    .select('id', { count: 'exact', head: true })
    .eq('company_id', companyId)
    .eq('is_active', true);

  // Average completion rate
  const { data: allProgress } = await supabase
    .from('user_progress')
    .select('score')
    .eq('status', 'completed');

  const avgCompletion = allProgress && allProgress.length > 0
    ? Math.round(allProgress.reduce((sum, p) => sum + (p.score || 0), 0) / allProgress.length)
    : 0;

  // Fetch critical alerts
  const { data: criticalAlerts } = await supabase
    .from('risk_alerts')
    .select('*')
    .eq('status', 'active')
    .in('severity', ['critical', 'high'])
    .limit(2)
    .order('severity', { ascending: false });

  return {
    kpis: {
      totalUsers: totalUsers || 0,
      activeTeams: activeTeams || 0,
      activeModules: activeModules || 0,
      avgCompletion: `${avgCompletion}%`,
    },
    alerts: criticalAlerts || [],
    maturityScore: 75, // TODO: Calculate from maturity algorithm
  };
}

export default async function DirectorDashboardPage() {
  const supabase = createClient();

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get director profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id, role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'director') {
    redirect('/dashboard');
  }

  const { kpis, alerts, maturityScore } = await getDirectorData(profile.company_id);

  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const maturityPillars = [
    { name: 'Knowledge', score: 82 },
    { name: 'Skills', score: 71 },
    { name: 'Compliance', score: 88 },
    { name: 'Culture', score: 65 },
  ];

  return (
    <DashboardShell role="director">
      <PageHeader
        title="Company Overview"
        description={currentMonth}
        actions={<Button variant="secondary">Export PDF</Button>}
      />

      <div className="space-y-6 p-4 mobile:p-6">
        {/* Top KPIs */}
        <div className="grid gap-4 mobile:grid-cols-2 desktop:grid-cols-4">
          <StatCard value={kpis.totalUsers} label="Total Users" />
          <StatCard value={kpis.activeTeams} label="Active Teams" />
          <StatCard value={kpis.activeModules} label="Active Modules" />
          <StatCard
            value={kpis.avgCompletion}
            label="Avg Completion"
            trend={{ value: '+5%', direction: 'up' }}
          />
        </div>

        {/* Maturity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Operational Maturity (IMO)</CardTitle>
              <Link href="/director/maturity">
                <Button size="sm" variant="secondary">
                  View Details →
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-8 mobile:flex-row mobile:justify-around">
              <div className="text-center">
                <CircularProgress value={maturityScore} size={140} label="IMO" />
                <p className="mt-4 text-sm text-text-secondary">
                  Current Score: {maturityScore}/100
                </p>
                <p className="text-sm text-status-success">↑ +10 pts YoY</p>
              </div>

              <div className="flex-1 space-y-4">
                {maturityPillars.map((pillar) => (
                  <div key={pillar.name}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium text-text-primary">{pillar.name}</span>
                      <span className="text-sm font-semibold text-text-primary">
                        {pillar.score}/100
                      </span>
                    </div>
                    <ProgressBar value={pillar.score} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Critical Alerts */}
        {alerts.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-semibold text-text-primary">
              ⚠️ Critical Alerts
            </h2>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  variant={alert.severity === 'critical' ? 'error' : 'warning'}
                  title={alert.title}
                  dismissible={false}
                >
                  <p className="mt-2 text-sm text-text-secondary">{alert.description}</p>
                </AlertCard>
              ))}
            </div>
          </section>
        )}

        {/* Quick Links */}
        <div className="grid gap-4 mobile:grid-cols-2 desktop:grid-cols-3">
          <Link href="/director/organization">
            <Card interactive>
              <CardContent className="py-6">
                <h3 className="font-semibold text-text-primary">Organization</h3>
                <p className="text-sm text-text-secondary">Manage teams and users</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/director/content">
            <Card interactive>
              <CardContent className="py-6">
                <h3 className="font-semibold text-text-primary">Content</h3>
                <p className="text-sm text-text-secondary">Create and manage modules</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/director/analytics">
            <Card interactive>
              <CardContent className="py-6">
                <h3 className="font-semibold text-text-primary">Analytics</h3>
                <p className="text-sm text-text-secondary">Data-driven insights</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </DashboardShell>
  );
}
