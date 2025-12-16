import { render } from 'preact';
import { PresentationService } from '@/services/presentation.service';
import { ConfigurationService } from '@/services/configuration.service';
import { WidgetConfiguration } from '@/interfaces/widget-configuration';
import { Presentation } from '@/interfaces/presentation';
import { WidgetOptions } from '@/interfaces/widget-options';
import { DialogComponent } from '@/components/dialog';
import { PlayerComponent } from '@/components/player';
import './presentation-widget.scss';

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

    return widget.init();
  }

  constructor(
    initialConfiguration: WidgetConfiguration,
  ) {
    this.configuration = this.configurationService.validateAndSanitize(initialConfiguration);
    this.configuration = this.configurationService.setDefaults(this.configuration);
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

  async init(): Promise<PresentationWidget> {
    this.presentation = await this.presentationService.getPresentation(this.configuration.guid, this.configuration.host);
    this.mount();

    return this;
  }

  private mount() {
    const container = this.configuration.selector instanceof HTMLElement
      ? this.configuration.selector
      : document.querySelector(this.configuration.selector);

    if (!container) {
      throw new Error(`Element for selector "${this.configuration.selector}" not found`);
    }

    this.container = container;
    container.innerHTML = '';

    render(
      <div
        class="qc-widget qc-presentation-widget"
        style={{ 'aspect-ratio': `${this.presentation?.mediaDisplayWidth} / ${this.presentation?.mediaDisplayHeight}` }}
      >
        {this.configuration.widgetOptions?.playbackMode === 'modal' ? (
          <DialogComponent
              presentation={this.presentation!}
              playerParameters={this.configuration.playerParameters!}
              widgetOptions={this.configuration.widgetOptions as WidgetOptions}
          />
        ) : (
          <PlayerComponent
              presentation={this.presentation!}
              playerParameters={this.configuration.playerParameters!}
              widgetOptions={this.configuration.widgetOptions as WidgetOptions}
          />
        )}
      </div>,
      container
    );
  }
}

export default PresentationWidget;
