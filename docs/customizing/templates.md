# Templates

With templates, you can modify the layout of and content of any page on your Portal.

Templates are modified by setting a `portalOptions.templates` value for the desired template. They can be simple JavaScript strings, or for more complex or logic-driven layouts, a function that returns a string.

Templates also accept placeholder variables that are automatically replaced with content during the render process. All of the available templates and their accepted variables are detailed alphabetically below.

## Customizing Templates

When v1.x of Blackbeard goes live, these will be set under `Manage > Portal > Portal Settings` in the inline JavaScript area.

For now, you can test their functionality by opening up the Console tab of Developer Tools in your browser and doing the following:

0. Copy/paste your desired template from the list below into the console and hit enter.
0. Paste `m$.setOptions(portalOptions)` in the console and hit enter to update Blackbeard's default settings.
0. Paste `m$.renderPortal()` in the console and hit enter to re-render the site.

*__Note:__ This may produce a layout you're unhappy with. Reload the browser to reset this demo Portal back to it's defaults.*

### Example
You can copy/paste this into the console in developer tools. It will update the base layout.

```js
// Remove the user nav
portalOptions.templates.userNav = null;

// Update the primary navigation
portalOptions.templates.primaryNav = function () {
	var template =
		'<div class="nav-primary nav-wrap nav-collapse" id="nav-primary">' +
			'<div class="container padding-top-small padding-bottom-small">' +
				'<a id="logo" class="logo margin-bottom" href="/">{{content.logo}}</a>' +
				'<a role="button" class="nav-toggle" id="nav-primary-toggle" data-nav-toggle="#nav-primary-menu" href="#">{{content.menuToggle}}</a>' +
				'<div class="nav-menu" id="nav-primary-menu">' +
					'<ul class="nav" id="nav-primary-list">' +
						'{{content.navItemsPrimary}}' +
					'</ul>' +
					'<ul class="nav-user-list" id="nav-user-list">' +
						'{{content.navItemsUser}}' +
					'</ul>' +
					'{{content.searchForm}}' +
					(mashery.contentType === 'docs' ? '<h2 class="margin-top">In The Docs</h2><ul class="nav-docs" id="nav-docs">{{content.secondary}}</ul>' : '') +
				'</div>' +
			'</div>' +
		'</div>';
	return template;
};

// Update the base layout
portalOptions.templates.layout =
	'<div class="row row-no-padding clearfix">' +
		'<div class="grid-three-fourths">' +
			'{{layout.main}}' +
			'<footer class="footer" id="footer">' +
				'{{layout.footer1}}' +
				'{{layout.navSecondary}}' +
				'{{layout.footer2}}' +
			'</footer>' +
		'</div>' +
		'<div class="grid-fourth">' +
			'<a class="screen-reader screen-reader-focusable" href="#main">Skip to content</a>' +
			'{{layout.navPrimary}}' +
		'</div>' +
	'</div>';

// Update the settings with our new options
m$.setOptions(portalOptions);

// Re-render the Portal
m$.renderPortal();
```

## Global Placeholder Variables

These are placeholder variables that can be used in any template.

### Content
Placeholder variables for content.

