import { apiRequest } from './client';
import type {
  CursorPage,
  InterviewLevel,
  TalentDetailDto,
  TalentRequestDto,
  TalentSummaryDto,
} from './types';

export function getTalentList(params?: {
  trackId?: string;
  level?: InterviewLevel;
  skill?: string;
  cursor?: string;
  limit?: number;
}): Promise<CursorPage<TalentSummaryDto>> {
  const query = new URLSearchParams();
  if (params?.trackId) query.set('trackId', params.trackId);
  if (params?.level) query.set('level', params.level);
  if (params?.skill) query.set('skill', params.skill);
  if (params?.cursor) query.set('cursor', params.cursor);
  if (params?.limit) query.set('limit', params.limit.toString());
  const queryString = query.toString() ? `?${query.toString()}` : '';
  return apiRequest<CursorPage<TalentSummaryDto>>(`/api/talent${queryString}`, {
    auth: true,
  });
}

export function getTalentDetails(userId: string): Promise<TalentDetailDto> {
  return apiRequest<TalentDetailDto>(`/api/talent/${encodeURIComponent(userId)}`, { auth: true });
}

export function sendTalentRequest(userId: string, message: string): Promise<TalentRequestDto> {
  return apiRequest<TalentRequestDto>(`/api/talent/${encodeURIComponent(userId)}/requests`, {
    method: 'POST',
    body: { message },
    auth: true,
  });
}

export function getMyTalentRequests(): Promise<TalentRequestDto[]> {
  return apiRequest<TalentRequestDto[]>('/api/me/talent-requests', { auth: true });
}

export function respondToTalentRequest(
  requestId: string,
  accept: boolean
): Promise<TalentRequestDto> {
  return apiRequest<TalentRequestDto>(
    `/api/me/talent-requests/${encodeURIComponent(requestId)}/respond`,
    {
      method: 'POST',
      body: { accept },
      auth: true,
    }
  );
}

export function setTalentVisibility(visible: boolean): Promise<void> {
  return apiRequest<void>('/api/me/talent-visibility', {
    method: 'PUT',
    body: { visible },
    auth: true,
  });
}
