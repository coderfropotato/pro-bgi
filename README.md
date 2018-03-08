gene-report-web
========

*gene-report-web*，古奥基因在线报告前端，提供对 chipseq、rnaseq、gwas、miRNA 可视化的定制。

必要条件
--------

打包时需要工具：

- Node.js
- npm
- gulp

运行
--------

作为一个前端项目，只需要将 `webroot` 目录挂载到服务器中即可。此外，项目支持 *Gulp* 打包，并提供一些配置项。简单的打包方式如下，会默认打包到 `production` 目录中（由 `tasks/api.js` 文件中的配置决定），详细的帮助可以通过运行 `gulp` 命令查看。

```bash
$ npm install && gulp build
```

项目结构
--------

### 目录

- images：新的图片，用于替换
- tasks：Gulp 任务，用于打包
- webroot：项目代码主要目录
  - ps：各个模块
    - include：通用模块，包括头部、尾部等
    - login：登陆模块，用于登陆验证
    - chipseq：chipseq 模块报告
    - rnaseq：rnaseq 模块报告
    - gwas：gwas 模块报告
    - miRNA：miRNA模块报告
  - res：项目通用的静态资源文件
    - images：项目主要用到的图片
    - scripts：项目中通用的 JavaScript 代码
      - lib：引用的库或框架
      - super：底层封装的 Angular 代码
        - directive：底层指令
        - factory：token 验证服务
        - service：底层服务
    - styles：项目中通用的样式文件以及字体等
  - config.js：项目配置文件
  - favicon.ico：图标
  - index.html：主页面，快速跳转
- .gitignore：git 配置
- gulpfile.js：gulp 配置
- modules.json：模块的配置信息
- package-lock.json：锁定的依赖版本信息
- package.json：项目及其依赖信息
- README.md：介绍文件

### 前后端分离

项目采用前后端 “完全” 分离的结构，即只通过 AJAX 访问后台提供的 API 进行数据交换，由前端渲染。所以不可避免的会有跨域问题，目前采用的解决方案是 CORS，所以会有一些 CORS 的表现。

### 授权验证

项目采用基于 JWT 方式的授权验证，任何的 API 在发送时，都会首先对 Token 进行有效性（合法性、有效期）验证，以保证用户的访问是合法的。如果验证失败，则会重定向至提示页面。

### 可视化

目前主要采用的可视化工具包括 Highcharts 和 D3.js。一般情况下，针对报表类图形，使用 Highcharts，针对定制能力要求高的图形采用 D3.js。

### 架构和打包

项目主体采用 Requirejs + Angularjs 的结构，以实现模块化、依赖管理和异步加载。除 include 模块外，其他模块都具备相类似的结构，熟悉起来之后可以很快上手。

针对 Requirejs 这种 AMD 的依赖处理，我们采用 gulp 的 amd-optimize 插件进行打包，具体的打包过程包括：

1. 配置 API 路径和打包之后的文件夹名称
1. 复制静态资源
1. 压缩通用页面文件并添加 MD5 后缀
1. 对图片文件进行压缩并添加 MD5 后缀
1. 替换非主页面文件和样式文件中的图片路径，并对文件进行打包、压缩病添加 MD5 后缀
1. 使用 amd-optimize 对 AMD 进行依赖处理和打包，生成一个 JavaScript 文件
1. 替换主页面中的主 JavaScript 控制文件、图片以及样式文件路径

许可
--------

版权所有，古奥基因保留所有权利。
