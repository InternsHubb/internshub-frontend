import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import type { AuthContextValue, AuthStatus, AuthUser, UserRole } from './types';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Application-wide authentication state provider.
 *
 * Currently runs in backend-disconnected mode (anonymous, no fake authentication).
 * When the new backend is ready, connect session restoration and `/me` loading
 * via `src/backend/` without changing consumer components.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [status, setStatus] = useState<AuthStatus>('anonymous');
  const [user, setUser] = useState<AuthUser | null>(null);

  const reloadUser = useCallback(async (): Promise<AuthUser | null> => {
    // Future backend integration point: fetch current authenticated user profile.
    return null;
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    setStatus('anonymous');
  }, []);

  const hasRole = useCallback(
    (role: UserRole): boolean => Boolean(user?.roles.includes(role)),
    [user]
  );

  const hasAnyRole = useCallback(
    (roles: ReadonlyArray<UserRole>): boolean => {
      if (!user) return false;
      return roles.some((role) => user.roles.includes(role));
    },
    [user]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      isAuthenticated: status === 'authenticated' && user !== null,
      hasRole,
      hasAnyRole,
      reloadUser,
      signOut,
    }),
    [status, user, hasRole, hasAnyRole, reloadUser, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
