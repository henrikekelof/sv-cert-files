/*global console, require, process */

( function () {

    'use strict';

    var dir,
        files,
        path          = require( 'path' ),
        gulp          = require( 'gulp' ),
        rename        = require( 'gulp-rename' ),
        concat        = require( 'gulp-concat' ),
        connect       = require( 'gulp-connect' ),
        sass          = require( 'gulp-sass' ),
        inlineBase64  = require( 'gulp-inline-base64' ),
        lodashBuilder = require( 'gulp-lodash-builder' ),
        jshint        = require( 'gulp-jshint' ),
        jscs          = require( 'gulp-jscs' ),
        uglify        = require( 'gulp-uglify' ),
        autoprefixer  = require( 'gulp-autoprefixer' ),
        cssnano       = require( 'gulp-cssnano' ),
        minifyInline  = require( 'gulp-minify-inline' );

    dir = {

        dist    : 'dist',
        scss    : '_scss',
        assets  : '_assets/', // Must use ending slash
        hintedjs: '_js/site',
        sitejs  : [
            '_js/site/pre.js',
            '_js/site/modules/**/*.js',
            '_js/site/post.js'
        ],
        lodash  : '_build/lodash.custom.js',
        libjs   : [
            '_js/lib/polyfills.js',
            '_js/lib/jquery-plugins.custom.js',
            '_js/lib/fastclick.js'
        ]

    };

    files = {

        scss   : 'site.scss',
        scssmin: 'site.min.scss',

        css   : 'site.css',
        cssmin: 'site.min.css',

        sitejs: 'ours.js',
        libjs : 'theirs.js',
        js    : 'site.js',
        jsmin : 'site.min.js'

    };

    //----- Building CSS -----//

    function buildCss( inputStream ) {
        return inputStream
            .pipe( sass( {
                outputStyle: 'nested'
            } ).on( 'error', sass.logError ) )
            .pipe( inlineBase64( {
                baseDir: dir.assets,
                maxSize: 1,
                debug  : true
            } ) )
            .pipe( autoprefixer( {
                browsers: [ 'last 2 versions' ],
                cascade : false
            } ) );

    }

    gulp.task( 'css', function () {
        return buildCss( gulp.src( path.join( dir.scss, files.scss ) ) )
            .pipe( gulp.dest( dir.dist ) );
    } );

    gulp.task( 'cssmin', function () {
        return buildCss( gulp.src( path.join( dir.scss, files.scssmin ) ) )
            .pipe( cssnano() )
            .pipe( gulp.dest( dir.dist ) );
    } );


    //----- Minifying Velocity HEAD -----//

    gulp.task( 'minify-head', function () {
        gulp.src( '_resources/tillagg-i-HEAD.vm' )
            .pipe( minifyInline() )
            .pipe( gulp.dest( '_build/' ) );
    } );


    //----- Building JS -----//

    gulp.task( 'jshint', function () {
        return gulp.src( path.join( dir.hintedjs, '/**/*.js' ) )
                   .pipe( jshint( '.jshintrc' ) )
                   .pipe( jshint.reporter( 'jshint-stylish' ) )
                   .pipe( jshint.reporter( 'fail' ) );
    } );

    gulp.task( 'jscs', function () {
        return gulp.src( path.join( dir.hintedjs, '/**/*.js' ) )
                   .pipe( jscs() )
                   .pipe( jscs.reporter() );
    } );

    gulp.task( 'lodash', function () {
        return gulp.src( dir.sitejs, {
                       buffer: false
                   } )
                   .pipe( lodashBuilder( {
                       target  : dir.lodash,
                       settings: {}
                   } ) )
                   .on( 'error', function ( err ) {
                       console.log( 'err: ', err )
                   } );
    } );

    gulp.task( 'libjs', [ 'lodash' ], function () {
        // Add lodash to lib build
        var libjs = dir.libjs;
        libjs.unshift( dir.lodash );
        return gulp.src( libjs )
                   .pipe( concat( files.libjs ) )
                   .pipe( gulp.dest( dir.dist ) );
    } );

    gulp.task( 'sitejs', function () {
        return gulp.src( dir.sitejs )
                   .pipe( concat( files.sitejs ) )
                   .pipe( gulp.dest( dir.dist ) );
    } );

    gulp.task( 'js', [ 'sitejs', 'libjs' ], function () {
        return gulp.src( [
                       _dist( files.libjs ),
                       _dist( files.sitejs )
                   ] )
                   .pipe( concat( files.js ) )
                   .pipe( gulp.dest( dir.dist ) );
    } );

    gulp.task( 'jsfast', [ 'sitejs' ], function () {
        return gulp.src( [
                       _dist( files.libjs ),
                       _dist( files.sitejs )
                   ] )
                   .pipe( concat( files.js ) )
                   .pipe( gulp.dest( dir.dist ) );
    } );

    gulp.task( 'jsmin', [ 'jshint', 'jscs', 'js' ], function () {
        return gulp.src( [
                       _dist( files.js )
                   ] )
                   .pipe( rename( files.jsmin ) )
                   .pipe( uglify() )
                   .pipe( gulp.dest( dir.dist ) );

    } );

    //----- Watch -----//

    gulp.task( 'connect', function () {
        connect.server( {
            root      : dir.dist,
            livereload: false
        } );
    } );

    gulp.task( 'watch', [ 'css', 'js', 'connect' ], function () {
        gulp.watch( path.join( dir.hintedjs, '/**/*.js' ), [ 'jsfast' ] );
        gulp.watch( dir.libjs, [ 'js' ] );
        gulp.watch( path.join( dir.scss, '/**/*.scss' ), [ 'css' ] );
    } );


    //----- Build for prod -----//

    gulp.task( 'stage', [ 'jsmin', 'cssmin', 'minify-head' ] );


    gulp.task( 'default', [ 'stage' ] );


    //----- Helpers -----//

    function _dist( file ) {
        return path.join( dir.dist, file );
    }

}() );


