<!-- Pick your layout, add plugins and components, and customize the color palette to match your brand. Layout and color changes will automatically live preview on this site. -->

Themes are pre-bundled [labels, templates, and plugins](/docs/read/customizing) that help you build an awesome Portal more quickly.

Pick your layout, and add plugins and components. In a future version, you'll also be able to customize the color palette and see a live preview of your theme.

<div class="row">
	<div class="grid-third text-right-large">
		Compression Level:
	</div>
	<div class="grid-two-thirds">
		<radiogroup>
			<label>
				<input type="radio" name="compression" value="development" checked>
				Development <span class="text-no-bold">(<em>unminified</em>)</span>
			</label>
			<label>
				<input type="radio" name="compression" value="production">
				Production <span class="text-no-bold">(<em>minified</em>)
			</label>
		</radiogroup>
	</div>
</div>

## 1. Pick your layout.

<div class="row">
	<div class="grid-third margin-bottom">
		<label>
			<img title="Default Theme" src="/files/sparrow.jpg"><br>
			<input type="radio" name="layout" value="default" checked>
			Default
		</label>
	</div>
	<div class="grid-third margin-bottom">
		<label>
			<img title="Blackbeard Theme" src="/files/blackbeard.jpg"><br>
			<input type="radio" name="layout" value="blackbeard">
			Blackbeard
		</label>
	</div>
	<div class="grid-third margin-bottom">
		<label>
			<img title="Skinny Nav Theme" src="/files/skinny-nav.jpg"><br>
			<input type="radio" name="layout" value="skinny-nav">
			Skinny Nav
		</label>
	</div>
</div>


## 2. Add components and plugins.

<div class="row margin-bottom">
	<div class="grid-half">
		<label>
			<input type="checkbox" class="has-js has-events" name="plugins" value="astro">
			<a target="_blank" href="/docs/read/plugins/ExpandandCollapse_Mobile_Navigation">Expand-and-Collapse Mobile Navigation</a>
		</label>
		<label>
			<input type="checkbox" class="has-js" name="plugins" value="githubDocs">
			<a target="_blank" href="/docs/plugins/GitHubHosted_Documentation">GitHub-Hosted Documentation</a>
		</label>
		<label>
			<input type="checkbox" class="has-js has-events" name="plugins" value="fluidvids">
			<a target="_blank" href="/docs/plugins/Responsive_Videos">Responsive iFrame Videos</a>
		</label>
		<label>
			<input type="checkbox" class="has-css" name="plugins" value="images">
			<a target="_blank" href="/docs/plugins/Images_Styles">Image Styles</a> <em class="text-no-bold text-muted">(round, border, photograph)</em>
		</label>
	</div>
	<div class="grid-half">
		<label>
			<input type="checkbox" class="has-css has-events" name="plugins" value="conditional-content">
			Conditional Content <em class="text-no-bold text-muted">(logged-in/logged-out)</em>
		</label>
		<label>
			<input type="checkbox" class="has-css has-js has-events" name="plugins" value="houdini">
			Expand-and-Collapse/Accordions
		</label>
		<label>
			<input type="checkbox" class="has-js has-events" name="plugins" value="smooth-scroll">
			Smooth Scroll
		</label>
		<label>
			<input type="checkbox" class="" name="plugins" value="">
			Plugin Name
		</label>
	</div>
</div>


<!-- ## 3. Customize your colors.

Must be a valid CSS color attribute (examples: `#000`, `rgb(0, 0, 0)`, `rgba(0, 0, 0, 0.65)`).

<div class="row margin-bottom-small">
	<div class="grid-half">
		<label for="">Name of Thing</label>
		<input type="text" name="" id="color-picker">

		<label for="">Name of Thing</label>
		<input type="text" name="" id="">

		<label for="">Name of Thing</label>
		<input type="text" name="" id="">

		<label for="">Name of Thing</label>
		<input type="text" name="" id="">
	</div>
	<div class="grid-half">
		<label for="">Name of Thing</label>
		<input type="text" name="" id="">

		<label for="">Name of Thing</label>
		<input type="text" name="" id="">

		<label for="">Name of Thing</label>
		<input type="text" name="" id="">

		<label for="">Name of Thing</label>
		<input type="text" name="" id="">
	</div>
</div> -->


## 3. Download your files.

<div id="download-size"></div>

<a class="btn btn-large disabled" id="download-custom-js" target="_blank" href="#" download="blackbeard.js">Download JavaScript</a> <a class="btn btn-large btn-secondary disabled" id="download-custom-css" target="_blank" href="#" download="blackbeard.css">Download CSS</a>


## 4. Setup your Portal.

### 4a. First, add the core Blackbeard files to your site.

Use this staging site as a faux CDN. These files will be moving to core after the beta test, and this step will go away.

**Header JS File**

```
https://stagingcs1.mashery.com/files/placeholders.min.beta.js
```

**Body JS File**

```
https://stagingcs1.mashery.com/files/app.min.beta.js
```

**Body JS Inline**

```js
// Initialize the portal after the file loads
// The event listener hack is required because the inline JS loads *before* the external file does
window.addEventListener('portalLoaded', function () {
	m$.init(portalOptions);
}, false);
```

### 4b. Next, load your theme styles.

Upload your CSS file via the File Manager in Control Center. Then go to `Manage > Portal > Portal Settings`, and link to it under the `Custom CSS Files` section.

### 4c. Finally, load and initialize your JavaScript.

Copy-and-paste the following code into one of the `Inline JavaScript` sections under `Manage > Portal > Portal Settings` in control center.

<pre class="lang-javascript"><code id="download-init">// No initialization needed...</code></pre>