var setupMashery = function (doc) {

	// Get the default page
	var page = doc.querySelector('#page');

	// Convert DOM content to a node
	var dom = document.createElement('div');
	dom.innerHTML = page.innerHTML;

	// Get special links
	var dashboard = dom.querySelector('#user-nav .dashboard a');
	var logout = dom.querySelector('#mashery-logout-form');

	// Setup mashery object
	window.mashery = {};

	// Get mashery properties
	window.mashery.dom = 'dom' in window.mashery ? window.mashery.dom : dom;
	window.mashery.title = doc.title;
	window.mashery.loggedIn = typeof mashery_info === 'undefined' || !mashery_info || !mashery_info.username ? false : true;
	window.mashery.username = window.mashery.loggedIn ? mashery_info.username : null;
	window.mashery.userProfile = sessionStorage.getItem('masheryUserProfile');
	window.mashery.isAdmin = dom.querySelector('#user-nav .dashboard.toggle') ? true : false;
	window.mashery.area = dom.querySelector('#branding-logo').innerHTML.trim();
	window.mashery.dashboard = dashboard ? dashboard : null;
	window.mashery.logout = logout ? logout : null;
	window.mashery.contentType = getContentType(doc.body);
	window.mashery.content = {};

	// Remove page from the DOM
	page.remove();

};