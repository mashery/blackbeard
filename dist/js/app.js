/*!
 * blackbeard v0.2.0: Future portal layout
 * (c) 2017 Chris Ferdinandi
 * BSD-3-Clause License
 * http://github.com/mashery/blackbeard
 */

/**
 * NodeList.prototype.forEach() polyfill
 * https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach#Polyfill
 */
if (window.NodeList && !NodeList.prototype.forEach) {
	NodeList.prototype.forEach = function (callback, thisArg) {
		thisArg = thisArg || window;
		for (var i = 0; i < this.length; i++) {
			callback.call(thisArg, this[i], i, this);
		}
	};
}
/**
 * Object.prototype.forEach() polyfill
 */
if (!Object.prototype.forEach) {
	Object.defineProperties(Object.prototype, {
		'forEach': {
			value: function (callback) {
				if (this === null) {
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
/**
 * Test the strength of user passwords
 */
var masheryMashtips = (function () {

	'use strict';

	// Variables
	var exports = {};
	var mashtips;

	var showMashtip = function (mashtip) {
		var info = mashtip.querySelector('.mashtip-info');
		if (!info) return;
		info.classList.toggle('active');
	};

	var hideMashtips = function () {
		var activeTips = document.querySelectorAll('.mashtip-info.active');
		activeTips.forEach((function (mashtip) {
			mashtip.classList.remove('active');
		}));
	};

	var clickHandler = function (event) {
		if (event.target.closest('.mashtip')) {
			showMashtip(event.target);
		} else {
			hideMashtips();
		}
	};

	var convertMashtips = function () {
		mashtips = document.querySelectorAll('.mashtip');
		mashtips.forEach((function (mashtip) {
			mashtip.innerHTML += '<span class="mashtip-info">' + mashtip.getAttribute('title') + '</span>';
			mashtip.setAttribute('role', 'button');
		}));
	};

	var revertMaships = function () {
		var mashtipInfo = document.querySelectorAll('.mashtip-info');
		mashtipInfo.forEach((function (info) {
			info.remove();
		}));
	};

	exports.destroy = function () {
		revertMaships();
		document.removeEventListener('click', clickHandler, false);
		mashtips = null;
	};

	exports.init = function () {
		convertMashtips();
		document.addEventListener('click', clickHandler, false);
	};

	return exports;

})();
/**
 * Test the strength of user passwords
 */
var masheryTestPassword = (function () {

	'use strict';

	// Variables
	var exports = {};
	var pwNew = '#passwd_new';
	var pwConfirm = '#passwd_again';
	var valid = 'valid';
	var requirements;

	var hasLetters = function (password) {

		if (!requirements[0]) return;

		// If passes
		if (/[A-Za-z]/.test(password.value)) {
			requirements[0].classList.add(valid);
			return true;
		}

		// If fails
		requirements[0].classList.remove(valid);
		return false;

	};

	var hasNumbers = function (password) {

		if (!requirements[1]) return;

		// If passes
		if (/[0-9]/.test(password.value)) {
			requirements[1].classList.add(valid);
			return true;
		}

		// If fails
		requirements[1].classList.remove(valid);
		return false;

	};

	var isLongEnough = function (password) {

		if (!requirements[2]) return;

		// If passes
		if (password.value.length > 7) {
			requirements[2].classList.add(valid);
			return true;
		}

		// If fails
		requirements[2].classList.remove(valid);
		return false;

	};

	var testPassword = function (password) {

		// Run tests
		var letters = hasLetters(password);
		var numbers = hasNumbers(password);
		var long = isLongEnough(password);

		// Adjust class
		if (letters && numbers && long) {
			password.classList.add(valid);
		} else {
			password.classList.remove(valid);
		}

	};

	var confirmPassword = function (newPW, confirmPW) {

		if (!newPW || !confirmPW) return;

		if (newPW.value === confirmPW.value) {
			// If they match
			confirmPW.classList.add('valid');
		} else {
			// If they don't
			confirmPW.classList.remove('valid');
		}

	};

	var startTests = function (event) {

		var newPW = document.querySelector(pwNew);
		var confirmPW = document.querySelector(pwConfirm);

		// If password field
		if (event.target.closest(pwNew)) {
			testPassword(event.target);
			confirmPassword(newPW, confirmPW);
			return;
		}

		// If password confirm field
		if (event.target.closest(pwConfirm)) {
			confirmPassword(newPW, confirmPW);
		}

	};

	exports.destroy = function () {
		var valid = document.querySelectorAll('#passwd_requirements .' + valid + ', ' + pwNew + ', ' + pwConfirm);
		valid.forEach((function (field) {
			field.classList.remove(valid);
		}));
		document.removeEventListener('input', startTests, false);
		requirements = null;
	};

	exports.init = function () {
		requirements = document.querySelectorAll('#passwd_requirements li');
		document.addEventListener('input', startTests, false);
	};

	return exports;

})();
/**
 * Convert nav items into a JS object
 * @param {String} selector The selector for the nav menu in the DOM
 */
var getNav = function (selector) {

	// Variables
	var nav = [];
	var items = mashery.dom.querySelectorAll(selector);
	var form, data, secret, created;

	// Generate items object
	for (var i = 0; i < items.length; i++) {
		nav.push({
			label: items[i].innerHTML,
			url: items[i].getAttribute('href')
		});
	}

	return nav;

};

/**
 * If user profile link isn't stored in localStorage, fetch it with Ajax
 */
var fetchUserProfile = function () {

	// Bail if profile URL is already stored
	if (window.mashery.userProfile) return;

	// Otherwise, grab it from the account page
	atomic.ajax({
		url: '/member/edit',
		responseType: 'document'
	}).success((function (data) {

		// Get the user profile link
		var userProfile = data.querySelector('.actions .public-profile.action');
		if (!userProfile) return;

		// Get the href
		userProfile = userProfile.getAttribute('href');

		// Update the URL state
		window.mashery.userProfile = userProfile;
		sessionStorage.setItem('masheryUserProfile', userProfile);

		// Update the link in the DOM
		var profileLink = data.querySelector('a[href*="/profile/profile/"]');
		if (!profileLink) return;
		profileLink.href = userProfile;

	}));
};

/**
 * Scrape content from the default layout
 * @param {String} type  The content type for the page
 */
var getContent = function (type) {

	// Cache mashery objects
	var dom = window.mashery.dom;
	var content = window.mashery.content;

	// Variable placeholders
	var appDataBasic, appDataDetails;


	//
	// Universal Content
	//

	// Primary nav
	content.navPrimary = getNav('#local a');

	// Secondary nav
	content.navSecondary = getNav('#footer > ul a');


	//
	// Conditional Content
	//

	// Custom Pages
	if (type === 'page') {
		content.main = dom.querySelector('#main').innerHTML;
	}

	// Documentation
	else if (type === 'docs') {
		content.main = dom.querySelector('#main').innerHTML;
		content.secondary = dom.querySelector('#sub ul').innerHTML;
	}

	// Sign In Page
	else if (type === 'signin') {
		var signinForm = dom.querySelector('#signin form');
		content.main = '<form action="' + signinForm.action + '" method="post" enctype="multipart/form-data">' + signinForm.innerHTML + '</form>';
	}

	// Registration
	else if (type === 'register') {
		var regForm = dom.querySelector('#member-register');
		content.main = '<form action="' + regForm.action + '" method="post" enctype="multipart/form-data">' + regForm.innerHTML + '</form>';
	}

	// Registration Confirmation
	else if (type === 'registerSent') {
		var email = dom.querySelector('#main p');
		content.main = email ? email.innerHTML.replace('We have sent a confirmation e-mail to you at this address: ', '') : null;
	}

	// Resend Confirmation Email
	else if (type === 'registerResend') {
		form = dom.querySelector('#resend-confirmation');
		content.main = '<form action="' + form.getAttribute('action') + '" method="post" enctype="multipart/form-data" id="resend-confirmation">' + form.innerHTML + '</form>';
		content.main = content.main.replace('<legend>Resend your account confirmation email.</legend>', '');
	}

	// Join for Existing Mashery Members
	else if (type === 'join') {
		form = dom.querySelector('#member-edit');
		content.main = '<form action="' + form.getAttribute('action') + '" method="post" enctype="multipart/form-data" id="member-edit">' + form.innerHTML + '</form>';
		content.main = content.main.replace('<legend>Additional Information</legend>', '');
	}

	// Join Successful
	else if (type === 'joinSuccess') {
		var username = dom.querySelector('#main .section-body p');
		content.main = username ? username.innerHTML.replace('You have successfully registered as <strong>', '').replace('</strong>.', '').trim() : null;
	}

	// My keys
	else if (type === 'accountKeys') {

		// Get elements
		var keys = dom.querySelectorAll('.main .section-body h2, .main .section-body div.key');
		var getKeys = dom.querySelector('.action.new-key'); // @todo check if user can register at all based on this link

		// Push each key to an object
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
					data = key.querySelectorAll('dd');
					secret = data.length === 5 ? true : false;
					created = secret ? data[4].querySelector('abbr') : data[3].querySelector('abbr');
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

	// Delete Key
	else if (type === 'keyDelete') {

		// Variables
		form = dom.querySelector('#main .section-body form');
		data = dom.querySelectorAll('.key dd');
		secret = data.length === 5 ? true : false;
		created = secret ? data[4].querySelector('abbr') : data[3].querySelector('abbr');

		// Get the form
		content.main = '<form action="' + form.getAttribute('action') + '" method="post" enctype="multipart/form-data">' + form.innerHTML + '</form>';

		// Get the app data
		content.secondary = {
			api: dom.querySelector('#main .section-body h2').innerHTML,
			application: data[0].innerHTML.trim(),
			key: data[1].innerHTML.trim(),
			secret: secret ? data[2].innerHTML.trim() : null,
			status: secret ? data[3].innerHTML.trim() : data[2].innerHTML.trim(),
			created: created ? created.getAttribute('title') : ''
		};

	}

	// My Apps
	else if (type === 'accountApps') {

		// Get elements
		var apps = dom.querySelectorAll('.main .application');
		var createApps = dom.querySelector('.main .actions .add-app.action');

		// Set values
		content.main = [];
		content.secondary = createApps ? createApps.getAttribute('href') : null;
		apps.forEach((function(app) {

			// Variables
			var dataBasic = app.querySelectorAll('dd');
			var dataDetails = app.querySelectorAll('tbody td');
			var edit = app.querySelector('.application-actions.actions .edit.action');
			var del = app.querySelector('.application-actions.actions .delete-app.action');
			var add = app.querySelector('.application-actions.actions .add-key.action');

			// Get main content
			content.main.push({
				application: app.querySelector('h3').innerHTML.trim(),
				created: dataBasic[1].querySelector('abbr').getAttribute('title'),
				api: dataDetails[0] ? dataDetails[0].innerHTML.trim() : null,
				key: dataDetails[1] ? dataDetails[1].innerHTML.trim() : null,
				edit: edit ? edit.getAttribute('href') : null,
				delete: del ? del.getAttribute('href') : null,
				add: add ? add.getAttribute('href') : null
			});

		}));

	}

	// Register Application
	else if (type === 'appRegister') {
		form = dom.querySelector('#application-edit');
		var table = dom.querySelector('#main .section-body table');
		content.main = '<form action="' + form.getAttribute('action') + '" method="post" enctype="multipart/form-data" id="application-edit">' + form.innerHTML + '</form>';
		content.secondary = table ? '<table>' + table.innerHTML + '</table>' : null;
	}


	// Edit App
	else if (type === 'appEdit') {
		form = dom.querySelector('#application-edit');
		content.main = '<form action="' + form.getAttribute('action') + '" method="post" enctype="multipart/form-data" id="application-edit">' + form.innerHTML + '</form>';
		content.main = content.main.replace('<legend>Edit Your Application</legend>', '');
	}

	// Add APIs
	else if (type === 'appAddAPIs') {

		// Variables
		form = dom.querySelector('#main .section-body form');
		appDataBasic = dom.querySelectorAll('.application dd');
		appDataDetails = dom.querySelectorAll('.application tbody td');

		// Get the form
		content.main = '<form action="' + form.getAttribute('action') + '" method="post" enctype="multipart/form-data">' + form.innerHTML + '</form>';

		// Get the app data
		content.secondary = {
			application: dom.querySelector('.application h3').innerHTML.trim(),
			created: appDataBasic[1].querySelector('abbr').getAttribute('title'),
			api: appDataDetails[0] ? appDataDetails[0].innerHTML.trim() : null,
			key: appDataDetails[1] ? appDataDetails[1].innerHTML.trim() : null
		};
	}

	// Delete App
	else if (type === 'appDelete') {

		// Variables
		form = dom.querySelector('#main .section-body form');
		appDataBasic = dom.querySelectorAll('.application dd');
		appDataDetails = dom.querySelectorAll('.application tbody td');

		// Get the form
		content.main = '<form action="' + form.getAttribute('action') + '" method="post" enctype="multipart/form-data">' + form.innerHTML + '</form>';

		// Get the app data
		content.secondary = {
			application: dom.querySelector('.application h3').innerHTML.trim(),
			created: appDataBasic[1].querySelector('abbr').getAttribute('title'),
			api: appDataDetails[0] ? appDataDetails[0].innerHTML.trim() : null,
			key: appDataDetails[1] ? appDataDetails[1].innerHTML.trim() : null
		};
	}

	// Manage Account
	else if (type === 'accountManage') {
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

	// Change Email
	else if (type === 'accountEmail') {
		var emailForm = dom.querySelector('.main form');
		if (!emailForm) return;
		content.main = '<form action="' + emailForm.getAttribute('action') + '" method="post" enctype="multipart/form-data">' + emailForm.innerHTML + '</form>';
		fetchUserProfile();
	}

	// Change Password
	else if (type === 'accountPassword') {
		var passwordForm = dom.querySelector('.main form');
		if (!passwordForm) return;
		content.main = '<form action="' + passwordForm.getAttribute('action') + '" method="post" enctype="multipart/form-data">' + passwordForm.innerHTML + '</form>';
		content.secondary = dom.querySelector('#passwd_requirements').innerHTML;
		fetchUserProfile();
	}

	// User Profiles
	else if (type === 'profile') {
		data = dom.querySelectorAll('.user-information dd');
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

	// IO Docs
	else if (type === 'ioDocs') {
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

	// Reset Password
	else if (type === 'lostPassword') {
		form = dom.querySelector('#lost form');
		content.main = '<form action="' + form.getAttribute('action') + '" method="post" enctype="multipart/form-data">' + form.innerHTML + '</form>';
		content.main = content.main.replace('<legend>Lost Password</legend>', '');
	}

	// Reset Username
	else if (type === 'lostUsername') {
		form = dom.querySelector('#lost form');
		content.main = '<form action="' + form.getAttribute('action') + '" method="post" enctype="multipart/form-data">' + form.innerHTML + '</form>';
		content.main = content.main.replace('<legend>E-mail yourself your username</legend>', '');
	}

	// Search Results
	else if (type === 'search') {

		// If there are no results
		if (dom.querySelector('.no-result')) {
			content.main = null;
			content.secondary = {
				first: 0,
				last: 0,
				total: 0,
				query: dom.querySelector('.no-result b').innerHTML.trim()
			};
		}

		// If there are results
		else {
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

	// Contact Us
	else if (type === 'contact') {
		form = dom.querySelector('#main form');
		content.main = '<form action="' + form.getAttribute('action') + '" method="post" enctype="multipart/form-data">' + form.innerHTML + '</form>';
	}

	// @todo Forum

	// @todo Blog

};
/**
 * Get the Portal content type
 * @param {Node} elem  The DOM element with the content
 */
var getContentType = function (elem) {

	'use strict';

	//
	// Variables
	//

	var h1 = elem.querySelector('#main h1.first');
	h1 = h1 ? h1.innerHTML : '';
	var type;


	//
	// Get content type
	//

	// 404
	if (elem.classList.contains('not-found') || (h1 && /Not Found/.test(h1)) ) {
		type = 'fourOhFour';
	}

	// Must be logged in to view this content
	else if (elem.classList.contains('please-login') || elem.classList.contains('permission-denied')) {
		type = 'noAccess';
	}

	// Custom Pages
	else if (elem.classList.contains('page-page')) {
		type = 'page';
	}

	// Documentation
	else if (elem.classList.contains('page-docs')) {
		type = 'docs';
	}

	// IO Docs
	else if (elem.classList.contains('page-ioDocs')) {
		type = 'ioDocs';
	}

	// Forum
	else if (elem.classList.contains('page-forum')) {
		// Topics
		if (elem.classList.contains('topics')) {
			type = 'forumTopics';
		}

		// Add a topic
		else if (elem.classList.contains('topic-add')) {
			type = 'forumAddTopic';
		}

		// Individual Topic
		else if (elem.classList.contains('read')) {
			type = 'forumSingle';
		}

		// Recent Topics
		else if (elem.classList.contains('recent')) {
			type = 'forumRecent';
		}

		// All/Main
		else {
			type = 'forumAll';
		}

	}

	// Blog
	else if (elem.classList.contains('page-blog')){

		// All Posts
		if (elem.classList.contains('browse')) {
			type = 'blogAll';
		}

		// Single Post
		else {
			type = 'blogSingle';
		}

	}

	// Apps and Keys
	else if (elem.classList.contains('page-apps')) {

		// My Keys
		if (elem.classList.contains('mykeys')) {
			type = 'accountKeys';
		}

		// My Applications
		else if (elem.classList.contains('myapps')) {
			type = 'accountApps';
		}

		// App Registration
		else if (elem.classList.contains('register')) {

			// Edit an App
			if (elem.querySelector('#application-edit')) {
				type = 'appRegister';
			}

			// Successful registration
			else {
				type = 'appRegisterSuccess';
			}

		}

		// Edit App
		else if (elem.classList.contains('edit')) {
			type = 'appEdit';
		}

		// Add APIs
		else if (elem.classList.contains('select')) {

			// APIs successfully added
			if (h1 === 'New Keys Issued') {
				type = 'appAddAPIsSuccess';
			}

			// Add APIs Form
			else {
				type = 'appAddAPIs';
			}

		}

		// Delete App
		else if (elem.classList.contains('delete')) {
			type = 'appDelete';
		}

		else if (elem.classList.contains('error')) {
			type = 'appAddAPIsError';
		}

	}

	// Delete Key
	else if (elem.classList.contains('page-key') && elem.classList.contains('delete-key')) {
		type = 'keyDelete';
	}

	// Account Pages
	else if (elem.classList.contains('page-member')) {

		// Change Email
		if (elem.classList.contains('email')) {

			// Change Email Success
			if (elem.querySelector('#myaccount .success')) {
				type = 'accountEmailSuccess';
			}

			// Change Email Form
			else {
				type = 'accountEmail';
			}

		}

		// Change Password
		else if (elem.classList.contains('passwd')) {

			// Change Password Success
			if (elem.querySelector('#myaccount .success')) {
				type = 'accountPasswordSuccess';
			}

			// Change Password Form
			else {
			type = 'accountPassword';
			}

		}

		// Register Account
		else if (elem.classList.contains('register')) {

			// Confirmation Email Sent
			if (/Registration Almost Complete/.test(h1)) {
				type = 'registerSent';
			}

			// Register for a Ne Account
			else {
				type = 'register';
			}
		}

		// Resend Registration Confirmation Email
		else if (elem.classList.contains('resend-confirmation')) {

			// Email Sent
			if (elem.querySelector('ul.success')) {
				type = 'registerResendSuccess';
			}

			// Send Email Form
			else {
				type = 'registerResend';
			}

		}

		// Remove Membership
		else if (elem.classList.contains('remove')) {

			// Removed Successfully
			if (/You have been removed!/.test(elem.querySelector('.main .section-body').innerHTML)) {
				type = 'memberRemoveSuccess';
			}

			// Remove Membership Form
			else {
				type = 'memberRemove';
			}

		}

		// Lost Password
		else if (elem.classList.contains('lost')) {

			// Reset Email Sent
			if (/E-mail Sent/.test(elem.querySelector('h2').innerHTML)) {
				type = 'lostPasswordReset';
			}

			// Reset Form
			else {
				type = 'lostPassword';
			}

		}

		// Lost Username
		else if (elem.classList.contains('lost-username')) {

			// Reset Email Sent
			if (/E-mail Sent/.test(elem.querySelector('h2').innerHTML)) {
				type = 'lostUsernameReset';
			}

			// Reset Form
			else {
				type = 'lostUsername';
			}

		}

		// Join/Confirm Membership (for existing Mashery users)
		else if (elem.classList.contains('join') || elem.classList.contains('confirm')) {

			// Join Success
			if (/Registration Successful/.test(h1)) {
				type = 'joinSuccess';
			}

			// Join Form
			else {
				type = 'join';
			}
		}

		// Request secret visibility
		else if (elem.classList.contains('request-display-key-info')) {
			type = 'showSecret';
		}

		// Secret visibility success
		else if (elem.classList.contains('reset-key-info')) {
			type = 'showSecretSuccess';
		}

		// Secrets already visible
		else if (elem.classList.contains('error')) {
			type = 'showSecretError';
		}

		// Manage My Account
		else {
			type = 'accountManage';
		}
	}

	// User Profiles
	else if (elem.classList.contains('page-profile')) {
		type = 'profile';
	}

	// Signin Page
	else if (elem.classList.contains('page-login')) {
		type = 'signin';
	}

	// Search
	else if (elem.classList.contains('page-search')) {
		type = 'search';
	}

	// Logout
	else if (elem.classList.contains('page-logout')) {

		// Logout Failed
		if (elem.querySelector('#user-nav .account')) {
			type = 'logoutFail';
		}

		// Logged Out
		else {
			type = 'logout';
		}

	}

	// Contact Us
	else if (elem.classList.contains('page-contact')) {

		// Contact Form
		if (elem.querySelector('#main form')) {
			type = 'contact';
		}

		// Contact Success
		else {
			type = 'contactSuccess';
		}

	}

	return type;

};
var getMashGlobals = function (str) {
	str.replace(/mash\.(.*?)=(.*?);/g, (function (match, p1, p2) {
		window.mashery.globals[p1.trim()] = p2.trim();
	}));
};
/**
 * Remove stylesheets from the DOM.
 * Copyright (c) 2017. TIBCO Software Inc. All Rights Reserved.
 * @param  {String} filename The name of the stylesheet to remove
 */
var removeCSS = function (filename) {

	'use strict';

	// Get all matching stylesheets
	var links = document.querySelectorAll('link[href*="' + filename + '"]');

	// Remove all matching stylesheets
	links.forEach((function (link) {
		link.remove();
	}));
};
/**
 * Setup global mashery variable on page render
 * @param {Node} doc  The page document
 */
var setupMashery = function (doc) {

	// Get the default page
	var page = doc.querySelector('#page');

	// Convert DOM content to a node
	var dom = document.createElement('div');
	dom.innerHTML = page.innerHTML;

	// Get special links
	var dashboard = dom.querySelector('#user-nav .dashboard a');
	var logout = dom.querySelector('#mashery-logout-form');
	var login = dom.querySelector('#user-nav .sign-in a');

	// Set mashery properties
	window.mashery = {
		area: dom.querySelector('#branding-logo').innerHTML.trim(),
		content: {
			main: null,
			secondary: null
		},
		contentId: null,
		contentType: getContentType(doc.body),
		dashboard: dashboard ? dashboard.getAttribute('href') : null,
		dom: dom,
		globals: {},
		isAdmin: dom.querySelector('#user-nav .dashboard.toggle') ? true : false,
		loggedIn: dom.querySelector('#mashery-logout-form') ? true : false,
		login: {
			url: login ? login.pathname : null,
			redirect: login ? login.search : null
		},
		logout: logout ? logout : null,
		title: doc.title,
		username: typeof mashery_info !== 'undefined' && mashery_info && mashery_info.username ? mashery_info.username : null,
		userProfile: sessionStorage.getItem('masheryUserProfile')
	};

	// Get Mashery global variables
	getMashGlobals(doc.documentElement.innerHTML);

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
var m$ = (function () {

	'use strict';

	//
	// Variables
	//

	// Placeholder for public methods
	var m$ = {};

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

		// If true, activate mashtip tooltips
		mashtips: true,

		// If true, include viewport resizing meta tag
		responsive: true,

		// If true, test password strength
		testPassword: true,

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
							'<p>';

							if (app.edit) {
								template += '<a class="btn btn-edit-app" id="' + m$.sanitizeClass(app.application, 'btn-edit-app') + '" href="' + app.edit + '">Edit This App</a>';
							}
							if (app.delete) {
								template += '<a class="btn btn-delete-app" id="' + m$.sanitizeClass(app.application, 'btn-delete-app') + '" href="' + app.delete + '">Delete This App</a>';
							}
							if (app.add) {
								template += '<a class="btn btn-add-key-app" id="' + m$.sanitizeClass(app.application, 'btn-add-key-app') + '" href="' + app.add + '">Add APIs</a>';
							}

						template += '</p>';
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
			 * Add App APIs
			 * Add APIs to an application
			 */
			appAddAPIs: function () {
				var template =
							'<div class="container container-small">' +
								'<h1>Add APIs to this Application</h1>' +
								'<ul>' +
									'<li><strong>Application:</strong> ' + window.mashery.content.secondary.application + '</li>' +
									'<li><strong>Created:</strong> ' + window.mashery.content.secondary.created + '</li>' +
									(window.mashery.content.secondary.api ? '<li><strong>API:</strong> ' + window.mashery.content.secondary.api + '</li>' : '') +
									(window.mashery.content.secondary.key ? '<li><strong>Key:</strong> ' + window.mashery.content.secondary.key + '</li>' : '') +
								'</ul>' +
								'<h2>Add APIs</h2>' +
								window.mashery.content.main +
							'</div>';

				return template;
			},

			/**
			 * App Delete
			 * Delete an application
			 */
			appDelete: function () {
				var template =
							'<div class="container container-small">' +
								'<h1>Delete Your Application</h1>' +
								'<ul>' +
									'<li><strong>Application:</strong> ' + window.mashery.content.secondary.application + '</li>' +
									'<li><strong>Created:</strong> ' + window.mashery.content.secondary.created + '</li>' +
									(window.mashery.content.secondary.api ? '<li><strong>API:</strong> ' + window.mashery.content.secondary.api + '</li>' : '') +
									(window.mashery.content.secondary.key ? '<li><strong>Key:</strong> ' + window.mashery.content.secondary.key + '</li>' : '') +
								'</ul>' +
								'<h2>Confirm Deletion</h2>' +
								'<p><strong>Are you sure you want to delete this application and all of its keys?</strong></p>' +
								window.mashery.content.main +
							'</div>';

				return template;
			},

			/**
			 * Add App APIs: Success
			 * New API keys added to an app
			 */
			appAddAPIsSuccess:	'<div class="container container-small">' +
									'<h1>{{content.heading}}</h1>' +
									'{{content.main}}' +
								'</div>',

			/**
			 * Edit Application
			 * Layout with form to edit an application
			 */
			appEdit:	'<div class="container container-small">' +
							'<h1>{{content.heading}}</h1>' +
							'{{content.main}}' +
							'{{content.form}}' +
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

			keyDelete: function () {
				var template =
					'<h1>Delete Your Key</h1>' +

					'<h2>' + window.mashery.content.secondary.api + '</h2>' +
					'<ul>' +
						'<li><strong>Application:</strong> ' + window.mashery.content.secondary.application + '</li>' +
						'<li><strong>Key:</strong> ' + window.mashery.content.secondary.key + '</li>' +
						(window.mashery.content.secondary.secret ? '<li><strong>Secret:</strong> ' + window.mashery.content.secondary.secret + '</li>' : '') +
						'<li><strong>Status:</strong> ' + window.mashery.content.secondary.status + '</li>' +
						'<li><strong>Created:</strong> ' + window.mashery.content.secondary.created + '</li>' +
					'</ul>' +

					'<h2>Confirm Deletion</h2>' +
					'<p><strong>Are you sure you want to delete this key?</strong></p>' +
					window.mashery.content.main;

				return '<div class="main container container-small" id="main">' + template + '</div>';
			},

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
			 * App Add APIs: Success
			 * API keys successfully added to an app
			 */
			appAddAPIsSuccess: {
				heading: 'New API Keys Issued', // The heading

				// The message
				main: '<p>An email has been sent to you with your key and application details. You can also view them at any time from the <a href="{{path.keys}}">My Account</a> page.</p>' +
				'<p>To get started using your API keys, dig into <a href="{{path.docs}}">our documentation</a>. We look forward to seeing what you create!</p>',
			},

			/**
			 * Delete App
			 * The page to delete an application
			 */
			appDelete: {
				confirm: 'Are you really sure you want to delete this application?'
			},

			/**
			 * App Edit
			 * The edit application page
			 */
			appEdit: {
				heading: 'Edit Your Application',
				main: '<p>Edit your details using the form below.</p>'
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
			 * Delete Key
			 * The page to delete an API key
			 */
			keyDelete: {
				confirm: 'Are you really sure you want to delete this key?'
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
				main: '<p>If you\'re not logged in yet, try <a href="{{path.signin}}">logging in</a> or <a href="{{path.register}}">registering for an account</a>.</p>' // The message
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
		'{{path.apps}}': function () {
			return '/apps/myapps';
		},

		// My Keys
		'{{path.keys}}': function () {
			return '/apps/mykeys';
		},

		// My Account
		'{{path.account}}': function () {
			return '/member/edit';
		},

		// Change My Email
		'{{path.changeEmail}}': function () {
			return '/member/email';
		},

		// Change My Password
		'{{path.changePassword}}': function () {
			return '/member/passwd';
		},

		// Contact
		'{{path.contact}}': function () {
			return '/contact';
		},

		// Dashboard
		'{{path.dashboard}}': function () {
			return (window.mashery.dashboard ? window.mashery.dashboard : '#');
		},

		// Documentation
		'{{path.docs}}': function () {
			return '/docs';
		},

		// IO Docs
		'{{path.iodocs}}': function () {
			return '/io-docs';
		},

		// Logout
		'{{path.logout}}': function () {
			return '/logout/logout';
		},

		// Password Request
		'{{path.lostPassword}}': function () {
			return '/member/lost';
		},

		// Username Request
		'{{path.lostUsername}}': function () {
			return '/member/lost-username';
		},

		// Trigger Remove Member
		// Special link that submits the remove member form
		'{{path.removeMember}}': function () {
			return '/member/remove?action=removeMember';
		},

		// User Registration
		'{{path.register}}': function () {
			return '/member/register';
		},

		// User Registration Resent
		'{{path.registerResendConfirmation}}': function () {
			return '/member/resend-confirmation';
		},

		// Remove Membership
		'{{path.removeMembership}}': function () {
			return '/member/remove';
		},

		// Search Results
		'{{path.search}}': function () {
			return '/search';
		},

		// Sign In
		'{{path.signin}}': function () {
			return window.mashery.login.url + window.mashery.login.redirect;
		},

		// View My Profile
		'{{path.viewProfile}}': function () {
			return (window.mashery.userProfile ? window.mashery.userProfile : '/profile/profile');
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
			'{{content.account}}': function () {
				return settings.labels.account.account;
			},

			// My Apps Nav Label
			'{{content.apps}}': function () {
				return settings.labels.account.apps;
			},

			// My Account Heading
			'{{content.headingAccount}}': function () {
				return settings.labels.account.headingAccount;
			},

			// My Account Info Subheading
			'{{content.headingAccountInfo}}': function () {
				return settings.labels.account.headingAccountInfo;
			},

			// Change My Email Heading
			'{{content.headingChangeEmail}}': function () {
				return settings.labels.account.headingChangeEmail;
			},

			// Change My Email Success Heading
			'{{content.headingChangeEmailSuccess}}': function () {
				return settings.labels.account.headingChangeEmailSuccess;
			},

			// Change My Password Heading
			'{{content.headingChangePassword}}': function () {
				return settings.labels.account.headingChangePassword;
			},

			// Change My Password Success Heading
			'{{content.headingChangePasswordSuccess}}': function () {
				return settings.labels.account.headingChangePasswordSuccess;
			},

			// My Keys Heading
			'{{content.headingMyApiKeys}}': function () {
				return settings.labels.account.headingMyApiKeys;
			},

			// My Apps Heading
			'{{content.headingMyApps}}': function () {
				return settings.labels.account.headingMyApps;
			},

			// My Keys Nav Label
			'{{content.keys}}': function () {
				return settings.labels.account.keys;
			},

			// No Applications Message
			'{{content.noApps}}': function () {
				return settings.labels.account.noApps;
			},

			// No Keys Message
			'{{content.noKeys}}': function () {
				return settings.labels.account.noKeys;
			},

			// No Keys for Specific Plan Message
			'{{content.noPlanKeys}}': function () {
				return settings.labels.account.noPlanKeys;
			},

			// Email successfully changed message
			'{{content.emailChanged}}': function () {
				return settings.labels.account.emailChanged;
			},

			// Password successfully changed message
			'{{content.passwordChanged}}': function () {
				return settings.labels.account.passwordChanged;
			}

		},

		appEdit: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.appEdit.heading;
			},

			// Body Text
			'{{content.main}}': function () {
				return settings.labels.appEdit.main;
			},

			// App Edit Form
			'{{content.form}}': function () {
				return window.mashery.content.main;
			},

		},

		// App Add APIs Success
		appAddAPIsSuccess: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.appAddAPIsSuccess.heading;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.appAddAPIsSuccess.main;
			}

		},

		// App Registration
		appRegister: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.appRegister.heading;
			},

			// Subheading
			'{{content.subheading}}': function () {
				return settings.labels.appRegister.subheading;
			}

		},

		// App Registration Success
		appRegisterSuccess: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.appRegisterSuccess.heading;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.appRegisterSuccess.main;
			}

		},

		// Contact
		contact: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.contact.heading;
			},

			// Subheading
			'{{content.subheading}}': function () {
				return settings.labels.contact.subheading;
			}

		},

		// Contact Success
		contactSuccess: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.contactSuccess.heading;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.contactSuccess.main;
			}

		},

		// 404 Page
		fourOhFour: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.fourOhFour.heading;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.fourOhFour.main;
			}

		},

		// IO Docs
		ioDocs: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.ioDocs.heading;
			},

			// Subheading
			'{{content.subheading}}': function () {
				return settings.labels.ioDocs.subheading;
			}

		},

		// Join Area for Existing Mashery Users
		join: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.join.heading;
			},

			// Subheading
			'{{content.subheading}}': function () {
				return settings.labels.join.subheading;
			}

		},

		// Join Successful
		joinSuccess: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.joinSuccess.heading;
			}

		},

		// The layout
		layout: {

			// Footer 1
			'{{layout.footer1}}': function () {
				return '<div id="footer-1-wrapper"></div>';
			},

			// Footer 2
			'{{layout.footer2}}': function () {
				return '<div id="footer-2-wrapper"></div>';
			},

			// Main Content
			'{{layout.main}}': function () {
				return '<!-- tabindex="-1" hack for skipnav link: https://code.google.com/p/chromium/issues/detail?id=37721 --><main class="tabindex" tabindex="-1" id="main-wrapper"></main>';
			},

			// Primary Nav
			'{{layout.navPrimary}}': function () {
				return '<nav id="nav-primary-wrapper"></nav>';
			},

			// Secondary Nav
			'{{layout.navSecondary}}': function () {
				return '<nav id="nav-secondary-wrapper"></nav>';
			},

			// User Nav
			'{{layout.navUser}}': function () {
				return '<nav id="nav-user-wrapper"></nav>';
			}

		},

		// Logout Successful
		logout: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.logout.heading;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.logout.main;
			}

		},

		// Logout Failed
		logoutFail: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.logoutFail.heading;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.logoutFail.main;
			}

		},

		// Lost Password Request
		lostPassword: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.lostPassword.heading;
			},

			// Subheading
			'{{content.subheading}}': function () {
				return settings.labels.lostPassword.subheading;
			}

		},

		// Lost Password Reset
		lostPasswordReset: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.lostPasswordReset.heading;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.lostPasswordReset.main;
			}

		},

		// Lost Username Request
		lostUsername: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.lostUsername.heading;
			},

			// Subheading
			'{{content.subheading}}': function () {
				return settings.labels.lostUsername.subheading;
			}

		},

		// Lost Username Reset
		lostUsernameReset: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.lostUsernameReset.heading;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.lostUsernameReset.main;
			}

		},

		// Remove Membership
		memberRemove: {

			// Cancel Button Text
			'{{content.cancel}}': function () {
				return settings.labels.memberRemove.cancel;
			},

			// Confirm Button Text
			'{{content.confirm}}': function () {
				return settings.labels.memberRemove.confirm;
			},

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.memberRemove.heading;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.memberRemove.main;
			},

			// Pop Up Confirmation Text
			'{{content.popup}}': function () {
				return settings.labels.memberRemove.popup;
			}

		},

		// Member Successfully Removed
		memberRemoveSuccess: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.memberRemoveSuccess.heading;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.memberRemoveSuccess.main;
			}

		},

		// No Access to this Content
		noAccess: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.noAccess.heading;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.noAccess.main;
			}

		},

		// User Profiles
		profile: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.profile.heading;
			},

			// User Info Subheading
			'{{content.headingUserInfo}}': function () {
				return settings.labels.profile.headingUserInfo;
			},

			// User Activity Subheading
			'{{content.headingActivity}}': function () {
				return settings.labels.profile.headingActivity;
			},

			// User Website Label
			'{{content.userWebsite}}': function () {
				return settings.labels.profile.userWebsite;
			},

			// User Blog Label
			'{{content.userBlog}}': function () {
				return settings.labels.profile.userBlog;
			},

			// User Registration Date Label
			'{{content.userRegistered}}': function () {
				return settings.labels.profile.userRegistered;
			}

		},

		// User Registration
		register: {

			// About/Sidebar Content
			'{{content.about}}': function () {
				return settings.labels.register.sidebar;
			},

			// Form
			'{{content.form}}': function () {
				return window.mashery.content.main;
			},

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.register.heading;
			},

			// Subheading
			'{{content.subheading}}': function () {
				return settings.labels.register.subheading;
			}

		},

		// Registration Confirmation
		registerSent: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.registerSent.heading;
			}

		},

		// Resend Registration Confirmation
		registerResend: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.registerResend.heading;
			},

			// Subheading
			'{{content.subheading}}': function () {
				return settings.labels.registerResend.subheading;
			}

		},

		// Registration Confirmation Successfully Resent
		registerResendSuccess: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.registerResendSuccess.heading;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.registerResendSuccess.main;
			}

		},

		// Search Form and Results
		search: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.search.heading;
			},

			// Meta Info
			'{{content.meta}}': function () {
				return settings.labels.search.meta;
			},

			// No Results Found Message
			'{{content.noResults}}': function () {
				return settings.labels.search.noResults;
			},

			// The Search Query
			'{{content.query}}': function () {
				return window.mashery.content.secondary.query;
			},

			// The Start of the Displayed Result Range (X of Y out of Z)
			'{{content.first}}': function () {
				return window.mashery.content.secondary.first;
			},

			// The End of the Displayed Result Range (X of Y out of Z)
			'{{content.last}}': function () {
				return window.mashery.content.secondary.last;
			},

			// The Total Number of Results
			'{{content.total}}': function () {
				return window.mashery.content.secondary.total;
			},

			// Previous Page Link Text
			'{{content.pagePrevious}}': function () {
				return settings.labels.search.pagePrevious;
			},

			// Next Page Link Text
			'{{content.pageNext}}': function () {
				return settings.labels.search.pageNext;
			},

			// Divider Between Previous and Next Links
			'{{content.pageDivider}}': function () {
				return settings.labels.search.pageDivider;
			}

		},

		// Show Secret
		showSecret: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.showSecret.heading;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.showSecret.main;
			}

		},

		// Show Secret: Success
		showSecretSuccess: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.showSecretSuccess.heading;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.showSecretSuccess.main;
			}

		},

		// Show Secret: Error
		showSecretError: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.showSecretError.heading;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.showSecretError.main;
			}

		},

		// Sign In
		signin: {

			// Sign In About Info/Sidebar
			'{{content.about}}': function () {
				return settings.labels.signin.sidebar;
			},

			// Sign In Form
			'{{content.form}}': function () {
				return window.mashery.content.main;
			},

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.signin.heading;
			},

			// Subheading
			'{{content.subheading}}': function () {
				return settings.labels.signin.subheading;
			}

		}

	};

	/**
	 * Global Placeholders
	 * Holds placeholders that can be used anywhere in the Portal.
	 */
	var globalPlaceholders = {

		// Portal/Area Name
		'{{mashery.area}}': function () {
			return window.mashery.area;
		},

		// Main Content (if there's not one specific to the content type)
		'{{content.main}}': function () {
			return window.mashery.content.main;
		},

		// Secondary Content (if there's not one specific to the content type)
		'{{content.secondary}}': function () {
			return window.mashery.content.secondary;
		},

		// Logo
		'{{content.logo}}': function () {
			return (settings.logo ? settings.logo : window.mashery.area);
		},

		// User Account Nav Items (<li><a> href="#"link</a></li> without a parent list wrapper)
		'{{content.navItemsAccount}}': function () {
			return getAccountNavItems();
		},

		// Mashery Account Nav Items (<li><a> href="#"link</a></li> without a parent list wrapper)
		'{{content.navItemsMasheryAccount}}': function () {
			return getMasheryAccountNavItems();
		},

		// Primary Nav Items (<li><a href="#">link</a></li> without a parent list wrapper)
		'{{content.navItemsPrimary}}': function () {
			return getNavItems(window.mashery.content.navPrimary);
		},

		// Secondary Nav Items (<li><a href="#">link</a></li> without a parent list wrapper)
		'{{content.navItemsSecondary}}': function () {
			return getNavItems(window.mashery.content.navSecondary);
		},

		// User Nav Items (<li><a href="#">link</a></li> without a parent list wrapper)
		'{{content.navItemsUser}}': function () {
			return getUserNavItems();
		},

		// Mashery Made Logo
		'{{content.masheryMade}}': function () {
			return '<a id="mashery-made-logo" href="http://mashery.com"><img src="https://support.mashery.com/public/Mashery/images/masherymade.png"></a>';
		},

		// Privacy Policy
		'{{content.privacyPolicy}}': function () {
			return settings.labels.register.privacyPolicy;
		},

		// Registration Terms of Use
		'{{content.terms}}': function () {
			var text =
				'<div id="registration-terms-of-service">' +
				'<p>By clicking the "Register" button, I certify that I have read and agree to {{content.privacyPolicy}}the <a href="http://www.mashery.com/terms/">Mashery Terms of Service</a> and <a href="http://www.mashery.com/privacy/">Privacy Policy</a>.</p>' +
				'</div>';
			return text;
		},

		// Search Form
		'{{content.searchForm}}': function () {
			var template =
				'<form id="search-form" class="search-form" method="get" action="/search">' +
				'<input class="search-input" id="search-input" type="text" value="" placeholder="' + settings.labels.search.placeholder + '" name="q">' +
				'<button class="search-button" id="search-button" type="submit">' + settings.labels.search.button + '</button>' +
				'</form>';
			return template;
		},

		// Page Title
		'{{mashery.title}}': function () {
			var heading = document.querySelector('h1');
			return (heading ? heading.innerHTML.trim() : window.mashery.title.replace(window.mashery.area + ' - ', '').replace(window.mashery.area, ''));
		},

		// Current User's Username
		'{{mashery.username}}': function () {
			return window.mashery.username;
		}

	};


	//
	// Methods
	//

	/**
	 * Load a JS file asynchronously.
	 * @public
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
	 * @public
	 * @copyright @scottjehl, Filament Group, Inc.
	 * @license MIT
	 * @param {String} href    The URL for your CSS file
	 * @param {Node}   before  Element to use as a reference for injecting the <link> [optional]
	 * @param {String} media   Stylesheet media type [optional, defaults to 'all']
	 */
	m$.loadCSS = function (href, before, media) {
		// Bail if CSS file already exists
		if (document.querySelector('link[href*="' + href + '"]')) return;
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
	 * Sanitize a string for use as a class
	 * Regex pattern: http://stackoverflow.com/a/9635698/1293256
	 * @public
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
	 * @public
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
	 * @private
	 * @param   {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
	 * @param   {Object}   objects  The objects to merge together
	 * @returns {Object}            Merged values of defaults and options
	 * @todo optimize loops
	 */
	var extend = function () {

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

	/**
	 * Simulate a click event.
	 * @public
	 * @param {Element} elem  the element to simulate a click on
	 */
	var click = function (elem) {
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
	 * Replaces placeholders with real content
	 * @private
	 * @param {String} template The template string
	 * @param {String} local    A local placeholder to use, if any
	 */
	var replacePlaceholders = function (template, local) {

		// Check if the template is a string or a function
		template = typeof (template) === 'function' ? template() : template;

		// Replace local placeholders (if they exist)
		if (local) {
			var tempLocal = /account/.test(local) ? 'account' : local;
			if (localPlaceholders[tempLocal]) {
				localPlaceholders[tempLocal].forEach((function (content, placeholder) {
					template = template.replace(new RegExp(placeholder, 'g'), content);
				}));
			}
		}

		// Replace paths
		paths.forEach((function (path, placeholder) {
			template = template.replace(new RegExp(placeholder, 'g'), path);
		}));

		// Replace global placeholders
		globalPlaceholders.forEach((function (content, placeholder) {
			template = template.replace(new RegExp(placeholder, 'g'), content);
		}));

		return template;

	};

	/**
	 * Get the user navigation items
	 * @private
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
	 * @private
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
	 * @private
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
	 * @private
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
	 * Render content in the Portal
	 * @private
	 * @param {String}   selector The selector for the element to render the content into
	 * @param {String}   key      The content type
	 * @param {Function} before   The callback to run before rendering
	 * @param {Function} after    The callback to run after rendering
	 */
	var render = function (selector, key, before, after) {

		// Get the content
		var content = document.querySelector(selector);
		if (!content) return;

		// Run the before callback
		if (before) {
			before();
		}

		// Render the content
		content.innerHTML = settings.templates[key] ? replacePlaceholders(settings.templates[key], key) : '';

		// If custom page or documentation, remove Mashery inserted junk
		if (['page','docs'].indexOf(window.mashery.contentType !== -1)) {
			var junk = document.querySelectorAll('#header-edit, #main .section .section-meta');
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
	 * @public
	 * @bugfix Sometimes mashery variable provides wrong info at page load after logout event
	 */
	m$.verifyLoggedIn = function () {

		// Only run on logout and member remove pages
		if (['logout', 'memberRemoveSuccess'].indexOf(window.mashery.contentType) === -1) return;

		// Check if the a logout form exists (if so, user is logged in and we can bail)
		var loggedIn = window.mashery.dom.querySelector('#mashery-logout-form');
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
	 * @private
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
	 * @public
	 */
	m$.addStyleHooks = function () {

		// Get the app wrapper
		var wrapper = document.querySelector('#app-wrapper');
		if (!wrapper) return;

		// Get the current pathname (or 'home' if one doesn't exist)
		var path = ['/', '/home'].indexOf(window.location.pathname.toLowerCase()) === -1 ? window.location.pathname.slice(1) : 'home';

		// Add a class hook for the content type and current page
		wrapper.className = m$.sanitizeClass(window.mashery.contentType, 'category') + ' ' + m$.sanitizeClass(path, 'single');

		// Add a JavaScript hook for the current page
		window.mashery.contentId = m$.sanitizeClass(path);

	};

	/**
	 * Load IO Docs scripts if they're not already present
	 * @private
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
	 * Load required files for IODocs
	 * @private
	 */
	var loadRequiredFilesIODocs = function () {
		// If not IO Docs, bail
		if (window.mashery.contentType !== 'ioDocs') return;
		if (!('jQuery' in window)) {
			// If jQuery isn't loaded yet, load it
			m$.loadJS('https://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js', loadIODocsScripts);
		} else {
			// Otherwise, just load our scripts
			loadIODocsScripts();
		}
	};

	/**
	 * Load required files for IODocs
	 * @private
	 */
	var loadRequiredFilesPasswords = function () {

		// Only run on pages with password requirement lists
		if (!document.querySelector('#passwd_requirements')) {
			masheryTestPassword.destroy();
			return;
		};

		// Only run if testPassword is enabled
		if (!settings.testPassword) return;

		// Initialize tests
		masheryTestPassword.init();

	};

	/**
	 * Load Mashtips functions
	 * @private
	 */
	var loadRequiredFilesMashtips = function () {

		// Only run on pages with Mashtips
		if (!document.querySelector('.mashtip')) {
			masheryMashtips.destroy();
			return;
		};

		// Only run if testPassword is enabled
		if (!settings.mashtips) return;

		// Initialize tests
		masheryMashtips.init();

	};

	/**
	 * Load any Mashery files that are required for a page to work
	 * @private
	 */
	var loadRequiredFiles = function () {
		loadRequiredFilesIODocs(); // Load required files for IO Docs
		loadRequiredFilesPasswords(); // Load required files for registration and password pages
		loadRequiredFilesMashtips(); // Load Mashtip functions for tooltips
	};

	/**
	 * Inject the logout form into the DOM
	 * @private
	 */
	var renderLogout = function () {
		if (!window.mashery.logout || document.querySelector('#mashery-logout-form')) return;
		document.body.insertBefore(window.mashery.logout, document.body.lastChild);
	};

	/**
	 * Inject the remove member form into the DOM on remove member page
	 * @private
	 */
	var renderMemberRemove = function () {

		// Only run on the member remove page
		if (window.mashery.contentType !== 'memberRemove' || document.querySelector('#member-remove-form')) return;

		// Get the form
		var form = window.mashery.dom.querySelector('.main form');
		if (!form) return;

		// Give it an ID and make it hidden
		form.id = 'member-remove-form';
		form.setAttribute('hidden', 'hidden');

		// Update the onclick popup text
		var submit = form.querySelector('#process');
		if (submit) {
			submit.setAttribute('onclick', 'return confirm("' + localPlaceholders.memberRemove.popup.text() + '")');
		}

		// Inject it into the DOM
		document.body.lastChild.before(form);
	};

	/**
	 * Render the Mashery Made logo (if missing)
	 * @private
	 */
	var renderMasheryMade = function () {

		// Bail if Mashery Made logo is already in the DOM
		var masheryMade = document.querySelector('#mashery-made-logo');
		if (masheryMade) return;

		// Get the app container
		var app = document.querySelector('#app');
		if (!app) return;

		// Create our logo container and add the logo
		var mashMade = document.createElement('div');
		mashMade.innerHTML = '<p>x</p><div id="mashery-made"><div class="container"><p>' + globalPlaceholders['{{content.masheryMade}}']() + '</p></div></div>';

		// Inject into the DOM
		app.appendChild(mashMade.childNodes[1]);

	};

	/**
	 * Render the Mashery Terms of Use of registration pages (if missing)
	 * @private
	 */
	var renderTOS = function () {

		// Only run on Registration pages
		if (['register', 'join'].indexOf(window.mashery.contentType) === -1) return;

		// Bail if a Terms of Use already exists
		var tos = document.querySelector('#registration-terms-of-service');
		if (tos) return;

		// Bail if there's no registration form
		var reg = document.querySelector('form[action*="/member/register"]');
		if (!reg) return;

		// Create our terms of use
		var div = document.createElement('div');
		div.innerHTML = '<p>x</p>' + replacePlaceholders(globalPlaceholders['{{content.terms}}'](), 'register');

		// Inject into the DOM
		reg.appendChild(div.childNodes[1]);

	};

	/**
	 * Reload IO Docs to force script to reinit after DOM is available
	 * @private
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
	 * Update the delete app confirmation modal text with user settings
	 */
	var updateDeleteAppConfirmModal = function () {
		if (window.mashery.contentType !== 'appDelete') return;
		var process = document.querySelector('form #process');
		if (!process) return;
		process.setAttribute('onClick', 'return confirm(\'' + settings.labels.appDelete.confirm + '\')');
	};

	/**
	 * Update the delete key confirmation modal text with user settings
	 */
	var updateDeleteKeyConfirmModal = function () {
		if (window.mashery.contentType !== 'keyDelete') return;
		var process = document.querySelector('form #process');
		if (!process) return;
		process.setAttribute('onClick', 'return confirm(\'' + settings.labels.keyDelete.confirm + '\')');
	};

	/**
	 * Render the layout
	 * @public
	 */
	m$.renderLayout = function () {
		render('#app', 'layout', settings.callbacks.beforeRenderLayout, settings.callbacks.afterRenderLayout);
		m$.verifyLoggedIn();
	};

	/**
	 * Render the title attribute
	 * @public
	 */
	m$.renderTitle = function () {
		document.title = replacePlaceholders(settings.labels.title, window.mashery.contentType);
	};

	/**
	 * Render the user navigation
	 * @public
	 */
	m$.renderUserNav = function () {
		render('#nav-user-wrapper', 'userNav', settings.callbacks.beforeRenderUserNav, settings.callbacks.afterRenderUserNav);
	};

	/**
	 * Render the primary navigation
	 * @public
	 */
	m$.renderPrimaryNav = function () {
		render('#nav-primary-wrapper', 'primaryNav', settings.callbacks.beforeRenderPrimaryNav, settings.callbacks.afterRenderPrimaryNav);
	};

	/**
	 * Render the secondary navigation
	 * @public
	 */
	m$.renderSecondaryNav = function () {
		render('#nav-secondary-wrapper', 'secondaryNav', settings.callbacks.beforeRenderSecondaryNav, settings.callbacks.afterRenderSecondaryNav);
	};

	/**
	 * Render the footer
	 * @public
	 */
	m$.renderFooter = function () {

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
	 * @public
	 */
	m$.renderMain = function () {
		render('#main-wrapper', window.mashery.contentType, settings.callbacks.beforeRenderMain, settings.callbacks.afterRenderMain);
	};

	/**
	 * Jump to anchor or adjust focus when rendering is complete
	 * (Our JS rendering process breaks the normal browser behavior)
	 * @public
	 */
	m$.fixLocation = function () {
		if (window.location.hash) {
			window.location.hash = window.location.hash;
		} else {
			document.querySelector('#app').focus();
		}
	};

	/**
	 * Add required content and make required DOM updates
	 */
	m$.renderCleanup = function () {

		// Render hidden forms and required content
		loadRequiredFiles(); // Load required CSS/JS files into the DOM
		renderLogout(); // Logout Form
		renderMemberRemove(); // Remove Member Form
		renderMasheryMade(); // Add the Mashery Made logo if missing
		renderTOS(); // Add the Mashery Terms of Service if missing from registration page

		// Make updates to DOM content
		updateDeleteAppConfirmModal(); // Update the delete app confirmation modal
		updateDeleteKeyConfirmModal();  // Update the delete key confirmation modal

		// Forced reloads
		reloadIODocs(); // Reload IO Docs

	};

	/**
	 * Render the Portal via Ajax
	 * @private
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
		m$.renderPortal(true);

	};

	/**
	 * Fetch page content with Ajax
	 * @private
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
	 * @private
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
	 * Process logout events
	 * @private
	 * @param {Event} event The click event
	 */
	var processLogout = function (event) {

		// Bail if there's no logout form
		var logout = document.querySelector('#mashery-logout-form');
		if (!logout) return;

		// Prevent the default click behavior
		event.preventDefault();

		// Submit the logout form
		logout.submit();

	};

	/**
	 * Process remove membership events
	 * @private
	 * @param {Event} event The click event
	 */
	var processMemberRemove = function (event) {

		// Get the remove member form
		var remove = document.querySelector('#member-remove-form #process');
		if (!remove || window.mashery.contentType !== 'memberRemove') return;

		// Prevent the default click event
		event.preventDefault();

		// Submit the remove member form
		click(remove);

	};

	/**
	 * Handle all page click events
	 * @private
	 * @param {Event} event The click event
	 */
	var clickHandler = function (event) {

		// Logout events
		if (event.target.closest('a[href*="' + paths['{{path.logout}}']() + '"]')) {
			processLogout(event);
			return;
		}

		// Member remove events
		if (event.target.closest('a[href*="' + paths['{{path.removeMember}}']() + '"]')) {
			processMemberRemove(event);
			return;
		}

		// Ajax
		loadWithAjax(event);

	};

	/**
	 * Handle popstate events and update page content
	 * @private
	 * @param {Event} event  The popstate event
	 */
	var popstateHandler = function (event) {
		var url = event.state && event.state.url ? event.state.url : window.location.href;
		fetchContent(url);
	};

	/**
	 * Handle for submit events
	 * Currently only used for Search form, but may be expanded in the future
	 * @private
	 * @param {Event} event  The form submit event
	 */
	var submitHandler = function (event) {

		// Bail if form isn't search or Ajax is disabled
		if (!event.target.closest('#search-form') || !settings.ajax) return;

		// Get search form input field
		var input = event.target.querySelector('#search-input');
		if (!input) return;

		// Prevent default form event
		event.preventDefault();

		// Fetch the search results page
		fetchContent(paths['{{path.search}}']() + '?q=' + encodeURIComponent(input.value), true);

	};

	/**
	 * Render the Portal
	 * @public
	 * @param {Boolean} ajax  If true, the page is being loaded via Ajax
	 */
	m$.renderPortal = function (ajax) {
		settings.callbacks.beforeRender(); // Run beforeRender() callback
		document.documentElement.classList.add('rendering'); // Add rendering class to the DOM
		renderHead(ajax); // <head> attributes
		m$.addStyleHooks(); // Content-specific classes
		m$.renderLayout(); // Layout
		m$.renderUserNav(); // User Navigation
		m$.renderPrimaryNav(); // Primary Navigation
		m$.renderSecondaryNav(); // Secondary Navigation
		m$.renderMain(); // Main Content
		m$.renderTitle(); // Page Title
		m$.renderFooter(); // Footer
		m$.renderCleanup(); // Cleanup DOM
		m$.fixLocation(); // Jump to anchor
		settings.callbacks.afterRender(); // Run afterRender() callback
		document.documentElement.classList.remove('loading'); // Remove loading class from the DOM
		document.documentElement.classList.remove('rendering'); // Remove rendering class from the DOM
	};

	/**
	* Initialize
	* @public
	* @param {object} options User options and overrides
	*/
	m$.init = function (options) {

		m$.loadJS('https://cdn.polyfill.io/v2/polyfill.min.js?features=default', (function () {

			// Merge user options with defaults
			settings = extend( defaults, options || {} );

			// Run callback before initializing
			settings.callbacks.beforeInit();

			// Render the Portal
			m$.renderPortal();

			// Listen for click events
			document.addEventListener('click', clickHandler, false);

			if (settings.ajax) {
				window.addEventListener('popstate', popstateHandler, false);
				window.addEventListener('submit', submitHandler, false);
			}

			// Run callback after initializing
			settings.callbacks.afterInit();

		}));

	};


	//
	// Public APIs
	//

	return m$;

})();