import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/shared/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { hasError = false, className, ...rest },
  ref
) {
  return (
    <input
      ref={ref}
      aria-invalid={hasError || rest['aria-invalid']}
      className={cn(
        'h-11 w-full rounded-[var(--radius-control)] border bg-white px-3.5 text-sm text-ink transition-colors outline-none',
        'placeholder:text-muted/75 focus:ring-2 focus:ring-brand-primary/20',
        hasError
          ? 'border-danger focus:border-danger focus:ring-danger/20'
          : 'border-border-subtle focus:border-brand-primary',
        'disabled:cursor-not-allowed disabled:bg-surface/60 disabled:opacity-70',
        className
      )}
      {...rest}
    />
  );
});

export default Input;
