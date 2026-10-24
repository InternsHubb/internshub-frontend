import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import bellIcon from '@/assets/dashboard/topnav-bell.svg';
import moonIcon from '@/assets/dashboard/topnav-moon.svg';
import searchIcon from '@/assets/dashboard/topnav-search.svg';
import { SidebarTrigger } from '@/components/layout/sidebar/SidebarTrigger';
import { SAMPLE_PROFILE } from '@/data/internshipDashboard';
import { useAuth } from '@/hooks/useAuth';
import { initialsOf } from '@/lib/initials';

// Dashboard top bar (Figma component "Top Nav", 30:16628): sidebar toggle, search, then the
// "Actions" group (Bell, "Dark" theme toggle, profile). There is no notifications feature or
// dark theme yet, so the bell and toggle are shown as in Figma but marked unavailable. The
// bell's unread dot is left out: there is no notification data to back it.

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

function ProfileChip() {
  const { user } = useAuth();
  const fullName = user?.fullName?.trim() ?? '';
  const email = user?.email?.trim() ?? '';
  // Signed-in user first (email stands in when no name was registered); sample profile otherwise.
  const primary = fullName || email || SAMPLE_PROFILE.name;
  const secondary = user ? (fullName ? email : '') : SAMPLE_PROFILE.subtitle;
  const initials = initialsOf(primary, !fullName && Boolean(email));

  return (
    <div className="flex min-w-0 items-center gap-3">
      <span
        aria-hidden="true"
        className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#925DA8_0%,#C592FB_100%)] text-base font-bold leading-4 text-white"
      >
        {initials}
      </span>
      {/* Below lg only the avatar is shown, so the search box keeps a usable width. */}
      <span className="sr-only lg:hidden">{primary}</span>
      <div className="hidden min-w-0 max-w-[220px] flex-col gap-0.5 lg:flex">
        <p className="truncate text-sm font-semibold leading-5 text-[#111827]"><bdi>{primary}</bdi></p>
        {secondary && <p className="truncate text-xs leading-4 text-[#334155]"><bdi>{secondary}</bdi></p>}
      </div>
    </div>
  );
}

// Shared surface of the round top-bar controls ("Bell" and "Theme toggle" in "Top Nav").
const ACTION_SURFACE =
  'flex h-12 shrink-0 cursor-default items-center justify-center bg-[#f4f4f4] text-[#1f2937] outline-none focus-visible:ring-2 focus-visible:ring-[#5a198f]';

// "Bell" (30:16636). Not wired: there is no notifications screen or API yet.
function NotificationsButton() {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      aria-disabled="true"
      aria-label={t('dashboard.topNav.notifications')}
      title={t('dashboard.topNav.notificationsUnavailable')}
      className={`${ACTION_SURFACE} w-12 rounded-full shadow-[0_2px_10px_rgba(59,4,84,0.1)]`}
    >
      <img src={bellIcon} alt="" aria-hidden="true" width={23.4} height={23.4} />
    </button>
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
      className={`${ACTION_SURFACE} gap-2 rounded-[36px] border-[0.8px] border-[#e9dcf8] px-5 drop-shadow-[0_2px_5px_rgba(59,4,84,0.1)]`}
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
        <NotificationsButton />
        <ThemeToggleButton />
        <ProfileChip />
      </div>
    </header>
  );
}

export default TopNav;
