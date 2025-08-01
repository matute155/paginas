import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react({
      // Añade esto para evitar JSX inyectado en HTML
      babel: {
        plugins: ['@babel/plugin-transform-react-jsx']
      }
    })
  ],
  server: {
    cors: true,
    host: true,
    port: 3000
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      output: {
        // Evita chunks inline
        inlineDynamicImports: false,
        // Configuración optimizada para Vercel
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]',
        // Minificación más agresiva
        compact: true
      }
    },
    // Añade estas opciones adicionales
    minify: 'terser',
    sourcemap: false
  },
  base: '/',
  optimizeDeps: {
    include: ['react', 'react-dom'],
    // Forza la pre-optimización
    force: true
  }
});