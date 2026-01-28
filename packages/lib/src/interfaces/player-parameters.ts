export interface PlayerParameters {
  captions: string;
  debug: boolean;
  loop: boolean;
  playerConfigurationGuid: string;
  pv: 'pipls' | 'pipss' | 'sbs';
  quality: 'auto' | 'best' | '1440p' | '1080p' | '720p' | '480p' | '240p';
  reporting: boolean;
  reportingId: string;
  showControlPanel: boolean;
  sidebar: boolean;
  speech: string;
  speechTerm: string;
  start: number;
  volume: number;
}
