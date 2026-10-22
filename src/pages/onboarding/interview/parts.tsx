import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, FlaskConical } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Shared pieces for the AI Interview screens, styled from the "Enjy- AI Interview after Edit"
// Figma frames (24:72): purple gradient fills and headings, #e7dbe9 borders, #fbf0fe panels.

export const GRADIENT_BG =
  'bg-[linear-gradient(160deg,rgba(106,42,138,0.92)_0%,rgba(59,4,84,0.96)_71.429%)]';
export const GRADIENT_TEXT = `${GRADIENT_BG} bg-clip-text text-transparent`;
export const CARD = 'bg-white border border-[#e7dbe9] rounded-[16px] shadow-[0_1px_2px_rgba(0,0,0,0.05)]';
export const PANEL = 'bg-[#fbf0fe] border border-[#e7dbe9] rounded-[12px]';
export const ROUND_CARD =
  'bg-white border border-[#e7dbe9] rounded-[28px] sm:rounded-[36px] shadow-[0_4px_20px_-2px_rgba(59,4,84,0.06),0_2px_6px_-1px_rgba(59,4,84,0.04)]';
export const TITLE_TEXT = 'text-[#1f1a24]';
export const BODY_TEXT = 'text-[#4c4451]';
export const MUTED_TEXT = 'text-[#7d7483]';

const FOCUS_RING = 'focus:outline-none focus-visible:ring-4 focus-visible:ring-[#e5d4f2]';

export function ForwardArrow({ size = 14 }: { size?: number }) {
  return <ArrowRight aria-hidden="true" size={size} className="shrink-0 rtl:-scale-x-100" />;
}

export function BackArrow({ size = 14 }: { size?: number }) {
  return <ArrowLeft aria-hidden="true" size={size} className="shrink-0 rtl:-scale-x-100" />;
}

type PageHeadingProps = {
  title: string;
  subtitle?: ReactNode;
  tone?: 'ink' | 'brand';
  centered?: boolean;
};

