import { useTranslation } from 'react-i18next';

import clockIcon from '@/assets/dashboard/ic-clock-lg.svg';
import illustration from '@/assets/dashboard/illus-interview-review.png';
import { CARD_LARGE } from '@/features/internships/components/primitives';

export function InterviewReviewView() {
  const { t } = useTranslation();
  return (
    <section aria-labelledby="interview-review-title" className="flex flex-col items-center pt-4 text-center">
      <img src={illustration} alt="" className="h-auto w-full max-w-[500px]" />
      <h1 id="interview-review-title" className="text-[28px] font-semibold leading-tight text-black sm:text-[32px]">
        {t('dashboard.review.title')}
      </h1>
      <p className="mt-5 text-lg font-bold text-[#8e8e8e] sm:text-2xl">{t('dashboard.review.description')}</p>
      <div className={`${CARD_LARGE} mt-6 flex w-full max-w-[842px] flex-col items-center gap-4 px-6 py-8`}>
        <img src={clockIcon} alt="" className="h-auto w-8" />
        <p className="text-base font-bold text-[#828282]">{t('dashboard.review.expected')}</p>
      </div>
    </section>
  );
}
