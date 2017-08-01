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
		return scope.querySelector(selector) || document.createElement('null');
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