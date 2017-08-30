# Labels

Labels make it easy for you to change headlines, labels, and messages in your Portal without customizing the entire layout.

Labels are changed by setting a `portalOptions.labels` value for the desired label. All of the available labels and their options names are detailed alphabetically below.

## My Apps
The page displaying a users registered applications.

```js
// heading
portalOptions.labels.accountApps.heading = 'My Apps';

// The message to display when a user has no apps
portalOptions.labels.accountApps.noApps = 'You don\'t have any apps yet.';
```

## My Account = Email
The page where users can change their Mashery email address.

```js
// The heading
portalOptions.labels.accountEmail.heading = 'Change Email';
```

## My Account = Email Success
The layout for the page confirming email change was successful

```js
// the heading
portalOptions.labels.accountEmailSuccess.heading = 'Email Successfully Changed';

// The main content
portalOptions.labels.accountEmailSuccess.main = '<p>An email confirming your change has been sent to the address you provided with your username. Please check your spam folder if you don\'t see it in your inbox.</p>';
```

## My Keys
The page displaying a users API keys.

```js
// The heading
portalOptions.labels.accountKeys.heading = 'My API Keys';

// The message to display when a user has no keys
portalOptions.labels.accountKeys.noKeys = 'You don\'t have any keys yet.';

// The message to display when a user has no keys for a specific plan
portalOptions.labels.accountKeys.noPlanKeys = 'You have not been issued keys for this API.';
```

## My Account
The page where users can manage their Mashery Account details.

```js
// Heading
portalOptions.labels.accountManage.heading = 'Manage Account';

// The "Account Information" subheading
portalOptions.labels.accountManage.subheading = 'Account Information';
```

## Account Navigation
Labels for the account navigation menu

```js
// The account nav label for "My Keys"
portalOptions.labels.accountNav.keys = 'Keys';

// The account nav label for "My Applications"
portalOptions.labels.accountNav.apps = 'Applications';

// The account nav label for "Manage Account"
portalOptions.labels.accountNav.account = 'Manage Account';

// The account nav label for "Change Email"
portalOptions.labels.accountNav.changeEmail = 'Change Email';

// The account nav label for "Change Password"
portalOptions.labels.accountNav.changePassword = 'Change Password';

// The account nav label for "View My Profile"
portalOptions.labels.accountNav.viewProfile = 'View My Public Profile';

// The account nav label for "Remove Membership"
// {{mashery.area}} automatically renders as the name of your Mashery Portal area
portalOptions.labels.accountNav.removeMembership = 'Remove Membership from {{mashery.area}}'
```

## My Account: Password
The page where users can change their Mashery password.

```js
// The heading
portalOptions.labels.accountPassword.heading = 'Change Password';
```

## My Account: Password Success
The layout for the page after users have successfully changed their password.

```js
// The heading
portalOptions.labels.accountPasswordSuccess.heading = 'Password Successfully Changed';

// The main content
portalOptions.labels.accountPasswordSuccess.main = '<p>An email confirming your change has been sent to the address you provided with your username. If you use this account on other Mashery powered portals, remember to use your new password.</p>';
```

## Add App APIs
Add APIs to an application labels.

```js
portalOptions.labels.appAddAPIs.heading = 'Add APIs to this Application';
portalOptions.labels.appAddAPIs.application = 'Application:';
portalOptions.labels.appAddAPIs.created = 'Created:';
portalOptions.labels.appAddAPIs.api = 'API:';
portalOptions.labels.appAddAPIs.key = 'Key:';
portalOptions.labels.appAddAPIs.subheading = 'Add APIs';
```

## App Add APIs: Success
API keys successfully added to an app.

```js
// The heading
portalOptions.labels.appAddAPIsSuccess.heading = 'New API Keys Issued';

// The message
portalOptions.labels.appAddAPIsSuccess.main =
	'<p>An email has been sent to you with your key and application details. You can also view them at any time from the <a href="{{path.keys}}">My Account</a> page.</p>' +
	'<p>To get started using your API keys, dig into <a href="{{path.docs}}">our documentation</a>. We look forward to seeing what you create!</p>';
```

## Delete App
The page to delete an application.

```js
portalOptions.labels.appDelete.heading = 'Delete Your Application';
portalOptions.labels.appDelete.application = 'Application:';
portalOptions.labels.appDelete.created = 'Created:';
portalOptions.labels.appDelete.api = 'API:';
portalOptions.labels.appDelete.key = 'Key:';
portalOptions.labels.appDelete.subheading = 'Confirm Deletion';
portalOptions.labels.appDelete.main = '<p><strong>Are you sure you want to delete this application and all of its keys?</strong></p>';
portalOptions.labels.appDelete.confirm = 'Are you really sure you want to delete this application?'
```

