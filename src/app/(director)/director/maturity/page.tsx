'use client';

import * as React from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CircularProgress,
  ProgressBar,
  Button,
  AlertCard,
} from '@/components/ui';

/* ==========================================
 * DIRECTOR MATURITY PAGE
 * Detailed IMO (Indice de Maturité Opérationnelle) analysis
 * ========================================== */

export default function DirectorMaturityPage() {
  const user = {
    name: 'Director',
    email: 'director@company.com',
    notificationCount: 8,
  };

  const maturity = {
    current: 75,
    trend: { previous: 65, change: +10, percentage: '+15%' },
    pillars: [
      {
        name: 'Knowledge Management',
        score: 82,
        strengths: [
          '95% of procedures documented',
          '78% average knowledge base engagement',
        ],
        gaps: [
          '12 procedures outdated (>18 months)',
          'Low engagement on compliance topics',
        ],
      },
      {
        name: 'Skills & Competencies',
        score: 71,
        strengths: [
          '85% of critical skills have >75% coverage',
          'Strong validation process (avg 3-day turnaround)',
        ],
        gaps: [
          '15 critical skills with <50% team coverage',
          '23 skill certifications expiring in next 90 days',
        ],
      },
      {
        name: 'Compliance',
        score: 88,
        strengths: [
          '100% regulatory training completed',
          'All certifications up to date',
        ],
        gaps: [
          'Audit documentation needs improvement',
          'Incident reporting response time',
        ],
      },
      {
        name: 'Organizational Culture',
        score: 65,
        strengths: [
          'High employee engagement (78%)',
          'Strong safety culture',
        ],
        gaps: [
          'Team communication cadence needs improvement',
          'Knowledge sharing between teams limited',
        ],
      },
    ],
    recommendations: [
      {
        priority: 'critical',
        title: 'Address 15 critical skill gaps',
        impact: '+5 pts',
        effort: 'Medium',
      },
      {
        priority: 'high',
        title: 'Update 12 outdated procedures',
        impact: '+3 pts',
        effort: 'Low',
      },
      {
        priority: 'medium',
        title: 'Improve team communication cadence',
        impact: '+2 pts',
        effort: 'Medium',
      },
    ],
  };

  const variantByScore = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 70) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  return (
    <DashboardShell role="director" user={user}>
      <PageHeader
        title="Operational Maturity (IMO)"
        description="Comprehensive maturity assessment and recommendations"
        breadcrumbs={[
          { label: 'Director', href: '/director/dashboard' },
          { label: 'Maturity' },
        ]}
        actions={<Button variant="secondary">Export PDF Report</Button>}
      />

      <div className="space-y-6 p-4 mobile:p-6">
        {/* Current Score */}
        <Card>
          <CardContent className="py-8">
            <div className="flex flex-col items-center gap-8 mobile:flex-row mobile:justify-around">
              <div className="text-center">
                <CircularProgress value={maturity.current} size={160} label="IMO" />
                <p className="mt-4 text-sm text-text-secondary">Current Score: {maturity.current}/100</p>
                <p className="text-sm font-semibold text-status-success">
                  ↑ {maturity.trend.change} pts YoY ({maturity.trend.percentage})
                </p>
              </div>

              <div className="flex-1">
                <h3 className="mb-4 text-lg font-semibold text-text-primary">Score Evolution</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Previous Quarter:</span>
                    <span className="font-semibold text-text-primary">{maturity.trend.previous}/100</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Current:</span>
                    <span className="font-semibold text-text-primary">{maturity.current}/100</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Target (Q2 2026):</span>
                    <span className="font-semibold text-accent-primary">85/100</span>
                  </div>
                </div>
                <ProgressBar
                  value={(maturity.current / 85) * 100}
                  className="mt-4"
                  variant="success"
                />
                <p className="mt-2 text-xs text-text-tertiary">Progress to target: {Math.round((maturity.current / 85) * 100)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Maturity Pillars */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-text-primary">Maturity Pillars</h2>
          <div className="space-y-4">
            {maturity.pillars.map((pillar) => (
              <Card key={pillar.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{pillar.name}</CardTitle>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-text-primary">{pillar.score}</p>
                      <p className="text-xs text-text-tertiary">/100</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ProgressBar value={pillar.score} variant={variantByScore(pillar.score)} />

                  <div className="grid gap-4 mobile:grid-cols-2">
                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-status-success">✓ Strengths</h4>
                      <ul className="space-y-1 text-sm text-text-secondary">
                        {pillar.strengths.map((strength, i) => (
                          <li key={i}>• {strength}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-status-warning">⚠ Gaps</h4>
                      <ul className="space-y-1 text-sm text-text-secondary">
                        {pillar.gaps.map((gap, i) => (
                          <li key={i}>• {gap}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Button size="sm" variant="ghost">
                    View Detailed Report →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>🎯 Recommended Actions to Reach 80/100</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {maturity.recommendations.map((rec, i) => (
              <div
                key={i}
                className="flex items-start justify-between gap-4 rounded-md border border-border-subtle bg-background-tertiary p-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-text-primary">{rec.title}</h4>
                    <span className={`text-xs font-medium ${
                      rec.priority === 'critical' ? 'text-status-error' :
                      rec.priority === 'high' ? 'text-status-warning' :
                      'text-status-info'
                    }`}>
                      {rec.priority.toUpperCase()}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-4 text-sm text-text-secondary">
                    <span>Impact: <strong className="text-status-success">{rec.impact}</strong></span>
                    <span>Effort: {rec.effort}</span>
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  Plan Action
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
