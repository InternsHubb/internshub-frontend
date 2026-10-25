import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, BellOff, CheckCheck, Loader2 } from 'lucide-react';

import { useNotifications } from '@/hooks/useNotifications';
import type { NotificationDto } from '@/lib/api/types';

// Top-bar bell with the unread count and a notifications panel (useNotifications). There is no
// Figma frame for the panel, so it follows the top bar's surfaces and the brand purple. Opening
// it loads the latest notifications; selecting an unread one marks it read. Signed-out visitors
// see the bell without a count, and the panel asks them to sign in.

const MAX_BADGE = 9;
const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

// "5 minutes ago" / "منذ 5 دقائق"; older than a week shows the date.
function relativeTime(iso: string, language: string): string {
  const date = new Date(iso);
  const elapsed = Date.now() - date.getTime();
  if (Number.isNaN(elapsed)) return '';
  const format = new Intl.RelativeTimeFormat(language, { numeric: 'auto' });
  if (elapsed < HOUR) return format.format(-Math.max(0, Math.round(elapsed / MINUTE)), 'minute');
  if (elapsed < DAY) return format.format(-Math.round(elapsed / HOUR), 'hour');
  if (elapsed < 7 * DAY) return format.format(-Math.round(elapsed / DAY), 'day');
  return new Intl.DateTimeFormat(language, { dateStyle: 'medium' }).format(date);
}

function NotificationRow({ item, onRead }: { item: NotificationDto; onRead: (id: string) => void }) {
  const { t, i18n } = useTranslation();
  return (
    <li>
      <button
        type="button"
        onClick={() => onRead(item.id)}
        className={`flex w-full items-start gap-3 px-4 py-3 text-start transition hover:bg-[#f8f3fb] focus-visible:bg-[#f8f3fb] focus-visible:outline-none ${item.isRead ? '' : 'bg-[#fbf6fd]'}`}
      >
        <span
          aria-hidden="true"
          className={`mt-1.5 size-2 shrink-0 rounded-full ${item.isRead ? 'bg-transparent' : 'bg-[#5a198f]'}`}
        />
        <span className="min-w-0 flex-1">
          <span className={`block text-sm leading-5 text-[#111827] ${item.isRead ? 'font-medium' : 'font-semibold'}`}>
            <bdi>{item.title}</bdi>
          </span>
          {item.body && (
            <span className="mt-0.5 line-clamp-2 block text-xs leading-[18px] text-[#4b5563]">
              <bdi>{item.body}</bdi>
            </span>
          )}
          <span className="mt-1 block text-[11px] leading-4 text-[#6b7280]">
            <time dateTime={item.createdAt}>{relativeTime(item.createdAt, i18n.language)}</time>
            {!item.isRead && <span className="sr-only"> · {t('notifications.unread')}</span>}
          </span>
        </span>
      </button>
    </li>
  );
}

function PanelMessage({ icon, title, children }: { icon: ReactNode; title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-10 text-center">
      <span aria-hidden="true" className="flex size-11 items-center justify-center rounded-full bg-[#f5eaf9] text-[#5a198f]">
        {icon}
      </span>
      <p className="mt-3 text-sm font-semibold text-[#111827]">{title}</p>
      {children}
    </div>
  );
}

const TEXT_ACTION =
  'rounded-md px-2 py-1 text-xs font-semibold text-[#5a198f] hover:bg-[#f5eaf9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5a198f] disabled:cursor-default disabled:text-[#9ca3af] disabled:hover:bg-transparent';

type NotificationsMenuProps = {
  // Classes of the round bell button, so each top bar keeps its own Figma surface.
  buttonClassName: string;
  icon: ReactNode;
};

