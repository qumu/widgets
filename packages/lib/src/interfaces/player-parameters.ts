export interface PlayerParameters {
  captions: string;
  debug: boolean;
  loop: boolean;
  pv: 'pipls' | 'pipss' | 'sbs';
  quality: 'auto' | 'best' | '1440p' | '1080p' | '720p' | '480p' | '240p';
  showControlPanel: boolean;
  sidebar: boolean;
  speech: string;
  speechTerm: string;
  start: number;
  volume: number;
  reporting: boolean;
  reportingId: string;
}
