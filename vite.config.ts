import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import { VitePWA } from 'vite-plugin-pwa'

// Served from https://<user>.github.io/sets/ , so every asset URL needs that prefix.
// Override with BASE_PATH=/ for a custom domain.
const base = process.env.BASE_PATH ?? '/sets/'

// Le canal « dev » est la branche du même nom, publiée sous /sets/dev/ à côté de
// la version principale. Pages ne sert qu'un site par dépôt : les deux partagent
// donc domaine et stockage, d'où une clé de données à part (voir src/lib/db.ts).
const canal = process.env.VITE_CANAL === 'dev' ? 'dev' : 'principal'

export default defineConfig({
  base,
  plugins: [
    preact(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: canal === 'dev' ? 'Sets dev' : 'Sets',
        short_name: canal === 'dev' ? 'Sets dev' : 'Sets',
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
        // Sans ça, le service worker de la version principale (portée /sets/)
        // répondait aussi aux navigations vers /sets/dev/ avec sa propre page :
        // la version dev ne s'ouvrait jamais sur un téléphone où l'appli est installée.
        navigateFallbackDenylist: canal === 'dev' ? [] : [new RegExp(`^${base}dev/`)],
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
