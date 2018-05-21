/**
 * 小表
 * <div class="little-table" page-entity="pageEntity" url="url" table-download-name="tableDownloadName" panel-id="panelId" table-panel-id="tablePanelId"></div>
 * 下载  刷新
 * 2018年5月21日16:46:17
 */

define("superApp.littleTableDire", ["angular", "super.superMessage", "select2"],
    function(angular, SUPER_CONSOLE_MESSAGE) {
        var superApp = angular.module("superApp.littleTableDire", []);
        superApp.directive('littleTable', littleTableDirective);
        littleTableDirective.$inject = ["$log"];

        function littleTableDirective($log) {
            return {
                restrict: "ACE",
                templateUrl: SUPER_CONSOLE_MESSAGE.localUrl.littleTablePath,
                scope: {
                    // 表格数据查询参数
                    pageEntity: "=",
                    // api url
                    url: "=",
                    // 表格保存名称
                    tableDownloadName: "=",
                    // 父级面板id
                    panelId: "=",
                    // 表格面板id
                    tablePanelId: "=",

                    isHasSelectOption: "=",
                    selectOptionList: "=",
                    selectModel: "=",

                    isHasAccuracy: "=",
                    accuracy: "="
                },
                replace: false,
                transclude: true,
                controller: "littleTableCtr"
            }
        }

        superApp.controller("littleTableCtr", littleTableCtr);
        littleTableCtr.$inject = ["$rootScope", "$scope", "$log", "$state", "$window", "ajaxService", "toolService", "reportService"];

        function littleTableCtr($rootScope, $scope, $log, $state, $window, ajaxService, toolService, reportService) {
            $scope.InitPage = function() {
                if ($scope.isHasSelectOption) {
                    $scope.selectModel = $scope.selectOptionList[0];
                }
                $scope.accuracy = -1;
                $scope.GetTableData();
            }

            $scope.GetTableData = function() {
                toolService.gridFilterLoading.open($scope.tablePanelId);
                var ajaxConfig = {
                    data: $scope.pageEntity,
                    url: $scope.url,
                };

                var promise = ajaxService.GetDeferData(ajaxConfig);
                promise.then(function(responseData) {
                    if (responseData.Error) {
                        $scope.error = "syserror";
                    } else if (responseData.length == 0) {
                        $scope.error = "nodata";
                    } else {
                        $scope.error = "";
                        $scope.tableData = responseData;
                    }
                    toolService.gridFilterLoading.close($scope.tablePanelId);
                }, function(errorMesg) {
                    toolService.gridFilterLoading.close($scope.tablePanelId);
                    $scope.error = "syserror";
                });
            }
        }
    })