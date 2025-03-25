/// <reference types="vitest" />

import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { remixDevTools } from "remix-development-tools";

export default defineConfig({
  plugins: [
    remixDevTools(),
    !process.env.VITEST && remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
      },
    }),
    tsconfigPaths()
  ],
  server: {
    allowedHosts: true
  },
  test: {
    environment: 'jsdom',
    setupFiles: ["./test/vitest.setup.ts"],
    reporters: process.env.GITHUB_ACTIONS ? ['default', 'github-actions'] : ['default'],
  }
});
