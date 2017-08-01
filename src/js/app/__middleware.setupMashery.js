/**
 * Setup global mashery variable on page render
 * @param {Node} doc  The page document
 */
var setupMashery = function (doc) {

	// Get the default page
	var page = m$.get('#page', doc);

	// Convert DOM content to a node
	var dom = document.createElement('div');
	dom.innerHTML = page.innerHTML;

	// Get special links
	var dashboard = m$.get('#user-nav .dashboard a', dom);
	var logout = m$.get('#mashery-logout-form', dom);
	var login = m$.get('#user-nav .sign-in a', dom);

	// Set mashery properties
	window.mashery = {
		area: m$.get('#branding-logo', dom).innerHTML.trim(),
		content: {
			main: null,
			secondary: null
		},
		contentId: null,
		contentType: getContentType(doc.body),
		dashboard: dashboard ? dashboard.getAttribute('href') : null,
		dom: dom,
		isAdmin: m$.get('#user-nav .dashboard.toggle', dom) ? true : false,
		loggedIn: m$.get('#mashery-logout-form', dom) ? true : false,
		login: {
			url: login ? login.pathname : null,
			redirect: login ? login.search : null
		},
		logout: logout ? logout : null,
		title: doc.title,
		username: typeof mashery_info !== 'undefined' && mashery_info && mashery_info.username ? mashery_info.username : null,
		userProfile: sessionStorage.getItem('masheryUserProfile')
	};

	// Remove page from the DOM
	page.remove();

};