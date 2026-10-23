import { useCallback } from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/recruitment/PageHeader';
import { RecruitmentLoading, RecruitmentNotFound } from '@/components/recruitment/ResourceStates';
import { StatusBadge } from '@/components/recruitment/StatusBadge';
import { RECRUITMENT_CARD } from '@/components/recruitment/ui';
import { useRecruitmentResource } from '@/hooks/useRecruitmentResource';
import { getAgreementById } from '@/lib/recruitment/agreementService';
import { DEFAULT_AGREEMENT_ID } from '@/lib/recruitment/data';
import { formatRecruitmentDate } from '@/lib/recruitment/format';
import type { AgreementDetail, SignatureParty } from '@/lib/recruitment/types';

function SignatureRow({
  party,
  language,
}: {
  party: SignatureParty;
  language: string;
}) {
  const { t } = useTranslation();
  const isSigned = party.status === 'signed';

  return (
    <div className="flex items-center gap-3 border-b border-[#E7E4EF] px-4 py-3 last:border-b-0">
      <span
        className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
          isSigned ? 'bg-[#DFF8ED] text-[#087A50]' : 'bg-[#FFF1D7] text-[#A05A08]'
        }`}
      >
        {isSigned ? (
          <CheckCircle2 className="size-4" aria-hidden="true" />
        ) : (
          <Clock className="size-4" aria-hidden="true" />
        )}
      </span>

      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-[#2C2838]">{party.name}</p>
        <p className="mt-0.5 truncate text-[10px] text-[#706B80]">
          {t(`recruitment.agreement.role.${party.role}`)}
          <span className="mx-1.5 text-[#B8B1C4]">•</span>
          {isSigned && party.signedAt
            ? t('recruitment.agreement.signedOn', {
                date: formatRecruitmentDate(party.signedAt, language),
              })
            : t('recruitment.agreement.signatureRequested')}
        </p>
      </div>

      <StatusBadge
        tone={isSigned ? 'success' : 'warning'}
        className="ms-auto shrink-0"
      >
        {isSigned ? t('recruitment.agreement.signed') : t('recruitment.agreement.pending')}
      </StatusBadge>
    </div>
  );
}

function AgreementContent({ agreement }: { agreement: AgreementDetail }) {
  const { t, i18n } = useTranslation();
  const completedCount = agreement.parties.filter((party) => party.status === 'signed').length;
  const totalCount = agreement.parties.length;
  const remainingCount = Math.max(totalCount - completedCount, 0);
  const studentName =
    agreement.parties.find((party) => party.role === 'student')?.name ??
    agreement.applicant.name;
  const employerName =
    agreement.parties.find((party) => party.role === 'employer')?.name ??
    agreement.job.company;
  const isComplete = agreement.status === 'complete';
  const startDate = formatRecruitmentDate(agreement.job.startDate, i18n.language);

  return (
    <>
      <PageHeader
        title={t('recruitment.agreement.title')}
        subtitle={t('recruitment.agreement.subtitle')}
        status={
          <StatusBadge tone={isComplete ? 'success' : 'warning'}>
            {t(`recruitment.agreement.badge.${agreement.status}`)}
          </StatusBadge>
        }
      />

      <section
        className={`${RECRUITMENT_CARD} mt-5 flex flex-col gap-4 p-4 sm:min-h-[107px] sm:flex-row sm:items-center sm:justify-between sm:p-5`}
      >
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#0891B2_0%,#22B8CF_100%)] text-[13px] font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
            {agreement.job.companyInitials}
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-[#151326] sm:text-base">
              {agreement.job.title}
            </h2>
            <p className="mt-1 truncate text-[11px] text-[#706B80]">
              {agreement.job.company}
              <span className="mx-1.5 text-[#B8B1C4]">•</span>
              {agreement.job.location}
            </p>
            <p className="mt-1 truncate text-[10px] text-[#928CA1] sm:text-[11px]">
              {t(`recruitment.application.meta.employmentType.${agreement.job.employmentType}`)}
              <span className="mx-1.5 text-[#C8C3D2]">•</span>
              {t(`recruitment.application.meta.workMode.${agreement.job.workMode}`)}
              <span className="mx-1.5 text-[#C8C3D2]">•</span>
              {t('recruitment.application.meta.duration', {
                count: agreement.job.durationMonths,
              })}
              <span className="mx-1.5 text-[#C8C3D2]">•</span>
              {t('recruitment.application.meta.start', { date: startDate })}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2.5 border-t border-[#E7E4EF] pt-4 sm:border-s sm:border-t-0 sm:ps-5 sm:pt-0">
          <span className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#8B5CF6_0%,#C084FC_100%)] text-[10px] font-bold text-white">
            {agreement.applicant.initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold text-[#2C2838]">
              {agreement.applicant.name}
            </p>
            <p className="mt-0.5 truncate text-[10px] text-[#928CA1]">
              {agreement.applicant.cohort}
            </p>
          </div>
        </div>
      </section>

      <section className={`${RECRUITMENT_CARD} mt-4 p-4 sm:p-5`}>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#8F889D]">
              {t('recruitment.agreement.signatureProgress')}
            </p>
            <h2 className="mt-2 text-base font-semibold text-[#151326]">
              {isComplete
                ? t('recruitment.agreement.allSigned')
                : remainingCount === 1
                  ? t('recruitment.agreement.oneRemaining')
                  : t('recruitment.agreement.oneRemaining')}
            </h2>
          </div>
          <p className="text-[11px] text-[#706B80]">
            {t('recruitment.agreement.completedCount', {
              completed: completedCount,
              total: totalCount,
            })}
          </p>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-[#E7E4EF] bg-[#FBFAFD]">
          {agreement.parties.map((party) => (
            <SignatureRow key={party.id} party={party} language={i18n.language} />
          ))}
        </div>
      </section>

      <section className={`${RECRUITMENT_CARD} mt-4 p-4 sm:p-5`}>
        <span className="inline-flex rounded-full bg-[#F1EFF8] px-3 py-1 text-[10px] font-semibold text-[#706B80]">
          {t('recruitment.agreement.legalBadge')}
        </span>
        <h2 className="mt-3 text-[15px] font-semibold text-[#151326]">
          {t('recruitment.agreement.legalTitle')}
        </h2>
        <p className="mt-1 text-xs leading-5 text-[#706B80]">
          {t('recruitment.agreement.legalBody')}
        </p>
      </section>

      <section className="mt-4 rounded-2xl border border-[#F0CC92] bg-[#FFF7E8] p-4 sm:p-5">
        <h2 className="text-[15px] font-semibold text-[#8F540B]">
          {t('recruitment.agreement.blockedTitle')}
        </h2>
        <p className="mt-1 max-w-[980px] text-xs leading-5 text-[#706B80]">
          {t('recruitment.agreement.blockedBody', {
            student: studentName,
            company: employerName,
          })}
        </p>
      </section>
    </>
  );
}

export default function AgreementDetailsPage() {
  const { agreementId = DEFAULT_AGREEMENT_ID } = useParams();
  const load = useCallback(() => getAgreementById(agreementId), [agreementId]);
  const { data, isLoading, isError } = useRecruitmentResource(load);

  if (isLoading) return <RecruitmentLoading />;
  if (isError || !data) return <RecruitmentNotFound />;

  return <AgreementContent agreement={data} />;
}
