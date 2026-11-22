import type { ReactNode } from 'react';
import { AuthProvider } from '@/shared/auth';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Centralized application root providers.
 * Add global cross-cutting providers here (e.g., future query client or toast provider).
 */
export function AppProviders({ children }: AppProvidersProps) {
  return <AuthProvider>{children}</AuthProvider>;
}

export default AppProviders;
