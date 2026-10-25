import { apiRequest } from './client';
import type {
  ChatMessageDto,
  CursorPage,
  LeaderboardEntryDto,
  SprintBoardDto,
  SprintSummaryDto,
  SquadDetailsDto,
  SquadTaskStatus,
} from './types';

export function getMySquad(): Promise<SquadDetailsDto> {
  return apiRequest<SquadDetailsDto>('/api/me/squad', { auth: true });
}

export function getSquadBoard(squadId: string): Promise<SprintBoardDto> {
  return apiRequest<SprintBoardDto>(`/api/squads/${encodeURIComponent(squadId)}/board`, {
    auth: true,
  });
}

export function getSquadSprints(squadId: string): Promise<SprintSummaryDto[]> {
  return apiRequest<SprintSummaryDto[]>(`/api/squads/${encodeURIComponent(squadId)}/sprints`, {
    auth: true,
  });
}

export function moveTask(taskId: string, targetStatus: SquadTaskStatus): Promise<void> {
  return apiRequest<void>(`/api/tasks/${encodeURIComponent(taskId)}/move`, {
    method: 'PUT',
    body: { targetStatus },
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

export function getSquadMessages(
  squadId: string,
  cursor?: string
): Promise<CursorPage<ChatMessageDto>> {
  const query = cursor ? `?cursor=${encodeURIComponent(cursor)}` : '';
  return apiRequest<CursorPage<ChatMessageDto>>(
    `/api/squads/${encodeURIComponent(squadId)}/messages${query}`,
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
