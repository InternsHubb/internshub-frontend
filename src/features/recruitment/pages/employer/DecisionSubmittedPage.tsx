import { ArrowRight, CheckCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

import { EmployerJobCard } from '@/features/recruitment/components/employer/EmployerJobCard';
import { EmployerPageHeader } from '@/features/recruitment/components/employer/EmployerPageHeader';
import {
  employerCardClass,
  employerPrimaryButtonClass,
  EmployerError,
  EmployerLoading,
  StatusBadge,
} from '@/features/recruitment/components/employer/ui';
import { EMPLOYER_ROUTES } from '@/app/routes';
import { useEmployerResource } from '@/features/recruitment/hooks/useEmployerResource';
import { getDecision } from '@/features/recruitment/services/employer/decisionService';
import { getEmployerContext } from '@/features/recruitment/services/employer/employerService';
import { cn } from '@/shared/utils/cn';

export function DecisionSubmittedPage() {
  const { t } = useTranslation();
  const { applicationId = '' } = useParams();

  const { data, loading, error, reload } = useEmployerResource(
    () => Promise.all([getEmployerContext(), getDecision(applicationId)]),
    [applicationId],
  );

  if (loading) return <EmployerLoading label={t('common.loading')} />;
  if (error || !data) {
    return <EmployerError label={t('common.error')} retryLabel={t('common.retry')} onRetry={reload} />;
  }

  const [context] = data;

  return (
    <div>
      <EmployerPageHeader
        breadcrumb={t('header.breadcrumb', 'RECRUITMENT')}
        title={t('submitted.title', 'Decision submitted')}
        description={t('submitted.subtitle', 'Your recommendation has been sent to InternsHub.')}
        status={<StatusBadge tone="warning">{t('status.awaitingAdmin', 'Awaiting InternsHub confirmation')}</StatusBadge>}
      />

      <section className={cn('mt-6 flex min-h-[260px] flex-col items-center justify-center p-8 text-center', employerCardClass)}>
        <span className="flex size-16 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A] shadow-sm">
          <CheckCheck className="size-8" strokeWidth={2.2} />
        </span>
        <p className="mt-5 text-[11px] font-bold tracking-[1.4px] text-[#7C3AED] uppercase">
          {t('submitted.eyebrow', 'SUBMITTED SUCCESSFULLY')}
        </p>
        <h2 className="mt-2 text-[24px] font-bold leading-tight tracking-[-0.02em] text-[#111827]">
          {t('submitted.heading', 'Awaiting InternsHub confirmation')}
        </h2>
        <p className="mt-3 max-w-[560px] text-[14px] leading-relaxed text-[#64748B]">
          {t('submitted.body', 'The Admin team must review and confirm the employer recommendation before any placement is considered confirmed.')}
        </p>
      </section>

      <div className="mt-5">
        <EmployerJobCard candidate={context.candidate} opportunity={context.opportunity} />
      </div>

      <section className={cn('mt-5 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between', employerCardClass)}>
        <div className="min-w-0 flex-1">
          <h2 className="text-[16px] font-bold text-[#111827]">{t('submitted.nextTitle', 'What happens next?')}</h2>
          <p className="mt-1 text-[14px] leading-relaxed text-[#64748B]">{t('submitted.nextBody', 'InternsHub will review the decision, agreement readiness, and required process. You will be notified when the outcome changes.')}</p>
        </div>
        <Link
          to={EMPLOYER_ROUTES.pipeline}
          className={cn(employerPrimaryButtonClass, 'self-start whitespace-nowrap sm:self-auto')}
        >
          {t('submitted.return', 'Return to Pipeline')}
          <ArrowRight className="size-4 rtl:rotate-180" strokeWidth={2} />
        </Link>
      </section>
    </div>
  );
}