- `{{mashery.area}}` - The name of your Portal as defined in Control Center.
- `{{content.heading}}` - The title of the page's H1 element, if one exists.
- `{{content.main}}` - The main content for the page. On custom pages and documentation, this is whatever content you've entered in Control Center. On Mashery-generate pages, it's the primary body content. On some pages, this is overridden by a [page-specific label that you can customize](/docs/read/customizing/Labels).
- `{{content.form}}` - On pages with forms (sign in, registration, etc.), the form.
- `{{content.secondary}}` - Varies by page. On the Documentation pages, it's the navigation sidebar.
- `{{content.logo}}` - Your logo, if one is specified. If not, falls back to `{{mashery.area}}`.
- `{{content.navItemsAccount}}` - The user account navigation items as a list of linked list elements *without* a parent `<ul>` or `<ol>`.
- `{{content.navItemsMasheryAccount}}` - The mashery account navigation items (change your password, email, etc.) as a list of linked list elements *without* a parent `<ul>` or `<ol>`.
- `{{content.navItemsPrimary}}` - The primary navigation menu items as a list of linked list elements *without* a parent `<ul>` or `<ol>`.
- `{{content.navItemsSecondary}}` - The secondary navigation menu items as a list of linked list elements *without* a parent `<ul>` or `<ol>`.
- `{{content.navItemsUser}}` - The user navigation menu items (sign in, register, logout, etc.) as a list of linked list elements *without* a parent `<ul>` or `<ol>`.
- `{{content.masheryMade}}` - The Mashery Made logo. If you don't include this, it will be automatically injected into the footer.
- `{{content.terms}}` - The account registration Terms of Use.
- `{{content.privacyPolicy}}` - A custom privacy policy or terms of use for your organization, if you'd like to include them with the Mashery Terms of Use.
- `{{content.searchForm}}` - The search form.
- `{{mashery.title}}` - The page title. The H1 content for most pages, or, if unspecified, the Mashery Area name.
- `{{mashery.username}}` - The currently logged in user's username.

### Paths
Placeholder variables for system URLs.

- `{{path.apps}}` - The My Apps page.
- `{{path.keys}}` - The My Keys page.
- `{{path.account}}` - The My Account page.
- `{{path.changeEmail}}` - The page to change your email.
- `{{path.changePassword}}` - The page to change your password.
- `{{path.contact}}` - The contact page.
- `{{path.dashboard}}` - The Control Center Dashboard.
- `{{path.docs}}` - The documentation page.
- `{{path.iodocs}}` - The IO Docs page.
- `{{path.logout}}` - The logout link.
- `{{path.lostPassword}}` - The page to request a lost password.
- `{{path.lostUsername}}` - The page to request a lost username.
- `{{path.removeMember}}` - The link to trigger a remove account request.
- `{{path.register}}` - The page to register a new account.
- `{{path.registerResendConfirmation}}` - The page to confirm that a registration email was resent.
- `{{path.removeMembership}}` - The page to remove account membership from this Portal.
- `{{path.search}}` - The search results page.
- `{{path.signin}}` - The sign in page.
- `{{path.viewProfile}}` - The current user's profile.


## The Templates

### Base layout
The markup structure that all of the content will get loaded into.

- `{{layout.navUser}}` - The wrapper for the user navigation.
- `{{layout.navPrimary}}` - The wrapper for the primary navigation.
- `{{layout.main}}` - The wrapper for the main content area.
- `{{layout.footer1}}` - The wrapper for the first footer content area.
- `{{layout.navSecondary}}` - The wrapper for the secondary navigation.
- `{{layout.footer2}}` - The wrapper for the second footer content area.

```js
portalOptions.templates.layout =
	'<a class="screen-reader screen-reader-focusable" href="#main-wrapper">Skip to content</a>' +
	'{{layout.navUser}}' +
	'{{layout.navPrimary}}' +
	'{{layout.main}}' +
	'<footer class="footer" id="footer">' +
		'{{layout.footer1}}' +
		'{{layout.navSecondary}}' +
		'{{layout.footer2}}' +
	'</footer>';
```

### My Apps
The page displaying a users registered applications.

- `{{content.noApps}}` - The content to display when the user has no applications.

```js
portalOptions.templates.accountApps = function () {
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
};
```


### My Account: Email
The page where users can change their Mashery email address.

```js
portalOptions.templates.accountEmail =
	'<div class="main container container-small" id="main">' +
		'<h1>{{content.heading}}</h1>' +
		'<ul id="nav-account">{{content.navItemsAccount}}</ul>' +
		'<ul id="nav-mashery-account">{{content.navItemsMasheryAccount}}</ul>' +
		'{{content.main}}' +
	'</div>';
```


