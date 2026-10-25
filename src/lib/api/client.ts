import {
  clearSession,
  getSession,
  isSessionExpired,
  saveSession,
} from '@/lib/auth/session';
import type { AccessTokenResponse, ProblemDetails } from './types';

// Requests use same-origin /api/... URLs unless VITE_API_BASE_URL is set. The Vite dev-server proxy
// (vite.config.ts) forwards them locally and the /api rewrite in vercel.json forwards them on Vercel.
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '');

// status 0 means the request never got a response (offline, DNS, CORS, timeout).
export class ApiError extends Error {
  readonly status: number;
  readonly problem: ProblemDetails | null;

  constructor(status: number, problem: ProblemDetails | null, message?: string) {
    super(message ?? problem?.detail ?? problem?.title ?? `Request failed with status ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.problem = problem;
  }

  // Identity reports its failures as `errors: { DuplicateUserName: [...], PasswordTooShort: [...] }`.
  get errorCodes(): string[] {
    return Object.keys(this.problem?.errors ?? {});
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  // Attach the bearer token and refresh it when needed.
  auth?: boolean;
  signal?: AbortSignal;
};

async function readBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return undefined;
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('json')) return text;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return undefined;
  }
}

function toProblem(body: unknown): ProblemDetails | null {
  return typeof body === 'object' && body !== null ? (body as ProblemDetails) : null;
}

async function send(path: string, options: RequestOptions, accessToken?: string): Promise<Response> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (options.body !== undefined) headers['Content-Type'] = 'application/json';
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  try {
    return await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: options.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new ApiError(0, null, 'Network request failed');
  }
}

export function isAccessTokenResponse(value: unknown): value is AccessTokenResponse {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.accessToken === 'string' && typeof candidate.refreshToken === 'string';
}

let refreshInFlight: Promise<string | null> | null = null;

// Exchanges the refresh token for new tokens. Concurrent callers share one request; a rejected
// refresh token ends the session.
export function refreshAccessToken(): Promise<string | null> {
  if (refreshInFlight) return refreshInFlight;

  const session = getSession();
  if (!session) return Promise.resolve(null);

  refreshInFlight = (async () => {
    try {
      const response = await send('/api/auth/refresh', {
        method: 'POST',
        body: { refreshToken: session.refreshToken },
      });
      const body = await readBody(response);
      // Signed out (or into another account) while the refresh was in flight: drop the result.
      if (getSession()?.sessionId !== session.sessionId) return null;
      if (response.ok && isAccessTokenResponse(body)) {
        return saveSession(body, session).accessToken;
      }
      if (response.status === 401 || response.status === 400) clearSession();
      return null;
    } catch {
      // Offline: keep the session so the next attempt can retry.
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

async function validAccessToken(): Promise<string | undefined> {
  const session = getSession();
  if (!session) return undefined;
  if (!isSessionExpired(session)) return session.accessToken;
  return (await refreshAccessToken()) ?? undefined;
}

// A refresh that failed without the backend rejecting the session (offline, 5xx) keeps the
// session, so the request is reported as a network failure instead of being sent unauthenticated.
function refreshUnavailable(): ApiError {
  return new ApiError(0, null, 'Session refresh failed');
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  let accessToken: string | undefined;
  if (options.auth) {
    accessToken = await validAccessToken();
    if (!accessToken && getSession()) throw refreshUnavailable();
  }
  let response = await send(path, options, accessToken);

  // The access token can be revoked before its expiry time; try one refresh, then give up.
  if (response.status === 401 && options.auth && getSession()) {
    const token = await refreshAccessToken();
    if (token) {
      response = await send(path, options, token);
      if (response.status === 401) clearSession();
    } else if (getSession()) {
      throw refreshUnavailable();
    }
  }

  const body = await readBody(response);
  if (!response.ok) {
    throw new ApiError(response.status, toProblem(body));
  }
  return body as T;
}
