import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

/* ==========================================
 * MODAL/DIALOG COMPONENT
 * Design: Overlay-based modals with accessibility
 * Features: Focus trap, ESC to close, click outside to close
 * ========================================== */

/* ==========================================
 * Modal Overlay
 * ========================================== */

interface ModalOverlayProps {
  onClick?: () => void;
  className?: string;
}

const ModalOverlay: React.FC<ModalOverlayProps> = ({ onClick, className }) => {
  return (
    <div
      className={cn(
        'fixed inset-0 z-modal-backdrop bg-overlay-modal',
        'animate-fade-in',
        className
      )}
      onClick={onClick}
      aria-hidden="true"
    />
  );
};

/* ==========================================
 * Modal Content
 * ========================================== */

interface ModalContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Modal size
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const ModalContent = React.forwardRef<HTMLDivElement, ModalContentProps>(
  ({ className, size = 'md', children, ...props }, ref) => {
    const sizeClasses = {
      sm: 'max-w-md',
      md: 'max-w-2xl',
      lg: 'max-w-4xl',
      xl: 'max-w-6xl',
      full: 'max-w-full mx-4',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'fixed left-1/2 top-1/2 z-modal w-full -translate-x-1/2 -translate-y-1/2',
          'rounded-lg bg-background-secondary shadow-3',
          'animate-slide-up',
          'max-h-[90vh] overflow-y-auto',
          sizeClasses[size],
          className
        )}
        role="dialog"
        aria-modal="true"
        {...props}
      >
        {children}
      </div>
    );
  }
);
ModalContent.displayName = 'ModalContent';

/* ==========================================
 * Modal Header
 * ========================================== */

interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Show close button
   */
  showCloseButton?: boolean;

  /**
   * Callback when close button is clicked
   */
  onClose?: () => void;
}

const ModalHeader = React.forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, showCloseButton = true, onClose, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'sticky top-0 z-10 flex items-center justify-between gap-4',
          'border-b border-border-subtle bg-background-secondary px-6 py-4',
          className
        )}
        {...props}
      >
        <div className="flex-1">{children}</div>
        {showCloseButton && onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 rounded-sm p-1 text-text-tertiary transition-colors hover:bg-background-tertiary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
            aria-label="Close modal"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
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
    );
  }
);
ModalHeader.displayName = 'ModalHeader';

/* ==========================================
 * Modal Title
 * ========================================== */

const ModalTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    return (
      <h2
        ref={ref}
        className={cn('text-2xl font-semibold text-text-primary', className)}
        {...props}
      />
    );
  }
);
ModalTitle.displayName = 'ModalTitle';

/* ==========================================
 * Modal Description
 * ========================================== */

const ModalDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn('mt-1 text-sm text-text-secondary', className)}
      {...props}
    />
  );
});
ModalDescription.displayName = 'ModalDescription';

/* ==========================================
 * Modal Body
 * ========================================== */

const ModalBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('px-6 py-6', className)}
        {...props}
      />
    );
  }
);
ModalBody.displayName = 'ModalBody';

/* ==========================================
 * Modal Footer
 * ========================================== */

const ModalFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'sticky bottom-0 flex items-center justify-end gap-3',
          'border-t border-border-subtle bg-background-secondary px-6 py-4',
          className
        )}
        {...props}
      />
    );
  }
);
ModalFooter.displayName = 'ModalFooter';

/* ==========================================
 * Modal Root (Main Component)
 * ========================================== */

export interface ModalProps {
  /**
   * Whether modal is open
   */
  open: boolean;

  /**
   * Callback when modal should close
   */
  onClose: () => void;

  /**
   * Modal size
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';

  /**
   * Close on overlay click
   */
  closeOnOverlayClick?: boolean;

  /**
   * Close on ESC key
   */
  closeOnEsc?: boolean;

  /**
   * Modal content
   */
  children: React.ReactNode;

  /**
   * Custom class name for content
   */
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  children,
  className,
}) => {
  const [mounted, setMounted] = React.useState(false);

  // Handle ESC key
  React.useEffect(() => {
    if (!open || !closeOnEsc) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, closeOnEsc, onClose]);

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Wait for mount (client-side only for portal)
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!open || !mounted) return null;

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      onClose();
    }
  };

  return createPortal(
    <>
      <ModalOverlay onClick={handleOverlayClick} />
      <ModalContent size={size} className={className} onClick={(e) => e.stopPropagation()}>
        {children}
      </ModalContent>
    </>,
    document.body
  );
};

/* ==========================================
 * Confirmation Dialog (Specialized Modal)
 * ========================================== */

export interface ConfirmDialogProps {
  /**
   * Whether dialog is open
   */
  open: boolean;

  /**
   * Dialog title
   */
  title: string;

  /**
   * Dialog message
   */
  message: string;

  /**
   * Type of confirmation (affects button colors)
   */
  variant?: 'default' | 'destructive';

  /**
   * Confirm button text
   */
  confirmText?: string;

  /**
   * Cancel button text
   */
  cancelText?: string;

  /**
   * Loading state (disables buttons)
   */
  isLoading?: boolean;

  /**
   * Callback when confirmed
   */
  onConfirm: () => void;

  /**
   * Callback when cancelled
   */
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  variant = 'default',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal open={open} onClose={onCancel} size="sm" closeOnOverlayClick={!isLoading}>
      <ModalHeader onClose={isLoading ? undefined : onCancel}>
        <ModalTitle>{title}</ModalTitle>
      </ModalHeader>

      <ModalBody>
        <p className="text-text-primary">{message}</p>
      </ModalBody>

      <ModalFooter>
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="rounded-sm border border-border-emphasis bg-transparent px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-background-tertiary disabled:cursor-not-allowed disabled:opacity-40"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className={cn(
            'rounded-sm px-4 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40',
            {
              'bg-accent-primary hover:bg-accent-hover': variant === 'default',
              'bg-status-error hover:brightness-110': variant === 'destructive',
            }
          )}
        >
          {isLoading ? 'Loading...' : confirmText}
        </button>
      </ModalFooter>
    </Modal>
  );
};

/* ==========================================
 * Exports
 * ========================================== */

export {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  ConfirmDialog,
};
