import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PresentationWidget, type WidgetConfiguration } from 'lib';
import 'lib/presentation-widget.css';

@customElement('presentation-widget')
export class PresentationWidgetComponent extends LitElement {
  @property({ type: Object }) configuration!: Omit<WidgetConfiguration, 'selector'>;

  private widget: PresentationWidget | null = null;

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    if (this.widget) {
      this.widget.destroy();
      this.widget = null;
    }
  }

  /**
   * Create a web component with a light DOM.
   */
  createRenderRoot() {
    return this;
  }

  firstUpdated() {
    const container = this.renderRoot.querySelector<HTMLDivElement>('#container');

    if (!container) {
      return;
    }

    PresentationWidget.create({
      selector: container,
      ...this.configuration,
    })
      .then((widget) => {
        this.widget = widget;
      })
      .catch((e) => console.error(e));
  }

  render() {
    return html`
      <div id="container"></div>`;
  }
}
