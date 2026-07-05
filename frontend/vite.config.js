import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Support New World / subpath deployment (platform sets VITE_BASE e.g. /apps/planner-v2/ )
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
  server: {
    proxy: {
      // Proxy requests starting with /api to the backend
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api prefix
      },
    },
  },
})