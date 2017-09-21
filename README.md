# Blackbeard
A modern, JavaScript-driven Mashery portal rendering engine. [View the documentation.](https://stagingcs1.mashery.com/)

## File Structure

Compiled and production-ready code can be found in the `dist` directory. The `src` directory contains development code. Compiled documentation is in the `docs` directory. Unit tests are located in the `test` directory.

```
Blackbeard
|—— dist/
|   |—— css/
|   |   |—— placeholders.css
|   |   |—— placeholders.min.{version}.css
|   |—— img/
|   |   |—— # Your image files
|   |—— js/
|   |   |—— app.js
|   |   |—— app.min.{version}.js
|   |   |—— iodocs-vanilla.js
|   |   |—— iodocs-vanilla.min.{version}.js
|   |   |—— placeholders.js
|   |   |—— placeholders.min.{version}.js
|   |   |—— prism.js
|   |   |—— prism.min.{version}.js
|—— src/
|   |—— js/
|   |   |—— app
|   |   |   |—— # The primary application files and polyfills
|   |   |—— placeholders
|   |   |   |—— # The initialization code
|   |   |—— iodocs-vanilla.js
|   |   |—— prism.js
|   |—— sass/
|   |   |—— _config.scss
|   |   |—— _mixins.scss
|   |   |—— placeholders.scss
|   |—— static/
|   |   |—— # Static files and folders
|—— README.md
|—— gulpfile.js
|—— package.json
```


## Working with the Source Files

### Dependencies

Make sure these are installed first.

- [Node.js](http://nodejs.org/)
- [Gulp](http://gulpjs.com/)</a> `sudo npm install -g gulp`


### Quick Start

- In bash/terminal/command line, `cd` into the `Blackbeard` directory.
- Run `npm install` to install the required files.
- When it's done installing, run one of the task runners to get going:
	- `gulp` manually compiles files.
	- `gulp watch` automatically compiles files and applies changes using <a href="">[LiveReload](http://livereload.com/).


### Working with Sass

The Blackbeard Sass files are located in `src` > `sass`. Blackbeard's build system generates minified and unminified CSS files. It also includes [autoprefixer](https://github.com/postcss/autoprefixer), which adds vendor prefixes for you if required by the last two versions of a browser (you can configure browser support in `gulpfile.js`).

Minified versions receive a cache-busting version number.

#### `_config.scss`

The `_config.scss` file contains variables for all of the colors, font stacks, breakpoints, and sizing used in Blackbeard. At present, they're largely unused, but may be implemented into a broader stylesheet at a future date.

```scss
// Colors
$color-primary: #0088cc;
$color-secondary: #ffdd2f;
$color-tertiary: #b4d253;
$color-mashery: #a42032;
$color-black: #272727;
$color-white: #ffffff;

$color-code: #dd1144; // Fuscia
$color-rss: #e06c33; // Orange

$color-alert: #0888cd; // Blue
$color-success: #99B247; // Green
$color-warning: #dba909; // Yellow
$color-danger: #880e14; // Red

$color-gray-dark: #808080;
$color-gray-light: #e5e5e5;
$color-gray-lighter: #f7f7f7;

$color-get: #0088cc; // Blue
$color-post: #377f31; // Green
$color-put: #dba909; // Yellow
$color-delete: #880e14; // Red
$color-patch: #860d8e; // Purple
$color-options: #cc7100; // Orange
$color-head: #00557f; // Dark Blue


// Font Stacks
$font-primary: "Helvetica Neue", Arial, sans-serif;
$font-secondary: Georgia, Times, serif;
$font-monospace: Menlo, Monaco, "Courier New", monospace;


// Breakpoints
$bp-xsmall: 20em;
$bp-small: 30em;
$bp-medium: 40em;
$bp-large: 60em;
$bp-xlarge: 80em;


// Sizing
$font-size: 100%;
$spacing: 1.5625em;
$container-width: 88%;
$container-width-wide: 96%;
$container-max-width: 80em;
$container-max-width-small: 50em;
```

#### `_mixins.scss`

The `_mixins.scss` file contains just a handful of mixins and functions to speed up development.

- `font-face` adds the `@font-face` property.
- `strip-unit` removes units (px, em, etc.) from numbers.
- `calc-em` converts pixels to ems.

`font-face` was forked from [Bourbon](http://bourbon.io/), the world's best Sass library.


### Working with JavaScript

Blackbeard's JavaScript files are located in the `src` > `js` directory.

Files placed directly in the `js` folder will compile directly to `dist` > `js` as both minified and unminified files. Files placed in subdirectories will also be concatenated into a single file.

For example, `detects` > `flexbox.js` and `detects` > `svg.js` would compile into `detects.js` in the `dist` > `js` directory.

### Working with Static Files

Files and folders placed in the `src` > `static` directory will be copied as-is into the `dist` directory.