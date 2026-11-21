import type { ReactNode } from 'react';

export type StatusTone = 'danger' | 'success' | 'neutral' | 'warning' | 'brand';

const TONE_CLASSES: Record<StatusTone, string> = {
  danger: 'bg-[#FFE5E8] text-[#B42331]',
  success: 'bg-[#DFF8ED] text-[#087A50]',
  neutral: 'bg-[#EFEDF3] text-[#666070]',
  warning: 'bg-[#FFF1D7] text-[#A05A08]',
  brand: 'bg-[#F0E9FF] text-[#5C1D87]',
};

type StatusBadgeProps = {
  tone: StatusTone;
  children: ReactNode;
  dot?: boolean;
  className?: string;
};

export function StatusBadge({
  tone,
  children,
  dot = false,
  className = '',
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex min-h-[23px] items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold leading-[15px] ${TONE_CLASSES[tone]} ${className}`}
    >
      {dot ? <span className="size-1.5 rounded-full bg-current" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
