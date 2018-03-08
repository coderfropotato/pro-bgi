/*

模块名称：svgcanvasExportDire
整理时间：2017-11-22
功能简介：svg,canvas混合画图的图片导出功能，可保存成 PNG下载

*/

define("superApp.svgcanvasExportDire",
    ["angular", "super.superMessage", "select2"],
    function (angular, SUPER_CONSOLE_MESSAGE) {
        var superApp = angular.module("superApp.svgcanvasExportDire", []);
        /*
        ** 创建日期：2017-11-22
        ** 功能简介：D3导出单张或者多张图片
        ** 形如：<div class="svgcanvas-export" chartid="div_ReadsQuYuFenBu_CharPanel" chartid-two="div_ReadsQuYuFenBu_CharPanel22" canvas-arr="canvasArr" saveimgname="基因组区域比对分布统计" ></div>
        ** class="svgcanvas-export"：指令，必需
        ** chartid="div_ReadsQuYuFenBu_CharPanel"： 混合图的id
        ** chartid-two="div_ReadsQuYuFenBu_CharPanel22"：表示svg或者canvas图的id
        ** canvas-arr="canvasArr"：表示一个或多个canvas数组，结构：[{name:"",x:"",y:""}]
        ** saveimgname="基因组区域比对分布统计"： 要保存的文件名
        ** saveimgname-two = "基因组区域比对分布细节统计" ：要保存的第二个文件名
        */
        superApp.directive("svgcanvasExport", svgcanvasExport);
        svgcanvasExport.$inject = ["$log", "$compile"];
        function svgcanvasExport($log, $compile) {
            return {
                restrict: "ACE",
                scope: {
                    canvasArr: "=",
                },
                template: "<div class='dropdown drop-menu'>"
                + "<button class='btn btn-default btn-sm btn-silver tool-tip' title='导出'>"
                + "<span class='glyphicon glyphicon-picture'></span> "
                //+ "<span class='icon-caret-down'></span>"
                + "</button>"
                + "<ul class='dropdown-menu'>"
                + "</ul>"
                + "</div>",
                controller: "svgcanvasExportController",
                link: function (scope, element, attrs) {
                    var $element = $(element);
                    var $dropdownMenu = $element.find(".dropdown-menu:eq(0)");

                    var LI_1 = $compile("<li><a ng-click=\"svgcanvasExportImage('" + attrs.chartid + "','" + attrs.chartidTwo + "', '" + attrs.saveimgname + "', '" + attrs.saveimgnameTwo + "','" + attrs.canvasArr + "', 'png')\" href=\"javascript:;\">导出 PNG 格式图片</a></li>")(scope);
                    var LI_2 = $compile("<li><a ng-click=\"svgcanvasExportImage('" + attrs.chartid + "','" + attrs.chartidTwo + "', '" + attrs.saveimgname + "', '" + attrs.saveimgnameTwo + "', '" + attrs.canvasArr + "', 'jpg')\" href=\"javascript:;\">导出 JPG 格式图片</a></li>")(scope);
                    // var LI_3 = $compile("<li><a ng-click=\"SvgExportSvg('" + attrs.chartid + "', '" + attrs.savefilename + "', 'svg')\" href=\"javascript:;\">导出 SVG 格式文件</a></li>")(scope);

                    $dropdownMenu.append(LI_1);
                    $dropdownMenu.append(LI_2);
                    // $dropdownMenu.append(LI_3);

                }
            };
        };

        superApp.controller("svgcanvasExportController", svgcanvasExportController);
        svgcanvasExportController.$inject = ["$scope", "$log", "$state", "$window", "$compile", "ajaxService", "toolService"];
        function svgcanvasExportController($scope, $log, $state, $window, $compile, ajaxService, toolService) {
            //创建时间：2017-11-22
            //功能：导出图片
            //参数：chartid ; type 可选 "image/png" 或 "image/jpeg" ; saveImgName:保存文件名称
            $scope.svgcanvasExportImage = function (chartid, chartidTwo, saveImgName, saveImgNameTwo, canvasArr, type) {
                canvasArr = $scope.canvasArr;
                if (!saveImgName) {
                    saveImgName = "图表";
                }
                if (!type) {
                    type = "image/png";

                } else if ("jpg" == type) {
                    type = "image/jpeg";

                } else if ("png" == type) {
                    type = "image/png";
                }
                if (chartid.length > 0) {
                    DownLoadMixedImage(chartid, saveImgName, canvasArr, type);
                    if (chartidTwo.length > 0) {
                        DownLoadSingleImage(chartidTwo, saveImgNameTwo, type);
                    }
                }

            };

            /*
            ** 创建日期：2017-11-22
            ** 功能简介：base64图片保存PNG
            ** 参数：img:<img>标签 , saveImgName:保存图片文件名 , type:类型 (默认 'image/png')
            ** 返回：一个RGB数组
            */
            //下载svg，canvas混合图
            function DownLoadMixedImage(chartid, saveFileName, canvasArr, type) {
                var $chartObj = $("#" + chartid).find("svg:eq(0)");
                type = type ? type : "image/png";

                var svgXml = $chartObj.prop("outerHTML");
                var svg_image = new Image();

                //准备空画布
                var canvas = document.createElement('canvas');
                canvas.width = $chartObj.width();
                canvas.height = $chartObj.height();

                //取得画布的2d绘图上下文
                var context = canvas.getContext("2d");
                context.fillStyle = "#ffffff";
                context.fillRect(0, 0, canvas.width, canvas.height)
                svg_image.onload = function () {
                    context.drawImage(svg_image, 0, 0);
                    if (canvasArr.length != 0) {
                        for (var i = 0; i < canvasArr.length; i++) {
                            context.drawImage(canvasArr[i].name, canvasArr[i].x, canvasArr[i].y);
                        }
                    }
                    var a = document.createElement("a");
                    document.body.appendChild(a);
                    a.href = canvas.toDataURL(type); //将画布内的信息导出
                    type == "image/png" ? a.download = saveFileName + ".png" : a.download = saveFileName + ".jpg"; //导出的图片名称
                    a.click(); //点击触发导出
                    a.remove();
                };
                svg_image.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svgXml))); //给图片对象写入base64编码的svg流
            };

            //下载svg或者canvas图
            function DownLoadSingleImage(id, saveFileName, type) {
                type = type ? type : "image/png";
                var $chartObj = $("#" + id).find("svg:eq(0)");
                var svgXml = $chartObj.prop("outerHTML");
                var image = new Image();

                //准备空画布
                var canvas = document.createElement('canvas');
                if ($("#" + id + " canvas").length > 0) {
                    canvas.width = $("#" + id + " canvas").width();
                    canvas.height = $("#" + id + " canvas").height();
                } else if ($("#" + id + " svg").length > 0) {
                    canvas.width = $("#" + id + " svg").width();
                    canvas.height = $("#" + id + " svg").height();
                }

                var context = canvas.getContext("2d"); //取得画布的2d绘图上下文
                context.fillStyle = "#ffffff";
                context.fillRect(0, 0, canvas.width, canvas.height)
                image.onload = function () {
                    context.drawImage(image, 0, 0);
                    var a = document.createElement("a");
                    document.body.appendChild(a);
                    a.href = canvas.toDataURL(type); //将画布内的信息导出
                    type == "image/png" ? a.download = saveFileName + ".png" : a.download = saveFileName + ".jpg"; //导出的图片名称
                    a.click(); //点击触发导出
                    a.remove();
                };

                if ($("#" + id + " canvas").length > 0) {
                    image.src = $("#" + id + " canvas")[0].toDataURL();
                } else if ($("#" + id + " svg").length > 0) {
                    image.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svgXml)));
                }


            }

        }


    });

