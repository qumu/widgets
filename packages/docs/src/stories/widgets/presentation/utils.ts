import type { PlayerParameters, WidgetConfiguration, WidgetOptions } from 'lib';

export interface Args {
  host: WidgetConfiguration['host'];
  guid: WidgetConfiguration['guid'];
  selector: WidgetConfiguration['selector'];
  playbackMode: WidgetOptions['playbackMode'];
  playIconPosition: WidgetOptions['playIcon']['position'];
  playIconWidth: WidgetOptions['playIcon']['width'];
  playIconHeight: WidgetOptions['playIcon']['height'];
  playIconUrl: WidgetOptions['playIcon']['url'];
  playerCaptions: PlayerParameters['captions'];
  playerConfigurationGuid: PlayerParameters['playerConfigurationGuid'];
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
export function getPlaygroundConfigurationFromArgs(args: Partial<Args>): Omit<WidgetConfiguration, 'selector'> {
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

  if (args.playerConfigurationGuid) {
    playerParameters.playerConfigurationGuid = args.playerConfigurationGuid;
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

// taken from packages/lib/src/styles/variables.css
export const DEFAULT_CSS_VARIABLES = `
--qc-pw-presentation-widget-border-radius: 0;
--qc-pw-presentation-widget-height: 100%;
--qc-pw-presentation-widget-width: 100%;

--qc-pw-thumbnail-image-fit: cover;

--qc-pw-play-button-background-color: rgb(0 0 0 / .8);
--qc-pw-play-button-color: #fff;
--qc-pw-play-button-margin: 16px;
--qc-pw-play-button-padding: 8px;

--qc-pw-play-button-hover-background-color: #000;
--qc-pw-play-button-hover-color: #fff;

--qc-pw-play-button-active-background-color: rgb(0 0 0 / .9);
--qc-pw-play-button-active-color: #fff;

--qc-pw-dialog-backdrop-color: rgb(0 0 0 / .5);
--qc-pw-dialog-background-color: #000;
--qc-pw-dialog-border: 3px solid #000;
--qc-pw-dialog-border-radius: 0;
--qc-pw-dialog-padding: 0;
--qc-pw-dialog-max-width: 1100px;
--qc-pw-dialog-width: 90vw;

--qc-pw-close-button-background-color: rgb(0 0 0 / .75);
--qc-pw-close-button-padding: 6px;
--qc-pw-close-button-shadow: 0 0 1px 1px #000;
--qc-pw-close-button-icon-size: 14px;

--qc-pw-close-button-hover-background-color: rgb(0 0 0 / .9);
--qc-pw-close-button-hover-color: #fff;

--qc-pw-close-button-active-background-color: #000;
--qc-pw-close-button-active-color: #fff;

--qc-pw-not-found-border: 1px solid light-dark(rgb(0 0 0 / .15), rgb(255 255 255 / .15));
--qc-pw-not-found-background-color: transparent;
--qc-pw-not-found-color: light-dark(#000, #fff);
--qc-pw-not-found-icon-color: light-dark(rgb(0 0 0 / .25), rgb(255 255 255 / .25));
`;

const defaultVariablesMap = DEFAULT_CSS_VARIABLES
  .split('\n')
  .filter((line) => line.trim().startsWith('--qc-pw-'))
  .reduce((map, line) => {
    const [key, value] = line.split(':').map((s) => s?.trim());

    // remove the trailing semicolon
    map.set(key, value.replace(';', ''));

    return map;
  }, new Map<string, string>());

/**
 * Get the CSS variables that have been overridden in the story context.
 *
 * @param cssVars the CSS variables from the story context
 */
export function getOverridenCssVariables(cssVars: string): string {
  return cssVars.split('\n')
    .filter((line) => line.trim().startsWith('--qc-pw-'))
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
