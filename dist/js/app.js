/*!
 * blackbeard v0.0.1: Future portal layout
 * (c) 2017 Chris Ferdinandi
 * BSD-3-Clause License
 * http://github.com/mashery/blackbeard
 */

/*!
 * atomic v3.1.1: Vanilla JavaScript Ajax requests with chained success/error callbacks and JSON parsing
 * (c) 2017 Chris Ferdinandi
 * MIT License
 * https://github.com/cferdinandi/atomic
 * Originally created and maintained by Todd Motto - https://toddmotto.com
 */
(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define([], factory(root));
	} else if (typeof exports === 'object') {
		module.exports = factory(root);
	} else {
		root.atomic = factory(root);
	}
})(typeof global !== 'undefined' ? global : this.window || this.global, (function (root) {

	'use strict';

	//
	// Variables
	//

	var atomic = {}; // Object for public APIs
	var supports = !!root.XMLHttpRequest && !!root.JSON; // Feature test
	var settings;

	// Default settings
	var defaults = {
		type: 'GET',
		url: null,
		data: {},
		callback: null,
		headers: {
			'Content-type': 'application/x-www-form-urlencoded'
		},
		responseType: 'text',
		withCredentials: false
	};


	//
	// Methods
	//

	/**
	 * Merge two or more objects. Returns a new object.
	 * @private
	 * @param {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
	 * @param {Object}   objects  The objects to merge together
	 * @returns {Object}          Merged values of defaults and options
	 */
	var extend = function () {

		// Setup extended object
		var extended = {};

		// Merge the object into the extended object
		var merge = function (obj) {
			for ( var prop in obj ) {
				if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
					if ( Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
						extended[prop] = extend( true, extended[prop], obj[prop] );
					} else {
						extended[prop] = obj[prop];
					}
				}
			}
		};

		// Loop through each object and conduct a merge
		for (var i = 0; i < arguments.length; i++) {
			var obj = arguments[i];
			merge(obj);
		}

		return extended;

	};

	/**
	 * Parse text response into JSON
	 * @private
	 * @param  {String} req The response
	 * @return {Array}      A JSON Object of the responseText, plus the orginal response
	 */
	var parse = function (req) {
		var result;
		if (settings.responseType !== 'text' && settings.responseType !== '') {
			return [req.response, req];
		}
		try {
			result = JSON.parse(req.responseText);
		} catch (e) {
			result = req.responseText;
		}
		return [result, req];
	};

	/**
	 * Convert an object into a query string
	 * @private
	 * @@link  https://blog.garstasio.com/you-dont-need-jquery/ajax/
	 * @param  {Object} obj The object
	 * @return {String}     The query string
	 */
	var param = function (obj) {
		var encodedString = '';
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				if (encodedString.length > 0) {
					encodedString += '&';
				}
				encodedString += encodeURI(prop + '=' + obj[prop]);
			}
		}
		return encodedString;
	};

	/**
	 * Make an XML HTTP request
	 * @private
	 * @return {Object} Chained success/error/always methods
	 */
	var xhr = function () {

		// Our default methods
		var methods = {
			success: function () {},
			error: function () {},
			always: function () {}
		};

		// Override defaults with user methods and setup chaining
		var atomXHR = {
			success: function (callback) {
				methods.success = callback;
				return atomXHR;
			},
			error: function (callback) {
				methods.error = callback;
				return atomXHR;
			},
			always: function (callback) {
				methods.always = callback;
				return atomXHR;
			}
		};

		// Create our HTTP request
		var request = new XMLHttpRequest();

		// Setup our listener to process compeleted requests
		request.onreadystatechange = function () {

			// Only run if the request is complete
			if ( request.readyState !== 4 ) return;

			// Parse the response text
			var req = parse(request);

			// Process the response
			if (request.status >= 200 && request.status < 300) {
				// If successful
				methods.success.apply(methods, req);
			} else {
				// If failed
				methods.error.apply(methods, req);
			}

			// Run always
			methods.always.apply(methods, req);

		};

		// Setup our HTTP request
		request.open(settings.type, settings.url, true);
		request.responseType = settings.responseType;

		// Add headers
		for (var header in settings.headers) {
			if (settings.headers.hasOwnProperty(header)) {
				request.setRequestHeader(header, settings.headers[header]);
			}
		}

		// Add withCredentials
		if (settings.withCredentials) {
			request.withCredentials = true;
		}

		// Send the request
		request.send(param(settings.data));

		return atomXHR;
	};

	/**
	 * Make a JSONP request
	 * @private
	 * @return {[type]} [description]
	 */
	var jsonp = function () {
		// Create script with the url and callback
		var ref = root.document.getElementsByTagName( 'script' )[ 0 ];
		var script = root.document.createElement( 'script' );
		settings.data.callback = settings.callback;
		script.src = settings.url + (settings.url.indexOf( '?' ) + 1 ? '&' : '?') + param(settings.data);

		// Insert script tag into the DOM (append to <head>)
		ref.parentNode.insertBefore( script, ref );

		// After the script is loaded and executed, remove it
		script.onload = function () {
			this.remove();
		};
	};

	/**
	 * Make an Ajax request
	 * @public
	 * @param  {Object} options  User settings
	 * @return {String|Object}   The Ajax request response
	 */
	atomic.ajax = function (options) {

		// feature test
		if ( !supports ) return;

		// Merge user options with defaults
		settings = extend( defaults, options || {} );

		// Make our Ajax or JSONP request
		return ( settings.type.toLowerCase() === 'jsonp' ? jsonp() : xhr() );

	};


	//
	// Public APIs
	//

	return atomic;

}));
var getNav = function (selector) {

	// Variables
	var nav = [];
	var items = mashery.dom.querySelectorAll(selector);

	// Generate items object
	for (var i = 0; i < items.length; i++) {
		nav.push({
			label: items[i].innerHTML,
			url: items[i].href
		});
	}

	return nav;

};

