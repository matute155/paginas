import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react({
      // Configuración optimizada para JSX
      babel: {
        plugins: ['@babel/plugin-transform-react-jsx'],
        // Añade presets para asegurar compatibilidad
        presets: ['@babel/preset-react']
      },
      // Añade esto para forzar el tipo MIME correcto
      jsxRuntime: 'classic'
    })
  ],
  server: {
    cors: true,
    host: true,
    port: 3000,
    // Añade headers para tipo MIME (NUEVO)
    headers: {
      'Content-Type': 'application/javascript'
    }
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
        inlineDynamicImports: false,
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]',
        compact: true,
        // Asegura tipos MIME en build (NUEVO)
        generatedCode: {
          preset: 'es2015',
          arrowFunctions: false
        }
      }
    },
    minify: 'terser',
    sourcemap: false,
    // Configuración adicional para módulos (NUEVO)
    target: 'esnext',
    modulePreload: {
      polyfill: false
    }
  },
  base: '/',
  optimizeDeps: {
    include: ['react', 'react-dom'],
    force: true,
    // Configuración adicional para JSX (NUEVO)
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
        '.ts': 'tsx'
      }
    }
  },
  // Añade esta sección completa (NUEVO)
  esbuild: {
    loader: 'jsx',
    include: /\.(jsx|tsx)$/,
    exclude: /node_modules/
  }
});