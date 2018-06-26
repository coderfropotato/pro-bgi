var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    notify = require('gulp-notify'),
    argv = require('yargs').argv,
    del = require('del'),
    rev = require('gulp-rev'),
    rename = require('gulp-rename'),

    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    mergeStream = require('merge-stream'),
    modules = require('../modules.json');

// 设置部署目录与环境一致
var env = argv.env || 'production';
argv.build = env;

var customer = argv.customer || 'customer';

/**
 * 任务：images
 * 作用：提示用户图片压缩成功
 * 依赖任务：images:all，需在此之前对图片进行压缩
 */

gulp.task('images', ['images:all'], function() {
    return gulp.src('').pipe(notify('压缩图片成功！'));
});

/**
 * 任务：images:all
 * 作用：压缩图片，这里包括在线报告部分的图片和通用图片
 * 依赖任务：clean:images，删除原来压缩过的图片
 */
gulp.task('images:all', ['clean:images'], function() {
    var commonImages = mergeImages(modules.images.common.src, 'images/' + customer + '/**/*')
        .pipe(cache(imagemin()))
        .pipe(rev())
        .pipe(gulp.dest(argv.build + modules.images.common.dest))
        .pipe(rev.manifest({ merge: true }))
        .pipe(rename('rev-common-images.json'))
        .pipe(gulp.dest(modules.rev));

    var loginImages = mergeImages(modules.images.login.src, 'images/' + customer + '/**/*')
        .pipe(cache(imagemin()))
        .pipe(rev())
        .pipe(gulp.dest(argv.build + modules.images.login.dest))
        .pipe(rev.manifest({ merge: true }))
        .pipe(rename('rev-login-images.json'))
        .pipe(gulp.dest(modules.rev));

    var mrnaImages = mergeImages(modules.images.mrna.src, 'images/' + customer + '/**/*')
        .pipe(cache(imagemin()))
        .pipe(rev())
        .pipe(gulp.dest(argv.build + modules.images.mrna.dest))
        .pipe(rev.manifest({ merge: true }))
        .pipe(rename('rev-mrna-images.json'))
        .pipe(gulp.dest(modules.rev));

    var toolsImages = mergeImages(modules.images.tools.src, 'images/' + customer + '/**/*')
        .pipe(cache(imagemin()))
        .pipe(rev())
        .pipe(gulp.dest(argv.build + modules.images.tools.dest))
        .pipe(rev.manifest({ merge: true }))
        .pipe(rename('rev-tools-images.json'))
        .pipe(gulp.dest(modules.rev));

    return mergeStream(commonImages, loginImages, mrnaImages, toolsImages);
});

var mergeImages = function(src, customer) {
    return mergeStream(gulp.src(src), gulp.src(customer, {
        base: ''
    }))
}

/**
 * 任务：clean:images
 * 作用：删除原来压缩之后的图片
 */
gulp.task('clean:images', function() {
    return del([argv.build + modules.images.common.dest, argv.build + modules.images.login.dest, argv.build + modules.images.mrna.dest, argv.build + modules.images.tools.dest]);
})