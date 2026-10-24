import { Trans, useTranslation } from 'react-i18next';

import calendarIcon from '@/assets/dashboard/ic-calendar-add.svg';
import clockIcon from '@/assets/dashboard/ic-clock.svg';
import codeIcon from '@/assets/dashboard/ic-code.svg';
import peopleIcon from '@/assets/dashboard/ic-people.svg';
import securityIcon from '@/assets/dashboard/ic-security-time.svg';
import verifyIcon from '@/assets/dashboard/ic-verify.svg';
import { CARD_LARGE, IconHeading, OUTLINE_CARD, StatusPill } from '@/components/dashboard/primitives';
import { MemberAvatar } from '@/components/dashboard/SquadMemberCard';
import { SAMPLE_INTERNSHIP, WAITING_AVATARS, type WaitingState } from '@/data/internshipDashboard';

import { GithubUsernameCard } from './GithubUsernameCard';

function PackageTimeline({ variant }: { variant: WaitingState['packageCard'] }) {
  const { t } = useTranslation();
  return (
    <section aria-labelledby="package-title" className={`${OUTLINE_CARD} p-6`}>
      <IconHeading icon={securityIcon} className="gap-2">
        <h2 id="package-title" className="text-base font-semibold">
          <Trans i18nKey={`dashboard.waiting.package.${variant}.title`} components={{ purple: <span className="text-[#42046b]" /> }} />
        </h2>
      </IconHeading>
      <p className="mt-2 ps-8 text-xs font-semibold leading-[18px] text-[#828282]">
        {t(`dashboard.waiting.package.${variant}.description`)}
      </p>
    </section>
  );
}

const NEXT_STEPS = [
  { key: 'forming', icon: peopleIcon },
  { key: 'setup', icon: codeIcon },
  { key: 'starts', icon: verifyIcon },
] as const;

function NextSteps() {
  const { t } = useTranslation();
  return (
    <section aria-labelledby="next-steps-title" className={`${OUTLINE_CARD} p-6`}>
      <h2 id="next-steps-title" className="text-xl font-semibold">{t('dashboard.waiting.nextTitle')}</h2>
      <ol className="mt-3 flex flex-col gap-4">
        {NEXT_STEPS.map(({ key, icon }, index) => (
          <li key={key} className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <IconHeading icon={icon} className="gap-2">
                <h3 className="text-base font-semibold text-[#42046b]">{t(`dashboard.waiting.next.${key}.title`, { number: index + 1 })}</h3>
              </IconHeading>
              <p className="mt-2 ps-8 text-xs font-semibold leading-[18px] text-[#828282]">{t(`dashboard.waiting.next.${key}.description`)}</p>
            </div>
            {index === 0 && <StatusPill>{t('dashboard.waiting.inProgress')}</StatusPill>}
          </li>
        ))}
      </ol>
    </section>
  );
}

export function FindingSquadView({ state }: { state: WaitingState }) {
  const { t, i18n } = useTranslation();
  const waitingDate = new Intl.DateTimeFormat(i18n.language, {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
  }).format(new Date(`${SAMPLE_INTERNSHIP.waitingSince}T00:00:00Z`));

  return (
    <section aria-labelledby="internship-title" className={`${CARD_LARGE} flex min-w-0 flex-col gap-6 p-4 sm:p-6`}>
      <IconHeading icon={peopleIcon} className="gap-2">
        <h1 id="internship-title" className="text-base font-bold">{t('dashboard.waiting.title')}</h1>
      </IconHeading>
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <IconHeading icon={clockIcon}>
            <h2 className="text-xl font-bold sm:text-2xl">
              <Trans i18nKey="dashboard.waiting.finding" components={{ purple: <span className="text-[#42046b]" /> }} />
            </h2>
          </IconHeading>
          <StatusPill>{t('dashboard.waiting.inProgress')}</StatusPill>
        </div>
        <p className="mt-1 text-xs font-semibold leading-[18px] text-[#737373]">{t('dashboard.waiting.description')}</p>
      </div>
      <ul aria-label={t('dashboard.waiting.avatars')} className="mx-auto grid w-full max-w-[840px] grid-cols-2 justify-items-center gap-x-2 gap-y-6 py-4 md:grid-cols-4">
        {WAITING_AVATARS.map((avatar) => <li key={avatar}><MemberAvatar src={avatar} /></li>)}
      </ul>
      <dl className="flex flex-wrap justify-between gap-x-8 gap-y-5 sm:px-10">
        {[
          ['track', SAMPLE_INTERNSHIP.track],
          ['packageLabel', t('dashboard.waiting.months', { count: state.packageMonths })],
          ['level', t(`dashboard.waiting.levels.${SAMPLE_INTERNSHIP.levelKey}`)],
        ].map(([label, content]) => (
          <div key={label} className="text-center">
            <dt className="text-base font-bold">{t(`dashboard.waiting.${label}`)}</dt>
            <dd className="mt-3 text-sm text-[#828282]">{content}</dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <IconHeading icon={calendarIcon} className="gap-3">
          <p className="text-base font-semibold">{t('dashboard.waiting.since', { date: waitingDate })}</p>
        </IconHeading>
        <p className={state.packageCard === 'timeline' ? 'text-sm font-semibold text-[#828282]' : 'text-xl font-extrabold text-[#828282]'}>
          {t('dashboard.waiting.day', { day: SAMPLE_INTERNSHIP.waitingDay })}
        </p>
      </div>
      <PackageTimeline variant={state.packageCard} />
      <NextSteps />
      <GithubUsernameCard initialStatus={state.github} initialUsername={state.githubUsername} />
    </section>
  );
}
