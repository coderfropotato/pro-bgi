/*

模块名称：gridExportDire
整理时间：2016-06-20
功能简介：SVG 网页导出功能，如可保存成 PNG、JPG，或 SVG 文件下载

*/

define("superApp.gridExportDire", ["angular", "super.superMessage", "select2"],
    function(angular, SUPER_CONSOLE_MESSAGE) {
        var superApp = angular.module("superApp.gridExportDire", []);



        /*
         ** 创建日期：2016-06-08
         ** 功能简介：highchart 导出 图片
         ** 依赖指令 drop-menu 下拉菜单  superDire.js
         ** 形如：<div class="grid-export" chartid="div_ReadsQuYuFenBu_CharPanel" savefilename="基因组区域比对分布统计" ></div>
         ** class="grid-export"：指令，必需
         ** chartid="div_ReadsQuYuFenBu_CharPanel"： chartid
         ** savefilename="基因组区域比对分布统计"： 要保存的文件名
         */
        superApp.directive("gridExport", gridExport);
        gridExport.$inject = ["$log", "$compile"];

        function gridExport($log, $compile) {
            return {
                restrict: "ACE",
                scope: {
                    findEntity: "=",
                    exportLocation: "=",
                    varfilename: "=",
                    downloadId: "@"
                },
                template: "<div class='dropdown drop-menu'>" +
                    "<button class='btn btn-default btn-silver btn-sm tool-tip' title='导出数据'>" +
                    "<span class='iconglyph icon-download-alt'></span>" +
                    "</button>" +
                    "<ul class='dropdown-menu'>"
                    // + "<li ng-click='ben_SaveLocal_OnClick(1)'><a href='javascript:;'>导出Excel文件到本地</a></li>"
                    +
                    "<li id='{{downloadId}}' ng-click='ben_SaveLocal_OnClick(2)'><a href='javascript:;'>导出CSV文件到本地</a></li>"
                    // + "<li><a ng-click='btn_SaveMyFile_OnClick()' href='javascript:;'>将数据保存到我的云盘</a></li>"
                    +
                    "</ul>" +
                    "</div>",
                controller: "gridExportController",
                link: function(scope, element, attrs) {
                    var $element = $(element);
                    var $dropdownMenu = $element.find(".dropdown-menu:eq(0)");
                    scope.savefilename = attrs.savefilename;
                    //传入的参数
                    //attrs.chartid 
                    //attrs.savefilename

                }
            };
        };


        superApp.controller("gridExportController", gridExportController);
        gridExportController.$inject = ["$scope", "$log", "$state", "$window", "$compile", "ajaxService", "toolService", "pageFactory"];

        function gridExportController($scope, $log, $state, $window, $compile, ajaxService, toolService, pageFactory) {
            //导出实体。说明：当 SaveType 为 1时，说明保存到bos上，此时 ExportType只能是1
            $scope.exportEntity = {
                SXLX: "", //当保存类型为Bos时，使用此字段，为保存文件的属性类型 只能为：Bam，FsatQ，Deglist，Other
                SaveBosPath: "", //当保存类型为Bos时，使用此字段，为保存的Bos路径
                ReportName: "", //导出文件名称
                ExportType: "", //导出类型，使用ExportType枚举， 1:Excel 2:CSV 
                SaveType: "" //1:存储到BOS，此时只能导出为Csv文件  2:存储到本地，此时可导出Excel或Csv文件
            };


            /*
             ** 创建人：高洪涛
             ** 创建日期：2016年6月30日18:02:423
             ** 功能简介：保存到本地按钮点击事件
             ** 参数：exportType  1:Excel 2:CSV     
             ** 返回: 无
             */
            $scope.ben_SaveLocal_OnClick = function(exportType) {
                toolService.pageLoading.open("正在为您导出数据，可能花费您5~10秒，请耐心等待...", 250);
                // console.log($scope.findEntity)
                // console.log($scope.savefilename)
                $scope.exportEntity.SaveType = 2;
                $scope.exportEntity.ExportType = exportType;
                $scope.exportEntity.ReportName = $scope.savefilename || $scope.varfilename;
                $scope.exportEntity.SaveBosPath = "";
                $scope.exportFindEntity = {};
                $scope.exportFindEntity = angular.copy($scope.findEntity);
                // 如果findEntity中没有定义名称，那么取元素savefilename属性的值
                if (!$scope.findEntity.filename) {
                    $scope.exportFindEntity.filename = $scope.savefilename || $scope.varfilename;
                }
                $scope.exportFindEntity.exportEntity = {};
                $scope.exportFindEntity.exportEntity = $scope.exportEntity;
                $scope.exportFindEntity.IsExportReport = true;
                var ajaxConfig = {
                    data: $scope.exportFindEntity,
                    url: $scope.exportLocation,
                };
                var promise = ajaxService.GetDeferData(ajaxConfig);
                promise.then(function(responseData) {
                        // console.log(responseData);
                        if (responseData.result == "ok") {
                            $scope.DownFormFile(responseData.key_info);
                        } else {
                            toolService.popMesgWindow("数据导出异常，请及时联系系统管理员！");
                        }
                        toolService.pageLoading.close();
                    },
                    function(errorMesg) {
                        toolService.popMesgWindow("数据导出异常，请及时联系系统管理员！");
                        toolService.pageLoading.close();
                    });
            };

            $scope.DownFormFile = function(filePath) {
                var actionStr = options.api.base_url + "/CsvDownload";
                $scope.formID = $scope.savefilename + "_exportform";
                $scope.exportFormObj = null;
                $scope.formJson = null;
                $scope.formJsonID = $scope.savefilename + "_exportformJson";
                $scope.tkJson = null;
                $scope.tkJsonID = $scope.savefilename + "_exporttkJson";
                $scope.isReport = null;
                $scope.isReportID = $scope.savefilename + "_exportisReport";

                //添加form
                //$scope.exportFormObj = document.createElement("form");
                $scope.exportFormObj = $('<form></form>');
                $($scope.exportFormObj).attr("id", $scope.formID);
                $($scope.exportFormObj).attr("method", "post");
                $($scope.exportFormObj).attr("target", ""); //_blank
                $($scope.exportFormObj).attr("enctype", "application/x-www-form-urlencoded");
                $($scope.exportFormObj).attr("accept", "application/octet-stream");

                //添加hidden
                $scope.formJson = document.createElement("input");
                $($scope.formJson).attr("type", "hidden");
                $($scope.formJson).attr("id", $scope.formJsonID);
                $($scope.formJson).attr("class", "formJson");
                $($scope.formJson).attr("name", "key_info");
                $($scope.exportFormObj).append($scope.formJson);

                // $scope.tkJson = document.createElement("input");
                // $($scope.tkJson).attr("id", $scope.tkJsonID);
                // $($scope.tkJson).attr("type", "hidden");
                // $($scope.tkJson).attr("class", "tkJson");
                // $($scope.tkJson).attr("name", "tkJson");
                // $($scope.exportFormObj).append($scope.tkJson);

                //$scope.isReport = document.createElement("input");
                //$($scope.isReport).attr("id", $scope.isReportID);
                //$($scope.isReport).attr("type", "hidden");
                //$($scope.isReport).attr("class", "IsExportReport");
                //$($scope.isReport).attr("name", "IsExportReport");
                //$($scope.exportFormObj).append($scope.isReport);

                //$($scope.formJson).val(JSON.stringify(filePath));
                $($scope.formJson).val(filePath);
                // $($scope.tkJson).val("GHTAO" + $window.sessionStorage.token);
                //$($scope.isReport).val(true);

                //$log.log($($scope.tkJson).val());

                $($scope.exportFormObj).attr("action", actionStr);
                $("body").append($scope.exportFormObj);
                $($scope.exportFormObj).submit();
                $($scope.exportFormObj).remove();
            };


            $scope.btn_SaveMyFile_OnClick = function() {
                toolService.popWindow("grid_export_select_folder.html", "请选择您要保存的云盘路径", 550, 618, "dialog-default", 100, true, $scope.wiMove_CallBack);

            };
            //移动回调函数
            $scope.wiMove_CallBack = function(returnStr) {
                if ("" == returnStr || returnStr == "$closeButton") return;

                toolService.pageLoading.open();
                var resultArray = returnStr.split('#');
                var saveFilePath = resultArray[0];
                //$log.log(saveFilePath); //获取保存路径（如果用户点击是确定的话，否则为空）
                $scope.exportEntity.SaveType = 1;
                $scope.exportEntity.ExportType = 2;
                $scope.exportEntity.ReportName = resultArray[1];
                $scope.exportEntity.SaveBosPath = saveFilePath;

                $scope.exportFindEntity = angular.copy($scope.findEntity);

                $scope.exportFindEntity.exportEntity = {};
                $scope.exportFindEntity.exportEntity = $scope.exportEntity;
                //$scope.exportLocation = options.api.base_url + "/CXZK/GetCXSJGLTJJGListDownLoad";
                $scope.exportFindEntity.IsExportReport = true;

                //$log.log($scope.exportFindEntity);


                var ajaxConfig = {
                    data: $scope.exportFindEntity,
                    url: $scope.exportLocation,
                };
                var promise = ajaxService.GetDeferData(ajaxConfig);
                promise.then(function(responseData) {
                        //$log.log(responseData);
                        if (responseData.Result == "success") {
                            var tempStr = "uploadFiles/";
                            //$log.log(saveFilePath.indexOf("uploadFiles/"));
                            //获取云盘存放位置
                            var _cflj = saveFilePath.substring(saveFilePath.indexOf(tempStr) + tempStr.length, saveFilePath.length);
                            if (_cflj == "") _cflj = "个人数据文件根目录";
                            //var mesg = "数据导出成功，以保存到您所选的云盘空间路径下，保存文件名：" + $scope.exportEntity.ReportName;
                            var mesg = $scope.exportEntity.ReportName + " 文件已保存到目标云盘目录 [" + _cflj + "]，您可以到“我的文件 -> 个人数据文件”处下载查看";
                            toolService.popMesgWindow(mesg);
                        } else {
                            toolService.popMesgWindow(responseData.ErrorMessage);
                        }
                        //$log.log(responseData);
                        toolService.pageLoading.close();
                    },
                    function(errorMesg) {});



                //var actionStr = $scope.exportLocation;
                //$scope.formID = $scope.savefilename + "_exportform";
                //$scope.exportFormObj = null;
                //$scope.formJson = null;
                //$scope.formJsonID = $scope.savefilename + "_exportformJson";
                //$scope.tkJson = null;
                //$scope.tkJsonID = $scope.savefilename + "_exporttkJson";
                //$scope.isReport = null;
                //$scope.isReportID = $scope.savefilename + "_exportisReport";


                ////添加form
                //$scope.exportFormObj = document.createElement("form");
                //$($scope.exportFormObj).attr("id", $scope.formID);
                //$($scope.exportFormObj).attr("method", "post");
                //$($scope.exportFormObj).attr("target", "_blank");
                //$($scope.exportFormObj).attr("enctype", "application/x-www-form-urlencoded");
                //$($scope.exportFormObj).attr("accept", "application/octet-stream");

                ////添加hidden
                //$scope.formJson = document.createElement("input");
                //$($scope.formJson).attr("type", "hidden");
                //$($scope.formJson).attr("id", $scope.formJsonID);
                //$($scope.formJson).attr("class", "formJson");
                //$($scope.formJson).attr("name", "formJson");
                //$($scope.exportFormObj).append($scope.formJson);

                //$scope.tkJson = document.createElement("input");
                //$($scope.tkJson).attr("id", $scope.tkJsonID);
                //$($scope.tkJson).attr("type", "hidden");
                //$($scope.tkJson).attr("class", "tkJson");
                //$($scope.tkJson).attr("name", "tkJson");
                //$($scope.exportFormObj).append($scope.tkJson);

                ////$scope.isReport = document.createElement("input");
                ////$($scope.isReport).attr("id", $scope.isReportID);
                ////$($scope.isReport).attr("type", "hidden");
                ////$($scope.isReport).attr("class", "IsExportReport");
                ////$($scope.isReport).attr("name", "IsExportReport");
                ////$($scope.exportFormObj).append($scope.isReport);

                //$($scope.formJson).val(JSON.stringify($scope.exportFindEntity));
                //$($scope.tkJson).val("GHTAO" + $window.sessionStorage.token);
                ////$($scope.isReport).val(true);

                ////$log.log($($scope.tkJson).val());

                //$($scope.exportFormObj).attr("action", actionStr);
                //$($scope.exportFormObj).submit();




                //if (angular.equals(returnStr.State, "Cancel") && returnStr.isCreatedFolder) {
                //    //$scope.InitPage();
                //    return true;
                //} else if (angular.equals(returnStr.State, "Moved")) {
                //    /* 点击了保存按钮 */
                //    //$scope.InitPage();
                //    return true; //返回真则关闭窗口
                //}
            };
        }


    });