### My Account: Email Success
The page confirming email change was successful

```js
portalOptions.templates.accountEmailSuccess =
	'<div class="main container container-small" id="main">' +
		'<h1>{{content.heading}}</h1>' +
		'<ul id="nav-account">{{content.navItemsAccount}}</ul>' +
		'<ul id="nav-mashery-account">{{content.navItemsMasheryAccount}}</ul>' +
		'{{content.main}}' +
	'</div>';
```


### My Keys
The page displaying a users API keys.

- `{{content.noPlanKeys}}` - The message to display when a plan has no keys.
- `{{content.noKeys}}` - The message to display when a user has no keys.

```js
portalOptions.templates.accountKeys = function () {
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
};
```


### My Account
The page where users can manage their Mashery Account details.

- `{{content.subheading}}` - The heading to display above the account details form.

```js
portalOptions.templates.accountManage =
	'<div class="main container container-small" id="main">' +
		'<h1>{{content.heading}}</h1>' +
		'<ul id="nav-account">{{content.navItemsAccount}}</ul>' +
		'<ul id="nav-mashery-account">{{content.navItemsMasheryAccount}}</ul>' +
		'<h2>{{content.subheading}}</h2>' +
		'{{content.main}}' +
	'</div>';
```


### My Account: Password
The page where users can change their Mashery password.

```js
portalOptions.templates.accountPassword =
	'<div class="main container container-small" id="main">' +
		'<h1>{{content.heading}}</h1>' +
		'<ul id="nav-account">{{content.navItemsAccount}}</ul>' +
		'<ul id="nav-mashery-account">{{content.navItemsMasheryAccount}}</ul>' +
		'{{content.main}}' +
	'</div>';
```


### My Account: Password Success
The page after users have successfully changed their password.

```js
portalOptions.templates.accountPasswordSuccess =
	'<div class="main container container-small" id="main">' +
		'<h1>{{content.heading}}</h1>' +
		'<ul id="nav-account">{{content.navItemsAccount}}</ul>' +
		'<ul id="nav-mashery-account">{{content.navItemsMasheryAccount}}</ul>' +
		'{{content.main}}' +
	'</div>';
```


### Add App APIs
Add APIs to an application.

- `{{content.applicationLabel}}` - The label before the application name.
- `{{content.createdLabel}}` - The label before the date the application was created.
- `{{content.apiLabel}}` - The label before the API name.
- `{{content.keyLabel}}` - The label before the API key.
- `{{content.subheading}}` - The heading above the form to add APIs to the application.

```js
portalOptions.templates.appAddAPIs = function () {
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
};
```


### App Delete
Delete an application

- `{{content.applicationLabel}}` - The label before the application name.
- `{{content.createdLabel}}` - The label before the date the application was created.
- `{{content.apiLabel}}` - The label before the API name.
- `{{content.keyLabel}}` - The label before the API key.
- `{{content.subheading}}` - The heading above the form to delete the application.

```js
portalOptions.templates.appDelete = function () {
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
};
```


### Add App APIs: Success
New API keys added to an app.

```js
portalOptions.templates.appAddAPIsSuccess =
	'<div class="container container-small">' +
		'<h1>{{content.heading}}</h1>' +
		'{{content.main}}' +
	'</div>';
```


### Edit Application
Layout with form to edit an application.

```js
portalOptions.templates.appEdit =
	'<div class="container container-small">' +
		'<h1>{{content.heading}}</h1>' +
		'{{content.main}}' +
		'{{content.form}}' +
	'</div>';
```


### App Registration
The app registration page.

```js
portalOptions.templates.appRegister =
	'<div class="main container container-small" id="main">' +
		'<h1>{{content.heading}}</h1>' +
		'{{content.main}}' +
		'{{content.form}}' +
	'</div>';
```


### App Registration Success
The message that's displayed after an application is successfully registered.

