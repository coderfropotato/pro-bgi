var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    argv = require('yargs').argv,
    notify = require('gulp-notify'),
    del = require('del'),
    rev = require('gulp-rev'),
    rename = require('gulp-rename'),

    replace = require('gulp-replace'),
    uglify = require('gulp-uglify'),
    modules = require('../modules.json');

var env = argv.env || 'production',
    config = modules.config;

// 设置部署目录与环境一致
argv.build = env;

/**
 * 任务：env
 * 作用：用于修改打包的API路径
 */
gulp.task('env', function() {
    if (['production', 'develop', 'inner'].indexOf(env) < 0) {
        return gulp.src('').pipe(notify('版本不存在！'))
    } else {
        return gulp.src(config.src)
            .pipe(gulpif(env === 'develop', replace(/var base_url.*;/g, 'var base_url = "http://120.26.51.59:5006/api/1";'))) // 开发环境
            // .pipe(gulpif(env === 'production', replace(/var base_url.*;/g, 'var base_url = "http://172.168.1.210:5000/api/1";'))) // 测试环境
            .pipe(gulpif(env === 'production', replace(/var base_url.*;/g, 'var base_url = "http://report.bgi.com:9001/api/1";'))) // bgi线上环境
            // .pipe(gulpif(env === 'production', replace(/var base_url.*;/g, 'var base_url = "http://ureport.gooalgene.com/api/1";'))) // gooal线上环境
            .pipe(gulpif(env === 'inner', replace(/var base_url.*;/g, 'var base_url = "http://120.26.51.59:5006/api/1";'))) // 内部环境
            .pipe(gulp.dest(argv.build + config.dest));
    }
});