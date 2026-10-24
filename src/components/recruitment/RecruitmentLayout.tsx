import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { RecruitmentSidebar } from './RecruitmentSidebar';
import { RecruitmentTopBar } from './RecruitmentTopBar';

export default function RecruitmentLayout() {
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
    <div className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#F6F0FB_0%,#FCF9FE_100%)] text-[#151326]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 end-[-120px] size-[420px] rounded-full bg-[#EADCF5]/45 blur-3xl" />
        <div className="absolute bottom-[-160px] start-[260px] size-[360px] rounded-full bg-[#F3E7F8]/50 blur-3xl" />
      </div>

      <RecruitmentSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="relative lg:ps-[304px]">
        <RecruitmentTopBar onOpenMenu={() => setMobileOpen(true)} />
        <main className="mx-auto w-full max-w-[1136px] px-4 pb-10 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
