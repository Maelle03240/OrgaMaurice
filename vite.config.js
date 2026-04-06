import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}']
      },
      manifest: {
        name: 'Mon séjour à l\'Île Maurice',
        short_name: 'OrgaMaurice',
        description: 'Organisation de voyage',
        theme_color: '#158482',
        background_color: '#F7F1E3',
        display: 'standalone',
        start_url: '/OrgaMaurice/',
        scope: '/OrgaMaurice/',
        icons: []
      }
    })
  ],
  base: '/OrgaMaurice/'
})
