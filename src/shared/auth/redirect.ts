import { ROUTES } from '@/app/routes';
import type { AuthUser } from './types';

export type RedirectState = {
  from?: string;
};

/** Only allow internal same-app paths to prevent open-redirect vulnerabilities. */
export function safeRedirectPath(value: unknown): string | null {
  return typeof value === 'string' &&
    value.startsWith('/') &&
    !value.startsWith('//') &&
    !value.includes('\\')
    ? value
    : null;
}

export function redirectFromState(state: unknown): string | null {
  return safeRedirectPath((state as RedirectState | null)?.from);
}

export function isUserDataComplete(user: AuthUser | null): boolean {
  if (!user) return false;
  if (user.isOnboardingComplete === true) return true;
  if (user.isOnboardingComplete === false) return false;
  if (user.missingOnboardingSteps && user.missingOnboardingSteps.length > 0) return false;
  return Boolean(user.fullName?.trim() && user.dateOfBirth);
}

export function postSignInPath(user: AuthUser | null, requestedPath?: unknown): string {
  if (!isUserDataComplete(user)) {
    return ROUTES.onboarding;
  }

  const safe = safeRedirectPath(requestedPath);
  if (
    safe &&
    safe !== ROUTES.home &&
    !safe.startsWith(ROUTES.login) &&
    safe !== ROUTES.onboarding
  ) {
    return safe;
  }

  return ROUTES.dashboard;
}
