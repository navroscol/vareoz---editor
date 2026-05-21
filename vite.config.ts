import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
      // Shims para componentes 21st.dev pensados originalmente para Next.js.
      "next/image": path.resolve(__dirname, "./client/lib/next-shims/image.tsx"),
      "next/link": path.resolve(__dirname, "./client/lib/next-shims/link.tsx"),
    },
  },
  build: {
    chunkSizeWarningLimit: 4096,
  },
});
