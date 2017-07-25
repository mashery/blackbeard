var getNav = function (selector) {

	// Variables
	var nav = [];
	var items = mashery.dom.querySelectorAll(selector);

	// Generate items object
	for (var i = 0; i < items.length; i++) {
		nav.push({
			label: items[i].innerHTML,
			url: items[i].getAttribute('href')
		});
	}

	return nav;

};

var fetchUserProfile = function () {
	if (window.mashery.userProfile) return;
	atomic.ajax({
		url: '/member/edit',
		responseType: 'document'
	}).success(function (data) {
		var userProfile = data.querySelector('.actions .public-profile.action');
		if (!userProfile) return;
		userProfile = userProfile.getAttribute('href');
		window.mashery.userProfile = userProfile;
		sessionStorage.setItem('masheryUserProfile', userProfile);
		var profileLink = document.querySelector('a[href*="/profile/profile/"]');
		if (!profileLink) return;
		profileLink.href = userProfile;
	});
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
	// @todo verify that there's only one app per key
	if (type === 'accountKeys') {

		// Get elements
		var keys = document.querySelectorAll('.main div.key');
		var getKeys = document.querySelector('.action.new-key');

		// Set values
		content.main = [];
		content.secondary = getKeys ? getKeys.getAttribute('href') : null;
		keys.forEach(function(key) {
			var data = key.querySelectorAll('dd');
			content.main.push({
				heading: key.previousSibling,
				application: data[0].trim(),
				key: data[1].trim(),
				status: data[2].trim(),
				created: data[3].querySelector('abbr').getAttribute('title'),
				limits: '<table>' + key.querySelector('table.key').innerHTML + '<table>',
				report: key.querySelector('.key-actions.actions .view-report.action').getAttribute('href'),
				delete: key.querySelector('.key-actions.actions .delete.action').getAttribute('href')
			});
		});

	}

	// type = account-apps
	// nav, create apps link, no apps message, app content/table
	if (type === 'accountApps') {

		// Get elements
		var apps = document.querySelectorAll('.main .application');
		var createApps = document.querySelector('.main .actions .add-app.action');

		// Set values
		content.main = [];
		content.secondary = createApps ? createApps.getAttribute('href') : null;
		apps.forEach(function(app) {
			var dataBasic = app.querySelectorAll('dd');
			var dataDetails = app.querySelectorAll('tbody td');
			content.main.push({
				application: app.document.querySelector('h3').innerHTML.trim(),
				created: dataBasic[1].querySelector('abbr').getAttribute('title'),
				api: dataDetails[0].innerHTML.trim(),
				key: dataDetails[1].innerHTML.trim(),
				edit: app.querySelector('.application-actions.actions .edit.action').getAttribute('href'),
				delete: app.querySelector('.application-actions.actions .delete-app.action').getAttribute('href')
			});
		});

	}

	// type = account-manage
	if (type === 'accountManage') {
		var accountForm = dom.querySelector('#member-edit');
		var userProfile = dom.querySelector('.actions .public-profile.action');
		content.main = '<form action="' + accountForm.getAttribute('action') + '" method="post" enctype="multipart/form-data" id="member-edit">' + accountForm.innerHTML + '</form>';
		content.main = content.main.replace('<legend>Account Information</legend>', '');
		if (userProfile) {
			userProfile = userProfile.getAttribute('href');
			window.mashery.userProfile = userProfile;
			sessionStorage.setItem('masheryUserProfile', userProfile);
		}
	}

	// type = account-email
	if (type === 'accountEmail') {
		var emailForm = dom.querySelector('.main form');
		if (!emailForm) return;
		content.main = '<form action="' + emailForm.getAttribute('action') + '" method="post" enctype="multipart/form-data">' + emailForm.innerHTML + '</form>';
		fetchUserProfile();
	}

	// type = account-password
	if (type === 'accountPassword') {
		var passwordForm = dom.querySelector('.main form');
		if (!passwordForm) return;
		content.main = '<form action="' + passwordForm.getAttribute('action') + '" method="post" enctype="multipart/form-data">' + passwordForm.innerHTML + '</form>';
		content.secondary = dom.querySelector('#passwd_requirements').innerHTML;
		fetchUserProfile();
	}

	// type = profile
	if (type === 'profile') {
		var data = dom.querySelectorAll('.user-information dd');
		var activity = dom.querySelector('table.recent-activity');
		var admin = dom.querySelector('a[href*="/r/member/"]');
		if (!activity || data.length < 1) return;
		content.main = {
			name: dom.querySelector('h1.first').innerHTML.replace('View Member ', '').trim(),
			admin: admin ? admin.getAttribute('href') : null,
			blog: data[0].querySelector('a').getAttribute('href'),
			website: data[1].querySelector('a').getAttribute('href'),
			registered: data[2].querySelector('abbr').getAttribute('title'),
			activity: activity ? '<table>' + activity.innerHTML + '</table>' : null
		};
	}

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