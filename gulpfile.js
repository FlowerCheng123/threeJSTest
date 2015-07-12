var gulp = require( 'gulp' )
,	concat = require( 'gulp-concat' )
,	uglify = require( 'gulp-uglify' )
,	rename = require( 'gulp-rename' )
,	livereload = require( 'gulp-livereload' )
,	connect = require( 'gulp-connect' )
;
gulp.task( 'connect', function() {
	connect.server( {
		root: 'app',
		port: 8888,
		livereload: true
	} );
} );

gulp.task( 'default', ['connect'] );

gulp.task( 'build', [
	'build-bower-css',
	'build-bower-script',
	'build-img',
	'build-font',
	'build-app-css',
	'build-app-script',
	'build-html'
]);