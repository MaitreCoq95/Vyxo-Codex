'use client';

/**
 * Vyxo Codex 2.0 - Loading Components
 * Composants de chargement réutilisables avec états visuels cohérents
 */

import { Loader2, LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  label?: string;
}

/**
 * Spinner de chargement simple
 */
export function LoadingSpinner({ size = 'md', className, label }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
      <Loader2 className={cn(sizeClasses[size], 'animate-spin text-primary')} />
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );
}

/**
 * Page de chargement plein écran
 */
export function LoadingPage({ message = 'Chargement...' }: { message?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <LoaderCircle className="h-16 w-16 animate-spin text-primary" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-primary/20" />
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-1">Vyxo Codex</h2>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton de chargement pour le texte
 */
export function LoadingSkeleton({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-4 bg-muted rounded animate-pulse',
            i === lines - 1 ? 'w-2/3' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}

/**
 * Card de chargement avec skeleton
 */
export function LoadingCard() {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="space-y-4">
        <div className="h-6 w-1/3 bg-muted rounded animate-pulse" />
        <LoadingSkeleton lines={3} />
        <div className="flex gap-2">
          <div className="h-10 w-24 bg-muted rounded animate-pulse" />
          <div className="h-10 w-24 bg-muted rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

/**
 * Table de chargement avec skeleton
 */
export function LoadingTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex gap-4 border-b border-border pb-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex-1 h-4 bg-muted rounded animate-pulse" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 py-3">
          {Array.from({ length: 4 }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="flex-1 h-4 bg-muted rounded animate-pulse"
              style={{
                animationDelay: `${(rowIndex * 50) + (colIndex * 20)}ms`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Grid de chargement (pour les dashboards)
 */
export function LoadingGrid({ cols = 3, rows = 2 }: { cols?: number; rows?: number }) {
  return (
    <div
      className="grid gap-6"
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      }}
    >
      {Array.from({ length: cols * rows }).map((_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  );
}

/**
 * Bouton de chargement
 */
export function LoadingButton({
  isLoading,
  children,
  loadingText = 'Chargement...',
  ...props
}: {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} disabled={isLoading || props.disabled}>
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          {loadingText}
        </span>
      ) : (
        children
      )}
    </button>
  );
}

/**
 * État de chargement inline
 */
export function InlineLoading({ text = 'Chargement' }: { text?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>{text}</span>
    </div>
  );
}

/**
 * Overlay de chargement (pour modale/drawer)
 */
export function LoadingOverlay({ message }: { message?: string }) {
  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <LoadingSpinner size="lg" label={message} />
    </div>
  );
}

/**
 * Section de chargement (pour des sections de page)
 */
export function LoadingSection({
  minHeight = '200px',
  message
}: {
  minHeight?: string;
  message?: string;
}) {
  return (
    <div
      className="flex items-center justify-center border border-border rounded-lg bg-muted/30"
      style={{ minHeight }}
    >
      <LoadingSpinner size="md" label={message} />
    </div>
  );
}

/**
 * Progress bar de chargement
 */
export function LoadingProgress({ progress }: { progress: number }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">Progression</span>
        <span className="text-sm font-medium">{Math.round(progress)}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Dots de chargement animés
 */
export function LoadingDots() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-2 w-2 rounded-full bg-primary animate-bounce"
          style={{
            animationDelay: `${i * 150}ms`,
          }}
        />
      ))}
    </div>
  );
}
