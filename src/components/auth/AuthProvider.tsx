import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';

import { fetchCurrentUser, logout } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';
import type { MeDto } from '@/lib/api/types';
import { AuthContext, type AuthContextValue, type AuthStatus } from '@/lib/auth/AuthContext';
import { getSession, subscribeToSession } from '@/lib/auth/session';

type AuthProviderProps = {
  children: ReactNode;
};

// The user record is tied to the sign-in it was loaded for, so a new sign-in never shows the
// previous account's profile, while a token refresh (same sessionId) keeps it.
type LoadedUser = {
  sessionId: string;
  user: MeDto | null;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const session = useSyncExternalStore(subscribeToSession, getSession, getSession);
  const [loaded, setLoaded] = useState<LoadedUser | null>(null);
  const sessionId = session?.sessionId ?? null;

  // One /api/me request per session at a time: the sign-in page and the session effect both ask.
  const inFlight = useRef<{ sessionId: string; promise: Promise<MeDto | null> } | null>(null);

  const loadUser = useCallback((): Promise<MeDto | null> => {
    const id = getSession()?.sessionId;
    if (!id) return Promise.resolve(null);
    if (inFlight.current?.sessionId === id) return inFlight.current.promise;

    const promise = (async () => {
      try {
        const user = await fetchCurrentUser();
        if (getSession()?.sessionId === id) setLoaded({ sessionId: id, user });
        return user;
      } catch (error) {
        // 401 has already cleared the session in the API client. Other failures keep the session:
        // the user is signed in even if the profile could not be read right now.
        if (!(error instanceof ApiError) || error.status !== 401) {
          setLoaded({ sessionId: id, user: null });
        }
        return null;
      } finally {
        if (inFlight.current?.sessionId === id) inFlight.current = null;
      }
    })();
    inFlight.current = { sessionId: id, promise };
    return promise;
  }, []);

  useEffect(() => {
    if (sessionId) void loadUser();
  }, [sessionId, loadUser]);

  const isLoaded = sessionId !== null && loaded?.sessionId === sessionId;
  let status: AuthStatus = 'anonymous';
  if (sessionId) status = isLoaded ? 'authenticated' : 'loading';

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user: isLoaded ? (loaded?.user ?? null) : null,
      reloadUser: loadUser,
      signOut: logout,
    }),
    [status, isLoaded, loaded, loadUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
