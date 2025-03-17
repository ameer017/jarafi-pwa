import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.svg",
        "favicon.ico",
        "robots.txt",
        "apple-touch-icon.png",
      ],
      manifest: {
        name: "Jarafi PWA",
        short_name: "Jarafi",
        description: "Building an Inclusive Onchain Finance for Everyone",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/icon512_maskable.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon512_rounded.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/icon512_maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,json}"], // Cache all necessary file types
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === "image", // Cache images
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith("/api"), // Cache API requests
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24, // 1 day
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),

    nodePolyfills({
      protocolImports: true,
    }),
  ],
  resolve: {
    alias: {
      process: "process/browser",
      stream: "stream-browserify",
      crypto: "crypto-browserify",
    },
  },

  optimizeDeps: {
    exclude: ["chunk-OTONJH47.js"],
    include: ["bs58", "idb"],
  },
});
