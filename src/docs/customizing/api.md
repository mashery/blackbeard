# JavaScript API

Blackbeard includes smart defaults and simple options and settings to make it easy for you to configure and customize your Portal.

But for developers who want more fine-grained control and customization, it also provides a robust JavaScript API that you can use to extend functionality with your own scripts.

All of Blackbeard's APIs are namespaced under the `m$` global variable

## `loadJS()`
Load a JavaScript file asynchronously. Adapted from [loadJS by Filament Group](https://github.com/filamentgroup/loadJS/).

Pass in the file source as an argument, and an optional callback function to run after load. If the file already exists (for example, on subsequent Ajax page loads), the callback will run instantly.

If the file needs to be reexecuted on page loads, you can force the file to redownload by passing in the `reload` argument as `true`.

```js
/**
 * @param  {String}   src       URL of script to load.
 * @param  {Function} callback  Callback to run on completion.
 * @return {String}             The script URL.
 */
m$.loadJS(src, callback, reload);

// Example
m$.loadJS('/files/myscript.js');

// With a callback
m$.loadJS('/files/myscript.js', function () {
	myScript.init();
});

// For redownload
m$.loadJS('/files/myscript.js', null, true);
```

`m$.loadJS()` can also be used for dependency management by calling it again as a callback after a file loads.

```js
m$.loadJS('/files/myscript.js', function () {
	m$.loadJS('/files/anotherscript.js');
});
```

## `loadCSS()`
Load a CSS file asynchronously. Adapted from [loadCSS() by Filament Group](https://github.com/filamentgroup/loadCSS).

Pass in the URL to the CSS file as an argument. If you want to load it before a specific file in the DOM for cascading purposes, or have a specific media type, you can optionally pass those in as arguments.

```js
/**
 * @param {String} href    The URL for your CSS file
 * @param {Node}   before  Element to use as a reference for injecting the <link> [optional]
 * @param {String} media   Stylesheet media type [optional, defaults to 'all']
 */
m$.loadCSS(href, before, media);

// Example
m$.loadCSS('/files/mystyles.css');
```

## `onloadCSS()`
Detect when a CSS file is loaded and run a callback. Adapted from [onloadCSS() by Filament Group](https://github.com/filamentgroup/loadCSS).

Pass in the stylesheet to detect as the first argument, and the callback as the second. Works in conjunction with `m$.loadCSS()`.

```js
/**
 * @param {Node}     ss        The stylesheet
 * @param {Function} callback  The callback to run
 */
m$.onloadCSS(ss, callback);

// Example
var css = m$.loadCSS('/files/mystyles.css');
m$.onloadCSS(css, function () {
	console.log('My CSS loaded!');
});
```

## `sanitizeClass()`
Sanitize a string for use as a class or ID. Removes spaces and other invalid characters.

Pass in the string to use as an argument, and optionally, a prefix to apply before it.

```js
/**
 * @param {String} id      The string to convert into a class
 * @param {String} prefix  A prefix to use before the class [optional]
 */
m$.sanitizeClass(id, prefix);

// Example
var id = m$.sanitizeClass('Can you TUr34 this into an id?'); // returns "can-you-tur34-this-into-an-id-"

// With prefix
var id = m$.sanitizeClass('Can you TUr34 this into an id?', 'docs-pages'); // returns "docs-pages-can-you-tur34-this-into-an-id-"
```

## `inject()`
Inject HTML elements into the `<head>`.

Pass in the type of element as the first argument, and an object of attributes as the second. The key is attribute name, and the value is it's value.

```js
/**
 * @param {String} type The HTML element type
 * @param {Object} atts The attributes and values for the element
 */
m$.inject(type, atts);

// Example
// Note: This specific example done already by the Portal if you portalOptions.responsive is `true` (the default).
m$.inject('meta', {
	name: 'viewport',
	content: 'width=device-width, initial-scale=1.0'
});
```

## `resetOptions()`
Reset the global `portalOptions` variable.

This wipes out any existing preset values, and is useful if you're attempting to re-render the Portal with an entirely different set of options.

```js
m$.resetOptions();
```

## `setOptions()`
Merge user options into Portal settings.

This runs automatically when the Portal first initializes. If you update any `portalOptions` after the Portal loads, you can use this to update settings for subsequent renders.

```js
/**
 * @param {Object} options  User options to merge into defaults
 */
m$.setOptions(options);

// Example
portalOptions.logo = '<img height="44" width="180" alt="Mashery" src="https://support.mashery.com/files/tibco-mashery.jpg">';
m$.setOptions(portalOptions);
```

## `emitEvent()`
Emit a custom event. This is a custom wrapper around the browser-native [CustomEvent API](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent).

Pass in your event name to simply emit an event. If you'd like to include custom event details, optionally pass in an object with the `details` key. You can also specify an element to emit the event on. By default, it runs on the `window`.

```js
/**
 * @param {String} eventName  The name of the event to emit
 * @param {Object} options    Options for the event
 * @param {Node}   elem       The element to dispatch the event on [optional - defaults to window]
 */
m$.emitEvent(eventName, options, elem);

// Example
m$.emitEvent('myCustomEvent');

// Listening for an event
window.addEventListener('myCustomEvent', function () {
	console.log('My custom event ran!');
}, false);

// With Details
m$.emitEvent('anotherCustomEvent', {
	details: {
		something: 'a value',
		another: true,
		answer: 42
	}
});

// Accessing details in the event listener
window.addEventListener('myCustomEvent', function (event) {
	console.log(event.details);
	var something = event.details.something;
	var another = event.details.another;
	var answerToTheLifeTheUniverseAndEverything = event.details.answer;
}, false);
```

## `click()`
Simulate a browser click event. Pass in the clicked element as an argument.

```js
/**
 * @param {Element} elem  the element to simulate a click on
 */
var click(elem);

// Example
var button = document.querySelector('#my-button');
click(button);
```

## `fixLocation()`
Jump to anchor or adjust focus when rendering is complete.

This is done automatically after rendering is complete, but if you inject content or manually update the URL with a hash value, you can run `m$.fixLocation()` to set focus on the correct element.

```js
m$.fixLocation();
```

## `renderPortal()`
Re-render the Portal. If render was triggered by an Ajax event that may require new files to be downloaded, or existing ones to be redownloaded or rerun, pass in `true` as an argument.

```js
/**
 * @param {Boolean} ajax  If true, the page is being loaded via Ajax
 */
m$.renderPortal(ajax);

// Example
m$.renderPortal();

// Example that triggers file downloads
m$.renderPortal(true);
```