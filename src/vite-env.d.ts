/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base origin for the future backend API (leave unset until backend is ready). */
  readonly VITE_API_BASE_URL?: string;
  /** Optional environment label (development, staging, production). */
  readonly VITE_APP_ENV?: string;
  /**
   * Local development only: set to "true" to explicitly opt in to UI-preview auth bypass
   * when neither VITE_API_BASE_URL nor API_PROXY_TARGET is configured.
   * Disabled by default and completely stripped from production builds.
   */
  readonly VITE_DEV_BYPASS_AUTH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/** Injected at dev/build time by vite.config.ts when API_PROXY_TARGET is configured. */
declare const __API_PROXY_ACTIVE__: boolean;
