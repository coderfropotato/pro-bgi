/**
 * 大表
 * 下载  刷新 筛选 精度/可选 分页 页码
 * 2018年5月21日16:46:17
 */

define("superApp.bigTableDire",
    ["angular", "super.superMessage", "select2"],
    function (angular, SUPER_CONSOLE_MESSAGE) {
        var superApp = angular.module("superApp.bigTableDire", []);
        superApp.directive('bigTableDire', bigTableDirective);
        bigTableDirective.$inject = ["$log"];
        function bigTableDirective($log) {
            return {
                restrict: "ACE",
                templateUrl: SUPER_CONSOLE_MESSAGE.localUrl.bigTablePath,
                scope: {
                    // 表格数据查询参数
                    pageEntity: "=",
                    // 表格地址api
                    url: "=",
                    // 表格下载名称
                    tableDownloadName: "=",
                    // 面板id
                    panelId: "=",
                    // 表格面板id
                    tablePanelId: "=",
                    // 是否有下拉框
                    showSelect: "=",
                    // 下拉框的数据
                    selectList: "=",
                    // 下拉框数据key {name:key,value:"23"} key=>name
                    key: "=",
                    // 下拉框model 在pagefindEntity中的key
                    paramsKey: "=",
                    // 是否显示精度
                    showAccuracy: "=",
                    // 外部更新触发 不需要外部更新null 需要默认传false
                    outerUpdate: "="
                },
                replace: false,
                transclude: true,
                controller: "bigTableCtr"
            }
        }

        superApp.controller("bigTableCtr", bigTableCtr);
        bigTableCtr.$inject = ["$rootScope", "$scope", "$log", "$state", "$window", "$timeout", "ajaxService", "toolService", "reportService"];
        function bigTableCtr($rootScope, $scope, $log, $state, $window, $timeout, ajaxService, toolService, reportService) {
            $scope.InitPage = function () {
                // 是否在筛选
                $scope.isBeginFilter = false;
                // 精度默认 全数据
                $scope.accuracy = -1;
                // 获取表格数据
                $scope.GetTableData(1);
            };

            //过滤查询参数 
            $scope.InitFindEntity = function (filterFindEntity) {
                $scope.pageEntity = toolService.GetGridFilterFindEntity($scope.pageEntity, filterFindEntity);
                $scope.filterText1 = toolService.GetFilterContentText($scope.pageEntity);
                $scope.GetTableData(1);
            };

            //获取注释表数据
            $scope.GetTableData = function (pageNumber) {
                toolService.gridFilterLoading.open($scope.tablePanelId);
                $scope.pageEntity = toolService.SetGridFilterFindEntity($scope.pageEntity, "LCID", "string", "equal", toolService.sessionStorage.get("LCID"));

                $scope.pageEntity.pageNum = pageNumber;
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
            };

            // 点击删除筛选条件
            $scope.handleDelete = function (event) {
                var thead = angular.element(event.target).siblings('span').find('em').text();
                var clearBtn;
                for (var i = 0; i < $('#' + $scope.panelId + ' table th .grid_head').length; i++) {
                    if ($.trim($('#' + $scope.panelId + ' table th .grid_head').eq(i).text()) === thead) {
                        clearBtn = $('#' + $scope.panelId + ' table th .grid_head').eq(i).parent().find('.btnPanel').children().last();
                        break;
                    }
                }
                $timeout(function () {
                    clearBtn.triggerHandler("click");
                }, 0)
            }

            // 筛选状态改变
            $scope.handlerFilterStatusChange = function (status) {
                $scope.isBeginFilter = status;
            }


            // 是否外部触发更新
            if ($scope.outerUpdate != undefined && $scope.outerUpdate != null) {
                $scope.$watch('outerUpdate', function (newVal, oldVal) {
                    if (newVal) {
                        $scope.GetTableData(1);
                        $timeout(function () {
                            $scope.outerUpdate = false;
                        }, 30)
                    }
                })
            }
        }
    });

