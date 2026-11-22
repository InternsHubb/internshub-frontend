import { Bell, Languages, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { UserMenu } from '@/shared/components/navigation/UserMenu';
import { SidebarTrigger } from '@/shared/components/navigation/Sidebar/SidebarTrigger';
import { ROUTES } from '@/app/routes';

export function RecruitmentTopBar() {
  const { t, i18n } = useTranslation();
  const nextLanguage = i18n.resolvedLanguage === 'ar' ? 'en' : 'ar';

  return (
    <header className="flex h-20 items-center justify-between gap-2 px-4 sm:gap-3 sm:px-6">
      {/* Shared sidebar toggle: collapses the docked sidebar from lg up, opens the drawer below. */}
      <div className="flex min-w-0 shrink-0 items-center gap-2.5 sm:shrink">
        <SidebarTrigger />
        <Link to={ROUTES.home} className="hidden min-w-0 items-center gap-2 sm:flex lg:hidden">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-[linear-gradient(135deg,#7C3AED_0%,#A855F7_100%)] text-[10px] font-bold text-white">
            IH
          </span>
          <span className="truncate text-sm font-semibold text-[#151326]">
            {t('recruitment.shell.brandName')}{' '}
            <span className="text-[#7C3AED]">{t('recruitment.shell.brandAccent')}</span>
          </span>
        </Link>
      </div>

      <div className="ms-auto flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => void i18n.changeLanguage(nextLanguage)}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-[#E7E4EF] bg-white px-2.5 text-sm sm:px-3 font-semibold text-[#3B3650] shadow-sm transition hover:bg-[#F8F7FC]"
          aria-label={nextLanguage === 'ar' ? 'Switch to Arabic' : 'Switch to English'}
        >
          <Languages className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">{nextLanguage === 'ar' ? 'العربية' : 'English'}</span>
        </button>

        <button
          type="button"
          className="relative flex size-11 shrink-0 items-center sm:size-12 justify-center rounded-full border border-[#E7E4EF] bg-white text-[#3B3650] shadow-[0_1px_2px_rgba(21,19,38,0.04)] transition hover:bg-[#F8F7FC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2"
          aria-label={t('recruitment.shell.notifications')}
        >
          <Bell className="size-[19px]" aria-hidden="true" />
          <span className="absolute end-[11px] top-[10px] size-2 rounded-full border-2 border-white bg-[#8B5CF6]" />
        </button>

        <button
          type="button"
          disabled
          title={t('recruitment.shell.darkUnavailable')}
          className="flex h-11 items-center sm:h-14 gap-3 rounded-full border border-[#EEEAF2] bg-white px-4 text-[16px] sm:px-6 font-semibold text-[#222635] shadow-[0_8px_20px_-12px_rgba(21,19,38,0.24)] disabled:cursor-not-allowed"
        >
          <Moon className="size-5" aria-hidden="true" />
          <span className="hidden sm:inline">{t('recruitment.shell.dark')}</span>
        </button>

        {/* The signed-in user (from /api/me), with "Sign out". */}
        <UserMenu avatarClassName="size-11 sm:size-14 text-[18px]" showNameFrom="sm" />
      </div>
    </header>
  );
}
