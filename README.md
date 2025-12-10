# README #

A Qumu Widget library that provides the following widgets:

- **PresentationWidget**

## How to use the Widget ##

```typescript
  <div id="widget-container"></div>

  <link rel="stylesheet" type="text/css" href="./your-assets-path/presentation-widget.css" />

  <script type="module">
    import { PresentationWidget } from '@enghouse-qumu/widget/presentation-widget.js';

    const presentationWidget = new PresentationWidget({
      // CSS selector for the container element where the widget will be rendered
      selector: '#widget-container',

      // Qumu instance host name
      host: 'my-instance.qumu.com',

      // The presentation GUID to load. Can be a smart search or a single presentation
      guid: 'AaBbCcDd123456',

      widgetOptions: {
        // Check the docs for available options
      },

      playerParameters: {
        // Check the docs for available options
      }
    });
  </script>
```
