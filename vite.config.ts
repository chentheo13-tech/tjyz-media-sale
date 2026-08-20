import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    target: "es2019",
    rollupOptions: {
      output: {
        manualChunks: {
          motion: ["framer-motion"],
          gsap: ["gsap", "gsap/ScrollTrigger"],
          react: ["react", "react-dom"],
        },
      },
    },
  },
});
