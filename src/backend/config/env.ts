/**
 * Backend runtime configuration.
 *
 * Leave VITE_API_BASE_URL unset until the new backend service is available.
 * Never store secrets, private keys, or credentials in VITE_* variables.
 */
export const BACKEND_CONFIG = {
  baseUrl: (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, ''),
  timeoutMs: 15_000,
} as const;

export function isBackendConfigured(): boolean {
  return BACKEND_CONFIG.baseUrl.length > 0;
}

/**
 * True when `API_PROXY_TARGET` was provided to Vite in local development
 * (injected via `define.__API_PROXY_ACTIVE__` in `vite.config.ts`).
 */
export function isApiProxyConfigured(): boolean {
  return typeof __API_PROXY_ACTIVE__ !== 'undefined' && __API_PROXY_ACTIVE__;
}

/**
 * True when any backend transport is active (direct `VITE_API_BASE_URL` or local dev proxy).
 */
export function isAnyBackendTransportActive(): boolean {
  return isBackendConfigured() || isApiProxyConfigured();
}