```js
portalOptions.templates.appRegisterSuccess =
	'<div class="main container container-small" id="main">' +
		'<h1>{{content.heading}}</h1>' +
		'{{content.main}}' +
	'</div>';
```


<!-- ### Blog: All Posts
The page where all blog posts are listed.
@todo Create this layout

blogAll: '<div class="main container" id="main"><p>Blog content needs to get created.</p></div>', -->


<!-- Blog: Single Post
The layout for individual blog posts.
@todo Create this layout

blogSingle: '<div class="main container" id="main"><p>Blog content needs to get created.</p></div>', -->


### Contact
The contact page.

```js
portalOptions.templates.contact =
	'<div class="main container container-small" id="main">' +
		'<h1>{{content.heading}}</h1>' +
		'{{content.main}}' +
		'{{content.form}}' +
	'</div>';
```


### Contact Success
The message displayed after a contact form is successfully submitted.

```js
portalOptions.templates.contactSuccess =
	'<div class="main container container-small" id="main">' +
		'<h1>{{content.heading}}</h1>' +
		'<p>{{content.main}}</p>' +
	'</div>';
```


### Documentation
The layout for API documentation. This page includes an automatically generated navigation menu.

- `{{content.subheading}}` - The heading above the documentation sub-navigation.

```js
portalOptions.templates.docs =
	'<div class="main container" id="main">' +
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
	'</div>';
```


### Footer 1
The first of two footer content sections.

```js
portalOptions.templates.footer1: '<div class="footer-1 container" id="footer-1"><hr></div>';
```


### Footer 2
The second of two footer content sections.

```js
portalOptions.templates.footer2 =
	'<div class="footer-1 container" id="footer-2">' +
		'<p>{{content.masheryMade}}</p>' +
	'</div>';
```


<!-- ### Forum: All Topics
The main forum page where all topics are listed.
@todo Create this layout

forumAll: '<div class="main container" id="main"><p>The forum content needs to get created.</p></div>', -->



### 404
The layout for 404 pages.

```js
portalOptions.templates.fourOhFour =
	'<div class="main container container-small" id="main">' +
		'<h1>{{content.heading}}</h1>' +
		'{{content.main}}' +
	'</div>';
```


### IO Docs
The IO Docs page.

```js
portalOptions.templates.ioDocs =
	'<div class="main container container-small" id="main">' +
		'<h1>{{content.heading}}</h1>' +
		'{{content.main}}' +
		'{{content.form}}' +
	'</div>';
```


### Join
The layout for existing Mashery users signing into an area for the first time. Mashery Terms of Use *must* be displayed on this page, and will be automatically injected if you omit them.

```js
portalOptions.templates.join =
	'<div class="main container container-small" id="main">' +
		'<h1>{{content.heading}}</h1>' +
		'{{content.main}}' +
		'{{content.form}}' +
		'{{content.terms}}' +
	'</div>';
```


### Join: Success
The page confirming that an existing Mashery user has joined a new area.

```js
portalOptions.templates.joinSuccess =
	'<div class="main container container-small" id="main">' +
		'<h1>{{content.heading}}</h1>' +
		'{{content.main}}' +
	'</div>';
```


### Key Activity
Layout for the key activity report page.

- `{{content.applicationLabel}}` - The label before the application name.
- `{{content.keyLabel}}` - The label before the API key.
- `{{content.secretLabel}}` - The label before the key secret.
- `{{content.statusLabel}}` - The label before the key status.
- `{{content.createdLabel}}` - The label before the date the application was created.
- `{{content.limits}}` - A table displaying any call limits for the key.

```js
portalOptions.templates.keyActivity = function () {
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
};
```


### Key: Delete
Layout for the delete key page.

- `{{content.applicationLabel}}` - The label before the application name.
- `{{content.keyLabel}}` - The label before the API key.
- `{{content.secretLabel}}` - The label before the key secret.
- `{{content.statusLabel}}` - The label before the key status.
- `{{content.createdLabel}}` - The label before the date the application was created.
- `{{content.subheadingConfirm}}` - The heading above the form where users confirm that they want to delete their key.

