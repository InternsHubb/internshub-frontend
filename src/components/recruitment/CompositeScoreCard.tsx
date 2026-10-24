import { useTranslation } from 'react-i18next';

import { CURRENT_APPLICANT } from '@/lib/recruitment/data';

// Sidebar footer card "Composite Score" of the student recruitment flow (Figma
// "01 - Recruitment Dashboard" and siblings, 50:47444): score, percentile pill, progress bar
// and visibility status. RecruitmentLayout passes it to the shared Sidebar's footer slot; the
// internship pages use "Required Courses Progress" there instead.
export function CompositeScoreCard() {
  const { t } = useTranslation();
  const score = CURRENT_APPLICANT.compositeScore;

  return (
    <div className="rounded-[24px] border border-white/20 bg-[linear-gradient(145deg,rgba(91,30,130,0.9),rgba(48,0,75,0.92))] p-4 text-white shadow-[0_18px_38px_-22px_rgba(12,4,24,0.65),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-[#F1E7F7]">{t('recruitment.shell.compositeScore')}</span>
        <span className="rounded-full bg-white/20 px-3 py-1 text-[12px] font-bold text-white">{CURRENT_APPLICANT.percentile}</span>
      </div>
      <p className="mt-3 text-[36px] font-bold leading-none">{score}%</p>
      <div
        role="progressbar"
        aria-label={t('recruitment.shell.compositeScore')}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={score}
        className="mt-3 h-2 overflow-hidden rounded-full bg-white/25"
      >
        <div className="h-full rounded-full bg-white" style={{ width: `${score}%` }} />
      </div>
      <p className="mt-3 flex items-center gap-2 text-[12px] leading-5">
        <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-[#39E77D]" />
        {t('recruitment.shell.profileVisible')}
      </p>
    </div>
  );
}

export default CompositeScoreCard;
