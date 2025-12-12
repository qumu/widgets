import { PlayIcon } from './play-icon';
import { Presentation } from './presentation';

export interface WidgetOptions {
  playbackMode: 'inline' | 'inline-autoload' | 'inline-autoplay' | 'modal';
  playerConfigurationGuid: string;
  playIcon: Partial<PlayIcon>;
  onThumbnailClick(presentation: Presentation): void;
}
