var getMashGlobals = function (str) {
	var globals = [];
	str.replace(/mashery\.globals\.(.*?)=(.*?);/g, function (match, p1, p2) {
		globals.push(match);
	}).replace(/mashery\.globals\[['|"](.*?)['|"]\]\s*?=\s*?(.*?);/g, function (match, p1, p2) {
		globals.push(match);
	});
	try {
		var func = new Function('mashery = window.mashery;' + globals.join(';'));
		func();
	} catch (e) {
		if (console && 'error' in console) {
			console.error('mashery.globals does not support functions.');
		}
	}
};