portalOptions.templates.page = function () {
	if (mashery.globals.fullWidth) {
		return	'<div class="main content" id="main">' +
					'{{content.main}}' +
				'</div>';
	} else {
		return	'<div class="main container content" id="main">' +
					'<h1>{{content.heading}}</h1>' +
					'{{content.main}}' +
				'</div>';
	}
};

portalOptions.templates.userNav = null;

portalOptions.templates.primaryNav = function () {
	var template =
		'<div class="nav-primary nav-wrap nav-collapse" id="nav-primary">' +
			'<div class="container padding-top-small padding-bottom-small">' +
				'<a id="logo" class="logo margin-bottom" href="/">{{content.logo}}</a>' +
				'<a role="button" class="nav-toggle" id="nav-primary-toggle" data-nav-toggle="#nav-primary-menu" href="#">{{content.menuToggle}}</a>' +
				'<div class="nav-menu" id="nav-primary-menu">' +
					'<ul class="nav" id="nav-primary-list">' +
						'{{content.navItemsPrimary}}' +
					'</ul>' +
					'<ul class="nav-user-list" id="nav-user-list">' +
						'{{content.navItemsUser}}' +
					'</ul>' +
					'{{content.searchForm}}' +
					(mashery.contentType === 'docs' ? '<h2 class="margin-top">In The Docs</h2><ul class="nav-docs" id="nav-docs">{{content.secondary}}</ul>' : '') +
				'</div>' +
			'</div>' +
		'</div>';
	return template;
};


portalOptions.templates.docs =
	'<div class="main container content" id="main">' +
		'<h1>{{content.heading}}</h1>' +
		'{{content.main}}' +
	'</div>';

portalOptions.templates.layout =
	'<div class="row row-no-padding clearfix">' +
		'<div class="grid-fourth">' +
			'<a class="screen-reader screen-reader-focusable" href="#main">Skip to content</a>' +
			'{{layout.navPrimary}}' +
		'</div>' +
		'<div class="grid-three-fourths">' +
			'{{layout.main}}' +
			'<footer class="footer" id="footer">' +
				'{{layout.footer1}}' +
				'{{layout.navSecondary}}' +
				'{{layout.footer2}}' +
			'</footer>' +
		'</div>' +
	'</div>';

window.addEventListener('portalBeforeRender', function () {
	if (mashery.globals.fullWidth) {
		document.documentElement.classList.add('full-width');
	} else {
		document.documentElement.classList.remove('full-width');
	}
}, false);

var githubDocs = function (options) {

	// Polyfill for window.atob()
	if (!('atob' in window)) {
		!function () { function e(e) { this.message = e } var t = "undefined" != typeof exports ? exports : "undefined" != typeof self ? self : $.global, r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="; e.prototype = new Error, e.prototype.name = "InvalidCharacterError", t.btoa || (t.btoa = function (t) { for (var o, n, a = String(t), i = 0, f = r, c = ""; a.charAt(0 | i) || (f = "=", i % 1); c += f.charAt(63 & o >> 8 - i % 1 * 8)) { if (n = a.charCodeAt(i += .75), n > 255) throw new e("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range."); o = o << 8 | n } return c }), t.atob || (t.atob = function (t) { var o = String(t).replace(/[=]+$/, ""); if (o.length % 4 == 1) throw new e("'atob' failed: The string to be decoded is not correctly encoded."); for (var n, a, i = 0, f = 0, c = ""; a = o.charAt(f++); ~a && (n = i % 4 ? 64 * n + a : a, i++ % 4) ? c += String.fromCharCode(255 & n >> (-2 * i & 6)) : 0)a = r.indexOf(a); return c }) }();
	}

	// Sanity check
	if (!window.mashery.globals.github) return;

	// Variables
	var defaults = {
		selector: '.content',
		user: null,
		repo: null,
		root: '',
		runScripts: false,
		loading: '<p>Loading...</p>',
		failMessage: '<p>Unable to load content. Visit <a target="_blank" href="https://github.com/mashery/blackbeard/tree/master/docs/' + mashery.globals.github + '">https://github.com/mashery/blackbeard/tree/master/docs/' + mashery.globals.github + '</a> to view the documentation.</p>'
	}
	var settings = m$.merge(defaults, options || {});
	if (!settings.user || !settings.repo) return;
	var main = document.querySelector(settings.selector);
	if (!main) return;

	// Add loading text
	main.innerHTML = settings.loading;

	// Get the docs
	atomic.ajax({
		url: 'https://api.github.com/repos/' + settings.user + '/' + settings.repo + '/contents/' + settings.root + mashery.globals.github
	}).success(function (data) {

		// Convert markdown to HTML
		markdown = new showdown.Converter();
		markdown.setFlavor('github');
		main.innerHTML = markdown.makeHtml(window.atob(data.content));

		// If inline scripts should be run, run them
		if (settings.runScripts) {
			main.querySelectorAll('script').forEach(function (script) {
				var func = new Function(script.innerHTML);
				func();
			});
		}

		// Fix the location
		m$.fixLocation();

		// Syntax highlight code
		if ('Prism' in window) {
			Prism.highlightAll();
		}

		m$.emit('portalGitHubRenderAfter');

	}).error(function (data) {
		main.innerHTML = settings.failMessage;
		m$.emit('portalGitHubRenderFail');
	});

};

window.addEventListener('portalAfterRenderMain', function () {
	githubDocs({
		root: 'docs/'
	});
}, false);

var generateCustomizingNav = function () {
	var list = document.querySelector('#customizing-list');
	document.querySelectorAll('#nav-docs .current-page li').forEach(function (item) {
		var newItem = item.cloneNode(true);
		list.append(newItem);
	});
};

var generateGettingStartedNav = function () {
	var list = document.querySelector('#getting-started-list');
	document.querySelectorAll('#nav-docs > li').forEach(function (item) {
		if (item.classList.contains('current-page')) return;
		if (item.innerText.trim() === 'Tests') return;
		var newItem = item.cloneNode(true);
		list.append(newItem);
	});
};

window.addEventListener('portalAfterRender', function () {
	if (mashery.contentId === 'docs-customizing') {
		generateCustomizingNav();
	}

	if (mashery.contentId === 'docs') {
		generateGettingStartedNav();
	}
}, false);

loadJS('/files/app.min.js', function () {
	m$.init(portalOptions);
});