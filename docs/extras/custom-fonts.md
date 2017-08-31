# Loading Custom Fonts

Most browsers do a bad job of loading web fonts. They will often display nothing while the font is downloading and parsing, leaving your users with a flash of invisible text, or in some cases, a page that never displays.

This is particularly pronounced on certain mobile browsers that have no timeout for when fonts fail to load.

As a best practice, you should display a system font by default and switch over to your custom font only after it has completed loading. While there is a spec for a native API to let us do this, it's not standard yet. Fortunately, [`fontFaceObserver.js` by Bram Stein](https://github.com/bramstein/fontfaceobserver) helps us do just that.

## Using `fontFaceObserver.js`

Add this in Control Center under `Manage > Portal > Portal Settings` under one of the inline JavaScript sections. Change the font file and font name to whatever typeface you're using.

```js
// Load the font file as normal
portalOptions.loadCSS = [
	'https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,400i,700',
	// Any other CSS files you have
];

window.addEventListener('portalBeforeInit', function () {
	// If the font is cached, automatically apply it
	// Otherwise, wait for it to load
	if (sessionStorage.getItem('portalFontsLoaded')) {
		document.documentElement.classList.add('fonts-loaded');
	} else {
		m$.loadJS('/files/fontfaceobserver.js', function () {
			var font = new FontFaceObserver('Source Sans Pro');
			font.load().then(function () {
				sessionStorage.addItem('portalFontsLoaded')
				document.documentElement.classList.add('fonts-loaded');
			});
		});
	}
}, false);
```

Then, in your CSS file, make the font that you use conditional on the `.fonts-loaded` class.

```css
body {
    font-family: Helvetica Neue, Arial, sans-serif;
}

.fonts-loaded body {
    font-family: 'Source Sans Pro', sans-serif;
}
```