# Hosting Documentation on GitHub

You can now host your documentation on GitHub&mdash;taking advantage of its markdown support and version control features&mdash;and display it dynamically on your Mashery Portal.

To make this work, we'll use Blackbeard's [event hooks](/docs/read/customizing/Events) and [custom JavaScript globals](/docs/read/customizing/hooks#custom-globals) with the [GitHub Content API](https://developer.github.com/v3/repos/contents/).

## Getting Started

### 1. Add githubDocs.js to your site

githubDocs.js is a tiny little helper script that fetches content from GitHub via the Content API, base64 decodes it, converts any markdown into HTML, and injects it into the DOM.

Add it in Control Center under `Manage > Portal > Portal Settings` in one of the inline JavaScript sections.

```js
var githubDocs = function (options) {

	// Polyfill for window.atob()
	if (!('atob' in window)) {
		!function () { function e(e) { this.message = e } var t = "undefined" != typeof exports ? exports : "undefined" != typeof self ? self : $.global, r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="; e.prototype = new Error, e.prototype.name = "InvalidCharacterError", t.btoa || (t.btoa = function (t) { for (var o, n, a = String(t), i = 0, f = r, c = ""; a.charAt(0 | i) || (f = "=", i % 1); c += f.charAt(63 & o >> 8 - i % 1 * 8)) { if (n = a.charCodeAt(i += .75), n > 255) throw new e("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range."); o = o << 8 | n } return c }), t.atob || (t.atob = function (t) { var o = String(t).replace(/[=]+$/, ""); if (o.length % 4 == 1) throw new e("'atob' failed: The string to be decoded is not correctly encoded."); for (var n, a, i = 0, f = 0, c = ""; a = o.charAt(f++); ~a && (n = i % 4 ? 64 * n + a : a, i++ % 4) ? c += String.fromCharCode(255 & n >> (-2 * i & 6)) : 0)a = r.indexOf(a); return c }) }();
	}

	// Sanity check
	if (!window.mashery.globals.github) return;

	// Variables
	var defaults = {
		selector: '.content',
		user: null,
		repo: null,
		root: '',
		runScripts: false,
		loading: '<p>Loading...</p>',
		failMessage: '<p>Unable to load content. Visit <a target="_blank" href="https://github.com/mashery/blackbeard/tree/master/docs/' + mashery.globals.github + '">https://github.com/mashery/blackbeard/tree/master/docs/' + mashery.globals.github + '</a> to view the documentation.</p>'
	}
	var settings = m$.extend(defaults, options || {});
	if (!settings.user || !settings.repo) return;
	var main = document.querySelector(settings.selector);
	if (!main) return;

	// Add loading text
	main.innerHTML = settings.loading;

	// Get the docs
	atomic.ajax({
		url: 'https://api.github.com/repos/' + settings.user + '/' + settings.repo + '/contents/' + settings.root + mashery.globals.github
	}).success(function (data) {

		// Convert markdown to HTML
		markdown = new showdown.Converter();
		markdown.setFlavor('github');
		main.innerHTML = markdown.makeHtml(window.atob(data.content));

		// If inline scripts should be run, run them
		if (settings.runScripts) {
			main.querySelectorAll('script').forEach(function (script) {
				var func = new Function(script.innerHTML);
				func();
			});
		}

		// Fix the location
		m$.fixLocation();

		// Syntax highlight code
		if ('Prism' in window) {
			Prism.highlightAll();
		}

		m$.emitEvent('portalGitHubRenderAfter');

	}).error(function (data) {
		main.innerHTML = settings.failMessage;
		m$.emitEvent('portalGitHubRenderFail');
	});

};
```

### 2. Setup an event listener

To load our content as quickly as possible, we'll run our `githubDocs()` method as soon as the main content is rendered.

```js
window.addEventListener('portalRenderMainAfter', function () {
	githubDocs();
}, false);
```

### 3. Add your options

The `githubDocs()` method accepts a few options, passed in as an object (`{}`).

There are only two required options: `user` and `repo`. These should point to the GitHub username and repository, respectively, of the project to pull content from. Exclude any others that you'd like to use the default for.

```js
githubDocs({
	selector: '.content', // The selector for the container to render the content in
	user: null, // The GitHub username for the repository
	repo: null, // The GitHub repository to get content from
	root: '', // The root directory to use in the project
	runScripts: false, // If true, run any in-content scripts after loading the content
	loading: '<p>Loading...</p>', // Text to display while loading content from GitHub
	failMessage: '<p>Unable to load content. Visit <a target="_blank" href="https://github.com/mashery/blackbeard/tree/master/docs/' + mashery.globals.github + '">https://github.com/mashery/blackbeard/tree/master/docs/' + mashery.globals.github + '</a> to view the documentation.</p>' // Text to display if the GitHub API returns an error
});
```

### 4. Point to your content

In Control Center under `Manage > Content`, click on the page you'd like to render from GitHub. Uncheck "Use TinyMCE", and add an inline script with a [global script hook](/docs/read/customizing/hooks) named `github`.

It should be a string that points to the content path in your project (within the `root` directory if you specified one).

```html
<script>
	mashery.globals.github = 'path/to/your/content.md';
</script>
```

And that's it!

## An Example

Here's an example from the Blackbeard demo Portal.

**Setup**

```js
window.addEventListener('portalAfterRenderMain', function () {
	githubDocs({
		user: 'mashery',
		repo: 'blackbeard',
		root: 'docs/' // The root directory for all of my documentation
	});
}, false);
```

**On This Page**

```html
<script>
	// Points to https://github.com/mashery/blackbeard/tree/master/docs/extras/github.md
	// The /docs in the URL is automatically added because I set it as my root for the project
	mashery.globals.github = 'extras/github.md';
</script>
```

## Event Hooks

githubDocs.js emits two custom events.

- `portalGitHubRenderAfter` runs after content is rendered.
- `portalGitHubRenderFail` runs if the GitHub Content API returns with an error.

You can these to run additional scripts if desired.