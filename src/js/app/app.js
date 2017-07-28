var loadPortal = (function () {

	'use strict';

	//
	// Variables
	//

	// Placeholder for public methods
	var exports = {};

	// Ignore on Ajax page load
	var ajaxIgnore = '.clear-results, h4 .select-all, #toggleEndpoints, #toggleMethods';

	// Setup internally global variables
	var settings, main, data;

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

		/**
		 * Logo
		 * Add a custom logo.
		 * Accepts any markup as a string (<img src>, <svg>, etc.)
		 */
		logo: null,

		/**
		 * Templates
		 * Customize the content and layout of anything in the Portal.
		 * Use a string for simple layouts.
		 * Use a function that returns a string for complex ones and conditional logic.
		 */
		templates: {

			/**
			 * Base layout
			 * The markup structure that all of the content will get loaded into.
			 */
			layout:	'<a class="screen-reader screen-reader-focusable" href="#main">Skip to content</a>' +
					'{{layout.navUser}}' +
					'{{layout.navPrimary}}' +
					'{{layout.main}}' +
					'<footer class="footer" id="footer">' +
						'{{layout.footer1}}' +
						'{{layout.navSecondary}}' +
						'{{layout.footer2}}' +
					'</footer>',

			/**
			 * User Navigation
			 * The navigation menu for sign in, registration, account, and logout links.
			 */
			userNav:	'<div class="nav-user container" id="nav-user">' +
							'<ul class="nav-user-list list-inline text-small text-muted padding-top-small padding-bottom-small no-margin-bottom text-right" id="nav-user-list">' +
								'{{content.navItemsUser}}' +
							'</ul>' +
						'</div>',

			/**
			 * Primary Navigation
			 * The primary navigation content for the Portal.
			 */
			primaryNav:	'<div class="nav-primary nav-wrap nav-collapse container padding-top-small padding-bottom-small" id="nav-primary">' +
							'<a id="logo" class="logo" href="/">{{content.logo}}</a>' +
							'<a role="button" class="nav-toggle" id="nav-primary-toggle" data-nav-toggle="#nav-primary-menu" href="#">Menu</a>' +
							'<div class="nav-menu" id="nav-primary-menu">' +
								'<ul class="nav" id="nav-primary-list">' +
									'{{content.navItemsPrimary}}' +
									'<li>{{content.searchForm}}</li>' +
								'</ul>' +
							'</div>' +
						'</div>',

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
			 * Custom Pages
			 * The layout for custom pages.
			 */
			page:	'<div class="main container" id="main">' +
						'{{content.main}}' +
					'</div>',

			/**
			 * Documentation
			 * The layout for API documentation.
			 * This page includes an automatically generated navigation menu.
			 */
			docs:	'<div class="main container" id="main">' +
						'<div class="row">' +
							'<div class="grid-two-thirds">{{content.main}}</div>' +
							'<div class="grid-third"><h2>In the Docs</h2><ul>{{content.secondary}}</ul></div>' +
						'</div>' +
					'</div>',

			/**
			 * Sign In
			 * The layout for the sign in page.
			 */
			signin:	'<div class="main container" id="main">' +
						'<div class="row">' +
							'<div class="grid-half">' +
								'<h1>{{content.heading}}</h1>' +
								'{{content.subheading}}' +
								'{{content.form}}' +
							'</div>' +
							'<div class="grid-half">' +
								'{{content.about}}' +
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
									'{{content.subheading}}' +
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
								'<p>{{content.subheading}}</p>' +
								'{{content.main}}' +
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
			 * Join
			 * The layout for existing Mashery users signing into an area for the first time.
			 * Mashery Terms of Use *must* be displayed on this page, and will be automatically injected if you omit them.
			 */
			join:	'<div class="main container container-small" id="main">' +
						'<h1>{{content.heading}}</h1>' +
						'<p>{{content.subheading}}</p>' +
						'{{content.main}}' +
						'{{content.terms}}' +
					'</div>',

			/**
			 * Join Success
			 * The layout for the page confirming that an existing Mashery user has joined a new area.
			 * @todo Convert the text into variables
			 */
			joinSuccess:	'<div class="main container container-small" id="main">' +
								'<h1>{{content.heading}}</h1>' +
								'<p>You have successfully registered as {{content.main}}. Read our <a href="/docs">API documentation</a> to get started. You can view your keys and applications under <a href="{{path.keys}}">My Account</a>.</p>' +
							'</div>',

			/**
			 * My Keys
			 * The layout for the page displaying a users API keys.
			 */
			accountKeys: function () {
				var template = 	'<h1>{{content.headingMyApiKeys}}</h1><ul id="nav-account">{{content.navItemsAccount}}</ul>';
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
									'<p><a class="btn btn-delete-key" id="btn-delete-key" href="' + key.delete + '">Delete This Key</a></p>';
							});
						} else {
							template += '<p>{{content.noPlanKeys}}</p>';
							if (mashery.content.secondary) {
								template += '<p><a class="btn btn-get-key" id="' + sanitizeClass(plan.name, 'btn-get-key') + '"  href="' + mashery.content.secondary + '">Get a Key for ' + plan.name + '</a></p>';
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
			 * My Apps
			 * The layout for the page displaying a users registered applications.
			 */
			accountApps: function () {
				var template = 	'<h1>{{content.headingMyApps}}</h1><ul id="nav-account">{{content.navItemsAccount}}</ul>';
				if (Object.keys(mashery.content.main).length > 0) {
					mashery.content.main.forEach(function (app) {
						template +=
							'<h2>' + app.application + '</h2>' +
							'<ul>' +
								'<li>API: ' + (app.api ? app.api : 'None') + '</li>' +
								'<li>Key: ' + (app.key ? app.key : 'None') + '</li>' +
								'<li>Created: ' + app.created + '</li>' +
							'</ul>' +
							'<p>' +
						'<a class="btn btn-edit-app" id="' + sanitizeClass(app.application, 'btn-edit-app') + '" href="' + app.edit + '">Edit This App</a>' +
						'<a class="btn btn-delete-app" id="' + sanitizeClass(app.application, 'btn-delete-app') + '" href="' + app.delete + '">Delete This App</a>' +
							'</p>';
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
			 * My Account
			 * The layout for the page where users can manage their Mashery Account details.
			 */
			accountManage:	'<div class="main container container-small" id="main">' +
								'<h1>{{content.headingAccount}}</h1>' +
								'<ul id="nav-account">{{content.navItemsAccount}}</ul>' +
								'<ul id="nav-mashery-account">{{content.navItemsMasheryAccount}}</ul>' +
								'<h2>{{content.headingAccountInfo}}</h2>' +
								'{{content.main}}' +
							'</div>',

			/**
			 * My Account: Email
			 * The layout for the page where users can change their Mashery email address.
			 */
			accountEmail:	'<div class="main container container-small" id="main">' +
								'<h1>{{content.headingChangeEmail}}</h1>' +
								'<ul id="nav-account">{{content.navItemsAccount}}</ul>' +
								'<ul id="nav-mashery-account">{{content.navItemsMasheryAccount}}</ul>' +
								'{{content.main}}' +
							'</div>',

			/**
			 * My Account: Password
			 * The layout for the page where users can change their Mashery password.
			 */
			accountPassword:	'<div class="main container container-small" id="main">' +
									'<h1>{{content.headingChangePassword}}</h1>' +
									'<ul id="nav-account">{{content.navItemsAccount}}</ul>' +
									'<ul id="nav-mashery-account">{{content.navItemsMasheryAccount}}</ul>' +
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
			 * IO Docs
			 * The layout for the IO Docs page.
			 */
			ioDocs:	'<div class="main container container-small" id="main">' +
						'<h1>{{content.heading}}</h1>' +
						'<p>{{content.subheading}}</p>' +
						'{{content.main}}' +
					'</div>',

			/**
			 * Lost Password Request
			 * The layout for the page where users can request their password be reset.
			 */
			lostPassword:	'<div class="main container container-small" id="main">' +
								'<h1>{{content.heading}}</h1>' +
								'<p>{{content.subheading}}</p>' +
								'{{content.main}}' +
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
								'<p>{{content.subheading}}</p>' +
								'{{content.main}}' +
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
			 * Search
			 * The layout for search results.
			 */
			search:	function () {
				var template = '<h1>{{content.heading}}</h1>';
				if (window.mashery.content.main) {
					template += '<p>{{content.meta}}</p>';
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
					template += '{{content.noResults}}';
				}

				return '<div class="main container container-small" id="main">' + template + '</div>';
			},

			/**
			 * Contact
			 * The layout for the contact page.
			 */
			contact:	'<div class="main container container-small" id="main">' +
							'<h1>{{content.heading}}</h1>' +
							'<p>{{content.subheading}}</p>' +
							'{{content.main}}' +
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
			 * App Registration
			 * The layout for the app registration page.
			 */
			appRegister:	'<div class="main container container-small" id="main">' +
									'<h1>{{content.heading}}</h1>' +
									'<p>{{content.subheading}}</p>' +
									'{{content.main}}' +
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
			 * Forum: All Topics
			 * The layout for the main forum page where all topics are listed.
			 * @todo Create this layout
			 */
			forumAll: '<div class="main container" id="main"><p>The forum content needs to get created.</p></div>',

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
			 * 404
			 * The layout for 404 pages.
			 */
			fourOhFour:	'<div class="main container container-small" id="main">' +
						'<h1>{{content.heading}}</h1>' +
						'{{content.main}}' +
					'</div>'
		},

		/**
		 * Labels & Blurbs
		 * Change headlines and messages without customizing the entire layout.
		 */
		labels: {

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
				signin: 'Sign In', // "Sign In" link
				register: 'Register', // "Register" link
				account: 'My Account', // "My Account" link
				dashboard: 'Dashboard', // "Dashboard" link (for admins only)
				signout: 'Sign Out', // "Sign Out" link
			},

			/**
			 * My Account
			 * All of the account pages, including Keys, Apps, Mashery Account, Change Email, Change Password, and Remove Membership
			 */
			account: {
				headingMyApiKeys: 'My API Keys', // The "My Keys" page heading
				headingMyApps: 'My Apps', // The "My Apps" page heading
				headingAccount: 'Manage Account', // The "Manage Account" page heading
				headingAccountInfo: 'Account Information', // The "Account Information" subheading on the "Manage Account" page
				headingChangeEmail: 'Change Email', // The "Change Email" page heading
				headingChangePassword: 'Change Password', // The "Change Password" page heading
				keys: 'Keys', // The account nav label for "My Keys"
				apps: 'Applications', // The account nav label for "My Applications"
				account: 'Manage Account', // The account nav label for "Manage Account"
				changeEmail: 'Change Email', // The account nav label for "Change Email"
				changePassword: 'Change Password', // The account nav label for "Change Password"
				viewProfile: 'View My Public Profile', // The account nav label for "View My Profile"
				removeMembership: 'Remove Membership from {{mashery.area}}', // The account nav label for "Remove Membership"
				noKeys: 'You don\'t have any keys yet.', // The message to display when a user has no keys
				noPlanKeys: 'You have not been issued keys for this API.', // The message to display when a user has no keys for a specific plan
				noApps: 'You don\'t have any apps yet.', // The message to display when a user has no apps
			},

			/**
			 * User Profile
			 * The user profile page
			 */
			profile: {
				heading: '{{mashery.username}}', // The primary heading
				headingUserInfo: 'User Information', // The "User Information" subheading
				headingActivity: 'Recent Activity', // The "User Activity" subheading
				userWebsite: 'Website:', // The user website label
				userBlog: 'Blog:', // The user blog label
				userRegistered: 'Registered:' // The label for the date the user registered
			},

			/**
			 * Sign In
			 * The sign in page.
			 */
			signin: {
				heading: 'Sign In', // The heading
				subheading: '<p>Sign in to {{mashery.area}} using your Mashery ID.</p>', // The message above the sign in form
				submit: 'Sign In', // The submit button text @todo: does not work yet

				// The sidebar content
				sidebar:	'<h2>Register</h2>' +
							'<p><a href="{{path.register}}">Create an account</a> to access stagingcs9.mashery.com. Your account information can then be used to access other APIs on the Mashery API Network.</p>' +

							'<h2>What is Mashery?</h2>' +
							'<p><a href="http://mashery.com">Mashery</a> powers APIs of leading brands in retail, media, business services, software, and more. By signing in to a Mashery powered portal, you can gain access to Mashery\'s base of API providers. All with a single Mashery ID.</p>' +

							'<p><a class="btn btn-user-register" id="btn-user-register" href="{{path.register}}">Register a Mashery ID</a></p>',
			},

			/**
			 * User Registration
			 * The user registration page.
			 */
			register: {
				heading: 'Register for an Account', // The heading
				subheading: '<p>Register a new Mashery ID to access {{mashery.area}}.</p>', // The message above the form
				submit: 'Register', // The submit button text @todo: does not work yet
				privacyPolicy: '', // A custom privacy policy link or message [optional]

				// The sidebar content
				sidebar:	'<h2>No Spam Guarantee</h2>' +
							'<p>We hate spam. We love our users. We promise to never sell or share any of your private information.</p>'
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
				subheading: 'Enter your username and email address to have your registration confirmation email resent to you.' // The message above the form
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
			 * Join
			 * The page shown to existing Mashery users signing in to a new area.
			 */
			join: {
				heading: 'Join {{mashery.area}}', // The heading
				subheading: 'Since you already have a Mashery account you don\'t have to register again, but we would like to know a little more about you. Please fill out the additional information below.' // The message shown above the form
			},

			/**
			 * Join: Success
			 * The page shown after an existing Mashery user successfully joins a new area.
			 */
			joinSuccess: {
				heading: 'Registration Successful' // The heading
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
			 * Remove Membership
			 * The page for users to remove their membership from this Portal.
			 */
			memberRemove: {
				heading: 'Remove membership from {{mashery.area}}', // The heading
				main: 'Removing membership disables your account and you will not be able to register again using the same username. All your keys will be deactivated.', // The message
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
			 * IO Docs
			 * The IO Docs page
			 */
			ioDocs: {
				heading: 'Interactive API', // The heading
				subheading: 'Test our API services with IO-Docs, our interactive API documentation.' // The message displayed before the content
			},

			/**
			 * Lost Password Request
			 * The page to request a password reset.
			 */
			lostPassword: {
				heading: 'Recover Your Password', // The heading
				subheading: 'Enter the email address and username that you registered with and we will send you a link to reset your password.' // The message shown above the form
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
				subheading: 'Enter the email address you used to register and we will send you an email with your username.' // The message shown above the form
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
			 * Search
			 * Search form and results content.
			 */
			search: {
				heading: 'Search Results for "{{content.query}}"', // The search results page heading
				placeholder: 'Search...', // The search form placeholder attribute text
				button: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><title>Search</title><path d="M31.008 27.231l-7.58-6.447c-.784-.705-1.622-1.029-2.299-.998a11.954 11.954 0 0 0 2.87-7.787c0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12c2.972 0 5.691-1.081 7.787-2.87-.031.677.293 1.515.998 2.299l6.447 7.58c1.104 1.226 2.907 1.33 4.007.23s.997-2.903-.23-4.007zM12 20a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"/></svg>', // The search for button text
				meta: 'Showing {{content.first}} to {{content.last}} of {{content.total}} results for "{{content.query}}"', // The meta data to show above search results
				noResults: 'Your search for "{{content.query}}" returned no results.', // The message to display when no results are found
				pagePrevious: '&larr; Previous Page', // The previous page link
				pageNext: 'Next Page &rarr;', // The next page link
				pageDivider: ' | ' // The divider between the previous and next page links
			},

			/**
			 * Contact
			 * The contact form page
			 */
			contact: {
				heading: 'Contact Us', // The heading
				subheading: 'Contact us using the form below.' // The message shown above the form
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
			 * App Registration
			 * The page to register an application
			 */
			appRegister: {
				heading: 'Register an Application', // The heading
				subheading: 'Get a key and register your application using the form below to start working with our APIs.' // The message shown above the form
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
			 * 404
			 * The 404 page.
			 */
			fourOhFour: {
				heading: 'Unable to find this page', // The heading
				main: '<p>We\'re unable to find this page. Sorry! Please check the URL, or contact us to report a broken link.</p>' // The message
			}

		},

		/**
		 * Callbacks
		 * These are functions that can be run before and after Portal rendering events.
		 * They allow you to hook into and extend the functionality of your Portal.
		 */
		callbacks: {
			beforeRender: function () {}, // Before any rendering begings
			afterRender: function () {}, // After all page rendering is complete
			beforeRenderLayout: function () {}, // Before the layout is rendered
			afterRenderLayout: function () {}, // After the layout is rendered
			beforeRenderUserNav: function () {}, // Before the user nav is rendered
			afterRenderUserNav: function () {}, // After the user nav is rendered
			beforeRenderPrimaryNav: function () {}, // Before the primary nav is rendered
			afterRenderPrimaryNav: function () {}, // After the primary nav is rendered
			beforeRenderMain: function () {}, // Before the main content is rendered
			afterRenderMain: function () {}, // After the main content is rendered
			beforeRenderSecondaryNav: function () {}, // Before the secondary nav is rendered
			afterRenderSecondaryNav: function () {}, // After the secondary nav is rendered
			beforeRenderFooter: function () {}, // Before the footer is rendered
			afterRenderFooter: function () {} // After the footer is rendered
		}

	};

	/**
	 * Paths
	 * Holds placeholders and URLs to various standard Portal pages
	 */
	var paths = {

		// Documentation
		docs: {
			placeholder: '{{path.docs}}',
			url: '/docs'
		},

		// Sign In
		signin: {
			placeholder: '{{path.signin}}',
			url: function () {
				// Get the URL dynamically since it varies based on configuration and includes a redirect back to the current page
				return window.mashery.login.url + window.mashery.login.redirect;
			},
		},

		// User Registration
		register: {
			placeholder: '{{path.register}}',
			url: '/member/register'
		},

		// User Registration Resent
		registerResendConfirmation: {
			placeholder: '{{path.registerResendConfirmation}}',
			url: '/member/resend-confirmation'
		},

		// My Account
		accountManage: {
			placeholder: '{{path.account}}',
			url: '/member/edit'
		},

		// My Apps
		accountApps: {
			placeholder: '{{path.apps}}',
			url: '/apps/myapps'
		},

		// My Keys
		accountKeys: {
			placeholder: '{{path.keys}}',
			url: '/apps/mykeys'
		},

		// Change My Email
		changeEmail: {
			placeholder: '{{path.changeEmail}}',
			url: '/member/email'
		},

		// Change My Password
		changePassword: {
			placeholder: '{{path.changePassword}}',
			url: '/member/passwd'
		},

		// View My Profile
		viewProfile: {
			placeholder: '{{path.viewProfile}}',
			url: function () {
				// Varies by user. Grabbed dynamically.
				return (window.mashery.userProfile ? window.mashery.userProfile : '/profile/profile');
			}
		},

		// Remove Membership
		removeMembership: {
			placeholder: '{{path.removeMembership}}',
			url: '/member/remove'
		},

		// Trigger Remove Member
		// Special link that submits the remove member form
		memberRemove: {
			placeholder: '{{path.removeMember}}',
			url: '/member/remove?action=removeMember'
		},

		// Dashboard
		dashboard: {
			placeholder: '{{path.dashboard}}',
			url: function () {
				// Grabbed dynamically
				return (window.mashery.dashboard ? window.mashery.dashboard : '#')
			}
		},

		// Logout
		logout: {
			placeholder: '{{path.logout}}',
			url: '/logout/logout'
		},

		// IO Docs
		ioDocs: {
			placeholder: '{{path.iodocs}}',
			url: '/io-docs'
		},

		// Contact
		contact: {
			placeholder: '{{path.contact}}',
			url: '/contact'
		},

		// Search Results
		search: {
			placeholder: '{{path.search}}',
			url: '/search'
		},

		// Password Request
		lostPassword: {
			placeholder: '{{path.lostPassword}}',
			url: '/member/lost'
		},

		// Username Request
		lostUsername: {
			placeholder: '{{path.lostUsername}}',
			url: '/member/lost-username'
		}
	};

	/**
	 * Local Placeholders
	 * Holds placeholders specific to certain pages
	 */
	var localPlaceholders = {
		// The layout
		layout: {

			// User Nav
			navUser: {
				placeholder: '{{layout.navUser}}',
				text: '<nav id="nav-user-wrapper"></nav>'
			},

			// Primary Nav
			navPrimary: {
				placeholder: '{{layout.navPrimary}}',
				text: '<nav id="nav-primary-wrapper"></nav>'
			},

			// Secondary Nav
			navSecondary: {
				placeholder: '{{layout.navSecondary}}',
				text: '<nav id="nav-secondary-wrapper"></nav>'
			},

			// Main Content
			main: {
				placeholder: '{{layout.main}}',
				text: '<!-- tabindex="-1" hack for skipnav link: https://code.google.com/p/chromium/issues/detail?id=37721 -->' + '<main class="tabindex" tabindex="-1" id="main-wrapper"></main>'
			},

			// Footer 1
			footer1: {
				placeholder: '{{layout.footer1}}',
				text: '<div id="footer-1-wrapper"></div>'
			},

			// Footer 2
			footer2: {
				placeholder: '{{layout.footer2}}',
				text: '<div id="footer-2-wrapper"></div>'
			}
		},

		// Sign In
		signin: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.signin.heading;
				}
			},

			// Subheading
			subheading: {
				placeholder: '{{content.subheading}}',
				text: function () {
					return settings.labels.signin.subheading;
				}
			},

			// Sign In Form
			form: {
				placeholder: '{{content.form}}',
				text: function () {
					return window.mashery.content.main;
				}
			},

			// Sign In About Info/Sidebar
			about: {
				placeholder: '{{content.about}}',
				text: function () {
					return settings.labels.signin.sidebar;
				}
			}
		},

		// User Registration
		register: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.register.heading;
				}
			},

			// Subheadin
			subheading: {
				placeholder: '{{content.subheading}}',
				text: function () {
					return settings.labels.register.subheading;
				}
			},

			// Form
			form: {
				placeholder: '{{content.form}}',
				text: function () {
					return window.mashery.content.main;
				}
			},

			// About/Sidebar Content
			about: {
				placeholder: '{{content.about}}',
				text: function () {
					return settings.labels.register.sidebar;
				}
			}

		},

		// Registration Confirmation
		registerSent: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.registerSent.heading;
				}
			}
		},

		// Resend Registration Confirmation
		registerResend: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.registerResend.heading;
				}
			},

			// Subheading
			subheading: {
				placeholder: '{{content.subheading}}',
				text: function () {
					return settings.labels.registerResend.subheading;
				}
			}
		},

		// Registration Confirmation Successfully Resent
		registerResendSuccess: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.registerResendSuccess.heading;
				}
			},

			// Main Content
			main: {
				placeholder: '{{content.main}}',
				text: function () {
					return settings.labels.registerResendSuccess.main;
				}
			}
		},

		// Join Area for Existing Mashery Users
		join: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.join.heading;
				}
			},

			// Subheading
			subheading: {
				placeholder: '{{content.subheading}}',
				text: function () {
					return settings.labels.join.subheading;
				}
			}
		},

		// Join Successful
		joinSuccess: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.joinSuccess.heading;
				}
			}
		},

		// Account pages
		account: {

			// My Keys Heading
			headingMyApiKeys: {
				placeholder: '{{content.headingMyApiKeys}}',
				text: function () {
					return settings.labels.account.headingMyApiKeys;
				}
			},

			// My Apps Heading
			headingMyApps: {
				placeholder: '{{content.headingMyApps}}',
				text: function () {
					return settings.labels.account.headingMyApps;
				}
			},

			// My Account Heading
			headingAccount: {
				placeholder: '{{content.headingAccount}}',
				text: function () {
					return settings.labels.account.headingAccount;
				}
			},

			// My Account Info Subheading
			headingAccountInfo: {
				placeholder: '{{content.headingAccountInfo}}',
				text: function () {
					return settings.labels.account.headingAccountInfo;
				}
			},

			// Change My Email Heading
			headingChangeEmail: {
				placeholder: '{{content.headingChangeEmail}}',
				text: function () {
					return settings.labels.account.headingChangeEmail;
				}
			},

			// Change My Password Heading
			headingChangePassword: {
				placeholder: '{{content.headingChangePassword}}',
				text: function () {
					return settings.labels.account.headingChangePassword;
				}
			},

			// My Keys Nav Label
			keys: {
				placeholder: '{{content.keys}}',
				text: function () {
					return settings.labels.account.keys;
				}
			},

			// My Apps Nav Label
			apps: {
				placeholder: '{{content.apps}}',
				text: function () {
					return settings.labels.account.apps;
				}
			},

			// My Account Nav Label
			account: {
				placeholder: '{{content.account}}',
				text: function () {
					return settings.labels.account.account;
				}
			},

			// No Keys Message
			noKeys: {
				placeholder: '{{content.noKeys}}',
				text: function () {
					return settings.labels.account.noKeys;
				}
			},

			// No Keys for Specific Plan Message
			noPlanKeys: {
				placeholder: '{{content.noPlanKeys}}',
				text: function () {
					return settings.labels.account.noPlanKeys;
				}
			},

			// No Applications Message
			noApps: {
				placeholder: '{{content.noApps}}',
				text: function () {
					return settings.labels.account.noApps;
				}
			}
		},

		// User Profiles
		profile: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.profile.heading;
				}
			},

			// User Info Subheading
			headingUserInfo: {
				placeholder: '{{content.headingUserInfo}}',
				text: function () {
					return settings.labels.profile.headingUserInfo;
				}
			},

			// User Activity Subheading
			headingActivity: {
				placeholder: '{{content.headingActivity}}',
				text: function () {
					return settings.labels.profile.headingActivity;
				}
			},

			// User Website Label
			userWebsite: {
				placeholder: '{{content.userWebsite}}',
				text: function () {
					return settings.labels.profile.userWebsite;
				}
			},

			// User Blog Label
			userBlog: {
				placeholder: '{{content.userBlog}}',
				text: function () {
					return settings.labels.profile.userBlog;
				}
			},

			// User Registration Date Label
			userRegistered: {
				placeholder: '{{content.userRegistered}}',
				text: function () {
					return settings.labels.profile.userRegistered;
				}
			},
		},

		// Logout Successful
		logout: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.logout.heading;
				}
			},

			// Main Content
			main: {
				placeholder: '{{content.main}}',
				text: function () {
					return settings.labels.logout.main;
				}
			}
		},

		// Logout Failed
		logoutFail: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.logoutFail.heading;
				}
			},

			// Main Content
			main: {
				placeholder: '{{content.main}}',
				text: function () {
					return settings.labels.logoutFail.main;
				}
			}
		},

		// Remove Membership
		memberRemove: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.memberRemove.heading;
				}
			},

			// Main Content
			main: {
				placeholder: '{{content.main}}',
				text: function () {
					return settings.labels.memberRemove.main;
				}
			},

			// Confirm Button Text
			confirm: {
				placeholder: '{{content.confirm}}',
				text: function () {
					return settings.labels.memberRemove.confirm;
				}
			},

			// Cancel Button Text
			cancel: {
				placeholder: '{{content.cancel}}',
				text: function () {
					return settings.labels.memberRemove.cancel;
				}
			},

			// Pop Up Confirmation Text
			popup: {
				placeholder: '{{content.popup}}',
				text: function () {
					return settings.labels.memberRemove.popup;
				}
			}
		},

		// Member Successfully Removed
		memberRemoveSuccess: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.memberRemoveSuccess.heading;
				}
			},

			// Main Content
			main: {
				placeholder: '{{content.main}}',
				text: function () {
					return settings.labels.memberRemoveSuccess.main;
				}
			}
		},

		// IO Docs
		ioDocs: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.ioDocs.heading;
				}
			},

			// Subheading
			subheading: {
				placeholder: '{{content.subheading}}',
				text: function () {
					return settings.labels.ioDocs.subheading;
				}
			}
		},

		// Lost Password Request
		lostPassword: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.lostPassword.heading;
				}
			},

			// Subheading
			subheading: {
				placeholder: '{{content.subheading}}',
				text: function () {
					return settings.labels.lostPassword.subheading;
				}
			}
		},

		// Lost Password Reset
		lostPasswordReset: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.lostPasswordReset.heading;
				}
			},

			// Main Content
			main: {
				placeholder: '{{content.main}}',
				text: function () {
					return settings.labels.lostPasswordReset.main;
				}
			}
		},

		// Lost Username Request
		lostUsername: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.lostUsername.heading;
				}
			},

			// Subheading
			subheading: {
				placeholder: '{{content.subheading}}',
				text: function () {
					return settings.labels.lostUsername.subheading;
				}
			}
		},

		// Lost Username Reset
		lostUsernameReset: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.lostUsernameReset.heading;
				}
			},

			// Main Content
			main: {
				placeholder: '{{content.main}}',
				text: function () {
					return settings.labels.lostUsernameReset.main;
				}
			}
		},

		// Search Form and Results
		search: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.search.heading;
				}
			},

			// Meta Info
			meta: {
				placeholder: '{{content.meta}}',
				text: function () {
					return settings.labels.search.meta;
				}
			},

			// No Results Found Message
			noResults: {
				placeholder: '{{content.noResults}}',
				text: function () {
					return settings.labels.search.noResults;
				}
			},

			// The Search Query
			query: {
				placeholder: '{{content.query}}',
				text: function () {
					return window.mashery.content.secondary.query;
				}
			},

			// The Start of the Displayed Result Range (X of Y out of Z)
			first: {
				placeholder: '{{content.first}}',
				text: function () {
					return window.mashery.content.secondary.first;
				}
			},

			// The End of the Displayed Result Range (X of Y out of Z)
			last: {
				placeholder: '{{content.last}}',
				text: function () {
					return window.mashery.content.secondary.last;
				}
			},

			// The Total Number of Results
			total: {
				placeholder: '{{content.total}}',
				text: function () {
					return window.mashery.content.secondary.total;
				}
			},

			// Previous Page Link Text
			pagePrevious: {
				placeholder: '{{content.pagePrevious}}',
				text: function () {
					return settings.labels.search.pagePrevious;
				}
			},

			// Next Page Link Text
			pageNext: {
				placeholder: '{{content.pageNext}}',
				text: function () {
					return settings.labels.search.pageNext;
				}
			},

			// Divider Between Previous and Next Links
			pageDivider: {
				placeholder: '{{content.pageDivider}}',
				text: function () {
					return settings.labels.search.pageDivider;
				}
			}
		},

		// Contact
		contact: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.contact.heading;
				}
			},

			// Subheading
			subheading: {
				placeholder: '{{content.subheading}}',
				text: function () {
					return settings.labels.contact.subheading;
				}
			}
		},

		// Contact Success
		contactSuccess: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.contactSuccess.heading;
				}
			},

			// Main Content
			main: {
				placeholder: '{{content.main}}',
				text: function () {
					return settings.labels.contactSuccess.main;
				}
			}
		},

		// App Registration
		appRegister: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.appRegister.heading;
				}
			},

			// Subheading
			subheading: {
				placeholder: '{{content.subheading}}',
				text: function () {
					return settings.labels.appRegister.subheading;
				}
			}
		},

		// App Registration Success
		appRegisterSuccess: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.appRegisterSuccess.heading;
				}
			},

			// Main Content
			main: {
				placeholder: '{{content.main}}',
				text: function () {
					return settings.labels.appRegisterSuccess.main;
				}
			}
		},

		// 404 Page
		fourOhFour: {

			// Heading
			heading: {
				placeholder: '{{content.heading}}',
				text: function () {
					return settings.labels.fourOhFour.heading;
				}
			},

			// Main Content
			main: {
				placeholder: '{{content.main}}',
				text: function () {
					return settings.labels.fourOhFour.main;
				}
			}
		}
	};

	/**
	 * Global Placeholders
	 * Holds placeholders that can be used anywhere in the Portal.
	 */
	var globalPlaceholders = {

		// Page Title
		title: {
			placeholder: '{{mashery.title}}',
			text: function () {
				var heading = document.querySelector('h1');
				return (heading ? heading.innerHTML.trim() : window.mashery.title.replace(window.mashery.area + ' - ', '').replace(window.mashery.area, ''));
			}
		},

		// Portal/Area Name
		area: {
			placeholder: '{{mashery.area}}',
			text: function () {
				return window.mashery.area;
			}
		},

		// Current User's Username
		username: {
			placeholder: '{{mashery.username}}',
			text: function () {
				return window.mashery.username;
			}
		},

		// Logo
		logo: {
			placeholder: '{{content.logo}}',
			text: function () {
				return settings.logo ? settings.logo : window.mashery.area;
			}
		},

		// User Nav Items (<li><a href="#">link</a></li> without a parent list wrapper)
		navItemsUser: {
			placeholder: '{{content.navItemsUser}}',
			text: function () {
				return getUserNavItems();
			}
		},

		// Primary Nav Items (<li><a href="#">link</a></li> without a parent list wrapper)
		navItemsPrimary: {
			placeholder: '{{content.navItemsPrimary}}',
			text: function () {
				return getNavItems(window.mashery.content.navPrimary);
			}
		},

		// Secondary Nav Items (<li><a href="#">link</a></li> without a parent list wrapper)
		navItemsSecondary: {
			placeholder: '{{content.navItemsSecondary}}',
			text: function () {
				return getNavItems(window.mashery.content.navSecondary);
			}
		},

		// User Account Nav Items (<li><a> href="#"link</a></li> without a parent list wrapper)
		navItemsAccount: {
			placeholder: '{{content.navItemsAccount}}',
			text: function () {
				return getAccountNavItems();
			}
		},

		// Mashery Account Nav Items (<li><a> href="#"link</a></li> without a parent list wrapper)
		navItemsMasheryAccount: {
			placeholder: '{{content.navItemsMasheryAccount}}',
			text: function () {
				return getMasheryAccountNavItems();
			}
		},

		// Main Content (if there's not one specific to the content type)
		contentMain: {
			placeholder: '{{content.main}}',
			text: function () {
				return window.mashery.content.main;
			}
		},

		// Secondary Content (if there's not one specific to the content type)
		contentSecondary: {
			placeholder: '{{content.secondary}}',
			text: function () {
				return window.mashery.content.secondary;
			}
		},

		// Search Form
		searchForm: {
			placeholder: '{{content.searchForm}}',
			text: function () {
				var template =
					'<form id="search-form" class="search-form" method="get" action="/search">' +
						'<input class="search-input" id="search-input" type="text" value="" placeholder="' + settings.labels.search.placeholder + '" name="q">' +
						'<button class="search-button" id="search-button" type="submit">' + settings.labels.search.button + '</button>' +
					'</form>';
				return template;
			}
		},

		// Registration Terms of Use
		registerTerms: {
			placeholder: '{{content.terms}}',
			text: function () {
				var text =
					'<div id="registration-terms-of-service">' +
						'<p>By clicking the "Register" button, I certify that I have read and agree to {{content.privacyPolicy}}the <a href="http://www.mashery.com/terms/">Mashery Terms of Service</a> and <a href="http://www.mashery.com/privacy/">Privacy Policy</a>.</p>' +
					'</div>';
				return text;
			}
		},

		// Privacy Policy
		privacyPolicy: {
			placeholder: '{{content.privacyPolicy}}',
			text: function () {
				return settings.labels.register.privacyPolicy;
			}
		},

		// Mashery Made Logo
		masheryMade: {
			placeholder: '{{content.masheryMade}}',
			text: '<a id="mashery-made-logo" href="http://mashery.com"><img src="https://support.mashery.com/public/Mashery/images/masherymade.png"></a>'
		}
	};


	//
	// Methods
	//

	/**
	* Merge two or more objects. Returns a new object.
	* Set the first argument to `true` for a deep or recursive merge
	* @private
	* @param   {Object} objects The objects to merge together
	* @returns {Object}         Merged values of defaults and options
	*/
	var extend = function () {

		// Variables
		var extended = {};
		var deep = false;
		var i = 0;
		var length = arguments.length;

		// Merge the object into the extended object
		var merge = function ( obj ) {
			for ( var prop in obj ) {
				if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
					// If deep merge and property is an object, merge properties
					if ( Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
						extended[prop] = extend( true, extended[prop], obj[prop] );
					} else {
						extended[prop] = obj[prop];
					}
				}
			}
		};

		// Loop through each object and conduct a merge
		for ( ; i < length; i++ ) {
			var obj = arguments[i];
			merge(obj);
		}

		return extended;

	};

	/**
	 * Simulate a click event.
	 * @public
	 * @param {Element} elem  the element to simulate a click on
	 */
	var simulateClick = function (elem) {
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
	 * @param {String} template The template string
	 * @param {String} local    A local placeholder to use, if any
	 */
	var replacePlaceholders = function (template, local) {
		template = Object.prototype.toString.call(template) === '[object Function]' ? template() : template;
		if (local) {
			var tempLocal = /account/.test(local) ? 'account' : local;
			if (localPlaceholders[tempLocal]) {
				localPlaceholders[tempLocal].forEach(function (placeholder) {
					if(!placeholder.placeholder || !placeholder.text) return;
					template = template.replace(new RegExp(placeholder.placeholder, 'g'), placeholder.text);
				});
			}
		}
		paths.forEach(function (path) {
			if (!path.placeholder || !path.url) return;
			template = template.replace(new RegExp(path.placeholder, 'g'), path.url);
		});
		globalPlaceholders.forEach(function (placeholder) {
			if (!placeholder.placeholder || !placeholder.text) return;
			template = template.replace(new RegExp(placeholder.placeholder, 'g'), placeholder.text);
		});
		return template;
	};

	/**
	 * Get the user navigation items
	 */
	var getUserNavItems = function () {
		var template;
		if (mashery.loggedIn) {
			template =
				'<li id="nav-user-myaccount"><a href="{{path.keys}}">' + settings.labels.userNav.account + '</a></li>' +
				(mashery.isAdmin ? '<li><a href="{{path.dashboard}}">' + settings.labels.userNav.dashboard + '</a></li>' : '') +
				'<li id="nav-user-signout"><a href="{{path.logout}}">' + settings.labels.userNav.signout + '</a></li>';
		} else {
			template =
				'<li id="nav-user-signin"><a href="{{path.signin}}">' + settings.labels.userNav.signin + '</a></li>' +
				'<li id="nav-user-register"><a href="{{path.register}}">' + settings.labels.userNav.register + '</a></li>';
		}
		return replacePlaceholders(template);
	};

	/**
	 * Get the account navigation items
	 */
	var getAccountNavItems = function () {
		var template =
			'<li><a href="{{path.keys}}">' + settings.labels.account.keys + '</a></li>' +
			'<li><a href="{{path.apps}}">' + settings.labels.account.apps + '</a></li>' +
			'<li><a href="{{path.account}}">' + settings.labels.account.account + '</a></li>';
		return replacePlaceholders(template);
	};

	/**
	 * Get the Mashery account navigation items
	 */
	var getMasheryAccountNavItems = function () {
		var template =
			'<li><a href="{{path.changeEmail}}">' + settings.labels.account.changeEmail + '</a></li>' +
			'<li><a href="{{path.changePassword}}">' + settings.labels.account.changePassword + '</a></li>' +
			'<li><a href="{{path.viewProfile}}">' + settings.labels.account.viewProfile + '</a></li>' +
			'<li><a href="{{path.removeMembership}}">' + settings.labels.account.removeMembership + '</a></li>';
		return replacePlaceholders(template);
	};

	/**
	 * Convert an array of navigation items into a string
	 * @param {Array} items The navigation items
	 */
	var getNavItems = function (items) {
		var template = '';
		items.forEach(function (item) {
			template += '<li><a href="' + decodeURIComponent(item.url) + '">' + item.label + '</a></li>';
		});
		return template;
	};

	/**
	 * Inject HTML elements into the <head>
	 * @param {String} type The HTML element type
	 * @param {Object} atts The attributes and values for the element
	 */
	var inject = function (type, atts) {
		var ref = window.document.getElementsByTagName('script')[0];
		var elem = document.createElement(type);
		atts.forEach(function (value, key) {
			elem.setAttribute(key, value);
		});
		ref.parentNode.insertBefore(elem, ref);
	};

	/**
	 * Render content in the Portal
	 * @param {String}   selector The selector for the element to render the content into
	 * @param {String}   key      The content type
	 * @param {Function} before   The callback to run before rendering
	 * @param {Function} after    The callback to run after rendering
	 */
	var render = function (selector, key, before, after) {
		var content = document.querySelector(selector);
		if (!content) return;
		if (before) {
			before();
		}
		content.innerHTML = settings.templates[key] ? replacePlaceholders(settings.templates[key], key) : '';
		if (['page','docs'].indexOf(window.mashery.contentType !== -1)) {
			var junk = document.querySelectorAll('#header-edit, #main .section .section-meta');
			junk.forEach(function (item) {
				item.remove();
			})
		}
		if (after) {
			after();
		}
	};

	/**
	 * Verify that a user logged in.
	 * @bugfix Sometimes mashery variable provides wrong info at page load after logout event
	 */
	var verifyLoggedIn = function () {
		if (['logout', 'memberRemoveSuccess'].indexOf(window.mashery.contentType) === -1) return;
		var loggedIn = window.mashery.dom.querySelector('#mashery-logout-form');
		if (loggedIn) return;
		window.mashery.loggedIn = false;
		window.mashery.username = null;
		window.mashery.isAdmin = false;
		window.mashery.dashboard = null;
		window.mashery.logout = null;
	};

	/**
	 * Sanitize a string for use as a class
	 * @url Regex pattern: http://stackoverflow.com/a/9635698/1293256
	 * @param {String} id      The string to convert into a class
	 * @param {String} prefix  A prefix to use before the class [optionals]
	 */
	var sanitizeClass = function (id, prefix) {
		if (!id) return '';
		prefix = prefix ? prefix + '-' : '';
		return prefix + id.replace(/^[^a-z]+|[^\w:.-]+/gi, '-').toLowerCase();
	};

	/**
	 * Add class hooks for styling to the DOM, and a global JS variable for conditional functions
	 */
	exports.addStyleHooks = function () {
		var wrapper = document.querySelector('#app-wrapper');
		if (!wrapper) return;
		var path = ['/', '/home'].indexOf(window.location.pathname.toLowerCase()) === -1 ? window.location.pathname.slice(1) : 'home';
		wrapper.className = sanitizeClass(window.mashery.contentType, 'category') + ' ' + sanitizeClass(path, 'single');
		window.mashery.contentId = sanitizeClass(path);
	};

	/**
	 * Render the layout
	 */
	exports.renderLayout = function () {
		render('#app', 'layout', settings.callbacks.beforeRenderLayout, settings.callbacks.afterRenderLayout);
		verifyLoggedIn();
	};

	/**
	 * Render the title attribute
	 */
	exports.renderTitle = function () {
		document.title = replacePlaceholders(settings.labels.title, window.mashery.contentType);
	};

	/**
	 * Render the user navigation
	 */
	exports.renderUserNav = function () {
		render('#nav-user-wrapper', 'userNav', settings.callbacks.beforeRenderUserNav, settings.callbacks.afterRenderUserNav);
	};

	/**
	 * Render the primary navigation
	 */
	exports.renderPrimaryNav = function () {
		render('#nav-primary-wrapper', 'primaryNav', settings.callbacks.beforeRenderPrimaryNav, settings.callbacks.afterRenderPrimaryNav);
	};

	/**
	 * Render the secondary navigation
	 */
	exports.renderSecondaryNav = function () {
		render('#nav-secondary-wrapper', 'secondaryNav', settings.callbacks.beforeRenderSecondaryNav, settings.callbacks.afterRenderSecondaryNav);
	};

	/**
	 * Render unspecified content
	 * @param {String} id   The selector of the container to render the content into
	 * @param {String} key  The content type
	 */
	exports.renderContent = function (id, key) {
		var content = document.querySelector(id);
		if (!content) return;
		settings.callbacks.beforeRenderFooter();
		content.innerHTML = settings.templates[key] ? replacePlaceholders(settings.templates[key]) : '';
		settings.callbacks.afterRenderFooter();
	};

	/**
	 * Load IO Docs scripts if they're not already present
	 */
	var loadIODocsScripts = function () {
		loadJS('/public/Mashery/scripts/Iodocs/prettify.js', function () {
			loadJS('/public/Mashery/scripts/Mashery/beautify.js', function () {
				loadJS('/public/Mashery/scripts/vendor/alpaca.min.js', function () {
					loadJS('/public/Mashery/scripts/Iodocs/utilities.js', function () {
						loadJS('/public/Mashery/scripts/Iodocs/iodocs.js', function () {
							loadJS('/public/Mashery/scripts/Mashery/ace/ace.js');
						}, true);
					}, true);
				}, true);
			}, true);
		}, true);
	}

	/**
	 * Load any Mashery files that are required for a page to work
	 * Curretly, this is only required for IO Docs
	 */
	var loadRequiredFiles = function () {
		if (window.mashery.contentType === 'ioDocs') {
			// window.prettyPrint = function () {};
			if (!('jQuery' in window)) {
				loadJS('https://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js', loadIODocsScripts);
			} else {
				loadIODocsScripts();
			}
		}
	};

	/**
	 * Render the main content
	 */
	exports.renderMain = function () {
		loadRequiredFiles();
		render('#main-wrapper', window.mashery.contentType, settings.callbacks.beforeRenderMain, settings.callbacks.afterRenderMain);
	};

	/**
	 * Render the header elements
	 * @param {Boolean} ajax  If true, skip rendering (since they already exist)
	 * @todo Add support for Favicons via a setting
	 */
	var renderHead = function (ajax) {

		if (ajax) return;

		inject('meta', {
			'http-equiv': 'X-UA-Compatible',
			'content': 'IE=edge,chrome=1'
		});

		inject('meta', {
			name: 'viewport',
			content: 'width=device-width, initial-scale=1.0'
		});

		// inject('link', {
		// 	rel: 'shortcut icon',
		// 	href: '/files/favicon.ico'
		// });

		// inject('link', {
		// 	rel: 'icon',
		// 	sizes: '16x16 32x32',
		// 	href: '/files/favicon.icon'
		// });

	};

	/**
	 * Inject the logout form into the DOM
	 */
	var renderLogout = function () {
		if (!window.mashery.logout || document.querySelector('#mashery-logout-form')) return;
		document.body.insertBefore(window.mashery.logout, document.body.lastChild);
	};

	/**
	 * Inject the remove member form into the DOM on remove member page
	 */
	var renderMemberRemove = function () {
		if (window.mashery.contentType !== 'memberRemove' || document.querySelector('#member-remove-form')) return;
		var form = window.mashery.dom.querySelector('.main form');
		if (!form) return;
		form.id = 'member-remove-form';
		form.setAttribute('hidden', 'hidden');
		var submit = form.querySelector('#process');
		if (submit) {
			submit.setAttribute('onclick', 'return confirm("' + localPlaceholders.memberRemove.popup.text() + '")');
		}
		document.body.insertBefore(form, document.body.lastChild);
	};

	/**
	 * Jump to anchor or adjust focus when rendering is complete
	 */
	var fixLocation = function () {
		if (window.location.hash) {
			window.location.hash = window.location.hash;
		} else {
			document.querySelector('#app').focus();
		}
	};

	/**
	 * Reload IO Docs to force script to reinit after DOM is available
	 */
	var reloadIODocs = function () {
		if (window.mashery.contentType !== 'ioDocs' || window.mashery.isAjax || window.masheryIsReloaded) return;
		window.masheryIsReloaded = true;
		fetchContent(window.location.href, true);
	}

	/**
	 * Render the Mashery Made logo (if missing)
	 */
	exports.renderMasheryMade = function () {
		var masheryMade = document.querySelector('#mashery-made-logo');
		if (masheryMade) return;
		var app = document.querySelector('#app');
		if (!app) return;
		var mashMade = document.createElement('div');
		mashMade.innerHTML = '<p>x</p><div id="mashery-made"><div class="container"><p>' + globalPlaceholders.masheryMade.text + '</p></div></div>';
		app.appendChild(mashMade.childNodes[1]);
	};

	/**
	 * Render the Mashery Terms of Use of registration pages (if missing)
	 */
	exports.renderTOS = function () {
		if (['register', 'join'].indexOf(window.mashery.contentType) === -1) return;
		var tos = document.querySelector('#registration-terms-of-service');
		if (tos) return;
		var reg = document.querySelector('form[action*="/member/register"]');
		if (!reg) return;
		var div = document.createElement('div');
		div.innerHTML = '<p>x</p>' + replacePlaceholders(globalPlaceholders.registerTerms.text, 'register');
		reg.appendChild(div.childNodes[1]);
	}

	/**
	 * Render the Portal
	 * @param {Boolean} ajax  If true, the page is being loaded via Ajax
	 */
	exports.renderPortal = function (ajax) {
		settings.callbacks.beforeRender();
		renderHead(ajax); // <head> attributes
		exports.addStyleHooks(); // Content-specific classes
		exports.renderLayout(); // Layout
		exports.renderUserNav(); // User Navigation
		exports.renderPrimaryNav(); // Primary Navigation
		exports.renderSecondaryNav(); // Secondary Navigation
		exports.renderMain(); // Main Content
		exports.renderTitle(); // Page Title
		exports.renderContent('#footer-1-wrapper', 'footer1'); // Footer Content 1
		exports.renderContent('#footer-2-wrapper', 'footer2'); // Footer Content 2
		fixLocation(); // Jump to anchor
		renderLogout(); // Logout Form
		renderMemberRemove(); // Remove Member Form
		exports.renderMasheryMade(); // Add the Mashery Made logo if missing
		exports.renderTOS(); // Add the Mashery Terms of Service if missing from registration page
		settings.callbacks.afterRender();
		document.documentElement.classList.remove('loading');
		reloadIODocs();
	};

	/**
	 * Process logout events
	 * @param {Event} event The click event
	 */
	var processLogout = function (event) {
		var logout = document.querySelector('#mashery-logout-form');
		if (!logout) return;
		event.preventDefault();
		logout.submit();
	};

	/**
	 * Render the Portal via Ajax
	 * @param {Object}  data      The page data
	 * @param {String}  url       The page URL
	 * @param {Boolean} pushState If true, update browser history
	 */
	var renderWithAjax = function (data, url, pushState) {
		setupMashery(data);
		getContent(window.mashery.contentType);
		if (pushState) {
			window.history.pushState({ url: url }, data.title, url);
		}
		exports.renderPortal(true);
		window.mashery.isAjax = true;
	};

	/**
	 * Fetch page content with Ajax
	 * @param {String}  url        The page URL
	 * @param {Boolean} pushState  If true, update browser history
	 */
	var fetchContent = function (url, pushState) {
		atomic.ajax({
			url: url,
			responseType: 'document'
		}).success(function (data) {
			renderWithAjax(data, url, pushState);
		}).error(function (data, xhr) {
			if (xhr.status === 404) {
				renderWithAjax(data, url, pushState);
				return;
			}
			window.location = url;
		});
	};

	/**
	 * Process link clicks and prepare for Ajax call
	 * @param {Event} event The click event
	 */
	var loadWithAjax = function (event) {

		// Make sure link should trigger an ajax event
		if (!settings.ajax || (settings.ajaxIgnore && event.target.matches(settings.ajaxIgnore)) || event.target.closest(ajaxIgnore)) return;
		if (event.target.tagName.toLowerCase() !== 'a' || !event.target.href || event.target.hostname !== window.location.hostname) return;
		if (window.mashery.contentType === 'memberRemoveSuccess') return;
		if(event.target.pathname === window.location.pathname && event.target.hash.length > 0) return;

		// Don't run if right-click or command/control + click
		if (event.button !== 0 || event.metaKey || event.ctrlKey) return;

		// Prevent the default
		event.preventDefault();

		// Get the content
		fetchContent(event.target.href, true);

	};

	/**
	 * Process remove membership events
	 * @param {Event} event The click event
	 */
	var processMemberRemove = function (event) {
		var remove = document.querySelector('#member-remove-form #process');
		if (!remove || window.mashery.contentType !== 'memberRemove') return;
		event.preventDefault();
		simulateClick(remove);
	};

	/**
	 * Handle all page click events
	 * @param {Event} event The click event
	 */
	var clickHandler = function (event) {

		// Logout events
		if (event.target.closest('a[href*="' + paths.logout.url + '"]')) {
			processLogout(event);
			return;
		}

		// Member remove events
		if (event.target.closest('a[href*="' + paths.memberRemove.url + '"]')) {
			processMemberRemove(event);
			return;
		}

		// Ajax
		loadWithAjax(event);

	};

	/**
	 * Handle popstate events and update page content
	 * @param {Event} event  The popstate event
	 */
	var popstateHandler = function (event) {
		var url = event.state && event.state.url ? event.state.url : window.location.href;
		fetchContent(url);
	};

	/**
	 * Handle for submit events
	 * @param {Event} event  The form submit event
	 */
	var submitHandler = function (event) {
		if (!event.target.closest('#search-form')) return;
		var input = event.target.querySelector('#search-input');
		if (!input) return;
		event.preventDefault();
		fetchContent(paths.search.url + '?q=' + encodeURIComponent(input.value), true);
	};

	/**
	* Initialize
	* @public
	* @param {object} options User options and overrides
	*/
	exports.init = function (options) {

		loadJS('https://cdn.polyfill.io/v2/polyfill.min.js?features=default', function () {

			// Merge user options with defaults
			settings = extend( defaults, options || {} );

			// Render the Portal
			exports.renderPortal();

			// Listen for click events
			document.addEventListener('click', clickHandler, false);

			if (settings.ajax) {
				window.addEventListener('popstate', popstateHandler, false);
				window.addEventListener('submit', submitHandler, false);
			}

		});

	};


	//
	// Public APIs
	//

	return exports;

})();