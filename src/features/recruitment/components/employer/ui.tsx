import type { ReactNode } from 'react';

import { cn } from '@/shared/utils/cn';

export const employerCardClass =
  'rounded-[22px] border border-[#E9DCF8] bg-white shadow-[0_12px_32px_rgba(58,3,83,0.06)]';

export const employerPrimaryButtonClass =
  'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#3A0353_0%,#5B1B75_100%)] px-6 text-[14px] font-semibold text-white shadow-[0_8px_20px_rgba(58,3,83,0.2)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#804A8A] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer';

export const employerSecondaryButtonClass =
  'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-[#D8C6E8] bg-white px-6 text-[14px] font-semibold text-[#3A0353] transition hover:bg-[#F8F2FC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#804A8A] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55 cursor-pointer';

export const employerFieldClass =
  'h-11 w-full rounded-[12px] border border-[#E4D5F2] bg-[#FAF7FC] px-3.5 text-[14px] text-[#111827] outline-none transition placeholder:text-[#A49AAC] focus:border-[#7C3AED] focus:bg-white focus:ring-2 focus:ring-[#7C3AED]/20 disabled:cursor-not-allowed disabled:opacity-60';

export const employerTextareaClass =
  'min-h-[96px] w-full resize-y rounded-[12px] border border-[#E4D5F2] bg-[#FAF7FC] px-3.5 py-3 text-[14px] leading-relaxed text-[#111827] outline-none transition placeholder:text-[#A49AAC] focus:border-[#7C3AED] focus:bg-white focus:ring-2 focus:ring-[#7C3AED]/20';

export const employerLabelClass = 'text-[12px] font-bold text-[#374151]';

type StatusTone = 'info' | 'warning' | 'success' | 'neutral' | 'danger';

const statusToneClasses: Record<StatusTone, string> = {
  info: 'bg-[#E0F2FE] text-[#0369A1]',
  warning: 'bg-[#FEF3C7] text-[#B45309]',
  success: 'bg-[#DCFCE7] text-[#15803D]',
  neutral: 'bg-[#F1E8FA] text-[#4A154B]',
  danger: 'bg-[#FEE2E2] text-[#B91C1C]',
};

type StatusBadgeProps = {
  tone: StatusTone;
  children: ReactNode;
  className?: string;
};

export function StatusBadge({ tone, children, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex min-h-[26px] items-center justify-center rounded-full px-3.5 text-[12px] font-semibold leading-none whitespace-nowrap',
        statusToneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

type ResourceStateProps = {
  label: string;
  errorLabel: string;
  retryLabel: string;
  onRetry: () => void;
};

export function EmployerLoading({ label }: { label: string }) {
  return (
    <div className="flex min-h-[320px] items-center justify-center" role="status" aria-label={label}>
      <div className="flex flex-col items-center gap-3 text-[13px] text-[#6B7280]">
        <span className="size-8 animate-spin rounded-full border-3 border-[#804A8A] border-t-transparent" />
        {label}
      </div>
    </div>
  );
}

export function EmployerError({ label, retryLabel, onRetry }: Omit<ResourceStateProps, 'errorLabel'> & { label: string }) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 text-center">
      <p className="max-w-sm text-[13px] text-[#5C5C5C]">{label}</p>
      <button type="button" onClick={onRetry} className={employerSecondaryButtonClass}>
        {retryLabel}
      </button>
    </div>
  );
}

