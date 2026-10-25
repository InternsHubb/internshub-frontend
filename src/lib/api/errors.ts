import { ApiError } from './client';

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
    return 'api.errors.forbidden';
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
