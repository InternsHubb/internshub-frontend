import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { BellOff } from 'lucide-react';

export interface NotificationItem {
  id: string;
  title: string;
  body?: string;
  isRead: boolean;
  createdAt: string;
}

type NotificationsMenuProps = {
  buttonClassName: string;
  icon: ReactNode;
  items?: ReadonlyArray<NotificationItem>;
  unreadCount?: number;
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
};

/**
 * Shared top-bar notifications popover foundation.
 * Backend notifications will be wired through `src/backend/` once available.
 */
export function NotificationsMenu({
  buttonClassName,
  icon,
  items = [],
  unreadCount = 0,
  onMarkRead,
  onMarkAllRead,
}: NotificationsMenuProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!container.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsOpen(false);
      button.current?.focus();
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  const badge = unreadCount > 9 ? '9+' : String(unreadCount);

  return (
    <div ref={container} className="relative">
      <button
        ref={button}
        type="button"
        aria-label={t('notifications.title', 'Notifications')}
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        onClick={() => setIsOpen((open) => !open)}
        className={`relative ${buttonClassName}`}
      >
        {icon}
        {unreadCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute -end-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-brand-primary px-1 text-[10px] font-bold leading-none text-white"
          >
            {badge}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          id={panelId}
          role="dialog"
          aria-label={t('notifications.title', 'Notifications')}
          className="fixed inset-x-4 top-20 z-50 overflow-hidden rounded-[var(--radius-card)] border border-border-subtle bg-white shadow-[var(--shadow-popover)] sm:absolute sm:inset-x-auto sm:end-0 sm:top-full sm:mt-3 sm:w-[360px]"
        >
          <div className="flex items-center justify-between gap-3 border-b border-surface px-4 py-3">
            <p className="text-sm font-semibold text-ink">
              {t('notifications.title', 'Notifications')}
            </p>
            {onMarkAllRead && unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllRead}
                className="text-xs font-semibold text-brand-primary hover:underline"
              >
                {t('notifications.markAllRead', 'Mark all read')}
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-10 text-center">
              <span
                aria-hidden="true"
                className="flex size-11 items-center justify-center rounded-full bg-info-soft text-brand-primary"
              >
                <BellOff className="size-5" />
              </span>
              <p className="mt-3 text-sm font-semibold text-ink">
                {t('notifications.emptyTitle', 'No notifications yet')}
              </p>
              <p className="mt-1 text-xs text-muted">
                {t('notifications.emptyBody', 'Live notifications will appear once the backend is connected.')}
              </p>
            </div>
          ) : (
            <ul className="max-h-[360px] divide-y divide-surface overflow-y-auto">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onMarkRead?.(item.id)}
                    className="flex w-full items-start gap-3 px-4 py-3 text-start transition hover:bg-surface-subtle"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-ink">{item.title}</span>
                      {item.body && (
                        <span className="mt-0.5 line-clamp-2 block text-xs text-muted">{item.body}</span>
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationsMenu;
