/*! blackbeard vbeta | (c) 2017 Chris Ferdinandi | LicenseRef-All Rights Reserved License | http://github.com/mashery/blackbeard */
/*!
 * BetterDocs.js v1.0.0
 * Create better static documentation.
 * (c) 2017 TIBCO Software Inc.
 * Written by Chris Ferdinandi
 * All Rights Reserved
 */

(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define([], (function () {
			return factory(root);
		}));
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.BetterDocs = factory(root);
	}
})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this, (function (window) {

	'use strict';

	//
	// Feature Test
	//

	var supports =
		'querySelector' in document &&
		'addEventListener' in window &&
		'closest' in window.Element.prototype;


	//
	// Default settings
	//

	var defaults = {
		// Selectors
		selectorNav: '.nav-lang',
		selectorTOCNav: '.nav-toc',
		selectorTOCHeadings: 'h2, h3, h4, h5, h6',

		// Content
		tocHeading: '',

		// Languages
		langs: {},
		langDefault: null
	};


	//
	// Utility Methods
	//

	/**
	 * Merge two or more objects. Returns a new object.
	 * @param {Object}   objects  The objects to merge together
	 * @returns {Object}          Merged values of defaults and options
	 */
	var extend = function () {

		// Variables
		var extended = {};
		var i = 0;
		var length = arguments.length;

		// Merge the object into the extended object
		var merge = function (obj) {
			for (var prop in obj) {
				if (obj.hasOwnProperty(prop)) {
					extended[prop] = obj[prop];
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
	 * Create a valid ID from a heading's content
	 * @param  {Node}   heading  The heading
	 * @return {string}          The ID
	 */
	var createID = function (heading) {
		return 'toc-' + heading.innerText.toLowerCase().replace(/^[^a-z]+|[^\w:.-]+/g, '-');
	};

	/**
	 * Add a sub-item to the navigation list
	 * @param {Node}   heading     The heading element
	 * @param {Number} difference  The difference between the current and last heading
	 */
	var addSubItem = function (heading, difference) {
		var i = Math.abs(difference);
		var toc = '';
		while (i > 0) {
			toc += '<ul>';
			i--;
		}
		return toc;
	};

	/**
	 * Close a sub-item from the navigation list
	 * @param {Node}   heading     The heading element
	 * @param {Number} difference  The difference between the current and last heading
	 */
	var closeSubItem = function (heading, difference) {
		var i = Math.abs(difference);
		var toc = '';
		while (i > 0) {
			toc += '</li></ul>';
			i--;
		}
		return toc;
	};

	var createStyles = function (langs) {

		// Variables
		var ref = document.querySelector('script');
		var css = document.createElement('style');
		var selectors = [];

		// Create classes
		langs.forEach((function (lang) {
			var classes = lang.selector.split(',');
			classes.forEach((function (className) {
				selectors.push('pre.lang-' + className.trim());
				selectors.push('pre.language-' + className.trim());
			}));
		}));

		css.innerHTML =
			selectors.join(',') + '{display:none;visibility:hidden;}' +
			selectors.join('.active,') + '.active{display:block;visibility:visible;}';

		ref.before(css);

	};


	//
	// BetterDocs Constructor
	//

	var BetterDocs = function (selector, options) {

		//
		// Variables
		//

		var betterDocs = {}; // Object for public APIs
		var settings, content;


		//
		// Methods
		//

		/**
		 * Render the Table of Contents
		 */
		var createTOC = function () {

			var headings = content.querySelectorAll(settings.selectorTOCHeadings);
			var toc = document.querySelector(settings.selectorTOCNav);
			var list = '';
			var last, current, close;

			console.log(headings);

			if (!toc) return;

			headings.forEach((function (heading) {

				// Get current heading position
				current = parseInt(heading.tagName.substring(1), 10);
				close = '</li>';

				// If first loop, set last to current
				if (!last) {
					close = '';
					last = current;
				}

				// Create an ID if the heading is missing one
				if (!heading.id || heading.id.length < 1) {
					heading.id = createID(headings[i]);
				}

				// Get difference between last and current
				var difference = current - last;

				if (difference > 0) {
					list += addSubItem(heading, difference);
				} else if (difference < 0) {
					list += closeSubItem(heading, difference);
				}

				list += close + '<li><a href="#' + heading.id + '">' + heading.innerText + '</a>';

				// Update last position
				last = current;

			}));

			toc.innerHTML = settings.tocHeading + '<ul>' + list + '</ul>';

		};

		/**
		 * Initialize the Table of Contents
		 * @param {Object} options User settings
		 */
		betterDocs.init = function (options) {

			// feature test
			if (!supports) return;

			// Selectors and variables
			settings = extend(defaults, options || {}); // Merge user options with defaults
			content = document.querySelector(selector);

			// Bail if content container doesn't exist
			if (!content) return;

			// Create Table of Contents
			createTOC();

			// Add inline styles
			if (settings.langs.length > 0) {
				createStyles(settings.langs);
			}

		};


		//
		// Initialize plugin
		//

		betterDocs.init(options);


		//
		// Public APIs
		//

		return betterDocs;

	};

	return BetterDocs;

}));