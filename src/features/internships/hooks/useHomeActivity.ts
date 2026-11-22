import { useCallback, useEffect, useMemo, useState } from 'react';

import { getBackendErrorKey } from '@/backend';
import { getMyBookings, getSquadBoard, getSquadSprints } from '@/features/internships/services/internshipsService';
import type { MentorBookingDto, SquadDetailsDto, SquadTaskDto, SquadTaskStatus } from '@/features/internships/types/internships.types';

// Live cards of the Dashboard home. Each one loads, fails and retries on its own:
//   next session — the soonest booked mentor session that hasn't ended (GET /api/me/bookings);
//   today's task — the learner's open task in the squad's Active sprint
//     (GET /api/squads/{id}/sprints + GET /api/squads/{id}/board?sprintId).

// `idle`: nothing to load (no started squad yet).
type Status = 'idle' | 'loading' | 'ready' | 'error';

export type Loaded<T> = { status: Status; value: T | null; errorKey: string | null; reload: () => void };

type State<T> = { status: Status; value: T | null; errorKey: string | null };

// `load` must keep its identity between renders (module function or useMemo).
function useLoaded<T>(load: (() => Promise<T>) | null): Loaded<T> {
  const [state, setState] = useState<State<T>>({ status: 'loading', value: null, errorKey: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!load) return;
    let active = true;
    setState({ status: 'loading', value: null, errorKey: null });
    load().then(
      (value) => {
        if (active) setState({ status: 'ready', value, errorKey: null });
      },
      (error: unknown) => {
        if (active) setState({ status: 'error', value: null, errorKey: getBackendErrorKey(error) });
      },
    );
    return () => {
      active = false;
    };
  }, [load, attempt]);

  const reload = useCallback(() => setAttempt((value) => value + 1), []);
  return { ...(load ? state : { status: 'idle', value: null, errorKey: null }), reload };
}

export function nextBooking(bookings: MentorBookingDto[], now: number): MentorBookingDto | null {
  return bookings
    .filter((booking) => booking.status === 'Booked' && new Date(booking.endsAt).getTime() > now)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))[0] ?? null;
}

async function loadNextSession(): Promise<MentorBookingDto | null> {
  return nextBooking(await getMyBookings(), Date.now());
}

export function useNextSession(): Loaded<MentorBookingDto | null> {
  return useLoaded(loadNextSession);
}

export type TodayTask = { task: SquadTaskDto; dueAt: string };

// Work in progress comes first, then work not started. Tasks in review wait on the Senior.
const OPEN_STATUSES: ReadonlyArray<SquadTaskStatus> = ['InProgress', 'Todo'];

async function loadTodayTask(squadId: string, userId: string): Promise<TodayTask | null> {
  const sprint = (await getSquadSprints(squadId)).find((item) => item.status === 'Active');
  if (!sprint) return null;
  const board = await getSquadBoard(squadId, sprint.id);
  const mine = board.tasks.filter((task) => task.assigneeUserId === userId);
  for (const status of OPEN_STATUSES) {
    const task = mine.find((item) => item.status === status);
    if (task) return { task, dueAt: board.endsAt };
  }
  return null;
}

export function useTodayTask(squad: SquadDetailsDto | null, userId: string | null): Loaded<TodayTask | null> {
  const squadId = squad?.status === 'Active' ? squad.id : null;
  const load = useMemo(() => (squadId && userId ? () => loadTodayTask(squadId, userId) : null), [squadId, userId]);
  return useLoaded(load);
}
