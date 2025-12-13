import * as React from 'react';
import { cn } from '@/lib/utils';

/* ==========================================
 * TABLE COMPONENTS
 * Design: Data tables with responsive mobile adaptation
 * Mobile: Automatically converts to card list on small screens
 * ========================================== */

/* ==========================================
 * Table Root
 * ========================================== */

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div className="w-full overflow-auto rounded-md border border-border-subtle">
        <table
          ref={ref}
          className={cn('w-full caption-bottom text-sm', className)}
          {...props}
        />
      </div>
    );
  }
);
Table.displayName = 'Table';

/* ==========================================
 * Table Header
 * ========================================== */

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => {
  return (
    <thead
      ref={ref}
      className={cn('sticky top-0 bg-background-tertiary', className)}
      {...props}
    />
  );
});
TableHeader.displayName = 'TableHeader';

/* ==========================================
 * Table Body
 * ========================================== */

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => {
  return (
    <tbody
      ref={ref}
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  );
});
TableBody.displayName = 'TableBody';

/* ==========================================
 * Table Footer
 * ========================================== */

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => {
  return (
    <tfoot
      ref={ref}
      className={cn(
        'border-t border-border-subtle bg-background-secondary font-medium',
        className
      )}
      {...props}
    />
  );
});
TableFooter.displayName = 'TableFooter';

/* ==========================================
 * Table Row
 * ========================================== */

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={cn(
          'border-b border-border-subtle transition-colors',
          'hover:bg-background-tertiary',
          'data-[state=selected]:bg-background-tertiary',
          className
        )}
        {...props}
      />
    );
  }
);
TableRow.displayName = 'TableRow';

/* ==========================================
 * Table Head Cell
 * ========================================== */

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => {
  return (
    <th
      ref={ref}
      className={cn(
        'h-10 px-4 text-left align-middle font-medium text-text-secondary',
        'text-xs uppercase tracking-wide',
        '[&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    />
  );
});
TableHead.displayName = 'TableHead';

/* ==========================================
 * Table Cell
 * ========================================== */

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => {
  return (
    <td
      ref={ref}
      className={cn(
        'p-4 align-middle text-text-primary',
        '[&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    />
  );
});
TableCell.displayName = 'TableCell';

/* ==========================================
 * Table Caption
 * ========================================== */

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => {
  return (
    <caption
      ref={ref}
      className={cn('mt-4 text-sm text-text-secondary', className)}
      {...props}
    />
  );
});
TableCaption.displayName = 'TableCaption';

/* ==========================================
 * Mobile Table (Card List)
 * Use this for better mobile experience
 * ========================================== */

export interface MobileTableCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Card title (typically row identifier)
   */
  title: string;

  /**
   * Subtitle or secondary info
   */
  subtitle?: string;

  /**
   * Data fields to display
   */
  fields: Array<{
    label: string;
    value: React.ReactNode;
  }>;

  /**
   * Actions (typically buttons or menu)
   */
  actions?: React.ReactNode;
}

const MobileTableCard = React.forwardRef<HTMLDivElement, MobileTableCardProps>(
  ({ className, title, subtitle, fields, actions, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-md border border-border-subtle bg-background-secondary p-4',
          'shadow-1',
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-3">
          <div>
            <h4 className="font-semibold text-text-primary">{title}</h4>
            {subtitle && <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>}
          </div>
          {actions && <div className="flex-shrink-0">{actions}</div>}
        </div>

        {/* Divider */}
        <div className="border-t border-border-subtle" />

        {/* Fields */}
        <dl className="mt-3 space-y-2">
          {fields.map((field, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <dt className="text-sm font-medium text-text-secondary">{field.label}:</dt>
              <dd className="text-sm text-text-primary">{field.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }
);
MobileTableCard.displayName = 'MobileTableCard';

/* ==========================================
 * Responsive Table Container
 * Shows table on desktop, card list on mobile
 * ========================================== */

export interface ResponsiveTableProps {
  /**
   * Desktop table component
   */
  desktopTable: React.ReactNode;

  /**
   * Mobile card list component
   */
  mobileCards: React.ReactNode;

  /**
   * Breakpoint to switch (default: 640px = mobile)
   */
  breakpoint?: 'mobile' | 'tablet';
}

const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  desktopTable,
  mobileCards,
  breakpoint = 'mobile',
}) => {
  return (
    <>
      {/* Desktop: Show table */}
      <div className={cn({ 'hidden mobile:block': breakpoint === 'mobile', 'hidden tablet:block': breakpoint === 'tablet' })}>
        {desktopTable}
      </div>

      {/* Mobile: Show card list */}
      <div className={cn({ 'mobile:hidden': breakpoint === 'mobile', 'tablet:hidden': breakpoint === 'tablet' })}>
        <div className="space-y-3">{mobileCards}</div>
      </div>
    </>
  );
};

/* ==========================================
 * Pagination Component
 * ========================================== */

export interface PaginationProps {
  /**
   * Current page (1-indexed)
   */
  currentPage: number;

  /**
   * Total number of pages
   */
  totalPages: number;

  /**
   * Number of items per page
   */
  pageSize: number;

  /**
   * Total number of items
   */
  totalItems: number;

  /**
   * Callback when page changes
   */
  onPageChange: (page: number) => void;

  /**
   * Show page size selector
   */
  showPageSize?: boolean;

  /**
   * Available page sizes
   */
  pageSizeOptions?: number[];

  /**
   * Callback when page size changes
   */
  onPageSizeChange?: (size: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  showPageSize = false,
  pageSizeOptions = [10, 20, 50, 100],
  onPageSizeChange,
}) => {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="flex items-center justify-between gap-4 border-t border-border-subtle bg-background-secondary px-4 py-3">
      {/* Info */}
      <div className="text-sm text-text-secondary">
        Showing <span className="font-medium text-text-primary">{startItem}</span> to{' '}
        <span className="font-medium text-text-primary">{endItem}</span> of{' '}
        <span className="font-medium text-text-primary">{totalItems}</span> results
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Page size selector */}
        {showPageSize && onPageSizeChange && (
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-sm border border-border-emphasis bg-background-tertiary px-3 py-1 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </select>
        )}

        {/* Page navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!canGoPrevious}
            className="rounded-sm border border-border-emphasis bg-background-tertiary px-3 py-1 text-sm font-medium text-text-primary transition-colors hover:bg-background-primary disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous page"
          >
            Previous
          </button>

          <span className="text-sm text-text-secondary">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!canGoNext}
            className="rounded-sm border border-border-emphasis bg-background-tertiary px-3 py-1 text-sm font-medium text-text-primary transition-colors hover:bg-background-primary disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

/* ==========================================
 * Exports
 * ========================================== */

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  MobileTableCard,
  ResponsiveTable,
  Pagination,
};
