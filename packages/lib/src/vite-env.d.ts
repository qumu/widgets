/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

export {};

declare global {
  interface Window {
    __QUMU_WIDGET_TELEMETRY__?: boolean;
  }
}
