# Working with jQuery

jQuery is *not* bundled with your Portal. If you'd rather use jQuery than [work with native, modern JavaScript](/docs/read/extras/Modern_JS), you should load it using the [`m$.loadJS()` helper method](/docs/read/customizing/API#loadjs) and run your jQuery-dependent code as a callback.

Add this in Control Center under `Manage > Portal > Portal Settings` under one of the inline JavaScript sections.

```js
window.addEventListener('portalAfterRender', function () {

	// Load jQuery
	m$.loadJS('https://code.jquery.com/jquery-3.2.1.min.js', function () {
		// Your code goes here...
	});

}, false);
```