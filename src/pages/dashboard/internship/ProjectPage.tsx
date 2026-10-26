import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import layerIcon from '@/assets/dashboard/ic-layer.svg';
import sprintIcon from '@/assets/dashboard/ic-link-square.svg';
import completedIcon from '@/assets/dashboard/ic-task-square.svg';
import timerIcon from '@/assets/dashboard/ic-timer.svg';
import leaderDivider from '@/assets/dashboard/leader-divider.svg';
import { JourneyStepper } from '@/components/dashboard/JourneyStepper';
import { YourProjectPill } from '@/components/dashboard/ProjectSummaryCard';
import { CARD, IconTile, ProgressBar } from '@/components/dashboard/primitives';
import { MemberAvatar, SquadMemberCard, TrackBadge } from '@/components/dashboard/SquadMemberCard';
import { EMPTY_SEAT_AVATAR, type StepperState } from '@/data/internshipDashboard';
import { useAuth } from '@/hooks/useAuth';
import { useInternship } from '@/hooks/useInternship';
import type { SprintBoardDto, SprintSummaryDto, SquadDetailsDto, SquadTaskStatus } from '@/lib/api/types';
import { cn } from '@/lib/cn';
import { daysLeft, toSquadMembers } from '@/lib/internship';

import { InternshipError, InternshipLoading } from './InternshipStates';
import { MyTasks, ProjectLinks } from './ProjectWork';
import { SprintSelect } from './SprintSelect';
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
  isSwitching: boolean;
};

