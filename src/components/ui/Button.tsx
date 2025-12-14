import * as React from 'react';
import { cn } from '@/lib/utils';

/* ==========================================
 * BUTTON COMPONENT
 * Design: Professional, clear, accessible
 * Variants: Primary, Secondary, Destructive, Ghost
 * Sizes: Default, Small, Large
 * ========================================== */

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button visual variant
   * - primary: Main actions (blue accent)
   * - secondary: Alternative actions (outlined)
   * - destructive: Delete/remove actions (red)
   * - ghost: Minimal style for tertiary actions
   */
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';

  /**
   * Button size
   * - sm: 40px height (compact spaces)
   * - default: 48px height (standard)
   * - lg: 56px height (emphasis)
   */
  size?: 'sm' | 'default' | 'lg';

  /**
   * Full width button (mobile-friendly)
   */
  fullWidth?: boolean;

  /**
   * Loading state (shows spinner, disables button)
   */
  isLoading?: boolean;

  /**
   * Icon to show before text
   */
  leftIcon?: React.ReactNode;

  /**
   * Icon to show after text
   */
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'default',
      fullWidth = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center',
          'font-medium tracking-wide',
          'rounded-sm',
          'transition-all duration-fast',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-40',

          // Variant styles
          {
            // Primary (accent blue background)
            'bg-accent-primary text-white hover:bg-accent-hover active:bg-accent-active':
              variant === 'primary',

            // Secondary (outlined)
            'bg-transparent text-text-secondary border border-border-emphasis hover:bg-background-tertiary':
              variant === 'secondary',

            // Destructive (red for delete actions)
            'bg-status-error text-white hover:brightness-110 active:brightness-90':
              variant === 'destructive',

            // Ghost (minimal, for tertiary actions)
            'bg-transparent text-text-secondary hover:bg-background-tertiary':
              variant === 'ghost',
          },

          // Size styles
          {
            'h-10 px-3 text-sm': size === 'sm',
            'h-12 px-4 text-base': size === 'default',
            'h-14 px-6 text-lg': size === 'lg',
          },

          // Full width
          {
            'w-full': fullWidth,
          },

          className
        )}
        {...props}
      >
        {/* Loading spinner */}
        {isLoading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
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
        )}

        {/* Left icon */}
        {!isLoading && leftIcon && (
          <span className="mr-2 flex items-center" aria-hidden="true">
            {leftIcon}
          </span>
        )}

        {/* Button text */}
        <span>{children}</span>

        {/* Right icon */}
        {rightIcon && (
          <span className="ml-2 flex items-center" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
