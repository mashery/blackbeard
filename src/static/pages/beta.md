**I need you to break things.**

Before this goes in front of actual customers, we need to make sure it's free of bugs and that we've accounted for common use cases. There are two different ways you can get involved:

1. Play around with this staging site and make sure everything works the way it's supposed to.
2. Set up Blackbeard on your own Portal and dig into the more advanced features.

Whichever option you chose, I'm grateful for the help! (*After you've poked around, please send me feedback by email or on HipChat.*)

## 1. Testing this demo site.

A few things you can do:

- [ ] Create Pages
- [ ] Create Documentation (*please use the `tests` directory to house all test docs*)
- [ ] Setup API Plans and Packages
- [ ] Register Keys and Apps
- [ ] Edit and Delete Keys and Apps
- [ ] Register Accounts
- [ ] Remove Accounts
- [ ] Change your email address and password
- [ ] Setup IO Docs definitions

*__Note:__ please avoid changing anything under `Manage > Portal > Portal Settings`. You could potentially break the JS rendering engine, the navigation structure, and the theme changer. To test more robust features, skip to option 2.*

## 2. Set up your own instance.

If you want to experiment with customizing [labels](/docs/read/customizing/Labels), creating [templates](/docs/read/customizing/Templates), and other advanced features, you'll need to set up your own instance of Blackbeard.

If you don't have a Portal instance to use, reach out to me and I'll get you a staging area.

*__Note:__ To make sure you always have the latest version of the beta files, please treat Staging CS1 as a faux CDN and load your files directly from it.*

### Setup your JavaScript

**Header JS File**

```
https://stagingcs1.mashery.com/files/placeholders.min.beta.js
```

**Body JS File**

```
https://stagingcs1.mashery.com/files/app.min.beta.js
```

**Body JS Inline**

```js
// Initialize the portal after the file loads
// The event listener hack is required because the inline JS loads *before* the external file does
window.addEventListener('portalLoaded', function () {
	m$.init(portalOptions);
}, false);
```

### Pick your theme

#### Default

Add this external CSS file, or <a href="/files/default.css" download>download the unminified source file</a> if you want to make changes.

```
https://stagingcs1.mashery.com/files/default.min.beta.css
```

And this inline JavaScript to create full width layouts.

```js
portalOptions.templates.page = function () {
	if (mashery.globals.pageFullWidth) {
		return	'<div class="main content" id="main">' +
					'{{content.main}}' +
				'</div>';
	} else if (mashery.globals.pageWide) {
		return	'<div class="main container content" id="main">' +
					'<h1>{{content.heading}}</h1>' +
					'{{content.main}}' +
				'</div>';
	} else {
		return	'<div class="main container container-small content" id="main">' +
					'<h1>{{content.heading}}</h1>' +
					'{{content.main}}' +
				'</div>';
	}
};

window.addEventListener('portalBeforeRender', function () {
	if (mashery.globals.pageFullWidth) {
		document.documentElement.classList.add('full-width');
	} else {
		document.documentElement.classList.remove('full-width');
	}
}, false);
```

#### Blackbeard

Add this external CSS file, or <a href="/files/blackbeard.css" download>download the unminified source file</a> if you want to make changes.

```
https://stagingcs1.mashery.com/files/blackbeard.min.beta.css
```

And this inline JavaScript to change the layout.

