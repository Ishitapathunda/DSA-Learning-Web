import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forwards frontend API calls to the Express backend during `npm run dev`.
      // Keeps requests same-origin from the browser's point of view, so the
      // backend's httpOnly auth cookie works without extra CORS configuration.
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})

