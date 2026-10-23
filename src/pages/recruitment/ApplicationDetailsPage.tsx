import { useCallback } from 'react';
import type { ComponentType } from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  MinusCircle,
  XCircle,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/recruitment/PageHeader';
import { RecruitmentLoading, RecruitmentNotFound } from '@/components/recruitment/ResourceStates';
import { StatusBadge } from '@/components/recruitment/StatusBadge';
import type { StatusTone } from '@/components/recruitment/StatusBadge';
import {
  RECRUITMENT_CARD,
  RECRUITMENT_PRIMARY_BUTTON,
  RECRUITMENT_SECONDARY_BUTTON,
} from '@/components/recruitment/ui';
import {
  ROUTES,
  recruitmentAgreementPath,
} from '@/constants/routes';
import { useRecruitmentResource } from '@/hooks/useRecruitmentResource';
import { getApplicationById } from '@/lib/recruitment/applicationService';
import { DEFAULT_APPLICATION_ID } from '@/lib/recruitment/data';
import { formatRecruitmentDate } from '@/lib/recruitment/format';
import type {
  ApplicationAction,
  ApplicationStatus,
  ApplicationTimeline,
} from '@/lib/recruitment/types';

type IconComponent = ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;

const STATUS_STYLES: Record<
  ApplicationStatus,
  {
    tone: StatusTone;
    icon: IconComponent;
    border: string;
    iconBg: string;
    iconText: string;
  }
> = {
  declined: {
    tone: 'danger',
    icon: XCircle,
    border: 'border-[#F0C7CD]',
    iconBg: 'bg-[#FFE5E8]',
    iconText: 'text-[#B42331]',
  },
  selected: {
    tone: 'success',
    icon: CheckCircle2,
    border: 'border-[#BCEAD5]',
    iconBg: 'bg-[#DFF8ED]',
    iconText: 'text-[#087A50]',
  },
  'not-selected': {
    tone: 'neutral',
    icon: MinusCircle,
    border: 'border-[#E3E0E9]',
    iconBg: 'bg-[#EFEDF3]',
    iconText: 'text-[#666070]',
  },
};

