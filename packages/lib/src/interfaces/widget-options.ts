import { Presentation } from './presentation';
import { WidgetStyle } from '@/interfaces/widget-style';

export interface WidgetOptions {
  playbackMode: 'inline' | 'inline-autoload' | 'inline-autoplay' | 'modal';
  playIconUrl: string;
  style: Partial<WidgetStyle>;

  onIframeLoad(iframe: HTMLIFrameElement): void;

  onThumbnailClick(presentation: Presentation): void;
}
