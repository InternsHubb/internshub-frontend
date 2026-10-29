import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, X } from 'lucide-react';

import avatarGirl from '@/assets/dashboard/avatar-girl.svg';
import codeIcon from '@/assets/dashboard/ic-code.svg';
import exportIcon from '@/assets/dashboard/ic-export.svg';
import scrollIcon from '@/assets/dashboard/ic-scroll.svg';
import simcardIcon from '@/assets/dashboard/ic-simcard.svg';
import { CARD } from '@/components/dashboard/primitives';
import { ROUTES } from '@/constants/routes';
import { useInternship } from '@/hooks/useInternship';
import { cn } from '@/lib/cn';

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

export default function ProjectCompletedPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const { data: internship } = useInternship();
  const squad = internship?.squad;

  // PR Link from navigation state or Figma defaults
  const state = location.state as { submittedLink?: string; submittedTime?: string } | null;
  const currentPrLink = state?.submittedLink || 'https://www.github/';

  // Project links state
  const [projectLinks, setProjectLinks] = useState<LinkItem[]>(INITIAL_PROJECT_LINKS);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editUrl, setEditUrl] = useState('https://github.com/my-squad/taskflow-pr');
  const [linkSavedSuccess, setLinkSavedSuccess] = useState(false);

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
      <header className="flex items-center gap-3">
        <Link
          to={ROUTES.dashboardProject}
          className="group inline-flex items-center gap-3 text-gray-900 transition-colors hover:text-[#430A5D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#430A5D] rounded-lg p-1 -ml-1"
          aria-label={t('dashboard.taskDetails.backToProject', 'Back to Project Workspace')}
        >
          <ArrowLeft className="size-7 shrink-0 text-gray-900 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" />
          <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-[32px]">
            {t('dashboard.taskDetails.viewTaskDetails', 'View Task Details')}
          </h1>
        </Link>
      </header>

      {/* 1. Status Stepper Workflow Card (ALL 4 STEPS GREEN: 04 Done Completed) */}
      <section
        aria-label="Task Status Progress"
        className={cn(CARD, 'flex items-center justify-center p-6 sm:p-7')}
      >
        <div className="flex w-full max-w-[650px] items-center justify-between">
          {/* Step 1: 01 To Do (Completed) */}
          <Link
            to={ROUTES.dashboardProjectDetails}
            className="flex flex-col items-center group transition-transform hover:scale-105"
            title="View In Progress Stage"
          >
            <div className="flex size-9 items-center justify-center rounded-full bg-[#00BA88] text-xs font-bold text-white shadow-xs">
              01
            </div>
            <span className="mt-2 text-center text-xs font-semibold text-gray-900 group-hover:text-[#430A5D]">
              {t('dashboard.taskDetails.steps.todo', 'To Do')}
            </span>
          </Link>

          {/* Line 1 -> 2 (Green) */}
          <div className="h-[2px] flex-1 mx-2 sm:mx-4 -mt-5 bg-[#00BA88]" />

          {/* Step 2: 02 In Progress (Completed) */}
          <Link
            to={ROUTES.dashboardProjectDetails}
            className="flex flex-col items-center group transition-transform hover:scale-105"
            title="View In Progress Stage"
          >
            <div className="flex size-9 items-center justify-center rounded-full bg-[#00BA88] text-xs font-bold text-white shadow-xs">
              02
            </div>
            <span className="mt-2 text-center text-xs font-semibold text-gray-900 group-hover:text-[#430A5D]">
              {t('dashboard.taskDetails.steps.inProgress', 'In Progress')}
            </span>
          </Link>

          {/* Line 2 -> 3 (Green) */}
          <div className="h-[2px] flex-1 mx-2 sm:mx-4 -mt-5 bg-[#00BA88]" />

          {/* Step 3: 03 In Review (Completed) */}
          <Link
            to={ROUTES.dashboardProjectReview}
            state={{ submittedLink: currentPrLink }}
            className="flex flex-col items-center group transition-transform hover:scale-105"
            title="View In Review Stage"
          >
            <div className="flex size-9 items-center justify-center rounded-full bg-[#00BA88] text-xs font-bold text-white shadow-xs">
              03
            </div>
            <span className="mt-2 text-center text-xs font-semibold text-gray-900 group-hover:text-[#430A5D]">
              {t('dashboard.taskDetails.steps.inReview', 'In Review')}
            </span>
          </Link>

          {/* Line 3 -> 4 (Green) */}
          <div className="h-[2px] flex-1 mx-2 sm:mx-4 -mt-5 bg-[#00BA88]" />

          {/* Step 4: 04 Done (Green) */}
          <div className="flex flex-col items-center">
            <div className="flex size-9 items-center justify-center rounded-full bg-[#00BA88] text-xs font-bold text-white ring-4 ring-emerald-100 shadow-sm">
              04
            </div>
            <span className="mt-2 text-center text-xs font-bold text-gray-950">
              {t('dashboard.taskDetails.steps.done', 'Done')}
            </span>
          </div>
        </div>
      </section>

      {/* 2. Project Banner Card */}
      <section
        aria-labelledby="project-banner-title"
        className={cn(CARD, 'flex flex-col gap-3 p-5 sm:p-6')}
      >
        {/* Your project pill */}
        <div className="inline-flex w-fit items-center gap-2 rounded-2xl bg-[#f3e9fa] px-3 py-1.5">
          <img src={scrollIcon} alt="" aria-hidden="true" className="size-5" />
          <span className="text-xs font-semibold text-[#8037be]">
            {t('dashboard.taskDetails.yourProject', 'Your project')}
          </span>
        </div>

        {/* Project title and active badge */}
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

        {/* Project description */}
        <p className="max-w-4xl text-xs sm:text-sm text-[#4d4d4d] leading-relaxed">
          {t(
            'dashboard.taskDetails.projectDesc',
            'Build a task management application where users can organize tasks, track progress, and collaborate with their team.'
          )}
        </p>
      </section>

      {/* 3. Task Details Card (READ ONLY - Figma Node 921:17010) */}
      <section aria-labelledby="task-card-title" className={cn(CARD, 'p-6 sm:p-8 space-y-6')}>
        {/* Task Header: Icon, Title, Badges (Done, UI/UX, Read Only, 2 Story Points) & Sprint */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-[55px] shrink-0 items-center justify-center rounded-2xl bg-[#f6ebff] p-2">
              <img src={simcardIcon} alt="" aria-hidden="true" className="size-7" />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                <h3 id="task-card-title" className="text-xl sm:text-2xl font-bold text-gray-950">
                  {t('dashboard.taskDetails.taskTitle', 'Create Task List UI')}
                </h3>
                {/* Done badge */}
                <span className="rounded-full bg-[#e3fbe5] px-3 py-0.5 text-xs font-semibold text-[#068f2f] border border-[#d0f2dd]">
                  {t('dashboard.taskDetails.steps.done', 'Done')}
                </span>
                {/* Track badge */}
                <span className="rounded-full bg-[#f6ebff] px-3 py-0.5 text-xs font-semibold text-[#430A5D] border border-[#e9d5ff]">
                  {t('dashboard.taskDetails.uiUx', 'UI/UX')}
                </span>
                {/* Read Only badge (Figma 921:17010) */}
                <span className="rounded-full bg-[#ECEFF1] px-3 py-0.5 text-xs font-semibold text-[#546E7A] border border-[#CFD8DC]">
                  {t('dashboard.taskDetails.readOnly', 'Read Only')}
                </span>
                {/* Story points */}
                <span className="rounded-full bg-[#fff4de] px-3 py-0.5 text-xs font-semibold text-[#d06f15] border border-[#fde68a]">
                  {t('dashboard.taskDetails.storyPoints', '2 Story Points')}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-[#737373]">
                {t('dashboard.taskDetails.taskMeta', 'Task #17 · Sprint 2')}
              </p>
            </div>
          </div>
        </div>

        {/* Task Details Content */}
        <div className="space-y-1.5 border-t border-gray-100 pt-5">
          <h4 className="text-base font-bold text-gray-950">
            {t('dashboard.taskDetails.taskDetailsHeading', 'Task Details')}
          </h4>
          <p className="text-xs sm:text-sm text-[#4d4d4d] leading-relaxed">
            {t(
              'dashboard.taskDetails.taskDetailsDesc',
              'Build the task list interface according to the project requirements.'
            )}
          </p>
        </div>

        {/* Assignee */}
        <div className="space-y-2.5">
          <h4 className="text-base font-bold text-gray-950">
            {t('dashboard.taskDetails.assignee', 'Assignee')}
          </h4>
          <div className="flex items-center gap-3">
            <div className="size-11 overflow-hidden rounded-full border border-purple-200 bg-purple-50 flex items-center justify-center shrink-0">
              <img src={avatarGirl} alt="Merna Adel" className="size-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-950">
                {t('dashboard.taskDetails.assigneeName', 'Merna Adel')}
              </span>
              <span className="text-xs font-medium text-[#737373]">
                {t('dashboard.taskDetails.uiUx', 'UI/UX')}
              </span>
            </div>
          </div>
        </div>

        {/* Read Only Current Link Row (Figma 921:17010) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
          <span className="text-sm font-bold text-gray-950">
            {t('dashboard.taskDetails.currentLink', 'Current Link')}
          </span>
          <a
            href={currentPrLink.startsWith('http') ? currentPrLink : `https://${currentPrLink}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-700 hover:text-[#430A5D] hover:underline"
            dir="ltr"
          >
            <span>{currentPrLink}</span>
            <img
              src={exportIcon}
              alt=""
              aria-hidden="true"
              className="size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100"
            />
          </a>
        </div>
      </section>

      {/* 4. Projects Links Card */}
      <section aria-labelledby="projects-links-title" className={cn(CARD, 'p-6 sm:p-8 space-y-6')}>
        <div className="flex items-center justify-between border-b border-gray-100 pb-5">
          <div className="flex items-center gap-3">
            <img src={codeIcon} alt="" aria-hidden="true" className="size-[55px] shrink-0" />
            <h3 id="projects-links-title" className="text-xl sm:text-2xl font-bold text-gray-950">
              {t('dashboard.taskDetails.projectsLinks', 'Projects Links')}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="rounded-full border border-[#d9d9d9] bg-white px-4 py-1.5 text-xs font-semibold text-[#666] shadow-sm transition-all hover:border-[#430A5D] hover:text-[#430A5D] hover:bg-purple-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#430A5D]"
          >
            {t('dashboard.taskDetails.editMyLink', 'Edit my link')}
          </button>
        </div>

        {/* Links Grid: 3 columns matching Figma */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projectLinks.map((item) => (
            <div key={item.id} className="flex items-center gap-3.5">
              <span className="flex size-[55px] shrink-0 items-center justify-center rounded-2xl bg-[#f6ebff] text-xl font-medium text-black">
                {item.id}
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1 text-sm sm:text-base font-normal text-black transition-colors hover:text-[#430A5D]"
                >
                  <span className="truncate">{item.labelPrefix}</span>
                  <span className="font-bold underline underline-offset-2">
                    {item.provider}
                  </span>
                  <img
                    src={exportIcon}
                    alt=""
                    aria-hidden="true"
                    className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100"
                  />
                </a>
                <span className="text-xs text-[#737373] mt-0.5">{item.author}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Edit My Project Link Modal */}
      {isEditModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-link-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 id="edit-link-title" className="text-lg font-bold text-gray-950">
                {t('dashboard.taskDetails.editModalTitle', 'Edit Your Project Link')}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
              >
                <X className="size-5" />
              </button>
            </div>

            <p className="text-xs text-[#737373]">
              {t(
                'dashboard.taskDetails.editModalDesc',
                'Update the repository or design deliverable link shared with your squad.'
              )}
            </p>

            <form onSubmit={handleSaveEditedLink} className="space-y-4 pt-2">
              <div>
                <label
                  htmlFor="edit-url"
                  className="block text-xs font-semibold text-gray-700 mb-1"
                >
                  {t('dashboard.taskDetails.linkLabel', 'Link URL')}
                </label>
                <input
                  id="edit-url"
                  type="url"
                  required
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-950 outline-none focus:border-[#430A5D] focus:ring-2 focus:ring-purple-100"
                />
              </div>

              {linkSavedSuccess && (
                <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 className="size-4" />
                  {t('dashboard.taskDetails.linkSaved', 'Link updated successfully!')}
                </p>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition"
                >
                  {t('dashboard.taskDetails.cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#430A5D] px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-[#340748] transition"
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
