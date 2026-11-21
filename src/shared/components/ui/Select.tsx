import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/shared/utils/cn';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options?: ReadonlyArray<SelectOption>;
  placeholder?: string;
  hasError?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { options, placeholder, hasError = false, className, children, ...rest },
  ref
) {
  return (
    <select
      ref={ref}
      aria-invalid={hasError || rest['aria-invalid']}
      className={cn(
        'h-11 w-full rounded-[var(--radius-control)] border bg-white px-3.5 text-sm text-ink transition-colors outline-none',
        'focus:ring-2 focus:ring-brand-primary/20',
        hasError
          ? 'border-danger focus:border-danger focus:ring-danger/20'
          : 'border-border-subtle focus:border-brand-primary',
        'disabled:cursor-not-allowed disabled:bg-surface/60 disabled:opacity-70',
        className
      )}
      {...rest}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options
        ? options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))
        : children}
    </select>
  );
});

export default Select;
