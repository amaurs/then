import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: process.env.ANALYZE === 'true',
      gzipSize: true,
    }),
  ],
  server: {
    host: true,
  },
  base: '/',
  assetsInclude: ['**/*.md'],
  build: {
    chunkSizeWarningLimit: 300,
  },
  define: {
    'process.env': {}
  }
});
