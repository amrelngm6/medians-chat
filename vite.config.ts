import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import inertia from '@inertiajs/vite';
import path from 'path';

export default defineConfig({
  publicDir: false,
  build: {
    outDir: 'public/build',
    emptyOutDir: true,
    manifest: 'manifest.json',
    rollupOptions: {
      input: path.resolve(import.meta.dirname, 'resources/js/app.jsx'),
    },
  },
  plugins: [
    inertia({ ssr: false }),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './resources/js/src'),
    },
  },
  server: {
    cors: true,
  },
});
