import { render } from 'preact';
import { PresentationService } from '@/services/presentation.service';
import { ConfigurationService } from '@/services/configuration.service';
import { WidgetConfiguration } from '@/interfaces/widget-configuration';
import { Presentation } from '@/interfaces/presentation';
import { Deferred } from '@/utils/deferred';
import { PlayerComponent } from '@/components/player';

export class PresentationWidget {
  private readonly iframeDeferred = new Deferred<HTMLIFrameElement>();
  private readonly configurationService = new ConfigurationService();
  private readonly configuration: WidgetConfiguration;
  private readonly presentationService = new PresentationService();
  private presentation: Presentation | null = null;

  constructor(
    configuration: WidgetConfiguration,
  ) {
    this.configurationService.validate(configuration);
    this.configuration = this.configurationService.setDefaults(configuration);
    this.init();
  }

  getIframe(): Promise<HTMLIFrameElement> {
    return this.iframeDeferred.promise;
  }

  private async init() {
    try {
      this.presentation = await this.presentationService.getPresentation(this.configuration.guid, this.configuration.host);

      this.mount();
    } catch (err: unknown) {
      this.iframeDeferred.reject(err);
    }
  }

  private mount() {
    const container = document.querySelector(this.configuration.selector);

    if (!container) {
      throw new Error(`Element for selector "${this.configuration.selector}" not found`);
    }

    container.innerHTML = '';

    render(
      <div class="widget">
        <h3>{this.presentation?.title}</h3>
        <PlayerComponent
          presentation={this.presentation!}
          onIframeReady={this.iframeDeferred.resolve}
          options={this.configuration.widgetOptions}
        />
      </div>,
      container
    );
  }
}