```js
portalOptions.templates.keyDelete = function () {
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
};
```


### Logout: Success
The page shown after a user logs out.

```js
portalOptions.templates.logout =
	'<div class="main container container-small" id="main">' +
		'<h1>{{content.heading}}</h1>' +
		'<p>{{content.main}}</p>' +
	'</div>';
```


### Logout: Failed
The page shown when a logout was unsuccessful.

```js
portalOptions.templates.logoutFail =
	'<div class="main container container-small" id="main">' +
		'<h1>{{content.heading}}</h1>' +
		'<p>{{content.main}}</p>' +
	'</div>';
```


### Lost Password Request
The page where users can request their password be reset.

```js
portalOptions.templates.lostPassword =
	'<div class="main container container-small" id="main">' +
		'<h1>{{content.heading}}</h1>' +
		'{{content.main}}' +
		'{{content.form}}' +
	'</div>';
```


### Lost Password Reset
The page shown after a password reset email is sent to the user.

```js
portalOptions.templates.lostPasswordReset =
	'<div class="main container container-small" id="main">' +
		'<h1>{{content.heading}}</h1>' +
		'<p>{{content.main}}</p>' +
	'</div>';
```


### Lost Username Request
The page where users can request their username be reset.

```js
portalOptions.templates.lostUsername =
	'<div class="main container container-small" id="main">' +
		'<h1>{{content.heading}}</h1>' +
		'{{content.main}}' +
		'{{content.form}}' +
	'</div>';
```


### Lost Username Reset
The page where users can reset their username.

```js
portalOptions.templates.lostUsernameReset =
	'<div class="main container container-small" id="main">' +
		'<h1>{{content.heading}}</h1>' +
		'<p>{{content.main}}</p>' +
	'</div>';
```


### Remove Membership
The page where users can remove their membership from this Portal.

- `{{content.confirm}}` - The button text to confirm you want to remove your membership from this Portal.
- `{{content.cancel}}` - The button text to cancel removing your account.

```js
portalOptions.templates.memberRemove =
	'<div class="main container container-small" id="main">' +
		'<h1>{{content.heading}}</h1>' +
		'<p>{{content.main}}</p>' +
		'<p>' +
			'<a class="btn btn-remove-member-confirm" id="btn-remove-member-confirm" href="{{path.removeMember}}">{{content.confirm}}</a>' +
			'<a class="btn btn-remove-member-cancel" id="btn-remove-member-cancel" href="{{path.account}}">{{content.cancel}}</a>' +
		'</p>' +
	'</div>';
```


### Remove Membership Success
The page shown when user membership was successfully removed.

```js
portalOptions.templates.memberRemoveSuccess =
	'<div class="main container container-small" id="main">' +
		'<h1>{{content.heading}}</h1>' +
		'<p>{{content.main}}</p>' +
	'</div>';
```


### No Access
Layout for when the user does not have permission to view the page

```js
portalOptions.templates.noAccess =
	'<div class="main container container-small" id="main">' +
		'<h1>{{content.heading}}</h1>' +
		'<p>{{content.main}}</p>' +
	'</div>';
```


### Custom Pages
The layout for custom pages.

```js
portalOptions.templates.page =
	'<div class="main container content" id="main">' +
		'<h1>{{content.heading}}</h1>' +
		'{{content.main}}' +
	'</div>';
```


### User Profiles
The layout for user profile pages.

- `{{content.headingUserInfo}}` - The heading above the user's info.
- `{{content.userWebsite}}` - The label before the user's website URL.
- `{{content.userBlog}}` - The label before the user's blog URL.
- `{{content.userRegistered}}` - The label before the date the user registered.
- `{{content.headingActivity}}` - The heading above the user's list of activity.

