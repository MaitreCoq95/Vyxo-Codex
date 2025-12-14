'use client';

import * as React from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui';

export default function DirectorContentPage() {
  const user = { name: 'Director', email: 'director@company.com', notificationCount: 8 };

  const modules = [
    { id: 1, title: 'Fire Safety Procedures', category: 'Safety', questions: 12, difficulty: 2, active: true, completions: 145 },
    { id: 2, title: 'Hazmat Handling', category: 'Safety', questions: 18, difficulty: 3, active: true, completions: 89 },
    { id: 3, title: 'Loading Dock Operations', category: 'Operations', questions: 10, difficulty: 1, active: true, completions: 156 },
  ];

  return (
    <DashboardShell role="director" user={user}>
      <PageHeader
        title="Content Management"
        description="Create and manage learning modules and assessments"
        breadcrumbs={[{ label: 'Director', href: '/director/dashboard' }, { label: 'Content' }]}
        actions={<Button variant="primary">+ Create Module</Button>}
      />

      <div className="space-y-6 p-4 mobile:p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Learning Modules</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary">Import</Button>
                <Button size="sm" variant="secondary">Export</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Module Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Completions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modules.map((module) => (
                  <TableRow key={module.id}>
                    <TableCell className="font-medium">{module.title}</TableCell>
                    <TableCell><Badge variant="neutral" size="sm">{module.category}</Badge></TableCell>
                    <TableCell>{module.questions}</TableCell>
                    <TableCell>{Array(module.difficulty).fill('⭐').join('')}</TableCell>
                    <TableCell>{module.completions}</TableCell>
                    <TableCell>
                      <Badge variant={module.active ? 'success' : 'neutral'} size="sm">
                        {module.active ? 'Active' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost">Edit</Button>
                        <Button size="sm" variant="ghost">Questions</Button>
                      </div>
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
