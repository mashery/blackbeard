/**
 * Convert nav items into a JS object
 * @param {String} selector The selector for the nav menu in the DOM
 */
var getNav = function (selector) {

	// Variables
	var nav = [];
	var items = mashery.dom.querySelectorAll(selector);
	var form, data, secret, created;

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
		var userProfile = data.querySelector('.actions .public-profile.action');
		if (!userProfile) return;

		// Get the href
		userProfile = userProfile.getAttribute('href');

		// Update the URL state
		window.mashery.userProfile = userProfile;
		sessionStorage.setItem('masheryUserProfile', userProfile);

		// Update the link in the DOM
		var profileLink = data.querySelector('a[href*="/profile/profile/"]');
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

	// Variable placeholders
	var h1, headerEdit, appDataBasic, appDataDetails;


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

		// Remove header edit link
		headerEdit = dom.querySelector('#header-edit');
		if (headerEdit) {
			headerEdit.remove();
		}

		// Heading
		h1 = dom.querySelector('h1.first');
		content.heading = h1.innerText;
		h1.remove();

		// Main Content
		content.main = dom.querySelector('#main .section-body').innerHTML;

	}

	// Documentation
	else if (type === 'docs') {

		// Remove header edit link
		headerEdit = dom.querySelector('#header-edit');
		if (headerEdit) {
			headerEdit.remove();
		}

		// Heading
		h1 = dom.querySelector('h1.first');
		content.heading = h1.innerText;
		h1.remove();

		// Main Content
		content.main = dom.querySelector('#main .section-body').innerHTML;

		// Sidebar Navigation
		content.secondary = dom.querySelector('#sub ul').innerHTML;

	}

	// Sign In Page
	else if (type === 'signin') {
		var signinForm = dom.querySelector('#signin form');
		content.main = '<form action="' + signinForm.action + '" method="post" enctype="multipart/form-data">' + signinForm.innerHTML + '</form>';
	}

	// Registration
	else if (type === 'register') {
		var regForm = dom.querySelector('#member-register');
		content.main = '<form action="' + regForm.action + '" method="post" enctype="multipart/form-data">' + regForm.innerHTML + '</form>';
	}

	// Registration Confirmation
	else if (type === 'registerSent') {
		var email = dom.querySelector('#main p');
		content.main = email ? email.innerHTML.replace('We have sent a confirmation e-mail to you at this address: ', '') : null;
	}

	// Resend Confirmation Email
	else if (type === 'registerResend') {
		form = dom.querySelector('#resend-confirmation');
		content.main = '<form action="' + form.getAttribute('action') + '" method="post" enctype="multipart/form-data" id="resend-confirmation">' + form.innerHTML + '</form>';
		content.main = content.main.replace('<legend>Resend your account confirmation email.</legend>', '');
	}

	// Join for Existing Mashery Members
	else if (type === 'join') {
		form = dom.querySelector('#member-edit');
		content.main = '<form action="' + form.getAttribute('action') + '" method="post" enctype="multipart/form-data" id="member-edit">' + form.innerHTML + '</form>';
		content.main = content.main.replace('<legend>Additional Information</legend>', '');
	}

	// Join Successful
	else if (type === 'joinSuccess') {
		var username = dom.querySelector('#main .section-body p');
		content.main = username ? username.innerHTML.replace('You have successfully registered as <strong>', '').replace('</strong>.', '').trim() : null;
	}

	// My keys
	else if (type === 'accountKeys') {

		// Get elements
		var keys = dom.querySelectorAll('.main .section-body h2, .main .section-body div.key');
		var getKeys = dom.querySelector('.action.new-key'); // @todo check if user can register at all based on this link

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
					data = key.querySelectorAll('dd');
					secret = data.length === 5 ? true : false;
					created = secret ? data[4].querySelector('abbr') : data[3].querySelector('abbr');
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

	// Delete Key
	else if (type === 'keyDelete') {

		// Variables
		form = dom.querySelector('#main .section-body form');
		data = dom.querySelectorAll('.key dd');
		secret = data.length === 5 ? true : false;
		created = secret ? data[4].querySelector('abbr') : data[3].querySelector('abbr');

		// Get the form
		content.main = '<form action="' + form.getAttribute('action') + '" method="post" enctype="multipart/form-data">' + form.innerHTML + '</form>';

		// Get the app data
		content.secondary = {
			api: dom.querySelector('#main .section-body h2').innerHTML,
			application: data[0].innerHTML.trim(),
			key: data[1].innerHTML.trim(),
			secret: secret ? data[2].innerHTML.trim() : null,
			status: secret ? data[3].innerHTML.trim() : data[2].innerHTML.trim(),
			created: created ? created.getAttribute('title') : ''
		};

	}

	// Key Activity
	else if (type === 'keyActivity') {

		// Variables
		var reports = dom.querySelector('#date_selector');
		data = dom.querySelectorAll('div.key dd');
		secret = data.length === 5 ? true : false;
		created = secret ? data[4].querySelector('abbr') : data[3].querySelector('abbr');

		// Get the main content
		content.main = '<div id="developerReport" class="reports"><div id="date_selector">' + reports.innerHTML + '</div></div>';

		// Get the key data
		content.secondary = {
			api: dom.querySelector('#main .section-body h2').innerHTML,
			application: data[0].innerHTML.trim(),
			key: data[1].innerHTML.trim(),
			secret: secret ? data[2].innerHTML.trim() : null,
			status: secret ? data[3].innerHTML.trim() : data[2].innerHTML.trim(),
			created: created ? created.getAttribute('title') : '',
			limits: '<table>' + dom.querySelector('div.key table.key').innerHTML + '<table>',
		};

		// Init function
		content.init = dom.innerHTML.match(/initCharts\(.*?\)/);

	}

	// My Apps
	else if (type === 'accountApps') {

		// Get elements
		var apps = dom.querySelectorAll('.main .application');
		var createApps = dom.querySelector('.main .actions .add-app.action');

		// Set values
		content.main = [];
		content.secondary = createApps ? createApps.getAttribute('href') : null;
		apps.forEach(function(app) {

			// Variables
			var dataBasic = app.querySelectorAll('dd');
			var dataDetails = app.querySelectorAll('tbody td');
			var edit = app.querySelector('.application-actions.actions .edit.action');
			var del = app.querySelector('.application-actions.actions .delete-app.action');
			var add = app.querySelector('.application-actions.actions .add-key.action');

			// Get main content
			content.main.push({
				application: app.querySelector('h3').innerHTML.trim(),
				created: dataBasic[1].querySelector('abbr').getAttribute('title'),
				api: dataDetails[0] ? dataDetails[0].innerHTML.trim() : null,
				key: dataDetails[1] ? dataDetails[1].innerHTML.trim() : null,
				edit: edit ? edit.getAttribute('href') : null,
				delete: del ? del.getAttribute('href') : null,
				add: add ? add.getAttribute('href') : null
			});

		});

	}

	// Register Application
	else if (type === 'appRegister') {
		form = dom.querySelector('#application-edit');
		var table = dom.querySelector('#main .section-body table');
		content.main = '<form action="' + form.getAttribute('action') + '" method="post" enctype="multipart/form-data" id="application-edit">' + form.innerHTML + '</form>';
		content.secondary = table ? '<table>' + table.innerHTML + '</table>' : null;
	}


	// Edit App
	else if (type === 'appEdit') {
		form = dom.querySelector('#application-edit');
		content.main = '<form action="' + form.getAttribute('action') + '" method="post" enctype="multipart/form-data" id="application-edit">' + form.innerHTML + '</form>';
		content.main = content.main.replace('<legend>Edit Your Application</legend>', '');
	}

	// Add APIs
	else if (type === 'appAddAPIs') {

		// Variables
		form = dom.querySelector('#main .section-body form');
		appDataBasic = dom.querySelectorAll('.application dd');
		appDataDetails = dom.querySelectorAll('.application tbody td');

		// Get the form
		content.main = '<form action="' + form.getAttribute('action') + '" method="post" enctype="multipart/form-data">' + form.innerHTML + '</form>';

		// Get the app data
		content.secondary = {
			application: dom.querySelector('.application h3').innerHTML.trim(),
			created: appDataBasic[1].querySelector('abbr').getAttribute('title'),
			api: appDataDetails[0] ? appDataDetails[0].innerHTML.trim() : null,
			key: appDataDetails[1] ? appDataDetails[1].innerHTML.trim() : null
		};
	}

	// Delete App
	else if (type === 'appDelete') {

		// Variables
		form = dom.querySelector('#main .section-body form');
		appDataBasic = dom.querySelectorAll('.application dd');
		appDataDetails = dom.querySelectorAll('.application tbody td');

		// Get the form
		content.main = '<form action="' + form.getAttribute('action') + '" method="post" enctype="multipart/form-data">' + form.innerHTML + '</form>';

		// Get the app data
		content.secondary = {
			application: dom.querySelector('.application h3').innerHTML.trim(),
			created: appDataBasic[1].querySelector('abbr').getAttribute('title'),
			api: appDataDetails[0] ? appDataDetails[0].innerHTML.trim() : null,
			key: appDataDetails[1] ? appDataDetails[1].innerHTML.trim() : null
		};
	}

	// Manage Account
	else if (type === 'accountManage') {
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

	// Change Email
	else if (type === 'accountEmail') {
		var emailForm = dom.querySelector('.main form');
		if (!emailForm) return;
		content.main = '<form action="' + emailForm.getAttribute('action') + '" method="post" enctype="multipart/form-data">' + emailForm.innerHTML + '</form>';
		fetchUserProfile();
	}

	// Change Password
	else if (type === 'accountPassword') {
		var passwordForm = dom.querySelector('.main form');
		if (!passwordForm) return;
		content.main = '<form action="' + passwordForm.getAttribute('action') + '" method="post" enctype="multipart/form-data">' + passwordForm.innerHTML + '</form>';
		content.secondary = dom.querySelector('#passwd_requirements').innerHTML;
		fetchUserProfile();
	}

	// User Profiles
	else if (type === 'profile') {
		h1 = dom.querySelector('h1.first');
		data = dom.querySelectorAll('.user-information dd');
		var activity = dom.querySelector('table.recent-activity');
		var admin = dom.querySelector('a[href*="/r/member/"]');
		content.main = {
			name: h1 ? h1.innerHTML.replace('View Member ', '').trim() : '',
			admin: admin ? admin.getAttribute('href') : null,
			blog: data[0] ? data[0].querySelector('a').getAttribute('href') : '',
			website: data[1] ? data[1].querySelector('a').getAttribute('href') : '',
			registered: data[2] ? data[2].querySelector('abbr').getAttribute('title') : '',
			activity: activity ? '<table>' + activity.innerHTML + '</table>' : null
		};
	}

	// IO Docs
	else if (type === 'ioDocs') {
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

		// Strip inline styles from content
		var styles = dom.querySelectorAll('[style]');
		styles.forEach(function (style) {
			style.style = '';
		});
		content.main = dom.querySelector('#main').innerHTML;

		// Schemas
		content.schemas = {};
		var schemas = dom.querySelectorAll('.endpointList > script');
		schemas.forEach(function (schema) {
			var strObj = schema.innerHTML.replace('(function() {', '').replace('var apiRootElement = $("#' + schema.parentNode.id + '").get(0);', '').replace("$.data(apiRootElement, 'apiSchemas', ", '').replace(');', '').replace('})();', '').trim();
			content.schemas[schema.parentNode.id] = JSON.parse(strObj);
		});
	}

	// Reset Password
	else if (type === 'lostPassword') {
		form = dom.querySelector('#lost form');
		content.main = '<form action="' + form.getAttribute('action') + '" method="post" enctype="multipart/form-data">' + form.innerHTML + '</form>';
		content.main = content.main.replace('<legend>Lost Password</legend>', '');
	}

	// Reset Username
	else if (type === 'lostUsername') {
		form = dom.querySelector('#lost form');
		content.main = '<form action="' + form.getAttribute('action') + '" method="post" enctype="multipart/form-data">' + form.innerHTML + '</form>';
		content.main = content.main.replace('<legend>E-mail yourself your username</legend>', '');
	}

	// Search Results
	else if (type === 'search') {

		// If it's a blank search page
		if (!dom.querySelector('.result') && !dom.querySelector('.no-result')) {
			content.newSearch = true;
		}

		// If there are no results
		else if (dom.querySelector('.no-result')) {
			content.main = null;
			content.secondary = {
				first: 0,
				last: 0,
				total: 0,
				query: dom.querySelector('.no-result b').innerHTML.trim()
			};
		}

		// If there are results
		else {
			var results = dom.querySelectorAll('.section-body .result');
			var meta = dom.querySelectorAll('.result-info b');
			var paging = dom.querySelectorAll('.result-paging a');
			content.main = [];

			results.forEach(function (result) {
				var link = result.querySelector('a');
				var summary = result.querySelector('.result-summary');
				content.main.push({
					url: link.getAttribute('href'),
					title: link.innerHTML.trim(),
					summary: summary ? summary.innerHTML.replace('<strong>', '<span class="search-term">').replace('</strong>', '</span>').trim() : ''
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
		form = dom.querySelector('#main form');
		content.main = '<form action="' + form.getAttribute('action') + '" method="post" enctype="multipart/form-data">' + form.innerHTML + '</form>';
	}

	// @todo Forum

	// @todo Blog

	// Get any inline scripts
	dom.querySelectorAll('script').forEach(function (script) {
		window.mashery.scripts.push(script.innerHTML);
	});

};