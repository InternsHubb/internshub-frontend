// Obtains a Google ID token with Google Identity Services (GIS) for POST /api/auth/external/google.
// Needs the public OAuth client ID in VITE_GOOGLE_CLIENT_ID; that client must list this site's
// origin as an authorized JavaScript origin in Google Cloud Console. No client secret is involved.

type CredentialResponse = { credential?: string };

type PromptNotification = {
  isNotDisplayed?: () => boolean;
  isSkippedMoment?: () => boolean;
  isDismissedMoment?: () => boolean;
  getDismissedReason?: () => string;
};

type GoogleIdApi = {
  initialize: (config: {
    client_id: string;
    callback: (response: CredentialResponse) => void;
    cancel_on_tap_outside?: boolean;
    use_fedcm_for_prompt?: boolean;
  }) => void;
  prompt: (listener?: (notification: PromptNotification) => void) => void;
};

declare global {
  interface Window {
    google?: { accounts?: { id?: GoogleIdApi } };
  }
}

type GoogleSignInFailure = 'unavailable' | 'dismissed';

export class GoogleSignInError extends Error {
  readonly reason: GoogleSignInFailure;

  constructor(reason: GoogleSignInFailure) {
    super(reason === 'unavailable' ? 'Google sign-in is not configured' : 'Google sign-in was not completed');
    this.name = 'GoogleSignInError';
    this.reason = reason;
  }
}

const GIS_SCRIPT_URL = 'https://accounts.google.com/gsi/client';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';
const GOOGLE_PROMPT_TIMEOUT_MS = 2 * 60 * 1000;

export const isGoogleSignInConfigured = GOOGLE_CLIENT_ID.length > 0;

let scriptPromise: Promise<GoogleIdApi> | null = null;
let pending: { resolve: (token: string) => void; reject: (error: Error) => void } | null = null;

function settle(token: string | null): void {
  if (!pending) return;
  if (token) pending.resolve(token);
  else pending.reject(new GoogleSignInError('dismissed'));
  pending = null;
}

function loadGoogleIdentity(): Promise<GoogleIdApi> {
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<GoogleIdApi>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = GIS_SCRIPT_URL;
    script.async = true;
    script.onload = () => {
      const api = window.google?.accounts?.id;
      if (!api) {
        scriptPromise = null;
        reject(new GoogleSignInError('unavailable'));
        return;
      }
      api.initialize({
        client_id: GOOGLE_CLIENT_ID,
        cancel_on_tap_outside: true,
        use_fedcm_for_prompt: true,
        callback: (response) => settle(response.credential ?? null),
      });
      resolve(api);
    };
    script.onerror = () => {
      scriptPromise = null;
      reject(new GoogleSignInError('unavailable'));
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
}

// Resolves with the ID token, or rejects when GIS is unavailable or the user closes the prompt.
export async function requestGoogleIdToken(): Promise<string> {
  if (!isGoogleSignInConfigured) throw new GoogleSignInError('unavailable');
  const api = await loadGoogleIdentity();

  return new Promise<string>((resolve, reject) => {
    settle(null);
    // Under FedCM some prompt outcomes (cooldown after a dismissal, browser-blocked prompt) may not
    // be reported, so a prompt that never answers is treated as dismissed instead of hanging.
    const timeout = window.setTimeout(() => settle(null), GOOGLE_PROMPT_TIMEOUT_MS);
    const finish = <T,>(fn: (value: T) => void) => (value: T) => {
      window.clearTimeout(timeout);
      fn(value);
    };
    pending = { resolve: finish(resolve), reject: finish(reject) };
    api.prompt((notification) => {
      // A dismissal with reason "credential_returned" is the success path; the callback handles it.
      if (notification.getDismissedReason?.() === 'credential_returned') return;
      const isClosed =
        notification.isNotDisplayed?.() ||
        notification.isSkippedMoment?.() ||
        notification.isDismissedMoment?.();
      if (isClosed) settle(null);
    });
  });
}
