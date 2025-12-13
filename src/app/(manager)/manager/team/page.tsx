'use client';

import * as React from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  MobileTableCard,
  ResponsiveTable,
  ProgressBar,
  Button,
  Badge,
  StatusBadge,
  Input,
  Select,
} from '@/components/ui';

/* ==========================================
 * MANAGER TEAM PAGE
 * Detailed team member list and management
 * ========================================== */

export default function ManagerTeamPage() {
  const user = {
    name: 'Sarah Mills',
    email: 'sarah.mills@company.com',
    notificationCount: 5,
  };

  const teamMembers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: 'Operator',
      progress: 78,
      skills: { validated: 12, total: 15 },
      lastActivity: '2 hours ago',
      status: 'active' as const,
      modules: { completed: 8, inProgress: 2 },
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      role: 'Operator',
      progress: 92,
      skills: { validated: 14, total: 15 },
      lastActivity: '1 hour ago',
      status: 'active' as const,
      modules: { completed: 12, inProgress: 1 },
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike.chen@company.com',
      role: 'Operator',
      progress: 62,
      skills: { validated: 10, total: 15 },
      lastActivity: '1 day ago',
      status: 'pending' as const,
      modules: { completed: 5, inProgress: 3 },
    },
    {
      id: 4,
      name: 'Emma Wilson',
      email: 'emma.wilson@company.com',
      role: 'Operator',
      progress: 85,
      skills: { validated: 13, total: 15 },
      lastActivity: '3 hours ago',
      status: 'active' as const,
      modules: { completed: 10, inProgress: 2 },
    },
  ];

  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('all');

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'active' && member.status === 'active') ||
      (filterStatus === 'pending' && member.status === 'pending');
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardShell role="manager" user={user}>
      <PageHeader
        title="My Team"
        description="Manage and track your team members"
        breadcrumbs={[
          { label: 'Manager', href: '/manager/overview' },
          { label: 'My Team' },
        ]}
        actions={
          <Button variant="primary">
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Member
          </Button>
        }
      />

      <div className="space-y-6 p-4 mobile:p-6">
        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 mobile:flex-row">
              <div className="flex-1">
                <Input
                  placeholder="Search team members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftAddon={
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  }
                />
              </div>
              <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Needs Attention</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Team Members Table/Cards */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Team Members ({filteredMembers.length})</CardTitle>
              <Button size="sm" variant="secondary">
                Export Report
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveTable
              desktopTable={
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Skills</TableHead>
                      <TableHead>Modules</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-text-primary">{member.name}</p>
                            <p className="text-sm text-text-secondary">{member.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <ProgressBar value={member.progress} size="sm" className="w-24" />
                            <span className="text-sm font-medium">{member.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="neutral" size="sm">
                            {member.skills.validated}/{member.skills.total}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <span className="text-text-primary">{member.modules.completed} done</span>
                            <span className="text-text-tertiary"> • </span>
                            <span className="text-text-secondary">{member.modules.inProgress} active</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-text-secondary">{member.lastActivity}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost">
                            View Profile →
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              }
              mobileCards={filteredMembers.map((member) => (
                <MobileTableCard
                  key={member.id}
                  title={member.name}
                  subtitle={member.email}
                  fields={[
                    {
                      label: 'Progress',
                      value: (
                        <div className="flex items-center gap-2">
                          <ProgressBar value={member.progress} size="sm" className="w-16" />
                          <span>{member.progress}%</span>
                        </div>
                      ),
                    },
                    {
                      label: 'Skills',
                      value: `${member.skills.validated}/${member.skills.total}`,
                    },
                    {
                      label: 'Modules',
                      value: `${member.modules.completed} done, ${member.modules.inProgress} active`,
                    },
                    {
                      label: 'Last Activity',
                      value: member.lastActivity,
                    },
                  ]}
                  actions={
                    <Button size="sm" variant="ghost">
                      View
                    </Button>
                  }
                />
              ))}
            />

            {/* Empty state */}
            {filteredMembers.length === 0 && (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-background-tertiary">
                  <svg className="h-8 w-8 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="mb-2 font-semibold text-text-primary">No team members found</h3>
                <p className="text-sm text-text-secondary">Try adjusting your search or filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
