# Expand-and-Collapse Mobile Navigation

Adds an expand-and-collapse feature to your navigation menu on smaller screens.

<div id="plugin-note"></div>

## Getting Started

### 1. Add the markup to your Portal template.

Make sure that the `[data-nav-toggle]` value matches the ID of the `.nav-menu` section. To activate expand-and-collapse functionality, add the `.nav-collapse` class to the `.nav-wrap` element.

```html
<nav class="nav-wrap nav-collapse">
	<a class="logo" href="#">My Brand</a>
	<a class="nav-toggle" data-nav-toggle="#nav-menu" href="#">Menu</a>
	<div class="nav-menu" id="nav-menu">
		<ul class="nav">
			<li><a href="#">Home</a></li>
			<li><a href="#">About</a></li>
		</ul>
	</div>
</nav>
```

### 2. Initialize Astro.

Initialize Astro in a `portalAfterRender` event, after the content. And that's it, you're done. Nice work!

```js
window.addEventListener('portalAfterRender', function (event) {
	astro.init();
}, false);
```


## Options and Settings

Astro includes smart defaults and works right out of the box. But if you want to customize things, it also has a robust API that provides multiple ways for you to adjust the default options and settings.

### Global Settings

You can pass options and callbacks into Astro through the `init()` function:

```javascript
astro.init({
	selector: '[data-nav-toggle]', // Navigation toggle selector
	toggleActiveClass: 'active', // Class added to active dropdown toggles on small screens
	navActiveClass: 'active', // Class added to active dropdown content areas on small screens
	initClass: 'js-astro', // Class added to `<html>` element when initiated
	callback: function ( toggle, navID ) {} // Function that's run after a dropdown is toggled
});
```

*__Note:__ If you change the `selector`, you still need to include the `[data-nav-toggle]` attribute in order to pass in the selector for the navigation menu.*

### Use Astro events in your own scripts

You can also call Astro's navigation toggle event in your own scripts.

#### toggleNav()
Expand or collapse a navigation menu.

```javascript
astro.toggleNav(
	toggle, // Node that toggles the dropdown action. ex. document.querySelector('#toggle')
	navID, // ID of the navigation content wrapper. ex. '#nav-menu'
	options, // Classes and callbacks. Same options as those passed into the init() function.
	event // Optional, if a DOM event was triggered.
);
```

**Example**

```javascript
astro.toggleNav( null, '#nav-menu' );
```

#### destroy()
Destroy the current `astro.init()`. This is called automatically during the init function to remove any existing initializations.

```javascript
astro.destroy();
```