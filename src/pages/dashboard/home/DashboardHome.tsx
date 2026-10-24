import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, SquareCheckBig } from 'lucide-react';

import { ROUTES } from '@/constants/routes';
import { SAMPLE_PROFILE } from '@/data/internshipDashboard';
import { SAMPLE_NEXT_SESSION, SAMPLE_TODAY_TASK } from '@/data/learnerDashboard';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/cn';

import { DashboardHero } from './DashboardHero';
import { DashboardHub } from './DashboardHub';
import { InterviewResultCard, SquadCard } from './DashboardSidePanel';
import { EYEBROW, HOME_CARD, formatSessionDay, formatTime, isolate } from './homeShared';

// Learner Dashboard home (/dashboard). No Figma frame exists: the "Learner dashboard"
// reference image is the source. SAMPLE DATA ONLY (see src/data/learnerDashboard.ts);
// the learner's name comes from the session when signed in.

function TodayTaskCard() {
  const { t, i18n } = useTranslation();
  return (
    <section aria-labelledby="today-task-title" className={cn(HOME_CARD, 'flex items-center gap-4 p-5')}>
      <span aria-hidden="true" className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#f1eaf7] text-[#4e0f7c]">
        <SquareCheckBig className="size-6" strokeWidth={1.8} />
      </span>
      <div className="min-w-0 flex-1">
        <p className={EYEBROW}>{t('dashboard.home.todayTask.eyebrow')}</p>
        <h2 id="today-task-title" className="mt-1 text-[17px] font-bold leading-snug text-[#1c0b2b]">
          <bdi>{SAMPLE_TODAY_TASK.title}</bdi>
        </h2>
        <p className="mt-1 text-sm text-[#6b5d78]">
          {t('dashboard.home.todayTask.due', { time: formatTime(SAMPLE_TODAY_TASK.dueAt, i18n.language) })}
        </p>
      </div>
      <Link
        to={ROUTES.dashboardProject}
        aria-label={t('dashboard.home.todayTask.open')}
        className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#2a0640] text-white outline-none transition hover:bg-[#3b0454] focus-visible:ring-2 focus-visible:ring-[#5a198f] focus-visible:ring-offset-2"
      >
        <ArrowRight className="size-5 rtl:-scale-x-100" aria-hidden="true" />
      </Link>
    </section>
  );
}

function NextSessionCard() {
  const { t, i18n } = useTranslation();
  const when = `${formatSessionDay(SAMPLE_NEXT_SESSION.startsAt, i18n.language)} · ${formatTime(SAMPLE_NEXT_SESSION.startsAt, i18n.language)}`;
  return (
    <section aria-labelledby="next-session-title" className={cn(HOME_CARD, 'flex items-center gap-4 p-5')}>
      <span aria-hidden="true" className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#fdeedd] text-[#e0802f]">
        <CalendarDays className="size-6" strokeWidth={1.8} />
      </span>
      <div className="min-w-0 flex-1">
        <p className={EYEBROW}>{t('dashboard.home.nextSession.eyebrow')}</p>
        <h2 id="next-session-title" className="mt-1 text-[17px] font-bold leading-snug text-[#1c0b2b]">
          {t('dashboard.home.nextSession.title', { name: isolate(SAMPLE_NEXT_SESSION.mentor) })}
        </h2>
        <p className="mt-1 text-sm text-[#6b5d78]">{when}</p>
      </div>
      {/* No sessions/meeting API yet, so joining is shown but disabled. */}
      <button
        type="button"
        disabled
        title={t('dashboard.home.nextSession.joinUnavailable')}
        className="min-h-11 shrink-0 cursor-not-allowed rounded-2xl border border-[#e2d8ea] px-5 text-sm font-semibold text-[#2a0640] opacity-80"
      >
        {t('dashboard.home.nextSession.join')}
      </button>
    </section>
  );
}

export default function DashboardHome() {
  const { user } = useAuth();
  const fullName = user?.fullName?.trim() ?? '';
  // Same identity rules as the top bar: session first, sample profile when signed out.
  const displayName = fullName || user?.email?.trim() || SAMPLE_PROFILE.name;
  const firstName = (user ? fullName : SAMPLE_PROFILE.name).split(/\s+/)[0] ?? '';
  const role = user ? '' : SAMPLE_PROFILE.subtitle;

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <DashboardHero firstName={firstName} />

      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_310px]">
        <div className="flex min-w-0 flex-col gap-6">
          <div className="grid gap-4 md:grid-cols-2">
            <TodayTaskCard />
            <NextSessionCard />
          </div>
          <DashboardHub />
        </div>
        <div className="grid min-w-0 content-start gap-6 md:grid-cols-2 xl:grid-cols-1">
          <InterviewResultCard />
          <SquadCard learnerName={displayName} learnerRole={role} />
        </div>
      </div>
    </div>
  );
}
