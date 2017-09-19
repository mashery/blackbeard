# Expand-and-Collapse/Accordions

Add expand-and-collapse content and accordion menus to your Portal.

<div id="plugin-note"></div>

## Demo

### Basic

<div class="collapse" id="show-me">
	Now you see me, now you don't.
</div>

<p>
	<a class="collapse-toggle js-scroll-ignore" href="#show-me">
		<span class="collapse-text-show">Show +</span>
		<span class="collapse-text-hide">Hide -</span>
	</a>
</p>

### Accordion

<div>
	<p>
		<a class="collapse-toggle active js-scroll-ignore" data-group="accordion" href="#section1">
			Section 1
			<span class="collapse-text-show">+</span>
			<span class="collapse-text-hide">-</span>
		</a>
	</p>
	<div class="collapse active" id="section1">
		<h3 class="no-margin-top no-margin-bottom">Section 1</h3>
		<p>The quick, brown fox jumps over a lazy dog. <a href="#">DJs flock by when MTV</a> ax quiz prog. Junk MTV quiz graced by fox whelps. Bawds jog, flick quartz, vex nymphs.</p>
	</div>
	<p>
		<a class="collapse-toggle js-scroll-ignore" data-group="accordion" href="#section2">
			Section 2
			<span class="collapse-text-show">+</span>
			<span class="collapse-text-hide">-</span>
		</a>
	</p>
	<div class="collapse" id="section2">
		<h3 class="no-margin-top no-margin-bottom">Section 2</h3>
		<p>Waltz, bad nymph, for quick jigs vex! Fox nymphs grab quick-jived waltz. Brick quiz whangs jumpy veldt fox. Bright vixens jump; dozy fowl quack. Quick wafting zephyrs vex bold Jim. Quick zephyrs blow, vexing daft Jim. Sex-charged fop blew my junk TV quiz. How quickly daft jumping zebras vex. Two driven jocks help fax my big quiz.</p>
	</div>
	<p>
		<a class="collapse-toggle js-scroll-ignore" data-group="accordion" href="#section3">
			Section 3
			<span class="collapse-text-show">+</span>
			<span class="collapse-text-hide">-</span>
		</a>
	</p>
	<div class="collapse" id="section3">
		<h3 class="no-margin-top no-margin-bottom">Section 3</h3>
		<p>Quick, Baz, get my woven flax jodhpurs! "Now fax quiz Jack!" my brave ghost pled. Five quacking zephyrs jolt my wax bed. Flummoxed by job, kvetching W. zaps Iraq. Cozy sphinx waves quart jug of bad milk. A very bad quack might jinx zippy fowls.</p>
	</div>
</div>


## Getting Started

### 1. Add the markup to your HTML.

Add the `.collapse-toggle` class to your toggle element, and the `.collapse` class to your content. You also need to provide an `href` that matches the `id` of the content you want to expand-and-collapse.

```html
<a class="collapse-toggle" href="#show-me">
	<span class="collapse-text-show">Show +</span>
	<span class="collapse-text-hide">Hide -</span>
</a>
<div class="collapse" id="show-me">
	<p>Now you see me, now you don't.</p>
</div>
```

**Expanded by Default**

If you'd prefer to show content by default, include the `.active` class along with the `.collapse` and `.collapse-toggle` classes.

```html
<a class="collapse-toggle active" href="#hide-me">
	<span class="collapse-text-show">Show +</span>
	<span class="collapse-text-hide">Hide -</span>
</a>
<div class="collapse active" id="hide-me">
	<p>Hide me!</p>
</div>
```

**Accordions**

Houdini also supports expand-and-collapse accordion groups. Add a `[data-group]` attribute to every toggle in the accordion, and make sure they all have the same value. Houdini will sort out the rest.

