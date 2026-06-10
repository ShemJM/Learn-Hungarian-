import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  // GitHub Pages serves the app under /<repo-name>/ — set the asset base accordingly.
  // Locally and in Vitest, fall back to '/'.
  base: process.env.GITHUB_ACTIONS ? '/Learn-Hungarian-/' : '/',
  // Make Svelte resolve its browser (client) build inside vitest/jsdom.
  resolve: process.env.VITEST ? { conditions: ['browser'] } : undefined,
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.js']
  }
});
