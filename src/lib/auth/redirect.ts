import { ROUTES } from '@/constants/routes';
import type { MeDto } from '@/lib/api/types';

// Location state set by RequireAuth so sign-in can return the user to the page they asked for.
export type RedirectState = {
  from?: string;
};

// Only same-app paths are honoured, so a crafted link cannot redirect off-site after sign-in.
export function safeRedirectPath(value: unknown): string | null {
  // Browsers read "\" as "/", so "/\evil.com" would be protocol-relative too.
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') && !value.includes('\\')
    ? value
    : null;
}

export function redirectFromState(state: unknown): string | null {
  return safeRedirectPath((state as RedirectState | null)?.from);
}

export function postSignInPath(user: MeDto | null): string {
  return user?.isOnboardingComplete ? ROUTES.home : ROUTES.onboarding;
}
