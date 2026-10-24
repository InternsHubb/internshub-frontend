import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/mentorship/Sidebar';
import { TopNav } from '@/components/mentorship/TopNav';
import { MentorshipProvider } from '@/context/MentorshipContext';

const LayoutContent: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div
      className="min-h-screen flex bg-[#fdfdfe] text-slate-900 antialiased font-sans"
      style={{
        backgroundImage:
          'linear-gradient(90deg, rgb(253, 253, 254) 0%, rgb(250, 248, 252) 100%)',
      }}
    >
      {/* Desktop Sidebar (Figma 160:9439) */}
      <div className="hidden md:block shrink-0 sticky top-0 h-screen z-30">
        <Sidebar />
      </div>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileSidebarOpen && (
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
        <TopNav onOpenMobile={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-[1200px] w-full mx-auto">
          <Outlet />
        </main>
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
