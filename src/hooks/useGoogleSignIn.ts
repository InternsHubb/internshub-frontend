import { useState } from 'react';

import { signInWithGoogle } from '@/lib/api/auth';
import { externalSignInErrorKey } from '@/lib/auth/errorMessages';
import { GoogleSignInError, requestGoogleIdToken } from '@/lib/auth/googleIdentity';

type UseGoogleSignInOptions = {
  // Receives a translation key for the failure.
  onError: (errorKey: string) => void;
  // Runs after the session is stored; the caller decides where to go next.
  onSignedIn: () => Promise<void>;
};

// Google sign-in shared by Login and Register: the same account is signed in, or created by the
// backend, either way.
export function useGoogleSignIn({ onError, onSignedIn }: UseGoogleSignInOptions) {
  const [isBusy, setIsBusy] = useState(false);

  const signIn = async () => {
    setIsBusy(true);
    try {
      const idToken = await requestGoogleIdToken();
      await signInWithGoogle(idToken);
    } catch (error) {
      setIsBusy(false);
      if (error instanceof GoogleSignInError) {
        onError(error.reason === 'unavailable' ? 'auth.login.errors.googleUnavailable' : 'auth.login.errors.googleFailed');
      } else {
        onError(externalSignInErrorKey(error, 'google'));
      }
      return;
    }
    await onSignedIn();
  };

  return { isBusy, signIn };
}
