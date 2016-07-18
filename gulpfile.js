// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var concat = require('gulp-concat');
var watch = require('gulp-watch');
var minify = require('gulp-minify');
var livereload = require('gulp-livereload');

var util = require('gulp-util');
var config = require('./gulp.config')();


gulp.task('vet', function () {
    log('Analyzing sources');
    return gulp
        .src(config.alljs)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
        //.pipe(jshint.reporter('jshint-stylish',{verbose:true}));

});

gulp.task('less',function () {
    log('Using LESS');
    return gulp
        .src(config.less)
        .pipe(less())
        .pipe(gulp.dest(config.dist));

});

gulp.task('less-watcher',function () {
    log('Always watching');
    gulp.watch([config.less],['less']);
});

gulp.task('concat-minify', function () {
   return gulp.src(config.alljs)
       .pipe(concat('concat.js'))
       .pipe(gulp.dest(config.dist))
       .pipe(minify())
       .pipe(gulp.dest(config.dist));

});
/*
// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(gulp.dest('dist/js'));
});
*/

gulp.task('mytask',function () {
});

gulp.task('production', ['vet', 'less', 'concat-minify']);

// Default Task
gulp.task('default', ['scripts','mytask']);


///////////////////
function  log(msg) {
    if(typeof (msg) ==='object'){
        for(var item in msg){
            if(msg.hasOwnProperty(item)){
                util.log(util.colors.blue(msg[item]));
            }
        }

    }else {
        util.log(util.colors.blue(msg));
    }
}