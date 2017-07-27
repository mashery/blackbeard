/*!
 * blackbeard v0.0.1: Future portal layout
 * (c) 2017 Chris Ferdinandi
 * BSD-3-Clause License
 * http://github.com/mashery/blackbeard
 */

if (window.NodeList && !NodeList.prototype.forEach) {
	NodeList.prototype.forEach = function (callback, thisArg) {
		thisArg = thisArg || window;
		for (var i = 0; i < this.length; i++) {
			callback.call(thisArg, this[i], i, this);
		}
	};
}
if (!Object.prototype.forEach) {
	Object.defineProperties(Object.prototype, {
		'forEach': {
			value: function (callback) {
				if (this == null) {
					throw new TypeError('Not an object');
				}
				var obj = this;
				for (var key in obj) {
					if (obj.hasOwnProperty(key)) {
						callback.call(obj, obj[key], key, obj);
					}
				}
			},
			writable: true
		}
	});
}
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

	// type = register-confirm
	if (type === 'registerSent') {
		var email = dom.querySelector('#main p');
		content.main = email ? email.innerHTML.replace('We have sent a confirmation e-mail to you at this address: ', '') : null;
	}

	// type = resend-confirmation
	if (type === 'registerResend') {
		var form = dom.querySelector('#resend-confirmation');
		content.main = '<form action="' + form.getAttribute('action') + '" method="post" enctype="multipart/form-data" id="resend-confirmation">' + form.innerHTML + '</form>';
		content.main = content.main.replace('<legend>Resend your account confirmation email.</legend>', '');
	}

	// type = join
	if (type === 'join') {
		var form = dom.querySelector('#member-edit');
		content.main = '<form action="' + form.getAttribute('action') + '" method="post" enctype="multipart/form-data" id="member-edit">' + form.innerHTML + '</form>';
		content.main = content.main.replace('<legend>Additional Information</legend>', '');
	}

	// type = join-success
	if (type === 'joinSuccess') {
		var username = dom.querySelector('#main .section-body p');
		content.main = username ? username.innerHTML.replace('You have successfully registered as <strong>', '').replace('</strong>.', '').trim() : null;
	}

	// type = account-keys
	// @todo verify that there's only one app per key
	if (type === 'accountKeys') {

		// Get elements
		var keys = dom.querySelectorAll('.main .section-body h2, .main .section-body div.key');
		var getKeys = dom.querySelector('.action.new-key'); // @todo check if user can register at all based on this link

		if (keys.length > 0) {
			content.main = {};
			content.secondary = getKeys ? getKeys.getAttribute('href') : null;
			var currentPlan;

			keys.forEach((function (key, index) {
				if (key.tagName.toLowerCase() === 'h2') {
					currentPlan = key.innerHTML;
					content.main[key.innerHTML] = {
						name: key.innerHTML,
						keys: []
					};
				} else {
					var data = key.querySelectorAll('dd');
					var secret = data.length === 5 ? true : false;
					var created = secret ? data[4].querySelector('abbr') : data[3].querySelector('abbr');
					content.main[currentPlan].keys.push({
						application: data[0].innerHTML.trim(),
						key: data[1].innerHTML.trim(),
						secret: secret ? data[2].innerHTML.trim() : null,
						status: secret ? data[3].innerHTML.trim() : data[2].innerHTML.trim(),
						created: created ? created.getAttribute('title') : '',
						limits: '<table>' + key.querySelector('table.key').innerHTML + '<table>',
						report: key.querySelector('.key-actions.actions .view-report.action').getAttribute('href'),
						delete: key.querySelector('.key-actions.actions .delete.action').getAttribute('href')
					});
				}
			}));
		}

	}

	// type = account-apps
	// nav, create apps link, no apps message, app content/table
	if (type === 'accountApps') {

		// Get elements
		var apps = dom.querySelectorAll('.main .application');
		var createApps = dom.querySelector('.main .actions .add-app.action');

		// Set values
		content.main = [];
		content.secondary = createApps ? createApps.getAttribute('href') : null;
		apps.forEach((function(app) {
			var dataBasic = app.querySelectorAll('dd');
			var dataDetails = app.querySelectorAll('tbody td');
			content.main.push({
				application: app.querySelector('h3').innerHTML.trim(),
				created: dataBasic[1].querySelector('abbr').getAttribute('title'),
				api: dataDetails[0] ? dataDetails[0].innerHTML.trim() : null,
				key: dataDetails[1] ? dataDetails[1].innerHTML.trim() : null,
				edit: app.querySelector('.application-actions.actions .edit.action').getAttribute('href'),
				delete: app.querySelector('.application-actions.actions .delete-app.action').getAttribute('href')
			});
		}));

	}

	// type = app-register
	if (type === 'appRegister') {
		var form = dom.querySelector('#application-edit');
		var table = dom.querySelector('#main .section-body table');
		content.main = '<form action="' + form.getAttribute('action') + '" method="post" enctype="multipart/form-data" id="application-edit">' + form.innerHTML + '</form>';
		content.secondary = table ? '<table>' + table.innerHTML + '</table>' : null;
	};

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
		content.main = {
			name: dom.querySelector('h1.first').innerHTML.replace('View Member ', '').trim(),
			admin: admin ? admin.getAttribute('href') : null,
			blog: data[0] ? data[0].querySelector('a').getAttribute('href') : '',
			website: data[1] ? data[1].querySelector('a').getAttribute('href') : '',
			registered: data[2] ? data[2].querySelector('abbr').getAttribute('title') : '',
			activity: activity ? '<table>' + activity.innerHTML + '</table>' : null
		};
	}

	// type = ioDocs
	if (type === 'ioDocs') {
		var junk = dom.querySelectorAll('#main h1, #main .introText, #main .endpoint ul.actions, #apiTitle');
		var apiID = dom.querySelector('#apiId');
		junk.forEach((function (item) {
			item.remove();
		}));
		if (apiID) {
			var apiIDClone = apiID.cloneNode(true);
			apiID.style.width = '';
			apiID.parentNode.parentNode.insertBefore(apiID.cloneNode(true), apiID.parentNode);
			apiID.parentNode.remove();
		}
		content.main = dom.querySelector('#main').innerHTML;
	}

	// type = lost-password
	if (type === 'lostPassword') {
		var form = dom.querySelector('#lost form');
		content.main = '<form action="' + form.getAttribute('action') + '" method="post" enctype="multipart/form-data">' + form.innerHTML + '</form>';
		content.main = content.main.replace('<legend>Lost Password</legend>', '');
	}

	// type = lost-username
	if (type === 'lostUsername') {
		var form = dom.querySelector('#lost form');
		content.main = '<form action="' + form.getAttribute('action') + '" method="post" enctype="multipart/form-data">' + form.innerHTML + '</form>';
		content.main = content.main.replace('<legend>E-mail yourself your username</legend>', '');
	}

	// type = search
	if (type === 'search') {
		if (dom.querySelector('.no-result')) {
			content.main = null;
			content.secondary = {
				first: 0,
				last: 0,
				total: 0,
				query: dom.querySelector('.no-result b').innerHTML.trim()
			}
		} else {
			var results = dom.querySelectorAll('.section-body .result');
			var meta = dom.querySelectorAll('.result-info b');
			var paging = dom.querySelectorAll('.result-paging a');
			content.main = [];

			results.forEach((function (result) {
				var link = result.querySelector('a');
				content.main.push({
					url: link.getAttribute('href'),
					title: link.innerHTML.trim(),
					summary: result.querySelector('.result-summary').innerHTML.replace('<strong>', '<span class="search-term">').replace('</strong>', '</span>').trim()
				});
			}));

			content.secondary = {
				first: meta[0].innerHTML,
				last: meta[1].innerHTML,
				total: meta[2].innerHTML,
				query: meta[3].innerHTML,
				pagePrevious: null,
				pageNext: null
			};

			paging.forEach((function (link) {
				if (/Previous/.test(link.innerHTML)) {
					content.secondary.pagePrevious = link.getAttribute('href');
				} else {
					content.secondary.pageNext = link.getAttribute('href');
				}
			}));
		}
	}

	// type = contact
	if (type === 'contact') {
		var form = dom.querySelector('#main form');
		content.main = '<form action="' + form.getAttribute('action') + '" method="post" enctype="multipart/form-data">' + form.innerHTML + '</form>';
	}

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
		} else if (elem.classList.contains('register')) {
			if (elem.querySelector('#application-edit')) {
				type = 'appRegister';
			} else {
				type = 'appRegisterSuccess';
			}
		}
	} else if (elem.classList.contains('page-member')) {
		if (elem.classList.contains('email')) {
			type = 'accountEmail';
		} else if (elem.classList.contains('passwd')) {
			type = 'accountPassword';
		} else if (elem.classList.contains('register')) {
			if (/Registration Almost Complete/.test(elem.querySelector('h1.first').innerHTML)) {
				type = 'registerSent';
			} else {
				type = 'register';
			}
		} else if (elem.classList.contains('resend-confirmation')) {
			if (elem.querySelector('ul.success')) {
				type = 'registerResendSuccess';
			} else {
				type = 'registerResend';
			}
		} else if (elem.classList.contains('remove')) {
			if (/You have been removed!/.test(elem.querySelector('.main .section-body').innerHTML)) {
				type = 'memberRemoveSuccess';
			} else {
				type = 'memberRemove';
			}
		} else if (elem.classList.contains('lost')) {
			if (/E-mail Sent/.test(elem.querySelector('h2').innerHTML)) {
				type = 'lostPasswordReset';
			} else {
				type = 'lostPassword';
			}
		} else if (elem.classList.contains('lost-username')) {
			if (/E-mail Sent/.test(elem.querySelector('h2').innerHTML)) {
				type = 'lostUsernameReset';
			} else {
				type = 'lostUsername';
			}
		} else if (elem.classList.contains('join') || elem.classList.contains('confirm')) {
			if (/Registration Successful/.test(elem.querySelector('h1.first').innerHTML)) {
				type = 'joinSuccess';
			} else {
				type = 'join';
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
		if (elem.querySelector('#main form')) {
			type = 'contact';
		} else {
			type = 'contactSuccess';
		}
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
	window.mashery.loggedIn = dom.querySelector('#mashery-logout-form') ? true : false;
	window.mashery.username = window.mashery.loggedIn && typeof mashery_info !== 'undefined' && mashery_info && mashery_info.username ? mashery_info.username : null;
	window.mashery.userProfile = sessionStorage.getItem('masheryUserProfile');
	window.mashery.isAdmin = dom.querySelector('#user-nav .dashboard.toggle') ? true : false;
	window.mashery.area = dom.querySelector('#branding-logo').innerHTML.trim();
	window.mashery.dashboard = dashboard ? dashboard : null;
	window.mashery.logout = logout ? logout : null;
	window.mashery.contentType = getContentType(doc.body);
	window.mashery.contentId = null;
	window.mashery.content = {
		main: null,
		secondary: null
	};

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
removeCSS('localdev.css'); // Remove localdev specific CSS. Do not use on production sites.
removeCSS('Mashery-base.css'); // Remove the base Mashery CSS
removeCSS('mashery-blue.css'); // Remove the base Mashery CSS
removeCSS('print-defaults.css'); // Remove the default print CSS

// If the IODocs page, also remove IODocs specific CSS
if ( mashery.contentType === 'ioDocs') {
	removeCSS('Iodocs/style.css');
	removeCSS('alpaca.min.css');
}

// Get the content
getContent(window.mashery.contentType);
var loadPortal = (function () {

	'use strict';

	//
	// Variables
	//

	var exports = {}; // Placeholder for public methods
	var ajaxIgnore = '.clear-results, h4 .select-all, #toggleEndpoints, #toggleMethods'; // Ignore on Ajax page load
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
									'<li>{{content.searchForm}}</li>' +
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
							'<div class="grid-third"><h2>In the Docs</h2><ul>{{content.secondary}}</ul></div>' +
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
			registerSent:	'<div class="container container-small">' +
									'<h1>{{content.heading}}</h1>' +
									'<p>We have sent a confirmation email to you at {{content.main}}.</p>' +
									'<p>Please click on the link in that e-mail to confirm your account. If you do not receive an email within the next hour, <a href="{{path.registerResendConfirmation}}">click here to resend confirmation email</a>.</p>' +
								'</div>',
			registerResend:	'<div class="container container-small">' +
								'<h1>{{content.heading}}</h1>' +
								'<p>{{content.subheading}}</p>' +
								'{{content.main}}' +
							'</div>',
			registerResendSuccess: '<div class="container container-small">' +
									'<h1>{{content.heading}}</h1>' +
									'{{content.main}}' +
								'</div>',
			join:	'<div class="container container-small">' +
						'<h1>{{content.heading}}</h1>' +
						'<p>{{content.subheading}}</p>' +
						'{{content.main}}' +
						'{{content.terms}}' +
					'</div>',
			joinSuccess:	'<div class="container container-small">' +
								'<h1>{{content.heading}}</h1>' +
								'<p>You have successfully registered as {{content.main}}. Read our <a href="/docs">API documentation</a> to get started. You can view your keys and applications under <a href="{{path.keys}}">My Account</a>.</p>' +
							'</div>',
			accountKeys: function () {
				var template = 	'<h1>{{content.headingMyApiKeys}}</h1><ul id="nav-account">{{content.navItemsAccount}}</ul>';
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
									'<p><a class="btn" href="' + key.delete + '">Delete This Key</a></p>';
							}));
						} else {
							template += '<p>{{content.noPlanKeys}}</p>';
							if (mashery.content.secondary) {
								template += '<p><a class="btn" href="' + mashery.content.secondary + '">Get a Key for ' + plan.name + '</a></p>';
							}
						}
					}));
				} else {
					template += '{{content.noKeys}}';
					if (mashery.content.secondary) {
						template += '<p><a class="btn" href="' + mashery.content.secondary + '">Get API Keys</a></p>';
					}
				}
				return '<div class="container container-small">' + template + '</div>';
			},
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
								'<a class="btn" href="' + app.edit + '">Edit This App</a>' +
								'<a class="btn" href="' + app.delete + '">Delete This App</a>' +
							'</p>';
					}));
				} else {
					template += '{{content.noApps}}';
				}
				if (mashery.content.secondary) {
					template += '<p><a class="btn" href="' + window.mashery.content.secondary + '">Create a New App</a></p>';
				}
				return '<div class="container container-small">' + template + '</div>';
			},
			accountManage:	'<div class="container container-small">' +
								'<h1>{{content.headingAccount}}</h1>' +
								'<ul id="nav-account">{{content.navItemsAccount}}</ul>' +
								'<ul id="nav-mashery-account">{{content.navItemsMasheryAccount}}</ul>' +
								'<h2>{{content.headingAccountInfo}}</h2>' +
								'{{content.main}}' +
							'</div>',
			accountEmail:	'<div class="container container-small">' +
								'<h1>{{content.headingChangeEmail}}</h1>' +
								'<ul id="nav-account">{{content.navItemsAccount}}</ul>' +
								'<ul id="nav-mashery-account">{{content.navItemsMasheryAccount}}</ul>' +
								'{{content.main}}' +
							'</div>',
			accountPassword:	'<div class="container container-small">' +
									'<h1>{{content.headingChangePassword}}</h1>' +
									'<ul id="nav-account">{{content.navItemsAccount}}</ul>' +
									'<ul id="nav-mashery-account">{{content.navItemsMasheryAccount}}</ul>' +
									'{{content.main}}' +
								'</div>',
			profile: function () {
				// @todo convert these strings into context-specific placeholders
				var template = '<h1>' + window.mashery.content.main.name + '</h1>';
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
				return '<div class="container">' + template + '</div>';
			},
			logout:	'<div class="container container-small">' +
						'<h1>{{content.heading}}</h1>' +
						'<p>{{content.main}}</p>' +
					'</div>',
			logoutFail:	'<div class="container container-small">' +
							'<h1>{{content.heading}}</h1>' +
							'<p>{{content.main}}</p>' +
						'</div>',
			memberRemove:	'<div class="container container-small">' +
								'<h1>{{content.heading}}</h1>' +
								'<p>{{content.main}}</p>' +
								'<p>' +
									'<a class="btn" href="{{path.removeMember}}">{{content.confirm}}</a>' +
									'<a class="btn" href="{{path.account}}">{{content.cancel}}</a>' +
								'</p>' +
							'</div>',
			memberRemoveSuccess:	'<div class="container container-small">' +
										'<h1>{{content.heading}}</h1>' +
										'<p>{{content.main}}</p>' +
									'</div>',
			ioDocs:	'<div class="container container-small">' +
						'<h1>{{content.heading}}</h1>' +
						'<p>{{content.subheading}}</p>' +
						'{{content.main}}' +
					'</div>',
			lostPassword:	'<div class="container container-small">' +
								'<h1>{{content.heading}}</h1>' +
								'<p>{{content.subheading}}</p>' +
								'{{content.main}}' +
							'</div>',
			lostPasswordReset:	'<div class="container container-small">' +
									'<h1>{{content.heading}}</h1>' +
									'<p>{{content.main}}</p>' +
								'</div>',
			lostUsername:	'<div class="container container-small">' +
								'<h1>{{content.heading}}</h1>' +
								'<p>{{content.subheading}}</p>' +
								'{{content.main}}' +
							'</div>',
			lostUsernameReset:	'<div class="container container-small">' +
									'<h1>{{content.heading}}</h1>' +
									'<p>{{content.main}}</p>' +
								'</div>',
			search:	function () {
				var template = '<div class="container container-small"><h1>{{content.heading}}</h1>';
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
				template += '</div>';
				return template;
			},
			contact:	'<div class="container container-small">' +
							'<h1>{{content.heading}}</h1>' +
							'<p>{{content.subheading}}</p>' +
							'{{content.main}}' +
						'</div>',
			contactSuccess:	'<div class="container container-small">' +
								'<h1>{{content.heading}}</h1>' +
								'<p>{{content.main}}</p>' +
							'</div>',
			appRegister:	'<div class="container container-small">' +
									'<h1>{{content.heading}}</h1>' +
									'<p>{{content.subheading}}</p>' +
									'{{content.main}}' +
								'</div>',
			appRegisterSuccess:	'<div class="container container-small">' +
									'<h1>{{content.heading}}</h1>' +
									'{{content.main}}' +
								'</div>',
			forumAll: '<div class="container"><p>The forum content needs to get created.</p></div>',
			blogAll: '<div class="container"><p>Blog content needs to get created.</p></div>',
			blogSingle: '<div class="container"><p>Blog content needs to get created.</p></div>',
			404: '<div class="container"><p>404 page content needs to get created.</p></div>'
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
				removeMembership: 'Remove Membership from {{mashery.area}}',
				noKeys: 'You don\'t have any keys yet.',
				noPlanKeys: 'You have not been issued keys for this API.',
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

			registerSent: {
				heading: 'Registration Almost Complete'
			},

			registerResend: {
				heading: 'Resend Your Confirmation Email',
				subheading: 'Enter your username and email address to have your registration confirmation email resent to you.'
			},

			registerResendSuccess: {
				heading: 'Success',
				main: 'Your confirmation email was resent.'
			},

			join: {
				heading: 'Join {{mashery.area}}',
				subheading: 'Since you already have a Mashery account you don\'t have to register again, but we would like to know a little more about you. Please fill out the additional information below.'
			},

			joinSuccess: {
				heading: 'Registration Successful'
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
				heading: 'Remove membership from {{mashery.area}}',
				main: 'Removing membership disables your account and you will not be able to register again using the same username. All your keys will be deactivated.',
				confirm: 'Remove Membership',
				cancel: 'Cancel',
				popup: 'Please confirm that you wish to permanently disable your membership with this service.'
			},

			memberRemoveSuccess: {
				heading: 'Your account has been removed.',
				main: 'Enjoy the rest of your day!'
			},

			ioDocs: {
				heading: 'Interactive API',
				subheading: 'Test our API services with IO-Docs, our interactive API documentation.'
			},

			lostPassword: {
				heading: 'Recover Your Password',
				subheading: 'Enter the email address and username that you registered with and we will send you a link to reset your password.'
			},

			lostPasswordReset: {
				heading: 'Email Sent',
				main: 'An email has been sent to the address you provided. Click on the link in the e-mail to reset your password. Please check your spam folder if you don\'t see it in your inbox.'
			},

			lostUsername: {
				heading: 'Recover Your Username',
				subheading: 'Enter the email address you used to register and we will send you an email with your username.'
			},

			lostUsernameReset: {
				heading: 'Email Sent',
				main: 'An email has been sent containing your username details. Please check your spam folder if you don\'t see it in your inbox.'
			},

			search: {
				heading: 'Search Results for "{{content.query}}"',
				placeholder: 'Search...',
				button: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><title>Search</title><path d="M31.008 27.231l-7.58-6.447c-.784-.705-1.622-1.029-2.299-.998a11.954 11.954 0 0 0 2.87-7.787c0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12c2.972 0 5.691-1.081 7.787-2.87-.031.677.293 1.515.998 2.299l6.447 7.58c1.104 1.226 2.907 1.33 4.007.23s.997-2.903-.23-4.007zM12 20a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"/></svg>',
				meta: 'Showing {{content.first}} to {{content.last}} of {{content.total}} results for "{{content.query}}"',
				noResults: 'Your search for "{{content.query}}" returned no results.',
				pagePrevious: '&larr; Previous Page',
				pageNext: 'Next Page &rarr;',
				pageDivider: ' | '
			},

			contact: {
				heading: 'Contact Us',
				subheading: 'Contact us using the form below.'
			},

			contactSuccess: {
				heading: 'Thanks for your submission!',
				main: 'Your message will be forwarded to the appropriate group.'
			},

			appRegister: {
				heading: 'Register an Application',
				subheading: 'Get a key and register your application using the form below to start working with our APIs.'
			},

			appRegisterSuccess: {
				heading: 'Your application was registered!',
				main: '<p>An email has been sent to you with your key and application details. You can also view them at any time from the <a href="{{path.keys}}">My Account</a> page.</p><p>To get started using your API keys, dig into <a href="{{path.docs}}">our documentation</a>. We look forward to seeing what you create!</p>',
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
		registerResendConfirmation: {
			placeholder: '{{path.registerResendConfirmation}}',
			url: '/member/resend-confirmation'
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
			url: function () {
				return (window.mashery.userProfile ? window.mashery.userProfile : '/profile/profile');
			}
		},
		removeMembership: {
			placeholder: '{{path.removeMembership}}',
			url: '/member/remove'
		},
		memberRemove: {
			placeholder: '{{path.removeMember}}',
			url: '/member/remove?action=removeMember'
		},
		dashboard: {
			placeholder: '{{path.dashboard}}',
			url: function () {
				return (window.mashery.dashboard ? window.mashery.dashboard : '#')
			}
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
		lostPassword: {
			placeholder: '{{path.lostPassword}}',
			url: '/member/lost'
		},
		lostUsername: {
			placeholder: '{{path.lostUsername}}',
			url: '/member/lost-username'
		},
		search: {
			placeholder: '{{path.search}}',
			url: '/search'
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
			about: {
				placeholder: '{{content.about}}',
				text: function () {
					return settings.labels.register.sidebar;
				}
			},
		},
		registerSent: {
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.registerSent.heading;
				}
			}
		},
		registerResend: {
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.registerResend.heading;
				}
			},
			subheading: {
				placeholder: '{{content.subheading}}',
				text: function () {
					return settings.labels.registerResend.subheading;
				}
			}
		},
		registerResendSuccess: {
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.registerResendSuccess.heading;
				}
			},
			main: {
				placeholder: '{{content.main}}',
				text: function () {
					return settings.labels.registerResendSuccess.main;
				}
			}
		},
		join: {
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.join.heading;
				}
			},
			subheading: {
				placeholder: '{{content.subheading}}',
				text: function () {
					return settings.labels.join.subheading;
				}
			}
		},
		joinSuccess: {
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.joinSuccess.heading;
				}
			}
		},
		account: {
			headingMyApiKeys: {
				placeholder: '{{content.headingMyApiKeys}}',
				text: function () {
					return settings.labels.account.headingMyApiKeys;
				}
			},
			headingMyApps: {
				placeholder: '{{content.headingMyApps}}',
				text: function () {
					return settings.labels.account.headingMyApps;
				}
			},
			headingAccount: {
				placeholder: '{{content.headingAccount}}',
				text: function () {
					return settings.labels.account.headingAccount;
				}
			},
			headingAccountInfo: {
				placeholder: '{{content.headingAccountInfo}}',
				text: function () {
					return settings.labels.account.headingAccountInfo;
				}
			},
			headingChangeEmail: {
				placeholder: '{{content.headingChangeEmail}}',
				text: function () {
					return settings.labels.account.headingChangeEmail;
				}
			},
			headingChangePassword: {
				placeholder: '{{content.headingChangePassword}}',
				text: function () {
					return settings.labels.account.headingChangePassword;
				}
			},
			keys: {
				placeholder: '{{content.keys}}',
				text: function () {
					return settings.labels.account.keys;
				}
			},
			apps: {
				placeholder: '{{content.apps}}',
				text: function () {
					return settings.labels.account.apps;
				}
			},
			account: {
				placeholder: '{{content.account}}',
				text: function () {
					return settings.labels.account.account;
				}
			},
			noKeys: {
				placeholder: '{{content.noKeys}}',
				text: function () {
					return settings.labels.account.noKeys;
				}
			},
			noPlanKeys: {
				placeholder: '{{content.noPlanKeys}}',
				text: function () {
					return settings.labels.account.noPlanKeys;
				}
			},
			noApps: {
				placeholder: '{{content.noApps}}',
				text: function () {
					return settings.labels.account.noApps;
				}
			}
		},
		profile: {
			headingUserInfo: {
				placeholder: '{{content.headingUserInfo}}',
				text: function () {
					return settings.labels.profile.headingUserInfo;
				}
			},
			headingActivity: {
				placeholder: '{{content.headingActivity}}',
				text: function () {
					return settings.labels.profile.headingActivity;
				}
			},
			userWebsite: {
				placeholder: '{{content.userWebsite}}',
				text: function () {
					return settings.labels.profile.userWebsite;
				}
			},
			userBlog: {
				placeholder: '{{content.userBlog}}',
				text: function () {
					return settings.labels.profile.userBlog;
				}
			},
			userRegistered: {
				placeholder: '{{content.userRegistered}}',
				text: function () {
					return settings.labels.profile.userRegistered;
				}
			},
		},
		logout: {
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.logout.heading;
				}
			},
			main: {
				placeholder: '{{content.main}}',
				text: function () {
					return settings.labels.logout.main;
				}
			}
		},
		logoutFail: {
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.logoutFail.heading;
				}
			},
			main: {
				placeholder: '{{content.main}}',
				text: function () {
					return settings.labels.logoutFail.main;
				}
			}
		},
		memberRemove: {
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.memberRemove.heading;
				}
			},
			main: {
				placeholder: '{{content.main}}',
				text: function () {
					return settings.labels.memberRemove.main;
				}
			},
			confirm: {
				placeholder: '{{content.confirm}}',
				text: function () {
					return settings.labels.memberRemove.confirm;
				}
			},
			cancel: {
				placeholder: '{{content.cancel}}',
				text: function () {
					return settings.labels.memberRemove.cancel;
				}
			},
			popup: {
				placeholder: '{{content.popup}}',
				text: function () {
					return settings.labels.memberRemove.popup;
				}
			}
		},
		memberRemoveSuccess: {
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.memberRemoveSuccess.heading;
				}
			},
			main: {
				placeholder: '{{content.main}}',
				text: function () {
					return settings.labels.memberRemoveSuccess.main;
				}
			}
		},
		ioDocs: {
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.ioDocs.heading;
				}
			},
			subheading: {
				placeholder: '{{content.subheading}}',
				text: function () {
					return settings.labels.ioDocs.subheading;
				}
			}
		},
		lostPassword: {
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.lostPassword.heading;
				}
			},
			subheading: {
				placeholder: '{{content.subheading}}',
				text: function () {
					return settings.labels.lostPassword.subheading;
				}
			}
		},
		lostPasswordReset: {
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.lostPasswordReset.heading;
				}
			},
			main: {
				placeholder: '{{content.main}}',
				text: function () {
					return settings.labels.lostPasswordReset.main;
				}
			}
		},
		lostUsername: {
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.lostUsername.heading;
				}
			},
			subheading: {
				placeholder: '{{content.subheading}}',
				text: function () {
					return settings.labels.lostUsername.subheading;
				}
			}
		},
		lostUsernameReset: {
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.lostUsernameReset.heading;
				}
			},
			main: {
				placeholder: '{{content.main}}',
				text: function () {
					return settings.labels.lostUsernameReset.main;
				}
			}
		},
		search: {
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.search.heading;
				}
			},
			meta: {
				placeholder: '{{content.meta}}',
				text: function () {
					return settings.labels.search.meta;
				}
			},
			noResults: {
				placeholder: '{{content.noResults}}',
				text: function () {
					return settings.labels.search.noResults;
				}
			},
			query: {
				placeholder: '{{content.query}}',
				text: function () {
					return window.mashery.content.secondary.query;
				}
			},
			first: {
				placeholder: '{{content.first}}',
				text: function () {
					return window.mashery.content.secondary.first;
				}
			},
			last: {
				placeholder: '{{content.last}}',
				text: function () {
					return window.mashery.content.secondary.last;
				}
			},
			total: {
				placeholder: '{{content.total}}',
				text: function () {
					return window.mashery.content.secondary.total;
				}
			},
			pagePrevious: {
				placeholder: '{{content.pagePrevious}}',
				text: function () {
					return settings.labels.search.pagePrevious;
				}
			},
			pageNext: {
				placeholder: '{{content.pageNext}}',
				text: function () {
					return settings.labels.search.pageNext;
				}
			},
			pageDivider: {
				placeholder: '{{content.pageDivider}}',
				text: function () {
					return settings.labels.search.pageDivider;
				}
			}
		},
		contact: {
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.contact.heading;
				}
			},
			subheading: {
				placeholder: '{{content.subheading}}',
				text: function () {
					return settings.labels.contact.subheading;
				}
			}
		},
		contactSuccess: {
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.contactSuccess.heading;
				}
			},
			main: {
				placeholder: '{{content.main}}',
				text: function () {
					return settings.labels.contactSuccess.main;
				}
			}
		},
		appRegister: {
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.appRegister.heading;
				}
			},
			subheading: {
				placeholder: '{{content.subheading}}',
				text: function () {
					return settings.labels.appRegister.subheading;
				}
			}
		},
		appRegisterSuccess: {
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.appRegisterSuccess.heading;
				}
			},
			main: {
				placeholder: '{{content.main}}',
				text: function () {
					return settings.labels.appRegisterSuccess.main;
				}
			}
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
		contentMain: {
			placeholder: '{{content.main}}',
			text: function () {
				return window.mashery.content.main;
			}
		},
		contentSecondary: {
			placeholder: '{{content.secondary}}',
			text: function () {
				return window.mashery.content.secondary;
			}
		},
		searchForm: {
			placeholder: '{{content.searchForm}}',
			text: function () {
				var template =
					'<form id="search-form" class="search-form" method="get" action="/search">' +
						'<input id="search-input" class="search-input" type="text" value="" placeholder="' + settings.labels.search.placeholder + '" name="q">' +
						'<button id="search-button" type="submit">' + settings.labels.search.button + '</button>' +
					'</form>';
				return template;
			}
		},
		registerPolicy: {
			placeholder: '{{content.registerPolicy}}',
			text: function () {
				return settings.labels.register.privacyPolicy;
			}
		},
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
		privacyPolicy: {
			placeholder: '{{content.privacyPolicy}}',
			text: function () {
				return settings.labels.register.privacyPolicy;
			}
		},
		masheryMade: {
			placeholder: '{{content.masheryMade}}',
			text: '<a id="mashery-made-logo" href="http://mashery.com"><img src="https://support.mashery.com/public/Mashery/images/masherymade.png"></a>'
		}
	};


	//
	// Methods
	//

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

	// var addQueryString = function (url, key, value) {
	// 	return (/[\?]/.test(url) ? '&' : '?') + key + '=' + value;
	// };

	var replacePlaceholders = function (template, local) {
		template = Object.prototype.toString.call(template) === '[object Function]' ? template() : template;
		if (local) {
			var tempLocal = /account/.test(local) ? 'account' : local;
			if (localPlaceholders[tempLocal]) {
				localPlaceholders[tempLocal].forEach((function (placeholder) {
					if(!placeholder.placeholder || !placeholder.text) return;
					template = template.replace(new RegExp(placeholder.placeholder, 'g'), placeholder.text);
				}));
			}
		}
		paths.forEach((function (path) {
			if (!path.placeholder || !path.url) return;
			template = template.replace(new RegExp(path.placeholder, 'g'), path.url);
		}));
		globalPlaceholders.forEach((function (placeholder) {
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
		items.forEach((function (item) {
			template += '<li><a href="' + decodeURIComponent(item.url) + '">' + item.label + '</a></li>';
		}));
		return template;
	};

	var inject = function (type, atts) {
		var ref = window.document.getElementsByTagName('script')[0];
		var elem = document.createElement(type);
		atts.forEach((function (value, key) {
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

	// Regex pattern: http://stackoverflow.com/a/9635698/1293256
	var sanitizeClass = function (id, prefix) {
		if (!id) return '';
		prefix = prefix ? prefix + '-' : '';
		return prefix + id.replace(/^[^a-z]+|[^\w:.-]+/gi, '-').toLowerCase();
	};

	exports.addStyleHooks = function () {
		var wrapper = document.querySelector('#app-wrapper');
		if (!wrapper) return;
		var path = ['/', '/home'].indexOf(window.location.pathname.toLowerCase()) === -1 ? window.location.pathname.slice(1) : 'home';
		wrapper.className = sanitizeClass(window.mashery.contentType, 'category') + ' ' + sanitizeClass(path, 'single');
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

	var loadIODocsScripts = function (callback) {
		loadJS('/public/Mashery/scripts/Iodocs/prettify.js', (function () {
			loadJS('/public/Mashery/scripts/Mashery/beautify.js', (function () {
				loadJS('/public/Mashery/scripts/vendor/alpaca.min.js', (function () {
					loadJS('/public/Mashery/scripts/Iodocs/utilities.js', (function () {
						loadJS('/public/Mashery/scripts/Iodocs/iodocs.js', (function () {
							loadJS('/public/Mashery/scripts/Mashery/ace/ace.js');
						}), true);
					}), true);
				}), true);
			}), true);
		}), true);
	}

	var loadRequiredFiles = function () {
		if (window.mashery.contentType === 'ioDocs') {
			// window.prettyPrint = function () {};
			if (!('jQuery' in window)) {
				loadJS('https://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js', loadIODocsScripts);
			} else {
				loadIODocsScripts();
			}
		}
	};

	exports.renderMain = function () {
		loadRequiredFiles();
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

		// inject('link', {
		// 	rel: 'shortcut icon',
		// 	href: '/files/favicon.ico'
		// });

		// inject('link', {
		// 	rel: 'icon',
		// 	sizes: '16x16 32x32',
		// 	href: '/files/favicon.icon'
		// });

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

	var reloadIODocs = function () {
		if (window.mashery.contentType !== 'ioDocs' || window.mashery.isAjax || window.masheryIsReloaded) return;
		window.masheryIsReloaded = true;
		fetchContent(window.location.href, true);
	}

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
		exports.addStyleHooks(); // Content-specific classes
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
		reloadIODocs();
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
			if (pushState) {
				window.history.pushState({url:url}, data.title, url);
			}
			exports.renderPortal(true);
			window.mashery.isAjax = true;
		})).error((function () {
			window.location = url;
		}));
	};

	var loadWithAjax = function (event) {

		// Make sure link should trigger an ajax event
		if (!settings.ajax || (settings.ajaxIgnore && event.target.matches(settings.ajaxIgnore)) || event.target.closest(ajaxIgnore)) return;
		if (event.target.tagName.toLowerCase() !== 'a' || !event.target.href || event.target.hostname !== window.location.hostname) return;
		if (window.mashery.contentType === 'memberRemoveSuccess') return;
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

	var popstateHandler = function (event) {
		var url = event.state && event.state.url ? event.state.url : window.location.href;
		fetchContent(url);
	};

	var submitHandler = function (event) {
		if (!event.target.closest('#search-form')) return;
		var input = event.target.querySelector('#search-input');
		if (!input) return;
		event.preventDefault();
		fetchContent(paths.search.url + '?q=' + encodeURIComponent(input.value), true);
	};

	/**
	* Initialize
	* @public
	* @param {object} options User options and overrides
	*/
	exports.init = function (options) {

		loadJS('https://cdn.polyfill.io/v2/polyfill.min.js?features=default', (function () {

			// Merge user options with defaults
			settings = extend( defaults, options || {} );

			// Render the Portal
			exports.renderPortal();

			// Listen for click events
			document.addEventListener('click', clickHandler, false);

			if (settings.ajax) {
				window.addEventListener('popstate', popstateHandler, false);
				window.addEventListener('submit', submitHandler, false);
			}

		}));

	};


	//
	// Public APIs
	//

	return exports;

})();