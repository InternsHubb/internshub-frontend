import { useTranslation } from 'react-i18next';

import { EmployerPageHeader } from '@/components/employer/EmployerPageHeader';
import {
  employerCardClass,
  EmployerError,
  EmployerLoading,
  StatusBadge,
} from '@/components/employer/ui';
import { useEmployerResource } from '@/hooks/useEmployerResource';
import { getCompletion } from '@/lib/employer/completionService';
import { cn } from '@/lib/cn';

export function CompletionPage() {
  const { t } = useTranslation();

  const { data, loading, error, reload } = useEmployerResource(() => getCompletion(), []);

  if (loading) return <EmployerLoading label={t('common.loading')} />;
  if (error || !data) {
    return <EmployerError label={t('common.error')} retryLabel={t('common.retry')} onRetry={reload} />;
  }

  const { record, summaryLabels } = data;

  return (
    <div>
      <EmployerPageHeader
        breadcrumb={t('header.breadcrumb')}
        title={t('completion.title')}
        description={t('completion.subtitle')}
        status={<StatusBadge tone="neutral">{t('completion.demoBadge')}</StatusBadge>}
      />

      <section className={cn('mt-7 grid min-h-[92px] grid-cols-1 gap-y-4 px-5 py-5 sm:grid-cols-3', employerCardClass)}>
        {summaryLabels.map((label) => (
          <p key={label} className="text-[10px] font-medium text-[#475569]">
            {t(`completion.summary.${label}`)}
          </p>
        ))}
      </section>

      <section className={cn('mt-4 overflow-hidden', employerCardClass)}>
        <div className="flex items-start justify-between gap-4 px-4 pb-3 pt-4">
          <div>
            <p className="text-[8px] font-bold tracking-[1.2px] text-[#3A0353] uppercase">
              {t('completion.recordEyebrow')}
            </p>
            <h2 className="mt-2 text-[16px] font-bold text-[#111827]">{t('completion.recordTitle')}</h2>
          </div>
          <StatusBadge tone="neutral">{t('completion.recordBadge')}</StatusBadge>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[1040px]">
            <div className="grid grid-cols-[194px_198px_160px_116px_minmax(0,1fr)_172px] bg-[#F8F2FC] text-[7px] font-bold tracking-[0.4px] text-[#475569] uppercase">
              <div className="px-4 py-3">{t('completion.columns.candidate')}</div>
              <div className="px-4 py-3">{t('completion.columns.employer')}</div>
              <div className="px-4 py-3">{t('completion.columns.role')}</div>
              <div className="px-4 py-3">{t('completion.columns.duration')}</div>
              <div className="px-4 py-3">{t('completion.columns.status')}</div>
              <div className="px-4 py-3">{t('completion.columns.action')}</div>
            </div>

            <div className="grid min-h-[68px] grid-cols-[194px_198px_160px_116px_minmax(0,1fr)_172px] items-center">
              <div className="flex items-center gap-2 px-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#925DA8_0%,#C592FB_100%)] text-[8px] font-bold text-white">
                  {record.candidate.initials}
                </span>
                <span className="text-[10px] font-bold text-[#111827]">{record.candidate.name}</span>
              </div>
              <div className="px-4 text-[10px] font-medium text-[#334155]">{record.employer}</div>
              <div className="px-4 text-[10px] font-medium text-[#334155]">{record.role}</div>
              <div className="px-4 text-[10px] font-medium text-[#334155]">
                {t('meta.duration', { count: record.durationMonths })}
              </div>
              <div className="px-4">
                <StatusBadge tone="success">{t('completion.confirmedBy')}</StatusBadge>
              </div>
              <div className="px-4">
                <button
                  type="button"
                  disabled
                  title={t('completion.viewRecordUnavailable')}
                  className="text-[9px] font-bold text-[#3A0353] opacity-45"
                >
                  {t('completion.viewRecord')}
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="bg-[#F8F2FC] px-4 py-3 text-[8px] leading-4 text-[#475569]">
          {t('completion.demoFootnote')}
        </p>
      </section>
    </div>
  );
}
