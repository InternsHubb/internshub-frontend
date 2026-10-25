import { apiRequest } from './client';
import type { CursorPage, NotificationDto, UnreadCountDto } from './types';

export function getNotifications(cursor?: string): Promise<CursorPage<NotificationDto>> {
  const query = cursor ? `?cursor=${encodeURIComponent(cursor)}` : '';
  return apiRequest<CursorPage<NotificationDto>>(`/api/notifications${query}`, { auth: true });
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
