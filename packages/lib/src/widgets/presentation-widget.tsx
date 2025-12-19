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

export class PresentationWidget {
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

  async init(): Promise<void> {
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

    render(
      <div
        class="qc-widget qc-presentation-widget"
        style={{ 'aspect-ratio': aspectRatio }}
      >
        {this.presentation ? (
          this.configuration.widgetOptions?.playbackMode === 'modal' ? (
            <DialogComponent
              aspectRatio={aspectRatio}
              presentation={this.presentation}
              playerParameters={this.configuration.playerParameters!}
              widgetOptions={this.configuration.widgetOptions as WidgetOptions}
            />
          ) : (
            <PlayerComponent
              presentation={this.presentation}
              playerParameters={this.configuration.playerParameters!}
              widgetOptions={this.configuration.widgetOptions as WidgetOptions}
            />
          )
        ) : (
          <NotFoundComponent/>
        )}
      </div>,
      container
    );
  }
}

export default PresentationWidget;
