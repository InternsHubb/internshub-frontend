import { AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '@/app/routes';
import { RECRUITMENT_CARD, RECRUITMENT_PRIMARY_BUTTON } from '@/features/recruitment/components/student/ui';

export function RecruitmentLoading() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[52vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-[#706B80]">
        <div
          role="status"
          aria-label={t('recruitment.common.loading')}
          className="size-8 animate-spin rounded-full border-[3px] border-[#8B5CF6] border-t-transparent"
        />
        <p className="text-xs">{t('recruitment.common.loading')}</p>
      </div>
    </div>
  );
}

export function RecruitmentNotFound() {
  const { t } = useTranslation();

  return (
    <div className={`${RECRUITMENT_CARD} mt-6 p-8 text-center`}>
      <AlertCircle className="mx-auto size-8 text-[#A05A08]" aria-hidden="true" />
      <h1 className="mt-3 text-lg font-semibold text-[#151326]">
        {t('recruitment.common.notFoundTitle')}
      </h1>
      <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#706B80]">
        {t('recruitment.common.notFoundBody')}
      </p>
      <Link to={ROUTES.recruitmentEligibility} className={`${RECRUITMENT_PRIMARY_BUTTON} mt-5`}>
        {t('recruitment.common.backToEligibility')}
      </Link>
    </div>
  );
}
