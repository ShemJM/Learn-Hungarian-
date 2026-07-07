import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  // Serve assets from the GitHub Pages project subpath (skip during tests).
  base: process.env.VITEST ? '/' : '/Learn-Hungarian-/',
  plugins: [svelte()],
  // Make Svelte resolve its browser (client) build inside vitest/jsdom.
  resolve: process.env.VITEST ? { conditions: ['browser'] } : undefined,
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.js']
  }
});
