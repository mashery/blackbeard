/**
 * Remove stylesheets from the DOM.
 * Copyright (c) 2017. TIBCO Software Inc. All Rights Reserved.
 * @param  {String} filename The name of the stylesheet to remove
 * @return {Object}          The stylesheet that was removed
 */
var removeCSS = function ( filename ) {

	'use strict';

	// Get all stylesheets
	var links = document.getElementsByTagName('link');
	var regex = new RegExp(filename);

	// Find and remove matching stylesheet
	for ( var i = links.length; i >= 0; i-- ) {
		if ( links[i] && links[i].href !== null && regex.test(links[i].href) ) {
			links[i].parentNode.removeChild(links[i]);
			return links[i];
		}
	}
};