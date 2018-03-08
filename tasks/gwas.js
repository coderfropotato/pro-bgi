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
    gwas = modules.gwas;

// 设置部署目录与环境一致
var env = argv.env || 'production';
argv.build = env;

/**
 * 任务：gwas
 * 作用：提示压缩gwas模块成功，并清理打包之后的其他无用JS
 * 依赖任务：gwas:html-rev，保证index.html中的images、CSS、JS路径被替换
 */
gulp.task('gwas', ['gwas:html-rev'], function () {
    return gulp.src('').pipe(notify('压缩gwas文件夹成功！')).on('end', function () {
        del([argv.build + gwas.js.dest + '/*.js', '!' + argv.build + gwas.js.dest + '/gwasMain-*.js']);
    });
});

/**
 * 任务：gwas:html-rev
 * 作用：替换index.html中images、CSS和JS路径，并进行压缩
 * 依赖任务：gwas:js-rev，保证gwas模块的所有非homeMain.js的JS被压缩，并替换其中的HTML路径
 */
gulp.task('gwas:html-rev', ['gwas:js-rev'], function () {
    return gulp.src([modules.rev + '/rev-common-images.json', modules.rev + '/rev-common-css.json',
    modules.rev + '/rev-gwas-css.json', modules.rev + '/rev-gwas-main-js.json', modules.rev + '/rev-gwas-images.json'].concat(gwas.html.main))
        .pipe(revCollector({ replaceReved: true }))
        .pipe(minifyHTML({
            empty: true,
            spare: true
        }))
        .pipe(gulp.dest(argv.build + gwas.html.dest));
})

/**
 * 任务：gwas:js-rev
 * 作用：替换gwas模块中homeMain.js中引用的所有HTML和图片
 * 依赖任务：gwas:amd，必须保证homeMain.js已执行AMD导入
 */
gulp.task('gwas:js-rev', ['gwas:amd'], function () {
    return gulp.src([modules.rev + '/rev-gwas-html.json', gwas.js.main.replace('webroot', argv.build)])
        .pipe(revCollector({ replaceReved: true }))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest(argv.build + gwas.js.dest))
        .pipe(rev.manifest({ merge: true }))
        .pipe(rename('rev-gwas-main-js.json'))
        .pipe(gulp.dest(modules.rev));
})

/**
 * 任务：gwas:amd
 * 作用：AMD导入，生成homeMain.js
 * 依赖任务：gwas:html，可以不依赖，这里是为了方便处理
 */
gulp.task('gwas:amd', ['gwas:html'], function () {
    return gulp.src(gwas.js.src)
        .pipe(gulp.dest(argv.build + gwas.js.dest))
        .pipe(amdOptimize(gwas.js.module, {
            configFile: gwas.js.main,
            baseUrl: argv.build + '/',
            paths: {
              "d3": "empty:"
            }
        }))
        .pipe(concat(gwas.js.file))
        .pipe(gulp.dest(argv.build + gwas.js.dest));
});

/**
 * 任务：gwas:html
 * 作用：提供gwas模块非主页面的所有页面中图片和CSS路径，并对页面进行压缩
 * 依赖任务：clean:gwas，清理文件夹
 */
gulp.task('gwas:html', ['clean:gwas'], function () {
    return gulp.src([modules.rev + '/rev-gwas-images.json'].concat(gwas.html.src))
        .pipe(revCollector({ replaceReved: true }))
        .pipe(minifyHTML({
            empty: true,
            spare: true
        }))
        .pipe(rev())
        .pipe(gulp.dest(argv.build + gwas.html.dest))
        .pipe(rev.manifest({ merge: true }))
        .pipe(rename('rev-gwas-html.json'))
        .pipe(gulp.dest(modules.rev));
})

/**
 * 任务：clean:gwas
 * 作用：清理原来生成的gwas模块下的HTML和JS文件
 */
gulp.task('clean:gwas', function () {
    return gulp.src(gwas.js.del.map(function (value) {
        return argv.build + value;
    }));
});