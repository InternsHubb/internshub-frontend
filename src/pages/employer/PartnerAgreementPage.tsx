import { CircleCheck } from 'lucide-react';
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
      ? t('agreement.employerMeta', { name: party.signedBy, defaultValue: `Employer · Signed by ${party.signedBy}` })
      : signed
        ? t('agreement.studentSignedMeta', 'Student · Signature complete')
        : t('agreement.studentPendingMeta', 'Student · Signature requested');

  return (
    <div className="flex min-h-[64px] items-center gap-3.5 rounded-[16px] bg-[#FAF7FD] px-4 py-3 sm:px-5">
      <span
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold',
          signed ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-[#FEF3C7] text-[#D97706]',
        )}
      >
        {signed ? <CircleCheck className="size-4" strokeWidth={2.2} /> : <span>—</span>}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-bold text-[#111827]">{party.name}</p>
        <p className="mt-0.5 text-[12px] text-[#64748B]">{meta}</p>
      </div>
      <StatusBadge tone={signed ? 'success' : 'warning'}>
        {signed ? t('agreement.signed', 'Signed') : t('agreement.pending', 'Pending')}
      </StatusBadge>
    </div>
  );
}

export function PartnerAgreementPage() {
  const { t } = useTranslation();
  const { applicationId = '' } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
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
  const completed = signed ? 2 : 1;
  const total = agreement.parties.length || 2;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <EmployerPageHeader
          breadcrumb={t('header.breadcrumb', 'RECRUITMENT')}
          title={t('agreement.title', 'Partner project agreement')}
          description={t('agreement.subtitle', { name: student?.name, defaultValue: `Review signature readiness for ${student?.name || 'candidate'}.` })}
        />
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setSearchParams({ state: signed ? 'pending' : 'signed' })}
            className="rounded-full border border-[#D8C6E8] bg-white px-3 py-1 text-[11px] font-semibold text-[#5B1B75] hover:bg-[#F8F2FC]"
          >
            {signed ? 'Preview Pending State' : 'Preview Signed State'}
          </button>
          <StatusBadge tone={signed ? 'success' : 'warning'}>
            {signed ? t('status.agreementSigned', 'Agreement signed') : t('status.waitingStudent', 'Waiting for student signature')}
          </StatusBadge>
        </div>
      </div>

      <div className="mt-6">
        <EmployerJobCard candidate={context.candidate} opportunity={context.opportunity} />
      </div>

      <section className={cn('mt-5 p-5 sm:p-6', employerCardClass)}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-bold tracking-[1.4px] text-[#7C3AED] uppercase">
              {t('agreement.statusEyebrow', 'AGREEMENT STATUS')}
            </p>
            <h2 className="mt-2 text-[20px] font-bold leading-tight text-[#111827]">
              {signed ? t('agreement.bothSigned', 'Both parties have signed') : t('agreement.studentPending', 'Student signature pending')}
            </h2>
          </div>
          <p className="text-[13px] font-medium text-[#64748B]">
            {t('agreement.signatureCount', { completed, total, defaultValue: `${completed} of ${total} complete` })}
          </p>
        </div>

        <div className="mt-5 space-y-3">
          {agreement.parties.map((party) => (
            <PartyRow key={party.id} party={{ ...party, status: signed ? 'signed' : party.status }} />
          ))}
        </div>
      </section>

      <section className={cn('mt-5 flex items-start gap-4 p-5 sm:p-6', employerCardClass)}>
        <div className="w-1 self-stretch rounded-full bg-[#8B5CF6]" />
        <div>
          <span className="inline-flex items-center rounded-full bg-[#F3F4F6] px-2.5 py-0.5 text-[11px] font-semibold text-[#4B5563]">
            {t('agreement.legalEyebrow', 'Legal notice')}
          </span>
          <h2 className="mt-2 text-[16px] font-bold text-[#111827]">{t('agreement.legalTitle', 'Agreement text pending legal approval')}</h2>
          <p className="mt-1 text-[13px] leading-relaxed text-[#64748B]">{t('agreement.legalBody', 'No legal terms are displayed until approved wording is available.')}</p>
        </div>
      </section>

      {signed ? (
        <section className="mt-5 rounded-[22px] border border-[#BBF7D0] bg-[#F0FDF4] p-5 sm:p-6 text-[#166534]">
          <h2 className="text-[16px] font-bold text-[#166534]">
            {t('agreement.completeTitle', 'Agreement complete — ready for official-start review')}
          </h2>
          <p className="mt-1 text-[13px] leading-relaxed text-[#15803D]">
            {t('agreement.completeBody', 'Signing is complete, but this does not mean the project or placement is completed. Proceed only when all applicable official-start conditions are satisfied.')}
          </p>
        </section>
      ) : (
        <section className="mt-5 rounded-[22px] border border-[#FDE68A] bg-[#FFFBEB] p-5 sm:p-6 text-[#92400E]">
          <h2 className="text-[16px] font-bold text-[#92400E]">
            {t('agreement.blockedTitle', 'Project remains blocked')}
          </h2>
          <p className="mt-1 text-[13px] leading-relaxed text-[#B45309]">
            {t('agreement.blockedBody', 'The real partner project cannot begin until both parties have signed.')}
          </p>
        </section>
      )}
    </div>
  );
}