var getContent = function (type) {

	// Cache mashery objects
	var dom = window.mashery.dom;
	var content = window.mashery.content;

	// Add primary nav
	content.navPrimary = getNav('#local a');

	// Add secondary nav
	content.navSecondary = getNav('#footer > ul a');

	// type = page
	if (type === 'page') {
		content.main = dom.querySelector('#main').innerHTML;
	}

	// type = docs
	if (type === 'docs') {
		content.main = dom.querySelector('#main').innerHTML;
		content.secondary = dom.querySelector('#sub ul').innerHTML;
	}

	// type = signin
	if (type === 'signin') {
		var signinForm = dom.querySelector('#signin form');
		content.main = '<form action="' + signinForm.action + '" method="post" enctype="multipart/form-data">' + signinForm.innerHTML + '</form>';
	}

	// type = register
	if (type === 'register') {
		var regForm = dom.querySelector('#member-register');
		content.main = '<form action="' + regForm.action + '" method="post" enctype="multipart/form-data">' + regForm.innerHTML + '</form>';
	}

	// type = account-keys
	// nav, create keys link, no keys message, key content/table

	// type = account-apps
	// nav, create apps link, no apps message, app content/table

	// type = account-manage
	// nav, actions links, form

	// type = account-email
	// nav, back link, form

	// type = account-password
	// nav, back link, form

	// type = profile
	// admin profile link (if isAdmin), user info, recent activity

	// type = logout
	// message, links

	// type = contact
	// #main.innerHTML

	// =======

	// type = forum {IGNORE}
	// recent topics link, categories RSS, categories OL

	// type = blog-all
	// RSS
	// foreach: article link/title, user link, date, content, comments link

	// type = blog-single
	// title, user link, date, content, comment count, comment box

};
var getContentType = function (elem) {

	var type = null;

	if (elem.classList.contains('please-login')) {
		type = 'pleaseLogin';
	} else if (elem.classList.contains('page-page')) {
		type = 'page';
	} else if (elem.classList.contains('page-docs')) {
		type = 'docs';
	} else if (elem.classList.contains('page-ioDocs')) {
		type = 'ioDocs';
	} else if (elem.classList.contains('page-forum')) {
		if (elem.classList.contains('topics')) {
			type = 'forumTopics';
		} else if (elem.classList.contains('topic-add')) {
			type = 'formAdd-Topic';
		} else if (elem.classList.contains('read')) {
			type = 'forumSingle';
		} else if (elem.classList.contains('recent')) {
			type = 'forumRecent';
		} else {
			type = 'forumAll';
		}
	} else if (elem.classList.contains('page-blog')){
		if (elem.classList.contains('browse')) {
			type = 'blogAll';
		} else {
			type = 'blogSingle';
		}
	} else if (elem.classList.contains('page-apps')) {
		if (elem.classList.contains('mykeys')) {
			type = 'accountKeys';
		} else if (elem.classList.contains('myapps')) {
			type = 'accountApps';
		}
	} else if (elem.classList.contains('page-member')) {
		if (elem.classList.contains('email')) {
			type = 'accountEmail';
		} else if (elem.classList.contains('passwd')) {
			type = 'accountPassword';
		} else if (elem.classList.contains('register')) {
			type = 'register';
		} else {
			type = 'accountManage';
		}
	} else if (elem.classList.contains('page-profile')) {
		type = 'profile';
	} else if (elem.classList.contains('page-login')) {
		type = 'signin';
	} else if (elem.classList.contains('page-search')) {
		type = 'search';
	} else if (elem.classList.contains('page-logout')) {
		type = 'logout';
	} else if (elem.classList.contains('page-contact')) {
		type = 'contact';
	}

	return type;

};
/**
 * Remove stylesheets from the DOM.
 * Copyright (c) 2017. TIBCO Software Inc. All Rights Reserved.
 * @param  {String} filename The name of the stylesheet to remove
 * @return {Object}          The stylesheet that was removed
 */
