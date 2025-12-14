import * as React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/infrastructure/supabase/server';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  FormField,
  Input,
  Button,
  StatusBadge,
  CircularProgress,
} from '@/components/ui';

/* ==========================================
 * OPERATOR PROFILE PAGE
 * User profile, skills, certificates
 * ========================================== */

async function getProfileData(userId: string) {
  const supabase = createClient();

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select(`
      *,
      team:teams (
        name,
        manager:profiles!teams_manager_id_fkey (
          full_name
        )
      )
    `)
    .eq('id', userId)
    .single();

  // Fetch validated skills
  const { data: validatedSkills } = await supabase
    .from('practical_validations')
    .select(`
      id,
      validated_at,
      module:modules (
        title
      ),
      validator:profiles!practical_validations_validator_id_fkey (
        full_name
      )
    `)
    .eq('user_id', userId)
    .eq('validation_status', 'approved')
    .order('validated_at', { ascending: false });

  // Fetch pending skills
  const { data: pendingSkills } = await supabase
    .from('practical_validations')
    .select(`
      id,
      created_at,
      module:modules (
        title
      )
    `)
    .eq('user_id', userId)
    .eq('validation_status', 'pending');

  // Count total progress
  const { data: allProgress } = await supabase
    .from('user_progress')
    .select('score, status')
    .eq('user_id', userId);

  const completedCount = allProgress?.filter(p => p.status === 'completed').length || 0;
  const totalCount = allProgress?.length || 1;
  const avgScore = allProgress && allProgress.length > 0
    ? Math.round(allProgress.reduce((sum, p) => sum + (p.score || 0), 0) / allProgress.length)
    : 0;

  return {
    profile,
    validatedSkills: validatedSkills || [],
    pendingSkills: pendingSkills || [],
    stats: {
      completionRate: Math.round((completedCount / totalCount) * 100),
      xp: completedCount * 50, // 50 XP per completed module
      level: Math.floor(completedCount / 3) + 1,
      skillsValidated: (validatedSkills?.length || 0),
      skillsTotal: completedCount,
    },
  };
}

export default async function OperatorProfilePage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { profile, validatedSkills, pendingSkills, stats } = await getProfileData(user.id);

  if (!profile) {
    redirect('/setup');
  }

  return (
    <DashboardShell role="operator">
      <PageHeader
        title="My Profile"
        description="Manage your information and track your skills"
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Profile' }]}
      />

      <div className="space-y-6 p-4 mobile:p-6">
        {/* Overview Stats */}
        <div className="grid gap-4 mobile:grid-cols-3">
          <Card>
            <CardContent className="flex flex-col items-center py-6">
              <CircularProgress
                value={stats.completionRate}
                size={100}
                label="Complete"
                variant="default"
              />
              <p className="mt-4 text-sm text-text-secondary">Overall Progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center justify-center py-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-text-primary">{stats.xp}</p>
                <p className="mt-1 text-sm text-text-secondary">Total XP</p>
                <span className="mt-2 inline-block rounded-full bg-accent-primary px-3 py-1 text-xs font-semibold text-white">
                  Level {stats.level}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center justify-center py-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-text-primary">
                  {stats.skillsValidated}/{stats.skillsTotal}
                </p>
                <p className="mt-1 text-sm text-text-secondary">Skills Validated</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-5 mobile:grid-cols-2">
              <FormField label="Full Name">
                <Input value={profile.full_name} disabled />
              </FormField>

              <FormField label="Email">
                <Input value={user.email || ''} type="email" disabled />
              </FormField>

              <FormField label="Team">
                <Input value={profile.team?.name || 'No team assigned'} disabled />
              </FormField>

              <FormField label="Manager">
                <Input value={profile.team?.manager?.full_name || 'No manager'} disabled />
              </FormField>

              <FormField label="Current Streak">
                <Input value={`${profile.current_streak} days`} disabled />
              </FormField>

              <FormField label="Longest Streak">
                <Input value={`${profile.longest_streak} days`} disabled />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* Validated Skills */}
        {validatedSkills.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Validated Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {validatedSkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-start justify-between gap-4 rounded-md border border-border-subtle bg-background-tertiary p-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-text-primary">{skill.module?.title}</h4>
                        <StatusBadge status="validated" />
                      </div>
                      <div className="mt-2 space-y-1 text-sm text-text-secondary">
                        <p>✓ Validated by {skill.validator?.full_name}</p>
                        <p>Date: {new Date(skill.validated_at!).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      View Certificate
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pending Skills */}
        {pendingSkills.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Validations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingSkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-start justify-between gap-4 rounded-md border border-border-subtle bg-background-tertiary p-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-text-primary">{skill.module?.title}</h4>
                        <StatusBadge status="pending" />
                      </div>
                      <p className="mt-2 text-sm text-text-secondary">
                        ⏳ Submitted {new Date(skill.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button size="sm" variant="ghost">
                      View Status
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}
