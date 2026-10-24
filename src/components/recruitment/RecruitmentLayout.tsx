import { Outlet } from 'react-router-dom';

import { Sidebar } from '@/components/shared/Sidebar/Sidebar';
import { SidebarProvider } from '@/components/shared/Sidebar/SidebarProvider';

import { CompositeScoreCard } from './CompositeScoreCard';
import { RecruitmentTopBar } from './RecruitmentTopBar';

// Layout of the student recruitment flow (PR #31), which owns /recruitment; the router wraps it
// in RequireAuth. Student-facing (eligibility, Talent Directory consent, applications,
// agreements), separate from the employer flows. Pages load local JSON (src/data/recruitment)
// through the services in lib/recruitment; there is no recruitment API yet.
//
// Navigation is the shared dashboard sidebar (same items, collapse state and mobile drawer as
// /dashboard), with the Recruitment menu opened on these pages and the "Composite Score" card
// in its footer, as in the recruitment frames.

export default function RecruitmentLayout() {
  return (
    <SidebarProvider>
      <div className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#F6F0FB_0%,#FCF9FE_100%)] text-[#151326]">
        <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-32 end-[-120px] size-[420px] rounded-full bg-[#EADCF5]/45 blur-3xl" />
          <div className="absolute bottom-[-160px] start-[260px] size-[360px] rounded-full bg-[#F3E7F8]/50 blur-3xl" />
        </div>

        <div className="relative flex lg:gap-6 lg:ps-6 lg:pt-6">
          <Sidebar footer={<CompositeScoreCard />} />
          <div className="flex min-w-0 flex-1 flex-col lg:-mt-6">
            <RecruitmentTopBar />
            <main className="mx-auto w-full max-w-[1136px] px-4 pb-10 sm:px-6">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
