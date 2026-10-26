import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { signInWithMicrosoft } from '@/lib/api/auth';
import { externalSignInErrorKey } from '@/lib/auth/errorMessages';
import { MicrosoftSignInError, readMicrosoftCallback } from '@/lib/auth/microsoftIdentity';
import { postSignInPath, safeRedirectPath } from '@/lib/auth/redirect';
import type { LoginLocationState } from './Login';

function errorKeyFor(error: unknown): string {
  if (error instanceof MicrosoftSignInError) {
    return error.reason === 'dismissed' ? 'auth.login.errors.microsoftDismissed' : 'auth.login.errors.microsoftFailed';
  }
  return externalSignInErrorKey(error, 'microsoft');
}

// Landing page for the Microsoft redirect: checks state/nonce, exchanges the ID token with the
// backend, then continues like a password sign-in. Failures go back to Login with a message.
export default function MicrosoftCallback() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { reloadUser } = useAuth();
  // The fragment and stored state are single use; StrictMode must not process them twice.
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const fragment = window.location.hash;
    // Drop the token from the address bar and history straight away.
    window.history.replaceState(null, '', window.location.pathname);

    void (async () => {
      try {
        const { idToken, from } = readMicrosoftCallback(fragment);
        await signInWithMicrosoft(idToken);
        const user = await reloadUser();
        navigate(postSignInPath(user, safeRedirectPath(from)), { replace: true });
      } catch (error) {
        const state: LoginLocationState = { errorKey: errorKeyFor(error) };
        navigate(ROUTES.login, { replace: true, state });
      }
    })();
  }, [navigate, reloadUser]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white" role="status">
      <div className="size-8 animate-spin rounded-full border-3 border-purple-600 border-t-transparent" />
      <p className="text-sm text-muted">{t('auth.login.microsoftSigningIn')}</p>
    </div>
  );
}
