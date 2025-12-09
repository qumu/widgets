import { useEffect, useRef, useState } from 'preact/hooks';
import { Presentation } from '@/interfaces/presentation';
import { WidgetOptions } from '@/interfaces/widget-options';
import { ThumbnailComponent } from './thumbnail';
import { PlayerParameters } from '@/interfaces/player-parameters';

interface Props {
  presentation: Presentation;
  onIframeReady?: (iframe: HTMLIFrameElement) => void;
  options: WidgetOptions;
  playerParameters: Partial<PlayerParameters>;
}

export function PlayerComponent({ presentation, onIframeReady, options, playerParameters }: Readonly<Props>) {
  const [showIframe, setShowIframe] = useState(['inline-autoload', 'inline-autoplay', 'modal'].includes(options.playbackMode));
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
  const autoplay = ['inline-autoplay', 'inline', 'modal'].includes(options.playbackMode);

  url.searchParams.set('autoplay', autoplay.toString());

  Object.entries(playerParameters).forEach(([key, value]) => {
    if (key === 'volume') {
      url.searchParams.set(key, `${(value as number) * 100}`);
    } else {
      url.searchParams.set(key, String(value));
    }
  });

  if (options.playerConfigurationGuid) {
    url.searchParams.set('playerConfigurationGuid', options.playerConfigurationGuid);
  }

  const iframe = (
    <iframe
      ref={iframeRef}
      src={url.toString()}
      width="100%"
      height="100%"
      allow="autoplay; fullscreen"
      frameBorder="0"
      title="Qumu Player"
      class="qc-player"
    />
  );

  const thumbnail = (
    <ThumbnailComponent
      presentation={presentation}
      onClick={() => setShowIframe(true)}
      options={options}
    />
  )

  return showIframe ? iframe : thumbnail;
}
