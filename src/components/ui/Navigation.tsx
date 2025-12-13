import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

/* ==========================================
 * NAVIGATION COMPONENTS
 * Design: Role-based navigation for desktop and mobile
 * Components: Header, Sidebar, BottomNav, NavItem
 * ========================================== */

/* ==========================================
 * Nav Item Type
 * ========================================== */

export interface NavItem {
  /**
   * Item label
   */
  label: string;

  /**
   * Item href
   */
  href: string;

  /**
   * Item icon
   */
  icon?: React.ReactNode;

  /**
   * Badge count (for notifications)
   */
  badge?: number;

  /**
   * Required roles to see this item
   */
  roles?: Array<'operator' | 'manager' | 'director'>;

  /**
   * Child items (for sub-menus)
   */
  children?: NavItem[];
}

/* ==========================================
 * Top Header (Desktop & Mobile)
 * ========================================== */

export interface HeaderProps {
  /**
   * Logo component or text
   */
  logo?: React.ReactNode;

  /**
   * Navigation items (desktop only)
   */
  navItems?: NavItem[];

  /**
   * Show mobile menu toggle
   */
  showMobileToggle?: boolean;

  /**
   * Mobile menu open state
   */
  mobileMenuOpen?: boolean;

  /**
   * Callback when mobile toggle clicked
   */
  onMobileToggle?: () => void;

  /**
   * Search component
   */
  searchComponent?: React.ReactNode;

  /**
   * Notification button
   */
  notificationButton?: React.ReactNode;

  /**
   * User menu component
   */
  userMenu?: React.ReactNode;

  /**
   * Additional class name
   */
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  logo,
  navItems = [],
  showMobileToggle = true,
  mobileMenuOpen = false,
  onMobileToggle,
  searchComponent,
  notificationButton,
  userMenu,
  className,
}) => {
  const pathname = usePathname();

  return (
    <header
      className={cn(
        'sticky top-0 z-fixed w-full border-b border-border-subtle bg-background-secondary',
        'shadow-1',
        className
      )}
    >
      <div className="flex h-16 items-center justify-between gap-4 px-4">
        {/* Left: Logo + Nav (desktop) */}
        <div className="flex items-center gap-6">
          {/* Mobile menu toggle */}
          {showMobileToggle && (
            <button
              onClick={onMobileToggle}
              className="mobile:hidden rounded-sm p-2 text-text-secondary hover:bg-background-tertiary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          )}

          {/* Logo */}
          <div className="flex-shrink-0">{logo}</div>

          {/* Desktop navigation */}
          <nav className="hidden mobile:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative rounded-sm px-4 py-2 text-sm font-medium transition-colors',
                    'hover:bg-background-tertiary',
                    {
                      'text-text-primary': isActive,
                      'text-text-secondary': !isActive,
                    }
                  )}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-primary" />
                  )}
                  {item.badge && item.badge > 0 && (
                    <span className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-status-error px-1.5 text-xs font-semibold text-white">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Search + Notifications + User */}
        <div className="flex items-center gap-3">
          {/* Search (hidden on mobile) */}
          {searchComponent && <div className="hidden mobile:block">{searchComponent}</div>}

          {/* Notifications */}
          {notificationButton}

          {/* User menu */}
          {userMenu}
        </div>
      </div>
    </header>
  );
};

/* ==========================================
 * Sidebar (Desktop)
 * ========================================== */

export interface SidebarProps {
  /**
   * Navigation items
   */
  navItems: NavItem[];

  /**
   * Show collapsed sidebar
   */
  collapsed?: boolean;

  /**
   * Callback when collapse toggle clicked
   */
  onCollapseToggle?: () => void;