## App Edit
The edit application page.

```js
// The heading
portalOptions.labels.appEdit.heading = 'Edit Your Application';

// The main content
portalOptions.labels.appEdit.main = '<p>Edit your details using the form below.</p>';
```

## App Registration
The page to register an application.

```js
// The heading
portalOptions.labels.appRegister.heading = 'Register an Application';

// The message shown above the form
portalOptions.labels.appRegister.main = '<p>Get a key and register your application using the form below to start working with our APIs.</p>';
```

## App Registration: Success
The page shown after an app has been successfully registered.

```js
// The heading
portalOptions.labels.appRegisterSuccess.heading = 'Your application was registered!';

// The message
portalOptions.labels.appRegisterSuccess.main:
	'<p>An email has been sent to you with your key and application details. You can also view them at any time from the <a href="{{path.keys}}">My Account</a> page.</p>' +
	'<p>To get started using your API keys, dig into <a href="{{path.docs}}">our documentation</a>. We look forward to seeing what you create!</p>';
```

## Contact
The contact form page.

```js
// The heading
portalOptions.labels.contact.heading = 'Contact Us';

// The message shown above the form
portalOptions.labels.contact.main = '<p>Contact us using the form below.</p>';
```

## Contact Success
The page shown after a contact form is successfully submitted.

```js
// The heading
portalOptions.labels.contactSuccess.heading = 'Thanks for your submission!';

// The message
portalOptions.labels.contactSuccess.main = 'Your message will be forwarded to the appropriate group.';
```

## Documentation
The layout for API documentation.

```js
// Label above the documentation navigation
portalOptions.labels.docs.subheading = 'In the Docs';
```

## 404
The 404 page.

```js
// The heading
portalOptions.labels.fourOhFour.heading = 'Unable to find this page';

// The message
portalOptions.labels.fourOhFour.main = '<p>We\'re unable to find this page. Sorry! Please check the URL, or contact us to report a broken link.</p>';
```

## IO Docs
The IO Docs page.

```js
// The heading
portalOptions.labels.ioDocs.heading = 'Interactive API';

// The message displayed before the content
portalOptions.labels.ioDocs.main = '<p>Test our API services with IO-Docs, our interactive API documentation.</p>';
```

## Join
The page shown to existing Mashery users signing in to a new area.

```js
// The heading
portalOptions.labels.join.heading = 'Join {{mashery.area}}';

// The message shown above the form
portalOptions.labels.join.main = '<p>Since you already have a Mashery account you don\'t have to register again, but we would like to know a little more about you. Please fill out the additional information below.</p>';
```

## Join: Success
The page shown after an existing Mashery user successfully joins a new area.

```js
// The heading
portalOptions.labels.joinSuccess.heading = 'Registration Successful';

// The success message
portalOptions.labels.joinSuccess.main = '<p>You have successfully registered as {{content.main}}. Read our <a href="/docs">API documentation</a> to get started. You can view your keys and applications under <a href="{{path.keys}}">My Account</a>.</p>';
```

## Key Activity
The page to view key activity reports.

```js
portalOptions.labels.keyActivity.heading = 'Key Activity';
portalOptions.labels.keyActivity.api = '{{content.api}}';
portalOptions.labels.keyActivity.application = 'Application:';
portalOptions.labels.keyActivity.key = 'Key:';
portalOptions.labels.keyActivity.secret = 'Secret:';
portalOptions.labels.keyActivity.status = 'Status:';
portalOptions.labels.keyActivity.created = 'Created:'
```

## Delete Key
The page to delete an API key

```js
portalOptions.labels.keyDelete.heading = 'Delete Your Key';
portalOptions.labels.keyDelete.api = '{{content.api}}';
portalOptions.labels.keyDelete.application = 'Application:';
portalOptions.labels.keyDelete.key = 'Key:';
portalOptions.labels.keyDelete.secret = 'Secret:';
portalOptions.labels.keyDelete.status = 'Status:';
portalOptions.labels.keyDelete.created = 'Created:';
portalOptions.labels.keyDelete.subheading = 'Confirm Deletion';
portalOptions.labels.keyDelete.main = '<p><strong>Are you sure you want to delete this key?</strong></p>';
portalOptions.labels.keyDelete.confirm = 'Are you really sure you want to delete this key?';
```

## Logout Success
The page shown after a user successfully logs out of the Portal.

```js
// The heading
portalOptions.labels.logout.heading = 'Signed Out';

// The message
portalOptions.labels.logout.main = 'You have successfully signed out. Come back soon!';
```

## Logout Fail
The page shown when a logout was unsuccessful.

