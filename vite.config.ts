import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Split vendor modules
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('jspdf')) return 'vendor-pdf';
            if (id.includes('date-fns')) return 'vendor-dates';
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
});
