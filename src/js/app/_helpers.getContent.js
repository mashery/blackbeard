var getNav = function (selector) {

	// Variables
	var nav = [];
	var items = mashery.dom.querySelectorAll(selector);

	// Generate items object
	for (var i = 0; i < items.length; i++) {
		nav.push({
			label: items[i].innerHTML,
			url: items[i].href
		});
	}

	return nav;

};

var getContent = function (type) {

	// Cache mashery objects
	var dom = window.mashery.dom;
	var content = window.mashery.content;

	// Add primary nav
	content.navPrimary = getNav('#local a');

	// Add secondary nav
	content.navSecondary = getNav('#footer > ul a');

	// type = page
	if (type === 'page') {
		content.main = dom.querySelector('#main').innerHTML;
	}

	// type = docs
	if (type === 'docs') {
		content.main = dom.querySelector('#main').innerHTML;
		content.secondary = dom.querySelector('#sub ul').innerHTML;
	}

	// type = signin
	if (type === 'signin') {
		var signinForm = dom.querySelector('#signin form');
		content.main = '<form action="' + signinForm.action + '" method="post" enctype="multipart/form-data">' + signinForm.innerHTML + '</form>';
	}

	// type = register
	if (type === 'register') {
		var regForm = dom.querySelector('#member-register');
		content.main = '<form action="' + regForm.action + '" method="post" enctype="multipart/form-data">' + regForm.innerHTML + '</form>';
	}

	// type = account-keys
	// nav, create keys link, no keys message, key content/table

	// type = account-apps
	// nav, create apps link, no apps message, app content/table

	// type = account-manage
	// nav, actions links, form

	// type = account-email
	// nav, back link, form

	// type = account-password
	// nav, back link, form

	// type = profile
	// admin profile link (if isAdmin), user info, recent activity

	// type = logout
	// message, links

	// type = contact
	// #main.innerHTML

	// =======

	// type = forum {IGNORE}
	// recent topics link, categories RSS, categories OL

	// type = blog-all
	// RSS
	// foreach: article link/title, user link, date, content, comments link

	// type = blog-single
	// title, user link, date, content, comment count, comment box

};