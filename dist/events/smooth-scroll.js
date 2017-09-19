var scroll = new SmoothScroll('a[href*="#"]');
window.addEventListener('portalBeforeRenderAjax', function removeSmoothScroll () {
	scroll.destroy();
	window.removeEventListener('portalBeforeRenderAjax', removeSmoothScroll, false);
}, false);