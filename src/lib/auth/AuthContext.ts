import { createContext } from 'react';

import type { MeDto } from '@/lib/api/types';

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous';

export type AuthContextValue = {
  status: AuthStatus;
  // Null while loading, when signed out, or when /api/me could not be read.
  user: MeDto | null;
  // Reloads /api/me after a sign-in and returns the profile, or null when it is unavailable.
  reloadUser: () => Promise<MeDto | null>;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
