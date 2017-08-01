/**
 * Convert nav items into a JS object
 * @param {String} selector The selector for the nav menu in the DOM
 */
var getNav = function (selector) {

	// Variables
	var nav = [];
	var items = m$.getAll(selector, mashery.dom);
	var form;

	// Generate items object
	for (var i = 0; i < items.length; i++) {
		nav.push({
			label: items[i].innerHTML,
			url: items[i].getAttribute('href')
		});
	}

	return nav;

};

/**
 * If user profile link isn't stored in localStorage, fetch it with Ajax
 */
var fetchUserProfile = function () {

	// Bail if profile URL is already stored
	if (window.mashery.userProfile) return;

	// Otherwise, grab it from the account page
	atomic.ajax({
		url: '/member/edit',
		responseType: 'document'
	}).success(function (data) {

		// Get the user profile link
		var userProfile = m$.get('.actions .public-profile.action', data);
		if (!userProfile) return;

		// Get the href
		userProfile = userProfile.getAttribute('href');

		// Update the URL state
		window.mashery.userProfile = userProfile;
		sessionStorage.setItem('masheryUserProfile', userProfile);

		// Update the link in the DOM
		var profileLink = m$.get('a[href*="/profile/profile/"]');
		if (!profileLink) return;
		profileLink.href = userProfile;

	});
};

/**
 * Scrape content from the default layout
 * @param {String} type  The content type for the page
 */
