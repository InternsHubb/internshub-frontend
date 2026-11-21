import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import assigneeAvatar from '@/assets/dashboard/board-assignee.svg';
import infoIcon from '@/assets/dashboard/ic-board-info.svg';
import layerIcon from '@/assets/dashboard/ic-layer.svg';
import layerLargeIcon from '@/assets/dashboard/ic-layer-lg.svg';
import starIcon from '@/assets/dashboard/ic-star-olive.svg';
import doneIcon from '@/assets/dashboard/ic-task-square-green.svg';
import timerIcon from '@/assets/dashboard/ic-timer-blue.svg';
import { CARD, IconTile } from '@/features/internships/components/primitives';
import type { SquadTaskDto, SquadTaskStatus } from '@/features/internships/types/internships.types';
import { cn } from '@/shared/utils/cn';
import { COLUMN_FOR_STATUS, STATUS_FOR_COLUMN, type BoardColumn } from '@/features/internships/utils/internship';
import { safeHttpUrl } from '@/shared/utils/url';

// Sprint task board (GET /api/squads/{id}/board). Learners move their own open tasks between
// To do, In progress and In review (drag or the status menu); a task reaches Completed only
// when the Senior approves it, and other members' tasks are read-only.

const COLUMNS: ReadonlyArray<{ column: BoardColumn; icon: string; columnClass: string; labelClass: string }> = [
  { column: 'todo', icon: layerIcon, columnClass: 'bg-[#f6ebff]', labelClass: 'text-[#3b0454]' },
  { column: 'inProgress', icon: timerIcon, columnClass: 'bg-[#d2e0ff]', labelClass: 'text-[#0057ff]' },
  { column: 'inReview', icon: starIcon, columnClass: 'bg-[#fff8e6]', labelClass: 'text-[#606202]' },
  { column: 'completed', icon: doneIcon, columnClass: 'bg-[#e6ffed]', labelClass: 'text-[#068f2f]' },
];

const MOVABLE: ReadonlyArray<BoardColumn> = ['todo', 'inProgress', 'inReview'];

type TaskBoardProps = {
  tasks: SquadTaskDto[];
  myUserId: string | null;
  onMove: (taskId: string, status: SquadTaskStatus) => void;
  moveErrorKey: string | null;
};

