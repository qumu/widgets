import type { StoryObj } from '@storybook/web-components-vite';
import type { StoryContext } from 'storybook/internal/types';
import { PlayerSdk as QumuPlayerSdk } from '@enghouse-qumu/player-sdk';
import { PresentationWidget } from 'lib';
import de from 'lib/locales/de.json';
import es from 'lib/locales/es.json';
import fr from 'lib/locales/fr.json';
import it from 'lib/locales/it.json';
import ja from 'lib/locales/ja.json';
import pt from 'lib/locales/pt.json';
import 'lib/presentation-widget.css';
import {
  type Args,
  DEFAULT_CSS_VARIABLES,
  getPlaygroundConfigurationFromArgs,
  getOverridenCssVariables,
} from './utils.ts';
import { version } from '../../../../../../package.json';

type Story = StoryObj;

export default {
  component: 'presentation-widget',
};

export const Basic: Story = {
  parameters: {
    docs: {
      source: {
        code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8"/>
    <title>Presentation Widget</title>
    <link rel="stylesheet" href="https://unpkg.com/@enghouse-qumu/widgets@${version}/presentation-widget.css">
  </head>
  <body>
    <div id="widget"></div>

    <script type="module">
      import { PresentationWidget } from 'https://unpkg.com/@enghouse-qumu/widgets@${version}/presentation-widget.js';

      PresentationWidget.create({
        guid: 'JN6JHrg17xpwF8klXSIfFj',
        host: 'demo.qumucloud.com',
        selector: '#widget',
      }).catch((err) => console.log(err));
    </script>
  </body>
</html>`,
      },
    },
  },
  render: () => {
    const container = document.createElement('div');

    PresentationWidget.create({
      guid: 'JN6JHrg17xpwF8klXSIfFj',
      host: 'demo.qumucloud.com',
      locales: {
        de,
        es,
        fr,
        it,
        ja,
        pt,
      },
      selector: container,
    }).catch(console.error);

    return container;
  },
};

export const PlaybackThumbnail: Story = {
  parameters: {
    docs: {
      source: {
        code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8"/>
    <title>Presentation Widget</title>
    <link rel="stylesheet" href="https://unpkg.com/@enghouse-qumu/widgets@${version}/presentation-widget.css">
  </head>
  <body>
    <div id="widget"></div>

    <script type="module">
      import { PresentationWidget } from 'https://unpkg.com/@enghouse-qumu/widgets@${version}/presentation-widget.js';

      PresentationWidget.create({
        guid: 'JN6JHrg17xpwF8klXSIfFj',
        host: 'demo.qumucloud.com',
        selector: '#widget',
        widgetOptions: {
          playbackMode: 'modal',
        },
      }).catch((err) => console.log(err));
    </script>
  </body>
</html>`,
      },
    },
  },
  render: () => {
    const container = document.createElement('div');

    container.style.display = 'grid';
    container.style.gap = '16px';
    container.style.gridTemplateColumns = 'repeat(2, 1fr)';

    const playbackWidget = document.createElement('div');

    const thumbnailWidget = document.createElement('div');


    container.appendChild(playbackWidget);
    container.appendChild(thumbnailWidget);

    PresentationWidget.create({
      guid: 'JN6JHrg17xpwF8klXSIfFj',
      host: 'demo.qumucloud.com',
      locales: {
        de,
        es,
        fr,
        it,
        ja,
        pt,
      },
      selector: playbackWidget,
      widgetOptions: {
        playbackMode: 'inline',
      },
    }).catch(console.error);

    PresentationWidget.create({
      guid: 'JN6JHrg17xpwF8klXSIfFj',
      host: 'demo.qumucloud.com',
      locales: {
        de,
        es,
        fr,
        it,
        ja,
        pt,
      },
      selector: thumbnailWidget,
      widgetOptions: {
        playbackMode: 'modal',
      },
    }).catch(console.error);

    return container;
  },
};

