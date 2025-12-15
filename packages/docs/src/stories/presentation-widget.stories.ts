import '../components/presentation-widget.js';
import type { StoryContext } from 'storybook/internal/types';
import type { PlayerParameters, WidgetConfiguration, WidgetOptions } from 'lib';
import { PresentationWidgetComponent } from '../components/presentation-widget.ts';

// taken from packages/lib/src/styles/variables.css
const DEFAULT_CSS_VARIABLES = `--qc-theme-background-color: #09091a;
--qc-theme-color: #f5f8fa;

--qc-presentation-widget-border-radius: 0;
--qc-presentation-widget-height: 100%;
--qc-presentation-widget-width: 100%;

--qc-thumbnail-image-fit: cover;

--qc-thumbnail-play-button-margin: 16px;
--qc-thumbnail-play-button-padding: 8px;
--qc-thumbnail-play-button-background-color: var(--qc-theme-background-color);
--qc-thumbnail-play-button-background-opacity: 0.8;
--qc-thumbnail-play-button-background-opacity-hover: 1;

--qc-dialog-backdrop: rgb(0 0 0 / 0.5);
--qc-dialog-background-color: #000;
--qc-dialog-border-color: #000;
--qc-dialog-border-radius: 0;
--qc-dialog-border-style: solid;
--qc-dialog-border-width: 3px;
--qc-dialog-close-button-background-color: var(--qc-theme-background-color);
--qc-dialog-close-button-background-opacity: 0.8;
--qc-dialog-close-button-background-opacity-hover: 1;
--qc-dialog-close-button-color: var(--qc-theme-color);
--qc-dialog-close-button-padding: 6px;
--qc-dialog-close-button-shadow: 0 0 1px 1px #000000;
--qc-dialog-close-icon-size: 20px;
--qc-dialog-padding: 0;
--qc-dialog-width-max: 1100px;
--qc-dialog-width: 90vw;`;

const defaultVariablesMap = DEFAULT_CSS_VARIABLES
  .split('\n')
  .filter((line) => line.trim().startsWith('--qc-'))
  .reduce((map, line) => {
    const [key, value] = line.split(':').map((s) => s?.trim());

    // remove the trailing semicolon
    map.set(key, value.replace(';', ''));

    return map;
  }, new Map<string, string>());


export interface Args {
  host: WidgetConfiguration['host'];
  guid: WidgetConfiguration['guid'];
  playbackMode: WidgetOptions['playbackMode'];
  playIconPosition: WidgetOptions['playIcon']['position'];
  playIconWidth: WidgetOptions['playIcon']['width'];
  playIconHeight: WidgetOptions['playIcon']['height'];
  playIconUrl: WidgetOptions['playIcon']['url'];
  playerCaptions: PlayerParameters['captions'];
  playerDebug: PlayerParameters['debug'];
  playerLoop: PlayerParameters['loop'];
  playerView: PlayerParameters['pv'];
  playerQuality: PlayerParameters['quality'];
  playerShowControlPanel: PlayerParameters['showControlPanel'];
  playerSidebar: PlayerParameters['sidebar'];
  playerStart: PlayerParameters['start'];
  playerVolume: PlayerParameters['volume'];
  playerReporting: PlayerParameters['reporting'];
  playerReportingId: PlayerParameters['reportingId'];
  cssVars: string;
}

/**
 * Get the configuration object from the story context.
 *
 * @param args the arguments from the story context
 */
