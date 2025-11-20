export interface PlayerParameters {
  captions: string;
  debug: boolean;
  loop: boolean;
  pv: 'pipls' | 'pipss' | 'sbs';
  quality: string;
  showControlPanel: boolean;
  sidebar: boolean;
  speech: string;
  speechTerm: string;
  start: number;
  volume: number;
  reporting: boolean;
  reportingId: string;
}
