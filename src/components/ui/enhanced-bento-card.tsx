'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/use-theme';
import { LucideIcon } from 'lucide-react';

interface EnhancedBentoCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  gradient?: boolean;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function EnhancedBentoCard({
  title,
  description,
  icon: Icon,
  iconColor = 'primary',
  gradient = false,
  children,
  action,
  className,
  hover = true,
  onClick,
}: EnhancedBentoCardProps) {
  const { themeConfig } = useTheme();

  const iconColorClass = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger',
  }[iconColor];

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-card border border-border rounded-[var(--radius)] overflow-hidden',
        'transition-all duration-200',
        hover && 'hover:bg-card-hover hover:shadow-lg hover:border-primary/20',
        onClick && 'cursor-pointer',
        gradient && 'relative overflow-hidden',
        className
      )}
    >
      {/* Gradient Background (optional) */}
      {gradient && (
        <div className={cn(
          'absolute inset-0 opacity-5',
          `bg-gradient-to-br ${themeConfig.gradients.primary}`
        )} />
      )}

      {/* Content */}
      <div className="relative p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            {Icon && (
              <div className={cn(
                'p-2 rounded-lg bg-muted',
                iconColorClass
              )}>
                <Icon className="w-5 h-5" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-lg leading-tight">
                {title}
              </h3>
              {description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>
          {action && (
            <div className="flex-shrink-0">
              {action}
            </div>
          )}
        </div>

        {/* Body */}
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}
