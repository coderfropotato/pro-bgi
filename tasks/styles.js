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
gulp.task('css', ['css:all'], function () {
    return gulp.src('').pipe(notify('压缩CSS样式文件成功！'));
})

/**
 * 任务：clean:all
 * 作用：先替换CSS中引用的图片路径，再对CSS样式进行压缩
 * 依赖任务：clean:css，必须删除原来压缩之后的CSS样式
 */
gulp.task('css:all', ['clean:css'], function () {
    modules.css.common.src.unshift(modules.rev + "/rev-common-images.json");
    modules.css.chipseq.src.unshift(modules.rev + "/rev-chipseq-images.json");
    modules.css.rnaseq.src.unshift(modules.rev + "/rev-rnaseq-images.json");
    modules.css.miRNA.src.unshift(modules.rev + "/rev-miRNA-images.json");
    modules.css.rna16s.src.unshift(modules.rev + "/rev-rna16s-images.json");
    modules.css.gwas.src.unshift(modules.rev + "/rev-gwas-images.json");
    modules.css.dnaReseq.src.unshift(modules.rev + "/rev-dnaReseq-images.json");
    modules.css.RADseq.src.unshift(modules.rev + "/rev-RADseq-images.json");
    modules.css.mangerSystem.src.unshift(modules.rev + "/rev-mangerSystem-images.json");
    var commonCss = gulp.src(modules.css.common.src)
        .pipe(revCollector({ replaceReved: true }))
        .pipe(cleanCss())
        .pipe(rev())
        .pipe(gulp.dest(argv.build + modules.css.common.dest))
        .pipe(rev.manifest({ merge: true }))
        .pipe(rename('rev-common-css.json'))
        .pipe(gulp.dest(modules.rev));
    var chipseqCss = gulp.src(modules.css.chipseq.src)
        .pipe(revCollector({ replaceReved: true }))
        .pipe(cleanCss())
        .pipe(rev())
        .pipe(gulp.dest(argv.build + modules.css.chipseq.dest))
        .pipe(rev.manifest({ merge: true }))
        .pipe(rename('rev-chipseq-css.json'))
        .pipe(gulp.dest(modules.rev));
    var rnaseqCss = gulp.src(modules.css.rnaseq.src)
        .pipe(revCollector({ replaceReved: true }))
        .pipe(cleanCss())
        .pipe(rev())
        .pipe(gulp.dest(argv.build + modules.css.rnaseq.dest))
        .pipe(rev.manifest({ merge: true }))
        .pipe(rename('rev-rnaseq-css.json'))
        .pipe(gulp.dest(modules.rev));
    var miRNACss = gulp.src(modules.css.miRNA.src)
        .pipe(revCollector({ replaceReved: true }))
        .pipe(cleanCss())
        .pipe(rev())
        .pipe(gulp.dest(argv.build + modules.css.miRNA.dest))
        .pipe(rev.manifest({ merge: true }))
        .pipe(rename('rev-miRNA-css.json'))
        .pipe(gulp.dest(modules.rev));
    var rna16sCss = gulp.src(modules.css.rna16s.src)
        .pipe(revCollector({ replaceReved: true }))
        .pipe(cleanCss())
        .pipe(rev())
        .pipe(gulp.dest(argv.build + modules.css.rna16s.dest))
        .pipe(rev.manifest({ merge: true }))
        .pipe(rename('rev-rna16s-css.json'))
        .pipe(gulp.dest(modules.rev));
    var gwasCss = gulp.src(modules.css.gwas.src)
        .pipe(revCollector({ replaceReved: true }))
        .pipe(cleanCss())
        .pipe(rev())
        .pipe(gulp.dest(argv.build + modules.css.gwas.dest))
        .pipe(rev.manifest({ merge: true }))
        .pipe(rename('rev-gwas-css.json'))
        .pipe(gulp.dest(modules.rev));
    var dnaReseqCss = gulp.src(modules.css.dnaReseq.src)
        .pipe(revCollector({ replaceReved: true }))
        .pipe(cleanCss())
        .pipe(rev())
        .pipe(gulp.dest(argv.build + modules.css.dnaReseq.dest))
        .pipe(rev.manifest({ merge: true }))
        .pipe(rename('rev-dnaReseq-css.json'))
        .pipe(gulp.dest(modules.rev));
    var RADseqCss = gulp.src(modules.css.RADseq.src)
        .pipe(revCollector({ replaceReved: true }))
        .pipe(cleanCss())
        .pipe(rev())
        .pipe(gulp.dest(argv.build + modules.css.RADseq.dest))
        .pipe(rev.manifest({ merge: true }))
        .pipe(rename('rev-RADseq-css.json'))
        .pipe(gulp.dest(modules.rev));
    var mangerSystemCss = gulp.src(modules.css.mangerSystem.src)
        .pipe(revCollector({ replaceReved: true }))
        .pipe(cleanCss())
        .pipe(rev())
        .pipe(gulp.dest(argv.build + modules.css.mangerSystem.dest))
        .pipe(rev.manifest({ merge: true }))
        .pipe(rename('rev-mangerSystem-css.json'))
        .pipe(gulp.dest(modules.rev));
    return mergeStream(commonCss, chipseqCss, rnaseqCss, miRNACss, rna16sCss, gwasCss, dnaReseqCss, RADseqCss, mangerSystemCss);
})

/**
 * 任务：clean:css
 * 功能：删除原来压缩之后的CSS样式文件
 * 依赖任务：images，CSS样式的压缩必须在图片压缩之前完成，因为其会引用图片路径
 */
gulp.task('clean:css', ['images'], function () {
    return del([argv.build + modules.css.common.dest + '/**/*.css', argv.build + modules.css.chipseq.dest + '/*.css', argv.build + modules.css.rnaseq.dest + '/*.css', argv.build + modules.css.miRNA.dest + '/*.css', argv.build + modules.css.rna16s.dest + '/*.css', argv.build + modules.css.gwas.dest + '/*.css', argv.build + modules.css.dnaReseq.dest + '/*.css', argv.build + modules.css.RADseq.dest + '/*.css', argv.build + modules.css.mangerSystem.dest + '/*.css']);
})