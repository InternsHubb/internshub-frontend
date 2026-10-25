import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import codeIcon from '@/assets/dashboard/ic-code.svg';
import exportIcon from '@/assets/dashboard/ic-export.svg';
import layerLargeIcon from '@/assets/dashboard/ic-layer-lg.svg';
import taskDivider from '@/assets/dashboard/task-divider.svg';
import { CARD, IconTile, NumberTile } from '@/components/dashboard/primitives';
import { SAMPLE_MY_TASK_COUNTS, SAMPLE_PROJECT_LINKS, SAMPLE_TOP_TASKS, type TaskStatus } from '@/data/internshipDashboard';
import { cn } from '@/lib/cn';

// "Projects Links" and "My Tasks This Sprint" on the project page ("project", 31:35261).

export function ProjectLinks() {
  const { t } = useTranslation();
  return (
    <section aria-labelledby="links-title" className={cn(CARD, 'flex flex-col gap-6 p-4 sm:p-[18px]')}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <IconTile icon={codeIcon} />
          <h2 id="links-title" className="text-2xl font-semibold text-black sm:text-[32px]">{t('dashboard.links.title')}</h2>
        </div>
        {/* Editing links needs a project API; the control is shown but unavailable. */}
        <button
          type="button"
          disabled
          title={t('dashboard.links.editUnavailable')}
          className="cursor-not-allowed rounded-full bg-[#e7e7e7] px-2.5 py-1 text-[10px] font-medium text-[#545454]"
        >
          {t('dashboard.links.edit')}
        </button>
      </div>
      {/* Figma fills the grid column by column: 1-2, 3-4, 5-6. */}
      <ol className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-flow-col lg:grid-cols-3 lg:grid-rows-2">
        {SAMPLE_PROJECT_LINKS.map((link, index) => (
          <li key={link.id} className="flex min-w-0 items-center gap-3">
            <NumberTile value={index + 1} />
            <div className="min-w-0">
              <p className="flex flex-wrap items-center gap-x-1 text-base text-black sm:text-lg">
                <bdi>{link.label}</bdi> -{' '}
                <span className="font-semibold underline underline-offset-2"><bdi>{link.provider}</bdi></span>
                <img src={exportIcon} alt="" aria-hidden="true" className="size-6 shrink-0 rtl:-scale-x-100" />
              </p>
              <p className="text-base text-[#828282] sm:text-lg"><bdi>{link.owner}</bdi></p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

const STATUS_PILL: Record<Exclude<TaskStatus, 'completed'>, string> = {
  inReview: 'bg-[#fff3e8] text-[#d06f15]',
  inProgress: 'bg-[#dbe8ff] text-[#0057ff]',
  todo: 'bg-[#f6ebff] text-[#3b0454]',
};

export function MyTasks() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const empty = params.get('board') === 'empty';
  const counts = Object.entries(empty ? { todo: 0, inProgress: 0, inReview: 0 } : SAMPLE_MY_TASK_COUNTS) as Array<[keyof typeof SAMPLE_MY_TASK_COUNTS, number]>;

  return (
    <section aria-labelledby="my-tasks-title" className={cn(CARD, 'flex flex-col gap-6 p-4 sm:p-[18px]')}>
      <div className="flex items-center gap-3">
        <IconTile icon={layerLargeIcon} />
        <h2 id="my-tasks-title" className="text-2xl font-semibold text-black sm:text-[32px]">{t('dashboard.tasks.title')}</h2>
      </div>
      <dl className="grid grid-cols-3 gap-2 text-center">
        {counts.map(([status, count]) => (
          <div key={status} className="flex flex-col-reverse">
            <dt className="text-sm text-black sm:text-lg">{t(`dashboard.tasks.status.${status}`)}</dt>
            <dd className="text-lg font-semibold text-black">{count}</dd>
          </div>
        ))}
      </dl>
      <div>
        {empty ? <p className="py-6 text-center text-lg text-[#737373]">{t('dashboard.tasks.empty')}</p> : <>
        <h3 className="text-lg text-black">{t('dashboard.tasks.topTasks')}</h3>
        <ol className="mt-4 flex flex-col">
          {SAMPLE_TOP_TASKS.map((task, index) => (
            <Fragment key={task.id}>
              {index > 0 && (
                <li aria-hidden="true" className="flex justify-center py-3">
                  <img src={taskDivider} alt="" className="h-px w-full max-w-[704px]" />
                </li>
              )}
              <li className="flex items-center gap-3">
                <NumberTile value={index + 1} />
                <p className="min-w-0 flex-1 text-base text-black sm:text-lg">
                  <bdi>{task.title}</bdi>{' '}
                  <span className="text-xs text-[#828282]">{t('dashboard.tasks.taskNumber', { id: task.id })}</span>
                </p>
                <span className={cn('shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium', STATUS_PILL[task.status])}>
                  {t(`dashboard.tasks.status.${task.status}`)}
                </span>
              </li>
            </Fragment>
          ))}
        </ol>
        </>}
      </div>
    </section>
  );
}
