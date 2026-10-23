import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { ProgressBar } from '@/components/dashboard/primitives';
import { ROUTES } from '@/constants/routes';
import {
  INTERVIEW_SCORE_MAX,
  SAMPLE_INTERVIEW_RESULT,
  SAMPLE_LEARNER_PROGRESS,
  SAMPLE_LEARNER_SQUAD,
  SAMPLE_SQUAD_SIZE,
} from '@/data/learnerDashboard';
import { cn } from '@/lib/cn';
import { initialsOf } from '@/lib/initials';

import { HOME_CARD, formatScore } from './homeShared';

// Right column of the "Learner dashboard" reference: interview result and squad.

export function InterviewResultCard() {
  const { t, i18n } = useTranslation();
  const { metrics, focusMetric } = SAMPLE_INTERVIEW_RESULT;

  return (
    <section aria-labelledby="interview-result-title" className={cn(HOME_CARD, 'flex flex-col gap-5 p-6')}>
      <div className="flex items-center justify-between gap-3">
        <h2 id="interview-result-title" className="text-lg font-bold text-[#1c0b2b]">{t('dashboard.home.interview.title')}</h2>
        <span className="rounded-full bg-[#2a0640] px-3 py-1 text-[13px] font-semibold text-white">
          {t(`dashboard.home.levels.${SAMPLE_LEARNER_PROGRESS.interviewLevel}`)}
        </span>
      </div>
      <ul className="flex flex-col gap-4">
        {metrics.map((metric) => {
          const label = t(`dashboard.home.interview.metrics.${metric.id}`);
          return (
            <li key={metric.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3 text-sm text-[#3d2c4d]">
                <span>{label}</span>
                <span className="font-semibold text-[#1c0b2b]">{formatScore(metric.score, i18n.language)}</span>
              </div>
              <ProgressBar
                value={metric.score}
                max={INTERVIEW_SCORE_MAX}
                label={label}
                trackClassName="bg-[#ede6f3]"
                fillClassName={metric.id === focusMetric ? 'bg-[#f6a55b]' : 'bg-[#3b0454]'}
              />
            </li>
          );
        })}
      </ul>
      <p className="rounded-2xl bg-[#f6f2f9] px-4 py-3 text-sm leading-relaxed text-[#6b5d78]">
        {t('dashboard.home.interview.focus', { module: SAMPLE_LEARNER_PROGRESS.currentModule })}
      </p>
    </section>
  );
}

const AVATAR_TONES = ['bg-[#f1eaf7] text-[#4e0f7c]', 'bg-[#fdeedd] text-[#b4561a]'] as const;

type SquadRow = { id: string; name: string; role: string; isYou: boolean };

export function SquadCard({ learnerName, learnerRole }: { learnerName: string; learnerRole: string }) {
  const { t } = useTranslation();
  const rows: ReadonlyArray<SquadRow> = [
    ...SAMPLE_LEARNER_SQUAD.map((member) => ({ ...member, isYou: false })),
    { id: 'you', name: learnerName, role: learnerRole, isYou: true },
  ];

  return (
    <section aria-labelledby="home-squad-title" className={cn(HOME_CARD, 'flex flex-col gap-4 p-6')}>
      <div className="flex items-center justify-between gap-3">
        <h2 id="home-squad-title" className="text-lg font-bold text-[#1c0b2b]">{t('dashboard.home.squad.title')}</h2>
        <Link
          to={ROUTES.dashboardInternship}
          className="rounded text-sm font-semibold text-[#4e0f7c] outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[#5a198f]"
        >
          {t('dashboard.home.squad.viewAll', { count: SAMPLE_SQUAD_SIZE })}
        </Link>
      </div>
      <ul className="flex flex-col gap-4">
        {rows.map((member, index) => (
          <li key={member.id} className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className={cn(
                'flex size-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold',
                member.isYou ? 'bg-[#3b0454] text-white' : AVATAR_TONES[index % AVATAR_TONES.length],
              )}
            >
              {initialsOf(member.name, false)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold text-[#1c0b2b]">
                <bdi>{member.name}</bdi>
                {member.isYou && <span className="font-normal text-[#6b5d78]"> {t('dashboard.home.squad.you')}</span>}
              </p>
              {member.role && <p className="truncate text-[13px] text-[#6b5d78]"><bdi>{member.role}</bdi></p>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
