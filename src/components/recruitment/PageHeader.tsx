import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type PageHeaderProps = {
  title: string;
  subtitle: string;
  status?: ReactNode;
};

export function PageHeader({ title, subtitle, status }: PageHeaderProps) {
  const { t } = useTranslation();

  return (
    <header>
      <p className="flex items-center gap-2 text-[10px] font-semibold text-[#8F889D]">
        <span>{t('recruitment.shell.breadcrumb')}</span>
        <span className="h-px w-4 bg-[#CEC8D9]" aria-hidden="true" />
        <span className="text-[#5C1D87]">{title}</span>
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-[28px] font-semibold leading-[1.2] tracking-[-0.02em] text-[#151326] sm:text-[32px]">
            {title}
          </h1>
          <p className="mt-1.5 max-w-[720px] text-xs leading-5 text-[#706B80] sm:text-[13px]">
            {subtitle}
          </p>
        </div>
        {status ? <div className="shrink-0">{status}</div> : null}
      </div>
    </header>
  );
}
