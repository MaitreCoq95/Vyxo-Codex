'use client';

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  color = 'primary',
  className,
}: StatsCardProps) {
  const colorClasses = {
    primary: 'text-primary bg-primary/10',
    secondary: 'text-secondary bg-secondary/10',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
    danger: 'text-danger bg-danger/10',
  };

  const trendColor = trend && trend.value > 0 ? 'text-success' : 'text-danger';
  const TrendIcon = trend && trend.value > 0 ? TrendingUp : TrendingDown;

  return (
    <div className={cn(
      'bg-card border border-border rounded-[var(--radius)] p-6',
      'hover:bg-card-hover transition-all duration-200',
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-foreground mb-2">
            {value}
          </p>
          {trend && (
            <div className={cn('flex items-center gap-1 text-sm', trendColor)}>
              <TrendIcon className="w-4 h-4" />
              <span className="font-medium">{Math.abs(trend.value)}%</span>
              <span className="text-muted-foreground">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={cn(
          'p-3 rounded-lg',
          colorClasses[color]
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
