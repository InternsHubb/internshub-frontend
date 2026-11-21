import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { LockKeyhole, ShieldCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';

import { EmployerJobCard } from '@/features/recruitment/components/employer/EmployerJobCard';
import { EmployerPageHeader } from '@/features/recruitment/components/employer/EmployerPageHeader';
import {
  employerCardClass,
  employerLabelClass,
  employerPrimaryButtonClass,
  employerSecondaryButtonClass,
  employerTextareaClass,
  EmployerError,
  EmployerLoading,
  StatusBadge,
} from '@/features/recruitment/components/employer/ui';
import { EMPLOYER_ROUTES } from '@/app/routes';
import { useEmployerResource } from '@/features/recruitment/hooks/useEmployerResource';
import { getDecision, submitDecision } from '@/features/recruitment/services/employer/decisionService';
import { getEmployerContext } from '@/features/recruitment/services/employer/employerService';
import type { EmployerDecision } from '@/features/recruitment/types/employer';
import { cn } from '@/shared/utils/cn';

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
      <div className={cn('mt-5 p-5 sm:p-7', employerCardClass)}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-bold tracking-[1.4px] text-[#7C3AED] uppercase">
              {t('decision.eyebrow', 'CANDIDATE DECISION')}
            </p>
            <h2 className="mt-2 text-[20px] font-bold leading-tight text-[#111827] sm:text-[22px]">
              {t('decision.heading', 'Choose an outcome')}
            </h2>
          </div>
          <StatusBadge tone="warning">{t('decision.adminBadge', 'Admin confirmation required')}</StatusBadge>
        </div>

        <fieldset className="mt-6">
          <legend className="sr-only">{t('decision.heading')}</legend>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label
              className={cn(
                'flex cursor-pointer items-start gap-4 rounded-[16px] border-2 p-5 transition',
                outcome === 'select'
                  ? 'border-[#22C55E] bg-[#F0FDF4] shadow-sm'
                  : 'border-[#E9DCF8] bg-white hover:bg-[#FAF7FD]',
              )}
            >
              <input
                type="radio"
                value="select"
                className="sr-only"
                {...register('outcome')}
              />
              <span
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A]"
                aria-hidden="true"
              >
                <ShieldCheck className="size-5" />
              </span>
              <div>
                <span className="block text-[15px] font-bold text-[#111827]">{t('decision.selectTitle', 'Select Candidate')}</span>
                <span className="mt-1 block text-[13px] leading-relaxed text-[#64748B]">
                  {t('decision.selectBody', { name: candidateName, defaultValue: `Recommend ${candidateName} for this opportunity.` })}
                </span>
              </div>
            </label>

            <label
              className={cn(
                'flex cursor-pointer items-start gap-4 rounded-[16px] border-2 p-5 transition',
                outcome === 'reject'
                  ? 'border-[#EF4444] bg-[#FEF2F2] shadow-sm'
                  : 'border-[#E9DCF8] bg-white hover:bg-[#FAF7FD]',
              )}
            >
              <input
                type="radio"
                value="reject"
                className="sr-only"
                {...register('outcome')}
              />
              <span
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#FEE2E2] text-[#DC2626]"
                aria-hidden="true"
              >
                <LockKeyhole className="size-5" />
              </span>
              <div>
                <span className="block text-[15px] font-bold text-[#111827]">{t('decision.rejectTitle', 'Reject Candidate')}</span>
                <span className="mt-1 block text-[13px] leading-relaxed text-[#64748B]">{t('decision.rejectBody', 'Recommend closing this candidate application.')}</span>
              </div>
            </label>
          </div>
        </fieldset>

        <div className="mt-6">
          <label htmlFor="decision-reason" className={employerLabelClass}>
            {t('decision.reasonLabel', 'Decision reason')} <span className="text-[#EF4444]">*</span>
          </label>
          <textarea
            id="decision-reason"
            placeholder={t('decision.reasonPlaceholder', 'Provide a clear reason for InternsHub Admin...')}
            className={cn(employerTextareaClass, 'mt-2 min-h-[96px]')}
            aria-invalid={Boolean(errors.reason)}
            {...register('reason')}
          />
          {errors.reason?.message ? (
            <p className="mt-1.5 text-[12px] text-[#B42331]">{errors.reason.message}</p>
          ) : null}
        </div>

        <div className="mt-5 rounded-[14px] border border-[#E9D5FF] bg-[#FAF5FF] p-4 text-[#581C87]">
          <p className="text-[13px] font-bold text-[#581C87]">{t('decision.internalOnly', 'Internal only')}</p>
          <p className="mt-1 text-[13px] leading-relaxed text-[#6B21A8]">
            {t('decision.internalBody', 'This reason is shared with InternsHub Admin and is not exposed to the student as internal notes.')}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button type="submit" className={employerPrimaryButtonClass} disabled={isSubmitting}>
            <ShieldCheck className="size-4" strokeWidth={2} />
            {t('decision.review', 'Review Decision')}
          </button>
          <button
            type="button"
            onClick={() => navigate(EMPLOYER_ROUTES.pipeline)}
            className={employerSecondaryButtonClass}
          >
            {t('common.cancel', 'Cancel')}
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

