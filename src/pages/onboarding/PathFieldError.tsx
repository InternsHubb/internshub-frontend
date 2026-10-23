import type { ReactNode } from 'react';

// Validation message of a required choice on the Path step (package or track).
export function PathFieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p
      id={id}
      role="alert"
      className="mb-4 flex items-center gap-2 rounded-[14px] border border-[#B42318]/20 bg-[#FEF0EF] px-4 py-3 text-xs font-bold text-[#B42318]"
    >
      <span aria-hidden="true" className="flex size-5 shrink-0 items-center justify-center rounded-full border border-current text-[11px] leading-none">!</span>
      {children}
    </p>
  );
}

export default PathFieldError;
