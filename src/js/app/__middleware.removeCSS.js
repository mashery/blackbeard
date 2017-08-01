/**
 * Remove stylesheets from the DOM.
 * Copyright (c) 2017. TIBCO Software Inc. All Rights Reserved.
 * @param  {String} filename The name of the stylesheet to remove
 */
var removeCSS = function (filename) {

	'use strict';

	// Get all matching stylesheets
	var links = m$.getAll('link[href*="' + filename + '"]');

	// Remove all matching stylesheets
	links.forEach(function (link) {
		link.remove();
	});
};