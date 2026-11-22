import type { ApiErrorPayload } from '../types/common';

export class BackendError extends Error {
  readonly status: number;
  readonly payload: ApiErrorPayload | null;

  constructor(status: number, payload: ApiErrorPayload | null, message?: string) {
    super(message ?? payload?.detail ?? payload?.title ?? `Request failed with status ${status}`);
    this.name = 'BackendError';
    this.status = status;
    this.payload = payload;
  }

  get validationErrors(): Record<string, string[]> | null {
    return this.payload?.errors ?? null;
  }
}

/**
 * Thrown by feature service boundaries while the new backend is not yet connected.
 * Callers should handle this gracefully and present an honest UI message instead of faking success.
 */
export class BackendNotConnectedError extends BackendError {
  readonly feature: string;
  readonly operation: string;

  constructor(feature: string, operation: string) {
    super(
      503,
      {
        code: 'BACKEND_NOT_CONNECTED',
        title: 'Backend Not Connected',
        detail: `${feature}.${operation} requires future backend integration.`,
      },
      `[${feature}] "${operation}" is not connected to a backend service yet.`,
    );
    this.name = 'BackendNotConnectedError';
    this.feature = feature;
    this.operation = operation;
  }
}

/**
 * Thrown when an HTTP request exceeds its configured timeout (`BACKEND_CONFIG.timeoutMs` or `config.timeoutMs`).
 */
export class BackendTimeoutError extends BackendError {
  readonly timeoutMs: number;

  constructor(timeoutMs: number) {
    super(
      408,
      {
        code: 'REQUEST_TIMEOUT',
        title: 'Request Timeout',
        detail: `Request timed out after ${timeoutMs}ms.`,
      },
      `Request timed out after ${timeoutMs}ms.`,
    );
    this.name = 'BackendTimeoutError';
    this.timeoutMs = timeoutMs;
  }
}

export function isBackendNotConnectedError(error: unknown): error is BackendNotConnectedError {
  return error instanceof BackendNotConnectedError;
}

export function isBackendTimeoutError(error: unknown): error is BackendTimeoutError {
  return error instanceof BackendTimeoutError;
}

export function getBackendErrorKey(error: unknown): string {
  if (error instanceof BackendNotConnectedError) {
    return 'common.errors.backendNotConnected';
  }
  if (error instanceof BackendTimeoutError) {
    return 'common.errors.timeout';
  }
  if (!(error instanceof BackendError)) {
    return 'common.errors.unknown';
  }
  if (error.status === 0) return 'common.errors.network';
  if (error.status === 400) return 'common.errors.badRequest';
  if (error.status === 401) return 'common.errors.unauthorized';
  if (error.status === 403) return 'common.errors.forbidden';
  if (error.status === 404) return 'common.errors.notFound';
  if (error.status === 408) return 'common.errors.timeout';
  if (error.status === 409) return 'common.errors.conflict';
  if (error.status >= 500) return 'common.errors.server';
  return 'common.errors.unknown';
}
