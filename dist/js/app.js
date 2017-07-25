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
			url: items[i].getAttribute('href')
		});
	}

	return nav;

};

var fetchUserProfile = function () {
	if (window.mashery.userProfile) return;
	atomic.ajax({
		url: '/member/edit',
		responseType: 'document'
	}).success((function (data) {
		var userProfile = data.querySelector('.actions .public-profile.action');
		if (!userProfile) return;
		userProfile = userProfile.getAttribute('href');
		window.mashery.userProfile = userProfile;
		sessionStorage.setItem('masheryUserProfile', userProfile);
		var profileLink = document.querySelector('a[href*="/profile/profile/"]');
		if (!profileLink) return;
		profileLink.href = userProfile;
	}));
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
	// @todo verify that there's only one app per key
	if (type === 'accountKeys') {

		// Get elements
		var keys = document.querySelectorAll('.main div.key');
		var getKeys = document.querySelector('.action.new-key');

		// Set values
		content.main = [];
		content.secondary = getKeys ? getKeys.getAttribute('href') : null;
		keys.forEach((function(key) {
			var data = key.querySelectorAll('dd');
			content.main.push({
				heading: key.previousSibling,
				application: data[0].trim(),
				key: data[1].trim(),
				status: data[2].trim(),
				created: data[3].querySelector('abbr').getAttribute('title'),
				limits: '<table>' + key.querySelector('table.key').innerHTML + '<table>',
				report: key.querySelector('.key-actions.actions .view-report.action').getAttribute('href'),
				delete: key.querySelector('.key-actions.actions .delete.action').getAttribute('href')
			});
		}));

	}

	// type = account-apps
	// nav, create apps link, no apps message, app content/table
	if (type === 'accountApps') {

		// Get elements
		var apps = document.querySelectorAll('.main .application');
		var createApps = document.querySelector('.main .actions .add-app.action');

		// Set values
		content.main = [];
		content.secondary = createApps ? createApps.getAttribute('href') : null;
		apps.forEach((function(app) {
			var dataBasic = app.querySelectorAll('dd');
			var dataDetails = app.querySelectorAll('tbody td');
			content.main.push({
				application: app.document.querySelector('h3').innerHTML.trim(),
				created: dataBasic[1].querySelector('abbr').getAttribute('title'),
				api: dataDetails[0].innerHTML.trim(),
				key: dataDetails[1].innerHTML.trim(),
				edit: app.querySelector('.application-actions.actions .edit.action').getAttribute('href'),
				delete: app.querySelector('.application-actions.actions .delete-app.action').getAttribute('href')
			});
		}));

	}

	// type = account-manage
	if (type === 'accountManage') {
		var accountForm = dom.querySelector('#member-edit');
		var userProfile = dom.querySelector('.actions .public-profile.action');
		content.main = '<form action="' + accountForm.getAttribute('action') + '" method="post" enctype="multipart/form-data" id="member-edit">' + accountForm.innerHTML + '</form>';
		content.main = content.main.replace('<legend>Account Information</legend>', '');
		if (userProfile) {
			userProfile = userProfile.getAttribute('href');
			window.mashery.userProfile = userProfile;
			sessionStorage.setItem('masheryUserProfile', userProfile);
		}
	}

	// type = account-email
	if (type === 'accountEmail') {
		var emailForm = dom.querySelector('.main form');
		if (!emailForm) return;
		content.main = '<form action="' + emailForm.getAttribute('action') + '" method="post" enctype="multipart/form-data">' + emailForm.innerHTML + '</form>';
		fetchUserProfile();
	}

	// type = account-password
	if (type === 'accountPassword') {
		var passwordForm = dom.querySelector('.main form');
		if (!passwordForm) return;
		content.main = '<form action="' + passwordForm.getAttribute('action') + '" method="post" enctype="multipart/form-data">' + passwordForm.innerHTML + '</form>';
		content.secondary = dom.querySelector('#passwd_requirements').innerHTML;
		fetchUserProfile();
	}

	// type = profile
	if (type === 'profile') {
		var data = dom.querySelectorAll('.user-information dd');
		var activity = dom.querySelector('table.recent-activity');
		var admin = dom.querySelector('a[href*="/r/member/"]');
		if (!activity || data.length < 1) return;
		content.main = {
			name: dom.querySelector('h1.first').innerHTML.replace('View Member ', '').trim(),
			admin: admin ? admin.getAttribute('href') : null,
			blog: data[0].querySelector('a').getAttribute('href'),
			website: data[1].querySelector('a').getAttribute('href'),
			registered: data[2].querySelector('abbr').getAttribute('title'),
			activity: activity ? '<table>' + activity.innerHTML + '</table>' : null
		};
	}

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
			type = 'forumAddTopic';
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
		} else if (elem.classList.contains('remove')) {
			if (/You have been removed!/.test(elem.querySelector('.main .section-body').innerHTML)) {
				type = 'memberRemoveSuccess';
			} else {
				type = 'memberRemove';
			}
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
		if (elem.querySelector('#user-nav .account')) {
			type = 'logoutFail';
		} else {
			type = 'logout';
		}
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
var setupMashery = function (doc) {

	// Get the default page
	var page = doc.querySelector('#page');

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
	window.mashery.title = doc.title;
	window.mashery.loggedIn = typeof mashery_info === 'undefined' || !mashery_info || !mashery_info.username ? false : true;
	window.mashery.username = window.mashery.loggedIn ? mashery_info.username : null;
	window.mashery.userProfile = sessionStorage.getItem('masheryUserProfile');
	window.mashery.isAdmin = dom.querySelector('#user-nav .dashboard.toggle') ? true : false;
	window.mashery.area = dom.querySelector('#branding-logo').innerHTML.trim();
	window.mashery.dashboard = dashboard ? dashboard : null;
	window.mashery.logout = logout ? logout : null;
	window.mashery.contentType = getContentType(doc.body);
	window.mashery.content = {};

	// Remove page from the DOM
	page.remove();

};
// Setup mashery variables
setupMashery(document);

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
	var settings, main, data;

	// Defaults
	var defaults = {

		// Ajax page loads
		ajax: true,
		ajaxIgnore: null,

		// Logo
		logo: null,

		// Templates
		templates: {

			// Base layout
			layout:	'<!-- Skip Nav Link -->' +
					'<a class="screen-reader screen-reader-focusable" href="#main">Skip to content</a>' +
					'{{layout.navUser}}' +
					'{{layout.navPrimary}}' +
					'{{layout.main}}' +
					'<footer id="footer">' +
						'{{layout.footer1}}' +
						'{{layout.navSecondary}}' +
						'{{layout.footer2}}' +
					'</footer>',

			// Navigation
			userNav: '<div class="container"><ul id="nav-user-list" class="list-inline text-small text-muted padding-top-small padding-bottom-small no-margin-bottom text-right">{{content.navItemsUser}}</ul></div>',
			primaryNav:	'<div class="nav-wrap nav-collapse container padding-top-small padding-bottom-small">' +
							'<a class="logo" href="/">{{content.logo}}</a>' +
							'<a role="button" class="nav-toggle" data-nav-toggle="#primary-nav-menu" href="#">Menu</a>' +
							'<div class="nav-menu" id="primary-nav-menu">' +
								'<ul class="nav" id="primary-nav-list">' +
									'{{content.navItemsPrimary}}' +
								'</ul>' +
							'</div>' +
						'</div>',
			secondaryNav: '<div class="container"><ul id="nav-secondary-list">{{content.navItemsSecondary}}</ul>',

			// Footer
			footer1: '<div class="container"><hr></div>',
			footer2:	'<div class="container">' +
							'<p>{{content.masheryMade}}</p>' +
						'</div>',

			// Content types
			page:	'<div class="container">{{content.main}}</div>',
			docs:	'<div class="container">' +
						'<div class="row">' +
							'<div class="grid-two-thirds">{{content.main}}</div>' +
							'<div class="grid-third"><h2>In the Docs</h2><ul>{{content.docsNav}}</ul></div>' +
						'</div>' +
					'</div>',
			signin:	'<div class="container">' +
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
			register:	'<div class="container">' +
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
			accountKeys: function () {
				var template = 	'<h1>{{label.headingMyApiKeys}}</h1><ul id="nav-account">{{content.navItemsAccount}}</ul>';
				if (mashery.content.main.length > 0 ) {
					forEach(mashery.content.main, (function (key) {
						template +=
							'<h2>' + key.heading + '</h2>',
							'<p><strong>' + key.application + '</strong></p>' +
							'<ul>' +
								'<li>Key: ' + key.key + '</li>' +
								'<li>Status: ' + key.status + '</li>' +
								'<li>Created: ' + key.created + '</li>' +
							'<ul>' +
							key.limits +
							'<a class="btn" href="' + key.delete + '">Delete This Key</a>';
					}));
				} else {
					template += '{{label.noKeys}}';
				}
				if (mashery.content.secondary) {
					template += '<p><a class="btn" href="' + mashery.content.secondary + '">Get API Keys</a></p>';
				}
				return '<div class="container container-small">' + template + '</div>';
			},
			accountApps: function () {
				var template = 	'<h1>{{label.headingMyApps}}</h1><ul id="nav-account">{{content.navItemsAccount}}</ul>';
				if (mashery.content.main.length > 0 ) {
					forEach(mashery.content.main, (function (app) {
						template +=
							'<h2>' + app.application + '</h2>',
							'<ul>' +
								'<li>API: ' + app.api + '</li>' +
								'<li>Key: ' + app.key + '</li>' +
								'<li>Created: ' + app.created + '</li>' +
							'<ul>' +
							'<a class="btn" href="' + app.edit + '">Edit This App</a>' +
							'<a class="btn" href="' + app.delete + '">Delete This App</a>';
					}));
				} else {
					template += '{{label.noApps}}';
				}
				if (mashery.content.secondary) {
					template += '<p><a class="btn" href="' + window.mashery.content.secondary + '">Create a New App</a></p>';
				}
				return '<div class="container container-small">' + template + '</div>';
			},
			accountManage:	'<div class="container container-small">' +
								'<h1>{{label.headingAccount}}</h1>' +
								'<ul id="nav-account">{{content.navItemsAccount}}</ul>' +
								'<ul id="nav-mashery-account">{{content.navItemsMasheryAccount}}</ul>' +
								'<h2>{{label.headingAccountInfo}}</h2>' +
								window.mashery.content.main +
							'</div>',
			accountEmail:	'<div class="container container-small">' +
								'<h1>{{label.headingChangeEmail}}</h1>' +
								'<ul id="nav-account">{{content.navItemsAccount}}</ul>' +
								'<ul id="nav-mashery-account">{{content.navItemsMasheryAccount}}</ul>' +
								window.mashery.content.main +
							'</div>',
			accountPassword:	'<div class="container container-small">' +
									'<h1>{{label.headingChangePassword}}</h1>' +
									'<ul id="nav-account">{{content.navItemsAccount}}</ul>' +
									'<ul id="nav-mashery-account">{{content.navItemsMasheryAccount}}</ul>' +
									window.mashery.content.main +
								'</div>',
			profile: function () {
				var template = '<h1>' + window.mashery.content.main.name + '</h1>';
				if (window.mashery.content.main.admin) {
					template += '<p><a href="' + window.mashery.content.main.admin + '">View administrative profile for ' + window.mashery.content.main.name + '</a></p>';
				}
				template +=	'<h2>{{label.headingUserInfo}}</h2>' +
							'<ul>';
							if (window.mashery.content.main.website) {
								template += '<li><strong>{{label.userWebsite}}</strong> <a href="' + window.mashery.content.main.website + '">' + window.mashery.content.main.website + '</a></li>';
							}
							if (window.mashery.content.main.blog) {
								template += '<li><strong>{{label.userBlog}}</strong> <a href="' + window.mashery.content.main.blog + '">' + window.mashery.content.main.blog + '</a></li>';
							}
							template += '<li><strong>{{label.userRegistered}}</strong> ' + window.mashery.content.main.registered + '</li>';
				template +=	'</ul>';
				if (window.mashery.content.main.activity) {
					template += '<h2>{{label.headingActivity}}</h2>' +
					window.mashery.content.main.activity;
				}
				return '<div class="container">' + template + '</div>';
			},
			logout:	'<div class="container container-small">' +
						'<h1>{{label.heading}}</h1>' +
						'<p>{{label.main}}</p>' +
					'</div>',
			logoutFail:	'<div class="container container-small">' +
							'<h1>{{label.heading}}</h1>' +
							'<p>{{label.main}}</p>' +
						'</div>',
			memberRemove:	'<div class="container container-small">' +
								'<h1>{{label.heading}}</h1>' +
								'<p>{{label.main}}</p>' +
								'<p>' +
									'<a class="btn" href="{{path.removeMember}}">{{label.confirm}}</a>' +
									'<a class="btn" href="{{path.account}}">{{label.cancel}}</a>' +
								'</p>' +
							'</div>',
			memberRemoveSuccess:	'<div class="container container-small">' +
										'<h1>{{label.heading}}</h1>' +
										'<p>{{label.main}}</p>' +
									'</div>',
			ioDocs: '<div class="container"><p>This content needs to get created.</p></div>',
			contact: '<div class="container"><p>This content needs to get created.</p></div>',
			search: '<div class="container"><p>This content needs to get created.</p></div>'
		},

		// Labels & Blurbs
		labels: {

			title: '{{mashery.title}} | {{mashery.area}}',

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
				headingAccountInfo: 'Account Information',
				headingChangeEmail: 'Change Email',
				headingChangePassword: 'Change Password',
				keys: 'Keys',
				apps: 'Applications',
				account: 'Manage Account',
				changeEmail: 'Change Email',
				changePassword: 'Change Password',
				viewProfile: 'View My Public Profile',
				removeMembership: 'Remove Membership from ' + window.mashery.area,
				noKeys: 'You don\'t have any keys yet.',
				noApps: 'You don\'t have any apps yet.',
			},

			profile: {
				headingUserInfo: 'User Information',
				headingActivity: 'Recent Activity',
				userWebsite: 'Website:',
				userBlog: 'Blog:',
				userRegistered: 'Registered:'
			},

			signin: {
				heading: 'Sign In',
				subheading: '<p>Sign in to {{mashery.area}} using your Mashery ID.</p>',
				submit: 'Sign In',
				sidebar: '<h2>Register</h2><p><a href="{{path.register}}">Create an account</a> to access stagingcs9.mashery.com. Your account information can then be used to access other APIs on the Mashery API Network.</p><h2>What is Mashery?</h2><p><a href="http://mashery.com">Mashery</a> powers APIs of leading brands in retail, media, business services, software, and more. By signing in to a Mashery powered portal, you can gain access to Mashery\'s base of API providers. All with a single Mashery ID.</p><p><a class="btn" href="{{path.register}}">Register a Mashery ID</a></p>',
			},

			register: {
				heading: 'Register for an Account',
				subheading: '<p>Register a new Mashery ID to access {{mashery.area}}.</p>',
				submit: 'Register',
				sidebar: '<h2>No Spam Guarantee</h2><p>We hate spam. We love our users. We promise to never sell or share any of your private information.</p>',
				privacyPolicy: ''
			},

			logout: {
				heading: 'Signed Out',
				main: 'You have successfully signed out. Come back soon!'
			},

			logoutFail: {
				heading: 'Sign Out Failed',
				main: 'Your attempt to sign out failed. Please try again.'
			},

			memberRemove: {
				heading: 'Remove membership from ' + window.mashery.area,
				main: 'Removing membership disables your account and you will not be able to register again using the same username. All your keys will be deactivated.',
				confirm: 'Remove Membership',
				cancel: 'Cancel',
				popup: 'Please confirm that you wish to permanently disable your membership with this service.'
			},

			memberRemoveSuccess: {
				heading: 'Your account has been removed.',
				main: 'Enjoy the rest of your day!'
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
		docs: {
			placeholder: '{{path.docs}}',
			url: '/docs'
		},
		signin: {
			placeholder: '{{path.signin}}',
			url: '/login/login'
		},
		register: {
			placeholder: '{{path.register}}',
			url: '/member/register'
		},
		accountManage: {
			placeholder: '{{path.account}}',
			url: '/member/edit'
		},
		accountApps: {
			placeholder: '{{path.apps}}',
			url: '/apps/myapps'
		},
		accountKeys: {
			placeholder: '{{path.keys}}',
			url: '/apps/mykeys'
		},
		changeEmail: {
			placeholder: '{{path.changeEmail}}',
			url: '/member/email'
		},
		changePassword: {
			placeholder: '{{path.changePassword}}',
			url: '/member/passwd'
		},
		viewProfile: {
			placeholder: '{{path.viewProfile}}',
			url: window.mashery.userProfile ? window.mashery.userProfile : '/profile/profile'
		},
		removeMembership: {
			placeholder: '{{path.removeMembership}}',
			url: '/member/remove'
		},
		dashboard: {
			placeholder: '{{path.dashboard}}',
			url: (window.mashery.dashboard ? window.mashery.dashboard : '#')
		},
		logout: {
			placeholder: '{{path.logout}}',
			url: '/logout/logout'
		},
		ioDocs: {
			placeholder: '{{path.iodocs}}',
			url: '/io-docs'
		},
		contact: {
			placeholder: '{{path.contact}}',
			url: '/contact'
		},
		search: {
			placeholder: '{{path.search}}',
			url: '/search'
		},
		memberRemove: {
			placeholder: '{{path.removeMember}}',
			url: '/member/remove?action=removeMember'
		}
	};

	var globalPlaceholders = {
		title: {
			placeholder: '{{mashery.title}}',
			text: function () {
				var heading = document.querySelector('h1');
				return (heading ? heading.innerHTML.trim() : window.mashery.title.replace(window.mashery.area + ' - ', '').replace(window.mashery.area, ''));
			}
		},
		area: {
			placeholder: '{{mashery.area}}',
			text: function () {
				return window.mashery.area;
			}
		},
		username: {
			placeholder: '{{mashery.username}}',
			text: function () {
				return window.mashery.username;
			}
		},
		logo: {
			placeholder: '{{content.logo}}',
			text: function () {
				return settings.logo ? settings.logo : window.mashery.area;
			}
		},
		navItemsUser: {
			placeholder: '{{content.navItemsUser}}',
			text: function () {
				return getUserNavItems();
			}
		},
		navItemsPrimary: {
			placeholder: '{{content.navItemsPrimary}}',
			text: function () {
				return getNavItems(window.mashery.content.navPrimary);
			}
		},
		navItemsSecondary: {
			placeholder: '{{content.navItemsSecondary}}',
			text: function () {
				return getNavItems(window.mashery.content.navSecondary);
			}
		},
		navItemsAccount: {
			placeholder: '{{content.navItemsAccount}}',
			text: function () {
				return getAccountNavItems();
			}
		},
		navItemsMasheryAccount: {
			placeholder: '{{content.navItemsMasheryAccount}}',
			text: function () {
				return getMasheryAccountNavItems();
			}
		},
		registerPolicy: {
			placeholder: '{{registerPolicy}}',
			text: function () {
				return settings.labels.register.privacyPolicy;
			}
		},
		masheryMade: {
			placeholder: '{{content.masheryMade}}',
			text: '<a id="mashery-made-logo" href="http://mashery.com"><img src="https://support.mashery.com/public/Mashery/images/masherymade.png"></a>'
		}
	};

	var localPlaceholders = {
		layout: {
			navUser: {
				placeholder: '{{layout.navUser}}',
				text: '<nav id="nav-user"></nav>'
			},
			navPrimary: {
				placeholder: '{{layout.navPrimary}}',
				text: '<nav id="nav-primary"></nav>'
			},
			navSecondary: {
				placeholder: '{{layout.navSecondary}}',
				text: '<nav id="nav-secondary"></nav>'
			},
			main: {
				placeholder: '{{layout.main}}',
				text: '<!-- tabindex="-1" hack for skipnav link: https://code.google.com/p/chromium/issues/detail?id=37721 -->' + '<main class="tabindex" tabindex="-1" id="main"></main>'
			},
			footer1: {
				placeholder: '{{layout.footer1}}',
				text: '<div id="footer-content-1"></div>'
			},
			footer2: {
				placeholder: '{{layout.footer2}}',
				text: '<div id="footer-content-2"></div>'
			}
		},
		page: {
			content: {
				placeholder: '{{content.main}}',
				text: function () {
					return window.mashery.content.main;
				}
			}
		},
		docs: {
			content: {
				placeholder: '{{content.main}}',
				text: function () {
					return window.mashery.content.main;
				}
			},
			nav: {
				placeholder: '{{content.docsNav}}',
				text: function () {
					return window.mashery.content.secondary;
				}
			}
		},
		signin: {
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.signin.heading;
				}
			},
			subheading: {
				placeholder: '{{content.subheading}}',
				text: function () {
					return settings.labels.signin.subheading;
				}
			},
			form: {
				placeholder: '{{content.form}}',
				text: function () {
					return window.mashery.content.main;
				}
			},
			about: {
				placeholder: '{{content.about}}',
				text: function () {
					return settings.labels.signin.sidebar;
				}
			}
		},
		register: {
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.register.heading;
				}
			},
			subheading: {
				placeholder: '{{content.subheading}}',
				text: function () {
					return settings.labels.register.subheading;
				}
			},
			form: {
				placeholder: '{{content.form}}',
				text: function () {
					return window.mashery.content.main;
				}
			},
			terms: {
				placeholder: '{{content.terms}}',
				text: function () {
					var text =
						'<div id="registration-terms-of-service">' +
							'<p>By clicking the "Register" button, I certify that I have read and agree to {{content.privacyPolicy}}the <a href="http://www.mashery.com/terms/">Mashery Terms of Service</a> and <a href="http://www.mashery.com/privacy/">Privacy Policy</a>.</p>' +
						'</div>';
					return text;
				}
			},
			about: {
				placeholder: '{{content.about}}',
				text: function () {
					return settings.labels.register.sidebar;
				}
			},
			privacyPolicy: {
				placeholder: '{{content.privacyPolicy}}',
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
			headingAccountInfo: {
				placeholder: '{{label.headingAccountInfo}}',
				text: function () {
					return settings.labels.account.headingAccountInfo;
				}
			},
			headingChangeEmail: {
				placeholder: '{{label.headingChangeEmail}}',
				text: function () {
					return settings.labels.account.headingChangeEmail;
				}
			},
			headingChangePassword: {
				placeholder: '{{label.headingChangePassword}}',
				text: function () {
					return settings.labels.account.headingChangePassword;
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
			noApps : {
				placeholder: '{{label.noApps}}',
				text: function () {
					return settings.labels.account.noApps;
				}
			}
		},
		profile: {
			headingUserInfo: {
				placeholder: '{{label.headingUserInfo}}',
				text: function () {
					return settings.labels.profile.headingUserInfo;
				}
			},
			headingActivity: {
				placeholder: '{{label.headingActivity}}',
				text: function () {
					return settings.labels.profile.headingActivity;
				}
			},
			userWebsite: {
				placeholder: '{{label.userWebsite}}',
				text: function () {
					return settings.labels.profile.userWebsite;
				}
			},
			userBlog: {
				placeholder: '{{label.userBlog}}',
				text: function () {
					return settings.labels.profile.userBlog;
				}
			},
			userRegistered: {
				placeholder: '{{label.userRegistered}}',
				text: function () {
					return settings.labels.profile.userRegistered;
				}
			},
		},
		logout: {
			heading: {
				placeholder: '{{label.heading}}',
				text: function () {
					return settings.labels.logout.heading;
				}
			},
			main: {
				placeholder: '{{label.main}}',
				text: function () {
					return settings.labels.logout.main;
				}
			}
		},
		logoutFail: {
			heading: {
				placeholder: '{{label.heading}}',
				text: function () {
					return settings.labels.logoutFail.heading;
				}
			},
			main: {
				placeholder: '{{label.main}}',
				text: function () {
					return settings.labels.logoutFail.main;
				}
			}
		},
		memberRemove: {
			heading: {
				placeholder: '{{label.heading}}',
				text: function () {
					return settings.labels.memberRemove.heading;
				}
			},
			main: {
				placeholder: '{{label.main}}',
				text: function () {
					return settings.labels.memberRemove.main;
				}
			},
			confirm: {
				placeholder: '{{label.confirm}}',
				text: function () {
					return settings.labels.memberRemove.confirm;
				}
			},
			cancel: {
				placeholder: '{{label.cancel}}',
				text: function () {
					return settings.labels.memberRemove.cancel;
				}
			},
			popup: {
				placeholder: '{{label.popup}}',
				text: function () {
					return settings.labels.memberRemove.popup;
				}
			}
		},
		memberRemoveSuccess: {
			heading: {
				placeholder: '{{label.heading}}',
				text: function () {
					return settings.labels.memberRemoveSuccess.heading;
				}
			},
			main: {
				placeholder: '{{label.main}}',
				text: function () {
					return settings.labels.memberRemoveSuccess.main;
				}
			}
		},
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

	/**
	 * Simulate a click event.
	 * @public
	 * @param {Element} elem  the element to simulate a click on
	 */
	var simulateClick = function (elem) {
		// Create our event (with options)
		var evt = new MouseEvent('click', {
			bubbles: true,
			cancelable: true,
			view: window
		});
		// If cancelled, don't dispatch our event
		var canceled = !elem.dispatchEvent(evt);
	};

	var replacePlaceholders = function (template, local) {
		template = Object.prototype.toString.call(template) === '[object Function]' ? template() : template;
		if (local) {
			var tempLocal = /account/.test(local) ? 'account' : local;
			if (localPlaceholders[tempLocal]) {
				forEach(localPlaceholders[tempLocal], (function (placeholder) {
					if (!placeholder.placeholder || !placeholder.text) return;
					template = template.replace(new RegExp(placeholder.placeholder, 'g'), placeholder.text);
				}));
			}
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
				'<li id="nav-user-myaccount"><a href="{{path.keys}}">' + settings.labels.userNav.account + '</a></li>' +
				(mashery.isAdmin ? '<li><a href="{{path.dashboard}}">' + settings.labels.userNav.dashboard + '</a></li>' : '') +
				'<li id="nav-user-signout"><a href="{{path.logout}}">' + settings.labels.userNav.signout + '</a></li>';
		} else {
			template =
				'<li id="nav-user-signin"><a href="{{path.signin}}">' + settings.labels.userNav.signin + '</a></li>' +
				'<li id="nav-user-register"><a href="{{path.register}}">' + settings.labels.userNav.register + '</a></li>';
		}
		return replacePlaceholders(template);
	};

	var getAccountNavItems = function () {
		var template =
			'<li><a href="{{path.keys}}">' + settings.labels.account.keys + '</a></li>' +
			'<li><a href="{{path.apps}}">' + settings.labels.account.apps + '</a></li>' +
			'<li><a href="{{path.account}}">' + settings.labels.account.account + '</a></li>';
		return replacePlaceholders(template);
	};

	var getMasheryAccountNavItems = function () {
		var template =
			'<li><a href="{{path.changeEmail}}">' + settings.labels.account.changeEmail + '</a></li>' +
			'<li><a href="{{path.changePassword}}">' + settings.labels.account.changePassword + '</a></li>' +
			'<li><a href="{{path.viewProfile}}">' + settings.labels.account.viewProfile + '</a></li>' +
			'<li><a href="{{path.removeMembership}}">' + settings.labels.account.removeMembership + '</a></li>';
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
		if (['page','docs'].indexOf(window.mashery.contentType !== -1)) {
			var junk = document.querySelectorAll('#header-edit, #main .section .section-meta');
			junk.forEach((function (item) {
				item.remove();
			}))
		}
		if (after) {
			after();
		}
	};

	var verifyLoggedIn = function () {
		if (['logout', 'memberRemoveSuccess'].indexOf(window.mashery.contentType) === -1) return;
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

	exports.renderTitle = function () {
		document.title = replacePlaceholders(settings.labels.title, window.mashery.contentType);
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

	var renderHead = function (ajax) {

		if (ajax) return;

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
		if (!window.mashery.logout || document.querySelector('#mashery-logout-form')) return;
		document.body.insertBefore(window.mashery.logout, document.body.lastChild);
	};

	var renderMemberRemove = function () {
		if (window.mashery.contentType !== 'memberRemove' || document.querySelector('#member-remove-form')) return;
		var form = window.mashery.dom.querySelector('.main form');
		if (!form) return;
		form.id = 'member-remove-form';
		form.setAttribute('hidden', 'hidden');
		var submit = form.querySelector('#process');
		if (submit) {
			submit.setAttribute('onclick', 'return confirm("' + localPlaceholders.memberRemove.popup.text() + '")');
		}
		document.body.insertBefore(form, document.body.lastChild);
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

	exports.renderPortal = function (ajax) {
		settings.callbacks.beforeRender();
		renderHead(ajax); // <head> attributes
		exports.renderLayout(); // Layout
		exports.renderUserNav(); // User Navigation
		exports.renderPrimaryNav(); // Primary Navigation
		exports.renderSecondaryNav(); // Secondary Navigation
		exports.renderMain(); // Main Content
		exports.renderTitle(); // Page Title
		exports.renderContent('#footer-content-1', 'footer1'); // Footer Content 1
		exports.renderContent('#footer-content-2', 'footer2'); // Footer Content 2
		fixLocation(); // Jump to anchor
		renderLogout(); // Logout Form
		renderMemberRemove(); // Remove Member Form
		exports.renderMasheryMade(); // Add the Mashery Made logo if missing
		settings.callbacks.afterRender();
		document.documentElement.classList.remove('loading');
	};

	var processLogout = function (event) {
		var logout = document.querySelector('#mashery-logout-form');
		if (!logout) return;
		event.preventDefault();
		logout.submit();
	};

	var fetchContent = function (url, pushState) {
		atomic.ajax({
			url: url,
			responseType: 'document'
		}).success((function (data) {
			setupMashery(data);
			getContent(window.mashery.contentType);
			exports.renderPortal(true);
			if (pushState) {
				window.history.pushState({url:url}, data.title, url);
			}
		}));
	};

	var loadWithAjax = function (event) {

		// Make sure link should trigger an ajax event
		if (!settings.ajax || (settings.ajaxIgnore && event.target.matches(settings.ajaxIgnore))) return;
		if (event.target.tagName.toLowerCase() !== 'a' || !event.target.href || event.target.hostname !== window.location.hostname) return;
		if (window.mashery.contentType === '') return;
		if(event.target.pathname === window.location.pathname && event.target.hash.length > 0) return;

		// Don't run if right-click or command/control + click
		if (event.button !== 0 || event.metaKey || event.ctrlKey) return;

		// Prevent the default
		event.preventDefault();

		// Get the content
		fetchContent(event.target.href, true);

	};

	var processMemberRemove = function (event) {
		var remove = document.querySelector('#member-remove-form #process');
		if (!remove || window.mashery.contentType !== 'memberRemove') return;
		event.preventDefault();
		simulateClick(remove);
	};

	var clickListener = function (event) {

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

	var popstateHandler = function (event) {
		var url = event.state && event.state.url ? event.state.url : window.location.href;
		fetchContent(url);
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

			// Listen for click events
			document.addEventListener('click', clickListener, false);

			if (settings.ajax) {
				window.addEventListener('popstate', popstateHandler, false);
			}

		}));

	};


	//
	// Public APIs
	//

	return exports;

})();