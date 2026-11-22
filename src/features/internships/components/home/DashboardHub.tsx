import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { BookOpen, BriefcaseBusiness, Lock, Target, Users, type LucideIcon } from 'lucide-react';

import { ProgressBar } from '@/features/internships/components/primitives';
import { ROUTES } from '@/app/routes';
import type { InternshipData, useInternship } from '@/features/internships/hooks/useInternship';
import type { MentorBookingDto } from '@/features/internships/types/internships.types';
import { cn } from '@/shared/utils/cn';

import { DecorRings } from '@/features/internships/components/home/DecorRings';
import { nextKeyFor, type NextKey } from '@/features/internships/utils/homeJourney';
import { CardError, SkeletonLines } from '@/features/internships/components/home/HomeStates';
import { HOME_CARD, formatSessionDay, isolate } from '@/features/internships/utils/homeShared';
import type { Loaded } from '@/features/internships/hooks/useHomeActivity';

// "Your hub" of the "Learner dashboard" reference: one card per service (Courses,
// Internship, Mentorship) plus the full-width Recruitment card. Courses and Internship
// follow the internship journey; Mentorship shows the next booked session. Recruitment
// has no learner API yet, so its card stays descriptive.

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

// Internship pill per journey step: locked until the interview, then waiting list, forming, active.
const INTERNSHIP_STATUS: Record<NextKey, 'locked' | 'waiting' | 'forming' | 'active'> = {
  courses: 'locked',
  technicalInterview: 'locked',
  review: 'locked',
  findingSquad: 'waiting',
  squadForming: 'forming',
  squadActive: 'active',
};

function CoursesCard({ data }: { data: InternshipData | null }) {
  const { t } = useTranslation();
  const k = (key: string, options?: Record<string, unknown>) => t(`dashboard.home.hub.courses.${key}`, options);
  const hasCourses = data !== null && data.plan !== '3m';
  const percent = data?.coursesPercent ?? 0;

  let pill = <HubPill tone="muted">{k(data ? 'statuses.notIncluded' : 'statuses.notStarted')}</HubPill>;
  if (hasCourses) pill = <HubPill tone="progress">{k(percent >= 100 ? 'statuses.completed' : 'statuses.inProgress')}</HubPill>;

  return (
    <HubCard titleId="hub-courses" title={k('title')} icon={BookOpen} bannerClass="bg-[#4a0a7f]" to={ROUTES.dashboardCourses} pill={pill}>
      {hasCourses ? (
        <>
          <p className={DETAIL}>{k('detail', { track: isolate(data.trackName) })}</p>
          <ProgressBar value={percent} max={100} label={k('progressLabel')} className="mt-2" trackClassName="bg-[#ede6f3]" fillClassName="bg-[#3b0454]" />
          <p className={cn(DETAIL, 'mt-1')}>{k('complete', { value: percent })}</p>
        </>
      ) : (
        <p className={DETAIL}>{k(data ? 'notIncludedDetail' : 'noPackage')}</p>
      )}
    </HubCard>
  );
}

function InternshipCard({ data }: { data: InternshipData | null }) {
  const { t } = useTranslation();
  const k = (key: string, options?: Record<string, unknown>) => t(`dashboard.home.hub.internship.${key}`, options);
  const next = data ? nextKeyFor(data) : null;
  const status = next ? INTERNSHIP_STATUS[next] : 'locked';

  return (
    <HubCard
      titleId="hub-internship"
      title={k('title')}
      icon={BriefcaseBusiness}
      bannerClass="bg-[#2a0640]"
      to={ROUTES.dashboardInternship}
      pill={<HubPill tone={status === 'active' ? 'progress' : 'muted'} icon={status === 'locked' ? Lock : undefined}>{k(`statuses.${status}`)}</HubPill>}
    >
      <p className={DETAIL}>{next && data ? k(`details.${next}`, { track: isolate(data.trackName) }) : k('details.none')}</p>
      <p className={cn(DETAIL, 'mt-1')}>{k('extra')}</p>
    </HubCard>
  );
}

function MentorshipCard({ session }: { session: Loaded<MentorBookingDto | null> }) {
  const { t, i18n } = useTranslation();
  const k = (key: string, options?: Record<string, unknown>) => t(`dashboard.home.hub.mentorship.${key}`, options);
  const booking = session.value;

  let content;
  if (session.status === 'loading') content = <SkeletonLines />;
  else if (session.status === 'error') content = <CardError errorKey={session.errorKey} onRetry={session.reload} />;
  else if (!booking) content = <p className={DETAIL}>{k('empty')}</p>;
  else {
    content = (
      <>
        <p className={DETAIL}>{k('mentor', { name: isolate(booking.mentorName || t('dashboard.home.nextSession.mentorFallback')) })}</p>
        <p className={cn(DETAIL, 'mt-1')}>{k('next', { date: formatSessionDay(booking.startsAt, i18n.language) })}</p>
      </>
    );
  }

  return (
    <HubCard
      titleId="hub-mentorship"
      title={k('title')}
      icon={Users}
      bannerClass="bg-[#6b2fa0]"
      // A retry button can't sit inside a link, so the card links only when there is nothing to retry.
      to={session.status === 'error' ? undefined : ROUTES.mentorship}
      pill={<HubPill tone="muted">{k(booking ? 'statuses.booked' : 'statuses.none')}</HubPill>}
    >
      {content}
    </HubCard>
  );
}

type DashboardHubProps = { internship: ReturnType<typeof useInternship>; session: Loaded<MentorBookingDto | null> };

export function DashboardHub({ internship, session }: DashboardHubProps) {
  const { t } = useTranslation();
  const isLoading = internship.status === 'loading';

  return (
    <section aria-labelledby="hub-title" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="hub-title" className="text-2xl font-bold text-[#1c0b2b]">{t('dashboard.home.hub.title')}</h2>
        <p className="text-sm text-[#6b5d78]">{t('dashboard.home.hub.subtitle')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {isLoading && (
          <>
            <article className={cn(HOME_CARD, 'p-5')}><SkeletonLines widths={['w-1/3', 'w-3/4', 'w-1/2']} /></article>
            <article className={cn(HOME_CARD, 'p-5')}><SkeletonLines widths={['w-1/3', 'w-3/4', 'w-1/2']} /></article>
          </>
        )}
        {internship.status === 'error' && (
          <>
            <HubCard titleId="hub-courses" title={t('dashboard.home.hub.courses.title')} icon={BookOpen} bannerClass="bg-[#4a0a7f]" pill={null}>
              <CardError errorKey={internship.errorKey} onRetry={internship.reload} />
            </HubCard>
            <HubCard titleId="hub-internship" title={t('dashboard.home.hub.internship.title')} icon={BriefcaseBusiness} bannerClass="bg-[#2a0640]" pill={null}>
              <CardError errorKey={internship.errorKey} onRetry={internship.reload} />
            </HubCard>
          </>
        )}
        {!isLoading && internship.status !== 'error' && (
          <>
            <CoursesCard data={internship.data} />
            <InternshipCard data={internship.data} />
          </>
        )}
        <MentorshipCard session={session} />
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
