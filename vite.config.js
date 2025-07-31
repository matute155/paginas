import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig, createLogger } from 'vite';

const isDev = process.env.NODE_ENV !== 'production';

// 🛠️ Scripts solo para desarrollo
const errorScripts = isDev
  ? [
      {
        tag: 'script',
        attrs: { type: 'module' },
        children: `window.onerror = (message, source, lineno, colno, errorObj) => {
          const errorDetails = errorObj ? JSON.stringify({
            name: errorObj.name,
            message: errorObj.message,
            stack: errorObj.stack,
            source,
            lineno,
            colno,
          }) : null;

          window.parent.postMessage({
            type: 'horizons-runtime-error',
            message,
            error: errorDetails
          }, '*');
        };`,
        injectTo: 'head',
      },
    ]
  : [];

const addTransformIndexHtml = {
  name: 'add-transform-index-html',
  transformIndexHtml(html) {
    return {
      html,
      tags: errorScripts,
    };
  },
};

// 🔇 Silenciar warnings CSS si hacen ruido
console.warn = () => {};

const logger = createLogger();
const loggerError = logger.error;
logger.error = (msg, options) => {
  if (options?.error?.toString().includes('CssSyntaxError: [postcss]')) return;
  loggerError(msg, options);
};

export default defineConfig({
  customLogger: logger,
  plugins: [
    react(),
    addTransformIndexHtml,
  ],
  server: {
    cors: true,
    headers: {
      'Cross-Origin-Embedder-Policy': 'credentialless',
    },
    allowedHosts: true,
  },
  resolve: {
    extensions: ['.jsx', '.js', '.tsx', '.ts', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      external: [
        '@babel/parser',
        '@babel/traverse',
        '@babel/generator',
        '@babel/types',
      ],
    },
  },
});
