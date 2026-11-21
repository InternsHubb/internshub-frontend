import {
  ArrowLeft,
  Bookmark,
  CalendarDays,
  CircleCheck,
  GitBranch,
  GraduationCap,
  LayoutDashboard,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

import { EMPLOYER_ROUTES, ROUTES } from '@/app/routes';
import { employerProfile } from '@/features/recruitment/data/employer/employerStore';
import { cn } from '@/shared/utils/cn';

type NavItem = {
  id: string;
  labelKey: string;
  icon: LucideIcon;
  to?: string;
  disabled?: boolean;
  badge?: string;
};

const mainNav: NavItem[] = [
  { id: 'dashboard', labelKey: 'nav.dashboard', icon: LayoutDashboard, to: EMPLOYER_ROUTES.dashboard },
  { id: 'talent', labelKey: 'nav.talentDirectory', icon: Users, to: EMPLOYER_ROUTES.talent },
  { id: 'shortlist', labelKey: 'nav.shortlist', icon: Bookmark, to: EMPLOYER_ROUTES.shortlist, badge: '3' },
  { id: 'pipeline', labelKey: 'nav.pipeline', icon: GitBranch, to: EMPLOYER_ROUTES.pipeline, badge: '4' },
  { id: 'interviews', labelKey: 'nav.interviews', icon: CalendarDays, to: EMPLOYER_ROUTES.pipeline, badge: '1' },
  { id: 'completion', labelKey: 'nav.completion', icon: CircleCheck, to: EMPLOYER_ROUTES.completion },
];

const activeItemClass =
  'bg-[linear-gradient(90deg,#5B1B75_0%,#804A8A_100%)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] font-semibold';
const idleItemClass = 'text-[#E6DAEE] hover:bg-white/10 hover:text-white';

type EmployerSidebarProps = {
  mobileOpen?: boolean;
  onClose?: () => void;
};

export function EmployerSidebar({ mobileOpen = false, onClose }: EmployerSidebarProps) {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const dashboardActive = pathname === EMPLOYER_ROUTES.dashboard;
  const talentActive = pathname.startsWith(EMPLOYER_ROUTES.talent);
  const shortlistActive = pathname.startsWith(EMPLOYER_ROUTES.shortlist);
  const pipelineActive = pathname.startsWith(EMPLOYER_ROUTES.pipeline);
  const interviewsActive =
    pathname.startsWith('/employer/interviews') ||
    (pathname.startsWith('/employer/applications') && pathname.includes('/decision'));
  const completionActive =
    pathname.startsWith(EMPLOYER_ROUTES.completion) ||
    (pathname.startsWith('/employer/applications') && pathname.includes('/agreement'));

  return (
    <>
      {mobileOpen && onClose ? (
        <button
          type="button"
          aria-label={t('recruitment.shell.closeMenu', 'Close menu')}
          className="fixed inset-0 z-40 bg-[#1C0A2B]/60 backdrop-blur-[2px] lg:hidden"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={cn(
          'fixed inset-y-0 start-0 z-50 flex h-dvh w-[272px] flex-col overflow-hidden bg-[#3B0454] px-4 pb-6 pt-6 text-white shadow-[0_24px_60px_-28px_rgba(43,4,65,0.55)] transition-transform duration-300',
          'lg:static lg:h-[calc(100vh-3rem)] lg:max-h-[976px] lg:w-[272px] lg:translate-x-0 lg:rounded-[36px] rtl:lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 rtl:-translate-x-full rtl:lg:translate-x-0',
        )}
      >
        {/* Background decorative waves */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[285px] overflow-hidden" aria-hidden="true">
          <div className="absolute -bottom-24 -start-24 h-[220px] w-[430px] rotate-[-15deg] rounded-[50%] bg-[#8B5CE2]" />
          <div className="absolute -bottom-24 start-[108px] h-[245px] w-[340px] rotate-[18deg] rounded-[50%] bg-[#F5A85F]" />
          <div className="absolute -bottom-32 -start-16 h-[180px] w-[440px] rotate-[-9deg] rounded-[50%] bg-[#7650CF]" />
        </div>

        {/* Brand header */}
        <div className="relative z-10 flex items-center justify-between gap-2 px-1">
          <Link to={ROUTES.home} className="flex min-w-0 items-center gap-2.5" onClick={onClose}>
            <GraduationCap className="size-9 shrink-0 text-white" aria-hidden="true" />
            <div>
              <span className="block text-[20px] font-bold tracking-tight text-white">
                Interns <span className="font-extrabold text-[#D8C9DF]">HUB</span>
              </span>
              <span className="block text-[11px] font-medium text-[#EDE6F3]/70">
                {t('brand.portal', 'Employer Portal')}
              </span>
            </div>
          </Link>
          {onClose ? (
            <button
              type="button"
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-[#E6DAEE] transition hover:bg-white/10 hover:text-white lg:hidden"
              onClick={onClose}
              aria-label={t('recruitment.shell.closeMenu', 'Close menu')}
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        {/* Company Card */}
        <div className="relative z-10 mt-5 flex items-center gap-3 rounded-[16px] border border-white/15 bg-white/10 p-3 backdrop-blur-sm">
          <span className="relative flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-[linear-gradient(135deg,#8B5CF6_0%,#A855F7_100%)] text-[13px] font-bold text-white shadow-sm">
            {employerProfile.viewerInitials}
            {employerProfile.online ? (
              <span className="absolute -end-0.5 bottom-0 size-2.5 rounded-full border-2 border-[#3B0454] bg-[#22C55E]" />
            ) : null}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[13px] font-bold text-white">{employerProfile.companyName}</span>
            <span className="mt-0.5 block truncate text-[11px] text-[#EDE6F3]/80">
              {employerProfile.viewerName} · {employerProfile.viewerRole}
            </span>
          </span>
        </div>

        {/* Section title */}
        <p className="relative z-10 mt-6 ps-2 text-[11px] font-bold tracking-[1.4px] text-[#EDE6F3]/60 uppercase">
          {t('brand.recruitment', 'RECRUITMENT')}
        </p>

        {/* Nav Links */}
        <nav aria-label={t('brand.recruitment', 'Recruitment')} className="relative z-10 mt-2 space-y-1">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isDashboard = item.id === 'dashboard' && dashboardActive;
            const isTalent = item.id === 'talent' && talentActive;
            const isShortlist = item.id === 'shortlist' && shortlistActive;
            const isPipeline = item.id === 'pipeline' && pipelineActive;
            const isInterviews = item.id === 'interviews' && interviewsActive;
            const isCompletion = item.id === 'completion' && completionActive;
            const active = isDashboard || isTalent || isShortlist || isPipeline || isInterviews || isCompletion;

            const content = (
              <>
                <Icon className="size-4 shrink-0" strokeWidth={1.8} />
                <span className="min-w-0 flex-1 truncate text-start text-[14px]">{t(item.labelKey)}</span>
                {item.badge ? (
                  <span
                    className={cn(
                      'ms-auto flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold',
                      active ? 'bg-white/25 text-white' : 'bg-white/15 text-white',
                    )}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </>
            );

            const className = cn(
              'flex min-h-10 w-full items-center gap-3 rounded-full px-3 text-start text-[14px] transition',
              active ? activeItemClass : idleItemClass,
              item.disabled ? 'cursor-default opacity-55' : '',
            );

            if (item.to && !item.disabled) {
              return (
                <Link
                  key={item.id}
                  to={item.to}
                  aria-current={active ? 'page' : undefined}
                  className={className}
                  onClick={onClose}
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
                className={className}
              >
                {content}
              </button>
            );
          })}
        </nav>

        {/* Bottom action: Switch to Student view */}
        <div className="relative z-10 mt-auto pt-6">
          <Link
            to={ROUTES.recruitment}
            onClick={onClose}
            className="flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full border border-white/20 bg-[#2D0242]/70 px-4 text-[13px] font-semibold text-white shadow-lg backdrop-blur-md transition hover:bg-[#2D0242]/90"
          >
            <ArrowLeft className="size-4 rtl:rotate-180" strokeWidth={2} />
            <span>{t('sidebar.switchToStudent', 'Switch to Student view')}</span>
          </Link>
        </div>
      </aside>
    </>
  );
}