export function TaskBoard({ tasks, myUserId, onMove, moveErrorKey }: TaskBoardProps) {
  const { t } = useTranslation();
  const [view, setView] = useState<'mine' | 'squad'>('mine');
  const [dragging, setDragging] = useState<string | null>(null);
  const canMove = (task: SquadTaskDto) => task.assigneeUserId === myUserId && task.status !== 'Done';
  const draggedTask = tasks.find((task) => task.id === dragging);

  function moveTo(task: SquadTaskDto, column: BoardColumn) {
    setDragging(null);
    if (!canMove(task) || !MOVABLE.includes(column) || COLUMN_FOR_STATUS[task.status] === column) return;
    onMove(task.id, STATUS_FOR_COLUMN[column]);
  }

  return (
    <section aria-labelledby="task-board-title" className={cn(CARD, 'flex flex-col gap-4 p-4 sm:p-6')}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <IconTile icon={layerLargeIcon} />
          <h2 id="task-board-title" className="text-2xl font-semibold text-black sm:text-[32px]">{t('dashboard.board.title')}</h2>
        </div>
        <img src={infoIcon} alt={t('dashboard.board.hint')} title={t('dashboard.board.hint')} className="size-[34px] shrink-0" />
      </div>
      <p className="text-xs text-[#737373]">{t('dashboard.board.hint')}</p>
      {moveErrorKey && (
        <p role="alert" className="rounded-[14px] bg-[#fde5e5] p-3 text-xs font-semibold text-[#a10000]">
          {t('dashboard.board.moveError')} {t(moveErrorKey)}
        </p>
      )}
      <div className="flex rounded-[20px] border border-[#3a0353]/50" role="group" aria-label={t('dashboard.board.viewLabel')}>
        {(['mine', 'squad'] as const).map((tab) => (
          <button key={tab} type="button" aria-pressed={view === tab} onClick={() => setView(tab)} className={cn('min-h-[57px] flex-1 rounded-[20px] px-3 text-sm font-semibold sm:text-xl', view === tab ? 'bg-[#f6ebff] text-black shadow-[0_4px_4px_rgba(0,0,0,0.25)]' : 'text-[#3a0353]')}>
            {t(`dashboard.board.tabs.${tab}`)}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map(({ column, icon, columnClass, labelClass }) => {
          const columnTasks = tasks.filter((task) => COLUMN_FOR_STATUS[task.status] === column && (view === 'squad' || task.assigneeUserId === myUserId));
          const isDropTarget = Boolean(draggedTask) && MOVABLE.includes(column);
          return (
            <section key={column} aria-labelledby={`board-${column}`} data-board-column={column}
              onDragOver={(event) => { if (isDropTarget) event.preventDefault(); }}
              onDrop={(event) => { event.preventDefault(); if (draggedTask) moveTo(draggedTask, column); }}
              className={cn('flex min-w-0 flex-col gap-4 rounded-[20px] p-2 pb-6 xl:min-h-[549px]', columnClass, isDropTarget && 'ring-1 ring-inset ring-[#8037be]/30')}>
              <div className="flex min-h-[41px] items-center gap-2 px-2">
                <img src={icon} alt="" className="size-[27px] shrink-0" />
                <h3 id={`board-${column}`} className={cn('min-w-0 flex-1 text-[10px] leading-3', labelClass)}>
                  {t(`dashboard.board.columns.${column}`)}
                  <span className="block text-base font-bold leading-5">{columnTasks.length}</span>
                </h3>
              </div>
              {columnTasks.length === 0 ? <p className="px-2 pt-2 text-center text-sm font-semibold text-[#737373]">{t('dashboard.board.empty')}</p> : (
                <ul className="flex flex-col gap-4">
                  {columnTasks.map((task) => {
                    const movable = canMove(task);
                    const pullRequest = safeHttpUrl(task.pullRequestUrl);
                    return (
                      <li key={task.id} draggable={movable} data-task-id={task.id}
                        onDragStart={(event) => { event.dataTransfer.setData('text/plain', task.id); event.dataTransfer.effectAllowed = 'move'; setDragging(task.id); }}
                        onDragEnd={() => setDragging(null)}
                        className={cn('rounded-[20px] bg-white p-3 shadow-[0_4px_2px_rgba(0,0,0,0.25)]', movable && 'cursor-grab active:cursor-grabbing', dragging === task.id && 'opacity-50')}>
                        <div className="flex items-center gap-2">
                          <span className="flex size-[38px] shrink-0 items-center justify-center rounded-full bg-[#eee] shadow-[0_4px_4px_rgba(0,0,0,0.25)]"><img src={assigneeAvatar} alt="" className="h-[25px] w-[21px]" /></span>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold leading-4 text-black"><bdi>{task.title}</bdi></p>
                            <p className="mt-1 text-[10px] leading-4 text-[#7d7d7d]"><bdi>{task.assigneeName || t('dashboard.board.unassigned')}</bdi></p>
                          </div>
                        </div>
                        {pullRequest && (
                          <a href={pullRequest} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-[10px] font-semibold text-[#42046b] underline underline-offset-2">
                            {t('dashboard.board.pullRequest')}
                          </a>
                        )}
                        {movable && (
                          <select aria-label={t('dashboard.board.moveTask', { title: task.title })} value={column} onChange={(event) => moveTo(task, event.target.value as BoardColumn)} className="mt-3 w-full rounded-lg border border-[#e9dcf8] bg-white p-1 text-[10px] text-[#42046b]">
                            {MOVABLE.map((option) => <option key={option} value={option}>{t(`dashboard.board.columns.${option}`)}</option>)}
                          </select>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </section>
  );
}

export default TaskBoard;
