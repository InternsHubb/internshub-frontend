import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import checkWhite from '@/assets/auth/check-white.svg';
import brandImage from '@/assets/video-poster.webp';
import AuthLayout from '@/shared/layouts/AuthLayout';

type RegisterLayoutProps = {
  children: ReactNode;
};

type StepProps = {
  marker: ReactNode;
  label: string;
  isDone?: boolean;
};

function Step({ marker, label, isDone = false }: StepProps) {
  return (
    <li className="flex min-w-0 items-center gap-[7px]">
      <span
        className={`grid size-[27px] shrink-0 place-items-center rounded-[9px] border text-[10px] text-ink ${
          isDone ? 'border-[#16794a] bg-[#16794a]' : 'border-[#d8cfdd]'
        }`}
      >
        {marker}
      </span>
      {/* Labels may wrap instead of overflowing the pill on narrow panels or in Arabic. */}
      <span className="min-w-0 text-[10px] leading-3 text-ink">{label}</span>
    </li>
  );
}

function StepConnector() {
  return <li aria-hidden="true" className="mx-[9px] h-px min-w-3 flex-1 bg-[#ded5e3]" />;
}

// Figma "Register · Default": glass progress pill overlapping the bottom of the brand image.
function ProgressPill() {
  const { t } = useTranslation();

  return (
    <ol
      aria-label={t('auth.register.progressLabel')}
      className="absolute inset-x-[18px] top-[240px] flex min-h-[70px] items-center rounded-[17px] border border-white/65 bg-white/92 px-4 py-[13px] shadow-[0_15px_35px_rgba(0,0,0,0.18)] backdrop-blur-md"
    >
      <Step marker={<img alt="" src={checkWhite} className="h-5 w-[13px]" />} label={t('auth.register.stepCreate')} isDone />
      <StepConnector />
      <Step marker="2" label={t('auth.register.stepProfile')} />
      <StepConnector />
      <Step marker="3" label={t('auth.register.stepPath')} />
    </ol>
  );
}

export default function RegisterLayout({ children }: RegisterLayoutProps) {
  const { t } = useTranslation();

  return (
    <AuthLayout
      variant="register"
      brand={{
        eyebrow: t('auth.register.brandEyebrow'),
        title: t('auth.register.brandTitle'),
        description: t('auth.register.brandDescription'),
        highlights: t('auth.register.brandHighlights', { returnObjects: true }) as string[],
      }}
      brandImage={{ src: brandImage, alt: t('auth.register.imageAlt') }}
      brandExtra={<ProgressPill />}
      header={{
        eyebrow: t('auth.register.eyebrow'),
        title: t('auth.register.title'),
        description: t('auth.register.description'),
      }}
      help={{
        text: t('auth.register.helpText'),
        linkLabel: t('auth.common.helpCenter'),
        href: '/help',
      }}
    >
      {children}
    </AuthLayout>
  );
}
