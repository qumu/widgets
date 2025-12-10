import { PlayerParameters } from '@/interfaces/player-parameters';
import { WidgetConfiguration } from '@/interfaces/widget-configuration';
import { WidgetOptions } from '@/interfaces/widget-options';

const supportedConfigFields = new Set(['selector', 'host', 'guid', 'widgetOptions', 'playerParameters']);
const supportedWidgetFields = new Set(['playbackMode', 'playerConfigurationGuid', 'playIcon']);
const supportedPlayerParameterFields = new Set(['captions', 'debug', 'loop', 'pv', 'quality', 'showControlPanel', 'sidebar', 'speech', 'speechTerm', 'start', 'volume', 'reporting', 'reportingId']);

export class ConfigurationService {
  validateAndSanitize(initialConfiguration: WidgetConfiguration): WidgetConfiguration {
    const configuration = structuredClone(initialConfiguration);

    if (!configuration || typeof configuration !== 'object') {
      throw new Error('Configuration must be a valid object');
    }

    Object.keys(configuration).forEach((field) => {
      if (!supportedConfigFields.has(field)) {
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
        throw new TypeError(`\`${field}\` must be a string`);
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

    this.validatePlayerParameters(configuration.playerParameters);
    this.validateWidgetOptions(configuration.widgetOptions);

    return configuration;
  }

  validatePlayerParameters(playerParameters: Partial<PlayerParameters> | undefined): void {
    if (!playerParameters) {
      return;
    }

    Object.keys(playerParameters).forEach((field) => {
      if (!supportedPlayerParameterFields.has(field)) {
        console.warn(`Unsupported field \`playerParameters.${field}\` in configuration`);
        delete playerParameters[field as keyof typeof playerParameters];
      }
    });


    if (playerParameters.pv !== undefined && !['pipls', 'pipss', 'sbs'].includes(playerParameters.pv)) {
      throw new Error('`playerParameters.pv` must be either "pipls", "pipss" or "sbs"');
    }

    if (playerParameters.quality !== undefined && !['240p', '480p', '720p', '1080p', '1440p', 'auto'].includes(playerParameters.quality)) {
      throw new Error('`playerParameters.quality` must be either "240p", "480p", "720p", "1080p", "1440p" or "auto"');
    }
  }

  validateWidgetOptions(widgetOptions: Partial<WidgetOptions> | undefined): void {
    if (!widgetOptions) {
      return;
    }

    Object.keys(widgetOptions).forEach((field) => {
      if (!supportedWidgetFields.has(field)) {
        console.warn(`Unsupported field \`widgetOptions.${field}\` in configuration`);
        delete widgetOptions[field as keyof typeof widgetOptions];
      }
    });

    if (widgetOptions.playbackMode !== undefined) {
      const value = widgetOptions.playbackMode;

      if (!['inline', 'inline-autoload', 'inline-autoplay', 'modal'].includes(value)) {
        throw new Error('`widgetOptions.playbackMode` must be either "inline", "inline-autoload", "inline-autoplay" or "modal"');
      }
    }

    if (widgetOptions.playIcon !== undefined) {
      if (widgetOptions.playIcon.position !== undefined) {
        const validPositions = ['top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right'];

        if (!validPositions.includes(widgetOptions.playIcon.position)) {
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
      ...initialConfiguration.widgetOptions,
    } as WidgetOptions;

    const playerParameters = {
      ...initialConfiguration.playerParameters,
    };

    const configuration: WidgetConfiguration = {
      ...initialConfiguration,
      host: initialConfiguration.host.replace('https://', '').replace(/\/.*$/, ''),
      playerParameters,
      widgetOptions,
    };

    return configuration;
  }
}
