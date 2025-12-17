import { WidgetOptions } from './widget-options';
import { PlayerParameters } from './player-parameters';

export interface WidgetConfiguration {
  guid: string;
  host: string;
  playerParameters?: Partial<PlayerParameters>;
  selector: string | HTMLElement;
  sortBy?: string;
  sortOrder?: 'ASCENDING' | 'DESCENDING';
  widgetOptions?: Partial<WidgetOptions>;
}
