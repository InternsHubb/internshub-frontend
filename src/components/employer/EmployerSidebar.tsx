import {
  ArrowRight,
  Bookmark,
  CalendarDays,
  CircleCheck,
  GitBranch,
  LayoutDashboard,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

import { EMPLOYER_ROUTES, ROUTES } from '@/constants/routes';
import { employerProfile } from '@/lib/employer/data';
import { cn } from '@/lib/cn';

type NavItem = {
  id: string;
  labelKey: string;
  icon: LucideIcon;
  to?: string;
  disabled?: boolean;
  badge?: boolean;
};

const mainNav: NavItem[] = [
  { id: 'dashboard', labelKey: 'nav.dashboard', icon: LayoutDashboard, disabled: true },
  { id: 'talent', labelKey: 'nav.talentDirectory', icon: Users, disabled: true },
  { id: 'shortlist', labelKey: 'nav.shortlist', icon: Bookmark, disabled: true, badge: true },
  { id: 'pipeline', labelKey: 'nav.pipeline', icon: GitBranch, to: EMPLOYER_ROUTES.pipeline, badge: true },
  { id: 'interviews', labelKey: 'nav.interviews', icon: CalendarDays, badge: true },
  { id: 'completion', labelKey: 'nav.completion', icon: CircleCheck, to: EMPLOYER_ROUTES.completion },
];

const activeItemClass =
  'bg-[linear-gradient(90deg,#3A0353_0%,#804A8A_100%)] text-white shadow-[0_8px_18px_rgba(21,1,30,0.17)]';
const idleItemClass = 'text-[#EDE6F3] hover:bg-white/8';

export function EmployerSidebar() {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const pipelineActive = pathname.startsWith(EMPLOYER_ROUTES.pipeline);
  const interviewsActive =
    pathname.startsWith('/employer/interviews') ||
    (pathname.startsWith('/employer/applications') && pathname.includes('/decision'));
  const completionActive =
    pathname.startsWith(EMPLOYER_ROUTES.completion) ||
    (pathname.startsWith('/employer/applications') && pathname.includes('/agreement'));

  return (
    <aside className="relative flex w-full shrink-0 flex-col overflow-hidden rounded-[32px] bg-[#3B0454] px-4 pb-4 pt-6 text-white lg:mt-2 lg:h-[calc(100vh-48px)] lg:min-h-[720px] lg:w-64">
      <div className="flex items-center gap-2.5 ps-1">
        <span className="flex size-[30px] items-center justify-center rounded-[10px_10px_10px_3px] bg-[linear-gradient(135deg,#C9A8E0_0%,#804A8A_100%)] text-[11px] font-extrabold tracking-[-0.8px] text-white shadow-[0_8px_16px_rgba(21,1,30,0.18)]">
          ih
        </span>
        <span>
          <span className="block text-[13px] font-bold leading-tight tracking-[-0.3px]">
            Interns <span className="font-extrabold">HUB</span>
          </span>
          <span className="mt-0.5 block text-[10px] leading-tight text-[#EDE6F3]/70">
            {t('brand.portal')}
          </span>
        </span>
      </div>

      <div className="mt-5 flex items-center gap-2.5 rounded-[14px] border border-white/15 bg-white/10 px-3.5 py-3">
        <span className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#C9A8E0_0%,#804A8A_100%)] text-[10px] font-bold">
          {employerProfile.viewerInitials}
          {employerProfile.online ? (
            <span className="absolute -end-0.5 bottom-0 size-2 rounded-full border border-[#3B0454] bg-[#33D473]" />
          ) : null}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[10px] font-bold text-white">{employerProfile.companyName}</span>
          <span className="mt-0.5 block truncate text-[9px] text-[#EDE6F3]">
            {employerProfile.viewerName} • {employerProfile.viewerRole}
          </span>
        </span>
      </div>

      <p className="mt-5 ps-2 text-[8px] font-bold tracking-[1.3px] text-[#EDE6F3]/60 uppercase">
        {t('brand.recruitment')}
      </p>

      <nav aria-label={t('brand.recruitment')} className="mt-2 grid grid-cols-2 gap-1 lg:block">
        {mainNav.map((item) => {
          const Icon = item.icon;
          const isPipeline = item.id === 'pipeline' && pipelineActive;
          const isInterviews = item.id === 'interviews' && interviewsActive;
          const isCompletion = item.id === 'completion' && completionActive;
          const active = isPipeline || isInterviews || isCompletion;

          const content = (
            <>
              <Icon className="size-4 shrink-0" strokeWidth={1.7} />
              <span className="min-w-0 flex-1 truncate text-start text-[11px]">{t(item.labelKey)}</span>
              {item.badge ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    'h-[18px] w-[22px] shrink-0 rounded-full',
                    active ? 'bg-white/22' : 'bg-white/14',
                  )}
                />
              ) : null}
            </>
          );

          const className = cn(
            'flex h-10 w-full items-center gap-3 rounded-[11px] ps-4 pe-2.5 transition',
            active ? activeItemClass : idleItemClass,
            item.disabled ? 'cursor-not-allowed opacity-55' : '',
          );

          if (item.to && !item.disabled) {
            return (
              <Link
                key={item.id}
                to={item.to}
                aria-current={active ? 'page' : undefined}
                className={className}
              >
                {content}
              </Link>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              disabled
              aria-disabled="true"
              aria-current={active ? 'page' : undefined}
              className={cn(className, !active ? 'cursor-default opacity-55' : 'cursor-default')}
            >
              {content}
            </button>
          );
        })}
      </nav>

      <div className="relative mt-auto pt-5">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[-16px] bottom-[-16px] h-56 bg-[radial-gradient(circle_at_70%_10%,rgba(190,130,218,0.36),transparent_58%),radial-gradient(circle_at_20%_75%,rgba(128,74,138,0.6),transparent_55%)]"
        />
        <Link
          to={ROUTES.internship}
          className="relative flex min-h-14 w-full items-center justify-center gap-2 rounded-[14px] border border-white/35 bg-[linear-gradient(135deg,#6A2A8A_0%,#3B0454_100%)] px-3 text-[10px] font-bold text-[#EDE6F3] shadow-[0_12px_28px_rgba(21,1,30,0.22)] transition hover:brightness-110"
        >
          <span>{t('sidebar.switchToStudent')}</span>
          <ArrowRight className="size-4 rtl:rotate-180" strokeWidth={1.8} />
        </Link>
      </div>
    </aside>
  );
}