  /**
   * Additional class name
   */
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  navItems,
  collapsed = false,
  onCollapseToggle,
  className,
}) => {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'fixed left-0 top-16 z-sticky hidden h-[calc(100vh-4rem)] border-r border-border-subtle bg-background-secondary mobile:block',
        'transition-all duration-base',
        {
          'w-64': !collapsed,
          'w-20': collapsed,
        },
        className
      )}
    >
      <nav className="flex h-full flex-col">
        {/* Nav items */}
        <ul className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                    'hover:bg-background-tertiary',
                    {
                      'bg-background-tertiary text-text-primary': isActive,
                      'text-text-secondary': !isActive,
                    }
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  {item.icon && (
                    <span className={cn('flex-shrink-0', { 'mx-auto': collapsed })}>
                      {item.icon}
                    </span>
                  )}
                  {!collapsed && <span className="flex-1">{item.label}</span>}
                  {!collapsed && item.badge && item.badge > 0 && (
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-status-error px-1.5 text-xs font-semibold text-white">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Collapse toggle */}
        {onCollapseToggle && (
          <div className="border-t border-border-subtle p-3">
            <button
              onClick={onCollapseToggle}
              className="flex w-full items-center justify-center rounded-md px-3 py-2.5 text-text-secondary transition-colors hover:bg-background-tertiary hover:text-text-primary"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <svg
                className={cn('h-5 w-5 transition-transform', { 'rotate-180': collapsed })}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {!collapsed && <span className="ml-3">Collapse</span>}
            </button>
          </div>
        )}
      </nav>
    </aside>
  );
};

/* ==========================================
 * Bottom Navigation (Mobile)
 * ========================================== */

export interface BottomNavProps {
  /**
   * Navigation items (max 5 recommended)
   */
  navItems: NavItem[];

  /**
   * Additional class name
   */
  className?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ navItems, className }) => {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-fixed mobile:hidden',
        'border-t border-border-subtle bg-background-secondary',
        'shadow-3',
        className
      )}
    >
      <ul className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  'relative flex flex-col items-center gap-1 rounded-md px-3 py-2 text-xs font-medium transition-colors',
                  {
                    'text-accent-primary': isActive,
                    'text-text-tertiary': !isActive,
                  }
                )}
              >
                {item.icon && <span className="relative">{item.icon}</span>}
                <span className="truncate">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className="absolute right-1 top-0 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-status-error px-1 text-[10px] font-semibold text-white">
                    {item.badge > 99 ? '99' : item.badge}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

/* ==========================================
 * Mobile Drawer Menu
 * ========================================== */

export interface MobileDrawerProps {
  /**
   * Whether drawer is open
   */
  open: boolean;

  /**
   * Callback when drawer should close
   */
  onClose: () => void;

  /**
   * Navigation items
   */
  navItems: NavItem[];

  /**
   * Additional class name
   */
  className?: string;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  open,
  onClose,
  navItems,
  className,
}) => {
  const pathname = usePathname();

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

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-modal-backdrop bg-overlay-modal mobile:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={cn(
          'fixed left-0 top-16 z-modal h-[calc(100vh-4rem)] w-64 mobile:hidden',
          'border-r border-border-subtle bg-background-secondary',
          'animate-slide-in-left',
          className
        )}
      >
        <nav className="flex h-full flex-col overflow-y-auto p-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                      'hover:bg-background-tertiary',
                      {
                        'bg-background-tertiary text-text-primary': isActive,
                        'text-text-secondary': !isActive,
                      }
                    )}
                  >
                    {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                    <span className="flex-1">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-status-error px-1.5 text-xs font-semibold text-white">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

/* ==========================================
 * Breadcrumbs
 * ========================================== */

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className }) => {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-2 text-sm', className)}>
      <ol className="flex items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-text-tertiary transition-colors hover:text-text-primary hover:underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={cn({ 'text-text-primary': isLast, 'text-text-tertiary': !isLast })}>
                  {item.label}
                </span>
              )}
              {!isLast && <span className="text-text-tertiary">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

/* ==========================================
 * Slide-in animation
 * ========================================== */

const style = `
@keyframes slide-in-left {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.animate-slide-in-left {
  animation: slide-in-left 200ms ease-out forwards;
}
`;

if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = style;
  document.head.appendChild(styleElement);
}

/* ==========================================
 * Exports
 * ========================================== */

export { Header, Sidebar, BottomNav, MobileDrawer, Breadcrumbs };
