'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/use-theme';
import { Loader2 } from 'lucide-react';

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'default' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

export const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ 
    className, 
    variant = 'primary',
    size = 'default',
    loading = false,
    fullWidth = false,
    children, 
    disabled,
    ...props 
  }, ref) => {
    const { themeConfig } = useTheme();

    const sizeClasses = {
      sm: 'h-9 px-4 text-sm',
      default: 'h-11 px-6 text-base',
      lg: 'h-14 px-8 text-lg',
    };

    const gradientClass = {
      primary: themeConfig.gradients.primary,
      success: themeConfig.gradients.success,
      warning: themeConfig.gradients.warning,
      danger: themeConfig.gradients.danger,
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2',
          'rounded-lg font-semibold',
          'text-white shadow-md',
          'bg-gradient-to-r',
          gradientClass,
          'transition-all duration-200',
          'hover:shadow-lg hover:scale-105 active:scale-95',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
          sizeClasses[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

GradientButton.displayName = 'GradientButton';
