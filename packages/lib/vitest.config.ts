import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import { preact } from '@preact/preset-vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    svgr({
      svgrOptions: {
        svgProps: {
          'aria-hidden': 'true',
          class: 'qc-icon',
        },
      },
    }),
    preact(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  test: {
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'html', 'lcov'],
    },
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
  },
});
