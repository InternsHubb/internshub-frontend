import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

export const employerCardClass =
  'rounded-[18px] border border-[#E9DCF8] bg-white shadow-[0_18px_42px_rgba(58,3,83,0.055)]';

export const employerPrimaryButtonClass =
  'inline-flex min-h-[38px] items-center justify-center gap-2 rounded-[11px] bg-[linear-gradient(135deg,#3A0353_0%,#804A8A_100%)] px-4 text-[10px] font-bold tracking-[0.02em] text-white shadow-[0_8px_20px_rgba(58,3,83,0.18)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#804A8A] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

export const employerSecondaryButtonClass =
  'inline-flex min-h-[38px] items-center justify-center gap-2 rounded-[11px] border border-[#E9DCF8] bg-white px-4 text-[10px] font-bold text-[#3A0353] transition hover:bg-[#F8F2FC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#804A8A] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55';

export const employerFieldClass =
  'h-10 w-full rounded-[10px] border border-[#E9DCF8] bg-[#F8F2FC] px-3 text-[11px] text-[#111827] outline-none transition placeholder:text-[#A49AAC] focus:border-[#B98BCB] focus:ring-2 focus:ring-[#F1E8FA] disabled:cursor-not-allowed disabled:opacity-60';

export const employerTextareaClass =
  'min-h-[74px] w-full resize-y rounded-[10px] border border-[#E9DCF8] bg-[#F8F2FC] px-3 py-2.5 text-[11px] leading-5 text-[#111827] outline-none transition placeholder:text-[#A49AAC] focus:border-[#B98BCB] focus:ring-2 focus:ring-[#F1E8FA]';

export const employerLabelClass = 'text-[9px] font-bold text-[#334155]';

type StatusTone = 'info' | 'warning' | 'success' | 'neutral';

const statusToneClasses: Record<StatusTone, string> = {
  info: 'bg-[#E1F1FF] text-[#155E9C]',
  warning: 'bg-[#FFF1D7] text-[#A05A08]',
  success: 'bg-[#DFF8ED] text-[#087A50]',
  neutral: 'bg-[#F1E8FA] text-[#3A0353]',
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
        'inline-flex min-h-[23px] items-center justify-center rounded-full px-3 text-[9px] font-bold leading-none whitespace-nowrap',
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
      <div className="flex flex-col items-center gap-3 text-[11px] text-[#6B7280]">
        <span className="size-8 animate-spin rounded-full border-3 border-[#804A8A] border-t-transparent" />
        {label}
      </div>
    </div>
  );
}

export function EmployerError({ label, retryLabel, onRetry }: Omit<ResourceStateProps, 'errorLabel'> & { label: string }) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 text-center">
      <p className="max-w-sm text-[12px] text-[#5C5C5C]">{label}</p>
      <button type="button" onClick={onRetry} className={employerSecondaryButtonClass}>
        {retryLabel}
      </button>
    </div>
  );
}
