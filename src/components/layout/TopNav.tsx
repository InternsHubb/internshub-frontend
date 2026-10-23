import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import searchIcon from '@/assets/dashboard/topnav-search.svg';
import { SidebarTrigger } from '@/components/layout/sidebar/SidebarTrigger';
import { SAMPLE_PROFILE } from '@/data/internshipDashboard';
import { useAuth } from '@/hooks/useAuth';
import { initialsOf } from '@/lib/initials';

// Dashboard top bar (Figma component "Top Nav", 30:16628). The bell and "Dark" toggle are
// left out, as in the onboarding profile header: no notifications screen or dark theme exists.

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
      <span className="sr-only sm:hidden">{primary}</span>
      <div className="hidden min-w-0 max-w-[220px] flex-col gap-0.5 sm:flex">
        <p className="truncate text-sm font-semibold leading-5 text-[#111827]"><bdi>{primary}</bdi></p>
        {secondary && <p className="truncate text-xs leading-4 text-[#334155]"><bdi>{secondary}</bdi></p>}
      </div>
    </div>
  );
}

type TopNavProps = { search?: ReactNode };

export function TopNav({ search }: TopNavProps) {
  return (
    <header className="flex h-20 items-center gap-3 sm:gap-6 lg:px-6">
      <SidebarTrigger />
      <div className="min-w-0 flex-1 md:max-w-[420px]">{search ?? <TopNavSearch />}</div>
      <div className="hidden flex-1 md:block" aria-hidden="true" />
      <ProfileChip />
    </header>
  );
}

export default TopNav;
