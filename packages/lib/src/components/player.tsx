import { useEffect, useRef, useState } from 'preact/hooks';
import { Presentation } from '@/interfaces/presentation';
import { WidgetOptions } from '@/interfaces/widget-options';

interface Props {
  presentation: Presentation;
  onIframeReady?: (iframe: HTMLIFrameElement) => void;
  options?: WidgetOptions;
}

export function PlayerComponent({ presentation, onIframeReady, options }: Readonly<Props>) {
  const [showIframe, setShowIframe] = useState(options?.autoload ?? false);
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

  if (!presentation) {
    return '';
  }

  const url = new URL(presentation.player!);

  if (options) {
    url.searchParams.set('autoplay', options.autoplay!.toString());
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
    />
  );

  const thumbnail = (
    <button type="button" onClick={() => setShowIframe(true)}>
      <img src={presentation.thumbnail?.cdnUrl || presentation.thumbnail?.url}
           alt={`Thumbnail for ${presentation.title}`}/>
    </button>
  )

  return showIframe ? iframe : thumbnail;
}
