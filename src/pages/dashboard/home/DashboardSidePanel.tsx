import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import type { useInternship } from '@/hooks/useInternship';
import { cn } from '@/lib/cn';
import { initialsOf } from '@/lib/initials';
import { levelKey, toSquadMembers } from '@/lib/internship';

import { CardError, SkeletonLines } from './HomeStates';
import { HOME_CARD } from './homeShared';

// Right column of the "Learner dashboard" reference: interview result and squad, from the
// internship journey (GET /api/me/interviews and GET /api/me/squad via useInternship).

type Internship = ReturnType<typeof useInternship>;

const TEXT = 'text-sm leading-relaxed text-[#6b5d78]';

// The API returns the confirmed level only (no per-skill scores), so the card shows the level.
export function InterviewResultCard({ internship }: { internship: Internship }) {
  const { t } = useTranslation();
  const level = internship.data?.level ?? null;

  let content;
  if (internship.status === 'loading') content = <SkeletonLines />;
  else if (internship.status === 'error') content = <CardError errorKey={internship.errorKey} onRetry={internship.reload} />;
  else if (!level) content = <p className={TEXT}>{t('dashboard.home.interview.empty')}</p>;
  else content = <p className={cn(TEXT, 'rounded-2xl bg-[#f6f2f9] px-4 py-3')}>{t('dashboard.home.interview.levelNote')}</p>;

  return (
    <section aria-labelledby="interview-result-title" className={cn(HOME_CARD, 'flex flex-col gap-5 p-6')}>
      <div className="flex items-center justify-between gap-3">
        <h2 id="interview-result-title" className="text-lg font-bold text-[#1c0b2b]">{t('dashboard.home.interview.title')}</h2>
        {level && (
          <span className="rounded-full bg-[#2a0640] px-3 py-1 text-[13px] font-semibold text-white">
            {t(`onboarding.interview.levels.${levelKey(level)}`)}
          </span>
        )}
      </div>
      {content}
    </section>
  );
}

const AVATAR_TONES = ['bg-[#f1eaf7] text-[#4e0f7c]', 'bg-[#fdeedd] text-[#b4561a]'] as const;

type SquadCardProps = { internship: Internship; userId: string | null; learnerName: string };

export function SquadCard({ internship, userId, learnerName }: SquadCardProps) {
  const { t } = useTranslation();
  const squad = internship.data?.squad ?? null;
  const members = squad ? toSquadMembers(squad) : [];

  let content;
  if (internship.status === 'loading') content = <SkeletonLines widths={['w-2/3', 'w-1/2', 'w-3/5']} />;
  else if (internship.status === 'error') content = <CardError errorKey={internship.errorKey} onRetry={internship.reload} />;
  else if (members.length === 0) content = <p className={TEXT}>{t('dashboard.home.squad.empty')}</p>;
  else {
    content = (
      <ul className="flex flex-col gap-4">
        {members.map((member, index) => {
          const isYou = member.id === userId;
          const name = member.name || (isYou ? learnerName : '');
          return (
            <li key={member.id} className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className={cn(
                  'flex size-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold',
                  isYou ? 'bg-[#3b0454] text-white' : AVATAR_TONES[index % AVATAR_TONES.length],
                )}
              >
                {initialsOf(name, name.includes('@'))}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[15px] font-semibold text-[#1c0b2b]">
                  <bdi>{name}</bdi>
                  {isYou && <span className="font-normal text-[#6b5d78]"> {t('dashboard.home.squad.you')}</span>}
                </p>
                {member.track && <p className="truncate text-[13px] text-[#6b5d78]"><bdi>{member.track}</bdi></p>}
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <section aria-labelledby="home-squad-title" className={cn(HOME_CARD, 'flex flex-col gap-4 p-6')}>
      <div className="flex items-center justify-between gap-3">
        <h2 id="home-squad-title" className="text-lg font-bold text-[#1c0b2b]">{t('dashboard.home.squad.title')}</h2>
        <Link
          to={ROUTES.dashboardInternship}
          className="rounded text-sm font-semibold text-[#4e0f7c] outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[#5a198f]"
        >
          {members.length > 0 ? t('dashboard.home.squad.viewAll', { count: members.length }) : t('dashboard.home.squad.open')}
        </Link>
      </div>
      {content}
    </section>
  );
}
