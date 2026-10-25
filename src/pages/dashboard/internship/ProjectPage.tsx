import { useTranslation } from 'react-i18next';

import sprintChevronIcon from '@/assets/dashboard/ic-sprint-chevron.svg';
import sprintNoteIcon from '@/assets/dashboard/ic-sprint-note.svg';
import layerIcon from '@/assets/dashboard/ic-layer.svg';
import sprintIcon from '@/assets/dashboard/ic-link-square.svg';
import completedIcon from '@/assets/dashboard/ic-task-square.svg';
import timerIcon from '@/assets/dashboard/ic-timer.svg';
import leaderDivider from '@/assets/dashboard/leader-divider.svg';
import { YourProjectPill } from '@/components/dashboard/ProjectSummaryCard';
import { CARD, IconTile, ProgressBar } from '@/components/dashboard/primitives';
import { MemberAvatar, SquadMemberCard, TrackBadge } from '@/components/dashboard/SquadMemberCard';
import { ROUTES } from '@/constants/routes';
import { EMPTY_SEAT_AVATAR } from '@/data/internshipDashboard';
import { useAuth } from '@/hooks/useAuth';
import { useInternship } from '@/hooks/useInternship';
import type { SprintBoardDto, SprintSummaryDto, SquadDetailsDto } from '@/lib/api/types';
import { cn } from '@/lib/cn';
import { daysLeft, toSquadMembers } from '@/lib/internship';

import { InternshipError, InternshipLoading, InternshipNotice } from './InternshipStates';
import { MyTasks, ProjectLinks } from './ProjectWork';
import { TaskBoard } from './TaskBoard';
import { useSquadBoard } from './useSquadBoard';

// Project dashboard after the Senior starts the squad ("project", 31:35261): the squad
// (GET /api/me/squad), its sprints and the selected sprint's board (useSquadBoard). The API has
// no project name, description, sprint goal or story points, so those Figma parts are left out.

function ProjectHeader({ squad }: { squad: SquadDetailsDto }) {
  const { t } = useTranslation();
  const isCompleted = squad.status === 'Completed';
  return (
    <section aria-labelledby="project-title" className={cn(CARD, 'flex flex-col gap-3 p-4 sm:px-[18px] sm:py-4')}>
      <YourProjectPill />
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <h1 id="project-title" className="text-2xl font-medium leading-tight text-black sm:text-[32px]">
          <bdi>{t('dashboard.project.squadProject', { track: squad.trackName })}</bdi>
        </h1>
        <span className={cn('rounded-full px-3 py-1 text-[11px] font-bold', isCompleted ? 'bg-[#f6ebff] text-[#3b0454]' : 'bg-[#e3fbe5] text-[#068f2f]')}>
          {t(isCompleted ? 'dashboard.project.completed' : 'dashboard.project.active')}
        </span>
      </div>
      <p className="max-w-[540px] text-xs leading-[15px] text-[#4d4d4d]">{t('dashboard.project.summary')}</p>
    </section>
  );
}

function ProjectTeam({ squad }: { squad: SquadDetailsDto }) {
  const { t } = useTranslation();
  return (
    <section aria-label={t('dashboard.project.teamLabel')} className={cn(CARD, 'p-4 sm:p-6')}>
      <ul className="grid grid-cols-2 justify-items-center gap-x-3 gap-y-8 sm:flex sm:flex-wrap sm:items-start sm:justify-center sm:gap-x-4 xl:flex-nowrap xl:justify-between">
        <li className="col-span-2 flex w-full max-w-[209px] flex-col items-center gap-6">
          <MemberAvatar src={EMPTY_SEAT_AVATAR} />
          <div className="flex flex-col items-center gap-[13px]">
            <p className="text-center text-base font-bold tracking-[0.13px] text-black"><bdi>{squad.seniorName || t('dashboard.squad.seniorPending')}</bdi></p>
            <TrackBadge label={t('dashboard.project.teamLeader')} tone="leader" size="md" />
          </div>
        </li>
        {/* Figma draws this divider as a rotated 238px line next to the Team Leader. */}
        <li aria-hidden="true" className="hidden h-[238px] w-px shrink-0 items-center justify-center self-center xl:flex">
          <img src={leaderDivider} alt="" className="h-px w-[238px] max-w-none rotate-90" />
        </li>
        {toSquadMembers(squad).map((member, index) => (
          <SquadMemberCard key={member.id} member={member} seatNumber={index + 1} showContacts={false} />
        ))}
      </ul>
    </section>
  );
}

type SprintOverviewProps = {
  sprints: SprintSummaryDto[];
  board: SprintBoardDto;
  onSelect: (sprintId: string) => void;
};

