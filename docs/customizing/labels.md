# Labels

Labels make it easy for you to change headlines, labels, and messages in your Portal without customizing the entire layout.

Labels are changed by setting a `portalOptions.labels` value for the desired label. All of the available labels and their options names are detailed alphabetically below.

## Customizing Labels

When v1.x of Blackbeard goes live, these will be set under `Manage > Portal > Portal Settings` in the inline JavaScript area.

For now, you can test their functionality by opening up the Console tab of Developer Tools in your browser and doing the following:

0. Copy/paste your desired options from the list below into the console and hit enter.
0. Paste `m$.setOptions(portalOptions)` in the console and hit enter to update Blackbeard's default settings.
0. Paste `m$.renderPortal()` in the console and hit enter to re-render the site.

### Example
You can copy/paste this into the console in developer tools. It will update the user nav for logged out users.

```js
// Update the labels
portalOptions.labels.userNav = {
	signin: 'Login',
	register: 'Join'
};

// Update the settings with our new options
m$.setOptions(portalOptions);

// Re-render the Portal
m$.renderPortal();
```

## The Labels

### My Apps
The page displaying a users registered applications.

```js
portalOptions.labels.accountApps: {
	heading: 'My Apps', // heading
	noApps: 'You don\'t have any apps yet.', // The message to display when a user has no apps
};
```

### My Account: Email
The page where users can change their Mashery email address.

```js
portalOptions.labels.accountEmail: {
	heading: 'Change Email' // The heading
};
```

### My Account: Email Success
The layout for the page confirming email change was successful.

```js
portalOptions.labels.accountEmailSuccess: {
	heading: 'Email Successfully Changed', // the heading
	main: '<p>An email confirming your change has been sent to the address you provided with your username. Please check your spam folder if you don\'t see it in your inbox.</p>' // The main content
};
```

### My Keys
The page displaying a users API keys.

```js
portalOptions.labels.accountKeys: {
	heading: 'My API Keys', // The heading
	noKeys: 'You don\'t have any keys yet.', // The message to display when a user has no keys
	noPlanKeys: 'You have not been issued keys for this API.', // The message to display when a user has no keys for a specific plan
};
```

### My Account
The page where users can manage their Mashery Account details.

```js
portalOptions.labels.accountManage: {
	heading: 'Manage Account', // Heading
	subheading: 'Account Information' // The "Account Information" subheading
};
```

### Account Navigation
Labels for the account navigation menu.

```js
portalOptions.labels.accountNav: {
	// Navigation Labels
	keys: 'Keys', // The account nav label for "My Keys"
	apps: 'Applications', // The account nav label for "My Applications"
	account: 'Manage Account', // The account nav label for "Manage Account"
	changeEmail: 'Change Email', // The account nav label for "Change Email"
	changePassword: 'Change Password', // The account nav label for "Change Password"
	viewProfile: 'View My Public Profile', // The account nav label for "View My Profile"
	removeMembership: 'Remove Membership from {{mashery.area};};' // The account nav label for "Remove Membership"
};
```

### My Account: Password
The page where users can change their Mashery password.

```js
portalOptions.labels.accountPassword: {
	heading: 'Change Password' // The heading
};
```

### My Account: Password Success
The layout for the page after users have successfully changed their password.

```js
portalOptions.labels.accountPasswordSuccess: {
	heading: 'Password Successfully Changed', // The heading
	main: '<p>An email confirming your change has been sent to the address you provided with your username. If you use this account on other Mashery powered portals, remember to use your new password.</p>' // The main content
};
```

### Add App APIs
Add APIs to an application.

```js
portalOptions.labels.appAddAPIs: {
	heading: 'Add APIs to this Application',
	application: 'Application:',
	created: 'Created:',
	api: 'API:',
	key: 'Key:',
	subheading: 'Add APIs'
};
```

### App Add APIs: Success
API keys successfully added to an app.

```js
portalOptions.labels.appAddAPIsSuccess: {
	heading: 'New API Keys Issued', // The heading

	// The message
	main: '<p>An email has been sent to you with your key and application details. You can also view them at any time from the <a href="{{path.keys};};">My Account</a> page.</p>' +
	'<p>To get started using your API keys, dig into <a href="{{path.docs};};">our documentation</a>. We look forward to seeing what you create!</p>',
};
```

