import type { Preview } from '@storybook/web-components-vite';
import './preview.css';

// Adds a locale switcher in the toolbar
export const globalTypes = {
  locale: {
    name: 'Locale',
    description: 'Internationalization locale',
    defaultValue: 'en',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'de', title: '🇩🇪 Deutsch', right: 'de' },
        { value: 'en', title: '🇺🇸 English', right: 'en' },
        { value: 'es', title: '🇪🇸 Español', right: 'es' },
        { value: 'fr', title: '🇫🇷 Français', right: 'fr' },
        { value: 'it', title: '🇮🇹 Italiano', right: 'it' },
        { value: 'ja', title: '🇯🇵 日本語', right: 'ja' },
        { value: 'pt', title: '🇵🇹 Português', right: 'pt' },
      ],
      showName: true,
    },
  },
};

// 🧩 Inject locale into your components or global context
export const decorators = [
  (storyFn: () => any, context: { globals: { locale: string; }; }) => {
    // Sets the whole document's locale
    document.documentElement.lang = context.globals.locale;

    return storyFn();
  },
];

const preview: Preview = {
  parameters: {
    docs: {
      toc: {
        headingSelector: 'h2, h3',
      },
      codePanel: true,
    },
    options: {
      storySort: {
        order: [
          'Getting Started',
          [
            'Installation',
            [
              'Via NPM',
              'Via CDN'
            ],
            'Localization'
          ],
          'Widgets',
          [
            'Presentation'
          ]
        ],
      },
    }

  },
};

export default preview;
