/*

模块名称：imgExportDire
整理时间：2017-06-19
功能简介：静态图片导出功能，可保存成 PNG下载

*/

define("superApp.imgExportDire",
    ["angular", "super.superMessage", "select2"],
    function (angular, SUPER_CONSOLE_MESSAGE) {
        var superApp = angular.module("superApp.imgExportDire", []);
        /*
        ** 创建日期：2017-06-19
        ** 功能简介：highchart 导出 图片
        ** 形如：<div class="image-export" imageid="div_ReadsQuYuFenBu_CharPanel" saveimgname="基因组区域比对分布统计" ></div>
        ** class="image-export"：指令，必需
        ** imageid="div_ReadsQuYuFenBu_CharPanel"： imageid
        ** saveimgname="基因组区域比对分布统计"： 要保存的文件名
        */
        superApp.directive("imageExport", imageExport);
        imageExport.$inject = ["$log", "$compile"];
        function imageExport($log, $compile) {
            return {
                restrict: "ACE",
                template: "<div class='dropdown drop-menu'>" + "</div>",
                controller: "imageExportController",
                link: function (scope, element, attrs) {
                    var $element = $(element);
                    var $button = $compile("<button class='btn btn-default btn-sm btn-silver tool-tip' title='导出' ng-click=\"imageExportImage('" + attrs.imageid + "', '" + attrs.saveimgname + "', 'png')\"><span class='glyphicon glyphicon-picture'></span></button>")(scope);
                    var $dropdownMenu = $element.find(".dropdown:eq(0)");
                    $dropdownMenu.append($button);
                }
                // restrict: "ACE",
                // template: "<div class='dropdown drop-menu'>"
                // + "<button class='btn btn-default btn-sm btn-silver tool-tip' title='导出'>"
                // + "<span class='glyphicon glyphicon-picture'></span> "
                // + "</button>"
                // + "<ul class='dropdown-menu'>"
                // + "</ul>"
                // + "</div>",
                // controller: "imageExportController",
                // link: function (scope, element, attrs) {
                //     var $element = $(element);
                //     var $dropdownMenu = $element.find(".dropdown-menu:eq(0)");
                //     var LI_1 = $compile("<li><a ng-click=\"imageExportImage('" + attrs.imageid + "', '" + attrs.saveimgname + "', 'png')\" href=\"javascript:;\">导出 PNG 格式图片</a></li>")(scope);
                //     $dropdownMenu.append(LI_1);
                // }
            };
        };


        superApp.controller("imageExportController", imageExportController);
        imageExportController.$inject = ["$scope", "$log", "$state", "$window", "$compile", "ajaxService", "toolService"];
        function imageExportController($scope, $log, $state, $window, $compile, ajaxService, toolService) {
            //创建时间：2017-06-19
            //功能：导出图片
            //参数：imageId ; type 可选 "image/png" 或 "image/jpeg" ; saveImgName:保存文件名称
            $scope.imageExportImage = function (imageId, saveImgName, type) {
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
                if (imageId) {
                    DownLoadImage(imageId, saveImgName, type);
                }
            };

            /*
            ** 创建日期：2017-06-19
            ** 功能简介：base64图片保存PNG
            ** 参数：img:<img>标签 , saveImgName:保存图片文件名 , type:类型 (默认 'image/png')
            ** 返回：一个RGB数组
            */
            function DownLoadImage(imageId, saveImgName, type) {
                (type = type) ? type : "image/png";
                var $chartDiv = $("#" + imageId);
                var $chartObj = $chartDiv.find("img:eq(0)");
                var a = document.createElement('a');
                document.body.appendChild(a);
                a.href = $chartObj["0"].src;
                if (!saveImgName) { saveImgName = "SaveImage" }
                a.download = saveImgName;  //设定下载名称
                a.click(); //点击触发下载
                a.remove();
            };

        }


    });

