'use client';

import * as React from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent, StatCard, Button } from '@/components/ui';

export default function DirectorAnalyticsPage() {
  const user = { name: 'Director', email: 'director@company.com', notificationCount: 8 };

  return (
    <DashboardShell role="director" user={user}>
      <PageHeader
        title="Analytics & Insights"
        description="Data-driven insights and performance trends"
        breadcrumbs={[{ label: 'Director', href: '/director/dashboard' }, { label: 'Analytics' }]}
        actions={
          <div className="flex gap-2">
            <Button variant="secondary">Last 30 days</Button>
            <Button variant="secondary">Export Data</Button>
          </div>
        }
      />

      <div className="space-y-6 p-4 mobile:p-6">
        <div className="grid gap-4 mobile:grid-cols-2 desktop:grid-cols-4">
          <StatCard value="2,450" label="Total XP Earned" trend={{ value: '+12%', direction: 'up' }} />
          <StatCard value="89" label="Modules Completed" trend={{ value: '+8', direction: 'up' }} />
          <StatCard value="156" label="Skills Validated" trend={{ value: '+23', direction: 'up' }} />
          <StatCard value="94%" label="Engagement Rate" trend={{ value: '+3%', direction: 'up' }} />
        </div>

        <div className="grid gap-4 desktop:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Learning Activity Trends</CardTitle>
            </CardHeader>
            <CardContent className="flex h-64 items-center justify-center bg-background-tertiary">
              <p className="text-sm text-text-tertiary">[Line Chart: Module completions over time]</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skill Coverage by Category</CardTitle>
            </CardHeader>
            <CardContent className="flex h-64 items-center justify-center bg-background-tertiary">
              <p className="text-sm text-text-tertiary">[Bar Chart: Skills by category]</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent className="flex h-64 items-center justify-center bg-background-tertiary">
              <p className="text-sm text-text-tertiary">[Radar Chart: Teams comparison]</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Completion Rate by Module</CardTitle>
            </CardHeader>
            <CardContent className="flex h-64 items-center justify-center bg-background-tertiary">
              <p className="text-sm text-text-tertiary">[Horizontal Bar Chart: Modules]</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
