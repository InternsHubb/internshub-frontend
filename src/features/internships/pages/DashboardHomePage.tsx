import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, SquareCheckBig } from 'lucide-react';

import { ROUTES } from '@/app/routes';
import { useAuth } from '@/shared/auth';
import { useInternship } from '@/features/internships/hooks/useInternship';
import type { MentorBookingDto, SquadDetailsDto } from '@/features/internships/types/internships.types';
import { identityOf } from '@/shared/auth';
import { cn } from '@/shared/utils/cn';
import { safeHttpUrl } from '@/shared/utils/url';

import { DashboardHero } from '@/features/internships/components/home/DashboardHero';
import { DashboardHub } from '@/features/internships/components/home/DashboardHub';
import { InterviewResultCard, SquadCard } from '@/features/internships/components/home/DashboardSidePanel';
import { CardError, SkeletonLines } from '@/features/internships/components/home/HomeStates';
import { EYEBROW, HOME_CARD, formatSessionDay, formatTime, isolate } from '@/features/internships/utils/homeShared';
import { useNextSession, useTodayTask, type Loaded, type TodayTask } from '@/features/internships/hooks/useHomeActivity';

// Learner Dashboard home (/dashboard). No Figma frame exists: the "Learner dashboard"
// reference image is the source. Data: the internship journey (useInternship), the learner's
// open sprint task and next mentor session (useHomeActivity), and the signed-in user.

const CARD_ACTION =
  'flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#2a0640] text-white outline-none transition hover:bg-[#3b0454] focus-visible:ring-2 focus-visible:ring-[#5a198f] focus-visible:ring-offset-2';

type ActivityCardProps = { titleId: string; icon: ReactNode; iconClass: string; eyebrow: string; children: ReactNode; action?: ReactNode };

function ActivityCard({ titleId, icon, iconClass, eyebrow, children, action }: ActivityCardProps) {
  return (
    <section aria-labelledby={titleId} className={cn(HOME_CARD, 'flex items-center gap-4 p-5')}>
      <span aria-hidden="true" className={cn('flex size-14 shrink-0 items-center justify-center rounded-2xl', iconClass)}>{icon}</span>
      <div className="min-w-0 flex-1">
        <p id={titleId} className={EYEBROW}>{eyebrow}</p>
        <div className="mt-1">{children}</div>
      </div>
      {action}
    </section>
  );
}

const CARD_TITLE = 'text-[17px] font-bold leading-snug text-[#1c0b2b]';
const CARD_LINE = 'mt-1 text-sm text-[#6b5d78]';

type TodayTaskCardProps = { internshipStatus: string; squad: SquadDetailsDto | null; today: Loaded<TodayTask | null> };

function TodayTaskCard({ internshipStatus, squad, today }: TodayTaskCardProps) {
  const { t, i18n } = useTranslation();
  const k = (key: string, options?: Record<string, unknown>) => t(`dashboard.home.todayTask.${key}`, options);
  const openLink = (to: string) => (
    <Link to={to} aria-label={k('open')} className={CARD_ACTION}>
      <ArrowRight className="size-5 rtl:-scale-x-100" aria-hidden="true" />
    </Link>
  );

  let content;
  let action = null;
  if (internshipStatus === 'loading' || today.status === 'loading') {
    content = <SkeletonLines />;
  } else if (today.status === 'error') {
    content = <CardError errorKey={today.errorKey} onRetry={today.reload} />;
  } else if (today.status === 'idle') {
    // No squad project yet (not on a squad, or the squad hasn't started).
    content = (
      <>
        <h2 className={CARD_TITLE}>{k('emptyTitle')}</h2>
        <p className={CARD_LINE}>{k(squad ? 'emptyForming' : 'emptyBody')}</p>
      </>
    );
    action = openLink(ROUTES.dashboardInternship);
  } else if (!today.value) {
    content = (
      <>
        <h2 className={CARD_TITLE}>{k('doneTitle')}</h2>
        <p className={CARD_LINE}>{k('doneBody')}</p>
      </>
    );
    action = openLink(ROUTES.dashboardProject);
  } else {
    content = (
      <>
        <h2 className={CARD_TITLE}><bdi>{today.value.task.title}</bdi></h2>
        <p className={CARD_LINE}>{k('due', { date: formatSessionDay(today.value.dueAt, i18n.language) })}</p>
      </>
    );
    action = openLink(ROUTES.dashboardProject);
  }

  return (
    <ActivityCard
      titleId="today-task-title"
      icon={<SquareCheckBig className="size-6" strokeWidth={1.8} />}
      iconClass="bg-[#f1eaf7] text-[#4e0f7c]"
      eyebrow={k('eyebrow')}
      action={action}
    >
      {content}
    </ActivityCard>
  );
}

