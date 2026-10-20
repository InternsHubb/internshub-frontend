/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Backend origin, e.g. https://internshub.runasp.net. Optional: see src/lib/api/client.ts.
  readonly VITE_API_BASE_URL?: string;
  // Public OAuth client ID for Google Identity Services. Not a secret.
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  // Public Azure app (client) ID and tenant for Microsoft sign-in. Not secrets.
  readonly VITE_MICROSOFT_CLIENT_ID?: string;
  readonly VITE_MICROSOFT_TENANT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
