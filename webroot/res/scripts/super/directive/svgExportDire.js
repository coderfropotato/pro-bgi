/*

模块名称：svgExportDire
整理时间：2016-06-20
功能简介：SVG 网页导出功能，如可保存成 PNG、JPG，或 SVG 文件下载

*/

define("superApp.svgExportDire",
    ["angular", "super.superMessage", "select2"],
    function (angular, SUPER_CONSOLE_MESSAGE) {
        var superApp = angular.module("superApp.svgExportDire", []);



        /*
        ** 创建日期：2016-06-08
        ** 功能简介：highchart 导出 图片
        ** 依赖指令 drop-menu 下拉菜单  superDire.js
        ** 形如：<div class="svg-export-image" chartid="div_ReadsQuYuFenBu_CharPanel" savefilename="基因组区域比对分布统计" ></div>
        ** class="svg-export-image"：指令，必需
        ** chartid="div_ReadsQuYuFenBu_CharPanel"： chartid
        ** savefilename="基因组区域比对分布统计"： 要保存的文件名
        */
        superApp.directive("svgExport", svgExport);
        svgExport.$inject = ["$log", "$compile"];
        function svgExport($log, $compile) {
            return {
                restrict: "ACE",
                template: "<div class='dropdown drop-menu'>"
                + "<button class='new-table-switch-btns noborder tool-tip' title='导出'>"
                + "<span class='glyphicon glyphicon-picture'></span> "
                //+ "<span class='icon-caret-down'></span>"
                + "</button>"
                + "<ul class='dropdown-menu'>"
                + "</ul>"
                + "</div>",
                controller: "svgExportController",
                link: function (scope, element, attrs) {
                    var $element = $(element);
                    var $dropdownMenu = $element.find(".dropdown-menu:eq(0)");

                    var LI_1 = $compile("<li><a ng-click=\"SvgExportImage('" + attrs.chartid + "', '" + attrs.savefilename + "', 'png')\" href=\"javascript:;\">导出 PNG 格式图片</a></li>")(scope);
                    var LI_2 = $compile("<li><a ng-click=\"SvgExportImage('" + attrs.chartid + "', '" + attrs.savefilename + "', 'jpg')\" href=\"javascript:;\">导出 JPG 格式图片</a></li>")(scope);
                    // var LI_3 = $compile("<li><a ng-click=\"SvgExportSvg('" + attrs.chartid + "', '" + attrs.savefilename + "', 'svg')\" href=\"javascript:;\">导出 SVG 格式文件</a></li>")(scope);

                    $dropdownMenu.append(LI_1);
                    $dropdownMenu.append(LI_2);
                    // $dropdownMenu.append(LI_3);
                }
            };
        };


        superApp.controller("svgExportController", svgExportController);
        svgExportController.$inject = ["$scope", "$log", "$state", "$window", "$compile", "ajaxService", "toolService"];
        function svgExportController($scope, $log, $state, $window, $compile, ajaxService, toolService) {
            //创建时间：2016-06-08
            //功能：导出图片
            //参数：chartID ; type 可选 "image/png" 或 "image/jpeg" ; saveFileName:保存文件名称
            $scope.SvgExportImage = function (chartID, saveFileName, type) {
                if (!saveFileName) {
                    saveFileName = "图表";
                }
                if (!type) {
                    type = "image/png";

                } else if ("jpg" == type) {
                    type = "image/jpeg";

                } else if ("png" == type) {
                    type = "image/png";
                }

                if (chartID) {
                    DownLoadImage(chartID, saveFileName, type);
                }
            };

            /*
            ** 创建日期：2016-06-06
            ** 功能简介：SVG保存PNG
            ** 参数：svg:<SVG>标签 , saveFileName:保存文件名 , type:类型 (默认 'image/png')
            ** 返回：一个RGB数组
            */  
            function DownLoadImage(chartID, saveFileName, type) {
                (type = type) ? type : "image/png";
                var $chartDiv = $("#" + chartID);
                var $chartObj = $chartDiv.find("svg:eq(0)");

                if ("image/png" != type) {   //如果导出的非PNG，那么必需设置背景色为白色 （若是PNG则背景自动为透明）
                    $chartObj.css("background-color", "#fff");
                } else {
                    //如果是PNG，则背景色取消
                    $chartObj.css("background-color", "");
                }
                // *注：并非所有的 图表 都支持背景色透明，一般来说 highchart 的图表都有一个白色的背景

                //调整正确的比例:1.获取用户设置的比例  2.往SVG标签上添加比例
                //console.log($chartDiv);
                var userScaleStr = 1; //缩放参数

                var oldChartObjWidth = $chartObj.attr("width") ? parseInt($chartObj.attr("width")) : parseInt($chartObj.width());
                var oldChartObjHeight = $chartObj.attr("height") ? parseInt($chartObj.attr("height")) : parseInt($chartObj.height());


                userScaleStr = $chartDiv.css("transform");
                if (userScaleStr && "none" != userScaleStr) {
                    //如果缩放参数是形如：  style="transform:scale(2)";
                    //那么得到的将是转换后的数据 userScaleStr = "matrix(1.1, 0, 0, 1.1, 0, 0)";

                    userScaleStr = $chartDiv.css("transform");
                    if (-1 != userScaleStr.indexOf("matrix")) {
                        userScaleStr = userScaleStr.substr(7, userScaleStr.length);
                        userScaleStr = userScaleStr.split(",")[0];
                    }

                } else if ($chartDiv.css("zoom"))
                //如果缩放参数是形如：  style="zoom:2";
                {
                    userScaleStr = $chartDiv.css("zoom")
                } else {
                    userScaleStr = 1;
                }


                $chartObj.attr("style", "transform:scale(" + userScaleStr + ")");
                $chartObj.attr("width", oldChartObjWidth * userScaleStr);
                $chartObj.attr("height", oldChartObjHeight * userScaleStr);


                var svgXml = $chartObj.parent().html();

                var image = new Image();
                image.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svgXml))); //给图片对象写入base64编码的svg流

                var canvas = document.createElement('canvas');  //准备空画布
                canvas.width = parseInt($chartObj.attr("width"));
                canvas.height = parseInt($chartObj.attr("height"));

                //console.log(canvas.width + ";" + canvas.height);

                var context = canvas.getContext('2d');  //取得画布的2d绘图上下文




                image.onload = function () {
                    context.drawImage(image, 0, 0);
                    var a = document.createElement('a');
                    document.body.appendChild(a);
                    a.href = canvas.toDataURL(type);  //将画布内的信息导出为png图片数据
                    if (!saveFileName) { saveFileName = "SaveImage" }
                    a.download = saveFileName + ("image/png" === type ? ".png" : ".jpg");  //设定下载名称
                    a.click(); //点击触发下载
                    a.remove();

                    //还原
                    $chartObj.attr("width", oldChartObjWidth);
                    $chartObj.attr("height", oldChartObjHeight);
                    $chartObj.attr("style", "");
                }


                // context.drawImage(image, 0, 0);
                // var a = document.createElement('a');
                // a.href = canvas.toDataURL(type);  //将画布内的信息导出为png图片数据
                // if (!saveFileName) { saveFileName = "SaveImage" }
                // a.download = saveFileName;  //设定下载名称
                // a.click(); //点击触发下载

                // //还原
                // $chartObj.attr("width", oldChartObjWidth);
                // $chartObj.attr("height", oldChartObjHeight);
                // $chartObj.attr("style", "");



            };


            /*
            ** 创建日期：2016-06-06
            ** 功能简介：SVG保存SVG文件
            ** 参数：svg:<SVG>标签 , saveFileName:保存文件名
            ** 返回：一个RGB数组
            */
            $scope.SvgExportSvg = function (chartID, saveFileName) {
                toolService.pageLoading.open("正在生成");
                var $chartObj = $("#" + chartID).find("svg:eq(0)");
                var svgXml = $chartObj.parent().html();
                svgXml = "<?xml version='1.0' encoding='utf-8'?>"
                    + "<!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'>"
                    + svgXml;

                //此处 变量 svgXml 为完整的 svg 代码
                var findEntity =
                    {
                        YHID: "",
                        DLM: "",
                        imageName: "",
                        svgData: ""
                    };

                //获取用户实体信息
                var userInfoEntity = toolService.GetUserInfoEntity();
                findEntity.YHID = $scope.userInfoEntity.YHID;
                findEntity.DLM = $scope.userInfoEntity.DLM;
                findEntity.imageName = saveFileName;
                findEntity.svgData = svgXml;

                var actionStr = options.api.base_url + "/ReportDownload/GetSVGDowdloadURL";
                $scope.formID = saveFileName + "_form";
                $scope.svgFormObj = null;
                $scope.formJson = null;
                $scope.formJsonID = saveFileName + "_formJson";
                $scope.tkJson = null;
                $scope.tkJsonID = saveFileName + "_tkJson";

                //添加form
                $scope.svgFormObj = document.createElement("form");
                $($scope.svgFormObj).attr("id", $scope.formID);
                $($scope.svgFormObj).attr("method", "post");
                $($scope.svgFormObj).attr("target", "_blank");
                $($scope.svgFormObj).attr("enctype", "application/x-www-form-urlencoded");
                $($scope.svgFormObj).attr("accept", "application/octet-stream");

                //添加hidden
                $scope.formJson = document.createElement("input");
                $($scope.formJson).attr("type", "hidden");
                $($scope.formJson).attr("id", $scope.formJsonID);
                $($scope.formJson).attr("class", "formJson");
                $($scope.formJson).attr("name", "formJson");
                $($scope.svgFormObj).append($scope.formJson);

                $scope.tkJson = document.createElement("input");
                $($scope.tkJson).attr("id", $scope.tkJsonID);
                $($scope.tkJson).attr("type", "hidden");
                $($scope.tkJson).attr("class", "tkJson");
                $($scope.tkJson).attr("name", "tkJson");
                $($scope.svgFormObj).append($scope.tkJson);

                $($scope.formJson).val(JSON.stringify(findEntity));
                $($scope.tkJson).val("GHTAO" + $window.sessionStorage.token);

                //$log.log($($scope.tkJson).val());

                $($scope.svgFormObj).attr("action", actionStr);
                $("body").append($scope.svgFormObj);
                $($scope.svgFormObj).submit();
                $($scope.svgFormObj).remove();
                toolService.pageLoading.close();

                //var svgFormObj = $("#form_svg");
                ////var downLoadUrl = options.api.base_url + "/FileDownload/DownloadFile?wjid=" + wjid + "&DLM=" + dlm + "&authToken=" + "GHTAO" + $window.sessionStorage.token;
                ////$("#BosDownLoadFileForm").attr("action", downLoadUrl);
                ////$("#BosDownLoadFileForm").submit();
                //var hidObj = $("#form_svg").find(".formJson:eq(0)");
                //$(hidObj).val(JSON.stringify(findEntity));

                //var actionStr = options.api.base_url + "/ReportDownload/GetSVGDowdloadURL";


                //$(svgFormObj).attr("action", actionStr);
                //$(svgFormObj).submit();
                //var ajaxConfig = {
                //    data: findEntity,
                //    url: options.api.base_url + "/ReportDownload/GetSVGDowdloadURL",
                //};
                //var promise = ajaxService.GetDeferData(ajaxConfig);
                //promise.then(function (responseData)
                //{





                //    var a = document.createElement('a');
                //    a.href = responseData;
                //    $log.log(responseData);
                //    if (!saveFileName) { saveFileName = "SvgFiles" }
                //    a.download = saveFileName;  //设定下载名称
                //    a.click(); //点击触发下载
                //    toolService.pageLoading.close();
                //},
                //function (errorMesg)
                //{
                //});

            };
        }


    });

