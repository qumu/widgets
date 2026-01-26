import { parse } from 'valibot';
import { WidgetConfiguration } from '@/interfaces/widget-configuration';

export class ConfigurationService {
  createConfiguration(schema: Parameters<typeof parse>[0], config: WidgetConfiguration): WidgetConfiguration {
    const merged = parse(schema, config) as WidgetConfiguration;

    merged.host = merged.host.replace('https://', '')
      .split('/')
      .pop() ?? merged.host;

    return merged;
  }
}
