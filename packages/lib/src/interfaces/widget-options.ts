import { PlayIcon } from './play-icon';

export interface WidgetOptions {
  playbackMode: 'inline' | 'inline-autoload' | 'inline-autoplay' | 'modal';
  playerConfigurationGuid: string;
  playIcon: PlayIcon;
}
