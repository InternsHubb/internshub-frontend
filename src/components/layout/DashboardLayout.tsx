import { Suspense, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useMatches } from 'react-router-dom';

import { Sidebar } from '@/components/shared/Sidebar/Sidebar';
import { SidebarProvider } from '@/components/shared/Sidebar/SidebarProvider';
import { TopNav } from '@/components/layout/TopNav';

// Shared shell for every student dashboard page: one SidebarProvider, one Sidebar and the
// top bar, with pages rendered in the Outlet. A route customises the shell via `handle`:
//   { sidebarFooter: Component }   rendered in the sidebar footer slot
//   { topNavSearch: Component }    replaces the default top-bar search box
export type DashboardRouteHandle = {
  sidebarFooter?: ComponentType;
  topNavSearch?: ComponentType;
};

function useDashboardHandle(): DashboardRouteHandle {
  const matches = useMatches();
  // The deepest route that sets a slot wins.
  return matches.reduce<DashboardRouteHandle>((merged, match) => {
    const handle = match.handle as DashboardRouteHandle | undefined;
    return handle ? { ...merged, ...handle } : merged;
  }, {});
}

// Page background of the "3 months" frames: two soft radial glows on #f8f6fa.
const PAGE_BACKGROUND =
  'bg-[radial-gradient(circle_at_8%_2%,rgba(139,93,176,0.12),rgba(139,93,176,0)_26%),radial-gradient(circle_at_96%_20%,rgba(221,111,13,0.06),rgba(221,111,13,0)_25%),linear-gradient(#f8f6fa,#f8f6fa)]';

function ContentFallback() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label={t('dashboard.layout.loading')}>
      <div className="size-8 animate-spin rounded-full border-3 border-[#5a198f] border-t-transparent" />
    </div>
  );
}

export function DashboardLayout() {
  const { sidebarFooter: SidebarFooter, topNavSearch: TopNavSearchSlot } = useDashboardHandle();
  const { pathname } = useLocation();

  return (
    <SidebarProvider>
      <div className={`min-h-screen ${PAGE_BACKGROUND}`}>
        <div className="flex gap-0 px-4 sm:px-6 lg:gap-[52px] lg:pt-6">
          <Sidebar footer={SidebarFooter ? <SidebarFooter /> : undefined} />
          <div className="flex min-w-0 flex-1 flex-col lg:-mt-6">
            <TopNav search={TopNavSearchSlot ? <TopNavSearchSlot /> : undefined} />
            <main className="min-w-0 pb-10 pt-6 lg:ps-6">
              <Suspense fallback={<ContentFallback />}>
                {/* Keyed on the path (not the query) so each page fades up once when it opens,
                    after its lazy chunk has loaded; typing in a search field never re-runs it. */}
                <div key={pathname} className="db-page-enter">
                  <Outlet />
                </div>
              </Suspense>
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default DashboardLayout;
