import { apiRequest } from './client';
import type {
  SprintBoardDto,
  SprintSummaryDto,
  SquadDetailsDto,
  SquadTaskStatus,
} from './types';

// GET /api/me/squad — returns the learner's current squad (404 while on the waiting list).
export function getMySquad(): Promise<SquadDetailsDto> {
  return apiRequest<SquadDetailsDto>('/api/me/squad', { auth: true });
}

// GET /api/squads/{id}/sprints — returns the list of sprints for a squad.
export function getSquadSprints(squadId: string): Promise<SprintSummaryDto[]> {
  return apiRequest<SprintSummaryDto[]>(
    `/api/squads/${encodeURIComponent(squadId)}/sprints`,
    { auth: true },
  );
}

// GET /api/squads/{id}/board?sprintId={sprintId} — returns the Kanban board for a sprint.
export function getSquadBoard(squadId: string, sprintId: string): Promise<SprintBoardDto> {
  return apiRequest<SprintBoardDto>(
    `/api/squads/${encodeURIComponent(squadId)}/board?sprintId=${encodeURIComponent(sprintId)}`,
    { auth: true },
  );
}

// PUT /api/tasks/{id}/move — moves a task to a new status column.
export function moveTask(taskId: string, status: SquadTaskStatus): Promise<void> {
  return apiRequest<void>(
    `/api/tasks/${encodeURIComponent(taskId)}/move`,
    { method: 'PUT', body: { status }, auth: true },
  );
}

