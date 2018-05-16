
define("superApp.staticImgExportDire",
    ["angular", "super.superMessage", "select2"],
    function (angular, SUPER_CONSOLE_MESSAGE) {
        var superApp = angular.module("superApp.staticImgExportDire", []);
        /*
        ** 创建日期：2017-06-19
        ** 功能简介：D3导出单张图片
        ** 形如：<div class="svg-new-export" chartid="div_ReadsQuYuFenBu_CharPanel" saveimgname="基因组区域比对分布统计" ></div>
        ** class="svg-new-export"：指令，必需
        ** chartid="div_ReadsQuYuFenBu_CharPanel"： chartid
        ** saveimgname="基因组区域比对分布统计"： 要保存的文件名
        */
        superApp.directive("staticImgExport", staticImgExport);
        staticImgExport.$inject = ["$log", "$compile"];
        function staticImgExport($log, $compile) {
            return {
                restrict: "ACE",
                template: "<div class='dropdown drop-menu'>"
                    + "<button class='btn btn-default btn-sm btn-silver tool-tip' title='导出'>"
                    + "<span class='glyphicon glyphicon-picture'></span> "
                    //+ "<span class='icon-caret-down'></span>"
                    + "</button>"
                    + "<ul class='dropdown-menu'>"
                    + "</ul>"
                    + "</div>",
                controller: "staticImgExportController",
                link: function (scope, element, attrs) {
                    var $element = $(element);
                    var $dropdownMenu = $element.find(".dropdown-menu:eq(0)");

                    var LI_1 = $compile("<li><a ng-click=\"export('" + attrs.chartid + "', '" + attrs.saveimgname + "', 'png')\" href=\"javascript:;\">导出 PNG 格式图片</a></li>")(scope);
                    var LI_2 = $compile("<li><a ng-click=\"export('" + attrs.chartid + "', '" + attrs.saveimgname + "', 'jpg')\" href=\"javascript:;\">导出 JPG 格式图片</a></li>")(scope);
                    var LI_3 = $compile("<li><a ng-click=\"export('" + attrs.chartid + "', '" + attrs.saveimgname + "', 'pdf')\" href=\"javascript:;\">导出 PDF 格式文件</a></li>")(scope);

                    $dropdownMenu.append(LI_1);
                    $dropdownMenu.append(LI_2);
                    $dropdownMenu.append(LI_3);
                }
            };
        };


        superApp.controller("staticImgExportController", staticImgExportController);
        staticImgExportController.$inject = ["$scope", "$log", "$state", "$window", "$compile", "ajaxService", "toolService"];
        function staticImgExportController($scope, $log, $state, $window, $compile, ajaxService, toolService) {
            $scope.export = function (chartid, saveImgName, type) {
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
                if (chartid) {
                    DownLoadImage(chartid, saveImgName, type);
                }
            };

            function DownLoadImage(chartid, saveImgName, type) {
                type = type ? type : "image/png";
                var $chartDiv = $("#" + chartid);
                var $img = $chartDiv.find("img:eq(0)");

                if (type != "pdf") {

                } else {

                }

            };

        }


    });

