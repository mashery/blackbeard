var getContentType = function (elem) {

	var type = null;

	if (elem.classList.contains('please-login')) {
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
			type = 'formAdd-Topic';
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
		}
	} else if (elem.classList.contains('page-member')) {
		if (elem.classList.contains('email')) {
			type = 'accountEmail';
		} else if (elem.classList.contains('passwd')) {
			type = 'accountPassword';
		} else if (elem.classList.contains('register')) {
			type = 'register';
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
		type = 'logout';
	} else if (elem.classList.contains('page-contact')) {
		type = 'contact';
	}

	return type;

};