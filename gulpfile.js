/**
 * Settings
 */

var settings = {
	scripts: true,		// Turn on/off script tasks
	styles: true,		// Turn on/off style tasks
	svgs: true,			// Turn on/off SVG tasks
	images: true,		// Turn on/off image tasks
	static: true,		// Turn on/off static file copying
	docs: true,			// Turn on/off documentation generation
	cacheBust: true		// Turn on/off cache busting (adds a version number to minified files)
};


/**
 * Gulp Packages
 */

// General
var gulp = require('gulp');
var fs = require('fs');
var del = require('del');
var exec = require('child_process').exec;
var lazypipe = require('lazypipe');
var plumber = require('gulp-plumber');
var flatten = require('gulp-flatten');
var tap = require('gulp-tap');
var rename = require('gulp-rename');
var header = require('gulp-header');
var footer = require('gulp-footer');
var watch = require('gulp-watch');
var livereload = require('gulp-livereload');
var package = require('./package.json');
var s3 = require( "gulp-s3" );
var properties = require ("properties");


// Scripts
var jshint = settings.scripts ? require('gulp-jshint') : null;
var stylish = settings.scripts ? require('jshint-stylish') : null;
var concat = settings.scripts ? require('gulp-concat') : null;
var uglify = settings.scripts ? require('gulp-uglify') : null;
var optimizejs = settings.scripts ? require('gulp-optimize-js') : null;

// Styles
var sass = settings.styles ? require('gulp-sass') : null;
var prefix = settings.styles ? require('gulp-autoprefixer') : null;
var minify = settings.styles ? require('gulp-cssnano') : null;

// SVGs
var svgmin = settings.svgs ? require('gulp-svgmin') : null;

// Docs
// var markdown = settings.docs ? require('gulp-markdown') : null;
// var fileinclude = settings.docs ? require('gulp-file-include') : null;

/**
 * Paths to project folders
 */

var paths = {
	input: 'src/**/*',
	output: 'dist/',
	scripts: {
		input: 'src/js/*',
		output: 'dist/js/'
	},
	styles: {
		input: 'src/sass/**/*.{scss,sass}',
		output: 'dist/css/'
	},
	svgs: {
		input: 'src/svg/*',
		output: 'dist/svg/'
	},
	images: {
		input: 'src/img/*',
		output: 'dist/img/'
	},
	static: {
		input: 'src/static/*/**',
		output: 'dist/'
	},
	docs: {
		input: 'src/docs/**',
		output: 'docs/'
		// templates: 'src/docs/_templates/',
		// assets: 'src/docs/assets/**'
	}
};


/**
 * Template for banner to add to file headers
 */

var banner = {
	full :
		'/*!\n' +
		' * <%= package.name %> v<%= package.version %>: <%= package.description %>\n' +
		' * (c) ' + new Date().getFullYear() + ' <%= package.author.name %>\n' +
		' * <%= package.license %> License\n' +
		' * <%= package.repository.url %>\n' +
		' */\n\n',
	min :
		'/*!' +
		' <%= package.name %> v<%= package.version %>' +
		' | (c) ' + new Date().getFullYear() + ' <%= package.author.name %>' +
		' | <%= package.license %> License' +
		' | <%= package.repository.url %>' +
		' */\n'
};


/**
 * Gulp Tasks
 */

// Lint, minify, and concatenate scripts
gulp.task('build:scripts', ['clean:dist'], function() {
	if ( !settings.scripts ) return;

	var fileVersion = settings.cacheBust ? '.' + package.version : '';

	var jsTasks = lazypipe()
		.pipe(header, banner.min, { package : package })
		.pipe(optimizejs)
		.pipe(gulp.dest, paths.scripts.output)
		.pipe(rename, { suffix: '.min' + fileVersion })
		.pipe(uglify, {output: {comments: /^!/}})
		.pipe(optimizejs)
		// .pipe(header, banner.min, { package : package })
		.pipe(gulp.dest, paths.scripts.output);

	return gulp.src(paths.scripts.input)
		.pipe(plumber())
		.pipe(tap(function (file, t) {
			if ( file.isDirectory() ) {
				var name = file.relative + '.js';
				return gulp.src(file.path + '/*.js')
					.pipe(concat(name))
					.pipe(jsTasks());
			}
		}))
		.pipe(jsTasks());
});

