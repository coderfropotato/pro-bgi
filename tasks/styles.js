var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    notify = require('gulp-notify'),
    argv = require('yargs').argv,
    del = require('del'),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector'),
    rename = require('gulp-rename'),

    cleanCss = require('gulp-clean-css'),
    mergeStream = require('merge-stream'),

    modules = require('../modules.json');

// 设置部署目录与环境一致
var env = argv.env || 'production';
argv.build = env;

/**
 * 任务：css
 * 作用：用于提示CSS样式压缩成功
 * 依赖任务：css:all，必须在CSS样式文件压缩成功后，才能进行提示
 */
gulp.task('css', ['css:all'], function() {
    return gulp.src('').pipe(notify('压缩CSS样式文件成功！'));
})

/**
 * 任务：clean:all
 * 作用：先替换CSS中引用的图片路径，再对CSS样式进行压缩
 * 依赖任务：clean:css，必须删除原来压缩之后的CSS样式
 */
gulp.task('css:all', ['clean:css'], function() {
    modules.css.common.src.unshift(modules.rev + "/rev-common-images.json");
    modules.css.login.src.unshift(modules.rev + "/rev-login-images.json");
    modules.css.mrna.src.unshift(modules.rev + "/rev-mrna-images.json");
    modules.css.dna.src.unshift(modules.rev + "/rev-dna-images.json");
    modules.css.tools.src.unshift(modules.rev + "/rev-tools-images.json");

    var commonCss = gulp.src(modules.css.common.src)
        .pipe(revCollector({ replaceReved: true }))
        .pipe(cleanCss())
        .pipe(rev())
        .pipe(gulp.dest(argv.build + modules.css.common.dest))
        .pipe(rev.manifest({ merge: true }))
        .pipe(rename('rev-common-css.json'))
        .pipe(gulp.dest(modules.rev));

    var loginCss = gulp.src(modules.css.login.src)
        .pipe(revCollector({ replaceReved: true }))
        .pipe(cleanCss())
        .pipe(rev())
        .pipe(gulp.dest(argv.build + modules.css.login.dest))
        .pipe(rev.manifest({ merge: true }))
        .pipe(rename('rev-login-css.json'))
        .pipe(gulp.dest(modules.rev));

    var mrnaCss = gulp.src(modules.css.mrna.src)
        .pipe(revCollector({ replaceReved: true }))
        .pipe(cleanCss())
        .pipe(rev())
        .pipe(gulp.dest(argv.build + modules.css.mrna.dest))
        .pipe(rev.manifest({ merge: true }))
        .pipe(rename('rev-mrna-css.json'))
        .pipe(gulp.dest(modules.rev));
    
    var dnaCss = gulp.src(modules.css.dna.src)
        .pipe(revCollector({ replaceReved: true }))
        .pipe(cleanCss())
        .pipe(rev())
        .pipe(gulp.dest(argv.build + modules.css.dna.dest))
        .pipe(rev.manifest({ merge: true }))
        .pipe(rename('rev-dna-css.json'))
        .pipe(gulp.dest(modules.rev));

    var toolsCss = gulp.src(modules.css.tools.src)
        .pipe(revCollector({ replaceReved: true }))
        .pipe(cleanCss())
        .pipe(rev())
        .pipe(gulp.dest(argv.build + modules.css.tools.dest))
        .pipe(rev.manifest({ merge: true }))
        .pipe(rename('rev-tools-css.json'))
        .pipe(gulp.dest(modules.rev));

    return mergeStream(commonCss, loginCss, mrnaCss, dnaCss,toolsCss);
})

/**
 * 任务：clean:css
 * 功能：删除原来压缩之后的CSS样式文件
 * 依赖任务：images，CSS样式的压缩必须在图片压缩之前完成，因为其会引用图片路径
 */
gulp.task('clean:css', ['images'], function() {
    return del([argv.build + modules.css.common.dest + '/**/*.css', argv.build + modules.css.login.dest + '/*.css', argv.build + modules.css.mrna.dest + '/*.css',argv.build + modules.css.dna.dest + '/*.css', argv.build + modules.css.tools.dest + '/*.css']);
})