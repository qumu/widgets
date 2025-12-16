import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PresentationWidget, type WidgetConfiguration } from 'lib';
import 'lib/presentation-widget.css';

@customElement('presentation-widget')
export class PresentationWidgetComponent extends LitElement {
  @property({ type: Object })
  configuration!: Omit<WidgetConfiguration, 'selector'>;

  private widget: PresentationWidget | null = null;

  /**
   * Light DOM so widget CSS works
   */
  createRenderRoot() {
    return this;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.destroyWidget();
  }

  updated(changed: Map<string, unknown>) {
    if (!changed.has('configuration')) {
      return;
    }

    // First render OR configuration changed
    this.recreateWidget();
  }

  private recreateWidget() {
    const container = this.querySelector<HTMLDivElement>('#container');

    if (!container) return;

    this.destroyWidget();

    PresentationWidget.create({
      selector: container,
      ...this.configuration,
    })
      .then((widget) => {
        this.widget = widget;
      })
      .catch(console.error);
  }

  private destroyWidget() {
    if (this.widget) {
      this.widget.destroy();
      this.widget = null;
    }
  }

  render() {
    return html`<div id="container"></div>`;
  }
}
