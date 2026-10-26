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

/**
 * Checks whether the user's required data and profile/onboarding are complete.
 * A user is complete if:
 * 1. isOnboardingComplete is explicitly true, OR
 * 2. missingOnboardingSteps is empty and required profile fields (fullName and dateOfBirth) are provided.
 */
export function isUserDataComplete(user: MeDto | null): boolean {
  if (!user) return false;
  if (user.isOnboardingComplete === true) return true;
  if (user.isOnboardingComplete === false) return false;
  if (user.missingOnboardingSteps && user.missingOnboardingSteps.length > 0) return false;
  return Boolean(user.fullName?.trim() && user.dateOfBirth);
}

/**
 * Determines where to redirect the user after sign-in:
 * - If user data is NOT complete: redirect to /onboarding to complete it first.
 * - If user data IS complete: redirect to /dashboard (or the specific valid protected destination requested).
 */
export function postSignInPath(user: MeDto | null, requestedPath?: unknown): string {
  if (!isUserDataComplete(user)) {
    return ROUTES.onboarding;
  }

  const safe = safeRedirectPath(requestedPath);
  if (
    safe &&
    safe !== ROUTES.home &&
    !safe.startsWith('/auth') &&
    safe !== ROUTES.onboarding
  ) {
    return safe;
  }

  return ROUTES.dashboard;
}
