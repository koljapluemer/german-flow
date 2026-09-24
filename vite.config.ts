import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'
import { devApi } from './netlify/devApi'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    devApi(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['logo.svg'],
      // Icons are generated from public/logo.svg - see pwa-assets.config.ts.
      pwaAssets: { config: true, overrideManifestIcons: true },
      manifest: {
        name: 'german-flow',
        short_name: 'german-flow',
        description: 'Memorize core phrases for everyday situations, by target language.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffffff'
      },
      workbox: {
        // App shell only - phrase content (JSON + audio) is runtime-cached below
        // instead of precached, since the catalog will grow to thousands of
        // situations and most users only ever touch a handful of languages.
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        cleanupOutdatedCaches: true,
        // Any in-app route works offline by falling back to the precached shell;
        // never serve the shell for phrase data requests.
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/data\//],
        runtimeCaching: [
          {
            urlPattern: /\/data\/.*\.json$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'phrase-json',
              expiration: { maxEntries: 2000, maxAgeSeconds: 60 * 60 * 24 * 180 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            urlPattern: /\/data\/.*\.mp3$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'phrase-audio',
              expiration: { maxEntries: 2000, maxAgeSeconds: 60 * 60 * 24 * 180 },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
