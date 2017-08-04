var getMashGlobals = function (str) {
	str.replace(/mash\.(.*?)=(.*?);/g, function (match, p1, p2) {
		window.mashery.globals[p1.trim()] = p2.trim();
	});
};