var getContentType = function (elem) {

	var type = null;
	var h1 = elem.querySelector('#main h1.first')
	h1 = h1 ? h1.innerHTML : '';

	if (elem.classList.contains('not-found') || (h1 && /Not Found/.test(h1)) ) {
		type = 'fourOhFour';
	} else if (elem.classList.contains('please-login')) {
		type = 'pleaseLogin';
	} else if (elem.classList.contains('page-page')) {
		type = 'page';
	} else if (elem.classList.contains('page-docs')) {
		type = 'docs';
	} else if (elem.classList.contains('page-ioDocs')) {
		type = 'ioDocs';
	} else if (elem.classList.contains('page-forum')) {
		if (elem.classList.contains('topics')) {
			type = 'forumTopics';
		} else if (elem.classList.contains('topic-add')) {
			type = 'forumAddTopic';
		} else if (elem.classList.contains('read')) {
			type = 'forumSingle';
		} else if (elem.classList.contains('recent')) {
			type = 'forumRecent';
		} else {
			type = 'forumAll';
		}
	} else if (elem.classList.contains('page-blog')){
		if (elem.classList.contains('browse')) {
			type = 'blogAll';
		} else {
			type = 'blogSingle';
		}
	} else if (elem.classList.contains('page-apps')) {
		if (elem.classList.contains('mykeys')) {
			type = 'accountKeys';
		} else if (elem.classList.contains('myapps')) {
			type = 'accountApps';
		} else if (elem.classList.contains('register')) {
			if (elem.querySelector('#application-edit')) {
				type = 'appRegister';
			} else {
				type = 'appRegisterSuccess';
			}
		}
	} else if (elem.classList.contains('page-member')) {
		if (elem.classList.contains('email')) {
			type = 'accountEmail';
		} else if (elem.classList.contains('passwd')) {
			type = 'accountPassword';
		} else if (elem.classList.contains('register')) {
			if (/Registration Almost Complete/.test(h1)) {
				type = 'registerSent';
			} else {
				type = 'register';
			}
		} else if (elem.classList.contains('resend-confirmation')) {
			if (elem.querySelector('ul.success')) {
				type = 'registerResendSuccess';
			} else {
				type = 'registerResend';
			}
		} else if (elem.classList.contains('remove')) {
			if (/You have been removed!/.test(elem.querySelector('.main .section-body').innerHTML)) {
				type = 'memberRemoveSuccess';
			} else {
				type = 'memberRemove';
			}
		} else if (elem.classList.contains('lost')) {
			if (/E-mail Sent/.test(elem.querySelector('h2').innerHTML)) {
				type = 'lostPasswordReset';
			} else {
				type = 'lostPassword';
			}
		} else if (elem.classList.contains('lost-username')) {
			if (/E-mail Sent/.test(elem.querySelector('h2').innerHTML)) {
				type = 'lostUsernameReset';
			} else {
				type = 'lostUsername';
			}
		} else if (elem.classList.contains('join') || elem.classList.contains('confirm')) {
			if (/Registration Successful/.test(h1)) {
				type = 'joinSuccess';
			} else {
				type = 'join';
			}
		} else {
			type = 'accountManage';
		}
	} else if (elem.classList.contains('page-profile')) {
		type = 'profile';
	} else if (elem.classList.contains('page-login')) {
		type = 'signin';
	} else if (elem.classList.contains('page-search')) {
		type = 'search';
	} else if (elem.classList.contains('page-logout')) {
		if (elem.querySelector('#user-nav .account')) {
			type = 'logoutFail';
		} else {
			type = 'logout';
		}
	} else if (elem.classList.contains('page-contact')) {
		if (elem.querySelector('#main form')) {
			type = 'contact';
		} else {
			type = 'contactSuccess';
		}
	}

	return type;

};