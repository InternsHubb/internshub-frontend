import { useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LogOut, UserRound } from 'lucide-react';

import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { identityOf } from '@/lib/auth/identity';

// Signed-in user's avatar (initials) and name in the dashboard, mentorship and recruitment top
// bars. It opens a small menu with the name, email and "Sign out". While /api/me loads it shows
// a placeholder; if /api/me fails it shows a neutral "Your account" (never a sample person).

type NameBreakpoint = 'sm' | 'lg';

// Literal classes per breakpoint so Tailwind generates them.
const NAME_VISIBLE: Record<NameBreakpoint, string> = { sm: 'hidden sm:flex', lg: 'hidden lg:flex' };

type UserMenuProps = {
  // Size and shape of the avatar circle; each top bar keeps its Figma size.
  avatarClassName?: string;
  // From which breakpoint the name is shown next to the avatar.
  showNameFrom?: NameBreakpoint;
};

export function UserMenu({ avatarClassName = 'size-12', showNameFrom = 'lg' }: UserMenuProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { status, user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const menuId = useId();

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

  if (status === 'anonymous') return null;

  const isLoading = status === 'loading';
  const identity = identityOf(user);
  const primary = identity?.primary ?? (isLoading ? t('account.loading') : t('account.fallbackName'));

  const handleSignOut = () => {
    setIsOpen(false);
    signOut();
    navigate(ROUTES.home, { replace: true });
  };

  const avatar = (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#925DA8_0%,#C592FB_100%)] text-base font-bold leading-4 text-white ${avatarClassName} ${isLoading ? 'animate-pulse opacity-60' : ''}`}
    >
      {identity ? identity.initials : !isLoading && <UserRound className="size-5" />}
    </span>
  );

  return (
    <div ref={container} className="relative min-w-0">
      <button
        ref={button}
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label={t('account.menuLabel', { name: primary })}
        onClick={() => setIsOpen((open) => !open)}
        className="flex min-w-0 items-center gap-3 rounded-full text-start outline-none focus-visible:ring-2 focus-visible:ring-[#5a198f] focus-visible:ring-offset-2"
      >
        {avatar}
        <span className={`${NAME_VISIBLE[showNameFrom]} min-w-0 max-w-[220px] flex-col gap-0.5`}>
          {isLoading && !identity ? (
            <>
              <span className="h-3.5 w-28 animate-pulse rounded bg-[#e9dcf8]" />
              <span className="h-3 w-36 animate-pulse rounded bg-[#f1ecf7]" />
            </>
          ) : (
            <>
              <span className="truncate text-sm font-semibold leading-5 text-[#111827]"><bdi>{primary}</bdi></span>
              {identity?.secondary && (
                <span className="truncate text-xs leading-4 text-[#334155]"><bdi>{identity.secondary}</bdi></span>
              )}
            </>
          )}
        </span>
      </button>

      {isOpen && (
        <div
          id={menuId}
          className="absolute end-0 top-full z-50 mt-2 w-[min(260px,calc(100vw-2rem))] rounded-2xl border border-[#f1ecf7] bg-white p-2 shadow-[0_12px_32px_-12px_rgba(59,4,84,0.35)]"
        >
          <div className="px-3 py-2.5">
            <p className="truncate text-sm font-semibold text-[#111827]"><bdi>{primary}</bdi></p>
            {identity?.secondary && (
              <p className="mt-0.5 truncate text-xs text-[#64748b]"><bdi>{identity.secondary}</bdi></p>
            )}
          </div>
          <div className="my-1 h-px bg-[#f1ecf7]" />
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-start text-sm font-semibold text-rose-600 outline-none hover:bg-rose-50 focus-visible:bg-rose-50"
          >
            <LogOut aria-hidden="true" className="size-4 rtl:rotate-180" />
            {t('account.signOut')}
          </button>
        </div>
      )}
    </div>
  );
}
