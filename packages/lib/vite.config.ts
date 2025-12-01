import { defineConfig } from 'vite';
import path from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    cssCodeSplit: true,
    lib: {
      entry: {
        'presentation-widget': path.resolve(__dirname, './src/widgets/presentation-widget.tsx'),
      },
      fileName: (format, name) => `${name}.js`,
      formats: ['es'],
      name: 'Qumu Widget',
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            // Extract the entry point name from the CSS file
            const cssName = assetInfo.name.replace('.css', '');

            return `${cssName}.css`;
          }

          return assetInfo.name || 'asset';
        },
      },
    },
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
