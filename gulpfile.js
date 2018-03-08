var gulp = require('gulp'),
    argv = require('yargs').argv,
    replace = require('gulp-replace'),
    gulpif = require('gulp-if'),
    requireDir = require('require-dir'),
    log = console.log;

requireDir('./tasks', { recurse: true });

gulp.task('build', ['include'], function () {
    return gulp.start(['login', 'chipseq', 'rnaseq', 'miRNA', 'rna16s', 'gwas','dnaReseq','RADseq','mangerSystem']);
});

gulp.task('default', function () {
    log('用法： gulp <command> [--<arg> <value>]');
    log('下面是一些常用的任务命令：');
    log('   build   创建一个新的部署，默认部署到 production 文件夹中');
    log('   login   仅部署 login 模块，默认部署到 production 文件夹中');
    log('   chipseq 仅部署 chipseq 模块，默认部署到 production 文件夹中');
    log('   rnaseq  仅部署 rnaseq 模块，默认部署到 production 文件夹中');
    log('   miRNA   仅部署 miRNA 模块，默认部署到 production 文件夹中');
    log('   rna16s   仅部署 rna16s 模块，默认部署到 production 文件夹中');
    log('   gwas   仅部署 gwas 模块，默认部署到 production 文件夹中');
    log('   dnaReseq   仅部署 dnaReseq 模块，默认部署到 production 文件夹中');
    log('   RADseq   仅部署 RADseq 模块，默认部署到 production 文件夹中');
    log('   mangerSystem   仅部署 mangerSystem 模块，默认部署到 production 文件夹中');
    log('   include 仅部署 include 模块，默认部署到 production 文件夹中');
    log('常用的命令参数如下：');
    log('   --env 决定部署的文件夹，默认为 production ，除非部署到 production 文件夹，否则单独部署模块时，要提供此参数以指定目标文件夹！');
    log('注意：');
    log('   如果对于任何的类库、CSS 样式或图片等资源进行了修改，需要全部重新部署！');
    log('帮助：');
    log('   帮助详情参见 WIKI，谢谢。');
});