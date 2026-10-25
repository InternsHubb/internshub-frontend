import { apiRequest } from './client';
import type { CursorPage, NotificationDto, UnreadCountDto } from './types';

export function getNotifications(params?: {
  cursor?: string;
  limit?: number;
  unreadOnly?: boolean;
}): Promise<CursorPage<NotificationDto>> {
  const query = new URLSearchParams();
  if (params?.cursor) query.set('cursor', params.cursor);
  if (params?.limit) query.set('limit', params.limit.toString());
  if (params?.unreadOnly !== undefined) query.set('unreadOnly', String(params.unreadOnly));
  const queryString = query.toString() ? `?${query.toString()}` : '';
  return apiRequest<CursorPage<NotificationDto>>(`/api/notifications${queryString}`, {
    auth: true,
  });
}

export function getUnreadNotificationsCount(): Promise<UnreadCountDto> {
  return apiRequest<UnreadCountDto>('/api/notifications/unread-count', { auth: true });
}

export function markNotificationAsRead(id: string): Promise<void> {
  return apiRequest<void>(`/api/notifications/${encodeURIComponent(id)}/read`, {
    method: 'POST',
    auth: true,
  });
}

export function markAllNotificationsAsRead(): Promise<void> {
  return apiRequest<void>('/api/notifications/read-all', {
    method: 'POST',
    auth: true,
  });
}