var removeCSS = function ( filename ) {

	'use strict';

	// Get all stylesheets
	var links = document.getElementsByTagName('link');
	var regex = new RegExp(filename);

	// Find and remove matching stylesheet
	for ( var i = links.length; i >= 0; i-- ) {
		if ( links[i] && links[i].href !== null && regex.test(links[i].href) ) {
			links[i].parentNode.removeChild(links[i]);
			return links[i];
		}
	}
};
var setupMashery = function () {

	// Get the default page
	var page = document.querySelector('#page');

	// Convert DOM content to a node
	var dom = document.createElement('div');
	dom.innerHTML = page.innerHTML;

	// Get special links
	var dashboard = dom.querySelector('#user-nav .dashboard a');
	var logout = dom.querySelector('#mashery-logout-form');

	// Setup mashery object
	window.mashery = {};

	// Get mashery properties
	window.mashery.dom = 'dom' in window.mashery ? window.mashery.dom : dom;
	window.mashery.loggedIn = typeof mashery_info === 'undefined' || !mashery_info || !mashery_info.username ? false : true;
	window.mashery.username = window.mashery.loggedIn ? mashery_info.username : null;
	window.mashery.isAdmin = dom.querySelector('#user-nav .dashboard.toggle') ? true : false;
	window.mashery.area = dom.querySelector('#branding-logo').innerHTML.trim();
	window.mashery.dashboard = dashboard ? dashboard : null;
	window.mashery.logout = logout ? logout : null;
	window.mashery.contentType = getContentType(document.body);
	window.mashery.content = {
		main: null,
		secondary: null,
		repeating: {}
	};

	// Remove page from the DOM
	page.parentNode.removeChild(page);

};
// Setup mashery variables
setupMashery();

// Make sure placeholder loaded
if (!document.querySelector('#app')) {
	loadPlaceholder();
}

// Remove the default CSS
removeCSS( 'localdev.css' ); // Remove localdev specific CSS. Do not use on production sites.
removeCSS( 'Mashery-base.css' ); // Remove the base Mashery CSS
removeCSS( 'mashery-blue.css' ); // Remove the base Mashery CSS
removeCSS( 'print-defaults.css' ); // Remove the default print CSS

// If the IODocs page, also remove IODocs specific CSS
if ( mashery.contentType === 'ioDocs' ) {
	removeCSS( 'Iodocs/style.css' );
	removeCSS( 'alpaca.min.css' );
}

