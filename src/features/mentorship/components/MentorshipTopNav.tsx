import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Bell, Moon } from 'lucide-react';
import { LanguageSwitcher } from '@/shared/components/navigation/LanguageSwitcher';
import { NotificationsMenu } from '@/shared/components/navigation/NotificationsMenu';
import { UserMenu } from '@/shared/components/navigation/UserMenu';
import { SidebarTrigger } from '@/shared/components/navigation/Sidebar/SidebarTrigger';

interface TopNavProps {
  onOpenMobile?: () => void;
}

export const TopNav: React.FC<TopNavProps> = () => {
  const { t } = useTranslation();

  return (
    <header className="h-[80px] px-4 sm:px-6 flex items-center justify-between gap-6 transition-colors">
      {/* Search Bar / Sidebar Toggle */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-[420px]">
        <SidebarTrigger />

        <label className="relative w-full">
          <span className="sr-only">{t('dashboard.topNav.search')}</span>
          <Search
            aria-hidden="true"
            className="size-[18px] text-slate-400 absolute start-[18px] top-1/2 -translate-y-1/2 pointer-events-none"
          />
          <input
            type="search"
            placeholder={t('dashboard.topNav.searchPlaceholder')}
            className="w-full bg-[#f4f4f4] border border-slate-200/50 rounded-[36px] h-[48px] text-[14px] text-[#1f2937] placeholder-slate-400 ps-[48px] pe-5 focus:outline-none focus:ring-2 focus:ring-[#6a2a8a]/30 shadow-[0px_2px_10px_0px_rgba(59,4,84,0.05)] transition-all"
          />
        </label>
      </div>

      {/* Right Controls: Language, Notifications, Dark mode button (kept matching Figma), User Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <LanguageSwitcher variant="pill" className="h-[44px] sm:h-[48px] px-3.5 text-xs sm:text-sm" />
        {/* Notifications Button (Figma 166:10899 Bell), with the real unread count and panel */}
        <NotificationsMenu
          buttonClassName="size-[44px] sm:size-[48px] rounded-[24px] bg-[#f4f4f4] hover:bg-[#ede8f5] flex items-center justify-center text-slate-700 shadow-[0px_2px_10px_0px_rgba(59,4,84,0.06)] transition-all"
          icon={<Bell aria-hidden="true" className="size-[20px] text-slate-600" />}
        />

        {/* Dark Button (kept matching Figma 166:10899 Theme toggle; unavailable until dark theme exists) */}
        <button
          type="button"
          aria-disabled="true"
          aria-label={t('dashboard.topNav.darkModeLabel')}
          title={t('dashboard.topNav.darkModeUnavailable')}
          className="h-[44px] sm:h-[48px] px-3.5 sm:px-5 rounded-[36px] bg-[#f4f4f4] border border-[#e9dcf8] flex items-center gap-2 text-xs sm:text-[14px] font-semibold text-[#1f2937] shadow-[0px_2px_5px_rgba(59,4,84,0.06)] cursor-default transition-all"
        >
          <Moon aria-hidden="true" className="size-4 text-slate-600 shrink-0" />
          <span aria-hidden="true" className="hidden sm:inline">{t('dashboard.topNav.darkMode')}</span>
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
