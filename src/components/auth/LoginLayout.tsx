import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import brandImage from '../../assets/auth-brand-image.webp';
import AuthLayout from './AuthLayout';

type LoginLayoutProps = {
  children: ReactNode;
};

type StepChipProps = {
  index: string;
  label: string;
  className: string;
};

// Floating glass chips over the brand image (Figma "Login · Default").
function StepChip({ index, label, className }: StepChipProps) {
  return (
    <div
      className={`absolute flex min-w-[152px] items-center gap-2.5 rounded-[14px] border border-white/70 bg-white/90 px-3.5 py-3 shadow-[0_14px_34px_rgba(0,0,0,0.18)] backdrop-blur-md ${className}`}
    >
      <span className="grid size-[30px] place-items-center rounded-[9px] bg-ink-deep text-[10px] text-white">
        {index}
      </span>
      <span className="text-[11px] text-ink">{label}</span>
    </div>
  );
}

export default function LoginLayout({ children }: LoginLayoutProps) {
  const { t } = useTranslation();

  return (
    <AuthLayout
      brand={{
        eyebrow: t('auth.login.brandEyebrow'),
        title: t('auth.login.brandTitle'),
        description: t('auth.login.brandDescription'),
        highlights: t('auth.login.brandHighlights', { returnObjects: true }) as string[],
      }}
      brandImage={{ src: brandImage, alt: t('auth.login.imageAlt') }}
      brandExtra={
        <>
          <StepChip index="01" label={t('auth.login.brandStepOne')} className="-start-[18px] top-[228px]" />
          <StepChip index="02" label={t('auth.login.brandStepTwo')} className="-end-[9px] top-[30px]" />
        </>
      }
      header={{
        eyebrow: t('auth.login.eyebrow'),
        title: t('auth.login.title'),
        description: t('auth.login.description'),
      }}
      help={{
        text: t('auth.login.helpText'),
        linkLabel: t('auth.common.helpCenter'),
        href: '/help',
      }}
    >
      {children}
    </AuthLayout>
  );
}
