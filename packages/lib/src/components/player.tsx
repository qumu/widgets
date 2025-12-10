import { useEffect, useRef, useState } from 'preact/hooks';
import { Presentation } from '@/interfaces/presentation';
import { WidgetOptions } from '@/interfaces/widget-options';
import { ThumbnailComponent } from './thumbnail';
import { PlayerParameters } from '@/interfaces/player-parameters';

interface Props {
  presentation: Presentation;
  onIframeReady?: (iframe: HTMLIFrameElement) => void;
  playerParameters: Partial<PlayerParameters>;
  widgetOptions: WidgetOptions;
}

export function PlayerComponent({ presentation, onIframeReady, widgetOptions, playerParameters }: Readonly<Props>) {
  const [showIframe, setShowIframe] = useState(['inline-autoload', 'inline-autoplay', 'modal'].includes(widgetOptions.playbackMode));
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!showIframe || !iframeRef.current) {
      return;
    }

    const iframe = iframeRef.current;

    const handleLoad = () => {
      onIframeReady?.(iframe);
    };

    iframe.addEventListener('load', handleLoad);

    return () => {
      iframe.removeEventListener('load', handleLoad);
    };
  }, [showIframe]);

  const url = new URL(presentation.player || '');
  const autoplay = ['inline-autoplay', 'inline', 'modal'].includes(widgetOptions.playbackMode);

  url.searchParams.set('autoplay', autoplay.toString());

  Object.entries(playerParameters).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  if (widgetOptions.playerConfigurationGuid) {
    url.searchParams.set('playerConfigurationGuid', widgetOptions.playerConfigurationGuid);
  }

  const iframe = (
    <iframe
      ref={iframeRef}
      src={url.toString()}
      width="100%"
      height="100%"
      allow="autoplay; fullscreen"
      title="Qumu Player"
      class="qc-player"
    />
  );

  const thumbnail = (
    <ThumbnailComponent
      presentation={presentation}
      onClick={() => setShowIframe(true)}
      widgetOptions={widgetOptions}
    />
  )

  return showIframe ? iframe : thumbnail;
}
