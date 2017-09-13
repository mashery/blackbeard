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
	var savedCache = sessionStorage.getItem('portalCustomizerCache');
	var cache = savedCache ? JSON.parse(savedCache) : {};
	var minified, layout, plugins, scripts, styles, inits, events, scriptsSize, stylesSize, timerID;


	//
	// Methods
	//

	var createInits = function () {

		// Generate code
		var code = '';
		if (inits.length > 0) {
			code += inits;
		}
		if (events.length > 0) {
			code +=
				'\n\n' +
				"window.addEventListener('portalAfterRender', function () {" + '\n' +
					events +
				'}, false)';
		}

		// If no code, indicate this...
		if (code.length < 1) {
			initCode.innerHTML = '// No initialization needed...';
			return;
		}

		// Escape brackets and inject
		initCode.innerHTML = code.replace(new RegExp('<', 'g'), '&lt;').replace(new RegExp('>', 'g'), '&gt;').trim();

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

		plugins.forEach(function (plugin) {

			// Get the plugin name
			var pluginName = plugin.getAttribute('value');

			// If plugin has inits
			if (plugin.classList.contains('has-inits')) {
				if (cache[baseURL + 'inits/' + pluginName + '.js']) {

					// Create inits
					inits += cache[baseURL + 'inits/' + pluginName + '.js'] + '\n\n';

					// Render initialization code
					createInits();

				} else {

					// Get initialization code
					atomic.ajax({
						url: baseURL + 'inits/' + pluginName + '.js'
					}).success(function (data) {

						// Create inits
						cache[baseURL + 'inits/' + pluginName + '.js'] = atob(data.content);
						inits += cache[baseURL + 'inits/' + pluginName + '.js'] + '\n\n';
						sessionStorage.setItem('portalCustomizerCache', JSON.stringify(cache));

						// Render initialization code
						createInits();

					}).error(function (data) {
						// Render initialization code
						createInits();
						console.error(pluginName + ' wasn\'t found');
					});

				}
			} else {
				// Render initialization code
				createInits();
			}

			// If plugin has event listeners
			if (plugin.classList.contains('has-events')) {
				if (cache[baseURL + 'events/' + pluginName + '.js']) {

					// Create inits
					events += '\t' + cache[baseURL + 'events/' + pluginName + '.js'].replace(new RegExp('\n', 'g'), '\n\t') + '\n';

					// Render initialization code
					createInits();

				} else {

					// Get event action
					atomic.ajax({
						url: baseURL + 'events/' + pluginName + '.js'
					}).success(function (data) {

						// Create inits
						cache[baseURL + 'events/' + pluginName + '.js'] = atob(data.content);
						events += '\t' + cache[baseURL + 'events/' + pluginName + '.js'].replace(new RegExp('\n', 'g'), '\n\t') + '\n';
						sessionStorage.setItem('portalCustomizerCache', JSON.stringify(cache));

						// Render initialization code
						createInits();

					}).error(function (data) {
						// Render initialization code
						createInits();
						console.error(pluginName + ' wasn\'t found');
					});

				}
			} else {
				// Render initialization code
				createInits();
			}

		});

	};

	var getThemeInits = function () {
		if (cache[baseURL + 'inits/' + layout + '.js']) {

			// Create styles
			inits = cache[baseURL + 'inits/' + layout + '.js'];

			// Add any plugins
			getPluginInits();

		} else {

			atomic.ajax({
				url: baseURL + 'inits/' + layout + '.js'
			}).success(function (data) {

				// Create styles
				cache[baseURL + 'inits/' + layout + '.js'] = atob(data.content);
				inits = cache[baseURL + 'inits/' + layout + '.js'];
				sessionStorage.setItem('portalCustomizerCache', JSON.stringify(cache));

				// Add any plugins
				getPluginInits();

			}).error(function (data) {
				// Add any plugins
				getPluginInits();
				console.error(layout + ' wasn\'t found');
			});

		}
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

	var getOverrides = function () {
		if (cache[baseURL + 'css/overrides' + minified + '.css']) {

			// Create scripts
			styles += cache[baseURL + 'css/overrides' + minified + '.css'].styles;
			stylesSize += cache[baseURL + 'css/overrides' + minified + '.css'].size;

			// Update the download button
			createDownload(btnCSS, styles);

		} else {

			atomic.ajax({
				url: baseURL + 'css/overrides' + minified + '.css'
			}).success(function (data) {

				// Create scripts
				cache[baseURL + 'css/overrides' + minified + '.css'] = {
					styles: atob(data.content),
					size: data.size
				};
				styles += cache[baseURL + 'css/overrides' + minified + '.css'].styles;
				stylesSize += cache[baseURL + 'css/overrides' + minified + '.css'].size;
				sessionStorage.setItem('portalCustomizerCache', JSON.stringify(cache));

				// Update the download button
				createDownload(btnCSS, styles);

			}).error(function (data) {
				// @todo
			});

		}
	};

	var getPlugins = function () {

		// If no plugins are selected, update buttons immediately
		if (plugins.length < 1) {
			createDownload(btnJS, scripts);
			createDownload(btnCSS, styles);
			getOverrides();
			return;
		}

		// Otherwise, get the plugins
		var last = plugins.length - 1;
		plugins.forEach(function (plugin, index) {

			// Get the plugin name
			var pluginName = plugin.getAttribute('value');

			// Get scripts
			if (plugin.classList.contains('has-js')) {
				if (cache[baseURL + 'js/' + pluginName + minified + '.js']) {

					// Create scripts
					scripts += cache[baseURL + 'js/' + pluginName + minified + '.js'].scripts;
					scriptsSize += cache[baseURL + 'js/' + pluginName + minified + '.js'].size;

					// Update the download button
					createDownload(btnJS, scripts);

				} else {

					atomic.ajax({
						url: baseURL + 'js/' + pluginName + minified + '.js'
					}).success(function (data) {

						// Create scripts
						cache[baseURL + 'js/' + pluginName + minified + '.js'] = {
							scripts: atob(data.content),
							size: data.size
						};
						scripts += cache[baseURL + 'js/' + pluginName + minified + '.js'].scripts;
						scriptsSize += cache[baseURL + 'js/' + pluginName + minified + '.js'].size;
						sessionStorage.setItem('portalCustomizerCache', JSON.stringify(cache));

						// Update the download button
						createDownload(btnJS, scripts);

					}).error(function (data) {
						// @todo
					});

				}
			} else {
				// Update the download button
				createDownload(btnJS, scripts);
			}

			// Get styles
			if (plugin.classList.contains('has-css')) {
				if (cache[baseURL + 'css/' + pluginName + minified + '.css']) {

					// Create scripts
					styles += cache[baseURL + 'css/' + pluginName + minified + '.css'].styles;
					stylesSize += cache[baseURL + 'css/' + pluginName + minified + '.css'].size;

					// Update the download button
					createDownload(btnCSS, styles);

				} else {

					atomic.ajax({
						url: baseURL + 'css/' + pluginName + minified + '.css'
					}).success(function (data) {

						// Create scripts
						cache[baseURL + 'css/' + pluginName + minified + '.css'] = {
							styles: atob(data.content),
							size: data.size
						};
						styles += cache[baseURL + 'css/' + pluginName + minified + '.css'].styles;
						stylesSize += cache[baseURL + 'css/' + pluginName + minified + '.css'].size;
						sessionStorage.setItem('portalCustomizerCache', JSON.stringify(cache));

						// Update the download button
						createDownload(btnCSS, styles);

					}).error(function (data) {
						// @todo
					});

				}
			} else {
				// Update the download button
				createDownload(btnCSS, styles);
			}

			if (index === last) {
				getOverrides();
			}

		});

	};

	var getLayout = function () {
		if (cache[baseURL + 'css/' + layout + minified + '.css']) {

			// Create styles
			styles = cache[baseURL + 'css/' + layout + minified + '.css'].styles;
			stylesSize += cache[baseURL + 'css/' + layout + minified + '.css'].size;

			// Add any plugins
			getPlugins();

		} else {

			atomic.ajax({
				url: baseURL + 'css/' + layout + minified + '.css'
			}).success(function (data) {

				// Create styles
				cache[baseURL + 'css/' + layout + minified + '.css'] = {
					styles: atob(data.content),
					size: data.size
				};
				styles = cache[baseURL + 'css/' + layout + minified + '.css'].styles;
				stylesSize += cache[baseURL + 'css/' + layout + minified + '.css'].size;
				sessionStorage.setItem('portalCustomizerCache', JSON.stringify(cache));

				// Add any plugins
				getPlugins();

			}).error(function (data) {
				// @todo
			});

		}
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
		events = '';
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