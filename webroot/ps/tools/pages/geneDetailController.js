define(["toolsApp"], function(toolsApp) {
    toolsApp.controller("geneDetailController", geneDetailController);
    geneDetailController.$inject = ["$rootScope", "$scope", "$log", "$state", "$timeout", "$window", "$compile", "ajaxService", "toolService", "svgService", "reportService"];

    function geneDetailController($rootScope, $scope, $log, $state, $timeout, $window, $compile, ajaxService, toolService, svgService, reportService) {
        toolService.pageLoading.open();
        $scope.InitPage = function() {
            //定时关闭等待框
            setTimeout(function() {
                toolService.pageLoading.close();
            }, 300);

            //gene id
            $scope.id = $state.params.id;

            $scope.title = $scope.id + "基因详情页";

            $scope.projectType = toolService.sessionStorage.get("projectType");

            $scope.expressEntity = {
                "LCID": toolService.sessionStorage.get("LCID"),
                "sample": ""
            }
            $scope.getExpressTable();

        };

        // 样本表达量
        $scope.getExpressTable = function() {
            toolService.gridFilterLoading.open("expressTable_panel");
            var ajaxConfig = {
                data: $scope.expressEntity,
                url: options.api.mrnaseq_url + "/SimpleTable/RawReadsClass"
            };
            var promise = ajaxService.GetDeferData(ajaxConfig);
            promise.then(function(resData) {
                    if (resData.Error) {
                        //系统异常
                        $scope.expressTableError = "syserror";
                    } else if (resData.length == 0) {
                        //无数据异常
                        $scope.expressTableError = "nodata";
                    } else {
                        //正常
                        $scope.expressTableError = "";
                        $scope.tableData = resData;
                    }
                    toolService.gridFilterLoading.close("expressTable_panel");
                },
                function(errorMesg) {
                    $scope.expressTableError = "syserror";
                    toolService.gridFilterLoading.close("expressTable_panel");
                });
        }

    };
});