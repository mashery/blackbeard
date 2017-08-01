var m$ = (function () {

	'use strict';

	//
	// Variables
	//

	var m$ = {}; // Placeholder for public methods


	//
	// Polyfills
	//

	// Object.prototype.forEach()
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


	//
	// Methods
	//

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
		// Arguments explained:
		// `href` is the URL for your CSS file.
		// `before` optionally defines the element we'll use as a reference for injecting our <link>
		// By default, `before` uses the first <script> element in the page.
		// However, since the order in which stylesheets are referenced matters, you might need a more specific location in your document.
		// If so, pass a different reference element to the `before` argument and it'll insert before that instead
		// note: `insertBefore` is used instead of `appendChild`, for safety re: http://www.paulirish.com/2011/surefire-dom-element-insertion/
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
		atts.forEach(function (value, key) {
			elem.setAttribute(key, value);
		});

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
			obj.forEach(function(prop, key) {
				// If deep merge and property is an object, merge properties
				if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
					extended[key] = extend(true, extended[key], prop);
				} else {
					extended[key] = prop;
				}
			});
		};

		// Loop through each object and conduct a merge
		arguments.forEach(function (obj) {
			merge(obj);
		});

		return extended;

	};


	//
	// Public APIs
	//

	return m$;

})();