export function NotificationsMenu({ buttonClassName, icon }: NotificationsMenuProps) {
  const { t } = useTranslation();
  const notifications = useNotifications();
  const { unreadCount, items, isSignedIn, loadFirstPage } = notifications;
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

  const toggle = () => {
    const opening = !isOpen;
    setIsOpen(opening);
    if (opening) void loadFirstPage();
  };

  const badge = unreadCount > MAX_BADGE ? `${MAX_BADGE}+` : String(unreadCount);
  const buttonLabel = unreadCount > 0
    ? t('notifications.buttonWithCount', { count: unreadCount })
    : t('notifications.title');

  const renderBody = () => {
    if (!isSignedIn) {
      return <PanelMessage icon={<BellOff size={20} />} title={t('notifications.signedOut')} />;
    }
    if (notifications.isLoading && items.length === 0) {
      return <PanelMessage icon={<Loader2 size={20} className="animate-spin" />} title={t('notifications.loading')} />;
    }
    if (notifications.errorKey && items.length === 0) {
      return (
        <PanelMessage icon={<AlertCircle size={20} />} title={t('notifications.loadError')}>
          <p className="mt-1 text-xs text-[#4b5563]">{t(notifications.errorKey)}</p>
          <button type="button" onClick={() => void loadFirstPage()} className={`${TEXT_ACTION} mt-3`}>
            {t('notifications.retry')}
          </button>
        </PanelMessage>
      );
    }
    if (items.length === 0) {
      return (
        <PanelMessage icon={<BellOff size={20} />} title={t('notifications.emptyTitle')}>
          <p className="mt-1 text-xs text-[#4b5563]">{t('notifications.emptyBody')}</p>
        </PanelMessage>
      );
    }
    return (
      <>
        <ul className="max-h-[min(420px,60vh)] divide-y divide-[#f1eaf4] overflow-y-auto">
          {items.map((item) => (
            <NotificationRow key={item.id} item={item} onRead={(id) => void notifications.markRead(id)} />
          ))}
        </ul>
        {notifications.hasMore && (
          <div className="border-t border-[#f1eaf4] px-4 py-2 text-center">
            <button
              type="button"
              disabled={notifications.isLoadingMore}
              onClick={() => void notifications.loadMore()}
              className={TEXT_ACTION}
            >
              {t(notifications.isLoadingMore ? 'notifications.loadingMore' : 'notifications.loadMore')}
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <div ref={container} className="relative">
      <button
        ref={button}
        type="button"
        aria-label={buttonLabel}
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        onClick={toggle}
        className={`relative ${buttonClassName}`}
      >
        {icon}
        {unreadCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute -end-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-[#5a198f] px-1 text-[10px] font-bold leading-none text-white"
          >
            {badge}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          id={panelId}
          role="dialog"
          aria-label={t('notifications.title')}
          className="fixed inset-x-4 top-20 z-50 overflow-hidden rounded-[16px] border border-[#e9dcf8] bg-white shadow-[0_16px_40px_rgba(59,4,84,0.16)] sm:absolute sm:inset-x-auto sm:end-0 sm:top-full sm:mt-3 sm:w-[380px]"
        >
          <div className="flex items-center justify-between gap-3 border-b border-[#f1eaf4] px-4 py-3">
            <p className="text-sm font-semibold text-[#111827]">
              {t('notifications.title')}
              {unreadCount > 0 && (
                <span className="ms-2 rounded-full bg-[#f5eaf9] px-2 py-0.5 text-[11px] font-bold text-[#5a198f]">
                  {t('notifications.unreadCount', { count: unreadCount })}
                </span>
              )}
            </p>
            {isSignedIn && (
              <button
                type="button"
                disabled={unreadCount === 0 && items.every((item) => item.isRead)}
                onClick={() => void notifications.markAllRead()}
                className={`${TEXT_ACTION} inline-flex items-center gap-1`}
              >
                <CheckCheck aria-hidden="true" size={14} />
                {t('notifications.markAllRead')}
              </button>
            )}
          </div>
          {notifications.actionErrorKey && (
            <p role="alert" className="flex items-center gap-2 border-b border-[#fde2e2] bg-[#fff1f2] px-4 py-2 text-xs text-[#be123c]">
              <AlertCircle aria-hidden="true" size={14} />
              {t(notifications.actionErrorKey)}
            </p>
          )}
          {renderBody()}
        </div>
      )}
    </div>
  );
}
