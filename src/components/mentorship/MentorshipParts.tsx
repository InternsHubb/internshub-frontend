import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Loader2 } from 'lucide-react';

import { initialsOf } from '@/lib/initials';

// Small pieces shared by the mentorship screens.

// The API has no mentor photos, so mentors are shown with their initials.
export function MentorAvatar({ name, className = '' }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center bg-[linear-gradient(135deg,#925DA8_0%,#C592FB_100%)] font-bold text-white ${className}`}
    >
      {initialsOf(name || '?', false)}
    </span>
  );
}

// Loading and error states while the mentorship data loads (MentorshipLayout).
export function MentorshipLoadState({ errorKey, onRetry }: { errorKey: string | null; onRetry?: () => void }) {
  const { t } = useTranslation();
  if (!onRetry) {
    return (
      <div role="status" className="flex min-h-[320px] flex-col items-center justify-center gap-3 text-sm text-[#475569]">
        <Loader2 aria-hidden="true" className="size-6 animate-spin text-[#5d198f]" />
        {t('mentorship.live.loading')}
      </div>
    );
  }
  return (
    <div role="alert" className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-[#f1ecf7] bg-white p-8 text-center shadow-sm">
      <AlertCircle aria-hidden="true" className="size-8 text-rose-500" />
      <h2 className="text-base font-bold text-[#0f172a]">{t('mentorship.live.loadError')}</h2>
      {errorKey && <p className="text-xs text-[#64748b]">{t(errorKey)}</p>}
      <button
        type="button"
        onClick={onRetry}
        className="rounded-xl bg-[linear-gradient(163deg,rgba(106,42,138,.92),rgba(59,4,84,.96)_71.43%)] px-5 py-2.5 text-xs font-bold text-white"
      >
        {t('mentorship.live.retry')}
      </button>
    </div>
  );
}

// A page-level message, e.g. a session or mentor that no longer exists.
export function MentorshipNotice({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="mx-auto max-w-lg space-y-4 rounded-xl border border-[#f1ecf7] bg-white p-8 text-center shadow-sm">
      <h2 className="text-xl font-bold text-[#0f172a]">{title}</h2>
      {children}
    </div>
  );
}

// Inline error under an action (booking, cancelling).
export function ActionError({ messageKey }: { messageKey: string | null }) {
  const { t } = useTranslation();
  if (!messageKey) return null;
  return (
    <p role="alert" className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
      <AlertCircle aria-hidden="true" className="size-4 shrink-0" />
      {t(messageKey)}
    </p>
  );
}

// "Times shown in Africa/Cairo": the learner's own time zone.
export function useTimeZoneLabel(): string {
  const { t } = useTranslation();
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return t('mentorship.live.timeZone', { zone });
}
