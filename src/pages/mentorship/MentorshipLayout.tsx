import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/shared/Sidebar/Sidebar';
import { SidebarProvider } from '@/components/shared/Sidebar/SidebarProvider';
import { TopNav } from '@/components/mentorship/TopNav';
import { MentorshipLoadState } from '@/components/mentorship/MentorshipParts';
import { MentorshipProvider, useMentorship } from '@/context/MentorshipContext';
import './mentorship.css';

const LayoutContent: React.FC = () => {
  // Every mentorship screen reads the backend data, so they wait for it here.
  const { status, errorKey, reload } = useMentorship();
  const { pathname } = useLocation();
  const resultPage = pathname.endsWith('/success') || pathname.endsWith('/cancelled') || pathname.endsWith('/feedback');
  const standalone = resultPage || pathname.endsWith('/book/confirm');
  const home = pathname === '/mentorship';
  const background = pathname.endsWith('/cancelled') ? '#fbf0fe' : home ? '#fdfdfe' : '#fcf8fd';

  return (
    <div
      className="mentorship-app min-h-screen flex text-slate-900 antialiased font-sans"
      style={{ background }}
    >
      <div className="flex w-full gap-0 px-4 sm:px-6 lg:gap-[52px] lg:pt-6">
        {/* Desktop & Mobile Shared Sidebar */}
        {!standalone && <Sidebar />}

        {/* Main App Canvas */}
        <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden lg:-mt-6">
          <div className={standalone ? 'md:ms-64' : undefined}>
            <TopNav />
          </div>
          <main className={`mentorship-main flex-1 w-full pb-10 pt-6 lg:ps-6 ${resultPage ? 'mx-auto' : ''}`}>
            {status === 'ready' ? <Outlet /> : <MentorshipLoadState errorKey={errorKey} onRetry={status === 'error' ? reload : undefined} />}
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
    <MentorshipProvider>
      <SidebarProvider>
        <LayoutContent />
      </SidebarProvider>
    </MentorshipProvider>
  );
};

export default MentorshipLayout;
