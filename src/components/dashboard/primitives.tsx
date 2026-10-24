import type { ReactNode } from 'react';

import dangerIcon from '@/assets/dashboard/ic-danger.svg';
import flashIcon from '@/assets/dashboard/ic-flash.svg';
import { cn } from '@/lib/cn';

// Building blocks shared by the internship and project dashboards ("3 months" Figma section).

export const CARD = 'rounded-[20px] bg-white shadow-[0_4px_4px_rgba(0,0,0,0.25)]';
export const CARD_LARGE = 'rounded-[36px] bg-white shadow-[0_4px_4px_rgba(0,0,0,0.25)]';
export const OUTLINE_CARD = 'rounded-[36px] border border-[#828282]';
export const PURPLE_GRADIENT =
  'bg-[linear-gradient(172deg,rgba(106,42,138,0.92)_0%,rgba(59,4,84,0.96)_71.43%)]';
// Figma "Button" (13px radius, 50px min height) used by every action in these frames.
export const ACTION_BUTTON =
  'flex min-h-[50px] w-full items-center justify-center rounded-[13px] px-6 text-center text-[13px] font-bold tracking-[0.13px] outline-none transition focus-visible:ring-2 focus-visible:ring-[#5a198f] focus-visible:ring-offset-2';

// Grey "In progress" pill.
export function StatusPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-[23px] min-w-[95px] shrink-0 items-center justify-center rounded-full bg-[#dfdfdf] px-3 text-[11px] font-bold tracking-[0.13px] text-[#545454]">
      {children}
    </span>
  );
}

// Icon + heading row ("My Internship", "Your Squad", "Your Senior"...).
export function IconHeading({ icon, children, className }: { icon: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center gap-[3px]', className)}>
      <img src={icon} alt="" aria-hidden="true" className="size-6 shrink-0" />
      {children}
    </div>
  );
}

// 55px lilac tile holding a section icon (project page headings).
export function IconTile({ icon }: { icon: string }) {
  return <img src={icon} alt="" aria-hidden="true" className="size-[55px] shrink-0 rounded-2xl bg-[#f6ebff]" />;
}

// Number tile (project links, top tasks).
export function NumberTile({ value }: { value: number }) {
  return (
    <span className="flex size-[55px] shrink-0 items-center justify-center rounded-2xl bg-[#f6ebff] text-xl tracking-[0.13px] text-black">
      {value}
    </span>
  );
}

type ProgressBarProps = {
  value: number;
  max: number;
  label: string;
  className?: string;
  trackClassName?: string;
  fillClassName?: string;
};

export function ProgressBar({ value, max, label, className, trackClassName, fillClassName }: ProgressBarProps) {
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={cn('h-1.5 w-full overflow-hidden rounded-full', trackClassName ?? 'bg-[#ebdcf1]', className)}
    >
      <div
        className={cn('h-full rounded-full', fillClassName ?? PURPLE_GRADIENT)}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

// Figma "Notice": amber warning (danger icon) or green success (flash icon).
export function Notice({ tone, children }: { tone: 'warning' | 'success'; children: ReactNode }) {
  const isSuccess = tone === 'success';
  return (
    <div
      role="status"
      className={cn(
        'flex items-center gap-3 rounded-[14px] border-[0.8px] border-[rgba(76,5,133,0.07)] p-4',
        isSuccess ? 'bg-[#dcffde]' : 'bg-[#fff7e6]',
      )}
    >
      <img src={isSuccess ? flashIcon : dangerIcon} alt="" aria-hidden="true" className="size-6 shrink-0" />
      <p className={cn('text-xs leading-[18px]', isSuccess ? 'text-[#00c707]' : 'text-[#9a5700]')}>{children}</p>
    </div>
  );
}
