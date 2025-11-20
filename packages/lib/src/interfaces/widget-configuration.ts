import { WidgetOptions } from './widget-options';
import { PlayerOptions } from './player-options';

export interface WidgetConfiguration {
  guid: string;
  host: string;
  playerOptions?: Partial<PlayerOptions>;
  selector: string;
  widgetOptions?: Partial<WidgetOptions>;
}
