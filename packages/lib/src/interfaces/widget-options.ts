import { PlayIcon } from './play-icon';

export interface WidgetOptions {
  info: Record<'over' | 'top' | 'bottom' | 'left' | 'right', string[]>;
  playbackMode: 'inline' | 'inline-autoload' | 'inline-autoplay' | 'modal';
  playerConfigurationGuid: string;
  playIcon: PlayIcon;
}
