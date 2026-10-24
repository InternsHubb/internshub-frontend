import { Bell, Languages, Menu, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '@/constants/routes';
import { employerProfile } from '@/lib/employer/data';

type EmployerTopbarProps = {
  onOpenMobileMenu?: () => void;
};

export function EmployerTopbar({ onOpenMobileMenu }: EmployerTopbarProps) {
  const { t, i18n } = useTranslation();
  const nextLanguage = i18n.resolvedLanguage === 'ar' ? 'en' : 'ar';

  return (
    <header className="flex h-16 items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2.5 lg:hidden">
        {onOpenMobileMenu ? (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[#E7E4EF] bg-white text-[#3B3650] shadow-sm transition hover:bg-[#F8F7FC]"
            aria-label={t('recruitment.shell.openMenu', 'Open Menu')}
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
        ) : null}
        <Link to={ROUTES.home} className="flex min-w-0 items-center gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-[linear-gradient(135deg,#7C3AED_0%,#A855F7_100%)] text-[11px] font-bold text-white">
            IH
          </span>
          <span className="truncate text-sm font-semibold text-[#151326]">
            Interns <span className="text-[#7C3AED]">HUB</span>
          </span>
        </Link>
      </div>

      <div className="ms-auto flex items-center gap-2.5 sm:gap-3">
        <button
          type="button"
          onClick={() => void i18n.changeLanguage(nextLanguage)}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-[#E7E4EF] bg-white px-3 text-sm font-semibold text-[#3B3650] shadow-sm transition hover:bg-[#F8F7FC] cursor-pointer"
          aria-label={nextLanguage === 'ar' ? 'Switch to Arabic' : 'Switch to English'}
        >
          <Languages className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">{nextLanguage === 'ar' ? 'العربية' : 'English'}</span>
        </button>

        <button
          type="button"
          disabled
          aria-label={t('topbar.notifications')}
          title={t('topbar.notificationsUnavailable')}
          className="relative flex size-12 items-center justify-center rounded-full border border-[#E7E4EF] bg-white text-[#3B3650] shadow-[0_1px_2px_rgba(21,19,38,0.04)] transition hover:bg-[#F8F7FC]"
        >
          <Bell className="size-[19px]" strokeWidth={1.8} />
          <span className="absolute end-[11px] top-[10px] size-2 rounded-full border-2 border-white bg-[#8B5CF6]" />
        </button>

        <button
          type="button"
          disabled
          aria-label={t('topbar.dark')}
          title={t('topbar.darkUnavailable')}
          className="flex h-12 items-center gap-2.5 rounded-full border border-[#EEEAF2] bg-white px-5 text-[14px] font-semibold text-[#222635] shadow-sm"
        >
          <Moon className="size-4" strokeWidth={1.8} />
          <span className="hidden sm:inline">{t('topbar.dark')}</span>
        </button>

        <div className="ms-1 flex items-center gap-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#8B5CF6_0%,#C084FC_100%)] text-[15px] font-bold text-white shadow-sm">
            {employerProfile.viewerInitials}
          </span>
          <span className="hidden flex-col sm:flex">
            <span className="text-[14px] font-bold leading-tight text-[#111827]">{employerProfile.viewerName}</span>
            <span className="mt-0.5 text-[12px] leading-tight text-[#64748B]">
              {employerProfile.viewerRole} · {employerProfile.companyName}
            </span>
          </span>
        </div>
      </div>
    </header>
  );
}

