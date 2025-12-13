'use client';

import * as React from 'react';
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

export default function DirectorDashboardPage() {
  const user = {
    name: 'Director',
    email: 'director@company.com',
    notificationCount: 8,
  };

  const kpis = [
    { label: 'Total Users', value: 156 },
    { label: 'Active Teams', value: 12 },
    { label: 'Active Modules', value: 45 },
    { label: 'Avg Completion', value: '78%', trend: { value: '+5%', direction: 'up' as const } },
  ];

  const maturity = {
    score: 75,
    pillars: [
      { name: 'Knowledge', score: 82, color: 'text-accent-primary' },
      { name: 'Skills', score: 71, color: 'text-status-success' },
      { name: 'Compliance', score: 88, color: 'text-status-info' },
      { name: 'Culture', score: 65, color: 'text-status-warning' },
    ],
  };

  const alerts = [
    {
      id: 1,
      type: 'error' as const,
      title: '15 critical skills with <50% team coverage',
      description: 'Impacted teams: Logistics North, Warehouse B',
    },
    {
      id: 2,
      type: 'warning' as const,
      title: 'New compliance requirement: ADR Training (deadline: Jan 15)',
      description: '23 users need certification',
    },
  ];

  return (
    <DashboardShell role="director" user={user}>
      <PageHeader
        title="Company Overview"
        description="December 2025"
        actions={<Button variant="secondary">Export PDF</Button>}
      />

      <div className="space-y-6 p-4 mobile:p-6">
        {/* Top KPIs */}
        <div className="grid gap-4 mobile:grid-cols-2 desktop:grid-cols-4">
          {kpis.map((kpi, i) => (
            <StatCard key={i} {...kpi} />
          ))}
        </div>

        {/* Maturity */}
        <Card>
          <CardHeader>
            <CardTitle>Operational Maturity (IMO)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-8 mobile:flex-row mobile:justify-around">
              <div className="text-center">
                <CircularProgress value={maturity.score} size={140} label="IMO" />
                <p className="mt-4 text-sm text-text-secondary">
                  Current Score: {maturity.score}/100
                </p>
                <p className="text-sm text-status-success">↑ +10 pts YoY</p>
              </div>

              <div className="flex-1 space-y-4">
                {maturity.pillars.map((pillar) => (
                  <div key={pillar.name}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium text-text-primary">{pillar.name}</span>
                      <span className="text-sm font-semibold text-text-primary">
                        {pillar.score}/100
                      </span>
                    </div>
                    <ProgressBar value={pillar.score} variant="default" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Strategic Alerts */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-text-primary">⚠️ Strategic Alerts</h2>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <AlertCard key={alert.id} variant={alert.type} title={alert.title}>
                <p className="mt-2 text-sm">{alert.description}</p>
                <Button size="sm" variant="ghost" className="mt-3">
                  View Details →
                </Button>
              </AlertCard>
            ))}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