```js
portalOptions.templates.profile = function () {
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
};
```


### Primary Navigation
The primary navigation content for the Portal.

- `{{content.menuToggle}}` - The label on the button to expand and collapse the navigation menu on smaller screens.

```js
portalOptions.templates.primaryNav =
	'<div class="nav-primary nav-wrap nav-collapse" id="nav-primary">' +
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
	'</div>';
```


### Registration
The registration page. Terms of Use *must* be included on this page, and will be automatically injected if you omit them.

- `{{content.about}}` - The "No Spam" message on the registration page.

```js
portalOptions.templates.register =
	'<div class="main container" id="main">' +
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
	'</div>';
```


### Registration Email Sent
The page confirming that the users registration email was sent.

```js
portalOptions.templates.registerSent =
	'<div class="main container container-small" id="main">' +
		'<h1>{{content.heading}}</h1>' +
		'<p>We have sent a confirmation email to you at {{content.main}}.</p>' +
		'<p>Please click on the link in that e-mail to confirm your account. If you do not receive an email within the next hour, <a href="{{path.registerResendConfirmation}}">click here to resend confirmation email</a>.</p>' +
	'</div>';
```


### Registration Email Resend
The page requesting the registration email be resent.

```js
portalOptions.templates.registerResend =
	'<div class="main container container-small" id="main">' +
		'<h1>{{content.heading}}</h1>' +
		'{{content.main}}' +
		'{{content.form}}' +
	'</div>';
```


### Registration Email Resent
The page confirming that the registration email was resent.

```js
portalOptions.templates.registerResendSuccess =
	'<div class="main container container-small" id="main">' +
		'<h1>{{content.heading}}</h1>' +
		'{{content.main}}' +
	'</div>';
```


### Search
The layout for search results.

- `{{content.headingNew}}` - The heading to display if no search query is provided.
- `{{content.meta}}` - Meta details about the search.
- `{{content.pagePrevious}}` - The text for the link to go to the previous page of results.
- `{{content.pageDivider}}` - The divider between the previous and next page links.
- `{{content.pageNext}}` - The text for the link to go to the next page of results.
- `{{content.noResults}}` - The message to display if no search results are found.

```js
portalOptions.templates.search = function () {
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
};
```


### Secondary Navigation
The secondary navigation for the Portal, often included in the footer.

```js
portalOptions.templates.secondaryNav =
	'<div class="nav-secondary container" id="nav-secondary">' +
		'<ul id="nav-secondary-list">' +
			'{{content.navItemsSecondary}}' +
		'</ul>' +
	'</div>';
```


### Secret Visibility
Show key secrets for 30 days.

```js
portalOptions.templates.showSecret =
	'<div class="main container container-small" id="main">' +
		'<h1>{{content.heading}}</h1>' +
		'{{content.main}}' +
	'</div>';
```


### Secret Visibility: Success
Key secrets will be shown.

```js
portalOptions.templates.showSecretSuccess =
	'<div class="main container container-small" id="main">' +
		'<h1>{{content.heading}}</h1>' +
		'{{content.main}}' +
	'</div>';
```


### Secret Visibility: Error
Key secrets already shown.

```js
portalOptions.templates.showSecretError =
	'<div class="main container container-small" id="main">' +
		'<h1>{{content.heading}}</h1>' +
		'{{content.main}}' +
	'</div>';
```


### Sign In
The sign in page.

```js
portalOptions.templates.signin =
	'<div class="main container" id="main">' +
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
	'</div>';
```


### User Navigation
The navigation menu for sign in, registration, account, and logout links.

```js
portalOptions.templates.userNav =
	'<div class="nav-user container" id="nav-user">' +
		'<ul class="nav-user-list list-inline text-small text-muted padding-top-small padding-bottom-small no-margin-bottom text-right" id="nav-user-list">' +
			'{{content.navItemsUser}}' +
		'</ul>' +
	'</div>';
```