export const CustomPlayIcon: Story = {
  parameters: {
    docs: {
      source: {
        code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8"/>
    <title>Presentation Widget</title>
    <link rel="stylesheet" href="https://unpkg.com/@enghouse-qumu/widgets@${version}/presentation-widget.css">
  </head>
  <body>
    <div id="widget"></div>

    <script type="module">
      import { PresentationWidget } from 'https://unpkg.com/@enghouse-qumu/widgets@${version}/presentation-widget.js';

      PresentationWidget.create({
        guid: 'JN6JHrg17xpwF8klXSIfFj',
        host: 'demo.qumucloud.com',
        selector: '#widget',
        widgetOptions: {
          playIcon: {
            height: 48,
            position: 'bottom-left',
            url: 'https://demo.qumucloud.com/widgets/resources/custom-play-icon.png',
            width: 102,
          },
        },
      }).catch((err) => console.log(err));
    </script>
  </body>
</html>`,
      },
    },
  },
  render: () => {
    const container = document.createElement('div');

    PresentationWidget.create({
      guid: 'JN6JHrg17xpwF8klXSIfFj',
      host: 'demo.qumucloud.com',
      locales: {
        de,
        es,
        fr,
        it,
        ja,
        pt,
      },
      selector: container,
      widgetOptions: {
        playIcon: {
          height: 48,
          position: 'bottom-left',
          url: 'https://demo.qumucloud.com/widgets/resources/custom-play-icon.png',
          width: 102,
        },
      },
    })
      .catch(console.error);

    return container;
  },
};

export const PlayerSdk: Story = {
  parameters: {
    docs: {
      source: {
        code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8"/>
    <title>Presentation Widget</title>
    <link rel="stylesheet" href="https://unpkg.com/@enghouse-qumu/widgets@${version}/presentation-widget.css">
  </head>
  <body>
    <div id="widget"></div>

    <script type="module">
      import { PresentationWidget } from 'https://unpkg.com/@enghouse-qumu/widgets@${version}/presentation-widget.js';
      import { PlayerSdk } from "https://unpkg.com/@enghouse-qumu/player-sdk@3.2.1/dist/index.modern.mjs";

      PresentationWidget.create({
        host:'demo.qumucloud.com',
        guid: 'JN6JHrg17xpwF8klXSIfFj',
        selector: '#widget',
        widgetOptions: {
          onIframeLoad(iframe) {
            const logsEl = document.querySelector("#logs");

            const sdk = new PlayerSdk(iframe);

            sdk.addEventListener("timeupdate", (newTime) => {
              logsEl.innerHTML += \`<li>timeupdate: \${newTime}</li>\`;
            });

            sdk.getDuration().then((duration) => {
              logsEl.innerHTML += \`<li>duration: \${newTime}</li>\`;
            });
          },
        },
      }).catch((err) => console.log(err));
    </script>
  </body>
</html>`,
      },
    },
  },
  render: () => {
    // Create container elements
    const container = document.createElement('div');

    container.style.display = 'grid';
    container.style.gap = '16px';
    container.style.gridTemplateColumns = 'repeat(2, 1fr)';

    const widget = document.createElement('div');

    widget.style.width = '640px';
    widget.style.height = '360px';

    const logs = document.createElement('ul');

    logs.style.maxHeight = '360px';
    logs.style.overflowY = 'auto';
    logs.style.listStyle = 'none';
    logs.style.padding = '0';
    logs.style.margin = '0';
    logs.style.flex = '1';

    container.appendChild(widget);
    container.appendChild(logs);

    PresentationWidget.create({
      guid: 'JN6JHrg17xpwF8klXSIfFj',
      host: 'demo.qumucloud.com',
      locales: {
        de,
        es,
        fr,
        it,
        ja,
        pt,
      },
      selector: widget,
      widgetOptions: {
        onIframeLoad(iframe) {
          const sdk = new QumuPlayerSdk(iframe);

          sdk.addEventListener('timeupdate', (newTime: number) => {
            logs.innerHTML += `<li>timeupdate: ${newTime}</li>`;
          });

          sdk.getDuration()
            .then((duration: number) => {
              logs.innerHTML += `<li>duration: ${duration}</li>`;
            })
            .catch(console.error);
        },
      },
    })
      .catch(console.error);

    return container;
  },
};