### Delete App
The page to delete an application.

```js
portalOptions.labels.appDelete: {
	heading: 'Delete Your Application',
	application: 'Application:',
	created: 'Created:',
	api: 'API:',
	key: 'Key:',
	subheading: 'Confirm Deletion',
	main: '<p><strong>Are you sure you want to delete this application and all of its keys?</strong></p>',
	confirm: 'Are you really sure you want to delete this application?'
};
```

### App Edit
The edit application page.

```js
portalOptions.labels.appEdit: {
	heading: 'Edit Your Application',
	main: '<p>Edit your details using the form below.</p>'
};
```

### App Registration
The page to register an application.

```js
portalOptions.labels.appRegister: {
	heading: 'Register an Application', // The heading
	main: '<p>Get a key and register your application using the form below to start working with our APIs.</p>' // The message shown above the form
};
```

### App Registration Success
The page shown after an app has been successfully registered.

```js
portalOptions.labels.appRegisterSuccess: {
	heading: 'Your application was registered!', // The heading

	// The message
	main:	'<p>An email has been sent to you with your key and application details. You can also view them at any time from the <a href="{{path.keys};};">My Account</a> page.</p>' +
			'<p>To get started using your API keys, dig into <a href="{{path.docs};};">our documentation</a>. We look forward to seeing what you create!</p>',
};
```

### Contact
The contact form page.

```js
portalOptions.labels.contact: {
	heading: 'Contact Us', // The heading
	main: '<p>Contact us using the form below.</p>' // The message shown above the form
};
```

### Contact Success
The page shown after a contact form is successfully submitted.

```js
portalOptions.labels.contactSuccess: {
	heading: 'Thanks for your submission!', // The heading
	main: 'Your message will be forwarded to the appropriate group.' // The message
};
```

### Documentation
The layout for API documentation.

```js
portalOptions.labels.docs: {
	subheading: 'In the Docs'
};
```

### 404
The 404 page.

```js
portalOptions.labels.fourOhFour: {
	heading: 'Unable to find this page', // The heading
	main: '<p>We\'re unable to find this page. Sorry! Please check the URL, or contact us to report a broken link.</p>' // The message
};
```

### IO Docs
The IO Docs page.

```js
portalOptions.labels.ioDocs: {
	heading: 'Interactive API', // The heading
	main: '<p>Test our API services with IO-Docs, our interactive API documentation.</p>' // The message displayed before the content
};
```

### Join
The page shown to existing Mashery users signing in to a new area.

```js
portalOptions.labels.join: {
	heading: 'Join {{mashery.area};};', // The heading
	main: '<p>Since you already have a Mashery account you don\'t have to register again, but we would like to know a little more about you. Please fill out the additional information below.</p>' // The message shown above the form
};
```

### Join: Success
The page shown after an existing Mashery user successfully joins a new area.

```js
portalOptions.labels.joinSuccess: {
	heading: 'Registration Successful', // The heading
	main: '<p>You have successfully registered as {{content.main};};. Read our <a href="/docs">API documentation</a> to get started. You can view your keys and applications under <a href="{{path.keys};};">My Account</a>.</p>' // The success message
};
```

### Key Activity
The page to view key activity reports.

```js
portalOptions.labels.keyActivity: {
	heading: 'Key Activity',
	api: '{{content.api};};',
	application: 'Application:',
	key: 'Key:',
	secret: 'Secret:',
	status: 'Status:',
	created: 'Created:'
};
```

### Delete Key
The page to delete an API key.

```js
portalOptions.labels.keyDelete: {
	heading: 'Delete Your Key',
	api: '{{content.api};};',
	application: 'Application:',
	key: 'Key:',
	secret: 'Secret:',
	status: 'Status:',
	created: 'Created:',
	subheading: 'Confirm Deletion',
	main: '<p><strong>Are you sure you want to delete this key?</strong></p>',
	confirm: 'Are you really sure you want to delete this key?'
};
```

### Logout Success
The page shown after a user successfully logs out of the Portal.