function SprintOverview({ sprints, board, onSelect }: SprintOverviewProps) {
  const { t, i18n } = useTranslation();
  const formatDay = (iso: string, withYear: boolean) =>
    new Intl.DateTimeFormat(i18n.language, { month: 'short', day: 'numeric', ...(withYear && { year: 'numeric' }) }).format(new Date(iso));
  const total = board.tasks.length;
  const completed = board.tasks.filter((task) => task.status === 'Done').length;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  const stats = [
    { key: 'total', icon: layerIcon, value: total, tileClass: 'bg-[#f6ebff]', labelClass: 'text-[#3b0454]', valueClass: 'text-[#3b0454]' },
    { key: 'completed', icon: completedIcon, value: completed, tileClass: 'bg-[#d4fadc]', labelClass: 'text-[#15d04d]', valueClass: 'text-[#068f2f]' },
    { key: 'remaining', icon: timerIcon, value: total - completed, tileClass: 'bg-[#ffe3e3]', labelClass: 'text-[#f21620]', valueClass: 'text-[#f21620]' },
  ] as const;

  return (
    <section aria-labelledby="sprint-title" className={cn(CARD, 'flex flex-col gap-5 p-4 sm:p-[18px]')}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <IconTile icon={sprintIcon} />
          <div>
            <h2 id="sprint-title" className="text-2xl font-semibold leading-tight text-black sm:text-[32px]">
              {t('dashboard.sprint.title', { number: String(board.sprintNumber).padStart(2, '0') })}
            </h2>
            <p className="text-[11px] font-medium text-[#828282]">
              {t('dashboard.sprint.dates', { start: formatDay(board.startsAt, false), end: formatDay(board.endsAt, true) })}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-[#e7e7e7] px-2.5 py-1 text-[10px] font-medium text-[#545454]">
          {board.status === 'Active'
            ? t('dashboard.sprint.daysLeft', { count: daysLeft(board.endsAt, Date.now()) })
            : t(`dashboard.sprint.statuses.${board.status}`)}
        </span>
      </div>
      <div className="relative flex min-h-[52px] items-center gap-2 rounded-[20px] border border-[#909090] px-4">
        <img src={sprintNoteIcon} alt="" className="size-6 shrink-0" />
        <select aria-label={t('dashboard.sprint.select')} value={board.sprintId} onChange={(event) => onSelect(event.target.value)} className="min-w-0 flex-1 appearance-none bg-transparent pe-8 text-base font-bold">
          {[...sprints].sort((a, b) => a.number - b.number).map((sprint) => (
            <option key={sprint.id} value={sprint.id}>
              {t(sprint.status === 'Active' ? 'dashboard.sprint.current' : 'dashboard.sprint.option', { number: sprint.number })}
            </option>
          ))}
        </select>
        <img src={sprintChevronIcon} alt="" className="pointer-events-none absolute end-4 h-[21.5px] w-[25px]" />
      </div>
      <div className="flex flex-wrap items-end justify-end gap-4">
        <div className="text-end">
          <p className="text-[28px] font-semibold leading-none text-black">{t('dashboard.common.percent', { value: percent })}</p>
          <p className="mt-1 text-[9px] text-[#4d4d4d]">{t('dashboard.sprint.tasksDone', { done: completed, total })}</p>
        </div>
      </div>
      <ProgressBar value={percent} max={100} label={t('dashboard.sprint.progressLabel')} className="-mt-2 h-[7px]" />
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-6">
        {stats.map((stat) => (
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

function ProjectWorkspace({ squad }: { squad: SquadDetailsDto }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const myUserId = user?.id ?? null;
  const squadBoard = useSquadBoard(squad.id);
  const { board } = squadBoard;

  let sprintContent;
  if (squadBoard.status === 'loading') sprintContent = <InternshipLoading />;
  else if (squadBoard.status === 'error') sprintContent = <InternshipError errorKey={squadBoard.errorKey} onRetry={squadBoard.reload} />;
  else if (!board) sprintContent = <p className={cn(CARD, 'p-6 text-center text-base text-[#737373]')}>{t('dashboard.sprint.none')}</p>;
  else {
    sprintContent = (
      <>
        <SprintOverview sprints={squadBoard.sprints} board={board} onSelect={squadBoard.selectSprint} />
        <ProjectLinks repositoryUrl={squad.repositoryUrl} />
        <MyTasks tasks={board.tasks} myUserId={myUserId} />
        <TaskBoard tasks={board.tasks} myUserId={myUserId} onMove={(taskId, next) => void squadBoard.move(taskId, next)} moveErrorKey={squadBoard.moveErrorKey} />
      </>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <ProjectHeader squad={squad} />
      <ProjectTeam squad={squad} />
      {sprintContent}
      {!board && <ProjectLinks repositoryUrl={squad.repositoryUrl} />}
    </div>
  );
}

export default function ProjectPage() {
  const { t } = useTranslation();
  const { status, data, errorKey, reload } = useInternship();

  if (status === 'loading') return <InternshipLoading />;
  if (status === 'error') return <InternshipError errorKey={errorKey} onRetry={reload} />;
  const squad = data?.squad;
  // The project opens once the Senior starts the squad.
  if (!squad || squad.status === 'Forming') {
    return (
      <InternshipNotice
        title={t('dashboard.project.notStartedTitle')}
        body={t('dashboard.project.notStartedBody')}
        to={ROUTES.dashboardInternship}
        cta={t('dashboard.project.backToInternship')}
      />
    );
  }
  return <ProjectWorkspace squad={squad} />;
}
