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
			userNav: '<div class="container"><ul id="nav-user-list" class="list-inline text-small text-muted padding-top-small padding-bottom-small no-margin-bottom text-right">{{navItemsUser}}</ul></div>',
			primaryNav: '<div class="nav-wrap nav-collapse container padding-top-small padding-bottom-small">' +
							'<a class="logo" href="index.html">{{logo}}</a>' +
							'<a role="button" class="nav-toggle" data-nav-toggle="#primary-nav-menu" href="#">Menu</a>' +
							'<div class="nav-menu" id="primary-nav-menu">' +
								'<ul class="nav" id="primary-nav-list">' +
									'{{navItemsPrimary}}' +
								'</ul>' +
							'</div>' +
						'</div>',
			secondaryNav: '<div class="container"><ul id="nav-secondary-list">{{navItemsSecondary}}</ul>',
			footer1: '<div class="container"><hr></div>',
			footer2:	'<div class="container">' +
							'<p>{{masheryMade}}</p>' +
						'</div>',
			signin:  '<div class="container">' +
						'<div class="row">' +
							'<div class="grid-half">' +
								'<h1>{{label.heading}}</h1>' +
								'{{label.subheading}}' +
								'<div>' +
									'<label for="username">Username</label>' +
									'<input id="username" type="text">' +
								'</div>' +
								'<div>' +
									'<label for="password">Password</label>' +
									'<input id="password" type="password">' +
								'</div>' +
								'<div>' +
									'<button id="signin-submit" class="btn">{{label.submit}}</button>' +
								'</div>' +
							'</div>' +
							'<div class="grid-half">' +
								'{{label.sidebar}}' +
							'</div>' +
						'</div>' +
					'</div>',
			register:   '<div class="container">' +
							'<div class="row">' +
								'<div class="grid-two-thirds">' +
									'<h1>{{label.heading}}</h1>' +
									'{{label.subheading}}' +
									'<div>' +
										'<label for="username">Username</label>' +
										'<input id="username" type="text">' +
									'</div>' +
									'<div>' +
										'<label for="display-name">Display Name</label>' +
										'<input id="display-name" type="text">' +
									'</div>' +
									'<div>' +
										'<label for="email">Email</label>' +
										'<input id="email" type="email">' +
									'</div>' +
									'<div>' +
										'<label for="password">Password</label>' +
										'<input id="password" type="password">' +
									'</div>' +
									'<div>' +
										'<p><button id="register-submit" class="btn">{{label.submit}}</button></p>' +
									'</div>' +
									'<div>' +
										'<p>By clicking the "Register" button, I certify that I have read and agree to {{registerPolicy}}the <a href="http://www.mashery.com/terms/">Mashery Terms of Service</a> and <a href="http://www.mashery.com/privacy/">Privacy Policy</a>.</p>' +
									'</div>' +
								'</div>' +
								'<div class="grid-third">' +
									'{{label.sidebar}}' +
								'</div>' +
							'</div>' +
						'</div>',
			account:    '<div class="container">' +
							'<h1>{{label.headingMyApiKeys}}</h1>' +
							'<ul id="nav-account">' +
								'<li><a href="{{keys}}">{{label.keys}}</a></li>' +
								'<li><a href="{{apps}}">{{label.apps}}</a></li>' +
								'<li><a href="{{account}}">{{label.account}}</a></li>' +
							'</ul>' +
							'<p>{{label.noKeys}}</p>' +
						'</div>',
			logout: '<div class="container"><p>This content needs to get created.</p></div>',
			docs: '<div class="container"><p>This content needs to get created.</p></div>',
			ioDocs: '<div class="container"><p>This content needs to get created.</p></div>',
			contact: '<div class="container"><p>This content needs to get created.</p></div>',
			search: '<div class="container"><p>This content needs to get created.</p></div>'
		},

		// Labels & Blurbs
		labels: {

			userNav: {
				signin: 'Sign In',
				register: 'Register',
				username: 'Signed in as {{username}}',
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
			afterRenderLayout: function () {
				// @temp
				if (location.pathname.split('/').pop() === 'index.html') {
					document.querySelector('#nav-primary').style.marginBottom = '0';
				}
			},
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
		'signin.html': {
			placeholder: '{{signin}}',
			url: 'signin.html',
			template: function () {
				return replacePlaceholders(settings.templates.signin, 'signin');
			},
		},
		'register.html': {
			placeholder: '{{register}}',
			url: 'register.html',
			template: function () {
				return replacePlaceholders(settings.templates.register, 'register');
			},
		},
		'account.html': {
			placeholder: '{{account}}',
			url: 'account.html',
			template: function () {
				return replacePlaceholders(settings.templates.account, 'account');
			},
		},
		'apps.html': {
			placeholder: '{{apps}}',
			url: '#',
			template: null,
		},
		'keys.html': {
			placeholder: '{{keys}}',
			url: '#',
			template: null,
		},
		'dashboard.html': {
			placeholder: '{{dashboard}}',
			url: 'dashboard.html',
			template: null,
		},
		'logout.html': {
			placeholder: '{{logout}}',
			url: 'logout.html',
			template: function () {
				return replacePlaceholders(settings.templates.logout, 'logout');
			},
		},
		'docs.html': {
			placeholder: '{{docs}}',
			url: 'docs.html',
			template: function () {
				return replacePlaceholders(settings.templates.docs, 'docs');
			},
		},
		'io-docs.html': {
			placeholder: '{{iodocs}}',
			url: 'io-docs.html',
			template: function () {
				return replacePlaceholders(settings.templates.ioDocs, 'ioDocs');
			},
		},
		'contact.html': {
			placeholder: '{{contact}}',
			url: 'contact.html',
			template: function () {
				return replacePlaceholders(settings.templates.contact, 'contact');
			},
		},
		'search.html': {
			placeholder: '{{search}}',
			url: 'search.html',
			template: function () {
				return replacePlaceholders(settings.templates.search, 'search');
			},
		},
		page: {
			template: function () {
				var template =
					'<div class="bg-dark bg-hero padding-top padding-bottom" style="background-image: linear-gradient( rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6) ), url(https://unsplash.it/1800/800);">' +
						'<div class="container">' +
							'<h1>' + data[0].title + '</h1>' +
							'<p>' + data[0].body + '</p>' +
							'<p><a class="btn" href="account.html">Register Now</a> <a href="#">Or learn more about our APIs...</a></div></p>' +
						'</div>' +
					'</div>' +

					'<div class="container padding-top padding-bottom">' +
						'<h2>' + data[1].title + '</h2>' +
						'<p>' + data[1].body + '</p>' +
						'<p>' + data[2].body + data[3].body + '</p>' +
						'<p>' + data[4].body + '</p>' +
					'</div>';
				return template;
			}
		}
	};

	var globalPlaceholders = {
		area: {
			placeholder: '{{area}}',
			text: mashery.area
		},
		username: {
			placeholder: '{{username}}',
			text: mashery.username
		},
		logo: {
			placeholder: '{{logo}}',
			text: function () {
				return settings.logo ? settings.logo : mashery.area;
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
				return getNavItems(primaryNavItems);
			}
		},
		navItemsSecondary: {
			placeholder: '{{navItemsSecondary}}',
			text: function () {
				return getNavItems(secondaryNavItems);
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
		signin: {
			heading: {
				placeholder: '{{label.heading}}',
				text: function () {
					return settings.labels.signin.heading;
				}
			},
			subheading: {
				placeholder: '{{label.subheading}}',
				text: function () {
					return settings.labels.signin.subheading;
				}
			},
			submit:  {
				placeholder: '{{label.submit}}',
				text: function () {
					return settings.labels.signin.submit;
				}
			},
			sidebar: {
				placeholder: '{{label.sidebar}}',
				text: function () {
					return settings.labels.signin.sidebar;
				}
			}
		},
		register: {
			heading: {
				placeholder: '{{label.heading}}',
				text: function () {
					return settings.labels.register.heading;
				}
			},
			subheading: {
				placeholder: '{{label.subheading}}',
				text: function () {
					return settings.labels.register.subheading;
				}
			},
			submit: {
				placeholder: '{{label.submit}}',
				text: function () {
					return settings.labels.register.submit;
				}
			},
			sidebar: {
				placeholder: '{{label.sidebar}}',
				text: function () {
					return settings.labels.register.sidebar;
				}
			},
			privacyPolicy: {
				placeholder: '{{label.privacyPolicy}}',
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
		docs: {},
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

	// var makeFunction = function () {
	// 	forEach(settings.callbacks, function (callback, key) {
	// 		settings.callbacks[key] = new Function('return (' + settings.callbacks[key] + ')')();
	// 	});
	// };

	var replacePlaceholders = function (template, local) {
		if (local && localPlaceholders[local]) {
			forEach(localPlaceholders[local], function (placeholder) {
				if (!placeholder.placeholder || !placeholder.text) return;
				template = template.replace(new RegExp(placeholder.placeholder, 'g'), placeholder.text);
			});
		}
		forEach(paths, function (path) {
			if (!path.placeholder || !path.url) return;
			template = template.replace(new RegExp(path.placeholder, 'g'), path.url);
		});
		forEach(globalPlaceholders, function (placeholder) {
			if (!placeholder.placeholder || !placeholder.text) return;
			template = template.replace(new RegExp(placeholder.placeholder, 'g'), placeholder.text);
		});
		return template;
	};

	var getUserNavItems = function () {
		var template;
		if (mashery.loggedIn) {
			template =
				'<li id="nav-user-username">' + settings.labels.userNav.username + '</li>' +
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
		forEach(items, function (item) {
			template += '<li><a href="' + item.url + '">' + item.label + '</a></li>';
		});
		return template;
	};

	var getMain = function () {
		var template;
		var path = location.pathname.split('/').pop();
		if (paths[path] && paths[path].template) {
			template = paths[path].template();
		} else {
			template = paths.page.template();
		}
		settings.callbacks.beforeRenderMain();
		main.innerHTML = template;
		settings.callbacks.afterRenderMain();
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

	exports.renderLayout = function () {
		// var app = document.querySelector('#app');
		// if (!app) return;
		// settings.callbacks.beforeRenderLayout();
		// app.innerHTML = replacePlaceholders(settings.templates.layout, 'layout');
		// settings.callbacks.afterRenderLayout();
		render('#app', 'layout', settings.callbacks.beforeRenderLayout, settings.callbacks.afterRenderLayout);
	};

	exports.renderUserNav = function () {
		// var userNav = document.querySelector('#nav-user');
		// if (!userNav) return;
		// settings.callbacks.beforeRenderUserNav();
		// userNav.innerHTML = replacePlaceholders(settings.templates.userNav);
		// settings.callbacks.afterRenderUserNav();
		render('#nav-user', 'userNav', settings.callbacks.beforeRenderUserNav, settings.callbacks.afterRenderUserNav);
	};

	exports.renderPrimaryNav = function () {
		// var primaryNav = document.querySelector('#nav-primary');
		// if (!primaryNav) return;
		// settings.callbacks.beforeRenderPrimaryNav();
		// primaryNav.innerHTML = replacePlaceholders(settings.templates.primaryNav);
		// settings.callbacks.afterRenderPrimaryNav();
		render('#nav-primary', 'primaryNav', settings.callbacks.beforeRenderPrimaryNav, settings.callbacks.afterRenderPrimaryNav);
	};

	exports.renderSecondaryNav = function () {
		// var secondaryNav = document.querySelector('#nav-secondary');
		// if (!secondaryNav) return;
		// settings.callbacks.beforeRenderSecondaryNav();
		// secondaryNav.innerHTML = replacePlaceholders(settings.templates.secondaryNav);
		// settings.callbacks.afterRenderSecondaryNav();
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
		main = document.querySelector('#main');
		if (!main) return;
		atomic.ajax({
			url: mashDataEndpoint
		}).success(function (xhrData) {
			data = xhrData;
			getMain();
		});
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
		exports.renderLayout(); // Layout
		exports.renderUserNav(); // User Navigation
		exports.renderPrimaryNav(); // Primary Navigation
		exports.renderSecondaryNav(); // Secondary Navigation
		exports.renderMain(); // Main Content
		exports.renderContent('#footer-content-1', 'footer1'); // Footer Content 1
		exports.renderContent('#footer-content-2', 'footer2'); // Footer Content 2
		exports.renderMasheryMade(); // Add the Mashery Made logo if missing
		settings.callbacks.afterRender();
		document.documentElement.classList.remove('loading');
	};

	/**
	 * Initialize
	 * @public
	 * @param {object} options User options and overrides
	 */
	exports.init = function (options) {

		// Get options from localStorage
		// @temp
		options = localStorage.getItem('mashDemoOptions');
		if (options) {
			options = JSON.parse(options);
		}

		// Merge user options with defaults
		settings = extend( defaults, options || {} );

		exports.renderPortal();

	};


	//
	// Public APIs
	//

	return exports;

})();