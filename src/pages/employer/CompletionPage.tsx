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

  const { record } = data;

  return (
    <div>
      <EmployerPageHeader
        breadcrumb={t('header.breadcrumb', 'RECRUITMENT')}
        title={t('completion.title', 'Completion')}
        description={t('completion.subtitle', 'Confirmed recruitment outcomes and completed placement records.')}
        status={<StatusBadge tone="info">{t('completion.demoBadge', 'Demo data')}</StatusBadge>}
      />

      {/* Stats Summary Card */}
      <section className={cn('mt-6 grid grid-cols-1 divide-y divide-[#E9DCF8] p-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:p-7', employerCardClass)}>
        <div className="py-2 sm:px-4 sm:py-0 first:ps-0">
          <p className="text-[13px] font-medium text-[#64748B]">Confirmed placements</p>
          <p className="mt-2 text-[32px] font-bold text-[#111827]">1</p>
        </div>
        <div className="py-2 sm:px-6 sm:py-0">
          <p className="text-[13px] font-medium text-[#64748B]">Pending confirmation</p>
          <p className="mt-2 text-[32px] font-bold text-[#111827]">0</p>
        </div>
        <div className="py-2 sm:px-6 sm:py-0 last:pe-0">
          <p className="text-[13px] font-medium text-[#64748B]">Records shown</p>
          <p className="mt-2 text-[32px] font-bold text-[#111827]">1</p>
        </div>
      </section>

      {/* Table Records Card */}
      <section className={cn('mt-5 overflow-hidden', employerCardClass)}>
        <div className="flex items-center justify-between gap-4 p-5 sm:p-6 pb-4">
          <div>
            <p className="text-[11px] font-bold tracking-[1.4px] text-[#7C3AED] uppercase">
              {t('completion.recordEyebrow', 'SAMPLE RECORD')}
            </p>
            <h2 className="mt-1 text-[20px] font-bold text-[#111827]">{t('completion.recordTitle', 'Placement records')}</h2>
          </div>
          <StatusBadge tone="neutral">{t('completion.recordBadge', 'DEMO')}</StatusBadge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] border-collapse text-start">
            <thead>
              <tr className="border-y border-[#E9DCF8] bg-[#FAF7FD] text-[11px] font-bold tracking-[0.5px] text-[#64748B] uppercase">
                <th className="px-6 py-3.5 text-start">{t('completion.columns.candidate', 'CANDIDATE')}</th>
                <th className="px-6 py-3.5 text-start">{t('completion.columns.employer', 'EMPLOYER')}</th>
                <th className="px-6 py-3.5 text-start">{t('completion.columns.role', 'ROLE')}</th>
                <th className="px-6 py-3.5 text-start">{t('completion.columns.duration', 'DURATION')}</th>
                <th className="px-6 py-3.5 text-start">{t('completion.columns.status', 'STATUS')}</th>
                <th className="px-6 py-3.5 text-start">{t('completion.columns.action', 'ACTIONS')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9DCF8]">
              <tr className="hover:bg-[#FAF7FD]/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#925DA8_0%,#C592FB_100%)] text-[12px] font-bold text-white shadow-sm">
                      {record.candidate.initials}
                    </span>
                    <span className="text-[14px] font-bold text-[#111827]">{record.candidate.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[14px] text-[#334155]">{record.employer}</td>
                <td className="px-6 py-4 text-[14px] font-medium text-[#111827]">{record.role}</td>
                <td className="px-6 py-4 text-[14px] text-[#334155]">
                  {t('meta.duration', { count: record.durationMonths, defaultValue: `${record.durationMonths} months` })}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge tone="success">{t('completion.confirmedBy', 'Confirmed by InternsHub')}</StatusBadge>
                </td>
                <td className="px-6 py-4">
                  <span className="cursor-pointer text-[13px] font-bold text-[#7C3AED] hover:underline">
                    {t('completion.viewRecord', 'View record')}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="border-t border-[#E9DCF8] bg-[#FAF7FD] px-6 py-3 text-[12px] text-[#64748B]">
          {t('completion.demoFootnote', 'Demo/sample data only. No salary, placement dates, or unprovided metrics are included.')}
        </div>
      </section>
    </div>
  );
}

