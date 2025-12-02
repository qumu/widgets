import { useEffect, useRef, useState } from 'preact/hooks';
import { WidgetOptions } from '@/interfaces/widget-options';
import { Presentation } from '@/interfaces/presentation';
import { ThumbnailComponent } from './thumbnail';
import { PlayerComponent } from './player';
import closeIcon from '../../assets/close.svg?raw';

interface Props {
  presentation: Presentation;
  onIframeReady?: (iframe: HTMLIFrameElement) => void;
  options: WidgetOptions;
}

export function DialogComponent({ presentation, onIframeReady, options }: Props) {
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
        presentation={presentation}
        onClick={() => setShowDialog(true)}
        options={options}
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
          <PlayerComponent
              presentation={presentation}
              onIframeReady={onIframeReady}
              options={options}
          />
          <button
              class="qc-dialog__close-button"
              onClick={closeDialog}
              dangerouslySetInnerHTML={{ __html: closeIcon }}
          ></button>
        </dialog>
      )}
    </div>
  );
}
