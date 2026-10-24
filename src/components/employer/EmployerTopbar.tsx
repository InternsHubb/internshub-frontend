import { Bell, Moon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { employerProfile } from '@/lib/employer/data';

export function EmployerTopbar() {
  const { t } = useTranslation();

  return (
    <header className="flex h-12 items-center justify-end gap-3">
      <button
        type="button"
        disabled
        aria-label={t('topbar.notifications')}
        title={t('topbar.notificationsUnavailable')}
        className="flex size-12 items-center justify-center rounded-full bg-[#F4F4F4] text-[#6B7280]"
      >
        <Bell className="size-[18px]" strokeWidth={1.8} />
      </button>

      <button
        type="button"
        disabled
        aria-label={t('topbar.dark')}
        title={t('topbar.darkUnavailable')}
        className="flex h-12 items-center gap-2 rounded-full bg-[#F4F4F4] px-4 text-[10px] font-medium text-[#6B7280]"
      >
        <Moon className="size-4" strokeWidth={1.8} />
        <span>{t('topbar.dark')}</span>
        <span className="relative ms-1 h-4 w-7 rounded-full bg-[#E5E1E8]" aria-hidden="true">
          <span className="absolute start-0.5 top-0.5 size-3 rounded-full bg-white shadow-sm" />
        </span>
      </button>

      <div className="ms-1 flex items-center gap-3">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#925DA8_0%,#C592FB_100%)] text-[12px] font-bold text-white">
          {employerProfile.viewerInitials}
        </span>
        <span className="hidden flex-col gap-0.5 sm:flex">
          <span className="text-[10px] font-bold leading-tight text-[#111827]">{employerProfile.viewerName}</span>
          <span className="text-[9px] leading-tight text-[#334155]">
            {employerProfile.viewerRole} • {employerProfile.companyName}
          </span>
        </span>
      </div>
    </header>
  );
}