export function PageHeading({ title, subtitle, tone = 'ink', centered = false }: PageHeadingProps) {
  const titleColor = tone === 'brand' ? GRADIENT_TEXT : TITLE_TEXT;
  return (
    <div className={centered ? 'text-center' : undefined}>
      <h1 className={`text-[28px] sm:text-[32px] leading-[1.25] font-semibold tracking-[-0.025em] text-balance ${titleColor}`}>
        {title}
      </h1>
      {subtitle && (
        <p className={`mt-1.5 text-sm sm:text-base leading-[1.6] ${BODY_TEXT} ${centered ? 'mx-auto max-w-[520px]' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { size?: 'md' | 'lg'; block?: boolean };

export function PrimaryButton({ size = 'md', block = false, className = '', children, ...rest }: ButtonProps) {
  const sizing = size === 'lg' ? 'min-h-[48px] px-8 text-base' : 'min-h-[44px] px-6 text-sm';
  return (
    <button
      type="button"
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-[12px] font-semibold text-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none ${GRADIENT_BG} ${FOCUS_RING} ${sizing} ${block ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ className = '', children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...rest}
      className={`inline-flex min-h-[36px] items-center justify-center gap-1.5 rounded-[8px] border border-[#e4daed] bg-white px-3.5 text-xs font-semibold text-[#5a127a] transition hover:bg-[#fbf0fe] disabled:cursor-not-allowed disabled:opacity-50 ${FOCUS_RING} ${className}`}
    >
      {children}
    </button>
  );
}

export function TextButton({ className = '', children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...rest}
      className={`inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-[10px] px-3 text-sm font-medium text-[#5a127a] hover:underline disabled:cursor-not-allowed disabled:opacity-50 ${FOCUS_RING} ${className}`}
    >
      {children}
    </button>
  );
}

export type PillTone = 'success' | 'neutral' | 'warning' | 'danger' | 'brand';

const PILL_TONES: Record<PillTone, { pill: string; dot: string }> = {
  success: { pill: 'bg-[#dcfce7] text-[#15803d]', dot: 'bg-[#16a34a]' },
  neutral: { pill: 'bg-[#F1EEF2] text-[#685F6D]', dot: 'bg-[#9A939E]' },
  warning: { pill: 'bg-[#fef3c7] text-[#b45309]', dot: 'bg-[#f59e0b]' },
  danger: { pill: 'bg-[#fff1f2] text-[#be123c]', dot: 'bg-[#f43f5e]' },
  brand: { pill: 'bg-[#f5eaf9] text-[#3b0454]', dot: 'bg-[#7d42ad]' },
};

export function StatusPill({ tone, children, dot = true }: { tone: PillTone; children: ReactNode; dot?: boolean }) {
  const style = PILL_TONES[tone];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold leading-[14px] tracking-[0.02em] ${style.pill}`}
    >
      {dot && <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />}
      {children}
    </span>
  );
}

type IconTileProps = { icon: LucideIcon; size?: 'sm' | 'md' | 'lg'; solid?: boolean };

export function IconTile({ icon: Icon, size = 'md', solid = false }: IconTileProps) {
  const box = size === 'lg' ? 'h-12 w-12' : size === 'sm' ? 'h-9 w-9' : 'h-10 w-10';
  const iconSize = size === 'lg' ? 22 : 18;
  const colors = solid ? `${GRADIENT_BG} text-white` : 'bg-[#f5eaf9] text-[#5a127a]';
  return (
    <span aria-hidden="true" className={`flex shrink-0 items-center justify-center rounded-[12px] ${box} ${colors}`}>
      <Icon size={iconSize} strokeWidth={2} />
    </span>
  );
}

// Marks content that comes from `mockInterview.ts` so it can't be mistaken for real output.
export function SampleBadge({ label }: { label?: string }) {
  const { t } = useTranslation();
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-dashed border-[#d6b98a] bg-[#fffbeb] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em] text-[#9a5700]">
      <FlaskConical aria-hidden="true" size={11} />
      {label ?? t('onboarding.interview.common.sample')}
    </span>
  );
}

type ConsentCheckboxProps = { checked: boolean; onChange: (checked: boolean) => void; label: string; hint?: string };

// The one consent control: Setup and Recording Consent both render it against the same state.
export function ConsentCheckbox({ checked, onChange, label, hint }: ConsentCheckboxProps) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[#5a127a]"
      />
      <span className="min-w-0">
        <span className={`block text-sm font-semibold leading-5 ${TITLE_TEXT}`}>{label}</span>
        {hint && <span className={`mt-1 block text-xs leading-[18px] ${MUTED_TEXT}`}>{hint}</span>}
      </span>
    </label>
  );
}

type InterviewHeaderProps = { title: string; track: string; eyebrow?: string; aside?: ReactNode };

// "Technical Interview / Frontend Development" header used on the result and appeal cards.
export function InterviewHeader({ title, track, eyebrow, aside }: InterviewHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        {eyebrow && <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#7d42ad]">{eyebrow}</p>}
        <h2 className={`text-lg font-semibold leading-7 ${TITLE_TEXT}`}>{title}</h2>
        <p className={`text-sm ${BODY_TEXT}`}>{track}</p>
      </div>
      {aside}
    </div>
  );
}

type HeroIconProps = { icon: LucideIcon; tone?: 'brand' | 'warning' | 'success' };

const HERO_TONES = {
  brand: 'bg-[#f5eaf9] text-[#5a127a]',
  warning: 'bg-[#fef3c7] text-[#b45309]',
  success: 'bg-[#dcfce7] text-[#15803d]',
};

// Round icon above the centered outcome titles (Result, Under Review, Resume…).
export function HeroIcon({ icon: Icon, tone = 'brand' }: HeroIconProps) {
  return (
    <span
      aria-hidden="true"
      className={`mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full shadow-[0_8px_20px_rgba(59,4,84,0.12)] ${HERO_TONES[tone]}`}
    >
      <Icon size={30} strokeWidth={2} />
    </span>
  );
}

type NoticeProps ={ tone?: 'brand' | 'warning' | 'neutral'; icon: LucideIcon; title?: ReactNode; children?: ReactNode };

const NOTICE_TONES = {
  brand: { box: 'bg-[#fbf0fe] border-[#e7dbe9]', icon: 'text-[#5a127a]', title: TITLE_TEXT, body: BODY_TEXT },
  warning: { box: 'bg-[#fffbeb] border-[#fde68a]', icon: 'text-[#b45309]', title: 'text-[#b45309]', body: 'text-[#b45309]' },
  neutral: { box: 'bg-[#f4f0f8] border-transparent', icon: 'text-[#5a127a]', title: TITLE_TEXT, body: BODY_TEXT },
};

export function Notice({ tone = 'brand', icon: Icon, title, children }: NoticeProps) {
  const style = NOTICE_TONES[tone];
  return (
    <div className={`flex items-start gap-3 rounded-[12px] border p-4 ${style.box}`}>
      <Icon aria-hidden="true" size={18} className={`mt-0.5 shrink-0 ${style.icon}`} />
      <div className="min-w-0 text-xs leading-[18px]">
        {title && <p className={`text-[13px] font-semibold leading-5 ${style.title}`}>{title}</p>}
        {children && <div className={`mt-0.5 ${style.body}`}>{children}</div>}
      </div>
    </div>
  );
}
