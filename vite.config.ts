import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// vite-plugin-pwa writes the manifest and generates the service worker (Workbox) at build time.
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/apple-touch-icon.png"],
      manifest: {
        name: "Ascent",
        short_name: "Ascent",
        description: "Training, steps, food and daily progress.",
        start_url: "/",
        display: "standalone",
        background_color: "#0f1418",
        theme_color: "#17212b",
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,jpg}"],
        navigateFallbackDenylist: [/^\/api\//],
      },
    }),
  ],
});
