/**
 * Load a JS file asynchronously.
 * @author @scottjehl, Filament Group, Inc.
 * @license MIT
 * @link https://github.com/filamentgroup/loadJS
 * @param  {String}   src       URL of script to load.
 * @param  {Function} callback  Callback to run on completion.
 * @param  {Boolean}  reload    If true, reload the script if it's already in the DOM
 * @return {String}             The script URL.
 */
var loadJS = function (src, callback, reload){
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
	var ref = window.document.getElementsByTagName('script')[ 0 ];
	var script = window.document.createElement('script');
	script.src = src;
	ref.parentNode.insertBefore(script, ref);
	if (callback && typeof (callback) === 'function') {
		script.onload = callback;
	}
	return script;
};