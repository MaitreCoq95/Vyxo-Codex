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

export default function ManagerOverviewPage() {
  const user = {
    name: 'Sarah Mills',
    email: 'sarah.mills@company.com',
    notificationCount: 5,
  };

  const kpis = [
    {
      label: 'Team Members',
      value: 12,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      label: 'Active Learning',
      value: 8,
      trend: { value: '+2', direction: 'up' as const },
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
    {
      label: 'Pending Validations',
      value: 3,
      trend: { value: 'Action needed', direction: 'neutral' as const },
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      label: 'Alerts',
      value: 1,
      trend: { value: 'Critical', direction: 'down' as const },
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
    },
  ];

  const alerts = [
    {
      id: 1,
      type: 'error' as const,
      title: '2 team members have certifications expiring in 7 days',
      action: 'View Details',
    },
    {
      id: 2,
      type: 'warning' as const,
      title: '3 skill validations awaiting your approval',
      action: 'Review →',
    },
  ];

  const teamProgress = [
    {
      id: 1,
      name: 'John Doe',
      progress: 78,
      skills: '12/15',
      lastActivity: '2 hours ago',
      status: 'active',
    },
    {
      id: 2,
      name: 'Jane Smith',
      progress: 92,
      skills: '14/15',
      lastActivity: '1 hour ago',
      status: 'active',
    },
    {
      id: 3,
      name: 'Mike Chen',
      progress: 62,
      skills: '10/15',
      lastActivity: '1 day ago',
      status: 'warning',
    },
    {
      id: 4,
      name: 'Emma Wilson',
      progress: 85,
      skills: '13/15',
      lastActivity: '3 hours ago',
      status: 'active',
    },
  ];

  return (
    <DashboardShell role="manager" user={user}>
      <PageHeader
        title="Team Overview"
        description="Week of December 11, 2025"
        breadcrumbs={[{ label: 'Manager' }, { label: 'Overview' }]}
        actions={
          <Button variant="secondary">
            Export Report
          </Button>
        }
      />

      <div className="space-y-6 p-4 mobile:p-6">
        {/* KPIs */}
        <div className="grid gap-4 mobile:grid-cols-2 desktop:grid-cols-4">
          {kpis.map((kpi, index) => (
            <StatCard
              key={index}
              value={kpi.value}
              label={kpi.label}
              trend={kpi.trend}
              icon={kpi.icon}
            />
          ))}
        </div>

        {/* Actions Needed */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-text-primary">
            <span>⚠️</span>
            <span>Actions Needed</span>
          </h2>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <AlertCard
                key={alert.id}
                variant={alert.type}
                title={alert.title}
                dismissible={false}
              >
                <div className="mt-2">
                  <Button size="sm" variant="ghost">
                    {alert.action}
                  </Button>
                </div>
              </AlertCard>
            ))}
          </div>
        </section>

        {/* Team Progress */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Team Progress</CardTitle>
              <Button size="sm" variant="secondary">
                View All (12) →
              </Button>
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
                      <Button size="sm" variant="ghost">
                        View →
                      </Button>
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
        </div>
      </div>
    </DashboardShell>
  );
}
