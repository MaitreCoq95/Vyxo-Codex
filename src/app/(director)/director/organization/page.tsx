'use client';

import * as React from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, StatCard, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui';

export default function DirectorOrganizationPage() {
  const user = { name: 'Director', email: 'director@company.com', notificationCount: 8 };

  const teams = [
    { id: 1, name: 'Warehouse Team Alpha', manager: 'Sarah Mills', members: 12, avgProgress: 78, alerts: 1 },
    { id: 2, name: 'Logistics North', manager: 'Mike Johnson', members: 15, avgProgress: 65, alerts: 3 },
    { id: 3, name: 'Transport Fleet', manager: 'Emma Wilson', members: 8, avgProgress: 92, alerts: 0 },
  ];

  return (
    <DashboardShell role="director" user={user}>
      <PageHeader
        title="Organization"
        description="Manage teams, users, and organizational structure"
        breadcrumbs={[{ label: 'Director', href: '/director/dashboard' }, { label: 'Organization' }]}
        actions={<Button variant="primary">+ Add Team</Button>}
      />

      <div className="space-y-6 p-4 mobile:p-6">
        <div className="grid gap-4 mobile:grid-cols-3">
          <StatCard value={156} label="Total Users" />
          <StatCard value={12} label="Teams" trend={{ value: '+2', direction: 'up' }} />
          <StatCard value="78%" label="Avg Team Progress" trend={{ value: '+5%', direction: 'up' }} />
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Teams Overview</CardTitle>
              <Button size="sm" variant="secondary">Export</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team Name</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Avg Progress</TableHead>
                  <TableHead>Alerts</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams.map((team) => (
                  <TableRow key={team.id}>
                    <TableCell className="font-medium">{team.name}</TableCell>
                    <TableCell>{team.manager}</TableCell>
                    <TableCell>{team.members}</TableCell>
                    <TableCell>{team.avgProgress}%</TableCell>
                    <TableCell>
                      {team.alerts > 0 ? (
                        <Badge variant="error" size="sm">{team.alerts}</Badge>
                      ) : (
                        <Badge variant="success" size="sm">✓</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost">View →</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
