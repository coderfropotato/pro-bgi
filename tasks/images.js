var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    notify = require('gulp-notify'),
    argv = require('yargs').argv,
    del = require('del'),
    rev = require('gulp-rev'),
    rename = require('gulp-rename'),

    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    mergeStream = require('merge-stream'),
    modules = require('../modules.json');

// 设置部署目录与环境一致
var env = argv.env || 'production';
argv.build = env;

var customer = argv.customer || 'customer';

/**
 * 任务：images
 * 作用：提示用户图片压缩成功
 * 依赖任务：images:all，需在此之前对图片进行压缩
 */

gulp.task('images', ['images:all'], function () {
    return gulp.src('').pipe(notify('压缩图片成功！'));
});

/**
 * 任务：images:all
 * 作用：压缩图片，这里包括在线报告部分的图片和通用图片
 * 依赖任务：clean:images，删除原来压缩过的图片
 */
gulp.task('images:all', ['clean:images'], function () {
    var commonImages = mergeImages(modules.images.common.src, 'images/' + customer + '/**/*')
        .pipe(cache(imagemin()))
        .pipe(rev())
        .pipe(gulp.dest(argv.build + modules.images.common.dest))
        .pipe(rev.manifest({ merge: true }))
        .pipe(rename('rev-common-images.json'))
        .pipe(gulp.dest(modules.rev));
    var chipseqImages = mergeImages(modules.images.chipseq.src, 'images/' + customer + '/**/*')
        .pipe(cache(imagemin()))
        .pipe(rev())
        .pipe(gulp.dest(argv.build + modules.images.chipseq.dest))
        .pipe(rev.manifest({ merge: true }))
        .pipe(rename('rev-chipseq-images.json'))
        .pipe(gulp.dest(modules.rev));
    var rnaseqImages = mergeImages(modules.images.rnaseq.src, 'images/' + customer + '/**/*')
        .pipe(cache(imagemin()))
        .pipe(rev())
        .pipe(gulp.dest(argv.build + modules.images.rnaseq.dest))
        .pipe(rev.manifest({ merge: true }))
        .pipe(rename('rev-rnaseq-images.json'))
        .pipe(gulp.dest(modules.rev));
    var miRNAImages = mergeImages(modules.images.miRNA.src, 'images/' + customer + '/**/*')
        .pipe(cache(imagemin()))
        .pipe(rev())
        .pipe(gulp.dest(argv.build + modules.images.miRNA.dest))
        .pipe(rev.manifest({ merge: true }))
        .pipe(rename('rev-miRNA-images.json'))
        .pipe(gulp.dest(modules.rev));
    var rna16sImages = mergeImages(modules.images.rna16s.src, 'images/' + customer + '/**/*')
        .pipe(cache(imagemin()))
        .pipe(rev())
        .pipe(gulp.dest(argv.build + modules.images.rna16s.dest))
        .pipe(rev.manifest({ merge: true }))
        .pipe(rename('rev-rna16s-images.json'))
        .pipe(gulp.dest(modules.rev));
    var gwasImages = mergeImages(modules.images.gwas.src, 'images/' + customer + '/**/*')
        .pipe(cache(imagemin()))
        .pipe(rev())
        .pipe(gulp.dest(argv.build + modules.images.gwas.dest))
        .pipe(rev.manifest({ merge: true }))
        .pipe(rename('rev-gwas-images.json'))
        .pipe(gulp.dest(modules.rev));
    var dnaReseqImages = mergeImages(modules.images.dnaReseq.src, 'images/' + customer + '/**/*')
        .pipe(cache(imagemin()))
        .pipe(rev())
        .pipe(gulp.dest(argv.build + modules.images.dnaReseq.dest))
        .pipe(rev.manifest({ merge: true }))
        .pipe(rename('rev-dnaReseq-images.json'))
        .pipe(gulp.dest(modules.rev));
    var RADseqImages = mergeImages(modules.images.RADseq.src, 'images/' + customer + '/**/*')
        .pipe(cache(imagemin()))
        .pipe(rev())
        .pipe(gulp.dest(argv.build + modules.images.RADseq.dest))
        .pipe(rev.manifest({ merge: true }))
        .pipe(rename('rev-RADseq-images.json'))
        .pipe(gulp.dest(modules.rev));
    var mangerSystemImages = mergeImages(modules.images.mangerSystem.src, 'images/' + customer + '/**/*')
        .pipe(cache(imagemin()))
        .pipe(rev())
        .pipe(gulp.dest(argv.build + modules.images.mangerSystem.dest))
        .pipe(rev.manifest({ merge: true }))
        .pipe(rename('rev-mangerSystem-images.json'))
        .pipe(gulp.dest(modules.rev));
    return mergeStream(commonImages, chipseqImages, rnaseqImages, miRNAImages, rna16sImages, gwasImages, dnaReseqImages, RADseqImages,mangerSystemImages);
});

var mergeImages = function (src, customer) {
    return mergeStream(gulp.src(src), gulp.src(customer, {
        base: ''
    }))
}

/**
 * 任务：clean:images
 * 作用：删除原来压缩之后的图片
 */
gulp.task('clean:images', function () {
    return del([argv.build + modules.images.common.dest, argv.build + modules.images.chipseq.dest, argv.build + modules.images.rnaseq.dest, argv.build + modules.images.miRNA.dest, argv.build + modules.images.rna16s.dest, argv.build + modules.images.gwas.dest, argv.build + modules.images.dnaReseq.dest, argv.build + modules.images.RADseq.dest,, argv.build + modules.images.mangerSystem.dest]);
})
