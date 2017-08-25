/**
 * Setup global mashery variable on page render
 * @param {Node} doc  The page document
 */
var setupMashery = function (doc) {

	// Get the default page
	var page = doc.querySelector('#page');

	// Convert DOM content to a node
	var dom = document.createElement('div');
	dom.innerHTML = page.innerHTML;

	// Get special links
	var dashboard = dom.querySelector('#user-nav .dashboard a');
	var logout = dom.querySelector('#mashery-logout-form');
	var login = dom.querySelector('#user-nav .sign-in a');

	// Set mashery properties
	window.mashery = {
		area: dom.querySelector('#branding-logo').innerHTML.trim(),
		content: {
			main: null,
			secondary: null
		},
		contentId: null,
		contentType: getContentType(doc.body),
		dashboard: dashboard ? dashboard.getAttribute('href') : null,
		dom: dom,
		globals: {},
		isAdmin: dom.querySelector('#user-nav .dashboard.toggle') ? true : false,
		loggedIn: dom.querySelector('#mashery-logout-form') ? true : false,
		login: {
			url: login ? login.pathname : null,
			redirect: login ? login.search : null
		},
		logout: logout ? logout : null,
		title: doc.title,
		scripts: [],
		username: typeof mashery_info !== 'undefined' && mashery_info && mashery_info.username ? mashery_info.username : null,
		userProfile: sessionStorage.getItem('masheryUserProfile')
	};

	// Get Mashery global variables
	getMashGlobals(doc.documentElement.innerHTML);

	// Remove page from the DOM
	page.remove();

};