function SprintOverview({ sprints, board, onSelect, isSwitching }: SprintOverviewProps) {
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
      <SprintSelect sprints={sprints} value={board.sprintId} onChange={onSelect} isLoading={isSwitching} />
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

export const sampleActiveSquad: SquadDetailsDto = {
  id: 'sample-squad-1',
  trackId: 'track-fe',
  trackName: 'Frontend Development',
  trackCode: 'FE',
  level: 'Mid',
  status: 'Active',
  seniorUserId: 'senior-1',
  seniorName: 'Ahmed Hassan',
  seniorEmail: 'ahmed@example.com',
  repositoryUrl: 'https://github.com/internshub/frontend-squad-project',
  startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  createdAt: new Date().toISOString(),
  members: [
    { userId: '1', fullName: 'Sara Mohamed', email: 'sara@example.com', joinedAt: new Date().toISOString() },
    { userId: '2', fullName: 'Omar Ali', email: 'omar@example.com', joinedAt: new Date().toISOString() },
    { userId: '3', fullName: 'Nour Kassem', email: 'nour@example.com', joinedAt: new Date().toISOString() },
  ],
};

const fallbackSprints: SprintSummaryDto[] = [
  {
    id: 'sprint-1',
    number: 1,
    status: 'Completed',
    startsAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    endsAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    totalTasksCount: 6,
    completedTasksCount: 6,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sprint-2',
    number: 2,
    status: 'Active',
    startsAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    endsAt: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    totalTasksCount: 6,
    completedTasksCount: 2,
    createdAt: new Date().toISOString(),
  },
];

function getFallbackBoard(squadId: string, myUserId: string | null): SprintBoardDto {
  return {
    sprintId: 'sprint-2',
    squadId,
    sprintNumber: 2,
    status: 'Active',
    startsAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    endsAt: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    tasks: [
      {
        id: 'task-1',
        sprintId: 'sprint-2',
        title: 'Design System & Token Setup',
        description: 'Configure Tailwind tokens and typography styles.',
        assigneeUserId: 'member-1',
        assigneeName: 'Sara Mohamed',
        status: 'Done',
        pullRequestUrl: 'https://github.com/internshub/frontend/pull/1',
        approvedByUserId: 'senior-1',
        approvedByName: 'Ahmed Hassan',
        approvedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
      {
        id: 'task-2',
        sprintId: 'sprint-2',
        title: 'Authentication & Session Guards',
        description: 'Implement JWT refresh and protected route redirects.',
        assigneeUserId: 'member-2',
        assigneeName: 'Omar Ali',
        status: 'Done',
        pullRequestUrl: 'https://github.com/internshub/frontend/pull/2',
        approvedByUserId: 'senior-1',
        approvedByName: 'Ahmed Hassan',
        approvedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
      {
        id: 'task-3',
        sprintId: 'sprint-2',
        title: 'Create Dashboard Journey Stepper and Navigation',
        description: 'Support interactive stage switching and active sub-routes.',
        assigneeUserId: myUserId,
        assigneeName: 'You',
        status: 'InProgress',
        pullRequestUrl: null,
        approvedByUserId: null,
        approvedByName: null,
        approvedAt: null,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'task-4',
        sprintId: 'sprint-2',
        title: 'Sprint Board Kanban and Drag & Drop',
        description: 'Move tasks between Todo, InProgress, InReview, and Done columns.',
        assigneeUserId: myUserId,
        assigneeName: 'You',
        status: 'InReview',
        pullRequestUrl: 'https://github.com/internshub/frontend/pull/3',
        approvedByUserId: null,
        approvedByName: null,
        approvedAt: null,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'task-5',
        sprintId: 'sprint-2',
        title: 'Internship Onboarding Review Screen',
        description: 'Review technical interview feedback and guidelines.',
        assigneeUserId: myUserId,
        assigneeName: 'You',
        status: 'Todo',
        pullRequestUrl: null,
        approvedByUserId: null,
        approvedByName: null,
        approvedAt: null,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'task-6',
        sprintId: 'sprint-2',
        title: 'Mentorship Session Scheduling',
        description: 'Allow booking 1:1 sessions with track mentors.',
        assigneeUserId: 'member-3',
        assigneeName: 'Nour Kassem',
        status: 'Todo',
        pullRequestUrl: null,
        approvedByUserId: null,
        approvedByName: null,
        approvedAt: null,
        createdAt: new Date().toISOString(),
      },
    ],
  };
}

export function ProjectWorkspace({ squad }: { squad: SquadDetailsDto }) {
  const { user } = useAuth();
  const myUserId = user?.id ?? null;
  const squadBoard = useSquadBoard(squad.id);

  const initialBoard = squadBoard.board || getFallbackBoard(squad.id, myUserId);
  const sprints = squadBoard.sprints.length > 0 ? squadBoard.sprints : fallbackSprints;

  const [localBoard, setLocalBoard] = useState<SprintBoardDto>(initialBoard);

  useEffect(() => {
    if (squadBoard.board) {
      setLocalBoard(squadBoard.board);
    } else {
      setLocalBoard(getFallbackBoard(squad.id, myUserId));
    }
  }, [squadBoard.board, squad.id, myUserId]);

  const handleMove = async (taskId: string, next: SquadTaskStatus) => {
    if (squadBoard.board) {
      await squadBoard.move(taskId, next);
    } else {
      setLocalBoard((prev) => ({
        ...prev,
        tasks: prev.tasks.map((task) => (task.id === taskId ? { ...task, status: next } : task)),
      }));
    }
  };

  const currentBoard = localBoard;

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <ProjectHeader squad={squad} />
      <ProjectTeam squad={squad} />
      <SprintOverview
        sprints={sprints}
        board={currentBoard}
        onSelect={squadBoard.selectSprint}
        isSwitching={squadBoard.isSwitching}
      />
      <ProjectLinks repositoryUrl={squad.repositoryUrl || 'https://github.com/internshub/frontend-squad-project'} />
      <MyTasks tasks={currentBoard.tasks} myUserId={myUserId} />
      <TaskBoard
        tasks={currentBoard.tasks}
        myUserId={myUserId}
        onMove={(taskId, next) => void handleMove(taskId, next)}
        moveErrorKey={squadBoard.moveErrorKey}
      />
    </div>
  );
}

export default function ProjectPage() {
  const { status, data, errorKey, reload } = useInternship();

  if (status === 'loading' && !data) return <InternshipLoading />;
  if (status === 'error' && !data) return <InternshipError errorKey={errorKey} onRetry={reload} />;

  const squad: SquadDetailsDto = {
    ...(data?.squad || sampleActiveSquad),
    status: data?.squad?.status && data.squad.status !== 'Forming' ? data.squad.status : 'Active',
    repositoryUrl: data?.squad?.repositoryUrl || 'https://github.com/internshub/frontend-squad-project',
  };

  const withCourses = data?.plan ? data.plan !== '3m' : false;
  const stepperState: StepperState = {
    firstNumber: 1,
    currentIndex: withCourses ? 4 : 3,
    withCourses,
  };

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <JourneyStepper stepper={stepperState} />
      <ProjectWorkspace squad={squad} />
    </div>
  );
}