function getConfiguration(args: Partial<Args>): Omit<WidgetConfiguration, 'selector'> {
  const widgetOptions: Partial<WidgetOptions> = {
    playbackMode: args.playbackMode as WidgetOptions['playbackMode'],
  };

  if (args.playIconPosition) {
    widgetOptions.playIcon = widgetOptions.playIcon || {};
    widgetOptions.playIcon.position = args.playIconPosition;
  }

  if (args.playIconWidth !== undefined && args.playIconWidth !== null) {
    widgetOptions.playIcon = widgetOptions.playIcon || {};
    widgetOptions.playIcon.width = args.playIconWidth;
  }

  if (args.playIconHeight !== undefined && args.playIconHeight !== null) {
    widgetOptions.playIcon = widgetOptions.playIcon || {};
    widgetOptions.playIcon.height = args.playIconHeight;
  }

  if (args.playIconUrl) {
    widgetOptions.playIcon = widgetOptions.playIcon || {};
    widgetOptions.playIcon.url = args.playIconUrl;
  }

  const playerParameters: Partial<PlayerParameters> = {};

  if (args.playerCaptions) {
    playerParameters.captions = args.playerCaptions;
  }

  if (args.playerDebug !== undefined && args.playerDebug !== null) {
    playerParameters.debug = args.playerDebug;
  }

  if (args.playerLoop !== undefined && args.playerLoop !== null) {
    playerParameters.loop = args.playerLoop;
  }

  if (args.playerView) {
    playerParameters.pv = args.playerView;
  }

  if (args.playerQuality) {
    playerParameters.quality = args.playerQuality;
  }

  if (args.playerShowControlPanel !== undefined && args.playerShowControlPanel !== null) {
    playerParameters.showControlPanel = args.playerShowControlPanel;
  }

  if (args.playerSidebar !== undefined && args.playerSidebar !== null) {
    playerParameters.sidebar = args.playerSidebar;
  }

  if (args.playerStart) {
    playerParameters.start = args.playerStart;
  }

  if (args.playerVolume) {
    playerParameters.volume = args.playerVolume;
  }

  if (args.playerReporting !== undefined && args.playerReporting !== null) {
    playerParameters.reporting = args.playerReporting;
  }

  if (args.playerReportingId) {
    playerParameters.reportingId = args.playerReportingId;
  }

  /* eslint-disable sort-keys */

  const configuration: Omit<WidgetConfiguration, 'selector'> = {
    host: args.host!,
    guid: args.guid!,
    widgetOptions,
  };

  /* eslint-enable sort-keys */
  if (Object.keys(playerParameters).length) {
    configuration.playerParameters = playerParameters;
  }

  return configuration;
}

/**
 * Get the CSS variables that have been overridden in the story context.
 *
 * @param cssVars the CSS variables from the story context
 */
function getOverridenCssVariables(cssVars: string): string {
  return cssVars.split('\n')
    .filter((line) => line.trim().startsWith('--qc-'))
    .reduce((arr, line) => {
      // eslint-disable-next-line prefer-const
      let [key, value] = line.split(':').map((s) => s?.trim());

      // remove the trailing semicolon
      value = value?.replace(';', '');


      if (defaultVariablesMap.has(key) && defaultVariablesMap.get(key) !== value) {
        arr.push(`${key}: ${value};`);
      }

      return arr;
    }, [] as string[])
    .join('\n');
}

export default {
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
          const configuration = getConfiguration(storyContext.args);

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
    <link rel="stylesheet" href="https://unpkg.com/@enghouse-qumu/widget@<version>/presentation-widget.css">${cssVariables}
  </head>
  <body>
    <div id="widget"></div>
    
    <script type="module">
      import { PresentationWidget } from 'https://unpkg.com/@enghouse-qumu/widget@<version>/presentation-widget.js';
      
      const widget = new PresentationWidget(${
        JSON.stringify(configuration, null, 2)
          .split('\n')
          // add 6 spaces (indent level inside <script>)
          .map((line, i) => (i === 0 ? line : `      ${line}`))
          .join('\n')
      });
    </script>
  </body>
</html>
          `;
        },
      },
    },
  },
  title: 'Widgets/Presentation Widget',
};

const Template = (args: Partial<Args>) => {
  const el = document.createElement('presentation-widget') as PresentationWidgetComponent;

  el.configuration = getConfiguration(args);

  args.cssVars?.split('\n').forEach((line: string) => {
    if (!line.startsWith('--qc-')) {
      return;
    }

    const [key, value] = line.split(':').map((s) => s?.trim());

    if (key && value) {
      el.style.setProperty(key, value.replace(';', ''));
    }
  });

  return el;
};

export const BasicExample = Template.bind({});
// disable eslint for the arguments as the order matters for the controls panel
/* eslint-disable sort-keys */
BasicExample.args = {
  host: 'demo.qumucloud.com',
  guid: 'JN6JHrg17xpwF8klXSIfFj',
  playbackMode: 'inline',
  playIconPosition: 'center',
  cssVars: DEFAULT_CSS_VARIABLES,
};
/* eslint-enable sort-keys */
