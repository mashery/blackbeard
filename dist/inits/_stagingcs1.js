// Polyfill for window.atob()
// https://github.com/davidchambers/Base64.js/
if (!('atob' in window)) {
	!function () { function e(e) { this.message = e } var t = "undefined" != typeof exports ? exports : "undefined" != typeof self ? self : $.global, r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="; e.prototype = new Error, e.prototype.name = "InvalidCharacterError", t.btoa || (t.btoa = function (t) { for (var o, n, a = String(t), i = 0, f = r, c = ""; a.charAt(0 | i) || (f = "=", i % 1); c += f.charAt(63 & o >> 8 - i % 1 * 8)) { if (n = a.charCodeAt(i += .75), n > 255) throw new e("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range."); o = o << 8 | n } return c }), t.atob || (t.atob = function (t) { var o = String(t).replace(/[=]+$/, ""); if (o.length % 4 == 1) throw new e("'atob' failed: The string to be decoded is not correctly encoded."); for (var n, a, i = 0, f = 0, c = ""; a = o.charAt(f++); ~a && (n = i % 4 ? 64 * n + a : a, i++ % 4) ? c += String.fromCharCode(255 & n >> (-2 * i & 6)) : 0)a = r.indexOf(a); return c }) }();
}


/**
 * Blackbeard Theme
 */

portalOptions.templates.page = function () {
	if (mashery.globals.pageFullWidth) {
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


/**
 * Full Width Page Layouts
 */

window.addEventListener('portalBeforeRender', function () {
	if (mashery.globals.pageFullWidth) {
		document.documentElement.classList.add('full-width');
	} else {
		document.documentElement.classList.remove('full-width');
	}
}, false);


/**
 * Automatically Generate Navigation
 */

var generateNavList = function (selector) {
	var list = document.querySelector(selector);
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
	if (mashery.contentType === 'docs' && document.querySelector('#content-nav-list')) {
		generateNavList('#content-nav-list');
	}

	if (mashery.contentId === 'docs') {
		generateGettingStartedNav();
	}
}, false);


/**
 * Theme Picker
 */

window.addEventListener('portalAfterInit', function () {

	// Setup theme options object
	themeOptions = {};

	themeOptions.blackbeard = {
		styles: 'https://stagingcs1.mashery.com/files/blackbeard.min.beta.css',
		options: function () {
			portalOptions = window.portalOptions;

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
		}
	};

	themeOptions.default = {
		styles: 'https://stagingcs1.mashery.com/files/default.min.beta.css',
		options: function () {}
	};

	themeOptions.skinnyNav = {
		styles: 'https://stagingcs1.mashery.com/files/skinny-nav.min.beta.css',
		options: function () {
			portalOptions = window.portalOptions;

			portalOptions.templates.userNav = null;

			portalOptions.templates.primaryNav =
				'<div class="nav-primary nav-wrap nav-collapse" id="nav-primary">' +
					'<div class="container padding-top-small padding-bottom-small">' +
						'<a id="logo" class="logo" href="/">{{content.logo}}</a>' +
						'<a role="button" class="nav-toggle" id="nav-primary-toggle" data-nav-toggle="#nav-primary-menu" href="#">{{content.menuToggle}}</a>' +
						'<div class="nav-menu">' +
							'<div id="nav-user-menu">' +
								'<ul class="nav" id="nav-user-list">' +
									'{{content.navItemsUser}}' +
								'</ul>' +
							'</div>' +
							'<div id="nav-primary-menu">' +
								'<ul class="nav" id="nav-primary-list">' +
									'{{content.navItemsPrimary}}' +
									'<li><a href="/search"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-link" width="16" height="16" viewBox="0 0 32 32"><title>Search</title><path d="M31.008 27.231l-7.58-6.447c-.784-.705-1.622-1.029-2.299-.998a11.954 11.954 0 0 0 2.87-7.787c0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12c2.972 0 5.691-1.081 7.787-2.87-.031.677.293 1.515.998 2.299l6.447 7.58c1.104 1.226 2.907 1.33 4.007.23s.997-2.903-.23-4.007zM12 20a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"/></svg></a></li>' +
								'</ul>' +
							'</div>' +
						'</div>' +
					'</div>' +
				'</div>';
		}
	};

	// Re-render the Portal with new options
	var toggleThemes = function () {

		var isStylesheet = function (ss) {
			return !!(ss.nodeName.toLowerCase() === 'link' && ss.getAttribute('rel').toLowerCase() === 'stylesheet' && ss.getAttribute('href'));
		};

		var getStylesheet = function () {
			var title = document.querySelector('title');
			var ss = title.nextElementSibling;
			if (!ss) return;
			if (!isStylesheet(ss)) {
				do {
					ss = ss.nextElementSibling;
				} while (!isStylesheet(ss));
			}
			return ss;
		};

		var updateStyles = function (styles) {
			var ss = getStylesheet();
			if (!ss) return;
			ss.href = styles;
		};

		var updateCurrent = function (theme) {
			var current = document.querySelector('.toggle-theme.current');
			if (current) {
				current.classList.remove('current');
			}
			theme.classList.add('current');
		};

		// Update current theme
		var setCurrentTheme = function () {
			if (window.mashery.contentId !== 'docs-customizing-themes') return;
			var currentSS = getStylesheet();
			var currentTheme, currentToggle;
			for (var theme in themeOptions) {
				if (themeOptions.hasOwnProperty(theme)) {
					if (currentSS.getAttribute('href') !== themeOptions[theme].styles) continue;
					currentToggle = document.querySelector('.toggle-theme[data-options="' + theme + '"]');
					updateCurrent(currentToggle);
					break;
				}
			}
		};
		setCurrentTheme();

		// Update the current theme indicator
		window.addEventListener('portalAfterRender', setCurrentTheme, false);

		// Listen for clicks
		document.addEventListener('click', function (event) {

			// Only run if theme toggle is clicked
			var toggle = event.target.closest('.toggle-theme');
			if (!toggle) return;

			// Get options
			var options = toggle.getAttribute('data-options');
			if (!options) return;

			// Stop link from working
			event.preventDefault();

			// Reset portalOptions
			m$.resetOptions();

			// Update portalOptions
			themeOptions[options].options();

			// Enable full width layouts
			window.portalOptions.templates.page = function () {
				if (mashery.globals.pageFullWidth) {
					return	'<div class="main content" id="main">' +
								'{{content.main}}' +
							'</div>';
				} else if (mashery.globals.pageWide) {
					return	'<div class="main container content" id="main">' +
								'<h1>{{content.heading}}</h1>' +
								'{{content.main}}' +
							'</div>';
				} else {
					return	'<div class="main container container-small content" id="main">' +
								'<h1>{{content.heading}}</h1>' +
								'{{content.main}}' +
							'</div>';
				}
			};

			// Update stylesheet
			updateStyles(themeOptions[options].styles);

			// Re-render the Portal with new options
			m$.setOptions(portalOptions);
			m$.renderPortal();

		}, false);

	};

	toggleThemes();

}, false);

portalOptions.ajaxIgnore = '.toggle-theme';


/**
 * Theme Customizer
 */
window.addEventListener('portalAfterRender', function () {
	m$.loadJS('https://stagingcs1.mashery.com/files/customizer.min.beta.js', function () {
		customizer();
	});
}, false);


/**
 * Plugins Docs Note
 */
var renderDocsNote = function () {
	var note = document.querySelector('#plugin-note');
	if (!note) return;
	note.innerHTML = '<p><em><strong>HEADS UP!</strong> The template and initialization for this plugin are included in the initialization code generated by the <a href="/docs/read/download">Theme Customizer</a>. You only need to use this documentation if you want to make modifications.</em></p>';
};
window.addEventListener('portalAfterRender', renderDocsNote, false);
window.addEventListener('portalAfterGitHubRender', renderDocsNote, false);


/**
 * Auto-generate Table of Contents on docs pages
 */
var renderToC = function () {

	/**
	 * Add a sub-item to the navigation list
	 * @param {Node}   heading     The heading element
	 * @param {Number} difference  The difference between the current and last heading
	 */
	var addSubItem = function (heading, difference) {
		var toc = '';
		for (var i = Math.abs(difference); i > 0; i--) {
			toc += '<ul>';
		}
		return toc;
	};

	/**
	 * Close a sub-item from the navigation list
	 * @param {Node}   heading     The heading element
	 * @param {Number} difference  The difference between the current and last heading
	 */
	var closeSubItem = function (heading, difference) {
		var toc = '';
		for (var i = Math.abs(difference); i > 0; i--) {
			toc += '</li></ul>';
		}
		return toc;
	};

	/**
	 * Render the Table of Contents
	 */
	var createTOC = function (toc) {

		// Get the content area
		var content = document.querySelector('.content');
		if (!content) return;

		// Variables
		var headings = content.querySelectorAll('h2');
		var list = '';
		var last, current, close;

		headings.forEach(function (heading) {

			// Get current heading position
			current = parseInt(heading.tagName.substring(1), 10);
			close = '</li>';

			// If first loop, set last to current
			if (!last) {
				close = '';
				last = current;
			}

			// Create an ID if the heading is missing one
			if (!heading.id || heading.id.length < 1) {
				heading.id = createID(headings[i]);
			}

			// Get difference between last and current
			var difference = current - last;

			if (difference > 0) {
				list += addSubItem(heading, difference);
			} else if (difference < 0) {
				list += closeSubItem(heading, difference);
			}

			list += close + '<li><a href="#' + heading.id + '">' + heading.innerText + '</a>';

			// Update last position
			last = current;

		});

		toc.innerHTML = '<h2>In These Docs</h2><ol>' + list + '</ol>';

	};

	var toc = document.querySelector('#demo-toc');
	if (!toc) return;
	createTOC(toc);

};
window.addEventListener('portalAfterRender', renderToC, false);
window.addEventListener('portalAfterGitHubRender', renderToC, false);

/**
 * Plugins and Components
 */
window.addEventListener('portalAfterRender', function () {

	// Astro
	m$.loadJS('https://stagingcs1.mashery.com/files/astro.min.beta.js', function () {
		astro.init();
	});

	// FluidVids.js
	m$.loadJS('https://stagingcs1.mashery.com/files/fluidvids.min.beta.js', function () {
		fluidvids.init({
			selector: ['iframe', 'object'], // runs querySelectorAll()
			players: ['www.youtube.com', 'player.vimeo.com'] // players to support
		});
	});

	// Houdini
	m$.loadJS('https://stagingcs1.mashery.com/files/houdini.min.beta.js', function () {
		houdini.init({
			selectorToggle: '.collapse-toggle'
		});
	});

	// Smooth Scroll
	m$.loadJS('https://stagingcs1.mashery.com/files/smooth-scroll.min.beta.js', function () {
		var scroll = new SmoothScroll('a[href*="#"]', {
			ignore: '.js-scroll-ignore'
		});
		window.addEventListener('portalBeforeRenderAjax', function removeSmoothScroll () {
			scroll.destroy();
			window.removeEventListener('portalBeforeRenderAjax', removeSmoothScroll, false);
		}, false);
	});

	// GitHub-Hosted Documentation
	m$.loadJS('https://stagingcs1.mashery.com/files/githubDocs.min.beta.js', function () {
		githubDocs({
			user: 'mashery',
			repo: 'blackbeard',
			root: 'docs/' // The root directory for all of my documentation
		});
	});

	// BetterDocs.js
	m$.loadJS('/files/betterDocs.min.beta.js', function () {
		var docs = BetterDocs('.content', {
			langs: {
				bash: {
					selector: 'bash',
					title: 'Bash'
				},
				js: {
					selector: 'javascript, js',
					title: 'JavaScript',
				},
				ruby: {
					selector: 'ruby',
					title: 'Ruby'
				},
				python: {
					selector: 'python',
					title: 'Python'
				}
			},
			langDefault: 'js',
			wideLayout: true,
			wideLayoutBg: true,
			restrictToPages: 'docs-tests-better_docs'
		});

		// Self-Destruct
		window.addEventListener('portalBeforeRenderAjax', function destroyBetterDocs () {
			docs.destroy();
			window.removeEventListener('portalBeforeRender', destroyBetterDocs, false);
		}, false);
	});

	// conditional-content.css
	// Add logged-in/logged-out class
	if (window.mashery.loggedIn) {
		document.documentElement.classList.add('is-logged-in');
		document.documentElement.classList.remove('is-logged-out');
	} else {
		document.documentElement.classList.add('is-logged-out');
		document.documentElement.classList.remove('is-logged-in');
	}

}, false);

window.addEventListener('portalAfterGitHubRender', function () {
	// FluidVids.js
	m$.loadJS('https://stagingcs1.mashery.com/files/fluidvids.min.beta.js', function () {
		fluidvids.init({
			selector: ['iframe', 'object'], // runs querySelectorAll()
			players: ['www.youtube.com', 'player.vimeo.com'] // players to support
		});
	});
}, false);


/**
 * Load additional stylesheets
 */
window.addEventListener('portalLoaded', function () {
	m$.loadCSS('https://stagingcs1.mashery.com/files/betterDocs.min.beta.css');
	m$.loadCSS('https://stagingcs1.mashery.com/files/images.min.beta.css');
	m$.loadCSS('https://stagingcs1.mashery.com/files/conditional-content.min.beta.css');
	m$.loadCSS('https://stagingcs1.mashery.com/files/houdini.min.beta.css');
}, false);


/**
 * Initialize the Portal
 */

window.addEventListener('portalLoaded', function () {
	m$.init(portalOptions);
}, false);