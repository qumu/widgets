import type { StorybookConfig } from '@storybook/web-components-vite';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import remarkGfm from 'remark-gfm';


/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)))
}

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'
  ],
  addons: [
    {
      name: getAbsolutePath("@storybook/addon-docs"),
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
  ],
  features: {
    interactions: false,
  },
  framework: getAbsolutePath('@storybook/web-components-vite'),
  staticDirs: ['../lighthouse'],
};
export default config;
