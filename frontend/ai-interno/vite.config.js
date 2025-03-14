import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';  // Import the path module to help with resolving directories

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Backend server
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),  // This sets "@" to point to the "src" directory
    },
  },
});
