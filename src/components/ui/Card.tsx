import * as React from 'react';
import { cn } from '@/lib/utils';

/* ==========================================
 * CARD COMPONENTS
 * Design: Elevated surfaces for content grouping
 * Variants: Standard, Interactive, Stat, Alert
 * ========================================== */

/* ==========================================
 * Base Card
 * ========================================== */

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Make card clickable (adds hover effects)
   */
  interactive?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-md border border-border-subtle bg-background-secondary p-6',
          'shadow-1',
          {
            'cursor-pointer transition-all duration-fast hover:border-border-emphasis hover:bg-background-tertiary hover:shadow-2':
              interactive,
          },
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

/* ==========================================
 * Card Header
 * ========================================== */

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Icon to display before title
   */
  icon?: React.ReactNode;

  /**
   * Badge or action to display on the right
   */
  badge?: React.ReactNode;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, icon, badge, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-between gap-4 pb-4', className)}
        {...props}
      >
        <div className="flex items-center gap-3">
          {icon && <span className="flex-shrink-0 text-text-secondary">{icon}</span>}
          <div>{children}</div>
        </div>
        {badge && <div className="flex-shrink-0">{badge}</div>}
      </div>
    );
  }
);
CardHeader.displayName = 'CardHeader';

/* ==========================================
 * Card Title
 * ========================================== */

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn('text-xl font-semibold leading-none tracking-tight text-text-primary', className)}
        {...props}
      />
    );
  }
);
CardTitle.displayName = 'CardTitle';

/* ==========================================
 * Card Description
 * ========================================== */

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p ref={ref} className={cn('mt-1 text-sm text-text-secondary', className)} {...props} />
  );
});
CardDescription.displayName = 'CardDescription';

/* ==========================================
 * Card Content
 * ========================================== */

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn('py-4', className)} {...props} />;
  }
);
CardContent.displayName = 'CardContent';

/* ==========================================
 * Card Footer
 * ========================================== */

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-3 border-t border-border-subtle pt-4', className)}
        {...props}
      />
    );
  }
);
CardFooter.displayName = 'CardFooter';

/* ==========================================
 * Stat Card (for KPIs and metrics)
 * ========================================== */

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Main metric value
   */
  value: string | number;

  /**
   * Metric label
   */
  label: string;

  /**
   * Optional trend indicator (e.g., "+5%", "-2%")
   */
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };

  /**
   * Optional icon
   */
  icon?: React.ReactNode;
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, value, label, trend, icon, ...props }, ref) => {
    return (
      <Card ref={ref} className={cn('p-6', className)} {...props}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-text-secondary">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-text-primary">{value}</p>
            {trend && (
              <p className="mt-2 flex items-center gap-1 text-sm">
                {trend.direction === 'up' && <span className="text-status-success">↑</span>}
                {trend.direction === 'down' && <span className="text-status-error">↓</span>}
                {trend.direction === 'neutral' && <span className="text-text-tertiary">→</span>}
                <span
                  className={cn({
                    'text-status-success': trend.direction === 'up',
                    'text-status-error': trend.direction === 'down',
                    'text-text-tertiary': trend.direction === 'neutral',
                  })}
                >
                  {trend.value}
                </span>
              </p>
            )}
          </div>
          {icon && <div className="flex-shrink-0 text-text-tertiary">{icon}</div>}
        </div>
      </Card>
    );
  }
);
StatCard.displayName = 'StatCard';

/* ==========================================
 * Alert Card (for banners and warnings)
 * ========================================== */

export interface AlertCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Alert type (affects color scheme)
   */
  variant: 'info' | 'success' | 'warning' | 'error';

  /**
   * Alert title
   */
  title?: string;

  /**
   * Show close button
   */
  dismissible?: boolean;

  /**
   * Callback when close button is clicked
   */
  onDismiss?: () => void;
}

const AlertCard = React.forwardRef<HTMLDivElement, AlertCardProps>(
  ({ className, variant, title, dismissible = false, onDismiss, children, ...props }, ref) => {
    const variantStyles = {
      info: 'bg-status-info-bg border-status-info-border text-text-primary',
      success: 'bg-status-success-bg border-status-success-border text-text-primary',
      warning: 'bg-status-warning-bg border-status-warning-border text-text-primary',
      error: 'bg-status-error-bg border-status-error-border text-text-primary',
    };

    const iconMap = {
      info: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      success: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      warning: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
      error: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-md border-l-4 p-4',
          variantStyles[variant],
          className
        )}
        role="alert"
        {...props}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">{iconMap[variant]}</div>
          <div className="flex-1">
            {title && <h4 className="mb-1 font-semibold">{title}</h4>}
            <div className="text-sm">{children}</div>
          </div>
          {dismissible && onDismiss && (
            <button
              onClick={onDismiss}
              className="flex-shrink-0 rounded-sm p-1 hover:bg-background-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              aria-label="Dismiss alert"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }
);
AlertCard.displayName = 'AlertCard';

/* ==========================================
 * Exports
 * ========================================== */

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, StatCard, AlertCard };
