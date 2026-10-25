import { useCallback, useEffect, useRef, useState } from 'react';

import { apiErrorKey } from '@/lib/api/errors';
import { getSquadBoard, getSquadSprints, moveTask } from '@/lib/api/squads';
import type { SprintBoardDto, SprintSummaryDto, SquadTaskStatus } from '@/lib/api/types';

// The squad's sprints (GET /api/squads/{id}/sprints) and one sprint's board
// (GET /api/squads/{id}/board?sprintId). It opens the Active sprint, else the latest one.
// Moving a task (PUT /api/tasks/{id}/move) updates the board at once and rolls back on failure.

type Status = 'loading' | 'ready' | 'error';

export type SquadBoard = {
  status: Status;
  errorKey: string | null;
  sprints: SprintSummaryDto[];
  board: SprintBoardDto | null;
  // A newly picked sprint's board is loading; `board` still holds the previous one.
  isSwitching: boolean;
  selectSprint: (sprintId: string) => void;
  move: (taskId: string, status: SquadTaskStatus) => Promise<void>;
  moveErrorKey: string | null;
  reload: () => void;
};

function defaultSprint(sprints: SprintSummaryDto[]): SprintSummaryDto | undefined {
  return sprints.find((sprint) => sprint.status === 'Active') ?? [...sprints].sort((a, b) => b.number - a.number)[0];
}

export function useSquadBoard(squadId: string): SquadBoard {
  const [status, setStatus] = useState<Status>('loading');
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [sprints, setSprints] = useState<SprintSummaryDto[]>([]);
  // The sprint the learner picked; null opens the default one.
  const [requestedSprintId, setRequestedSprintId] = useState<string | null>(null);
  const [board, setBoard] = useState<SprintBoardDto | null>(null);
  const [moveErrorKey, setMoveErrorKey] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [isSwitching, setSwitching] = useState(false);
  // Latest board, for rolling back a failed move.
  const boardRef = useRef<SprintBoardDto | null>(null);

  useEffect(() => {
    boardRef.current = board;
  }, [board]);

  // Sprints are loaded once (and on retry); picking a sprint only loads its board.
  const sprintsFor = useRef<{ key: string; list: SprintSummaryDto[] } | null>(null);

  useEffect(() => {
    let active = true;
    const key = `${squadId}:${attempt}`;
    // Switching sprints keeps the current board on screen (and the picker focused) until the next one loads.
    const isSwitch = sprintsFor.current?.key === key;
    if (isSwitch) setSwitching(true);
    else {
      setStatus('loading');
      setErrorKey(null);
    }
    setMoveErrorKey(null);
    (async () => {
      const list = isSwitch && sprintsFor.current ? sprintsFor.current.list : await getSquadSprints(squadId);
      sprintsFor.current = { key, list };
      const sprintId = requestedSprintId ?? defaultSprint(list)?.id ?? null;
      const loaded = sprintId ? await getSquadBoard(squadId, sprintId) : null;
      if (!active) return;
      setSprints(list);
      setBoard(loaded);
      setStatus('ready');
      setSwitching(false);
    })().catch((error: unknown) => {
      if (!active) return;
      setErrorKey(apiErrorKey(error));
      setStatus('error');
      setSwitching(false);
    });
    return () => {
      active = false;
    };
  }, [squadId, requestedSprintId, attempt]);

  const move = useCallback(async (taskId: string, next: SquadTaskStatus) => {
    const before = boardRef.current;
    if (!before) return;
    setMoveErrorKey(null);
    setBoard({ ...before, tasks: before.tasks.map((task) => (task.id === taskId ? { ...task, status: next } : task)) });
    try {
      await moveTask(taskId, next);
    } catch (error) {
      // Put the task back, unless another sprint was opened meanwhile.
      setBoard((current) => (current?.sprintId === before.sprintId
        ? { ...current, tasks: current.tasks.map((task) => before.tasks.find((old) => old.id === task.id && task.id === taskId) ?? task) }
        : current));
      setMoveErrorKey(apiErrorKey(error));
    }
  }, []);

  return {
    status,
    errorKey,
    sprints,
    board,
    isSwitching,
    selectSprint: setRequestedSprintId,
    move,
    moveErrorKey,
    reload: () => setAttempt((value) => value + 1),
  };
}
