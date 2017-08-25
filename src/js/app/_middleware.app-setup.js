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