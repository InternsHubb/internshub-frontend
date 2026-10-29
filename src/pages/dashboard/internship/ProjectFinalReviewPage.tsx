import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Copy,
  Info,
  Repeat,
  Sparkles,
  X,
  XCircle,
} from 'lucide-react';

import avatarBandana from '@/assets/dashboard/avatar-bandana.svg';
import avatarBeanie from '@/assets/dashboard/avatar-beanie.svg';
import avatarCurly from '@/assets/dashboard/avatar-curly.svg';
import avatarGirl from '@/assets/dashboard/avatar-girl.svg';
import approvedIllustration from '@/assets/dashboard/approved-illustration.png';
import changesRequestedIllustration from '@/assets/dashboard/changes-requested-illustration.png';
import hourglassIllustration from '@/assets/dashboard/final-review-hourglass.png';
import rejectedIllustration from '@/assets/dashboard/rejected-illustration.png';
import exportIcon from '@/assets/dashboard/ic-export.svg';
import githubIcon from '@/assets/dashboard/ic-github.svg';
import googleIcon from '@/assets/dashboard/ic-google.svg';
import layerIcon from '@/assets/dashboard/ic-layer.svg';
import sprintIcon from '@/assets/dashboard/ic-link-square.svg';
import scrollIcon from '@/assets/dashboard/ic-scroll.svg';
import completedIcon from '@/assets/dashboard/ic-task-square.svg';
import timerIcon from '@/assets/dashboard/ic-timer.svg';
import seniorPhoto from '@/assets/dashboard/senior-photo.png';
import { CARD, ProgressBar, PURPLE_GRADIENT } from '@/components/dashboard/primitives';
import { ROUTES } from '@/constants/routes';
import { useInternship } from '@/hooks/useInternship';
import { cn } from '@/lib/cn';

type Member = {
  id: string;
  name: string;
  role: string;
  roleTone: 'leader' | 'uiux' | 'backend' | 'frontend' | 'ai';
  avatar: string;
  github: string;
  email: string;
};

const SQUAD_MEMBERS: Member[] = [
  {
    id: '1',
    name: 'Ahmed Ali Ali',
    role: 'Team Leader',
    roleTone: 'leader',
    avatar: seniorPhoto,
    github: 'Merna.Adel2',
    email: 'Mernaadel@gmail.com',
  },
  {
    id: '2',
    name: 'Merna Adel',
    role: 'UI/UX',
    roleTone: 'uiux',
    avatar: avatarGirl,
    github: 'Merna.Adel2',
    email: 'Merna22adel@gmail.com',
  },
  {
    id: '3',
    name: 'Ali Ahmed',
    role: 'Backend',
    roleTone: 'backend',
    avatar: avatarBandana,
    github: 'Merna.Adel2',
    email: 'Merna22adel@gmail.com',
  },
  {
    id: '4',
    name: 'Ahmed Ali',
    role: 'FRONTEND',
    roleTone: 'frontend',
    avatar: avatarCurly,
    github: 'Merna.Adel2',
    email: 'Merna22adel@gmail.com',
  },
  {
    id: '5',
    name: 'Sama Kassem',
    role: 'AI',
    roleTone: 'ai',
    avatar: avatarBeanie,
    github: 'Merna.Adel2',
    email: 'Merna22adel@gmail.com',
  },
];

type LinkItem = {
  id: number;
  labelPrefix: string;
  provider: 'Figma' | 'github';
  url: string;
  author: string;
};

const INITIAL_PROJECT_LINKS: LinkItem[] = [
  {
    id: 1,
    labelPrefix: 'UI/UX Link -',
    provider: 'Figma',
    url: 'https://figma.com',
    author: 'Merna adel',
  },
  {
    id: 2,
    labelPrefix: 'frontend Link -',
    provider: 'github',
    url: 'https://github.com',
    author: 'Ahmed ali',
  },
  {
    id: 3,
    labelPrefix: 'Frontend Link -',
    provider: 'github',
    url: 'https://github.com',
    author: 'Ahmed ali',
  },
  {
    id: 4,
    labelPrefix: 'Backend Link -',
    provider: 'github',
    url: 'https://github.com',
    author: 'Ali ahmed',
  },
  {
    id: 5,
    labelPrefix: 'AI Link -',
    provider: 'github',
    url: 'https://github.com',
    author: 'Ahmed ali',
  },
  {
    id: 6,
    labelPrefix: 'Project Link',
    provider: 'github',
    url: 'https://github.com',
    author: 'Ali ahmed',
  },
];

