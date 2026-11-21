import React from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '@/shared/components/navigation/Sidebar/Sidebar';
import { SidebarProvider } from '@/shared/components/navigation/Sidebar/SidebarProvider';
import { useSidebar } from '@/shared/components/navigation/Sidebar/SidebarContext';
import { CompositeScoreCard } from '@/shared/components/common/CompositeScoreCard';
import { TopNav } from '@/features/mentorship/components/MentorshipTopNav';
import { MentorshipLoadState } from '@/features/mentorship/components/MentorshipParts';
import { MentorshipProvider, useMentorship } from '@/features/mentorship/context/MentorshipContext';
import '@/features/mentorship/styles/mentorship.css';

const LayoutContent: React.FC = () => {
  const { t } = useTranslation();
  const { setMobileOpen } = useSidebar();
  // Every mentorship screen reads the backend data, so they wait for it here.
  const { status, errorKey, isBackendPreviewMode, reload } = useMentorship();
  const { pathname } = useLocation();
  const resultPage = pathname.endsWith('/success') || pathname.endsWith('/cancelled') || pathname.endsWith('/feedback');
  const standalone = resultPage || pathname.endsWith('/book/confirm');
  const home = pathname === '/mentorship';
  const background = pathname.endsWith('/cancelled') ? '#fbf0fe' : home ? '#fdfdfe' : '#fcf8fd';

  return (
    <div
      className="mentorship-app min-h-screen text-slate-900 antialiased font-sans"
      style={{ background }}
    >
      <div className={`relative flex ${standalone ? '' : 'lg:gap-6 lg:ps-6 lg:pt-6'}`}>
        {/* Desktop & Mobile Shared Sidebar with Mentorship navigation */}
        {!standalone && <Sidebar footer={<CompositeScoreCard />} />}

        {/* Main App Canvas */}
        <div className={`flex-1 flex flex-col min-w-0 overflow-x-hidden ${standalone ? '' : 'lg:-mt-6'}`}>
          <div className={standalone ? 'max-w-4xl mx-auto w-full' : undefined}>
            <TopNav onOpenMobile={standalone ? undefined : () => setMobileOpen(true)} />
          </div>
          <main
            className={`mentorship-main flex-1 w-full px-4 sm:px-6 py-8 ${
              home ? 'xl:px-[94px]' : resultPage ? 'mx-auto' : standalone ? 'max-w-4xl mx-auto' : 'lg:pe-8'
            }`}
          >
            {isBackendPreviewMode && (
              <div
                role="status"
                className="mb-6 rounded-xl border border-border-subtle bg-info-soft px-4 py-3 text-xs font-medium text-brand-primary"
              >
                {t('common.errors.backendNotConnected')}
              </div>
            )}
            {status === 'ready' ? (
              <Outlet />
            ) : (
              <MentorshipLoadState errorKey={errorKey} onRetry={status === 'error' ? reload : undefined} />
            )}
          </main>
          {resultPage && (
            <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-[#f1ecf7] bg-white/60 px-6 py-7 text-xs text-[#64748b]">
              <span>© 2025 EdTech. All rights reserved.</span>
              <div className="flex gap-6">
                <span>Privacy Policy</span>
                <span>Terms of Service</span>
                <span>Support</span>
              </div>
            </footer>
          )}
        </div>
      </div>
    </div>
  );
};

export const MentorshipLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <MentorshipProvider>
        <LayoutContent />
      </MentorshipProvider>
    </SidebarProvider>
  );
};

export default MentorshipLayout;
