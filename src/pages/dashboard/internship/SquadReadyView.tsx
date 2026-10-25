import { Trans, useTranslation } from 'react-i18next';

import keyIcon from '@/assets/dashboard/ic-key.svg';
import peopleIcon from '@/assets/dashboard/ic-people.svg';
import { ProjectSummaryCard } from '@/components/dashboard/ProjectSummaryCard';
import { CARD, IconHeading, Notice, ProgressBar } from '@/components/dashboard/primitives';
import { MemberAvatar, SquadMemberCard } from '@/components/dashboard/SquadMemberCard';
import { EMPTY_SEAT_AVATAR, SQUAD_SEATS } from '@/data/internshipDashboard';
import type { SquadDetailsDto } from '@/lib/api/types';
import { toSquadMembers } from '@/lib/internship';

// The learner's squad (GET /api/me/squad): members, Senior and seats. While the squad is
// Forming, the Senior starts it; once Active, the project page opens. The API has no
// per-member "ready" step, so the screen shows the seats only.

function SeniorCard({ name }: { name: string | null }) {
  const { t } = useTranslation();
  return (
    <section aria-labelledby="senior-title" className={`${CARD} min-w-0 p-6`}>
      <IconHeading icon={peopleIcon}>
        <h2 id="senior-title" className="text-2xl font-bold">{t('dashboard.squad.seniorTitle')}</h2>
      </IconHeading>
      <div className="mt-4 flex flex-wrap items-center gap-6">
        <MemberAvatar src={EMPTY_SEAT_AVATAR} />
        <div className="min-w-0 flex-1 basis-40">
          <p className="text-2xl font-bold"><bdi>{name || t('dashboard.squad.seniorPending')}</bdi></p>
          <p className="mt-6 text-xl font-semibold">{t('dashboard.squad.seniorRole')}</p>
        </div>
      </div>
    </section>
  );
}

export function SquadReadyView({ squad }: { squad: SquadDetailsDto }) {
  const { t } = useTranslation();
  const members = toSquadMembers(squad);
  const seats = Math.max(SQUAD_SEATS, members.length);
  const seatList = [...members, ...Array.from({ length: seats - members.length }, () => null)];
  const isForming = squad.status === 'Forming';

  return (
    <>
      <Notice tone={isForming ? 'warning' : 'success'}>{t(isForming ? 'dashboard.squad.notice.forming' : 'dashboard.squad.notice.allSet')}</Notice>
      <section aria-labelledby="squad-title" className={`${CARD} min-w-0 p-4 sm:p-6`}>
        <IconHeading icon={peopleIcon}>
          <h1 id="squad-title" className="text-2xl font-bold">
            <Trans i18nKey="dashboard.squad.title" components={{ purple: <span className="text-[#42046b]" /> }} />
          </h1>
        </IconHeading>
        <p className="mt-2 text-xs font-medium leading-[18px]">{t('dashboard.squad.description')}</p>
        <ul className="mt-10 grid grid-cols-2 justify-items-center gap-x-3 gap-y-8 md:grid-cols-4">
          {seatList.map((member, index) => <SquadMemberCard key={member?.id ?? `seat-${index}`} member={member} seatNumber={index + 1} />)}
        </ul>
      </section>
      <div className="grid min-w-0 gap-6 lg:grid-cols-2">
        <SeniorCard name={squad.seniorName} />
        <section aria-labelledby="readiness-title" className={`${CARD} flex min-w-0 flex-col gap-4 p-6`}>
          <IconHeading icon={keyIcon} className="gap-2">
            <h2 id="readiness-title" className="text-xl font-bold">
              <Trans i18nKey="dashboard.squad.readinessTitle" components={{ purple: <span className="text-[#42046b]" /> }} />
            </h2>
          </IconHeading>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3 text-base">
              <p>{t('dashboard.squad.seatsFilled')}</p>
              <p className="text-[#828282]">{t('dashboard.squad.seats', { value: members.length, max: seats })}</p>
            </div>
            <ProgressBar value={members.length} max={seats} label={t('dashboard.squad.seatsFilled')} />
          </div>
          <p className="mt-auto text-sm text-[#737373]">{t(isForming ? 'dashboard.squad.startsWhenReady' : 'dashboard.squad.started')}</p>
        </section>
      </div>
      <ProjectSummaryCard trackName={squad.trackName} isActive={!isForming} />
    </>
  );
}
