var m$ = (function () {

	'use strict';

	//
	// Variables
	//

	// Placeholder for public methods
	var m$ = {};

	// Setup internally global variables
	var settings, main, data, markdown;

	// Path to Files
	var filePaths = {

		// IO Docs
		ioDocsJS: '/files/iodocs-vanilla.js',

		// Syntax Highlighting
		prism: '/files/prism.min.js',

		// API Reporting
		googleJSAPI: 'https://www.google.com/jsapi',
		underscore: '/public/Mashery/scripts/Mashery/source/underscore.js',
		defaultsJS: '/public/Mashery/scripts/MasheryAdmin/Reports/config/defaults.js',
		drillin: '/public/Mashery/scripts/MasheryAdmin/Reports/config/packages/developer_drillin.js',
		reports: '/public/Mashery/scripts/MasheryDeveloperReports.js'

	};

	// Defaults
	var defaults = {

		/**
		 * Ajax page loads
		 * Whether to load pages async or with a page reload
		 */

		// If true, use Ajax
		ajax: true,

		// Selectors to ignore if clicked.
		// Accepts any valid CSS selector.
		// Use comma separated list for multiple selectors.
		ajaxIgnore: null,

		// Text to display in title while loading page
		ajaxLoading: 'Loading...',

		// Class for links that point to the current page
		currentPageClass: 'current-page',

		/**
		 * Favicon
		 */

		// If true, inject a favicon
		favicon: false,

		// The favicon URL
		faviconURL: '/files/favicon.ico',

		// The favicon sizes
		faviconSizes: '16x16 32x32',


		/**
		 * Files to load
		 */
		loadCSS: [], // CSS (loaded in header)
		loadJSHeader: [], // JS loaded before render
		loadJSFooter: [], // JS loaded after render

		/**
		 * Logo
		 * Add a custom logo.
		 * Accepts any markup as a string (<img src>, <svg>, etc.)
		 */
		logo: null,

		// If true, enable markdown on docs and custom pages
		markdown: true,

		// If true, activate mashtip tooltips
		mashtips: true,

		// If true, test password strength
		passwordStrength: true,

		// If true, include viewport resizing meta tag
		responsive: true,

		/**
		 * Templates
		 * Customize the content and layout of anything in the Portal.
		 * Use a string for simple layouts.
		 * Use a function that returns a string for complex ones and conditional logic.
		 */
		templates: {

			/**
			 * My Apps
			 * The layout for the page displaying a users registered applications.
			 */
			accountApps: function () {
				var template = 	'<h1>{{content.heading}}</h1><ul id="nav-account">{{content.navItemsAccount}}</ul>';
				if (Object.keys(mashery.content.main).length > 0) {
					mashery.content.main.forEach(function (app) {
						template +=
							'<h2>' + app.application + '</h2>' +
							'<ul>' +
								'<li>API: ' + (app.api ? app.api : 'None') + '</li>' +
								'<li>Key: ' + (app.key ? app.key : 'None') + '</li>' +
								'<li>Created: ' + app.created + '</li>' +
							'</ul>' +
							'<p>';

							if (app.edit) {
								template += '<a class="btn btn-edit-app" id="' + m$.sanitizeClass(app.application, 'btn-edit-app') + '" href="' + app.edit + '">Edit This App</a>';
							}
							if (app.delete) {
								template += '<a class="btn btn-delete-app" id="' + m$.sanitizeClass(app.application, 'btn-delete-app') + '" href="' + app.delete + '">Delete This App</a>';
							}
							if (app.add) {
								template += '<a class="btn btn-add-key-app" id="' + m$.sanitizeClass(app.application, 'btn-add-key-app') + '" href="' + app.add + '">Add APIs</a>';
							}

						template += '</p>';
					});
				} else {
					template += '{{content.noApps}}';
				}
				if (mashery.content.secondary) {
					template += '<p><a class="btn btn-get-app" id="btn-get-app" href="' + window.mashery.content.secondary + '">Create a New App</a></p>';
				}
				return '<div class="main container container-small" id="main">' + template + '</div>';
			},

			/**
			 * My Account: Email
			 * The layout for the page where users can change their Mashery email address.
			 */
			accountEmail:	'<div class="main container container-small" id="main">' +
								'<h1>{{content.heading}}</h1>' +
								'<ul id="nav-account">{{content.navItemsAccount}}</ul>' +
								'<ul id="nav-mashery-account">{{content.navItemsMasheryAccount}}</ul>' +
								'{{content.main}}' +
							'</div>',

			/**
			 * My Account: Email Success
			 * The layout for the page confirming email change was successful
			 */
			accountEmailSuccess:	'<div class="main container container-small" id="main">' +
										'<h1>{{content.heading}}</h1>' +
										'<ul id="nav-account">{{content.navItemsAccount}}</ul>' +
										'<ul id="nav-mashery-account">{{content.navItemsMasheryAccount}}</ul>' +
										'{{content.main}}' +
									'</div>',

			/**
			 * My Keys
			 * The layout for the page displaying a users API keys.
			 */
			accountKeys: function () {
				var template = '<h1>{{content.heading}}</h1><ul id="nav-account">{{content.navItemsAccount}}</ul>';
				if (Object.keys(mashery.content.main).length > 0 ) {
					mashery.content.main.forEach(function (plan) {
						template += '<h2>' + plan.name + '</h2>';
						if (plan.keys.length > 0) {
							plan.keys.forEach(function (key) {
								var secret = key.secret ? '<li>Secret: ' + key.secret + '</li>' : '';
								template +=
									'<p><strong>' + key.application + '</strong></p>' +
									'<ul>' +
										'<li>Key: ' + key.key + '</li>' +
										secret +
										'<li>Status: ' + key.status + '</li>' +
										'<li>Created: ' + key.created + '</li>' +
									'</ul>' +
									key.limits +
									'<p>' +
										'<a class="btn btn-key-report" id="btn-key-report" href="' + key.report + '">View Report</a>' +
										'<a class="btn btn-delete-key" id="btn-delete-key" href="' + key.delete + '">Delete This Key</a>' +
									'</p>';
							});
						} else {
							template += '<p>{{content.noPlanKeys}}</p>';
							if (mashery.content.secondary) {
								template += '<p><a class="btn btn-get-key" id="' + m$.sanitizeClass(plan.name, 'btn-get-key') + '"  href="' + mashery.content.secondary + '">Get a Key for ' + plan.name + '</a></p>';
							}
						}
					});
				} else {
					template += '{{content.noKeys}}';
					if (mashery.content.secondary) {
						template += '<p><a class="btn btn-get-key" id="btn-get-key" href="' + mashery.content.secondary + '">Get API Keys</a></p>';
					}
				}
				return '<div class="main container container-small" id="main">' + template + '</div>';
			},

			/**
			 * My Account
			 * The layout for the page where users can manage their Mashery Account details.
			 */
			accountManage:	'<div class="main container container-small" id="main">' +
								'<h1>{{content.heading}}</h1>' +
								'<ul id="nav-account">{{content.navItemsAccount}}</ul>' +
								'<ul id="nav-mashery-account">{{content.navItemsMasheryAccount}}</ul>' +
								'<h2>{{content.subheading}}</h2>' +
								'{{content.main}}' +
							'</div>',

			/**
			 * My Account: Password
			 * The layout for the page where users can change their Mashery password.
			 */
			accountPassword:	'<div class="main container container-small" id="main">' +
									'<h1>{{content.heading}}</h1>' +
									'<ul id="nav-account">{{content.navItemsAccount}}</ul>' +
									'<ul id="nav-mashery-account">{{content.navItemsMasheryAccount}}</ul>' +
									'{{content.main}}' +
								'</div>',

			/**
			 * My Account: Password Success
			 * The layout for the page after users have successfully changed their password.
			 */
			accountPasswordSuccess:	'<div class="main container container-small" id="main">' +
										'<h1>{{content.heading}}</h1>' +
										'<ul id="nav-account">{{content.navItemsAccount}}</ul>' +
										'<ul id="nav-mashery-account">{{content.navItemsMasheryAccount}}</ul>' +
										'{{content.main}}' +
									'</div>',

			/**
			 * Add App APIs
			 * Add APIs to an application
			 */
			appAddAPIs: function () {
				var template =
							'<div class="main container container-small" id="main">' +
								'<h1>{{content.heading}}</h1>' +
								'<ul>' +
									'<li><strong>{{content.applicationLabel}}</strong> ' + window.mashery.content.secondary.application + '</li>' +
									'<li><strong>{{content.createdLabel}}</strong> ' + window.mashery.content.secondary.created + '</li>' +
									(window.mashery.content.secondary.api ? '<li><strong>{{content.apiLabel}}</strong> ' + window.mashery.content.secondary.api + '</li>' : '') +
									(window.mashery.content.secondary.key ? '<li><strong>{{content.keyLabel}}</strong> ' + window.mashery.content.secondary.key + '</li>' : '') +
								'</ul>' +
								'<h2>{{content.subheading}}</h2>' +
								'{{content.main}}' +
							'</div>';

				return template;
			},

			/**
			 * App Delete
			 * Delete an application
			 */
			appDelete: function () {
				var template =
							'<div class="main container container-small" id="main">' +
								'<h1>{{content.heading}}</h1>' +
								'<ul>' +
									'<li><strong>{{content.applicationLabel}}</strong> ' + window.mashery.content.secondary.application + '</li>' +
									'<li><strong>{{content.createdLabel}}</strong> ' + window.mashery.content.secondary.created + '</li>' +
									(window.mashery.content.secondary.api ? '<li><strong>{{content.apiLabel}}</strong> ' + window.mashery.content.secondary.api + '</li>' : '') +
									(window.mashery.content.secondary.key ? '<li><strong>{{content.keyLabel}}</strong> ' + window.mashery.content.secondary.key + '</li>' : '') +
								'</ul>' +
								'<h2>{{content.subheading}}</h2>' +
								'{{content.main}}' +
								'{{content.form}}' +
							'</div>';

				return template;
			},

			/**
			 * Add App APIs: Success
			 * New API keys added to an app
			 */
			appAddAPIsSuccess:	'<div class="container container-small">' +
									'<h1>{{content.heading}}</h1>' +
									'{{content.main}}' +
								'</div>',

			/**
			 * Edit Application
			 * Layout with form to edit an application
			 */
			appEdit:	'<div class="container container-small">' +
							'<h1>{{content.heading}}</h1>' +
							'{{content.main}}' +
							'{{content.form}}' +
						'</div>',

			/**
			 * App Registration
			 * The layout for the app registration page.
			 */
			appRegister:	'<div class="main container container-small" id="main">' +
									'<h1>{{content.heading}}</h1>' +
									'{{content.main}}' +
									'{{content.form}}' +
								'</div>',

			/**
			 * App Registration Success
			 * The layout for the message that's displayed after an application is successfully registered.
			 */
			appRegisterSuccess:	'<div class="main container container-small" id="main">' +
									'<h1>{{content.heading}}</h1>' +
									'{{content.main}}' +
								'</div>',

			/**
			 * Blog: All Posts
			 * The layout for the page where all blog posts are listed.
			 * @todo Create this layout
			 */
			blogAll: '<div class="main container" id="main"><p>Blog content needs to get created.</p></div>',

			/**
			 * Blog: Single Post
			 * The layout for individual blog posts.
			 * @todo Create this layout
			 */
			blogSingle: '<div class="main container" id="main"><p>Blog content needs to get created.</p></div>',

			/**
			 * Contact
			 * The layout for the contact page.
			 */
			contact:	'<div class="main container container-small" id="main">' +
							'<h1>{{content.heading}}</h1>' +
							'{{content.main}}' +
							'{{content.form}}' +
						'</div>',

			/**
			 * Contact Success
			 * The layout for the message displayed after a contact form is successfully submitted.
			 */
			contactSuccess:	'<div class="main container container-small" id="main">' +
								'<h1>{{content.heading}}</h1>' +
								'<p>{{content.main}}</p>' +
							'</div>',

			/**
			 * Documentation
			 * The layout for API documentation.
			 * This page includes an automatically generated navigation menu.
			 */
			docs:	'<div class="main container" id="main">' +
						'<div class="row">' +
							'<div class="grid-two-thirds content">' +
								'<h1>{{content.heading}}</h1>' +
								'{{content.main}}' +
							'</div>' +
							'<div class="grid-third">' +
								'<h2>{{content.subheading}}</h2>' +
								'<ul>{{content.secondary}}</ul>' +
							'</div>' +
						'</div>' +
					'</div>',

			/**
			 * Footer 1
			 * The first of two footer content sections.
			 */
			footer1: '<div class="footer-1 container" id="footer-1"><hr></div>',

			/**
			 * Footer 2
			 * The second of two footer content sections.
			 */
			footer2:	'<div class="footer-1 container" id="footer-2">' +
							'<p>{{content.masheryMade}}</p>' +
						'</div>',

			/**
			 * Forum: All Topics
			 * The layout for the main forum page where all topics are listed.
			 * @todo Create this layout
			 */
			forumAll: '<div class="main container" id="main"><p>The forum content needs to get created.</p></div>',


			/**
			 * 404
			 * The layout for 404 pages.
			 */
			fourOhFour:	'<div class="main container container-small" id="main">' +
							'<h1>{{content.heading}}</h1>' +
							'{{content.main}}' +
						'</div>',

			/**
			 * IO Docs
			 * The layout for the IO Docs page.
			 */
			ioDocs:	'<div class="main container container-small" id="main">' +
						'<h1>{{content.heading}}</h1>' +
						'{{content.main}}' +
						'{{content.form}}' +
					'</div>',

			/**
			 * Join
			 * The layout for existing Mashery users signing into an area for the first time.
			 * Mashery Terms of Use *must* be displayed on this page, and will be automatically injected if you omit them.
			 */
			join:	'<div class="main container container-small" id="main">' +
						'<h1>{{content.heading}}</h1>' +
						'{{content.main}}' +
						'{{content.form}}' +
						'{{content.terms}}' +
					'</div>',

			/**
			 * Join Success
			 * The layout for the page confirming that an existing Mashery user has joined a new area.
			 */
			joinSuccess:	'<div class="main container container-small" id="main">' +
								'<h1>{{content.heading}}</h1>' +
								'{{content.main}}' +
							'</div>',

			/**
			 * Key Activity
			 * Layout for the key activity report page.
			 */
			keyActivity: function () {
				var template =
					'<h1>{{content.heading}}</h1>' +

					'<ul id="nav-account">{{content.navItemsAccount}}</ul>' +

					'<h2>{{content.subheadingAPI}}</h2>' +
					'<ul>' +
						'<li><strong>{{content.applicationLabel}}</strong> ' + window.mashery.content.secondary.application + '</li>' +
						'<li><strong>{{content.keyLabel}}</strong> ' + window.mashery.content.secondary.key + '</li>' +
						(window.mashery.content.secondary.secret ? '<li><strong>{{content.secretLabel}}</strong> ' + window.mashery.content.secondary.secret + '</li>' : '') +
						'<li><strong>{{content.statusLabel}}</strong> ' + window.mashery.content.secondary.status + '</li>' +
						'<li><strong>{{content.createdLabel}}</strong> ' + window.mashery.content.secondary.created + '</li>' +
					'</ul>' +

					'{{content.limits}}' +

					'{{content.main}}';

				return '<div class="main container container-small" id="main">' + template + '</div>';
			},

			/**
			 * Key Delete
			 * Layout for the delete key page.
			 */
			keyDelete: function () {
				var template =
					'<h1>{{content.heading}}</h1>' +

					'<h2>{{content.subheadingAPI}}</h2>' +
					'<ul>' +
					'<li><strong>{{content.applicationLabel}}</strong> ' + window.mashery.content.secondary.application + '</li>' +
					'<li><strong>{{content.keyLabel}}</strong> ' + window.mashery.content.secondary.key + '</li>' +
					(window.mashery.content.secondary.secret ? '<li><strong>{{content.secretLabel}}</strong> ' + window.mashery.content.secondary.secret + '</li>' : '') +
					'<li><strong>{{content.statusLabel}}</strong> ' + window.mashery.content.secondary.status + '</li>' +
					'<li><strong>{{content.createdLabel}}</strong> ' + window.mashery.content.secondary.created + '</li>' +
					'</ul>' +

					'<h2>{{content.subheadingConfirm}}</h2>' +
					'{{content.main}}' +
					'{{content.form}}';

				return '<div class="main container container-small" id="main">' + template + '</div>';
			},

			/**
			 * Base layout
			 * The markup structure that all of the content will get loaded into.
			 */
			layout:	'<a class="screen-reader screen-reader-focusable" href="#main-wrapper">Skip to content</a>' +
					'{{layout.navUser}}' +
					'{{layout.navPrimary}}' +
					'{{layout.main}}' +
					'<footer class="footer" id="footer">' +
						'{{layout.footer1}}' +
						'{{layout.navSecondary}}' +
						'{{layout.footer2}}' +
					'</footer>',

			/**
			 * Logout Success
			 * The layout for the page shown after a user logs out.
			 */
			logout:	'<div class="main container container-small" id="main">' +
						'<h1>{{content.heading}}</h1>' +
						'<p>{{content.main}}</p>' +
					'</div>',

			/**
			 * Logout Failed
			 * The layout for the page shown when a logout was unsuccessful.
			 */
			logoutFail:	'<div class="main container container-small" id="main">' +
							'<h1>{{content.heading}}</h1>' +
							'<p>{{content.main}}</p>' +
						'</div>',

			/**
			 * Lost Password Request
			 * The layout for the page where users can request their password be reset.
			 */
			lostPassword:	'<div class="main container container-small" id="main">' +
								'<h1>{{content.heading}}</h1>' +
								'{{content.main}}' +
								'{{content.form}}' +
							'</div>',

			/**
			 * Lost Password Reset
			 * The layout for the page shown after a password reset email is sent to the user.
			 */
			lostPasswordReset:	'<div class="main container container-small" id="main">' +
									'<h1>{{content.heading}}</h1>' +
									'<p>{{content.main}}</p>' +
								'</div>',

			/**
			 * Lost Username Request
			 * The layout for the page where users can request their username be reset.
			 */
			lostUsername:	'<div class="main container container-small" id="main">' +
								'<h1>{{content.heading}}</h1>' +
								'{{content.main}}' +
								'{{content.form}}' +
							'</div>',

			/**
			 * Lost Username Reset
			 * The layout for the page where users can reset their username.
			 */
			lostUsernameReset:	'<div class="main container container-small" id="main">' +
									'<h1>{{content.heading}}</h1>' +
									'<p>{{content.main}}</p>' +
								'</div>',

			/**
			 * Remove Membership
			 * The layout for the page where users can remove their membership from this Portal.
			 */
			memberRemove:	'<div class="main container container-small" id="main">' +
								'<h1>{{content.heading}}</h1>' +
								'<p>{{content.main}}</p>' +
								'<p>' +
									'<a class="btn btn-remove-member-confirm" id="btn-remove-member-confirm" href="{{path.removeMember}}">{{content.confirm}}</a>' +
									'<a class="btn btn-remove-member-cancel" id="btn-remove-member-cancel" href="{{path.account}}">{{content.cancel}}</a>' +
								'</p>' +
							'</div>',

			/**
			 * Remove Membership Success
			 * The layout for the page shown when user membership was successfully removed.
			 */
			memberRemoveSuccess:	'<div class="main container container-small" id="main">' +
										'<h1>{{content.heading}}</h1>' +
										'<p>{{content.main}}</p>' +
									'</div>',

			/**
			 * No Access
			 * Layout for when the user does not have permission to view the page
			 */
			noAccess:	'<div class="main container container-small" id="main">' +
							'<h1>{{content.heading}}</h1>' +
							'<p>{{content.main}}</p>' +
						'</div>',

			/**
			 * Custom Pages
			 * The layout for custom pages.
			 */
			page:	'<div class="main container content" id="main">' +
						'<h1>{{content.heading}}</h1>' +
						'{{content.main}}' +
					'</div>',

			/**
			 * User Profiles
			 * The layout for user profile pages.
			 */
			profile: function () {
				// @todo convert these strings into context-specific placeholders
				var template = '<h1>{{content.heading}}</h1>';
				if (window.mashery.content.main.admin) {
					template += '<p><a href="' + window.mashery.content.main.admin + '">View administrative profile for ' + window.mashery.content.main.name + '</a></p>';
				}
				template +=	'<h2>{{content.headingUserInfo}}</h2>' +
							'<ul>';
							if (window.mashery.content.main.website) {
								template += '<li><strong>{{content.userWebsite}}</strong> <a href="' + window.mashery.content.main.website + '">' + window.mashery.content.main.website + '</a></li>';
							}
							if (window.mashery.content.main.blog) {
								template += '<li><strong>{{content.userBlog}}</strong> <a href="' + window.mashery.content.main.blog + '">' + window.mashery.content.main.blog + '</a></li>';
							}
							template += '<li><strong>{{content.userRegistered}}</strong> ' + window.mashery.content.main.registered + '</li>';
				template +=	'</ul>';
				if (window.mashery.content.main.activity) {
					template += '<h2>{{content.headingActivity}}</h2>' +
					window.mashery.content.main.activity;
				}
				return '<div class="main container" id="main">' + template + '</div>';
			},

			/**
			 * Primary Navigation
			 * The primary navigation content for the Portal.
			 */
			primaryNav:	'<div class="nav-primary nav-wrap nav-collapse" id="nav-primary">' +
							'<div class="container padding-top-small padding-bottom-small">' +
								'<a id="logo" class="logo" href="/">{{content.logo}}</a>' +
								'<a role="button" class="nav-toggle" id="nav-primary-toggle" data-nav-toggle="#nav-primary-menu" href="#">{{content.menuToggle}}</a>' +
								'<div class="nav-menu" id="nav-primary-menu">' +
									'<ul class="nav" id="nav-primary-list">' +
										'{{content.navItemsPrimary}}' +
										'<li>{{content.searchForm}}</li>' +
									'</ul>' +
								'</div>' +
							'</div>' +
						'</div>',

			/**
			 * Registration
			 * The layout for the registration page.
			 * Terms of Use *must* be included on this page, and will be automatically injected if you omit them.
			 */
			register:	'<div class="main container" id="main">' +
							'<div class="row">' +
								'<div class="grid-two-thirds">' +
									'<h1>{{content.heading}}</h1>' +
									'{{content.main}}' +
									'{{content.form}}' +
									'{{content.terms}}' +
								'</div>' +
								'<div class="grid-third">' +
									'{{content.about}}' +
								'</div>' +
							'</div>' +
						'</div>',

			/**
			 * Registration Email Sent
			 * The layout for the page confirming that the users registration email was sent.
			 * @todo Convert the text into variables
			 */
			registerSent:	'<div class="main container container-small" id="main">' +
									'<h1>{{content.heading}}</h1>' +
									'<p>We have sent a confirmation email to you at {{content.main}}.</p>' +
									'<p>Please click on the link in that e-mail to confirm your account. If you do not receive an email within the next hour, <a href="{{path.registerResendConfirmation}}">click here to resend confirmation email</a>.</p>' +
								'</div>',

			/**
			 * Registration Email Resend
			 * The layout for the page requesting the registration email be resent.
			 */
			registerResend:	'<div class="main container container-small" id="main">' +
								'<h1>{{content.heading}}</h1>' +
								'{{content.main}}' +
								'{{content.form}}' +
							'</div>',

			/**
			 * Registration Email Resent
			 * The layout for the page confirming that the registration email was resent.
			 */
			registerResendSuccess:	'<div class="main container container-small" id="main">' +
										'<h1>{{content.heading}}</h1>' +
										'{{content.main}}' +
									'</div>',

			/**
			 * Search
			 * The layout for search results.
			 */
			search:	function () {
				var template = '';
				if (window.mashery.content.newSearch) {
					template += '<h1>{{content.headingNew}}</h1>' +
								'{{content.searchForm}}';
				} else if (window.mashery.content.main) {
					template += '<h1>{{content.heading}}</h1>' +
								'{{content.searchForm}}' +
								'<p>{{content.meta}}</p>';
					window.mashery.content.main.forEach(function (result) {
						template +=
							'<div class="search-result">' +
								'<h2 class="no-margin-bottom"><a href="' + result.url + '">' + result.title + '</a></h2>' +
								'<p>' +
									result.summary +
									'<br>' +
									'<a href="' + result.url + '">' + result.url + '</a>' +
								'</p>' +
							'</div>';
					});
					template += '<div class="search-pagination">';
					if (window.mashery.content.secondary.pagePrevious) {
						template += '<a href="' + window.mashery.content.secondary.pagePrevious + '">{{content.pagePrevious}}</a>';
					}
					if (window.mashery.content.secondary.pagePrevious && window.mashery.content.secondary.pageNext) {
						template += '{{content.pageDivider}}';
					}
					if (window.mashery.content.secondary.pageNext) {
						template += '<a href="' + window.mashery.content.secondary.pageNext + '">{{content.pageNext}}</a>';
					}
					template += '</div>';
				} else {
					template +=	'<h1>{{content.heading}}</h1>' +
								'{{content.searchForm}}' +
								'{{content.noResults}}';
				}

				return '<div class="main container container-small" id="main">' + template + '</div>';
			},

			/**
			 * Secondary Navigation
			 * The secondary navigation for the Portal, often included in the footer.
			 */
			secondaryNav:	'<div class="nav-secondary container" id="nav-secondary">' +
								'<ul id="nav-secondary-list">' +
									'{{content.navItemsSecondary}}' +
								'</ul>' +
							'</div>',

			/**
			 * Secret Visibility
			 * Show key secrets for 30 days.
			 */
			showSecret:	'<div class="main container container-small" id="main">' +
							'<h1>{{content.heading}}</h1>' +
							'{{content.main}}' +
						'</div>',

			/**
			 * Secret Visibility: Success
			 * Key secrets will be shown.
			 */
			showSecretSuccess:	'<div class="main container container-small" id="main">' +
									'<h1>{{content.heading}}</h1>' +
									'{{content.main}}' +
								'</div>',

			/**
			 * Secret Visibility; Error
			 * Key secrets already shown.
			 */
			showSecretError:	'<div class="main container container-small" id="main">' +
									'<h1>{{content.heading}}</h1>' +
									'{{content.main}}' +
								'</div>',

			/**
			 * Sign In
			 * The layout for the sign in page.
			 */
			signin:	'<div class="main container" id="main">' +
						'<div class="row">' +
							'<div class="grid-half">' +
								'<h1>{{content.heading}}</h1>' +
								'{{content.main}}' +
								'{{content.form}}' +
							'</div>' +
							'<div class="grid-half">' +
								'{{content.about}}' +
							'</div>' +
						'</div>' +
					'</div>',

			/**
			 * User Navigation
			 * The navigation menu for sign in, registration, account, and logout links.
			 */
			userNav:	'<div class="nav-user container" id="nav-user">' +
							'<ul class="nav-user-list list-inline text-small text-muted padding-top-small padding-bottom-small no-margin-bottom text-right" id="nav-user-list">' +
								'{{content.navItemsUser}}' +
							'</ul>' +
						'</div>'

		},

		/**
		 * Labels & Blurbs
		 * Change headlines and messages without customizing the entire layout.
		 */
		labels: {

			/**
			 * My Apps
			 * The page displaying a users registered applications.
			 */
			accountApps: {
				heading: 'My Apps', // heading
				noApps: 'You don\'t have any apps yet.', // The message to display when a user has no apps
			},

			/**
			 * My Account: Email
			 * The page where users can change their Mashery email address.
			 */
			accountEmail: {
				heading: 'Change Email' // The heading
			},

			/**
			 * My Account: Email Success
			 * The layout for the page confirming email change was successful
			 */
			accountEmailSuccess: {
				heading: 'Email Successfully Changed', // the heading
				main: '<p>An email confirming your change has been sent to the address you provided with your username. Please check your spam folder if you don\'t see it in your inbox.</p>' // The main content
			},

			/**
			 * My Keys
			 * The page displaying a users API keys.
			 */
			accountKeys: {
				heading: 'My API Keys', // The heading
				noKeys: 'You don\'t have any keys yet.', // The message to display when a user has no keys
				noPlanKeys: 'You have not been issued keys for this API.', // The message to display when a user has no keys for a specific plan
			},

			/**
			 * My Account
			 * The page where users can manage their Mashery Account details.
			 */
			accountManage: {
				heading: 'Manage Account', // Heading
				subheading: 'Account Information' // The "Account Information" subheading
			},

			/**
			 * Account Navigation
			 * Labels for the account navigation menu
			 */
			accountNav: {
				// Navigation Labels
				keys: 'Keys', // The account nav label for "My Keys"
				apps: 'Applications', // The account nav label for "My Applications"
				account: 'Manage Account', // The account nav label for "Manage Account"
				changeEmail: 'Change Email', // The account nav label for "Change Email"
				changePassword: 'Change Password', // The account nav label for "Change Password"
				viewProfile: 'View My Public Profile', // The account nav label for "View My Profile"
				removeMembership: 'Remove Membership from {{mashery.area}}' // The account nav label for "Remove Membership"
			},

			/**
			 * My Account: Password
			 * The page where users can change their Mashery password.
			 */
			accountPassword: {
				heading: 'Change Password' // The heading
			},

			/**
			 * My Account: Password Success
			 * The layout for the page after users have successfully changed their password.
			 */
			accountPasswordSuccess: {
				heading: 'Password Successfully Changed', // The heading
				main: '<p>An email confirming your change has been sent to the address you provided with your username. If you use this account on other Mashery powered portals, remember to use your new password.</p>' // The main content
			},

			/**
			 * Add App APIs
			 * Add APIs to an application
			 */
			appAddAPIs: {
				heading: 'Add APIs to this Application',
				application: 'Application:',
				created: 'Created:',
				api: 'API:',
				key: 'Key:',
				subheading: 'Add APIs'
			},

			/**
			 * App Add APIs: Success
			 * API keys successfully added to an app
			 */
			appAddAPIsSuccess: {
				heading: 'New API Keys Issued', // The heading

				// The message
				main: '<p>An email has been sent to you with your key and application details. You can also view them at any time from the <a href="{{path.keys}}">My Account</a> page.</p>' +
				'<p>To get started using your API keys, dig into <a href="{{path.docs}}">our documentation</a>. We look forward to seeing what you create!</p>',
			},

			/**
			 * Delete App
			 * The page to delete an application
			 */
			appDelete: {
				heading: 'Delete Your Application',
				application: 'Application:',
				created: 'Created:',
				api: 'API:',
				key: 'Key:',
				subheading: 'Confirm Deletion',
				main: '<p><strong>Are you sure you want to delete this application and all of its keys?</strong></p>',
				confirm: 'Are you really sure you want to delete this application?'
			},

			/**
			 * App Edit
			 * The edit application page
			 */
			appEdit: {
				heading: 'Edit Your Application',
				main: '<p>Edit your details using the form below.</p>'
			},

			/**
			 * App Registration
			 * The page to register an application
			 */
			appRegister: {
				heading: 'Register an Application', // The heading
				main: '<p>Get a key and register your application using the form below to start working with our APIs.</p>' // The message shown above the form
			},

			/**
			 * App Registration Success
			 * The page shown after an app has been successfully registered.
			 */
			appRegisterSuccess: {
				heading: 'Your application was registered!', // The heading

				// The message
				main:	'<p>An email has been sent to you with your key and application details. You can also view them at any time from the <a href="{{path.keys}}">My Account</a> page.</p>' +
						'<p>To get started using your API keys, dig into <a href="{{path.docs}}">our documentation</a>. We look forward to seeing what you create!</p>',
			},

			/**
			 * Contact
			 * The contact form page
			 */
			contact: {
				heading: 'Contact Us', // The heading
				main: '<p>Contact us using the form below.</p>' // The message shown above the form
			},

			/**
			 * Contact Success
			 * The page shown after a contact form is successfully submitted.
			 */
			contactSuccess: {
				heading: 'Thanks for your submission!', // The heading
				main: 'Your message will be forwarded to the appropriate group.' // The message
			},

			/**
			 * Documentation
			 * The layout for API documentation.
			 */
			docs: {
				subheading: 'In the Docs'
			},

			/**
			 * 404
			 * The 404 page.
			 */
			fourOhFour: {
				heading: 'Unable to find this page', // The heading
				main: '<p>We\'re unable to find this page. Sorry! Please check the URL, or contact us to report a broken link.</p>' // The message
			},

			/**
			 * IO Docs
			 * The IO Docs page
			 */
			ioDocs: {
				heading: 'Interactive API', // The heading
				main: '<p>Test our API services with IO-Docs, our interactive API documentation.</p>' // The message displayed before the content
			},

			/**
			 * Join
			 * The page shown to existing Mashery users signing in to a new area.
			 */
			join: {
				heading: 'Join {{mashery.area}}', // The heading
				main: '<p>Since you already have a Mashery account you don\'t have to register again, but we would like to know a little more about you. Please fill out the additional information below.</p>' // The message shown above the form
			},

			/**
			 * Join: Success
			 * The page shown after an existing Mashery user successfully joins a new area.
			 */
			joinSuccess: {
				heading: 'Registration Successful', // The heading
				main: '<p>You have successfully registered as {{content.main}}. Read our <a href="/docs">API documentation</a> to get started. You can view your keys and applications under <a href="{{path.keys}}">My Account</a>.</p>' // The success message
			},

			/**
			 * Key Activity
			 * The page to view key activity reports
			 */
			keyActivity: {
				heading: 'Key Activity',
				api: '{{content.api}}',
				application: 'Application:',
				key: 'Key:',
				secret: 'Secret:',
				status: 'Status:',
				created: 'Created:'
			},

			/**
			 * Delete Key
			 * The page to delete an API key
			 */
			keyDelete: {
				heading: 'Delete Your Key',
				api: '{{content.api}}',
				application: 'Application:',
				key: 'Key:',
				secret: 'Secret:',
				status: 'Status:',
				created: 'Created:',
				subheading: 'Confirm Deletion',
				main: '<p><strong>Are you sure you want to delete this key?</strong></p>',
				confirm: 'Are you really sure you want to delete this key?'
			},

			/**
			 * Logout Success
			 * The page shown after a user successfully logs out of the Portal.
			 */
			logout: {
				heading: 'Signed Out', // The heading
				main: 'You have successfully signed out. Come back soon!' // The message
			},

			/**
			 * Logout Fail
			 * The page shown when a logout was unsuccessful.
			 */
			logoutFail: {
				heading: 'Sign Out Failed', // The heading
				main: 'Your attempt to sign out failed. <a href="{{path.logout}}">Please try again.</a>' // The message
			},

			/**
			 * Lost Password Request
			 * The page to request a password reset.
			 */
			lostPassword: {
				heading: 'Recover Your Password', // The heading
				main: '<p>Enter the email address and username that you registered with and we will send you a link to reset your password.</p>' // The message shown above the form
			},

			/**
			 * Lost Password Reset
			 * The page shown after a password reset email is sent to the user.
			 */
			lostPasswordReset: {
				heading: 'Email Sent', // The heading
				main: 'An email has been sent to the address you provided. Click on the link in the e-mail to reset your password. Please check your spam folder if you don\'t see it in your inbox.' // The messsage
			},

			/**
			 * Lost Username Request
			 * The page to request a username recovery
			 */
			lostUsername: {
				heading: 'Recover Your Username', // The heading
				main: '<p>Enter the email address you used to register and we will send you an email with your username.</p>' // The message shown above the form
			},

			/**
			 * Lost Username Reset
			 * The page shown after a username reset email is sent to the user.
			 */
			lostUsernameReset: {
				heading: 'Email Sent', // The heading
				main: 'An email has been sent containing your username details. Please check your spam folder if you don\'t see it in your inbox.' // The message
			},

			/**
			 * Remove Membership
			 * The page for users to remove their membership from this Portal.
			 */
			memberRemove: {

				// Content
				heading: 'Remove membership from {{mashery.area}}', // The heading
				main: 'Removing membership disables your account and you will not be able to register again using the same username. All your keys will be deactivated.', // The message

				// Labels
				confirm: 'Remove Membership', // The "confirm remove membership" button label
				cancel: 'Cancel', // The "cancel removal" button label
				popup: 'Please confirm that you wish to permanently disable your membership with this service.' // The message to display on the "confirm removal" popup modal

			},

			/**
			 * Remove Membership Success
			 * The page shown after a user successfully removes their membership.
			 */
			memberRemoveSuccess: {
				heading: 'Your account has been removed.', // The heading
				main: 'Enjoy the rest of your day!' // The message
			},

			/**
			 * No Access
			 * The page shown when user doesn't have access to the content
			 */
			noAccess: {
				heading: 'You don\'t have access to this content', // The heading
				main: '<p>If you\'re not logged in yet, try <a href="{{path.signin}}">logging in</a> or <a href="{{path.register}}">registering for an account</a>.</p>' // The message
			},

			/**
			 * Primary Navigation Menu
			 */
			primaryNav: {
				toggle: 'Menu'
			},

			/**
			 * User Profile
			 * The user profile page
			 */
			profile: {

				// Headings
				heading: '{{mashery.username}}', // The primary heading
				headingUserInfo: 'User Information', // The "User Information" subheading
				headingActivity: 'Recent Activity', // The "User Activity" subheading

				// Content
				userWebsite: 'Website:', // The user website label
				userBlog: 'Blog:', // The user blog label
				userRegistered: 'Registered:' // The label for the date the user registered

			},

			/**
			 * User Registration
			 * The user registration page.
			 */
			register: {

				// Primary Content
				heading: 'Register for an Account', // The heading
				main: '<p>Register a new Mashery ID to access {{mashery.area}}.</p>', // The message above the form
				privacyPolicy: '', // A custom privacy policy link or message [optional]

				// The sidebar content
				sidebar:	'<h2>No Spam Guarantee</h2>' +
							'<p>We hate spam. We love our users. We promise to never sell or share any of your private information.</p>',

				// Labels
				submit: 'Register' // The submit button text @todo: does not work yet
			},

			/**
			 * User Registration: Email Sent
			 * The registration email confirmation page.
			 */
			registerSent: {
				heading: 'Registration Almost Complete' // The heading
			},

			/**
			 * User Registration: Email Resend
			 * The page to request a new registration confirmation email.
			 */
			registerResend: {
				heading: 'Resend Your Confirmation Email', // The heading
				main: '<p>Enter your username and email address to have your registration confirmation email resent to you.</p>' // The message above the form
			},

			/**
			 * User Registration: Email Resent
			 * The page after a registration confirmation email was successfully resent.
			 */
			registerResendSuccess: {
				heading: 'Success', // The heading
				main: 'Your confirmation email was resent.' // The message
			},

			/**
			 * Search
			 * Search form and results content.
			 */
			search: {

				// Search form
				button: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><title>Search</title><path d="M31.008 27.231l-7.58-6.447c-.784-.705-1.622-1.029-2.299-.998a11.954 11.954 0 0 0 2.87-7.787c0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12c2.972 0 5.691-1.081 7.787-2.87-.031.677.293 1.515.998 2.299l6.447 7.58c1.104 1.226 2.907 1.33 4.007.23s.997-2.903-.23-4.007zM12 20a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"/></svg>', // The search for button text
				placeholder: 'Search...', // The search form placeholder attribute text

				// Search results
				heading: 'Search Results for "{{content.query}}"', // The search results page heading
				headingNew: 'Search',
				meta: 'Showing {{content.first}} to {{content.last}} of {{content.total}} results for "{{content.query}}"', // The meta data to show above search results
				noResults: 'Your search for "{{content.query}}" returned no results.', // The message to display when no results are found
				pagePrevious: '&larr; Previous Page', // The previous page link
				pageNext: 'Next Page &rarr;', // The next page link
				pageDivider: ' | ' // The divider between the previous and next page links
			},

			/**
			 * Reveal Key Secret
			 */
			showSecret: {
				heading: 'Email Sent',
				main: '<p>An email has been sent to the email address associated with your account. Click on the link in the email to display all of your shared secrets for 30 days. Please check your spam folder if you don\'t see it in your inbox.</p>'
			},

			/**
			 * Reveal Key Secret: Success
			 */
			showSecretSuccess: {
				heading: 'Your shared secrets are now visible',
				main: '<p>Shared secrets will be visible for the next 30 days. After 30 days, they will be hidden again for PCI compliance.</p>'
			},

			/**
			 * Reveal Key Secret: Already Visible
			 */
			showSecretError: {
				heading: 'Your shared secrets are already visible',
				main: '<p><a href="{{path.keys}}">Click here</a> to view them.</p>'
			},

			/**
			 * Sign In
			 * The sign in page.
			 */
			signin: {

				// Content
				heading: 'Sign In', // The heading
				main: '<p>Sign in to {{mashery.area}} using your Mashery ID.</p>', // The message above the sign in form

				// The sidebar content
				sidebar:	'<h2>Register</h2>' +
							'<p><a href="{{path.register}}">Create an account</a> to access stagingcs9.mashery.com. Your account information can then be used to access other APIs on the Mashery API Network.</p>' +

							'<h2>What is Mashery?</h2>' +
							'<p><a href="http://mashery.com">Mashery</a> powers APIs of leading brands in retail, media, business services, software, and more. By signing in to a Mashery powered portal, you can gain access to Mashery\'s base of API providers. All with a single Mashery ID.</p>' +

							'<p><a class="btn btn-user-register" id="btn-user-register" href="{{path.register}}">Register a Mashery ID</a></p>',

				// Labels
				submit: 'Sign In', // The submit button text @todo: does not work yet

			},

			/**
			 * Title Attribute
			 * Displayed in the web browser tab.
			 */
			title: '{{mashery.title}} | {{mashery.area}}',

			/**
			 * User Navigation
			 * The navigation menu where users sign in, register, view their account, and log out.
			 */
			userNav: {

				// Logged Out
				signin: 'Sign In', // "Sign In" link
				register: 'Register', // "Register" link

				// Logged In
				account: 'My Account', // "My Account" link
				dashboard: 'Dashboard', // "Dashboard" link (for admins only)
				signout: 'Sign Out', // "Sign Out" link

			}

		}

	};

	/**
	 * Paths
	 * Holds placeholders and URLs to various standard Portal pages
	 */
	var paths = {

		// My Apps
		'{{path.apps}}': function () {
			return '/apps/myapps';
		},

		// My Keys
		'{{path.keys}}': function () {
			return '/apps/mykeys';
		},

		// My Account
		'{{path.account}}': function () {
			return '/member/edit';
		},

		// Change My Email
		'{{path.changeEmail}}': function () {
			return '/member/email';
		},

		// Change My Password
		'{{path.changePassword}}': function () {
			return '/member/passwd';
		},

		// Contact
		'{{path.contact}}': function () {
			return '/contact';
		},

		// Dashboard
		'{{path.dashboard}}': function () {
			return (window.mashery.dashboard ? window.mashery.dashboard : '#');
		},

		// Documentation
		'{{path.docs}}': function () {
			return '/docs';
		},

		// IO Docs
		'{{path.iodocs}}': function () {
			return '/io-docs';
		},

		// Logout
		'{{path.logout}}': function () {
			return '/logout/logout';
		},

		// Password Request
		'{{path.lostPassword}}': function () {
			return '/member/lost';
		},

		// Username Request
		'{{path.lostUsername}}': function () {
			return '/member/lost-username';
		},

		// Trigger Remove Member
		// Special link that submits the remove member form
		'{{path.removeMember}}': function () {
			return '/member/remove?action=removeMember';
		},

		// User Registration
		'{{path.register}}': function () {
			return '/member/register';
		},

		// User Registration Resent
		'{{path.registerResendConfirmation}}': function () {
			return '/member/resend-confirmation';
		},

		// Remove Membership
		'{{path.removeMembership}}': function () {
			return '/member/remove';
		},

		// Search Results
		'{{path.search}}': function () {
			return '/search';
		},

		// Sign In
		'{{path.signin}}': function () {
			return window.mashery.login.url + window.mashery.login.redirect;
		},

		// View My Profile
		'{{path.viewProfile}}': function () {
			return (window.mashery.userProfile ? window.mashery.userProfile : '/profile/profile');
		}

	};

	/**
	 * Local Placeholders
	 * Holds placeholders specific to certain pages
	 */
	var localPlaceholders = {

		// My apps page
		accountApps: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.accountApps.heading;
			},

			// No Apps Content
			'{{content.noApps}}': function () {
				return settings.labels.accountApps.noApps;
			}

		},

		// Change email page
		accountEmail: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.accountEmail.heading;
			}

		},

		// Email successfully changed
		accountEmailSuccess: {

			// The heading
			'{{content.heading}}': function () {
				return settings.labels.accountEmailSuccess.heading;
			},

			// The main content
			'{{content.main}}': function () {
				return settings.labels.accountEmailSuccess.main;
			}

		},

		// User API Keys
		accountKeys: {

			// The heading
			'{{content.heading}}': function () {
				return settings.labels.accountKeys.heading;
			},

			// No Keys Content
			'{{content.noKeys}}': function () {
				return settings.labels.accountKeys.noKeys;
			},

			// No Keys for Plan Content
			'{{content.noPlanKeys}}': function () {
				return settings.labels.accountKeys.noPlanKeys;
			}

		},

		// The My Account Page
		accountManage: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.accountManage.heading;
			},

			// Subheading
			'{{content.subheading}}': function () {
				return settings.labels.accountManage.subheading;
			}

		},

		// Change password page
		accountPassword: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.accountPassword.heading;
			}

		},

		// Change password success page
		accountPasswordSuccess: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.accountPasswordSuccess.heading;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.accountPasswordSuccess.main;
			}

		},

		// Account pages
		account: {

			// My Account Nav Label
			'{{content.account}}': function () {
				return settings.labels.account.account;
			},

			// My Apps Nav Label
			'{{content.apps}}': function () {
				return settings.labels.account.apps;
			},

			// My Account Heading
			'{{content.headingAccount}}': function () {
				return settings.labels.account.headingAccount;
			},

			// My Account Info Subheading
			'{{content.headingAccountInfo}}': function () {
				return settings.labels.account.headingAccountInfo;
			},

			// Change My Email Heading
			'{{content.headingChangeEmail}}': function () {
				return settings.labels.account.headingChangeEmail;
			},

			// Change My Email Success Heading
			'{{content.headingChangeEmailSuccess}}': function () {
				return settings.labels.account.headingChangeEmailSuccess;
			},

			// Change My Password Heading
			'{{content.headingChangePassword}}': function () {
				return settings.labels.account.headingChangePassword;
			},

			// Change My Password Success Heading
			'{{content.headingChangePasswordSuccess}}': function () {
				return settings.labels.account.headingChangePasswordSuccess;
			},

			// My Keys Heading
			'{{content.headingMyApiKeys}}': function () {
				return settings.labels.account.headingMyApiKeys;
			},

			// My Apps Heading
			'{{content.headingMyApps}}': function () {
				return settings.labels.account.headingMyApps;
			},

			// My Keys Nav Label
			'{{content.keys}}': function () {
				return settings.labels.account.keys;
			},

			// No Applications Message
			'{{content.noApps}}': function () {
				return settings.labels.account.noApps;
			},

			// No Keys Message
			'{{content.noKeys}}': function () {
				return settings.labels.account.noKeys;
			},

			// No Keys for Specific Plan Message
			'{{content.noPlanKeys}}': function () {
				return settings.labels.account.noPlanKeys;
			},

			// Email successfully changed message
			'{{content.emailChanged}}': function () {
				return settings.labels.account.emailChanged;
			},

			// Password successfully changed message
			'{{content.passwordChanged}}': function () {
				return settings.labels.account.passwordChanged;
			}

		},

		// Add App API pages
		appAddAPIs: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.appAddAPIs.heading;
			},

			// Application label
			'{{content.applicationLabel}}': function () {
				return settings.labels.appAddAPIs.application;
			},

			// Created on label
			'{{content.createdLabel}}': function () {
				return settings.labels.appAddAPIs.created;
			},

			// API label
			'{{content.apiLabel}}': function () {
				return settings.labels.appAddAPIs.api;
			},

			// Key label
			'{{content.keyLabel}}': function () {
				return settings.labels.appAddAPIs.key;
			},

			// Subheading
			'{{content.subheading}}': function () {
				return settings.labels.appAddAPIs.subheading;
			}
		},

		// App Add APIs Success
		appAddAPIsSuccess: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.appAddAPIsSuccess.heading;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.appAddAPIsSuccess.main;
			}

		},

		// Delete application pages
		appDelete: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.appDelete.heading;
			},

			// Application Label
			'{{content.applicationLabel}}': function () {
				return settings.labels.appDelete.application;
			},

			// Created On Label
			'{{content.createdLabel}}': function () {
				return settings.labels.appDelete.created;
			},

			// API Label
			'{{content.apiLabel}}': function () {
				return settings.labels.appDelete.api;
			},

			// Key Label
			'{{content.keyLabel}}': function () {
				return settings.labels.appDelete.key;
			},

			// Subheading
			'{{content.subheading}}': function () {
				return settings.labels.appDelete.subheading;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.appDelete.main;
			}

		},

		// Edit App Pages
		appEdit: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.appEdit.heading;
			},

			// Body Text
			'{{content.main}}': function () {
				return settings.labels.appEdit.main;
			}

		},

		// App Registration
		appRegister: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.appRegister.heading;
			},

			// Body content
			'{{content.main}}': function () {
				return settings.labels.appRegister.main;
			}

		},

		// App Registration Success
		appRegisterSuccess: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.appRegisterSuccess.heading;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.appRegisterSuccess.main;
			}

		},

		// Contact
		contact: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.contact.heading;
			},

			// Subheading
			'{{content.main}}': function () {
				return settings.labels.contact.main;
			}

		},

		// Contact Success
		contactSuccess: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.contactSuccess.heading;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.contactSuccess.main;
			}

		},

		// Docs
		docs: {

			// Subnav heading
			'{{content.subheading}}': function () {
				return settings.labels.docs.subheading;
			}

		},

		// 404 Page
		fourOhFour: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.fourOhFour.heading;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.fourOhFour.main;
			}

		},

		// IO Docs
		ioDocs: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.ioDocs.heading;
			},

			// Subheading
			'{{content.main}}': function () {
				return settings.labels.ioDocs.main;
			}

		},

		// Join Area for Existing Mashery Users
		join: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.join.heading;
			},

			// Subheading
			'{{content.main}}': function () {
				return settings.labels.join.main;
			}

		},

		// Join Successful
		joinSuccess: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.joinSuccess.heading;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.joinSuccess.main;
			}

		},

		// Key Activity Page
		keyActivity: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.keyActivity.heading;
			},

			// API Subheading
			'{{content.subheadingAPI}}': function () {
				return settings.labels.keyActivity.api;
			},

			// API
			'{{content.api}}': function () {
				return window.mashery.content.secondary.api;
			},

			// App Label
			'{{content.applicationLabel}}': function () {
				return settings.labels.keyActivity.application;
			},

			// Key Label
			'{{content.keyLabel}}': function () {
				return settings.labels.keyActivity.key;
			},

			// Secret Label
			'{{content.secretLabel}}': function () {
				return settings.labels.keyActivity.secret;
			},

			// Status Label
			'{{content.statusLabel}}': function () {
				return settings.labels.keyActivity.status;
			},

			// Created Label
			'{{content.createdLabel}}': function () {
				return settings.labels.keyActivity.created;
			},

			// Confirm Subheading
			'{{content.limits}}': function () {
				return window.mashery.content.secondary.limits;
			}

		},

		// Delete Key Page
		keyDelete: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.keyDelete.heading;
			},

			// API Subheading
			'{{content.subheadingAPI}}': function () {
				return settings.labels.keyDelete.api;
			},

			// API
			'{{content.api}}': function () {
				return window.mashery.content.secondary.api;
			},

			// App Label
			'{{content.applicationLabel}}': function () {
				return settings.labels.keyDelete.application;
			},

			// Key Label
			'{{content.keyLabel}}': function () {
				return settings.labels.keyDelete.key;
			},

			// Secret Label
			'{{content.secretLabel}}': function () {
				return settings.labels.keyDelete.secret;
			},

			// Status Label
			'{{content.statusLabel}}': function () {
				return settings.labels.keyDelete.status;
			},

			// Created Label
			'{{content.createdLabel}}': function () {
				return settings.labels.keyDelete.created;
			},

			// Confirm Subheading
			'{{content.subheadingConfirm}}': function () {
				return settings.labels.keyDelete.confirm;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.keyDelete.main;
			}

		},

		// The layout
		layout: {

			// Footer 1
			'{{layout.footer1}}': function () {
				return '<div id="footer-1-wrapper"></div>';
			},

			// Footer 2
			'{{layout.footer2}}': function () {
				return '<div id="footer-2-wrapper"></div>';
			},

			// Main Content
			'{{layout.main}}': function () {
				return '<!-- tabindex="-1" hack for skipnav link: https://code.google.com/p/chromium/issues/detail?id=37721 --><main class="tabindex" tabindex="-1" id="main-wrapper"></main>';
			},

			// Primary Nav
			'{{layout.navPrimary}}': function () {
				return '<nav id="nav-primary-wrapper"></nav>';
			},

			// Secondary Nav
			'{{layout.navSecondary}}': function () {
				return '<nav id="nav-secondary-wrapper"></nav>';
			},

			// User Nav
			'{{layout.navUser}}': function () {
				return '<nav id="nav-user-wrapper"></nav>';
			}

		},

		// Logout Successful
		logout: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.logout.heading;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.logout.main;
			}

		},

		// Logout Failed
		logoutFail: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.logoutFail.heading;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.logoutFail.main;
			}

		},

		// Lost Password Request
		lostPassword: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.lostPassword.heading;
			},

			// Subheading
			'{{content.main}}': function () {
				return settings.labels.lostPassword.main;
			}

		},

		// Lost Password Reset
		lostPasswordReset: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.lostPasswordReset.heading;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.lostPasswordReset.main;
			}

		},

		// Lost Username Request
		lostUsername: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.lostUsername.heading;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.lostUsername.main;
			}

		},

		// Lost Username Reset
		lostUsernameReset: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.lostUsernameReset.heading;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.lostUsernameReset.main;
			}

		},

		// Remove Membership
		memberRemove: {

			// Cancel Button Text
			'{{content.cancel}}': function () {
				return settings.labels.memberRemove.cancel;
			},

			// Confirm Button Text
			'{{content.confirm}}': function () {
				return settings.labels.memberRemove.confirm;
			},

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.memberRemove.heading;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.memberRemove.main;
			},

			// Pop Up Confirmation Text
			'{{content.popup}}': function () {
				return settings.labels.memberRemove.popup;
			}

		},

		// Member Successfully Removed
		memberRemoveSuccess: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.memberRemoveSuccess.heading;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.memberRemoveSuccess.main;
			}

		},

		// No Access to this Content
		noAccess: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.noAccess.heading;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.noAccess.main;
			}

		},

		// Primary Navigation Menu
		primaryNav: {

			// Menu toggle for smaller screens
			'{{content.menuToggle}}': function () {
				return settings.labels.primaryNav.toggle;
			}

		},

		// User Profiles
		profile: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.profile.heading;
			},

			// User Info Subheading
			'{{content.headingUserInfo}}': function () {
				return settings.labels.profile.headingUserInfo;
			},

			// User Activity Subheading
			'{{content.headingActivity}}': function () {
				return settings.labels.profile.headingActivity;
			},

			// User Website Label
			'{{content.userWebsite}}': function () {
				return settings.labels.profile.userWebsite;
			},

			// User Blog Label
			'{{content.userBlog}}': function () {
				return settings.labels.profile.userBlog;
			},

			// User Registration Date Label
			'{{content.userRegistered}}': function () {
				return settings.labels.profile.userRegistered;
			}

		},

		// User Registration
		register: {

			// About/Sidebar Content
			'{{content.about}}': function () {
				return settings.labels.register.sidebar;
			},

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.register.heading;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.register.main;
			}

		},

		// Registration Confirmation
		registerSent: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.registerSent.heading;
			}

		},

		// Resend Registration Confirmation
		registerResend: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.registerResend.heading;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.registerResend.main;
			}

		},

		// Registration Confirmation Successfully Resent
		registerResendSuccess: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.registerResendSuccess.heading;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.registerResendSuccess.main;
			}

		},

		// Search Form and Results
		search: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.search.heading;
			},

			// Heading: New Search
			'{{content.headingNew}}': function () {
				return settings.labels.search.headingNew;
			},

			// Meta Info
			'{{content.meta}}': function () {
				return settings.labels.search.meta;
			},

			// No Results Found Message
			'{{content.noResults}}': function () {
				return settings.labels.search.noResults;
			},

			// The Search Query
			'{{content.query}}': function () {
				return window.mashery.content.secondary.query;
			},

			// The Start of the Displayed Result Range (X of Y out of Z)
			'{{content.first}}': function () {
				return window.mashery.content.secondary.first;
			},

			// The End of the Displayed Result Range (X of Y out of Z)
			'{{content.last}}': function () {
				return window.mashery.content.secondary.last;
			},

			// The Total Number of Results
			'{{content.total}}': function () {
				return window.mashery.content.secondary.total;
			},

			// Previous Page Link Text
			'{{content.pagePrevious}}': function () {
				return settings.labels.search.pagePrevious;
			},

			// Next Page Link Text
			'{{content.pageNext}}': function () {
				return settings.labels.search.pageNext;
			},

			// Divider Between Previous and Next Links
			'{{content.pageDivider}}': function () {
				return settings.labels.search.pageDivider;
			}

		},

		// Show Secret
		showSecret: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.showSecret.heading;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.showSecret.main;
			}

		},

		// Show Secret: Success
		showSecretSuccess: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.showSecretSuccess.heading;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.showSecretSuccess.main;
			}

		},

		// Show Secret: Error
		showSecretError: {

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.showSecretError.heading;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.showSecretError.main;
			}

		},

		// Sign In
		signin: {

			// Sign In About Info/Sidebar
			'{{content.about}}': function () {
				return settings.labels.signin.sidebar;
			},

			// Heading
			'{{content.heading}}': function () {
				return settings.labels.signin.heading;
			},

			// Main Content
			'{{content.main}}': function () {
				return settings.labels.signin.main;
			}

		}

	};

	/**
	 * Global Placeholders
	 * Holds placeholders that can be used anywhere in the Portal.
	 */
	var globalPlaceholders = {

		// Portal/Area Name
		'{{mashery.area}}': function () {
			return window.mashery.area;
		},

		'{{content.heading}}': function () {
			return (window.mashery.content.heading ? window.mashery.content.heading : '');
		},

		// Main Content (if there's not one specific to the content type)
		'{{content.main}}': function () {
			if (['page', 'docs'].indexOf(window.mashery.contentType) === -1 || !settings.markdown || window.mashery.globals.noMarkdown) {
				return window.mashery.content.main;
			} else {
				return markdown.makeHtml(window.mashery.content.main.replace(/(&lt;.+)?&gt;/g, function($0, $1) {
					return $1 ? $0 : '>';
				}).trim());
			}
		},

		// Main Form (if there's not one specific to the content type)
		'{{content.form}}': function () {
			return window.mashery.content.main;
		},

		// Secondary Content (if there's not one specific to the content type)
		'{{content.secondary}}': function () {

			// If docs, add true current-page
			if (window.mashery.contentType === 'docs') {

				// Variables
				var nav = document.createElement('div');
				var url = cleanLink(location.protocol + '//' + location.host + location.pathname);
				nav.innerHTML = window.mashery.content.secondary;

				// Add class to links
				nav.querySelectorAll('li a').forEach(function (link) {

					// Get URL
					var href = cleanLink(link.getAttribute('href'));

					// If it's the docs landing page
					if (window.mashery.contentId === 'docs' && /\/docs\/read\/Home/.test(href)) {
						link.parentNode.classList.add(settings.currentPageClass);
						return;
					}

					// If the page matches the URL (without anchor tags)
					if (href === url) {
						link.parentNode.classList.add(settings.currentPageClass);
					}

				});

				// Update the content
				window.mashery.content.secondary = nav.innerHTML;

			}
			return window.mashery.content.secondary;
		},

		// Logo
		'{{content.logo}}': function () {
			return (settings.logo ? settings.logo : window.mashery.area);
		},

		// User Account Nav Items (<li><a> href="#"link</a></li> without a parent list wrapper)
		'{{content.navItemsAccount}}': function () {
			return getAccountNavItems();
		},

		// Mashery Account Nav Items (<li><a> href="#"link</a></li> without a parent list wrapper)
		'{{content.navItemsMasheryAccount}}': function () {
			return getMasheryAccountNavItems();
		},

		// Primary Nav Items (<li><a href="#">link</a></li> without a parent list wrapper)
		'{{content.navItemsPrimary}}': function () {
			return getNavItems(window.mashery.content.navPrimary);
		},

		// Secondary Nav Items (<li><a href="#">link</a></li> without a parent list wrapper)
		'{{content.navItemsSecondary}}': function () {

			// Variables
			var url = cleanLink(location.protocol + '//' + location.host + location.pathname);
			var nav = document.createElement('div');
			nav.innerHTML = getNavItems(window.mashery.content.navSecondary);

			// Add current page class to active link, if any
			nav.querySelectorAll('a').forEach(function (link) {
				if (cleanLink(link.href) === url) {
					link.parentNode.classList.add(settings.currentPageClass);
				}
			});

			return nav.innerHTML;

		},

		// User Nav Items (<li><a href="#">link</a></li> without a parent list wrapper)
		'{{content.navItemsUser}}': function () {
			return getUserNavItems();
		},

		// Mashery Made Logo
		'{{content.masheryMade}}': function () {
			return '<a id="mashery-made-logo" href="http://mashery.com"><img src="https://support.mashery.com/public/Mashery/images/masherymade.png"></a>';
		},

		// Registration Terms of Use
		'{{content.terms}}': function () {
			var text =
				'<div id="registration-terms-of-service">' +
				'<p>By clicking the "Register" button, I certify that I have read and agree to {{content.privacyPolicy}}the <a href="http://www.mashery.com/terms/">Mashery Terms of Service</a> and <a href="http://www.mashery.com/privacy/">Privacy Policy</a>.</p>' +
				'</div>';
			return text;
		},

		// Privacy Policy
		'{{content.privacyPolicy}}': function () {
			return settings.labels.register.privacyPolicy;
		},

		// Search Form
		'{{content.searchForm}}': function () {
			var template =
				'<form id="search-form" class="search-form" method="get" action="/search">' +
				'<input class="search-input" id="search-input" type="text" value="" placeholder="' + settings.labels.search.placeholder + '" name="q">' +
				'<button class="search-button" id="search-button" type="submit">' + settings.labels.search.button + '</button>' +
				'</form>';
			return template;
		},

		// Page Title
		'{{mashery.title}}': function () {
			var heading = document.querySelector('h1');
			return (heading ? heading.innerHTML.trim() : window.mashery.title.replace(window.mashery.area + ' - ', '').replace(window.mashery.area, ''));
		},

		// Current User's Username
		'{{mashery.username}}': function () {
			return window.mashery.username;
		}

	};


	//
	// Methods
	//

	/**
	 * Load a JS file asynchronously.
	 * @public
	 * @author @scottjehl, Filament Group, Inc.
	 * @license MIT
	 * @link https://github.com/filamentgroup/loadJS
	 * @param  {String}   src       URL of script to load.
	 * @param  {Function} callback  Callback to run on completion.
	 * @return {String}             The script URL.
	 */
	m$.loadJS = function (src, callback, reload) {
		var existing = document.querySelector('script[src*="' + src + '"]');
		if (existing) {
			if (!reload) {
				if (callback && typeof (callback) === 'function') {
					callback();
				}
				return;
			}
			existing.remove();
		}
		var ref = window.document.getElementsByTagName('script')[0];
		var script = window.document.createElement('script');
		script.src = src;
		script.async = true;
		ref.parentNode.insertBefore(script, ref);
		if (callback && typeof (callback) === 'function') {
			script.onload = callback;
		}
		return script;
	};

	/**
	 * Load a CSS file asynchronously
	 * @public
	 * @copyright @scottjehl, Filament Group, Inc.
	 * @license MIT
	 * @param {String} href    The URL for your CSS file
	 * @param {Node}   before  Element to use as a reference for injecting the <link> [optional]
	 * @param {String} media   Stylesheet media type [optional, defaults to 'all']
	 */
	m$.loadCSS = function (href, before, media) {
		// Bail if CSS file already exists
		if (document.querySelector('link[href*="' + href + '"]')) return;
		var ss = window.document.createElement("link");
		var ref = before || window.document.getElementsByTagName("script")[0];
		var sheets = window.document.styleSheets;
		ss.rel = "stylesheet";
		ss.href = href;
		// temporarily, set media to something non-matching to ensure it'll fetch without blocking render
		ss.media = "only x";
		// inject link
		ref.parentNode.insertBefore(ss, ref);
		// This function sets the link's media back to `all` so that the stylesheet applies once it loads
		// It is designed to poll until document.styleSheets includes the new sheet.
		function toggleMedia() {
			var defined;
			for (var i = 0; i < sheets.length; i++) {
				if (sheets[i].href && sheets[i].href.indexOf(href) > -1) {
					defined = true;
				}
			}
			if (defined) {
				ss.media = media || "all";
			}
			else {
				setTimeout(toggleMedia);
			}
		}
		toggleMedia();
		return ss;
	};

	/**
	 * Detect when CSS is loaded and run a callback
	 * @public
	 * @copyright 2017 Filament Group, Inc.
	 * @license MIT
	 * @param {Node}     ss        The stylesheet
	 * @param {Function} callback  The callback to run
	 */
	m$.onloadCSS = function (ss, callback) {
		var called;
		function newcb() {
			if (!called && callback) {
				called = true;
				callback.call(ss);
			}
		}
		if (ss.addEventListener) {
			ss.addEventListener("load", newcb);
		}
		if (ss.attachEvent) {
			ss.attachEvent("onload", newcb);
		}

		// This code is for browsers that don’t support onload
		// No support for onload (it'll bind but never fire):
		//	* Android 4.3 (Samsung Galaxy S4, Browserstack)
		//	* Android 4.2 Browser (Samsung Galaxy SIII Mini GT-I8200L)
		//	* Android 2.3 (Pantech Burst P9070)

		// Weak inference targets Android < 4.4
		if ("isApplicationInstalled" in navigator && "onloadcssdefined" in ss) {
			ss.onloadcssdefined(newcb);
		}
	};

	/**
	 * Sanitize a string for use as a class
	 * Regex pattern: http://stackoverflow.com/a/9635698/1293256
	 * @public
	 * @param {String} id      The string to convert into a class
	 * @param {String} prefix  A prefix to use before the class [optionals]
	 */
	m$.sanitizeClass = function (id, prefix) {
		if (!id) return '';
		prefix = prefix ? prefix + '-' : '';
		return prefix + id.toLowerCase().replace(/^[^a-z]+|[^\w:.-]+/g, '-').replace('read-', '').replace('home-', 'home').replace('-home', '');
	};

	/**
	 * Inject HTML elements into the <head>
	 * @public
	 * @param {String} type The HTML element type
	 * @param {Object} atts The attributes and values for the element
	 */
	m$.inject = function (type, atts) {

		// Variables
		var ref = window.document.getElementsByTagName('script')[0];
		var elem = document.createElement(type);

		// Loop through each attribute
		atts.forEach(function (value, key) {
			elem.setAttribute(key, value);
		});

		// Inject into the <head>
		ref.before(elem);

	};

	/**
	 * Merge two or more objects together.
	 * @public
	 * @param   {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
	 * @param   {Object}   objects  The objects to merge together
	 * @returns {Object}            Merged values of defaults and options
	 */
	m$.extend = function () {

		// Variables
		var extended = {};
		var i = 0;
		var length = arguments.length;

		// Merge the object into the extended object
		var merge = function (obj) {
			for (var prop in obj) {
				if (Object.prototype.hasOwnProperty.call(obj, prop)) {
					// If property is an object, merge properties
					if (Object.prototype.toString.call(obj[prop]) === '[object Object]') {
						extended[prop] = m$.extend(extended[prop], obj[prop]);
					} else {
						extended[prop] = obj[prop];
					}
				}
			}
		};

		// Loop through each object and conduct a merge
		for (; i < length; i++) {
			var obj = arguments[i];
			merge(obj);
		}

		return extended;

	};

	/**
	 * Reset global Portal options
	 * @public
	 */
	m$.resetOptions = function () {
		window.portalOptions = {
			templates: {},
			labels: {}
		};
	};

	/**
	 * Merge user options into Portal settings
	 * @public
	 * @param {Object} options  User options to merge into defaults
	 */
	m$.setOptions = function (options) {
		settings = m$.extend(defaults, options || {});
	};

	/**
	 * Emit a custom event
	 * @public
	 * @param {String} eventName  The name of the event to emit
	 * @param {Object} options    Options for the event
	 * @param {Node}   elem       The element to dispatch the event on [optional - defaults to window]
	 */
	m$.emitEvent = function (eventName, options, elem) {

		// Setup elem on which to dispatch event
		elem = elem ? elem : window;

		// Create a new event
		var event = new CustomEvent(eventName, options);

		// Dispatch the event
		elem.dispatchEvent(event);

	};

	/**
	 * Simulate a click event.
	 * @public
	 * @param {Element} elem  the element to simulate a click on
	 */
	var click = function (elem) {
		// Create our event (with options)
		var evt = new MouseEvent('click', {
			bubbles: true,
			cancelable: true,
			view: window
		});
		// If cancelled, don't dispatch our event
		var canceled = !elem.dispatchEvent(evt);
	};

	/**
	 * Replaces placeholders with real content
	 * @private
	 * @param {String} template The template string
	 * @param {String} local    A local placeholder to use, if any
	 */
	var replacePlaceholders = function (template, local) {

		// Check if the template is a string or a function
		template = typeof (template) === 'function' ? template() : template;

		// Replace local placeholders (if they exist)
		if (local) {
			if (localPlaceholders[local]) {
				localPlaceholders[local].forEach(function (content, placeholder) {
					template = template.replace(new RegExp(placeholder, 'g'), content);
				});
			}
		}

		// Replace paths
		paths.forEach(function (path, placeholder) {
			template = template.replace(new RegExp(placeholder, 'g'), path);
		});

		// Replace global placeholders
		globalPlaceholders.forEach(function (content, placeholder) {
			template = template.replace(new RegExp(placeholder, 'g'), content);
		});

		return template;

	};

	/**
	 * Remove garbage from a URL
	 * @param {String} link The URL to clean
	 */
	var cleanLink = function (link) {
		var url = link.replace('/read', '').replace('/home', '').replace(/#([^\\s]*)/g, '');
		if (url.slice(-1) === '/') {
			url = url.slice(0, -1);
		}
		return url;
	};

	/**
	 * Get the user navigation items
	 * @private
	 */
	var getUserNavItems = function () {

		var template;

		if (mashery.loggedIn) {

			// Check for current page
			var isAccount = ['accountKeys', 'accountApps', 'appRegister', 'appRegisterSuccess', 'appEdit', 'appAddAPIsSuccess', 'appAddAPIs', 'appDelete', 'appAddAPIsError', 'keyDelete', 'keyActivity', 'accountEmailSuccess', 'accountEmail', 'accountPasswordSuccess', 'accountPassword', 'memberRemove', 'showSecret', 'showSecretSuccess', 'showSecretError', 'accountManage'].indexOf(window.mashery.contentType) === -1 ? false : true;
			var isSignOut = ['logout', 'logoutFail'].indexOf(window.mashery.contentType) === -1 ? false : true;

			// @start here

			// If the user is logged in
			template =
				'<li id="nav-user-myaccount"' + (isAccount ? ' class="' + settings.currentPageClass + '"' : '') + '><a href="{{path.keys}}">' + settings.labels.userNav.account + '</a></li>' +
				(mashery.isAdmin ? '<li id="nav-user-dashboard"><a href="{{path.dashboard}}">' + settings.labels.userNav.dashboard + '</a></li>' : '') +
				'<li id="nav-user-signout"' + (isSignOut ? ' class="' + settings.currentPageClass + '"' : '') + '><a href="{{path.logout}}">' + settings.labels.userNav.signout + '</a></li>';

		} else {

			// Check for current page
			var isSignIn = window.mashery.contentType === 'signin' ? true : false;
			var isRegister = ['registerSent', 'register', 'registerResendSuccess', 'registerResend', 'joinSuccess', 'join'].indexOf(window.mashery.contentType) === -1 ? false : true;

			// If they're logged out
			template =
				'<li id="nav-user-signin"' + (isSignIn ? ' class="' + settings.currentPageClass + '"' : '') + '><a href="{{path.signin}}">' + settings.labels.userNav.signin + '</a></li>' +
				'<li id="nav-user-register"' + (isRegister ? ' class="' + settings.currentPageClass + '"' : '') + '><a href="{{path.register}}">' + settings.labels.userNav.register + '</a></li>';

		}

		return replacePlaceholders(template);
	};

	/**
	 * Get the account navigation items
	 * @private
	 */
	var getAccountNavItems = function () {

		// Get current page
		var isKeys = ['accountKeys', 'keyDelete', 'keyActivity', 'showSecret', 'showSecretSuccess', 'showSecretError'].indexOf(window.mashery.contentType) === -1 ? false : true;
		var isApps = ['accountApps', 'appRegister', 'appRegisterSuccess', 'appEdit', 'appAddAPIsSuccess', 'appAddAPIs', 'appDelete', 'appAddAPIsError'].indexOf(window.mashery.contentType) === -1 ? false : true;
		var isAccount = ['accountEmailSuccess', 'accountEmail', 'accountPasswordSuccess', 'accountPassword', 'memberRemoveSuccess', 'memberRemove', 'accountManage'].indexOf(window.mashery.contentType) === -1 ? false : true;

		// Create template
		var template =
			'<li' + (isKeys ? ' class="' + settings.currentPageClass + '"' : '') + '><a href="{{path.keys}}">' + settings.labels.accountNav.keys + '</a></li>' +
			'<li' + (isApps ? ' class="' + settings.currentPageClass + '"' : '') + '><a href="{{path.apps}}">' + settings.labels.accountNav.apps + '</a></li>' +
			'<li' + (isAccount ? ' class="' + settings.currentPageClass + '"' : '') + '><a href="{{path.account}}">' + settings.labels.accountNav.account + '</a></li>';

		return replacePlaceholders(template);

	};

	/**
	 * Get the Mashery account navigation items
	 * @private
	 */
	var getMasheryAccountNavItems = function () {

		// Get current page
		var isEmail = ['accountEmailSuccess', 'accountEmail'].indexOf(window.mashery.contentType) === -1 ? false : true;
		var isPassword = ['accountPasswordSuccess', 'accountPassword'].indexOf(window.mashery.contentType) === -1 ? false : true;
		var isRemove = ['memberRemoveSuccess', 'memberRemove'].indexOf(window.mashery.contentType) === -1 ? false : true;

		// Create template
		var template =
			'<li' + (isEmail ? ' class="' + settings.currentPageClass + '"' : '') + '><a href="{{path.changeEmail}}">' + settings.labels.accountNav.changeEmail + '</a></li>' +
			'<li' + (isPassword ? ' class="' + settings.currentPageClass + '"' : '') + '><a href="{{path.changePassword}}">' + settings.labels.accountNav.changePassword + '</a></li>' +
			'<li><a href="{{path.viewProfile}}">' + settings.labels.accountNav.viewProfile + '</a></li>' +
			'<li' + (isRemove ? ' class="' + settings.currentPageClass + '"' : '') + '><a href="{{path.removeMembership}}">' + settings.labels.accountNav.removeMembership + '</a></li>';

		return replacePlaceholders(template);

	};

	/**
	 * Convert an array of navigation items into a string
	 * @private
	 * @param {Array} items The navigation items
	 */
	var getNavItems = function (items) {
		var template = '';
		items.forEach(function (item) {
			template += '<li' + (item.isActive ? ' class="' + settings.currentPageClass + '"' : '') + '><a href="' + decodeURIComponent(item.url) + '">' + item.label + '</a></li>';
		});
		return template;
	};

	/**
	 * Render content in the Portal
	 * @private
	 * @param {String}  selector The selector for the element to render the content into
	 * @param {String}  key      The content type
	 * @param {String}  before   The name of the event to emit before rendering
	 * @param {String}  after    The name of the event to emit after rendering
	 */
	var render = function (selector, key, before, after) {

		// Get the content
		var content = document.querySelector(selector);
		if (!content) return;

		// Emit the before render event
		if (before) {
			m$.emitEvent(before);
		}

		// Render the content
		content.innerHTML = settings.templates[key] ? replacePlaceholders(settings.templates[key], key) : '';

		// If custom page or documentation, remove Mashery inserted junk
		if (['page','docs'].indexOf(window.mashery.contentType !== -1)) {
			var junk = document.querySelectorAll('#header-edit, #main .section .section-meta');
			junk.forEach(function (item) {
				item.remove();
			});
		}

		// Emit the after render event
		if (after) {
			m$.emitEvent(after);
		}

	};

	/**
	 * Verify that a user logged in.
	 * @private
	 * @bugfix Sometimes mashery variable provides wrong info at page load after logout event
	 */
	var verifyLoggedIn = function () {

		// Only run on logout and member remove pages
		if (['logout', 'memberRemoveSuccess'].indexOf(window.mashery.contentType) === -1) return;

		// Check if the a logout form exists (if so, user is logged in and we can bail)
		var loggedIn = window.mashery.dom.querySelector('#mashery-logout-form');
		if (loggedIn) return;

		// Update mashery object values
		window.mashery.loggedIn = false;
		window.mashery.username = null;
		window.mashery.isAdmin = false;
		window.mashery.dashboard = null;
		window.mashery.logout = null;

	};

	/**
	 * Render the header elements
	 * @private
	 * @param {Boolean} ajax  If true, skip rendering (since they already exist)
	 */
	var renderHead = function (ajax) {

		// Don't run on Ajax (content is already rendered)
		if (ajax) return;

		// Force latest rendering engine in IE
		m$.inject('meta', {
			'http-equiv': 'X-UA-Compatible',
			'content': 'IE=edge,chrome=1'
		});

		// Add a default viewport width
		if (settings.responsive) {
			m$.inject('meta', {
				name: 'viewport',
				content: 'width=device-width, initial-scale=1.0'
			});
		}

		// Add a favicon
		if (settings.favicon && settings.faviconURL) {
			m$.inject('link', {
				rel: 'shortcut icon',
				href: settings.faviconURL
			});

			m$.inject('link', {
				rel: 'icon',
				sizes: settings.faviconSizes,
				href: settings.faviconURL
			});
		}

	};

	/**
	 * Add class hooks for styling to the DOM, and a global JS variable for conditional functions
	 * @private
	 */
	var addStyleHooks = function () {

		// Get the app wrapper
		var wrapper = document.querySelector('#app-wrapper');
		if (!wrapper) return;

		// Get the current pathname (or 'home' if one doesn't exist)
		var path = ['/', '/home'].indexOf(window.location.pathname.toLowerCase()) === -1 ? window.location.pathname.slice(1) : 'home';

		// Add a class hook for the content type and current page
		wrapper.className = m$.sanitizeClass(window.mashery.contentType, 'category') + ' ' + m$.sanitizeClass(path, 'single');

		// Add a JavaScript hook for the current page
		window.mashery.contentId = m$.sanitizeClass(path);

	};

	/**
	 * Load user CSS and header JS files
	 * @private
	 */
	var loadHeaderFiles = function () {
		settings.loadCSS.forEach(function (css) {
			m$.loadCSS(css);
		});
		settings.loadJSHeader.forEach(function (js) {
			m$.loadJS(js);
		});
	};

	/**
	 * Load user footer JS files
	 * @private
	 */
	var loadFooterFiles = function () {

		// Run user scripts
		settings.loadJSFooter.forEach(function (js) {
			m$.loadJS(js);
		});

		// Run inline scripts if Ajax on custom pages and documentation
		if (!window.masheryIsAjax) return;
		if (['page', 'docs'].indexOf(window.mashery.contentType) === -1) return;
		window.mashery.scripts.forEach(function (script) {
			var func = new Function(script);
			func();
		});

	};

	/**
	 * Load IO Docs scripts if they're not already present
	 * @private
	 */
	var loadIODocsScripts = function () {

		// Inject base styles
		if (!document.querySelector('#iodocs-css')) {
			var style = document.createElement('style');
			style.id = 'iodocs-css';
			style.innerHTML = '.io-docs-hide{display:none!important;visibility:hidden!important}.endpoint h3.title,.method div.title{cursor:pointer}';
			document.querySelector('script').before(style);
		}

		// Invalidate old iodocs script
		window.iodocs = null;

		// Load IO Docs and initialize it
		m$.loadJS(filePaths.ioDocsJS, function () {
			ioDocs.init();
		});

	};

	/**
	 * Load required files for IODocs
	 * @private
	 */
	var loadRequiredFilesIODocs = function () {

		// If not IO Docs, bail
		if (window.mashery.contentType !== 'ioDocs') {
			if ('ioDocs' in window) {
				ioDocs.destroy();
			}
			return;
		}

		// Load IODocsScripts
		loadIODocsScripts();

	};

	/**
	 * Load required files for IODocs
	 * @private
	 */
	var loadRequiredFilesPasswords = function () {

		// Only run on pages with password requirement lists
		if (!document.querySelector('#passwd_requirements')) {
			if ('masheryTestPassword' in window) {
				masheryTestPassword.destroy();
			}
			return;
		}

		// Only run if passwordStrength is enabled
		if (!settings.passwordStrength) {
			// Remove indicator from the DOM
			document.querySelectorAll('#passwd_requirements, label[for="passwd_strength_indicator"]').forEach(function (indicator) {
				indicator.remove();
			});
			return;
		}

		// Initialize tests
		masheryTestPassword.init();

	};

	/**
	 * Load Mashtips functions
	 * @private
	 */
	var loadRequiredFilesMashtips = function () {

		// Only run on pages with Mashtips
		if (!document.querySelector('.mashtip')) {
			masheryMashtips.destroy();
			return;
		}

		// Only run if passwordStrength is enabled
		if (!settings.mashtips) return;

		// Initialize tests
		masheryMashtips.init();

	};

	var loadRequiredFilesReporting = function () {

		// Only run on reports page
		if (window.mashery.contentType !== 'keyActivity' || !Array.isArray(window.mashery.content.init)) return;

		// Load required JS files
		m$.loadJS(filePaths.googleJSAPI, function () {
			m$.loadJS(filePaths.underscore, function () {
				m$.loadJS(filePaths.defaultsJS, function () {
					m$.loadJS(filePaths.drillin, function () {
						m$.loadJS(filePaths.reports, function () {
							initCharts(window.mashery.content.init.index);
						});
					});
				});
			});
		});

	};

	/**
	 * Get the language class for an element
	 * @private
	 * @param {String} lang  The system-generated class for the code
	 */
	var getLangClass = function (lang) {

		var langClass = '';

		if (lang === 'bash') { langClass = 'lang-bash'; }
		if (lang === 'csharp') { langClass = 'lang-clike'; }
		if (lang === 'cpp') { langClass = 'lang-clike'; }
		if (lang === 'css') { langClass = 'lang-css'; }
		if (lang === 'java') { langClass = 'lang-java'; }
		if (lang === 'jscript') { langClass = 'lang-javascript'; }
		if (lang === 'php') { langClass = 'lang-php'; }
		if (lang === 'python') { langClass = 'lang-python'; }
		if (lang === 'ruby') { langClass = 'lang-ruby'; }
		if (lang === 'xml') { langClass = 'lang-markup'; }

		return langClass;

	};

	/**
	 * Add language classes to all pre elements
	 */
	var addCodeLanguage = function () {
		document.querySelectorAll('pre').forEach(function (pre) {
			var lang = /brush: (.*?);/.exec(pre.className);
			var code = pre.querySelector('code');
			if (!lang || !Array.isArray(lang) || lang.length < 2) return;
			var langClass = getLangClass(lang[1]);
			pre.classList.add(langClass);
			pre.className = pre.className.replace(/brush: (.*?);/, '');
			if (!code) {
				pre.innerHTML = '<code>' + pre.innerHTML + '</code>';
			}
		});
	};

	/**
	 * Load Prism.js syntax highlighting
	 * @private
	 */
	var loadPrism = function () {
		addCodeLanguage();
		m$.loadJS(filePaths.prism, function () {
			Prism.highlightAll();
		});
	};

	/**
	 * Load any Mashery files that are required for a page to work
	 * @private
	 */
	var loadRequiredFiles = function () {
		loadPrism(); // Load syntax highlighter
		loadRequiredFilesIODocs(); // Load required files for IO Docs
		loadRequiredFilesPasswords(); // Load required files for registration and password pages
		loadRequiredFilesReporting(); // Load key activity reporting scripts
		loadRequiredFilesMashtips(); // Load Mashtip functions for tooltips
	};

	/**
	 * Inject the logout form into the DOM
	 * @private
	 */
	var renderLogout = function () {
		if (!window.mashery.logout || document.querySelector('#mashery-logout-form')) return;
		document.body.insertBefore(window.mashery.logout, document.body.lastChild);
	};

	/**
	 * Inject the remove member form into the DOM on remove member page
	 * @private
	 */
	var renderMemberRemove = function () {

		// Only run on the member remove page
		if (window.mashery.contentType !== 'memberRemove' || document.querySelector('#member-remove-form')) return;

		// Get the form
		var form = window.mashery.dom.querySelector('.main form');
		if (!form) return;

		// Give it an ID and make it hidden
		form.id = 'member-remove-form';
		form.setAttribute('hidden', 'hidden');

		// Update the onclick popup text
		var submit = form.querySelector('#process');
		if (submit) {
			submit.setAttribute('onclick', 'return confirm("' + localPlaceholders.memberRemove['{{content.popup}}']() + '")');
		}

		// Inject it into the DOM
		document.body.lastChild.before(form);
	};

	/**
	 * Render the Mashery Made logo (if missing)
	 * @private
	 */
	var renderMasheryMade = function () {

		// Bail if Mashery Made logo is already in the DOM
		var masheryMade = document.querySelector('#mashery-made-logo');
		if (masheryMade) return;

		// Get the app container
		var app = document.querySelector('#app');
		if (!app) return;

		// Create our logo container and add the logo
		var mashMade = document.createElement('div');
		mashMade.innerHTML = '<p>x</p><div id="mashery-made"><div class="container"><p>' + globalPlaceholders['{{content.masheryMade}}']() + '</p></div></div>';

		// Inject into the DOM
		app.appendChild(mashMade.childNodes[1]);

	};

	/**
	 * Render the Mashery Terms of Use of registration pages (if missing)
	 * @private
	 */
	var renderTOS = function () {

		// Only run on Registration pages
		if (['register', 'join'].indexOf(window.mashery.contentType) === -1) return;

		// Bail if a Terms of Use already exists
		var tos = document.querySelector('#registration-terms-of-service');
		if (tos) return;

		// Bail if there's no registration form
		var reg = document.querySelector('form[action*="/member/register"]');
		if (!reg) return;

		// Create our terms of use
		var div = document.createElement('div');
		div.innerHTML = '<p>x</p>' + replacePlaceholders(globalPlaceholders['{{content.terms}}'](), 'register');

		// Inject into the DOM
		reg.appendChild(div.childNodes[1]);

	};

	/**
	 * Reload IO Docs to force script to reinit after DOM is available
	 * @private
	 */
	var reloadIODocs = function () {

		// Check if IO Docs has been reloaded yet
		if (window.mashery.contentType !== 'ioDocs' || window.masheryIsAjax || window.masheryIsReloaded) return;

		// Set reloaded state to true
		window.masheryIsReloaded = true;

		// Reload IO Docs
		fetchContent(window.location.href, true);

	};

	/**
	 * Update the delete app confirmation modal text with user settings
	 */
	var updateDeleteAppConfirmModal = function () {
		if (window.mashery.contentType !== 'appDelete') return;
		var process = document.querySelector('form #process');
		if (!process) return;
		process.setAttribute('onClick', 'return confirm(\'' + settings.labels.appDelete.confirm + '\')');
	};

	/**
	 * Update the delete key confirmation modal text with user settings
	 */
	var updateDeleteKeyConfirmModal = function () {
		if (window.mashery.contentType !== 'keyDelete') return;
		var process = document.querySelector('form #process');
		if (!process) return;
		process.setAttribute('onClick', 'return confirm(\'' + settings.labels.keyDelete.confirm + '\')');
	};

	/**
	 * Render the layout
	 * @private
	 */
	var renderLayout = function () {
		render('#app', 'layout', 'portalBeforeRenderLayout', 'portalAfterRenderLayout');
		verifyLoggedIn();
	};

	/**
	 * Render the title attribute
	 * @private
	 */
	var renderTitle = function () {
		document.title = replacePlaceholders(settings.labels.title, window.mashery.contentType);
	};

	/**
	 * Render the user navigation
	 * @private
	 */
	var renderUserNav = function () {
		render('#nav-user-wrapper', 'userNav', 'portalBeforeRenderUserNav', 'portalAfterRenderUserNav');
	};

	/**
	 * Render the primary navigation
	 * @private
	 */
	var renderPrimaryNav = function () {
		render('#nav-primary-wrapper', 'primaryNav', 'portalBeforeRenderPrimaryNav', 'portalAfterRenderPrimaryNav');
	};

	/**
	 * Render the secondary navigation
	 * @private
	 */
	var renderSecondaryNav = function () {
		render('#nav-secondary-wrapper', 'secondaryNav', 'portalBeforeRenderSecondaryNav', 'portalAfterRenderSecondaryNav');
	};

	/**
	 * Render the footer
	 * @private
	 */
	var renderFooter = function () {

		// Run the before render event
		m$.emitEvent('portalBeforeRenderFooter');

		// Render footers 1 and 2
		render('#footer-1-wrapper', 'footer1');
		render('#footer-2-wrapper', 'footer2');

		// Run the after render event
		m$.emitEvent('portalAfterRenderFooter');

	};

	/**
	 * Render the main content
	 * @private
	 */
	var renderMain = function () {
		render('#main-wrapper', window.mashery.contentType, 'portalBeforeRenderMain', 'portalAfterRenderMain');
	};

	/**
	 * Get an element's distance from the top of the page
	 * @private
	 * @param  {Node}   elem  The element to get the distance of
	 * @return {Number}       The element's distance from the top of the page
	 */
	var getOffsetTop = function (elem) {

		// Set our distance placeholder
		var distance = 0;

		// Loop up the DOM
		if (elem.offsetParent) {
			do {
				distance += elem.offsetTop;
				elem = elem.offsetParent;
			} while (elem);
		}

		// Return our distance
		return distance < 0 ? 0 : distance;
	};

	/**
	 * Jump to anchor or adjust focus when rendering is complete
	 * (Our JS rendering process breaks the normal browser behavior)
	 * @public
	 */
	m$.fixLocation = function () {
		if (window.location.hash) {
			var location = document.querySelector(window.location.hash);
			if (!location) return;
			location.focus();
			window.scrollTo(0, getOffsetTop(location));
		} else {
			document.querySelector('#app').focus();
			window.scrollTo(0, 0);
		}
	};

	/**
	 * Add required content and make required DOM updates
	 * @private
	 */
	var renderCleanup = function () {

		// Render hidden forms and required content
		loadRequiredFiles(); // Load required CSS/JS files into the DOM
		renderLogout(); // Logout Form
		renderMemberRemove(); // Remove Member Form
		renderMasheryMade(); // Add the Mashery Made logo if missing
		renderTOS(); // Add the Mashery Terms of Service if missing from registration page

		// Make updates to DOM content
		updateDeleteAppConfirmModal(); // Update the delete app confirmation modal
		updateDeleteKeyConfirmModal();  // Update the delete key confirmation modal

	};

	/**
	 * Render the Portal via Ajax
	 * @private
	 * @param {Object}  data      The page data
	 * @param {String}  url       The page URL
	 * @param {Boolean} pushState If true, update browser history
	 */
	var renderWithAjax = function (data, url, pushState) {

		// Update Mashery data
		setupMashery(data);

		// Update Ajax state
		window.masheryIsAjax = true;

		// Scrape content from the DOM object
		getContent(window.mashery.contentType);

		// Update the browser history
		if (pushState) {
			window.history.pushState({ url: url }, data.title, url);
		}

		// Render the Portal content
		m$.renderPortal(true);

	};

	/**
	 * Fetch page content with Ajax
	 * @private
	 * @param {String}  url        The page URL
	 * @param {Boolean} pushState  If true, update browser history
	 */
	var fetchContent = function (url, pushState) {

		// Run before Ajax event
		m$.emitEvent('portalBeforeRenderAjax');

		if (settings.ajaxLoading) {
			document.title = settings.ajaxLoading;
		}

		atomic.ajax({
			url: url,
			responseType: 'document'
		}).success(function (data) {

			// Render our content on Success
			renderWithAjax(data, url, pushState);

			// Run after Ajax event
			m$.emitEvent('portalAfterRenderAjax');

		}).error(function (data, xhr) {
			// If a 404, display 404 error
			if (xhr.status === 404) {

				renderWithAjax(data, url, pushState);

				// Run Ajax error event
				m$.emitEvent('portalAjaxError');

				return;

			}
			// Otherwise, force page reload
			window.location = url;
		});
	};

	/**
	 * Process link clicks and prepare for Ajax call
	 * @private
	 * @param {Event} event The click event
	 */
	var loadWithAjax = function (event) {

		// Make sure clicked element is a link
		var link = event.target.closest('a');
		if (!link) return;

		// Make sure Ajax is enabled and clicked object isn't on the ignore list
		if (!settings.ajax || (settings.ajaxIgnore && link.matches(settings.ajaxIgnore))) return;

		// Make sure clicked item was a valid, local link
		if (!link.href || link.hostname !== window.location.hostname) return;

		// Skip Ajax on member remove success page
		if (window.mashery.contentType === 'memberRemoveSuccess') return;

		// Don't run if link is an anchor to the current page
		if (link.pathname === window.location.pathname && (link.hash.length > 0 || /#/.test(link.href))) return;

		// Don't run if right-click or command/control + click
		if (event.button !== 0 || event.metaKey || event.ctrlKey) return;

		// Prevent the default click event
		event.preventDefault();

		// Get the content with Ajax
		fetchContent(link.href, true);

	};

	/**
	 * Process logout events
	 * @private
	 * @param {Event} event The click event
	 */
	var processLogout = function (event) {

		// Bail if there's no logout form
		var logout = document.querySelector('#mashery-logout-form');
		if (!logout) return;

		// Prevent the default click behavior
		event.preventDefault();

		// Submit the logout form
		logout.submit();

	};

	/**
	 * Process remove membership events
	 * @private
	 * @param {Event} event The click event
	 */
	var processMemberRemove = function (event) {

		// Get the remove member form
		var remove = document.querySelector('#member-remove-form #process');
		if (!remove || window.mashery.contentType !== 'memberRemove') return;

		// Prevent the default click event
		event.preventDefault();

		// Submit the remove member form
		click(remove);

	};

	/**
	 * Handle all page click events
	 * @private
	 * @param {Event} event The click event
	 */
	var clickHandler = function (event) {

		// Logout events
		if (event.target.closest('a[href*="' + paths['{{path.logout}}']() + '"]')) {
			processLogout(event);
			return;
		}

		// Member remove events
		if (event.target.closest('a[href*="' + paths['{{path.removeMember}}']() + '"]')) {
			processMemberRemove(event);
			return;
		}

		// Ajax
		loadWithAjax(event);

	};

	/**
	 * Handle popstate events and update page content
	 * @private
	 * @param {Event} event  The popstate event
	 */
	var popstateHandler = function (event) {
		var url = event.state && event.state.url ? event.state.url : window.location.href;
		fetchContent(url);
	};

	/**
	 * Handle for submit events
	 * Currently only used for Search form, but may be expanded in the future
	 * @private
	 * @param {Event} event  The form submit event
	 */
	var submitHandler = function (event) {

		// Bail if form isn't search or Ajax is disabled
		if (!event.target.closest('#search-form') || !settings.ajax) return;

		// Get search form input field
		var input = event.target.querySelector('#search-input');
		if (!input) return;

		// Prevent default form event
		event.preventDefault();

		// Fetch the search results page
		fetchContent(paths['{{path.search}}']() + '?q=' + encodeURIComponent(input.value), true);

	};

	/**
	 * Processes to run before rendering starts
	 * @private
	 */
	var beforeRenderHandler = function (event) {
		document.documentElement.classList.remove('loading'); // Remove loading class from the DOM
		document.documentElement.classList.remove('complete'); // Remove rendering class from the DOM
		document.documentElement.classList.add('rendering'); // Add rendering class to the DOM
		renderHead(event.detail.ajax); // <head> attributes
		loadHeaderFiles(); // Load user CSS and header JS files
		addStyleHooks(); // Content-specific classes
	};

	/**
	 * Processes to run after rendering is complete
	 * @private
	 */
	var afterRenderHandler = function () {
		loadFooterFiles(); // Load user footer JS files
		renderCleanup(); // Cleanup DOM
		m$.fixLocation(); // Jump to anchor or top of page
		document.documentElement.classList.remove('rendering'); // Remove rendering class from the DOM
		document.documentElement.classList.add('complete'); // Remove rendering class from the DOM
	};

	/**
	 * Render the Portal
	 * @public
	 * @param {Boolean} ajax  If true, the page is being loaded via Ajax
	 */
	m$.renderPortal = function (ajax) {
		m$.emitEvent('portalBeforeRender', {
			detail: {
				ajax: ajax
			}
		});  // Emit before render event
		renderLayout(); // Layout
		renderUserNav(); // User Navigation
		renderPrimaryNav(); // Primary Navigation
		renderSecondaryNav(); // Secondary Navigation
		renderMain(); // Main Content
		renderTitle(); // Page Title
		renderFooter(); // Footer
		m$.emitEvent('portalAfterRender', {
			detail: {
				ajax: ajax
			}
		});  // Emit after render event
	};

	/**
	* Initialize
	* @public
	* @param {object} options User options and overrides
	*/
	m$.init = function (options) {

		// Merge user options with defaults
		m$.setOptions(options);

		// Emit event before initializing
		m$.emitEvent('portalBeforeInit');

		// Setup markdown
		markdown = new showdown.Converter();
		markdown.setFlavor('github');

		// Add render event handlers
		window.addEventListener('portalBeforeRender', beforeRenderHandler, false);
		window.addEventListener('portalAfterRender', afterRenderHandler, false);

		// Render the Portal
		m$.renderPortal();

		// Setup Ajax variable
		window.masheryIsAjax = false;

		// Listen for click events
		document.addEventListener('click', clickHandler, false);

		// Listen for form submissions and popstate events on Ajax
		if (settings.ajax) {
			window.addEventListener('popstate', popstateHandler, false);
			window.addEventListener('submit', submitHandler, false);
		}

		// Emit event after initializing
		m$.emitEvent('portalAfterInit');

	};


	//
	// Public APIs
	//

	return m$;

})();