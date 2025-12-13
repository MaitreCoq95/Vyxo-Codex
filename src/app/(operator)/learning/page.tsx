'use client';

import * as React from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  ProgressBar,
  Button,
  Badge,
  StatusBadge,
} from '@/components/ui';

/* ==========================================
 * OPERATOR LEARNING PAGE
 * All learning modules and progress
 * ========================================== */

export default function OperatorLearningPage() {
  const user = {
    name: 'John Doe',
    email: 'john.doe@company.com',
    notificationCount: 2,
  };

  const modules = [
    {
      id: 1,
      title: 'Fire Safety Procedures',
      category: 'Safety',
      difficulty: 2,
      progress: 75,
      current: 6,
      total: 8,
      timeRemaining: '15 min',
      status: 'in-progress' as const,
    },
    {
      id: 2,
      title: 'Loading Dock Operations',
      category: 'Operations',
      difficulty: 1,
      progress: 40,
      current: 2,
      total: 5,
      timeRemaining: '25 min',
      status: 'in-progress' as const,
    },
    {
      id: 3,
      title: 'Hazmat Basics',
      category: 'Safety',
      difficulty: 3,
      progress: 0,
      current: 0,
      total: 10,
      timeRemaining: '45 min',
      status: 'pending' as const,
      dueDate: 'Due in 3 days',
    },
    {
      id: 4,
      title: 'Forklift Certification Renewal',
      category: 'Equipment',
      difficulty: 2,
      progress: 100,
      current: 12,
      total: 12,
      status: 'validated' as const,
      completedDate: 'Completed 2 weeks ago',
    },
  ];

  const categories = ['All', 'Safety', 'Operations', 'Equipment', 'Compliance'];
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredModules =
    selectedCategory === 'All'
      ? modules
      : modules.filter((m) => m.category === selectedCategory);

  return (
    <DashboardShell role="operator" user={user}>
      <PageHeader
        title="My Learning"
        description="Track your progress and complete required modules"
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Learning' }]}
      />

      <div className="space-y-6 p-4 mobile:p-6">
        {/* Category filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              size="sm"
              variant={selectedCategory === category ? 'primary' : 'secondary'}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Modules list */}
        <div className="space-y-4">
          {filteredModules.map((module) => (
            <Card key={module.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle>{module.title}</CardTitle>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge variant="neutral" size="sm">
                        {module.category}
                      </Badge>
                      <Badge variant="neutral" size="sm">
                        {Array(module.difficulty)
                          .fill('⭐')
                          .join('')}
                      </Badge>
                      {module.timeRemaining && (
                        <Badge variant="neutral" size="sm">
                          ⏱️ {module.timeRemaining}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <StatusBadge status={module.status} />
                </div>
              </CardHeader>

              <CardContent>
                {module.status !== 'validated' ? (
                  <>
                    <ProgressBar
                      value={module.progress}
                      fraction={{ current: module.current, total: module.total }}
                      showLabel
                      labelPosition="above"
                      variant={module.status === 'pending' && module.dueDate ? 'warning' : 'default'}
                    />
                    {module.dueDate && (
                      <p className="mt-2 text-sm text-status-warning">⚠️ {module.dueDate}</p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-text-secondary">✓ {module.completedDate}</p>
                )}
              </CardContent>

              <CardFooter>
                {module.status === 'validated' ? (
                  <Button variant="secondary" fullWidth>
                    View Certificate
                  </Button>
                ) : module.status === 'in-progress' ? (
                  <Button variant="primary" fullWidth>
                    Continue Module →
                  </Button>
                ) : (
                  <Button variant="primary" fullWidth>
                    Start Module →
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Empty state */}
        {filteredModules.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-background-tertiary">
                <svg
                  className="h-8 w-8 text-text-tertiary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold text-text-primary">No modules found</h3>
              <p className="text-sm text-text-secondary">
                Try selecting a different category
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}
