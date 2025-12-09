import { PlayerOptions } from '@/interfaces/player-options';
import { WidgetConfiguration } from '@/interfaces/widget-configuration';
import { WidgetOptions } from '@/interfaces/widget-options';

const supportedConfigFields = ['selector', 'host', 'guid', 'widgetOptions', 'playerOptions'];
const supportedWidgetFields = ['playbackMode', 'playerConfigurationGuid', 'playIcon'];
const supportedPlayerParameterFields = ['captions', 'debug', 'loop', 'pv', 'quality', 'showControlPanel', 'sidebar', 'speech', 'speechTerm', 'start', 'volume', 'reporting', 'reportingId'];

export class ConfigurationService {
  validate(initialConfiguration: WidgetConfiguration): WidgetConfiguration {
    const configuration = structuredClone(initialConfiguration);

    if (!configuration || typeof configuration !== 'object') {
      throw new Error('Configuration must be a valid object');
    }

    Object.keys(configuration).forEach((field) => {
      if (!supportedConfigFields.includes(field)) {
        console.warn(`Unsupported field \`${field}\` in configuration`);
        delete configuration[field as keyof WidgetConfiguration];
      }
    });

    ['selector', 'host', 'guid'].forEach((field) => {
      const value = configuration[field as keyof WidgetConfiguration];

      if (value === undefined || value === null) {
        throw new Error(`\`${field}\` is not defined in the configuration`);
      }

      if (typeof value !== 'string') {
        throw new Error(`\`${field}\` must be a string`);
      }

      if (value.trim() === '') {
        throw new Error(`\`${field}\` cannot be an empty string`);
      }
    });

    try {
      // eslint-disable-next-line no-new
      new URL(`https://${configuration.host.replace('https://', '')}`);
    } catch {
      throw new Error('`host` must be a valid domain name');
    }

    this.validatePlayerOptions(configuration.playerOptions);
    this.validateWidgetOptions(configuration.widgetOptions);

    return configuration;
  }

  validatePlayerOptions(playerOptions: Partial<PlayerOptions> | undefined): void {
    if (!playerOptions || !playerOptions.playerParameters) {
      return;
    }

    Object.keys(playerOptions.playerParameters).forEach((field) => {
      if (!supportedPlayerParameterFields.includes(field)) {
        console.warn(`Unsupported field \`playerOptions.playerParameters.${field}\` in configuration`);
        delete playerOptions.playerParameters![field as keyof typeof playerOptions.playerParameters];
      }
    });


    if (playerOptions.playerParameters.pv !== undefined && !['pipls', 'pipss', 'sbs'].includes(playerOptions.playerParameters.pv)) {
      throw new Error('`playerOptions.playerParameters.pv` must be either "pipls", "pipss" or "sbs"');
    }

    if (playerOptions.playerParameters.quality !== undefined && !['240p', '480p', '720p', '1080p', '1440p', 'auto'].includes(playerOptions.playerParameters.quality)) {
      throw new Error('`playerOptions.playerParameters.quality` must be either "240p", "480p", "720p", "1080p", "1440p" or "auto"');
    }
  }

  validateWidgetOptions(widgetOptions: Partial<WidgetOptions> | undefined): void {
    if (!widgetOptions) {
      return;
    }

    Object.keys(widgetOptions).forEach((field) => {
      if (!supportedWidgetFields.includes(field)) {
        console.warn(`Unsupported field \`widgetOptions.${field}\` in configuration`);
        delete widgetOptions[field as keyof typeof widgetOptions];
      }
    });

    if (widgetOptions.playbackMode !== undefined) {
      const value = widgetOptions.playbackMode;

      if (['inline', 'inline-autoload', 'inline-autoplay', 'modal'].indexOf(value) === -1) {
        throw new Error('`widgetOptions.playbackMode` must be either "inline", "inline-autoload", "inline-autoplay" or "modal"');
      }
    }

    if (widgetOptions.playIcon !== undefined) {
      if (widgetOptions.playIcon.position !== undefined) {
        const validPositions = ['top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right'];

        if (validPositions.indexOf(widgetOptions.playIcon.position) === -1) {
          throw new Error('`widgetOptions.playIcon.position` must be a valid position value');
        }
      }

      if (![undefined, 'inline', 'modal'].includes(widgetOptions.playbackMode)) {
        console.warn('`widgetOptions.playIcon` is only applicable when `widgetOptions.playbackMode` is either "modal" or "inline"');
      }
    }
  }

  setDefaults(initialConfiguration: WidgetConfiguration): WidgetConfiguration {
    const widgetOptions = {
      playbackMode: 'inline',
      ...initialConfiguration.widgetOptions || {},
    } as WidgetOptions;

    const playerOptions = {
      ...initialConfiguration.playerOptions || {},
    };

    const configuration: WidgetConfiguration = {
      ...initialConfiguration,
      host: initialConfiguration.host.replace('https://', '').replace(/\/.*$/, ''),
      playerOptions,
      widgetOptions,
    };

    return configuration;
  }
}