```js
// The heading
portalOptions.labels.logoutFail.heading = 'Sign Out Failed';

// The message
portalOptions.labels.logoutFail.main = 'Your attempt to sign out failed. <a href="{{path.logout}}">Please try again.</a>';
```

## Lost Password Request
The page to request a password reset.

```js
// The heading
portalOptions.labels.lostPassword.heading = 'Recover Your Password';

// The message shown above the form
portalOptions.labels.lostPassword.main = '<p>Enter the email address and username that you registered with and we will send you a link to reset your password.</p>';
```

## Lost Password Reset
The page shown after a password reset email is sent to the user.

```js
// The heading
portalOptions.labels.lostPasswordReset.heading = 'Email Sent';

// The messsage
portalOptions.labels.lostPasswordReset.main = 'An email has been sent to the address you provided. Click on the link in the e-mail to reset your password. Please check your spam folder if you don\'t see it in your inbox.';
```

## Lost Username Request
The page to request a username recovery.

```js
// The heading
portalOptions.labels.lostUsername.heading = 'Recover Your Username';

// The message shown above the form
portalOptions.labels.lostUsername.main = '<p>Enter the email address you used to register and we will send you an email with your username.</p>';
```

## Lost Username Reset
The page shown after a username reset email is sent to the user.

```js
// The heading
portalOptions.labels.lostUsernameReset.heading = 'Email Sent';

// The message
portalOptions.labels.lostUsernameReset.main = 'An email has been sent containing your username details. Please check your spam folder if you don\'t see it in your inbox.';
```

## Remove Membership
The page for users to remove their membership from this Portal.

```js
/**
 * Content
 */

// The heading
portalOptions.labels.memberRemove.heading = 'Remove membership from {{mashery.area}}';

// The message
portalOptions.labels.memberRemove.main = 'Removing membership disables your account and you will not be able to register again using the same username. All your keys will be deactivated.';

/**
 * Labels
 */

// The "confirm remove membership" button label
portalOptions.labels.memberRemove.confirm = 'Remove Membership';

// The "cancel removal" button label
portalOptions.labels.memberRemove.cancel = 'Cancel';

// The message to display on the "confirm removal" popup modal
portalOptions.labels.memberRemove.popup = 'Please confirm that you wish to permanently disable your membership with this service.';
```

## Remove Membership Success
The page shown after a user successfully removes their membership.

```js
// The heading
portalOptions.labels.memberRemoveSuccess.heading = 'Your account has been removed.';

// The message
portalOptions.labels.memberRemoveSuccess.main = 'Enjoy the rest of your day!';
```

## No Access
The page shown when user doesn't have access to the content.

```js
// The heading
portalOptions.labels.noAccess.heading = 'You don\'t have access to this content';

// The message
portalOptions.labels.noAccess.main = '<p>If you\'re not logged in yet, try <a href="{{path.signin}}">logging in</a> or <a href="{{path.register}}">registering for an account</a>.</p>';
```


## Primary Navigation Menu
The primary navigation menu.

```js
// The label to toggle visibility on smaller viewports
portalOptions.labels.primaryNav.toggle = 'Menu';
```

## User Profile
The user profile page.

```js

/**
 * Headings
 */

// The primary heading
portalOptions.labels.profile.heading = '{{mashery.username}}';

// The "User Information" subheading
portalOptions.labels.profile.headingUserInfo = 'User Information';

// The "User Activity" subheading
portalOptions.labels.profile.headingActivity = 'Recent Activity';

/**
 * Content
 */

// The user website label
portalOptions.labels.profile.userWebsite = 'Website:';

// The user blog label
portalOptions.labels.profile.userBlog = 'Blog:';

// The label for the date the user registered
portalOptions.labels.profile.userRegistered = 'Registered:';
```

## User Registration
The user registration page.

```js
// The heading
portalOptions.labels.register.heading = 'Register for an Account';

// The message above the form
portalOptions.labels.register.main = '<p>Register a new Mashery ID to access {{mashery.area}}.</p>';

// A custom privacy policy link or message [optional]
portalOptions.labels.register.privacyPolicy = '';

// Sidebar content
portalOptions.labels.register.sidebar =
	'<h2>No Spam Guarantee</h2>' +
	'<p>We hate spam. We love our users. We promise to never sell or share any of your private information.</p>';

// Submit button label
// @todo: does not work yet
portalOptions.labels.register.submit = 'Register';
```

## User Registration: Email Sent
The registration email confirmation page.

```js
// The heading
portalOptions.labels.registerSent.heading = 'Registration Almost Complete';
```

## User Registration: Email Resend
The page to request a new registration confirmation email.

```js
// The heading
portalOptions.labels.registerResend.heading = 'Resend Your Confirmation Email';

// The message above the form
portalOptions.labels.registerResend.main = '<p>Enter your username and email address to have your registration confirmation email resent to you.</p>';
```


