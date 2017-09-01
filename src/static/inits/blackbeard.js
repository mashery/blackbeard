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
	'<div class="main container" id="main">' +
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

window.addEventListener('portalBeforeRender', function () {
	if (mashery.globals.fullWidth) {
		document.documentElement.classList.add('full-width');
	} else {
		document.documentElement.classList.remove('full-width');
	}
}, false);

window.addEventListener('portalLoaded', function () {
	m$.init(portalOptions);
}, false);