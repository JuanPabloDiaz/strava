import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  envDir: "../",
  resolve: {
    alias: {
      "@": "/src",
      "@src": "/src",
      "@utils": "/src/utils",
      "@components": "/src/components",
      "@pages": "/src/pages",
    },
  },
});