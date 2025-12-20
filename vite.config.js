import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

/***Vite Configuration for React JSX Project***/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(import.meta.dirname, './src'),
          '@components': path.resolve(import.meta.dirname, './src/components'),
          '@styles': path.resolve(import.meta.dirname, './src/styles'),
          '@constants': path.resolve(import.meta.dirname, './src/constants'),
          '@hooks': path.resolve(import.meta.dirname, './src/hooks'),
          '@utils': path.resolve(import.meta.dirname, './src/utils'),
          '@assets': path.resolve(import.meta.dirname, './src/assets'),
        }
      }
    };
});