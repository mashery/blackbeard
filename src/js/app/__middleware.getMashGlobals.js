var getMashGlobals = function (str) {
	str.replace(/mashery\.globals\.(.*?)=(.*?);/g, function (match, p1, p2) {
		window.mashery.globals[p1.trim()] = p2.trim();
	}).replace(/mashery\.globals\[['|"](.*?)['|"]\]\s*?=\s*?(.*?);/g, function (match, p1, p2) {
		window.mashery.globals[p1.trim()] = p2.trim();
	});
};