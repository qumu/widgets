import { Presentation } from '@/interfaces/presentation';
import { WidgetOptions } from '@/interfaces/widget-options';
import playIcon from '../../assets/play-icon.svg?raw';

interface Props {
  onClick: () => void;
  options: WidgetOptions;
  presentation: Presentation;
}

export function ThumbnailComponent({ presentation, onClick, options }: Readonly<Props>) {
  const playIconStyle: Record<string, string> = {};

  if (options.playIcon?.width) {
    playIconStyle['width'] = `${options.playIcon.width}px`;
  }

  if (options.playIcon?.height) {
    playIconStyle['height'] = `${options.playIcon.height}px`;
  }

  return (
    <button type="button" class="qc-thumbnail" onClick={() => onClick()}>
      <img
        class="qc-thumbnail__image"
        src={presentation.thumbnail?.cdnUrl || presentation.thumbnail?.url}
        alt={`Thumbnail for ${presentation.title}`}
      />
      {options.playIcon?.url ? (
        <img
            alt="Play"
            class="qc-thumbnail__play-button"
            src={options.playIcon?.url}
            style={playIconStyle}
        />
      ) : (
        <div
            class="qc-thumbnail__play-button qc-thumbnail__play-button--default"
            dangerouslySetInnerHTML={{ __html: options.playIcon?.url || playIcon }}
            style={playIconStyle}
        />
      )}
    </button>
  );
}
