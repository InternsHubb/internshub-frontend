import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';

import { ROUTES } from '@/constants/routes';
import { SAMPLE_LEARNER_JOURNEY, SAMPLE_LEARNER_PROGRESS, type LearnerJourneyStep } from '@/data/learnerDashboard';
import { cn } from '@/lib/cn';

import { DecorRings } from './DecorRings';

// Welcome banner of the "Learner dashboard" reference: greeting, progress line,
// "Continue learning" and the six-step journey (done / current / upcoming).

type Greeting = 'morning' | 'afternoon' | 'evening';

function greetingFor(date: Date): Greeting {
  const hour = date.getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

function stepCaption(step: LearnerJourneyStep, t: TFunction): string {
  const progress = SAMPLE_LEARNER_PROGRESS;
  switch (step.id) {
    case 'aiInterview':
      return t('dashboard.home.journey.aiInterviewCaption', { level: t(`dashboard.home.levels.${progress.interviewLevel}`) });
    case 'courses':
      return t('dashboard.home.journey.coursesCaption', { done: progress.modulesDone, total: progress.modulesTotal });
    default:
      return t(`dashboard.home.journey.${step.id}Caption`);
  }
}

function JourneyStepCard({ step, number }: { step: LearnerJourneyStep; number: number }) {
  const { t } = useTranslation();
  const isDone = step.status === 'done';
  const isCurrent = step.status === 'current';
  const isUpcoming = step.status === 'upcoming';

  return (
    <li
      aria-current={isCurrent ? 'step' : undefined}
      className={cn(
        'flex min-h-[124px] flex-col gap-2 rounded-2xl p-4',
        isDone && 'bg-white/10',
        isCurrent && 'bg-white shadow-[0_10px_30px_rgba(16,0,30,0.35)]',
        isUpcoming && 'border border-dashed border-white/25',
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'flex size-[30px] shrink-0 items-center justify-center rounded-full text-sm font-semibold',
          isDone && 'bg-[#f6a55b] text-[#2a0640]',
          isCurrent && 'border-2 border-[#3b0454] text-[#3b0454]',
          isUpcoming && 'border border-white/40 text-white',
        )}
      >
        {isDone ? <Check className="size-4" strokeWidth={3} /> : number}
      </span>
      <p className={cn('mt-auto text-[15px] font-semibold leading-tight', isCurrent ? 'text-[#2a0640]' : 'text-white')}>
        {t(`dashboard.home.journey.${step.id}`)}
        <span className="sr-only"> ({t(`dashboard.home.journey.status.${step.status}`)})</span>
      </p>
      <p className={cn('text-[13px] leading-tight', isCurrent ? 'text-[#5b4a6b]' : 'text-white/70')}>{stepCaption(step, t)}</p>
    </li>
  );
}

export function DashboardHero({ firstName }: { firstName: string }) {
  const { t } = useTranslation();
  const greeting = greetingFor(new Date());

  return (
    <section
      aria-labelledby="dashboard-greeting"
      className="relative isolate overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#3b0454_0%,#2a0640_55%,#22053a_100%)] px-5 py-7 text-white sm:px-8 lg:px-10 lg:py-9"
    >
      <DecorRings className="-end-28 -top-32 -z-10 w-[420px] sm:-end-16 sm:w-[480px]" />

      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="min-w-0 max-w-[620px]">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#f6a55b]">{t('dashboard.home.eyebrow')}</p>
          <h1 id="dashboard-greeting" className="mt-3 text-[28px] font-bold leading-[1.1] tracking-[-0.01em] sm:text-[36px] xl:text-[40px]">
            {firstName
              ? t(`dashboard.home.greeting.${greeting}`, { name: firstName })
              : t(`dashboard.home.greeting.${greeting}NoName`)}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-white/85">
            {t('dashboard.home.modulesAway', { count: SAMPLE_LEARNER_PROGRESS.modulesToInterview })}
          </p>
        </div>
        <Link
          to={ROUTES.dashboardCourses}
          className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-white px-6 text-base font-semibold text-[#2a0640] shadow-[0_10px_24px_rgba(16,0,30,0.3)] outline-none transition hover:bg-[#f4edf9] focus-visible:ring-2 focus-visible:ring-[#f6a55b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a0640]"
        >
          {t('dashboard.home.continueLearning')}
          <ArrowRight className="size-5 rtl:-scale-x-100" aria-hidden="true" />
        </Link>
      </div>

      <ol aria-label={t('dashboard.home.journey.label')} className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {SAMPLE_LEARNER_JOURNEY.map((step, index) => (
          <JourneyStepCard key={step.id} step={step} number={index + 1} />
        ))}
      </ol>
    </section>
  );
}

export default DashboardHero;
