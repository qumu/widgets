import { WidgetOptions } from './widget-options';
import { PlayerParameters } from './player-parameters';

type RecursiveRecord = {
  [key: string]: string | RecursiveRecord;
};

export interface WidgetConfiguration {
  guid: string;
  host: string;
  locales?: RecursiveRecord;
  playerParameters?: Partial<PlayerParameters>;
  selector: string | HTMLElement;
  style?: Partial<{
    borderRadius: string;
    closeButton: Partial<{
      activeBackgroundColor: string;
      activeColor: string;
      backgroundColor: string;
      boxShadow: string;
      color: string;
      hoverBackgroundColor: string;
      hoverColor: string;
      iconSize: string;
      padding: string;
    }>;
    dialog: Partial<{
      backdropColor: string;
      backgroundColor: string;
      border: string;
      borderRadius: string;
      maxWidth: string;
      padding: string;
      width: string;
    }>;
    height: string;
    playButton: Partial<{
      activeBackgroundColor: string;
      activeColor: string;
      backgroundColor: string;
      color: string;
      hoverBackgroundColor: string;
      hoverColor: string;
      margin: string;
      padding: string;
    }>;
    width: string;
    thumbnail: Partial<{
      imageFit: string;
    }>;
    notFound: Partial<{
      backgroundColor: string;
      border: string;
      color: string;
      iconColor: string;
    }>;
  }>;
  sortBy?: string;
  sortOrder?: 'ASCENDING' | 'DESCENDING';
  widgetOptions?: Partial<WidgetOptions>;
}
