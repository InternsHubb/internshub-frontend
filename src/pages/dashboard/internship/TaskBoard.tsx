import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import assigneeAvatar from '@/assets/dashboard/board-assignee.svg';
import infoIcon from '@/assets/dashboard/ic-board-info.svg';
import lockIcon from '@/assets/dashboard/ic-board-lock.svg';
import layerIcon from '@/assets/dashboard/ic-layer.svg';
import layerLargeIcon from '@/assets/dashboard/ic-layer-lg.svg';
import starIcon from '@/assets/dashboard/ic-star-olive.svg';
import doneIcon from '@/assets/dashboard/ic-task-square-green.svg';
import timerIcon from '@/assets/dashboard/ic-timer-blue.svg';
import { CARD, IconTile } from '@/components/dashboard/primitives';
import { SAMPLE_BOARD_STUDENT_ID, SAMPLE_TASK_BOARD } from '@/data/internshipDashboard';
import { internshipPlan } from '@/data/internshipPackages';
import { cn } from '@/lib/cn';

import { moveMockTask, type BoardColumn, type MockTaskBoard } from './taskBoardMock';

const COLUMNS: ReadonlyArray<{ status: BoardColumn; icon: string; columnClass: string; labelClass: string }> = [
  { status: 'backlog', icon: lockIcon, columnClass: 'bg-[#f4f4f4]', labelClass: 'text-black' },
  { status: 'todo', icon: layerIcon, columnClass: 'bg-[#f6ebff]', labelClass: 'text-[#3b0454]' },
  { status: 'inProgress', icon: timerIcon, columnClass: 'bg-[#d2e0ff]', labelClass: 'text-[#0057ff]' },
  { status: 'inReview', icon: starIcon, columnClass: 'bg-[#fff8e6]', labelClass: 'text-[#606202]' },
  { status: 'completed', icon: doneIcon, columnClass: 'bg-[#e6ffed]', labelClass: 'text-[#068f2f]' },
];

function previewBoard(preview: string | null): MockTaskBoard {
  if (preview === 'empty') return { backlog: [], todo: [], inProgress: [], inReview: [], completed: [] };
  return { backlog: [], ...SAMPLE_TASK_BOARD, ...(preview === 'empty-column' && { todo: [] }) };
}

