import type { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  action?: ReactNode;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  retryLabel = 'Try again',
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center rounded-[var(--radius-card)] border border-danger/25 bg-danger-soft/60 px-6 py-10 text-center',
        className
      )}
    >
      <span
        aria-hidden="true"
        className="mb-3 flex size-11 items-center justify-center rounded-full bg-danger-soft text-danger"
      >
        <AlertCircle className="size-5" />
      </span>
      <h3 className="text-base font-bold text-ink">{title}</h3>
      <p className="mt-1.5 max-w-md text-sm text-label">{message}</p>
      {(onRetry || action) && (
        <div className="mt-5 flex items-center gap-3">
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              {retryLabel}
            </Button>
          )}
          {action}
        </div>
      )}
    </div>
  );
}

export default ErrorState;
