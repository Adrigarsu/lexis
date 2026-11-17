import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  // One .env for the whole monorepo, at the repository root (D-158).
  // Relative to the Vite root, apps/web.
  envDir: '../..',
});
