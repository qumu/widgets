import { PlayIcon } from './play-icon';

export interface WidgetOptions {
  autoload: boolean;
  autoplay: boolean;
  info: Record<'over' | 'top' | 'bottom' | 'left' | 'right', string[]>;
  playbackMode: 'inline' | 'modal';
  playerConfigurationGuid: string;
  playIcon: PlayIcon;
}