```html
<a class="collapse-toggle active" data-group="accordion" href="#section1">
	Section 1
	<span class="collapse-text-show">+</span>
	<span class="collapse-text-hide">-</span>
</a>
<div class="collapse active" id="section1">
	<h3>Section 1</h3>
	<p>The quick, brown fox jumps over a lazy dog. DJs flock by when MTV ax quiz prog. Junk MTV quiz graced by fox whelps. Bawds jog, flick quartz, vex nymphs.</p>
</div>
<a class="collapse-toggle" data-group="accordion" href="#section2">
	Section 2
	<span class="collapse-text-show">+</span>
	<span class="collapse-text-hide">-</span>
</a>
<div class="collapse" id="section2">
	<h3>Section 2</h3>
	<p>Waltz, bad nymph, for quick jigs vex! Fox nymphs grab quick-jived waltz. Brick quiz whangs jumpy veldt fox. Bright vixens jump; dozy fowl quack. Quick wafting zephyrs vex bold Jim. Quick zephyrs blow, vexing daft Jim. Sex-charged fop blew my junk TV quiz. How quickly daft jumping zebras vex. Two driven jocks help fax my big quiz.</p>
</div>
<a class="collapse-toggle" data-group="accordion" href="#section3">
	Section 3
	<span class="collapse-text-show">+</span>
	<span class="collapse-text-hide">-</span>
</a>
<div class="collapse" id="section3">
	<h3>Section 3</h3>
	<p>Quick, Baz, get my woven flax jodhpurs! "Now fax quiz Jack!" my brave ghost pled. Five quacking zephyrs jolt my wax bed. Flummoxed by job, kvetching W. zaps Iraq. Cozy sphinx waves quart jug of bad milk. A very bad quack might jinx zippy fowls.</p>
</div>
```

*__Note:__ TinyMCE will strip out `[data-group]` attributes. It's very important that you never save a page with an accordion with TinyMCE enabled or it will remove the accordion functionality.*

### 2. Initialize Houdini.

Initialize Houdini in a `portalAfterRender` event. And that's it, you're done. Nice work!

```js
window.addEventListener('portalAfterRender', function (event) {
	houdini.init({
		selectorToggle: '.collapse-toggle'
	});
}, false);
```


## Options and Settings

Houdini includes smart defaults and works right out of the box. But if you want to customize things, it also has a robust API that provides multiple ways for you to adjust the default options and settings.

### Global Settings

You can pass options and callbacks into Houdini through the `init()` function:

```javascript
houdini.init({
	selectorToggle: '.collapse-toggle', // Collapse toggle selector
	selectorContent: '.collapse', // Collapse content selector
	toggleActiveClass: 'active', // Class added to active toggle elements
	contentActiveClass: 'active', // Class added to active content elements
	initClass: 'js-houdini', // Class added to `<html>` element when initiated
	stopVideo: true, // If true, stop any videos that are playing when content is collapsed
	callbackOpen: function ( content, toggle ) {}, // Function that's run after content is expanded
	callbackClose: function ( content, toggle ) {} // Function that's run after content is collapse
});
```

### Use Houdini events in your own scripts

You can also call the Houdini toggle event in your own scripts.

#### openContent()
Expand a closed content area.

```javascript
houdini.openContent(
	contentID, // The ID of the content area to expand. ex. '#content'
	toggle, // Node that toggles the expand and collapse action. ex. document.querySelector('#toggle') [optional]
	options // Classes and callbacks. Same options as those passed into the init() function. [optional]
);
```

**Examples**

```javascript
houdini.openContent( '#show-me' );
houdini.openContent( '#show-me-too', document.querySelector( 'a[href*="#show-me-too"]' ) );
```

#### closeContent()
Expand a closed content area.

```javascript
houdini.closeContent(
	contentID, // The ID of the content area to collapse. ex. '#content'
	toggle, // Node that toggles the expand and collapse action. ex. document.querySelector('#toggle') [optional]
	options // Classes and callbacks. Same options as those passed into the init() function. [optional]
);
```

**Examples**

```javascript
houdini.closeContent( '#hide-me' );
houdini.closeContent( '#hide-me-too', document.querySelector( 'a[href*="#show-me-too"]' ) );
```

#### destroy()
Destroy the current `houdini.init()`. This is called automatically during the init function to remove any existing initializations.

```javascript
houdini.destroy();
```