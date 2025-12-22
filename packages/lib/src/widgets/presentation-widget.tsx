import { render } from 'preact';
import { PresentationService } from '@/services/presentation.service';
import { ConfigurationService } from '@/services/configuration.service';
import { WidgetConfiguration } from '@/interfaces/widget-configuration';
import { Presentation } from '@/interfaces/presentation';
import { WidgetOptions } from '@/interfaces/widget-options';
import { DialogComponent } from '@/components/dialog';
import { PlayerComponent } from '@/components/player';
import './presentation-widget.scss';
import { NotFoundComponent } from '@/components/not-found';
import { createI18n } from '@/i18n';
import { version } from '../../../../package.json' with { type: 'json' };

export class PresentationWidget {
  version: string = version;

  private readonly configurationService = new ConfigurationService();
  private readonly configuration: WidgetConfiguration;
  private readonly presentationService = new PresentationService();
  private presentation: Presentation | null = null;
  private container: Element | null = null;
  private destroyed = false;

  static async create(
    configuration: WidgetConfiguration,
  ): Promise<PresentationWidget> {
    const widget = new PresentationWidget(configuration);

    // send telemetry if not disabled by the end user
    if (globalThis.window.__QUMU_WIDGET_TELEMETRY__ ?? true) {
      widget.sendTelemetry()
    }

    await widget.init();

    return widget;
  }

  constructor(
    initialConfiguration: WidgetConfiguration,
  ) {
    this.configuration = this.configurationService.createConfiguration(initialConfiguration);
  }

  destroy() {
    if (this.destroyed) {
      return;
    }

    if (this.container) {
      // Unmount the widget properly
      render(null, this.container);

      // Clear container HTML
      this.container.innerHTML = '';
    }

    // Prevent future usage
    this.presentation = null;
    this.destroyed = true;
  }

  private async init(): Promise<void> {
    try {
      this.presentation = await this.presentationService.getPresentation(this.configuration.guid, this.configuration.host, this.configuration.sortBy, this.configuration.sortOrder);
    } catch (err) {
      console.error(err);
    } finally {
      this.mount();
    }
  }

  private mount() {
    const container = this.configuration.selector instanceof HTMLElement
      ? this.configuration.selector
      : document.querySelector<HTMLElement>(this.configuration.selector);

    if (!container) {
      throw new Error(`Element for selector "${this.configuration.selector}" not found`);
    }

    createI18n(container, this.configuration.locales);

    this.container = container;
    container.innerHTML = '';

    const aspectRatio = this.presentation?.mediaDisplayWidth && this.presentation?.mediaDisplayHeight
      ? `${this.presentation.mediaDisplayWidth} / ${this.presentation.mediaDisplayHeight}`
      : '16 / 9';

    let content;

    if (!this.presentation) {
      content = <NotFoundComponent/>;
    } else if (this.configuration.widgetOptions?.playbackMode === 'modal') {
      content = (
        <DialogComponent
          aspectRatio={aspectRatio}
          presentation={this.presentation}
          playerParameters={this.configuration.playerParameters!}
          widgetOptions={this.configuration.widgetOptions as WidgetOptions}
        />
      );
    } else {
      content = (
        <PlayerComponent
          presentation={this.presentation}
          playerParameters={this.configuration.playerParameters!}
          widgetOptions={this.configuration.widgetOptions as WidgetOptions}
        />
      );
    }

    render(
      <div
        class="qc-widget qc-presentation-widget"
        style={{ 'aspect-ratio': aspectRatio }}
      >
        {content}
      </div>,
      container
    );
  }

  private sendTelemetry() {
    const telemetryConfig: any = {
      guid: this.configuration.guid,
      host: this.configuration.host,
      ...(this.configuration.playerParameters && Object.keys(this.configuration.playerParameters).length && { playerParameters: this.configuration.playerParameters }),
      sortBy: this.configuration.sortBy,
      sortOrder: this.configuration.sortOrder,
      type: 'presentation',
      version,
      widgetOptions: {
        ...this.configuration.widgetOptions,
        onIframeLoad: this.configuration.widgetOptions?.onIframeLoad ? true : undefined,
        onThumbnailClick: this.configuration.widgetOptions?.onThumbnailClick ? true : undefined,
      }
    };

    navigator.sendBeacon(`https://${this.configuration.host}/widgets-telemetry`, JSON.stringify(telemetryConfig));
  }
}

export default PresentationWidget;
