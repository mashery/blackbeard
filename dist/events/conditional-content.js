// Add logged-in/logged-out class
if (window.mashery.loggedIn) {
	document.documentElement.classList.add('is-logged-in');
	document.documentElement.classList.remove('is-logged-out');
} else {
	document.documentElement.classList.add('is-logged-out');
	document.documentElement.classList.remove('is-logged-in');
}