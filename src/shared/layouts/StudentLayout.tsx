import { Suspense, type ComponentType, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useMatches } from 'react-router-dom';
import { Sidebar } from '@/shared/components/navigation/Sidebar/Sidebar';
import { SidebarProvider } from '@/shared/components/navigation/Sidebar/SidebarProvider';
import { TopNav } from '@/shared/components/navigation/Topbar';

/**
 * Route handle contract for customizing the shared StudentLayout per route.
 */
export type StudentRouteHandle = {
  sidebarFooter?: ComponentType;
  topNavSearch?: ComponentType;
  hideSidebar?: boolean;
};

// Backwards-compatible type alias
export type DashboardRouteHandle = StudentRouteHandle;

function useStudentHandle(): StudentRouteHandle {
  const matches = useMatches();
  return matches.reduce<StudentRouteHandle>((merged, match) => {
    const handle = match.handle as StudentRouteHandle | undefined;
    return handle ? { ...merged, ...handle } : merged;
  }, {});
}

const PAGE_BACKGROUND =
  'bg-[radial-gradient(circle_at_8%_2%,rgba(139,93,176,0.12),rgba(139,93,176,0)_26%),radial-gradient(circle_at_96%_20%,rgba(221,111,13,0.06),rgba(221,111,13,0)_25%),linear-gradient(#f8f6fa,#f8f6fa)]';

function ContentFallback() {
  const { t } = useTranslation();
  return (
    <div
      className="flex min-h-[60vh] items-center justify-center"
      role="status"
      aria-label={t('dashboard.layout.loading', 'Loading...')}
    >
      <div className="size-8 animate-spin rounded-full border-3 border-brand-primary border-t-transparent" />
    </div>
  );
}

export interface StudentLayoutProps {
  sidebarFooter?: ReactNode;
  topbar?: ReactNode;
  children?: ReactNode;
}

/**
 * Unified structural shell for all student workspace features
 * (Internships/Dashboard, Courses, Mentorship, Student Recruitment, Chat).
 */
export function StudentLayout({ sidebarFooter, topbar, children }: StudentLayoutProps) {
  const {
    sidebarFooter: HandleSidebarFooter,
    topNavSearch: HandleTopNavSearch,
    hideSidebar = false,
  } = useStudentHandle();
  const { pathname } = useLocation();

  const resolvedFooter =
    sidebarFooter ?? (HandleSidebarFooter ? <HandleSidebarFooter /> : undefined);

  return (
    <SidebarProvider>
      <div className={`min-h-screen ${PAGE_BACKGROUND}`}>
        <div className="flex gap-0 px-4 sm:px-6 lg:gap-[52px] lg:pt-6">
          {!hideSidebar && <Sidebar footer={resolvedFooter} />}
          <div className="flex min-w-0 flex-1 flex-col lg:-mt-6">
            {topbar ?? (
              <TopNav search={HandleTopNavSearch ? <HandleTopNavSearch /> : undefined} />
            )}
            <main className="min-w-0 pb-10 pt-6 lg:ps-6">
              <Suspense fallback={<ContentFallback />}>
                <div key={pathname} className="db-page-enter">
                  {children ?? <Outlet />}
                </div>
              </Suspense>
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default StudentLayout;
