var gulp = require('gulp'),
    less = require('gulp-less'),
    csso = require('gulp-csso'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    replace = require('gulp-replace'),
    imagemin = require('gulp-imagemin'),
    autoprefixer = require('gulp-autoprefixer');

// 默认监听
gulp.task('default', function () {
    gulp.watch('css/*.less', ['less']);
});

// 编译Less
gulp.task('less', function () {
    return gulp.src('css/*.less')
        .pipe(less())
        .pipe(autoprefixer({
            browsers: [
                'Explorer >= 9',
                'Firefox >= 30',
                'Chrome >= 36',
                'Safari >= 7',
                'iOS >= 7',
                'Android >= 4'
            ],
            cascade: false
        }))
        .pipe(gulp.dest('css'));
});

// 图片压缩
gulp.task('image', function () {
    return gulp.src('images/*')
        .pipe(imagemin({
            optimizationLevel: 2
        }))
        .pipe(gulp.dest('dist/images'));
});

// 整体打包
gulp.task('dist', ['less', 'image'], function () {
    gulp.src(['*.mp4', '*.mp3'])
        .pipe(gulp.dest('dist'));

    return gulp.src('*.html')
        .pipe(usemin({
            css: [csso()],
            js: [uglify()],
            zeptojs: [uglify()]
        }))
        // .pipe(replace(/..\/images/ig, 'images'))
        .pipe(gulp.dest('dist'));
});