var clearDOM = function () {
	if (document.body && document.getElementById('page')) {
		document.getElementById('page').setAttribute('hidden', 'hidden');
		loadPlaceholder();
		return;
	}
	window.requestAnimationFrame(clearDOM);
};
window.requestAnimationFrame(clearDOM);