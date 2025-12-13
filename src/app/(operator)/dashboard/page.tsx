'use client';

import * as React from 'react';
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

export default function OperatorDashboardPage() {
  // Mock data (replace with actual data fetching)
  const user = {
    name: 'John Doe',
    email: 'john.doe@company.com',
    notificationCount: 2,
  };

  const priorityActions = [
    {
      id: 1,
      type: 'warning' as const,
      title: 'Complete "Hazmat Basics" Module',
      description: 'Due in 3 days',
      action: 'Continue →',
    },
    {
      id: 2,
      type: 'info' as const,
      title: 'Validate forklift skill with manager',
      description: 'Sarah Mills awaiting your evidence',
      action: 'Upload →',
    },
  ];

  const learningProgress = [
    {
      id: 1,
      title: 'Fire Safety Procedures',
      progress: 75,
      current: 6,
      total: 8,
    },
    {
      id: 2,
      title: 'Loading Dock Operations',
      progress: 40,
      current: 2,
      total: 5,
    },
  ];

  const weekStats = {
    modulesCompleted: 2,
    xpEarned: 150,
    streak: 5,
  };

  return (
    <DashboardShell role="operator" user={user}>
      <PageHeader
        title={`Hello, ${user.name.split(' ')[0]}`}
        description="Here's what needs your attention today"
      />

      <div className="space-y-6 p-4 mobile:p-6">
        {/* Priority Actions */}
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
                  <Button size="sm" variant="ghost">
                    {action.action}
                  </Button>
                </div>
              </AlertCard>
            ))}
          </div>
        </section>

        {/* Learning in Progress */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-text-primary">
            <span>📚</span>
            <span>Learning in Progress</span>
          </h2>
          <div className="space-y-4">
            {learningProgress.map((module) => (
              <Card key={module.id}>
                <CardHeader>
                  <CardTitle>{module.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ProgressBar
                    value={module.progress}
                    fraction={{ current: module.current, total: module.total }}
                    showLabel
                    labelPosition="above"
                  />
                  <Button fullWidth variant="primary">
                    Continue Module →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

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
