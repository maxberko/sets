import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import { VitePWA } from 'vite-plugin-pwa'

// Served from https://<user>.github.io/sets/ , so every asset URL needs that prefix.
// Override with BASE_PATH=/ for a custom domain.
const base = process.env.BASE_PATH ?? '/sets/'

export default defineConfig({
  base,
  plugins: [
    preact(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Sets',
        short_name: 'Sets',
        description: "Force et mobilite, base sur les preuves.",
        lang: 'fr',
        dir: 'ltr',
        start_url: base,
        scope: base,
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#F3F5F2',
        theme_color: '#F3F5F2',
        categories: ['health', 'fitness'],
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff,woff2}'],
        cleanupOutdatedCaches: true,
        navigateFallback: `${base}index.html`,
      },
      devOptions: { enabled: false },
    }),
  ],
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
} as Parameters<typeof defineConfig>[0])
