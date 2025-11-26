import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true, // This helps with file watching on macOS
      interval: 1000,
    },
    hmr: {
      overlay: true, // Show errors as overlay
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
})
