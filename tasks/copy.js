var gulp = require('gulp'),
    notify = require('gulp-notify'),
    argv = require('yargs').argv,
    del = require('del'),

    modules = require('../modules.json'),
    copy = modules.copy;

// 设置部署目录与环境一致
var env = argv.env || 'production';
argv.build = env;

/**
 * 任务：copy
 * 作用：复制类库、字体以及其他静态文件等文件：部分类库是动态加载的
 * 依赖任务：clean:copy，这个任务不是必须的，因为每一次复制都会把原来的覆盖
 */
gulp.task('copy', ['clean:copy'], function () {
    return gulp.src(copy.src, { base: copy.base })
        .pipe(gulp.dest(argv.build + copy.dest));
})

/**
 * 任务：clean:copy
 * 作用：删除复制的类库、字体以及其他静态文件等文件
 */
gulp.task('clean:copy', function () {
    return del(copy.src.map(function (value) {
        return value.replace(copy.base, argv.build + copy.dest);
    }));
})