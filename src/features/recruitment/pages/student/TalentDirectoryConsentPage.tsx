import { useCallback, useState } from 'react';
import type { ComponentType } from 'react';
import { Check, Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/features/recruitment/components/student/PageHeader';
import { RecruitmentLoading, RecruitmentNotFound } from '@/features/recruitment/components/student/ResourceStates';
import { StatusBadge } from '@/features/recruitment/components/student/StatusBadge';
import {
  RECRUITMENT_CARD,
  RECRUITMENT_PRIMARY_BUTTON,
  RECRUITMENT_TEXT_BUTTON,
} from '@/features/recruitment/components/student/ui';
import { ROUTES } from '@/app/routes';
import { useRecruitmentResource } from '@/features/recruitment/hooks/useRecruitmentResource';
import {
  getTalentDirectoryConsent,
  submitTalentDirectoryConsent,
} from '@/features/recruitment/services/consentService';
import type { ConsentTerm, TalentDirectoryConsent } from '@/features/recruitment/types/recruitment';

type IconComponent = ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;

function InfoTile({
  icon: Icon,
  title,
  text,
  tone,
}: {
  icon: IconComponent;
  title: string;
  text: string;
  tone: 'visible' | 'private';
}) {
  const isVisible = tone === 'visible';

  return (
    <div className="rounded-xl border border-[#E7E4EF] bg-[#F8F7FC] p-3.5">
      <div className="flex items-center gap-2">
        <span
          className={`flex size-6 items-center justify-center rounded-lg ${
            isVisible ? 'bg-[#EDE7FF] text-[#6D28D9]' : 'bg-[#ECEBF1] text-[#666070]'
          }`}
        >
          <Icon className="size-3.5" aria-hidden={true} />
        </span>
        <p className="text-[11px] font-semibold text-[#3B3650]">{title}</p>
      </div>
      <p className="mt-2 text-[11px] leading-[18px] text-[#706B80]">{text}</p>
    </div>
  );
}

function ConsentContent({ data }: { data: TalentDirectoryConsent }) {
  const { t, i18n } = useTranslation();
  const [acceptedTermIds, setAcceptedTermIds] = useState<ConsentTerm['id'][]>(() =>
    data.consented ? data.terms.map((term) => term.id) : [],
  );
  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requiredTermIds = data.terms.filter((term) => term.required).map((term) => term.id);
  const canAccept = requiredTermIds.every((id) => acceptedTermIds.includes(id));
  const listFormatter = new Intl.ListFormat(i18n.language, {
    style: 'long',
    type: 'conjunction',
  });

  const visibleFields = listFormatter.format(
    data.visibleFields.map((field) =>
      t(`recruitment.consent.fields.${field}`, { defaultValue: field }),
    ),
  );
  const privateFields = listFormatter.format(
    data.privateFields.map((field) =>
      t(`recruitment.consent.fields.${field}`, { defaultValue: field }),
    ),
  );

  const toggleTerm = (termId: ConsentTerm['id']) => {
    setIsSaved(false);
    setAcceptedTermIds((current) =>
      current.includes(termId)
        ? current.filter((id) => id !== termId)
        : [...current, termId],
    );
  };

  const acceptConsent = async () => {
    if (!canAccept || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await submitTalentDirectoryConsent(acceptedTermIds);
      setIsSaved(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title={t('recruitment.consent.title')}
        subtitle={t('recruitment.consent.subtitle')}
      />

      <section className={`${RECRUITMENT_CARD} mt-5 p-4 sm:p-5`}>
        <div className="flex flex-col gap-5 lg:flex-row lg:gap-7">
          <div className="relative flex min-h-[200px] overflow-hidden rounded-2xl bg-[linear-gradient(145deg,#3B0764_0%,#6D28D9_100%)] p-6 text-white lg:w-[280px] lg:shrink-0">
            <span className="absolute -end-10 -top-10 size-40 rounded-full border-[20px] border-white/10" />
            <span className="absolute -bottom-10 start-6 size-36 rounded-full bg-[#A78BFA]/25 blur-2xl" />
            <div className="relative flex w-full flex-col">
              <span className="flex size-9 items-center justify-center rounded-xl border border-white/15 bg-white/10">
                <Eye className="size-4" aria-hidden="true" />
              </span>
              <p className="mt-auto pt-10 text-[20px] font-semibold leading-6 tracking-[-0.02em] whitespace-pre-line">
                {t('recruitment.consent.visualTitle')}
              </p>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <StatusBadge tone="brand">{t('recruitment.consent.privacyBadge')}</StatusBadge>
            <h2 className="mt-3 text-lg font-semibold text-[#151326]">
              {t('recruitment.consent.heading')}
            </h2>
            <p className="mt-2 max-w-[720px] text-xs leading-5 text-[#706B80]">
              {t('recruitment.consent.body')}
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <InfoTile
                icon={Eye}
                title={t('recruitment.consent.visibleTitle')}
                text={visibleFields}
                tone="visible"
              />
              <InfoTile
                icon={EyeOff}
                title={t('recruitment.consent.privateTitle')}
                text={privateFields}
                tone="private"
              />
            </div>
          </div>
        </div>
      </section>

      <section className={`${RECRUITMENT_CARD} mt-4 p-4 sm:p-5`}>
        <h2 className="text-sm font-semibold text-[#151326]">
          {t('recruitment.consent.confirmTitle')}
        </h2>

        <div className="mt-3 space-y-3">
          {data.terms.map((term) => {
            const checked = acceptedTermIds.includes(term.id);

            return (
              <label
                key={term.id}
                className="flex min-h-[70px] cursor-pointer items-start gap-3 rounded-xl border border-[#E7E4EF] bg-[#F8F7FC] px-4 py-3 transition hover:border-[#D8C9E6]"
              >
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={checked}
                  onChange={() => toggleTerm(term.id)}
                />
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-[6px] border border-[#CFC7DA] bg-white text-white transition peer-checked:border-[#6D28D9] peer-checked:bg-[#6D28D9] peer-focus-visible:ring-2 peer-focus-visible:ring-[#8B5CF6] peer-focus-visible:ring-offset-2">
                  <Check
                    className={`size-3.5 ${checked ? 'opacity-100' : 'opacity-0'}`}
                    aria-hidden="true"
                  />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-semibold leading-5 text-[#2C2838]">
                    {t(`recruitment.consent.terms.${term.id}.label`)}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-[18px] text-[#706B80]">
                    {t(`recruitment.consent.terms.${term.id}.hint`)}
                  </span>
                </span>
              </label>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            className={RECRUITMENT_PRIMARY_BUTTON}
            onClick={acceptConsent}
            disabled={!canAccept || isSubmitting}
          >
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            {t('recruitment.consent.accept')}
          </button>
          <Link to={ROUTES.recruitmentEligibility} className={RECRUITMENT_TEXT_BUTTON}>
            {t('recruitment.consent.notNow')}
          </Link>
        </div>

        {isSaved ? (
          <p
            role="status"
            aria-live="polite"
            className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-[#087A50]"
          >
            <Lock className="size-3.5" aria-hidden="true" />
            {t('recruitment.consent.saved')}
          </p>
        ) : null}
      </section>
    </>
  );
}

export default function TalentDirectoryConsentPage() {
  const load = useCallback(() => getTalentDirectoryConsent(), []);
  const { data, isLoading, isError } = useRecruitmentResource(load);

  if (isLoading) return <RecruitmentLoading />;
  if (isError || !data) return <RecruitmentNotFound />;

  return <ConsentContent data={data} />;
}
