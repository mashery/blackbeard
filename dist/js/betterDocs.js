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

		// Only run on certain pages
		restrictToPages: 'docs',

		// Table of Contents
		tocSelector: 'h2, h3, h4, h5, h6',
		tocHeading: '',
		tocLocation: '#nav-docs',
		currentPageSelector: '.current-page',
		tocLocationReplace: false,

		// Languages
		langs: null,
		langDefault: null,
		langsNav: '.better-docs-nav',

		// Styles
		wideLayout: false,
		wideLayoutBg: true,
		initClass: 'better-docs',
		wideLayoutClass: 'better-docs-wide',
		wideLayoutBgClass: 'better-docs-wide-bg',
		contentClassSuffix: '-content'

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
		var toc = '';
		for (var i = Math.abs(difference); i > 0; i--) {
			toc += '<ul>';
		}
		return toc;
	};

	/**
	 * Close a sub-item from the navigation list
	 * @param {Node}   heading     The heading element
	 * @param {Number} difference  The difference between the current and last heading
	 */
	var closeSubItem = function (heading, difference) {
		var toc = '';
		for (var i = Math.abs(difference); i > 0; i--) {
			toc += '</li></ul>';
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

	var createLangNav = function (langs, selector) {
		var list = '';
		langs.forEach((function (lang, key) {
			list += '<li><a role="button" data-lang="' + key + '" href="#lang-' + key + '">' + lang.title + '</a></li>';
		}));
		document.querySelectorAll(selector).forEach((function (langNav) {
			langNav.innerHTML = '<ul>' + list + '</ul>';
		}));

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
		 * Check if the page is one that the script should run on
		 * @return {Boolean} [description]
		 */
		var isSupportedPage = function () {

			// If a restricted page is set
			if (settings.restrictToPages) {

				// If it's not an array, convert it to one
				if (Object.prototype.toString.call(settings.restrictToPages) !== '[object Array]') {
					var temp = settings.restrictToPages;
					settings.restrictToPages = [];
					settings.restrictToPages.push(temp);
				}

				// Return `false` if the contentType and contentId don't match any allowed pages
				if (
					settings.restrictToPages.indexOf(window.mashery.contentType) === -1 &&
					settings.restrictToPages.indexOf(window.mashery.contentId) === -1
				) return false;
			}

			// Otherwise return true
			return true;

		};

		/**
		 * Render the Table of Contents
		 */
		var createTOC = function () {

			var headings = content.querySelectorAll(settings.tocSelector);
			var toc = settings.tocLocationReplace ? document.querySelector(settings.tocLocation) : document.querySelector(settings.tocLocation + ' ' + settings.currentPageSelector);
			var list = '';
			var last, current, close;

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

			if (settings.tocLocationReplace) {
				toc.innerHTML = settings.tocHeading + '<ul>' + list + '</ul>';
			} else {
				toc.innerHTML += settings.tocHeading + '<ul>' + list + '</ul>';
			}

		};

		var toggleLang = function (active) {
			var currentLang = document.querySelectorAll('[class*="lang-"].active, [class*="language-"].active, ' + settings.langsNav + ' a.active');

			var classes = settings.langs[active].selector.split(',');
			var selectors = [];
			classes.forEach((function (className) {
				selectors.push('.lang-' + className.trim());
				selectors.push('.language-' + className.trim());
			}));

			var newLang = document.querySelectorAll(selectors.join(',') + ',' + settings.langsNav + ' [data-lang="' + active + '"]');

			currentLang.forEach((function (lang) {
				lang.classList.remove('active');
			}));

			newLang.forEach((function (lang) {
				lang.classList.add('active');
			}));
		};

		var clickHandler = function (event) {
			var toggle = event.target.closest(settings.langsNav + ' a');
			if (!toggle) return;
			event.preventDefault();
			toggleLang(toggle.getAttribute('data-lang'));
		};

		betterDocs.destroy = function () {

			// If plugin isn't already initialized, stop
			if (!settings) return;

			// Remove event listeners
			document.removeEventListener('click', clickHandler, false);

			// Remove classes
			document.documentElement.classList.remove(settings.initClass);
			document.documentElement.classList.remove(settings.wideLayoutClass);
			document.documentElement.classList.remove(settings.wideLayoutBgClass);
			if (content) {
				content.classList.remove(settings.initClass + settings.contentClassSuffix);
				content.classList.remove(settings.wideLayoutClass + settings.contentClassSuffix);
			}

			// Reset variables
			settings = null;
			content = null;

			// @todo remove ToC

		};

		/**
		 * Initialize the Table of Contents
		 * @param {Object} options User settings
		 */
		betterDocs.init = function (options) {

			// feature test
			if (!supports) return;

			// Destroy any existing initializations
			betterDocs.destroy();

			// Merge defaults with user options
			settings = extend(defaults, options || {});

			// Make sure should run on this page
			if (!isSupportedPage()) return;

			// Get the content container
			content = document.querySelector(selector);
			if (!content) return;

			// Add initialization class
			document.documentElement.classList.add(settings.initClass);
			content.classList.add(settings.initClass + settings.contentClassSuffix);

			// If wide layout, add wide class
			if (settings.wideLayout) {
				document.documentElement.classList.add(settings.wideLayoutClass);
				content.classList.add(settings.wideLayoutClass + settings.contentClassSuffix);

				if (settings.wideLayoutBg) {
					document.documentElement.classList.add(settings.wideLayoutBgClass);
				}
			}

			// Create Table of Contents
			createTOC();

			// Create language navigation
			createLangNav(settings.langs, settings.langsNav);

			// Add inline styles
			if (settings.langs) {
				createStyles(settings.langs);
			}

			// Listen for click events
			document.addEventListener('click', clickHandler, false);

			// Set a default language
			if (settings.langDefault) {
				toggleLang(settings.langDefault);
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