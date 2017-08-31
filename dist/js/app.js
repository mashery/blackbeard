/*!
 * blackbeard v0.2.0: Future portal layout
 * (c) 2017 Chris Ferdinandi
 * LicenseRef-All Rights Reserved License
 * http://github.com/mashery/blackbeard
 */

/**
 * CustomEvent() polyfill
 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
 */
(function () {

	if (typeof window.CustomEvent === "function") return false;

	function CustomEvent(event, params) {
		params = params || { bubbles: false, cancelable: false, detail: undefined };
		var evt = document.createEvent('CustomEvent');
		evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
		return evt;
	}

	CustomEvent.prototype = window.Event.prototype;

	window.CustomEvent = CustomEvent;
})();
/**
 * ChildNode.after() polyfill
 */
//from: https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/after()/after().md
(function (arr) {
	arr.forEach((function (item) {
		if (item.hasOwnProperty('after')) {
			return;
		}
		Object.defineProperty(item, 'after', {
			configurable: true,
			enumerable: true,
			writable: true,
			value: function after() {
				var argArr = Array.prototype.slice.call(arguments),
					docFrag = document.createDocumentFragment();

				argArr.forEach((function (argItem) {
					var isNode = argItem instanceof Node;
					docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
				}));

				this.parentNode.insertBefore(docFrag, this.nextSibling);
			}
		});
	}));
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);
/**
 * ParentNode.append() polyfill
 */
// Source: https://github.com/jserz/js_piece/blob/master/DOM/ParentNode/append()/append().md
(function (arr) {
	arr.forEach((function (item) {
		if (item.hasOwnProperty('append')) {
			return;
		}
		Object.defineProperty(item, 'append', {
			configurable: true,
			enumerable: true,
			writable: true,
			value: function append() {
				var argArr = Array.prototype.slice.call(arguments),
					docFrag = document.createDocumentFragment();

				argArr.forEach((function (argItem) {
					var isNode = argItem instanceof Node;
					docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
				}));

				this.appendChild(docFrag);
			}
		});
	}));
})([Element.prototype, Document.prototype, DocumentFragment.prototype]);
/**
 * Array.prototype.forEach() polyfill
 * @author Chris Ferdinandi
 * @license MIT
 */
if (window.Array && !Array.prototype.forEach) {
	Array.prototype.forEach = function (callback, thisArg) {
		thisArg = thisArg || window;
		for (var i = 0; i < this.length; i++) {
			callback.call(thisArg, this[i], i, this);
		}
	};
}
/**
 * ChildNode.before() polyfill
 */
// from: https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/before()/before().md
(function (arr) {
	arr.forEach((function (item) {
		if (item.hasOwnProperty('before')) {
			return;
		}
		Object.defineProperty(item, 'before', {
			configurable: true,
			enumerable: true,
			writable: true,
			value: function before() {
				var argArr = Array.prototype.slice.call(arguments),
					docFrag = document.createDocumentFragment();

				argArr.forEach((function (argItem) {
					var isNode = argItem instanceof Node;
					docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
				}));

				this.parentNode.insertBefore(docFrag, this);
			}
		});
	}));
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);
/*
 * classList.js: Cross-browser full element.classList implementation.
 * 1.1.20170427
 *
 * By Eli Grey, http://eligrey.com
 * License: Dedicated to the public domain.
 *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */

if ("document" in self) {

	// Full polyfill for browsers with no classList support
	// Including IE < Edge missing SVGElement.classList
	if (!("classList" in document.createElement("_"))
		|| document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg", "g"))) {

		(function (view) {

			"use strict";

			if (!('Element' in view)) return;

			var
				classListProp = "classList"
				, protoProp = "prototype"
				, elemCtrProto = view.Element[protoProp]
				, objCtr = Object
				, strTrim = String[protoProp].trim || function () {
					return this.replace(/^\s+|\s+$/g, "");
				}
				, arrIndexOf = Array[protoProp].indexOf || function (item) {
					var
						i = 0
						, len = this.length
						;
					for (; i < len; i++) {
						if (i in this && this[i] === item) {
							return i;
						}
					}
					return -1;
				}
				// Vendors: please allow content code to instantiate DOMExceptions
				, DOMEx = function (type, message) {
					this.name = type;
					this.code = DOMException[type];
					this.message = message;
				}
				, checkTokenAndGetIndex = function (classList, token) {
					if (token === "") {
						throw new DOMEx(
							"SYNTAX_ERR"
							, "An invalid or illegal string was specified"
						);
					}
					if (/\s/.test(token)) {
						throw new DOMEx(
							"INVALID_CHARACTER_ERR"
							, "String contains an invalid character"
						);
					}
					return arrIndexOf.call(classList, token);
				}
				, ClassList = function (elem) {
					var
						trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
						, classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
						, i = 0
						, len = classes.length
						;
					for (; i < len; i++) {
						this.push(classes[i]);
					}
					this._updateClassName = function () {
						elem.setAttribute("class", this.toString());
					};
				}
				, classListProto = ClassList[protoProp] = []
				, classListGetter = function () {
					return new ClassList(this);
				}
				;
			// Most DOMException implementations don't allow calling DOMException's toString()
			// on non-DOMExceptions. Error's toString() is sufficient here.
			DOMEx[protoProp] = Error[protoProp];
			classListProto.item = function (i) {
				return this[i] || null;
			};
			classListProto.contains = function (token) {
				token += "";
				return checkTokenAndGetIndex(this, token) !== -1;
			};
			classListProto.add = function () {
				var
					tokens = arguments
					, i = 0
					, l = tokens.length
					, token
					, updated = false
					;
				do {
					token = tokens[i] + "";
					if (checkTokenAndGetIndex(this, token) === -1) {
						this.push(token);
						updated = true;
					}
				}
				while (++i < l);

				if (updated) {
					this._updateClassName();
				}
			};
			classListProto.remove = function () {
				var
					tokens = arguments
					, i = 0
					, l = tokens.length
					, token
					, updated = false
					, index
					;
				do {
					token = tokens[i] + "";
					index = checkTokenAndGetIndex(this, token);
					while (index !== -1) {
						this.splice(index, 1);
						updated = true;
						index = checkTokenAndGetIndex(this, token);
					}
				}
				while (++i < l);

				if (updated) {
					this._updateClassName();
				}
			};
			classListProto.toggle = function (token, force) {
				token += "";

				var
					result = this.contains(token)
					, method = result ?
						force !== true && "remove"
						:
						force !== false && "add"
					;

				if (method) {
					this[method](token);
				}

				if (force === true || force === false) {
					return force;
				} else {
					return !result;
				}
			};
			classListProto.toString = function () {
				return this.join(" ");
			};

			if (objCtr.defineProperty) {
				var classListPropDesc = {
					get: classListGetter
					, enumerable: true
					, configurable: true
				};
				try {
					objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
				} catch (ex) { // IE 8 doesn't support enumerable:true
					// adding undefined to fight this issue https://github.com/eligrey/classList.js/issues/36
					// modernie IE8-MSW7 machine has IE8 8.0.6001.18702 and is affected
					if (ex.number === undefined || ex.number === -0x7FF5EC54) {
						classListPropDesc.enumerable = false;
						objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
					}
				}
			} else if (objCtr[protoProp].__defineGetter__) {
				elemCtrProto.__defineGetter__(classListProp, classListGetter);
			}

		}(self));

	}

	// There is full or partial native classList support, so just check if we need
	// to normalize the add/remove and toggle APIs.

	(function () {
		"use strict";

		var testElement = document.createElement("_");

		testElement.classList.add("c1", "c2");

		// Polyfill for IE 10/11 and Firefox <26, where classList.add and
		// classList.remove exist but support only one argument at a time.
		if (!testElement.classList.contains("c2")) {
			var createMethod = function (method) {
				var original = DOMTokenList.prototype[method];

				DOMTokenList.prototype[method] = function (token) {
					var i, len = arguments.length;

					for (i = 0; i < len; i++) {
						token = arguments[i];
						original.call(this, token);
					}
				};
			};
			createMethod('add');
			createMethod('remove');
		}

		testElement.classList.toggle("c3", false);

		// Polyfill for IE 10 and Firefox <24, where classList.toggle does not
		// support the second argument.
		if (testElement.classList.contains("c3")) {
			var _toggle = DOMTokenList.prototype.toggle;

			DOMTokenList.prototype.toggle = function (token, force) {
				if (1 in arguments && !this.contains(token) === !force) {
					return force;
				} else {
					return _toggle.call(this, token);
				}
			};

		}

		testElement = null;
	}());

}
/**
 * Element.matches() and Element.closest() polyfills
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
 */

if (!Element.prototype.matches) {
	Element.prototype.matches =
		Element.prototype.matchesSelector ||
		Element.prototype.mozMatchesSelector ||
		Element.prototype.msMatchesSelector ||
		Element.prototype.oMatchesSelector ||
		Element.prototype.webkitMatchesSelector ||
		function (s) {
			var matches = (this.document || this.ownerDocument).querySelectorAll(s),
				i = matches.length;
			while (--i >= 0 && matches.item(i) !== this) { }
			return i > -1;
		};
}

if (!Element.prototype.closest) {
	Element.prototype.closest = function (s) {
		var el = this;
		var ancestor = this;
		if (!document.documentElement.contains(el)) return null;
		do {
			if (ancestor.matches(s)) return ancestor;
			ancestor = ancestor.parentElement;
		} while (ancestor !== null);
		return null;
	};
}
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
 * https://gomakethings.com/looping-through-objects-with-es6/
 * @author Chris Ferdinandi
 * @license MIT
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
/**
 * Object.keys() polyfill
 */
// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
	Object.keys = (function () {
		'use strict';
		var hasOwnProperty = Object.prototype.hasOwnProperty,
			hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
			dontEnums = [
				'toString',
				'toLocaleString',
				'valueOf',
				'hasOwnProperty',
				'isPrototypeOf',
				'propertyIsEnumerable',
				'constructor'
			],
			dontEnumsLength = dontEnums.length;

		return function (obj) {
			if (typeof obj !== 'function' && (typeof obj !== 'object' || obj === null)) {
				throw new TypeError('Object.keys called on non-object');
			}

			var result = [], prop, i;

			for (prop in obj) {
				if (hasOwnProperty.call(obj, prop)) {
					result.push(prop);
				}
			}

			if (hasDontEnumBug) {
				for (i = 0; i < dontEnumsLength; i++) {
					if (hasOwnProperty.call(obj, dontEnums[i])) {
						result.push(dontEnums[i]);
					}
				}
			}
			return result;
		};
	}());
}
/**
 * ParentNode.prepend() polyfill
 */
// Source: https://github.com/jserz/js_piece/blob/master/DOM/ParentNode/prepend()/prepend().md
(function (arr) {
	arr.forEach((function (item) {
		if (item.hasOwnProperty('prepend')) {
			return;
		}
		Object.defineProperty(item, 'prepend', {
			configurable: true,
			enumerable: true,
			writable: true,
			value: function prepend() {
				var argArr = Array.prototype.slice.call(arguments),
					docFrag = document.createDocumentFragment();

				argArr.forEach((function (argItem) {
					var isNode = argItem instanceof Node;
					docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
				}));

				this.insertBefore(docFrag, this.firstChild);
			}
		});
	}));
})([Element.prototype, Document.prototype, DocumentFragment.prototype]);
/**
 * ChildNode.remove() polyfill
 */
// from:https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md
(function (arr) {
	arr.forEach((function (item) {
		if (item.hasOwnProperty('remove')) {
			return;
		}
		Object.defineProperty(item, 'remove', {
			configurable: true,
			enumerable: true,
			writable: true,
			value: function remove() {
				this.parentNode.removeChild(this);
			}
		});
	}));
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);
/*!
 * atomic v3.2.0: Vanilla JavaScript Ajax requests with chained success/error callbacks and JSON parsing
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
			for (var prop in obj) {
				if (Object.prototype.hasOwnProperty.call(obj, prop)) {
					if (Object.prototype.toString.call(obj[prop]) === '[object Object]') {
						extended[prop] = extend(true, extended[prop], obj[prop]);
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
	 * @param  {Object|Array|String} obj The object
	 * @return {String}                  The query string
	 */
	var param = function (obj) {
		if (typeof (obj) === 'string') return obj;
		if (/application\/json/i.test(settings.headers['Content-type']) || Object.prototype.toString.call(obj) === '[object Array]') return JSON.stringify(obj);
		var encoded = [];
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				encoded.push(encodeURIComponent(prop) + '=' + encodeURIComponent(obj[prop]));
			}
		}
		return encoded.join('&');
	};

	/**
	 * Make an XML HTTP request
	 * @private
	 * @return {Object} Chained success/error/always methods
	 */
	var xhr = function () {

		// Our default methods
		var methods = {
			success: function () { },
			error: function () { },
			always: function () { }
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
			if (request.readyState !== 4) return;

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
		var ref = root.document.getElementsByTagName('script')[0];
		var script = root.document.createElement('script');
		settings.data.callback = settings.callback;
		script.src = settings.url + (settings.url.indexOf('?') + 1 ? '&' : '?') + param(settings.data);

		// Insert script tag into the DOM (append to <head>)
		ref.parentNode.insertBefore(script, ref);

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
		if (!supports) return;

		// Merge user options with defaults
		settings = extend(defaults, options || {});

		// Make our Ajax or JSONP request
		return (settings.type.toLowerCase() === 'jsonp' ? jsonp() : xhr());

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
		if (info.classList.contains('active')) {
			info.focus();
		}
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
			mashtip.innerHTML += '<span class="mashtip-info tabindex" tabindex="-1">' + mashtip.getAttribute('title') + '</span>';
			mashtip.setAttribute('role', 'button');
			mashtip.setAttribute('tabindex', '-1');
		}));
	};

	var revertMaships = function () {
		var mashtipInfo = document.querySelectorAll('.mashtip-info');
		mashtipInfo.forEach((function (info) {
			info.remove();
		}));
		if (!mashtips) return;
		mashtips.forEach((function (mashtip) {
			mashtip.removeAttribute('role');
			mashtip.removeAttribute('tabindex');
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
		var fields = document.querySelectorAll('#passwd_requirements .' + valid + ', ' + pwNew + ', ' + pwConfirm);
		fields.forEach((function (field) {
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
;/*! showdown v 1.7.3 - 23-08-2017 */
(function(){
/**
 * Created by Tivie on 13-07-2015.
 */

function getDefaultOpts (simple) {
  'use strict';

  var defaultOptions = {
    omitExtraWLInCodeBlocks: {
      defaultValue: false,
      describe: 'Omit the default extra whiteline added to code blocks',
      type: 'boolean'
    },
    noHeaderId: {
      defaultValue: false,
      describe: 'Turn on/off generated header id',
      type: 'boolean'
    },
    prefixHeaderId: {
      defaultValue: false,
      describe: 'Add a prefix to the generated header ids. Passing a string will prefix that string to the header id. Setting to true will add a generic \'section-\' prefix',
      type: 'string'
    },
    rawPrefixHeaderId: {
      defaultValue: false,
      describe: 'Setting this option to true will prevent showdown from modifying the prefix. This might result in malformed IDs (if, for instance, the " char is used in the prefix)',
      type: 'boolean'
    },
    ghCompatibleHeaderId: {
      defaultValue: false,
      describe: 'Generate header ids compatible with github style (spaces are replaced with dashes, a bunch of non alphanumeric chars are removed)',
      type: 'boolean'
    },
    rawHeaderId: {
      defaultValue: false,
      describe: 'Remove only spaces, \' and " from generated header ids (including prefixes), replacing them with dashes (-). WARNING: This might result in malformed ids',
      type: 'boolean'
    },
    headerLevelStart: {
      defaultValue: false,
      describe: 'The header blocks level start',
      type: 'integer'
    },
    parseImgDimensions: {
      defaultValue: false,
      describe: 'Turn on/off image dimension parsing',
      type: 'boolean'
    },
    simplifiedAutoLink: {
      defaultValue: false,
      describe: 'Turn on/off GFM autolink style',
      type: 'boolean'
    },
    excludeTrailingPunctuationFromURLs: {
      defaultValue: false,
      describe: 'Excludes trailing punctuation from links generated with autoLinking',
      type: 'boolean'
    },
    literalMidWordUnderscores: {
      defaultValue: false,
      describe: 'Parse midword underscores as literal underscores',
      type: 'boolean'
    },
    literalMidWordAsterisks: {
      defaultValue: false,
      describe: 'Parse midword asterisks as literal asterisks',
      type: 'boolean'
    },
    strikethrough: {
      defaultValue: false,
      describe: 'Turn on/off strikethrough support',
      type: 'boolean'
    },
    tables: {
      defaultValue: false,
      describe: 'Turn on/off tables support',
      type: 'boolean'
    },
    tablesHeaderId: {
      defaultValue: false,
      describe: 'Add an id to table headers',
      type: 'boolean'
    },
    ghCodeBlocks: {
      defaultValue: true,
      describe: 'Turn on/off GFM fenced code blocks support',
      type: 'boolean'
    },
    tasklists: {
      defaultValue: false,
      describe: 'Turn on/off GFM tasklist support',
      type: 'boolean'
    },
    smoothLivePreview: {
      defaultValue: false,
      describe: 'Prevents weird effects in live previews due to incomplete input',
      type: 'boolean'
    },
    smartIndentationFix: {
      defaultValue: false,
      description: 'Tries to smartly fix indentation in es6 strings',
      type: 'boolean'
    },
    disableForced4SpacesIndentedSublists: {
      defaultValue: false,
      description: 'Disables the requirement of indenting nested sublists by 4 spaces',
      type: 'boolean'
    },
    simpleLineBreaks: {
      defaultValue: false,
      description: 'Parses simple line breaks as <br> (GFM Style)',
      type: 'boolean'
    },
    requireSpaceBeforeHeadingText: {
      defaultValue: false,
      description: 'Makes adding a space between `#` and the header text mandatory (GFM Style)',
      type: 'boolean'
    },
    ghMentions: {
      defaultValue: false,
      description: 'Enables github @mentions',
      type: 'boolean'
    },
    ghMentionsLink: {
      defaultValue: 'https://github.com/{u}',
      description: 'Changes the link generated by @mentions. Only applies if ghMentions option is enabled.',
      type: 'string'
    },
    encodeEmails: {
      defaultValue: true,
      description: 'Encode e-mail addresses through the use of Character Entities, transforming ASCII e-mail addresses into its equivalent decimal entities',
      type: 'boolean'
    },
    openLinksInNewWindow: {
      defaultValue: false,
      description: 'Open all links in new windows',
      type: 'boolean'
    },
    backslashEscapesHTMLTags: {
      defaultValue: false,
      description: 'Support for HTML Tag escaping. ex: \<div>foo\</div>',
      type: 'boolean'
    }
  };
  if (simple === false) {
    return JSON.parse(JSON.stringify(defaultOptions));
  }
  var ret = {};
  for (var opt in defaultOptions) {
    if (defaultOptions.hasOwnProperty(opt)) {
      ret[opt] = defaultOptions[opt].defaultValue;
    }
  }
  return ret;
}

function allOptionsOn () {
  'use strict';
  var options = getDefaultOpts(true),
      ret = {};
  for (var opt in options) {
    if (options.hasOwnProperty(opt)) {
      ret[opt] = true;
    }
  }
  return ret;
}

/**
 * Created by Tivie on 06-01-2015.
 */

// Private properties
var showdown = {},
    parsers = {},
    extensions = {},
    globalOptions = getDefaultOpts(true),
    setFlavor = 'vanilla',
    flavor = {
      github: {
        omitExtraWLInCodeBlocks:              true,
        simplifiedAutoLink:                   true,
        excludeTrailingPunctuationFromURLs:   true,
        literalMidWordUnderscores:            true,
        strikethrough:                        true,
        tables:                               true,
        tablesHeaderId:                       true,
        ghCodeBlocks:                         true,
        tasklists:                            true,
        disableForced4SpacesIndentedSublists: true,
        simpleLineBreaks:                     true,
        requireSpaceBeforeHeadingText:        true,
        ghCompatibleHeaderId:                 true,
        ghMentions:                           true,
        backslashEscapesHTMLTags:             true
      },
      original: {
        noHeaderId:                           true,
        ghCodeBlocks:                         false
      },
      ghost: {
        omitExtraWLInCodeBlocks:              true,
        parseImgDimensions:                   true,
        simplifiedAutoLink:                   true,
        excludeTrailingPunctuationFromURLs:   true,
        literalMidWordUnderscores:            true,
        strikethrough:                        true,
        tables:                               true,
        tablesHeaderId:                       true,
        ghCodeBlocks:                         true,
        tasklists:                            true,
        smoothLivePreview:                    true,
        simpleLineBreaks:                     true,
        requireSpaceBeforeHeadingText:        true,
        ghMentions:                           false,
        encodeEmails:                         true
      },
      vanilla: getDefaultOpts(true),
      allOn: allOptionsOn()
    };

/**
 * helper namespace
 * @type {{}}
 */
showdown.helper = {};

/**
 * TODO LEGACY SUPPORT CODE
 * @type {{}}
 */
showdown.extensions = {};

/**
 * Set a global option
 * @static
 * @param {string} key
 * @param {*} value
 * @returns {showdown}
 */
showdown.setOption = function (key, value) {
  'use strict';
  globalOptions[key] = value;
  return this;
};

/**
 * Get a global option
 * @static
 * @param {string} key
 * @returns {*}
 */
showdown.getOption = function (key) {
  'use strict';
  return globalOptions[key];
};

/**
 * Get the global options
 * @static
 * @returns {{}}
 */
showdown.getOptions = function () {
  'use strict';
  return globalOptions;
};

/**
 * Reset global options to the default values
 * @static
 */
showdown.resetOptions = function () {
  'use strict';
  globalOptions = getDefaultOpts(true);
};

/**
 * Set the flavor showdown should use as default
 * @param {string} name
 */
showdown.setFlavor = function (name) {
  'use strict';
  if (!flavor.hasOwnProperty(name)) {
    throw Error(name + ' flavor was not found');
  }
  showdown.resetOptions();
  var preset = flavor[name];
  setFlavor = name;
  for (var option in preset) {
    if (preset.hasOwnProperty(option)) {
      globalOptions[option] = preset[option];
    }
  }
};

/**
 * Get the currently set flavor
 * @returns {string}
 */
showdown.getFlavor = function () {
  'use strict';
  return setFlavor;
};

/**
 * Get the options of a specified flavor. Returns undefined if the flavor was not found
 * @param {string} name Name of the flavor
 * @returns {{}|undefined}
 */
showdown.getFlavorOptions = function (name) {
  'use strict';
  if (flavor.hasOwnProperty(name)) {
    return flavor[name];
  }
};

/**
 * Get the default options
 * @static
 * @param {boolean} [simple=true]
 * @returns {{}}
 */
showdown.getDefaultOptions = function (simple) {
  'use strict';
  return getDefaultOpts(simple);
};

/**
 * Get or set a subParser
 *
 * subParser(name)       - Get a registered subParser
 * subParser(name, func) - Register a subParser
 * @static
 * @param {string} name
 * @param {function} [func]
 * @returns {*}
 */
showdown.subParser = function (name, func) {
  'use strict';
  if (showdown.helper.isString(name)) {
    if (typeof func !== 'undefined') {
      parsers[name] = func;
    } else {
      if (parsers.hasOwnProperty(name)) {
        return parsers[name];
      } else {
        throw Error('SubParser named ' + name + ' not registered!');
      }
    }
  }
};

/**
 * Gets or registers an extension
 * @static
 * @param {string} name
 * @param {object|function=} ext
 * @returns {*}
 */
showdown.extension = function (name, ext) {
  'use strict';

  if (!showdown.helper.isString(name)) {
    throw Error('Extension \'name\' must be a string');
  }

  name = showdown.helper.stdExtName(name);

  // Getter
  if (showdown.helper.isUndefined(ext)) {
    if (!extensions.hasOwnProperty(name)) {
      throw Error('Extension named ' + name + ' is not registered!');
    }
    return extensions[name];

    // Setter
  } else {
    // Expand extension if it's wrapped in a function
    if (typeof ext === 'function') {
      ext = ext();
    }

    // Ensure extension is an array
    if (!showdown.helper.isArray(ext)) {
      ext = [ext];
    }

    var validExtension = validate(ext, name);

    if (validExtension.valid) {
      extensions[name] = ext;
    } else {
      throw Error(validExtension.error);
    }
  }
};

/**
 * Gets all extensions registered
 * @returns {{}}
 */
showdown.getAllExtensions = function () {
  'use strict';
  return extensions;
};

/**
 * Remove an extension
 * @param {string} name
 */
showdown.removeExtension = function (name) {
  'use strict';
  delete extensions[name];
};

/**
 * Removes all extensions
 */
showdown.resetExtensions = function () {
  'use strict';
  extensions = {};
};

/**
 * Validate extension
 * @param {array} extension
 * @param {string} name
 * @returns {{valid: boolean, error: string}}
 */
function validate (extension, name) {
  'use strict';

  var errMsg = (name) ? 'Error in ' + name + ' extension->' : 'Error in unnamed extension',
      ret = {
        valid: true,
        error: ''
      };

  if (!showdown.helper.isArray(extension)) {
    extension = [extension];
  }

  for (var i = 0; i < extension.length; ++i) {
    var baseMsg = errMsg + ' sub-extension ' + i + ': ',
        ext = extension[i];
    if (typeof ext !== 'object') {
      ret.valid = false;
      ret.error = baseMsg + 'must be an object, but ' + typeof ext + ' given';
      return ret;
    }

    if (!showdown.helper.isString(ext.type)) {
      ret.valid = false;
      ret.error = baseMsg + 'property "type" must be a string, but ' + typeof ext.type + ' given';
      return ret;
    }

    var type = ext.type = ext.type.toLowerCase();

    // normalize extension type
    if (type === 'language') {
      type = ext.type = 'lang';
    }

    if (type === 'html') {
      type = ext.type = 'output';
    }

    if (type !== 'lang' && type !== 'output' && type !== 'listener') {
      ret.valid = false;
      ret.error = baseMsg + 'type ' + type + ' is not recognized. Valid values: "lang/language", "output/html" or "listener"';
      return ret;
    }

    if (type === 'listener') {
      if (showdown.helper.isUndefined(ext.listeners)) {
        ret.valid = false;
        ret.error = baseMsg + '. Extensions of type "listener" must have a property called "listeners"';
        return ret;
      }
    } else {
      if (showdown.helper.isUndefined(ext.filter) && showdown.helper.isUndefined(ext.regex)) {
        ret.valid = false;
        ret.error = baseMsg + type + ' extensions must define either a "regex" property or a "filter" method';
        return ret;
      }
    }

    if (ext.listeners) {
      if (typeof ext.listeners !== 'object') {
        ret.valid = false;
        ret.error = baseMsg + '"listeners" property must be an object but ' + typeof ext.listeners + ' given';
        return ret;
      }
      for (var ln in ext.listeners) {
        if (ext.listeners.hasOwnProperty(ln)) {
          if (typeof ext.listeners[ln] !== 'function') {
            ret.valid = false;
            ret.error = baseMsg + '"listeners" property must be an hash of [event name]: [callback]. listeners.' + ln +
              ' must be a function but ' + typeof ext.listeners[ln] + ' given';
            return ret;
          }
        }
      }
    }

    if (ext.filter) {
      if (typeof ext.filter !== 'function') {
        ret.valid = false;
        ret.error = baseMsg + '"filter" must be a function, but ' + typeof ext.filter + ' given';
        return ret;
      }
    } else if (ext.regex) {
      if (showdown.helper.isString(ext.regex)) {
        ext.regex = new RegExp(ext.regex, 'g');
      }
      if (!(ext.regex instanceof RegExp)) {
        ret.valid = false;
        ret.error = baseMsg + '"regex" property must either be a string or a RegExp object, but ' + typeof ext.regex + ' given';
        return ret;
      }
      if (showdown.helper.isUndefined(ext.replace)) {
        ret.valid = false;
        ret.error = baseMsg + '"regex" extensions must implement a replace string or function';
        return ret;
      }
    }
  }
  return ret;
}

/**
 * Validate extension
 * @param {object} ext
 * @returns {boolean}
 */
showdown.validateExtension = function (ext) {
  'use strict';

  var validateExtension = validate(ext, null);
  if (!validateExtension.valid) {
    console.warn(validateExtension.error);
    return false;
  }
  return true;
};

/**
 * showdownjs helper functions
 */

if (!showdown.hasOwnProperty('helper')) {
  showdown.helper = {};
}

/**
 * Check if var is string
 * @static
 * @param {string} a
 * @returns {boolean}
 */
showdown.helper.isString = function (a) {
  'use strict';
  return (typeof a === 'string' || a instanceof String);
};

/**
 * Check if var is a function
 * @static
 * @param {*} a
 * @returns {boolean}
 */
showdown.helper.isFunction = function (a) {
  'use strict';
  var getType = {};
  return a && getType.toString.call(a) === '[object Function]';
};

/**
 * isArray helper function
 * @static
 * @param {*} a
 * @returns {boolean}
 */
showdown.helper.isArray = function (a) {
  'use strict';
  return a.constructor === Array;
};

/**
 * Check if value is undefined
 * @static
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
 */
showdown.helper.isUndefined = function (value) {
  'use strict';
  return typeof value === 'undefined';
};

/**
 * ForEach helper function
 * Iterates over Arrays and Objects (own properties only)
 * @static
 * @param {*} obj
 * @param {function} callback Accepts 3 params: 1. value, 2. key, 3. the original array/object
 */
showdown.helper.forEach = function (obj, callback) {
  'use strict';
  // check if obj is defined
  if (showdown.helper.isUndefined(obj)) {
    throw new Error('obj param is required');
  }

  if (showdown.helper.isUndefined(callback)) {
    throw new Error('callback param is required');
  }

  if (!showdown.helper.isFunction(callback)) {
    throw new Error('callback param must be a function/closure');
  }

  if (typeof obj.forEach === 'function') {
    obj.forEach(callback);
  } else if (showdown.helper.isArray(obj)) {
    for (var i = 0; i < obj.length; i++) {
      callback(obj[i], i, obj);
    }
  } else if (typeof (obj) === 'object') {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        callback(obj[prop], prop, obj);
      }
    }
  } else {
    throw new Error('obj does not seem to be an array or an iterable object');
  }
};

/**
 * Standardidize extension name
 * @static
 * @param {string} s extension name
 * @returns {string}
 */
showdown.helper.stdExtName = function (s) {
  'use strict';
  return s.replace(/[_?*+\/\\.^-]/g, '').replace(/\s/g, '').toLowerCase();
};

function escapeCharactersCallback (wholeMatch, m1) {
  'use strict';
  var charCodeToEscape = m1.charCodeAt(0);
  return '¨E' + charCodeToEscape + 'E';
}

/**
 * Callback used to escape characters when passing through String.replace
 * @static
 * @param {string} wholeMatch
 * @param {string} m1
 * @returns {string}
 */
showdown.helper.escapeCharactersCallback = escapeCharactersCallback;

/**
 * Escape characters in a string
 * @static
 * @param {string} text
 * @param {string} charsToEscape
 * @param {boolean} afterBackslash
 * @returns {XML|string|void|*}
 */
showdown.helper.escapeCharacters = function (text, charsToEscape, afterBackslash) {
  'use strict';
  // First we have to escape the escape characters so that
  // we can build a character class out of them
  var regexString = '([' + charsToEscape.replace(/([\[\]\\])/g, '\\$1') + '])';

  if (afterBackslash) {
    regexString = '\\\\' + regexString;
  }

  var regex = new RegExp(regexString, 'g');
  text = text.replace(regex, escapeCharactersCallback);

  return text;
};

var rgxFindMatchPos = function (str, left, right, flags) {
  'use strict';
  var f = flags || '',
      g = f.indexOf('g') > -1,
      x = new RegExp(left + '|' + right, 'g' + f.replace(/g/g, '')),
      l = new RegExp(left, f.replace(/g/g, '')),
      pos = [],
      t, s, m, start, end;

  do {
    t = 0;
    while ((m = x.exec(str))) {
      if (l.test(m[0])) {
        if (!(t++)) {
          s = x.lastIndex;
          start = s - m[0].length;
        }
      } else if (t) {
        if (!--t) {
          end = m.index + m[0].length;
          var obj = {
            left: {start: start, end: s},
            match: {start: s, end: m.index},
            right: {start: m.index, end: end},
            wholeMatch: {start: start, end: end}
          };
          pos.push(obj);
          if (!g) {
            return pos;
          }
        }
      }
    }
  } while (t && (x.lastIndex = s));

  return pos;
};

/**
 * matchRecursiveRegExp
 *
 * (c) 2007 Steven Levithan <stevenlevithan.com>
 * MIT License
 *
 * Accepts a string to search, a left and right format delimiter
 * as regex patterns, and optional regex flags. Returns an array
 * of matches, allowing nested instances of left/right delimiters.
 * Use the "g" flag to return all matches, otherwise only the
 * first is returned. Be careful to ensure that the left and
 * right format delimiters produce mutually exclusive matches.
 * Backreferences are not supported within the right delimiter
 * due to how it is internally combined with the left delimiter.
 * When matching strings whose format delimiters are unbalanced
 * to the left or right, the output is intentionally as a
 * conventional regex library with recursion support would
 * produce, e.g. "<<x>" and "<x>>" both produce ["x"] when using
 * "<" and ">" as the delimiters (both strings contain a single,
 * balanced instance of "<x>").
 *
 * examples:
 * matchRecursiveRegExp("test", "\\(", "\\)")
 * returns: []
 * matchRecursiveRegExp("<t<<e>><s>>t<>", "<", ">", "g")
 * returns: ["t<<e>><s>", ""]
 * matchRecursiveRegExp("<div id=\"x\">test</div>", "<div\\b[^>]*>", "</div>", "gi")
 * returns: ["test"]
 */
showdown.helper.matchRecursiveRegExp = function (str, left, right, flags) {
  'use strict';

  var matchPos = rgxFindMatchPos (str, left, right, flags),
      results = [];

  for (var i = 0; i < matchPos.length; ++i) {
    results.push([
      str.slice(matchPos[i].wholeMatch.start, matchPos[i].wholeMatch.end),
      str.slice(matchPos[i].match.start, matchPos[i].match.end),
      str.slice(matchPos[i].left.start, matchPos[i].left.end),
      str.slice(matchPos[i].right.start, matchPos[i].right.end)
    ]);
  }
  return results;
};

/**
 *
 * @param {string} str
 * @param {string|function} replacement
 * @param {string} left
 * @param {string} right
 * @param {string} flags
 * @returns {string}
 */
showdown.helper.replaceRecursiveRegExp = function (str, replacement, left, right, flags) {
  'use strict';

  if (!showdown.helper.isFunction(replacement)) {
    var repStr = replacement;
    replacement = function () {
      return repStr;
    };
  }

  var matchPos = rgxFindMatchPos(str, left, right, flags),
      finalStr = str,
      lng = matchPos.length;

  if (lng > 0) {
    var bits = [];
    if (matchPos[0].wholeMatch.start !== 0) {
      bits.push(str.slice(0, matchPos[0].wholeMatch.start));
    }
    for (var i = 0; i < lng; ++i) {
      bits.push(
        replacement(
          str.slice(matchPos[i].wholeMatch.start, matchPos[i].wholeMatch.end),
          str.slice(matchPos[i].match.start, matchPos[i].match.end),
          str.slice(matchPos[i].left.start, matchPos[i].left.end),
          str.slice(matchPos[i].right.start, matchPos[i].right.end)
        )
      );
      if (i < lng - 1) {
        bits.push(str.slice(matchPos[i].wholeMatch.end, matchPos[i + 1].wholeMatch.start));
      }
    }
    if (matchPos[lng - 1].wholeMatch.end < str.length) {
      bits.push(str.slice(matchPos[lng - 1].wholeMatch.end));
    }
    finalStr = bits.join('');
  }
  return finalStr;
};

/**
 * Returns the index within the passed String object of the first occurrence of the specified regex,
 * starting the search at fromIndex. Returns -1 if the value is not found.
 *
 * @param {string} str string to search
 * @param {RegExp} regex Regular expression to search
 * @param {int} [fromIndex = 0] Index to start the search
 * @returns {Number}
 * @throws InvalidArgumentError
 */
showdown.helper.regexIndexOf = function (str, regex, fromIndex) {
  'use strict';
  if (!showdown.helper.isString(str)) {
    throw 'InvalidArgumentError: first parameter of showdown.helper.regexIndexOf function must be a string';
  }
  if (regex instanceof RegExp === false) {
    throw 'InvalidArgumentError: second parameter of showdown.helper.regexIndexOf function must be an instance of RegExp';
  }
  var indexOf = str.substring(fromIndex || 0).search(regex);
  return (indexOf >= 0) ? (indexOf + (fromIndex || 0)) : indexOf;
};

/**
 * Splits the passed string object at the defined index, and returns an array composed of the two substrings
 * @param {string} str string to split
 * @param {int} index index to split string at
 * @returns {[string,string]}
 * @throws InvalidArgumentError
 */
showdown.helper.splitAtIndex = function (str, index) {
  'use strict';
  if (!showdown.helper.isString(str)) {
    throw 'InvalidArgumentError: first parameter of showdown.helper.regexIndexOf function must be a string';
  }
  return [str.substring(0, index), str.substring(index)];
};

/**
 * Obfuscate an e-mail address through the use of Character Entities,
 * transforming ASCII characters into their equivalent decimal or hex entities.
 *
 * Since it has a random component, subsequent calls to this function produce different results
 *
 * @param {string} mail
 * @returns {string}
 */
showdown.helper.encodeEmailAddress = function (mail) {
  'use strict';
  var encode = [
    function (ch) {
      return '&#' + ch.charCodeAt(0) + ';';
    },
    function (ch) {
      return '&#x' + ch.charCodeAt(0).toString(16) + ';';
    },
    function (ch) {
      return ch;
    }
  ];

  mail = mail.replace(/./g, (function (ch) {
    if (ch === '@') {
      // this *must* be encoded. I insist.
      ch = encode[Math.floor(Math.random() * 2)](ch);
    } else {
      var r = Math.random();
      // roughly 10% raw, 45% hex, 45% dec
      ch = (
        r > 0.9 ? encode[2](ch) : r > 0.45 ? encode[1](ch) : encode[0](ch)
      );
    }
    return ch;
  }));

  return mail;
};

/**
 * POLYFILLS
 */
// use this instead of builtin is undefined for IE8 compatibility
if (typeof(console) === 'undefined') {
  console = {
    warn: function (msg) {
      'use strict';
      alert(msg);
    },
    log: function (msg) {
      'use strict';
      alert(msg);
    },
    error: function (msg) {
      'use strict';
      throw msg;
    }
  };
}

/**
 * Common regexes.
 * We declare some common regexes to improve performance
 */
showdown.helper.regexes = {
  asteriskAndDash: /([*_])/g
};

/**
 * Created by Estevao on 31-05-2015.
 */

/**
 * Showdown Converter class
 * @class
 * @param {object} [converterOptions]
 * @returns {Converter}
 */
showdown.Converter = function (converterOptions) {
  'use strict';

  var
      /**
       * Options used by this converter
       * @private
       * @type {{}}
       */
      options = {},

      /**
       * Language extensions used by this converter
       * @private
       * @type {Array}
       */
      langExtensions = [],

      /**
       * Output modifiers extensions used by this converter
       * @private
       * @type {Array}
       */
      outputModifiers = [],

      /**
       * Event listeners
       * @private
       * @type {{}}
       */
      listeners = {},

      /**
       * The flavor set in this converter
       */
      setConvFlavor = setFlavor;

  _constructor();

  /**
   * Converter constructor
   * @private
   */
  function _constructor () {
    converterOptions = converterOptions || {};

    for (var gOpt in globalOptions) {
      if (globalOptions.hasOwnProperty(gOpt)) {
        options[gOpt] = globalOptions[gOpt];
      }
    }

    // Merge options
    if (typeof converterOptions === 'object') {
      for (var opt in converterOptions) {
        if (converterOptions.hasOwnProperty(opt)) {
          options[opt] = converterOptions[opt];
        }
      }
    } else {
      throw Error('Converter expects the passed parameter to be an object, but ' + typeof converterOptions +
      ' was passed instead.');
    }

    if (options.extensions) {
      showdown.helper.forEach(options.extensions, _parseExtension);
    }
  }

  /**
   * Parse extension
   * @param {*} ext
   * @param {string} [name='']
   * @private
   */
  function _parseExtension (ext, name) {

    name = name || null;
    // If it's a string, the extension was previously loaded
    if (showdown.helper.isString(ext)) {
      ext = showdown.helper.stdExtName(ext);
      name = ext;

      // LEGACY_SUPPORT CODE
      if (showdown.extensions[ext]) {
        console.warn('DEPRECATION WARNING: ' + ext + ' is an old extension that uses a deprecated loading method.' +
          'Please inform the developer that the extension should be updated!');
        legacyExtensionLoading(showdown.extensions[ext], ext);
        return;
      // END LEGACY SUPPORT CODE

      } else if (!showdown.helper.isUndefined(extensions[ext])) {
        ext = extensions[ext];

      } else {
        throw Error('Extension "' + ext + '" could not be loaded. It was either not found or is not a valid extension.');
      }
    }

    if (typeof ext === 'function') {
      ext = ext();
    }

    if (!showdown.helper.isArray(ext)) {
      ext = [ext];
    }

    var validExt = validate(ext, name);
    if (!validExt.valid) {
      throw Error(validExt.error);
    }

    for (var i = 0; i < ext.length; ++i) {
      switch (ext[i].type) {

        case 'lang':
          langExtensions.push(ext[i]);
          break;

        case 'output':
          outputModifiers.push(ext[i]);
          break;
      }
      if (ext[i].hasOwnProperty('listeners')) {
        for (var ln in ext[i].listeners) {
          if (ext[i].listeners.hasOwnProperty(ln)) {
            listen(ln, ext[i].listeners[ln]);
          }
        }
      }
    }

  }

  /**
   * LEGACY_SUPPORT
   * @param {*} ext
   * @param {string} name
   */
  function legacyExtensionLoading (ext, name) {
    if (typeof ext === 'function') {
      ext = ext(new showdown.Converter());
    }
    if (!showdown.helper.isArray(ext)) {
      ext = [ext];
    }
    var valid = validate(ext, name);

    if (!valid.valid) {
      throw Error(valid.error);
    }

    for (var i = 0; i < ext.length; ++i) {
      switch (ext[i].type) {
        case 'lang':
          langExtensions.push(ext[i]);
          break;
        case 'output':
          outputModifiers.push(ext[i]);
          break;
        default:// should never reach here
          throw Error('Extension loader error: Type unrecognized!!!');
      }
    }
  }

  /**
   * Listen to an event
   * @param {string} name
   * @param {function} callback
   */
  function listen (name, callback) {
    if (!showdown.helper.isString(name)) {
      throw Error('Invalid argument in converter.listen() method: name must be a string, but ' + typeof name + ' given');
    }

    if (typeof callback !== 'function') {
      throw Error('Invalid argument in converter.listen() method: callback must be a function, but ' + typeof callback + ' given');
    }

    if (!listeners.hasOwnProperty(name)) {
      listeners[name] = [];
    }
    listeners[name].push(callback);
  }

  function rTrimInputText (text) {
    var rsp = text.match(/^\s*/)[0].length,
        rgx = new RegExp('^\\s{0,' + rsp + '}', 'gm');
    return text.replace(rgx, '');
  }

  /**
   * Dispatch an event
   * @private
   * @param {string} evtName Event name
   * @param {string} text Text
   * @param {{}} options Converter Options
   * @param {{}} globals
   * @returns {string}
   */
  this._dispatch = function dispatch (evtName, text, options, globals) {
    if (listeners.hasOwnProperty(evtName)) {
      for (var ei = 0; ei < listeners[evtName].length; ++ei) {
        var nText = listeners[evtName][ei](evtName, text, this, options, globals);
        if (nText && typeof nText !== 'undefined') {
          text = nText;
        }
      }
    }
    return text;
  };

  /**
   * Listen to an event
   * @param {string} name
   * @param {function} callback
   * @returns {showdown.Converter}
   */
  this.listen = function (name, callback) {
    listen(name, callback);
    return this;
  };

  /**
   * Converts a markdown string into HTML
   * @param {string} text
   * @returns {*}
   */
  this.makeHtml = function (text) {
    //check if text is not falsy
    if (!text) {
      return text;
    }

    var globals = {
      gHtmlBlocks:     [],
      gHtmlMdBlocks:   [],
      gHtmlSpans:      [],
      gUrls:           {},
      gTitles:         {},
      gDimensions:     {},
      gListLevel:      0,
      hashLinkCounts:  {},
      langExtensions:  langExtensions,
      outputModifiers: outputModifiers,
      converter:       this,
      ghCodeBlocks:    []
    };

    // This lets us use ¨ trema as an escape char to avoid md5 hashes
    // The choice of character is arbitrary; anything that isn't
    // magic in Markdown will work.
    text = text.replace(/¨/g, '¨T');

    // Replace $ with ¨D
    // RegExp interprets $ as a special character
    // when it's in a replacement string
    text = text.replace(/\$/g, '¨D');

    // Standardize line endings
    text = text.replace(/\r\n/g, '\n'); // DOS to Unix
    text = text.replace(/\r/g, '\n'); // Mac to Unix

    // Stardardize line spaces (nbsp causes trouble in older browsers and some regex flavors)
    text = text.replace(/\u00A0/g, ' ');

    if (options.smartIndentationFix) {
      text = rTrimInputText(text);
    }

    // Make sure text begins and ends with a couple of newlines:
    text = '\n\n' + text + '\n\n';

    // detab
    text = showdown.subParser('detab')(text, options, globals);

    /**
     * Strip any lines consisting only of spaces and tabs.
     * This makes subsequent regexs easier to write, because we can
     * match consecutive blank lines with /\n+/ instead of something
     * contorted like /[ \t]*\n+/
     */
    text = text.replace(/^[ \t]+$/mg, '');

    //run languageExtensions
    showdown.helper.forEach(langExtensions, (function (ext) {
      text = showdown.subParser('runExtension')(ext, text, options, globals);
    }));

    // run the sub parsers
    text = showdown.subParser('hashPreCodeTags')(text, options, globals);
    text = showdown.subParser('githubCodeBlocks')(text, options, globals);
    text = showdown.subParser('hashHTMLBlocks')(text, options, globals);
    text = showdown.subParser('hashCodeTags')(text, options, globals);
    text = showdown.subParser('stripLinkDefinitions')(text, options, globals);
    text = showdown.subParser('blockGamut')(text, options, globals);
    text = showdown.subParser('unhashHTMLSpans')(text, options, globals);
    text = showdown.subParser('unescapeSpecialChars')(text, options, globals);

    // attacklab: Restore dollar signs
    text = text.replace(/¨D/g, '$$');

    // attacklab: Restore tremas
    text = text.replace(/¨T/g, '¨');

    // Run output modifiers
    showdown.helper.forEach(outputModifiers, (function (ext) {
      text = showdown.subParser('runExtension')(ext, text, options, globals);
    }));

    return text;
  };

  /**
   * Set an option of this Converter instance
   * @param {string} key
   * @param {*} value
   */
  this.setOption = function (key, value) {
    options[key] = value;
  };

  /**
   * Get the option of this Converter instance
   * @param {string} key
   * @returns {*}
   */
  this.getOption = function (key) {
    return options[key];
  };

  /**
   * Get the options of this Converter instance
   * @returns {{}}
   */
  this.getOptions = function () {
    return options;
  };

  /**
   * Add extension to THIS converter
   * @param {{}} extension
   * @param {string} [name=null]
   */
  this.addExtension = function (extension, name) {
    name = name || null;
    _parseExtension(extension, name);
  };

  /**
   * Use a global registered extension with THIS converter
   * @param {string} extensionName Name of the previously registered extension
   */
  this.useExtension = function (extensionName) {
    _parseExtension(extensionName);
  };

  /**
   * Set the flavor THIS converter should use
   * @param {string} name
   */
  this.setFlavor = function (name) {
    if (!flavor.hasOwnProperty(name)) {
      throw Error(name + ' flavor was not found');
    }
    var preset = flavor[name];
    setConvFlavor = name;
    for (var option in preset) {
      if (preset.hasOwnProperty(option)) {
        options[option] = preset[option];
      }
    }
  };

  /**
   * Get the currently set flavor of this converter
   * @returns {string}
   */
  this.getFlavor = function () {
    return setConvFlavor;
  };

  /**
   * Remove an extension from THIS converter.
   * Note: This is a costly operation. It's better to initialize a new converter
   * and specify the extensions you wish to use
   * @param {Array} extension
   */
  this.removeExtension = function (extension) {
    if (!showdown.helper.isArray(extension)) {
      extension = [extension];
    }
    for (var a = 0; a < extension.length; ++a) {
      var ext = extension[a];
      for (var i = 0; i < langExtensions.length; ++i) {
        if (langExtensions[i] === ext) {
          langExtensions[i].splice(i, 1);
        }
      }
      for (var ii = 0; ii < outputModifiers.length; ++i) {
        if (outputModifiers[ii] === ext) {
          outputModifiers[ii].splice(i, 1);
        }
      }
    }
  };

  /**
   * Get all extension of THIS converter
   * @returns {{language: Array, output: Array}}
   */
  this.getAllExtensions = function () {
    return {
      language: langExtensions,
      output: outputModifiers
    };
  };
};

/**
 * Turn Markdown link shortcuts into XHTML <a> tags.
 */
showdown.subParser('anchors', (function (text, options, globals) {
  'use strict';

  text = globals.converter._dispatch('anchors.before', text, options, globals);

  var writeAnchorTag = function (wholeMatch, linkText, linkId, url, m5, m6, title) {
    if (showdown.helper.isUndefined(title)) {
      title = '';
    }
    linkId = linkId.toLowerCase();

    // Special case for explicit empty url
    if (wholeMatch.search(/\(<?\s*>? ?(['"].*['"])?\)$/m) > -1) {
      url = '';
    } else if (!url) {
      if (!linkId) {
        // lower-case and turn embedded newlines into spaces
        linkId = linkText.toLowerCase().replace(/ ?\n/g, ' ');
      }
      url = '#' + linkId;

      if (!showdown.helper.isUndefined(globals.gUrls[linkId])) {
        url = globals.gUrls[linkId];
        if (!showdown.helper.isUndefined(globals.gTitles[linkId])) {
          title = globals.gTitles[linkId];
        }
      } else {
        return wholeMatch;
      }
    }

    //url = showdown.helper.escapeCharacters(url, '*_', false); // replaced line to improve performance
    url = url.replace(showdown.helper.regexes.asteriskAndDash, showdown.helper.escapeCharactersCallback);

    var result = '<a href="' + url + '"';

    if (title !== '' && title !== null) {
      title = title.replace(/"/g, '&quot;');
      //title = showdown.helper.escapeCharacters(title, '*_', false); // replaced line to improve performance
      title = title.replace(showdown.helper.regexes.asteriskAndDash, showdown.helper.escapeCharactersCallback);
      result += ' title="' + title + '"';
    }

    if (options.openLinksInNewWindow) {
      // escaped _
      result += ' target="¨E95Eblank"';
    }

    result += '>' + linkText + '</a>';

    return result;
  };

  // First, handle reference-style links: [link text] [id]
  text = text.replace(/\[((?:\[[^\]]*]|[^\[\]])*)] ?(?:\n *)?\[(.*?)]()()()()/g, writeAnchorTag);

  // Next, inline-style links: [link text](url "optional title")
  // cases with crazy urls like ./image/cat1).png
  text = text.replace(/\[((?:\[[^\]]*]|[^\[\]])*)]()[ \t]*\([ \t]?<([^>]*)>(?:[ \t]*((["'])([^"]*?)\5))?[ \t]?\)/g,
    writeAnchorTag);

  // normal cases
  text = text.replace(/\[((?:\[[^\]]*]|[^\[\]])*)]()[ \t]*\([ \t]?<?([\S]+?(?:\([\S]*?\)[\S]*?)?)>?(?:[ \t]*((["'])([^"]*?)\5))?[ \t]?\)/g,
                      writeAnchorTag);

  // handle reference-style shortcuts: [link text]
  // These must come last in case you've also got [link test][1]
  // or [link test](/foo)
  text = text.replace(/\[([^\[\]]+)]()()()()()/g, writeAnchorTag);

  // Lastly handle GithubMentions if option is enabled
  if (options.ghMentions) {
    text = text.replace(/(^|\s)(\\)?(@([a-z\d\-]+))(?=[.!?;,[\]()]|\s|$)/gmi, (function (wm, st, escape, mentions, username) {
      if (escape === '\\') {
        return st + mentions;
      }

      //check if options.ghMentionsLink is a string
      if (!showdown.helper.isString(options.ghMentionsLink)) {
        throw new Error('ghMentionsLink option must be a string');
      }
      var lnk = options.ghMentionsLink.replace(/\{u}/g, username),
          target = '';
      if (options.openLinksInNewWindow) {
        target = ' target="¨E95Eblank"';
      }
      return st + '<a href="' + lnk + '"' + target + '>' + mentions + '</a>';
    }));
  }

  text = globals.converter._dispatch('anchors.after', text, options, globals);
  return text;
}));

// url allowed chars [a-z\d_.~:/?#[]@!$&'()*+,;=-]

var simpleURLRegex  = /\b(((https?|ftp|dict):\/\/|www\.)[^'">\s]+\.[^'">\s]+)()(?=\s|$)(?!["<>])/gi,
    simpleURLRegex2 = /\b(((https?|ftp|dict):\/\/|www\.)[^'">\s]+\.[^'">\s]+?)([.!?,()\[\]]?)(?=\s|$)(?!["<>])/gi,
    //simpleURLRegex3 = /\b(((https?|ftp):\/\/|www\.)[a-z\d.-]+\.[a-z\d_.~:/?#\[\]@!$&'()*+,;=-]+?)([.!?()]?)(?=\s|$)(?!["<>])/gi,
    delimUrlRegex   = /<(((https?|ftp|dict):\/\/|www\.)[^'">\s]+)()>/gi,
    simpleMailRegex = /(^|\s)(?:mailto:)?([A-Za-z0-9!#$%&'*+-/=?^_`{|}~.]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)(?=$|\s)/gmi,
    delimMailRegex  = /<()(?:mailto:)?([-.\w]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi,

    replaceLink = function (options) {
      'use strict';

      return function (wm, link, m2, m3, trailingPunctuation) {
        var lnkTxt = link,
            append = '',
            target = '';
        if (/^www\./i.test(link)) {
          link = link.replace(/^www\./i, 'http://www.');
        }
        if (options.excludeTrailingPunctuationFromURLs && trailingPunctuation) {
          append = trailingPunctuation;
        }
        if (options.openLinksInNewWindow) {
          target = ' target="¨E95Eblank"';
        }
        return '<a href="' + link + '"' + target + '>' + lnkTxt + '</a>' + append;
      };
    },

    replaceMail = function (options, globals) {
      'use strict';
      return function (wholeMatch, b, mail) {
        var href = 'mailto:';
        b = b || '';
        mail = showdown.subParser('unescapeSpecialChars')(mail, options, globals);
        if (options.encodeEmails) {
          href = showdown.helper.encodeEmailAddress(href + mail);
          mail = showdown.helper.encodeEmailAddress(mail);
        } else {
          href = href + mail;
        }
        return b + '<a href="' + href + '">' + mail + '</a>';
      };
    };

showdown.subParser('autoLinks', (function (text, options, globals) {
  'use strict';

  text = globals.converter._dispatch('autoLinks.before', text, options, globals);

  text = text.replace(delimUrlRegex, replaceLink(options));
  text = text.replace(delimMailRegex, replaceMail(options, globals));

  text = globals.converter._dispatch('autoLinks.after', text, options, globals);

  return text;
}));

showdown.subParser('simplifiedAutoLinks', (function (text, options, globals) {
  'use strict';

  if (!options.simplifiedAutoLink) {
    return text;
  }

  text = globals.converter._dispatch('simplifiedAutoLinks.before', text, options, globals);

  if (options.excludeTrailingPunctuationFromURLs) {
    text = text.replace(simpleURLRegex2, replaceLink(options));
  } else {
    text = text.replace(simpleURLRegex, replaceLink(options));
  }
  text = text.replace(simpleMailRegex, replaceMail(options, globals));

  text = globals.converter._dispatch('simplifiedAutoLinks.after', text, options, globals);

  return text;
}));

/**
 * These are all the transformations that form block-level
 * tags like paragraphs, headers, and list items.
 */
showdown.subParser('blockGamut', (function (text, options, globals) {
  'use strict';

  text = globals.converter._dispatch('blockGamut.before', text, options, globals);

  // we parse blockquotes first so that we can have headings and hrs
  // inside blockquotes
  text = showdown.subParser('blockQuotes')(text, options, globals);
  text = showdown.subParser('headers')(text, options, globals);

  // Do Horizontal Rules:
  text = showdown.subParser('horizontalRule')(text, options, globals);

  text = showdown.subParser('lists')(text, options, globals);
  text = showdown.subParser('codeBlocks')(text, options, globals);
  text = showdown.subParser('tables')(text, options, globals);

  // We already ran _HashHTMLBlocks() before, in Markdown(), but that
  // was to escape raw HTML in the original Markdown source. This time,
  // we're escaping the markup we've just created, so that we don't wrap
  // <p> tags around block-level tags.
  text = showdown.subParser('hashHTMLBlocks')(text, options, globals);
  text = showdown.subParser('paragraphs')(text, options, globals);

  text = globals.converter._dispatch('blockGamut.after', text, options, globals);

  return text;
}));

showdown.subParser('blockQuotes', (function (text, options, globals) {
  'use strict';

  text = globals.converter._dispatch('blockQuotes.before', text, options, globals);

  text = text.replace(/((^ {0,3}>[ \t]?.+\n(.+\n)*\n*)+)/gm, (function (wholeMatch, m1) {
    var bq = m1;

    // attacklab: hack around Konqueror 3.5.4 bug:
    // "----------bug".replace(/^-/g,"") == "bug"
    bq = bq.replace(/^[ \t]*>[ \t]?/gm, '¨0'); // trim one level of quoting

    // attacklab: clean up hack
    bq = bq.replace(/¨0/g, '');

    bq = bq.replace(/^[ \t]+$/gm, ''); // trim whitespace-only lines
    bq = showdown.subParser('githubCodeBlocks')(bq, options, globals);
    bq = showdown.subParser('blockGamut')(bq, options, globals); // recurse

    bq = bq.replace(/(^|\n)/g, '$1  ');
    // These leading spaces screw with <pre> content, so we need to fix that:
    bq = bq.replace(/(\s*<pre>[^\r]+?<\/pre>)/gm, (function (wholeMatch, m1) {
      var pre = m1;
      // attacklab: hack around Konqueror 3.5.4 bug:
      pre = pre.replace(/^  /mg, '¨0');
      pre = pre.replace(/¨0/g, '');
      return pre;
    }));

    return showdown.subParser('hashBlock')('<blockquote>\n' + bq + '\n</blockquote>', options, globals);
  }));

  text = globals.converter._dispatch('blockQuotes.after', text, options, globals);
  return text;
}));

/**
 * Process Markdown `<pre><code>` blocks.
 */
showdown.subParser('codeBlocks', (function (text, options, globals) {
  'use strict';

  text = globals.converter._dispatch('codeBlocks.before', text, options, globals);

  // sentinel workarounds for lack of \A and \Z, safari\khtml bug
  text += '¨0';

  var pattern = /(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=¨0))/g;
  text = text.replace(pattern, (function (wholeMatch, m1, m2) {
    var codeblock = m1,
        nextChar = m2,
        end = '\n';

    codeblock = showdown.subParser('outdent')(codeblock, options, globals);
    codeblock = showdown.subParser('encodeCode')(codeblock, options, globals);
    codeblock = showdown.subParser('detab')(codeblock, options, globals);
    codeblock = codeblock.replace(/^\n+/g, ''); // trim leading newlines
    codeblock = codeblock.replace(/\n+$/g, ''); // trim trailing newlines

    if (options.omitExtraWLInCodeBlocks) {
      end = '';
    }

    codeblock = '<pre><code>' + codeblock + end + '</code></pre>';

    return showdown.subParser('hashBlock')(codeblock, options, globals) + nextChar;
  }));

  // strip sentinel
  text = text.replace(/¨0/, '');

  text = globals.converter._dispatch('codeBlocks.after', text, options, globals);
  return text;
}));

/**
 *
 *   *  Backtick quotes are used for <code></code> spans.
 *
 *   *  You can use multiple backticks as the delimiters if you want to
 *     include literal backticks in the code span. So, this input:
 *
 *         Just type ``foo `bar` baz`` at the prompt.
 *
 *       Will translate to:
 *
 *         <p>Just type <code>foo `bar` baz</code> at the prompt.</p>
 *
 *    There's no arbitrary limit to the number of backticks you
 *    can use as delimters. If you need three consecutive backticks
 *    in your code, use four for delimiters, etc.
 *
 *  *  You can use spaces to get literal backticks at the edges:
 *
 *         ... type `` `bar` `` ...
 *
 *       Turns to:
 *
 *         ... type <code>`bar`</code> ...
 */
showdown.subParser('codeSpans', (function (text, options, globals) {
  'use strict';

  text = globals.converter._dispatch('codeSpans.before', text, options, globals);

  if (typeof(text) === 'undefined') {
    text = '';
  }
  text = text.replace(/(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm,
    (function (wholeMatch, m1, m2, m3) {
      var c = m3;
      c = c.replace(/^([ \t]*)/g, '');	// leading whitespace
      c = c.replace(/[ \t]*$/g, '');	// trailing whitespace
      c = showdown.subParser('encodeCode')(c, options, globals);
      return m1 + '<code>' + c + '</code>';
    })
  );

  text = globals.converter._dispatch('codeSpans.after', text, options, globals);
  return text;
}));

/**
 * Convert all tabs to spaces
 */
showdown.subParser('detab', (function (text, options, globals) {
  'use strict';
  text = globals.converter._dispatch('detab.before', text, options, globals);

  // expand first n-1 tabs
  text = text.replace(/\t(?=\t)/g, '    '); // g_tab_width

  // replace the nth with two sentinels
  text = text.replace(/\t/g, '¨A¨B');

  // use the sentinel to anchor our regex so it doesn't explode
  text = text.replace(/¨B(.+?)¨A/g, (function (wholeMatch, m1) {
    var leadingText = m1,
        numSpaces = 4 - leadingText.length % 4;  // g_tab_width

    // there *must* be a better way to do this:
    for (var i = 0; i < numSpaces; i++) {
      leadingText += ' ';
    }

    return leadingText;
  }));

  // clean up sentinels
  text = text.replace(/¨A/g, '    ');  // g_tab_width
  text = text.replace(/¨B/g, '');

  text = globals.converter._dispatch('detab.after', text, options, globals);
  return text;
}));

/**
 * Smart processing for ampersands and angle brackets that need to be encoded.
 */
showdown.subParser('encodeAmpsAndAngles', (function (text, options, globals) {
  'use strict';
  text = globals.converter._dispatch('encodeAmpsAndAngles.before', text, options, globals);

  // Ampersand-encoding based entirely on Nat Irons's Amputator MT plugin:
  // http://bumppo.net/projects/amputator/
  text = text.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g, '&amp;');

  // Encode naked <'s
  text = text.replace(/<(?![a-z\/?$!])/gi, '&lt;');

  // Encode <
  text = text.replace(/</g, '&lt;');

  // Encode >
  text = text.replace(/>/g, '&gt;');

  text = globals.converter._dispatch('encodeAmpsAndAngles.after', text, options, globals);
  return text;
}));

/**
 * Returns the string, with after processing the following backslash escape sequences.
 *
 * attacklab: The polite way to do this is with the new escapeCharacters() function:
 *
 *    text = escapeCharacters(text,"\\",true);
 *    text = escapeCharacters(text,"`*_{}[]()>#+-.!",true);
 *
 * ...but we're sidestepping its use of the (slow) RegExp constructor
 * as an optimization for Firefox.  This function gets called a LOT.
 */
showdown.subParser('encodeBackslashEscapes', (function (text, options, globals) {
  'use strict';
  text = globals.converter._dispatch('encodeBackslashEscapes.before', text, options, globals);

  text = text.replace(/\\(\\)/g, showdown.helper.escapeCharactersCallback);
  text = text.replace(/\\([`*_{}\[\]()>#+.!~=|-])/g, showdown.helper.escapeCharactersCallback);

  text = globals.converter._dispatch('encodeBackslashEscapes.after', text, options, globals);
  return text;
}));

/**
 * Encode/escape certain characters inside Markdown code runs.
 * The point is that in code, these characters are literals,
 * and lose their special Markdown meanings.
 */
showdown.subParser('encodeCode', (function (text, options, globals) {
  'use strict';

  text = globals.converter._dispatch('encodeCode.before', text, options, globals);

  // Encode all ampersands; HTML entities are not
  // entities within a Markdown code span.
  text = text
    .replace(/&/g, '&amp;')
  // Do the angle bracket song and dance:
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  // Now, escape characters that are magic in Markdown:
    .replace(/([*_{}\[\]\\=~-])/g, showdown.helper.escapeCharactersCallback);

  text = globals.converter._dispatch('encodeCode.after', text, options, globals);
  return text;
}));

/**
 * Within tags -- meaning between < and > -- encode [\ ` * _ ~ =] so they
 * don't conflict with their use in Markdown for code, italics and strong.
 */
showdown.subParser('escapeSpecialCharsWithinTagAttributes', (function (text, options, globals) {
  'use strict';
  text = globals.converter._dispatch('escapeSpecialCharsWithinTagAttributes.before', text, options, globals);

  // Build a regex to find HTML tags and comments.  See Friedl's
  // "Mastering Regular Expressions", 2nd Ed., pp. 200-201.
  var regex = /(<[a-z\/!$]("[^"]*"|'[^']*'|[^'">])*>|<!(--.*?--\s*)+>)/gi;

  text = text.replace(regex, (function (wholeMatch) {
    return wholeMatch
      .replace(/(.)<\/?code>(?=.)/g, '$1`')
      .replace(/([\\`*_~=|])/g, showdown.helper.escapeCharactersCallback);
  }));

  text = globals.converter._dispatch('escapeSpecialCharsWithinTagAttributes.after', text, options, globals);
  return text;
}));

/**
 * Handle github codeblocks prior to running HashHTML so that
 * HTML contained within the codeblock gets escaped properly
 * Example:
 * ```ruby
 *     def hello_world(x)
 *       puts "Hello, #{x}"
 *     end
 * ```
 */
showdown.subParser('githubCodeBlocks', (function (text, options, globals) {
  'use strict';

  // early exit if option is not enabled
  if (!options.ghCodeBlocks) {
    return text;
  }

  text = globals.converter._dispatch('githubCodeBlocks.before', text, options, globals);

  text += '¨0';

  text = text.replace(/(?:^|\n)```(.*)\n([\s\S]*?)\n```/g, (function (wholeMatch, language, codeblock) {
    var end = (options.omitExtraWLInCodeBlocks) ? '' : '\n';

    // First parse the github code block
    codeblock = showdown.subParser('encodeCode')(codeblock, options, globals);
    codeblock = showdown.subParser('detab')(codeblock, options, globals);
    codeblock = codeblock.replace(/^\n+/g, ''); // trim leading newlines
    codeblock = codeblock.replace(/\n+$/g, ''); // trim trailing whitespace

    codeblock = '<pre><code' + (language ? ' class="' + language + ' language-' + language + '"' : '') + '>' + codeblock + end + '</code></pre>';

    codeblock = showdown.subParser('hashBlock')(codeblock, options, globals);

    // Since GHCodeblocks can be false positives, we need to
    // store the primitive text and the parsed text in a global var,
    // and then return a token
    return '\n\n¨G' + (globals.ghCodeBlocks.push({text: wholeMatch, codeblock: codeblock}) - 1) + 'G\n\n';
  }));

  // attacklab: strip sentinel
  text = text.replace(/¨0/, '');

  return globals.converter._dispatch('githubCodeBlocks.after', text, options, globals);
}));

showdown.subParser('hashBlock', (function (text, options, globals) {
  'use strict';
  text = globals.converter._dispatch('hashBlock.before', text, options, globals);
  text = text.replace(/(^\n+|\n+$)/g, '');
  text = '\n\n¨K' + (globals.gHtmlBlocks.push(text) - 1) + 'K\n\n';
  text = globals.converter._dispatch('hashBlock.after', text, options, globals);
  return text;
}));

/**
 * Hash and escape <code> elements that should not be parsed as markdown
 */
showdown.subParser('hashCodeTags', (function (text, options, globals) {
  'use strict';
  text = globals.converter._dispatch('hashCodeTags.before', text, options, globals);

  var repFunc = function (wholeMatch, match, left, right) {
    var codeblock = left + showdown.subParser('encodeCode')(match, options, globals) + right;
    return '¨C' + (globals.gHtmlSpans.push(codeblock) - 1) + 'C';
  };

  // Hash naked <code>
  text = showdown.helper.replaceRecursiveRegExp(text, repFunc, '<code\\b[^>]*>', '</code>', 'gim');

  text = globals.converter._dispatch('hashCodeTags.after', text, options, globals);
  return text;
}));

showdown.subParser('hashElement', (function (text, options, globals) {
  'use strict';

  return function (wholeMatch, m1) {
    var blockText = m1;

    // Undo double lines
    blockText = blockText.replace(/\n\n/g, '\n');
    blockText = blockText.replace(/^\n/, '');

    // strip trailing blank lines
    blockText = blockText.replace(/\n+$/g, '');

    // Replace the element text with a marker ("¨KxK" where x is its key)
    blockText = '\n\n¨K' + (globals.gHtmlBlocks.push(blockText) - 1) + 'K\n\n';

    return blockText;
  };
}));

showdown.subParser('hashHTMLBlocks', (function (text, options, globals) {
  'use strict';
  text = globals.converter._dispatch('hashHTMLBlocks.before', text, options, globals);

  var blockTags = [
        'pre',
        'div',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'blockquote',
        'table',
        'dl',
        'ol',
        'ul',
        'script',
        'noscript',
        'form',
        'fieldset',
        'iframe',
        'math',
        'style',
        'section',
        'header',
        'footer',
        'nav',
        'article',
        'aside',
        'address',
        'audio',
        'canvas',
        'figure',
        'hgroup',
        'output',
        'video',
        'p'
      ],
      repFunc = function (wholeMatch, match, left, right) {
        var txt = wholeMatch;
        // check if this html element is marked as markdown
        // if so, it's contents should be parsed as markdown
        if (left.search(/\bmarkdown\b/) !== -1) {
          txt = left + globals.converter.makeHtml(match) + right;
        }
        return '\n\n¨K' + (globals.gHtmlBlocks.push(txt) - 1) + 'K\n\n';
      };

  if (options.backslashEscapesHTMLTags) {
    // encode backslash escaped HTML tags
    text = text.replace(/\\<(\/?[^>]+?)>/g, (function (wm, inside) {
      return '&lt;' + inside + '&gt;';
    }));
  }

  // hash HTML Blocks
  for (var i = 0; i < blockTags.length; ++i) {

    var opTagPos,
        rgx1     = new RegExp('^ {0,3}(<' + blockTags[i] + '\\b[^>]*>)', 'im'),
        patLeft  = '<' + blockTags[i] + '\\b[^>]*>',
        patRight = '</' + blockTags[i] + '>';
    // 1. Look for the first position of the first opening HTML tag in the text
    while ((opTagPos = showdown.helper.regexIndexOf(text, rgx1)) !== -1) {

      // if the HTML tag is \ escaped, we need to escape it and break


      //2. Split the text in that position
      var subTexts = showdown.helper.splitAtIndex(text, opTagPos),
      //3. Match recursively
          newSubText1 = showdown.helper.replaceRecursiveRegExp(subTexts[1], repFunc, patLeft, patRight, 'im');

      // prevent an infinite loop
      if (newSubText1 === subTexts[1]) {
        break;
      }
      text = subTexts[0].concat(newSubText1);
    }
  }
  // HR SPECIAL CASE
  text = text.replace(/(\n {0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g,
    showdown.subParser('hashElement')(text, options, globals));

  // Special case for standalone HTML comments
  text = showdown.helper.replaceRecursiveRegExp(text, (function (txt) {
    return '\n\n¨K' + (globals.gHtmlBlocks.push(txt) - 1) + 'K\n\n';
  }), '^ {0,3}<!--', '-->', 'gm');

  // PHP and ASP-style processor instructions (<?...?> and <%...%>)
  text = text.replace(/(?:\n\n)( {0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g,
    showdown.subParser('hashElement')(text, options, globals));

  text = globals.converter._dispatch('hashHTMLBlocks.after', text, options, globals);
  return text;
}));

/**
 * Hash span elements that should not be parsed as markdown
 */
showdown.subParser('hashHTMLSpans', (function (text, options, globals) {
  'use strict';
  text = globals.converter._dispatch('hashHTMLSpans.before', text, options, globals);

  function hashHTMLSpan (html) {
    return '¨C' + (globals.gHtmlSpans.push(html) - 1) + 'C';
  }

  // Hash Self Closing tags
  text = text.replace(/<[^>]+?\/>/gi, (function (wm) {
    return hashHTMLSpan(wm);
  }));

  // Hash tags without properties
  text = text.replace(/<([^>]+?)>[\s\S]*?<\/\1>/g, (function (wm) {
    return hashHTMLSpan(wm);
  }));

  // Hash tags with properties
  text = text.replace(/<([^>]+?)\s[^>]+?>[\s\S]*?<\/\1>/g, (function (wm) {
    return hashHTMLSpan(wm);
  }));

  // Hash self closing tags without />
  text = text.replace(/<[^>]+?>/gi, (function (wm) {
    return hashHTMLSpan(wm);
  }));

  /*showdown.helper.matchRecursiveRegExp(text, '<code\\b[^>]*>', '</code>', 'gi');*/

  text = globals.converter._dispatch('hashHTMLSpans.after', text, options, globals);
  return text;
}));

/**
 * Unhash HTML spans
 */
showdown.subParser('unhashHTMLSpans', (function (text, options, globals) {
  'use strict';
  text = globals.converter._dispatch('unhashHTMLSpans.before', text, options, globals);

  for (var i = 0; i < globals.gHtmlSpans.length; ++i) {
    var repText = globals.gHtmlSpans[i],
        // limiter to prevent infinite loop (assume 10 as limit for recurse)
        limit = 0;

    while (/¨C(\d+)C/.test(repText)) {
      var num = RegExp.$1;
      repText = repText.replace('¨C' + num + 'C', globals.gHtmlSpans[num]);
      if (limit === 10) {
        break;
      }
      ++limit;
    }
    text = text.replace('¨C' + i + 'C', repText);
  }

  text = globals.converter._dispatch('unhashHTMLSpans.after', text, options, globals);
  return text;
}));

/**
 * Hash and escape <pre><code> elements that should not be parsed as markdown
 */
showdown.subParser('hashPreCodeTags', (function (text, options, globals) {
  'use strict';
  text = globals.converter._dispatch('hashPreCodeTags.before', text, options, globals);

  var repFunc = function (wholeMatch, match, left, right) {
    // encode html entities
    var codeblock = left + showdown.subParser('encodeCode')(match, options, globals) + right;
    return '\n\n¨G' + (globals.ghCodeBlocks.push({text: wholeMatch, codeblock: codeblock}) - 1) + 'G\n\n';
  };

  // Hash <pre><code>
  text = showdown.helper.replaceRecursiveRegExp(text, repFunc, '^ {0,3}<pre\\b[^>]*>\\s*<code\\b[^>]*>', '^ {0,3}</code>\\s*</pre>', 'gim');

  text = globals.converter._dispatch('hashPreCodeTags.after', text, options, globals);
  return text;
}));

showdown.subParser('headers', (function (text, options, globals) {
  'use strict';

  text = globals.converter._dispatch('headers.before', text, options, globals);

  var headerLevelStart = (isNaN(parseInt(options.headerLevelStart))) ? 1 : parseInt(options.headerLevelStart),

  // Set text-style headers:
  //	Header 1
  //	========
  //
  //	Header 2
  //	--------
  //
      setextRegexH1 = (options.smoothLivePreview) ? /^(.+)[ \t]*\n={2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n=+[ \t]*\n+/gm,
      setextRegexH2 = (options.smoothLivePreview) ? /^(.+)[ \t]*\n-{2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n-+[ \t]*\n+/gm;

  text = text.replace(setextRegexH1, (function (wholeMatch, m1) {

    var spanGamut = showdown.subParser('spanGamut')(m1, options, globals),
        hID = (options.noHeaderId) ? '' : ' id="' + headerId(m1) + '"',
        hLevel = headerLevelStart,
        hashBlock = '<h' + hLevel + hID + '>' + spanGamut + '</h' + hLevel + '>';
    return showdown.subParser('hashBlock')(hashBlock, options, globals);
  }));

  text = text.replace(setextRegexH2, (function (matchFound, m1) {
    var spanGamut = showdown.subParser('spanGamut')(m1, options, globals),
        hID = (options.noHeaderId) ? '' : ' id="' + headerId(m1) + '"',
        hLevel = headerLevelStart + 1,
        hashBlock = '<h' + hLevel + hID + '>' + spanGamut + '</h' + hLevel + '>';
    return showdown.subParser('hashBlock')(hashBlock, options, globals);
  }));

  // atx-style headers:
  //  # Header 1
  //  ## Header 2
  //  ## Header 2 with closing hashes ##
  //  ...
  //  ###### Header 6
  //
  var atxStyle = (options.requireSpaceBeforeHeadingText) ? /^(#{1,6})[ \t]+(.+?)[ \t]*#*\n+/gm : /^(#{1,6})[ \t]*(.+?)[ \t]*#*\n+/gm;

  text = text.replace(atxStyle, (function (wholeMatch, m1, m2) {
    var hText = m2;
    if (options.customizedHeaderId) {
      hText = m2.replace(/\s?\{([^{]+?)}\s*$/, '');
    }

    var span = showdown.subParser('spanGamut')(hText, options, globals),
        hID = (options.noHeaderId) ? '' : ' id="' + headerId(m2) + '"',
        hLevel = headerLevelStart - 1 + m1.length,
        header = '<h' + hLevel + hID + '>' + span + '</h' + hLevel + '>';

    return showdown.subParser('hashBlock')(header, options, globals);
  }));

  function headerId (m) {
    var title,
        prefix;

    // It is separate from other options to allow combining prefix and customized
    if (options.customizedHeaderId) {
      var match = m.match(/\{([^{]+?)}\s*$/);
      if (match && match[1]) {
        m = match[1];
      }
    }

    title = m;

    // Prefix id to prevent causing inadvertent pre-existing style matches.
    if (showdown.helper.isString(options.prefixHeaderId)) {
      prefix = options.prefixHeaderId;
    } else if (options.prefixHeaderId === true) {
      prefix = 'section-';
    } else {
      prefix = '';
    }

    if (!options.rawPrefixHeaderId) {
      title = prefix + title;
    }

    if (options.ghCompatibleHeaderId) {
      title = title
        .replace(/ /g, '-')
        // replace previously escaped chars (&, ¨ and $)
        .replace(/&amp;/g, '')
        .replace(/¨T/g, '')
        .replace(/¨D/g, '')
        // replace rest of the chars (&~$ are repeated as they might have been escaped)
        // borrowed from github's redcarpet (some they should produce similar results)
        .replace(/[&+$,\/:;=?@"#{}|^¨~\[\]`\\*)(%.!'<>]/g, '')
        .toLowerCase();
    } else if (options.rawHeaderId) {
      title = title
        .replace(/ /g, '-')
        // replace previously escaped chars (&, ¨ and $)
        .replace(/&amp;/g, '&')
        .replace(/¨T/g, '¨')
        .replace(/¨D/g, '$')
        // replace " and '
        .replace(/["']/g, '-')
        .toLowerCase();
    } else {
      title = title
        .replace(/[^\w]/g, '')
        .toLowerCase();
    }

    if (options.rawPrefixHeaderId) {
      title = prefix + title;
    }

    if (globals.hashLinkCounts[title]) {
      title = title + '-' + (globals.hashLinkCounts[title]++);
    } else {
      globals.hashLinkCounts[title] = 1;
    }
    return title;
  }

  text = globals.converter._dispatch('headers.after', text, options, globals);
  return text;
}));

/**
 * Turn Markdown link shortcuts into XHTML <a> tags.
 */
showdown.subParser('horizontalRule', (function (text, options, globals) {
  'use strict';
  text = globals.converter._dispatch('horizontalRule.before', text, options, globals);

  var key = showdown.subParser('hashBlock')('<hr />', options, globals);
  text = text.replace(/^ {0,2}( ?-){3,}[ \t]*$/gm, key);
  text = text.replace(/^ {0,2}( ?\*){3,}[ \t]*$/gm, key);
  text = text.replace(/^ {0,2}( ?_){3,}[ \t]*$/gm, key);

  text = globals.converter._dispatch('horizontalRule.after', text, options, globals);
  return text;
}));

/**
 * Turn Markdown image shortcuts into <img> tags.
 */
showdown.subParser('images', (function (text, options, globals) {
  'use strict';

  text = globals.converter._dispatch('images.before', text, options, globals);

  var inlineRegExp      = /!\[([^\]]*?)][ \t]*()\([ \t]?<?([\S]+?(?:\([\S]*?\)[\S]*?)?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(["'])([^"]*?)\6)?[ \t]?\)/g,
      crazyRegExp       = /!\[([^\]]*?)][ \t]*()\([ \t]?<([^>]*)>(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(?:(["'])([^"]*?)\6))?[ \t]?\)/g,
      referenceRegExp   = /!\[([^\]]*?)] ?(?:\n *)?\[(.*?)]()()()()()/g,
      refShortcutRegExp = /!\[([^\[\]]+)]()()()()()/g;

  function writeImageTag (wholeMatch, altText, linkId, url, width, height, m5, title) {

    var gUrls   = globals.gUrls,
        gTitles = globals.gTitles,
        gDims   = globals.gDimensions;

    linkId = linkId.toLowerCase();

    if (!title) {
      title = '';
    }
    // Special case for explicit empty url
    if (wholeMatch.search(/\(<?\s*>? ?(['"].*['"])?\)$/m) > -1) {
      url = '';

    } else if (url === '' || url === null) {
      if (linkId === '' || linkId === null) {
        // lower-case and turn embedded newlines into spaces
        linkId = altText.toLowerCase().replace(/ ?\n/g, ' ');
      }
      url = '#' + linkId;

      if (!showdown.helper.isUndefined(gUrls[linkId])) {
        url = gUrls[linkId];
        if (!showdown.helper.isUndefined(gTitles[linkId])) {
          title = gTitles[linkId];
        }
        if (!showdown.helper.isUndefined(gDims[linkId])) {
          width = gDims[linkId].width;
          height = gDims[linkId].height;
        }
      } else {
        return wholeMatch;
      }
    }

    altText = altText
      .replace(/"/g, '&quot;')
    //altText = showdown.helper.escapeCharacters(altText, '*_', false);
      .replace(showdown.helper.regexes.asteriskAndDash, showdown.helper.escapeCharactersCallback);
    //url = showdown.helper.escapeCharacters(url, '*_', false);
    url = url.replace(showdown.helper.regexes.asteriskAndDash, showdown.helper.escapeCharactersCallback);
    var result = '<img src="' + url + '" alt="' + altText + '"';

    if (title) {
      title = title
        .replace(/"/g, '&quot;')
      //title = showdown.helper.escapeCharacters(title, '*_', false);
        .replace(showdown.helper.regexes.asteriskAndDash, showdown.helper.escapeCharactersCallback);
      result += ' title="' + title + '"';
    }

    if (width && height) {
      width  = (width === '*') ? 'auto' : width;
      height = (height === '*') ? 'auto' : height;

      result += ' width="' + width + '"';
      result += ' height="' + height + '"';
    }

    result += ' />';

    return result;
  }

  // First, handle reference-style labeled images: ![alt text][id]
  text = text.replace(referenceRegExp, writeImageTag);

  // Next, handle inline images:  ![alt text](url =<width>x<height> "optional title")
  // cases with crazy urls like ./image/cat1).png
  text = text.replace(crazyRegExp, writeImageTag);

  // normal cases
  text = text.replace(inlineRegExp, writeImageTag);

  // handle reference-style shortcuts: |[img text]
  text = text.replace(refShortcutRegExp, writeImageTag);

  text = globals.converter._dispatch('images.after', text, options, globals);
  return text;
}));

showdown.subParser('italicsAndBold', (function (text, options, globals) {
  'use strict';

  text = globals.converter._dispatch('italicsAndBold.before', text, options, globals);

  // it's faster to have 3 separate regexes for each case than have just one
  // because of backtracing, in some cases, it could lead to an exponential effect
  // called "catastrophic backtrace". Ominous!

  function parseInside (txt, left, right) {
    if (options.simplifiedAutoLink) {
      txt = showdown.subParser('simplifiedAutoLinks')(txt, options, globals);
    }
    return left + txt + right;
  }

  // Parse underscores
  if (options.literalMidWordUnderscores) {
    text = text.replace(/\b___(\S[\s\S]*)___\b/g, (function (wm, txt) {
      return parseInside (txt, '<strong><em>', '</em></strong>');
    }));
    text = text.replace(/\b__(\S[\s\S]*)__\b/g, (function (wm, txt) {
      return parseInside (txt, '<strong>', '</strong>');
    }));
    text = text.replace(/\b_(\S[\s\S]*?)_\b/g, (function (wm, txt) {
      return parseInside (txt, '<em>', '</em>');
    }));
  } else {
    text = text.replace(/___(\S[\s\S]*?)___/g, (function (wm, m) {
      return (/\S$/.test(m)) ? parseInside (m, '<strong><em>', '</em></strong>') : wm;
    }));
    text = text.replace(/__(\S[\s\S]*?)__/g, (function (wm, m) {
      return (/\S$/.test(m)) ? parseInside (m, '<strong>', '</strong>') : wm;
    }));
    text = text.replace(/_([^\s_][\s\S]*?)_/g, (function (wm, m) {
      // !/^_[^_]/.test(m) - test if it doesn't start with __ (since it seems redundant, we removed it)
      return (/\S$/.test(m)) ? parseInside (m, '<em>', '</em>') : wm;
    }));
  }

  // Now parse asterisks
  if (options.literalMidWordAsterisks) {
    text = text.trim().replace(/(^| )\*{3}(\S[\s\S]*?)\*{3}([ ,;!?.]|$)/g, (function (wm, lead, txt, trail) {
      return parseInside (txt, lead + '<strong><em>', '</em></strong>' + trail);
    }));
    text = text.trim().replace(/(^| )\*{2}(\S[\s\S]*?)\*{2}([ ,;!?.]|$)/g, (function (wm, lead, txt, trail) {
      return parseInside (txt, lead + '<strong>', '</strong>' + trail);
    }));
    text = text.trim().replace(/(^| )\*(\S[\s\S]*?)\*([ ,;!?.]|$)/g, (function (wm, lead, txt, trail) {
      return parseInside (txt, lead + '<em>', '</em>' + trail);
    }));
  } else {
    text = text.replace(/\*\*\*(\S[\s\S]*?)\*\*\*/g, (function (wm, m) {
      return (/\S$/.test(m)) ? parseInside (m, '<strong><em>', '</em></strong>') : wm;
    }));
    text = text.replace(/\*\*(\S[\s\S]*?)\*\*/g, (function (wm, m) {
      return (/\S$/.test(m)) ? parseInside (m, '<strong>', '</strong>') : wm;
    }));
    text = text.replace(/\*([^\s*][\s\S]*?)\*/g, (function (wm, m) {
      // !/^\*[^*]/.test(m) - test if it doesn't start with ** (since it seems redundant, we removed it)
      return (/\S$/.test(m)) ? parseInside (m, '<em>', '</em>') : wm;
    }));
  }


  text = globals.converter._dispatch('italicsAndBold.after', text, options, globals);
  return text;
}));

/**
 * Form HTML ordered (numbered) and unordered (bulleted) lists.
 */
showdown.subParser('lists', (function (text, options, globals) {
  'use strict';
  text = globals.converter._dispatch('lists.before', text, options, globals);

  /**
   * Process the contents of a single ordered or unordered list, splitting it
   * into individual list items.
   * @param {string} listStr
   * @param {boolean} trimTrailing
   * @returns {string}
   */
  function processListItems (listStr, trimTrailing) {
    // The $g_list_level global keeps track of when we're inside a list.
    // Each time we enter a list, we increment it; when we leave a list,
    // we decrement. If it's zero, we're not in a list anymore.
    //
    // We do this because when we're not inside a list, we want to treat
    // something like this:
    //
    //    I recommend upgrading to version
    //    8. Oops, now this line is treated
    //    as a sub-list.
    //
    // As a single paragraph, despite the fact that the second line starts
    // with a digit-period-space sequence.
    //
    // Whereas when we're inside a list (or sub-list), that line will be
    // treated as the start of a sub-list. What a kludge, huh? This is
    // an aspect of Markdown's syntax that's hard to parse perfectly
    // without resorting to mind-reading. Perhaps the solution is to
    // change the syntax rules such that sub-lists must start with a
    // starting cardinal number; e.g. "1." or "a.".
    globals.gListLevel++;

    // trim trailing blank lines:
    listStr = listStr.replace(/\n{2,}$/, '\n');

    // attacklab: add sentinel to emulate \z
    listStr += '¨0';

    var rgx = /(\n)?(^ {0,3})([*+-]|\d+[.])[ \t]+((\[(x|X| )?])?[ \t]*[^\r]+?(\n{1,2}))(?=\n*(¨0| {0,3}([*+-]|\d+[.])[ \t]+))/gm,
        isParagraphed = (/\n[ \t]*\n(?!¨0)/.test(listStr));

    // Since version 1.5, nesting sublists requires 4 spaces (or 1 tab) indentation,
    // which is a syntax breaking change
    // activating this option reverts to old behavior
    if (options.disableForced4SpacesIndentedSublists) {
      rgx = /(\n)?(^ {0,3})([*+-]|\d+[.])[ \t]+((\[(x|X| )?])?[ \t]*[^\r]+?(\n{1,2}))(?=\n*(¨0|\2([*+-]|\d+[.])[ \t]+))/gm;
    }

    listStr = listStr.replace(rgx, (function (wholeMatch, m1, m2, m3, m4, taskbtn, checked) {
      checked = (checked && checked.trim() !== '');

      var item = showdown.subParser('outdent')(m4, options, globals),
          bulletStyle = '';

      // Support for github tasklists
      if (taskbtn && options.tasklists) {
        bulletStyle = ' class="task-list-item" style="list-style-type: none;"';
        item = item.replace(/^[ \t]*\[(x|X| )?]/m, (function () {
          var otp = '<input type="checkbox" disabled style="margin: 0px 0.35em 0.25em -1.6em; vertical-align: middle;"';
          if (checked) {
            otp += ' checked';
          }
          otp += '>';
          return otp;
        }));
      }

      // ISSUE #312
      // This input: - - - a
      // causes trouble to the parser, since it interprets it as:
      // <ul><li><li><li>a</li></li></li></ul>
      // instead of:
      // <ul><li>- - a</li></ul>
      // So, to prevent it, we will put a marker (¨A)in the beginning of the line
      // Kind of hackish/monkey patching, but seems more effective than overcomplicating the list parser
      item = item.replace(/^([-*+]|\d\.)[ \t]+[\S\n ]*/g, (function (wm2) {
        return '¨A' + wm2;
      }));

      // m1 - Leading line or
      // Has a double return (multi paragraph) or
      // Has sublist
      if (m1 || (item.search(/\n{2,}/) > -1)) {
        item = showdown.subParser('githubCodeBlocks')(item, options, globals);
        item = showdown.subParser('blockGamut')(item, options, globals);
      } else {
        // Recursion for sub-lists:
        item = showdown.subParser('lists')(item, options, globals);
        item = item.replace(/\n$/, ''); // chomp(item)
        item = showdown.subParser('hashHTMLBlocks')(item, options, globals);

        // Colapse double linebreaks
        item = item.replace(/\n\n+/g, '\n\n');
        if (isParagraphed) {
          item = showdown.subParser('paragraphs')(item, options, globals);
        } else {
          item = showdown.subParser('spanGamut')(item, options, globals);
        }
      }

      // now we need to remove the marker (¨A)
      item = item.replace('¨A', '');
      // we can finally wrap the line in list item tags
      item =  '<li' + bulletStyle + '>' + item + '</li>\n';

      return item;
    }));

    // attacklab: strip sentinel
    listStr = listStr.replace(/¨0/g, '');

    globals.gListLevel--;

    if (trimTrailing) {
      listStr = listStr.replace(/\s+$/, '');
    }

    return listStr;
  }

  /**
   * Check and parse consecutive lists (better fix for issue #142)
   * @param {string} list
   * @param {string} listType
   * @param {boolean} trimTrailing
   * @returns {string}
   */
  function parseConsecutiveLists (list, listType, trimTrailing) {
    // check if we caught 2 or more consecutive lists by mistake
    // we use the counterRgx, meaning if listType is UL we look for OL and vice versa
    var olRgx = (options.disableForced4SpacesIndentedSublists) ? /^ ?\d+\.[ \t]/gm : /^ {0,3}\d+\.[ \t]/gm,
        ulRgx = (options.disableForced4SpacesIndentedSublists) ? /^ ?[*+-][ \t]/gm : /^ {0,3}[*+-][ \t]/gm,
        counterRxg = (listType === 'ul') ? olRgx : ulRgx,
        result = '';

    if (list.search(counterRxg) !== -1) {
      (function parseCL (txt) {
        var pos = txt.search(counterRxg);
        if (pos !== -1) {
          // slice
          result += '\n<' + listType + '>\n' + processListItems(txt.slice(0, pos), !!trimTrailing) + '</' + listType + '>\n';

          // invert counterType and listType
          listType = (listType === 'ul') ? 'ol' : 'ul';
          counterRxg = (listType === 'ul') ? olRgx : ulRgx;

          //recurse
          parseCL(txt.slice(pos));
        } else {
          result += '\n<' + listType + '>\n' + processListItems(txt, !!trimTrailing) + '</' + listType + '>\n';
        }
      })(list);
    } else {
      result = '\n<' + listType + '>\n' + processListItems(list, !!trimTrailing) + '</' + listType + '>\n';
    }

    return result;
  }

  // add sentinel to hack around khtml/safari bug:
  // http://bugs.webkit.org/show_bug.cgi?id=11231
  text += '¨0';

  if (globals.gListLevel) {
    text = text.replace(/^(( {0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(¨0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm,
      (function (wholeMatch, list, m2) {
        var listType = (m2.search(/[*+-]/g) > -1) ? 'ul' : 'ol';
        return parseConsecutiveLists(list, listType, true);
      })
    );
  } else {
    text = text.replace(/(\n\n|^\n?)(( {0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(¨0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm,
      (function (wholeMatch, m1, list, m3) {
        var listType = (m3.search(/[*+-]/g) > -1) ? 'ul' : 'ol';
        return parseConsecutiveLists(list, listType, false);
      })
    );
  }

  // strip sentinel
  text = text.replace(/¨0/, '');
  text = globals.converter._dispatch('lists.after', text, options, globals);
  return text;
}));

/**
 * Remove one level of line-leading tabs or spaces
 */
showdown.subParser('outdent', (function (text, options, globals) {
  'use strict';
  text = globals.converter._dispatch('outdent.before', text, options, globals);

  // attacklab: hack around Konqueror 3.5.4 bug:
  // "----------bug".replace(/^-/g,"") == "bug"
  text = text.replace(/^(\t|[ ]{1,4})/gm, '¨0'); // attacklab: g_tab_width

  // attacklab: clean up hack
  text = text.replace(/¨0/g, '');

  text = globals.converter._dispatch('outdent.after', text, options, globals);
  return text;
}));

/**
 *
 */
showdown.subParser('paragraphs', (function (text, options, globals) {
  'use strict';

  text = globals.converter._dispatch('paragraphs.before', text, options, globals);
  // Strip leading and trailing lines:
  text = text.replace(/^\n+/g, '');
  text = text.replace(/\n+$/g, '');

  var grafs = text.split(/\n{2,}/g),
      grafsOut = [],
      end = grafs.length; // Wrap <p> tags

  for (var i = 0; i < end; i++) {
    var str = grafs[i];
    // if this is an HTML marker, copy it
    if (str.search(/¨(K|G)(\d+)\1/g) >= 0) {
      grafsOut.push(str);

    // test for presence of characters to prevent empty lines being parsed
    // as paragraphs (resulting in undesired extra empty paragraphs)
    } else if (str.search(/\S/) >= 0) {
      str = showdown.subParser('spanGamut')(str, options, globals);
      str = str.replace(/^([ \t]*)/g, '<p>');
      str += '</p>';
      grafsOut.push(str);
    }
  }

  /** Unhashify HTML blocks */
  end = grafsOut.length;
  for (i = 0; i < end; i++) {
    var blockText = '',
        grafsOutIt = grafsOut[i],
        codeFlag = false;
    // if this is a marker for an html block...
    // use RegExp.test instead of string.search because of QML bug
    while (/¨(K|G)(\d+)\1/.test(grafsOutIt)) {
      var delim = RegExp.$1,
          num   = RegExp.$2;

      if (delim === 'K') {
        blockText = globals.gHtmlBlocks[num];
      } else {
        // we need to check if ghBlock is a false positive
        if (codeFlag) {
          // use encoded version of all text
          blockText = showdown.subParser('encodeCode')(globals.ghCodeBlocks[num].text, options, globals);
        } else {
          blockText = globals.ghCodeBlocks[num].codeblock;
        }
      }
      blockText = blockText.replace(/\$/g, '$$$$'); // Escape any dollar signs

      grafsOutIt = grafsOutIt.replace(/(\n\n)?¨(K|G)\d+\2(\n\n)?/, blockText);
      // Check if grafsOutIt is a pre->code
      if (/^<pre\b[^>]*>\s*<code\b[^>]*>/.test(grafsOutIt)) {
        codeFlag = true;
      }
    }
    grafsOut[i] = grafsOutIt;
  }
  text = grafsOut.join('\n');
  // Strip leading and trailing lines:
  text = text.replace(/^\n+/g, '');
  text = text.replace(/\n+$/g, '');
  return globals.converter._dispatch('paragraphs.after', text, options, globals);
}));

/**
 * Run extension
 */
showdown.subParser('runExtension', (function (ext, text, options, globals) {
  'use strict';

  if (ext.filter) {
    text = ext.filter(text, globals.converter, options);

  } else if (ext.regex) {
    // TODO remove this when old extension loading mechanism is deprecated
    var re = ext.regex;
    if (!(re instanceof RegExp)) {
      re = new RegExp(re, 'g');
    }
    text = text.replace(re, ext.replace);
  }

  return text;
}));

/**
 * These are all the transformations that occur *within* block-level
 * tags like paragraphs, headers, and list items.
 */
showdown.subParser('spanGamut', (function (text, options, globals) {
  'use strict';

  text = globals.converter._dispatch('spanGamut.before', text, options, globals);
  text = showdown.subParser('codeSpans')(text, options, globals);
  text = showdown.subParser('escapeSpecialCharsWithinTagAttributes')(text, options, globals);
  text = showdown.subParser('encodeBackslashEscapes')(text, options, globals);

  // Process anchor and image tags. Images must come first,
  // because ![foo][f] looks like an anchor.
  text = showdown.subParser('images')(text, options, globals);
  text = showdown.subParser('anchors')(text, options, globals);

  // Make links out of things like `<http://example.com/>`
  // Must come after anchors, because you can use < and >
  // delimiters in inline links like [this](<url>).
  text = showdown.subParser('autoLinks')(text, options, globals);
  text = showdown.subParser('italicsAndBold')(text, options, globals);
  text = showdown.subParser('strikethrough')(text, options, globals);
  text = showdown.subParser('simplifiedAutoLinks')(text, options, globals);

  // we need to hash HTML tags inside spans
  text = showdown.subParser('hashHTMLSpans')(text, options, globals);

  // now we encode amps and angles
  text = showdown.subParser('encodeAmpsAndAngles')(text, options, globals);

  // Do hard breaks
  if (options.simpleLineBreaks) {
    // GFM style hard breaks
    // only add line breaks if the text does not contain a block (special case for lists)
    if (!/\n\n¨K/.test(text)) {
      text = text.replace(/\n+/g, '<br />\n');
    }
  } else {
    // Vanilla hard breaks
    text = text.replace(/  +\n/g, '<br />\n');
  }

  text = globals.converter._dispatch('spanGamut.after', text, options, globals);
  return text;
}));

showdown.subParser('strikethrough', (function (text, options, globals) {
  'use strict';

  function parseInside (txt) {
    if (options.simplifiedAutoLink) {
      txt = showdown.subParser('simplifiedAutoLinks')(txt, options, globals);
    }
    return '<del>' + txt + '</del>';
  }

  if (options.strikethrough) {
    text = globals.converter._dispatch('strikethrough.before', text, options, globals);
    text = text.replace(/(?:~){2}([\s\S]+?)(?:~){2}/g, (function (wm, txt) { return parseInside(txt); }));
    text = globals.converter._dispatch('strikethrough.after', text, options, globals);
  }

  return text;
}));

/**
 * Strips link definitions from text, stores the URLs and titles in
 * hash references.
 * Link defs are in the form: ^[id]: url "optional title"
 */
showdown.subParser('stripLinkDefinitions', (function (text, options, globals) {
  'use strict';

  var regex = /^ {0,3}\[(.+)]:[ \t]*\n?[ \t]*<?([^>\s]+)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*\n?[ \t]*(?:(\n*)["|'(](.+?)["|')][ \t]*)?(?:\n+|(?=¨0))/gm;

  // attacklab: sentinel workarounds for lack of \A and \Z, safari\khtml bug
  text += '¨0';

  text = text.replace(regex, (function (wholeMatch, linkId, url, width, height, blankLines, title) {
    linkId = linkId.toLowerCase();
    globals.gUrls[linkId] = showdown.subParser('encodeAmpsAndAngles')(url, options, globals);  // Link IDs are case-insensitive

    if (blankLines) {
      // Oops, found blank lines, so it's not a title.
      // Put back the parenthetical statement we stole.
      return blankLines + title;

    } else {
      if (title) {
        globals.gTitles[linkId] = title.replace(/"|'/g, '&quot;');
      }
      if (options.parseImgDimensions && width && height) {
        globals.gDimensions[linkId] = {
          width:  width,
          height: height
        };
      }
    }
    // Completely remove the definition from the text
    return '';
  }));

  // attacklab: strip sentinel
  text = text.replace(/¨0/, '');

  return text;
}));

showdown.subParser('tables', (function (text, options, globals) {
  'use strict';

  if (!options.tables) {
    return text;
  }

  var tableRgx       = /^ {0,3}\|?.+\|.+\n {0,3}\|?[ \t]*:?[ \t]*(?:[-=]){2,}[ \t]*:?[ \t]*\|[ \t]*:?[ \t]*(?:[-=]){2,}[\s\S]+?(?:\n\n|¨0)/gm,
    //singeColTblRgx = /^ {0,3}\|.+\|\n {0,3}\|[ \t]*:?[ \t]*(?:[-=]){2,}[ \t]*:?[ \t]*\|[ \t]*\n(?: {0,3}\|.+\|\n)+(?:\n\n|¨0)/gm;
      singeColTblRgx = /^ {0,3}\|.+\|\n {0,3}\|[ \t]*:?[ \t]*(?:[-=]){2,}[ \t]*:?[ \t]*\|\n( {0,3}\|.+\|\n)*(?:\n|¨0)/gm;

  function parseStyles (sLine) {
    if (/^:[ \t]*--*$/.test(sLine)) {
      return ' style="text-align:left;"';
    } else if (/^--*[ \t]*:[ \t]*$/.test(sLine)) {
      return ' style="text-align:right;"';
    } else if (/^:[ \t]*--*[ \t]*:$/.test(sLine)) {
      return ' style="text-align:center;"';
    } else {
      return '';
    }
  }

  function parseHeaders (header, style) {
    var id = '';
    header = header.trim();
    // support both tablesHeaderId and tableHeaderId due to error in documention so we don't break backwards compatibility
    if (options.tablesHeaderId || options.tableHeaderId) {
      id = ' id="' + header.replace(/ /g, '_').toLowerCase() + '"';
    }
    header = showdown.subParser('spanGamut')(header, options, globals);

    return '<th' + id + style + '>' + header + '</th>\n';
  }

  function parseCells (cell, style) {
    var subText = showdown.subParser('spanGamut')(cell, options, globals);
    return '<td' + style + '>' + subText + '</td>\n';
  }

  function buildTable (headers, cells) {
    var tb = '<table>\n<thead>\n<tr>\n',
        tblLgn = headers.length;

    for (var i = 0; i < tblLgn; ++i) {
      tb += headers[i];
    }
    tb += '</tr>\n</thead>\n<tbody>\n';

    for (i = 0; i < cells.length; ++i) {
      tb += '<tr>\n';
      for (var ii = 0; ii < tblLgn; ++ii) {
        tb += cells[i][ii];
      }
      tb += '</tr>\n';
    }
    tb += '</tbody>\n</table>\n';
    return tb;
  }

  function parseTable (rawTable) {
    var i, tableLines = rawTable.split('\n');

    // strip wrong first and last column if wrapped tables are used
    for (i = 0; i < tableLines.length; ++i) {
      if (/^ {0,3}\|/.test(tableLines[i])) {
        tableLines[i] = tableLines[i].replace(/^ {0,3}\|/, '');
      }
      if (/\|[ \t]*$/.test(tableLines[i])) {
        tableLines[i] = tableLines[i].replace(/\|[ \t]*$/, '');
      }
    }

    var rawHeaders = tableLines[0].split('|').map((function (s) { return s.trim();})),
        rawStyles = tableLines[1].split('|').map((function (s) { return s.trim();})),
        rawCells = [],
        headers = [],
        styles = [],
        cells = [];

    tableLines.shift();
    tableLines.shift();

    for (i = 0; i < tableLines.length; ++i) {
      if (tableLines[i].trim() === '') {
        continue;
      }
      rawCells.push(
        tableLines[i]
          .split('|')
          .map((function (s) {
            return s.trim();
          }))
      );
    }

    if (rawHeaders.length < rawStyles.length) {
      return rawTable;
    }

    for (i = 0; i < rawStyles.length; ++i) {
      styles.push(parseStyles(rawStyles[i]));
    }

    for (i = 0; i < rawHeaders.length; ++i) {
      if (showdown.helper.isUndefined(styles[i])) {
        styles[i] = '';
      }
      headers.push(parseHeaders(rawHeaders[i], styles[i]));
    }

    for (i = 0; i < rawCells.length; ++i) {
      var row = [];
      for (var ii = 0; ii < headers.length; ++ii) {
        if (showdown.helper.isUndefined(rawCells[i][ii])) {

        }
        row.push(parseCells(rawCells[i][ii], styles[ii]));
      }
      cells.push(row);
    }

    return buildTable(headers, cells);
  }

  text = globals.converter._dispatch('tables.before', text, options, globals);

  // find escaped pipe characters
  text = text.replace(/\\(\|)/g, showdown.helper.escapeCharactersCallback);

  // parse multi column tables
  text = text.replace(tableRgx, parseTable);

  // parse one column tables
  text = text.replace(singeColTblRgx, parseTable);

  text = globals.converter._dispatch('tables.after', text, options, globals);

  return text;
}));

/**
 * Swap back in all the special characters we've hidden.
 */
showdown.subParser('unescapeSpecialChars', (function (text, options, globals) {
  'use strict';
  text = globals.converter._dispatch('unescapeSpecialChars.before', text, options, globals);

  text = text.replace(/¨E(\d+)E/g, (function (wholeMatch, m1) {
    var charCodeToReplace = parseInt(m1);
    return String.fromCharCode(charCodeToReplace);
  }));

  text = globals.converter._dispatch('unescapeSpecialChars.after', text, options, globals);
  return text;
}));

var root = this;

// CommonJS/nodeJS Loader
if (typeof module !== 'undefined' && module.exports) {
  module.exports = showdown;

// AMD Loader
} else if (typeof define === 'function' && define.amd) {
  define((function () {
    'use strict';
    return showdown;
  }));

// Regular Browser loader
} else {
  root.showdown = showdown;
}
}).call(this);

//# sourceMappingURL=showdown.js.map

/**
 * Convert nav items into a JS object
 * @param {String} selector The selector for the nav menu in the DOM
 */
var getNav = function (selector) {

	// Variables
	var nav = [];
	var form, data, secret, created;

	// Generate items object
	mashery.dom.querySelectorAll(selector).forEach((function(item) {
		nav.push({
			label: item.innerHTML,
			url: item.getAttribute('href'),
			isActive: item.parentNode.classList.contains('active') ? true : false
		});
	}));

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
	var h1, headerEdit, appDataBasic, appDataDetails;


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

		// Remove header edit link
		headerEdit = dom.querySelector('#header-edit');
		if (headerEdit) {
			headerEdit.remove();
		}

		// Heading
		h1 = dom.querySelector('h1.first');
		content.heading = h1.innerText;
		h1.remove();

		// Main Content
		content.main = dom.querySelector('#main .section-body').innerHTML;

	}

	// Documentation
	else if (type === 'docs') {

		// Remove header edit link
		headerEdit = dom.querySelector('#header-edit');
		if (headerEdit) {
			headerEdit.remove();
		}

		// Heading
		h1 = dom.querySelector('h1.first');
		content.heading = h1.innerText;
		h1.remove();

		// Main Content
		content.main = dom.querySelector('#main .section-body').innerHTML;

		// Sidebar Navigation
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

	// Key Activity
	else if (type === 'keyActivity') {

		// Variables
		var reports = dom.querySelector('#date_selector');
		data = dom.querySelectorAll('div.key dd');
		secret = data.length === 5 ? true : false;
		created = secret ? data[4].querySelector('abbr') : data[3].querySelector('abbr');

		// Get the main content
		content.main = '<div id="developerReport" class="reports"><div id="date_selector">' + reports.innerHTML + '</div></div>';

		// Get the key data
		content.secondary = {
			api: dom.querySelector('#main .section-body h2').innerHTML,
			application: data[0].innerHTML.trim(),
			key: data[1].innerHTML.trim(),
			secret: secret ? data[2].innerHTML.trim() : null,
			status: secret ? data[3].innerHTML.trim() : data[2].innerHTML.trim(),
			created: created ? created.getAttribute('title') : '',
			limits: '<table>' + dom.querySelector('div.key table.key').innerHTML + '<table>',
		};

		// Init function
		content.init = dom.innerHTML.match(/initCharts\(.*?\)/);

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
		h1 = dom.querySelector('h1.first');
		data = dom.querySelectorAll('.user-information dd');
		var activity = dom.querySelector('table.recent-activity');
		var admin = dom.querySelector('a[href*="/r/member/"]');
		content.main = {
			name: h1 ? h1.innerHTML.replace('View Member ', '').trim() : '',
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

		// Strip inline styles from content
		var styles = dom.querySelectorAll('[style]');
		styles.forEach((function (style) {
			style.style = '';
		}));
		content.main = dom.querySelector('#main').innerHTML;

		// Schemas
		content.schemas = {};
		var schemas = dom.querySelectorAll('.endpointList > script');
		schemas.forEach((function (schema) {
			var strObj = schema.innerHTML.replace('(function() {', '').replace('var apiRootElement = $("#' + schema.parentNode.id + '").get(0);', '').replace("$.data(apiRootElement, 'apiSchemas', ", '').replace(');', '').replace('})();', '').trim();
			content.schemas[schema.parentNode.id] = JSON.parse(strObj);
		}));
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

		// If it's a blank search page
		if (!dom.querySelector('.result') && !dom.querySelector('.no-result')) {
			content.newSearch = true;
		}

		// If there are no results
		else if (dom.querySelector('.no-result')) {
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
				var summary = result.querySelector('.result-summary');
				content.main.push({
					url: link.getAttribute('href'),
					title: link.innerHTML.trim(),
					summary: summary ? summary.innerHTML.replace('<strong>', '<span class="search-term">').replace('</strong>', '</span>').trim() : ''
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

	// Get any inline scripts
	dom.querySelectorAll('script').forEach((function (script) {
		window.mashery.scripts.push(script.innerHTML);
	}));

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

	// Individual Keys
	else if (elem.classList.contains('page-key')) {

		// Delete Key
		if (elem.classList.contains('delete-key')) {
			type = 'keyDelete';
		} else if (elem.classList.contains('key-activity')) {
			type = 'keyActivity';
		}

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

			// Register for a New Account
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
	var globals = [];
	str.replace(/mashery\.globals\.(.*?)=(.*?);/g, (function (match, p1, p2) {
		globals.push(match);
	})).replace(/mashery\.globals\[['|"](.*?)['|"]\]\s*?=\s*?(.*?);/g, (function (match, p1, p2) {
		globals.push(match);
	}));
	try {
		var func = new Function('mashery = window.mashery;' + globals.join(';'));
		func();
	} catch (e) {
		if (console && 'error' in console) {
			console.error('mashery.globals does not support functions.');
		}
	}
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
		scripts: [],
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

// // Undo default syntax highlighting
// SyntaxHighlighter = {};
// SyntaxHighlighter.all = function () {};
// SyntaxHighlighter.regexLib = {};
// SyntaxHighlighter.regexLib.xmlComments = function () {};
var m$ = (function () {

	'use strict';

	//
	// Variables
	//

	// Placeholder for public methods
	var m$ = {};

	// Setup internally global variables
	var settings, main, data, markdown;

	// Path to Files
	var filePaths = {

		// IO Docs
		ioDocsJS: '/files/iodocs-vanilla.js',

		// Syntax Highlighting
		prism: '/files/prism.min.js',

		// API Reporting
		googleJSAPI: 'https://www.google.com/jsapi',
		underscore: '/public/Mashery/scripts/Mashery/source/underscore.js',
		defaultsJS: '/public/Mashery/scripts/MasheryAdmin/Reports/config/defaults.js',
		drillin: '/public/Mashery/scripts/MasheryAdmin/Reports/config/packages/developer_drillin.js',
		reports: '/public/Mashery/scripts/MasheryDeveloperReports.js'

	};

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

		// Text to display in title while loading page
		ajaxLoading: 'Loading...',

		// Class for links that point to the current page
		currentPageClass: 'current-page',

		/**
		 * Favicon
		 */

		// If true, inject a favicon
		favicon: false,

		// The favicon URL
		faviconURL: '/files/favicon.ico',

		// The favicon sizes
		faviconSizes: '16x16 32x32',


		/**
		 * Files to load
		 */
		loadCSS: [], // CSS (loaded in header)
		loadJSHeader: [], // JS loaded before render
		loadJSFooter: [], // JS loaded after render

		/**
		 * Logo
		 * Add a custom logo.
		 * Accepts any markup as a string (<img src>, <svg>, etc.)
		 */
		logo: null,

		// If true, enable markdown on docs and custom pages
		markdown: true,

		// If true, activate mashtip tooltips
		mashtips: true,

		// If true, test password strength
		passwordStrength: true,

		// If true, include viewport resizing meta tag
		responsive: true,

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
				var template = 	'<h1>{{content.heading}}</h1><ul id="nav-account">{{content.navItemsAccount}}</ul>';
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
								'<h1>{{content.heading}}</h1>' +
								'<ul id="nav-account">{{content.navItemsAccount}}</ul>' +
								'<ul id="nav-mashery-account">{{content.navItemsMasheryAccount}}</ul>' +
								'{{content.main}}' +
							'</div>',

			/**
			 * My Account: Email Success
			 * The layout for the page confirming email change was successful
			 */
			accountEmailSuccess:	'<div class="main container container-small" id="main">' +
										'<h1>{{content.heading}}</h1>' +
										'<ul id="nav-account">{{content.navItemsAccount}}</ul>' +
										'<ul id="nav-mashery-account">{{content.navItemsMasheryAccount}}</ul>' +
										'{{content.main}}' +
									'</div>',

			/**
			 * My Keys
			 * The layout for the page displaying a users API keys.
			 */
			accountKeys: function () {
				var template = '<h1>{{content.heading}}</h1><ul id="nav-account">{{content.navItemsAccount}}</ul>';
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
									'<p>' +
										'<a class="btn btn-key-report" id="btn-key-report" href="' + key.report + '">View Report</a>' +
										'<a class="btn btn-delete-key" id="btn-delete-key" href="' + key.delete + '">Delete This Key</a>' +
									'</p>';
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
								'<h1>{{content.heading}}</h1>' +
								'<ul id="nav-account">{{content.navItemsAccount}}</ul>' +
								'<ul id="nav-mashery-account">{{content.navItemsMasheryAccount}}</ul>' +
								'<h2>{{content.subheading}}</h2>' +
								'{{content.main}}' +
							'</div>',

			/**
			 * My Account: Password
			 * The layout for the page where users can change their Mashery password.
			 */
			accountPassword:	'<div class="main container container-small" id="main">' +
									'<h1>{{content.heading}}</h1>' +
									'<ul id="nav-account">{{content.navItemsAccount}}</ul>' +
									'<ul id="nav-mashery-account">{{content.navItemsMasheryAccount}}</ul>' +
									'{{content.main}}' +
								'</div>',

			/**
			 * My Account: Password Success
			 * The layout for the page after users have successfully changed their password.
			 */
			accountPasswordSuccess:	'<div class="main container container-small" id="main">' +
										'<h1>{{content.heading}}</h1>' +
										'<ul id="nav-account">{{content.navItemsAccount}}</ul>' +
										'<ul id="nav-mashery-account">{{content.navItemsMasheryAccount}}</ul>' +
										'{{content.main}}' +
									'</div>',

			/**
			 * Add App APIs
			 * Add APIs to an application
			 */
			appAddAPIs: function () {
				var template =
							'<div class="main container container-small" id="main">' +
								'<h1>{{content.heading}}</h1>' +
								'<ul>' +
									'<li><strong>{{content.applicationLabel}}</strong> ' + window.mashery.content.secondary.application + '</li>' +
									'<li><strong>{{content.createdLabel}}</strong> ' + window.mashery.content.secondary.created + '</li>' +
									(window.mashery.content.secondary.api ? '<li><strong>{{content.apiLabel}}</strong> ' + window.mashery.content.secondary.api + '</li>' : '') +
									(window.mashery.content.secondary.key ? '<li><strong>{{content.keyLabel}}</strong> ' + window.mashery.content.secondary.key + '</li>' : '') +
								'</ul>' +
								'<h2>{{content.subheading}}</h2>' +
								'{{content.main}}' +
							'</div>';

				return template;
			},

			/**
			 * App Delete
			 * Delete an application
			 */
			appDelete: function () {
				var template =
							'<div class="main container container-small" id="main">' +
								'<h1>{{content.heading}}</h1>' +
								'<ul>' +
									'<li><strong>{{content.applicationLabel}}</strong> ' + window.mashery.content.secondary.application + '</li>' +
									'<li><strong>{{content.createdLabel}}</strong> ' + window.mashery.content.secondary.created + '</li>' +
									(window.mashery.content.secondary.api ? '<li><strong>{{content.apiLabel}}</strong> ' + window.mashery.content.secondary.api + '</li>' : '') +
									(window.mashery.content.secondary.key ? '<li><strong>{{content.keyLabel}}</strong> ' + window.mashery.content.secondary.key + '</li>' : '') +
								'</ul>' +
								'<h2>{{content.subheading}}</h2>' +
								'{{content.main}}' +
								'{{content.form}}' +
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
									'{{content.main}}' +
									'{{content.form}}' +
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
							'{{content.main}}' +
							'{{content.form}}' +
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
							'<div class="grid-two-thirds content">' +
								'<h1>{{content.heading}}</h1>' +
								'{{content.main}}' +
							'</div>' +
							'<div class="grid-third">' +
								'<h2>{{content.subheading}}</h2>' +
								'<ul>{{content.secondary}}</ul>' +
							'</div>' +
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
						'{{content.main}}' +
						'{{content.form}}' +
					'</div>',

			/**
			 * Join
			 * The layout for existing Mashery users signing into an area for the first time.
			 * Mashery Terms of Use *must* be displayed on this page, and will be automatically injected if you omit them.
			 */
			join:	'<div class="main container container-small" id="main">' +
						'<h1>{{content.heading}}</h1>' +
						'{{content.main}}' +
						'{{content.form}}' +
						'{{content.terms}}' +
					'</div>',

			/**
			 * Join Success
			 * The layout for the page confirming that an existing Mashery user has joined a new area.
			 */
			joinSuccess:	'<div class="main container container-small" id="main">' +
								'<h1>{{content.heading}}</h1>' +
								'{{content.main}}' +
							'</div>',

			/**
			 * Key Activity
			 * Layout for the key activity report page.
			 */
			keyActivity: function () {
				var template =
					'<h1>{{content.heading}}</h1>' +

					'<ul id="nav-account">{{content.navItemsAccount}}</ul>' +

					'<h2>{{content.subheadingAPI}}</h2>' +
					'<ul>' +
						'<li><strong>{{content.applicationLabel}}</strong> ' + window.mashery.content.secondary.application + '</li>' +
						'<li><strong>{{content.keyLabel}}</strong> ' + window.mashery.content.secondary.key + '</li>' +
						(window.mashery.content.secondary.secret ? '<li><strong>{{content.secretLabel}}</strong> ' + window.mashery.content.secondary.secret + '</li>' : '') +
						'<li><strong>{{content.statusLabel}}</strong> ' + window.mashery.content.secondary.status + '</li>' +
						'<li><strong>{{content.createdLabel}}</strong> ' + window.mashery.content.secondary.created + '</li>' +
					'</ul>' +

					'{{content.limits}}' +

					'{{content.main}}';

				return '<div class="main container container-small" id="main">' + template + '</div>';
			},

			/**
			 * Key Delete
			 * Layout for the delete key page.
			 */
			keyDelete: function () {
				var template =
					'<h1>{{content.heading}}</h1>' +

					'<h2>{{content.subheadingAPI}}</h2>' +
					'<ul>' +
					'<li><strong>{{content.applicationLabel}}</strong> ' + window.mashery.content.secondary.application + '</li>' +
					'<li><strong>{{content.keyLabel}}</strong> ' + window.mashery.content.secondary.key + '</li>' +
					(window.mashery.content.secondary.secret ? '<li><strong>{{content.secretLabel}}</strong> ' + window.mashery.content.secondary.secret + '</li>' : '') +
					'<li><strong>{{content.statusLabel}}</strong> ' + window.mashery.content.secondary.status + '</li>' +
					'<li><strong>{{content.createdLabel}}</strong> ' + window.mashery.content.secondary.created + '</li>' +
					'</ul>' +

					'<h2>{{content.subheadingConfirm}}</h2>' +
					'{{content.main}}' +
					'{{content.form}}';

				return '<div class="main container container-small" id="main">' + template + '</div>';
			},

			/**
			 * Base layout
			 * The markup structure that all of the content will get loaded into.
			 */
			layout:	'<a class="screen-reader screen-reader-focusable" href="#main-wrapper">Skip to content</a>' +
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
								'{{content.main}}' +
								'{{content.form}}' +
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
								'{{content.main}}' +
								'{{content.form}}' +
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
			page:	'<div class="main container content" id="main">' +
						'<h1>{{content.heading}}</h1>' +
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
			primaryNav:	'<div class="nav-primary nav-wrap nav-collapse" id="nav-primary">' +
							'<div class="container padding-top-small padding-bottom-small">' +
								'<a id="logo" class="logo" href="/">{{content.logo}}</a>' +
								'<a role="button" class="nav-toggle" id="nav-primary-toggle" data-nav-toggle="#nav-primary-menu" href="#">{{content.menuToggle}}</a>' +
								'<div class="nav-menu" id="nav-primary-menu">' +
									'<ul class="nav" id="nav-primary-list">' +
										'{{content.navItemsPrimary}}' +
										'<li>{{content.searchForm}}</li>' +
									'</ul>' +
								'</div>' +
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
									'{{content.main}}' +
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
								'{{content.main}}' +
								'{{content.form}}' +
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
				var template = '';
				if (window.mashery.content.newSearch) {
					template += '<h1>{{content.headingNew}}</h1>' +
								'{{content.searchForm}}';
				} else if (window.mashery.content.main) {
					template += '<h1>{{content.heading}}</h1>' +
								'{{content.searchForm}}' +
								'<p>{{content.meta}}</p>';
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
					template +=	'<h1>{{content.heading}}</h1>' +
								'{{content.searchForm}}' +
								'{{content.noResults}}';
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
								'{{content.main}}' +
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
			 * My Apps
			 * The page displaying a users registered applications.
			 */
			accountApps: {
				heading: 'My Apps', // heading
				noApps: 'You don\'t have any apps yet.', // The message to display when a user has no apps
			},

			/**
			 * My Account: Email
			 * The page where users can change their Mashery email address.
			 */
			accountEmail: {
				heading: 'Change Email' // The heading
			},

			/**
			 * My Account: Email Success
			 * The layout for the page confirming email change was successful
			 */
			accountEmailSuccess: {
				heading: 'Email Successfully Changed', // the heading
				main: '<p>An email confirming your change has been sent to the address you provided with your username. Please check your spam folder if you don\'t see it in your inbox.</p>' // The main content
			},

			/**
			 * My Keys
			 * The page displaying a users API keys.
			 */
			accountKeys: {
				heading: 'My API Keys', // The heading
				noKeys: 'You don\'t have any keys yet.', // The message to display when a user has no keys
				noPlanKeys: 'You have not been issued keys for this API.', // The message to display when a user has no keys for a specific plan
			},

			/**
			 * My Account
			 * The page where users can manage their Mashery Account details.
			 */
			accountManage: {
				heading: 'Manage Account', // Heading
				subheading: 'Account Information' // The "Account Information" subheading
			},

			/**
			 * Account Navigation
			 * Labels for the account navigation menu
			 */
			accountNav: {
				// Navigation Labels
				keys: 'Keys', // The account nav label for "My Keys"
				apps: 'Applications', // The account nav label for "My Applications"
				account: 'Manage Account', // The account nav label for "Manage Account"
				changeEmail: 'Change Email', // The account nav label for "Change Email"
				changePassword: 'Change Password', // The account nav label for "Change Password"
				viewProfile: 'View My Public Profile', // The account nav label for "View My Profile"
				removeMembership: 'Remove Membership from {{mashery.area}}' // The account nav label for "Remove Membership"
			},

			/**
			 * My Account: Password
			 * The page where users can change their Mashery password.
			 */
			accountPassword: {
				heading: 'Change Password' // The heading
			},

			/**
			 * My Account: Password Success
			 * The layout for the page after users have successfully changed their password.
			 */
			accountPasswordSuccess: {
				heading: 'Password Successfully Changed', // The heading
				main: '<p>An email confirming your change has been sent to the address you provided with your username. If you use this account on other Mashery powered portals, remember to use your new password.</p>' // The main content
			},

			/**
			 * Add App APIs
			 * Add APIs to an application
			 */
			appAddAPIs: {
				heading: 'Add APIs to this Application',
				application: 'Application:',
				created: 'Created:',
				api: 'API:',
				key: 'Key:',
				subheading: 'Add APIs'
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
				heading: 'Delete Your Application',
				application: 'Application:',
				created: 'Created:',
				api: 'API:',
				key: 'Key:',
				subheading: 'Confirm Deletion',
				main: '<p><strong>Are you sure you want to delete this application and all of its keys?</strong></p>',
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
				main: '<p>Get a key and register your application using the form below to start working with our APIs.</p>' // The message shown above the form
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
				main: '<p>Contact us using the form below.</p>' // The message shown above the form
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
			 * Documentation
			 * The layout for API documentation.
			 */
			docs: {
				subheading: 'In the Docs'
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
				main: '<p>Test our API services with IO-Docs, our interactive API documentation.</p>' // The message displayed before the content
			},

			/**
			 * Join
			 * The page shown to existing Mashery users signing in to a new area.
			 */
			join: {
				heading: 'Join {{mashery.area}}', // The heading
				main: '<p>Since you already have a Mashery account you don\'t have to register again, but we would like to know a little more about you. Please fill out the additional information below.</p>' // The message shown above the form
			},

			/**
			 * Join: Success
			 * The page shown after an existing Mashery user successfully joins a new area.
			 */
			joinSuccess: {
				heading: 'Registration Successful', // The heading
				main: '<p>You have successfully registered as {{content.main}}. Read our <a href="/docs">API documentation</a> to get started. You can view your keys and applications under <a href="{{path.keys}}">My Account</a>.</p>' // The success message
			},

			/**
			 * Key Activity
			 * The page to view key activity reports
			 */
			keyActivity: {
				heading: 'Key Activity',
				api: '{{content.api}}',
				application: 'Application:',
				key: 'Key:',
				secret: 'Secret:',
				status: 'Status:',
				created: 'Created:'
			},

			/**
			 * Delete Key
			 * The page to delete an API key
			 */
			keyDelete: {
				heading: 'Delete Your Key',
				api: '{{content.api}}',
				application: 'Application:',
				key: 'Key:',
				secret: 'Secret:',
				status: 'Status:',
				created: 'Created:',
				subheading: 'Confirm Deletion',
				main: '<p><strong>Are you sure you want to delete this key?</strong></p>',
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
				main: '<p>Enter the email address and username that you registered with and we will send you a link to reset your password.</p>' // The message shown above the form
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
				main: '<p>Enter the email address you used to register and we will send you an email with your username.</p>' // The message shown above the form
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
			 * Primary Navigation Menu
			 */
			primaryNav: {
				toggle: 'Menu'
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
				main: '<p>Register a new Mashery ID to access {{mashery.area}}.</p>', // The message above the form
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
				main: '<p>Enter your username and email address to have your registration confirmation email resent to you.</p>' // The message above the form
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
				headingNew: 'Search',
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
				main: '<p>Sign in to {{mashery.area}} using your Mashery ID.</p>', // The message above the sign in form

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

		// My apps page
		accountApps: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.accountApps.heading;
			},

			// No Apps Content
			'{{content.noApps}}': function () {
				return settings.labels.accountApps.noApps;
			}

		},

		// Change email page
		accountEmail: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.accountEmail.heading;
			}

		},

		// Email successfully changed
		accountEmailSuccess: {

			// The heading
			'{{content.heading}}': function () {
				return settings.labels.accountEmailSuccess.heading;
			},

			// The main content
			'{{content.main}}': function () {
				return settings.labels.accountEmailSuccess.main;
			}

		},

		// User API Keys
		accountKeys: {

			// The heading
			'{{content.heading}}': function () {
				return settings.labels.accountKeys.heading;
			},

			// No Keys Content
			'{{content.noKeys}}': function () {
				return settings.labels.accountKeys.noKeys;
			},

			// No Keys for Plan Content
			'{{content.noPlanKeys}}': function () {
				return settings.labels.accountKeys.noPlanKeys;
			}

		},

		// The My Account Page
		accountManage: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.accountManage.heading;
			},

			// Subheading
			'{{content.subheading}}': function () {
				return settings.labels.accountManage.subheading;
			}

		},

		// Change password page
		accountPassword: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.accountPassword.heading;
			}

		},

		// Change password success page
		accountPasswordSuccess: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.accountPasswordSuccess.heading;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.accountPasswordSuccess.main;
			}

		},

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

		// Add App API pages
		appAddAPIs: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.appAddAPIs.heading;
			},

			// Application label
			'{{content.applicationLabel}}': function () {
				return settings.labels.appAddAPIs.application;
			},

			// Created on label
			'{{content.createdLabel}}': function () {
				return settings.labels.appAddAPIs.created;
			},

			// API label
			'{{content.apiLabel}}': function () {
				return settings.labels.appAddAPIs.api;
			},

			// Key label
			'{{content.keyLabel}}': function () {
				return settings.labels.appAddAPIs.key;
			},

			// Subheading
			'{{content.subheading}}': function () {
				return settings.labels.appAddAPIs.subheading;
			}
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

		// Delete application pages
		appDelete: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.appDelete.heading;
			},

			// Application Label
			'{{content.applicationLabel}}': function () {
				return settings.labels.appDelete.application;
			},

			// Created On Label
			'{{content.createdLabel}}': function () {
				return settings.labels.appDelete.created;
			},

			// API Label
			'{{content.apiLabel}}': function () {
				return settings.labels.appDelete.api;
			},

			// Key Label
			'{{content.keyLabel}}': function () {
				return settings.labels.appDelete.key;
			},

			// Subheading
			'{{content.subheading}}': function () {
				return settings.labels.appDelete.subheading;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.appDelete.main;
			}

		},

		// Edit App Pages
		appEdit: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.appEdit.heading;
			},

			// Body Text
			'{{content.main}}': function () {
				return settings.labels.appEdit.main;
			}

		},

		// App Registration
		appRegister: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.appRegister.heading;
			},

			// Body content
			'{{content.main}}': function () {
				return settings.labels.appRegister.main;
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
			'{{content.main}}': function () {
				return settings.labels.contact.main;
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

		// Docs
		docs: {

			// Subnav heading
			'{{content.subheading}}': function () {
				return settings.labels.docs.subheading;
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
			'{{content.main}}': function () {
				return settings.labels.ioDocs.main;
			}

		},

		// Join Area for Existing Mashery Users
		join: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.join.heading;
			},

			// Subheading
			'{{content.main}}': function () {
				return settings.labels.join.main;
			}

		},

		// Join Successful
		joinSuccess: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.joinSuccess.heading;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.joinSuccess.main;
			}

		},

		// Key Activity Page
		keyActivity: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.keyActivity.heading;
			},

			// API Subheading
			'{{content.subheadingAPI}}': function () {
				return settings.labels.keyActivity.api;
			},

			// API
			'{{content.api}}': function () {
				return window.mashery.content.secondary.api;
			},

			// App Label
			'{{content.applicationLabel}}': function () {
				return settings.labels.keyActivity.application;
			},

			// Key Label
			'{{content.keyLabel}}': function () {
				return settings.labels.keyActivity.key;
			},

			// Secret Label
			'{{content.secretLabel}}': function () {
				return settings.labels.keyActivity.secret;
			},

			// Status Label
			'{{content.statusLabel}}': function () {
				return settings.labels.keyActivity.status;
			},

			// Created Label
			'{{content.createdLabel}}': function () {
				return settings.labels.keyActivity.created;
			},

			// Confirm Subheading
			'{{content.limits}}': function () {
				return window.mashery.content.secondary.limits;
			}

		},

		// Delete Key Page
		keyDelete: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.keyDelete.heading;
			},

			// API Subheading
			'{{content.subheadingAPI}}': function () {
				return settings.labels.keyDelete.api;
			},

			// API
			'{{content.api}}': function () {
				return window.mashery.content.secondary.api;
			},

			// App Label
			'{{content.applicationLabel}}': function () {
				return settings.labels.keyDelete.application;
			},

			// Key Label
			'{{content.keyLabel}}': function () {
				return settings.labels.keyDelete.key;
			},

			// Secret Label
			'{{content.secretLabel}}': function () {
				return settings.labels.keyDelete.secret;
			},

			// Status Label
			'{{content.statusLabel}}': function () {
				return settings.labels.keyDelete.status;
			},

			// Created Label
			'{{content.createdLabel}}': function () {
				return settings.labels.keyDelete.created;
			},

			// Confirm Subheading
			'{{content.subheadingConfirm}}': function () {
				return settings.labels.keyDelete.confirm;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.keyDelete.main;
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
			'{{content.main}}': function () {
				return settings.labels.lostPassword.main;
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

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.lostUsername.main;
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

		// Primary Navigation Menu
		primaryNav: {

			// Menu toggle for smaller screens
			'{{content.menuToggle}}': function () {
				return settings.labels.primaryNav.toggle;
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

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.register.heading;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.register.main;
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

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.registerResend.main;
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

			// Heading: New Search
			'{{content.headingNew}}': function () {
				return settings.labels.search.headingNew;
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

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.signin.heading;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.signin.main;
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

		'{{content.heading}}': function () {
			return (window.mashery.content.heading ? window.mashery.content.heading : '');
		},

		// Main Content (if there's not one specific to the content type)
		'{{content.main}}': function () {
			if (['page', 'docs'].indexOf(window.mashery.contentType) === -1 || !settings.markdown || window.mashery.globals.noMarkdown) {
				return window.mashery.content.main;
			} else {
				return markdown.makeHtml(window.mashery.content.main.replace(/(&lt;.+)?&gt;/g, (function($0, $1) {
					return $1 ? $0 : '>';
				})).trim());
			}
		},

		// Main Form (if there's not one specific to the content type)
		'{{content.form}}': function () {
			return window.mashery.content.main;
		},

		// Secondary Content (if there's not one specific to the content type)
		'{{content.secondary}}': function () {

			// If docs, add true current-page
			if (window.mashery.contentType === 'docs') {

				// Variables
				var nav = document.createElement('div');
				var url = cleanLink(location.protocol + '//' + location.host + location.pathname);
				nav.innerHTML = window.mashery.content.secondary;

				// Add class to links
				nav.querySelectorAll('li a').forEach((function (link) {

					// Get URL
					var href = cleanLink(link.getAttribute('href'));

					// If it's the docs landing page
					if (window.mashery.contentId === 'docs' && /\/docs\/read\/Home/.test(href)) {
						link.parentNode.classList.add(settings.currentPageClass);
						return;
					}

					// If the page matches the URL (without anchor tags)
					if (href === url) {
						link.parentNode.classList.add(settings.currentPageClass);
					}

				}));

				// Update the content
				window.mashery.content.secondary = nav.innerHTML;

			}
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

			// Variables
			var url = cleanLink(location.protocol + '//' + location.host + location.pathname);
			var nav = document.createElement('div');
			nav.innerHTML = getNavItems(window.mashery.content.navSecondary);

			// Add current page class to active link, if any
			nav.querySelectorAll('a').forEach((function (link) {
				if (cleanLink(link.href) === url) {
					link.parentNode.classList.add(settings.currentPageClass);
				}
			}));

			return nav.innerHTML;

		},

		// User Nav Items (<li><a href="#">link</a></li> without a parent list wrapper)
		'{{content.navItemsUser}}': function () {
			return getUserNavItems();
		},

		// Mashery Made Logo
		'{{content.masheryMade}}': function () {
			return '<a id="mashery-made-logo" href="http://mashery.com"><img src="https://support.mashery.com/public/Mashery/images/masherymade.png"></a>';
		},

		// Registration Terms of Use
		'{{content.terms}}': function () {
			var text =
				'<div id="registration-terms-of-service">' +
				'<p>By clicking the "Register" button, I certify that I have read and agree to {{content.privacyPolicy}}the <a href="http://www.mashery.com/terms/">Mashery Terms of Service</a> and <a href="http://www.mashery.com/privacy/">Privacy Policy</a>.</p>' +
				'</div>';
			return text;
		},

		// Privacy Policy
		'{{content.privacyPolicy}}': function () {
			return settings.labels.register.privacyPolicy;
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
			existing.remove();
		}
		var ref = window.document.getElementsByTagName('script')[0];
		var script = window.document.createElement('script');
		script.src = src;
		script.async = true;
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
		var ss = window.document.createElement("link");
		var ref = before || window.document.getElementsByTagName("script")[0];
		var sheets = window.document.styleSheets;
		ss.rel = "stylesheet";
		ss.href = href;
		// temporarily, set media to something non-matching to ensure it'll fetch without blocking render
		ss.media = "only x";
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
				ss.media = media || "all";
			}
			else {
				setTimeout(toggleMedia);
			}
		}
		toggleMedia();
		return ss;
	};

	/**
	 * Detect when CSS is loaded and run a callback
	 * @public
	 * @copyright 2017 Filament Group, Inc.
	 * @license MIT
	 * @param {Node}     ss        The stylesheet
	 * @param {Function} callback  The callback to run
	 */
	m$.onloadCSS = function (ss, callback) {
		var called;
		function newcb() {
			if (!called && callback) {
				called = true;
				callback.call(ss);
			}
		}
		if (ss.addEventListener) {
			ss.addEventListener("load", newcb);
		}
		if (ss.attachEvent) {
			ss.attachEvent("onload", newcb);
		}

		// This code is for browsers that don’t support onload
		// No support for onload (it'll bind but never fire):
		//	* Android 4.3 (Samsung Galaxy S4, Browserstack)
		//	* Android 4.2 Browser (Samsung Galaxy SIII Mini GT-I8200L)
		//	* Android 2.3 (Pantech Burst P9070)

		// Weak inference targets Android < 4.4
		if ("isApplicationInstalled" in navigator && "onloadcssdefined" in ss) {
			ss.onloadcssdefined(newcb);
		}
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
		return prefix + id.toLowerCase().replace(/^[^a-z]+|[^\w:.-]+/g, '-').replace('read-', '').replace('home-', 'home').replace('-home', '');
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
	 * @public
	 * @param   {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
	 * @param   {Object}   objects  The objects to merge together
	 * @returns {Object}            Merged values of defaults and options
	 */
	m$.extend = function () {

		// Variables
		var extended = {};
		var i = 0;
		var length = arguments.length;

		// Merge the object into the extended object
		var merge = function (obj) {
			for (var prop in obj) {
				if (Object.prototype.hasOwnProperty.call(obj, prop)) {
					// If property is an object, merge properties
					if (Object.prototype.toString.call(obj[prop]) === '[object Object]') {
						extended[prop] = m$.extend(extended[prop], obj[prop]);
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

	/**
	 * Reset global Portal options
	 * @public
	 */
	m$.resetOptions = function () {
		window.portalOptions = {
			templates: {},
			labels: {}
		};
	};

	/**
	 * Merge user options into Portal settings
	 * @public
	 * @param {Object} options  User options to merge into defaults
	 */
	m$.setOptions = function (options) {
		settings = m$.extend(defaults, options || {});
	};

	/**
	 * Emit a custom event
	 * @public
	 * @param {String} eventName  The name of the event to emit
	 * @param {Object} options    Options for the event
	 * @param {Node}   elem       The element to dispatch the event on [optional - defaults to window]
	 */
	m$.emitEvent = function (eventName, options, elem) {

		// Setup elem on which to dispatch event
		elem = elem ? elem : window;

		// Create a new event
		var event = new CustomEvent(eventName, options);

		// Dispatch the event
		elem.dispatchEvent(event);

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
			if (localPlaceholders[local]) {
				localPlaceholders[local].forEach((function (content, placeholder) {
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
	 * Remove garbage from a URL
	 * @param {String} link The URL to clean
	 */
	var cleanLink = function (link) {
		var url = link.replace('/read', '').replace('/home', '').replace(/#([^\\s]*)/g, '');
		if (url.slice(-1) === '/') {
			url = url.slice(0, -1);
		}
		return url;
	};

	/**
	 * Get the user navigation items
	 * @private
	 */
	var getUserNavItems = function () {

		var template;

		if (mashery.loggedIn) {

			// Check for current page
			var isAccount = ['accountKeys', 'accountApps', 'appRegister', 'appRegisterSuccess', 'appEdit', 'appAddAPIsSuccess', 'appAddAPIs', 'appDelete', 'appAddAPIsError', 'keyDelete', 'keyActivity', 'accountEmailSuccess', 'accountEmail', 'accountPasswordSuccess', 'accountPassword', 'memberRemove', 'showSecret', 'showSecretSuccess', 'showSecretError', 'accountManage'].indexOf(window.mashery.contentType) === -1 ? false : true;
			var isSignOut = ['logout', 'logoutFail'].indexOf(window.mashery.contentType) === -1 ? false : true;

			// @start here

			// If the user is logged in
			template =
				'<li id="nav-user-myaccount"' + (isAccount ? ' class="' + settings.currentPageClass + '"' : '') + '><a href="{{path.keys}}">' + settings.labels.userNav.account + '</a></li>' +
				(mashery.isAdmin ? '<li id="nav-user-dashboard"><a href="{{path.dashboard}}">' + settings.labels.userNav.dashboard + '</a></li>' : '') +
				'<li id="nav-user-signout"' + (isSignOut ? ' class="' + settings.currentPageClass + '"' : '') + '><a href="{{path.logout}}">' + settings.labels.userNav.signout + '</a></li>';

		} else {

			// Check for current page
			var isSignIn = window.mashery.contentType === 'signin' ? true : false;
			var isRegister = ['registerSent', 'register', 'registerResendSuccess', 'registerResend', 'joinSuccess', 'join'].indexOf(window.mashery.contentType) === -1 ? false : true;

			// If they're logged out
			template =
				'<li id="nav-user-signin"' + (isSignIn ? ' class="' + settings.currentPageClass + '"' : '') + '><a href="{{path.signin}}">' + settings.labels.userNav.signin + '</a></li>' +
				'<li id="nav-user-register"' + (isRegister ? ' class="' + settings.currentPageClass + '"' : '') + '><a href="{{path.register}}">' + settings.labels.userNav.register + '</a></li>';

		}

		return replacePlaceholders(template);
	};

	/**
	 * Get the account navigation items
	 * @private
	 */
	var getAccountNavItems = function () {

		// Get current page
		var isKeys = ['accountKeys', 'keyDelete', 'keyActivity', 'showSecret', 'showSecretSuccess', 'showSecretError'].indexOf(window.mashery.contentType) === -1 ? false : true;
		var isApps = ['accountApps', 'appRegister', 'appRegisterSuccess', 'appEdit', 'appAddAPIsSuccess', 'appAddAPIs', 'appDelete', 'appAddAPIsError'].indexOf(window.mashery.contentType) === -1 ? false : true;
		var isAccount = ['accountEmailSuccess', 'accountEmail', 'accountPasswordSuccess', 'accountPassword', 'memberRemoveSuccess', 'memberRemove', 'accountManage'].indexOf(window.mashery.contentType) === -1 ? false : true;

		// Create template
		var template =
			'<li' + (isKeys ? ' class="' + settings.currentPageClass + '"' : '') + '><a href="{{path.keys}}">' + settings.labels.accountNav.keys + '</a></li>' +
			'<li' + (isApps ? ' class="' + settings.currentPageClass + '"' : '') + '><a href="{{path.apps}}">' + settings.labels.accountNav.apps + '</a></li>' +
			'<li' + (isAccount ? ' class="' + settings.currentPageClass + '"' : '') + '><a href="{{path.account}}">' + settings.labels.accountNav.account + '</a></li>';

		return replacePlaceholders(template);

	};

	/**
	 * Get the Mashery account navigation items
	 * @private
	 */
	var getMasheryAccountNavItems = function () {

		// Get current page
		var isEmail = ['accountEmailSuccess', 'accountEmail'].indexOf(window.mashery.contentType) === -1 ? false : true;
		var isPassword = ['accountPasswordSuccess', 'accountPassword'].indexOf(window.mashery.contentType) === -1 ? false : true;
		var isRemove = ['memberRemoveSuccess', 'memberRemove'].indexOf(window.mashery.contentType) === -1 ? false : true;

		// Create template
		var template =
			'<li' + (isEmail ? ' class="' + settings.currentPageClass + '"' : '') + '><a href="{{path.changeEmail}}">' + settings.labels.accountNav.changeEmail + '</a></li>' +
			'<li' + (isPassword ? ' class="' + settings.currentPageClass + '"' : '') + '><a href="{{path.changePassword}}">' + settings.labels.accountNav.changePassword + '</a></li>' +
			'<li><a href="{{path.viewProfile}}">' + settings.labels.accountNav.viewProfile + '</a></li>' +
			'<li' + (isRemove ? ' class="' + settings.currentPageClass + '"' : '') + '><a href="{{path.removeMembership}}">' + settings.labels.accountNav.removeMembership + '</a></li>';

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
			template += '<li' + (item.isActive ? ' class="' + settings.currentPageClass + '"' : '') + '><a href="' + decodeURIComponent(item.url) + '">' + item.label + '</a></li>';
		}));
		return template;
	};

	/**
	 * Render content in the Portal
	 * @private
	 * @param {String}  selector The selector for the element to render the content into
	 * @param {String}  key      The content type
	 * @param {String}  before   The name of the event to emit before rendering
	 * @param {String}  after    The name of the event to emit after rendering
	 */
	var render = function (selector, key, before, after) {

		// Get the content
		var content = document.querySelector(selector);
		if (!content) return;

		// Emit the before render event
		if (before) {
			m$.emitEvent(before);
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

		// Emit the after render event
		if (after) {
			m$.emitEvent(after);
		}

	};

	/**
	 * Verify that a user logged in.
	 * @private
	 * @bugfix Sometimes mashery variable provides wrong info at page load after logout event
	 */
	var verifyLoggedIn = function () {

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
	 * @private
	 */
	var addStyleHooks = function () {

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
	 * Load user CSS and header JS files
	 * @private
	 */
	var loadHeaderFiles = function () {
		settings.loadCSS.forEach((function (css) {
			m$.loadCSS(css);
		}));
		settings.loadJSHeader.forEach((function (js) {
			m$.loadJS(js);
		}));
	};

	/**
	 * Load user footer JS files
	 * @private
	 */
	var loadFooterFiles = function () {

		// Run user scripts
		settings.loadJSFooter.forEach((function (js) {
			m$.loadJS(js);
		}));

		// Run inline scripts if Ajax on custom pages and documentation
		if (!window.masheryIsAjax) return;
		if (['page', 'docs'].indexOf(window.mashery.contentType) === -1) return;
		window.mashery.scripts.forEach((function (script) {
			var func = new Function(script);
			func();
		}));

	};

	/**
	 * Load IO Docs scripts if they're not already present
	 * @private
	 */
	var loadIODocsScripts = function () {

		// Inject base styles
		if (!document.querySelector('#iodocs-css')) {
			var style = document.createElement('style');
			style.id = 'iodocs-css';
			style.innerHTML = '.io-docs-hide{display:none!important;visibility:hidden!important}.endpoint h3.title,.method div.title{cursor:pointer}';
			document.querySelector('script').before(style);
		}

		// Invalidate old iodocs script
		window.iodocs = null;

		// Load IO Docs and initialize it
		m$.loadJS(filePaths.ioDocsJS, (function () {
			ioDocs.init();
		}));

	};

	/**
	 * Load required files for IODocs
	 * @private
	 */
	var loadRequiredFilesIODocs = function () {

		// If not IO Docs, bail
		if (window.mashery.contentType !== 'ioDocs') {
			if ('ioDocs' in window) {
				ioDocs.destroy();
			}
			return;
		}

		// Load IODocsScripts
		loadIODocsScripts();

	};

	/**
	 * Load required files for IODocs
	 * @private
	 */
	var loadRequiredFilesPasswords = function () {

		// Only run on pages with password requirement lists
		if (!document.querySelector('#passwd_requirements')) {
			if ('masheryTestPassword' in window) {
				masheryTestPassword.destroy();
			}
			return;
		}

		// Only run if passwordStrength is enabled
		if (!settings.passwordStrength) {
			// Remove indicator from the DOM
			document.querySelectorAll('#passwd_requirements, label[for="passwd_strength_indicator"]').forEach((function (indicator) {
				indicator.remove();
			}));
			return;
		}

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
		}

		// Only run if passwordStrength is enabled
		if (!settings.mashtips) return;

		// Initialize tests
		masheryMashtips.init();

	};

	var loadRequiredFilesReporting = function () {

		// Only run on reports page
		if (window.mashery.contentType !== 'keyActivity' || !Array.isArray(window.mashery.content.init)) return;

		// Load required JS files
		m$.loadJS(filePaths.googleJSAPI, (function () {
			m$.loadJS(filePaths.underscore, (function () {
				m$.loadJS(filePaths.defaultsJS, (function () {
					m$.loadJS(filePaths.drillin, (function () {
						m$.loadJS(filePaths.reports, (function () {
							initCharts(window.mashery.content.init.index);
						}));
					}));
				}));
			}));
		}));

	};

	/**
	 * Get the language class for an element
	 * @private
	 * @param {String} lang  The system-generated class for the code
	 */
	var getLangClass = function (lang) {

		var langClass = '';

		if (lang === 'bash') { langClass = 'lang-bash'; }
		if (lang === 'csharp') { langClass = 'lang-clike'; }
		if (lang === 'cpp') { langClass = 'lang-clike'; }
		if (lang === 'css') { langClass = 'lang-css'; }
		if (lang === 'java') { langClass = 'lang-java'; }
		if (lang === 'jscript') { langClass = 'lang-javascript'; }
		if (lang === 'php') { langClass = 'lang-php'; }
		if (lang === 'python') { langClass = 'lang-python'; }
		if (lang === 'ruby') { langClass = 'lang-ruby'; }
		if (lang === 'xml') { langClass = 'lang-markup'; }

		return langClass;

	};

	/**
	 * Add language classes to all pre elements
	 */
	var addCodeLanguage = function () {
		document.querySelectorAll('pre').forEach((function (pre) {
			var lang = /brush: (.*?);/.exec(pre.className);
			var code = pre.querySelector('code');
			if (!lang || !Array.isArray(lang) || lang.length < 2) return;
			var langClass = getLangClass(lang[1]);
			pre.classList.add(langClass);
			pre.className = pre.className.replace(/brush: (.*?);/, '');
			if (!code) {
				pre.innerHTML = '<code>' + pre.innerHTML + '</code>';
			}
		}));
	};

	/**
	 * Load Prism.js syntax highlighting
	 * @private
	 */
	var loadPrism = function () {
		addCodeLanguage();
		m$.loadJS(filePaths.prism, (function () {
			Prism.highlightAll();
		}));
	};

	/**
	 * Load any Mashery files that are required for a page to work
	 * @private
	 */
	var loadRequiredFiles = function () {
		loadPrism(); // Load syntax highlighter
		loadRequiredFilesIODocs(); // Load required files for IO Docs
		loadRequiredFilesPasswords(); // Load required files for registration and password pages
		loadRequiredFilesReporting(); // Load key activity reporting scripts
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
			submit.setAttribute('onclick', 'return confirm("' + localPlaceholders.memberRemove['{{content.popup}}']() + '")');
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
	 * @private
	 */
	var renderLayout = function () {
		render('#app', 'layout', 'portalBeforeRenderLayout', 'portalAfterRenderLayout');
		verifyLoggedIn();
	};

	/**
	 * Render the title attribute
	 * @private
	 */
	var renderTitle = function () {
		document.title = replacePlaceholders(settings.labels.title, window.mashery.contentType);
	};

	/**
	 * Render the user navigation
	 * @private
	 */
	var renderUserNav = function () {
		render('#nav-user-wrapper', 'userNav', 'portalBeforeRenderUserNav', 'portalAfterRenderUserNav');
	};

	/**
	 * Render the primary navigation
	 * @private
	 */
	var renderPrimaryNav = function () {
		render('#nav-primary-wrapper', 'primaryNav', 'portalBeforeRenderPrimaryNav', 'portalAfterRenderPrimaryNav');
	};

	/**
	 * Render the secondary navigation
	 * @private
	 */
	var renderSecondaryNav = function () {
		render('#nav-secondary-wrapper', 'secondaryNav', 'portalBeforeRenderSecondaryNav', 'portalAfterRenderSecondaryNav');
	};

	/**
	 * Render the footer
	 * @private
	 */
	var renderFooter = function () {

		// Run the before render event
		m$.emitEvent('portalBeforeRenderFooter');

		// Render footers 1 and 2
		render('#footer-1-wrapper', 'footer1');
		render('#footer-2-wrapper', 'footer2');

		// Run the after render event
		m$.emitEvent('portalAfterRenderFooter');

	};

	/**
	 * Render the main content
	 * @private
	 */
	var renderMain = function () {
		render('#main-wrapper', window.mashery.contentType, 'portalBeforeRenderMain', 'portalAfterRenderMain');
	};

	/**
	 * Get an element's distance from the top of the page
	 * @private
	 * @param  {Node}   elem  The element to get the distance of
	 * @return {Number}       The element's distance from the top of the page
	 */
	var getOffsetTop = function (elem) {

		// Set our distance placeholder
		var distance = 0;

		// Loop up the DOM
		if (elem.offsetParent) {
			do {
				distance += elem.offsetTop;
				elem = elem.offsetParent;
			} while (elem);
		}

		// Return our distance
		return distance < 0 ? 0 : distance;
	};

	/**
	 * Jump to anchor or adjust focus when rendering is complete
	 * (Our JS rendering process breaks the normal browser behavior)
	 * @public
	 */
	m$.fixLocation = function () {
		if (window.location.hash) {
			var location = document.querySelector(window.location.hash);
			if (!location) return;
			location.focus();
			window.scrollTo(0, getOffsetTop(location));
		} else {
			document.querySelector('#app').focus();
			window.scrollTo(0, 0);
		}
	};

	/**
	 * Add required content and make required DOM updates
	 * @private
	 */
	var renderCleanup = function () {

		// Render hidden forms and required content
		loadRequiredFiles(); // Load required CSS/JS files into the DOM
		renderLogout(); // Logout Form
		renderMemberRemove(); // Remove Member Form
		renderMasheryMade(); // Add the Mashery Made logo if missing
		renderTOS(); // Add the Mashery Terms of Service if missing from registration page

		// Make updates to DOM content
		updateDeleteAppConfirmModal(); // Update the delete app confirmation modal
		updateDeleteKeyConfirmModal();  // Update the delete key confirmation modal

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

		// Run before Ajax event
		m$.emitEvent('portalBeforeRenderAjax');

		if (settings.ajaxLoading) {
			document.title = settings.ajaxLoading;
		}

		atomic.ajax({
			url: url,
			responseType: 'document'
		}).success((function (data) {

			// Render our content on Success
			renderWithAjax(data, url, pushState);

			// Run after Ajax event
			m$.emitEvent('portalAfterRenderAjax');

		})).error((function (data, xhr) {
			// If a 404, display 404 error
			if (xhr.status === 404) {

				renderWithAjax(data, url, pushState);

				// Run Ajax error event
				m$.emitEvent('portalAjaxError');

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

		// Make sure clicked element is a link
		var link = event.target.closest('a');
		if (!link) return;

		// Make sure Ajax is enabled and clicked object isn't on the ignore list
		if (!settings.ajax || (settings.ajaxIgnore && link.matches(settings.ajaxIgnore))) return;

		// Make sure clicked item was a valid, local link
		if (!link.href || link.hostname !== window.location.hostname) return;

		// Skip Ajax on member remove success page
		if (window.mashery.contentType === 'memberRemoveSuccess') return;

		// Don't run if link is an anchor to the current page
		if (link.pathname === window.location.pathname && (link.hash.length > 0 || /#/.test(link.href))) return;

		// Don't run if right-click or command/control + click
		if (event.button !== 0 || event.metaKey || event.ctrlKey) return;

		// Prevent the default click event
		event.preventDefault();

		// Get the content with Ajax
		fetchContent(link.href, true);

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
	 * Processes to run before rendering starts
	 * @private
	 */
	var beforeRenderHandler = function (event) {
		document.documentElement.classList.remove('loading'); // Remove loading class from the DOM
		document.documentElement.classList.remove('complete'); // Remove rendering class from the DOM
		document.documentElement.classList.add('rendering'); // Add rendering class to the DOM
		renderHead(event.detail.ajax); // <head> attributes
		loadHeaderFiles(); // Load user CSS and header JS files
		addStyleHooks(); // Content-specific classes
	};

	/**
	 * Processes to run after rendering is complete
	 * @private
	 */
	var afterRenderHandler = function () {
		loadFooterFiles(); // Load user footer JS files
		renderCleanup(); // Cleanup DOM
		m$.fixLocation(); // Jump to anchor or top of page
		document.documentElement.classList.remove('rendering'); // Remove rendering class from the DOM
		document.documentElement.classList.add('complete'); // Remove rendering class from the DOM
	};

	/**
	 * Render the Portal
	 * @public
	 * @param {Boolean} ajax  If true, the page is being loaded via Ajax
	 */
	m$.renderPortal = function (ajax) {
		m$.emitEvent('portalBeforeRender', {
			detail: {
				ajax: ajax
			}
		});  // Emit before render event
		renderLayout(); // Layout
		renderUserNav(); // User Navigation
		renderPrimaryNav(); // Primary Navigation
		renderSecondaryNav(); // Secondary Navigation
		renderMain(); // Main Content
		renderTitle(); // Page Title
		renderFooter(); // Footer
		m$.emitEvent('portalAfterRender', {
			detail: {
				ajax: ajax
			}
		});  // Emit after render event
	};

	/**
	* Initialize
	* @public
	* @param {object} options User options and overrides
	*/
	m$.init = function (options) {

		// Merge user options with defaults
		m$.setOptions(options);

		// Emit event before initializing
		m$.emitEvent('portalBeforeInit');

		// Setup markdown
		markdown = new showdown.Converter();
		markdown.setFlavor('github');

		// Add render event handlers
		window.addEventListener('portalBeforeRender', beforeRenderHandler, false);
		window.addEventListener('portalAfterRender', afterRenderHandler, false);

		// Render the Portal
		m$.renderPortal();

		// Setup Ajax variable
		window.masheryIsAjax = false;

		// Listen for click events
		document.addEventListener('click', clickHandler, false);

		// Listen for form submissions and popstate events on Ajax
		if (settings.ajax) {
			window.addEventListener('popstate', popstateHandler, false);
			window.addEventListener('submit', submitHandler, false);
		}

		// Emit event after initializing
		m$.emitEvent('portalAfterInit');

	};


	//
	// Public APIs
	//

	return m$;

})();