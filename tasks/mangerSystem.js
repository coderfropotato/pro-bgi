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
    mangerSystem = modules.mangerSystem;

// 设置部署目录与环境一致
var env = argv.env || 'production';
argv.build = env;

/**
 * 任务：mangerSystem
 * 作用：提示压缩mangerSystem模块成功，并清理打包之后的其他无用JS
 * 依赖任务：mangerSystem:html-rev，保证index.html中的images、CSS、JS路径被替换
 */
gulp.task('mangerSystem', ['mangerSystem:html-rev'], function () {
    return gulp.src('').pipe(notify('压缩mangerSystem文件夹成功！')).on('end', function () {
        del([argv.build + mangerSystem.js.dest + '/*.js', '!' + argv.build + mangerSystem.js.dest + '/mangerMain-*.js']);
    });
});

/**
 * 任务：mangerSystem:html-rev
 * 作用：替换index.html中images、CSS和JS路径，并进行压缩
 * 依赖任务：mangerSystem:js-rev，保证mangerSystem模块的所有非homeMain.js的JS被压缩，并替换其中的HTML路径
 */
gulp.task('mangerSystem:html-rev', ['mangerSystem:js-rev'], function () {
    return gulp.src([modules.rev + '/rev-common-images.json', modules.rev + '/rev-common-css.json',
    modules.rev + '/rev-mangerSystem-css.json', modules.rev + '/rev-mangerSystem-main-js.json', modules.rev + '/rev-mangerSystem-images.json'].concat(mangerSystem.html.main))
        .pipe(revCollector({ replaceReved: true }))
        .pipe(minifyHTML({
            empty: true,
            spare: true
        }))
        .pipe(gulp.dest(argv.build + mangerSystem.html.dest));
})

/**
 * 任务：mangerSystem:js-rev
 * 作用：替换mangerSystem模块中homeMain.js中引用的所有HTML和图片
 * 依赖任务：mangerSystem:amd，必须保证homeMain.js已执行AMD导入
 */
gulp.task('mangerSystem:js-rev', ['mangerSystem:amd'], function () {
    return gulp.src([modules.rev + '/rev-mangerSystem-html.json', mangerSystem.js.main.replace('webroot', argv.build)])
        .pipe(revCollector({ replaceReved: true }))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest(argv.build + mangerSystem.js.dest))
        .pipe(rev.manifest({ merge: true }))
        .pipe(rename('rev-mangerSystem-main-js.json'))
        .pipe(gulp.dest(modules.rev));
})

/**
 * 任务：mangerSystem:amd
 * 作用：AMD导入，生成homeMain.js
 * 依赖任务：mangerSystem:html，可以不依赖，这里是为了方便处理
 */
gulp.task('mangerSystem:amd', ['mangerSystem:html'], function () {
    return gulp.src(mangerSystem.js.src)
        .pipe(gulp.dest(argv.build + mangerSystem.js.dest))
        .pipe(amdOptimize(mangerSystem.js.module, {
            configFile: mangerSystem.js.main,
            baseUrl: argv.build + '/',
            paths: {
              "d3": "empty:"
            }
        }))
        .pipe(concat(mangerSystem.js.file))
        .pipe(gulp.dest(argv.build + mangerSystem.js.dest));
});

/**
 * 任务：mangerSystem:html
 * 作用：提供mangerSystem模块非主页面的所有页面中图片和CSS路径，并对页面进行压缩
 * 依赖任务：clean:mangerSystem，清理文件夹
 */
gulp.task('mangerSystem:html', ['clean:mangerSystem'], function () {
    return gulp.src([modules.rev + '/rev-mangerSystem-images.json'].concat(mangerSystem.html.src))
        .pipe(revCollector({ replaceReved: true }))
        .pipe(minifyHTML({
            empty: true,
            spare: true
        }))
        .pipe(rev())
        .pipe(gulp.dest(argv.build + mangerSystem.html.dest))
        .pipe(rev.manifest({ merge: true }))
        .pipe(rename('rev-mangerSystem-html.json'))
        .pipe(gulp.dest(modules.rev));
})

/**
 * 任务：clean:mangerSystem
 * 作用：清理原来生成的mangerSystem模块下的HTML和JS文件
 */
gulp.task('clean:mangerSystem', function () {
    return gulp.src(mangerSystem.js.del.map(function (value) {
        return argv.build + value;
    }));
});