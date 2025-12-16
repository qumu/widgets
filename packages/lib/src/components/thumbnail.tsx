import { Presentation } from '@/interfaces/presentation';
import { WidgetOptions } from '@/interfaces/widget-options';
import PlayIcon from '@/icons/play.svg?react';

interface Props {
  onClick: () => void;
  presentation: Presentation;
  widgetOptions: Partial<WidgetOptions>;
}

export function ThumbnailComponent({ presentation, onClick, widgetOptions }: Readonly<Props>) {
  const position = widgetOptions.playIcon?.position || 'center';
  const placeX = position.includes('left') ? 'start' : (position.includes('right') ? 'end' : 'center');
  const placeY = position.includes('top') ? 'start' : (position.includes('bottom') ? 'end' : 'center');

  const clickHandler = () => {
    widgetOptions.onThumbnailClick ? widgetOptions.onThumbnailClick(presentation) : onClick();
  };

  return (
    <button type="button" class="qc-thumbnail" onClick={clickHandler} style={{ 'place-items': `${placeY} ${placeX}` }}>
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
          style={{
            width: `${widgetOptions.playIcon!.width}px`,
            height: `${widgetOptions.playIcon!.height}px`
          }}
        />
      ) : (
        <PlayIcon
          className="qc-icon qc-thumbnail__play-button qc-thumbnail__play-button--default"
          width={widgetOptions.playIcon!.width}
          height={widgetOptions.playIcon!.height}
        />
      )}
    </button>
  );
}