export type FinalReviewState = 'waiting' | 'changes_requested' | 'approved' | 'rejected';

export default function ProjectFinalReviewPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: internship } = useInternship();
  const squad = internship?.squad;

  // Active review state: synced with ?state= in URL or defaults to 'waiting'
  const stateParam = searchParams.get('state') as FinalReviewState | null;
  const validStates: FinalReviewState[] = ['waiting', 'changes_requested', 'approved', 'rejected'];
  const [reviewState, setReviewStateInternal] = useState<FinalReviewState>(
    stateParam && validStates.includes(stateParam) ? stateParam : 'waiting'
  );

  const setReviewState = (state: FinalReviewState) => {
    setReviewStateInternal(state);
    setSearchParams({ state });
  };

  // Active tab on Task Board: 'myTasks' | 'squadBoard'
  const [activeBoardTab, setActiveBoardTab] = useState<'myTasks' | 'squadBoard'>('myTasks');

  // Project links state & modal
  const [projectLinks, setProjectLinks] = useState<LinkItem[]>(INITIAL_PROJECT_LINKS);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editUrl, setEditUrl] = useState('https://github.com/my-squad/taskflow-pr');
  const [linkSavedSuccess, setLinkSavedSuccess] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleSaveEditedLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (editUrl.trim()) {
      setProjectLinks((prev) =>
        prev.map((item) => (item.id === 2 ? { ...item, url: editUrl.trim() } : item))
      );
      setLinkSavedSuccess(true);
      setTimeout(() => {
        setLinkSavedSuccess(false);
        setIsEditModalOpen(false);
      }, 700);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1084px] space-y-6 pb-12 pt-2">
      {/* Top Back Navigation Bar */}
      <header className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to={ROUTES.dashboardProjectDone}
          className="group inline-flex items-center gap-3 text-gray-900 transition-colors hover:text-[#430A5D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#430A5D] rounded-lg p-1 -ml-1"
          aria-label={t('dashboard.taskDetails.backToTaskDetails', 'Back to Task Details (Done)')}
        >
          <ArrowLeft className="size-7 shrink-0 text-gray-900 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" />
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-[32px]">
              {t('dashboard.finalReview.projectEndState', 'Project Workspace — End State')}
            </h1>
            <span className="text-xs font-medium text-[#737373]">
              {t('dashboard.finalReview.allTasksCompletedBanner', 'Final Sprint Completed · In Final Review')}
            </span>
          </div>
        </Link>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2">
          <Link
            to={ROUTES.dashboardProjectCompleted}
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors"
          >
            <span>{t('dashboard.taskDetails.viewCompletedStep', 'View Read-Only Task Details →')}</span>
          </Link>
          <Link
            to={ROUTES.dashboardProjectResults}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#f6ebff] px-3.5 py-1.5 text-xs font-bold text-[#430A5D] shadow-2xs hover:bg-[#eedbfd] transition-colors"
          >
            <span>{t('dashboard.finalReview.viewResultsPage', 'View My Results →')}</span>
          </Link>
        </div>
      </header>

      {/* 1. Project Banner Card (Matching Figma Node 921:21354) */}
      <section
        aria-labelledby="project-banner-title"
        className={cn(CARD, 'flex flex-col gap-3 p-5 sm:p-6')}
      >
        <div className="inline-flex w-fit items-center gap-2 rounded-2xl bg-[#f3e9fa] px-3 py-1.5">
          <img src={scrollIcon} alt="" aria-hidden="true" className="size-5" />
          <span className="text-xs font-semibold text-[#8037be]">
            {t('dashboard.taskDetails.yourProject', 'Your project')}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <h2
            id="project-banner-title"
            className="text-xl font-bold tracking-tight text-gray-950 sm:text-2xl"
          >
            {squad?.trackName
              ? `${squad.trackName} — TaskFlow App`
              : t('dashboard.taskDetails.projectTitle', 'TaskFlow — Task Management App')}
          </h2>
          <span className="rounded-full bg-[#e3fbe5] px-3 py-0.5 text-xs font-bold text-[#068f2f]">
            {t('dashboard.taskDetails.active', 'Active')}
          </span>
        </div>

        <p className="max-w-4xl text-xs sm:text-sm text-[#4d4d4d] leading-relaxed">
          {t(
            'dashboard.taskDetails.projectDesc',
            'Build a task management application where users can organize tasks, track progress, and collaborate with their team.'
          )}
        </p>
      </section>

      {/* 2. Squad Team Members Card (Matching Figma Node 921:21368) */}
      <section
        aria-label="Squad Members"
        className={cn(CARD, 'p-6 sm:p-7')}
      >
        <div className="grid grid-cols-2 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 justify-items-center">
          {SQUAD_MEMBERS.map((member) => (
            <div key={member.id} className="flex flex-col items-center text-center gap-3 w-full max-w-[190px]">
              {/* Member Avatar */}
              <div className="relative size-24 sm:size-28 rounded-full overflow-hidden border-2 border-purple-100 bg-[#F6EBFF] flex items-center justify-center shadow-xs">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="size-full object-cover"
                />
              </div>

              {/* Name and Role Badge */}
              <div className="space-y-1.5">
                <h3 className="text-sm sm:text-base font-bold text-gray-950 truncate max-w-[170px]">
                  {member.name}
                </h3>
                <span
                  className={cn(
                    'inline-block px-3 py-0.5 rounded-full text-xs font-bold',
                    member.roleTone === 'leader' && 'bg-[#f6ebff] text-[#430A5D] border border-purple-200/60',
                    member.roleTone === 'uiux' && 'bg-[#fff4de] text-[#d06f15] border border-amber-200/60',
                    member.roleTone === 'backend' && 'bg-[#ffe3e3] text-[#f21620] border border-red-200/60',
                    member.roleTone === 'frontend' && 'bg-[#e0f2fe] text-[#0284c7] border border-sky-200/60',
                    member.roleTone === 'ai' && 'bg-[#d4fadc] text-[#068f2f] border border-emerald-200/60'
                  )}
                >
                  {member.role}
                </span>
              </div>

              {/* Contacts: GitHub & Email */}
              <div className="flex flex-col gap-1.5 pt-1 text-xs text-[#737373] w-full">
                <div className="flex items-center justify-center gap-1.5 hover:text-gray-900 transition-colors">
                  <img src={githubIcon} alt="" aria-hidden="true" className="size-4 shrink-0" />
                  <span className="truncate max-w-[130px] font-medium" dir="ltr">
                    {member.github}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-1.5 hover:text-gray-900 transition-colors">
                  <img src={googleIcon} alt="" aria-hidden="true" className="size-4 shrink-0" />
                  <span className="truncate max-w-[140px] font-medium" dir="ltr">
                    {member.email}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Sprints 04 Overview Card (Matching Figma Node 921:21458) */}
      <section
        aria-labelledby="sprint-overview-title"
        className={cn(CARD, 'flex flex-col gap-5 p-5 sm:p-7')}
      >
        {/* Header & Date */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex size-[55px] shrink-0 items-center justify-center rounded-2xl bg-[#f6ebff]">
              <img src={sprintIcon} alt="" aria-hidden="true" className="size-7" />
            </div>
            <div>
              <h2 id="sprint-overview-title" className="text-2xl font-bold tracking-tight text-gray-950 sm:text-[32px]">
                {t('dashboard.finalReview.sprintNumber', 'Sprints 04')}
              </h2>
              <p className="text-xs font-medium text-[#737373]">
                {t('dashboard.finalReview.sprintDates', 'oct 10 - oct 17, 2026')}
              </p>
            </div>
          </div>

          {/* Current Sprint Pill Selector */}
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-800 shadow-2xs">
            <span>{t('dashboard.finalReview.sprintSelect', 'Sprint 4 — Current')}</span>
            <ChevronDown className="size-4 text-gray-500" />
          </div>
        </div>

        {/* Sprint Goal & Progress Numbers */}
        <div className="flex flex-wrap items-end justify-between gap-4 pt-2">
          <div className="space-y-1">
            <span className="text-[11px] font-bold tracking-wider text-gray-500 uppercase">
              {t('dashboard.finalReview.sprintGoal', 'SPRINT GOAL')}
            </span>
            <p className="text-sm sm:text-base font-semibold text-gray-950">
              {t('dashboard.finalReview.sprintGoalDesc', 'Build the core task management features.')}
            </p>
          </div>
          <div className="text-end">
            <span className="text-3xl font-extrabold leading-none text-gray-950 sm:text-4xl">
              100 %
            </span>
            <p className="mt-1 text-xs text-[#737373]">
              {t('dashboard.finalReview.tasksDone', '4 of 11 tasks done')}
            </p>
          </div>
        </div>

        {/* Progress Bar (100% full) */}
        <ProgressBar
          value={100}
          max={100}
          label="Sprint Completion Progress"
          className="h-2 rounded-full"
        />

        {/* 4 Stat Tiles */}
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 pt-1">
          {/* Total Tasks */}
          <li className="flex min-h-[50px] items-center gap-3 rounded-2xl bg-[#f6ebff] p-3 border border-purple-100">
            <img src={layerIcon} alt="" aria-hidden="true" className="size-6 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-[#430A5D]">
                {t('dashboard.finalReview.totalTasks', 'total tasks')}
              </span>
              <span className="text-lg font-bold leading-tight text-[#430A5D]">11</span>
            </div>
          </li>

          {/* Completed Tasks */}
          <li className="flex min-h-[50px] items-center gap-3 rounded-2xl bg-[#d4fadc] p-3 border border-emerald-100">
            <img src={completedIcon} alt="" aria-hidden="true" className="size-6 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-[#068f2f]">
                {t('dashboard.finalReview.completedTasks', 'Completed tasks')}
              </span>
              <span className="text-lg font-bold leading-tight text-[#068f2f]">11</span>
            </div>
          </li>

          {/* Remaining Tasks */}
          <li className="flex min-h-[50px] items-center gap-3 rounded-2xl bg-[#ffe3e3] p-3 border border-red-100">
            <img src={timerIcon} alt="" aria-hidden="true" className="size-6 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-[#f21620]">
                {t('dashboard.finalReview.remainingTasks', 'Remaining tasks')}
              </span>
              <span className="text-lg font-bold leading-tight text-[#f21620]">0</span>
            </div>
          </li>

          {/* Story Points */}
          <li className="flex min-h-[50px] items-center gap-3 rounded-2xl bg-[#fff4de] p-3 border border-amber-100">
            <Sparkles className="size-6 shrink-0 text-[#d06f15]" />
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-[#d06f15]">
                {t('dashboard.finalReview.storyPoint', 'story point')}
              </span>
              <span className="text-lg font-bold leading-tight text-[#d06f15]">45</span>
            </div>
          </li>
        </ul>
      </section>

      {/* 4. Projects Links Card (Matching Figma Node 921:21511) */}
      <section
        aria-labelledby="projects-links-title"
        className={cn(CARD, 'p-6 sm:p-7 space-y-6')}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-[55px] shrink-0 items-center justify-center rounded-2xl bg-[#f6ebff] font-mono text-lg font-bold text-[#430A5D]">
              &gt;_
            </div>
            <h2 id="projects-links-title" className="text-xl sm:text-2xl font-bold text-gray-950">
              {t('dashboard.taskDetails.projectsLinks', 'Projects Links')}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-800 shadow-2xs hover:bg-gray-50 active:scale-[0.98] transition-all"
          >
            {t('dashboard.taskDetails.editMyLink', 'Edit my link')}
          </button>
        </div>

        {/* 6 Links Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 pt-2">
          {projectLinks.map((item) => (
            <div key={item.id} className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-white text-sm font-bold text-gray-800 shadow-2xs">
                {item.id}
              </div>
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-950">
                  <span>{item.labelPrefix}</span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1 text-[#430A5D] hover:underline"
                  >
                    <span>{item.provider}</span>
                    <img
                      src={exportIcon}
                      alt=""
                      aria-hidden="true"
                      className="size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100"
                    />
                  </a>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-[#737373]">{item.author}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(item.id, item.url)}
                    className="text-[11px] text-gray-400 hover:text-gray-700 transition-colors"
                    title="Copy URL"
                  >
                    {copiedId === item.id ? (
                      <span className="text-emerald-600 font-semibold inline-flex items-center gap-0.5">
                        <Check className="size-3" />
                      </span>
                    ) : (
                      <Copy className="size-3" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Task Board Card (Matching Figma Node 921:21631) */}
      <section
        aria-labelledby="taskboard-title"
        className={cn(CARD, 'p-6 sm:p-7 space-y-6')}
      >
        {/* Title & Info icon */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-[55px] shrink-0 items-center justify-center rounded-2xl bg-[#f6ebff]">
              <img src={layerIcon} alt="" aria-hidden="true" className="size-7" />
            </div>
            <h2 id="taskboard-title" className="text-xl sm:text-2xl font-bold text-gray-950">
              {t('dashboard.finalReview.taskBoard', 'Task Board')}
            </h2>
          </div>

          <div className="flex size-9 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <Info className="size-5" />
          </div>
        </div>

        {/* Tab switchers: My tasks | Squad board */}
        <div className="flex items-center rounded-2xl bg-gray-100/70 p-1">
          <button
            type="button"
            onClick={() => setActiveBoardTab('myTasks')}
            className={cn(
              'flex-1 rounded-xl py-2.5 text-center text-xs sm:text-sm font-bold transition-all',
              activeBoardTab === 'myTasks'
                ? 'bg-[#f6ebff] text-[#430A5D] shadow-xs'
                : 'text-[#737373] hover:text-gray-900'
            )}
          >
            {t('dashboard.finalReview.myTasks', 'My tasks')}
          </button>
          <button
            type="button"
            onClick={() => setActiveBoardTab('squadBoard')}
            className={cn(
              'flex-1 rounded-xl py-2.5 text-center text-xs sm:text-sm font-bold transition-all',
              activeBoardTab === 'squadBoard'
                ? 'bg-[#f6ebff] text-[#430A5D] shadow-xs'
                : 'text-[#737373] hover:text-gray-900'
            )}
          >
            {t('dashboard.finalReview.squadBoard', 'Squad board')}
          </button>
        </div>

        {/* All tasks completed · Final Sprint banner */}
        <div className="flex flex-col items-center justify-center py-6 px-4 text-center space-y-2 border-t border-gray-100 pt-8">
          <div className="inline-flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-1">
            <CheckCircle2 className="size-6" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-950">
            {t('dashboard.finalReview.allTasksCompleted', 'All tasks completed · Final Sprint')}
          </h3>
          <p className="max-w-2xl text-xs sm:text-sm text-gray-600 leading-relaxed">
            {t(
              'dashboard.finalReview.allTasksCompletedDesc',
              "Amazing work! You've completed all your tasks for this sprint, and this is the final sprint of your internship project."
            )}
          </p>
          <p className="text-xs sm:text-sm font-medium text-[#737373]">
            {t(
              'dashboard.finalReview.readyForFinalReview',
              'Your project is now ready for final review by your Senior.'
            )}
          </p>
        </div>
      </section>

      {/* 6. In Final Review Section with Interactive State Switcher */}
      <section
        aria-labelledby="final-review-title"
        className={cn(CARD, 'p-6 sm:p-8 space-y-6')}
      >
        {/* State Toggle Switcher Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {t('dashboard.finalReview.switchState', 'Switch Review State')}:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-gray-100/90 p-1.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setReviewState('waiting')}
              className={cn(
                'rounded-xl px-3 py-1.5 text-xs font-bold transition-all',
                reviewState === 'waiting'
                  ? 'bg-white text-[#430A5D] shadow-xs'
                  : 'text-[#737373] hover:text-gray-900'
              )}
            >
              {t('dashboard.finalReview.stateWaiting', '1. Waiting')}
            </button>
            <button
              type="button"
              onClick={() => setReviewState('changes_requested')}
              className={cn(
                'rounded-xl px-3 py-1.5 text-xs font-bold transition-all',
                reviewState === 'changes_requested'
                  ? 'bg-[#FF7A00] text-white shadow-xs'
                  : 'text-[#737373] hover:text-gray-900'
              )}
            >
              {t('dashboard.finalReview.stateChanges', '2. Changes Requested')}
            </button>
            <button
              type="button"
              onClick={() => setReviewState('approved')}
              className={cn(
                'rounded-xl px-3 py-1.5 text-xs font-bold transition-all',
                reviewState === 'approved'
                  ? 'bg-[#00BA88] text-white shadow-xs'
                  : 'text-[#737373] hover:text-gray-900'
              )}
            >
              {t('dashboard.finalReview.stateApproved', '3. Approved (Success)')}
            </button>
            <button
              type="button"
              onClick={() => setReviewState('rejected')}
              className={cn(
                'rounded-xl px-3 py-1.5 text-xs font-bold transition-all',
                reviewState === 'rejected'
                  ? 'bg-[#F21620] text-white shadow-xs'
                  : 'text-[#737373] hover:text-gray-900'
              )}
            >
              {t('dashboard.finalReview.stateRejected', '4. Rejected')}
            </button>
          </div>
        </div>

        {/* STATE 1: Waiting (Figma 921:21336) */}
        {reviewState === 'waiting' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header: Clock + In Final Review + Waiting Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-[55px] shrink-0 items-center justify-center rounded-2xl bg-[#f6ebff]">
                  <Clock className="size-7 text-[#430A5D]" />
                </div>
                <h2 id="final-review-title" className="text-xl sm:text-2xl font-bold text-gray-950">
                  {t('dashboard.finalReview.title', 'In Final Review')}
                </h2>
              </div>

              <span className="rounded-full bg-[#f6ebff] px-4 py-1 text-xs font-bold text-[#8037be] border border-[#e9d5ff]">
                {t('dashboard.finalReview.waiting', 'Waiting')}
              </span>
            </div>

            {/* Center Hourglass & Content */}
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
              <div className="relative max-w-[280px] sm:max-w-[320px] mx-auto transition-transform hover:scale-102">
                <img
                  src={hourglassIllustration}
                  alt="Hourglass Final Review Illustration"
                  className="w-full h-auto object-contain drop-shadow-sm"
                />
              </div>

              <div className="space-y-2 max-w-xl mx-auto pt-2">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-950">
                  {t('dashboard.finalReview.underFinalReview', 'Your project is under final review')}
                </h3>
                <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
                  {t(
                    'dashboard.finalReview.underFinalReviewDesc',
                    "Your Senior is reviewing your final project. You'll see the result here once the review is complete."
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STATE 2: Changes Requested (Figma Node 921:22405) */}
        {reviewState === 'changes_requested' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header: Repeat Icon + In Final Review + Changes Requested Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-[55px] shrink-0 items-center justify-center rounded-2xl bg-[#fff4ed]">
                  <Repeat className="size-7 text-[#FF7A00]" />
                </div>
                <h2 id="final-review-title" className="text-xl sm:text-2xl font-bold text-gray-950">
                  {t('dashboard.finalReview.title', 'In Final Review')}
                </h2>
              </div>

              <span className="rounded-full bg-[#fff0e6] px-4 py-1 text-xs font-bold text-[#FF7A00] border border-[#FED7AA]">
                {t('dashboard.finalReview.changesRequested', 'Changes Requested')}
              </span>
            </div>

            {/* Illustration */}
            <div className="flex flex-col items-center justify-center py-4 text-center space-y-4">
              <div className="relative max-w-[280px] sm:max-w-[320px] mx-auto transition-transform hover:scale-102">
                <img
                  src={changesRequestedIllustration}
                  alt="Changes Requested Illustration"
                  className="w-full h-auto object-contain drop-shadow-sm"
                />
              </div>

              {/* Heading & Subtitle */}
              <div className="space-y-2 max-w-xl mx-auto">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-950">
                  {t('dashboard.finalReview.needsChanges', 'Your project needs some changes')}
                </h3>
                <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
                  {t(
                    'dashboard.finalReview.needsChangesDesc',
                    'Your Senior reviewed your project and requested changes. Fix the issues below and resubmit your project within your additional one-week sprint.'
                  )}
                </p>
              </div>
            </div>

            {/* Rejection Reasons Box */}
            <div className="space-y-3 rounded-2xl bg-gray-50/70 p-5 sm:p-6 border border-gray-100">
              <h4 className="text-sm sm:text-base font-bold text-gray-950">
                {t('dashboard.finalReview.rejectionReasons', 'Rejection reasons')}
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-gray-950">1.</span>
                  <span>
                    {t(
                      'dashboard.finalReview.reason1',
                      'Some required features are missing or incomplete'
                    )}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-gray-950">2.</span>
                  <span>
                    {t(
                      'dashboard.finalReview.reason2',
                      'The project does not fully meet the specified requirements and needs further improvements.'
                    )}
                  </span>
                </li>
              </ul>
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-200/60 pt-3 text-xs">
                <span className="font-semibold text-gray-800">
                  {t('dashboard.finalReview.sprintEndsOn', 'Additional sprint ends on')}
                </span>
                <span className="font-bold text-[#430A5D]" dir="ltr">
                  1/11/2026
                </span>
              </div>
            </div>

            {/* Action: Go To Board Button */}
            <Link
              to={ROUTES.dashboardProject}
              className={cn(
                PURPLE_GRADIENT,
                'w-full inline-flex items-center justify-center gap-2 rounded-[13px] py-3.5 px-6 text-center text-xs sm:text-sm font-bold text-white shadow-[0_10px_22px_rgba(67,10,93,0.2)] transition-all hover:brightness-110 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#430A5D] focus-visible:ring-offset-2'
              )}
            >
              <span>{t('dashboard.finalReview.goToBoard', 'Go To Board')}</span>
              <ArrowRight className="size-4 shrink-0 rtl:rotate-180" />
            </Link>
          </div>
        )}

        {/* STATE 3: Approved / Success (Figma Node 921:24200) */}
        {reviewState === 'approved' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header: Green Check Icon + In Final Review + Approved Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-[55px] shrink-0 items-center justify-center rounded-2xl bg-[#e3fbe5]">
                  <CheckCircle2 className="size-7 text-[#068f2f]" />
                </div>
                <h2 id="final-review-title" className="text-xl sm:text-2xl font-bold text-gray-950">
                  {t('dashboard.finalReview.title', 'In Final Review')}
                </h2>
              </div>

              <span className="rounded-full bg-[#e3fbe5] px-4 py-1 text-xs font-bold text-[#068f2f] border border-[#d0f2dd]">
                {t('dashboard.finalReview.approvedBadge', 'Approved')}
              </span>
            </div>

            {/* Illustration */}
            <div className="flex flex-col items-center justify-center py-4 text-center space-y-4">
              <div className="relative max-w-[280px] sm:max-w-[320px] mx-auto transition-transform hover:scale-102">
                <img
                  src={approvedIllustration}
                  alt="Project Approved Illustration"
                  className="w-full h-auto object-contain drop-shadow-sm"
                />
              </div>

              {/* Heading & Subtitle */}
              <div className="space-y-2 max-w-xl mx-auto">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-950">
                  {t('dashboard.finalReview.congratsApproved', 'Congratulations! Your project is approved.')}
                </h3>
                <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
                  {t(
                    'dashboard.finalReview.congratsApprovedDesc',
                    'You’ve successfully completed your internship project. Your final results are ready to view.'
                  )}
                </p>
              </div>
            </div>

            {/* Action: View my results button -> Takes user to Node 925:26313 */}
            <Link
              to={ROUTES.dashboardProjectResults}
              className={cn(
                PURPLE_GRADIENT,
                'w-full inline-flex items-center justify-center gap-2 rounded-[13px] py-3.5 px-6 text-center text-xs sm:text-sm font-bold text-white shadow-[0_10px_22px_rgba(67,10,93,0.2)] transition-all hover:brightness-110 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#430A5D] focus-visible:ring-offset-2'
              )}
            >
              <span>{t('dashboard.finalReview.viewMyResults', 'View my results')}</span>
              <ArrowRight className="size-4 shrink-0 rtl:rotate-180" />
            </Link>
          </div>
        )}

        {/* STATE 4: Rejected / Not Approved (Figma Node 921:25216) */}
        {reviewState === 'rejected' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header: Red X Icon + In Final Review + Not Approved Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-[55px] shrink-0 items-center justify-center rounded-2xl bg-[#ffe3e3]">
                  <XCircle className="size-7 text-[#f21620]" />
                </div>
                <h2 id="final-review-title" className="text-xl sm:text-2xl font-bold text-gray-950">
                  {t('dashboard.finalReview.title', 'In Final Review')}
                </h2>
              </div>

              <span className="rounded-full bg-[#ffe3e3] px-4 py-1 text-xs font-bold text-[#f21620] border border-[#fecaca]">
                {t('dashboard.finalReview.notApprovedBadge', 'Not Approved')}
              </span>
            </div>

            {/* Illustration */}
            <div className="flex flex-col items-center justify-center py-4 text-center space-y-4">
              <div className="relative max-w-[200px] sm:max-w-[240px] mx-auto transition-transform hover:scale-102">
                <img
                  src={rejectedIllustration}
                  alt="Project Not Approved Illustration"
                  className="w-full h-auto object-contain drop-shadow-sm"
                />
              </div>

              {/* Heading & Subtitle */}
              <div className="space-y-2 max-w-xl mx-auto">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-950">
                  {t('dashboard.finalReview.wasNotApproved', 'Your project was not approved')}
                </h3>
                <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
                  {t(
                    'dashboard.finalReview.wasNotApprovedDesc',
                    'Your project has been rejected after the second review. No internship certificate will be issued for this project.'
                  )}
                </p>
              </div>
            </div>

            {/* Rejection Reasons Box */}
            <div className="space-y-3 rounded-2xl bg-gray-50/70 p-5 sm:p-6 border border-gray-100">
              <h4 className="text-sm sm:text-base font-bold text-gray-950">
                {t('dashboard.finalReview.rejectionReasons', 'Rejection reasons')}
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-gray-950">1.</span>
                  <span>
                    {t(
                      'dashboard.finalReview.reason1Detailed',
                      'Some required features are missing or incomplete.'
                    )}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-gray-950">2.</span>
                  <span>
                    {t(
                      'dashboard.finalReview.reason2',
                      'The project does not fully meet the specified requirements and needs further improvements.'
                    )}
                  </span>
                </li>
              </ul>
              <p className="text-xs text-[#737373] pt-1">
                {t(
                  'dashboard.finalReview.contactSupportNotice',
                  'If you have questions or need assistance, please contact support.'
                )}
              </p>
            </div>

            {/* Action: Contact support Button (Red outline) */}
            <button
              type="button"
              onClick={() => alert('Support contact modal / chat opened.')}
              className="w-full inline-flex items-center justify-center rounded-[13px] border-2 border-[#ef4444] bg-white py-3.5 px-6 text-center text-xs sm:text-sm font-bold text-[#ef4444] shadow-xs transition-all hover:bg-red-50/60 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
            >
              {t('dashboard.finalReview.contactSupport', 'Contact support')}
            </button>
          </div>
        )}
      </section>

      {/* Edit Link Modal */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-950">
                  {t('dashboard.taskDetails.editModalTitle', 'Edit Your Project Link')}
                </h3>
                <p className="text-xs text-[#737373] mt-1">
                  {t('dashboard.taskDetails.editModalDesc', 'Update the repository or design deliverable link shared with your squad.')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedLink} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="edit-url" className="text-xs font-semibold text-gray-700">
                  {t('dashboard.taskDetails.linkLabel', 'Link URL')}
                </label>
                <input
                  id="edit-url"
                  type="url"
                  required
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs text-gray-900 shadow-2xs focus:border-[#430A5D] focus:outline-none focus:ring-2 focus:ring-[#430A5D]/20"
                />
              </div>

              {linkSavedSuccess && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                  <span>{t('dashboard.taskDetails.linkSaved', 'Link updated successfully!')}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-xl border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {t('dashboard.taskDetails.cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className={cn(
                    PURPLE_GRADIENT,
                    'rounded-xl px-5 py-2 text-xs font-bold text-white shadow-xs hover:brightness-110 active:scale-95 transition-all'
                  )}
                >
                  {t('dashboard.taskDetails.saveLink', 'Save Changes')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