```js
portalOptions.labels.logout: {
	heading: 'Signed Out', // The heading
	main: 'You have successfully signed out. Come back soon!' // The message
};
```

### Logout Fail
The page shown when a logout was unsuccessful.

```js
portalOptions.labels.logoutFail: {
	heading: 'Sign Out Failed', // The heading
	main: 'Your attempt to sign out failed. <a href="{{path.logout};};">Please try again.</a>' // The message
};
```

### Lost Password Request
The page to request a password reset.

```js
portalOptions.labels.lostPassword: {
	heading: 'Recover Your Password', // The heading
	main: '<p>Enter the email address and username that you registered with and we will send you a link to reset your password.</p>' // The message shown above the form
};
```

### Lost Password Reset
The page shown after a password reset email is sent to the user.

```js
portalOptions.labels.lostPasswordReset: {
	heading: 'Email Sent', // The heading
	main: 'An email has been sent to the address you provided. Click on the link in the e-mail to reset your password. Please check your spam folder if you don\'t see it in your inbox.' // The messsage
};
```

### Lost Username Request
The page to request a username recovery.

```js
portalOptions.labels.lostUsername: {
	heading: 'Recover Your Username', // The heading
	main: '<p>Enter the email address you used to register and we will send you an email with your username.</p>' // The message shown above the form
};
```

### Lost Username Reset
The page shown after a username reset email is sent to the user.

```js
portalOptions.labels.lostUsernameReset: {
	heading: 'Email Sent', // The heading
	main: 'An email has been sent containing your username details. Please check your spam folder if you don\'t see it in your inbox.' // The message
};
```

### Remove Membership
The page for users to remove their membership from this Portal.

```js
portalOptions.labels.memberRemove: {

	// Content
	heading: 'Remove membership from {{mashery.area};};', // The heading
	main: 'Removing membership disables your account and you will not be able to register again using the same username. All your keys will be deactivated.', // The message

	// Labels
	confirm: 'Remove Membership', // The "confirm remove membership" button label
	cancel: 'Cancel', // The "cancel removal" button label
	popup: 'Please confirm that you wish to permanently disable your membership with this service.' // The message to display on the "confirm removal" popup modal

};
```

### Remove Membership Success
The page shown after a user successfully removes their membership.

```js
portalOptions.labels.memberRemoveSuccess: {
	heading: 'Your account has been removed.', // The heading
	main: 'Enjoy the rest of your day!' // The message
};
```

### No Access
The page shown when user doesn't have access to the content.

```js
portalOptions.labels.noAccess: {
	heading: 'You don\'t have access to this content', // The heading
	main: '<p>If you\'re not logged in yet, try <a href="{{path.signin};};">logging in</a> or <a href="{{path.register};};">registering for an account</a>.</p>' // The message
};
```

### Primary Navigation Menu
The primary navigation menu.

```js
portalOptions.labels.primaryNav: {
	toggle: 'Menu'
};
```

### User Profile
The user profile page.

```js
portalOptions.labels.profile: {

	// Headings
	heading: '{{mashery.username};};', // The primary heading
	headingUserInfo: 'User Information', // The "User Information" subheading
	headingActivity: 'Recent Activity', // The "User Activity" subheading

	// Content
	userWebsite: 'Website:', // The user website label
	userBlog: 'Blog:', // The user blog label
	userRegistered: 'Registered:' // The label for the date the user registered

};
```

### User Registration
The user registration page.

```js
portalOptions.labels.register: {

	// Primary Content
	heading: 'Register for an Account', // The heading
	main: '<p>Register a new Mashery ID to access {{mashery.area};};.</p>', // The message above the form
	privacyPolicy: '', // A custom privacy policy link or message [optional]

	// The sidebar content
	sidebar:	'<h2>No Spam Guarantee</h2>' +
				'<p>We hate spam. We love our users. We promise to never sell or share any of your private information.</p>',

	// Labels
	submit: 'Register' // The submit button text @todo: does not work yet
};
```

### User Registration: Email Sent
The registration email confirmation page.

```js
portalOptions.labels.registerSent: {
	heading: 'Registration Almost Complete' // The heading
};
```

### User Registration: Email Resend
The page to request a new registration confirmation email.

