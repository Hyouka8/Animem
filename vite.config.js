import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      'server-only': 'vite/dist/client/env.mjs',
      '@/lib/pocketbase/server': '/src/lib/pocketbase/server-mock.ts',
    },
  },
  server: {
    port: 5173,
    host: '0.0.0.0'
  }
});
