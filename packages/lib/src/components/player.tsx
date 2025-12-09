import { useEffect, useRef, useState } from 'preact/hooks';
import { Presentation } from '@/interfaces/presentation';
import { WidgetOptions } from '@/interfaces/widget-options';
import { ThumbnailComponent } from './thumbnail';

interface Props {
  presentation: Presentation;
  onIframeReady?: (iframe: HTMLIFrameElement) => void;
  options: WidgetOptions;
}

export function PlayerComponent({ presentation, onIframeReady, options }: Readonly<Props>) {
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
  const autoplay = options.playbackMode === 'inline-autoplay' || options.playbackMode === 'modal';

  url.searchParams.set('autoplay', autoplay.toString());

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
