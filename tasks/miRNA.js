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
    miRNA = modules.miRNA;

// 设置部署目录与环境一致
var env = argv.env || 'production';
argv.build = env;

/**
 * 任务：miRNA
 * 作用：提示压缩miRNA模块成功，并清理打包之后的其他无用JS
 * 依赖任务：miRNA:html-rev，保证index.html中的images、CSS、JS路径被替换
 */
gulp.task('miRNA', ['miRNA:html-rev'], function () {
    return gulp.src('').pipe(notify('压缩miRNA文件夹成功！')).on('end', function () {
        del([argv.build + miRNA.js.dest + '/*.js', '!' + argv.build + miRNA.js.dest + '/miRNAMain-*.js']);
    });
});

/**
 * 任务：miRNA:html-rev
 * 作用：替换index.html中images、CSS和JS路径，并进行压缩
 * 依赖任务：miRNA:js-rev，保证miRNA模块的所有非homeMain.js的JS被压缩，并替换其中的HTML路径
 */
gulp.task('miRNA:html-rev', ['miRNA:js-rev'], function () {
    return gulp.src([modules.rev + '/rev-common-images.json', modules.rev + '/rev-miRNA-images.json', modules.rev + '/rev-common-css.json', modules.rev + '/rev-miRNA-css.json', modules.rev + '/rev-miRNA-main-js.json'].concat(miRNA.html.main))
        .pipe(revCollector({ replaceReved: true }))
        .pipe(minifyHTML({
            empty: true,
            spare: true
        }))
        .pipe(gulp.dest(argv.build + miRNA.html.dest));
})

/**
 * 任务：miRNA:js-rev
 * 作用：替换miRNA模块中homeMain.js中引用的所有HTML和图片
 * 依赖任务：miRNA:amd，必须保证homeMain.js已执行AMD导入
 */
gulp.task('miRNA:js-rev', ['miRNA:amd'], function () {
    return gulp.src([modules.rev + '/rev-miRNA-html.json', miRNA.js.main.replace('webroot', argv.build)])
        .pipe(revCollector({ replaceReved: true }))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest(argv.build + miRNA.js.dest))
        .pipe(rev.manifest({ merge: true }))
        .pipe(rename('rev-miRNA-main-js.json'))
        .pipe(gulp.dest(modules.rev));
})

/**
 * 任务：miRNA:amd
 * 作用：AMD导入，生成homeMain.js
 * 依赖任务：miRNA:html，可以不依赖，这里是为了方便处理
 */
gulp.task('miRNA:amd', ['miRNA:html'], function () {
    return gulp.src(miRNA.js.src)
        .pipe(gulp.dest(argv.build + miRNA.js.dest))
        .pipe(amdOptimize(miRNA.js.module, {
            configFile: miRNA.js.main,
            baseUrl: argv.build + '/',
            paths: {
              "d3": "empty:"
            }
        }))
        .pipe(concat(miRNA.js.file))
        .pipe(gulp.dest(argv.build + miRNA.js.dest));
});

/**
 * 任务：miRNA:html
 * 作用：提供miRNA模块非主页面的所有页面中图片和CSS路径，并对页面进行压缩
 * 依赖任务：clean:miRNA，清理文件夹
 */
gulp.task('miRNA:html', ['clean:miRNA'], function () {
    return gulp.src([modules.rev + '/rev-miRNA-images.json'].concat(miRNA.html.src))
        .pipe(revCollector({ replaceReved: true }))
        .pipe(minifyHTML({
            empty: true,
            spare: true
        }))
        .pipe(rev())
        .pipe(gulp.dest(argv.build + miRNA.html.dest))
        .pipe(rev.manifest({ merge: true }))
        .pipe(rename('rev-miRNA-html.json'))
        .pipe(gulp.dest(modules.rev));
})

/**
 * 任务：clean:miRNA
 * 作用：清理原来生成的miRNA模块下的HTML和JS文件
 */
gulp.task('clean:miRNA', function () {
    return gulp.src(miRNA.js.del.map(function (value) {
        return argv.build + value;
    }));
});