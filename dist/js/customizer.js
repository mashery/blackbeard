/*!
 * blackbeard vbeta: Future portal layout
 * (c) 2017 Chris Ferdinandi
 * LicenseRef-All Rights Reserved License
 * http://github.com/mashery/blackbeard
 */

/**
 * Customize Blackbeard Downloads
 */
var customizer = function () {

	'use strict';

	//
	// Variables
	//

	var baseURL = 'https://api.github.com/repos/mashery/blackbeard/contents/dist/';
	var btnJS = document.querySelector('#download-custom-js');
	var btnCSS = document.querySelector('#download-custom-css');
	var size = document.querySelector('#download-size');
	var initCode = document.querySelector('#download-init');
	var minified, layout, plugins, scripts, styles, inits, scriptsSize, stylesSize, timerID;


	//
	// Methods
	//

	var createInits = function () {

		// If no inits are needed, indicate this...
		if (inits.length < 1) {
			initCode.innerHTML = '// No initialization needed...';
			return;
		}

		// Inject code
		initCode.innerHTML = inits.replace(new RegExp('<', 'g'), '&lt;').replace(new RegExp('>', 'g'), '&gt;');

		// Highlight code
		if ('Prism' in window) {
			Prism.highlightAll();
		}

	};

	var getPluginInits = function () {

		// If no plugins are selected, create initialization code immediately
		if (plugins.length < 1) {
			createInits();
			return;
		}

		plugins.forEach((function (plugin) {

			// Get the plugin name
			var pluginName = plugin.getAttribute('value');

			// Make sure plugin has inits
			if (plugin.classList.contains('has-inits')) {
				// Get initialization code
				atomic.ajax({
					url: baseURL + 'inits/' + pluginName + '.js'
				}).success((function (data) {

					// Create inits
					inits += atob(data.content);

					// Render initialization code
					createInits();

				})).error((function (data) {
					// @todo
				}));
			} else {
				// Render initialization code
				createInits();
			}

		}));

	};

	var getThemeInits = function () {

		atomic.ajax({
			url: baseURL + 'inits/' + layout + '.js'
		}).success((function (data) {

			// Create styles
			inits = atob(data.content);

			// Add any plugins
			getPluginInits();

		})).error((function (data) {
			// @todo
		}));

	};

	var prettySize = function (size) {
		return Math.round(100 * size / 1024) / 100 + 'kb';
	};

	var displayDownloadSize = function () {
		var total = scriptsSize + stylesSize;
		var percentJS = Math.round(100 * scriptsSize / total) + '%';
		var percentCSS = Math.round(100 * stylesSize / total) + '%';
		size.innerHTML = '<p>Total Filesize: <strong>' + prettySize(total) + '</strong> (' + percentJS + ' JavaScript and ' + percentCSS + ' CSS)</p>';
	};

	var createDownload = function (btn, code) {

		// If there's no code to download
		if (code.length < 1) {
			btn.innerHTML = 'No ' + (btn.id === 'download-custom-js' ? 'JavaScript' : 'CSS') + ' Needed';
			return;
		}

		// Update button
		btn.classList.remove('disabled');
		btn.href = 'data:application/octet-stream;charset=utf-8,' + encodeURIComponent(code);
		btn.innerHTML = 'Download ' + (btn.id === 'download-custom-js' ? 'JavaScript' : 'CSS');
		btn.download = layout + minified + (btn.id === 'download-custom-js' ? '.js' : '.css');
		displayDownloadSize();

	};

	var setGeneratingStatus = function () {

		// Scripts
		btnJS.classList.add('disabled');
		btnJS.href = '';
		btnJS.innerHTML = 'Generating...';

		// Styles
		btnCSS.classList.add('disabled');
		btnCSS.href = '';
		btnCSS.innerHTML = 'Generating...';

		// Download Size
		size.innerHTML = '';

		// Initialization Code
		initCode.innerHTML = 'Generating...';

	};

	var getPlugins = function () {

		// If no plugins are selected, update buttons immediately
		if (plugins.length < 1) {
			createDownload(btnJS, scripts);
			createDownload(btnCSS, styles);
			return;
		}

		// Otherwise, get the plugins
		plugins.forEach((function (plugin) {

			// Get the plugin name
			var pluginName = plugin.getAttribute('value');

			// Get scripts
			if (plugin.classList.contains('has-js')) {
				atomic.ajax({
					url: baseURL + 'js/' + pluginName + minified + '.js'
				}).success((function (data) {

					// Create scripts
					scripts += atob(data.content);
					scriptsSize += data.size;

					// Update the download button
					createDownload(btnJS, scripts);

				})).error((function (data) {
					// @todo
				}));
			} else {
				// Update the download button
				createDownload(btnJS, scripts);
			}

			// Get styles
			if (plugin.classList.contains('has-css')) {
				atomic.ajax({
					url: baseURL + 'css/' + pluginName + minified + '.css'
				}).success((function (data) {

					// Create scripts
					styles += atob(data.content);
					stylesSize += data.size;

					// Update the download button
					createDownload(btnCSS, styles);

				})).error((function (data) {
					// @todo
				}));
			} else {
				// Update the download button
				createDownload(btnCSS, styles);
			}

		}));

	};

	var getLayout = function () {

		atomic.ajax({
			url: baseURL + 'css/' + layout + minified + '.css'
		}).success((function (data) {

			// Create styles
			styles = atob(data.content);
			stylesSize += data.size;

			// Add any plugins
			getPlugins();

		})).error((function (data) {
			// @todo
		}));

	};

	var generateCode = function () {

		// Temporarily disable download buttons
		setGeneratingStatus();

		// Check if code should be minified or not
		minified = document.querySelector('input[name="compression"]:checked').getAttribute('value') === 'production' ? '.min.beta' : '';

		// Get the layout and plugins
		layout = document.querySelector('input[name="layout"]:checked').getAttribute('value');
		plugins = document.querySelectorAll('input[name="plugins"]:checked');

		// Reset scripts and styles
		scripts = '';
		styles = '';
		inits = '';
		scriptsSize = 0;
		stylesSize = 0;

		// Get the layout code
		getLayout();

		// Get initialization code
		getThemeInits();

	};

	var generateCodeDebounce = function () {
		if (timerID) {
			clearTimeout(timerID);
		}
		timerID = setTimeout(generateCode, 500);
	};

	/**
	 * Handle click events
	 * @param {Event} event  The click event
	 */
	var clickHandler = function (event) {

		// Only run on customizer options
		if (!event.target.closest('input[name="compression"], input[name="layout"], input[name="plugins"]')) return;

		// Get the theme and components
		generateCodeDebounce();

	};

	// If not the customizer page, remove event listeners and bail
	if (!btnJS || !btnCSS) {
		document.removeEventListener('click', clickHandler, false);
		return;
	}

	// Handle events
	document.addEventListener('click', clickHandler, false);
	// document.addEventListener('change', changeHandler, false);

	// Setup initial files
	generateCodeDebounce();

};