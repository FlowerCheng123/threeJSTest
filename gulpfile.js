var gulp = require( 'gulp' )
,	concat = require( 'gulp-concat' )
,	uglify = require( 'gulp-uglify' )
,	rename = require( 'gulp-rename' )
,	livereload = require( 'gulp-livereload' )
,	connect = require( 'gulp-connect' )
, mainBowerFiles = require( 'main-bower-files' )
, filter = require( 'gulp-filter' )
, minifycss = require( 'gulp-minify-css' )
, inject = require( 'gulp-inject' )
, imagemin = require( 'gulp-imagemin' )
, pngquant = require( 'imagemin-pngquant' )
, angularFilesort = require( 'gulp-angular-filesort' )
, minifyHTML = require( 'gulp-minify-html' )
, clean = require( 'gulp-clean' )
;
gulp.task( 'connect', function() {
	connect.server( {
		root: 'app',
		port: 8888,
		livereload: true
	} );
} );

gulp.task( 'html', function() {
	gulp.src( ['./app/**/*.html'] )
		.pipe( connect.reload() );
	gulp.src( ['./app/user/**/*.html'] )
		.pipe( connect.reload() );
} );

gulp.task( 'script', function() {
	gulp.src( ['./app/**/*.js'] )
		.pipe( connect.reload() );
	gulp.src( ['./app/user/**/*.js'] )
		.pipe( connect.reload() );
} );

gulp.task( 'css', function() {
	gulp.src( './app/**/*.css' )
		.pipe( connect.reload() );
	gulp.src( './app/user/**/*.css' )
		.pipe( connect.reload() );
} );

gulp.task( 'watch', function() {
	gulp.watch( './app/**/*.html', ['html'] );
	gulp.watch( './app/**/*.js', ['script'] );
	gulp.watch( './app/**/*.css', ['css'] );
	gulp.watch( './app/user/**/*.css', ['css'] );
	gulp.watch( './app/user/**/*.html', ['html'] );
	gulp.watch( './app/user/**/*.js', ['script'] );
} );

gulp.task( 'build-bower-script', function() {
	gulp.src( mainBowerFiles() )
			.pipe( filter( '*.js' ) )
			.pipe( concat( 'lib.min.js' ) )
			.pipe( uglify() )
			.pipe( gulp.dest( 'build/lib' ) );
} );

gulp.task( 'build-bower-css', function() {
	gulp.src( mainBowerFiles() )
			.pipe( filter( '*.css' ) )
			.pipe( concat( 'lib.min.css') )
			.pipe( minifycss() )
			.pipe( gulp.dest( 'build/lib') );
} );

gulp.task( 'build-font', function() {
	gulp.src( './app/bower_components/font-awesome/fonts/*.*' )
			.pipe( gulp.dest( 'build/fonts') );
} );

gulp.task( 'build-img', function() {
	gulp.src( './app/resource/image/*' )
			.pipe( imagemin( {
				progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
			} ) )
			.pipe( gulp.dest( 'build/resource/image' ) );
} );

var scriptPath = [
	'./app/app.js',
];

gulp.task( 'build-app-script', function() {
	gulp.src( scriptPath )
			.pipe( angularFilesort() )
			.pipe( concat( 'app.min.js' ) )
			// compression will change provider name
			//.pipe( uglify() )
			.pipe( gulp.dest( 'build' ) );
} );

var stylePath = [
	'./app/css/global.css',
	'./app/home/home.css',
	'./app/login/login.css',
	'./app/merchant/merchant.css',
	'./app/user/login/login.css'
];

gulp.task( 'build-app-css', function() {
	gulp.src( stylePath )
			.pipe( concat( 'app.min.css' ) )
			.pipe( minifycss() )
			.pipe( gulp.dest( 'build' ) );
} );

gulp.task( 'build-html', function() {
	gulp.src( ['app/**/*.html', '!app/index.html'],
					  { base: './app' } )
			.pipe( minifyHTML( {
				empty: true,
				conditionals: true,
				spare: true,
				quotes: true
			} ) )
			.pipe( gulp.dest( 'build' ) );

	gulp.src( 'build/index.html' )
			.pipe( inject( gulp.src( [
				'build/lib/lib.min.css',
				'build/lib/lib.min.js',
				'build/app.min.css',
				'build/app.min.js'
			], {read: false} ), {relative: true} ) )
			.pipe( gulp.dest( 'build' ) );
} );

gulp.task( 'clean-build', function() {
	gulp.src( ['build/*', '!build/index.html'], {read: false} )
			.pipe( clean() );
} );

var templatePath = [
	'./app/merchant/views/*.html'
];
gulp.task( 'template-cache', function() {
	gulp.src( templatePath )
			.pipe( templateCache() )
			.pipe( gulp.dest( './app/templates') );
} );

gulp.task( 'default', ['connect', 'watch'] );

gulp.task( 'build', [
	'build-bower-css',
	'build-bower-script',
	'build-img',
	'build-font',
	'build-app-css',
	'build-app-script',
	'build-html'
]);