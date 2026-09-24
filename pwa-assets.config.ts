import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'

// All PWA icons are generated from the single logo source at public/logo.svg.
// Run `npm run generate-pwa-assets` after changing it; vite-plugin-pwa also
// regenerates them on build (see `pwaAssets` in vite.config.ts).
export default defineConfig({
  preset: minimal2023Preset,
  images: ['public/logo.svg']
})
