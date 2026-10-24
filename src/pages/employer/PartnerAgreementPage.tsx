import { CircleCheck, FileWarning, LockKeyhole, ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';

import { EmployerJobCard } from '@/components/employer/EmployerJobCard';
import { EmployerPageHeader } from '@/components/employer/EmployerPageHeader';
import {
  employerCardClass,
  EmployerError,
  EmployerLoading,
  StatusBadge,
} from '@/components/employer/ui';
import { useEmployerResource } from '@/hooks/useEmployerResource';
import { getAgreement } from '@/lib/employer/agreementService';
import { getEmployerContext } from '@/lib/employer/employerService';
import type { AgreementParty } from '@/lib/employer/types';
import { cn } from '@/lib/cn';

function PartyRow({ party }: { party: AgreementParty }) {
  const { t } = useTranslation();
  const signed = party.status === 'signed';
  const meta =
    party.kind === 'employer'
      ? t('agreement.employerMeta', { name: party.signedBy })
      : signed
        ? t('agreement.studentSignedMeta')
        : t('agreement.studentPendingMeta');

  return (
    <div className="flex min-h-[67px] items-center gap-3 rounded-[12px] bg-[#F8F2FC] px-4 py-3">
      <span
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-full',
          signed ? 'bg-[#DFF8ED] text-[#087A50]' : 'bg-[#FFF1D7] text-[#A05A08]',
        )}
      >
        {signed ? <CircleCheck className="size-4" strokeWidth={2} /> : <LockKeyhole className="size-4" strokeWidth={1.8} />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12px] font-bold text-[#111827]">{party.name}</p>
        <p className="mt-1 text-[9px] text-[#475569]">{meta}</p>
      </div>
      <StatusBadge tone={signed ? 'success' : 'warning'}>
        {signed ? t('agreement.signed') : t('agreement.pending')}
      </StatusBadge>
    </div>
  );
}

export function PartnerAgreementPage() {
  const { t } = useTranslation();
  const { applicationId = '' } = useParams();
  const [searchParams] = useSearchParams();
  const signed = searchParams.get('state') === 'signed';

  const { data, loading, error, reload } = useEmployerResource(
    () => Promise.all([getEmployerContext(), getAgreement(applicationId, signed)]),
    [applicationId, signed],
  );

  if (loading) return <EmployerLoading label={t('common.loading')} />;
  if (error || !data) {
    return <EmployerError label={t('common.error')} retryLabel={t('common.retry')} onRetry={reload} />;
  }

  const [context, agreement] = data;
  const student = agreement.parties.find((party) => party.kind === 'student');
  const completed = agreement.completedSignatures;
  const total = agreement.parties.length;

  return (
    <div>
      <EmployerPageHeader
        breadcrumb={t('header.breadcrumb')}
        title={t('agreement.title')}
        description={t('agreement.subtitle', { name: student?.name })}
        status={
          <StatusBadge tone={signed ? 'success' : 'warning'}>
            {signed ? t('status.agreementSigned') : t('status.waitingStudent')}
          </StatusBadge>
        }
      />

      <div className="mt-7">
        <EmployerJobCard candidate={context.candidate} opportunity={context.opportunity} />
      </div>

      <section className={cn('mt-4 p-4', employerCardClass)}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[8px] font-bold tracking-[1.2px] text-[#3A0353] uppercase">
              {t('agreement.statusEyebrow')}
            </p>
            <h2 className="mt-2 text-[18px] font-bold leading-[24px] text-[#111827]">
              {signed ? t('agreement.bothSigned') : t('agreement.studentPending')}
            </h2>
          </div>
          <p className="text-[9px] font-medium text-[#475569]">
            {t('agreement.signatureCount', { completed, total })}
          </p>
        </div>

        <div className="mt-4 space-y-2.5">
          {agreement.parties.map((party) => (
            <PartyRow key={party.id} party={party} />
          ))}
        </div>
      </section>

      <section className={cn('mt-4 flex min-h-[123px] items-start gap-3 p-4', employerCardClass)}>
        <span className="flex size-7 shrink-0 items-center justify-center rounded-[8px] bg-[#F1E8FA] text-[#3A0353]">
          <FileWarning className="size-4" strokeWidth={1.8} />
        </span>
        <div>
          <p className="text-[8px] font-bold tracking-[1.2px] text-[#3A0353] uppercase">
            {t('agreement.legalEyebrow')}
          </p>
          <h2 className="mt-2 text-[14px] font-bold text-[#111827]">{t('agreement.legalTitle')}</h2>
          <p className="mt-2 text-[9px] leading-4 text-[#475569]">{t('agreement.legalBody')}</p>
        </div>
      </section>

      <section
        className={cn(
          'mt-4 flex min-h-[89px] items-start gap-3 rounded-[18px] border p-4',
          signed
            ? 'border-[#A7E6CC] bg-[#F0FBF7]'
            : 'border-[#F0CC92] bg-[#FFF9ED]',
        )}
      >
        <span
          className={cn(
            'flex size-7 shrink-0 items-center justify-center rounded-[8px]',
            signed ? 'bg-[#DFF8ED] text-[#087A50]' : 'bg-[#FFF1D7] text-[#A05A08]',
          )}
        >
          {signed ? <CircleCheck className="size-4" strokeWidth={2} /> : <ShieldAlert className="size-4" strokeWidth={1.8} />}
        </span>
        <div>
          <h2 className="text-[13px] font-bold text-[#111827]">
            {signed ? t('agreement.completeTitle') : t('agreement.blockedTitle')}
          </h2>
          <p className="mt-2 text-[9px] leading-4 text-[#475569]">
            {signed ? t('agreement.completeBody') : t('agreement.blockedBody')}
          </p>
        </div>
      </section>
    </div>
  );
}
