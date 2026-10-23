import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import keyIcon from '@/assets/dashboard/ic-key.svg';
import peopleIcon from '@/assets/dashboard/ic-people.svg';
import { ProjectSummaryCard } from '@/components/dashboard/ProjectSummaryCard';
import { ACTION_BUTTON, CARD, IconHeading, Notice, ProgressBar, PURPLE_GRADIENT } from '@/components/dashboard/primitives';
import { MemberAvatar, SquadMemberCard } from '@/components/dashboard/SquadMemberCard';
import { SAMPLE_FULL_SQUAD, SAMPLE_SENIOR, SAMPLE_SQUAD, SQUAD_SEATS, type SquadState } from '@/data/internshipDashboard';
import { cn } from '@/lib/cn';

function SeniorCard() {
  const { t } = useTranslation();
  return (
    <section aria-labelledby="senior-title" className={`${CARD} min-w-0 p-6`}>
      <IconHeading icon={peopleIcon}>
        <h2 id="senior-title" className="text-2xl font-bold">{t('dashboard.squad.seniorTitle')}</h2>
      </IconHeading>
      <div className="mt-4 flex flex-wrap items-center gap-6">
        <MemberAvatar photo={SAMPLE_SENIOR.photo} />
        <div className="min-w-0 flex-1 basis-40">
          <p className="text-2xl font-bold"><bdi>{SAMPLE_SENIOR.name}</bdi></p>
          <p className="mt-6 text-xl font-semibold">{t('dashboard.squad.seniorRole')}</p>
        </div>
      </div>
    </section>
  );
}

function ReadinessMetric({ label, count }: { label: string; count: number }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3 text-base">
        <p>{label}</p>
        <p className="text-[#828282]">{t('dashboard.squad.seats', { value: count, max: SQUAD_SEATS })}</p>
      </div>
      <ProgressBar value={count} max={SQUAD_SEATS} label={label} />
    </div>
  );
}

export function SquadReadyView({ state }: { state: SquadState }) {
  const { t } = useTranslation();
  const [hasPressedReady, setHasPressedReady] = useState(state.hasPressedReady);
  const readyCount = state.membersReady + (hasPressedReady && !state.hasPressedReady ? 1 : 0);
  const notice = hasPressedReady && state.notice === 'pressReady' ? 'youAreReady' : state.notice;
  const squad = state.isSquadFull ? SAMPLE_FULL_SQUAD : SAMPLE_SQUAD;
  const filledSeats = squad.filter((member) => member !== null).length;

  return (
    <>
      <Notice tone={notice === 'allSet' ? 'success' : 'warning'}>{t(`dashboard.squad.notice.${notice}`)}</Notice>
      <section aria-labelledby="squad-title" className={`${CARD} min-w-0 p-4 sm:p-6`}>
        <IconHeading icon={peopleIcon}>
          <h1 id="squad-title" className="text-2xl font-bold">
            <Trans i18nKey="dashboard.squad.title" components={{ purple: <span className="text-[#42046b]" /> }} />
          </h1>
        </IconHeading>
        <p className="mt-2 text-xs font-medium leading-[18px]">{t('dashboard.squad.description')}</p>
        <ul className="mt-10 grid grid-cols-2 justify-items-center gap-x-3 gap-y-8 md:grid-cols-4">
          {squad.map((member, index) => <SquadMemberCard key={member?.id ?? `seat-${index}`} member={member} seatNumber={index + 1} />)}
        </ul>
      </section>
      <div className="grid min-w-0 gap-6 lg:grid-cols-2">
        <SeniorCard />
        <section aria-labelledby="readiness-title" className={`${CARD} flex min-w-0 flex-col gap-4 p-6`}>
          <IconHeading icon={keyIcon} className="gap-2">
            <h2 id="readiness-title" className="text-xl font-bold">
              <Trans i18nKey="dashboard.squad.readinessTitle" components={{ purple: <span className="text-[#42046b]" /> }} />
            </h2>
          </IconHeading>
          <ReadinessMetric label={t('dashboard.squad.seatsFilled')} count={filledSeats} />
          <ReadinessMetric label={t('dashboard.squad.membersReady')} count={readyCount} />
          <button
            type="button"
            aria-pressed={hasPressedReady}
            disabled={hasPressedReady}
            onClick={() => setHasPressedReady(true)}
            className={cn(ACTION_BUTTON, 'mt-auto', hasPressedReady ? 'border-2 border-[#00c707] text-black' : `${PURPLE_GRADIENT} text-white shadow-[0_10px_22px_rgba(58,3,83,0.2)]`)}
          >
            {t('dashboard.squad.ready')}
          </button>
        </section>
      </div>
      <ProjectSummaryCard />
    </>
  );
}
