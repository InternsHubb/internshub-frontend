import { useCallback } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/recruitment/PageHeader';
import { RecruitmentLoading, RecruitmentNotFound } from '@/components/recruitment/ResourceStates';
import { StatusBadge } from '@/components/recruitment/StatusBadge';
import {
  RECRUITMENT_CARD,
  RECRUITMENT_PRIMARY_BUTTON,
  RECRUITMENT_SECONDARY_BUTTON,
} from '@/components/recruitment/ui';
import { ROUTES } from '@/constants/routes';
import { useRecruitmentResource } from '@/hooks/useRecruitmentResource';
import { getEligibilityResult } from '@/lib/recruitment/eligibilityService';

function ScoreRing({ score }: { score: number }) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative flex size-[116px] items-center justify-center">
      <svg className="size-full -rotate-90" viewBox="0 0 116 116" aria-hidden="true">
        <circle
          cx="58"
          cy="58"
          r={radius}
          fill="none"
          stroke="#D9C9E6"
          strokeWidth="8"
        />
        <circle
          cx="58"
          cy="58"
          r={radius}
          fill="none"
          stroke="url(#eligibility-score-gradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - score / 100)}
        />
        <defs>
          <linearGradient id="eligibility-score-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#D75568" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute text-[26px] font-semibold tracking-[-0.04em] text-[#151326]">
        {score}%
      </span>
    </div>
  );
}

export default function EligibilityPage() {
  const { t } = useTranslation();
  const load = useCallback(() => getEligibilityResult(), []);
  const { data, isLoading, isError } = useRecruitmentResource(load);

  if (isLoading) return <RecruitmentLoading />;
  if (isError || !data) return <RecruitmentNotFound />;

  const pointsBelow = Math.max(data.threshold - data.score, 0);

  return (
    <div className="flex flex-col lg:min-h-[calc(100vh-7.5rem)]">
      <PageHeader
        title={t('recruitment.eligibility.title')}
        subtitle={t('recruitment.eligibility.subtitle')}
        status={
          <StatusBadge tone={data.isEligible ? 'success' : 'danger'}>
            {data.isEligible
              ? t('recruitment.eligibility.statusEligible')
              : t('recruitment.eligibility.statusNotEligible')}
          </StatusBadge>
        }
      />

      <section
        className={`${RECRUITMENT_CARD} mt-5 flex flex-col gap-5 p-4 sm:flex-row sm:items-center sm:gap-7 sm:p-5`}
      >
        <div className="flex size-[166px] shrink-0 flex-col items-center justify-center self-center rounded-2xl bg-[#F3ECFA] sm:self-auto">
          <ScoreRing score={data.score} />
          <p className="mt-1 text-[10px] font-medium text-[#706B80]">
            {t('recruitment.eligibility.sampleScore')}
          </p>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#7C3AED]">
            {t('recruitment.eligibility.eyebrow', { name: data.applicant.name })}
          </p>
          <h2 className="mt-2 text-lg font-semibold leading-6 text-[#151326]">
            {data.isEligible
              ? t('recruitment.eligibility.metTitle')
              : t('recruitment.eligibility.belowTitle', { points: pointsBelow })}
          </h2>
          <p className="mt-2 max-w-[790px] text-xs leading-5 text-[#706B80] sm:text-[13px]">
            {t('recruitment.eligibility.body', { threshold: data.threshold })}
          </p>

          <div className="mt-5 sm:mt-6">
            <div className="relative h-[7px] rounded-full bg-[#F1EFF8]">
              <div
                className="absolute inset-y-0 start-0 rounded-full bg-[linear-gradient(90deg,#8B5CF6_0%,#D75568_100%)]"
                style={{ width: `${data.score}%` }}
              />
              <span
                className="absolute top-1/2 h-3.5 w-0.5 -translate-y-1/2 rounded-full bg-[#151326]"
                style={{ insetInlineStart: `${data.threshold}%` }}
                aria-hidden="true"
              />
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[10px] text-[#706B80] sm:text-[11px]">
              <span>{t('recruitment.eligibility.sampleValue', { score: data.score })}</span>
              <span>
                {t('recruitment.eligibility.thresholdValue', { threshold: data.threshold })}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 lg:mt-auto lg:pt-10">
        <div className="grid gap-4 md:grid-cols-3">
          {data.reasons.map((reason, index) => (
            <article
              key={reason.id}
              className={`${RECRUITMENT_CARD} min-h-[158px] p-5`}
            >
              <span className="flex size-[34px] items-center justify-center rounded-xl bg-[#F0E9FF] text-[10px] font-bold text-[#7C3AED]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-4 text-sm font-semibold text-[#151326]">
                {t(`recruitment.eligibility.reasons.${reason.id}.title`)}
              </h3>
              <p className="mt-1.5 text-xs leading-5 text-[#706B80]">
                {t(`recruitment.eligibility.reasons.${reason.id}.body`)}
              </p>
            </article>
          ))}
        </div>

        <section
          className={`${RECRUITMENT_CARD} mt-4 flex min-h-[90px] flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between`}
        >
          <div>
            <h2 className="text-sm font-semibold text-[#151326]">
              {t('recruitment.eligibility.nextTitle')}
            </h2>
            <p className="mt-1 max-w-[680px] text-xs leading-5 text-[#706B80]">
              {t('recruitment.eligibility.nextBody')}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to={ROUTES.recruitmentTalentDirectory}
              className={RECRUITMENT_PRIMARY_BUTTON}
            >
              {t('recruitment.eligibility.actions.consent')}
              <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden="true" />
            </Link>
            <Link to={ROUTES.internship} className={RECRUITMENT_SECONDARY_BUTTON}>
              {t('recruitment.eligibility.actions.dashboard')}
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
