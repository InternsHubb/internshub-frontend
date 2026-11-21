import { Link } from 'react-router-dom';
import { ROUTES } from '@/app/routes';
import { useAuth } from '@/shared/auth';
import { isUserDataComplete } from '@/shared/auth';
import { initialsOf } from '@/shared/utils/initials';

// Onboarding navbar. `brand` is the InternsHub header (Figma "Step 07 Device Check", 22:20176);
// `profile` is the interview header (Figma "Top Nav", 24:454) with the signed-in user's avatar,
// name and email. Figma's bell and Dark toggle are left out: there is no notifications screen or
// dark theme behind them yet.

type OnboardingHeaderProps = { variant: 'brand' | 'profile' };

function BrandMark({ href }: { href: string }) {
  return (
    <Link to={href} className="flex items-center gap-2.5 transition hover:opacity-95">
      <div className="w-[38px] h-[38px] bg-gradient-to-br from-[#5C1D87] to-[#3A0353] shadow-[0_8px_18px_rgba(58,3,83,0.2)] rounded-[13px_13px_13px_4px] flex items-center justify-center relative">
        <span className="text-white font-bold text-sm tracking-[-1.12px]">ih</span>
      </div>
      <span className="font-bold text-xl text-[#111827]">Interns<span className="text-[#4C0585]">Hub</span></span>
      <span className="bg-[#F7F0FB] text-[#5C1D87] text-[10px] font-bold px-2.5 py-1 rounded-full tracking-[1.6px]">EDTECH</span>
    </Link>
  );
}

function UserProfile() {
  const { user } = useAuth();
  if (!user) return null;
  const fullName = user.fullName?.trim() ?? '';
  const email = user.email?.trim() ?? '';
  // Registration doesn't send a name, so fullName is often empty: the email stands in for it.
  const primary = fullName || email;
  if (!primary) return null;
  const secondary = fullName ? email : '';

  return (
    <div className="flex min-w-0 items-center gap-3">
      <span
        aria-hidden="true"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#925DA8_0%,#C592FB_100%)] text-base font-bold leading-4 text-white"
      >
        {initialsOf(primary, !fullName)}
      </span>
      <span className="sr-only sm:hidden">{primary}</span>
      <div className="hidden min-w-0 max-w-[260px] flex-col gap-0.5 sm:flex">
        <p className="truncate text-sm font-semibold leading-5 text-[#111827]"><bdi>{primary}</bdi></p>
        {secondary && <p className="truncate text-xs leading-4 text-[#334155]"><bdi>{secondary}</bdi></p>}
      </div>
    </div>
  );
}

export function OnboardingHeader({ variant }: OnboardingHeaderProps) {
  const { user } = useAuth();
  const isComplete = isUserDataComplete(user);
  const homeTarget = isComplete ? ROUTES.dashboard : ROUTES.home;

  if (variant === 'profile') {
    return (
      <header className="flex h-[80px] items-center justify-between gap-6 px-4 md:px-6">
        <BrandMark href={homeTarget} />
        <div className="flex items-center gap-4">
          {isComplete && (
            <Link
              to={ROUTES.dashboard}
              className="px-4 py-2 bg-[#5C1D87] text-white font-bold text-xs rounded-[10px] shadow hover:bg-[#4C0585] transition flex items-center gap-1.5"
            >
              Dashboard →
            </Link>
          )}
          <UserProfile />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-4 px-4 md:px-[72px] h-[72px] bg-white/82 border-b border-[#3A0353]/10 shadow-[0_1px_0_rgba(58,3,83,0.04)] backdrop-blur-md">
      <BrandMark href={homeTarget} />
      <div className="flex items-center gap-4 sm:gap-6">
        {isComplete && (
          <Link
            to={ROUTES.dashboard}
            className="px-4 py-2 bg-gradient-to-r from-[#4C0585] to-[#3A0353] text-white font-bold text-xs rounded-[10px] shadow hover:opacity-95 transition flex items-center gap-1.5"
          >
            Dashboard →
          </Link>
        )}
        <span className="hidden sm:inline text-xs text-[#6B7280]">Demo onboarding</span>
        <button className="text-[#5C1D87] font-bold text-[13px] hover:underline">Need help?</button>
      </div>
    </header>
  );
}
