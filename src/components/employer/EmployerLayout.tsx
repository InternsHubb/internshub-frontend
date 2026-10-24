import { Outlet } from 'react-router-dom';

import { EmployerSidebar } from './EmployerSidebar';
import { EmployerTopbar } from './EmployerTopbar';

// Layout of the employer decision/agreement flow (PR #32), which owns /employer; the router
// wraps it in RequireAuth. Its pages load local JSON (src/data/employer) through the services
// in lib/employer; there is no employer API yet. The legacy PR #30 prototype uses
// layouts/EmployerLayout.tsx instead; the two layouts and sidebars must stay separate.

export function EmployerLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#F6F0FB_0%,#FCF9FE_100%)] p-4 lg:px-6 lg:py-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -end-32 -top-32 size-[420px] rounded-full bg-[#EBDDF5]/75 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 start-1/4 size-[520px] rounded-full bg-[#EFE4F7]/70 blur-3xl"
      />

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col items-stretch gap-6 lg:flex-row lg:gap-12">
        <EmployerSidebar />
        <div className="min-w-0 flex-1">
          <EmployerTopbar />
          <main className="mt-[26px] w-full max-w-[1088px] pb-12">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
