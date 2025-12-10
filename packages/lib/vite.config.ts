import { defineConfig } from 'vite';
import path from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    cssCodeSplit: true,
    lib: {
      entry: {
        'index': path.resolve(__dirname, './src/index.ts'),
        'presentation-widget': path.resolve(__dirname, './src/widgets/presentation-widget.tsx'),
      },
      fileName: (_, name) => `${name}.js`,
      formats: ['es'],
      name: 'Qumu Widget',
    },
    minify: 'terser',
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    open: true,
  },
});
