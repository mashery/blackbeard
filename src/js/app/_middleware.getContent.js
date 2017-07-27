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

	// type = register-confirm
	if (type === 'registerSent') {
		var email = dom.querySelector('#main p');
		content.main = email ? email.innerHTML.replace('We have sent a confirmation e-mail to you at this address: ', '') : null;
	}

	// type = resend-confirmation
	if (type === 'registerResend') {
		var form = dom.querySelector('#resend-confirmation');
		content.main = '<form action="' + form.getAttribute('action') + '" method="post" enctype="multipart/form-data" id="resend-confirmation">' + form.innerHTML + '</form>';
		content.main = content.main.replace('<legend>Resend your account confirmation email.</legend>', '');
	}

	// type = join
	if (type === 'join') {
		var form = dom.querySelector('#member-edit');
		content.main = '<form action="' + form.getAttribute('action') + '" method="post" enctype="multipart/form-data" id="member-edit">' + form.innerHTML + '</form>';
		content.main = content.main.replace('<legend>Additional Information</legend>', '');
	}

	// type = join-success
	if (type === 'joinSuccess') {
		var username = dom.querySelector('#main .section-body p');
		content.main = username ? username.innerHTML.replace('You have successfully registered as <strong>', '').replace('</strong>.', '').trim() : null;
	}

	// type = account-keys
	// @todo verify that there's only one app per key
	if (type === 'accountKeys') {

		// Get elements
		var keys = dom.querySelectorAll('.main .section-body h2, .main .section-body div.key');
		var getKeys = dom.querySelector('.action.new-key'); // @todo check if user can register at all based on this link

		if (keys.length > 0) {
			content.main = {};
			content.secondary = getKeys ? getKeys.getAttribute('href') : null;
			var currentPlan;

			keys.forEach(function (key, index) {
				if (key.tagName.toLowerCase() === 'h2') {
					currentPlan = key.innerHTML;
					content.main[key.innerHTML] = {
						name: key.innerHTML,
						keys: []
					};
				} else {
					var data = key.querySelectorAll('dd');
					var secret = data.length === 5 ? true : false;
					var created = secret ? data[4].querySelector('abbr') : data[3].querySelector('abbr');
					content.main[currentPlan].keys.push({
						application: data[0].innerHTML.trim(),
						key: data[1].innerHTML.trim(),
						secret: secret ? data[2].innerHTML.trim() : null,
						status: secret ? data[3].innerHTML.trim() : data[2].innerHTML.trim(),
						created: created ? created.getAttribute('title') : '',
						limits: '<table>' + key.querySelector('table.key').innerHTML + '<table>',
						report: key.querySelector('.key-actions.actions .view-report.action').getAttribute('href'),
						delete: key.querySelector('.key-actions.actions .delete.action').getAttribute('href')
					});
				}
			});
		}

	}

	// type = account-apps
	// nav, create apps link, no apps message, app content/table
	if (type === 'accountApps') {

		// Get elements
		var apps = dom.querySelectorAll('.main .application');
		var createApps = dom.querySelector('.main .actions .add-app.action');

		// Set values
		content.main = [];
		content.secondary = createApps ? createApps.getAttribute('href') : null;
		apps.forEach(function(app) {
			var dataBasic = app.querySelectorAll('dd');
			var dataDetails = app.querySelectorAll('tbody td');
			content.main.push({
				application: app.querySelector('h3').innerHTML.trim(),
				created: dataBasic[1].querySelector('abbr').getAttribute('title'),
				api: dataDetails[0] ? dataDetails[0].innerHTML.trim() : null,
				key: dataDetails[1] ? dataDetails[1].innerHTML.trim() : null,
				edit: app.querySelector('.application-actions.actions .edit.action').getAttribute('href'),
				delete: app.querySelector('.application-actions.actions .delete-app.action').getAttribute('href')
			});
		});

	}

	// type = app-register
	if (type === 'appRegister') {
		var form = dom.querySelector('#application-edit');
		var table = dom.querySelector('#main .section-body table');
		content.main = '<form action="' + form.getAttribute('action') + '" method="post" enctype="multipart/form-data" id="application-edit">' + form.innerHTML + '</form>';
		content.secondary = table ? '<table>' + table.innerHTML + '</table>' : null;
	};

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
		content.main = {
			name: dom.querySelector('h1.first').innerHTML.replace('View Member ', '').trim(),
			admin: admin ? admin.getAttribute('href') : null,
			blog: data[0] ? data[0].querySelector('a').getAttribute('href') : '',
			website: data[1] ? data[1].querySelector('a').getAttribute('href') : '',
			registered: data[2] ? data[2].querySelector('abbr').getAttribute('title') : '',
			activity: activity ? '<table>' + activity.innerHTML + '</table>' : null
		};
	}

	// type = ioDocs
	if (type === 'ioDocs') {
		var junk = dom.querySelectorAll('#main h1, #main .introText, #main .endpoint ul.actions, #apiTitle');
		var apiID = dom.querySelector('#apiId');
		junk.forEach(function (item) {
			item.remove();
		});
		if (apiID) {
			var apiIDClone = apiID.cloneNode(true);
			apiID.style.width = '';
			apiID.parentNode.parentNode.insertBefore(apiID.cloneNode(true), apiID.parentNode);
			apiID.parentNode.remove();
		}
		content.main = dom.querySelector('#main').innerHTML;
	}

	// type = lost-password
	if (type === 'lostPassword') {
		var form = dom.querySelector('#lost form');
		content.main = '<form action="' + form.getAttribute('action') + '" method="post" enctype="multipart/form-data">' + form.innerHTML + '</form>';
		content.main = content.main.replace('<legend>Lost Password</legend>', '');
	}

	// type = lost-username
	if (type === 'lostUsername') {
		var form = dom.querySelector('#lost form');
		content.main = '<form action="' + form.getAttribute('action') + '" method="post" enctype="multipart/form-data">' + form.innerHTML + '</form>';
		content.main = content.main.replace('<legend>E-mail yourself your username</legend>', '');
	}

	// type = search
	if (type === 'search') {
		if (dom.querySelector('.no-result')) {
			content.main = null;
			content.secondary = {
				first: 0,
				last: 0,
				total: 0,
				query: dom.querySelector('.no-result b').innerHTML.trim()
			}
		} else {
			var results = dom.querySelectorAll('.section-body .result');
			var meta = dom.querySelectorAll('.result-info b');
			var paging = dom.querySelectorAll('.result-paging a');
			content.main = [];

			results.forEach(function (result) {
				var link = result.querySelector('a');
				content.main.push({
					url: link.getAttribute('href'),
					title: link.innerHTML.trim(),
					summary: result.querySelector('.result-summary').innerHTML.replace('<strong>', '<span class="search-term">').replace('</strong>', '</span>').trim()
				});
			});

			content.secondary = {
				first: meta[0].innerHTML,
				last: meta[1].innerHTML,
				total: meta[2].innerHTML,
				query: meta[3].innerHTML,
				pagePrevious: null,
				pageNext: null
			};

			paging.forEach(function (link) {
				if (/Previous/.test(link.innerHTML)) {
					content.secondary.pagePrevious = link.getAttribute('href');
				} else {
					content.secondary.pageNext = link.getAttribute('href');
				}
			});
		}
	}

	// type = contact
	if (type === 'contact') {
		var form = dom.querySelector('#main form');
		content.main = '<form action="' + form.getAttribute('action') + '" method="post" enctype="multipart/form-data">' + form.innerHTML + '</form>';
	}

	// =======

	// type = forum {IGNORE}
	// recent topics link, categories RSS, categories OL

	// type = blog-all
	// RSS
	// foreach: article link/title, user link, date, content, comments link

	// type = blog-single
	// title, user link, date, content, comment count, comment box

};