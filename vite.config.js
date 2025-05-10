import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        maximumFileSizeToCacheInBytes: 200 * 1024 * 1024,
      },
      manifest: {
        name: 'iTour',
        short_name: 'iTour',
        description: 'CSU-Main Augmented Reality Tour',
        theme_color: '#013300',
        icons: [
          {
            src: 'iTour-icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'iTour-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'iTour-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
})
