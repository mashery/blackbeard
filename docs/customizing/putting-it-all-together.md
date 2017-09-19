# Putting It All Together

Let's look at how to take everything convered in the ["Customizing Your Portal"](/docs/read/customizing) section of the documentation and put it all together to customize our Portal.

For this exercise, we're going to...

0. Add a logo to the site.
0. Add a favicon.
0. Load some additional scripts and styles.
0. Change the labels in the user navigation menu.
0. Add a custom message to documentation for logged out users.
0. Run a custom script with a callback, and emit a custom event when it's done.

## Our Portal Customizations

Once version 1.x of Blackbeard goes live, these would get added to `Manage > Portal > Portal Settings` under one of the inline JavaScript sections.

```js
// Update the logo
portalOptions.logo = '<img height="44" width="180" alt="Mashery" src="https://support.mashery.com/files/tibco-mashery.jpg">';

// Add a favicon
// We'll use the default favicon.ico naming and sizing
portalOptions.favicon: true;

// Load CSS for the Photoswipe plugin
// http://photoswipe.com
portalOptions.loadStyles = [
	'/files/photoswipe.min.css',
	'/files/photoswipe-ui-default.min.css'
];

// Update the user navigation labels
portalOptions.labels.userNav = {

	// Logged Out
	signin: 'Login', // "Sign In" link
	register: 'Join', // "Register" link

	// Logged In
	account: '{{mashery.username}}', // "My Account" link=
	signout: 'Logout' // "Sign Out" link

};

// Run events after the main portal content is rendered
window.addEventListener('portalAfterRenderMain', function () {

	// Load and initialize Photoswipe's JS after the Main portal content renders
	m$.loadJS('/files/photoswipe.min.js', function () {

		// Initialize Photoswipe
		// NOTE: This is not how you really init Photoswipe. It's for illustrative purposes only.
		photoswipe.init();

		// Emit a custom event for other scripts to hook into
		m$.emitEvent('afterPhotoswipeInit');

	});

	// If it's a documentation page and the current user is logged out, display a custom message
	if (mashery.contentType === 'docs' && !mashery.loggedIn) {
		var content = document.querySelector('.content');
		content.innerHTML = '<p>Please log in to view the full set of documentation. As a logged out user, you are only seeing a small introductory set of content.</p>' + content.innerHTML;
	}

}, false);
```