export function TaskBoard() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const preview = params.get('board');
  const scope = `${internshipPlan(params)}:${preview ?? 'default'}`;
  const [boards, setBoards] = useState<Record<string, MockTaskBoard>>({});
  const [view, setView] = useState<'mine' | 'squad'>('mine');
  const [dragging, setDragging] = useState<string | null>(null);
  const board = boards[scope] ?? previewBoard(preview);

  function moveTask(taskKey: string, target: BoardColumn) {
    setBoards((previous) => ({ ...previous, [scope]: moveMockTask(previous[scope] ?? previewBoard(preview), taskKey, target) }));
    setDragging(null);
  }

  return (
    <section aria-labelledby="task-board-title" className={cn(CARD, 'flex flex-col gap-4 p-4 sm:p-6')}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <IconTile icon={layerLargeIcon} />
          <h2 id="task-board-title" className="text-2xl font-semibold text-black sm:text-[32px]">{t('dashboard.board.title')}</h2>
        </div>
        <img src={infoIcon} alt={t('dashboard.board.mockHint')} title={t('dashboard.board.mockHint')} className="size-[34px] shrink-0" />
      </div>
      <p className="text-xs text-[#737373]">{t('dashboard.board.mockHint')}</p>
      <div className="flex rounded-[20px] border border-[#3a0353]/50" role="group" aria-label={t('dashboard.board.viewLabel')}>
        {(['mine', 'squad'] as const).map((tab) => (
          <button key={tab} type="button" aria-pressed={view === tab} onClick={() => setView(tab)} className={cn('min-h-[57px] flex-1 rounded-[20px] px-3 text-sm font-semibold sm:text-xl', view === tab ? 'bg-[#f6ebff] text-black shadow-[0_4px_4px_rgba(0,0,0,0.25)]' : 'text-[#3a0353]')}>
            {t(`dashboard.board.tabs.${tab}`)}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {COLUMNS.map(({ status, icon, columnClass, labelClass }) => {
          const tasks = board[status].filter((task) => view === 'squad' || task.assigneeId === SAMPLE_BOARD_STUDENT_ID);
          return (
            <section key={status} aria-labelledby={`board-${status}`} data-board-column={status}
              onDragOver={(event) => { if (status !== 'backlog' && dragging) event.preventDefault(); }}
              onDrop={(event) => { event.preventDefault(); if (dragging) moveTask(dragging, status); }}
              className={cn('flex min-w-0 flex-col gap-4 rounded-[20px] p-2 pb-6 xl:min-h-[549px]', columnClass, dragging && status !== 'backlog' && 'ring-1 ring-inset ring-[#8037be]/30')}>
              <div className="flex min-h-[41px] items-center gap-2 px-2">
                <img src={icon} alt="" className="size-[27px] shrink-0" />
                <h3 id={`board-${status}`} className={cn('min-w-0 flex-1 text-[10px] leading-3', labelClass)}>
                  {t(`dashboard.board.columns.${status}`)}
                  <span className="block text-base font-bold leading-5">{tasks.length}</span>
                </h3>
                {status === 'backlog' && <span className="rounded-full bg-[#e7e7e7] px-2 py-2 text-[9px] text-[#737373]">{t('dashboard.board.readOnly')}</span>}
              </div>
              {tasks.length === 0 ? <p className="px-2 pt-2 text-center text-sm font-semibold text-[#737373]">{t('dashboard.board.empty')}</p> : (
                <ul className="flex flex-col gap-4">
                  {tasks.map((task) => (
                    <li key={task.key} draggable={status !== 'backlog'} data-task-key={task.key}
                      onDragStart={(event) => { event.dataTransfer.setData('text/plain', task.key); event.dataTransfer.effectAllowed = 'move'; setDragging(task.key); }}
                      onDragEnd={() => setDragging(null)}
                      className={cn('rounded-[20px] bg-white p-3 shadow-[0_4px_2px_rgba(0,0,0,0.25)]', status !== 'backlog' && 'cursor-grab active:cursor-grabbing', dragging === task.key && 'opacity-50')}>
                      {task.changesRequested && <p className="mb-3 rounded-full bg-[#fff8e6] px-2 py-2 text-center text-[10px] font-semibold text-[#a56a00]">{t('dashboard.board.changesRequested')}</p>}
                      <div className="flex items-center gap-2">
                        <span className="flex size-[38px] shrink-0 items-center justify-center rounded-full bg-[#eee] shadow-[0_4px_4px_rgba(0,0,0,0.25)]"><img src={assigneeAvatar} alt="" className="h-[25px] w-[21px]" /></span>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold leading-4 text-black"><bdi>{task.title}</bdi></p>
                          <p className="mt-1 flex flex-wrap gap-1 text-[10px] leading-4"><span className="font-bold text-[#3b0454]">{t('dashboard.tasks.taskNumberSpaced', { id: task.id })}</span><bdi className="text-[#7d7d7d]">{task.track}</bdi>{task.storyPoints !== undefined && <span className="text-[#16794a]">{t('dashboard.board.points', { count: task.storyPoints })}</span>}</p>
                        </div>
                      </div>
                      {status !== 'backlog' && <select aria-label={t('dashboard.board.moveTask', { title: task.title })} value={status} onChange={(event) => moveTask(task.key, event.target.value as BoardColumn)} className="mt-3 w-full rounded-lg border border-[#e9dcf8] bg-white p-1 text-[10px] text-[#42046b]">
                        {COLUMNS.filter((column) => column.status !== 'backlog').map((column) => <option key={column.status} value={column.status}>{t(`dashboard.board.columns.${column.status}`)}</option>)}
                      </select>}
                    </li>
                  ))}
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
