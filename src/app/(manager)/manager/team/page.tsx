import * as React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/infrastructure/supabase/server';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  Card,
  CardContent,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  ProgressBar,
  Button,
} from '@/components/ui';

/* ==========================================
 * MANAGER TEAM PAGE
 * Detailed team member list and management
 * ========================================== */

async function getTeamData(teamId: string) {
  const supabase = createClient();

  // Fetch team members with their progress
  const { data: teamMembers } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      email,
      last_activity_date,
      progress:user_progress (
        id,
        score,
        status
      )
    `)
    .eq('team_id', teamId)
    .order('full_name', { ascending: true });

  // Process team members data
  const processedMembers = (teamMembers || []).map((member: any) => {
    const allProgress = member.progress || [];
    const completed = allProgress.filter((p: any) => p.status === 'completed').length;
    const inProgress = allProgress.filter((p: any) => p.status === 'in_progress').length;
    const avgScore = allProgress.length > 0
      ? Math.round(allProgress.reduce((sum: number, p: any) => sum + (p.score || 0), 0) / allProgress.length)
      : 0;

    return {
      id: member.id,
      name: member.full_name,
      email: member.email,
      progress: avgScore,
      modulesCompleted: completed,
      modulesInProgress: inProgress,
      lastActivity: member.last_activity_date
        ? getRelativeTime(new Date(member.last_activity_date))
        : 'Never',
    };
  });

  return processedMembers;
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

export default async function ManagerTeamPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('team_id')
    .eq('id', user.id)
    .single();

  if (!profile || !profile.team_id) {
    redirect('/manager/overview');
  }

  const teamMembers = await getTeamData(profile.team_id);

  return (
    <DashboardShell role="manager">
      <PageHeader
        title="My Team"
        description={`${teamMembers.length} team members`}
        breadcrumbs={[
          { label: 'Manager', href: '/manager/overview' },
          { label: 'Team' },
        ]}
      />

      <div className="p-4 mobile:p-6">
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Modules</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell className="text-text-secondary">{member.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <ProgressBar value={member.progress} size="sm" className="w-24" />
                          <span className="text-sm">{member.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{member.modulesCompleted} completed</div>
                          <div className="text-text-tertiary">{member.modulesInProgress} in progress</div>
                        </div>
                      </TableCell>
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
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
