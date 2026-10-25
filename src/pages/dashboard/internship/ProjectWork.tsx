import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import codeIcon from '@/assets/dashboard/ic-code.svg';
import exportIcon from '@/assets/dashboard/ic-export.svg';
import layerLargeIcon from '@/assets/dashboard/ic-layer-lg.svg';
import taskDivider from '@/assets/dashboard/task-divider.svg';
import { CARD, IconTile, NumberTile } from '@/components/dashboard/primitives';
import type { SquadTaskDto } from '@/lib/api/types';
import { cn } from '@/lib/cn';
import { COLUMN_FOR_STATUS, type BoardColumn } from '@/lib/internship';
import { safeHttpUrl } from '@/lib/url';

// "Projects Links" and "My Tasks This Sprint" on the project page ("project", 31:35261).

// The squad's repository is the only project link the API has (SquadDetailsDto.repositoryUrl).
export function ProjectLinks({ repositoryUrl }: { repositoryUrl: string | null }) {
  const { t } = useTranslation();
  const href = safeHttpUrl(repositoryUrl);
  return (
    <section aria-labelledby="links-title" className={cn(CARD, 'flex flex-col gap-6 p-4 sm:p-[18px]')}>
      <div className="flex items-center gap-3">
        <IconTile icon={codeIcon} />
        <h2 id="links-title" className="text-2xl font-semibold text-black sm:text-[32px]">{t('dashboard.links.title')}</h2>
      </div>
      {href ? (
        <ol>
          <li className="flex min-w-0 items-center gap-3">
            <NumberTile value={1} />
            <a href={href} target="_blank" rel="noopener noreferrer" className="flex min-w-0 flex-wrap items-center gap-x-1 text-base text-black hover:text-[#42046b] sm:text-lg">
              {t('dashboard.links.repository')} -{' '}
              <span className="truncate font-semibold underline underline-offset-2" dir="ltr">{new URL(href).host}</span>
              <img src={exportIcon} alt="" aria-hidden="true" className="size-6 shrink-0 rtl:-scale-x-100" />
            </a>
          </li>
        </ol>
      ) : (
        <p className="text-base text-[#737373]">{t('dashboard.links.none')}</p>
      )}
    </section>
  );
}

type OpenColumn = Exclude<BoardColumn, 'completed'>;

const STATUS_PILL: Record<OpenColumn, string> = {
  inReview: 'bg-[#fff3e8] text-[#d06f15]',
  inProgress: 'bg-[#dbe8ff] text-[#0057ff]',
  todo: 'bg-[#f6ebff] text-[#3b0454]',
};

// Review first, then in progress, then to do (closest to done on top).
const TOP_ORDER: ReadonlyArray<OpenColumn> = ['inReview', 'inProgress', 'todo'];
const TOP_TASKS = 3;

export function MyTasks({ tasks, myUserId }: { tasks: SquadTaskDto[]; myUserId: string | null }) {
  const { t } = useTranslation();
  const open = tasks
    .filter((task) => task.assigneeUserId === myUserId)
    .map((task) => ({ task, column: COLUMN_FOR_STATUS[task.status] }))
    .filter((item): item is { task: SquadTaskDto; column: OpenColumn } => item.column !== 'completed');
  const counts = (['todo', 'inProgress', 'inReview'] as const).map((column) => [column, open.filter((item) => item.column === column).length] as const);
  const top = [...open].sort((a, b) => TOP_ORDER.indexOf(a.column) - TOP_ORDER.indexOf(b.column)).slice(0, TOP_TASKS);

  return (
    <section aria-labelledby="my-tasks-title" className={cn(CARD, 'flex flex-col gap-6 p-4 sm:p-[18px]')}>
      <div className="flex items-center gap-3">
        <IconTile icon={layerLargeIcon} />
        <h2 id="my-tasks-title" className="text-2xl font-semibold text-black sm:text-[32px]">{t('dashboard.tasks.title')}</h2>
      </div>
      <dl className="grid grid-cols-3 gap-2 text-center">
        {counts.map(([column, count]) => (
          <div key={column} className="flex flex-col-reverse">
            <dt className="text-sm text-black sm:text-lg">{t(`dashboard.tasks.status.${column}`)}</dt>
            <dd className="text-lg font-semibold text-black">{count}</dd>
          </div>
        ))}
      </dl>
      <div>
        {top.length === 0 ? <p className="py-6 text-center text-lg text-[#737373]">{t('dashboard.tasks.empty')}</p> : <>
        <h3 className="text-lg text-black">{t('dashboard.tasks.topTasks')}</h3>
        <ol className="mt-4 flex flex-col">
          {top.map(({ task, column }, index) => (
            <Fragment key={task.id}>
              {index > 0 && (
                <li aria-hidden="true" className="flex justify-center py-3">
                  <img src={taskDivider} alt="" className="h-px w-full max-w-[704px]" />
                </li>
              )}
              <li className="flex items-center gap-3">
                <NumberTile value={index + 1} />
                <p className="min-w-0 flex-1 text-base text-black sm:text-lg"><bdi>{task.title}</bdi></p>
                <span className={cn('shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium', STATUS_PILL[column])}>
                  {t(`dashboard.tasks.status.${column}`)}
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
