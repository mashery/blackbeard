portalOptions.templates.page = function () {
	if (mashery.globals.fullWidth) {
		return	'<div class="main" id="main">' +
					'{{content.main}}' +
				'</div>';
	} else {
		return	'<div class="main container" id="main">' +
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