import { useTranslation } from 'react-i18next';

import layerIcon from '@/assets/dashboard/ic-layer.svg';
import layerLargeIcon from '@/assets/dashboard/ic-layer-lg.svg';
import starIcon from '@/assets/dashboard/ic-star-olive.svg';
import doneIcon from '@/assets/dashboard/ic-task-square-green.svg';
import timerIcon from '@/assets/dashboard/ic-timer-blue.svg';
import { CARD, IconTile } from '@/components/dashboard/primitives';
import { SAMPLE_TASK_BOARD, type TaskStatus } from '@/data/internshipDashboard';
import { cn } from '@/lib/cn';

// "Task Board" on the project page ("project", 31:35261): one read-only column per status.
// Moving tasks needs a sprints/Kanban API that does not exist yet.

const COLUMNS: ReadonlyArray<{ status: TaskStatus; icon: string; columnClass: string; labelClass: string }> = [
  { status: 'todo', icon: layerIcon, columnClass: 'bg-[#f6ebff]', labelClass: 'text-[#3b0454]' },
  { status: 'inProgress', icon: timerIcon, columnClass: 'bg-[#d5e3ff]', labelClass: 'text-[#0057ff]' },
  { status: 'inReview', icon: starIcon, columnClass: 'bg-[#fff8e6]', labelClass: 'text-[#606202]' },
  { status: 'completed', icon: doneIcon, columnClass: 'bg-[#dcffde]', labelClass: 'text-[#068f2f]' },
];

export function TaskBoard() {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="task-board-title" className={cn(CARD, 'flex flex-col gap-6 p-4 sm:p-6')}>
      <div className="flex items-center gap-3">
        <IconTile icon={layerLargeIcon} />
        <h2 id="task-board-title" className="text-2xl font-semibold text-black sm:text-[32px]">{t('dashboard.board.title')}</h2>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map(({ status, icon, columnClass, labelClass }) => {
          const tasks = SAMPLE_TASK_BOARD[status];
          const headingId = `board-${status}`;
          return (
            <section key={status} aria-labelledby={headingId} className={cn('flex flex-col gap-3 rounded-[20px] p-2 pb-6 xl:min-h-[480px]', columnClass)}>
              <div className="flex items-center gap-2 px-2 pt-2">
                <img src={icon} alt="" aria-hidden="true" className="size-[27px] shrink-0" />
                <h3 id={headingId} className={cn('flex flex-col text-[9px] leading-3', labelClass)}>
                  {t(`dashboard.board.columns.${status}`)}
                  <span className="text-sm font-semibold leading-5 text-[#030303]">{tasks.length}</span>
                </h3>
              </div>
              <ul className="flex flex-col gap-2.5">
                {tasks.map((task) => (
                  <li key={task.key} className="rounded-[13px] bg-white px-3 py-3 shadow-[0_2px_6px_rgba(0,0,0,0.18)]">
                    <p className="text-[10px] font-bold leading-4 text-[#3b0454]">{t('dashboard.tasks.taskNumberSpaced', { id: task.id })}</p>
                    <p className="text-[10px] font-semibold leading-4 text-black">
                      <bdi>{task.title}</bdi>{' '}
                      <span className="font-normal text-[#b5b5b5]"><bdi>{task.track}</bdi></span>
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </section>
  );
}

export default TaskBoard;
