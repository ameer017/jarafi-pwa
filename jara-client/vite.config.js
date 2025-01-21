import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
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
    }),
    nodePolyfills({
      protocolImports: true,
    }),
  ],
  resolve: {
    alias: {
      process: "process/browser",
      stream: 'stream-browserify',
      crypto: 'crypto-browserify'
    }
  },
  define: {
    "process.env": {},
  },
  optimizeDeps: {
    exclude: ['chunk-OTONJH47.js']
  }
});
