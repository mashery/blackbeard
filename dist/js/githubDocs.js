/*! blackbeard vbeta | (c) 2017 Chris Ferdinandi | LicenseRef-All Rights Reserved License | http://github.com/mashery/blackbeard */
var githubDocs = function (options) {

	'use strict';

	// Polyfill for window.atob()
	// https://github.com/davidchambers/Base64.js/
	/* jshint ignore:start */
	if (!('atob' in window)) {
		!(function () { function e(e) { this.message = e } var t = "undefined" != typeof exports ? exports : "undefined" != typeof self ? self : $.global, r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="; e.prototype = new Error, e.prototype.name = "InvalidCharacterError", t.btoa || (t.btoa = function (t) { for (var o, n, a = String(t), i = 0, f = r, c = ""; a.charAt(0 | i) || (f = "=", i % 1); c += f.charAt(63 & o >> 8 - i % 1 * 8)) { if (n = a.charCodeAt(i += .75), n > 255) throw new e("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range."); o = o << 8 | n } return c }), t.atob || (t.atob = function (t) { var o = String(t).replace(/[=]+$/, ""); if (o.length % 4 == 1) throw new e("'atob' failed: The string to be decoded is not correctly encoded."); for (var n, a, i = 0, f = 0, c = ""; a = o.charAt(f++); ~a && (n = i % 4 ? 64 * n + a : a, i++ % 4) ? c += String.fromCharCode(255 & n >> (-2 * i & 6)) : 0)a = r.indexOf(a); return c }) })();
	}
	/* jshint ignore:end */

	// Sanity check
	if (!window.mashery.globals.github) return;

	// Variables
	var defaults = {
		selector: '.content',
		user: null,
		repo: null,
		root: '',
		runScripts: false,
		loading: '<p>Loading...</p>',
		failMessage: '<p>Unable to load content. Visit <a target="_blank" href="https://github.com/mashery/blackbeard/tree/master/docs/' + mashery.globals.github + '">https://github.com/mashery/blackbeard/tree/master/docs/' + mashery.globals.github + '</a> to view the documentation.</p>'
	};
	var settings = m$.extend(defaults, options || {});
	if (!settings.user || !settings.repo) return;
	var main = document.querySelector(settings.selector);
	if (!main) return;

	// Add loading text
	main.innerHTML = settings.loading;

	var renderDocs = function (content) {

		// Convert markdown to HTML
		main.innerHTML = m$.convertMarkdown(content);

		// If inline scripts should be run, run them
		if (settings.runScripts) {
			main.querySelectorAll('script').forEach((function (script) {
				var func = new Function(script.innerHTML);
				func();
			}));
		}

		// Fix the location
		m$.fixLocation();

		// Syntax highlight code
		if ('Prism' in window) {
			Prism.highlightAll();
		}

		m$.emitEvent('portalAfterGitHubRender');

	};

	// Get the docs
	var docs = sessionStorage.getItem('portalGHDocs_' + window.mashery.contentId);
	if (docs) {
		renderDocs(docs);
	} else {

		atomic.ajax({
			url: 'https://api.github.com/repos/' + settings.user + '/' + settings.repo + '/contents/' + settings.root + mashery.globals.github
		}).success((function (data) {
			var content = window.atob(data.content);
			renderDocs(content);
			sessionStorage.setItem('portalGHDocs_' + window.mashery.contentId, content);
		})).error((function (data) {
			main.innerHTML = settings.failMessage;
			m$.emitEvent('portalAfterGitHubError');
		}));

	}

};