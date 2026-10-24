import type { ReactNode } from 'react';

type EmployerPageHeaderProps = {
  breadcrumb: string;
  title: string;
  description: string;
  status?: ReactNode;
};

export function EmployerPageHeader({ breadcrumb, title, description, status }: EmployerPageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <p className="text-[8px] font-bold tracking-[1.2px] text-[#8B5DB0] uppercase">{breadcrumb}</p>
        <h1 className="mt-4 text-[24px] font-bold leading-[30px] tracking-[-0.025em] text-[#111827]">
          {title}
        </h1>
        <p className="mt-2 max-w-[760px] text-[11px] leading-[16px] text-[#475569]">{description}</p>
      </div>
      {status ? <div className="shrink-0 pt-0.5 sm:pt-1">{status}</div> : null}
    </header>
  );
}