// Process, lint, and minify Sass files
gulp.task('build:styles', ['clean:dist'], function() {
	if ( !settings.styles ) return;

	var fileVersion = settings.cacheBust ? '.' + package.version : '';

	return gulp.src(paths.styles.input)
		.pipe(plumber())
		.pipe(sass({
			outputStyle: 'expanded',
			sourceComments: true
		}))
		.pipe(flatten())
		.pipe(prefix({
			browsers: ['last 2 version', '> 1%'],
			cascade: true,
			remove: true
		}))
		.pipe(header(banner.min, { package : package }))
		.pipe(gulp.dest(paths.styles.output))
		.pipe(rename({ suffix: '.min' + fileVersion }))
		.pipe(minify())
		// .pipe(header(banner.min, { package : package }))
		.pipe(gulp.dest(paths.styles.output));
});

// Generate SVG sprites
gulp.task('build:svgs', ['clean:dist'], function () {
	if ( !settings.svgs ) return;

	return gulp.src(paths.svgs.input)
		.pipe(plumber())
		.pipe(svgmin())
		.pipe(gulp.dest(paths.svgs.output));
});

// Copy image files into output folder
gulp.task('build:images', ['clean:dist'], function() {
	if ( !settings.images ) return;

	return gulp.src(paths.images.input)
		.pipe(plumber())
		.pipe(gulp.dest(paths.images.output));
});

// Copy static files into output folder
gulp.task('build:static', ['clean:dist'], function() {
	if ( !settings.static ) return;

	return gulp.src(paths.static.input)
		.pipe(plumber())
		.pipe(gulp.dest(paths.static.output));
});

// Lint scripts
gulp.task('lint:scripts', function () {
	if ( !settings.scripts ) return;

	return gulp.src(paths.scripts.input)
		.pipe(plumber())
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

// Remove pre-existing content from output folders
gulp.task('clean:dist', function () {
	del.sync([
		paths.output
	]);
});

// Generate documentation
gulp.task('build:docs', ['compile', 'clean:docs'], function() {
	if ( !settings.docs ) return;

	return gulp.src(paths.docs.input)
		.pipe(plumber())
		.pipe(gulp.dest(paths.docs.output));
});

// Copy distribution files to docs
gulp.task('copy:dist', ['compile', 'clean:docs'], function() {
	if ( !settings.docs ) return;

	return gulp.src(paths.output + '/**')
		.pipe(plumber())
		.pipe(gulp.dest(paths.docs.output + '/dist'));
});

// Copy documentation assets to docs
// gulp.task('copy:assets', ['clean:docs'], function() {
// 	if ( !settings.docs ) return;

// 	return gulp.src(paths.docs.assets)
// 		.pipe(plumber())
// 		.pipe(gulp.dest(paths.docs.output + '/assets'));
// });

// Remove prexisting content from docs folder
gulp.task('clean:docs', function () {
	if ( !settings.docs ) return;
	return del.sync(paths.docs.output);
});

// Spin up livereload server and listen for file changes
gulp.task('listen', function () {
	livereload.listen();
	gulp.watch(paths.input).on('change', function(file) {
		gulp.start('default');
		gulp.start('refresh');
	});
});

// Run livereload after file change
gulp.task('refresh', ['compile', 'docs'], function () {
	livereload.changed();
});


/**
 * Task Runners
 */

// Compile files
gulp.task('compile', [
	'lint:scripts',
	'clean:dist',
	'build:scripts',
	'build:styles',
	'build:images',
	'build:static',
	'build:svgs'
]);

// Generate documentation
gulp.task('docs', [
	'clean:docs',
	'build:docs',
	// 'copy:dist',
	// 'copy:assets'
]);

// Compile files and generate docs (default)
gulp.task('default', [
	'compile',
	'docs'
]);

// Compile files and generate docs when something changes
gulp.task('watch', [
	'listen',
	'default'
]);

gulp.task('deploy:dist', function () {
	properties.parse ("/etc/mashery/conf/secure.conf", { sections: true, path: true, comments: ";", separators: "=", strict: true}, function (error, obj){
	  	if (error) return console.error (error);
  		var AWS = obj['Mashery_Developer_Portal'];
  		console.log(AWS);
    	return gulp.src( paths.output + '/**' )
    	.pipe( s3( AWS ) );
    });
});

gulp.task('deploy', [
    'deploy:dist'
]);
