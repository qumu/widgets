import { WidgetConfiguration } from '@/interfaces/widget-configuration';
import { WidgetOptions } from '@/interfaces/widget-options';

const supportedConfigFields = ['selector', 'host', 'guid', 'widgetOptions', 'playerOptions'];
const supportedWidgetFields = ['playbackMode', 'playerConfigurationGuid', 'playIcon'];

export class ConfigurationService {
  validate(configuration: WidgetConfiguration): void {
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

    this.validateWidgetOptions(configuration.widgetOptions);
  }

  validateWidgetOptions(widgetOptions: WidgetConfiguration['widgetOptions']): void {
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
