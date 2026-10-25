import { useCallback, useEffect, useRef, useState } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { apiErrorKey } from '@/lib/api/errors';
import {
  getNotifications,
  getUnreadNotificationsCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '@/lib/api/notifications';
import type { NotificationDto } from '@/lib/api/types';

// Notifications for the top-bar bell:
// - The unread count (GET /api/notifications/unread-count) loads once signed in and refreshes
//   every minute while the tab is visible.
// - The list (GET /api/notifications, cursor pages) loads when the menu opens; "Load more"
//   follows nextCursor.
// - Reading one (POST /api/notifications/{id}/read) or all (POST /api/notifications/read-all)
//   updates the list and count straight away and puts them back if the request fails.
// Nothing is requested for a signed-out visitor, so the bell never triggers a sign-in redirect.

const PAGE_SIZE = 10;
const COUNT_REFRESH_MS = 60_000;

type NotificationsState = {
  items: NotificationDto[];
  unreadCount: number;
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  errorKey: string | null;
  actionErrorKey: string | null;
};

const INITIAL_STATE: NotificationsState = {
  items: [],
  unreadCount: 0,
  hasMore: false,
  isLoading: false,
  isLoadingMore: false,
  errorKey: null,
  actionErrorKey: null,
};

export function useNotifications() {
  const { status } = useAuth();
  const isSignedIn = status === 'authenticated';
  const [state, setState] = useState<NotificationsState>(INITIAL_STATE);
  const stateRef = useRef(state);
  const nextCursor = useRef<string | null>(null);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const refreshCount = useCallback(async () => {
    try {
      const { count } = await getUnreadNotificationsCount();
      setState((current) => ({ ...current, unreadCount: count }));
    } catch {
      // The badge keeps its last value; the list shows its own error when the menu opens.
    }
  }, []);

  useEffect(() => {
    if (!isSignedIn) {
      setState(INITIAL_STATE);
      return;
    }
    void refreshCount();
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') void refreshCount();
    }, COUNT_REFRESH_MS);
    return () => window.clearInterval(timer);
  }, [isSignedIn, refreshCount]);

  const loadFirstPage = useCallback(async () => {
    if (!isSignedIn) return;
    setState((current) => ({ ...current, isLoading: true, errorKey: null, actionErrorKey: null }));
    try {
      const page = await getNotifications({ limit: PAGE_SIZE });
      nextCursor.current = page.nextCursor;
      setState((current) => ({ ...current, items: page.items, hasMore: page.nextCursor !== null, isLoading: false }));
      void refreshCount();
    } catch (error) {
      setState((current) => ({ ...current, isLoading: false, errorKey: apiErrorKey(error) }));
    }
  }, [isSignedIn, refreshCount]);

  const loadMore = useCallback(async () => {
    const cursor = nextCursor.current;
    if (!cursor) return;
    setState((current) => ({ ...current, isLoadingMore: true, actionErrorKey: null }));
    try {
      const page = await getNotifications({ limit: PAGE_SIZE, cursor });
      nextCursor.current = page.nextCursor;
      setState((current) => {
        const known = new Set(current.items.map((item) => item.id));
        return {
          ...current,
          items: [...current.items, ...page.items.filter((item) => !known.has(item.id))],
          hasMore: page.nextCursor !== null,
          isLoadingMore: false,
        };
      });
    } catch (error) {
      setState((current) => ({ ...current, isLoadingMore: false, actionErrorKey: apiErrorKey(error) }));
    }
  }, []);

  // Shared by both read actions: apply the change now, restore the earlier list if the request fails.
  const applyOptimistic = useCallback(
    async (update: (current: NotificationsState) => NotificationsState, request: () => Promise<void>) => {
      const previous = stateRef.current;
      setState((current) => ({ ...update(current), actionErrorKey: null }));
      try {
        await request();
      } catch (error) {
        setState((current) => ({
          ...current,
          items: previous.items,
          unreadCount: previous.unreadCount,
          actionErrorKey: apiErrorKey(error),
        }));
      }
    },
    []
  );

  const markRead = useCallback(
    async (id: string) => {
      const target = stateRef.current.items.find((item) => item.id === id);
      if (!target || target.isRead) return;
      const readAt = new Date().toISOString();
      await applyOptimistic(
        (current) => ({
          ...current,
          unreadCount: Math.max(0, current.unreadCount - 1),
          items: current.items.map((item) => (item.id === id ? { ...item, isRead: true, readAt } : item)),
        }),
        () => markNotificationAsRead(id)
      );
    },
    [applyOptimistic]
  );

  const markAllRead = useCallback(async () => {
    const readAt = new Date().toISOString();
    await applyOptimistic(
      (current) => ({
        ...current,
        unreadCount: 0,
        items: current.items.map((item) => (item.isRead ? item : { ...item, isRead: true, readAt })),
      }),
      markAllNotificationsAsRead
    );
  }, [applyOptimistic]);

  return { ...state, isSignedIn, loadFirstPage, loadMore, markRead, markAllRead };
}
