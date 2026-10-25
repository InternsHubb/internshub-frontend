import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/mentorship/Sidebar';
import { TopNav } from '@/components/mentorship/TopNav';
import { MentorshipProvider } from '@/context/MentorshipContext';
import './mentorship.css';

const LayoutContent: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
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
      {/* Desktop Sidebar (Figma 160:9439) */}
      {!standalone && <div className="hidden md:block shrink-0 sticky top-0 h-screen z-30">
        <Sidebar />
      </div>}

      {/* Mobile Drawer Backdrop & Sidebar */}
      {!standalone && mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 h-full max-w-[280px] w-full">
            <Sidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main App Canvas */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <div className={standalone ? 'md:ms-64' : undefined}>
          <TopNav onOpenMobile={standalone ? undefined : () => setMobileSidebarOpen(true)} />
        </div>
        <main className={`mentorship-main flex-1 w-full px-4 sm:px-6 py-8 ${home ? 'xl:px-[94px]' : resultPage ? 'mx-auto' : standalone ? 'md:ms-auto md:w-[calc(100%-280px)] lg:px-8' : 'lg:pe-8'}`}>
          <Outlet />
        </main>
        {resultPage && <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-[#f1ecf7] bg-white/60 px-6 py-7 text-xs text-[#64748b]"><span>© 2025 EdTech. All rights reserved.</span><div className="flex gap-6"><span>Privacy Policy</span><span>Terms of Service</span><span>Support</span></div></footer>}
      </div>
    </div>
  );
};

export const MentorshipLayout: React.FC = () => {
  return (
    <MentorshipProvider>
      <LayoutContent />
    </MentorshipProvider>
  );
};

export default MentorshipLayout;