```js
portalOptions.labels.registerResend: {
	heading: 'Resend Your Confirmation Email', // The heading
	main: '<p>Enter your username and email address to have your registration confirmation email resent to you.</p>' // The message above the form
};
```

### User Registration: Email Resent
The page after a registration confirmation email was successfully resent.

```js
portalOptions.labels.registerResendSuccess: {
	heading: 'Success', // The heading
	main: 'Your confirmation email was resent.' // The message
};
```

### Search
Search form and results content.

```js
portalOptions.labels.search: {

	// Search form
	button: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><title>Search</title><path d="M31.008 27.231l-7.58-6.447c-.784-.705-1.622-1.029-2.299-.998a11.954 11.954 0 0 0 2.87-7.787c0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12c2.972 0 5.691-1.081 7.787-2.87-.031.677.293 1.515.998 2.299l6.447 7.58c1.104 1.226 2.907 1.33 4.007.23s.997-2.903-.23-4.007zM12 20a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"/></svg>', // The search for button text
	placeholder: 'Search...', // The search form placeholder attribute text

	// Search results
	heading: 'Search Results for "{{content.query};};"', // The search results page heading
	headingNew: 'Search',
	meta: 'Showing {{content.first};}; to {{content.last};}; of {{content.total};}; results for "{{content.query};};"', // The meta data to show above search results
	noResults: 'Your search for "{{content.query};};" returned no results.', // The message to display when no results are found
	pagePrevious: '&larr; Previous Page', // The previous page link
	pageNext: 'Next Page &rarr;', // The next page link
	pageDivider: ' | ' // The divider between the previous and next page links
};
```

### Reveal Key Secret
The page to request that key secrets are shown.

```js
portalOptions.labels.showSecret: {
	heading: 'Email Sent',
	main: '<p>An email has been sent to the email address associated with your account. Click on the link in the email to display all of your shared secrets for 30 days. Please check your spam folder if you don\'t see it in your inbox.</p>'
};
```

### Reveal Key Secret: Success
The page to confirm key secrets have been displayed.

```js
portalOptions.labels.showSecretSuccess: {
	heading: 'Your shared secrets are now visible',
	main: '<p>Shared secrets will be visible for the next 30 days. After 30 days, they will be hidden again for PCI compliance.</p>'
};
```

### Reveal Key Secret: Already Visible
The page shown when key secrets are already visible.

```js
portalOptions.labels.showSecretError: {
	heading: 'Your shared secrets are already visible',
	main: '<p><a href="{{path.keys};};">Click here</a> to view them.</p>'
};
```

### Sign In
The sign in page.

```js
portalOptions.labels.signin: {

	// Content
	heading: 'Sign In', // The heading
	main: '<p>Sign in to {{mashery.area};}; using your Mashery ID.</p>', // The message above the sign in form

	// The sidebar content
	sidebar:	'<h2>Register</h2>' +
				'<p><a href="{{path.register};};">Create an account</a> to access stagingcs9.mashery.com. Your account information can then be used to access other APIs on the Mashery API Network.</p>' +

				'<h2>What is Mashery?</h2>' +
				'<p><a href="http://mashery.com">Mashery</a> powers APIs of leading brands in retail, media, business services, software, and more. By signing in to a Mashery powered portal, you can gain access to Mashery\'s base of API providers. All with a single Mashery ID.</p>' +

				'<p><a class="btn btn-user-register" id="btn-user-register" href="{{path.register};};">Register a Mashery ID</a></p>',

	// Labels
	submit: 'Sign In', // The submit button text @todo: does not work yet

};
```

### Title Attribute
Displayed in the web browser tab.

```js
portalOptions.labels.title: '{{mashery.title};}; | {{mashery.area};};';
```

### User Navigation
The navigation menu where users sign in, register, view their account, and log out.
```js
portalOptions.labels.userNav: {

	// Logged Out
	signin: 'Sign In', // "Sign In" link
	register: 'Register', // "Register" link

	// Logged In
	account: 'My Account', // "My Account" link
	dashboard: 'Dashboard', // "Dashboard" link (for admins only)
	signout: 'Sign Out', // "Sign Out" link

};
```