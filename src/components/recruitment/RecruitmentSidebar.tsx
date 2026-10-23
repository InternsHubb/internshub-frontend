import type { ComponentType } from 'react';
import {
  Bell,
  BookOpen,
  Briefcase,
  Calendar,
  FileCheck,
  FileText,
  GraduationCap,
  Handshake,
  LayoutGrid,
  Search,
  Users,
  X,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  DEFAULT_AGREEMENT_ID,
  DEFAULT_APPLICATION_ID,
  CURRENT_APPLICANT,
} from '@/lib/recruitment/data';
import {
  ROUTES,
  recruitmentAgreementPath,
  recruitmentApplicationPath,
} from '@/constants/routes';

type IconComponent = ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;

type SidebarLinkProps = {
  icon: IconComponent;
  label: string;
  to?: string;
  active?: boolean;
  onNavigate: () => void;
};

function SidebarLink({ icon: Icon, label, to, active = false, onNavigate }: SidebarLinkProps) {
  const className = [
    'flex min-h-9 w-full items-center gap-2.5 rounded-full px-3 text-start text-[12px] font-medium transition',
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
          'fixed inset-y-0 start-0 z-50 flex h-dvh w-[256px] flex-col overflow-hidden bg-[#3B0454] px-4 pb-5 pt-5 text-white shadow-[0_24px_60px_-28px_rgba(43,4,65,0.55)] transition-transform duration-300',
          'lg:inset-y-auto lg:bottom-6 lg:top-6 lg:h-[calc(100vh-3rem)] lg:max-h-[976px] lg:translate-x-0 lg:rounded-[36px] rtl:lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full [dir=rtl]:translate-x-full',
        ].join(' ')}
        aria-label={t('recruitment.nav.recruitment')}
      >
        <div className="flex items-center justify-between gap-2 px-1">
          <Link to={ROUTES.home} className="flex min-w-0 items-center gap-2.5" onClick={onClose}>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-[11px] bg-[linear-gradient(135deg,#7C3AED_0%,#A855F7_100%)] text-[11px] font-bold tracking-tight text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.24)]">
              IH
            </span>
            <span className="truncate text-[15px] font-semibold tracking-[-0.02em]">
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

        <nav className="mt-6 min-h-0 flex-1 overflow-y-auto pe-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <p className="px-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#B99FC8]">
            {t('recruitment.nav.internship')}
          </p>
          <div className="mt-2 space-y-1">
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

          <p className="mt-5 px-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#B99FC8]">
            {t('recruitment.nav.recruitment')}
          </p>
          <div className="mt-2 space-y-1">
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
              to={ROUTES.recruitmentTalentDirectory}
              active={isActive(ROUTES.recruitmentTalentDirectory)}
              onNavigate={onClose}
            />
            <SidebarLink
              icon={Briefcase}
              label={t('recruitment.nav.opportunities')}
              onNavigate={onClose}
            />
            <SidebarLink
              icon={FileText}
              label={t('recruitment.nav.applications')}
              to={recruitmentApplicationPath(DEFAULT_APPLICATION_ID)}
              active={isActive(ROUTES.recruitmentApplications)}
              onNavigate={onClose}
            />
            <SidebarLink
              icon={Calendar}
              label={t('recruitment.nav.interview')}
              onNavigate={onClose}
            />
            <SidebarLink
              icon={Handshake}
              label={t('recruitment.nav.agreement')}
              to={recruitmentAgreementPath(DEFAULT_AGREEMENT_ID)}
              active={isActive(ROUTES.recruitmentAgreements)}
              onNavigate={onClose}
            />
            <SidebarLink
              icon={Bell}
              label={t('recruitment.nav.notifications')}
              onNavigate={onClose}
            />
          </div>

          <p className="mt-5 px-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#B99FC8]">
            {t('recruitment.nav.sprints')}
          </p>
          <div className="mt-2 space-y-1">
            <SidebarLink
              icon={FileCheck}
              label={t('recruitment.nav.progress')}
              onNavigate={onClose}
            />
            <SidebarLink
              icon={Users}
              label={t('recruitment.nav.chat')}
              onNavigate={onClose}
            />
            <SidebarLink
              icon={FileCheck}
              label={t('recruitment.nav.certificate')}
              onNavigate={onClose}
            />
          </div>
        </nav>

        <div className="mt-4 shrink-0">
          <div className="rounded-[18px] bg-[linear-gradient(135deg,#6A2A8A_0%,#3B0454_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#CDB6DC]">
                {t('recruitment.nav.progress')}
              </span>
              <span className="text-[13px] font-semibold text-white">{score}%</span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#C084FC_0%,#F0ABFC_100%)]"
                style={{ width: `${score}%` }}
              />
            </div>
            <p className="mt-3 text-[10px] leading-4 text-[#E6DAEE]">
              {t('recruitment.shell.compositeScore')}
            </p>
            <p className="mt-1 text-[9px] leading-4 text-[#B99FC8]">
              {CURRENT_APPLICANT.percentile}
            </p>
          </div>
          <p className="mt-3 text-center text-[9px] text-[#9F7BB3]">© 2026 InternsHub</p>
        </div>
      </aside>
    </>
  );
}
