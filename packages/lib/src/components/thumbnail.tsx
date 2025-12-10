import { Presentation } from '@/interfaces/presentation';
import { WidgetOptions } from '@/interfaces/widget-options';
import playIcon from '../../assets/play-icon.svg?raw';

interface Props {
  onClick: () => void;
  presentation: Presentation;
  widgetOptions: WidgetOptions;
}

export function ThumbnailComponent({ presentation, onClick, widgetOptions }: Readonly<Props>) {
  const playIconStyle: Record<string, string> = {};

  if (widgetOptions.playIcon?.width) {
    playIconStyle['width'] = `${widgetOptions.playIcon.width}px`;
  }

  if (widgetOptions.playIcon?.height) {
    playIconStyle['height'] = `${widgetOptions.playIcon.height}px`;
  }

  const position = widgetOptions.playIcon?.position || 'center';
  const placeX = position.includes('left') ? 'start' : (position.includes('right') ? 'end' : 'center');
  const placeY = position.includes('top') ? 'start' : (position.includes('bottom') ? 'end' : 'center');

  return (
    <button type="button" class="qc-thumbnail" onClick={() => onClick()} style={{ 'place-items': `${placeY} ${placeX}`}}>
      <img
        class="qc-thumbnail__image"
        src={presentation.thumbnail?.cdnUrl || presentation.thumbnail?.url}
        alt={`Thumbnail for ${presentation.title}`}
      />
      {widgetOptions.playIcon?.url ? (
        <img
            alt="Play"
            class="qc-thumbnail__play-button"
            src={widgetOptions.playIcon?.url}
            style={playIconStyle}
        />
      ) : (
        <div
            class="qc-thumbnail__play-button qc-thumbnail__play-button--default"
            dangerouslySetInnerHTML={{ __html: widgetOptions.playIcon?.url || playIcon }}
            style={playIconStyle}
        />
      )}
    </button>
  );
}
