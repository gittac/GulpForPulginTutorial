
var gulp = require('gulp');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var autoprefixer = require( 'gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var watch = require('gulp-watch');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');


//Variables for Style 
var styleSRC = 'src/scss/mstyle.scss';
var styleDIST = './assets/';
//Variables for the JS 
var jsSRC = 'src/js/';
var jsScript = 'script.js';
//var theapp = 'app.js'
var jsFiles = [jsScript];
var jsDIST = './assets/js/';

//Variables for the watch command 
var styleWatch = 'src/scss/**/*.scss';
var jsWatch = 'src/js/**/*.js';

//Task style converts from SCSS (SASS) to regular CSS files 
gulp.task('style', function(){
    return gulp.src(styleSRC)
        .pipe(sourcemaps.init())
        .pipe(sass({
            errorLogToConsole: true,
            outputStyle: 'compressed'
        }) )
        .on('error',console.error.bind(console))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        //.pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(styleDIST));
});

//Task JS converts from JS es6 to regular JS 
gulp.task('js', function(done){
    jsFiles.map(function(entry){
        return browserify({entries: [jsSRC+entry]})
        .transform(babelify, {presets:['@babel/env']})
        .bundle()
        .pipe(source(entry))
        .pipe(rename({extname:'.min.js'}))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe( gulp.dest( jsDIST) );
    }); 
    done();
});

//Whtn you run gulp your run the default task it will run style and js tasks. 
gulp.task('default',gulp.series(['style', 'js']));

//Watch will keep running working for changes in src/js or src/js folders then run either style or js tasks when a change happens
gulp.task('w',gulp.series(['default'], function(){
    gulp.watch(styleWatch,gulp.parallel(['style']));
    gulp.watch(jsWatch,gulp.parallel(['js']));
}));