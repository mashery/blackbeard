var githubDocs = function () {

	// if (!('atob' in window)) {
	// 	!function () { function e(e) { this.message = e } var t = "undefined" != typeof exports ? exports : "undefined" != typeof self ? self : $.global, r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="; e.prototype = new Error, e.prototype.name = "InvalidCharacterError", t.btoa || (t.btoa = function (t) { for (var o, n, a = String(t), i = 0, f = r, c = ""; a.charAt(0 | i) || (f = "=", i % 1); c += f.charAt(63 & o >> 8 - i % 1 * 8)) { if (n = a.charCodeAt(i += .75), n > 255) throw new e("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range."); o = o << 8 | n } return c }), t.atob || (t.atob = function (t) { var o = String(t).replace(/[=]+$/, ""); if (o.length % 4 == 1) throw new e("'atob' failed: The string to be decoded is not correctly encoded."); for (var n, a, i = 0, f = 0, c = ""; a = o.charAt(f++); ~a && (n = i % 4 ? 64 * n + a : a, i++ % 4) ? c += String.fromCharCode(255 & n >> (-2 * i & 6)) : 0)a = r.indexOf(a); return c }) }();
	// }

	// Variables
	if (!window.mashery.globals.github) return;
	var main = document.querySelector('.content');
	if (!main) return;

	// Add loading test
	main.innerHTML = '<p>Loading...</p>';

	// Get the docs
	atomic.ajax({
		url: 'https://api.github.com/repos/mashery/blackbeard/contents/docs/' + mashery.globals.github
	}).success(function (data) {
		markdown = new showdown.Converter();
		markdown.setFlavor('github');
		main.innerHTML = markdown.makeHtml(window.atob(data.content));
		// main.querySelectorAll('script').forEach(function (script) {
		// 	var func = new Function(script.innerHTML);
		// 	func();
		// });
		m$.fixLocation();
		if ('Prism' in window) {
			Prism.highlightAll();
		}
	}).error(function (data) {
		main.innerHTML = '<p>Unable to load content. Visit <a target="_blank" href="https://github.com/mashery/blackbeard/tree/master/docs/' + mashery.globals.github + '">https://github.com/mashery/blackbeard/tree/master/docs/' + mashery.globals.github + '</a> to view the documentation.</p>';
	});

};