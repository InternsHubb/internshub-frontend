import { Bell, Menu, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '@/constants/routes';
import { CURRENT_APPLICANT } from '@/lib/recruitment/data';

type RecruitmentTopBarProps = {
  onOpenMenu: () => void;
};

export function RecruitmentTopBar({ onOpenMenu }: RecruitmentTopBarProps) {
  const { t } = useTranslation();

  return (
    <header className="flex h-20 items-center justify-between gap-3 px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-2.5 lg:hidden">
        <button
          type="button"
          onClick={onOpenMenu}
          className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[#E7E4EF] bg-white text-[#3B3650] shadow-sm transition hover:bg-[#F8F7FC]"
          aria-label={t('recruitment.shell.openMenu')}
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
        <Link to={ROUTES.home} className="flex min-w-0 items-center gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-[linear-gradient(135deg,#7C3AED_0%,#A855F7_100%)] text-[10px] font-bold text-white">
            IH
          </span>
          <span className="truncate text-sm font-semibold text-[#151326]">
            {t('recruitment.shell.brandName')}{' '}
            <span className="text-[#7C3AED]">{t('recruitment.shell.brandAccent')}</span>
          </span>
        </Link>
      </div>

      <div className="ms-auto flex items-center gap-2.5 sm:gap-3">
        <button
          type="button"
          className="relative flex size-12 items-center justify-center rounded-full border border-[#E7E4EF] bg-white text-[#3B3650] shadow-[0_1px_2px_rgba(21,19,38,0.04)] transition hover:bg-[#F8F7FC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2"
          aria-label={t('recruitment.shell.notifications')}
        >
          <Bell className="size-[19px]" aria-hidden="true" />
          <span className="absolute end-[11px] top-[10px] size-2 rounded-full border-2 border-white bg-[#8B5CF6]" />
        </button>

        <button
          type="button"
          disabled
          title={t('recruitment.shell.darkUnavailable')}
          className="flex h-12 items-center gap-2 rounded-full bg-[#22023C] px-4 text-xs font-medium text-white shadow-[0_1px_2px_rgba(21,19,38,0.08)] disabled:cursor-not-allowed"
        >
          <Moon className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">{t('recruitment.shell.dark')}</span>
        </button>

        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#8B5CF6_0%,#C084FC_100%)] text-[12px] font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]">
            {CURRENT_APPLICANT.initials}
          </span>
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-xs font-semibold text-[#151326]">
              {CURRENT_APPLICANT.name}
            </p>
            <p className="mt-0.5 truncate text-[11px] text-[#928CA1]">
              {CURRENT_APPLICANT.role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
