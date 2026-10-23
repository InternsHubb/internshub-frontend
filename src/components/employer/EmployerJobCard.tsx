import { useTranslation } from 'react-i18next';

import { formatEmployerDate } from '@/lib/employer/format';
import type { Candidate, Opportunity } from '@/lib/employer/types';
import { cn } from '@/lib/cn';

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
    <section className={cn('flex min-h-[105px] items-center gap-4 rounded-[18px] border border-[#E9DCF8] bg-white p-4')}>
      <div className="flex size-12 shrink-0 items-center justify-center rounded-[14px] bg-[linear-gradient(145deg,#0891B2_0%,#22B8CF_100%)] text-[11px] font-bold text-white shadow-[0_8px_16px_rgba(8,145,178,0.18)]">
        {opportunity.companyInitials}
      </div>

      <div className="min-w-0 flex-1">
        <h2 className="truncate text-[12px] font-bold text-[#111827]">{opportunity.title}</h2>
        <p className="mt-0.5 truncate text-[12px] text-[#475569]">
          {opportunity.company} • {opportunity.location}
        </p>
        <p className="mt-2 truncate text-[10px] text-[#475569]">{meta}</p>
      </div>

      <div className="hidden shrink-0 items-center gap-2 border-s border-[#E9DCF8] ps-4 sm:flex">
        <span className="flex size-[34px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#925DA8_0%,#C592FB_100%)] text-[8px] font-bold text-white">
          {candidate.initials}
        </span>
        <span className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold text-[#111827]">{candidate.name}</span>
          <span className="text-[8px] text-[#475569]">
            {t('candidate.summary', { percent: candidate.matchPercent, cohort: candidate.cohort })}
          </span>
        </span>
      </div>
    </section>
  );
}
