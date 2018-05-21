/**
 * 小表
 * 下载  刷新
 * 2018年5月21日16:46:17
 */

define("superApp.littleTableDire",
    ["angular", "super.superMessage", "select2"],
    function (angular, SUPER_CONSOLE_MESSAGE) {
        var superApp = angular.module("superApp.littleTableDire", []);
        superApp.directive('littleTable', littleTableDirective);
        littleTableDirective.$inject = ["$log"];
        function littleTableDirective($log) {
            return {
                restrict: "ACE",
                templateUrl: SUPER_CONSOLE_MESSAGE.localUrl.littleTablePath,
                scope: {
                    pageEntity: "=",
                    url: "=",
                    tableDownloadName: "=",
                    panelId: "=",
                    tablePanelId: "=",
                },
                replace: false,
                transclude: true,
                controller: "littleTableCtr"
            }
        }

        superApp.controller("littleTableCtr", littleTableCtr);
        littleTableCtr.$inject = ["$rootScope", "$scope", "$log", "$state", "$window", "ajaxService", "toolService", "reportService"];
        function littleTableCtr($rootScope, $scope, $log, $state, $window, ajaxService, toolService, reportService) {
            $scope.InitPage = function () {
                $scope.GetTableData();
            }

            $scope.GetTableData = function () {
                toolService.gridFilterLoading.open($scope.tablePanelId);
                var ajaxConfig = {
                    data: $scope.pageEntity,
                    url: $scope.url,
                };

                var promise = ajaxService.GetDeferData(ajaxConfig);
                promise.then(function (responseData) {
                    if (responseData.Error) {
                        $scope.error = "syserror";
                    } else if (responseData.length == 0) {
                        $scope.error = "nodata";
                    } else {
                        $scope.error = "";
                        $scope.tableData = responseData;
                    }
                    toolService.gridFilterLoading.close($scope.tablePanelId);
                }, function (errorMesg) {
                    toolService.gridFilterLoading.close($scope.tablePanelId);
                    $scope.error = "syserror";
                });
            }
        }
    });

