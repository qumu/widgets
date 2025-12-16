import { WidgetOptions } from './widget-options';
import { PlayerParameters } from './player-parameters';
import { SortOrder } from '@/services/presentation.service';

export interface WidgetConfiguration {
  guid: string;
  host: string;
  playerParameters?: Partial<PlayerParameters>;
  selector: string | HTMLElement;
  sortBy: string;
  sortOrder: SortOrder;
  widgetOptions?: Partial<WidgetOptions>;
}
