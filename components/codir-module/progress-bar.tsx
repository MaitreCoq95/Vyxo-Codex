"use client";

import { cn } from "@/lib/utils";
import { getProgressColor, getProgressLabel } from "@/lib/codir-module/utils";

interface ProgressBarProps {
  value: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ProgressBar({ value, showLabel = true, size = 'md', className }: ProgressBarProps) {
  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={cn("space-y-1", className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{getProgressLabel(value)}</span>
          <span className="font-medium">{value}%</span>
        </div>
      )}
      <div className={cn("w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden", heightClasses[size])}>
        <div
          className={cn("h-full transition-all duration-300", getProgressColor(value))}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}
