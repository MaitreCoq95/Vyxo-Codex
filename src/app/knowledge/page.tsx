'use client';

import * as React from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, Button, Badge, Input } from '@/components/ui';

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const categories = ['All', 'Safety', 'Operations', 'Equipment', 'Compliance', 'Legal'];

  const articles = [
    {
      id: 1,
      title: 'Fire Extinguisher Usage',
      category: 'Safety',
      description: 'Step-by-step guide on proper fire extinguisher operation and safety protocols.',
      updated: '2 days ago',
      readTime: '6 min read',
      views: 856,
      critical: true,
    },
    {
      id: 2,
      title: 'Loading Dock Safety Checklist',
      category: 'Safety',
      description: 'Comprehensive checklist for safe loading dock operations and hazard prevention.',
      updated: '1 week ago',
      readTime: '4 min read',
      views: 723,
      critical: false,
    },
    {
      id: 3,
      title: 'Customer Complaint Handling',
      category: 'Operations',
      description: 'Best practices for professional customer service and complaint resolution.',
      updated: '3 weeks ago',
      readTime: '8 min read',
      views: 601,
      critical: false,
    },
    {
      id: 4,
      title: 'Hazmat Handling Procedures (ADR 2025)',
      category: 'Compliance',
      description: 'Updated regulations and procedures for hazardous materials transportation.',
      updated: '2 days ago',
      readTime: '12 min read',
      views: 234,
      critical: true,
    },
  ];

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardShell role="operator" user={{ name: 'User', email: 'user@company.com' }}>
      <PageHeader
        title="Knowledge Base"
        description="Search procedures, guides, and best practices"
      />

      <div className="space-y-6 p-4 mobile:p-6">
        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <Input
              placeholder="Search knowledge base..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftAddon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </CardContent>
        </Card>

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

        {/* Articles */}
        <div className="space-y-4">
          {filteredArticles.map((article) => (
            <Card key={article.id} interactive>
              <CardContent className="py-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-accent-primary/10 text-accent-primary">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-text-primary">{article.title}</h3>
                          {article.critical && (
                            <Badge variant="error" size="sm">Critical</Badge>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-text-secondary">{article.description}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-text-tertiary">
                      <Badge variant="neutral" size="sm">{article.category}</Badge>
                      <span>Updated {article.updated}</span>
                      <span>⏱️ {article.readTime}</span>
                      <span>👁️ {article.views} views</span>
                    </div>
                  </div>

                  <Button size="sm" variant="ghost">
                    Read →
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty state */}
        {filteredArticles.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-background-tertiary">
                <svg className="h-8 w-8 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold text-text-primary">No articles found</h3>
              <p className="text-sm text-text-secondary">Try adjusting your search or category filter</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}
