import { ApiError } from './client';
import type { OnboardingStep } from './types';

// A 403 "Onboarding required" response lists the steps the backend still expects, e.g.
// { "missingSteps": ["AcceptPolicies"] } from POST /api/enrollments. Empty for any other error.
export function missingOnboardingSteps(error: unknown): OnboardingStep[] {
  if (!(error instanceof ApiError) || error.status !== 403) return [];
  const steps = error.problem?.missingSteps;
  return Array.isArray(steps) ? steps : [];
}

export function apiErrorKey(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return 'api.errors.unknown';
  }

  if (error.status === 0) {
    return 'api.errors.network';
  }

  if (error.status === 400) {
    if (error.problem?.errors && Object.keys(error.problem.errors).length > 0) {
      return 'api.errors.validation';
    }
    return 'api.errors.badRequest';
  }

  if (error.status === 401) {
    return 'api.errors.unauthorized';
  }

  if (error.status === 403) {
    return missingOnboardingSteps(error).length > 0 ? 'api.errors.onboardingRequired' : 'api.errors.forbidden';
  }

  if (error.status === 404) {
    return 'api.errors.notFound';
  }

  if (error.status === 409) {
    return 'api.errors.conflict';
  }

  if (error.status >= 500) {
    return 'api.errors.server';
  }

  return 'api.errors.server';
}

export function getValidationErrors(error: unknown): Record<string, string[]> | null {
  if (error instanceof ApiError && error.problem?.errors) {
    return error.problem.errors;
  }
  return null;
}
