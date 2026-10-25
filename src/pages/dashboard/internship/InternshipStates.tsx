import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { AlertCircle, Loader2 } from 'lucide-react';

import { ACTION_BUTTON, CARD_LARGE, PURPLE_GRADIENT } from '@/components/dashboard/primitives';
import { cn } from '@/lib/cn';

// Loading, error and empty states shared by the internship and project pages.

function StateCard({ children, role }: { children: ReactNode; role?: 'status' | 'alert' }) {
  return (
    <section role={role} className={cn(CARD_LARGE, 'mx-auto flex w-full max-w-[640px] flex-col items-center gap-3 px-6 py-10 text-center')}>
      {children}
    </section>
  );
}

export function InternshipLoading() {
  const { t } = useTranslation();
  return (
    <StateCard role="status">
      <Loader2 aria-hidden="true" className="size-7 animate-spin text-[#42046b]" />
      <p className="text-sm font-semibold text-[#42046b]">{t('dashboard.internship.loading')}</p>
    </StateCard>
  );
}

export function InternshipError({ errorKey, onRetry }: { errorKey: string | null; onRetry: () => void }) {
  const { t } = useTranslation();
  return (
    <StateCard role="alert">
      <AlertCircle aria-hidden="true" className="size-7 text-[#a10000]" />
      <h1 className="text-lg font-bold text-black">{t('dashboard.internship.loadError')}</h1>
      {errorKey && <p className="text-sm text-[#737373]">{t(errorKey)}</p>}
      <button type="button" onClick={onRetry} className={cn(ACTION_BUTTON, PURPLE_GRADIENT, 'mt-2 text-white sm:w-auto sm:px-10')}>
        {t('dashboard.internship.retry')}
      </button>
    </StateCard>
  );
}

// No active enrollment, or (on the project page) no squad yet.
export function InternshipNotice({ title, body, to, cta }: { title: string; body: string; to: string; cta: string }) {
  return (
    <StateCard>
      <h1 className="text-xl font-bold text-black">{title}</h1>
      <p className="max-w-[460px] text-sm text-[#737373]">{body}</p>
      <Link to={to} className={cn(ACTION_BUTTON, PURPLE_GRADIENT, 'mt-2 text-white sm:w-auto sm:px-10')}>{cta}</Link>
    </StateCard>
  );
}
