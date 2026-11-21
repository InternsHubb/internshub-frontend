import { isAnyBackendTransportActive } from '@/backend';

/**
 * Determines whether local UI-development auth bypass is enabled.
 *
 * Security invariants:
 * 1. Always `false` in production builds (`import.meta.env.DEV` is statically
 *    replaced with `false` by Vite and dead-code-eliminated from production bundles).
 * 2. Requires explicit opt-in via `VITE_DEV_BYPASS_AUTH=true` in local `.env.local`.
 *    Missing, empty, or any other value disables the bypass.
 * 3. Automatically disabled whenever a backend URL (`VITE_API_BASE_URL`) or a local
 *    dev API proxy (`API_PROXY_TARGET`) is configured, preventing silent auth bypass
 *    during local proxy-based backend testing.
 */
export function isDevAuthBypassEnabled(): boolean {
  if (!import.meta.env.DEV) {
    return false;
  }

  if (isAnyBackendTransportActive()) {
    return false;
  }

  return import.meta.env.VITE_DEV_BYPASS_AUTH === 'true';
}
