import { Presentation } from '@/interfaces/presentation';
import { WidgetOptions } from '@/interfaces/widget-options';
import { useI18n } from '@/i18n';
import Icon from '@/components/icon';

interface Props {
  onClick: () => void;
  presentation: Presentation;
  widgetOptions: Partial<WidgetOptions>;
}

export function ThumbnailComponent({ presentation, onClick, widgetOptions }: Readonly<Props>) {
  const i18n = useI18n();
  const position = widgetOptions.playIcon?.position || 'center';
  const placeX = position.includes('left') ? 'start' : (position.includes('right') ? 'end' : 'center');
  const placeY = position.includes('top') ? 'start' : (position.includes('bottom') ? 'end' : 'center');

  const clickHandler = () => {
    widgetOptions.onThumbnailClick ? widgetOptions.onThumbnailClick(presentation) : onClick();
  };

  return (
    <button type="button" class="qc-thumbnail" onClick={clickHandler} style={{ 'place-items': `${placeY} ${placeX}` }}>
      <span class="qc-sr-only">{i18n.t('common.PLAY_PRESENTATION', { title: presentation.title! })}</span>
      <img
        class="qc-thumbnail__image"
        src={presentation.thumbnail?.cdnUrl || presentation.thumbnail?.url}
        alt=""
      />
      {widgetOptions.playIcon?.url ? (
        <img
          alt=""
          class="qc-thumbnail__play-button"
          src={widgetOptions.playIcon?.url}
          style={{
            width: `${widgetOptions.playIcon!.width}px`,
            height: `${widgetOptions.playIcon!.height}px`
          }}
        />
      ) : (
        <Icon
          name="play"
          class="qc-thumbnail__play-button qc-thumbnail__play-button--default"
          width={widgetOptions.playIcon!.width}
          height={widgetOptions.playIcon!.height}
        />
      )}
    </button>
  );
}
