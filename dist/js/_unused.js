/*! blackbeard vbeta | (c) 2017 Chris Ferdinandi | LicenseRef-All Rights Reserved License | http://github.com/mashery/blackbeard */
var m$ = (function () {

	'use strict';

	var m$ = {}; // Placeholder for public methods

	/**
	 * Get the first matching element
	 * @param  {String} selector  The selector to match against
	 * @param  {Node}   scope     The element to search inside [optional, defaults to document]
	 * @return {Node}             The element
	 */
	m$.get = function (selector, scope) {
		scope = scope || document;
		return scope.querySelector(selector);
	};

	/**
	 * Get the all matching elements
	 * @param {String} selector  The selector to match against
	 * @param {Node}   scope     The element to search inside [optional, defaults to document]
	 * @param {Array}            An array of matching elements
	 */
	m$.getAll = function (selector, scope) {
		scope = scope || document;
		return Array.prototype.slice.call(scope.querySelectorAll(selector));
	};

	/**
	 * Add an event listener
	 * @param {String}   event    The event type
	 * @param {Node}     elem     The element to run the event on [optional, defaults to window]
	 * @param {Function} callback The function to run on the event
	 * @param {Boolean}  capture  If true, for bubbling on non-bubbling event
	 */
	m$.on = function (event, elem, callback, capture) {
		if (typeof (elem) === 'function') {
			capture = callback;
			callback = elem;
			elem = window;
		}
		capture = capture ? true : false;
		elem.addEventListener(event, callback, capture);
	};

	/**
	 * Remove an event listener (if a named function was used to set it up)
	 * @param {String}   event    The event type
	 * @param {Node}     elem     The element to run the event on [optional, defaults to window]
	 * @param {Function} callback The function to run on the event
	 * @param {Boolean}  capture  If true, for bubbling on non-bubbling event
	 */
	m$.off = function (event, elem, callback, capture) {
		if (typeof (elem) === 'function') {
			capture = callback;
			callback = elem;
			elem = window;
		}
		capture = capture ? true : false;
		elem.removeEventListener(event, callback, capture);
	};

	/**
	 * Simulate a click event.
	 * @public
	 * @param {Element} elem  the element to simulate a click on
	 */
	m$.click = function (elem) {
		// Create our event (with options)
		var evt = new MouseEvent('click', {
			bubbles: true,
			cancelable: true,
			view: window
		});
		// If cancelled, don't dispatch our event
		var canceled = !elem.dispatchEvent(evt);
	};

	/**
	 * Load a JS file asynchronously.
	 * @author @scottjehl, Filament Group, Inc.
	 * @license MIT
	 * @link https://github.com/filamentgroup/loadJS
	 * @param  {String}   src       URL of script to load.
	 * @param  {Function} callback  Callback to run on completion.
	 * @return {String}             The script URL.
	 */
	m$.loadJS = function (src, callback, reload) {
		var existing = document.querySelector('script[src*="' + src + '"]');
		if (existing) {
			if (!reload) {
				if (callback && typeof (callback) === 'function') {
					callback();
				}
				return;
			}
			existing.parentNode.removeChild(existing);
		}
		var ref = window.document.getElementsByTagName('script')[0];
		var script = window.document.createElement('script');
		script.src = src;
		ref.parentNode.insertBefore(script, ref);
		if (callback && typeof (callback) === 'function') {
			script.onload = callback;
		}
		return script;
	};

	/**
	 * Load a CSS file asynchronously
	 * @copyright @scottjehl, Filament Group, Inc.
	 * @license MIT
	 * @param {String} href    The URL for your CSS file
	 * @param {Node}   before  Element to use as a reference for injecting the <link> [optional]
	 * @param {String} media   Stylesheet media type [optional, defaults to 'all']
	 */
	m$.loadCSS = function (href, before, media) {
		var ss = window.document.createElement('link');
		var ref = before || window.document.getElementsByTagName('script')[0];
		var sheets = window.document.styleSheets;
		ss.rel = 'stylesheet';
		ss.href = href;
		// temporarily, set media to something non-matching to ensure it'll fetch without blocking render
		ss.media = 'only x';
		// inject link
		ref.parentNode.insertBefore(ss, ref);
		// This function sets the link's media back to `all` so that the stylesheet applies once it loads
		// It is designed to poll until document.styleSheets includes the new sheet.
		function toggleMedia() {
			var defined;
			for (var i = 0; i < sheets.length; i++) {
				if (sheets[i].href && sheets[i].href.indexOf(href) > -1) {
					defined = true;
				}
			}
			if (defined) {
				ss.media = media || 'all';
			}
			else {
				setTimeout(toggleMedia);
			}
		}
		toggleMedia();
		return ss;
	};

	/**
	 * Add a query string to a URL
	 * @param  {String} url   The URL
	 * @param  {String} key   The query string key
	 * @param  {String} value The query string value
	 * @return {String}       The URL with query string
	 */
	m$.addQueryString = function (url, key, value) {
		return url + (/[\?]/.test(url) ? '&' : '?') + key + '=' + value;
	};

	/**
	 * Get the value of a query string from a URL
	 * @param  {String} field The field to get the value of
	 * @param  {String} url   The URL to get the value from [optional]
	 * @return {String}       The value
	 */
	m$.getQueryString = function (field, url) {
		var href = url ? url : window.location.href;
		var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
		var string = reg.exec(href);
		return string ? string[1] : null;
	};

	/**
	 * Sanitize a string for use as a class
	 * @url Regex pattern: http://stackoverflow.com/a/9635698/1293256
	 * @param {String} id      The string to convert into a class
	 * @param {String} prefix  A prefix to use before the class [optionals]
	 */
	m$.sanitizeClass = function (id, prefix) {
		if (!id) return '';
		prefix = prefix ? prefix + '-' : '';
		return prefix + id.replace(/^[^a-z]+|[^\w:.-]+/gi, '-').toLowerCase();
	};

	/**
	 * Inject HTML elements into the <head>
	 * @param {String} type The HTML element type
	 * @param {Object} atts The attributes and values for the element
	 */
	m$.inject = function (type, atts) {

		// Variables
		var ref = window.document.getElementsByTagName('script')[0];
		var elem = document.createElement(type);

		// Loop through each attribute
		atts.forEach((function (value, key) {
			elem.setAttribute(key, value);
		}));

		// Inject into the <head>
		ref.before(elem);

	};

	/**
	 * Merge two or more objects together.
	 * @param   {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
	 * @param   {Object}   objects  The objects to merge together
	 * @returns {Object}            Merged values of defaults and options
	 * @todo optimize loops
	 */
	m$.extend = function () {

		// Variables
		var extended = {};
		var deep = false;

		// Check if a deep merge
		if (typeof (arguments[0]) === 'boolean') {
			deep = arguments[0];
			delete arguments[0];
		}

		// Merge the object into the extended object
		var merge = function (obj) {
			obj.forEach((function(prop, key) {
				// If deep merge and property is an object, merge properties
				if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
					extended[key] = extend(true, extended[key], prop);
				} else {
					extended[key] = prop;
				}
			}));
		};

		// Loop through each object and conduct a merge
		arguments.forEach((function (obj) {
			merge(obj);
		}));

		return extended;

	};

	return m$;

})();
var loadPortal = (function () {

	'use strict';

	//
	// Variables
	//

	// Placeholder for public methods
	var exports = {};

	// Ignore on Ajax page load
	var ajaxIgnore = '.clear-results, h4 .select-all, #toggleEndpoints, #toggleMethods, [href*="/io-docs"]';

	// Setup internally global variables
	var settings, main, data;

	// Defaults
	var defaults = {

		/**
		 * Ajax page loads
		 * Whether to load pages async or with a page reload
		 */

		// If true, use Ajax
		ajax: true,

		// Selectors to ignore if clicked.
		// Accepts any valid CSS selector.
		// Use comma separated list for multiple selectors.
		ajaxIgnore: null,

		// If true, inject a favicon
		favicon: false,

		// The favicon URL
		faviconURL: '/files/favicon.ico',

		// The favicon sizes
		faviconSizes: '16x16 32x32',

		/**
		 * Logo
		 * Add a custom logo.
		 * Accepts any markup as a string (<img src>, <svg>, etc.)
		 */
		logo: null,

		// If true, include viewport resizing meta tag
		responsive: true,

		/**
		 * Templates
		 * Customize the content and layout of anything in the Portal.
		 * Use a string for simple layouts.
		 * Use a function that returns a string for complex ones and conditional logic.
		 */
		templates: {

			/**
			 * My Apps
			 * The layout for the page displaying a users registered applications.
			 */
			accountApps: function () {
				var template = 	'<h1>{{content.headingMyApps}}</h1><ul id="nav-account">{{content.navItemsAccount}}</ul>';
				if (Object.keys(mashery.content.main).length > 0) {
					mashery.content.main.forEach((function (app) {
						template +=
							'<h2>' + app.application + '</h2>' +
							'<ul>' +
								'<li>API: ' + (app.api ? app.api : 'None') + '</li>' +
								'<li>Key: ' + (app.key ? app.key : 'None') + '</li>' +
								'<li>Created: ' + app.created + '</li>' +
							'</ul>' +
							'<p>' +
						'<a class="btn btn-edit-app" id="' + m$.sanitizeClass(app.application, 'btn-edit-app') + '" href="' + app.edit + '">Edit This App</a>' +
						'<a class="btn btn-delete-app" id="' + m$.sanitizeClass(app.application, 'btn-delete-app') + '" href="' + app.delete + '">Delete This App</a>' +
							'</p>';
					}));
				} else {
					template += '{{content.noApps}}';
				}
				if (mashery.content.secondary) {
					template += '<p><a class="btn btn-get-app" id="btn-get-app" href="' + window.mashery.content.secondary + '">Create a New App</a></p>';
				}
				return '<div class="main container container-small" id="main">' + template + '</div>';
			},

			/**
			 * My Account: Email
			 * The layout for the page where users can change their Mashery email address.
			 */
			accountEmail:	'<div class="main container container-small" id="main">' +
								'<h1>{{content.headingChangeEmail}}</h1>' +
								'<ul id="nav-account">{{content.navItemsAccount}}</ul>' +
								'<ul id="nav-mashery-account">{{content.navItemsMasheryAccount}}</ul>' +
								'{{content.main}}' +
							'</div>',

			/**
			 * My Account: Email Success
			 * The layout for the page confirming email change was successful
			 */
			accountEmailSuccess:	'<div class="main container container-small" id="main">' +
									'<h1>{{content.headingChangeEmailSuccess}}</h1>' +
									'<ul id="nav-account">{{content.navItemsAccount}}</ul>' +
									'<ul id="nav-mashery-account">{{content.navItemsMasheryAccount}}</ul>' +
									'{{content.emailChanged}}' +
								'</div>',

			/**
			 * My Keys
			 * The layout for the page displaying a users API keys.
			 */
			accountKeys: function () {
				var template = '<h1>{{content.headingMyApiKeys}}</h1><ul id="nav-account">{{content.navItemsAccount}}</ul>';
				if (Object.keys(mashery.content.main).length > 0 ) {
					mashery.content.main.forEach((function (plan) {
						template += '<h2>' + plan.name + '</h2>';
						if (plan.keys.length > 0) {
							plan.keys.forEach((function (key) {
								var secret = key.secret ? '<li>Secret: ' + key.secret + '</li>' : '';
								template +=
									'<p><strong>' + key.application + '</strong></p>' +
									'<ul>' +
										'<li>Key: ' + key.key + '</li>' +
										secret +
										'<li>Status: ' + key.status + '</li>' +
										'<li>Created: ' + key.created + '</li>' +
									'</ul>' +
									key.limits +
									'<p><a class="btn btn-delete-key" id="btn-delete-key" href="' + key.delete + '">Delete This Key</a></p>';
							}));
						} else {
							template += '<p>{{content.noPlanKeys}}</p>';
							if (mashery.content.secondary) {
								template += '<p><a class="btn btn-get-key" id="' + m$.sanitizeClass(plan.name, 'btn-get-key') + '"  href="' + mashery.content.secondary + '">Get a Key for ' + plan.name + '</a></p>';
							}
						}
					}));
				} else {
					template += '{{content.noKeys}}';
					if (mashery.content.secondary) {
						template += '<p><a class="btn btn-get-key" id="btn-get-key" href="' + mashery.content.secondary + '">Get API Keys</a></p>';
					}
				}
				return '<div class="main container container-small" id="main">' + template + '</div>';
			},

			/**
			 * My Account
			 * The layout for the page where users can manage their Mashery Account details.
			 */
			accountManage:	'<div class="main container container-small" id="main">' +
								'<h1>{{content.headingAccount}}</h1>' +
								'<ul id="nav-account">{{content.navItemsAccount}}</ul>' +
								'<ul id="nav-mashery-account">{{content.navItemsMasheryAccount}}</ul>' +
								'<h2>{{content.headingAccountInfo}}</h2>' +
								'{{content.main}}' +
							'</div>',

			/**
			 * My Account: Password
			 * The layout for the page where users can change their Mashery password.
			 */
			accountPassword:	'<div class="main container container-small" id="main">' +
									'<h1>{{content.headingChangePassword}}</h1>' +
									'<ul id="nav-account">{{content.navItemsAccount}}</ul>' +
									'<ul id="nav-mashery-account">{{content.navItemsMasheryAccount}}</ul>' +
									'{{content.main}}' +
								'</div>',

			/**
			 * My Account: Password
			 * The layout for the page where users can change their Mashery password.
			 */
			accountPasswordSuccess:	'<div class="main container container-small" id="main">' +
										'<h1>{{content.headingChangePasswordSuccess}}</h1>' +
										'<ul id="nav-account">{{content.navItemsAccount}}</ul>' +
										'<ul id="nav-mashery-account">{{content.navItemsMasheryAccount}}</ul>' +
										'{{content.passwordChanged}}' +
									'</div>',

			/**
			 * App Registration
			 * The layout for the app registration page.
			 */
			appRegister:	'<div class="main container container-small" id="main">' +
									'<h1>{{content.heading}}</h1>' +
									'<p>{{content.subheading}}</p>' +
									'{{content.main}}' +
								'</div>',

			/**
			 * App Registration Success
			 * The layout for the message that's displayed after an application is successfully registered.
			 */
			appRegisterSuccess:	'<div class="main container container-small" id="main">' +
									'<h1>{{content.heading}}</h1>' +
									'{{content.main}}' +
								'</div>',

			/**
			 * Blog: All Posts
			 * The layout for the page where all blog posts are listed.
			 * @todo Create this layout
			 */
			blogAll: '<div class="main container" id="main"><p>Blog content needs to get created.</p></div>',

			/**
			 * Blog: Single Post
			 * The layout for individual blog posts.
			 * @todo Create this layout
			 */
			blogSingle: '<div class="main container" id="main"><p>Blog content needs to get created.</p></div>',

			/**
			 * Contact
			 * The layout for the contact page.
			 */
			contact:	'<div class="main container container-small" id="main">' +
							'<h1>{{content.heading}}</h1>' +
							'<p>{{content.subheading}}</p>' +
							'{{content.main}}' +
						'</div>',

			/**
			 * Contact Success
			 * The layout for the message displayed after a contact form is successfully submitted.
			 */
			contactSuccess:	'<div class="main container container-small" id="main">' +
								'<h1>{{content.heading}}</h1>' +
								'<p>{{content.main}}</p>' +
							'</div>',

			/**
			 * Documentation
			 * The layout for API documentation.
			 * This page includes an automatically generated navigation menu.
			 */
			docs:	'<div class="main container" id="main">' +
						'<div class="row">' +
							'<div class="grid-two-thirds">{{content.main}}</div>' +
							'<div class="grid-third"><h2>In the Docs</h2><ul>{{content.secondary}}</ul></div>' +
						'</div>' +
					'</div>',

			/**
			 * Footer 1
			 * The first of two footer content sections.
			 */
			footer1: '<div class="footer-1 container" id="footer-1"><hr></div>',

			/**
			 * Footer 2
			 * The second of two footer content sections.
			 */
			footer2:	'<div class="footer-1 container" id="footer-2">' +
							'<p>{{content.masheryMade}}</p>' +
						'</div>',

			/**
			 * Forum: All Topics
			 * The layout for the main forum page where all topics are listed.
			 * @todo Create this layout
			 */
			forumAll: '<div class="main container" id="main"><p>The forum content needs to get created.</p></div>',


			/**
			 * 404
			 * The layout for 404 pages.
			 */
			fourOhFour:	'<div class="main container container-small" id="main">' +
							'<h1>{{content.heading}}</h1>' +
							'{{content.main}}' +
						'</div>',

			/**
			 * IO Docs
			 * The layout for the IO Docs page.
			 */
			ioDocs:	'<div class="main container container-small" id="main">' +
						'<h1>{{content.heading}}</h1>' +
						'<p>{{content.subheading}}</p>' +
						'{{content.main}}' +
					'</div>',

			/**
			 * Join
			 * The layout for existing Mashery users signing into an area for the first time.
			 * Mashery Terms of Use *must* be displayed on this page, and will be automatically injected if you omit them.
			 */
			join:	'<div class="main container container-small" id="main">' +
						'<h1>{{content.heading}}</h1>' +
						'<p>{{content.subheading}}</p>' +
						'{{content.main}}' +
						'{{content.terms}}' +
					'</div>',

			/**
			 * Join Success
			 * The layout for the page confirming that an existing Mashery user has joined a new area.
			 * @todo Convert the text into variables
			 */
			joinSuccess:	'<div class="main container container-small" id="main">' +
								'<h1>{{content.heading}}</h1>' +
								'<p>You have successfully registered as {{content.main}}. Read our <a href="/docs">API documentation</a> to get started. You can view your keys and applications under <a href="{{path.keys}}">My Account</a>.</p>' +
							'</div>',

			/**
			 * Base layout
			 * The markup structure that all of the content will get loaded into.
			 */
			layout:	'<a class="screen-reader screen-reader-focusable" href="#main">Skip to content</a>' +
					'{{layout.navUser}}' +
					'{{layout.navPrimary}}' +
					'{{layout.main}}' +
					'<footer class="footer" id="footer">' +
						'{{layout.footer1}}' +
						'{{layout.navSecondary}}' +
						'{{layout.footer2}}' +
					'</footer>',

			/**
			 * Logout Success
			 * The layout for the page shown after a user logs out.
			 */
			logout:	'<div class="main container container-small" id="main">' +
						'<h1>{{content.heading}}</h1>' +
						'<p>{{content.main}}</p>' +
					'</div>',

			/**
			 * Logout Failed
			 * The layout for the page shown when a logout was unsuccessful.
			 */
			logoutFail:	'<div class="main container container-small" id="main">' +
							'<h1>{{content.heading}}</h1>' +
							'<p>{{content.main}}</p>' +
						'</div>',

			/**
			 * Lost Password Request
			 * The layout for the page where users can request their password be reset.
			 */
			lostPassword:	'<div class="main container container-small" id="main">' +
								'<h1>{{content.heading}}</h1>' +
								'<p>{{content.subheading}}</p>' +
								'{{content.main}}' +
							'</div>',

			/**
			 * Lost Password Reset
			 * The layout for the page shown after a password reset email is sent to the user.
			 */
			lostPasswordReset:	'<div class="main container container-small" id="main">' +
									'<h1>{{content.heading}}</h1>' +
									'<p>{{content.main}}</p>' +
								'</div>',

			/**
			 * Lost Username Request
			 * The layout for the page where users can request their username be reset.
			 */
			lostUsername:	'<div class="main container container-small" id="main">' +
								'<h1>{{content.heading}}</h1>' +
								'<p>{{content.subheading}}</p>' +
								'{{content.main}}' +
							'</div>',

			/**
			 * Lost Username Reset
			 * The layout for the page where users can reset their username.
			 */
			lostUsernameReset:	'<div class="main container container-small" id="main">' +
									'<h1>{{content.heading}}</h1>' +
									'<p>{{content.main}}</p>' +
								'</div>',

			/**
			 * Remove Membership
			 * The layout for the page where users can remove their membership from this Portal.
			 */
			memberRemove:	'<div class="main container container-small" id="main">' +
								'<h1>{{content.heading}}</h1>' +
								'<p>{{content.main}}</p>' +
								'<p>' +
									'<a class="btn btn-remove-member-confirm" id="btn-remove-member-confirm" href="{{path.removeMember}}">{{content.confirm}}</a>' +
									'<a class="btn btn-remove-member-cancel" id="btn-remove-member-cancel" href="{{path.account}}">{{content.cancel}}</a>' +
								'</p>' +
							'</div>',

			/**
			 * Remove Membership Success
			 * The layout for the page shown when user membership was successfully removed.
			 */
			memberRemoveSuccess:	'<div class="main container container-small" id="main">' +
										'<h1>{{content.heading}}</h1>' +
										'<p>{{content.main}}</p>' +
									'</div>',

			/**
			 * No Access
			 * Layout for when the user does not have permission to view the page
			 */
			noAccess:	'<div class="main container container-small" id="main">' +
							'<h1>{{content.heading}}</h1>' +
							'<p>{{content.main}}</p>' +
						'</div>',

			/**
			 * Custom Pages
			 * The layout for custom pages.
			 */
			page:	'<div class="main container" id="main">' +
						'{{content.main}}' +
					'</div>',

			/**
			 * User Profiles
			 * The layout for user profile pages.
			 */
			profile: function () {
				// @todo convert these strings into context-specific placeholders
				var template = '<h1>{{content.heading}}</h1>';
				if (window.mashery.content.main.admin) {
					template += '<p><a href="' + window.mashery.content.main.admin + '">View administrative profile for ' + window.mashery.content.main.name + '</a></p>';
				}
				template +=	'<h2>{{content.headingUserInfo}}</h2>' +
							'<ul>';
							if (window.mashery.content.main.website) {
								template += '<li><strong>{{content.userWebsite}}</strong> <a href="' + window.mashery.content.main.website + '">' + window.mashery.content.main.website + '</a></li>';
							}
							if (window.mashery.content.main.blog) {
								template += '<li><strong>{{content.userBlog}}</strong> <a href="' + window.mashery.content.main.blog + '">' + window.mashery.content.main.blog + '</a></li>';
							}
							template += '<li><strong>{{content.userRegistered}}</strong> ' + window.mashery.content.main.registered + '</li>';
				template +=	'</ul>';
				if (window.mashery.content.main.activity) {
					template += '<h2>{{content.headingActivity}}</h2>' +
					window.mashery.content.main.activity;
				}
				return '<div class="main container" id="main">' + template + '</div>';
			},

			/**
			 * Primary Navigation
			 * The primary navigation content for the Portal.
			 */
			primaryNav:	'<div class="nav-primary nav-wrap nav-collapse container padding-top-small padding-bottom-small" id="nav-primary">' +
							'<a id="logo" class="logo" href="/">{{content.logo}}</a>' +
							'<a role="button" class="nav-toggle" id="nav-primary-toggle" data-nav-toggle="#nav-primary-menu" href="#">Menu</a>' +
							'<div class="nav-menu" id="nav-primary-menu">' +
								'<ul class="nav" id="nav-primary-list">' +
									'{{content.navItemsPrimary}}' +
									'<li>{{content.searchForm}}</li>' +
								'</ul>' +
							'</div>' +
						'</div>',

			/**
			 * Registration
			 * The layout for the registration page.
			 * Terms of Use *must* be included on this page, and will be automatically injected if you omit them.
			 */
			register:	'<div class="main container" id="main">' +
							'<div class="row">' +
								'<div class="grid-two-thirds">' +
									'<h1>{{content.heading}}</h1>' +
									'{{content.subheading}}' +
									'{{content.form}}' +
									'{{content.terms}}' +
								'</div>' +
								'<div class="grid-third">' +
									'{{content.about}}' +
								'</div>' +
							'</div>' +
						'</div>',

			/**
			 * Registration Email Sent
			 * The layout for the page confirming that the users registration email was sent.
			 * @todo Convert the text into variables
			 */
			registerSent:	'<div class="main container container-small" id="main">' +
									'<h1>{{content.heading}}</h1>' +
									'<p>We have sent a confirmation email to you at {{content.main}}.</p>' +
									'<p>Please click on the link in that e-mail to confirm your account. If you do not receive an email within the next hour, <a href="{{path.registerResendConfirmation}}">click here to resend confirmation email</a>.</p>' +
								'</div>',

			/**
			 * Registration Email Resend
			 * The layout for the page requesting the registration email be resent.
			 */
			registerResend:	'<div class="main container container-small" id="main">' +
								'<h1>{{content.heading}}</h1>' +
								'<p>{{content.subheading}}</p>' +
								'{{content.main}}' +
							'</div>',

			/**
			 * Registration Email Resent
			 * The layout for the page confirming that the registration email was resent.
			 */
			registerResendSuccess:	'<div class="main container container-small" id="main">' +
										'<h1>{{content.heading}}</h1>' +
										'{{content.main}}' +
									'</div>',

			/**
			 * Search
			 * The layout for search results.
			 */
			search:	function () {
				var template = '<h1>{{content.heading}}</h1>';
				if (window.mashery.content.main) {
					template += '<p>{{content.meta}}</p>';
					window.mashery.content.main.forEach((function (result) {
						template +=
							'<div class="search-result">' +
								'<h2 class="no-margin-bottom"><a href="' + result.url + '">' + result.title + '</a></h2>' +
								'<p>' +
									result.summary +
									'<br>' +
									'<a href="' + result.url + '">' + result.url + '</a>' +
								'</p>' +
							'</div>';
					}));
					template += '<div class="search-pagination">';
					if (window.mashery.content.secondary.pagePrevious) {
						template += '<a href="' + window.mashery.content.secondary.pagePrevious + '">{{content.pagePrevious}}</a>';
					}
					if (window.mashery.content.secondary.pagePrevious && window.mashery.content.secondary.pageNext) {
						template += '{{content.pageDivider}}';
					}
					if (window.mashery.content.secondary.pageNext) {
						template += '<a href="' + window.mashery.content.secondary.pageNext + '">{{content.pageNext}}</a>';
					}
					template += '</div>';
				} else {
					template += '{{content.noResults}}';
				}

				return '<div class="main container container-small" id="main">' + template + '</div>';
			},

			/**
			 * Secondary Navigation
			 * The secondary navigation for the Portal, often included in the footer.
			 */
			secondaryNav:	'<div class="nav-secondary container" id="nav-secondary">' +
								'<ul id="nav-secondary-list">' +
									'{{content.navItemsSecondary}}' +
								'</ul>' +
							'</div>',

			/**
			 * Secret Visibility
			 * Show key secrets for 30 days.
			 */
			showSecret:	'<div class="main container container-small" id="main">' +
							'<h1>{{content.heading}}</h1>' +
							'{{content.main}}' +
						'</div>',

			/**
			 * Secret Visibility: Success
			 * Key secrets will be shown.
			 */
			showSecretSuccess:	'<div class="main container container-small" id="main">' +
									'<h1>{{content.heading}}</h1>' +
									'{{content.main}}' +
								'</div>',

			/**
			 * Secret Visibility; Error
			 * Key secrets already shown.
			 */
			showSecretError:	'<div class="main container container-small" id="main">' +
									'<h1>{{content.heading}}</h1>' +
									'{{content.main}}' +
								'</div>',

			/**
			 * Sign In
			 * The layout for the sign in page.
			 */
			signin:	'<div class="main container" id="main">' +
						'<div class="row">' +
							'<div class="grid-half">' +
								'<h1>{{content.heading}}</h1>' +
								'{{content.subheading}}' +
								'{{content.form}}' +
							'</div>' +
							'<div class="grid-half">' +
								'{{content.about}}' +
							'</div>' +
						'</div>' +
					'</div>',

			/**
			 * User Navigation
			 * The navigation menu for sign in, registration, account, and logout links.
			 */
			userNav:	'<div class="nav-user container" id="nav-user">' +
							'<ul class="nav-user-list list-inline text-small text-muted padding-top-small padding-bottom-small no-margin-bottom text-right" id="nav-user-list">' +
								'{{content.navItemsUser}}' +
							'</ul>' +
						'</div>'

		},

		/**
		 * Labels & Blurbs
		 * Change headlines and messages without customizing the entire layout.
		 */
		labels: {

			/**
			 * My Account
			 * All of the account pages, including Keys, Apps, Mashery Account, Change Email, Change Password, and Remove Membership
			 */
			account: {

				// Headings
				headingMyApiKeys: 'My API Keys', // The "My Keys" page heading
				headingMyApps: 'My Apps', // The "My Apps" page heading
				headingAccount: 'Manage Account', // The "Manage Account" page heading
				headingAccountInfo: 'Account Information', // The "Account Information" subheading on the "Manage Account" page
				headingChangeEmail: 'Change Email', // The "Change Email" page heading
				headingChangeEmailSuccess: 'Email Successfully Changed', // The "Change Email Success" page heading
				headingChangePassword: 'Change Password', // The "Change Password" page heading
				headingChangePasswordSuccess: 'Password Successfully Changed', // The "Change Password Success" page heading

				// Navigation Labels
				keys: 'Keys', // The account nav label for "My Keys"
				apps: 'Applications', // The account nav label for "My Applications"
				account: 'Manage Account', // The account nav label for "Manage Account"
				changeEmail: 'Change Email', // The account nav label for "Change Email"
				changePassword: 'Change Password', // The account nav label for "Change Password"
				viewProfile: 'View My Public Profile', // The account nav label for "View My Profile"
				removeMembership: 'Remove Membership from {{mashery.area}}', // The account nav label for "Remove Membership"

				// Messages
				noKeys: 'You don\'t have any keys yet.', // The message to display when a user has no keys
				noPlanKeys: 'You have not been issued keys for this API.', // The message to display when a user has no keys for a specific plan
				noApps: 'You don\'t have any apps yet.', // The message to display when a user has no apps
				emailChanged: '<p>An email confirming your change has been sent to the address you provided with your username. Please check your spam folder if you don\'t see it in your inbox.</p>',
				passwordChanged: '<p>An email confirming your change has been sent to the address you provided with your username. If you use this account on other Mashery powered portals, remember to use your new password.</p>'

			},

			/**
			 * App Registration
			 * The page to register an application
			 */
			appRegister: {
				heading: 'Register an Application', // The heading
				subheading: 'Get a key and register your application using the form below to start working with our APIs.' // The message shown above the form
			},

			/**
			 * App Registration Success
			 * The page shown after an app has been successfully registered.
			 */
			appRegisterSuccess: {
				heading: 'Your application was registered!', // The heading

				// The message
				main:	'<p>An email has been sent to you with your key and application details. You can also view them at any time from the <a href="{{path.keys}}">My Account</a> page.</p>' +
						'<p>To get started using your API keys, dig into <a href="{{path.docs}}">our documentation</a>. We look forward to seeing what you create!</p>',
			},

			/**
			 * Contact
			 * The contact form page
			 */
			contact: {
				heading: 'Contact Us', // The heading
				subheading: 'Contact us using the form below.' // The message shown above the form
			},

			/**
			 * Contact Success
			 * The page shown after a contact form is successfully submitted.
			 */
			contactSuccess: {
				heading: 'Thanks for your submission!', // The heading
				main: 'Your message will be forwarded to the appropriate group.' // The message
			},

			/**
			 * 404
			 * The 404 page.
			 */
			fourOhFour: {
				heading: 'Unable to find this page', // The heading
				main: '<p>We\'re unable to find this page. Sorry! Please check the URL, or contact us to report a broken link.</p>' // The message
			},

			/**
			 * IO Docs
			 * The IO Docs page
			 */
			ioDocs: {
				heading: 'Interactive API', // The heading
				subheading: 'Test our API services with IO-Docs, our interactive API documentation.' // The message displayed before the content
			},

			/**
			 * Join
			 * The page shown to existing Mashery users signing in to a new area.
			 */
			join: {
				heading: 'Join {{mashery.area}}', // The heading
				subheading: 'Since you already have a Mashery account you don\'t have to register again, but we would like to know a little more about you. Please fill out the additional information below.' // The message shown above the form
			},

			/**
			 * Join: Success
			 * The page shown after an existing Mashery user successfully joins a new area.
			 */
			joinSuccess: {
				heading: 'Registration Successful' // The heading
			},

			/**
			 * Logout Success
			 * The page shown after a user successfully logs out of the Portal.
			 */
			logout: {
				heading: 'Signed Out', // The heading
				main: 'You have successfully signed out. Come back soon!' // The message
			},

			/**
			 * Logout Fail
			 * The page shown when a logout was unsuccessful.
			 */
			logoutFail: {
				heading: 'Sign Out Failed', // The heading
				main: 'Your attempt to sign out failed. <a href="{{path.logout}}">Please try again.</a>' // The message
			},

			/**
			 * Lost Password Request
			 * The page to request a password reset.
			 */
			lostPassword: {
				heading: 'Recover Your Password', // The heading
				subheading: 'Enter the email address and username that you registered with and we will send you a link to reset your password.' // The message shown above the form
			},

			/**
			 * Lost Password Reset
			 * The page shown after a password reset email is sent to the user.
			 */
			lostPasswordReset: {
				heading: 'Email Sent', // The heading
				main: 'An email has been sent to the address you provided. Click on the link in the e-mail to reset your password. Please check your spam folder if you don\'t see it in your inbox.' // The messsage
			},

			/**
			 * Lost Username Request
			 * The page to request a username recovery
			 */
			lostUsername: {
				heading: 'Recover Your Username', // The heading
				subheading: 'Enter the email address you used to register and we will send you an email with your username.' // The message shown above the form
			},

			/**
			 * Lost Username Reset
			 * The page shown after a username reset email is sent to the user.
			 */
			lostUsernameReset: {
				heading: 'Email Sent', // The heading
				main: 'An email has been sent containing your username details. Please check your spam folder if you don\'t see it in your inbox.' // The message
			},

			/**
			 * Remove Membership
			 * The page for users to remove their membership from this Portal.
			 */
			memberRemove: {

				// Content
				heading: 'Remove membership from {{mashery.area}}', // The heading
				main: 'Removing membership disables your account and you will not be able to register again using the same username. All your keys will be deactivated.', // The message

				// Labels
				confirm: 'Remove Membership', // The "confirm remove membership" button label
				cancel: 'Cancel', // The "cancel removal" button label
				popup: 'Please confirm that you wish to permanently disable your membership with this service.' // The message to display on the "confirm removal" popup modal

			},

			/**
			 * Remove Membership Success
			 * The page shown after a user successfully removes their membership.
			 */
			memberRemoveSuccess: {
				heading: 'Your account has been removed.', // The heading
				main: 'Enjoy the rest of your day!' // The message
			},

			/**
			 * No Access
			 * The page shown when user doesn't have access to the content
			 */
			noAccess: {
				heading: 'You don\'t have access to this content', // The heading
				main: '<p>If you\'re not logged in yet, try <a href="{{paths.signin}}">logging in</a> or <a href="{{path.register}}">registering for an account</a>.</p>' // The message
			},

			/**
			 * User Profile
			 * The user profile page
			 */
			profile: {

				// Headings
				heading: '{{mashery.username}}', // The primary heading
				headingUserInfo: 'User Information', // The "User Information" subheading
				headingActivity: 'Recent Activity', // The "User Activity" subheading

				// Content
				userWebsite: 'Website:', // The user website label
				userBlog: 'Blog:', // The user blog label
				userRegistered: 'Registered:' // The label for the date the user registered

			},

			/**
			 * User Registration
			 * The user registration page.
			 */
			register: {

				// Primary Content
				heading: 'Register for an Account', // The heading
				subheading: '<p>Register a new Mashery ID to access {{mashery.area}}.</p>', // The message above the form
				privacyPolicy: '', // A custom privacy policy link or message [optional]

				// The sidebar content
				sidebar:	'<h2>No Spam Guarantee</h2>' +
							'<p>We hate spam. We love our users. We promise to never sell or share any of your private information.</p>',

				// Labels
				submit: 'Register' // The submit button text @todo: does not work yet
			},

			/**
			 * User Registration: Email Sent
			 * The registration email confirmation page.
			 */
			registerSent: {
				heading: 'Registration Almost Complete' // The heading
			},

			/**
			 * User Registration: Email Resend
			 * The page to request a new registration confirmation email.
			 */
			registerResend: {
				heading: 'Resend Your Confirmation Email', // The heading
				subheading: 'Enter your username and email address to have your registration confirmation email resent to you.' // The message above the form
			},

			/**
			 * User Registration: Email Resent
			 * The page after a registration confirmation email was successfully resent.
			 */
			registerResendSuccess: {
				heading: 'Success', // The heading
				main: 'Your confirmation email was resent.' // The message
			},

			/**
			 * Search
			 * Search form and results content.
			 */
			search: {

				// Search form
				button: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><title>Search</title><path d="M31.008 27.231l-7.58-6.447c-.784-.705-1.622-1.029-2.299-.998a11.954 11.954 0 0 0 2.87-7.787c0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12c2.972 0 5.691-1.081 7.787-2.87-.031.677.293 1.515.998 2.299l6.447 7.58c1.104 1.226 2.907 1.33 4.007.23s.997-2.903-.23-4.007zM12 20a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"/></svg>', // The search for button text
				placeholder: 'Search...', // The search form placeholder attribute text

				// Search results
				heading: 'Search Results for "{{content.query}}"', // The search results page heading
				meta: 'Showing {{content.first}} to {{content.last}} of {{content.total}} results for "{{content.query}}"', // The meta data to show above search results
				noResults: 'Your search for "{{content.query}}" returned no results.', // The message to display when no results are found
				pagePrevious: '&larr; Previous Page', // The previous page link
				pageNext: 'Next Page &rarr;', // The next page link
				pageDivider: ' | ' // The divider between the previous and next page links
			},

			/**
			 * Reveal Key Secret
			 */
			showSecret: {
				heading: 'Email Sent',
				main: '<p>An email has been sent to the email address associated with your account. Click on the link in the email to display all of your shared secrets for 30 days. Please check your spam folder if you don\'t see it in your inbox.</p>'
			},

			/**
			 * Reveal Key Secret: Success
			 */
			showSecretSuccess: {
				heading: 'Your shared secrets are now visible',
				main: '<p>Shared secrets will be visible for the next 30 days. After 30 days, they will be hidden again for PCI compliance.</p>'
			},

			/**
			 * Reveal Key Secret: Already Visible
			 */
			showSecretError: {
				heading: 'Your shared secrets are already visible',
				main: '<p><a href="{{path.keys}}">Click here</a> to view them.</p>'
			},

			/**
			 * Sign In
			 * The sign in page.
			 */
			signin: {

				// Content
				heading: 'Sign In', // The heading
				subheading: '<p>Sign in to {{mashery.area}} using your Mashery ID.</p>', // The message above the sign in form

				// The sidebar content
				sidebar:	'<h2>Register</h2>' +
							'<p><a href="{{path.register}}">Create an account</a> to access stagingcs9.mashery.com. Your account information can then be used to access other APIs on the Mashery API Network.</p>' +

							'<h2>What is Mashery?</h2>' +
							'<p><a href="http://mashery.com">Mashery</a> powers APIs of leading brands in retail, media, business services, software, and more. By signing in to a Mashery powered portal, you can gain access to Mashery\'s base of API providers. All with a single Mashery ID.</p>' +

							'<p><a class="btn btn-user-register" id="btn-user-register" href="{{path.register}}">Register a Mashery ID</a></p>',

				// Labels
				submit: 'Sign In', // The submit button text @todo: does not work yet

			},

			/**
			 * Title Attribute
			 * Displayed in the web browser tab.
			 */
			title: '{{mashery.title}} | {{mashery.area}}',

			/**
			 * User Navigation
			 * The navigation menu where users sign in, register, view their account, and log out.
			 */
			userNav: {

				// Logged Out
				signin: 'Sign In', // "Sign In" link
				register: 'Register', // "Register" link

				// Logged In
				account: 'My Account', // "My Account" link
				dashboard: 'Dashboard', // "Dashboard" link (for admins only)
				signout: 'Sign Out', // "Sign Out" link

			}

		},

		/**
		 * Callbacks
		 * These are functions that can be run before and after Portal rendering events.
		 * They allow you to hook into and extend the functionality of your Portal.
		 */
		callbacks: {
			beforeInit: function () {}, // Before the first render
			afterInit: function () {}, // After the first render
			beforeRender: function () {}, // Before each page render
			afterRender: function () {}, // After each page render
			beforeRenderLayout: function () {}, // Before the layout is rendered
			afterRenderLayout: function () {}, // After the layout is rendered
			beforeRenderUserNav: function () {}, // Before the user nav is rendered
			afterRenderUserNav: function () {}, // After the user nav is rendered
			beforeRenderPrimaryNav: function () {}, // Before the primary nav is rendered
			afterRenderPrimaryNav: function () {}, // After the primary nav is rendered
			beforeRenderMain: function () {}, // Before the main content is rendered
			afterRenderMain: function () {}, // After the main content is rendered
			beforeRenderSecondaryNav: function () {}, // Before the secondary nav is rendered
			afterRenderSecondaryNav: function () {}, // After the secondary nav is rendered
			beforeRenderFooter: function () {}, // Before the footer is rendered
			afterRenderFooter: function () {} // After the footer is rendered
		}

	};

	/**
	 * Paths
	 * Holds placeholders and URLs to various standard Portal pages
	 */
	var paths = {

		// My Apps
		accountApps: {
			placeholder: '{{path.apps}}',
			url: '/apps/myapps'
		},

		// My Keys
		accountKeys: {
			placeholder: '{{path.keys}}',
			url: '/apps/mykeys'
		},

		// My Account
		accountManage: {
			placeholder: '{{path.account}}',
			url: '/member/edit'
		},

		// Change My Email
		changeEmail: {
			placeholder: '{{path.changeEmail}}',
			url: '/member/email'
		},

		// Change My Password
		changePassword: {
			placeholder: '{{path.changePassword}}',
			url: '/member/passwd'
		},

		// Contact
		contact: {
			placeholder: '{{path.contact}}',
			url: '/contact'
		},

		// Dashboard
		dashboard: {
			placeholder: '{{path.dashboard}}',
			url: function () {
				// Grabbed dynamically
				return (window.mashery.dashboard ? window.mashery.dashboard : '#');
			}
		},

		// Documentation
		docs: {
			placeholder: '{{path.docs}}',
			url: '/docs'
		},

		// IO Docs
		ioDocs: {
			placeholder: '{{path.iodocs}}',
			url: '/io-docs'
		},

		// Logout
		logout: {
			placeholder: '{{path.logout}}',
			url: '/logout/logout'
		},

		// Password Request
		lostPassword: {
			placeholder: '{{path.lostPassword}}',
			url: '/member/lost'
		},

		// Username Request
		lostUsername: {
			placeholder: '{{path.lostUsername}}',
			url: '/member/lost-username'
		},

		// Trigger Remove Member
		// Special link that submits the remove member form
		memberRemove: {
			placeholder: '{{path.removeMember}}',
			url: '/member/remove?action=removeMember'
		},

		// User Registration
		register: {
			placeholder: '{{path.register}}',
			url: '/member/register'
		},

		// User Registration Resent
		registerResendConfirmation: {
			placeholder: '{{path.registerResendConfirmation}}',
			url: '/member/resend-confirmation'
		},

		// Remove Membership
		removeMembership: {
			placeholder: '{{path.removeMembership}}',
			url: '/member/remove'
		},

		// Search Results
		search: {
			placeholder: '{{path.search}}',
			url: '/search'
		},

		// Sign In
		signin: {
			placeholder: '{{path.signin}}',
			url: function () {
				// Get the URL dynamically since it varies based on configuration and includes a redirect back to the current page
				return window.mashery.login.url + window.mashery.login.redirect;
			},
		},

		// View My Profile
		viewProfile: {
			placeholder: '{{path.viewProfile}}',
			url: function () {
				// Varies by user. Grabbed dynamically.
				return (window.mashery.userProfile ? window.mashery.userProfile : '/profile/profile');
			}
		}

	};

	/**
	 * Local Placeholders
	 * Holds placeholders specific to certain pages
	 */
	var localPlaceholders = {

		// Account pages
		account: {

			// My Account Nav Label
			account: {
				placeholder: '{{content.account}}',
				text: function () {
					return settings.labels.account.account;
				}
			},

			// My Apps Nav Label
			apps: {
				placeholder: '{{content.apps}}',
				text: function () {
					return settings.labels.account.apps;
				}
			},

			// My Account Heading
			headingAccount: {
				placeholder: '{{content.headingAccount}}',
				text: function () {
					return settings.labels.account.headingAccount;
				}
			},

			// My Account Info Subheading
			headingAccountInfo: {
				placeholder: '{{content.headingAccountInfo}}',
				text: function () {
					return settings.labels.account.headingAccountInfo;
				}
			},

			// Change My Email Heading
			headingChangeEmail: {
				placeholder: '{{content.headingChangeEmail}}',
				text: function () {
					return settings.labels.account.headingChangeEmail;
				}
			},

			// Change My Email Success Heading
			headingChangeEmailSuccess: {
				placeholder: '{{content.headingChangeEmailSuccess}}',
				text: function () {
					return settings.labels.account.headingChangeEmailSuccess;
				}
			},

			// Change My Password Heading
			headingChangePassword: {
				placeholder: '{{content.headingChangePassword}}',
				text: function () {
					return settings.labels.account.headingChangePassword;
				}
			},

			// Change My Password Success Heading
			headingChangePasswordSuccess: {
				placeholder: '{{content.headingChangePasswordSuccess}}',
				text: function () {
					return settings.labels.account.headingChangePasswordSuccess;
				}
			},

			// My Keys Heading
			headingMyApiKeys: {
				placeholder: '{{content.headingMyApiKeys}}',
				text: function () {
					return settings.labels.account.headingMyApiKeys;
				}
			},

			// My Apps Heading
			headingMyApps: {
				placeholder: '{{content.headingMyApps}}',
				text: function () {
					return settings.labels.account.headingMyApps;
				}
			},

			// My Keys Nav Label
			keys: {
				placeholder: '{{content.keys}}',
				text: function () {
					return settings.labels.account.keys;
				}
			},

			// No Applications Message
			noApps: {
				placeholder: '{{content.noApps}}',
				text: function () {
					return settings.labels.account.noApps;
				}
			},

			// No Keys Message
			noKeys: {
				placeholder: '{{content.noKeys}}',
				text: function () {
					return settings.labels.account.noKeys;
				}
			},

			// No Keys for Specific Plan Message
			noPlanKeys: {
				placeholder: '{{content.noPlanKeys}}',
				text: function () {
					return settings.labels.account.noPlanKeys;
				}
			},

			// Email successfully changed message
			emailChanged: {
				placeholder: '{{content.emailChanged}}',
				text: function () {
					return settings.labels.account.emailChanged;
				}
			},

			// Password successfully changed message
			passwordChanged: {
				placeholder: '{{content.passwordChanged}}',
				text: function () {
					return settings.labels.account.passwordChanged;
				}
			}

		},

		// App Registration
		appRegister: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.appRegister.heading;
				}
			},

			// Subheading
			subheading: {
				placeholder: '{{content.subheading}}',
				text: function () {
					return settings.labels.appRegister.subheading;
				}
			}

		},

		// App Registration Success
		appRegisterSuccess: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.appRegisterSuccess.heading;
				}
			},

			// Main Content
			main: {
				placeholder: '{{content.main}}',
				text: function () {
					return settings.labels.appRegisterSuccess.main;
				}
			}

		},

		// Contact
		contact: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.contact.heading;
				}
			},

			// Subheading
			subheading: {
				placeholder: '{{content.subheading}}',
				text: function () {
					return settings.labels.contact.subheading;
				}
			}

		},

		// Contact Success
		contactSuccess: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.contactSuccess.heading;
				}
			},

			// Main Content
			main: {
				placeholder: '{{content.main}}',
				text: function () {
					return settings.labels.contactSuccess.main;
				}
			}

		},

		// 404 Page
		fourOhFour: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.fourOhFour.heading;
				}
			},

			// Main Content
			main: {
				placeholder: '{{content.main}}',
				text: function () {
					return settings.labels.fourOhFour.main;
				}
			}

		},

		// IO Docs
		ioDocs: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.ioDocs.heading;
				}
			},

			// Subheading
			subheading: {
				placeholder: '{{content.subheading}}',
				text: function () {
					return settings.labels.ioDocs.subheading;
				}
			}

		},

		// Join Area for Existing Mashery Users
		join: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.join.heading;
				}
			},

			// Subheading
			subheading: {
				placeholder: '{{content.subheading}}',
				text: function () {
					return settings.labels.join.subheading;
				}
			}

		},

		// Join Successful
		joinSuccess: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.joinSuccess.heading;
				}
			}

		},

		// The layout
		layout: {

			// Footer 1
			footer1: {
				placeholder: '{{layout.footer1}}',
				text: '<div id="footer-1-wrapper"></div>'
			},

			// Footer 2
			footer2: {
				placeholder: '{{layout.footer2}}',
				text: '<div id="footer-2-wrapper"></div>'
			},

			// Main Content
			main: {
				placeholder: '{{layout.main}}',
				text: '<!-- tabindex="-1" hack for skipnav link: https://code.google.com/p/chromium/issues/detail?id=37721 -->' + '<main class="tabindex" tabindex="-1" id="main-wrapper"></main>'
			},

			// Primary Nav
			navPrimary: {
				placeholder: '{{layout.navPrimary}}',
				text: '<nav id="nav-primary-wrapper"></nav>'
			},

			// Secondary Nav
			navSecondary: {
				placeholder: '{{layout.navSecondary}}',
				text: '<nav id="nav-secondary-wrapper"></nav>'
			},

			// User Nav
			navUser: {
				placeholder: '{{layout.navUser}}',
				text: '<nav id="nav-user-wrapper"></nav>'
			}

		},

		// Logout Successful
		logout: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.logout.heading;
				}
			},

			// Main Content
			main: {
				placeholder: '{{content.main}}',
				text: function () {
					return settings.labels.logout.main;
				}
			}

		},

		// Logout Failed
		logoutFail: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.logoutFail.heading;
				}
			},

			// Main Content
			main: {
				placeholder: '{{content.main}}',
				text: function () {
					return settings.labels.logoutFail.main;
				}
			}

		},

		// Lost Password Request
		lostPassword: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.lostPassword.heading;
				}
			},

			// Subheading
			subheading: {
				placeholder: '{{content.subheading}}',
				text: function () {
					return settings.labels.lostPassword.subheading;
				}
			}

		},

		// Lost Password Reset
		lostPasswordReset: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.lostPasswordReset.heading;
				}
			},

			// Main Content
			main: {
				placeholder: '{{content.main}}',
				text: function () {
					return settings.labels.lostPasswordReset.main;
				}
			}

		},

		// Lost Username Request
		lostUsername: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.lostUsername.heading;
				}
			},

			// Subheading
			subheading: {
				placeholder: '{{content.subheading}}',
				text: function () {
					return settings.labels.lostUsername.subheading;
				}
			}

		},

		// Lost Username Reset
		lostUsernameReset: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.lostUsernameReset.heading;
				}
			},

			// Main Content
			main: {
				placeholder: '{{content.main}}',
				text: function () {
					return settings.labels.lostUsernameReset.main;
				}
			}

		},

		// Remove Membership
		memberRemove: {

			// Cancel Button Text
			cancel: {
				placeholder: '{{content.cancel}}',
				text: function () {
					return settings.labels.memberRemove.cancel;
				}
			},

			// Confirm Button Text
			confirm: {
				placeholder: '{{content.confirm}}',
				text: function () {
					return settings.labels.memberRemove.confirm;
				}
			},

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.memberRemove.heading;
				}
			},

			// Main Content
			main: {
				placeholder: '{{content.main}}',
				text: function () {
					return settings.labels.memberRemove.main;
				}
			},

			// Pop Up Confirmation Text
			popup: {
				placeholder: '{{content.popup}}',
				text: function () {
					return settings.labels.memberRemove.popup;
				}
			}

		},

		// Member Successfully Removed
		memberRemoveSuccess: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.memberRemoveSuccess.heading;
				}
			},

			// Main Content
			main: {
				placeholder: '{{content.main}}',
				text: function () {
					return settings.labels.memberRemoveSuccess.main;
				}
			}

		},

		// No Access to this Content
		noAccess: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.noAccess.heading;
				}
			},

			// Main Content
			main: {
				placeholder: '{{content.main}}',
				text: function () {
					return settings.labels.noAccess.main;
				}
			}

		},

		// User Profiles
		profile: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.profile.heading;
				}
			},

			// User Info Subheading
			headingUserInfo: {
				placeholder: '{{content.headingUserInfo}}',
				text: function () {
					return settings.labels.profile.headingUserInfo;
				}
			},

			// User Activity Subheading
			headingActivity: {
				placeholder: '{{content.headingActivity}}',
				text: function () {
					return settings.labels.profile.headingActivity;
				}
			},

			// User Website Label
			userWebsite: {
				placeholder: '{{content.userWebsite}}',
				text: function () {
					return settings.labels.profile.userWebsite;
				}
			},

			// User Blog Label
			userBlog: {
				placeholder: '{{content.userBlog}}',
				text: function () {
					return settings.labels.profile.userBlog;
				}
			},

			// User Registration Date Label
			userRegistered: {
				placeholder: '{{content.userRegistered}}',
				text: function () {
					return settings.labels.profile.userRegistered;
				}
			}

		},

		// User Registration
		register: {

			// About/Sidebar Content
			about: {
				placeholder: '{{content.about}}',
				text: function () {
					return settings.labels.register.sidebar;
				}
			},

			// Form
			form: {
				placeholder: '{{content.form}}',
				text: function () {
					return window.mashery.content.main;
				}
			},

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.register.heading;
				}
			},

			// Subheadin
			subheading: {
				placeholder: '{{content.subheading}}',
				text: function () {
					return settings.labels.register.subheading;
				}
			}

		},

		// Registration Confirmation
		registerSent: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.registerSent.heading;
				}
			}

		},

		// Resend Registration Confirmation
		registerResend: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.registerResend.heading;
				}
			},

			// Subheading
			subheading: {
				placeholder: '{{content.subheading}}',
				text: function () {
					return settings.labels.registerResend.subheading;
				}
			}

		},

		// Registration Confirmation Successfully Resent
		registerResendSuccess: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.registerResendSuccess.heading;
				}
			},

			// Main Content
			main: {
				placeholder: '{{content.main}}',
				text: function () {
					return settings.labels.registerResendSuccess.main;
				}
			}

		},

		// Search Form and Results
		search: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.search.heading;
				}
			},

			// Meta Info
			meta: {
				placeholder: '{{content.meta}}',
				text: function () {
					return settings.labels.search.meta;
				}
			},

			// No Results Found Message
			noResults: {
				placeholder: '{{content.noResults}}',
				text: function () {
					return settings.labels.search.noResults;
				}
			},

			// The Search Query
			query: {
				placeholder: '{{content.query}}',
				text: function () {
					return window.mashery.content.secondary.query;
				}
			},

			// The Start of the Displayed Result Range (X of Y out of Z)
			first: {
				placeholder: '{{content.first}}',
				text: function () {
					return window.mashery.content.secondary.first;
				}
			},

			// The End of the Displayed Result Range (X of Y out of Z)
			last: {
				placeholder: '{{content.last}}',
				text: function () {
					return window.mashery.content.secondary.last;
				}
			},

			// The Total Number of Results
			total: {
				placeholder: '{{content.total}}',
				text: function () {
					return window.mashery.content.secondary.total;
				}
			},

			// Previous Page Link Text
			pagePrevious: {
				placeholder: '{{content.pagePrevious}}',
				text: function () {
					return settings.labels.search.pagePrevious;
				}
			},

			// Next Page Link Text
			pageNext: {
				placeholder: '{{content.pageNext}}',
				text: function () {
					return settings.labels.search.pageNext;
				}
			},

			// Divider Between Previous and Next Links
			pageDivider: {
				placeholder: '{{content.pageDivider}}',
				text: function () {
					return settings.labels.search.pageDivider;
				}
			}

		},

		// Show Secret
		showSecret: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.showSecret.heading;
				}
			},

			// Main Content
			main: {
				placeholder: '{{content.main}}',
				text: function () {
					return settings.labels.showSecret.main;
				}
			}

		},

		// Show Secret: Success
		showSecretSuccess: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.showSecretSuccess.heading;
				}
			},

			// Main Content
			main: {
				placeholder: '{{content.main}}',
				text: function () {
					return settings.labels.showSecretSuccess.main;
				}
			}

		},

		// Show Secret: Error
		showSecretError: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.showSecretError.heading;
				}
			},

			// Main Content
			main: {
				placeholder: '{{content.main}}',
				text: function () {
					return settings.labels.showSecretError.main;
				}
			}

		},

		// Sign In
		signin: {

			// Sign In About Info/Sidebar
			about: {
				placeholder: '{{content.about}}',
				text: function () {
					return settings.labels.signin.sidebar;
				}
			},

			// Sign In Form
			form: {
				placeholder: '{{content.form}}',
				text: function () {
					return window.mashery.content.main;
				}
			},

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.signin.heading;
				}
			},

			// Subheading
			subheading: {
				placeholder: '{{content.subheading}}',
				text: function () {
					return settings.labels.signin.subheading;
				}
			}

		}

	};

	/**
	 * Global Placeholders
	 * Holds placeholders that can be used anywhere in the Portal.
	 */
	var globalPlaceholders = {

		// Portal/Area Name
		area: {
			placeholder: '{{mashery.area}}',
			text: function () {
				return window.mashery.area;
			}
		},

		// Main Content (if there's not one specific to the content type)
		contentMain: {
			placeholder: '{{content.main}}',
			text: function () {
				return window.mashery.content.main;
			}
		},

		// Secondary Content (if there's not one specific to the content type)
		contentSecondary: {
			placeholder: '{{content.secondary}}',
			text: function () {
				return window.mashery.content.secondary;
			}
		},

		// Logo
		logo: {
			placeholder: '{{content.logo}}',
			text: function () {
				return settings.logo ? settings.logo : window.mashery.area;
			}
		},

		// User Account Nav Items (<li><a> href="#"link</a></li> without a parent list wrapper)
		navItemsAccount: {
			placeholder: '{{content.navItemsAccount}}',
			text: function () {
				return getAccountNavItems();
			}
		},

		// Mashery Account Nav Items (<li><a> href="#"link</a></li> without a parent list wrapper)
		navItemsMasheryAccount: {
			placeholder: '{{content.navItemsMasheryAccount}}',
			text: function () {
				return getMasheryAccountNavItems();
			}
		},

		// Primary Nav Items (<li><a href="#">link</a></li> without a parent list wrapper)
		navItemsPrimary: {
			placeholder: '{{content.navItemsPrimary}}',
			text: function () {
				return getNavItems(window.mashery.content.navPrimary);
			}
		},

		// Secondary Nav Items (<li><a href="#">link</a></li> without a parent list wrapper)
		navItemsSecondary: {
			placeholder: '{{content.navItemsSecondary}}',
			text: function () {
				return getNavItems(window.mashery.content.navSecondary);
			}
		},

		// User Nav Items (<li><a href="#">link</a></li> without a parent list wrapper)
		navItemsUser: {
			placeholder: '{{content.navItemsUser}}',
			text: function () {
				return getUserNavItems();
			}
		},

		// Mashery Made Logo
		masheryMade: {
			placeholder: '{{content.masheryMade}}',
			text: '<a id="mashery-made-logo" href="http://mashery.com"><img src="https://support.mashery.com/public/Mashery/images/masherymade.png"></a>'
		},

		// Privacy Policy
		privacyPolicy: {
			placeholder: '{{content.privacyPolicy}}',
			text: function () {
				return settings.labels.register.privacyPolicy;
			}
		},

		// Registration Terms of Use
		registerTerms: {
			placeholder: '{{content.terms}}',
			text: function () {
				var text =
					'<div id="registration-terms-of-service">' +
					'<p>By clicking the "Register" button, I certify that I have read and agree to {{content.privacyPolicy}}the <a href="http://www.mashery.com/terms/">Mashery Terms of Service</a> and <a href="http://www.mashery.com/privacy/">Privacy Policy</a>.</p>' +
					'</div>';
				return text;
			}
		},

		// Search Form
		searchForm: {
			placeholder: '{{content.searchForm}}',
			text: function () {
				var template =
					'<form id="search-form" class="search-form" method="get" action="/search">' +
					'<input class="search-input" id="search-input" type="text" value="" placeholder="' + settings.labels.search.placeholder + '" name="q">' +
					'<button class="search-button" id="search-button" type="submit">' + settings.labels.search.button + '</button>' +
					'</form>';
				return template;
			}
		},

		// Page Title
		title: {
			placeholder: '{{mashery.title}}',
			text: function () {
				var heading = m$.get('h1');
				return (heading ? heading.innerHTML.trim() : window.mashery.title.replace(window.mashery.area + ' - ', '').replace(window.mashery.area, ''));
			}
		},

		// Current User's Username
		username: {
			placeholder: '{{mashery.username}}',
			text: function () {
				return window.mashery.username;
			}
		}

	};


	//
	// Methods
	//

	/**
	 * Replaces placeholders with real content
	 * @param {String} template The template string
	 * @param {String} local    A local placeholder to use, if any
	 */
	var replacePlaceholders = function (template, local) {

		// Check if the template is a string or a function
		template = Object.prototype.toString.call(template) === '[object Function]' ? template() : template;

		// Replace local placeholders (if they exist)
		if (local) {
			var tempLocal = /account/.test(local) ? 'account' : local;
			if (localPlaceholders[tempLocal]) {
				localPlaceholders[tempLocal].forEach((function (placeholder) {
					if (!placeholder.placeholder || !placeholder.text) return;
					template = template.replace(new RegExp(placeholder.placeholder, 'g'), placeholder.text);
				}));
			}
		}

		// Replace paths
		paths.forEach((function (path) {
			if (!path.placeholder || !path.url) return;
			template = template.replace(new RegExp(path.placeholder, 'g'), path.url);
		}));

		// Replace global placeholders
		globalPlaceholders.forEach((function (placeholder) {
			if (!placeholder.placeholder || !placeholder.text) return;
			template = template.replace(new RegExp(placeholder.placeholder, 'g'), placeholder.text);
		}));

		return template;

	};

	/**
	 * Get the user navigation items
	 */
	var getUserNavItems = function () {

		var template;

		if (mashery.loggedIn) {
			// If the user is logged in
			template =
				'<li id="nav-user-myaccount"><a href="{{path.keys}}">' + settings.labels.userNav.account + '</a></li>' +
				(mashery.isAdmin ? '<li><a href="{{path.dashboard}}">' + settings.labels.userNav.dashboard + '</a></li>' : '') +
				'<li id="nav-user-signout"><a href="{{path.logout}}">' + settings.labels.userNav.signout + '</a></li>';
		} else {
			// If they're logged out
			template =
				'<li id="nav-user-signin"><a href="{{path.signin}}">' + settings.labels.userNav.signin + '</a></li>' +
				'<li id="nav-user-register"><a href="{{path.register}}">' + settings.labels.userNav.register + '</a></li>';
		}

		return replacePlaceholders(template);
	};

	/**
	 * Get the account navigation items
	 */
	var getAccountNavItems = function () {
		var template =
			'<li><a href="{{path.keys}}">' + settings.labels.account.keys + '</a></li>' +
			'<li><a href="{{path.apps}}">' + settings.labels.account.apps + '</a></li>' +
			'<li><a href="{{path.account}}">' + settings.labels.account.account + '</a></li>';
		return replacePlaceholders(template);
	};

	/**
	 * Get the Mashery account navigation items
	 */
	var getMasheryAccountNavItems = function () {
		var template =
			'<li><a href="{{path.changeEmail}}">' + settings.labels.account.changeEmail + '</a></li>' +
			'<li><a href="{{path.changePassword}}">' + settings.labels.account.changePassword + '</a></li>' +
			'<li><a href="{{path.viewProfile}}">' + settings.labels.account.viewProfile + '</a></li>' +
			'<li><a href="{{path.removeMembership}}">' + settings.labels.account.removeMembership + '</a></li>';
		return replacePlaceholders(template);
	};

	/**
	 * Convert an array of navigation items into a string
	 * @param {Array} items The navigation items
	 */
	var getNavItems = function (items) {
		var template = '';
		items.forEach((function (item) {
			template += '<li><a href="' + decodeURIComponent(item.url) + '">' + item.label + '</a></li>';
		}));
		return template;
	};

	/**
	 * Load IO Docs scripts if they're not already present
	 */
	var loadIODocsScripts = function () {
		m$.loadJS('/public/Mashery/scripts/Iodocs/prettify.js', (function () {
			m$.loadJS('/public/Mashery/scripts/Mashery/beautify.js', (function () {
				m$.loadJS('/public/Mashery/scripts/vendor/alpaca.min.js', (function () {
					m$.loadJS('/public/Mashery/scripts/Iodocs/utilities.js', (function () {
						m$.loadJS('/public/Mashery/scripts/Iodocs/iodocs.js', (function () {
							m$.loadJS('/public/Mashery/scripts/Mashery/ace/ace.js');
						}), true);
					}), true);
				}), true);
			}), true);
		}), true);
	};

	/**
	 * Load any Mashery files that are required for a page to work
	 * Currently, this is only required for IO Docs
	 */
	var loadRequiredFiles = function () {
		// If not IO Docs, bail
		if (window.mashery.contentType !== 'ioDocs') return;
		if (!('jQuery' in window)) {
			// If jQuery isn't loaded yet, load it
			loadJS('https://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js', loadIODocsScripts);
		} else {
			// Otherwise, just load our scripts
			loadIODocsScripts();
		}
	};

	/**
	 * Render content in the Portal
	 * @param {String}   selector The selector for the element to render the content into
	 * @param {String}   key      The content type
	 * @param {Function} before   The callback to run before rendering
	 * @param {Function} after    The callback to run after rendering
	 */
	var render = function (selector, key, before, after) {

		// Get the content
		var content = m$.get(selector);
		if (!content) return;

		// Run the before callback
		if (before) {
			before();
		}

		// Render the content
		content.innerHTML = settings.templates[key] ? replacePlaceholders(settings.templates[key], key) : '';

		// If custom page or documentation, remove Mashery inserted junk
		if (['page','docs'].indexOf(window.mashery.contentType !== -1)) {
			var junk = m$.getAll('#header-edit, #main .section .section-meta');
			junk.forEach((function (item) {
				item.remove();
			}));
		}

		// Run the after callback
		if (after) {
			after();
		}

	};

	/**
	 * Verify that a user logged in.
	 * @bugfix Sometimes mashery variable provides wrong info at page load after logout event
	 */
	exports.verifyLoggedIn = function () {

		// Only run on logout and member remove pages
		if (['logout', 'memberRemoveSuccess'].indexOf(window.mashery.contentType) === -1) return;

		// Check if the a logout form exists (if so, user is logged in and we can bail)
		var loggedIn = m$.get('#mashery-logout-form', window.mashery.dom);
		if (loggedIn) return;

		// Update mashery object values
		window.mashery.loggedIn = false;
		window.mashery.username = null;
		window.mashery.isAdmin = false;
		window.mashery.dashboard = null;
		window.mashery.logout = null;

	};

	/**
	 * Render the header elements
	 * @param {Boolean} ajax  If true, skip rendering (since they already exist)
	 */
	var renderHead = function (ajax) {

		// Don't run on Ajax (content is already rendered)
		if (ajax) return;

		// Force latest rendering engine in IE
		m$.inject('meta', {
			'http-equiv': 'X-UA-Compatible',
			'content': 'IE=edge,chrome=1'
		});

		// Add a default viewport width
		if (settings.responsive) {
			m$.inject('meta', {
				name: 'viewport',
				content: 'width=device-width, initial-scale=1.0'
			});
		}

		// Add a favicon
		if (settings.favicon && settings.faviconURL) {
			m$.inject('link', {
				rel: 'shortcut icon',
				href: settings.faviconURL
			});

			m$.inject('link', {
				rel: 'icon',
				sizes: settings.faviconSizes,
				href: settings.faviconURL
			});
		}

	};

	/**
	 * Add class hooks for styling to the DOM, and a global JS variable for conditional functions
	 */
	exports.addStyleHooks = function () {

		// Get the app wrapper
		var wrapper = m$.get('#app-wrapper');
		if (!wrapper) return;

		// Get the current pathname (or 'home' if one doesn't exist)
		var path = ['/', '/home'].indexOf(window.location.pathname.toLowerCase()) === -1 ? window.location.pathname.slice(1) : 'home';

		// Add a class hook for the content type and current page
		wrapper.className = m$.sanitizeClass(window.mashery.contentType, 'category') + ' ' + m$.sanitizeClass(path, 'single');

		// Add a JavaScript hook for the current page
		window.mashery.contentId = m$.sanitizeClass(path);

	};

	/**
	 * Render the layout
	 */
	exports.renderLayout = function () {
		render('#app', 'layout', settings.callbacks.beforeRenderLayout, settings.callbacks.afterRenderLayout);
		exports.verifyLoggedIn();
	};

	/**
	 * Render the title attribute
	 */
	exports.renderTitle = function () {
		document.title = replacePlaceholders(settings.labels.title, window.mashery.contentType);
	};

	/**
	 * Render the user navigation
	 */
	exports.renderUserNav = function () {
		render('#nav-user-wrapper', 'userNav', settings.callbacks.beforeRenderUserNav, settings.callbacks.afterRenderUserNav);
	};

	/**
	 * Render the primary navigation
	 */
	exports.renderPrimaryNav = function () {
		render('#nav-primary-wrapper', 'primaryNav', settings.callbacks.beforeRenderPrimaryNav, settings.callbacks.afterRenderPrimaryNav);
	};

	/**
	 * Render the secondary navigation
	 */
	exports.renderSecondaryNav = function () {
		render('#nav-secondary-wrapper', 'secondaryNav', settings.callbacks.beforeRenderSecondaryNav, settings.callbacks.afterRenderSecondaryNav);
	};

	/**
	 * Render the footer
	 */
	exports.renderFooter = function () {

		// Run the before callback
		settings.callbacks.beforeRenderFooter();

		// Render footers 1 and 2
		render('#footer-1-wrapper', 'footer1');
		render('#footer-2-wrapper', 'footer2');

		// Run the after callback
		settings.callbacks.afterRenderFooter();

	};

	/**
	 * Render the main content
	 */
	exports.renderMain = function () {
		loadRequiredFiles();
		render('#main-wrapper', window.mashery.contentType, settings.callbacks.beforeRenderMain, settings.callbacks.afterRenderMain);
	};

	/**
	 * Inject the logout form into the DOM
	 */
	var renderLogout = function () {
		if (!window.mashery.logout || m$.get('#mashery-logout-form')) return;
		document.body.insertBefore(window.mashery.logout, document.body.lastChild);
	};

	/**
	 * Inject the remove member form into the DOM on remove member page
	 */
	var renderMemberRemove = function () {

		// Only run on the member remove page
		if (window.mashery.contentType !== 'memberRemove' || m$.get('#member-remove-form')) return;

		// Get the form
		var form = m$.get('.main form', window.mashery.dom);
		if (!form) return;

		// Give it an ID and make it hidden
		form.id = 'member-remove-form';
		form.setAttribute('hidden', 'hidden');

		// Update the onclick popup text
		var submit = m$.get('#process', form);
		if (submit) {
			submit.setAttribute('onclick', 'return confirm("' + localPlaceholders.memberRemove.popup.text() + '")');
		}

		// Inject it into the DOM
		document.body.lastChild.before(form);
	};

	/**
	 * Jump to anchor or adjust focus when rendering is complete
	 * (Our JS rendering process breaks the normal browser behavior)
	 */
	var fixLocation = function () {
		if (window.location.hash) {
			window.location.hash = window.location.hash;
		} else {
			m$.get('#app').focus();
		}
	};

	/**
	 * Reload IO Docs to force script to reinit after DOM is available
	 */
	var reloadIODocs = function () {

		// Check if IO Docs has been reloaded yet
		if (window.mashery.contentType !== 'ioDocs' || window.masheryIsAjax || window.masheryIsReloaded) return;

		// Set reloaded state to true
		window.masheryIsReloaded = true;

		// Reload IO Docs
		fetchContent(window.location.href, true);

	};

	/**
	 * Render the Mashery Made logo (if missing)
	 */
	exports.renderMasheryMade = function () {

		// Bail if Mashery Made logo is already in the DOM
		var masheryMade = m$.get('#mashery-made-logo');
		if (masheryMade) return;

		// Get the app container
		var app = m$.get('#app');
		if (!app) return;

		// Create our logo container and add the logo
		var mashMade = document.createElement('div');
		mashMade.innerHTML = '<p>x</p><div id="mashery-made"><div class="container"><p>' + globalPlaceholders['{{content.masheryMade}}'] + '</p></div></div>';

		// Inject into the DOM
		app.appendChild(mashMade.childNodes[1]);

	};

	/**
	 * Render the Mashery Terms of Use of registration pages (if missing)
	 */
	exports.renderTOS = function () {

		// Only run on Registration pages
		if (['register', 'join'].indexOf(window.mashery.contentType) === -1) return;

		// Bail if a Terms of Use already exists
		var tos = m$.get('#registration-terms-of-service');
		if (tos) return;

		// Bail if there's no registration form
		var reg = m$.get('form[action*="/member/register"]');
		if (!reg) return;

		// Create our terms of use
		var div = document.createElement('div');
		div.innerHTML = '<p>x</p>' + replacePlaceholders(globalPlaceholders['{{content.terms}}'], 'register');

		// Inject into the DOM
		reg.appendChild(div.childNodes[1]);

	};

	/**
	 * Render the Portal via Ajax
	 * @param {Object}  data      The page data
	 * @param {String}  url       The page URL
	 * @param {Boolean} pushState If true, update browser history
	 */
	var renderWithAjax = function (data, url, pushState) {

		// Update Mashery data
		setupMashery(data);

		// Update Ajax state
		window.masheryIsAjax = true;

		// Scrape content from the DOM object
		getContent(window.mashery.contentType);

		// Update the browser history
		if (pushState) {
			window.history.pushState({ url: url }, data.title, url);
		}

		// Render the Portal content
		exports.renderPortal(true);

	};

	/**
	 * Fetch page content with Ajax
	 * @param {String}  url        The page URL
	 * @param {Boolean} pushState  If true, update browser history
	 */
	var fetchContent = function (url, pushState) {
		atomic.ajax({
			url: url,
			responseType: 'document'
		}).success((function (data) {
			// Render our content on Success
			renderWithAjax(data, url, pushState);
		})).error((function (data, xhr) {
			// If a 404, display 404 error
			if (xhr.status === 404) {
				renderWithAjax(data, url, pushState);
				return;
			}
			// Otherwise, force page reload
			window.location = url;
		}));
	};

	/**
	 * Process link clicks and prepare for Ajax call
	 * @param {Event} event The click event
	 */
	var loadWithAjax = function (event) {

		// Make sure Ajax is enabled and clicked object isn't on the ignore list
		if (!settings.ajax || (settings.ajaxIgnore && event.target.matches(settings.ajaxIgnore)) || event.target.closest(ajaxIgnore)) return;

		// Make sure clicked item was a valid, local link
		if (event.target.tagName.toLowerCase() !== 'a' || !event.target.href || event.target.hostname !== window.location.hostname) return;

		// Skip Ajax on member remove success page
		if (window.mashery.contentType === 'memberRemoveSuccess') return;

		// Don't run if link is an anchor to the current page
		if(event.target.pathname === window.location.pathname && event.target.hash.length > 0) return;

		// Don't run if right-click or command/control + click
		if (event.button !== 0 || event.metaKey || event.ctrlKey) return;

		// Prevent the default click event
		event.preventDefault();

		// Get the content with Ajax
		fetchContent(event.target.href, true);

	};

	/**
	 * Render the Portal
	 * @param {Boolean} ajax  If true, the page is being loaded via Ajax
	 */
	exports.renderPortal = function (ajax) {
		settings.callbacks.beforeRender(); // Run beforeRender() callback
		document.documentElement.classList.add('rendering'); // Add rendering class to the DOM
		renderHead(ajax); // <head> attributes
		exports.addStyleHooks(); // Content-specific classes
		exports.renderLayout(); // Layout
		exports.renderUserNav(); // User Navigation
		exports.renderPrimaryNav(); // Primary Navigation
		exports.renderSecondaryNav(); // Secondary Navigation
		exports.renderMain(); // Main Content
		exports.renderTitle(); // Page Title
		exports.renderFooter(); // Footer
		fixLocation(); // Jump to anchor
		renderLogout(); // Logout Form
		renderMemberRemove(); // Remove Member Form
		exports.renderMasheryMade(); // Add the Mashery Made logo if missing
		exports.renderTOS(); // Add the Mashery Terms of Service if missing from registration page
		settings.callbacks.afterRender(); // Run afterRender() callback
		reloadIODocs(); // Reload IO Docs
		document.documentElement.classList.remove('loading'); // Remove loading class from the DOM
		document.documentElement.classList.remove('rendering'); // Remove rendering class from the DOM
	};

	/**
	 * Process logout events
	 * @param {Event} event The click event
	 */
	var processLogout = function (event) {

		// Bail if there's no logout form
		var logout = m$.get('#mashery-logout-form');
		if (!logout) return;

		// Prevent the default click behavior
		event.preventDefault();

		// Submit the logout form
		logout.submit();

	};

	/**
	 * Process remove membership events
	 * @param {Event} event The click event
	 */
	var processMemberRemove = function (event) {

		// Get the remove member form
		var remove = m$.get('#member-remove-form #process');
		if (!remove || window.mashery.contentType !== 'memberRemove') return;

		// Prevent the default click event
		event.preventDefault();

		// Submit the remove member form
		m$.click(remove);

	};

	/**
	 * Handle all page click events
	 * @param {Event} event The click event
	 */
	var clickHandler = function (event) {

		// Logout events
		if (event.target.closest('a[href*="' + paths.logout.url + '"]')) {
			processLogout(event);
			return;
		}

		// Member remove events
		if (event.target.closest('a[href*="' + paths.memberRemove.url + '"]')) {
			processMemberRemove(event);
			return;
		}

		// Ajax
		loadWithAjax(event);

	};

	/**
	 * Handle popstate events and update page content
	 * @param {Event} event  The popstate event
	 */
	var popstateHandler = function (event) {
		var url = event.state && event.state.url ? event.state.url : window.location.href;
		fetchContent(url);
	};

	/**
	 * Handle for submit events
	 * Currently only used for Search form, but may be expanded in the future
	 * @param {Event} event  The form submit event
	 */
	var submitHandler = function (event) {

		// Bail if form isn't search or Ajax is disabled
		if (!event.target.closest('#search-form') || !settings.ajax) return;

		// Get search form input field
		var input = m$.get('#search-input', event.target);
		if (!input) return;

		// Prevent default form event
		event.preventDefault();

		// Fetch the search results page
		fetchContent(paths.search.url + '?q=' + encodeURIComponent(input.value), true);

	};

	/**
	* Initialize
	* @public
	* @param {object} options User options and overrides
	*/
	exports.init = function (options) {

		m$.loadJS('https://cdn.polyfill.io/v2/polyfill.min.js?features=default', (function () {

			// Merge user options with defaults
			settings = m$.extend( defaults, options || {} );

			// Run callback before initializing
			settings.callbacks.beforeInit();

			// Render the Portal
			exports.renderPortal();

			// Listen for click events
			m$.on('click', clickHandler);

			if (settings.ajax) {
				m$.on('popstate', popstateHandler);
				m$.on('submit', submitHandler);
			}

			// Run callback after initializing
			settings.callbacks.afterInit();

		}));

	};


	//
	// Public APIs
	//

	return exports;

})();
var ioDocs = (function () {

	'use strict';

	//
	// Variables
	//

	// Public API placeholder
	var exports = {};

	// Selectors
	apiDescriptionListBoxes = '.apiDescriptionList';
	apiSelectBox = '#apiId';
	apiTitle = '#apiTitle';
	apiCredentialBox = '.credentials';
	apiCredentialForm = '#credentials';
	apiKeyInput = '#apiKey';
	apiSecretInput = '#apiSecret';
	apiKeySecretInput = '#apiKeySecret';
	showManualKeySecret = '#showManualKeySecret';
	emControlBox = '#controls';
	apiEndpointListBoxes = '.endpointList';
	toggleEndpointsLink = '#toggleEndpoints';
	toggleMethodsLink = '#toggleMethods';
	apiOAuth2FlowType = '#apiOAuth2FlowType';
	apiOAuth2AuthBtn = '#apiOAuth2AuthorizationButton';
	apiOAuth2ImplABtn = '#apiOAuth2ImplicitExchangeButton';
	apiOAuth2CCBtn = '#apiOAuth2AuthClientCredExchangeButton';
	apiOAuth2PCBtn = '#apiOAuth2AuthPassCredExchangeButton';
	apiOAuth2AccessBtn = '#apiOAuth2AuthExchangeButton';
	apiBasicAuthName = '#apiBasicAuthUsername';
	apiBasicAuthPass = '#apiBasicAuthPassword';
	apiSoapBasicAuthName = '#apiSoapBasicAuthUsername';
	apiSoapBasicAuthPass = '#apiSoapBasicAuthPassword';
	apiSoapWssUserNameTokenAuthName = '#apiSoapWssUserNameTokenAuthUsername';
	apiSoapWssBinarySecurityTokenAuthToken = '#apiSoapWssBinarySecurityTokenAuthToken';

	var authTimer, enableHSSM, syncTokenValue;


	//
	// Methods
	//

	// Select API
	exports.selectApiById = function (id) {

		// Reset selected attribute
		document.querySelectorAll().forEach((function (box) {
			box.setAttribute('data-is-selected', false);
		}));

		// No id selected, so hide everything
		if (!id) {
			return exports.hideAll();
		}

		// Set endpoint list box as selected
		document.querySelectorAll(apiEndpointListBoxes + '#api' + id + ', ' + apiDescriptionListBoxes + '#apiDescription' + id).forEach((function (box) {
			box.setAttribute('data-is-selected', true);
		}));

		// Show everything that needs to be shown
		exports.showApiCredentialBox(id);
		exports.showApiDescriptionBox();
		exports.showEMControlBox();
		exports.hideAllUnselectedApiEndpointLists();
		exports.showSelectedApiEndpointList();
		exports.showAllSelectedEndpoints();

	};

	// Get Selected API Endpoint List Box
	exports.getSelectedApiEndpointListBox = function () {
		return document.querySelector(apiEndpointListBoxes + '[data-is-selected="true"]');
	};

	// Get Selected API Id
	exports.getSelectedApiId = function () {
		return exports.getSelectedApiEndpointListBox().getAttribute('data-api-id');
	};

	// Show API Info Box
	exports.showApiDescriptionBox = function () {
		exports.hideApiDescriptionBox();
		var boxes = document.querySelectorAll(apiDescriptionListBoxes + '#apiDescription' + exports.getSelectedApiId() + ':hidden');
		boxes.forEach((function (box) {
			box.style.display = 'block';
		}));
	};

	// Hide API Info Box
	exports.hideApiDescriptionBox = function () {
		var boxes = document.querySelectorAll(apiDescriptionListBoxes + ':not(#apiDescription' + exports.getSelectedApiId() + '):visible');
		boxes.forEach((function (box) {
			box.style.display = 'none';
		}));
	};

	// Show EM Control box
	exports.showEMControlBox = function () {
		document.querySelectorAll(emControlBox + ':hidden').forEach((function (box) {
			box.style.display = 'block';
		}));
	};

	// Hide EM Control box
	exports.hideEMControlBox = function () {
		document.querySelectorAll(emControlBox + ':visible').forEach((function (box) {
			box.style.display = 'none';
		}));
	};

	// Show API Endpoint list
	exports.showSelectedApiEndpointList = function () {
		var boxes = document.querySelectorAll(apiEndpointListBoxes + '#api' + exports.getSelectedApiId() + ':hidden');
		boxes.forEach((function (box) {
			box.style.display = 'block';
		}));
	};

	// Hide all API Endpoint lists
	exports.hideAllApiEndpointLists = function () {
		var boxes = document.querySelectorAll(apiEndpointListBoxes + ':visible');
		boxes.forEach((function (box) {
			box.style.display = 'none';
		}));
	};

	// Hide all API Endpoint Lists that aren't id
	exports.hideAllUnselectedApiEndpointLists = function () {
		var boxes = document.querySelectorAll(apiEndpointListBoxes + ':not(#api' + exports.getSelectedApiId() + '):visible');
		boxes.forEach((function (box) {
			box.style.display = 'none';
		}));
	};

	// Show all endpoints for shown endpoint list
	exports.toggleAllSelectedEndpoints = function () {
		console.log('Need to do this later');
		// // Get all selected methods lists
		// var methodsLists = apiEndpointListBoxes.find('.endpoint:visible > .methods');

		// // Show all method lists if at least one is not visible
		// if (methodsLists.filter(':hidden').length) {
		// 	methodsLists.slideDown();
		// } else {
		// 	methodsLists.slideUp();
		// }
	};

	// Show all selected endpoints
	exports.showAllSelectedEndpoints = function () {
		document.querySelectorAll(apiEndpointListBoxes + ' .endpoint:visible > .methods:hidden').forEach((function(box) {
			box.style.display = 'block';
		}));
	};

	// Toggle all methods for shown endpoint list
	exports.toggleAllSelectedMethods = function () {
		// Keep tabs on how many method lists are enabled
		var methodsLists = document.querySelectorAll(apiEndpointListBoxes + ' .endpoint:visible > .methods');
		// var methodsListsCount = methodsLists.filter(':hidden').length;

		// Show all endpoints
		exports.showAllSelectedEndpoints();

		// Force show forms if at least one method list wasn't shown (which is now shown)
		// @todo
		// if (methodsListsCount) {
		// 	return exports.showAllSelectedMethods();
		// }

		// Get all visible methods
		var methods = methodsLists.querySelectorAll('.method:visible > form');

		// Show all methods if at least one is not visible
		// if (methods.filter(':hidden').length) {
		// 	methods.slideDown();
		// } else {
		// 	methods.slideUp();
		// }
		console.log('need to do this, too');

	};

	// Show all selected methods
	exports.showAllSelectedMethods = function () {
		document.querySelectorAll(apiEndpointListBoxes + ' .endpoint:visible .method:visible > form:hidden').forEach((function (box) {
			box.style.display = 'block';
		}));
	};

	// Hide all selected methods
	exports.hideAllSelectedMethods = function () {
		document.querySelectorAll(apiEndpointListBoxes + ' .endpoint.visible .method:visible > form:visible').forEach((function (box) {
			box.style.display = 'none';
		}));
	};

	// Hide ALL the things!
	exports.hideAll = function () {
		exports.hideAllApiCredentialBoxes();
		exports.hideApiDescriptionBox();
		exports.hideEMControlBox();
		exports.hideAllApiEndpointLists();
	};

	// Initialize API JSON schemas for use with the the alpaca (http://www.alpacajs.org) forms.
	exports.initApiSchemas = function () {
		var arrayCleaned = false;

		// For each API (root ul element)
		document.querySelectorAll(apiEndpointListBoxes).forEach((function (box) {

			if (!arrayCleaned) {
				arrayCleaned = true;
				// remove augmentation caused by Mashery-Base.js
				// TODO: fix Mashery-Base.js and remove this block
				for (var n in Array.prototype) {
					if (Array.prototype.hasOwnProperty(n)) {
						delete Array.prototype[n];
					}
				}
			}

			// Get the schemas associated with this API
			var apiSchemas = $.data($(this).get(0), 'apiSchemas');
			if (apiSchemas && !$.isEmptyObject(apiSchemas)) {

				$.each(apiSchemas, (function (schemaId, schema) {

					if (!schema.title) {
						schema.title = schemaId;
					}

					exports.initApiSchemaProperties(schema.properties);
				}));
			}

		}));

	};

	// Recursively initialize the properties of an object defined within a JSON schema.
	exports.initApiSchemaProperties = function (properties) {

		if (properties) {
			$.each(properties, (function (propertyName, property) {

				if (!property.title) {
					// Default to using the property name if no title is specified for the property
					property.title = propertyName.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (function (str) { return str.toUpperCase(); }));
				}

				// Re-write object schema references to enable alpaca's support for schema references
				// See: http://www.alpacajs.org/examples/components/jsonschema/references.html

				if (property.$ref && property.$ref.indexOf('#') !== 0) {
					// Re-write object schema references to be locally relative to this schema
					property.$ref = '#/definitions/' + property.$ref;
				}

				if (property.items && property.items.$ref && property.items.$ref.indexOf('#') !== 0) {
					// Re-write array item schema references to be locally relative to this schema
					property.items.$ref = '#/definitions/' + property.items.$ref;
				}

				if (property.type === 'object') {
					// Recursively initialize the properties of the nested schema
					exports.initApiSchemaProperties(property.properties);
				} else if (property.type === 'array') {
					// Recursively initialize the properties of the nested schema
					exports.initApiSchemaProperties(property.items.properties);
				}
			}));
		}

	};

	// Initialize the alpaca (http://www.alpacajs.org) forms for each method with a JSON schema-defined request body
	exports.initRequestBodyAlpacaForms = function () {
		// override the Alpaca Integerfield's getValue to return empty string
		Alpaca.Fields.IntegerField.prototype.getValue = function () {
			var textValue = this.field.val();
			if (Alpaca.isValEmpty(textValue)) {
				return '';
			} else {
				return parseFloat(textValue);
			}
		};

		// private function to generate schema options from the definition properties
		function getSchemaOptions(schema) {
			var options = {}; // init options

			if (schema.properties) { // ensure valid properties
				$.each(schema.properties, (function (key, value) { // generate schema options from the schema
					if (value.type === 'array') {
						var arrayOptions = getSchemaOptions(value.items); // recurse!

						if (!options[key]) {
							options[key] = { 'items': {} }; // init field options
						}

						options[key].toolbarSticky = true;
						options[key].fieldClass = 'iodoc-array-field';
						options[key].items.showMoveUpItemButton = false;
						options[key].items.showMoveDownItemButton = false;

						if (!$.isEmptyObject(arrayOptions)) { // if recursion wasn't empty
							options[key].fields = { 'item': { 'fields': arrayOptions } }; // set proper alpaca options
						}
					} else if (value.properties) { // check for nested properties
						if (!options[key]) {
							options[key] = { 'fields': {} };
						}
						options[key].fields = getSchemaOptions(value); // recurse!
					}
				}));
			}

			return options;
		}

		// For each API (root ul element)
		apiEndpointListBoxes.each((function () {
			// Get the schemas associated with this API
			var apiSchemas = $.data($(this).get(0), 'apiSchemas');

			if (apiSchemas && !$.isEmptyObject(apiSchemas)) { // ensure valid schema retrieved
				// Find all of the nested elements that should contain alpaca form for the request body
				var requestBodySchemaContainers = $(this).find('.requestBodySchemaContainer');

				requestBodySchemaContainers.each((function () {
					// Get the schema ID associated with the request body
					var requestBodySchemaId = $(this).attr('data-request-body-schema-id');

					if (requestBodySchemaId) {
						// Get the method form element that contains this alpaca container element
						var methodForm = $(this).parent('form').get(0);
						// Get the schema associated with the method's request body
						var requestBodySchema = apiSchemas[requestBodySchemaId];

						if (requestBodySchema && methodForm) {
							// Shallow copy the schema to add the definitions for use with alpaca
							// Set all of the API schemas as definitions to enable alpaca's support for schema references
							// See: http://www.alpacajs.org/examples/components/jsonschema/references.html
							var requestBodyAlpacaSchema = $.extend({ 'definitions': apiSchemas }, requestBodySchema);
							var schemaOptions = getSchemaOptions(requestBodyAlpacaSchema); // get schema options
							var defaultValue = JSON.parse($(this).attr('data-request-body-default-value')) || {};

							// Initialize the alpaca component on this container element
							$(this).alpaca({
								"schema": requestBodyAlpacaSchema,
								"data": defaultValue,
								"options": $.extend({ "name": "requestBody" }, { 'fields': schemaOptions }),
								"postRender": function (requestBodyAlpacaForm) {
									// In order to extract the alpaca form data as a JSON object on form submit,
									// store a reference to the alpaca form object in the method form element
									$.data(methodForm, 'requestBodyAlpacaForm', requestBodyAlpacaForm);
								}
							});
						}
					}
				}));
			}
		}));
	};

	/**
	 * Initialize the ACE editor
	 *
	 * Currently looks for request body elements and the sibling editor element
	 * Instantiates the editor on request body focus and restores on blur
	 */
	exports.initAceEditor = function () {
		$('.method > div.title').click((function () { // when the method is expanded
			var textarea = $(this).siblings('form').find('.requestBody'); // jquery textarea
			var parameters = textarea.siblings('.parameters'); // get the parameters for this definition
			var mode = 'text'; // default editor mode
			var editorEl = textarea.siblings('.request-body-editor'); // look for editor element

			if (editorEl.length > 0) { // check for found element
				if (!this.editor) { // check for previous instantiation
					if (parameters) { // check for params and get the editor mode
						mode = exports.getEditorMode(parameters.find('[name="params[Content-Type]"]').val());
					}
					this.editor = ace.edit(editorEl[0]); // instantiate editor
					this.editor.getSession().setMode('ace/mode/' + mode); // set the editor mode
					this.editor.getSession().on('change', $.proxy((function () { // on value change let's resize the height
						var height = this.editor.getSession().getScreenLength() * this.editor.renderer.lineHeight + this.editor.renderer.scrollBar.getWidth();
						if (height > textarea.height()) { // ensure not  less than the original text area
							editorEl.css('height', height + 'px'); // set element height
							this.editor.resize(); // set resize
						}
					}), this));
					this.editor.on('blur', $.proxy((function () { // when we lose focus
						textarea.val(this.editor.getSession().getValue()); // update the text area
					}), this));
				}

				textarea.hide(); // hide original textarea
				editorEl.css('height', textarea.height()).show(); // display the editor element
				this.editor.resize(); // update editor size
				this.editor.focus(); // focus editor
			}
		}));
	};

	/**
	 * Helper function to retrieve the ACE editor mode to use based on a passed in string
	 *
	 * @params {String} mode The mode to read from, usually Content-Type
	 *
	 * @returns {String} The mode to set ACE to
	 */
	exports.getEditorMode = function (mode) {
		if (typeof (mode) === 'string') { // ensure string
			if (mode.toLowerCase().indexOf('json') >= 0) { // check for json
				return 'json';
			}
		}

		return 'text'; // default mode
	};

	/*** START CREDENTIALS ***/

	exports.getCurrentAuthType = function () {
		var apiStoreElem = $('#api' + apiSelectBox.val()),
			auth_type = apiStoreElem.attr('data-auth-type');

		return auth_type;
	};

	exports.getBasicAuthEnabled = function () {
		var apiStoreElem = $('#api' + apiSelectBox.val()),
			basicAuth = apiStoreElem.attr('data-basic-auth');

		return (basicAuth === 'true');
	};

	exports.showApiCredentialBox = function (id) { // TODO: id is unused

		exports.hideAllApiCredentialBoxes();

		apiCredentialForm.each((function () {
			this.reset();
		}));

		var apiStoreElem = $('#api' + apiSelectBox.val()),
			auth_type = exports.getCurrentAuthType(),
			authCSSClass = ".credentials_start." + auth_type,
			available_keys = $.parseJSON(apiStoreElem.attr('data-available-keys'));

		if (exports.getBasicAuthEnabled()) {
			$('#apiBasicAuthCredFlowContainer').show();
		}

		switch (auth_type) {
			case 'key':
				$('#apiSecretContainer').hide();
				$('#apiKeySecretListContainer').hide();
				$('#apiKeyContainer').hide();

				if (available_keys && available_keys.length) {

					$('#apiKeySecret').empty();

					$.each(available_keys, (function (k, v) {
						var label = '';
						if (v.application) {
							label = v.application + ": " + v.key;
						} else {
							label = v.key;
						}
						$('#apiKeySecret').append($('<option>', { value: v.key, "data-secret": v.secret }).text(label));
					}));

					$('#apiKeySecretListContainer').slideDown();

					if (enableHSSM) {
						$('#apiSecretContainer').slideDown();
						showManualKeySecret.hide();
					}
				} else {
					$('#apiKeyContainer').slideDown();

					if (apiStoreElem.attr('data-secret') === "1") {
						$('#apiSecretContainer').slideDown();
					}
				}
				break;

			case 'oauth2':

				var auth_flows = $.parseJSON(apiStoreElem.attr('data-auth-flows'));

				$('#apiOAuth2FlowType').empty();

				$('#apiOAuth2PresetKeysContainer').hide();

				if (auth_flows) {
					$.each(auth_flows, (function (k, v) {

						var auth_flow_desc = function (v) {
							switch (v) {
								case 'auth_code':
									return "Authorization Code / Web Server";
								case 'implicit':
									return "Implicit / Javascript Client";
								case 'password_cred':
									return "Password Credentials";
								case 'client_cred':
									return "Client Credentials";
								default:
									return "Unknown";
							}
						};

						$('#apiOAuth2FlowType').append($('<option>', { value: v }).text(auth_flow_desc(v)));
					}));
				}

				if (available_keys && available_keys.length) {
					$('#apiOAuth2PresetKeys').empty();
					$('#apiOAuth2PresetKeys').append($('<option>', { value: "__manual" }).text("Manual Input"));

					$.each(available_keys, (function (k, v) {
						$('#apiOAuth2PresetKeys').append($('<option>', { value: v.key, "data-secret": v.secret }).text(v.application));
					}));

					$('#apiOAuth2PresetKeysContainer').slideDown();
				}

				$('#apiOAuth2FlowType').change();

				break;
			case 'soapWssSecurityAuth':

				var token_types = $.parseJSON(apiStoreElem.attr('data-auth-wss-token-types'));

				if (token_types) {

					$.each(token_types, (function (k, v) {

						if (v == 'soapWssUserNameToken') {

							var container = $('#apiSoapWssUserNameTokenAuthCredFlowContainer').slideDown(),
								wssFields = exports.getWssFields(),
								i,
								field;

							// clear fields before adding to avoid duplicates
							container.find('.SoapWssUserNameTokenAuthGenerated').remove();

							for (i = 0; i < wssFields.length; i++) {
								field = '<div class="SoapWssUserNameTokenAuthGenerated">';
								field += '<label for="apiSoapWssUserNameTokenAuth' + wssFields[i] + '">' + wssFields[i] + ':</label>';
								field += '<input type="text"  id="apiSoapWssUserNameTokenAuth' + wssFields[i] + '"/>';
								field += '</div>';
								container.append(field);
							}
						} else if (v == 'soapWssBinarySecurityToken') {
							$('#apiSoapWssBinarySecurityTokenAuthCredFlowContainer').slideDown();
						}

					}));
				}

				break;
			case 'soapBasic':
				$('#apiSoapBasicAuthCredFlowContainer').slideDown();
				break;
			default:
				break;
		}

		$(authCSSClass).slideDown();
	};


	exports.hideAllApiCredentialBoxes = function () {
		$('.credentials').filter(':visible').slideUp();
	};

	exports.hideOAuth2CredentialInputs = function () {
		$('.credentials.oauth2').not('.credentials_start').slideUp();
	};

	exports.setOAuth2AuthorizeCode = function (code) {
		$('#apiOAuth2AuthorizeCode').val(code);
		$('#apiOAuth2AuthorizeCodeContainer').slideDown();

		if ($('#api' + exports.getSelectedApiId()).attr('data-auto-exchange-auth-code') === "1") {
			apiOAuth2AccessBtn.hide();
			exports.exchangeAuthCodeforAccessToken();
		}
	};

	exports.getAuthorizationCode = function (client_id, client_secret) {
		// open empty window before async call (async code triggers popup blocker on window.open)
		var oAuth2AuthWindow = window.open(null, "masheryOAuth2AuthWindow", "width=300,height=400");

		window.clearInterval(exports.authTimer); // clear the timer
		exports.authTimer = window.setInterval((function () {
			if (oAuth2AuthWindow.closed !== false) { // when the window is closed
				window.clearInterval(exports.authTimer); // clear the timer
				exports.setOAuth2AuthorizeCode(window.auth_code); // set the auth code from the popup window
				delete window.auth_code; // clear the auth code just in case
			}
		}), 200);

		$.ajax({
			async: true,
			headers: {
				'X-Ajax-Synchronization-Token': syncTokenValue
			},
			data: {
				apiId: apiSelectBox.val(),
				client_id: client_id,
				client_secret: client_secret,
				auth_flow: "auth_code"
			},
			dataType: 'json',
			global: false,
			timeout: 10000,
			type: 'POST',
			url: '/io-docs/getoauth2authuri',
			error: function (jqXHR, textStatus, errorThrown) {
				alert(jqXHR.responseText);
			},
			success: function (data, textStatus, jqXHR) {
				if (data.success) {
					oAuth2AuthWindow.location.href = data.authorize_uri;
					oAuth2AuthWindow.focus();
					// } else {  TODO:  Should this return an error on failure?
					// exports.resetOAuth2AccessToken();
					// alert(jqXHR.responseText);
					// alert("ERROR: 324  --  Sorry there was an error getting an access token. Try again later.");
				} else {
					oAuth2AuthWindow.close();
				}
			}
		});
	};

	exports.sendImplicitAccessToken = function (token, errorCallback, successCallback) {
		$.ajax({
			async: true,
			headers: {
				'X-Ajax-Synchronization-Token': syncTokenValue
			},
			data: {
				apiId: apiSelectBox.val(),
				access_token: token.access_token,
				expires_in: token.expires_in,
				token_type: token.token_type
			},
			dataType: 'json',
			global: false,
			timeout: 10000,
			type: 'POST',
			url: '/io-docs/catchOauth2ImplicitToken',
			error: function () {
				alert("Sorry, there was an error processing the response from the OAuth2 server. Try again later");
			},
			success: function (data) {
				if (data.success) {
					exports.setOAuth2AccessToken(token.access_token);
				} else {
					alert("Sorry, but there was an error during the account authorization process. Either the credentials were not entered correctly, or permission was denied by the account holder. Please try again.");
				}
			}
		});
	};

	exports.getImplicitAccessToken = function (client_id) {
		// open empty window before async call (async code triggers popup blocker on window.open)
		var oAuth2AuthWindow = window.open(null, "masheryOAuth2AuthWindow", "width=300,height=400");

		window.clearInterval(exports.authTimer); // clear the timer
		exports.authTimer = window.setInterval((function () {
			if (oAuth2AuthWindow.closed !== false) { // when the window is closed
				window.clearInterval(exports.authTimer); // clear the timer
				exports.sendImplicitAccessToken(window.access_token); // set the auth code from the popup window
				delete window.access_token; // clear the auth code just in case
			}
		}), 200);

		$.ajax({
			async: true,
			headers: {
				'X-Ajax-Synchronization-Token': syncTokenValue
			},
			data: {
				apiId: apiSelectBox.val(),
				client_id: client_id,
				auth_flow: "implicit"
			},
			dataType: 'json',
			global: false,
			timeout: 10000,
			type: 'POST',
			url: '/io-docs/getoauth2authuri',
			error: function (jqXHR, textStatus, errorThrown) {
				alert(jqXHR.responseText);
			},
			success: function (data, textStatus, jqXHR) {
				if (data.success) {
					oAuth2AuthWindow.location.href = data.authorize_uri;
					oAuth2AuthWindow.focus();
				} else {
					oAuth2AuthWindow.close();
					exports.resetOAuth2AccessToken();
					// TODO:  Should this display an error on failure?
					// alert(jqXHR.responseText);
				}
			}
		});
	};

	exports.resetOAuth2AccessToken = function () {
		$('#apiOAuth2AccessToken').val("");
		$('#apiOAuth2AccessTokenContainer').slideUp();
	};

	exports.setOAuth2AccessToken = function (token) {
		$('#apiOAuth2AccessToken').val(token);
		$('#apiOAuth2AccessTokenContainer').slideDown();
	};

	exports.getAccessTokenFromPasswordCred = function (client_id, client_secret, username, password) {

		$.ajax({
			async: true,
			headers: {
				'X-Ajax-Synchronization-Token': syncTokenValue
			},
			data: {
				apiId: apiSelectBox.val(),
				auth_flow: 'password_cred',
				client_id: client_id,
				client_secret: client_secret,
				username: username,
				password: password
			},
			dataType: 'json',
			global: false,
			timeout: 10000,
			type: 'GET',
			url: '/io-docs/getoauth2accesstoken',
			error: function (jqXHR, textStatus, errorThrown) {
				alert(jqXHR.responseText);
			},
			success: function (data, textStatus, jqXHR) {
				if (data.success) {
					exports.setOAuth2AccessToken(data.result.access_token);
				} else {
					exports.resetOAuth2AccessToken();
					alert(jqXHR.responseText);
				}
			}
		});
	};

	exports.getAccessTokenFromClientCred = function (client_id, client_secret) {

		$.ajax({
			async: true,
			headers: {
				'X-Ajax-Synchronization-Token': syncTokenValue
			},
			data: {
				apiId: apiSelectBox.val(),
				auth_flow: 'client_cred',
				client_id: client_id,
				client_secret: client_secret
			},
			dataType: 'json',
			global: false,
			timeout: 10000,
			type: 'GET',
			url: '/io-docs/getoauth2accesstoken',
			error: function (jqXHR, textStatus, errorThrown) {
				alert(jqXHR.responseText);
			},
			success: function (data, textStatus, jqXHR) {
				if (data.success) {
					exports.setOAuth2AccessToken(data.result.access_token);
				} else {
					exports.resetOAuth2AccessToken();
					alert(jqXHR.responseText);
				}
			}
		});
	};

	exports.exchangeAuthCodeforAccessToken = function () {
		$.ajax({
			async: true,
			headers: {
				'X-Ajax-Synchronization-Token': syncTokenValue
			},
			data: {
				apiId: apiSelectBox.val(),
				auth_flow: 'auth_code',
				authorization_code: $('#apiOAuth2AuthorizeCode').val()
			},
			dataType: 'json',
			global: false,
			timeout: 10000,
			type: 'GET',
			url: '/io-docs/getoauth2accesstoken',
			error: function (jqXHR, textStatus, errorThrown) {
				alert(jqXHR.responseText);
			},
			success: function (data, textStatus, jqXHR) {
				if (data.success) {
					exports.setOAuth2AccessToken(data.result.access_token);
				} else {
					exports.resetOAuth2AccessToken();
					alert(jqXHR.responseText);
				}
			}
		});
	};

	/*** END CREDENTIALS ***/


	// Callback for OAuth Success
	exports.oauthSuccess = function () {
		alert('You have successfully logged in');
	};

	exports.getWssFields = function () {

		var wssFields,
			apiStoreElem = $('#api' + apiSelectBox.val()),
			wssFieldsValue = apiStoreElem.attr('data-auth-wss-fields');

		if (wssFieldsValue && wssFieldsValue.length > 0) {
			wssFields = $.parseJSON(wssFieldsValue);
		}

		return wssFields || [];
	};

	// Bind page elements

	// Set select to add 40px to it's calculated width, padding doesn't work in IE
	apiSelectBox.width(apiSelectBox.outerWidth() + 40);

	// Set the span in the h2 to reflect selected option
	apiTitle.text(apiSelectBox.find('option:selected').text()).width(apiSelectBox.outerWidth()).height(apiSelectBox.outerHeight());

	apiSelectBox.change((function () {
		exports.selectApiById(apiSelectBox.val());
		apiTitle.text(apiSelectBox.find('option:selected').text());
	}));

	$('#apiOAuth2PresetKeys').change((function (event) {

		var selectedPresetKey = $('#apiOAuth2PresetKeys').find('> :selected');

		if ((selectedPresetKey.val() === "__manual") || (selectedPresetKey.val() === "")) {
			$('.oauth2_client_id_field').val("");
			$('.oauth2_client_secret_field').val("");
		} else {
			$('.oauth2_client_id_field').val(selectedPresetKey.val());
			$('.oauth2_client_secret_field').val(selectedPresetKey.attr('data-secret'));
		}

	}));

	apiOAuth2FlowType.change((function (event) {

		exports.hideOAuth2CredentialInputs();

		if (apiOAuth2FlowType.val() === "") {
			return;
		}

		switch (apiOAuth2FlowType.val()) {
			case 'auth_code':
				$('#apiOAuth2AuthCodeFlowContainer').slideDown();
				break;
			case 'implicit':
				$('#apiOAuth2ImplicitFlowContainer').slideDown();
				break;
			case 'password_cred':
				$('#apiOAuth2PasswordCredFlowContainer').slideDown();
				break;
			case 'client_cred':
				$('#apiOAuth2ClientCredFlowContainer').slideDown();
				break;
			default:
				break;
		}

	}));

	apiOAuth2PCBtn.click((function (event) {
		event.preventDefault();
		exports.getAccessTokenFromPasswordCred(
			$('#apiOAuth2ClientIdPasswordCred').val(),
			$('#apiOAuth2ClientSecretPasswordCred').val(),
			$('#apiOAuth2Username').val(),
			$('#apiOAuth2Password').val());
	}));

	apiOAuth2CCBtn.click((function (event) {
		event.preventDefault();
		exports.getAccessTokenFromClientCred(
			$('#apiOAuth2ClientIdClientCred').val(),
			$('#apiOAuth2ClientSecretClientCred').val());
	}));

	apiOAuth2AuthBtn.click((function (event) {
		event.preventDefault();
		exports.getAuthorizationCode(
			$('#apiOAuth2ClientIdAuthCode').val(),
			$('#apiOAuth2ClientSecretAuthCode').val());
	}));

	apiOAuth2ImplABtn.click((function (event) {
		event.preventDefault();
		exports.getImplicitAccessToken(
			$('#apiOAuth2ClientIdImplicit').val());
	}));

	apiOAuth2AccessBtn.click((function (event) {
		event.preventDefault();
		exports.exchangeAuthCodeforAccessToken();
	}));

	showManualKeySecret.click((function (event) {
		// Disable following link
		event.preventDefault();

		var apiStoreElem = $('#api' + apiSelectBox.val());

		$('#apiSecretContainer').hide();
		$('#apiKeySecretListContainer').hide();
		$('#apiKeyContainer').hide();
		$('#apiKeyContainer').slideDown();

		if (apiStoreElem.attr('data-secret') === "1") {
			$('#apiSecretContainer').slideDown();
		}
	}));

	toggleEndpointsLink.click((function (event) {
		// Disable following link
		event.preventDefault();

		exports.hideAllSelectedMethods();
		exports.toggleAllSelectedEndpoints();
	}));

	toggleMethodsLink.click((function (event) {
		// Disable following link
		event.preventDefault();

		exports.toggleAllSelectedMethods();
	}));

	$('.endpoint > h3 > span.name').click((function (event) {
		// Disable following link
		event.preventDefault();

		// Toggle methods
		$(this).closest('.endpoint').find('.methods').slideToggle();
	}));

	$('.list-methods > a').click((function (event) {
		// Disable following link
		event.preventDefault();

		$(this).closest('.endpoint').find('.methods:hidden').slideDown();
	}));

	$('.expand-methods > a').click((function (event) {
		// Disable following link
		event.preventDefault();

		$(this).closest('.endpoint').find('.methods:hidden').slideDown();
		$(this).closest('.endpoint').find('.method:visible > form:hidden').slideDown();
	}));

	$('.method > div.title').click((function (event) {
		// Disable following link
		event.preventDefault();

		$(this).parent().find('form').slideToggle();
	}));

	$('.method > form').submit((function (event) {
		// Disable actual submission
		event.preventDefault();

		// Get response box, form params, and api values
		var responseBox = $(this).children('div.result'),
			errorBox = $(this).children('div.error'),
			params = $(this).serializeArray(),
			apiId = {
				name: 'apiId',
				value: exports.getSelectedApiId()
			},
			apiKey = {
				name: 'apiKey',
				value: apiKeyInput.val()
			},
			apiSecret = {
				name: 'apiSecret',
				value: apiSecretInput.val()
			},
			basicAuthName = {
				name: 'basicAuthName',
				value: apiBasicAuthName.val()
			},
			basicAuthPass = {
				name: 'basicAuthPass',
				value: apiBasicAuthPass.val()
			},
			soapBasicAuthName = {
				name: 'soapBasicAuthName',
				value: apiSoapBasicAuthName.val()
			},
			soapBasicAuthPass = {
				name: 'soapBasicAuthPass',
				value: apiSoapBasicAuthPass.val()
			},
			soapWssUserNameTokenAuthName = {
				name: 'soapWssUserNameTokenAuthName',
				value: apiSoapWssUserNameTokenAuthName.val()
			},
			soapWssBinarySecurityTokenAuthToken = {
				name: 'soapWssBinarySecurityTokenAuthToken',
				value: apiSoapWssBinarySecurityTokenAuthToken.val()
			};

		// Get the Alpaca-generated request body form (if the method defines request JSON schema).
		var methodForm = $(this).get(0);
		var requestBodyAlpacaForm = $.data(methodForm, 'requestBodyAlpacaForm');
		var requestBodyJson;
		var wssFields = exports.getWssFields();
		var fileFields = $(methodForm).find('[type="file"]'); // get any file fields
		var fileLimit = 850000; // setting matching file limit check
		var fileLimitExceeded = false; // initial setting of file limit check

		if (requestBodyAlpacaForm) {
			requestBodyJson = {
				name: 'requestBodyJson',
				value: JSON.stringify(requestBodyAlpacaForm.getValue())
			};
		}

		// Get api key and secret from key/secret list if enabled
		if (apiKeySecretInput.is(':visible')) {
			// Replace api key and secret values
			apiKey.value = apiKeySecretInput.find('> :selected').val();

			if (!enableHSSM) { // if hssm NOT enabled get it from the data attribute
				apiSecret.value = apiKeySecretInput.find('> :selected').attr('data-secret');
			}
		}

		// Add additional values to params
		params.push(apiId, apiKey, apiSecret, basicAuthName, basicAuthPass, soapBasicAuthName, soapBasicAuthPass, soapWssUserNameTokenAuthName, soapWssBinarySecurityTokenAuthToken);


		for (var i = 0; i < wssFields.length; i++) {
			var field = $('#apiSoapWssUserNameTokenAuth' + wssFields[i]);

			params.push({
				name: 'soapWssUserNameTokenAuth' + wssFields[i],
				value: field.val()
			});
		}

		if (requestBodyJson) {
			params.push(requestBodyJson);
		}

		if (fileFields.length > 0) { // we got some file fields
			var formData = new FormData(); // create a form data object to post

			$.each(params, (function (index, param) { // add current params to formdata
				formData.append(param.name, param.value); // add param to form data
			}));
			$.each(fileFields, (function (index, field) { // iterate all file fields
				var file = field.files[0]; // get reference to the first file

				if (file && (file.size > fileLimit)) {
					fileLimitExceeded = true;
				} else {
					formData.append($(field).attr('name'), file || ''); // add the file field or empty string
				}
			}));

			params = formData; // let's use the new formdata as our params
		}

		// If response node doesn't exist, create it
		if (!responseBox.length) {
			// Add clear link
			$('<a class="clear-results" href="#">Clear Results</a>').css({
				display: 'none'
			}).click((function (event) {
				// Don't follow link
				event.preventDefault();

				// Delete clear link
				$(this).fadeOut((function () {
					$(this).remove();
				}));

				// Slide up the response and delete it and the clear link
				$(responseBox).slideUp((function () {
					responseBox.remove();
				}));
			})).insertAfter($(this).find('> input[type=submit]')).fadeIn();

			// Build select link
			var selectLink = $('<a class="select-all" href="#">Select content</a>').click((function (event) {
				// Don't follow link
				event.preventDefault();

				// Select the content from the response node
				selectElementText($(this).parent().next('pre')[0]);
			}));

			// Build response box
			responseBox = $('<div class="result" />').css({
				display: 'none'
			});

			// Add request uri
			responseBox.append(
				$('<h4 class="call">Request URI</h4>'),
				$('<pre class="call" />'));

			// Add request headers
			responseBox.append(
				$('<h4 class="requestHeaders">Request Headers</h4>').hide().append(selectLink.clone(true)),
				$('<pre class="requestHeaders" />').hide());

			// Add request cookies
			responseBox.append(
				$('<h4 class="requestCookies">Request Cookies</h4>').hide().append(selectLink.clone(true)),
				$('<pre class="requestCookies prettyprint" />').hide());

			// Add request body
			responseBox.append(
				$('<h4 class="requestBody">Request Body</h4>').hide().append(selectLink.clone(true)),
				$('<pre class="requestBody prettyprint" />').hide());

			// Add response status
			responseBox.append(
				$('<h4 class="responseStatus">Response Status</h4>').append(selectLink.clone(true)),
				$('<pre class="responseStatus" />'));

			// Add response headers
			responseBox.append(
				$('<h4 class="headers">Response Headers</h4>').append(selectLink.clone(true)),
				$('<pre class="headers" />'));

			// Add response cookies
			responseBox.append(
				$('<h4 class="responseCookies">Response Cookies</h4>').hide().append(selectLink.clone(true)),
				$('<pre class="responseCookies prettyprint" />').hide());

			// Add response body
			responseBox.append(
				$('<h4 class="response">Response Body</h4>').append(selectLink.clone(true)),
				$('<pre class="response prettyprint" />'));

			// Add response box to form and show it
			responseBox.appendTo(this).slideDown();
		}

		// Response Box is shown by default
		responseBox.show();

		if (!errorBox.length) {
			// Build response box
			errorBox = $('<div class="error" />').css({
				display: 'none'
			});

			errorBox.append(
				$('<h4 class="error">Error</h4>'),
				$('<pre class="error prettyprint" />'));

			errorBox.appendTo(this);
		}

		// Error Box is hidden by default
		errorBox.hide();

		if (fileLimitExceeded) { // check for file limit
			errorBox.find('pre.error').text('The selected file exceeds the maximum allowed limit of ' + Math.ceil(fileLimit / 1000) + 'kb.');
			responseBox.hide();
			errorBox.show();
		} else {
			// Fire ajax
			$.ajax({
				url: '/io-docs/call-api',
				type: 'POST',
				headers: {
					'X-Ajax-Synchronization-Token': syncTokenValue
				},
				data: params,
				// check for file posting and change ajax options, else use defaults
				contentType: (fileFields.length > 0 ? false : 'application/x-www-form-urlencoded; charset=UTF-8'),
				processData: (fileFields.length > 0 ? false : true),
				dataType: 'json',
				beforeSend: function () {
					// Show loading text for response areas
					responseBox.children('pre').text('Loading...').removeClass('error');
				},
				error: function (jqXHR, textStatus, errorThrown) {
					errorBox.find('pre.error').text(jqXHR.responseText);
					responseBox.hide();
					errorBox.show();
					// responseBox.replaceWith($('<div class="result"><h4 class="response">Error</h4><pre class="prettyprint error">' + jqXHR.responseText + '</pre></div>')).toggle(true);
				},
				success: function (data) {
					// Init formatted text
					var formattedText = data.responseBody;
					var contentType = data.responseHeaders && data.responseHeaders['Content-Type'] || '';
					var validResponse = (data.status.code > 0 || data.status.text) || formattedText.length > 0;

					// Set up call request
					responseBox.find('pre.call').text(data.requestUri);

					// Set up call request headers
					responseBox.find('pre.requestHeaders').text($(data.requestHeaders).length ? formatHeaders(data.requestHeaders) : '');
					responseBox.find('.requestHeaders').toggle($(data.requestHeaders).length ? true : false);

					// Set up call request cookies
					responseBox.find('pre.requestCookies').text($(data.requestCookies).length ? formatJSON(data.requestCookies) : '');
					responseBox.find('.requestCookies').toggle($(data.requestCookies).length ? true : false);

					// Set up call request body
					responseBox.find('pre.requestBody').text(data.requestBody || '');
					responseBox.find('.requestBody').toggle(data.requestBody ? true : false);

					// Set up response status
					responseBox.find('pre.responseStatus').text(data.status.code + ' ' + data.status.text).toggleClass('error', data.status.code >= 400).removeClass((function (index, css) {
						return (css.match(/(^|\s)status-code-\d+/g) || []).join(' ');
					})).addClass('status-code-' + data.status.code);
					responseBox.find('.responseStatus').toggle((data.status.code > 0 || data.status.text) ? true : false);

					// Set up response headers
					responseBox.find('pre.headers').text(formatHeaders(data.responseHeaders)).toggleClass('error', data.status.code >= 400).removeClass((function (index, css) {
						return (css.match(/(^|\s)status-code-\d+/g) || []).join(' ');
					})).addClass('status-code-' + data.status.code);
					responseBox.find('.headers').toggle($(data.responseHeaders).length ? true : false);

					// Filter format if available content type
					switch (contentType.split(';')[0]) {
						// Parse types as JSON
						case 'application/javascript':
						case 'application/json':
						case 'application/x-javascript':
						case 'application/x-json':
						case 'text/javascript':
						case 'text/json':
						case 'text/x-javascript':
						case 'text/x-json':
							try {
								// js_beautify will format it if it's JSON or JSONP
								formattedText = js_beautify(formattedText, { 'preserve_newlines': false });
							} catch (err) {
								// js_beautify didn't like it, return it as it was
								formattedText = data.responseBody;
							}
							break;

						// Parse types as XHTML
						case 'application/xml':
						case 'text/xml':
						case 'text/html':
						case 'text/xhtml':
							formattedText = formatXML(formattedText) || '';
							break;
						default:
							break;
					}

					// Set response text
					responseBox.children('pre.response').text(formattedText).toggleClass('error', data.status.code >= 400).removeClass((function (index, css) {
						return (css.match(/(^|\s)status-code-\d+/g) || []).join(' ');
					})).addClass('status-code-' + data.status.code);
					responseBox.find('.response').toggle(validResponse ? true : false);

					// display service errors
					if (data.errorMessage) {
						errorBox.find('pre.error').text(data.errorMessage);
						errorBox.show();
					}

					// Fire pretty print on nodes
					prettyPrint();
				}
			});
		}
	}));

	// Auto enable endpoint list if only one exists
	if (apiEndpointListBoxes.length === 1) {
		apiSelectBox.val(apiSelectBox.find('> [value!=""]').val()).change();
	}

	// Auto enable endpoint list if an api selection is designated as auto select
	if (apiSelectBox.find('> [data-auto-select=1]').length) {
		apiSelectBox.val(apiSelectBox.find('> [data-auto-select=1]').val()).change();
	}

	exports.init = function () {

		// Set High-Security
		enableHSSMField = document.querySelector('input[name="enable_high_security_secret_management"]');
		enableHSSM = enableHSSMField && enableHSSMField.getAttribute('value').length > 0 ? true : false;

		// Get sync token value
		syncTokenValueField = document.querySelector(apiCredentialForm + ' input[name="ajax_synchronization_token"]');
		syncTokenValue = syncTokenValueField ? syncTokenValueField.getAttribute('value') : '';

		// Initialize script
		exports.initApiSchemas();
		exports.initRequestBodyAlpacaForms();
		exports.initAceEditor();

	};

	//
	// Public APIs
	//

	return exports;

})();
// Make iodocs object available only when page is finished rendering
$(document).ready((function () {
	// Set global var
	window.iodocs = (function () {

		// Private vars
		// @done
		var self = {},
			apiServiceBox = $('.services'),
			apiDescriptionListBoxes = $('.apiDescriptionList'),
			apiSelectBox = $('#apiId'),
			apiTitle = $('#apiTitle'),
			apiCredentialBox = $('.credentials'), // TODO: unused
			apiCredentialForm = $('#credentials'),
			syncTokenValue = apiCredentialForm.find('input[name=ajax_synchronization_token]').val(),
			apiKeyInput = $('#apiKey'),
			apiSecretInput = $('#apiSecret'),
			apiKeySecretInput = $('#apiKeySecret'),
			showManualKeySecret = $('#showManualKeySecret'),
			apiNameBox = $('#apiName'), // TODO: unused
			emControlBox = $('#controls'),
			apiEndpointListBoxes = $('.endpointList'),
			toggleEndpointsLink = $('#toggleEndpoints'),
			toggleMethodsLink = $('#toggleMethods'),
			apiOAuth2FlowType = $('#apiOAuth2FlowType'),
			apiOAuth2AuthBtn = $('#apiOAuth2AuthorizationButton'),
			apiOAuth2ImplABtn = $('#apiOAuth2ImplicitExchangeButton'),
			apiOAuth2CCBtn = $('#apiOAuth2AuthClientCredExchangeButton'),
			apiOAuth2PCBtn = $('#apiOAuth2AuthPassCredExchangeButton'),
			apiOAuth2AccessBtn = $('#apiOAuth2AuthExchangeButton'),
			apiBasicAuthName = $('#apiBasicAuthUsername'),
			apiBasicAuthPass = $('#apiBasicAuthPassword'),
			apiSoapBasicAuthName = $('#apiSoapBasicAuthUsername'),
			apiSoapBasicAuthPass = $('#apiSoapBasicAuthPassword'),
			apiSoapWssUserNameTokenAuthName = $('#apiSoapWssUserNameTokenAuthUsername'),
			apiSoapWssBinarySecurityTokenAuthToken = $('#apiSoapWssBinarySecurityTokenAuthToken'),
			authTimer = null,
			enableHSSM = !!$('input[name=enable_high_security_secret_management]').val();

		// Select API
		// @done
		self.selectApiById = function (id) {
			// Reset selected attribute
			apiEndpointListBoxes.attr('data-is-selected', false);
			apiDescriptionListBoxes.attr('data-is-selected', false);

			// No id selected, so hide everything
			if (!id) {
				return self.hideAll();
			}

			// Set endpoint list box as selected
			apiEndpointListBoxes.filter('#api' + id).attr('data-is-selected', true);
			apiDescriptionListBoxes.filter('#apiDescription' + id).attr('data-is-selected', true);


			// Show everything that needs to be shown
			self.showApiCredentialBox(id);
			self.showApiDescriptionBox();
			self.showEMControlBox();
			self.hideAllUnselectedApiEndpointLists();
			self.showSelectedApiEndpointList();
			self.showAllSelectedEndpoints();

			return null;
		};

		// Get Selected API Endpoint List Box
		// @done Not porting over
		self.getSelectedApiEndpointListBox = function () {
			return apiEndpointListBoxes.filter('[data-is-selected=true]');
		};

		// Get Selected API Id
		// @done
		self.getSelectedApiId = function () {
			return self.getSelectedApiEndpointListBox().attr('data-api-id');
		};

		// Show API Info Box
		// @done
		self.showApiDescriptionBox = function () {
			self.hideApiDescriptionBox();
			apiDescriptionListBoxes.filter('#apiDescription' + self.getSelectedApiId() + ':hidden').slideDown();
		};

		// Hide API Info Box
		// @done
		self.hideApiDescriptionBox = function () {
			apiDescriptionListBoxes.filter(':not(#apiDescription' + self.getSelectedApiId() + '):visible').slideUp();
		};

		// Show EM Control box
		// @done
		self.showEMControlBox = function () {
			emControlBox.filter(':hidden').slideDown();
		};

		// Hide EM Control box
		// @done
		self.hideEMControlBox = function () {
			emControlBox.filter(':visible').slideUp();
		};

		// Show API Endpoint list
		// @done
		self.showSelectedApiEndpointList = function () {
			apiEndpointListBoxes.filter('#api' + self.getSelectedApiId() + ':hidden').slideDown();
		};

		// Hide all API Endpoint lists
		// @done
		self.hideAllApiEndpointLists = function () {
			apiEndpointListBoxes.filter(':visible').slideUp();
		};

		// Hide all API Endpoint Lists that aren't id
		// @done Not porting over
		self.hideAllUnselectedApiEndpointLists = function () {
			apiEndpointListBoxes.filter(':not(#api' + self.getSelectedApiId() + '):visible').slideUp();
		};

		// Show all endpoints for shown endpoint list
		// @done Not porting over
		self.toggleAllSelectedEndpoints = function () {
			// Get all selected methods lists
			var methodsLists = apiEndpointListBoxes.find('.endpoint:visible > .methods');

			// Show all method lists if at least one is not visible
			if (methodsLists.filter(':hidden').length) {
				methodsLists.slideDown();
			} else {
				methodsLists.slideUp();
			}
		};

		// Show all selected endpoints
		// @done Not porting over
		self.showAllSelectedEndpoints = function () {
			apiEndpointListBoxes.find('.endpoint:visible > .methods:hidden').slideDown();
		};

		// Toggle all methods for shown endpoint list
		// @done Not porting over
		self.toggleAllSelectedMethods = function () {
			// Keep tabs on how many method lists are enabled
			var methodsLists = apiEndpointListBoxes.find('.endpoint:visible > .methods'),
				methodsListsCount = methodsLists.filter(':hidden').length;

			// Show all endpoints
			self.showAllSelectedEndpoints();

			// Force show forms if at least one method list wasn't shown (which is now shown)
			if (methodsListsCount) {
				return self.showAllSelectedMethods();
			}

			// Get all visible methods
			var methods = methodsLists.find('.method:visible > form');

			// Show all methods if at least one is not visible
			if (methods.filter(':hidden').length) {
				methods.slideDown();
			} else {
				methods.slideUp();
			}

			return null;
		};

		// Show all selected methods
		// @done Not porting over
		self.showAllSelectedMethods = function () {
			apiEndpointListBoxes.find('.endpoint:visible .method:visible > form:hidden').slideDown();
		};

		// Hide all selected methods
		// @done Not porting over
		self.hideAllSelectedMethods = function () {
			apiEndpointListBoxes.find('.endpoint.visible .method:visible > form:visible').slideUp();
		};

		// Hide ALL the things!
		// @done
		self.hideAll = function () {
			self.hideAllApiCredentialBoxes();
			self.hideApiDescriptionBox();
			self.hideEMControlBox();
			self.hideAllApiEndpointLists();
		};

		// Initialize API JSON schemas for use with the the alpaca (http://www.alpacajs.org) forms.
		// @done
		self.initApiSchemas = function () {
			var arrayCleaned = false;
			// For each API (root ul element)
			apiEndpointListBoxes.each((function () {

				if (!arrayCleaned) {
					arrayCleaned = true;
					// remove augmentation caused by Mashery-Base.js
					// TODO: fix Mashery-Base.js and remove this block
					for (var n in Array.prototype) {
						if (Array.prototype.hasOwnProperty(n)) {
							delete Array.prototype[n];
						}
					}
				}

				// Get the schemas associated with this API
				var apiSchemas = $.data($(this).get(0), 'apiSchemas');
				if (apiSchemas && !$.isEmptyObject(apiSchemas)) {

					$.each(apiSchemas, (function (schemaId, schema) {

						if (!schema.title) {
							schema.title = schemaId;
						}

						self.initApiSchemaProperties(schema.properties);
					}));
				}
			}));
		};

		// Recursively initialize the properties of an object defined within a JSON schema.
		// @done
		self.initApiSchemaProperties = function (properties) {

			if (properties) {
				$.each(properties, (function (propertyName, property) {

					if (!property.title) {
						// Default to using the property name if no title is specified for the property
						property.title = propertyName.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (function (str) { return str.toUpperCase(); }));
					}

					// Re-write object schema references to enable alpaca's support for schema references
					// See: http://www.alpacajs.org/examples/components/jsonschema/references.html

					if (property.$ref && property.$ref.indexOf('#') !== 0) {
						// Re-write object schema references to be locally relative to this schema
						property.$ref = '#/definitions/' + property.$ref;
					}

					if (property.items && property.items.$ref && property.items.$ref.indexOf('#') !== 0) {
						// Re-write array item schema references to be locally relative to this schema
						property.items.$ref = '#/definitions/' + property.items.$ref;
					}

					if (property.type === 'object') {
						// Recursively initialize the properties of the nested schema
						self.initApiSchemaProperties(property.properties);
					} else if (property.type === 'array') {
						// Recursively initialize the properties of the nested schema
						self.initApiSchemaProperties(property.items.properties);
					}
				}));
			}

		};

		// Initialize the alpaca (http://www.alpacajs.org) forms for each method with a JSON schema-defined request body
		// @done
		self.initRequestBodyAlpacaForms = function () {
			// override the Alpaca Integerfield's getValue to return empty string
			Alpaca.Fields.IntegerField.prototype.getValue = function () {
				var textValue = this.field.val();
				if (Alpaca.isValEmpty(textValue)) {
					return '';
				} else {
					return parseFloat(textValue);
				}
			};

			// private function to generate schema options from the definition properties
			// @done
			function getSchemaOptions(schema) {
				var options = {}; // init options

				if (schema.properties) { // ensure valid properties
					$.each(schema.properties, (function (key, value) { // generate schema options from the schema
						if (value.type === 'array') {
							var arrayOptions = getSchemaOptions(value.items); // recurse!

							if (!options[key]) {
								options[key] = { 'items': {} }; // init field options
							}

							options[key].toolbarSticky = true;
							options[key].fieldClass = 'iodoc-array-field';
							options[key].items.showMoveUpItemButton = false;
							options[key].items.showMoveDownItemButton = false;

							if (!$.isEmptyObject(arrayOptions)) { // if recursion wasn't empty
								options[key].fields = { 'item': { 'fields': arrayOptions } }; // set proper alpaca options
							}
						} else if (value.properties) { // check for nested properties
							if (!options[key]) {
								options[key] = { 'fields': {} };
							}
							options[key].fields = getSchemaOptions(value); // recurse!
						}
					}));
				}

				return options;
			}

			// For each API (root ul element)
			apiEndpointListBoxes.each((function () {
				// Get the schemas associated with this API
				var apiSchemas = $.data($(this).get(0), 'apiSchemas');

				if (apiSchemas && !$.isEmptyObject(apiSchemas)) { // ensure valid schema retrieved
					// Find all of the nested elements that should contain alpaca form for the request body
					var requestBodySchemaContainers = $(this).find('.requestBodySchemaContainer');

					requestBodySchemaContainers.each((function () {
						// Get the schema ID associated with the request body
						var requestBodySchemaId = $(this).attr('data-request-body-schema-id');

						if (requestBodySchemaId) {
							// Get the method form element that contains this alpaca container element
							var methodForm = $(this).parent('form').get(0);
							// Get the schema associated with the method's request body
							var requestBodySchema = apiSchemas[requestBodySchemaId];

							if (requestBodySchema && methodForm) {
								// Shallow copy the schema to add the definitions for use with alpaca
								// Set all of the API schemas as definitions to enable alpaca's support for schema references
								// See: http://www.alpacajs.org/examples/components/jsonschema/references.html
								var requestBodyAlpacaSchema = $.extend({ 'definitions': apiSchemas }, requestBodySchema);
								var schemaOptions = getSchemaOptions(requestBodyAlpacaSchema); // get schema options
								var defaultValue = JSON.parse($(this).attr('data-request-body-default-value')) || {};

								// Initialize the alpaca component on this container element
								$(this).alpaca({
									"schema": requestBodyAlpacaSchema,
									"data": defaultValue,
									"options": $.extend({ "name": "requestBody" }, { 'fields': schemaOptions }),
									"postRender": function (requestBodyAlpacaForm) {
										// In order to extract the alpaca form data as a JSON object on form submit,
										// store a reference to the alpaca form object in the method form element
										$.data(methodForm, 'requestBodyAlpacaForm', requestBodyAlpacaForm);
									}
								});
							}
						}
					}));
				}
			}));
		};

        /**
         * Initialize the ACE editor
         *
         * Currently looks for request body elements and the sibling editor element
         * Instantiates the editor on request body focus and restores on blur
         */
		// @done
		self.initAceEditor = function () {
			$('.method > div.title').click((function () { // when the method is expanded
				var textarea = $(this).siblings('form').find('.requestBody'); // jquery textarea
				var parameters = textarea.siblings('.parameters'); // get the parameters for this definition
				var mode = 'text'; // default editor mode
				var editorEl = textarea.siblings('.request-body-editor'); // look for editor element

				if (editorEl.length > 0) { // check for found element
					if (!this.editor) { // check for previous instantiation
						if (parameters) { // check for params and get the editor mode
							mode = self.getEditorMode(parameters.find('[name="params[Content-Type]"]').val());
						}
						this.editor = ace.edit(editorEl[0]); // instantiate editor
						this.editor.getSession().setMode('ace/mode/' + mode); // set the editor mode
						this.editor.getSession().on('change', $.proxy((function () { // on value change let's resize the height
							var height = this.editor.getSession().getScreenLength() * this.editor.renderer.lineHeight + this.editor.renderer.scrollBar.getWidth();
							if (height > textarea.height()) { // ensure not  less than the original text area
								editorEl.css('height', height + 'px'); // set element height
								this.editor.resize(); // set resize
							}
						}), this));
						this.editor.on('blur', $.proxy((function () { // when we lose focus
							textarea.val(this.editor.getSession().getValue()); // update the text area
						}), this));
					}

					textarea.hide(); // hide original textarea
					editorEl.css('height', textarea.height()).show(); // display the editor element
					this.editor.resize(); // update editor size
					this.editor.focus(); // focus editor
				}
			}));
		};

        /**
         * Helper function to retrieve the ACE editor mode to use based on a passed in string
         *
         * @params {String} mode The mode to read from, usually Content-Type
         *
         * @returns {String} The mode to set ACE to
         */
		// @done
		self.getEditorMode = function (mode) {
			if (typeof (mode) === 'string') { // ensure string
				if (mode.toLowerCase().indexOf('json') >= 0) { // check for json
					return 'json';
				}
			}

			return 'text'; // default mode
		};

		/*** START CREDENTIALS ***/

		// @done
		self.getCurrentAuthType = function () {
			var apiStoreElem = $('#api' + apiSelectBox.val()),
				auth_type = apiStoreElem.attr('data-auth-type');

			return auth_type;
		};

		// @done
		self.getBasicAuthEnabled = function () {
			var apiStoreElem = $('#api' + apiSelectBox.val()),
				basicAuth = apiStoreElem.attr('data-basic-auth');

			return (basicAuth === 'true');
		};

		// @done
		self.showApiCredentialBox = function (id) { // TODO: id is unused

			self.hideAllApiCredentialBoxes();

			apiCredentialForm.each((function () {
				this.reset();
			}));

			var apiStoreElem = $('#api' + apiSelectBox.val()),
				auth_type = self.getCurrentAuthType(),
				authCSSClass = ".credentials_start." + auth_type,
				available_keys = $.parseJSON(apiStoreElem.attr('data-available-keys'));

			if (self.getBasicAuthEnabled()) {
				$('#apiBasicAuthCredFlowContainer').show();
			}

			switch (auth_type) {
				case 'key':
					$('#apiSecretContainer').hide();
					$('#apiKeySecretListContainer').hide();
					$('#apiKeyContainer').hide();

					if (available_keys && available_keys.length) {

						$('#apiKeySecret').empty();

						$.each(available_keys, (function (k, v) {
							var label = '';
							if (v.application) {
								label = v.application + ": " + v.key;
							} else {
								label = v.key;
							}
							$('#apiKeySecret').append($('<option>', { value: v.key, "data-secret": v.secret }).text(label));
						}));

						$('#apiKeySecretListContainer').slideDown();

						if (enableHSSM) {
							$('#apiSecretContainer').slideDown();
							showManualKeySecret.hide();
						}
					} else {
						$('#apiKeyContainer').slideDown();

						if (apiStoreElem.attr('data-secret') === "1") {
							$('#apiSecretContainer').slideDown();
						}
					}
					break;

				case 'oauth2':

					var auth_flows = $.parseJSON(apiStoreElem.attr('data-auth-flows'));

					$('#apiOAuth2FlowType').empty();

					$('#apiOAuth2PresetKeysContainer').hide();

					if (auth_flows) {
						$.each(auth_flows, (function (k, v) {

							var auth_flow_desc = function (v) {
								switch (v) {
									case 'auth_code':
										return "Authorization Code / Web Server";
									case 'implicit':
										return "Implicit / Javascript Client";
									case 'password_cred':
										return "Password Credentials";
									case 'client_cred':
										return "Client Credentials";
									default:
										return "Unknown";
								}
							};

							$('#apiOAuth2FlowType').append($('<option>', { value: v }).text(auth_flow_desc(v)));
						}));
					}

					if (available_keys && available_keys.length) {
						$('#apiOAuth2PresetKeys').empty();
						$('#apiOAuth2PresetKeys').append($('<option>', { value: "__manual" }).text("Manual Input"));

						$.each(available_keys, (function (k, v) {
							$('#apiOAuth2PresetKeys').append($('<option>', { value: v.key, "data-secret": v.secret }).text(v.application));
						}));

						$('#apiOAuth2PresetKeysContainer').slideDown();
					}

					$('#apiOAuth2FlowType').change();

					break;
				case 'soapWssSecurityAuth':

					var token_types = $.parseJSON(apiStoreElem.attr('data-auth-wss-token-types'));

					if (token_types) {

						$.each(token_types, (function (k, v) {

							if (v == 'soapWssUserNameToken') {

								var container = $('#apiSoapWssUserNameTokenAuthCredFlowContainer').slideDown(),
									wssFields = self.getWssFields(),
									i,
									field;

								// clear fields before adding to avoid duplicates
								container.find('.SoapWssUserNameTokenAuthGenerated').remove();

								for (i = 0; i < wssFields.length; i++) {
									field = '<div class="SoapWssUserNameTokenAuthGenerated">';
									field += '<label for="apiSoapWssUserNameTokenAuth' + wssFields[i] + '">' + wssFields[i] + ':</label>';
									field += '<input type="text"  id="apiSoapWssUserNameTokenAuth' + wssFields[i] + '"/>';
									field += '</div>';
									container.append(field);
								}
							} else if (v == 'soapWssBinarySecurityToken') {
								$('#apiSoapWssBinarySecurityTokenAuthCredFlowContainer').slideDown();
							}

						}));
					}

					break;
				case 'soapBasic':
					$('#apiSoapBasicAuthCredFlowContainer').slideDown();
					break;
				default:
					break;
			}

			$(authCSSClass).slideDown();
		};

		// @done
		self.hideAllApiCredentialBoxes = function () {
			$('.credentials').filter(':visible').slideUp();
		};

		// @done
		self.hideOAuth2CredentialInputs = function () {
			$('.credentials.oauth2').not('.credentials_start').slideUp();
		};

		// @done
		self.setOAuth2AuthorizeCode = function (code) {
			$('#apiOAuth2AuthorizeCode').val(code);
			$('#apiOAuth2AuthorizeCodeContainer').slideDown();

			if ($('#api' + self.getSelectedApiId()).attr('data-auto-exchange-auth-code') === "1") {
				apiOAuth2AccessBtn.hide();
				self.exchangeAuthCodeforAccessToken();
			}
		};

		// @done
		self.getAuthorizationCode = function (client_id, client_secret) {
			// open empty window before async call (async code triggers popup blocker on window.open)
			var oAuth2AuthWindow = window.open(null, "masheryOAuth2AuthWindow", "width=300,height=400");

			window.clearInterval(self.authTimer); // clear the timer
			self.authTimer = window.setInterval((function () {
				if (oAuth2AuthWindow.closed !== false) { // when the window is closed
					window.clearInterval(self.authTimer); // clear the timer
					self.setOAuth2AuthorizeCode(window.auth_code); // set the auth code from the popup window
					delete window.auth_code; // clear the auth code just in case
				}
			}), 200);

			$.ajax({
				async: true,
				headers: {
					'X-Ajax-Synchronization-Token': syncTokenValue
				},
				data: {
					apiId: apiSelectBox.val(),
					client_id: client_id,
					client_secret: client_secret,
					auth_flow: "auth_code"
				},
				dataType: 'json',
				global: false,
				timeout: 10000,
				type: 'POST',
				url: '/io-docs/getoauth2authuri',
				error: function (jqXHR, textStatus, errorThrown) {
					alert(jqXHR.responseText);
				},
				success: function (data, textStatus, jqXHR) {
					if (data.success) {
						oAuth2AuthWindow.location.href = data.authorize_uri;
						oAuth2AuthWindow.focus();
						// } else {  TODO:  Should this return an error on failure?
						// self.resetOAuth2AccessToken();
						// alert(jqXHR.responseText);
						// alert("ERROR: 324  --  Sorry there was an error getting an access token. Try again later.");
					} else {
						oAuth2AuthWindow.close();
					}
				}
			});
		};

		// @done
		self.sendImplicitAccessToken = function (token, errorCallback, successCallback) {
			$.ajax({
				async: true,
				headers: {
					'X-Ajax-Synchronization-Token': syncTokenValue
				},
				data: {
					apiId: apiSelectBox.val(),
					access_token: token.access_token,
					expires_in: token.expires_in,
					token_type: token.token_type
				},
				dataType: 'json',
				global: false,
				timeout: 10000,
				type: 'POST',
				url: '/io-docs/catchOauth2ImplicitToken',
				error: function () {
					alert("Sorry, there was an error processing the response from the OAuth2 server. Try again later");
				},
				success: function (data) {
					if (data.success) {
						self.setOAuth2AccessToken(token.access_token);
					} else {
						alert("Sorry, but there was an error during the account authorization process. Either the credentials were not entered correctly, or permission was denied by the account holder. Please try again.");
					}
				}
			});
		};

		// @done
		self.getImplicitAccessToken = function (client_id) {
			// open empty window before async call (async code triggers popup blocker on window.open)
			var oAuth2AuthWindow = window.open(null, "masheryOAuth2AuthWindow", "width=300,height=400");

			window.clearInterval(self.authTimer); // clear the timer
			self.authTimer = window.setInterval((function () {
				if (oAuth2AuthWindow.closed !== false) { // when the window is closed
					window.clearInterval(self.authTimer); // clear the timer
					self.sendImplicitAccessToken(window.access_token); // set the auth code from the popup window
					delete window.access_token; // clear the auth code just in case
				}
			}), 200);

			$.ajax({
				async: true,
				headers: {
					'X-Ajax-Synchronization-Token': syncTokenValue
				},
				data: {
					apiId: apiSelectBox.val(),
					client_id: client_id,
					auth_flow: "implicit"
				},
				dataType: 'json',
				global: false,
				timeout: 10000,
				type: 'POST',
				url: '/io-docs/getoauth2authuri',
				error: function (jqXHR, textStatus, errorThrown) {
					alert(jqXHR.responseText);
				},
				success: function (data, textStatus, jqXHR) {
					if (data.success) {
						oAuth2AuthWindow.location.href = data.authorize_uri;
						oAuth2AuthWindow.focus();
					} else {
						oAuth2AuthWindow.close();
						self.resetOAuth2AccessToken();
						// TODO:  Should this display an error on failure?
						// alert(jqXHR.responseText);
					}
				}
			});
		};

		// @done
		self.resetOAuth2AccessToken = function () {
			$('#apiOAuth2AccessToken').val("");
			$('#apiOAuth2AccessTokenContainer').slideUp();
		};

		// @done
		self.setOAuth2AccessToken = function (token) {
			$('#apiOAuth2AccessToken').val(token);
			$('#apiOAuth2AccessTokenContainer').slideDown();
		};

		// @done
		self.getAccessTokenFromPasswordCred = function (client_id, client_secret, username, password) {

			$.ajax({
				async: true,
				headers: {
					'X-Ajax-Synchronization-Token': syncTokenValue
				},
				data: {
					apiId: apiSelectBox.val(),
					auth_flow: 'password_cred',
					client_id: client_id,
					client_secret: client_secret,
					username: username,
					password: password
				},
				dataType: 'json',
				global: false,
				timeout: 10000,
				type: 'GET',
				url: '/io-docs/getoauth2accesstoken',
				error: function (jqXHR, textStatus, errorThrown) {
					alert(jqXHR.responseText);
				},
				success: function (data, textStatus, jqXHR) {
					if (data.success) {
						self.setOAuth2AccessToken(data.result.access_token);
					} else {
						self.resetOAuth2AccessToken();
						alert(jqXHR.responseText);
					}
				}
			});
		};

		// @done
		self.getAccessTokenFromClientCred = function (client_id, client_secret) {

			$.ajax({
				async: true,
				headers: {
					'X-Ajax-Synchronization-Token': syncTokenValue
				},
				data: {
					apiId: apiSelectBox.val(),
					auth_flow: 'client_cred',
					client_id: client_id,
					client_secret: client_secret
				},
				dataType: 'json',
				global: false,
				timeout: 10000,
				type: 'GET',
				url: '/io-docs/getoauth2accesstoken',
				error: function (jqXHR, textStatus, errorThrown) {
					alert(jqXHR.responseText);
				},
				success: function (data, textStatus, jqXHR) {
					if (data.success) {
						self.setOAuth2AccessToken(data.result.access_token);
					} else {
						self.resetOAuth2AccessToken();
						alert(jqXHR.responseText);
					}
				}
			});
		};

		// @done
		self.exchangeAuthCodeforAccessToken = function () {
			$.ajax({
				async: true,
				headers: {
					'X-Ajax-Synchronization-Token': syncTokenValue
				},
				data: {
					apiId: apiSelectBox.val(),
					auth_flow: 'auth_code',
					authorization_code: $('#apiOAuth2AuthorizeCode').val()
				},
				dataType: 'json',
				global: false,
				timeout: 10000,
				type: 'GET',
				url: '/io-docs/getoauth2accesstoken',
				error: function (jqXHR, textStatus, errorThrown) {
					alert(jqXHR.responseText);
				},
				success: function (data, textStatus, jqXHR) {
					if (data.success) {
						self.setOAuth2AccessToken(data.result.access_token);
					} else {
						self.resetOAuth2AccessToken();
						alert(jqXHR.responseText);
					}
				}
			});
		};

		/*** END CREDENTIALS ***/


		// Callback for OAuth Success
		// @done Not porting over - it's not used anywhere
		self.oauthSuccess = function () {
			alert('You have successfully logged in');
		};

		// @done
		self.getWssFields = function () {

			var wssFields,
				apiStoreElem = $('#api' + apiSelectBox.val()),
				wssFieldsValue = apiStoreElem.attr('data-auth-wss-fields');

			if (wssFieldsValue && wssFieldsValue.length > 0) {
				wssFields = $.parseJSON(wssFieldsValue);
			}

			return wssFields || [];
		};

		// Bind page elements

		// Set select to add 40px to it's calculated width, padding doesn't work in IE
		// @done Not porting over
		apiSelectBox.width(apiSelectBox.outerWidth() + 40);

		// Set the span in the h2 to reflect selected option
		// @done Not porting over
		apiTitle.text(apiSelectBox.find('option:selected').text()).width(apiSelectBox.outerWidth()).height(apiSelectBox.outerHeight());

		// @done
		apiSelectBox.change((function () {
			self.selectApiById(apiSelectBox.val());
			apiTitle.text(apiSelectBox.find('option:selected').text());
		}));

		// @done
		$('#apiOAuth2PresetKeys').change((function (event) {

			var selectedPresetKey = $('#apiOAuth2PresetKeys').find('> :selected');

			if ((selectedPresetKey.val() === "__manual") || (selectedPresetKey.val() === "")) {
				$('.oauth2_client_id_field').val("");
				$('.oauth2_client_secret_field').val("");
			} else {
				$('.oauth2_client_id_field').val(selectedPresetKey.val());
				$('.oauth2_client_secret_field').val(selectedPresetKey.attr('data-secret'));
			}

		}));

		// @done
		apiOAuth2FlowType.change((function (event) {

			self.hideOAuth2CredentialInputs();

			if (apiOAuth2FlowType.val() === "") {
				return;
			}

			switch (apiOAuth2FlowType.val()) {
				case 'auth_code':
					$('#apiOAuth2AuthCodeFlowContainer').slideDown();
					break;
				case 'implicit':
					$('#apiOAuth2ImplicitFlowContainer').slideDown();
					break;
				case 'password_cred':
					$('#apiOAuth2PasswordCredFlowContainer').slideDown();
					break;
				case 'client_cred':
					$('#apiOAuth2ClientCredFlowContainer').slideDown();
					break;
				default:
					break;
			}

		}));

		// @done
		apiOAuth2PCBtn.click((function (event) {
			event.preventDefault();
			self.getAccessTokenFromPasswordCred(
				$('#apiOAuth2ClientIdPasswordCred').val(),
				$('#apiOAuth2ClientSecretPasswordCred').val(),
				$('#apiOAuth2Username').val(),
				$('#apiOAuth2Password').val()
			);
		}));

		// @done
		apiOAuth2CCBtn.click((function (event) {
			event.preventDefault();
			self.getAccessTokenFromClientCred(
				$('#apiOAuth2ClientIdClientCred').val(),
				$('#apiOAuth2ClientSecretClientCred').val());
		}));

		// @done
		apiOAuth2AuthBtn.click((function (event) {
			event.preventDefault();
			self.getAuthorizationCode(
				$('#apiOAuth2ClientIdAuthCode').val(),
				$('#apiOAuth2ClientSecretAuthCode').val());
		}));

		// @done
		apiOAuth2ImplABtn.click((function (event) {
			event.preventDefault();
			self.getImplicitAccessToken(
				$('#apiOAuth2ClientIdImplicit').val());
		}));

		// @done
		apiOAuth2AccessBtn.click((function (event) {
			event.preventDefault();
			self.exchangeAuthCodeforAccessToken();
		}));

		// @done
		showManualKeySecret.click((function (event) {
			// Disable following link
			event.preventDefault();

			var apiStoreElem = $('#api' + apiSelectBox.val());

			$('#apiSecretContainer').hide();
			$('#apiKeySecretListContainer').hide();
			$('#apiKeyContainer').hide();
			$('#apiKeyContainer').slideDown();

			if (apiStoreElem.attr('data-secret') === "1") {
				$('#apiSecretContainer').slideDown();
			}
		}));

		// @done
		toggleEndpointsLink.click((function (event) {
			// Disable following link
			event.preventDefault();

			self.hideAllSelectedMethods();
			self.toggleAllSelectedEndpoints();
		}));

		// @done
		toggleMethodsLink.click((function (event) {
			// Disable following link
			event.preventDefault();

			self.toggleAllSelectedMethods();
		}));

		// @done
		$('.endpoint > h3 > span.name').click((function (event) {
			// Disable following link
			event.preventDefault();

			// Toggle methods
			$(this).closest('.endpoint').find('.methods').slideToggle();
		}));

		// @done Not porting over
		$('.list-methods > a').click((function (event) {
			// Disable following link
			event.preventDefault();

			$(this).closest('.endpoint').find('.methods:hidden').slideDown();
		}));

		// @done Not porting over
		$('.expand-methods > a').click((function (event) {
			// Disable following link
			event.preventDefault();

			$(this).closest('.endpoint').find('.methods:hidden').slideDown();
			$(this).closest('.endpoint').find('.method:visible > form:hidden').slideDown();
		}));

		// @done
		$('.method > div.title').click((function (event) {
			// Disable following link
			event.preventDefault();

			$(this).parent().find('form').slideToggle();
		}));

		// @todo
		$('.method > form').submit((function (event) {
			// Disable actual submission
			event.preventDefault();

			// Get response box, form params, and api values
			var responseBox = $(this).children('div.result'),
				errorBox = $(this).children('div.error'),
				params = $(this).serializeArray(),
				apiId = {
					name: 'apiId',
					value: self.getSelectedApiId()
				},
				apiKey = {
					name: 'apiKey',
					value: apiKeyInput.val()
				},
				apiSecret = {
					name: 'apiSecret',
					value: apiSecretInput.val()
				},
				basicAuthName = {
					name: 'basicAuthName',
					value: apiBasicAuthName.val()
				},
				basicAuthPass = {
					name: 'basicAuthPass',
					value: apiBasicAuthPass.val()
				},
				soapBasicAuthName = {
					name: 'soapBasicAuthName',
					value: apiSoapBasicAuthName.val()
				},
				soapBasicAuthPass = {
					name: 'soapBasicAuthPass',
					value: apiSoapBasicAuthPass.val()
				},
				soapWssUserNameTokenAuthName = {
					name: 'soapWssUserNameTokenAuthName',
					value: apiSoapWssUserNameTokenAuthName.val()
				},
				soapWssBinarySecurityTokenAuthToken = {
					name: 'soapWssBinarySecurityTokenAuthToken',
					value: apiSoapWssBinarySecurityTokenAuthToken.val()
				};

			// Get the Alpaca-generated request body form (if the method defines request JSON schema).
			var methodForm = $(this).get(0);
			var requestBodyAlpacaForm = $.data(methodForm, 'requestBodyAlpacaForm');
			var requestBodyJson;
			var wssFields = self.getWssFields();
			var fileFields = $(methodForm).find('[type="file"]'); // get any file fields
			var fileLimit = 850000; // setting matching file limit check
			var fileLimitExceeded = false; // initial setting of file limit check

			if (requestBodyAlpacaForm) {
				requestBodyJson = {
					name: 'requestBodyJson',
					value: JSON.stringify(requestBodyAlpacaForm.getValue())
				};
			}

			// Get api key and secret from key/secret list if enabled
			if (apiKeySecretInput.is(':visible')) {
				// Replace api key and secret values
				apiKey.value = apiKeySecretInput.find('> :selected').val();

				if (!enableHSSM) { // if hssm NOT enabled get it from the data attribute
					apiSecret.value = apiKeySecretInput.find('> :selected').attr('data-secret');
				}
			}

			// Add additional values to params
			params.push(apiId, apiKey, apiSecret, basicAuthName, basicAuthPass, soapBasicAuthName, soapBasicAuthPass, soapWssUserNameTokenAuthName, soapWssBinarySecurityTokenAuthToken);


			for (var i = 0; i < wssFields.length; i++) {
				var field = $('#apiSoapWssUserNameTokenAuth' + wssFields[i]);

				params.push({
					name: 'soapWssUserNameTokenAuth' + wssFields[i],
					value: field.val()
				});
			}

			if (requestBodyJson) {
				params.push(requestBodyJson);
			}

			if (fileFields.length > 0) { // we got some file fields
				var formData = new FormData(); // create a form data object to post

				$.each(params, (function (index, param) { // add current params to formdata
					formData.append(param.name, param.value); // add param to form data
				}));
				$.each(fileFields, (function (index, field) { // iterate all file fields
					var file = field.files[0]; // get reference to the first file

					if (file && (file.size > fileLimit)) {
						fileLimitExceeded = true;
					} else {
						formData.append($(field).attr('name'), file || ''); // add the file field or empty string
					}
				}));

				params = formData; // let's use the new formdata as our params
			}

			// If response node doesn't exist, create it
			if (!responseBox.length) {
				// Add clear link
				$('<a class="clear-results" href="#">Clear Results</a>').css({
					display: 'none'
				}).click((function (event) {
					// Don't follow link
					event.preventDefault();

					// Delete clear link
					$(this).fadeOut((function () {
						$(this).remove();
					}));

					// Slide up the response and delete it and the clear link
					$(responseBox).slideUp((function () {
						responseBox.remove();
					}));
				})).insertAfter($(this).find('> input[type=submit]')).fadeIn();

				// Build select link
				var selectLink = $('<a class="select-all" href="#">Select content</a>').click((function (event) {
					// Don't follow link
					event.preventDefault();

					// Select the content from the response node
					selectElementText($(this).parent().next('pre')[0]);
				}));

				// Build response box
				responseBox = $('<div class="result" />').css({
					display: 'none'
				});

				// Add request uri
				responseBox.append(
					$('<h4 class="call">Request URI</h4>'),
					$('<pre class="call" />'));

				// Add request headers
				responseBox.append(
					$('<h4 class="requestHeaders">Request Headers</h4>').hide().append(selectLink.clone(true)),
					$('<pre class="requestHeaders" />').hide());

				// Add request cookies
				responseBox.append(
					$('<h4 class="requestCookies">Request Cookies</h4>').hide().append(selectLink.clone(true)),
					$('<pre class="requestCookies prettyprint" />').hide());

				// Add request body
				responseBox.append(
					$('<h4 class="requestBody">Request Body</h4>').hide().append(selectLink.clone(true)),
					$('<pre class="requestBody prettyprint" />').hide());

				// Add response status
				responseBox.append(
					$('<h4 class="responseStatus">Response Status</h4>').append(selectLink.clone(true)),
					$('<pre class="responseStatus" />'));

				// Add response headers
				responseBox.append(
					$('<h4 class="headers">Response Headers</h4>').append(selectLink.clone(true)),
					$('<pre class="headers" />'));

				// Add response cookies
				responseBox.append(
					$('<h4 class="responseCookies">Response Cookies</h4>').hide().append(selectLink.clone(true)),
					$('<pre class="responseCookies prettyprint" />').hide());

				// Add response body
				responseBox.append(
					$('<h4 class="response">Response Body</h4>').append(selectLink.clone(true)),
					$('<pre class="response prettyprint" />'));

				// Add response box to form and show it
				responseBox.appendTo(this).slideDown();
			}

			// Response Box is shown by default
			responseBox.show();

			if (!errorBox.length) {
				// Build response box
				errorBox = $('<div class="error" />').css({
					display: 'none'
				});

				errorBox.append(
					$('<h4 class="error">Error</h4>'),
					$('<pre class="error prettyprint" />'));

				errorBox.appendTo(this);
			}

			// Error Box is hidden by default
			errorBox.hide();

			if (fileLimitExceeded) { // check for file limit
				errorBox.find('pre.error').text('The selected file exceeds the maximum allowed limit of ' + Math.ceil(fileLimit / 1000) + 'kb.');
				responseBox.hide();
				errorBox.show();
			} else {
				// Fire ajax
				$.ajax({
					url: '/io-docs/call-api',
					type: 'POST',
					headers: {
						'X-Ajax-Synchronization-Token': syncTokenValue
					},
					data: params,
					// check for file posting and change ajax options, else use defaults
					contentType: (fileFields.length > 0 ? false : 'application/x-www-form-urlencoded; charset=UTF-8'),
					processData: (fileFields.length > 0 ? false : true),
					dataType: 'json',
					beforeSend: function () {
						// Show loading text for response areas
						responseBox.children('pre').text('Loading...').removeClass('error');
					},
					error: function (jqXHR, textStatus, errorThrown) {
						errorBox.find('pre.error').text(jqXHR.responseText);
						responseBox.hide();
						errorBox.show();
						// responseBox.replaceWith($('<div class="result"><h4 class="response">Error</h4><pre class="prettyprint error">' + jqXHR.responseText + '</pre></div>')).toggle(true);
					},
					success: function (data) {
						// Init formatted text
						var formattedText = data.responseBody;
						var contentType = data.responseHeaders && data.responseHeaders['Content-Type'] || '';
						var validResponse = (data.status.code > 0 || data.status.text) || formattedText.length > 0;

						// Set up call request
						responseBox.find('pre.call').text(data.requestUri);

						// Set up call request headers
						responseBox.find('pre.requestHeaders').text($(data.requestHeaders).length ? formatHeaders(data.requestHeaders) : '');
						responseBox.find('.requestHeaders').toggle($(data.requestHeaders).length ? true : false);

						// Set up call request cookies
						responseBox.find('pre.requestCookies').text($(data.requestCookies).length ? formatJSON(data.requestCookies) : '');
						responseBox.find('.requestCookies').toggle($(data.requestCookies).length ? true : false);

						// Set up call request body
						responseBox.find('pre.requestBody').text(data.requestBody || '');
						responseBox.find('.requestBody').toggle(data.requestBody ? true : false);

						// Set up response status
						responseBox.find('pre.responseStatus').text(data.status.code + ' ' + data.status.text).toggleClass('error', data.status.code >= 400).removeClass((function (index, css) {
							return (css.match(/(^|\s)status-code-\d+/g) || []).join(' ');
						})).addClass('status-code-' + data.status.code);
						responseBox.find('.responseStatus').toggle((data.status.code > 0 || data.status.text) ? true : false);

						// Set up response headers
						responseBox.find('pre.headers').text(formatHeaders(data.responseHeaders)).toggleClass('error', data.status.code >= 400).removeClass((function (index, css) {
							return (css.match(/(^|\s)status-code-\d+/g) || []).join(' ');
						})).addClass('status-code-' + data.status.code);
						responseBox.find('.headers').toggle($(data.responseHeaders).length ? true : false);

						// Filter format if available content type
						switch (contentType.split(';')[0]) {
							// Parse types as JSON
							case 'application/javascript':
							case 'application/json':
							case 'application/x-javascript':
							case 'application/x-json':
							case 'text/javascript':
							case 'text/json':
							case 'text/x-javascript':
							case 'text/x-json':
								try {
									// js_beautify will format it if it's JSON or JSONP
									formattedText = js_beautify(formattedText, { 'preserve_newlines': false });
								} catch (err) {
									// js_beautify didn't like it, return it as it was
									formattedText = data.responseBody;
								}
								break;

							// Parse types as XHTML
							case 'application/xml':
							case 'text/xml':
							case 'text/html':
							case 'text/xhtml':
								formattedText = formatXML(formattedText) || '';
								break;
							default:
								break;
						}

						// Set response text
						responseBox.children('pre.response').text(formattedText).toggleClass('error', data.status.code >= 400).removeClass((function (index, css) {
							return (css.match(/(^|\s)status-code-\d+/g) || []).join(' ');
						})).addClass('status-code-' + data.status.code);
						responseBox.find('.response').toggle(validResponse ? true : false);

						// display service errors
						if (data.errorMessage) {
							errorBox.find('pre.error').text(data.errorMessage);
							errorBox.show();
						}

						// Fire pretty print on nodes
						prettyPrint();
					}
				});
			}
		}));

		// Auto enable endpoint list if only one exists
		// @done
		if (apiEndpointListBoxes.length === 1) {
			apiSelectBox.val(apiSelectBox.find('> [value!=""]').val()).change();
		}

		// Auto enable endpoint list if an api selection is designated as auto select
		// @done
		if (apiSelectBox.find('> [data-auto-select=1]').length) {
			apiSelectBox.val(apiSelectBox.find('> [data-auto-select=1]').val()).change();
		}

		// @todo
		self.initApiSchemas();
		self.initRequestBodyAlpacaForms();
		self.initAceEditor();

		// Return master object
		return self;
	}());
}));