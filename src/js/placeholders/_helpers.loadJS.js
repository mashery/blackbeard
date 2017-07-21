/**
 * Load a JS file asynchronously.
 * @author @scottjehl, Filament Group, Inc.
 * @license MIT
 * @link https://github.com/filamentgroup/loadJS
 * @param  {String}   src URL of script to load.
 * @param  {Function} cb  Callback to run on completion.
 * @return {String}       The script URL.
 */
var loadJS = function ( src, cb ){
	'use strict';
	var ref = window.document.getElementsByTagName( 'script' )[ 0 ];
	var script = window.document.createElement( 'script' );
	script.src = src;
	ref.parentNode.insertBefore( script, ref );
	if (cb && typeof(cb) === 'function') {
		script.onload = cb;
	}
	return script;
};