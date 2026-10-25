import { fileURLToPath, URL } from "node:url";

import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";

const DEFAULT_API_PROXY_TARGET = "https://api.16-171-93-217.sslip.io";

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  server: {
    // The API only allows the production origin through CORS, so dev requests go through here.
    // Deployed builds use the matching /api rewrite in vercel.json. `vite preview` reuses this proxy.
    proxy: {
      "/api": {
        // API_PROXY_TARGET (no VITE_ prefix, so it never reaches the bundle) overrides the backend.
        target: loadEnv(mode, process.cwd(), "").API_PROXY_TARGET || DEFAULT_API_PROXY_TARGET,
        changeOrigin: true,
        secure: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react-router-dom/')
          ) {
            return 'vendor-react';
          }
          if (
            id.includes('node_modules/i18next/') ||
            id.includes('node_modules/react-i18next/')
          ) {
            return 'vendor-i18n';
          }
        },
      },
    },
  },
}));