```js
portalOptions.templates.userNav = null;

portalOptions.templates.primaryNav = function () {
	var template =
		'<div class="nav-primary nav-wrap nav-collapse" id="nav-primary">' +
			'<div class="container padding-top-small padding-bottom-small">' +
				'<a id="logo" class="logo margin-bottom" href="/">{{content.logo}}</a>' +
				'<a role="button" class="nav-toggle" id="nav-primary-toggle" data-nav-toggle="#nav-primary-menu" href="#">{{content.menuToggle}}</a>' +
				'<div class="nav-menu" id="nav-primary-menu">' +
					'<ul class="nav" id="nav-primary-list">' +
						'{{content.navItemsPrimary}}' +
					'</ul>' +
					'<ul class="nav-user-list" id="nav-user-list">' +
						'{{content.navItemsUser}}' +
					'</ul>' +
					'{{content.searchForm}}' +
					(mashery.contentType === 'docs' ? '<h2 class="margin-top">In The Docs</h2><ul class="nav-docs" id="nav-docs">{{content.secondary}}</ul>' : '') +
				'</div>' +
			'</div>' +
		'</div>';
	return template;
};

portalOptions.templates.docs =
	'<div class="main container" id="main">' +
		'<h1>{{content.heading}}</h1>' +
		'{{content.main}}' +
	'</div>';

portalOptions.templates.layout =
	'<div class="row row-no-padding clearfix">' +
		'<div class="grid-fourth">' +
			'<a class="screen-reader screen-reader-focusable" href="#main">Skip to content</a>' +
			'{{layout.navPrimary}}' +
		'</div>' +
		'<div class="grid-three-fourths">' +
			'{{layout.main}}' +
			'<footer class="footer" id="footer">' +
				'{{layout.footer1}}' +
				'{{layout.navSecondary}}' +
				'{{layout.footer2}}' +
			'</footer>' +
		'</div>' +
	'</div>';

portalOptions.templates.page = function () {
	if (mashery.globals.pageFullWidth) {
		return	'<div class="main content" id="main">' +
					'{{content.main}}' +
				'</div>';
	} else if (mashery.globals.pageWide) {
		return	'<div class="main container content" id="main">' +
					'<h1>{{content.heading}}</h1>' +
					'{{content.main}}' +
				'</div>';
	} else {
		return	'<div class="main container container-small content" id="main">' +
					'<h1>{{content.heading}}</h1>' +
					'{{content.main}}' +
				'</div>';
	}
};

window.addEventListener('portalBeforeRender', function () {
	if (mashery.globals.pageFullWidth) {
		document.documentElement.classList.add('full-width');
	} else {
		document.documentElement.classList.remove('full-width');
	}
}, false);
```

#### Skinny Nav

Add this external CSS file, or <a href="/files/skinny-nav.css" download>download the unminified source file</a> if you want to make changes.

```
https://stagingcs1.mashery.com/files/skinny-nav.min.beta.css
```

And this inline JavaScript to change the layout.

```js
portalOptions.templates.userNav = null;

portalOptions.templates.primaryNav =
	'<div class="nav-primary nav-wrap nav-collapse" id="nav-primary">' +
		'<div class="container padding-top-small padding-bottom-small">' +
			'<a id="logo" class="logo" href="/">{{content.logo}}</a>' +
			'<a role="button" class="nav-toggle" id="nav-primary-toggle" data-nav-toggle="#nav-primary-menu" href="#">{{content.menuToggle}}</a>' +
			'<div class="nav-menu">' +
				'<div id="nav-user-menu">' +
					'<ul class="nav" id="nav-user-list">' +
						'{{content.navItemsUser}}' +
					'</ul>' +
				'</div>' +
				'<div id="nav-primary-menu">' +
					'<ul class="nav" id="nav-primary-list">' +
						'{{content.navItemsPrimary}}' +
						'<li><a href="/search"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-link" width="16" height="16" viewBox="0 0 32 32"><title>Search</title><path d="M31.008 27.231l-7.58-6.447c-.784-.705-1.622-1.029-2.299-.998a11.954 11.954 0 0 0 2.87-7.787c0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12c2.972 0 5.691-1.081 7.787-2.87-.031.677.293 1.515.998 2.299l6.447 7.58c1.104 1.226 2.907 1.33 4.007.23s.997-2.903-.23-4.007zM12 20a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"/></svg></a></li>' +
					'</ul>' +
				'</div>' +
			'</div>' +
		'</div>' +
	'</div>';

portalOptions.templates.page = function () {
	if (mashery.globals.pageFullWidth) {
		return	'<div class="main content" id="main">' +
					'{{content.main}}' +
				'</div>';
	} else if (mashery.globals.pageWide) {
		return	'<div class="main container content" id="main">' +
					'<h1>{{content.heading}}</h1>' +
					'{{content.main}}' +
				'</div>';
	} else {
		return	'<div class="main container container-small content" id="main">' +
					'<h1>{{content.heading}}</h1>' +
					'{{content.main}}' +
				'</div>';
	}
};

window.addEventListener('portalBeforeRender', function () {
	if (mashery.globals.pageFullWidth) {
		document.documentElement.classList.add('full-width');
	} else {
		document.documentElement.classList.remove('full-width');
	}
}, false);
```