var getContent = function (type) {

	// Cache mashery objects
	var dom = window.mashery.dom;
	var content = window.mashery.content;


	//
	// Universal Content
	//

	// Primary nav
	content.navPrimary = getNav('#local a');

	// Secondary nav
	content.navSecondary = getNav('#footer > ul a');


	//
	// Conditional Content
	//

	// Custom Pages
	if (type === 'page') {
		content.main = m$.get('#main', dom).innerHTML;
	}

	// Documentation
	else if (type === 'docs') {
		content.main = m$.get('#main', dom).innerHTML;
		content.secondary = m$.get('#sub ul', dom).innerHTML;
	}

	// Sign In Page
	else if (type === 'signin') {
		var signinForm = m$.get('#signin form', dom);
		content.main = '<form action="' + signinForm.action + '" method="post" enctype="multipart/form-data">' + signinForm.innerHTML + '</form>';
	}

	// Registration
	else if (type === 'register') {
		var regForm = m$.get('#member-register', dom);
		content.main = '<form action="' + regForm.action + '" method="post" enctype="multipart/form-data">' + regForm.innerHTML + '</form>';
	}

	// Registration Confirmation
	else if (type === 'registerSent') {
		var email = m$.get('#main p', dom);
		content.main = email ? email.innerHTML.replace('We have sent a confirmation e-mail to you at this address: ', '') : null;
	}

	// Resend Confirmation Email
	else if (type === 'registerResend') {
		form = m$.get('#resend-confirmation', dom);
		content.main = '<form action="' + form.getAttribute('action') + '" method="post" enctype="multipart/form-data" id="resend-confirmation">' + form.innerHTML + '</form>';
		content.main = content.main.replace('<legend>Resend your account confirmation email.</legend>', '');
	}

	// Join for Existing Mashery Members
	else if (type === 'join') {
		form = m$.get('#member-edit', dom);
		content.main = '<form action="' + form.getAttribute('action') + '" method="post" enctype="multipart/form-data" id="member-edit">' + form.innerHTML + '</form>';
		content.main = content.main.replace('<legend>Additional Information</legend>', '');
	}

	// Join Successful
	else if (type === 'joinSuccess') {
		var username = m$.get('#main .section-body p', dom);
		content.main = username ? username.innerHTML.replace('You have successfully registered as <strong>', '').replace('</strong>.', '').trim() : null;
	}

	// My keys
	else if (type === 'accountKeys') {

		// Get elements
		var keys = m$.getAll('.main .section-body h2, .main .section-body div.key', dom);
		var getKeys = m$.get('.action.new-key', dom); // @todo check if user can register at all based on this link

		// Push each key to an object
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
					var data = m$.getAll('dd', key);
					var secret = data.length === 5 ? true : false;
					var created = secret ? m$.get('abbr', data[4]) : m$.get('abbr', data[3]);
					content.main[currentPlan].keys.push({
						application: data[0].innerHTML.trim(),
						key: data[1].innerHTML.trim(),
						secret: secret ? data[2].innerHTML.trim() : null,
						status: secret ? data[3].innerHTML.trim() : data[2].innerHTML.trim(),
						created: created ? created.getAttribute('title') : '',
						limits: '<table>' + m$.get('table.key', key).innerHTML + '<table>',
						report: m$.get('.key-actions.actions .view-report.action', key).getAttribute('href'),
						delete: m$.get('.key-actions.actions .delete.action', key).getAttribute('href')
					});
				}
			});
		}

	}

	// My Apps
	else if (type === 'accountApps') {

		// Get elements
		var apps = m$.getAll('.main .application', dom);
		var createApps = m$.getAll('.main .actions .add-app.action', dom);

		// Set values
		content.main = [];
		content.secondary = createApps ? createApps.getAttribute('href') : null;
		apps.forEach(function(app) {
			var dataBasic = m$.getAll('dd', app);
			var dataDetails = m$.getAll('tbody td', app);
			content.main.push({
				application: m$.get('h3', app).innerHTML.trim(),
				created: m$.get('abbr', dataBasic[1]).getAttribute('title'),
				api: dataDetails[0] ? dataDetails[0].innerHTML.trim() : null,
				key: dataDetails[1] ? dataDetails[1].innerHTML.trim() : null,
				edit: m$.get('.application-actions.actions .edit.action', app).getAttribute('href'),
				delete: m$.get('.application-actions.actions .delete-app.action', app).getAttribute('href')
			});
		});

	}

	// Register Application
	else if (type === 'appRegister') {
		form = m$.get('#application-edit', dom);
		var table = m$.get('#main .section-body table', dom);
		content.main = '<form action="' + form.getAttribute('action') + '" method="post" enctype="multipart/form-data" id="application-edit">' + form.innerHTML + '</form>';
		content.secondary = table ? '<table>' + table.innerHTML + '</table>' : null;
	}

	// Manage Account
	else if (type === 'accountManage') {
		var accountForm = m$.get('#member-edit', dom);
		var userProfile = m$.get('.actions .public-profile.action', dom);
		content.main = '<form action="' + accountForm.getAttribute('action') + '" method="post" enctype="multipart/form-data" id="member-edit">' + accountForm.innerHTML + '</form>';
		content.main = content.main.replace('<legend>Account Information</legend>', '');
		if (userProfile) {
			userProfile = userProfile.getAttribute('href');
			window.mashery.userProfile = userProfile;
			sessionStorage.setItem('masheryUserProfile', userProfile);
		}
	}

	// Change Email
	else if (type === 'accountEmail') {
		var emailForm = m$.get('.main form', dom);
		if (!emailForm) return;
		content.main = '<form action="' + emailForm.getAttribute('action') + '" method="post" enctype="multipart/form-data">' + emailForm.innerHTML + '</form>';
		fetchUserProfile();
	}

	// Change Password
	else if (type === 'accountPassword') {
		var passwordForm = m$.get('.main form', dom);
		if (!passwordForm) return;
		content.main = '<form action="' + passwordForm.getAttribute('action') + '" method="post" enctype="multipart/form-data">' + passwordForm.innerHTML + '</form>';
		content.secondary = m$.get('#passwd_requirements', dom).innerHTML;
		fetchUserProfile();
	}

	// User Profiles
	else if (type === 'profile') {
		var data = m$.getAll('.user-information dd', dom);
		var activity = m$.get('table.recent-activity', dom);
		var admin = m$.get('a[href*="/r/member/"]', dom);
		content.main = {
			name: m$.get('h1.first', dom).innerHTML.replace('View Member ', '').trim(),
			admin: admin ? admin.getAttribute('href') : null,
			blog: data[0] ? m$.get('a', data[0]).getAttribute('href') : '',
			website: data[1] ? m$.get('a', data[1]).getAttribute('href') : '',
			registered: data[2] ? m$.get('abbr', data[2]).getAttribute('title') : '',
			activity: activity ? '<table>' + activity.innerHTML + '</table>' : null
		};
	}

	// IO Docs
	else if (type === 'ioDocs') {
		var junk = m$.getAll('#main h1, #main .introText, #main .endpoint ul.actions, #apiTitle', dom);
		var apiID = m$.get('#apiId', dom);
		junk.forEach(function (item) {
			item.remove();
		});
		if (apiID) {
			var apiIDClone = apiID.cloneNode(true);
			apiID.style.width = '';
			apiID.parentNode.parentNode.insertBefore(apiID.cloneNode(true), apiID.parentNode);
			apiID.parentNode.remove();
		}
		content.main = m$.get('#main', dom).innerHTML;
	}

	// Reset Password
	else if (type === 'lostPassword') {
		form = m$.get('#lost form', dom);
		content.main = '<form action="' + form.getAttribute('action') + '" method="post" enctype="multipart/form-data">' + form.innerHTML + '</form>';
		content.main = content.main.replace('<legend>Lost Password</legend>', '');
	}

	// Reset Username
	else if (type === 'lostUsername') {
		form = m$.get('#lost form', dom);
		content.main = '<form action="' + form.getAttribute('action') + '" method="post" enctype="multipart/form-data">' + form.innerHTML + '</form>';
		content.main = content.main.replace('<legend>E-mail yourself your username</legend>', '');
	}

	// Search Results
	else if (type === 'search') {

		// If there are no results
		if (m$.get('.no-result', dom)) {
			content.main = null;
			content.secondary = {
				first: 0,
				last: 0,
				total: 0,
				query: m$.get('.no-result b', dom).innerHTML.trim()
			};
		}

		// If there are results
		else {
			var results = m$.getAll('.section-body .result', dom);
			var meta = m$.getAll('.result-info b', dom);
			var paging = m$.getAll('.result-paging a', dom);
			content.main = [];

			results.forEach(function (result) {
				var link = m$.get('a', result);
				content.main.push({
					url: link.getAttribute('href'),
					title: link.innerHTML.trim(),
					summary: m$.get('.result-summary', result).innerHTML.replace('<strong>', '<span class="search-term">').replace('</strong>', '</span>').trim()
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

	// Contact Us
	else if (type === 'contact') {
		form = m$.get('#main form', dom);
		content.main = '<form action="' + form.getAttribute('action') + '" method="post" enctype="multipart/form-data">' + form.innerHTML + '</form>';
	}

	// @todo Forum

	// @todo Blog

};