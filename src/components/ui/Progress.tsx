import * as React from 'react';
import { cn } from '@/lib/utils';

/* ==========================================
 * PROGRESS COMPONENTS
 * Design: Progress bars, badges, and circular indicators
 * Use cases: Module completion, skill levels, maturity scores
 * ========================================== */

/* ==========================================
 * Progress Bar
 * ========================================== */

export interface ProgressBarProps {
  /**
   * Progress value (0-100)
   */
  value: number;

  /**
   * Show percentage label
   */
  showLabel?: boolean;

  /**
   * Show fraction (e.g., "7/9")
   */
  fraction?: {
    current: number;
    total: number;
  };

  /**
   * Progress bar color variant
   */
  variant?: 'default' | 'success' | 'warning' | 'error';

  /**
   * Bar height
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Additional class name
   */
  className?: string;

  /**
   * Label position
   */
  labelPosition?: 'inline' | 'above';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  showLabel = false,
  fraction,
  variant = 'default',
  size = 'md',
  className,
  labelPosition = 'inline',
}) => {
  const percentage = Math.min(Math.max(value, 0), 100);

  const variantColors = {
    default: 'bg-accent-primary',
    success: 'bg-status-success',
    warning: 'bg-status-warning',
    error: 'bg-status-error',
  };

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const label = fraction
    ? `${percentage}% (${fraction.current}/${fraction.total})`
    : `${percentage}%`;

  return (
    <div className={cn('w-full', className)}>
      {/* Label above */}
      {showLabel && labelPosition === 'above' && (
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-text-secondary">Progress</span>
          <span className="text-sm font-semibold text-text-primary">{label}</span>
        </div>
      )}

      {/* Progress bar container */}
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-full bg-background-tertiary',
          sizeClasses[size]
        )}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {/* Progress bar fill */}
        <div
          className={cn(
            'h-full rounded-full transition-all duration-slow',
            variantColors[variant]
          )}
          style={{ width: `${percentage}%` }}
        />

        {/* Inline label */}
        {showLabel && labelPosition === 'inline' && size !== 'sm' && (
          <div className="absolute inset-0 flex items-center justify-end pr-2">
            <span className="text-xs font-semibold text-white drop-shadow-sm">{label}</span>
          </div>
        )}
      </div>
    </div>
  );
};

/* ==========================================
 * Circular Progress
 * ========================================== */

export interface CircularProgressProps {
  /**
   * Progress value (0-100)
   */
  value: number;

  /**
   * Circle size
   */
  size?: number; // in pixels

  /**
   * Stroke width
   */
  strokeWidth?: number;

  /**
   * Show value in center
   */
  showValue?: boolean;

  /**
   * Label to show below value
   */
  label?: string;

  /**
   * Color variant
   */
  variant?: 'default' | 'success' | 'warning' | 'error';

  /**
   * Additional class name
   */
  className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 120,
  strokeWidth = 8,
  showValue = true,
  label,
  variant = 'default',
  className,
}) => {
  const percentage = Math.min(Math.max(value, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const variantColors = {
    default: 'stroke-accent-primary',
    success: 'stroke-status-success',
    warning: 'stroke-status-warning',
    error: 'stroke-status-error',
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--background-tertiary)"
          strokeWidth={strokeWidth}
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn('transition-all duration-slow', variantColors[variant])}
        />
      </svg>

      {/* Center content */}
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-text-primary">{Math.round(percentage)}</span>
          {label && <span className="mt-1 text-xs font-medium text-text-secondary">{label}</span>}
        </div>
      )}
    </div>
  );
};

/* ==========================================
 * Badge
 * ========================================== */

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Badge variant
   */
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'neutral';

  /**
   * Badge size
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Icon to show before text
   */
  icon?: React.ReactNode;

  /**
   * Dot indicator instead of icon
   */
  dot?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', icon, dot, children, ...props }, ref) => {
    const variantStyles = {
      default: 'bg-accent-primary text-white',
      success: 'bg-status-success text-white',
      warning: 'bg-status-warning text-white',
      error: 'bg-status-error text-white',
      info: 'bg-status-info text-white',
      neutral: 'bg-background-tertiary text-text-secondary border border-border-emphasis',
    };

    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
      lg: 'px-4 py-1.5 text-base',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-sm font-medium',
          variantStyles[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </span>
    );
  }
);
Badge.displayName = 'Badge';

/* ==========================================
 * Status Badge (for skill/validation status)
 * ========================================== */

export type StatusType = 'validated' | 'pending' | 'expired' | 'rejected' | 'in-progress';

export interface StatusBadgeProps {
  /**
   * Status type
   */
  status: StatusType;

  /**
   * Custom label (overrides default)
   */
  label?: string;

  /**
   * Additional class name
   */
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, className }) => {
  const statusConfig: Record<
    StatusType,
    { label: string; variant: BadgeProps['variant']; icon: React.ReactNode }
  > = {
    validated: {
      label: 'Validated',
      variant: 'success',
      icon: (
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    pending: {
      label: 'Pending',
      variant: 'warning',
      icon: (
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    expired: {
      label: 'Expired',
      variant: 'error',
      icon: (
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
    },
    rejected: {
      label: 'Rejected',
      variant: 'error',
      icon: (
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    },
    'in-progress': {
      label: 'In Progress',
      variant: 'info',
      icon: (
        <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth={2} />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ),
    },
  };

  const config = statusConfig[status];

  return (
    <Badge
      variant={config.variant}
      size="sm"
      icon={config.icon}
      className={className}
    >
      {label || config.label}
    </Badge>
  );
};

/* ==========================================
 * Loading Spinner
 * ========================================== */

export interface SpinnerProps {
  /**
   * Spinner size
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Additional class name
   */
  className?: string;

  /**
   * Accessible label
   */
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className, label = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={cn('inline-flex items-center justify-center', className)} role="status">
      <svg
        className={cn('animate-spin text-accent-primary', sizeClasses[size])}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-label={label}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
};

/* ==========================================
 * Skeleton Loader
 * ========================================== */

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Skeleton variant
   */
  variant?: 'text' | 'circular' | 'rectangular';

  /**
   * Width (CSS value)
   */
  width?: string | number;

  /**
   * Height (CSS value)
   */
  height?: string | number;
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'text', width, height, style, ...props }, ref) => {
    const variantClasses = {
      text: 'rounded-sm h-4',
      circular: 'rounded-full',
      rectangular: 'rounded-md',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse bg-background-tertiary',
          variantClasses[variant],
          className
        )}
        style={{
          width,
          height: variant === 'text' ? '1rem' : height,
          ...style,
        }}
        {...props}
      />
    );
  }
);
Skeleton.displayName = 'Skeleton';

/* ==========================================
 * Exports
 * ========================================== */

export { ProgressBar, CircularProgress, Badge, StatusBadge, Spinner, Skeleton };
