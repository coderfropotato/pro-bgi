/*
 ** 功能简介：基于report报告表的工具类
 ** 创建时间：2016-05-06
 */

//define("superApp.reportService", ["angular"],
//function (angular) {
/*
    var superApp = angular.module("superApp.reportService", []);

    superApp.service("ajaxService", AjaxS);
    AjaxS.$inject = ["$log", "$http", "$q", "$window"];
    function AjaxS($log, $http, $q, $window) {



    }*/
//});

/*
 ** 功能简介：基于Angular的工具类
 ** 创建人：高洪涛
 ** 创建时间：2015-12-28
 ** 版本：V1.6.0
 */

define("superApp.reportService", ["super.superMessage", "ngDialog"],
    function (SUPER_CONSOLE_MESSAGE) {
        //$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        var superApp = angular.module("superApp.reportService", ["ngDialog"]);

        //this.options =
        //{
        //    api:
        //        {
        //            base_url: SUPER_CONSOLE_MESSAGE.apiPath
        //        },
        //    loginUrl: "../login/login.html"
        //};

        /* 初始化 $ 扩展 SVG 元素创建 */
        var svgns = "http://www.w3.org/2000/svg";
        $.svg = function $svg(tagName) {
            return $(document.createElementNS(svgns, tagName));
        };


        /*
         ** 创建日期：2016-05-09
         ** 功能简介：SVG 工具类， 各种基本 SVG 画图
         ** 返　　回：返回画好的 SVG 标签，可以通过 jquery append 进去
         */
        superApp.service("svgService", svgService);
        svgService.$inject = ["$rootScope", "$log", "$state", "$filter", "$window", "ngDialog"];

        function svgService($rootScope, $log, $state, $filter, $window, ngDialog) {

            /*
             ** 创建日期：2016-05-10
             ** 功能简介：像素 / 毫米 转换
             ** 参　　数：
             **          px | mm            : 像素或毫米
             ** 返　　回：返回SVG线段
             */
            var px_mm = 11.8;
            this.PXtoMM = function (px) {
                return Math.floor(px / px_mm);
            }

            this.MMtoPX = function (mm) {
                return Math.floor(mm * px_mm);
            }

            /*
             ** 创建日期：2016-05-09
             ** 功能简介：SVG Line
             ** 参　　数：
             **          pos                : 坐标数组 [x1,y1,x2,y2]
             **          style 【可选】      : 样式
             **          className【可选】   : 样式名
             ** 返　　回：返回SVG线段
             */
            this.DrawLine = function (pos, className, style) {
                var $svgObj = $.svg("line");
                $svgObj.attr({ 'x1': pos[0], 'y1': pos[1], 'x2': pos[2], 'y2': pos[3] });
                if (!style) {
                    style = "stroke:#999;stroke-width:1";
                }
                $svgObj.attr("style", style);
                if (className) {
                    $svgObj.attr("class", className);
                }
                return $svgObj;
            }

            /*
             ** 创建日期：2016-05-09
             ** 功能简介：SVG path
             ** 参　　数：
             **          d                  : svg path 序列 如： "M0,0 L100,100"
             **          style 【可选】      : 样式
             **          className【可选】   : 样式名
             ** 返　　回：返回SVG线段
             */
            this.DrawPath = function (d, className, style) {
                var $svgObj = $.svg("path");
                $svgObj.attr({ 'd': d });
                if (!style) {
                    style = "stroke:#999;stroke-width:1;fill:none";
                }
                $svgObj.attr("style", style);
                if (className) {
                    $svgObj.attr("class", className);
                }
                return $svgObj;
            }

            /*
             ** 创建日期：2016-05-09
             ** 功能简介：SVG Polyline
             ** 参　　数：
             **          points             : 折线点坐标序列，如 "0,0 100,100 150,200"
             **          style 【可选】      : 样式
             **          className【可选】   : 样式名
             ** 返　　回：返回SVG线段
             */
            this.DrawPolyline = function (points, className, style) {
                var $svgObj = $.svg("polyline");
                $svgObj.attr({ 'points': points });
                if (!style) {
                    style = "stroke:#999;stroke-width:2;fill:none";
                }
                $svgObj.attr("style", style);
                if (className) {
                    $svgObj.attr("class", className);
                }
                return $svgObj;
            }



            /*
             ** 创建日期：2016-05-09
             ** 功能简介：SVG DrawLitterArrow 画一个小箭头
             ** 参　　数：
             **          direct              : 方向， up|down|left|right , 默认 left
             **          style 【可选】      : 样式
             **          className【可选】   : 样式名
             ** 返　　回：返回SVG线段
             */
            this.DrawLitterArrow = function (direct, className, style) {
                if (!direct) {
                    direct = "left";
                }
                var $svgObj = $.svg("path");
                var d = "";

                d = "M0,0 L6,-6 L6,6 L0,0";
                //switch (direct) {
                //    case "left":
                //        points = "M0,0 L5,-10 L5,10 L0,0"
                //        break;
                //    case "right":
                //        break;
                //    case "up":
                //        break;
                //    case "down":
                //        break;

                //}

                $svgObj.attr({ 'd': d });
                if (!style) {
                    style = "fill:#333";
                }
                $svgObj.attr("style", style);
                if (className) {
                    $svgObj.attr("class", className);
                }
                return $svgObj;
            }


            /*
             ** 创建日期：2016-05-09
             ** 功能简介：SVG DrawText 画一个文本
             ** 参　　数：
             **          text               : 文字
             **          style 【可选】      : 样式
             **          className【可选】   : 样式名
             ** 返　　回：返回SVG文本对象
             */
            this.DrawText = function (text, className, style) {
                var $svgObj = $.svg("text");
                if (!style) {
                    style = "fill:#333";
                }
                $svgObj.attr("style", style);
                if (className) {
                    $svgObj.attr("class", className);
                }
                $svgObj.html(text);
                return $svgObj;
            }

            /*
             ** 创建日期：2016-05-09
             ** 功能简介：SVG DrawText 画一个文本
             ** 参　　数：
             **          width              : 宽度
             **          height             : 高度
             **          style 【可选】      : 样式
             **          className【可选】   : 样式名
             ** 返　　回：返回SVG文本对象
             */
            this.DrawRect = function (width, height, className, style) {
                var $svgObj = $.svg("rect");
                if (!style) {
                    style = "fill:#fff;stroke-width:1;stroke:rgb(0,0,0)";
                }
                $svgObj.attr("style", style);
                $svgObj.attr({ "width": width, "height": height });
                if (className) {
                    $svgObj.attr("class", className);
                }
                return $svgObj;
            }


            /*
             ** 创建日期：2016-05-21
             ** 功能简介：把一个十六进制色彩码转换成 rgb 数组
             ** 参数：一个十六进制色彩码
             ** 返回：一个RGB数组
             */
            this.colorToRGB = function (code) {
                var len = code.length;
                var f = new Array();
                f['0'] = 0;
                f['1'] = 1;
                f['2'] = 2;
                f['3'] = 3;
                f['4'] = 4;
                f['5'] = 5;
                f['6'] = 6;
                f['7'] = 7;
                f['8'] = 8;
                f['9'] = 9;
                f['A'] = 10;
                f['B'] = 11;
                f['C'] = 12;
                f['D'] = 13;
                f['E'] = 14;
                f['F'] = 15;
                code = code.toLocaleUpperCase(); //转换为大写
                var s = code.substr(0, 1);
                if (s == '#') {
                    code = code.substr(1, 6);
                }
                var r = f[code[0]] * 16 + f[code[1]];
                var g = f[code[2]] * 16 + f[code[3]];
                var b = f[code[4]] * 16 + f[code[5]];
                return [r, g, b];
            }

            /*
             ** 创建日期：2016-05-21
             ** 功能简介：给出两个颜色，按百比分取出他们的中间色
             ** 参数：rgb1,rgb2:两个 RGB 数组， percent:百分比
             ** 返回：一个RGB数组
             */
            this.colorBetween = function (rgb1, rgb2, percent) {


                var tR = Math.ceil(rgb1[0] + (rgb2[0] - rgb1[0]) * percent);
                var tG = Math.ceil(rgb1[1] + (rgb2[1] - rgb1[1]) * percent);
                var tB = Math.ceil(rgb1[2] + (rgb2[2] - rgb1[2]) * percent);

                if (tR > 255) { tR = 255 }
                if (tR < 0) { tR = 0 }
                if (tG > 255) { tG = 255 }
                if (tG < 0) { tG = 0 }
                if (tB > 255) { tB = 255 }
                if (tB < 0) { tB = 0 }

                return [tR, tG, tB];

            }

            /*
             ** 创建日期：2016-05-21
             ** 功能简介：给出一个RGB数组，返回一个十六进制色彩码
             ** 参数：rgb1,rgb2:两个 RGB 数组， percent:百分比
             ** 返回：一个RGB数组
             */
            this.RGBToColor = function (rgb1) {
                var rStr = rgb1[0].toString(16);
                var gStr = rgb1[1].toString(16);
                var bStr = rgb1[2].toString(16);

                if (rStr.length == 1) {
                    rStr = "0" + rStr;
                }
                if (gStr.length == 1) {
                    gStr = "0" + gStr;
                }
                if (bStr.length == 1) {
                    bStr = "0" + bStr;
                }

                return "#" + rStr + gStr + bStr;

            }


        };



        /*
         ** 创建日期：2016-05-09
         ** 功能简介：report 工具类， 报告 页画需要调用的公共方法
         ** 返　　回：返回画好的 SVG 标签，可以通过 jquery append 进去
         */
        superApp.service("reportService", reportService);
        reportService.$inject = ["$rootScope", "$log", "$state", "$filter", "$window", "$compile", "ngDialog", "svgService"];

        function reportService($rootScope, $log, $state, $filter, $window, $compile, ngDialog, svgService) {


            /*
            ** 创建日期：2016-05-16
            ** 功能简介：图表内部 Loading 打开|关闭
            ** 参　　数："divId" 字符串，当前所在图表的 id, 如 ：
            **          "text" 指示的文字

            reportService.GrphaLoading.Hide(options.divId);

            ** 返　　回：无
            ** 准备代码： 要在图表DIV中先放置代码
            <div class="graph_group">
        
            <div class="graph_loading"><span class="icn"></span><br /> “图2.3” 正在加载，请稍候...</div>

            ...
            </div>
            */
            this.GrphaLoading = {

                Show: function (divId, text) {

                    var tObj;
                    if (typeof divId == "string") { //参数为 id 的情况
                        tObj = document.getElementById(divId); //直接获取ID
                    } else {
                        tObj = (("button" == divId.target.tagName.toLowerCase()) ? divId.target : divId.target.parentNode); // 防止点到按钮上的图标 
                    }
                    if (!text) text = "正在加载";
                    var $obj = $(tObj);

                    var $graphGroup = $obj; //.parent().parent().parent();
                    var $graphLoading = $graphGroup.find(".graph_loading:eq(0)");
                    if ($graphLoading && $graphLoading.length < 1) {

                        var newHtml = "<div 1style='display:none' class='graph_loading'><span class='icn'></span><br /><span class='loadingMessage'>" + text + "</span></div>";
                        $graphGroup.append(newHtml);

                        $graphLoading = $graphGroup.find(".graph_loading:eq(0)");
                    } else {
                        $graphLoading.find(".loadingMessage:eq(0)").html(text);
                    }
                    //console.log($graphLoading.html());
                    $graphLoading.fadeIn(function () { $(this).show(); });

                },
                Hide: function (divId) {

                    var tObj;
                    if (typeof divId == "string") { //参数为 id 的情况
                        tObj = document.getElementById(divId); //直接获取ID
                    } else {
                        tObj = (("button" == divId.target.tagName.toLowerCase()) ? divId.target : divId.target.parentNode); // 防止点到按钮上的图标 
                    }

                    var $obj = $(tObj);

                    var $graphGroup = $obj; //.parent().parent().parent();
                    var $graphLoading = $graphGroup.find(".graph_loading");
                    $graphLoading.fadeOut();

                }
            }

            /*
             ** 创建日期：2016-05-10
             ** 功能简介：图表全屏模式图表位置的计算
             ** 参　　数：无
             ** 返　　回：无
             ** 备　　注：暂时不知道怎样调用自己内部方法，故没有用 this, 直接写 function
             */
            this.FixChartFullMode = function () {
                FixChartFullMode();
            };

            function FixChartFullMode() {
                /* 获取当前全屏的DIV */
                var $currentChartScroll = $(".graph_group_full .chart_scroll:eq(0)");
                if ($currentChartScroll.length <= 0) {
                    return;
                }
                /* 计算工具栏高度，并设置图表区域的 top */
                var $graphGroup = $currentChartScroll.parent().parent();
                var ggTop = $graphGroup.offset().top;

                var $divCustom = $currentChartScroll.parent().find(".div_custom:eq(0)");

                var dcOffset = $divCustom.offset();
                var dcTop = dcOffset.top;
                var dcHeight = $divCustom.height();

                $currentChartScroll.css("top", (Number(dcTop) - Number(ggTop) + Number(dcHeight)) + 2 + 'px')
            }

            this.ChartFullMode = {
                /*
                 ** 创建日期：2016-05-10
                 ** 功能简介：表格全屏模式 开启
                 ** 参　　数：
                 **          chartId            : 当前图表DIV的 Id
                 ** 返　　回：无
                 */
                Open: function (chartId) {
                    var $chart = $("#" + chartId);

                    var $group = $chart.parent().parent().parent();
                    var $chartWrap = $group.find(".chart_wrap");
                    var $bodyMask = $("#bodyMask");
                    var $btnCustom = $group.find(".btn_custom");
                    var $btnExitCustom = $group.find(".btn_exitcustom");
                    var $chartGraph = $group.find(".chart_graph");
                    var $body = $("body");

                    var $selCanvasSize = $group.find(".sel_canvas_size:eq(0)");
                    var $ipt_canvas_width = $group.find(".ipt_canvas_width:eq(0)");
                    var $ipt_canvas_height = $group.find(".ipt_canvas_height:eq(0)");
                    var $ipt_title_fontsize = $group.find(".ipt_title_fontsize:eq(0)");
                    var $ipt_legend_fontsize = $group.find(".ipt_legend_fontsize:eq(0)");

                    /* 进入自定义模式 */
                    $bodyMask.show();
                    //$chartWrap.addClass("chart_wrap_full"); 
                    $group.addClass("graph_group_full");
                    $body.addClass("body_full");
                    $btnCustom.hide();
                    $btnExitCustom.show();

                    /* 刷新 highchart 以适应新尺寸 */
                    //$chartGraph.highcharts().reflow();

                    /* 初始化当前图表画布尺寸 */
                    $ipt_canvas_width.val(Math.floor(svgService.PXtoMM($chartWrap.width())));
                    $ipt_canvas_height.val(Math.floor(svgService.PXtoMM($chartWrap.height())));
                    $ipt_title_fontsize.val(1.5);
                    $ipt_legend_fontsize.val(1.5);
                    $selCanvasSize.val(0);

                    //$scope.FixChartFullMode(); /*图表全屏模式位置的计算*/
                    FixChartFullMode(); /*图表全屏模式位置的计算*/
                    //$(window).resize();

                },


                /*
                 ** 创建日期：2016-05-10
                 ** 功能简介：表格全屏模式 关闭
                 ** 参　　数：
                 **          chartId            : 当前图表DIV的 Id
                 **          funDrawChart       : 此图表的重画函数 (回调) 【用于重置恢复】
                 **          chartFields        : 此图表的自定义参数数组 【用于重置恢复】
                 ** 返　　回：无
                 */
                Close: function (chartId, funDrawChart, chartFields) {
                    var $chart = $("#" + chartId);
                    var $group = $chart.parent().parent().parent();
                    var $chartWrap = $group.find(".chart_wrap");
                    var $bodyMask = $("#bodyMask");
                    var $btnCustom = $group.find(".btn_custom");
                    var $btnExitCustom = $group.find(".btn_exitcustom");
                    var $chartGraph = $group.find(".chart_graph");
                    var $body = $("body");

                    var $selCanvasSize = $group.find(".sel_canvas_size:eq(0)");
                    var $ipt_canvas_width = $group.find(".ipt_canvas_width:eq(0)");
                    var $ipt_canvas_height = $group.find(".ipt_canvas_height:eq(0)");
                    var $ipt_title_fontsize = $group.find(".ipt_title_fontsize:eq(0)");


                    var $ipt_legend_fontsize = $group.find(".ipt_legend_fontsize:eq(0)");

                    /* 退出自定义模式 */
                    //保存原始高度
                    $chart.parent().attr("originalHeight", $chart.parent().height());


                    //退出前，必须切换到图表，避免图表触发重画时出错
                    $group.parent().parent().parent().find(".btn-group-tabs button:eq(0)").click();

                    $chartWrap.removeAttr("style");
                    $bodyMask.hide();
                    //$chartWrap.removeClass("chart_wrap_full");
                    $group.removeClass("graph_group_full");
                    $body.removeClass("body_full");
                    $btnCustom.show();
                    $btnExitCustom.hide();

                    /* 刷新 highchart 以适应新尺寸*/
                    /*console.log(chartFields);
                    return;*/
                    if (chartFields) {
                        chartFields['legendFontsize'] = "14px";
                        chartFields['titleFontsize'] = "14px";
                        chartFields['circleFontSize'] = "14px";
                        chartFields['margin'] = null;
                        chartFields['marginTop'] = null;
                        chartFields['marginLeft'] = null;
                        chartFields['marginRight'] = null;
                        chartFields['marginBottom'] = null;
                    }
                    funDrawChart();

                    var highcharts = $("#" + chartId).highcharts();
                    var chartWidth = $chart.width();
                    var chartHeight = $chart.parent().attr("originalHeight");
                    highcharts.setSize(chartWidth, chartHeight, false);

                    highcharts.reflow();
                    highcharts.redraw();

                }

            };

            /*
             ** 创建人：高洪涛
             ** 创建时间：2016年7月18日11:42:51
             ** 功能简介：首页左边树菜单，概述页面菜单点击事件
             */
            this.IndexLoadPage = function (item) {
                //当前指令的父类Panel
                var directivePanel = null;
                //动态加载 directiveName
                var directiveName = "";
                var directivePanelID = "";
                if (item.ISREPORT) {
                    //在有在线报告的情况下
                    directiveName = item.LJLJ;
                    if (item.GNSID.length >= 10) {
                        directivePanelID = "div_" + item.JDPID + "_panel";
                    } else {
                        directivePanelID = "div_" + item.GNSID + "_panel";
                    }
                } else {
                    $rootScope.quickMenuList = [];
                    //在没有在线报告情况下
                    directiveName = "no-report-message";
                    directivePanelID = "div_000_panel";
                }
                //获取最上层信息div
                var contentPanel = $(".contentPanel");
                //清除已经加载过的directivePanel
                contentPanel.find(".directivePanel").css("display", "none");
                var directivePanel = contentPanel.find("#" + directivePanelID + ":eq(0)");
                if (directivePanel == null || directivePanel.length == 0) {
                    //contentPanel.append($compile("<div id='" + directivePanelID + "' class='directivePanel'><div class='" + directiveName + "'></div></div>")($scope));
                    //手工编译Angular
                    directivePanelHtml = "<div id='" + directivePanelID + "' class='directivePanel fadeInRight'><div class='" + directiveName + "'></div></div>";
                    $directivePanel = $(directivePanelHtml);
                    contentPanel.append($directivePanel);
                    angular.element(document).injector().invoke(["$compile", function ($compile) {
                        var as = angular.element($directivePanel).scope();
                        $compile($directivePanel)(as);
                    }]);
                } else {
                    directivePanel.css("display", "block");
                }
            };


            /*
             ** 创建日期：2016-05-10
             ** 功能简介：图片弹出效果
             ** 参　　数：<img /> 的 ID 属性
             ** 返　　回：无
             */
            this.popFullScreenImage = function (imgID) {

                var theID = "fullImage_" + Math.ceil(Math.random() * 1000);

                var $body = $("body:eq(0)");
                var $packed = $("<div id='" + theID + "' />");
                var $mask = $("<div class='ngdialog-overlay'></div>");
                var $newImg = $("<img />");
                var $newDiv = $("<div class='whiteBoard'><div onclick='$(\"#" + theID + "\").remove();' class='ngdialog-close'></div></div>");

                var $img = $("#" + imgID);
                var imgOffset = $img.offset();
                //$scope.showFullImageAnimate($scope.currentDAGSLTItem.img, imgOffset.left, imgOffset.top, $img.width(), $img.height())

                $newImg.attr({ "src": $img.attr("src"), "width": "100%", "height": "100%" });
                $newDiv.append($newImg);

                $newDiv.css({ "left": imgOffset.left + "px", "top": imgOffset.top + "px", "width": $img.width() + "px", "height": $img.height() + "px" });

                $mask.css({ "z-index": 998 });

                $packed.append($mask);
                $packed.append($newDiv);

                $body.append($packed);

                setTimeout(function () {
                    var $winWidth = $(window).width();
                    var $winHeight = $(window).height();

                    var boardSize = Math.ceil($winHeight * 0.9);

                    if (boardSize > $winWidth) {
                        boardSize = Math.ceil($winWidth * 0.9);
                    }

                    var boardLeft = Math.ceil(($winWidth - boardSize) / 2);
                    var boardTop = Math.ceil(($winHeight - boardSize) / 2);
                    $newDiv.css({ "left": boardLeft + "px", "top": boardTop + "px", "width": boardSize + "px", "height": boardSize + "px" });
                })

            };


            /*
            ** 创建日期：2016-07-21
            ** 功能简介：页面动画，从一个位置到另一个位置
            ** 参数：
               div     : div元素，最好是临时创建，动画完毕后销毁, 如 <div>我在移动</div>
               x1,y1   : 起始坐标 （使用窗口绝对坐标 position:fixed）
               x2,y2   : 结束坐标 （使用窗口绝对坐标 position:fixed）
            ** 返回：一个RGB数组
            */
            this.flyDiv = function (div, x1, y1, x2, y2) {
                var $divObj = $(div);
                $divObj.css({ "position": "fixed", "left": x1 + "px", "top": y1 + "px", "z-index": 9999 });
                $("body:eq(0)").append($divObj);
                $divObj.show();

                var aniOffset = 400;
                var upY2 = y2 - aniOffset; //引入 Y2, 用于模拟抛物线
                var flyAnimate = setInterval(function () {
                    if (Math.abs(x2 - x1) < 150) {
                        x1 += (x2 - x1) * 0.1;
                        y1 += (upY2 - y1) * 0.1;
                    } else {
                        x1 += (x2 - x1) * 0.05;
                        y1 += (upY2 - y1) * 0.05;
                    }
                    //$log.log(x1 + ";" + y1);
                    $divObj.css({ "left": x1 + "px", "top": y1 + "px" });

                    if (Math.abs(upY2 - y2) < 10) {
                        upY2 = y2;
                    } else {
                        upY2 += (y2 - upY2) * 0.05;
                    }

                    if (Math.abs(x2 - x1) < 10 && Math.abs(y2 - y1) < 10) {
                        $divObj.remove();
                        clearInterval(flyAnimate);
                    }
                }, 10);


                //$divObj.animate({ "left": x2 + "px", "top": y2 + "px" }, 500, function () { $(this).remove(); });
            }

            /*
            ** 创建日期：2017-07-25
            ** 功能简介：悬浮框（鼠标移出隐藏）
            ** 参数：
               textArr：框内文本(字符串数组)
               height:内容高度
               spanIndex:第几个span的高度超出隐藏 1开始
               rows:内容区显示多少行溢出
            ** 返回：无
            使用：reportService.GenericTip.Show("visPart",str,315,textareaX)
            reportService.GenericTip.Hide();
            */
            this.GenericTip = {
                Show: function (e, textArr, height, spanIndex, rows) {
                    var event = e || event;         //火狐浏览器不支持window.event,只支持event。
                    if (textArr.length === 0) { return; }
                    $(".tipsContainer").remove();
                    var tipsConDiv = $("<div class='tipsContainer'></div>");
                    height ? tipsConDiv.append("<div class='tipsContent' style='height:" + height + "px; overflow:hidden;text-overflow:ellipsis;'></div>") : tipsConDiv.append("<div class='tipsContent'></div>");
                    tipsConDiv.append("<div class='arrow-box'><i class='left-arrow1'></i><i class='left-arrow2'></i></div>");
                    tipsConDiv.css({
                        left: (event.clientX + 25) + "px",
                        top: (event.clientY - 33) + "px"
                    });
                    $("body").append(tipsConDiv);
                    if (textArr.length != 0) {
                        for (var i = 0; i < textArr.length; i++) {
                            if (spanIndex == (i + 1) && rows) {
                                $(".tipsContent").append("<span style='display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: " + rows + ";overflow: hidden;'>" + textArr[i] + "</span><br>")
                            } else {
                                $(".tipsContent").append("<span>" + textArr[i] + "</span><br>")
                            }
                        }
                    }
                    var tipWidth = $(".tipsContainer").width();
                    var tipHeight = $(".tipsContainer").height();
                    var viewBodyWidth = $("#div_ViewBody").width();
                    var viewBodyHeight = $("#div_ViewBody").height();

                    //处理tip在可视范围的右边
                    if ((viewBodyWidth - event.clientX < tipWidth + 30) && !(viewBodyHeight - event.clientY < tipHeight)) {
                        tipsConDiv.css({
                            "left": event.clientX - tipWidth - 15
                        });
                        $(".arrow-box").css({
                            "transform": "rotateY(180deg)",
                            "left": tipWidth + 10
                        })
                    }

                    //处理tip在可视范围的下边
                    if ((viewBodyHeight - event.clientY < tipHeight) && !(viewBodyWidth - event.clientX < tipWidth + 30)) {
                        tipsConDiv.css({
                            "top": event.clientY - tipHeight - 15,
                            "left": event.clientX - tipWidth / 2
                        });
                        $(".arrow-box").css({
                            "transform": "rotate(-90deg)",
                            "top": tipHeight + 10,
                            "left": tipWidth / 2 - 10
                        })
                    }

                    //处理tip在可视范围的右边且下边
                    if ((viewBodyWidth - event.clientX < tipWidth + 30) && viewBodyHeight - event.clientY < tipHeight) {
                        tipsConDiv.css({
                            "top": event.clientY - tipHeight - 15,
                            "left": event.clientX - tipWidth + 20
                        });
                        $(".arrow-box").css({
                            "transform": "rotate(-90deg)",
                            "top": tipHeight + 10,
                            "left": tipWidth - 25
                        })
                    }

                },
                Hide: function () {
                    $(".tipsContainer").remove();
                }
            }

            //rgb颜色转换成16进制颜色值
            function RGBToHex(rgb) {
                if (rgb.indexOf("#") != -1) {
                    return rgb.toLowerCase();
                } else {
                    var regexp = /[0-9]{0,3}/g;
                    var re = rgb.match(regexp);//利用正则表达式去掉多余的部分，将rgb中的数字提取
                    var hexColor = "#"; var hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

                    for (var i = 0; i < re.length; i++) {
                        var r = null, c = re[i], l = c;
                        var hexAr = [];
                        while (c > 16) {
                            r = c % 16;
                            c = (c / 16) >> 0;
                            hexAr.push(hex[r]);
                        } hexAr.push(hex[c]);
                        if (l < 16 && l != "") {
                            hexAr.push(0)
                        }
                        hexColor += hexAr.reverse().join('');
                    }

                    return hexColor.toLowerCase();
                }
            }

            /*
           ** 创建日期：2018-03-23
           ** 功能简介：颜色选择器
           ** 参数：element:当期点击的图例元素；
                    chartNodes:图中需要改变颜色的节点数组；形如：[{element:xxxx,attr:"fill"}],element是元素，attr是要改变的属性（"fill" or "stroke"）
                    top：色盘top,默认250px；
                    coloArr：颜色数组，默认defaultColorArr；
           ** 返回：点击色块返回当前颜色
           使用：reportService.ColorSelector.Show()
           reportService.ColorSelector.Hide();
           */
            this.ColorSelector = {
                Show: function (ev, element, chartNodes, top, colorArr) {
                    clearEventBubble(ev);
                    $(".backDiv").remove();
                    top = top ? top : 250;
                    var event = ev || event;
                    var defaultColorArr = ["#FF0000", "#FFC000", "#FFFF00", "#92D050", "#00B050", "#00B0F0", "#0070C0", "#002060", "#7030A0", "#000000", "#FFE5E5", "#FFF9E5", "#FFFFE5", "#F4FAED", "#E5F7ED", "#E5F7FD", "#E5F0F9", "#E5E8EF", "#F0EAF5", "#EFEFEF", "#FFCCCC", "#FFF2CC", "#FFFFCC", "#E9F6DC", "#CCEFDC", "#CCEFFC", "#CCE2F2", "#CCD2DF", "#E2D6EC", "#DFDFDF", "#FF9999", "#FFE699", "#FFFF99", "#D3ECB9", "#99DF89", "#99DFF9", "#99C6E6", "#99A6BF", "#C6ACD9", "#BFBFBF", "#FF6666", "#FFD966", "#FFFF66", "#BEE396", "#66D096", "#66D0F6", "#66A9D9", "#6679A0", "#A983C6", "#A0A0A0", "#FF3333", "#FFCD33", "#FFFF33", "#A8D973", "#33C073", "#33C3F3", "#338DCD", "#334D80", "#8D59B3", "#000000"];
                    var colorList = colorArr || defaultColorArr;
                    var $backDiv = $("<div class='backDiv'></div>")
                    var $oColorDiv = $("<div class='colorSelector'></div>");
                    var $oUl = $("<ul></ul>");
                    $oColorDiv.append($oUl);

                    for (var i = 0; i < colorList.length; i++) {
                        $oUl.append("<li style='background-color:" + colorList[i] + "'></li>");
                    }

                    $backDiv.append($oColorDiv);
                    $("#div_ViewProduct").append($backDiv);

                    var scrollTop = $("#div_ViewProduct").scrollTop();
                    $backDiv.css("top", scrollTop);

                    $("#div_ViewProduct").css("overflow", "hidden");
                    $(".colorSelector").css("top", top + "px");

                    $("body").on("click", hideColorPanel);
                    $("ul.sidebar_nav_pop li").on("click", hideColorPanel);

                    function hideColorPanel() {
                        $(".backDiv").css("display", "none");
                        $("#div_ViewProduct").css("overflow", "auto");
                    }

                    // $(document).on("click", ".colorSelector", function (ev) {
                    //     var oEvent = ev || event;
                    //     oEvent.stopPropagation();
                    //     $("#div_ViewProduct").css("overflow", "hidden");
                    //     $(".backDiv").css("display", "block");
                    // })

                    $(".colorSelector ul li").on("click", function (ev) {
                        var oEvent = ev || event;
                        oEvent.stopPropagation();

                        $(".backDiv").css("display", "none");
                        $("#div_ViewProduct").css("overflow", "auto");

                        var curColor = this.currentStyle ? RGBToHex(this.currentStyle['backgroundColor']) : RGBToHex(getComputedStyle(this, null)['backgroundColor']);

                        element.setAttribute("fill", curColor);
                        element.setAttribute("stroke", curColor);

                        for (var i = 0; i < chartNodes.length; i++) {
                            chartNodes[i].element.setAttribute(chartNodes[i].attr, curColor);
                        }
                    })

                },

            }
            //阻止冒泡
            function clearEventBubble(evt) {
                if (evt.stopPropagation) {
                    evt.stopPropagation();
                } else {
                    evt.cancelBubble = true;
                }

                if (evt.preventDefault) {
                    evt.preventDefault();
                } else {
                    evt.returnValue = false;
                }

            }
        }



    });