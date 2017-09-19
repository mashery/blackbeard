# Event Hooks

Blackbeard emits custom JavaScript events that you can hook into to run other scripts. Use `addEventListener()` on the `window` element to listen for Blackbeard events.

For example, here's how to open an alert window every time a page is rendered.

```js
window.addEventListener('portalAfterRender', function (event) {
	alert('The Portal was rendered!');
}, false);
```

## Events

- `portalLoaded` runs after the Portal app is loaded but before it's been initalized.
- `portalBeforeInit` runs before the Portal is initialized.
- `portalAfterInit` runs after the Portal is initialized.
- `portalBeforeRender` runs before the Portal is rendered.
- `portalAfterRender` runs after the Portal is rendered.
- `portalBeforeRenderAjax` runs before an Ajax page load.
- `portalAfterRenderAjax` runs after an Ajax page load.

## Emitting your own custom events

Blackbeard also includes [a JavaScript API for emitting your own custom events](/docs/read/customizing/API#emitevent).