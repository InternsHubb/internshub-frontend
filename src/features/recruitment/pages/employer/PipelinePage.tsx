import { useState } from 'react';
import { CalendarDays, SearchX } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { EmployerPageHeader } from '@/features/recruitment/components/employer/EmployerPageHeader';
import {
  employerCardClass,
  employerPrimaryButtonClass,
  EmployerError,
  EmployerLoading,
  StatusBadge,
} from '@/features/recruitment/components/employer/ui';
import { useEmployerResource } from '@/features/recruitment/hooks/useEmployerResource';
import { EMPLOYER_ROUTES } from '@/app/routes';
import { getEmployerContext } from '@/features/recruitment/services/employer/employerService';
import { formatEmployerDate, formatEmployerTime } from '@/features/recruitment/utils/employerFormat';
import { getPipeline } from '@/features/recruitment/services/employer/pipelineService';
import type { PipelineStage } from '@/features/recruitment/types/employer';
import { cn } from '@/shared/utils/cn';

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
        breadcrumb={t('header.breadcrumb', 'RECRUITMENT')}
        title={t('pipeline.title', 'Recruitment pipeline')}
        description={t('pipeline.subtitle', 'Review candidates by their current recruitment stage.')}
      />

      {/* Filter Tabs Bar */}
      <section className={cn('mt-6 flex min-h-[52px] flex-wrap items-center gap-1.5 p-2 bg-white', employerCardClass)}>
        {pipeline.filters.map((filter) => {
          const active = filter.id === selectedStage;
          return (
            <button
              key={filter.id}
              type="button"
              aria-pressed={active}
              onClick={() => setSelectedStage(filter.id)}
              className={cn(
                'flex h-[38px] items-center rounded-full px-4 text-[13px] font-semibold transition cursor-pointer',
                active
                  ? 'bg-[#3A0353] text-white shadow-sm'
                  : 'text-[#475569] hover:bg-[#F8F2FC] hover:text-[#3A0353]',
              )}
            >
              {t(`pipeline.filters.${filter.id}`, { count: filter.count, defaultValue: `${filter.id} ${filter.count}` })}
            </button>
          );
        })}
      </section>

      {/* Filtered Stage Header Card */}
      <section className={cn('mt-5 flex min-h-[96px] flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between', employerCardClass)}>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold tracking-[1.4px] text-[#7C3AED] uppercase">
            {t('pipeline.stageEyebrow', 'FILTERED STAGE')}
          </p>
          <h2 className="mt-1 text-[22px] font-bold leading-tight text-[#111827]">{stageName}</h2>
          <p className="mt-1 text-[13px] text-[#64748B]">{stageSummary}</p>
        </div>
        {selectedStage === 'interview' && pipeline.records.length > 0 ? (
          <Link
            to={EMPLOYER_ROUTES.scheduleInterview(pipeline.records[0].id)}
            className={cn(employerPrimaryButtonClass, 'self-start sm:self-auto')}
          >
            {t('pipeline.schedule', 'Schedule Interview')}
          </Link>
        ) : null}
      </section>

      {/* Candidates Pipeline Table Card */}
      <section className={cn('mt-5 overflow-hidden', employerCardClass)}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] border-collapse text-start">
            <thead>
              <tr className="border-b border-[#E9DCF8] bg-[#FAF7FD] text-[11px] font-bold tracking-[0.5px] text-[#64748B] uppercase">
                <th className="px-6 py-3.5 text-start font-bold">{t('pipeline.columns.candidate', 'CANDIDATE')}</th>
                <th className="px-6 py-3.5 text-start font-bold">{t('pipeline.columns.opportunity', 'OPPORTUNITY')}</th>
                <th className="px-6 py-3.5 text-start font-bold">{t('pipeline.columns.interview', 'INTERVIEW')}</th>
                <th className="px-6 py-3.5 text-start font-bold">{t('pipeline.columns.status', 'STATUS')}</th>
                <th className="px-6 py-3.5 text-start font-bold">{t('pipeline.columns.actions', 'ACTIONS')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9DCF8]">
              {pipeline.records.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-14">
                    <div className="flex flex-col items-center text-center">
                      <span className="flex size-12 items-center justify-center rounded-full bg-[#F1E8FA] text-[#804A8A]">
                        <SearchX className="size-6" strokeWidth={1.7} />
                      </span>
                      <p className="mt-3 text-[14px] font-bold text-[#111827]">{t('pipeline.emptyTitle', 'No candidates in this stage')}</p>
                      <p className="mt-1 max-w-sm text-[13px] text-[#64748B]">
                        {t('pipeline.emptyBody', { count, defaultValue: 'There are currently no candidates matching this recruitment filter.' })}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                pipeline.records.map((record) => (
                  <tr key={record.id} className="hover:bg-[#FAF7FD]/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#925DA8_0%,#C592FB_100%)] text-[13px] font-bold text-white shadow-sm">
                          {record.candidate.initials}
                        </span>
                        <div className="min-w-0">
                          <span className="block truncate text-[14px] font-bold text-[#111827]">
                            {record.candidate.name}
                          </span>
                          <span className="mt-0.5 block text-[12px] text-[#64748B]">
                            {t('candidate.summary', {
                              percent: record.candidate.matchPercent,
                              cohort: record.candidate.cohort,
                              defaultValue: `${record.candidate.matchPercent}% · Cohort ${record.candidate.cohort}`,
                            })}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="block text-[14px] font-semibold text-[#111827]">{record.opportunity.title}</span>
                      <span className="mt-0.5 block text-[12px] text-[#64748B]">
                        {t('pipeline.opportunityMeta', {
                          type: t(`meta.${record.opportunity.typeKey}`),
                          mode: t(`meta.${record.opportunity.modeKey}`),
                          duration: t('meta.duration', { count: record.opportunity.durationMonths }),
                          defaultValue: `${record.opportunity.typeKey} · ${record.opportunity.modeKey} · ${record.opportunity.durationMonths} months`,
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {record.interview ? (
                        <div>
                          <span className="flex items-center gap-1.5 text-[14px] font-medium text-[#111827]">
                            <CalendarDays className="size-4 text-[#804A8A]" strokeWidth={1.8} />
                            {formatEmployerDate(record.interview.date, i18n.language)}
                          </span>
                          <span className="mt-0.5 block text-[12px] text-[#64748B]">
                            {formatEmployerTime(record.interview.startTime, i18n.language)} •{' '}
                            {record.interview.timezone} • {record.interview.mode}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[13px] text-[#94A3B8]">{t('common.notProvided', 'Not scheduled')}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge tone="info">{t('status.scheduled', 'Scheduled')}</StatusBadge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          to={EMPLOYER_ROUTES.scheduleInterview(record.id)}
                          className="text-[13px] font-semibold text-[#7C3AED] hover:underline"
                        >
                          {t('pipeline.viewInterview', 'View interview')}
                        </Link>
                        <Link
                          to={EMPLOYER_ROUTES.decision(record.id)}
                          className="rounded-full border border-[#D8C6E8] bg-white px-3.5 py-1.5 text-[13px] font-semibold text-[#111827] transition hover:bg-[#F8F2FC]"
                        >
                          {t('pipeline.recordDecision', 'Record decision')}
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

