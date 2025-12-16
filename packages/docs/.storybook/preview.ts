import type { Preview } from '@storybook/web-components-vite';

// Adds a locale switcher in the toolbar
export const globalTypes = {
  locale: {
    name: 'Locale',
    description: 'Internationalization locale',
    defaultValue: 'en',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'en', title: '🇺🇸 English', right: 'en' },
        { value: 'fr', title: '🇫🇷 Français', right: 'fr' },
        { value: 'ja', title: '🇯🇵 日本語', right: 'ja' },
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
      codePanel: true,
    },
  },
};

export default preview;
