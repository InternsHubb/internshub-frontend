import { useTranslation } from 'react-i18next';

import { cn } from '@/shared/utils/cn';

// Loading and error content shared by the Dashboard home cards.

export function SkeletonLines({ widths = ['w-3/4', 'w-1/2'], className }: { widths?: ReadonlyArray<string>; className?: string }) {
  const { t } = useTranslation();
  return (
    <div role="status" className={cn('flex flex-col gap-2', className)}>
      <span className="sr-only">{t('dashboard.home.loading')}</span>
      {widths.map((width, index) => (
        <span key={index} aria-hidden="true" className={cn('block h-3.5 animate-pulse rounded-full bg-[#ede6f3]', width)} />
      ))}
    </div>
  );
}

export function CardError({ errorKey, onRetry, className }: { errorKey: string | null; onRetry: () => void; className?: string }) {
  const { t } = useTranslation();
  return (
    <div role="alert" className={cn('flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#6b5d78]', className)}>
      <span>{errorKey ? t(errorKey) : t('dashboard.home.loadError')}</span>
      <button
        type="button"
        onClick={onRetry}
        className="rounded font-semibold text-[#4e0f7c] underline-offset-2 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[#5a198f]"
      >
        {t('dashboard.home.retry')}
      </button>
    </div>
  );
}
