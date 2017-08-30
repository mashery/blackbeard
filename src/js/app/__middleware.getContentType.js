/**
 * Get the Portal content type
 * @param {Node} elem  The DOM element with the content
 */
var getContentType = function (elem) {

	'use strict';

	//
	// Variables
	//

	var h1 = elem.querySelector('#main h1.first');
	h1 = h1 ? h1.innerHTML : '';
	var type;


	//
	// Get content type
	//

	// 404
	if (elem.classList.contains('not-found') || (h1 && /Not Found/.test(h1)) ) {
		type = 'fourOhFour';
	}

	// Must be logged in to view this content
	else if (elem.classList.contains('please-login') || elem.classList.contains('permission-denied')) {
		type = 'noAccess';
	}

	// Custom Pages
	else if (elem.classList.contains('page-page')) {
		type = 'page';
	}

	// Documentation
	else if (elem.classList.contains('page-docs')) {
		type = 'docs';
	}

	// IO Docs
	else if (elem.classList.contains('page-ioDocs')) {
		type = 'ioDocs';
	}

	// Forum
	else if (elem.classList.contains('page-forum')) {
		// Topics
		if (elem.classList.contains('topics')) {
			type = 'forumTopics';
		}

		// Add a topic
		else if (elem.classList.contains('topic-add')) {
			type = 'forumAddTopic';
		}

		// Individual Topic
		else if (elem.classList.contains('read')) {
			type = 'forumSingle';
		}

		// Recent Topics
		else if (elem.classList.contains('recent')) {
			type = 'forumRecent';
		}

		// All/Main
		else {
			type = 'forumAll';
		}

	}

	// Blog
	else if (elem.classList.contains('page-blog')){

		// All Posts
		if (elem.classList.contains('browse')) {
			type = 'blogAll';
		}

		// Single Post
		else {
			type = 'blogSingle';
		}

	}

	// Apps and Keys
	else if (elem.classList.contains('page-apps')) {

		// My Keys
		if (elem.classList.contains('mykeys')) {
			type = 'accountKeys';
		}

		// My Applications
		else if (elem.classList.contains('myapps')) {
			type = 'accountApps';
		}

		// App Registration
		else if (elem.classList.contains('register')) {

			// Edit an App
			if (elem.querySelector('#application-edit')) {
				type = 'appRegister';
			}

			// Successful registration
			else {
				type = 'appRegisterSuccess';
			}

		}

		// Edit App
		else if (elem.classList.contains('edit')) {
			type = 'appEdit';
		}

		// Add APIs
		else if (elem.classList.contains('select')) {

			// APIs successfully added
			if (h1 === 'New Keys Issued') {
				type = 'appAddAPIsSuccess';
			}

			// Add APIs Form
			else {
				type = 'appAddAPIs';
			}

		}

		// Delete App
		else if (elem.classList.contains('delete')) {
			type = 'appDelete';
		}

		else if (elem.classList.contains('error')) {
			type = 'appAddAPIsError';
		}

	}

	// Individual Keys
	else if (elem.classList.contains('page-key')) {

		// Delete Key
		if (elem.classList.contains('delete-key')) {
			type = 'keyDelete';
		} else if (elem.classList.contains('key-activity')) {
			type = 'keyActivity';
		}

	}

	// Account Pages
	else if (elem.classList.contains('page-member')) {

		// Change Email
		if (elem.classList.contains('email')) {

			// Change Email Success
			if (elem.querySelector('#myaccount .success')) {
				type = 'accountEmailSuccess';
			}

			// Change Email Form
			else {
				type = 'accountEmail';
			}

		}

		// Change Password
		else if (elem.classList.contains('passwd')) {

			// Change Password Success
			if (elem.querySelector('#myaccount .success')) {
				type = 'accountPasswordSuccess';
			}

			// Change Password Form
			else {
			type = 'accountPassword';
			}

		}

		// Register Account
		else if (elem.classList.contains('register')) {

			// Confirmation Email Sent
			if (/Registration Almost Complete/.test(h1)) {
				type = 'registerSent';
			}

			// Register for a New Account
			else {
				type = 'register';
			}
		}

		// Resend Registration Confirmation Email
		else if (elem.classList.contains('resend-confirmation')) {

			// Email Sent
			if (elem.querySelector('ul.success')) {
				type = 'registerResendSuccess';
			}

			// Send Email Form
			else {
				type = 'registerResend';
			}

		}

		// Remove Membership
		else if (elem.classList.contains('remove')) {

			// Removed Successfully
			if (/You have been removed!/.test(elem.querySelector('.main .section-body').innerHTML)) {
				type = 'memberRemoveSuccess';
			}

			// Remove Membership Form
			else {
				type = 'memberRemove';
			}

		}

		// Lost Password
		else if (elem.classList.contains('lost')) {

			// Reset Email Sent
			if (/E-mail Sent/.test(elem.querySelector('h2').innerHTML)) {
				type = 'lostPasswordReset';
			}

			// Reset Form
			else {
				type = 'lostPassword';
			}

		}

		// Lost Username
		else if (elem.classList.contains('lost-username')) {

			// Reset Email Sent
			if (/E-mail Sent/.test(elem.querySelector('h2').innerHTML)) {
				type = 'lostUsernameReset';
			}

			// Reset Form
			else {
				type = 'lostUsername';
			}

		}

		// Join/Confirm Membership (for existing Mashery users)
		else if (elem.classList.contains('join') || elem.classList.contains('confirm')) {

			// Join Success
			if (/Registration Successful/.test(h1)) {
				type = 'joinSuccess';
			}

			// Join Form
			else {
				type = 'join';
			}
		}

		// Request secret visibility
		else if (elem.classList.contains('request-display-key-info')) {
			type = 'showSecret';
		}

		// Secret visibility success
		else if (elem.classList.contains('reset-key-info')) {
			type = 'showSecretSuccess';
		}

		// Secrets already visible
		else if (elem.classList.contains('error')) {
			type = 'showSecretError';
		}

		// Manage My Account
		else {
			type = 'accountManage';
		}
	}

	// User Profiles
	else if (elem.classList.contains('page-profile')) {
		type = 'profile';
	}

	// Signin Page
	else if (elem.classList.contains('page-login')) {
		type = 'signin';
	}

	// Search
	else if (elem.classList.contains('page-search')) {
		type = 'search';
	}

	// Logout
	else if (elem.classList.contains('page-logout')) {

		// Logout Failed
		if (elem.querySelector('#user-nav .account')) {
			type = 'logoutFail';
		}

		// Logged Out
		else {
			type = 'logout';
		}

	}

	// Contact Us
	else if (elem.classList.contains('page-contact')) {

		// Contact Form
		if (elem.querySelector('#main form')) {
			type = 'contact';
		}

		// Contact Success
		else {
			type = 'contactSuccess';
		}

	}

	return type;

};