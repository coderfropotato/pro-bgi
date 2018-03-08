var gulp = require('gulp'),                                     // gulp

    argv = require('yargs').argv,                               // 获取命令行参数
    concat = require('gulp-concat'),                            // 文件连接
    rename = require('gulp-rename'),                            // 文件重命名
    notify = require('gulp-notify'),                            // gulp调用系统通知
    del = require('del'),                                       // 清理

    amdOptimize = require("amd-optimize"),                      // AMD自动导入
    minifyHTML = require('gulp-minify-html'),                   // 压缩HTML
    uglify = require('gulp-uglify'),                            // 压缩js

    rev = require('gulp-rev'),                                  // 生成MD5
    revCollector = require('gulp-rev-collector'),               // 替换文件
    modules = require('../modules.json'),
    rna16s = modules.rna16s;

// 设置部署目录与环境一致
var env = argv.env || 'production';
argv.build = env;

/**
 * 任务：rna16s
 * 作用：提示压缩rna16s模块成功，并清理打包之后的其他无用JS
 * 依赖任务：rna16s:html-rev，保证index.html中的images、CSS、JS路径被替换
 */
gulp.task('rna16s', ['rna16s:html-rev'], function () {
    return gulp.src('').pipe(notify('压缩rna16s文件夹成功！')).on('end', function () {
        del([argv.build + rna16s.js.dest + '/*.js', '!' + argv.build + rna16s.js.dest + '/RNA16sMain-*.js']);
    });
});

/**
 * 任务：rna16s:html-rev
 * 作用：替换index.html中images、CSS和JS路径，并进行压缩
 * 依赖任务：rna16s:js-rev，保证rna16s模块的所有非homeMain.js的JS被压缩，并替换其中的HTML路径
 */
gulp.task('rna16s:html-rev', ['rna16s:js-rev'], function () {
    return gulp.src([modules.rev + '/rev-common-images.json', modules.rev + '/rev-common-css.json',
    modules.rev + '/rev-rna16s-css.json', modules.rev + '/rev-rna16s-main-js.json', modules.rev + '/rev-rna16s-images.json'].concat(rna16s.html.main))
        .pipe(revCollector({ replaceReved: true }))
        .pipe(minifyHTML({
            empty: true,
            spare: true
        }))
        .pipe(gulp.dest(argv.build + rna16s.html.dest));
})

/**
 * 任务：rna16s:js-rev
 * 作用：替换rna16s模块中homeMain.js中引用的所有HTML和图片
 * 依赖任务：rna16s:amd，必须保证homeMain.js已执行AMD导入
 */
gulp.task('rna16s:js-rev', ['rna16s:amd'], function () {
    return gulp.src([modules.rev + '/rev-rna16s-html.json', rna16s.js.main.replace('webroot', argv.build)])
        .pipe(revCollector({ replaceReved: true }))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest(argv.build + rna16s.js.dest))
        .pipe(rev.manifest({ merge: true }))
        .pipe(rename('rev-rna16s-main-js.json'))
        .pipe(gulp.dest(modules.rev));
})

/**
 * 任务：rna16s:amd
 * 作用：AMD导入，生成homeMain.js
 * 依赖任务：rna16s:html，可以不依赖，这里是为了方便处理
 */
gulp.task('rna16s:amd', ['rna16s:html'], function () {
    return gulp.src(rna16s.js.src)
        .pipe(gulp.dest(argv.build + rna16s.js.dest))
        .pipe(amdOptimize(rna16s.js.module, {
            configFile: rna16s.js.main,
            baseUrl: argv.build + '/',
            paths: {
              "d3": "empty:"
            }
        }))
        .pipe(concat(rna16s.js.file))
        .pipe(gulp.dest(argv.build + rna16s.js.dest));
});

/**
 * 任务：rna16s:html
 * 作用：提供rna16s模块非主页面的所有页面中图片和CSS路径，并对页面进行压缩
 * 依赖任务：clean:rna16s，清理文件夹
 */
gulp.task('rna16s:html', ['clean:rna16s'], function () {
    return gulp.src([modules.rev + '/rev-rna16s-images.json'].concat(rna16s.html.src))
        .pipe(revCollector({ replaceReved: true }))
        .pipe(minifyHTML({
            empty: true,
            spare: true
        }))
        .pipe(rev())
        .pipe(gulp.dest(argv.build + rna16s.html.dest))
        .pipe(rev.manifest({ merge: true }))
        .pipe(rename('rev-rna16s-html.json'))
        .pipe(gulp.dest(modules.rev));
})

/**
 * 任务：clean:rna16s
 * 作用：清理原来生成的rna16s模块下的HTML和JS文件
 */
gulp.task('clean:rna16s', function () {
    return gulp.src(rna16s.js.del.map(function (value) {
        return argv.build + value;
    }));
});