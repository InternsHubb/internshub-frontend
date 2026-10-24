import { ArrowRight, CheckCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

import { EmployerJobCard } from '@/components/employer/EmployerJobCard';
import { EmployerPageHeader } from '@/components/employer/EmployerPageHeader';
import {
  employerCardClass,
  employerPrimaryButtonClass,
  EmployerError,
  EmployerLoading,
  StatusBadge,
} from '@/components/employer/ui';
import { EMPLOYER_ROUTES } from '@/constants/routes';
import { useEmployerResource } from '@/hooks/useEmployerResource';
import { getDecision } from '@/lib/employer/decisionService';
import { getEmployerContext } from '@/lib/employer/employerService';
import { cn } from '@/lib/cn';

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
        breadcrumb={t('header.breadcrumb')}
        title={t('submitted.title')}
        description={t('submitted.subtitle')}
        status={<StatusBadge tone="warning">{t('status.awaitingAdmin')}</StatusBadge>}
      />

      <section className={cn('mt-7 flex min-h-[270px] flex-col px-5 pb-6 pt-[50px]', employerCardClass)}>
        <div className="flex justify-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-[#DFF8ED] text-[#087A50]">
            <CheckCheck className="size-7" strokeWidth={2} />
          </span>
        </div>
        <p className="mt-5 text-[8px] font-bold tracking-[1.3px] text-[#3A0353] uppercase">
          {t('submitted.eyebrow')}
        </p>
        <h2 className="mt-2 max-w-[560px] text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[#111827]">
          {t('submitted.heading')}
        </h2>
        <p className="mx-auto mt-4 max-w-[530px] text-center text-[10px] leading-[17px] text-[#475569]">
          {t('submitted.body')}
        </p>
      </section>

      <div className="mt-4">
        <EmployerJobCard candidate={context.candidate} opportunity={context.opportunity} />
      </div>

      <section className={cn('mt-4 flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center', employerCardClass)}>
        <div className="min-w-0 flex-1">
          <h2 className="text-[12px] font-bold text-[#111827]">{t('submitted.nextTitle')}</h2>
          <p className="mt-1 text-[9px] leading-4 text-[#475569]">{t('submitted.nextBody')}</p>
        </div>
        <Link
          to={EMPLOYER_ROUTES.pipeline}
          className={cn(employerPrimaryButtonClass, 'self-start whitespace-nowrap sm:self-auto')}
        >
          {t('submitted.return')}
          <ArrowRight className="size-3.5 rtl:rotate-180" strokeWidth={2} />
        </Link>
      </section>
    </div>
  );
}
