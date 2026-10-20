import type { AccessTokenResponse } from '@/lib/api/types';

// Bearer tokens from /api/auth/login and /api/auth/refresh. The backend can also issue cookies,
// but the API lives on a different site from the frontend, so browsers would treat them as
// third-party cookies; bearer tokens work everywhere.
export type AuthSession = {
  // Identifies one sign-in. Created at sign-in and kept when the tokens are refreshed (the backend
  // rotates the refresh token), so a refresh is not mistaken for a different account.
  sessionId: string;
  accessToken: string;
  refreshToken: string;
  // Epoch milliseconds after which the access token is no longer accepted.
  expiresAt: number;
};

type SessionListener = (session: AuthSession | null) => void;

const STORAGE_KEY = 'internshub_auth_session';
const MS_PER_SECOND = 1000;
// Refresh slightly early so a request never leaves with a token that expires in flight.
const EXPIRY_MARGIN_MS = 30 * MS_PER_SECOND;

const listeners = new Set<SessionListener>();

type StoredSession = Omit<AuthSession, 'sessionId'> & { sessionId?: unknown };

function isStoredSession(value: unknown): value is StoredSession {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.accessToken === 'string' &&
    typeof candidate.refreshToken === 'string' &&
    typeof candidate.expiresAt === 'number'
  );
}

function newSessionId(): string {
  return typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function readStorage(): AuthSession | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isStoredSession(parsed)) return null;
    // Sessions saved before sessionId existed are identified by their refresh token.
    const sessionId = typeof parsed.sessionId === 'string' ? parsed.sessionId : parsed.refreshToken;
    return { ...parsed, sessionId };
  } catch {
    // Blocked storage or a corrupted entry: behave as signed out.
    return null;
  }
}

let current: AuthSession | null = readStorage();

function notify(): void {
  listeners.forEach((listener) => listener(current));
}

export function getSession(): AuthSession | null {
  return current;
}

export function isSessionExpired(session: AuthSession): boolean {
  return Date.now() >= session.expiresAt - EXPIRY_MARGIN_MS;
}

// Pass `refreshed` when the tokens came from refreshing that session, so it keeps its sessionId.
export function saveSession(tokens: AccessTokenResponse, refreshed?: AuthSession): AuthSession {
  const expiresInSeconds = Number(tokens.expiresIn);
  const session: AuthSession = {
    sessionId: refreshed?.sessionId ?? newSessionId(),
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    expiresAt: Date.now() + (Number.isFinite(expiresInSeconds) ? expiresInSeconds : 0) * MS_PER_SECOND,
  };
  current = session;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Storage unavailable: the session still lives for this tab.
  }
  notify();
  return session;
}

export function clearSession(): void {
  current = null;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing stored to remove.
  }
  notify();
}

export function subscribeToSession(listener: SessionListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// Keep tabs in sync: signing in or out in one tab updates the others.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY) return;
    current = readStorage();
    notify();
  });
}
