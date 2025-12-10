import { useEffect, useRef, useState } from 'preact/hooks';
import { WidgetOptions } from '@/interfaces/widget-options';
import { Presentation } from '@/interfaces/presentation';
import { ThumbnailComponent } from './thumbnail';
import { PlayerComponent } from './player';
import closeIcon from '../../assets/close.svg?raw';
import { PlayerParameters } from '@/interfaces/player-parameters';

interface Props {
  presentation: Presentation;
  onIframeReady?: (iframe: HTMLIFrameElement) => void;
  playerParameters: Partial<PlayerParameters>;
  widgetOptions: WidgetOptions;
}

export function DialogComponent({ presentation, onIframeReady, widgetOptions, playerParameters }: Readonly<Props>) {
  const [showDialog, setShowDialog] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!showDialog) {
      return;
    }

    dialogRef.current?.showModal();
  }, [showDialog]);

  const closeDialog = () => {
    dialogRef.current?.close();
    setShowDialog(false);
  };

  if (!presentation) {
    return '';
  }

  return (
    <div class="qc-dialog">
      <ThumbnailComponent
        onClick={() => setShowDialog(true)}
        presentation={presentation}
        widgetOptions={widgetOptions}
      />

      {showDialog && (
        <dialog
          ref={dialogRef}
          onClick={(e) => {
            if (e.target === dialogRef.current) {
              closeDialog();
            }
          }}
          onClose={() => setShowDialog(false)}
          style={{ 'aspect-ratio': `${presentation?.mediaDisplayWidth} / ${presentation?.mediaDisplayHeight}` }}
        >
          <button
              type="button"
              class="qc-dialog__close-button"
              onClick={closeDialog}
              dangerouslySetInnerHTML={{ __html: closeIcon }}
          ></button>
          <PlayerComponent
              presentation={presentation}
              onIframeReady={onIframeReady}
              playerParameters={playerParameters}
              widgetOptions={widgetOptions}
          />
        </dialog>
      )}
    </div>
  );
}