function Timeline({
  timeline,
  stages,
}: {
  timeline: ApplicationTimeline;
  stages: string[];
}) {
  const { t } = useTranslation();
  const totalSegments = Math.max(timeline.totalSegments, 1);
  const activeSegments = Math.min(Math.max(timeline.activeSegments, 0), totalSegments);
  const completedStages = Math.min(Math.max(timeline.completedStages, 0), stages.length);

  return (
    <section className={`${RECRUITMENT_CARD} mt-4 p-4 sm:p-5`}>
      <h2 className="text-sm font-semibold text-[#151326]">
        {t('recruitment.application.timelineTitle')}
      </h2>

      <div className="mt-5 overflow-x-auto pb-1">
        <div className="min-w-[720px]">
          <div className="relative">
            <div
              className="absolute top-4 flex h-0.5 gap-[3px]"
              style={{ left: '8.333%', right: '8.333%' }}
              aria-hidden="true"
            >
              {Array.from({ length: totalSegments }).map((_, index) => (
                <span
                  key={index}
                  className={`h-full flex-1 rounded-full ${
                    index < activeSegments ? 'bg-[#7C3AED]' : 'bg-[#E7E4EF]'
                  }`}
                />
              ))}
            </div>

            <ol className="relative grid grid-cols-6">
              {stages.map((stage, index) => {
                const isComplete = index < completedStages;

                return (
                  <li key={stage} className="flex flex-col items-center">
                    <span
                      className={`flex size-8 items-center justify-center rounded-full border-2 ${
                        isComplete
                          ? 'border-[#7C3AED] bg-[#7C3AED] text-white'
                          : 'border-[#E0DCE9] bg-white text-transparent'
                      }`}
                    >
                      {isComplete ? (
                        <Check className="size-4" aria-hidden="true" />
                      ) : (
                        <span className="size-1.5 rounded-full bg-[#C8C3D2]" />
                      )}
                    </span>
                    <span
                      className={`mt-2 px-1 text-center text-[10px] leading-4 ${
                        isComplete
                          ? 'font-semibold text-[#5C1D87]'
                          : 'font-medium text-[#928CA1]'
                      }`}
                    >
                      {t(`recruitment.application.stages.${stage}`)}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function NextAction({ action }: { action: ApplicationAction }) {
  const { t } = useTranslation();

  if (action.kind === 'agreement' && action.agreementId) {
    return (
      <Link
        to={recruitmentAgreementPath(action.agreementId)}
        className={RECRUITMENT_PRIMARY_BUTTON}
      >
        {t(action.labelKey)}
        <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden="true" />
      </Link>
    );
  }

  if (action.kind === 'applications') {
    return (
      <Link to={ROUTES.recruitmentApplications} className={RECRUITMENT_SECONDARY_BUTTON}>
        {t(action.labelKey)}
        <Clock className="size-3.5" aria-hidden="true" />
      </Link>
    );
  }

  return (
    <Link to={ROUTES.internship} className={RECRUITMENT_SECONDARY_BUTTON}>
      {t(action.labelKey)}
      <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden="true" />
    </Link>
  );
}

export default function ApplicationDetailsPage() {
  const { t, i18n } = useTranslation();
  const { applicationId = DEFAULT_APPLICATION_ID } = useParams();
  const load = useCallback(() => getApplicationById(applicationId), [applicationId]);
  const { data, isLoading, isError } = useRecruitmentResource(load);

  if (isLoading) return <RecruitmentLoading />;
  if (isError || !data) return <RecruitmentNotFound />;

  const styles = STATUS_STYLES[data.status];
  const StatusIcon = styles.icon;
  const startDate = formatRecruitmentDate(data.job.startDate, i18n.language);

  return (
    <>
      <PageHeader
        title={t(`recruitment.application.title.${data.status}`)}
        subtitle={t('recruitment.application.subtitle')}
        status={
          <StatusBadge tone={styles.tone}>
            {t(`recruitment.application.badge.${data.status}`)}
          </StatusBadge>
        }
      />

      <section
        className={`${RECRUITMENT_CARD} mt-5 flex min-h-[107px] items-center gap-3 p-4 sm:gap-4 sm:p-5`}
      >
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#0891B2_0%,#22B8CF_100%)] text-[13px] font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
          {data.job.companyInitials}
        </span>
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-[#151326] sm:text-base">
            {data.job.title}
          </h2>
          <p className="mt-1 truncate text-[11px] text-[#706B80]">
            {data.job.company}
            <span className="mx-1.5 text-[#B8B1C4]">•</span>
            {data.job.location}
          </p>
          <p className="mt-1 truncate text-[10px] text-[#928CA1] sm:text-[11px]">
            {t(`recruitment.application.meta.employmentType.${data.job.employmentType}`)}
            <span className="mx-1.5 text-[#C8C3D2]">•</span>
            {t(`recruitment.application.meta.workMode.${data.job.workMode}`)}
            <span className="mx-1.5 text-[#C8C3D2]">•</span>
            {t('recruitment.application.meta.duration', {
              count: data.job.durationMonths,
            })}
            <span className="mx-1.5 text-[#C8C3D2]">•</span>
            {t('recruitment.application.meta.start', { date: startDate })}
          </p>
        </div>
      </section>

      <section
        className={`mt-4 flex min-h-[98px] items-center gap-4 rounded-2xl border-2 bg-white p-4 sm:p-5 ${styles.border}`}
      >
        <span
          className={`flex size-[42px] shrink-0 items-center justify-center rounded-full ${styles.iconBg} ${styles.iconText}`}
        >
          <StatusIcon className="size-5" aria-hidden={true} />
        </span>
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold text-[#151326] sm:text-base">
            {t(`recruitment.application.title.${data.status}`)}
          </h2>
          <p className="mt-1 text-xs leading-5 text-[#706B80]">
            {t(`recruitment.application.message.${data.status}`, {
              company: data.job.company,
            })}
          </p>
        </div>
      </section>

      <Timeline timeline={data.timeline} stages={data.stages} />

      <section
        className={`${RECRUITMENT_CARD} mt-4 flex min-h-[90px] flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between`}
      >
        <div>
          <h2 className="text-sm font-semibold text-[#151326]">
            {t('recruitment.application.nextTitle')}
          </h2>
          <p className="mt-1 max-w-[760px] text-xs leading-5 text-[#706B80]">
            {t(`recruitment.application.next.${data.status}`)}
          </p>
        </div>
        <NextAction action={data.action} />
      </section>
    </>
  );
}