// Get the content
getContent(window.mashery.contentType);
var loadPortal = (function () {

	'use strict';

	//
	// Variables
	//

	var exports = {}; // Placeholder for public methods
	var mashDataEndpoint = 'https://jsonplaceholder.typicode.com/posts';
	var settings, main, data;

	// Defaults
	var defaults = {

		// Logo
		logo: null,

		// Templates
		templates: {

			// Base layout
			layout: '<!-- Skip Nav Link -->' +
					'<a class="screen-reader screen-reader-focusable" href="#main">Skip to content</a>' +
					'{{navUser}}' +
					'{{navPrimary}}' +
					'{{main}}' +
					'<footer id="footer">' +
						'{{footer1}}' +
						'{{navSecondary}}' +
						'{{footer2}}' +
					'</footer>',

			// Navigation
			userNav: '<div class="container"><ul id="nav-user-list" class="list-inline text-small text-muted padding-top-small padding-bottom-small no-margin-bottom text-right">{{navItemsUser}}</ul></div>',
			primaryNav: '<div class="nav-wrap nav-collapse container padding-top-small padding-bottom-small">' +
							'<a class="logo" href="/">{{logo}}</a>' +
							'<a role="button" class="nav-toggle" data-nav-toggle="#primary-nav-menu" href="#">Menu</a>' +
							'<div class="nav-menu" id="primary-nav-menu">' +
								'<ul class="nav" id="primary-nav-list">' +
									'{{navItemsPrimary}}' +
								'</ul>' +
							'</div>' +
						'</div>',
			secondaryNav: '<div class="container"><ul id="nav-secondary-list">{{navItemsSecondary}}</ul>',

			// Footer
			footer1: '<div class="container"><hr></div>',
			footer2:	'<div class="container">' +
							'<p>{{masheryMade}}</p>' +
						'</div>',

			// Content types
			page:	'<div class="container">{{content}}</div>',
			docs:	'<div class="container">' +
						'<div class="row">' +
							'<div class="grid-two-thirds">{{content}}</div>' +
							'<div class="grid-third"><h2>In the Docs</h2><ul>{{nav}}</ul></div>' +
						'</div>' +
					'</div>',
			signin:  '<div class="container">' +
						'<div class="row">' +
							'<div class="grid-half">' +
								'<h1>{{heading}}</h1>' +
								'{{subheading}}' +
								'{{form}}' +
							'</div>' +
							'<div class="grid-half">' +
								'{{about}}' +
							'</div>' +
						'</div>' +
					'</div>',
			register:   '<div class="container">' +
							'<div class="row">' +
								'<div class="grid-two-thirds">' +
									'<h1>{{heading}}</h1>' +
									'{{subheading}}' +
									'{{form}}' +
									'{{terms}}' +
								'</div>' +
								'<div class="grid-third">' +
									'{{about}}' +
								'</div>' +
							'</div>' +
						'</div>',
			accountManage:	'<div class="container">' +
								'<h1>{{label.headingMyApiKeys}}</h1>' +
								'<ul id="nav-account">' +
									'<li><a href="{{keys}}">{{label.keys}}</a></li>' +
									'<li><a href="{{apps}}">{{label.apps}}</a></li>' +
									'<li><a href="{{account}}">{{label.account}}</a></li>' +
								'</ul>' +
								'<p>{{label.noKeys}}</p>' +
							'</div>',
			logout: '<div class="container"><p>This content needs to get created.</p></div>',
			ioDocs: '<div class="container"><p>This content needs to get created.</p></div>',
			contact: '<div class="container"><p>This content needs to get created.</p></div>',
			search: '<div class="container"><p>This content needs to get created.</p></div>',
		},

		// Labels & Blurbs
		labels: {

			userNav: {
				signin: 'Sign In',
				register: 'Register',
				account: 'My Account',
				dashboard: 'Dashboard',
				signout: 'Sign Out',
			},

			account: {
				headingMyApiKeys: 'My API Keys',
				headingMyApps: 'My Apps',
				headingAccount: 'Manage Account',
				keys: 'Keys',
				apps: 'Applications',
				account: 'Manage Account',
				noKeys: 'You don\'t have any keys yet.',
			},

			signin: {
				heading: 'Sign In',
				subheading: '<p>Sign in to {{area}} using your Mashery ID.</p>',
				submit: 'Sign In',
				sidebar: '<h2>Register</h2><p><a href="{{register}}">Create an account</a> to access stagingcs9.mashery.com. Your account information can then be used to access other APIs on the Mashery API Network.</p><h2>What is Mashery?</h2><p><a href="http://mashery.com">Mashery</a> powers APIs of leading brands in retail, media, business services, software, and more. By signing in to a Mashery powered portal, you can gain access to Mashery\'s base of API providers. All with a single Mashery ID.</p><p><a class="btn" href="{{register}}">Register a Mashery ID</a></p>',
			},

			register: {
				heading: 'Register for an Account',
				subheading: '<p>Register a new Mashery ID to access {{area}}.</p>',
				submit: 'Register',
				sidebar: '<h2>No Spam Guarantee</h2><p>We hate spam. We love our users. We promise to never sell or share any of your private information.</p>',
				privacyPolicy: ''
			}

		},

		// Callbacks
		callbacks: {
			beforeRenderLayout: function () {},
			afterRenderLayout: function () {},
			beforeRender: function () {},
			afterRender: function () {},
			beforeRenderUserNav: function () {},
			afterRenderUserNav: function () {},
			beforeRenderPrimaryNav: function () {},
			afterRenderPrimaryNav: function () {},
			beforeRenderSecondaryNav: function () {},
			afterRenderSecondaryNav: function () {},
			beforeRenderFooter: function () {},
			afterRenderFooter: function () {},
			beforeRenderMain: function () {},
			afterRenderMain: function () {}
		}

	};

	// Paths
	var paths = {
		page: {
			template: function () {
				return replacePlaceholders(settings.templates.page, 'page');
			}
		},
		docs: {
			placeholder: '{{docs}}',
			url: '/docs',
			template: function () {
				return replacePlaceholders(settings.templates.docs, 'docs');
			},
		},
		signin: {
			placeholder: '{{signin}}',
			url: '/login/login',
			template: function () {
				return replacePlaceholders(settings.templates.signin, 'signin');
			},
		},
		register: {
			placeholder: '{{register}}',
			url: '/member/register',
			template: function () {
				return replacePlaceholders(settings.templates.register, 'register');
			},
		},
		accountManage: {
			placeholder: '{{account}}',
			url: '/apps/mykeys',
			template: function () {
				return replacePlaceholders(settings.templates.account, 'account');
			},
		},
		accountApps: {
			placeholder: '{{apps}}',
			url: '/apps/myapps',
			template: null,
		},
		accountKeys: {
			placeholder: '{{keys}}',
			url: '/apps/mykeys',
			template: null,
		},
		'dashboard.html': {
			placeholder: '{{dashboard}}',
			url: (window.mashery.dashboard ? window.mashery.dashboard : '#'),
			template: null,
		},
		logout: {
			// @todo inject logout form
			placeholder: '{{logout}}',
			url: '/logout/logout',
			template: function () {
				return replacePlaceholders(settings.templates.logout, 'logout');
			},
		},
		ioDocs: {
			placeholder: '{{iodocs}}',
			url: '/io-docs',
			template: function () {
				return replacePlaceholders(settings.templates.ioDocs, 'ioDocs');
			},
		},
		contact: {
			placeholder: '{{contact}}',
			url: '/contact',
			template: function () {
				return replacePlaceholders(settings.templates.contact, 'contact');
			},
		},
		search: {
			placeholder: '{{search}}',
			url: '/search',
			template: function () {
				return replacePlaceholders(settings.templates.search, 'search');
			},
		}
	};

	var globalPlaceholders = {
		area: {
			placeholder: '{{area}}',
			text: window.mashery.area
		},
		username: {
			placeholder: '{{username}}',
			text: window.mashery.username
		},
		logo: {
			placeholder: '{{logo}}',
			text: function () {
				return settings.logo ? settings.logo : window.mashery.area;
			}
		},
		navItemsUser: {
			placeholder: '{{navItemsUser}}',
			text: function () {
				return getUserNavItems();
			}
		},
		navItemsPrimary: {
			placeholder: '{{navItemsPrimary}}',
			text: function () {
				return getNavItems(window.mashery.content.navPrimary);
			}
		},
		navItemsSecondary: {
			placeholder: '{{navItemsSecondary}}',
			text: function () {
				return getNavItems(window.mashery.content.navSecondary);
			}
		},
		registerPolicy: {
			placeholder: '{{registerPolicy}}',
			text: function () {
				return settings.labels.register.privacyPolicy;
			}
		},
		masheryMade: {
			placeholder: '{{masheryMade}}',
			text: '<a id="mashery-made-logo" href="http://mashery.com"><img src="https://support.mashery.com/public/Mashery/images/masherymade.png"></a>'
		}
	};

	var localPlaceholders = {
		layout: {
			navUser: {
				placeholder: '{{navUser}}',
				text: '<nav id="nav-user"></nav>'
			},
			navPrimary: {
				placeholder: '{{navPrimary}}',
				text: '<nav id="nav-primary"></nav>'
			},
			navSecondary: {
				placeholder: '{{navSecondary}}',
				text: '<nav id="nav-secondary"></nav>'
			},
			main: {
				placeholder: '{{main}}',
				text:	'<!-- tabindex="-1" hack for skipnav link: https://code.google.com/p/chromium/issues/detail?id=37721 -->' +
						'<main class="tabindex" tabindex="-1" id="main"></main>'
			},
			footer1: {
				placeholder: '{{footer1}}',
				text: '<div id="footer-content-1"></div>'
			},
			footer2: {
				placeholder: '{{footer2}}',
				text: '<div id="footer-content-2"></div>'
			}
		},
		page: {
			content: {
				placeholder: '{{content}}',
				text: window.mashery.content.main
			}
		},
		docs: {
			content: {
				placeholder: '{{content}}',
				text: window.mashery.content.main
			},
			nav: {
				placeholder: '{{nav}}',
				text: window.mashery.content.secondary
			}
		},
		signin: {
			heading: {
				placeholder: '{{heading}}',
				text: function () {
					return settings.labels.signin.heading;
				}
			},
			subheading: {
				placeholder: '{{subheading}}',
				text: function () {
					return settings.labels.signin.subheading;
				}
			},
			form: {
				placeholder: '{{form}}',
				text: window.mashery.content.main
			},
			about: {
				placeholder: '{{about}}',
				text: function () {
					return settings.labels.signin.sidebar;
				}
			}
		},
		register: {
			heading: {
				placeholder: '{{heading}}',
				text: function () {
					return settings.labels.register.heading;
				}
			},
			subheading: {
				placeholder: '{{subheading}}',
				text: function () {
					return settings.labels.register.subheading;
				}
			},
			form: {
				placeholder: '{{form}}',
				text: window.mashery.content.main
			},
			terms: {
				placeholder: '{{terms}}',
				text: function () {
					var text =
						'<div id="registration-terms-of-service">' +
							'<p>By clicking the "Register" button, I certify that I have read and agree to {{privacyPolicy}}the <a href="http://www.mashery.com/terms/">Mashery Terms of Service</a> and <a href="http://www.mashery.com/privacy/">Privacy Policy</a>.</p>' +
						'</div>';
					return text;
				}
			},
			about: {
				placeholder: '{{about}}',
				text: function () {
					return settings.labels.register.sidebar;
				}
			},
			privacyPolicy: {
				placeholder: '{{privacyPolicy}}',
				text: function () {
					return settings.labels.register.privacyPolicy;
				}
			},
		},
		account: {
			headingMyApiKeys: {
				placeholder: '{{label.headingMyApiKeys}}',
				text: function () {
					return settings.labels.account.headingMyApiKeys;
				}
			},
			headingMyApps: {
				placeholder: '{{label.headingMyApps}}',
				text: function () {
					return settings.labels.account.headingMyApps;
				}
			},
			headingAccount: {
				placeholder: '{{label.headingAccount}}',
				text: function () {
					return settings.labels.account.headingAccount;
				}
			},
			keys: {
				placeholder: '{{label.keys}}',
				text: function () {
					return settings.labels.account.keys;
				}
			},
			apps: {
				placeholder: '{{label.apps}}',
				text: function () {
					return settings.labels.account.apps;
				}
			},
			account: {
				placeholder: '{{label.account}}',
				text: function () {
					return settings.labels.account.account;
				}
			},
			noKeys: {
				placeholder: '{{label.noKeys}}',
				text: function () {
					return settings.labels.account.noKeys;
				}
			},
		},
		apps: {},
		keys: {},
		dashboard: {},
		logout: {},
		ioDocs: {},
		contact: {},
		search: {},
	};


	//
	// Methods
	//

	/*! foreach.js v1.1.0 | (c) 2014 @toddmotto | https://github.com/toddmotto/foreach */
	var forEach = function (collection, callback, scope) {
		if (Object.prototype.toString.call(collection) === '[object Object]') {
			for (var prop in collection) {
				if (Object.prototype.hasOwnProperty.call(collection, prop)) {
					callback.call(scope, collection[prop], prop, collection);
				}
			}
		} else {
			for (var i = 0, len = collection.length; i < len; i++) {
				callback.call(scope, collection[i], i, collection);
			}
		}
	};

	/**
	 * Merge two or more objects. Returns a new object.
	 * Set the first argument to `true` for a deep or recursive merge
	 * @private
	 * @param   {Object} objects The objects to merge together
	 * @returns {Object}         Merged values of defaults and options
	 */
	var extend = function () {

		// Variables
		var extended = {};
		var deep = false;
		var i = 0;
		var length = arguments.length;

		// Merge the object into the extended object
		var merge = function ( obj ) {
			for ( var prop in obj ) {
				if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
					// If deep merge and property is an object, merge properties
					if ( Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
						extended[prop] = extend( true, extended[prop], obj[prop] );
					} else {
						extended[prop] = obj[prop];
					}
				}
			}
		};

		// Loop through each object and conduct a merge
		for ( ; i < length; i++ ) {
			var obj = arguments[i];
			merge(obj);
		}

		return extended;

	};

	var replacePlaceholders = function (template, local) {
		if (local && localPlaceholders[local]) {
			forEach(localPlaceholders[local], (function (placeholder) {
				if (!placeholder.placeholder || !placeholder.text) return;
				template = template.replace(new RegExp(placeholder.placeholder, 'g'), placeholder.text);
			}));
		}
		forEach(paths, (function (path) {
			if (!path.placeholder || !path.url) return;
			template = template.replace(new RegExp(path.placeholder, 'g'), path.url);
		}));
		forEach(globalPlaceholders, (function (placeholder) {
			if (!placeholder.placeholder || !placeholder.text) return;
			template = template.replace(new RegExp(placeholder.placeholder, 'g'), placeholder.text);
		}));
		return template;
	};

	var getUserNavItems = function () {
		var template;
		if (mashery.loggedIn) {
			template =
				'<li id="nav-user-myaccount"><a href="{{account}}">' + settings.labels.userNav.account + '</a></li>' +
				(mashery.isAdmin ? '<li><a href="{{dashboard}}">' + settings.labels.userNav.dashboard + '</a></li>' : '') +
				'<li id="nav-user-signout"><a href="{{logout}}">' + settings.labels.userNav.signout + '</a></li>';
		} else {
			template =
				'<li id="nav-user-signin"><a href="{{signin}}">' + settings.labels.userNav.signin + '</a></li>' +
				'<li id="nav-user-register"><a href="{{register}}">' + settings.labels.userNav.register + '</a></li>';
		}
		return replacePlaceholders(template);
	};

	var getNavItems = function (items) {
		var template = '';
		forEach(items, (function (item) {
			template += '<li><a href="' + decodeURIComponent(item.url) + '">' + item.label + '</a></li>';
		}));
		return template;
	};

	var inject = function (type, atts) {
		var ref = window.document.getElementsByTagName( 'script' )[ 0 ];
		var elem = document.createElement(type);
		forEach(atts, (function (value, key) {
			elem.setAttribute(key, value);
		}));
		ref.parentNode.insertBefore(elem, ref);
	};

	var render = function (selector, key, before, after) {
		var content = document.querySelector(selector);
		if (!content) return;
		if (before) {
			before();
		}
		content.innerHTML = settings.templates[key] ? replacePlaceholders(settings.templates[key], key) : '';
		if (after) {
			after();
		}
	};

	var verifyLoggedIn = function () {
		if (window.mashery.contentType !== 'logout') return;
		var loggedIn = window.mashery.dom.querySelector('#mashery-logout-form');
		if (loggedIn) return;
		window.mashery.loggedIn = false;
		window.mashery.username = null;
		window.mashery.isAdmin = false;
		window.mashery.dashboard = null;
		window.mashery.logout = null;
	};

	exports.renderLayout = function () {
		render('#app', 'layout', settings.callbacks.beforeRenderLayout, settings.callbacks.afterRenderLayout);
		verifyLoggedIn();
	};

	exports.renderUserNav = function () {
		render('#nav-user', 'userNav', settings.callbacks.beforeRenderUserNav, settings.callbacks.afterRenderUserNav);
	};

	exports.renderPrimaryNav = function () {
		render('#nav-primary', 'primaryNav', settings.callbacks.beforeRenderPrimaryNav, settings.callbacks.afterRenderPrimaryNav);
	};

	exports.renderSecondaryNav = function () {
		render('#nav-secondary', 'secondaryNav', settings.callbacks.beforeRenderSecondaryNav, settings.callbacks.afterRenderSecondaryNav);
	};

	exports.renderContent = function (id, key) {
		var content = document.querySelector(id);
		if (!content) return;
		settings.callbacks.beforeRenderFooter();
		content.innerHTML = settings.templates[key] ? replacePlaceholders(settings.templates[key]) : '';
		settings.callbacks.afterRenderFooter();
	};

	exports.renderMain = function () {
		render('#main', window.mashery.contentType, settings.callbacks.beforeRenderMain, settings.callbacks.afterRenderMain);
	};

	var renderHead = function () {
		inject('meta', {
			'http-equiv': 'X-UA-Compatible',
			'content': 'IE=edge,chrome=1'
		});

		inject('meta', {
			name: 'viewport',
			content: 'width=device-width, initial-scale=1.0'
		});

		inject('link', {
			rel: 'shortcut icon',
			href: '/files/favicon.ico'
		});

		inject('link', {
			rel: 'icon',
			sizes: '16x16 32x32',
			href: '/files/favicon.icon'
		});
	};

	var renderLogout = function () {
		if (!window.mashery.logout) return;
		window.mashery.logoutForm = document.body.insertBefore(window.mashery.logout, document.body.firstChild);
	};

	var fixLocation = function () {
		if (window.location.hash) {
			window.location.hash = window.location.hash;
		} else {
			document.querySelector('#app').focus();
		}
	};

	exports.renderMasheryMade = function () {
		var masheryMade = document.querySelector('#mashery-made-logo');
		if (masheryMade) return;
		var app = document.querySelector('#app');
		if (!app) return;
		var mashMade = document.createElement('div');
		mashMade.innerHTML = '<p>x</p><div id="mashery-made"><div class="container"><p>' + globalPlaceholders.masheryMade.text + '</p></div></div>';
		app.appendChild(mashMade.childNodes[1]);
	};

	exports.renderPortal = function () {
		settings.callbacks.beforeRender();
		renderHead(); // <head> attributes
		exports.renderLayout(); // Layout
		exports.renderUserNav(); // User Navigation
		exports.renderPrimaryNav(); // Primary Navigation
		exports.renderSecondaryNav(); // Secondary Navigation
		exports.renderMain(); // Main Content
		exports.renderContent('#footer-content-1', 'footer1'); // Footer Content 1
		exports.renderContent('#footer-content-2', 'footer2'); // Footer Content 2
		fixLocation(); // Jump to anchor
		renderLogout(); // Logout Form
		exports.renderMasheryMade(); // Add the Mashery Made logo if missing
		settings.callbacks.afterRender();
		document.documentElement.classList.remove('loading');
	};

	var logoutListener = function (event) {
		if (!event.target.closest('a[href="' + paths.logout.url + '"') || !window.mashery.logoutForm) return;
		event.preventDefault();
		window.mashery.logoutForm.submit();
	};

	/**
	 * Initialize
	 * @public
	 * @param {object} options User options and overrides
	 */
	exports.init = function (options) {

		loadJS('https://ft-polyfill-service.herokuapp.com/v2/polyfill.min.js', (function () {

			// Merge user options with defaults
			settings = extend( defaults, options || {} );

			// Render the Portal
			exports.renderPortal();

			// Listen for logout click
			document.addEventListener('click', logoutListener, false);

		}));

	};


	//
	// Public APIs
	//

	return exports;

})();