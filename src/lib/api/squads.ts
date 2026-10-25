import { apiRequest } from './client';
import type {
  AddTaskRequest,
  ChatMessageDto,
  CreateSprintRequest,
  CursorPage,
  LeaderboardEntryDto,
  PointsSummaryDto,
  SprintBoardDto,
  SprintSummaryDto,
  SquadDetailsDto,
  SquadTaskStatus,
} from './types';

export function getMySquad(): Promise<SquadDetailsDto> {
  return apiRequest<SquadDetailsDto>('/api/me/squad', { auth: true });
}

export function getSquadBoard(squadId: string, sprintId?: string): Promise<SprintBoardDto> {
  const query = sprintId ? `?sprintId=${encodeURIComponent(sprintId)}` : '';
  return apiRequest<SprintBoardDto>(`/api/squads/${encodeURIComponent(squadId)}/board${query}`, {
    auth: true,
  });
}

export function getSquadSprints(squadId: string): Promise<SprintSummaryDto[]> {
  return apiRequest<SprintSummaryDto[]>(`/api/squads/${encodeURIComponent(squadId)}/sprints`, {
    auth: true,
  });
}

export function createSprint(squadId: string, body: CreateSprintRequest): Promise<string> {
  return apiRequest<string>(`/api/squads/${encodeURIComponent(squadId)}/sprints`, {
    method: 'POST',
    body,
    auth: true,
  });
}

export function addSprintTask(sprintId: string, body: AddTaskRequest): Promise<string> {
  return apiRequest<string>(`/api/sprints/${encodeURIComponent(sprintId)}/tasks`, {
    method: 'POST',
    body,
    auth: true,
  });
}

export function moveTask(taskId: string, status: SquadTaskStatus): Promise<void> {
  return apiRequest<void>(`/api/tasks/${encodeURIComponent(taskId)}/move`, {
    method: 'PUT',
    body: { status },
    auth: true,
  });
}

export function linkTaskPullRequest(taskId: string, pullRequestUrl: string): Promise<void> {
  return apiRequest<void>(`/api/tasks/${encodeURIComponent(taskId)}/pull-request`, {
    method: 'POST',
    body: { pullRequestUrl },
    auth: true,
  });
}

export function approveTask(taskId: string): Promise<void> {
  return apiRequest<void>(`/api/tasks/${encodeURIComponent(taskId)}/approve`, {
    method: 'POST',
    auth: true,
  });
}

export function startSquad(squadId: string): Promise<void> {
  return apiRequest<void>(`/api/squads/${encodeURIComponent(squadId)}/start`, {
    method: 'POST',
    auth: true,
  });
}

export function approveSquadProject(squadId: string): Promise<void> {
  return apiRequest<void>(`/api/squads/${encodeURIComponent(squadId)}/approve-project`, {
    method: 'POST',
    auth: true,
  });
}

export function getSquadMessages(
  squadId: string,
  params?: { before?: string; pageSize?: number }
): Promise<CursorPage<ChatMessageDto>> {
  const query = new URLSearchParams();
  if (params?.before) query.set('before', params.before);
  if (params?.pageSize) query.set('pageSize', params.pageSize.toString());
  const queryString = query.toString() ? `?${query.toString()}` : '';
  return apiRequest<CursorPage<ChatMessageDto>>(
    `/api/squads/${encodeURIComponent(squadId)}/messages${queryString}`,
    { auth: true }
  );
}

export function sendSquadMessage(squadId: string, body: string): Promise<ChatMessageDto> {
  return apiRequest<ChatMessageDto>(`/api/squads/${encodeURIComponent(squadId)}/messages`, {
    method: 'POST',
    body: { body },
    auth: true,
  });
}

export function getSquadLeaderboard(squadId: string): Promise<LeaderboardEntryDto[]> {
  return apiRequest<LeaderboardEntryDto[]>(
    `/api/squads/${encodeURIComponent(squadId)}/leaderboard`,
    { auth: true }
  );
}

export function getMyPoints(): Promise<PointsSummaryDto> {
  return apiRequest<PointsSummaryDto>('/api/me/points', { auth: true });
}