## User Registration: Email Resent
The page after a registration confirmation email was successfully resent.

```js
// The heading
portalOptions.labels.registerResendSuccess.heading = 'Success';

// The message
portalOptions.labels.registerResendSuccess.main = 'Your confirmation email was resent.';
```

## Search
Search form and results content.

```js
/**
 * Search Form
 */

// The search for button text
portalOptions.labels.search.button = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><title>Search</title><path d="M31.008 27.231l-7.58-6.447c-.784-.705-1.622-1.029-2.299-.998a11.954 11.954 0 0 0 2.87-7.787c0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12c2.972 0 5.691-1.081 7.787-2.87-.031.677.293 1.515.998 2.299l6.447 7.58c1.104 1.226 2.907 1.33 4.007.23s.997-2.903-.23-4.007zM12 20a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"/></svg>';

// The search form placeholder attribute text
portalOptions.labels.search.placeholder = 'Search...';

/**
 * Search Results
 */

// The search results page heading
portalOptions.labels.search.heading = 'Search Results for "{{content.query}}"';

// The heading when no search parameters are provided
portalOptions.labels.search.headingNew = 'Search';

// The meta data to show above search results
portalOptions.labels.search.meta = 'Showing {{content.first}} to {{content.last}} of {{content.total}} results for "{{content.query}}"';

// The message to display when no results are found
portalOptions.labels.search.noResults = 'Your search for "{{content.query}}" returned no results.';

// The previous page link
portalOptions.labels.search.pagePrevious = '&larr; Previous Page';

// The next page link
portalOptions.labels.search.pageNext = 'Next Page &rarr;';

// The divider between the previous and next page links
portalOptions.labels.search.pageDivider = ' | ';
```

## Reveal Key Secret
The page to request key secrets are shown.

```js
portalOptions.labels.showSecret.heading = 'Email Sent';
portalOptions.labels.showSecret.main = '<p>An email has been sent to the email address associated with your account. Click on the link in the email to display all of your shared secrets for 30 days. Please check your spam folder if you don\'t see it in your inbox.</p>'
```

## Reveal Key Secret: Success
The page to confirm key secrets have been displayed.

```js
portalOptions.labels.showSecretSuccess.heading = 'Your shared secrets are now visible';
portalOptions.labels.showSecretSuccess.main = '<p>Shared secrets will be visible for the next 30 days. After 30 days, they will be hidden again for PCI compliance.</p>'
```

## Reveal Key Secret: Already Visible
The page shown when key secrets are already visible.

```js
portalOptions.labels.showSecretError.heading = 'Your shared secrets are already visible';
portalOptions.labels.showSecretError.main = '<p><a href="{{path.keys}}">Click here</a> to view them.</p>'
```

## Sign In
The sign in page.

```js
// The heading
portalOptions.labels.signin.heading = 'Sign In';

// The message above the sign in form
portalOptions.labels.signin.main = '<p>Sign in to {{mashery.area}} using your Mashery ID.</p>';

// The sidebar content
portalOptions.labels.signin.sidebar =
	'<h2>Register</h2>' +
	'<p><a href="{{path.register}}">Create an account</a> to access stagingcs9.mashery.com. Your account information can then be used to access other APIs on the Mashery API Network.</p>' +

	'<h2>What is Mashery?</h2>' +
	'<p><a href="http://mashery.com">Mashery</a> powers APIs of leading brands in retail, media, business services, software, and more. By signing in to a Mashery powered portal, you can gain access to Mashery\'s base of API providers. All with a single Mashery ID.</p>' +

	'<p><a class="btn btn-user-register" id="btn-user-register" href="{{path.register}}">Register a Mashery ID</a></p>';

// The submit button text
// @todo: does not work yet
portalOptions.labels.signin.submit = 'Sign In';
```

## Title Attribute
Displayed in the web browser tab.

```js
// {{mashery.title}} automatically renders as the content from the page's H1 element
// {{mashery.area}} automatically renders as the name of your Mashery portal area
portalOptions.labels.title = '{{mashery.title}} | {{mashery.area}}';
```

## User Navigation
The navigation menu where users sign in, register, view their account, and log out.

```js
/**
 * Logged Out
 */

// "Sign In" link
portalOptions.labels.userNav.signin = 'Sign In';

// "Register" link
portalOptions.labels.userNav.register = 'Register';

/**
 * Signed In
 */

// "My Account" link
portalOptions.labels.userNav.account = 'My Account';

// "Dashboard" link (for admins only)
portalOptions.labels.userNav.dashboard = 'Dashboard';

// "Sign Out" link
portalOptions.labels.userNav.signout = 'Sign Out';
```