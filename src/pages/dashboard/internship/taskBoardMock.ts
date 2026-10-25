import type { BoardTask, TaskStatus } from '@/data/internshipDashboard';

export type BoardColumn = 'backlog' | TaskStatus;
export type MockTaskBoard = Record<BoardColumn, ReadonlyArray<BoardTask>>;

// Pure local transition: no API permissions, reviews or project scores are changed.
export function moveMockTask(board: MockTaskBoard, taskKey: string, target: BoardColumn): MockTaskBoard {
  const source = (Object.keys(board) as BoardColumn[]).find((column) => board[column].some((task) => task.key === taskKey));
  if (!source || source === target || source === 'backlog' || target === 'backlog') return board;
  const task = board[source].find((candidate) => candidate.key === taskKey)!;
  return {
    ...board,
    [source]: board[source].filter((candidate) => candidate.key !== taskKey),
    [target]: [...board[target], { ...task, changesRequested: false }],
  };
}
