// Obtains a Microsoft identity platform ID token for POST /api/auth/external/microsoft, using the
// OpenID Connect implicit flow with a full-page redirect (response_type=id_token; no client secret).
//
// Azure app registration requirements (backend/Azure admin):
// - Platform "Single-page application" (or Web) with redirect URI <site origin>/auth/microsoft/callback
//   for every deployed origin and for local development.
// - "ID tokens" enabled under Authentication > Implicit grant and hybrid flows.
// - The backend must accept ID tokens whose audience is this client ID.

import { ROUTES } from '@/constants/routes';

type MicrosoftSignInFailure = 'unavailable' | 'dismissed' | 'failed';

export class MicrosoftSignInError extends Error {
  readonly reason: MicrosoftSignInFailure;

  constructor(reason: MicrosoftSignInFailure) {
    super(`Microsoft sign-in ${reason}`);
    this.name = 'MicrosoftSignInError';
    this.reason = reason;
  }
}

type PendingSignIn = {
  state: string;
  nonce: string;
  // Same-app path to return to after sign-in, if any.
  from: string | null;
};

const CLIENT_ID = import.meta.env.VITE_MICROSOFT_CLIENT_ID ?? '';
// "common" accepts work, school and personal Microsoft accounts.
const TENANT = import.meta.env.VITE_MICROSOFT_TENANT_ID || 'common';
const PENDING_KEY = 'internshub_ms_oidc';

export const isMicrosoftSignInConfigured = CLIENT_ID.length > 0;

function randomToken(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

// Reads the nonce claim without verifying the signature; the backend verifies the token itself.
function readNonce(idToken: string): string | null {
  try {
    const payload = idToken.split('.')[1] ?? '';
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const claims = JSON.parse(json) as { nonce?: unknown };
    return typeof claims.nonce === 'string' ? claims.nonce : null;
  } catch {
    return null;
  }
}

function takePendingSignIn(): PendingSignIn | null {
  try {
    const raw = window.sessionStorage.getItem(PENDING_KEY);
    window.sessionStorage.removeItem(PENDING_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PendingSignIn>;
    if (typeof parsed.state !== 'string' || typeof parsed.nonce !== 'string') return null;
    return { state: parsed.state, nonce: parsed.nonce, from: typeof parsed.from === 'string' ? parsed.from : null };
  } catch {
    return null;
  }
}

// Sends the browser to the Microsoft sign-in page. The user comes back on MICROSOFT_CALLBACK_PATH.
export function startMicrosoftSignIn(from: string | null): void {
  if (!isMicrosoftSignInConfigured) throw new MicrosoftSignInError('unavailable');

  const pending: PendingSignIn = { state: randomToken(), nonce: randomToken(), from };
  try {
    window.sessionStorage.setItem(PENDING_KEY, JSON.stringify(pending));
  } catch {
    // Without storage the state cannot be checked on return, so the sign-in cannot be trusted.
    throw new MicrosoftSignInError('failed');
  }

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'id_token',
    redirect_uri: `${window.location.origin}${ROUTES.microsoftCallback}`,
    response_mode: 'fragment',
    scope: 'openid profile email',
    state: pending.state,
    nonce: pending.nonce,
    prompt: 'select_account',
  });
  window.location.assign(
    `https://login.microsoftonline.com/${encodeURIComponent(TENANT)}/oauth2/v2.0/authorize?${params}`,
  );
}

export type MicrosoftCallbackResult = {
  idToken: string;
  from: string | null;
};

// Validates the redirect fragment against the stored state and nonce. Single use.
export function readMicrosoftCallback(fragment: string): MicrosoftCallbackResult {
  const pending = takePendingSignIn();
  const result = new URLSearchParams(fragment.replace(/^#/, ''));

  if (!pending || result.get('state') !== pending.state) throw new MicrosoftSignInError('failed');
  if (result.get('error') === 'access_denied') throw new MicrosoftSignInError('dismissed');

  const idToken = result.get('id_token');
  if (!idToken || readNonce(idToken) !== pending.nonce) throw new MicrosoftSignInError('failed');
  return { idToken, from: pending.from };
}
