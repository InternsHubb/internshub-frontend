import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import bellIcon from '@/assets/dashboard/topnav-bell.svg';
import moonIcon from '@/assets/dashboard/topnav-moon.svg';
import searchIcon from '@/assets/dashboard/topnav-search.svg';
import { LanguageSwitcher } from '@/shared/components/navigation/LanguageSwitcher';
import { NotificationsMenu } from '@/shared/components/navigation/NotificationsMenu';
import { UserMenu } from '@/shared/components/navigation/UserMenu';
import { SidebarTrigger } from '@/shared/components/navigation/Sidebar/SidebarTrigger';

// Dashboard top bar (Figma component "Top Nav", 30:16628): sidebar toggle, search, then the
// "Actions" group (Bell, "Dark" theme toggle, profile). The bell opens the notifications panel
// (NotificationsMenu); the profile opens the account menu with "Sign out" (UserMenu). There is no dark theme yet, so the toggle is shown as in Figma but marked
// unavailable.

export const TOP_NAV_SEARCH_BOX =
  'flex h-12 w-full items-center gap-3 overflow-hidden rounded-[36px] bg-[#f4f4f4] px-5 shadow-[0_2px_10px_rgba(59,4,84,0.1)]';

// Default search box. There is no search API yet, so it only holds the typed text.
export function TopNavSearch() {
  const { t } = useTranslation();
  return (
    <label className={`${TOP_NAV_SEARCH_BOX} focus-within:ring-2 focus-within:ring-[#5a198f]`}>
      <img src={searchIcon} alt="" aria-hidden="true" className="size-[22px] shrink-0" />
      <span className="sr-only">{t('dashboard.topNav.search')}</span>
      <input
        type="search"
        placeholder={t('dashboard.topNav.searchPlaceholder')}
        className="min-w-0 flex-1 bg-transparent text-sm leading-4 text-[#1f2937] outline-none placeholder:text-[#1f2937]"
      />
    </label>
  );
}

// Shared surface of the round top-bar controls ("Bell" and "Theme toggle" in "Top Nav").
const ACTION_SURFACE =
  'flex h-12 shrink-0 items-center justify-center bg-[#f4f4f4] text-[#1f2937] outline-none focus-visible:ring-2 focus-visible:ring-[#5a198f]';

// "Bell" (30:16636), with the unread count and the notifications panel.
function NotificationsButton() {
  return (
    <NotificationsMenu
      buttonClassName={`${ACTION_SURFACE} w-12 rounded-full hover:bg-[#ede8f5] shadow-[0_2px_10px_rgba(59,4,84,0.1)]`}
      icon={<img src={bellIcon} alt="" aria-hidden="true" width={23.4} height={23.4} />}
    />
  );
}

// "Theme toggle" (30:16641) in its light-mode state. Not wired: the app has no dark theme
// yet.
function ThemeToggleButton() {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      aria-disabled="true"
      aria-label={t('dashboard.topNav.darkModeLabel')}
      title={t('dashboard.topNav.darkModeUnavailable')}
      className={`${ACTION_SURFACE} cursor-default gap-2 rounded-[36px] border-[0.8px] border-[#e9dcf8] px-5 drop-shadow-[0_2px_5px_rgba(59,4,84,0.1)]`}
    >
      <img src={moonIcon} alt="" aria-hidden="true" width={16} height={16} />
      <span aria-hidden="true" className="text-sm font-semibold leading-4">{t('dashboard.topNav.darkMode')}</span>
    </button>
  );
}

type TopNavProps = { search?: ReactNode };

export function TopNav({ search }: TopNavProps) {
  return (
    // Below sm the search drops to its own full-width row under the toggle and actions.
    <header className="flex flex-wrap items-center gap-3 py-4 sm:h-20 sm:flex-nowrap sm:gap-6 sm:py-0 lg:px-6">
      <SidebarTrigger />
      <div className="order-last min-w-0 basis-full sm:order-none sm:flex-1 sm:basis-auto md:max-w-[420px]">{search ?? <TopNavSearch />}</div>
      <div className="ms-auto flex shrink-0 items-center gap-3">
        <LanguageSwitcher variant="pill" />
        <NotificationsButton />
        <ThemeToggleButton />
        {/* Below lg only the avatar is shown, so the search box keeps a usable width. */}
        <UserMenu />
      </div>
    </header>
  );
}

export default TopNav;
