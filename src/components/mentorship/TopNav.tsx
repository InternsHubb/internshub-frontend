import React from 'react';
import { Search, Bell, Moon, Menu } from 'lucide-react';
import { NotificationsMenu } from '@/components/layout/NotificationsMenu';
import { UserMenu } from '@/components/layout/UserMenu';

interface TopNavProps {
  onOpenMobile?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onOpenMobile }) => {
  return (
    <header className="h-[80px] px-4 sm:px-6 flex items-center justify-between gap-6 transition-colors">
      {/* Search Bar / Mobile Menu Toggle (Figma 166:10899) */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-[420px]">
        {onOpenMobile && (
          <button
            type="button"
            onClick={onOpenMobile}
            className="md:hidden size-11 rounded-2xl bg-[#f4f4f4] text-slate-700 flex items-center justify-center hover:bg-slate-200 transition-colors shrink-0 shadow-sm"
            aria-label="Open navigation menu"
          >
            <Menu className="size-5" />
          </button>
        )}

        <div className="relative w-full">
          <Search className="size-[18px] text-slate-400 absolute left-[18px] top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-[#f4f4f4] border border-slate-200/50 rounded-[36px] h-[48px] text-[14px] text-[#1f2937] placeholder-slate-400 pl-[48px] pr-5 focus:outline-none focus:ring-2 focus:ring-[#6a2a8a]/30 shadow-[0px_2px_10px_0px_rgba(59,4,84,0.05)] transition-all"
          />
        </div>
      </div>

      {/* Right Controls: Notifications, Dark mode button (kept matching Figma), User Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Notifications Button (Figma 166:10899 Bell), with the real unread count and panel */}
        <NotificationsMenu
          buttonClassName="size-[44px] sm:size-[48px] rounded-[24px] bg-[#f4f4f4] hover:bg-[#ede8f5] flex items-center justify-center text-slate-700 shadow-[0px_2px_10px_0px_rgba(59,4,84,0.06)] transition-all"
          icon={<Bell aria-hidden="true" className="size-[20px] text-slate-600" />}
        />

        {/* Dark Button (kept exactly matching Figma 166:10899 Theme toggle) */}
        <button
          type="button"
          className="h-[44px] sm:h-[48px] px-3.5 sm:px-5 rounded-[36px] bg-[#f4f4f4] border border-[#e9dcf8] hover:bg-[#ede8f5] flex items-center gap-2 text-xs sm:text-[14px] font-semibold text-[#1f2937] shadow-[0px_2px_5px_rgba(59,4,84,0.06)] transition-all"
        >
          <Moon className="size-4 text-slate-600 shrink-0" />
          <span className="hidden sm:inline">Dark</span>
        </button>

        {/* User Profile (Figma 166:10899 Profile): the signed-in user, with "Sign out" */}
        <div className="ps-1">
          <UserMenu avatarClassName="size-[44px] sm:size-[48px] text-[15px] shadow-sm" />
        </div>
      </div>
    </header>
  );
};

export default TopNav;
