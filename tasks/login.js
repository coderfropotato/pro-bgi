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
    login = modules.login;

// 设置部署目录与环境一致
var env = argv.env || 'production';
argv.build = env;

/**
 * 任务：login
 * 作用：提示login模块压缩成功
 * 依赖任务：login:html-rev，保证主页面中图片、CSS和JS路径被替换，且HTML被压缩
 * 注意：login模块与其他模块不同，所以写法略简单
 */
gulp.task('login', ['login:html-rev'], function () {
    return gulp.src('').pipe(notify('压缩login文件夹成功！')).on('end', function () {  
        del([argv.build + login.js.dest + '/*.js', '!' + argv.build + login.js.dest + '/loginMain-*.js'])
    });
});

/**
 * 任务：login:html-rev
 * 作用：替换login模块下页面中的图片、CSS和JS路径，且压缩HTML
 * 依赖任务：login:amd，保证AMD模块被导入
 */
gulp.task('login:html-rev', ['login:amd'], function () {
    return gulp.src([modules.rev + '/rev-common-images.json', modules.rev + '/rev-common-css.json', modules.rev + '/rev-login-main-js.json'].concat(login.html.main))
        .pipe(revCollector({ replaceReved: true }))
        .pipe(minifyHTML({
            empty: true,
            spare: true
        }))
        .pipe(gulp.dest(argv.build + login.html.dest));
})

/**
 * 任务：login:amd
 * 作用：AMD导入，生成模块JS并压缩
 * 依赖任务：clean:login，删除login模块下的所有文件
 */
gulp.task('login:amd', ['clean:login'], function () {
    return gulp.src(login.js.src)
        .pipe(gulp.dest(argv.build + login.js.dest))
        .pipe(amdOptimize(login.js.module, {
            configFile: login.js.main,
            baseUrl: argv.build + '/'
        }))
        .pipe(concat(login.js.file))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest(argv.build + login.js.dest))
        .pipe(rev.manifest({ merge: true }))
        .pipe(rename('rev-login-main-js.json'))
        .pipe(gulp.dest(modules.rev));
});

/**
 * 任务：clean:login
 * 作用：清理login模块文件夹
 */
gulp.task('clean:login', function () {
    return del(login.js.del.map(function (value) {
        return argv.build + value;
    }));
})