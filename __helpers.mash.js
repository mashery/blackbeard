var m$ = (function () {

	'use strict';

	//
	// Variables
	//

	var m$ = {}; // Placeholder for public methods


	//
	// Polyfills
	//

	// NodeList.prototype.forEach()
	if (window.NodeList && !NodeList.prototype.forEach) {
		NodeList.prototype.forEach = function (callback, thisArg) {
			thisArg = thisArg || window;
			for (var i = 0; i < this.length; i++) {
				callback.call(thisArg, this[i], i, this);
			}
		};
	}

	// Object.prototype.forEach()
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


	//
	// Methods
	//

	m$.get = function (selector, scope) {
		scope = scope || document;
		return scope.querySelector(selector) || document.createElement('_');
	};

	m$.getAll = function (selector, scope) {
		scope = scope || document;
		return Array.prototype.slice.call(scope.querySelectorAll(selector));
	}

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

	m$.on = function (event, elem, callback, capture) {
		if (typeof (elem) === 'function') {
			capture = callback;
			callback = elem;
			elem = window;
		}
		capture = capture ? true : false;
		elem.addEventListener(event, callback, capture);
	};

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
	 * @param  {Boolean}  reload    If true, reload the script if it's already in the DOM
	 * @return {Node}               The script
	 */
	m$.loadJS = function (src, callback, reload) {
		'use strict';
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
	 * loadCSS: load a CSS file asynchronously.
	 * @copyright 2014 @scottjehl, Filament Group, Inc.
	 * @license MIT
	 * @link https://github.com/filamentgroup/loadCSS
	 * @param  {String} href    The URL for your CSS file
	 * @param  {Node}   before  The element to use as a reference for injecting your <link> [optional]
	 * @param  {String} media   The stylesheet media type [optional, default: all]
	 * @return {Node}           The stylesheet
	 */
	m$.loadCSS = function (href, before, media) {
		// Bail if stylesheet already exists
		if (document.querySelector('link[href*="' + href + '"]')) return;
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

	m$.addQueryString = function (url, key, value) {
		return (/[\?]/.test(url) ? '&' : '?') + key + '=' + value;
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
		var i = 0;
		var length = arguments.length;

		// Check if a deep merge
		if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
			deep = arguments[0];
			i++;
		}

		// Merge the object into the extended object
		var merge = function (obj) {
			for (var prop in obj) {
				if (Object.prototype.hasOwnProperty.call(obj, prop)) {
					// If deep merge and property is an object, merge properties
					if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
						extended[prop] = extend(true, extended[prop], obj[prop]);
					} else {
						extended[prop] = obj[prop];
					}
				}
			}
		};

		// Loop through each object and conduct a merge
		for (; i < length; i++) {
			var obj = arguments[i];
			merge(obj);
		}

		return extended;

	};


	//
	// Public APIs
	//

	return m$;

})();