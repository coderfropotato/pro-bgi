var gulp = require('gulp'),
    argv = require('yargs').argv,
    replace = require('gulp-replace'),
    gulpif = require('gulp-if'),
    requireDir = require('require-dir'),
    log = console.log;

requireDir('./tasks', { recurse: true });

gulp.task('build', ['include'], function() {
    return gulp.start(['login', 'mrna', 'dna', 'tools']);
});

gulp.task('default', function() {
    log('用法： gulp <command> [--<arg> <value>]');
    log('下面是一些常用的任务命令：');
    log('   build   创建一个新的部署，默认部署到 production 文件夹中');
    log('   login   仅部署 login 模块，默认部署到 production 文件夹中');
    log('   include 仅部署 include 模块，默认部署到 production 文件夹中');
    log('   mrna  仅部署 mrna 模块，默认部署到 production 文件夹中');
    log('   dna  仅部署 dna 模块，默认部署到 production 文件夹中');
    log('   tools  仅部署 tools 模块，默认部署到 production 文件夹中');
    log('常用的命令参数如下：');
    log('   --env 决定部署的文件夹，默认为 production ，除非部署到 production 文件夹，否则单独部署模块时，要提供此参数以指定目标文件夹！');
    log('注意：');
    log('   如果对于任何的类库、CSS 样式或图片等资源进行了修改，需要全部重新部署！');
    log('帮助：');
    log('   帮助详情参见 WIKI，谢谢。');
});