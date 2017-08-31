# Event Hooks

Blackbeard emits custom JavaScript events that you can hook into to run other scripts. Use `addEventListener()` on the `window` element to listen for Blackbeard events.

For example, here's how to open an alert window every time a page is rendered.

```js
window.addEventListener('portalRenderAfter', function (event) {
	alert('The Portal was rendered!');
}, false);
```

## Events

- `portalBeforeInit` runs before the Portal is initialized.
- `portalAfterInit` runs after the Portal is initialized.
- `portalBeforeRender` runs before the Portal is rendered.
- `portalAfterRender` runs after the Portal is rendered.
- `portalBeforeRenderAjax` runs before an Ajax page load.
- `portalAfterRenderAjax` runs after an Ajax page load.
- `portalBeforeRenderLayout` runs before the layout is rendered.
- `portalAfterRenderLayout` runs after the layout is rendered.
- `portalBeforeRenderUserNav` runs before the user navigation is rendered.
- `portalAfterRenderUserNav` runs after the user navigation is rendered.
- `portalBeforeRenderPrimaryNav` runs before the primary navigation is rendered.
- `portalAfterRenderPrimaryNav` runs after the primary navigation is rendered.
- `portalBeforeRenderMain` runs before the main content area is rendered.
- `portalAfterRenderMain` runs after the main content area is rendered.
- `portalBeforeRenderSecondaryNav` runs before the secondary navigation is rendered.
- `portalAfterRenderSecondaryNav` runs after the secondary navigation is rendered.
- `portalBeforeRenderFooter` runs before the footer is rendered.
- `portalAfterRenderFooter` runs after the footer is rendered.

## Emitting your own custom events

Blackbeard also includes [a JavaScript API for emitting your own custom events](/docs/read/api).