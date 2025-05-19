import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()], // Removed @tailwindcss/vite
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
