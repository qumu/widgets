import { WidgetConfiguration } from '@/interfaces/widget-configuration';
import { WidgetOptions } from '@/interfaces/widget-options';

const supportedConfigFields = ['selector', 'host', 'guid', 'widgetOptions', 'playerOptions'];
const supportedWidgetFields = ['autoload', 'autoplay', 'info', 'playbackMode', 'playerConfigurationGuid', 'playIcon'];

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

    if (widgetOptions.autoplay === true && widgetOptions.autoload === false) {
      throw new Error('`autoload` must be true when `autoplay` is true');
    }

    if (widgetOptions.info !== undefined) {
      if (typeof widgetOptions.info !== 'object') {
        throw new Error('`widgetOptions.info` must be an object');
      }

      Object.keys(widgetOptions.info).forEach((key) => {
        if (!['over', 'top', 'bottom', 'left', 'right'].includes(key)) {
          throw new Error(`\`widgetOptions.info\` contains unsupported key \`${key}\``);
        }

        const value = widgetOptions.info![key as keyof typeof widgetOptions.info];

        if (!Array.isArray(value)) {
          throw new Error(`\`widgetOptions.info.${key}\` must be an array of strings`);
        }
      });
    }

    if (widgetOptions.playbackMode !== undefined) {
      const value = widgetOptions.playbackMode;

      if (value !== 'inline' && value !== 'modal') {
        throw new Error('`widgetOptions.playbackMode` must be either "inline" or "modal"');
      }
    }
  }

  setDefaults(initialConfiguration: WidgetConfiguration): WidgetConfiguration {
    const widgetOptions = {
      autoload: true,
      autoplay: false,
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
