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
    dnaReseq = modules.dnaReseq;

// 设置部署目录与环境一致
var env = argv.env || 'production';
argv.build = env;

/**
 * 任务：dnaReseq
 * 作用：提示压缩dnaReseq模块成功，并清理打包之后的其他无用JS
 * 依赖任务：dnaReseq:html-rev，保证index.html中的images、CSS、JS路径被替换
 */
gulp.task('dnaReseq', ['dnaReseq:html-rev'], function () {
    return gulp.src('').pipe(notify('压缩dnaReseq文件夹成功！')).on('end', function () {
        del([argv.build + dnaReseq.js.dest + '/*.js', '!' + argv.build + dnaReseq.js.dest + '/DNAreseqMain-*.js']);
    });
});

/**
 * 任务：dnaReseq:html-rev
 * 作用：替换index.html中images、CSS和JS路径，并进行压缩
 * 依赖任务：dnaReseq:js-rev，保证dnaReseq模块的所有非homeMain.js的JS被压缩，并替换其中的HTML路径
 */
gulp.task('dnaReseq:html-rev', ['dnaReseq:js-rev'], function () {
    return gulp.src([modules.rev + '/rev-common-images.json', modules.rev + '/rev-dnaReseq-images.json', modules.rev + '/rev-common-css.json', modules.rev + '/rev-dnaReseq-css.json', modules.rev + '/rev-dnaReseq-main-js.json'].concat(dnaReseq.html.main))
        .pipe(revCollector({ replaceReved: true }))
        .pipe(minifyHTML({
            empty: true,
            spare: true
        }))
        .pipe(gulp.dest(argv.build + dnaReseq.html.dest));
})

/**
 * 任务：dnaReseq:js-rev
 * 作用：替换dnaReseq模块中homeMain.js中引用的所有HTML和图片
 * 依赖任务：dnaReseq:amd，必须保证homeMain.js已执行AMD导入
 */
gulp.task('dnaReseq:js-rev', ['dnaReseq:amd'], function () {
    return gulp.src([modules.rev + '/rev-dnaReseq-html.json', dnaReseq.js.main.replace('webroot', argv.build)])
        .pipe(revCollector({ replaceReved: true }))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest(argv.build + dnaReseq.js.dest))
        .pipe(rev.manifest({ merge: true }))
        .pipe(rename('rev-dnaReseq-main-js.json'))
        .pipe(gulp.dest(modules.rev));
})

/**
 * 任务：dnaReseq:amd
 * 作用：AMD导入，生成homeMain.js
 * 依赖任务：dnaReseq:html，可以不依赖，这里是为了方便处理
 */
gulp.task('dnaReseq:amd', ['dnaReseq:html'], function () {
    return gulp.src(dnaReseq.js.src)
        .pipe(gulp.dest(argv.build + dnaReseq.js.dest))
        .pipe(amdOptimize(dnaReseq.js.module, {
            configFile: dnaReseq.js.main,
            baseUrl: argv.build + '/',
            paths: {
              "d3": "empty:"
            }
        }))
        .pipe(concat(dnaReseq.js.file))
        .pipe(gulp.dest(argv.build + dnaReseq.js.dest));
});

/**
 * 任务：dnaReseq:html
 * 作用：提供dnaReseq模块非主页面的所有页面中图片和CSS路径，并对页面进行压缩
 * 依赖任务：clean:dnaReseq，清理文件夹
 */
gulp.task('dnaReseq:html', ['clean:dnaReseq'], function () {
    return gulp.src([modules.rev + '/rev-dnaReseq-images.json'].concat(dnaReseq.html.src))
        .pipe(revCollector({ replaceReved: true }))
        .pipe(minifyHTML({
            empty: true,
            spare: true
        }))
        .pipe(rev())
        .pipe(gulp.dest(argv.build + dnaReseq.html.dest))
        .pipe(rev.manifest({ merge: true }))
        .pipe(rename('rev-dnaReseq-html.json'))
        .pipe(gulp.dest(modules.rev));
})

/**
 * 任务：clean:dnaReseq
 * 作用：清理原来生成的dnaReseq模块下的HTML和JS文件
 */
gulp.task('clean:dnaReseq', function () {
    return gulp.src(dnaReseq.js.del.map(function (value) {
        return argv.build + value;
    }));
});