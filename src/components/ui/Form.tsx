import * as React from 'react';
import { cn } from '@/lib/utils';

/* ==========================================
 * FORM COMPONENTS
 * Design: Accessible, clear, professional forms
 * Components: Input, TextArea, Select, Checkbox, Radio, Label, HelperText, ErrorText
 * ========================================== */

/* ==========================================
 * Label
 * ========================================== */

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /**
   * Mark field as required
   */
  required?: boolean;

  /**
   * Show info tooltip icon
   */
  info?: string;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, info, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'block text-sm font-medium text-text-primary',
          'mb-1.5',
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="ml-1 text-status-error">*</span>}
        {info && (
          <span
            className="ml-1 inline-flex cursor-help text-text-tertiary"
            title={info}
            aria-label={info}
          >
            ⓘ
          </span>
        )}
      </label>
    );
  }
);
Label.displayName = 'Label';

/* ==========================================
 * Input
 * ========================================== */

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Error state
   */
  error?: boolean;

  /**
   * Success state
   */
  success?: boolean;

  /**
   * Left icon or addon
   */
  leftAddon?: React.ReactNode;

  /**
   * Right icon or addon
   */
  rightAddon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, success, leftAddon, rightAddon, ...props }, ref) => {
    const inputClasses = cn(
      // Base styles
      'flex h-12 w-full rounded-sm border bg-background-tertiary px-4 py-3',
      'text-base text-text-primary placeholder:text-text-tertiary',
      'transition-colors duration-fast',
      'focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent',
      'disabled:cursor-not-allowed disabled:opacity-50',

      // Border color based on state
      {
        'border-border-emphasis': !error && !success,
        'border-status-error focus:ring-status-error': error,
        'border-status-success focus:ring-status-success': success,
      },

      // Adjust padding for addons
      {
        'pl-10': leftAddon,
        'pr-10': rightAddon,
      },

      className
    );

    if (leftAddon || rightAddon) {
      return (
        <div className="relative">
          {leftAddon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-tertiary">
              {leftAddon}
            </div>
          )}
          <input ref={ref} type={type} className={inputClasses} {...props} />
          {rightAddon && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-text-tertiary">
              {rightAddon}
            </div>
          )}
        </div>
      );
    }

    return <input ref={ref} type={type} className={inputClasses} {...props} />;
  }
);
Input.displayName = 'Input';

/* ==========================================
 * TextArea
 * ========================================== */

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Error state
   */
  error?: boolean;

  /**
   * Success state
   */
  success?: boolean;

  /**
   * Auto-resize based on content
   */
  autoResize?: boolean;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, error, success, autoResize, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          // Base styles
          'flex min-h-[120px] w-full rounded-sm border bg-background-tertiary px-4 py-3',
          'text-base text-text-primary placeholder:text-text-tertiary',
          'transition-colors duration-fast',
          'focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'resize-y',

          // Border color based on state
          {
            'border-border-emphasis': !error && !success,
            'border-status-error focus:ring-status-error': error,
            'border-status-success focus:ring-status-success': success,
          },

          {
            'resize-none': autoResize,
          },

          className
        )}
        {...props}
      />
    );
  }
);
TextArea.displayName = 'TextArea';

/* ==========================================
 * Select
 * ========================================== */

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /**
   * Error state
   */
  error?: boolean;

  /**
   * Success state
   */
  success?: boolean;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, success, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          // Base styles
          'flex h-12 w-full rounded-sm border bg-background-tertiary px-4 py-3',
          'text-base text-text-primary',
          'transition-colors duration-fast',
          'focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'appearance-none bg-no-repeat',
          'bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3E%3C/svg%3E")]',
          'bg-[length:1.5em_1.5em] bg-[right_0.5rem_center] pr-10',

          // Border color based on state
          {
            'border-border-emphasis': !error && !success,
            'border-status-error focus:ring-status-error': error,
            'border-status-success focus:ring-status-success': success,
          },

          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = 'Select';

/* ==========================================
 * Checkbox
 * ========================================== */

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * Checkbox label
   */
  label?: string;

  /**
   * Error state
   */
  error?: boolean;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          className={cn(
            'h-5 w-5 rounded-sm border border-border-emphasis bg-background-tertiary',
            'text-accent-primary transition-colors duration-fast',
            'focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'cursor-pointer',
            {
              'border-status-error': error,
            },
            className
          )}
          {...props}
        />
        {label && (
          <label
            htmlFor={checkboxId}
            className="cursor-pointer text-sm font-medium text-text-primary"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';

/* ==========================================
 * Radio
 * ========================================== */

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * Radio label
   */
  label?: string;

  /**
   * Error state
   */
  error?: boolean;
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          type="radio"
          id={radioId}
          className={cn(
            'h-5 w-5 border border-border-emphasis bg-background-tertiary',
            'text-accent-primary transition-colors duration-fast',
            'focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'cursor-pointer',
            {
              'border-status-error': error,
            },
            className
          )}
          {...props}
        />
        {label && (
          <label
            htmlFor={radioId}
            className="cursor-pointer text-sm font-medium text-text-primary"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);
Radio.displayName = 'Radio';

/* ==========================================
 * Helper Text
 * ========================================== */

const HelperText = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('mt-1.5 text-sm text-text-secondary', className)}
        {...props}
      />
    );
  }
);
HelperText.displayName = 'HelperText';

/* ==========================================
 * Error Text
 * ========================================== */

const ErrorText = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('mt-1.5 text-sm text-status-error', className)}
        role="alert"
        {...props}
      />
    );
  }
);
ErrorText.displayName = 'ErrorText';

/* ==========================================
 * Form Field (Complete field wrapper)
 * ========================================== */

export interface FormFieldProps {
  /**
   * Field label
   */
  label: string;

  /**
   * Mark field as required
   */
  required?: boolean;

  /**
   * Info tooltip
   */
  info?: string;

  /**
   * Error message
   */
  error?: string;

  /**
   * Helper text
   */
  helperText?: string;

  /**
   * Field component (Input, Select, TextArea, etc.)
   */
  children: React.ReactNode;

  /**
   * Additional class name for wrapper
   */
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  required,
  info,
  error,
  helperText,
  children,
  className,
}) => {
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label required={required} info={info}>
        {label}
      </Label>
      {children}
      {error && <ErrorText>{error}</ErrorText>}
      {!error && helperText && <HelperText>{helperText}</HelperText>}
    </div>
  );
};

/* ==========================================
 * Exports
 * ========================================== */

export { Label, Input, TextArea, Select, Checkbox, Radio, HelperText, ErrorText, FormField };
