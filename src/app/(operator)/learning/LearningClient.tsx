'use client';

import * as React from 'react';
import Link from 'next/link';
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

interface Module {
  id: string;
  title: string;
  category: string;
  difficulty: number;
  total_questions: number;
  estimated_duration_minutes: number;
  progress?: {
    id: string;
    score: number;
    status: 'in_progress' | 'completed';
    updated_at: string;
  } | null;
}

interface LearningClientProps {
  modules: Module[];
  categories: string[];
}

export function LearningClient({ modules, categories }: LearningClientProps) {
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredModules =
    selectedCategory === 'All'
      ? modules
      : modules.filter((m) => m.category === selectedCategory);

  return (
    <div className="space-y-6 p-4 mobile:p-6">
      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['All', ...categories].map((category) => (
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
        {filteredModules.map((module) => {
          const progress = module.progress;
          const status = progress
            ? progress.status === 'completed'
              ? 'validated'
              : 'in-progress'
            : 'pending';
          const progressValue = progress?.score || 0;
          const current = Math.round((progressValue / 100) * module.total_questions);

          return (
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
                      <Badge variant="neutral" size="sm">
                        ⏱️ {module.estimated_duration_minutes} min
                      </Badge>
                    </div>
                  </div>
                  <StatusBadge status={status as 'pending' | 'in-progress' | 'validated'} />
                </div>
              </CardHeader>

              <CardContent>
                {status !== 'validated' ? (
                  <ProgressBar
                    value={progressValue}
                    fraction={{ current, total: module.total_questions }}
                    showLabel
                    labelPosition="above"
                    variant={status === 'pending' ? 'warning' : 'default'}
                  />
                ) : (
                  <p className="text-sm text-text-secondary">
                    ✓ Completed {progress ? new Date(progress.updated_at).toLocaleDateString() : ''}
                  </p>
                )}
              </CardContent>

              <CardFooter>
                {status === 'validated' ? (
                  <Link href={`/learning/${module.id}/certificate`}>
                    <Button variant="secondary" fullWidth>
                      View Certificate
                    </Button>
                  </Link>
                ) : status === 'in-progress' ? (
                  <Link href={`/learning/${module.id}`}>
                    <Button variant="primary" fullWidth>
                      Continue Module →
                    </Button>
                  </Link>
                ) : (
                  <Link href={`/learning/${module.id}`}>
                    <Button variant="primary" fullWidth>
                      Start Module →
                    </Button>
                  </Link>
                )}
              </CardFooter>
            </Card>
          );
        })}
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
            <p className="text-sm text-text-secondary">Try selecting a different category</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
