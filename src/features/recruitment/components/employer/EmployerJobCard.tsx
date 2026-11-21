import { useTranslation } from 'react-i18next';

import { formatEmployerDate } from '@/features/recruitment/utils/employerFormat';
import type { Candidate, Opportunity } from '@/features/recruitment/types/employer';
import { cn } from '@/shared/utils/cn';

type EmployerJobCardProps = {
  candidate: Candidate;
  opportunity: Opportunity;
};

export function EmployerJobCard({ candidate, opportunity }: EmployerJobCardProps) {
  const { t, i18n } = useTranslation();
  const startLabel = t('meta.starts', {
    date: formatEmployerDate(opportunity.startDate, i18n.language),
  });
  const meta = [
    t(`meta.${opportunity.typeKey}`),
    t(`meta.${opportunity.modeKey}`),
    t('meta.duration', { count: opportunity.durationMonths }),
    startLabel,
  ].join(' • ');

  return (
    <section className={cn('flex flex-col gap-4 rounded-[22px] border border-[#E9DCF8] bg-white p-5 shadow-[0_12px_32px_rgba(58,3,83,0.06)] sm:flex-row sm:items-center sm:justify-between')}>
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex size-13 shrink-0 items-center justify-center rounded-[16px] bg-[linear-gradient(145deg,#0891B2_0%,#22B8CF_100%)] text-[18px] font-bold text-white shadow-[0_8px_16px_rgba(8,145,178,0.2)]">
          {opportunity.companyInitials}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[16px] font-bold text-[#111827] sm:text-[17px]">{opportunity.title}</h2>
          <p className="mt-0.5 truncate text-[14px] text-[#475569]">
            {opportunity.company} · {opportunity.location}
          </p>
          <p className="mt-1.5 truncate text-[12px] text-[#64748B] sm:text-[13px]">{meta}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3 border-t border-[#E9DCF8] pt-3 sm:border-s sm:border-t-0 sm:ps-5 sm:pt-0">
        <span className="flex size-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#925DA8_0%,#C592FB_100%)] text-[13px] font-bold text-white shadow-sm">
          {candidate.initials}
        </span>
        <span className="flex flex-col">
          <span className="text-[14px] font-bold text-[#111827]">{candidate.name}</span>
          <span className="text-[12px] text-[#64748B]">
            {t('candidate.summary', { percent: candidate.matchPercent, cohort: candidate.cohort })}
          </span>
        </span>
      </div>
    </section>
  );
}

