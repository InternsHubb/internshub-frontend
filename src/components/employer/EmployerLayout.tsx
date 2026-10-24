import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { EmployerSidebar } from './EmployerSidebar';
import { EmployerTopbar } from './EmployerTopbar';

export function EmployerLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(135deg,#F6F0FB_0%,#FCF9FE_100%)] p-4 lg:px-6 lg:py-4">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -end-32 -top-32 size-[420px] rounded-full bg-[#EBDDF5]/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -bottom-40 start-1/4 size-[520px] rounded-full bg-[#EFE4F7]/55 blur-3xl"
      />

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col items-stretch gap-6 lg:flex-row lg:gap-10">
        <EmployerSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <div className="min-w-0 flex-1">
          <EmployerTopbar onOpenMobileMenu={() => setMobileOpen(true)} />
          <main className="mt-4 w-full max-w-[1088px] pb-12 sm:mt-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

