import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiProxyTarget = env.API_PROXY_TARGET?.trim();

  return {
    plugins: [react(), tailwindcss()],
    define: {
      __API_PROXY_ACTIVE__: JSON.stringify(Boolean(apiProxyTarget)),
    },
    server: apiProxyTarget
      ? {
          proxy: {
            '/api': {
              target: apiProxyTarget,
              changeOrigin: true,
              secure: true,
            },
          },
        }
      : undefined,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      target: 'es2020',
      cssCodeSplit: true,
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            const normalizedId = id.replace(/\\/g, '/');
            if (
              normalizedId.includes('node_modules/react/') ||
              normalizedId.includes('node_modules/react-dom/') ||
              normalizedId.includes('node_modules/react-router-dom/')
            ) {
              return 'vendor-react';
            }
            if (
              normalizedId.includes('node_modules/i18next/') ||
              normalizedId.includes('node_modules/react-i18next/')
            ) {
              return 'vendor-i18n';
            }
            if (normalizedId.includes('node_modules/three/')) {
              return 'vendor-three';
            }
            if (
              normalizedId.includes('/locales/en/') ||
              normalizedId.endsWith('/locales/en.json')
            ) {
              return 'locales-en';
            }
            if (
              normalizedId.includes('/locales/ar/') ||
              normalizedId.endsWith('/locales/ar.json')
            ) {
              return 'locales-ar';
            }
          },
        },
      },
    },
  };
});
