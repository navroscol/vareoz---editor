import { defineConfig } from "vite";

// Servidor SSR/Edge opcional. Por defecto el proyecto es SPA con vite.config.ts.
export default defineConfig({
  build: { outDir: "dist/server", ssr: true, target: "node20" },
});
