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