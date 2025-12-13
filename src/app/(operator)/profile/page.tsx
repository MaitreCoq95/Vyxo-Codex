'use client';

import * as React from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  FormField,
  Input,
  Select,
  Button,
  Badge,
  StatusBadge,
  CircularProgress,
} from '@/components/ui';

/* ==========================================
 * OPERATOR PROFILE PAGE
 * User profile, skills, certificates
 * ========================================== */

export default function OperatorProfilePage() {
  const user = {
    name: 'John Doe',
    email: 'john.doe@company.com',
    notificationCount: 2,
  };

  const profileData = {
    fullName: 'John Doe',
    email: 'john.doe@company.com',
    phone: '+33 6 12 34 56 78',
    team: 'Warehouse Team Alpha',
    manager: 'Sarah Mills',
    employeeId: 'EMP-2024-1234',
    joinDate: 'January 15, 2024',
  };

  const skills = [
    {
      id: 1,
      name: 'Forklift Operation - Level 2',
      status: 'validated' as const,
      validatedBy: 'Sarah Mills',
      validatedDate: '2 weeks ago',
      expiryDate: 'December 2025',
    },
    {
      id: 2,
      name: 'Fire Safety Training',
      status: 'validated' as const,
      validatedBy: 'Safety Director',
      validatedDate: '1 month ago',
      expiryDate: 'March 2026',
    },
    {
      id: 3,
      name: 'Loading Dock Safety',
      status: 'pending' as const,
      submittedDate: '3 days ago',
      evidenceUploaded: true,
    },
    {
      id: 4,
      name: 'Hazmat Handling - Basic',
      status: 'expired' as const,
      expiredDate: '2 months ago',
      renewalRequired: true,
    },
  ];

  const overallProgress = {
    xp: 2450,
    level: 8,
    skillsValidated: 12,
    skillsTotal: 15,
    completionRate: 80,
  };

  return (
    <DashboardShell role="operator" user={user}>
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
                value={overallProgress.completionRate}
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
                <p className="text-4xl font-bold text-text-primary">{overallProgress.xp}</p>
                <p className="mt-1 text-sm text-text-secondary">Total XP</p>
                <Badge variant="info" size="sm" className="mt-2">
                  Level {overallProgress.level}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center justify-center py-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-text-primary">
                  {overallProgress.skillsValidated}/{overallProgress.skillsTotal}
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
                <Input value={profileData.fullName} disabled />
              </FormField>

              <FormField label="Email">
                <Input value={profileData.email} type="email" disabled />
              </FormField>

              <FormField label="Phone">
                <Input value={profileData.phone} type="tel" />
              </FormField>

              <FormField label="Employee ID">
                <Input value={profileData.employeeId} disabled />
              </FormField>

              <FormField label="Team">
                <Input value={profileData.team} disabled />
              </FormField>

              <FormField label="Manager">
                <Input value={profileData.manager} disabled />
              </FormField>
            </div>

            <div className="mt-6 flex gap-3">
              <Button variant="primary">Save Changes</Button>
              <Button variant="secondary">Cancel</Button>
            </div>
          </CardContent>
        </Card>

        {/* Skills Matrix */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>My Skills</CardTitle>
              <Button size="sm" variant="secondary">
                Request Validation →
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-start justify-between gap-4 rounded-md border border-border-subtle bg-background-tertiary p-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-text-primary">{skill.name}</h4>
                      <StatusBadge status={skill.status} />
                    </div>

                    <div className="mt-2 space-y-1 text-sm text-text-secondary">
                      {skill.status === 'validated' && (
                        <>
                          <p>✓ Validated by {skill.validatedBy} · {skill.validatedDate}</p>
                          <p>Expires: {skill.expiryDate}</p>
                        </>
                      )}
                      {skill.status === 'pending' && (
                        <p>
                          ⏳ Submitted {skill.submittedDate} · Evidence uploaded
                        </p>
                      )}
                      {skill.status === 'expired' && (
                        <p className="text-status-error">
                          ⚠️ Expired {skill.expiredDate} · Renewal required
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    {skill.status === 'validated' && (
                      <Button size="sm" variant="ghost">
                        View Certificate
                      </Button>
                    )}
                    {skill.status === 'pending' && (
                      <Button size="sm" variant="ghost">
                        View Status
                      </Button>
                    )}
                    {skill.status === 'expired' && (
                      <Button size="sm" variant="primary">
                        Renew Now
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Certificates */}
        <Card>
          <CardHeader>
            <CardTitle>My Certificates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {skills
                .filter((s) => s.status === 'validated')
                .map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between rounded-md border border-border-subtle bg-background-tertiary p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-status-success/10 text-status-success">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{skill.name}</p>
                        <p className="text-sm text-text-secondary">
                          Valid until {skill.expiryDate}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      Download PDF
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
