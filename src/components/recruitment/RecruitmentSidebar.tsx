import type { ComponentType } from 'react';
import {
  Bell,
  BookOpen,
  Briefcase,
  Calendar,
  FileText,
  GraduationCap,
  Handshake,
  LayoutGrid,
  ListChecks,
  MessageSquare,
  PieChart,
  FileBadge2,
  Search,
  Users,
  Waypoints,
  X,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { CURRENT_APPLICANT } from '@/lib/recruitment/data';
import { ROUTES } from '@/constants/routes';

type IconComponent = ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;

type SidebarLinkProps = {
  icon: IconComponent;
  label: string;
  to?: string;
  active?: boolean;
  badge?: string;
  onNavigate: () => void;
};

function SidebarLink({ icon: Icon, label, to, active = false, badge, onNavigate }: SidebarLinkProps) {
  const className = [
    'flex min-h-9 w-full items-center gap-3 rounded-full px-3 text-start text-[14px] font-medium transition',
    active
      ? 'bg-[linear-gradient(90deg,#3A0353_0%,#804A8A_100%)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]'
      : to
        ? 'text-[#E6DAEE] hover:bg-white/10 hover:text-white'
        : 'cursor-default text-[#C5AAD4] opacity-55',
  ].join(' ');

  const content = (
    <>
      <Icon className="size-4 shrink-0" aria-hidden={true} />
      <span className="truncate">{label}</span>
      {badge ? <span className="ms-auto flex size-5 shrink-0 items-center justify-center rounded-full bg-white/15 text-[11px] font-semibold text-white">{badge}</span> : null}
    </>
  );

  if (!to) {
    return (
      <button type="button" className={className} disabled>
        {content}
      </button>
    );
  }

  return (
    <Link
      to={to}
      className={className}
      aria-current={active ? 'page' : undefined}
      onClick={onNavigate}
    >
      {content}
    </Link>
  );
}

type RecruitmentSidebarProps = {
  mobileOpen: boolean;
  onClose: () => void;
};

export function RecruitmentSidebar({ mobileOpen, onClose }: RecruitmentSidebarProps) {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const isActive = (prefix: string) =>
    pathname === prefix || pathname.startsWith(`${prefix}/`);

  const score = CURRENT_APPLICANT.compositeScore;


  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label={t('recruitment.shell.closeMenu')}
          className="fixed inset-0 z-40 bg-[#1C0A2B]/55 backdrop-blur-[2px] lg:hidden"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={[
          'fixed inset-y-0 start-0 z-50 flex h-dvh w-[272px] flex-col overflow-hidden bg-[#3B0454] px-4 pb-5 pt-5 text-white shadow-[0_24px_60px_-28px_rgba(43,4,65,0.55)] transition-transform duration-300',
          'lg:inset-y-auto lg:bottom-6 lg:top-6 lg:h-[calc(100vh-3rem)] lg:max-h-[976px] lg:translate-x-0 lg:rounded-[36px] rtl:lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full [dir=rtl]:translate-x-full',
        ].join(' ')}
        aria-label={t('recruitment.nav.recruitment')}
      >
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[285px] overflow-hidden" aria-hidden="true">
          <div className="absolute -bottom-24 -left-24 h-[220px] w-[430px] rotate-[-15deg] rounded-[50%] bg-[#8B5CE2]" />
          <div className="absolute -bottom-24 left-[108px] h-[245px] w-[340px] rotate-[18deg] rounded-[50%] bg-[#F5A85F]" />
          <div className="absolute -bottom-32 -left-16 h-[180px] w-[440px] rotate-[-9deg] rounded-[50%] bg-[#7650CF]" />
        </div>
        <div className="relative z-10 flex items-center justify-between gap-2 px-1">
          <Link to={ROUTES.home} className="flex min-w-0 items-center gap-2.5" onClick={onClose}>
            <GraduationCap className="size-9 shrink-0 text-white" aria-hidden="true" />
            <span className="truncate text-[21px] font-semibold tracking-[-0.02em]">
              {t('recruitment.shell.brandName')}{' '}
              <span className="font-bold text-[#D8C9DF]">
                {t('recruitment.shell.brandAccent')}
              </span>
            </span>
          </Link>
          <button
            type="button"
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-[#E6DAEE] transition hover:bg-white/10 hover:text-white lg:hidden"
            onClick={onClose}
            aria-label={t('recruitment.shell.closeMenu')}
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <nav className="relative z-10 mt-6 min-h-0 flex-1 overflow-y-auto pe-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="space-y-1">
            <SidebarLink icon={ListChecks} label={t('recruitment.nav.internship')} onNavigate={onClose} />
            <SidebarLink
              icon={Users}
              label={t('recruitment.nav.mySquad')}
              onNavigate={onClose}
            />
            <SidebarLink
              icon={BookOpen}
              label={t('recruitment.nav.courses')}
              onNavigate={onClose}
            />
          </div>

          <div className="mt-3 space-y-1">
            <SidebarLink icon={Briefcase} label={t('recruitment.nav.recruitment')} to={ROUTES.recruitment} onNavigate={onClose} />
            <SidebarLink
              icon={LayoutGrid}
              label={t('recruitment.nav.dashboard')}
              to={ROUTES.recruitment}
              active={pathname === ROUTES.recruitment}
              onNavigate={onClose}
            />
            <SidebarLink
              icon={GraduationCap}
              label={t('recruitment.nav.eligibility')}
              to={ROUTES.recruitmentEligibility}
              active={isActive(ROUTES.recruitmentEligibility)}
              onNavigate={onClose}
            />
            <SidebarLink
              icon={Search}
              label={t('recruitment.nav.talentProfile')}
              to={`${ROUTES.recruitment}/profile`}
              active={isActive(`${ROUTES.recruitment}/profile`)}
              onNavigate={onClose}
            />
            <SidebarLink
              icon={Briefcase}
              label={t('recruitment.nav.opportunities')}
              to={`${ROUTES.recruitment}/opportunities`}
              active={isActive(`${ROUTES.recruitment}/opportunities`)}
              badge="4"
              onNavigate={onClose}
            />
            <SidebarLink
              icon={FileText}
              label={t('recruitment.nav.applications')}
              to={ROUTES.recruitmentApplications}
              active={isActive(ROUTES.recruitmentApplications)}
              onNavigate={onClose}
            />
            <SidebarLink
              icon={Calendar}
              label={t('recruitment.nav.interview')}
              to={`${ROUTES.recruitment}/interview`}
              active={isActive(`${ROUTES.recruitment}/interview`)}
              badge="1"
              onNavigate={onClose}
            />
            <SidebarLink
              icon={Handshake}
              label={t('recruitment.nav.agreement')}
              to={ROUTES.recruitmentAgreements}
              active={isActive(ROUTES.recruitmentAgreements)}
              onNavigate={onClose}
            />
            <SidebarLink
              icon={Bell}
              label={t('recruitment.nav.notifications')}
              to={`${ROUTES.recruitment}/notifications`}
              active={isActive(`${ROUTES.recruitment}/notifications`)}
              badge="2"
              onNavigate={onClose}
            />
          </div>

          <div className="mt-3 space-y-1">
            <SidebarLink icon={Waypoints} label={t('recruitment.nav.sprints')} onNavigate={onClose} />
            <SidebarLink
              icon={PieChart}
              label={t('recruitment.nav.progress')}
              onNavigate={onClose}
            />
            <SidebarLink
              icon={MessageSquare}
              label={t('recruitment.nav.chat')}
              onNavigate={onClose}
            />
            <SidebarLink
              icon={FileBadge2}
              label={t('recruitment.nav.certificate')}
              onNavigate={onClose}
            />
          </div>
        </nav>

        <div className="relative z-10 mt-3 shrink-0">
          <div className="rounded-[24px] border border-white/20 bg-[linear-gradient(145deg,rgba(91,30,130,0.9),rgba(48,0,75,0.92))] p-4 shadow-[0_18px_38px_-22px_rgba(12,4,24,0.65),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[13px] font-medium text-[#F1E7F7]">
                {t('recruitment.shell.compositeScore')}
              </span>
              <span className="rounded-full bg-white/20 px-3 py-1 text-[12px] font-bold text-white">{CURRENT_APPLICANT.percentile}</span>
            </div>
            <p className="mt-3 text-[36px] font-bold leading-none text-white">{score}%</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/25">
              <div
                className="h-full rounded-full bg-white"
                style={{ width: `${score}%` }}
              />
            </div>
            <p className="mt-3 flex items-center gap-2 text-[12px] leading-5 text-white"><span className="size-2 shrink-0 rounded-full bg-[#39E77D]" />Eligible · Profile visible</p>
          </div>
        </div>
      </aside>
    </>
  );
}