function NextSessionCard({ session }: { session: Loaded<MentorBookingDto | null> }) {
  const { t, i18n } = useTranslation();
  const k = (key: string, options?: Record<string, unknown>) => t(`dashboard.home.nextSession.${key}`, options);
  const booking = session.value;

  let content;
  let action = null;
  if (session.status === 'loading') {
    content = <SkeletonLines />;
  } else if (session.status === 'error') {
    content = <CardError errorKey={session.errorKey} onRetry={session.reload} />;
  } else if (!booking) {
    content = (
      <>
        <h2 className={CARD_TITLE}>{k('emptyTitle')}</h2>
        <p className={CARD_LINE}>{k('emptyBody')}</p>
      </>
    );
    action = (
      <Link to={ROUTES.mentorshipMentors} className="flex min-h-11 shrink-0 items-center rounded-2xl border border-[#e2d8ea] px-5 text-sm font-semibold text-[#2a0640] outline-none transition hover:bg-[#f6f2f9] focus-visible:ring-2 focus-visible:ring-[#5a198f]">
        {k('book')}
      </Link>
    );
  } else {
    const meetingUrl = safeHttpUrl(booking.meetingUrl);
    content = (
      <>
        <h2 className={CARD_TITLE}>{k('title', { name: isolate(booking.mentorName || k('mentorFallback')) })}</h2>
        <p className={CARD_LINE}>{`${formatSessionDay(booking.startsAt, i18n.language)} · ${formatTime(booking.startsAt, i18n.language)}`}</p>
      </>
    );
    action = meetingUrl ? (
      <a href={meetingUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-11 shrink-0 items-center rounded-2xl bg-[#2a0640] px-5 text-sm font-semibold text-white outline-none transition hover:bg-[#3b0454] focus-visible:ring-2 focus-visible:ring-[#5a198f] focus-visible:ring-offset-2">
        {k('join')}
      </a>
    ) : (
      // The mentor hasn't added the meeting link yet.
      <button type="button" disabled title={k('joinUnavailable')} className="min-h-11 shrink-0 cursor-not-allowed rounded-2xl border border-[#e2d8ea] px-5 text-sm font-semibold text-[#2a0640] opacity-80">
        {k('join')}
      </button>
    );
  }

  return (
    <ActivityCard
      titleId="next-session-title"
      icon={<CalendarDays className="size-6" strokeWidth={1.8} />}
      iconClass="bg-[#fdeedd] text-[#e0802f]"
      eyebrow={k('eyebrow')}
      action={action}
    >
      {content}
    </ActivityCard>
  );
}

export default function DashboardHome() {
  const { user } = useAuth();
  const internship = useInternship();
  const session = useNextSession();
  const squad = internship.data?.squad ?? null;
  const today = useTodayTask(squad, user?.id ?? null);
  // Same identity rules as the top bar: the signed-in user's name, else their email.
  const displayName = identityOf(user)?.primary ?? '';
  const firstName = user?.fullName?.trim().split(/\s+/)[0] ?? '';

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <DashboardHero firstName={firstName} internship={internship} />

      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_310px]">
        <div className="flex min-w-0 flex-col gap-6">
          <div className="grid gap-4 md:grid-cols-2">
            <TodayTaskCard internshipStatus={internship.status} squad={squad} today={today} />
            <NextSessionCard session={session} />
          </div>
          <DashboardHub internship={internship} session={session} />
        </div>
        <div className="grid min-w-0 content-start gap-6 md:grid-cols-2 xl:grid-cols-1">
          <InterviewResultCard internship={internship} />
          <SquadCard internship={internship} userId={user?.id ?? null} learnerName={displayName} />
        </div>
      </div>
    </div>
  );
}
