import { useAuth } from '@/hooks/useAuth';

// Onboarding navbar. `brand` is the InternsHub header (Figma "Step 07 Device Check", 22:20176);
// `profile` is the interview header (Figma "Top Nav", 24:454) with the signed-in user's avatar,
// name and email. Figma's bell and Dark toggle are left out: there is no notifications screen or
// dark theme behind them yet.

type OnboardingHeaderProps = { variant: 'brand' | 'profile' };

function BrandMark() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-[38px] h-[38px] bg-gradient-to-br from-[#5C1D87] to-[#3A0353] shadow-[0_8px_18px_rgba(58,3,83,0.2)] rounded-[13px_13px_13px_4px] flex items-center justify-center relative">
        <span className="text-white font-bold text-sm tracking-[-1.12px]">ih</span>
      </div>
      <span className="font-bold text-xl text-[#111827]">Interns<span className="text-[#4C0585]">Hub</span></span>
      <span className="bg-[#F7F0FB] text-[#5C1D87] text-[10px] font-bold px-2.5 py-1 rounded-full tracking-[1.6px]">EDTECH</span>
    </div>
  );
}

// Two letters from the first and last word of the name, or from the parts of the email's local part.
function initialsOf(text: string, isEmail: boolean): string {
  const source = isEmail ? text.split('@')[0] : text;
  const parts = source.split(isEmail ? /[._+-]+/ : /\s+/).filter(Boolean);
  const first = Array.from(parts[0] ?? '')[0] ?? '';
  const last = parts.length > 1 ? (Array.from(parts[parts.length - 1])[0] ?? '') : '';
  return `${first}${last}`.toLocaleUpperCase();
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
  if (variant === 'profile') {
    return (
      <header className="flex h-[80px] items-center justify-between gap-6 px-4 md:px-6">
        <BrandMark />
        <UserProfile />
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-4 px-4 md:px-[72px] h-[72px] bg-white/82 border-b border-[#3A0353]/10 shadow-[0_1px_0_rgba(58,3,83,0.04)] backdrop-blur-md">
      <BrandMark />
      <div className="flex items-center gap-6">
        <span className="hidden sm:inline text-xs text-[#6B7280]">Demo onboarding</span>
        <button className="text-[#5C1D87] font-bold text-[13px] hover:underline">Need help?</button>
      </div>
    </header>
  );
}
