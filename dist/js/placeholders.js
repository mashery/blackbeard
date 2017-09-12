/*! blackbeard vbeta | (c) 2017 Chris Ferdinandi | LicenseRef-All Rights Reserved License | http://github.com/mashery/blackbeard */
/**
 * requestAnimationFrame() polyfill
 * By Erik Möller. Fixes from Paul Irish and Tino Zijdel.
 * @link http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 * @link http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 * @license MIT
 */
(function() {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] ||
		                              window[vendors[x]+'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout((function() { callback(currTime + timeToCall); }),
				timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
	}

	if (!window.cancelAnimationFrame) {
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
	}
}());

/**
 * Load a JS file asynchronously.
 * @author @scottjehl, Filament Group, Inc.
 * @license MIT
 * @link https://github.com/filamentgroup/loadJS
 * @param  {String}   src       URL of script to load.
 * @param  {Function} callback  Callback to run on completion.
 * @return {String}             The script URL.
 */
var loadJS = function (src, callback){
	'use strict';
	var ref = window.document.getElementsByTagName('script')[ 0 ];
	var script = window.document.createElement('script');
	script.src = src;
	ref.parentNode.insertBefore(script, ref);
	if (callback && typeof (callback) === 'function') {
		script.onload = callback;
	}
	return script;
};
var loadPlaceholder = function () {
	document.documentElement.className += ' loading';
	var placeholder = document.createElement('div');
	placeholder.id = 'app-wrapper';
	placeholder.innerHTML =
		'<!-- Old Browser Warning -->' +
		'<!--[if lt IE 9]>' +
			'<section class="container">' +
				'Did you know that your web browser is a bit old? Some of the content on this site might not work right as a result. <a href="http://whatbrowser.org">Upgrade your browser</a> for a faster, better, and safer web experience.' +
			'</section>' +
		'<![endif]-->' +

		'<div id="app" class="tabindex" tabindex="-1">' +

			'<nav id="nav-user-wrapper">' +
				'<div class="text-small padding-top-small padding-bottom-small">&nbsp;</div>' +
			'</nav>' +

			'<nav id="nav-primary-wrapper">' +
				'<div class="padding-top-small padding-bottom-small">&nbsp;</div>' +
			'</nav>' +

			'<!-- tabindex="-1" hack for skipnav link: https://code.google.com/p/chromium/issues/detail?id=37721 -->' +
			'<main class="tabindex" tabindex="-1" id="main-wrapper">' +

				'<div class="placeholder placeholder-hero"></div>' +

				'<section class="container">' +
					'<div class="placeholder placeholder-heading"></div>' +

					'<div class="placeholder placeholder-sentence"></div>' +
					'<div class="placeholder placeholder-sentence placeholder-sentence-last"></div>' +

					'<div class="placeholder placeholder-paragraph"></div>' +

					'<div class="placeholder placeholder-sentence"></div>' +
					'<div class="placeholder placeholder-sentence"></div>' +
					'<div class="placeholder placeholder-sentence placeholder-sentence-last"></div>' +

					'<div class="placeholder placeholder-paragraph"></div>' +

					'<div class="placeholder placeholder-btn"></div>' +
				'</section>' +

			'</main>' +

			'<footer id="footer-wrapper">' +

				'<div id="footer-1-wrapper">' +
					'<div class="container">' +
						'<hr>' +
						'<p>&nbsp;</p>' +
					'</div>' +
				'</div>' +

				'<nav id="nav-secondary-wrapper"></nav>' +

				'<div id="footer-2-wrapper"></div>' +

				'<div id="mashery-made">' +
					'<div class="container">' +
						'<p><a href="http://mashery.com"><img src="https://support.mashery.com/public/Mashery/images/masherymade.png"></a></p>' +
					'</div>' +
				'</div>' +

			'</footer>';
		document.body.insertBefore(placeholder, document.body.lastChild.nextSibling);
};
var clearDOM = function () {
	if (document.body && document.getElementById('page')) {
		document.getElementById('page').setAttribute('hidden', 'hidden');
		loadPlaceholder();
		return;
	}
	window.requestAnimationFrame(clearDOM);
};
window.requestAnimationFrame(clearDOM);
var mashery = {
	globals: {}
};
var portalOptions = {
	templates: {},
	labels: {}
};