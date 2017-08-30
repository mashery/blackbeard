window.addEventListener('portalAfterMainRender', function () {

	// Variables
	if (!mashery.globals.github) return;
	var main = document.querySelector('#main');
	if (!main) return;

	// Add loading test
	main.innerHTML = '<p>Loading...</p>';

	// Get the docs
	atomic.ajax({
		url: 'https://api.github.com/repos/mashery/blackbeard/contents/docs/' + mashery.globals.github;
	}).success(function (data) {
		markdown = new showdown.Converter();
		markdown.setFlavor('github');
		main.innerHTML = markdown.makeHtml(window.atob(data.content));
	}).error(function (data) {
		main.innerHTML = '<p>Unable to load content. Visit <a href="https://github.com/mashery/blackbeard/tree/master/docs/' + mashery.globals.github + '">https://github.com/mashery/blackbeard/tree/master/docs/' + mashery.globals.github + '</a> to view the documentation.</p>';
	});
}, false);