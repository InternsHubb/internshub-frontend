import { apiRequest } from './client';
import type {
  CursorPage,
  TalentDetailDto,
  TalentRequestDto,
  TalentRequestStatus,
  TalentSummaryDto,
} from './types';

export function getTalentList(cursor?: string): Promise<CursorPage<TalentSummaryDto>> {
  const query = cursor ? `?cursor=${encodeURIComponent(cursor)}` : '';
  return apiRequest<CursorPage<TalentSummaryDto>>(`/api/talent${query}`, { auth: true });
}

export function getTalentDetails(userId: string): Promise<TalentDetailDto> {
  return apiRequest<TalentDetailDto>(`/api/talent/${encodeURIComponent(userId)}`, { auth: true });
}

export function sendTalentRequest(userId: string, message: string): Promise<void> {
  return apiRequest<void>(`/api/talent/${encodeURIComponent(userId)}/requests`, {
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
  status: TalentRequestStatus
): Promise<void> {
  return apiRequest<void>(`/api/me/talent-requests/${encodeURIComponent(requestId)}/respond`, {
    method: 'POST',
    body: { status },
    auth: true,
  });
}

export function setTalentVisibility(isVisible: boolean): Promise<void> {
  return apiRequest<void>('/api/me/talent-visibility', {
    method: 'PUT',
    body: { isVisible },
    auth: true,
  });
}
