# Options & Settings

Blackbeard let's you customize and configure a variety of options using the `portalOptions` JavaScript variable.

All of the available options and settings are detailed alphabetically below.

## Customizing Options

When v1.x of Blackbeard goes live, these will be set under `Manage > Portal > Portal Settings` in the inline JavaScript area.

For now, you can test their functionality by opening up the Console tab of Developer Tools in your browser and doing the following:

0. Copy/paste your desired options into the console and hit enter.
0. Paste `m$.setOptions(portalOptions)` in the console and hit enter to update Blackbeard's default settings.
0. Paste `m$.renderPortal()` in the console and hit enter to re-render the site.

### Example

You can copy/paste this into the console in developer tools. It will add a logo.

```js
// Update the labels
portalOptions.logo = '<img height="44" width="180" alt="Mashery" src="https://support.mashery.com/files/tibco-mashery.jpg">';

// Update the settings with our new options
m$.setOptions(portalOptions);

// Re-render the Portal
m$.renderPortal();
```

## The Options

## Ajax page loads
Whether to load pages async or with a page reload

```js
// If true, use Ajax
portalOptions.ajax: true;

// Selectors to ignore if clicked.
// Accepts any valid CSS selector.
// Use comma separated list for multiple selectors.
portalOptions.ajaxIgnore: null;

// Text to display in title while loading page
portalOptions.ajaxLoading: 'Loading...';
```

### Active Page Class
Class for links that point to the current page. This is applied to links in the primary, secondary, and user navigation menus, as well as the documentation submenu on documentation pages.

```js
portalOptions.currentPageClass: 'current-page';
```

### Favicon
Add a favicon/tab icon for your Portal.

```js
// If true, inject a favicon
portalOptions.favicon: false;

// The favicon URL
portalOptions.faviconURL: '/files/favicon.ico';

// The favicon sizes
portalOptions.faviconSizes: '16x16 32x32';
```

### Load Files
The files to load when the Portal renders. Useful when loading more than one CSS or JavaScript file.

*__Note:__ These are loaded asynchronously without any dependency managements. If you're loading multiple files and one is dependant on the other, please use the `m$.loadCSS()` and `m$.loadJS()` helper methods [documented under the JavaScript API](/docs/read/customizing/API).*

```js
// CSS (loaded in header)
portalOptions.loadCSS: [];

// JS loaded before render
portalOptions.loadJSHeader: [];

// JS loaded after render
portalOptions.loadJSFooter: [];
```

### Logo
Add a custom logo. Accepts any markup as a string (<img src>, <svg>, etc.).

```js
portalOptions.logo: null;
```

### Markdown
If true, enable markdown on docs and custom pages.

```js
portalOptions.markdown: true;
```

### Tooltips
If true, activate mashtip tooltips on certain Account page elements.

```js
portalOptions.mashtips: true;
```

### Password Strength
If true, provide a password strength indicator on registration and password change pages.

```js
portalOptions.passwordStrength: true;
```

### Responsive Design
If true, include the viewport resizing meta tag required for responsively designed sites.

```js
portalOptions.responsive: true;
```