export const Playground: Story = {
  args: {
    /* eslint-disable sort-keys */
    host: 'demo.qumucloud.com',
    guid: 'JN6JHrg17xpwF8klXSIfFj',
    playbackMode: 'inline',
    playIconPosition: 'center',
    cssVars: DEFAULT_CSS_VARIABLES.trim(),
    /* eslint-enable sort-keys */
  },
  argTypes: {
    host: { control: 'text' },
    // eslint-disable-next-line sort-keys
    guid: { control: 'text' },
    playbackMode: {
      control: 'select',
      name: 'Playback Mode',
      options: [
        'inline',
        'inline-autoload',
        'inline-autoplay',
        'modal',
      ],
      table: {
        defaultValue: { summary: 'inline' },
      },
    },
    playIconPosition: {
      control: 'select',
      name: 'Position',
      options: [
        'top-left',
        'top',
        'top-right',
        'left',
        'center',
        'right',
        'bottom-left',
        'bottom',
        'bottom-right',
      ],
      table: {
        category: 'Play Icon',
      },
    },
    playIconWidth: {
      control: 'number',
      name: 'Width',
      table: {
        category: 'Play Icon',
      },
    },
    // eslint-disable-next-line sort-keys
    playIconHeight: {
      control: 'number',
      name: 'Height',
      table: {
        category: 'Play Icon',
      },
    },
    playIconUrl: {
      control: 'text',
      name: 'Custom Play Icon URL',
      table: {
        category: 'Play Icon',
      },
    },
    // eslint-disable-next-line sort-keys
    playerCaptions: {
      control: 'text',
      name: 'Captions',
      table: {
        category: 'Player Parameters',
      },
    },
    playerDebug: {
      control: 'boolean',
      name: 'Enable Debug Mode',
      table: {
        category: 'Player Parameters',
      },
    },
    playerLoop: {
      control: 'boolean',
      name: 'Loop',
      table: {
        category: 'Player Parameters',
      },
    },
    playerView: {
      control: 'select',
      name: 'View',
      options: [
        'pipls',
        'pipss',
        'sbs',
      ],
      table: {
        category: 'Player Parameters',
      },
    },
    // eslint-disable-next-line sort-keys
    playerQuality: {
      control: 'select',
      name: 'Quality',
      options: [
        'auto',
        'best',
        '1440p',
        '1080p',
        '720p',
        '360p',
        '240p',
      ],
      table: {
        category: 'Player Parameters',
      },
    },
    playerShowControlPanel: {
      control: 'boolean',
      name: 'Show the Control Panel',
      table: {
        category: 'Player Parameters',
      },
    },
    playerSidebar: {
      control: 'boolean',
      name: 'Show the Sidebar',
      table: {
        category: 'Player Parameters',
      },
    },
    playerStart: {
      control: 'text',
      name: 'Start at',
      table: {
        category: 'Player Parameters',
      },
    },
    playerVolume: {
      control: 'range',
      max: 100,
      min: 0,
      name: 'Volume',
      table: {
        category: 'Player Parameters',
      },
    },
    // eslint-disable-next-line sort-keys
    playerReporting: {
      control: 'boolean',
      name: 'Enable Playback Analytics',
      table: {
        category: 'Player Parameters',
      },
    },
    playerReportingId: {
      control: 'text',
      name: 'Reporting ID',
      table: {
        category: 'Player Parameters',
      },
    },
    // eslint-disable-next-line sort-keys
    cssVars: {
      control: {
        multiline: true,
        type: 'text',
      },
      name: 'CSS Variables',
      table: {
        category: 'CSS Variables',
      },
    },
  },
  parameters: {
    docs: {
      source: {
        transform: (_: string, storyContext: StoryContext) => {
          const configuration = getPlaygroundConfigurationFromArgs(storyContext.args);

          const overridenCssVariables = getOverridenCssVariables(storyContext.args.cssVars as string);

          // the weird spacing here is on purpose, it's to make the HTML code look better in the docs panel
          const cssVariables = overridenCssVariables.length > 0
            ? `
    <style>
      :root {
        ${overridenCssVariables
          .split('\n')
          // add 8 spaces (indent level inside <style>)
          .map((line, i) => (i === 0 ? line : `        ${line}`))
          .join('\n')}
      }
    </style>`
            : '';

          return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8"/>
    <title>Presentation Widget</title>
    <link rel="stylesheet" href="https://unpkg.com/@enghouse-qumu/widget@${version}/presentation-widget.css">${cssVariables}
  </head>
  <body>
    <div id="widget"></div>
    
    <script type="module">
      import { PresentationWidget } from 'https://unpkg.com/@enghouse-qumu/widget@${version}/presentation-widget.js';
      
      PresentationWidget.create(${
        JSON.stringify(configuration, null, 2)
          .split('\n')
          // add 6 spaces (indent level inside <script>)
          .map((line, i) => (i === 0 ? line : `      ${line}`))
          .join('\n')
      }).catch((err) => console.log(err));
    </script>
  </body>
</html>
          `;
        },
      },
    },
  },
  render: (args: Partial<Args>) => {
    const container = document.createElement('div');

    args.cssVars?.split('\n').forEach((line: string) => {
      if (!line.startsWith('--qc-')) {
        return;
      }

      const [key, value] = line.split(':').map((s) => s?.trim());

      if (key && value) {
        container.style.setProperty(key, value.replace(';', ''));
      }
    });

    PresentationWidget.create({
      locales: {
        de,
        es,
        fr,
        it,
        ja,
        pt,
      },
      selector: container,
      ...getPlaygroundConfigurationFromArgs(args),
    }).catch(console.error);

    return container;
  },
};
