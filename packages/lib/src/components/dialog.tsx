import { useEffect, useRef, useState } from 'preact/hooks';
import { WidgetOptions } from '@/interfaces/widget-options';
import { Presentation } from '@/interfaces/presentation';
import { ThumbnailComponent } from './thumbnail';
import { PlayerComponent } from './player';
import { PlayerParameters } from '@/interfaces/player-parameters';
import CloseIcon from '@/icons/close.svg?react';

interface Props {
  presentation: Presentation;
  playerParameters: Partial<PlayerParameters>;
  widgetOptions: Partial<WidgetOptions>;
}

export function DialogComponent({ presentation, widgetOptions, playerParameters }: Readonly<Props>) {
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
          >
            <CloseIcon className="qc-icon"/>
          </button>
          <PlayerComponent
              presentation={presentation}
              playerParameters={playerParameters}
              widgetOptions={widgetOptions}
          />
        </dialog>
      )}
    </div>
  );
}
