var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    notify = require('gulp-notify'),
    argv = require('yargs').argv,
    del = require('del'),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector'),
    rename = require('gulp-rename'),

    uglify = require('gulp-uglify'),
    minifyHTML = require('gulp-minify-html'),

    modules = require('../modules.json'),
    include = modules.include;

// 设置部署目录与环境一致
var env = argv.env || 'production';
argv.build = env;

/**
 * 任务：include
 * 作用：提示include文件夹压缩成功
 * 依赖任务：include:js，必须保证config.js中的路径被替换
 */
gulp.task('include', ['include:js'], function () {
    return gulp.src('').pipe(notify('压缩include文件夹成功！'));
})

/**
 * 任务：include:js
 * 作用：替换config.js中引用的HTML路径，并进行压缩
 * 依赖任务：include:html，必须保证在替换JS中HTML路径之前保证HTML被压缩
 */
gulp.task('include:js', ['include:html'], function () {
    var array = include.js.src.map(function (value) {
        return argv.build + value;
    });
    return gulp.src([modules.rev + '/rev-include-html.json'].concat(array))
        .pipe(revCollector({ replaceReved: true }))
        .pipe(uglify())
        .pipe(gulp.dest(argv.build + include.js.dest));
});

/**
 * 任务：include:html
 * 作用：压缩include文件夹下所有HTML文件
 * 依赖任务：clean:include，必须保证在压缩HTML文件之前，替换其中图片和CSS的路径
 */
gulp.task('include:html', ['clean:include'], function () {
    return gulp.src([modules.rev + '/rev-*-images.json', modules.rev + '/rev-*-css.json'].concat(include.html.src))
        .pipe(revCollector({ replaceReved: true }))
        .pipe(minifyHTML({
            empty: true,
            spare: true
        }))
        .pipe(rev())
        .pipe(gulp.dest(argv.build + include.html.dest))
        .pipe(rev.manifest({ merge: true }))
        .pipe(rename('rev-include-html.json'))
        .pipe(gulp.dest(modules.rev));
});

/**
 * 任务：clean:include
 * 作用：清理include文件夹下面的HTML文件
 * 依赖任务：必须保证API路径、文件复制以及CSS压缩都已经成功
 */
gulp.task('clean:include', ['css', 'copy', 'env'], function () {
    return del(argv.build + include.html.dest);
})