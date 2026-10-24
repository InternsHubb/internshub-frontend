import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { BookOpen, BriefcaseBusiness, Lock, Target, Users, type LucideIcon } from 'lucide-react';

import { ProgressBar } from '@/components/dashboard/primitives';
import { ROUTES } from '@/constants/routes';
import { SAMPLE_LEARNER_PROGRESS, SAMPLE_NEXT_SESSION } from '@/data/learnerDashboard';
import { cn } from '@/lib/cn';

import { DecorRings } from './DecorRings';
import { HOME_CARD, formatSessionDay, isolate } from './homeShared';

// "Your hub" of the "Learner dashboard" reference: one card per service (Courses,
// Internship, Mentorship) plus the full-width Recruitment card.

type PillTone = 'progress' | 'muted';

function HubPill({ tone, icon: Icon, children }: { tone: PillTone; icon?: LucideIcon; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-[13px] font-semibold',
        tone === 'progress' ? 'bg-[#f6a55b] text-[#3b1a00]' : 'bg-[#f1eaf7] text-[#4e0f7c]',
      )}
    >
      {Icon && <Icon className="size-3.5" aria-hidden="true" />}
      {children}
    </span>
  );
}

type HubCardProps = {
  titleId: string;
  title: string;
  icon: LucideIcon;
  bannerClass: string;
  pill: ReactNode;
  to?: string;
  children: ReactNode;
};

function HubCard({ titleId, title, icon: Icon, bannerClass, pill, to, children }: HubCardProps) {
  const body = (
    <>
      <div className={cn('relative isolate h-[84px] overflow-hidden', bannerClass)}>
        <DecorRings className="-end-10 -top-12 -z-10 w-[180px]" />
        <Icon className="absolute bottom-4 start-6 size-8 text-white" strokeWidth={1.6} aria-hidden="true" />
      </div>
      <div className="flex flex-1 flex-col gap-2 px-5 pb-6 pt-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 id={titleId} className="text-lg font-bold leading-tight text-[#1c0b2b]">{title}</h3>
          {pill}
        </div>
        {children}
      </div>
    </>
  );
  const shell = cn(HOME_CARD, 'flex flex-col overflow-hidden');

  if (!to) {
    return <article aria-labelledby={titleId} className={shell}>{body}</article>;
  }
  return (
    <Link
      to={to}
      aria-labelledby={titleId}
      className={cn(
        shell,
        'outline-none transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(59,4,84,0.12)] focus-visible:ring-2 focus-visible:ring-[#5a198f] focus-visible:ring-offset-2 motion-reduce:hover:translate-y-0',
      )}
    >
      {body}
    </Link>
  );
}

const DETAIL = 'text-sm leading-snug text-[#6b5d78]';

export function DashboardHub() {
  const { t, i18n } = useTranslation();
  const progress = SAMPLE_LEARNER_PROGRESS;

  return (
    <section aria-labelledby="hub-title" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="hub-title" className="text-2xl font-bold text-[#1c0b2b]">{t('dashboard.home.hub.title')}</h2>
        <p className="text-sm text-[#6b5d78]">{t('dashboard.home.hub.subtitle')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <HubCard
          titleId="hub-courses"
          title={t('dashboard.home.hub.courses.title')}
          icon={BookOpen}
          bannerClass="bg-[#4a0a7f]"
          to={ROUTES.dashboardCourses}
          pill={<HubPill tone="progress">{t('dashboard.home.hub.courses.status')}</HubPill>}
        >
          <p className={DETAIL}>
            {t('dashboard.home.hub.courses.detail', { course: isolate(progress.courseName), module: progress.currentModule })}
          </p>
          <ProgressBar
            value={progress.coursePercent}
            max={100}
            label={t('dashboard.home.hub.courses.progressLabel')}
            className="mt-2"
            trackClassName="bg-[#ede6f3]"
            fillClassName="bg-[#3b0454]"
          />
          <p className={cn(DETAIL, 'mt-1')}>{t('dashboard.home.hub.courses.complete', { value: progress.coursePercent })}</p>
        </HubCard>

        <HubCard
          titleId="hub-internship"
          title={t('dashboard.home.hub.internship.title')}
          icon={BriefcaseBusiness}
          bannerClass="bg-[#2a0640]"
          to={ROUTES.dashboardInternship}
          pill={<HubPill tone="muted" icon={Lock}>{t('dashboard.home.hub.internship.status')}</HubPill>}
        >
          <p className={DETAIL}>{t('dashboard.home.hub.internship.detail')}</p>
          <p className={cn(DETAIL, 'mt-1')}>{t('dashboard.home.hub.internship.extra')}</p>
        </HubCard>

        <HubCard
          titleId="hub-mentorship"
          title={t('dashboard.home.hub.mentorship.title')}
          icon={Users}
          bannerClass="bg-[#6b2fa0]"
          pill={<HubPill tone="muted">{t('dashboard.home.hub.mentorship.status')}</HubPill>}
        >
          <p className={DETAIL}>{t('dashboard.home.hub.mentorship.senior', { name: isolate(SAMPLE_NEXT_SESSION.mentor) })}</p>
          <p className={cn(DETAIL, 'mt-1')}>
            {t('dashboard.home.hub.mentorship.next', { date: formatSessionDay(SAMPLE_NEXT_SESSION.startsAt, i18n.language) })}
          </p>
        </HubCard>
      </div>

      <HubCard
        titleId="hub-recruitment"
        title={t('dashboard.home.hub.recruitment.title')}
        icon={Target}
        bannerClass="bg-[#22073a]"
        pill={<HubPill tone="muted">{t('dashboard.home.hub.recruitment.status')}</HubPill>}
      >
        <p className={DETAIL}>{t('dashboard.home.hub.recruitment.detail')}</p>
        <p className={cn(DETAIL, 'mt-1')}>{t('dashboard.home.hub.recruitment.extra')}</p>
      </HubCard>
    </section>
  );
}

export default DashboardHub;
