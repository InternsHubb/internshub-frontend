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
        <p className="text-[11px] font-bold tracking-[1.5px] text-[#7C3AED] uppercase">{breadcrumb}</p>
        <h1 className="mt-2 text-[26px] font-bold leading-tight tracking-[-0.025em] text-[#111827] sm:text-[30px]">
          {title}
        </h1>
        <p className="mt-2 max-w-[760px] text-[14px] leading-relaxed text-[#64748B]">{description}</p>
      </div>
      {status ? <div className="shrink-0 pt-0.5 sm:pt-2">{status}</div> : null}
    </header>
  );
}

