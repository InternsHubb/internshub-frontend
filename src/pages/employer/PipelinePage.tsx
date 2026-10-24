import { useState } from 'react';
import { CalendarDays, SearchX } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { EmployerPageHeader } from '@/components/employer/EmployerPageHeader';
import {
  employerCardClass,
  employerPrimaryButtonClass,
  EmployerError,
  EmployerLoading,
  StatusBadge,
} from '@/components/employer/ui';
import { useEmployerResource } from '@/hooks/useEmployerResource';
import { EMPLOYER_ROUTES } from '@/constants/routes';
import { getEmployerContext } from '@/lib/employer/employerService';
import { formatEmployerDate, formatEmployerTime } from '@/lib/employer/format';
import { getPipeline } from '@/lib/employer/pipelineService';
import type { PipelineStage } from '@/lib/employer/types';
import { cn } from '@/lib/cn';

export function PipelinePage() {
  const { t, i18n } = useTranslation();
  const [selectedStage, setSelectedStage] = useState<PipelineStage>('interview');

  const { data, loading, error, reload } = useEmployerResource(
    () => Promise.all([getEmployerContext(), getPipeline(selectedStage)]),
    [selectedStage],
  );

  if (loading) return <EmployerLoading label={t('common.loading')} />;
  if (error || !data) {
    return <EmployerError label={t('common.error')} retryLabel={t('common.retry')} onRetry={reload} />;
  }

  const [, pipeline] = data;
  const selectedFilter = pipeline.filters.find((filter) => filter.id === selectedStage);
  const count = selectedFilter?.count ?? 0;
  const stageName = t(`pipeline.stageNames.${selectedStage}`);
  const stageSummary =
    selectedStage === 'interview'
      ? t('pipeline.stageSummary.interview', { count })
      : selectedStage === 'all'
        ? t('pipeline.stageSummary.all', { count })
        : t('pipeline.stageSummary.empty', { count });

  return (
    <div>
      <EmployerPageHeader
        breadcrumb={t('header.breadcrumb')}
        title={t('pipeline.title')}
        description={t('pipeline.subtitle')}
      />

      <section className={cn('mt-7 flex min-h-[46px] flex-wrap items-center gap-1 px-4 py-2.5', employerCardClass)}>
        {pipeline.filters.map((filter) => {
          const active = filter.id === selectedStage;
          return (
            <button
              key={filter.id}
              type="button"
              aria-pressed={active}
              onClick={() => setSelectedStage(filter.id)}
              className={cn(
                'flex h-[35px] items-center rounded-[10px] px-3.5 text-[10px] font-medium transition',
                active
                  ? 'bg-[#3A0353] text-white shadow-[0_5px_12px_rgba(58,3,83,0.16)]'
                  : 'text-[#475569] hover:bg-[#F8F2FC] hover:text-[#3A0353]',
              )}
            >
              {t(`pipeline.filters.${filter.id}`, { count: filter.count })}
            </button>
          );
        })}
      </section>

      <section className={cn('mt-4 flex min-h-[108px] flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center', employerCardClass)}>
        <div className="min-w-0 flex-1">
          <p className="text-[8px] font-bold tracking-[1.3px] text-[#3A0353] uppercase">
            {t('pipeline.stageEyebrow')}
          </p>
          <h2 className="mt-2 text-[16px] font-bold leading-tight text-[#111827]">{stageName}</h2>
          <p className="mt-2 text-[10px] leading-4 text-[#475569]">{stageSummary}</p>
        </div>
        {selectedStage === 'interview' && pipeline.records.length > 0 ? (
          <Link
            to={EMPLOYER_ROUTES.scheduleInterview(pipeline.records[0].id)}
            className={cn(employerPrimaryButtonClass, 'self-start sm:self-auto')}
          >
            {t('pipeline.schedule')}
          </Link>
        ) : null}
      </section>

      <section className={cn('mt-4 overflow-hidden', employerCardClass)}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] border-collapse text-start">
            <thead>
              <tr className="bg-[#F8F2FC] text-[7px] font-bold tracking-[0.4px] text-[#475569] uppercase">
                <th className="w-[178px] px-4 py-3 text-start font-bold">{t('pipeline.columns.candidate')}</th>
                <th className="w-[238px] px-4 py-3 text-start font-bold">{t('pipeline.columns.opportunity')}</th>
                <th className="w-[238px] px-4 py-3 text-start font-bold">{t('pipeline.columns.interview')}</th>
                <th className="w-[116px] px-4 py-3 text-start font-bold">{t('pipeline.columns.status')}</th>
                <th className="px-4 py-3 text-start font-bold">{t('pipeline.columns.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {pipeline.records.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-14">
                    <div className="flex flex-col items-center text-center">
                      <span className="flex size-11 items-center justify-center rounded-full bg-[#F1E8FA] text-[#804A8A]">
                        <SearchX className="size-5" strokeWidth={1.7} />
                      </span>
                      <p className="mt-3 text-[11px] font-bold text-[#111827]">{t('pipeline.emptyTitle')}</p>
                      <p className="mt-1 max-w-sm text-[10px] leading-4 text-[#475569]">
                        {t('pipeline.emptyBody', { count })}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                pipeline.records.map((record) => (
                  <tr key={record.id} className="border-t border-[#E9DCF8]">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2.5">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#925DA8_0%,#C592FB_100%)] text-[8px] font-bold text-white">
                          {record.candidate.initials}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-[10px] font-bold text-[#111827]">
                            {record.candidate.name}
                          </span>
                          <span className="mt-0.5 block text-[8px] text-[#475569]">
                            {t('candidate.summary', {
                              percent: record.candidate.matchPercent,
                              cohort: record.candidate.cohort,
                            })}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="block text-[10px] font-bold text-[#111827]">{record.opportunity.title}</span>
                      <span className="mt-0.5 block text-[8px] text-[#475569]">
                        {t('pipeline.opportunityMeta', {
                          type: t(`meta.${record.opportunity.typeKey}`),
                          mode: t(`meta.${record.opportunity.modeKey}`),
                          duration: t('meta.duration', { count: record.opportunity.durationMonths }),
                        })}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {record.interview ? (
                        <>
                          <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#111827]">
                            <CalendarDays className="size-3 text-[#804A8A]" strokeWidth={1.8} />
                            {formatEmployerDate(record.interview.date, i18n.language)}
                          </span>
                          <span className="mt-1 block text-[8px] text-[#475569]">
                            {formatEmployerTime(record.interview.startTime, i18n.language)} •{' '}
                            {record.interview.timezone} • {record.interview.mode}
                          </span>
                        </>
                      ) : (
                        <span className="text-[9px] text-[#475569]">{t('common.notProvided')}</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge tone="info">{t('status.scheduled')}</StatusBadge>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col items-start gap-2">
                        <Link
                          to={EMPLOYER_ROUTES.scheduleInterview(record.id)}
                          className="text-[9px] font-bold text-[#3A0353] hover:underline"
                        >
                          {t('pipeline.viewInterview')}
                        </Link>
                        <Link
                          to={EMPLOYER_ROUTES.decision(record.id)}
                          className="text-[9px] font-bold text-[#3A0353] hover:underline"
                        >
                          {t('pipeline.recordDecision')}
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
