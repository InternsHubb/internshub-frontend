import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { LockKeyhole, ShieldCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';

import { EmployerJobCard } from '@/components/employer/EmployerJobCard';
import { EmployerPageHeader } from '@/components/employer/EmployerPageHeader';
import {
  employerCardClass,
  employerLabelClass,
  employerPrimaryButtonClass,
  employerSecondaryButtonClass,
  employerTextareaClass,
  EmployerError,
  EmployerLoading,
  StatusBadge,
} from '@/components/employer/ui';
import { EMPLOYER_ROUTES } from '@/constants/routes';
import { useEmployerResource } from '@/hooks/useEmployerResource';
import { getDecision, submitDecision } from '@/lib/employer/decisionService';
import { getEmployerContext } from '@/lib/employer/employerService';
import type { EmployerDecision } from '@/lib/employer/types';
import { cn } from '@/lib/cn';

type DecisionValues = {
  outcome: 'select' | 'reject';
  reason: string;
};

function DecisionForm({
  applicationId,
  decision,
  candidateName,
}: {
  applicationId: string;
  decision: EmployerDecision;
  candidateName: string;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const schema = useMemo(
    () =>
      z.object({
        outcome: z.enum(['select', 'reject']),
        reason: z.string().trim().min(1, t('decision.errors.reasonRequired')),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DecisionValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      outcome: decision.outcome,
      reason: decision.reason,
    },
  });

  const outcome = watch('outcome');

  const submit = handleSubmit(async (values) => {
    await submitDecision(applicationId, values.outcome, values.reason);
    navigate(EMPLOYER_ROUTES.decisionSubmitted(applicationId));
  });

  return (
    <form onSubmit={submit} noValidate>
      <div className={cn('mt-4 p-4 sm:p-5', employerCardClass)}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[8px] font-bold tracking-[1.2px] text-[#3A0353] uppercase">
              {t('decision.eyebrow')}
            </p>
            <h2 className="mt-2 text-[16px] font-bold leading-tight text-[#111827]">{t('decision.heading')}</h2>
          </div>
          <StatusBadge tone="warning">{t('decision.adminBadge')}</StatusBadge>
        </div>

        <fieldset className="mt-5">
          <legend className="sr-only">{t('decision.heading')}</legend>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <label
              className={cn(
                'flex cursor-pointer items-start gap-3 rounded-[12px] border px-4 py-3.5 transition',
                outcome === 'select'
                  ? 'border-[#5DC895] bg-[#F5FCF9] shadow-[0_0_0_1px_rgba(93,200,149,0.18)]'
                  : 'border-[#E9DCF8] bg-white hover:bg-[#FBF8FD]',
              )}
            >
              <input
                type="radio"
                value="select"
                className="sr-only"
                {...register('outcome')}
              />
              <span
                className={cn(
                  'mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-full border-2',
                  outcome === 'select' ? 'border-[#2FA66C] bg-[#2FA66C]' : 'border-[#C9BCD2] bg-white',
                )}
                aria-hidden="true"
              >
                {outcome === 'select' ? <span className="size-1.5 rounded-full bg-white" /> : null}
              </span>
              <span>
                <span className="block text-[10px] font-bold text-[#111827]">{t('decision.selectTitle')}</span>
                <span className="mt-1 block text-[8px] leading-[14px] text-[#475569]">
                  {t('decision.selectBody', { name: candidateName })}
                </span>
              </span>
            </label>

            <label
              className={cn(
                'flex cursor-pointer items-start gap-3 rounded-[12px] border px-4 py-3.5 transition',
                outcome === 'reject'
                  ? 'border-[#E78A94] bg-[#FFF7F8] shadow-[0_0_0_1px_rgba(231,138,148,0.16)]'
                  : 'border-[#E9DCF8] bg-white hover:bg-[#FBF8FD]',
              )}
            >
              <input
                type="radio"
                value="reject"
                className="sr-only"
                {...register('outcome')}
              />
              <span
                className={cn(
                  'mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-full border-2',
                  outcome === 'reject' ? 'border-[#C54857] bg-[#C54857]' : 'border-[#C9BCD2] bg-white',
                )}
                aria-hidden="true"
              >
                {outcome === 'reject' ? <span className="size-1.5 rounded-full bg-white" /> : null}
              </span>
              <span>
                <span className="block text-[10px] font-bold text-[#111827]">{t('decision.rejectTitle')}</span>
                <span className="mt-1 block text-[8px] leading-[14px] text-[#475569]">{t('decision.rejectBody')}</span>
              </span>
            </label>
          </div>
        </fieldset>

        <div className="mt-4">
          <label htmlFor="decision-reason" className={employerLabelClass}>
            {t('decision.reasonLabel')}
          </label>
          <textarea
            id="decision-reason"
            placeholder={t('decision.reasonPlaceholder')}
            className={cn(employerTextareaClass, 'mt-2 min-h-[66px]')}
            aria-invalid={Boolean(errors.reason)}
            {...register('reason')}
          />
          {errors.reason?.message ? (
            <p className="mt-1.5 text-[8px] text-[#B42331]">{errors.reason.message}</p>
          ) : null}
        </div>

        <div className="mt-4 flex gap-2.5 rounded-[10px] border border-[#E9DCF8] bg-[#F8F2FC] px-3 py-2.5">
          <LockKeyhole className="mt-0.5 size-3.5 shrink-0 text-[#3A0353]" strokeWidth={1.8} />
          <div>
            <p className="text-[9px] font-bold text-[#3A0353]">{t('decision.internalOnly')}</p>
            <p className="mt-0.5 text-[8px] leading-[14px] text-[#475569]">{t('decision.internalBody')}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="submit" className={employerPrimaryButtonClass} disabled={isSubmitting}>
            <ShieldCheck className="size-3.5" strokeWidth={2} />
            {t('decision.review')}
          </button>
          <button
            type="button"
            onClick={() => navigate(EMPLOYER_ROUTES.pipeline)}
            className={employerSecondaryButtonClass}
          >
            {t('common.cancel')}
          </button>
        </div>
      </div>
    </form>
  );
}

export function EmployerDecisionPage() {
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

  const [context, decision] = data;

  return (
    <div>
      <EmployerPageHeader
        breadcrumb={t('header.breadcrumb')}
        title={t('decision.title')}
        description={t('decision.subtitle')}
      />
      <div className="mt-7">
        <EmployerJobCard candidate={context.candidate} opportunity={context.opportunity} />
      </div>
      <DecisionForm
        applicationId={applicationId}
        decision={decision}
        candidateName={context.candidate.name}
      />
    </div>
  );
}

