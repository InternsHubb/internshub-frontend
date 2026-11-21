import { useCallback, useState } from 'react';

export type SocialSignInOptions = {
  onError: (errorKey: string) => void;
  onSignedIn: () => void | Promise<void>;
};

export function useGoogleSignIn({ onError }: SocialSignInOptions) {
  const [isBusy] = useState(false);

  const signIn = useCallback(async () => {
    onError('auth.login.errors.googleUnavailable');
  }, [onError]);

  return { isBusy, signIn };
}

export type MicrosoftSignInErrorReason = 'unavailable' | 'dismissed' | 'failed';

export class MicrosoftSignInError extends Error {
  readonly reason: MicrosoftSignInErrorReason;

  constructor(reason: MicrosoftSignInErrorReason, message?: string) {
    super(message ?? `Microsoft sign-in ${reason}`);
    this.name = 'MicrosoftSignInError';
    this.reason = reason;
  }
}

export function startMicrosoftSignIn(_from?: string | null): never {
  throw new MicrosoftSignInError('unavailable', 'Microsoft OAuth backend integration is not configured yet.');
}

export function readMicrosoftCallback(_fragment: string): { idToken: string; from?: string } {
  throw new MicrosoftSignInError('unavailable', 'Microsoft OAuth backend integration is not configured yet.');
}
