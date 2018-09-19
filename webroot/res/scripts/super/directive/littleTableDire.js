/**
 * 小表
 * <div class="little-table" page-entity="pageEntity" url="url" table-download-name="tableDownloadName" panel-id="panelId" table-panel-id="tablePanelId"></div>
 * 下载  刷新
 * 2018年5月21日16:46:17
 */

define("superApp.littleTableDire", ["angular", "super.superMessage", "select2"],
    function (angular, SUPER_CONSOLE_MESSAGE) {
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
                    //下拉选择
                    isHasSelectOption: "=", //是否有下拉选择
                    selectList: "=", // 下拉数据list
                    entityKey: "=", //pageEntity中的key(sample)。如：pageEntity : {sample:"sssss1"}
                    key: "=", // selectList：[{key:"sample111"}]中的key；若selectList：["ssss","aaa"]没有key，不传
                    //是否选择精度
                    isHasAccuracy: "=",
                    accuracy: "=",
                    // 无数据是否需要隐藏
                    // tableTitle: "@",
                    isNoDataHide: "=",
                    // 请求完成回调  根据数据来判断是否显示外部的信息
                    reqDoneCallback: "&",
                    // 是都需要显示重置按钮
                    showResetBtn: "=",
                    // 外部更新 不需要null 默认false 需要更新的时候true
                    outerUpdate: "="
                },
                replace: false,
                transclude: true,
                controller: "littleTableCtr"
            }
        }

        superApp.controller("littleTableCtr", littleTableCtr);
        littleTableCtr.$inject = ["$rootScope", "$scope", "$log", "$state", "$window","$timeout", "ajaxService", "toolService", "reportService"];

        function littleTableCtr($rootScope, $scope, $log, $state, $window,$timeout, ajaxService, toolService, reportService) {
            $scope.InitPage = function () {
                if ($scope.isHasSelectOption) {
                    if ($scope.key) {
                        $scope.pageEntity[entityKey] = $scope.selectList[0][$scope.key];
                    } else {
                        $scope.pageEntity[entityKey] = $scope.selectList[0];
                    }
                }
                // 重置的时候用
                $scope.beforeEntity = angular.copy($scope.pageEntity);
                $scope.showResetBtn = !!$scope.showResetBtn;
                $scope.accuracy = -1;
                $scope.isNoDataHide = !!$scope.isNoDataHide;
                $scope.GetTableData();
            }

            $scope.GetTableData = function () {
                toolService.gridFilterLoading.open($scope.panelId);
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
                    toolService.gridFilterLoading.close($scope.panelId);
                    $scope.reqDoneCallback && $scope.reqDoneCallback({
                        arg: $scope.error
                    });
                }, function (errorMesg) {
                    toolService.gridFilterLoading.close($scope.panelId);
                    $scope.error = "syserror";
                    $scope.reqDoneCallback && $scope.reqDoneCallback({
                        arg: $scope.error
                    });
                });
            }

            $scope.resetTable = function () {
                $scope.pageEntity = angular.copy($scope.beforeEntity);
                $scope.GetTableData();
            }

            // 是否外部触发更新
            if ($scope.outerUpdate != undefined && $scope.outerUpdate != null) {
                $scope.$watch('outerUpdate', function (newVal, oldVal) {
                    if (newVal) {
                        $scope.GetTableData();
                        $timeout(function () {
                            $scope.outerUpdate = false;
                        }, 30)
                    }
                })
            }

        }
    })