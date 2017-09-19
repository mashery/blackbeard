# Hosting Documentation on GitHub

You can now host your documentation on GitHub&mdash;taking advantage of its markdown support and version control features&mdash;and display it dynamically on your Mashery Portal.

This approach uses Blackbeard's [event hooks](/docs/read/customizing/Events) and [custom JavaScript globals](/docs/read/customizing/hooks#custom-globals) with the [GitHub Content API](https://developer.github.com/v3/repos/contents/).

## Getting Started

### 1. Define your GitHub options and details.

There are only two required options: `user` and `repo`. These should point to the GitHub username and repository, respectively, of the project to pull content from.

Exclude any other options from the list below to use the default.

```js
var githubDocsOptions = {
	selector: '.content', // The selector for the container to render the content in
	user: null, // The GitHub username for the repository
	repo: null, // The GitHub repository to get content from
	root: '', // The root directory to use in the project
	runScripts: false, // If true, run any in-content scripts after loading the content
	loading: '<p>Loading...</p>', // Text to display while loading content from GitHub
	failMessage: '<p>Unable to load content. Visit <a target="_blank" href="https://github.com/mashery/blackbeard/tree/master/docs/' + mashery.globals.github + '">https://github.com/mashery/blackbeard/tree/master/docs/' + mashery.globals.github + '</a> to view the documentation.</p>' // Text to display if the GitHub API returns an error
};
```

### 2. Initialize GitHub Docs.

Initialize GitHub Docs in a `portalAfterRender` event.

```js
window.addEventListener('portalAfterRender', function () {
	githubDocs(githubDocsOptions);
}, false);
```

### 3. Point to your content

In Control Center under `Manage > Content`, click on the page you'd like to render from GitHub. Uncheck "Use TinyMCE", and add an inline script with a [global script hook](/docs/read/customizing/hooks) named `github`.

It should be a string that points to the content path in your project (within the `root` directory if you specified one).

```html
<script>
	mashery.globals.github = 'path/to/your/content.md';
</script>
```

And that's it, you're done. Nice work!

## An Example

Here's an example from the Blackbeard demo Portal.

**Setup**

```js
var githubDocsOptions = {
	user: 'mashery',
	repo: 'blackbeard',
	root: 'docs/' // The root directory for all of my documentation
};

window.addEventListener('portalAfterRender', function () {
	githubDocs(githubDocsOptions);
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

- `portalAfterGitHubRender` runs after content is rendered.
- `portalAfterGitHubError` runs if the GitHub Content API returns with an error.

You can hook into these to run additional scripts if desired.


## Potential Issues

### No Search Integration

A known issue with this approach: content is not cached on our server and therefore not searchable via the built-in Portal search functionality.

You might try to get around this by including a brief description or some metadata in the body of your post in the Portal content editor. This content will be wiped out once the API data loads, but provides the internal search engine content to crawl and cache.

### GitHub API Limits

The GitHub Content API limits the number of transactions, and once exceeded, returns an error.

To prevent excessive API calls, GitHub Docs caches each piece of documentation locally for the current browser session with `sessionStorage`. That said, on a high-traffic site, it's still possible to exceed your limit and receive a content error. Users will instead be directed to visit the content on GitHub directly.