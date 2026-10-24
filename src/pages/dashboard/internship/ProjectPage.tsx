import { useTranslation } from 'react-i18next';

import layerIcon from '@/assets/dashboard/ic-layer.svg';
import sprintIcon from '@/assets/dashboard/ic-link-square.svg';
import starIcon from '@/assets/dashboard/ic-star.svg';
import completedIcon from '@/assets/dashboard/ic-task-square.svg';
import timerIcon from '@/assets/dashboard/ic-timer.svg';
import leaderDivider from '@/assets/dashboard/leader-divider.svg';
import { YourProjectPill } from '@/components/dashboard/ProjectSummaryCard';
import { CARD, IconTile, ProgressBar } from '@/components/dashboard/primitives';
import { MemberAvatar, SquadMemberCard, TrackBadge } from '@/components/dashboard/SquadMemberCard';
import { SAMPLE_PROJECT, SAMPLE_PROJECT_TEAM, SAMPLE_SENIOR, SAMPLE_SPRINT } from '@/data/internshipDashboard';
import { cn } from '@/lib/cn';

import { MyTasks, ProjectLinks } from './ProjectWork';
import { TaskBoard } from './TaskBoard';

// Project dashboard after the squad starts ("project", 31:35261). SAMPLE DATA ONLY: there are
// no project, sprint or task endpoints yet.

function ProjectHeader() {
  const { t } = useTranslation();
  return (
    <section aria-labelledby="project-title" className={cn(CARD, 'flex flex-col gap-3 p-4 sm:px-[18px] sm:py-4')}>
      <YourProjectPill />
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <h1 id="project-title" className="text-2xl font-medium leading-tight text-black sm:text-[32px]">
          <bdi>{SAMPLE_PROJECT.name}</bdi>
        </h1>
        <span className="rounded-full bg-[#e3fbe5] px-3 py-1 text-[11px] font-bold text-[#068f2f]">{t('dashboard.project.active')}</span>
      </div>
      <p className="max-w-[540px] text-xs leading-[15px] text-[#4d4d4d]"><bdi>{SAMPLE_PROJECT.description}</bdi></p>
    </section>
  );
}

function ProjectTeam() {
  const { t } = useTranslation();
  return (
    <section aria-label={t('dashboard.project.teamLabel')} className={cn(CARD, 'p-4 sm:p-6')}>
      <ul className="grid grid-cols-2 justify-items-center gap-x-3 gap-y-8 sm:flex sm:flex-wrap sm:items-start sm:justify-center sm:gap-x-4 xl:flex-nowrap xl:justify-between">
        <li className="col-span-2 flex w-full max-w-[209px] flex-col items-center gap-6">
          <MemberAvatar photo={SAMPLE_SENIOR.photo} />
          <div className="flex flex-col items-center gap-[13px]">
            <p className="text-center text-base font-bold tracking-[0.13px] text-black"><bdi>{SAMPLE_SENIOR.projectName}</bdi></p>
            <TrackBadge label={t('dashboard.project.teamLeader')} tone="leader" size="md" />
          </div>
        </li>
        {/* Figma draws this divider as a rotated 238px line next to the Team Leader. */}
        <li aria-hidden="true" className="hidden h-[238px] w-px shrink-0 items-center justify-center self-center xl:flex">
          <img src={leaderDivider} alt="" className="h-px w-[238px] max-w-none rotate-90" />
        </li>
        {SAMPLE_PROJECT_TEAM.map((member, index) => (
          <SquadMemberCard key={member.id} member={member} seatNumber={index + 1} showContacts={false} />
        ))}
      </ul>
    </section>
  );
}

const SPRINT_STATS = [
  { key: 'total', icon: layerIcon, value: SAMPLE_SPRINT.totalTasks, tileClass: 'bg-[#f6ebff]', labelClass: 'text-[#3b0454]', valueClass: 'text-[#3b0454]' },
  { key: 'completed', icon: completedIcon, value: SAMPLE_SPRINT.completedTasks, tileClass: 'bg-[#d4fadc]', labelClass: 'text-[#15d04d]', valueClass: 'text-[#068f2f]' },
  { key: 'remaining', icon: timerIcon, value: SAMPLE_SPRINT.remainingTasks, tileClass: 'bg-[#ffe3e3]', labelClass: 'text-[#f21620]', valueClass: 'text-[#f21620]' },
  { key: 'storyPoints', icon: starIcon, value: SAMPLE_SPRINT.storyPoints, tileClass: 'bg-[#fffbe6]', labelClass: 'text-[#a5a800]', valueClass: 'text-[#606202]' },
] as const;

function SprintOverview() {
  const { t, i18n } = useTranslation();
  const formatDay = (iso: string, withYear: boolean) =>
    new Intl.DateTimeFormat(i18n.language, { month: 'short', day: 'numeric', ...(withYear && { year: 'numeric' }), timeZone: 'UTC' })
      .format(new Date(`${iso}T00:00:00Z`));
  const sprintNumber = String(SAMPLE_SPRINT.number).padStart(2, '0');

  return (
    <section aria-labelledby="sprint-title" className={cn(CARD, 'flex flex-col gap-5 p-4 sm:p-[18px]')}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <IconTile icon={sprintIcon} />
          <div>
            <h2 id="sprint-title" className="text-2xl font-semibold leading-tight text-black sm:text-[32px]">
              {t('dashboard.sprint.title', { number: sprintNumber })}
            </h2>
            <p className="text-[11px] font-medium text-[#828282]">
              {t('dashboard.sprint.dates', { start: formatDay(SAMPLE_SPRINT.startDate, false), end: formatDay(SAMPLE_SPRINT.endDate, true) })}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-[#e7e7e7] px-2.5 py-1 text-[10px] font-medium text-[#545454]">
          {t('dashboard.sprint.daysLeft', { count: SAMPLE_SPRINT.daysLeft })}
        </span>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold uppercase text-black">{t('dashboard.sprint.goalLabel')}</h3>
          <p className="mt-1 text-sm text-[#4d4d4d]"><bdi>{SAMPLE_SPRINT.goal}</bdi></p>
        </div>
        <div className="text-end">
          <p className="text-[28px] font-semibold leading-none text-black">{t('dashboard.common.percent', { value: SAMPLE_SPRINT.progressPercent })}</p>
          <p className="mt-1 text-[9px] text-[#4d4d4d]">
            {t('dashboard.sprint.tasksDone', { done: SAMPLE_SPRINT.completedTasks, total: SAMPLE_SPRINT.totalTasks })}
          </p>
        </div>
      </div>
      <ProgressBar value={SAMPLE_SPRINT.progressPercent} max={100} label={t('dashboard.sprint.progressLabel')} className="-mt-2 h-[7px]" />
      <ul className="grid grid-cols-2 gap-3 sm:gap-6 xl:grid-cols-4">
        {SPRINT_STATS.map((stat) => (
          <li key={stat.key} className={cn('flex min-h-10 items-center gap-2 rounded-[13px] px-3 py-1.5', stat.tileClass)}>
            <img src={stat.icon} alt="" aria-hidden="true" className="size-[22px] shrink-0" />
            <p className={cn('flex flex-col text-[8px] leading-[10px]', stat.labelClass)}>
              {t(`dashboard.sprint.stats.${stat.key}`)}
              <span className={cn('text-sm font-semibold leading-4', stat.valueClass)}>{stat.value}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function ProjectPage() {
  return (
    <div className="flex min-w-0 flex-col gap-5">
      <ProjectHeader />
      <ProjectTeam />
      <SprintOverview />
      <ProjectLinks />
      <MyTasks />
      <TaskBoard />
    </div>
  );
}
