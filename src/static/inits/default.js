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