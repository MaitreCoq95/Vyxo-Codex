import * as React from 'react';
import { Breadcrumbs, type BreadcrumbItem } from '@/components/ui';
import { cn } from '@/lib/utils';

/* ==========================================
 * PAGE HEADER
 * Consistent header for all pages
 * ========================================== */

export interface PageHeaderProps {
  /**
   * Page title
   */
  title: string;

  /**
   * Page description
   */
  description?: string;

  /**
   * Breadcrumbs
   */
  breadcrumbs?: BreadcrumbItem[];

  /**
   * Actions (buttons, etc.)
   */
  actions?: React.ReactNode;

  /**
   * Additional class name
   */
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbs,
  actions,
  className,
}) => {
  return (
    <div
      className={cn(
        'border-b border-border-subtle bg-background-secondary px-4 py-6 mobile:px-6',
        className
      )}
    >
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs items={breadcrumbs} className="mb-4" />
      )}

      {/* Title + Actions */}
      <div className="flex flex-col gap-4 mobile:flex-row mobile:items-center mobile:justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-semibold text-text-primary">{title}</h1>
          {description && <p className="mt-2 text-text-secondary">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
};
