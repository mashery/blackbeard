mashery.loggedIn = localStorage.getItem('mashIsLoggedIn');
mashery.username = (localStorage.getItem('mashUsername') ? localStorage.getItem('mashUsername') : mashery.username);

;(function (window, document, undefined) {

	'use strict';

	document.addEventListener('click', function (event) {

		// If signin page link clicked
		if (event.target.closest('[href*="signin.html"]') || event.target.closest('[href*="register.html"]')) {
			localStorage.setItem('mashSigninReferer', location.href);
		}

		// If signin button clicked
		if (event.target.id === 'signin-submit' || event.target.id === 'register-submit') {

			event.preventDefault();

			// Log user in
			mashery.loggedIn = true;
			localStorage.setItem('mashIsLoggedIn', true);

			// Update username
			var username = document.querySelector('#username');
			if (username.value.length > 0) {
				mashery.username = username.value;
				localStorage.setItem('mashUsername', username.value);
			}

			// Re-render usernav
			var referer = localStorage.getItem('mashSigninReferer');
			if (referer) {
				localStorage.removeItem('mashSigninReferer');
				location.href = referer;
			} else {
				loadPortal.renderUserNav();
				loadPortal.renderMain();
			}

		}

		// If logout link clicked
		if (event.target.closest('[href*="logout.html"]')) {

			event.preventDefault();

			// Log user out
			localStorage.removeItem('mashIsLoggedIn');
			mashery.loggedIn = false;

			// Reset username
			localStorage.removeItem('mashUsername');

			// Re-render usernav
			loadPortal.renderPortal();

		}

	}, false);

})(window, document);