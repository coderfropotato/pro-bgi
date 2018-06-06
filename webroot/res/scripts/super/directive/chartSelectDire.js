/**
 * 图 数据点击选择 开关   指令
 * 2018年5月25日15:39:55
 */

define("superApp.chartSelectDire", ["angular", "super.superMessage", "select2"],
    function (angular, SUPER_CONSOLE_MESSAGE) {
        var superApp = angular.module("superApp.chartSelectDire", []);
        superApp.directive('chartSelect', chartSelectDirective);

        function chartSelectDirective() {
            return {
                restrict: "ACE",
                template: "<div ng-hide=\"error\" ng-init=InitPage() class=\"chart-select-content\">"
                    + "<button ng-if=\"!single\" ng-click=\"handlerSingle()\" class=\"btn btn-sm btn-silver btn-default tool-tip\" title=\"单选\">单选</button>"
                    + "<button style=\"margin-right:12px;\" ng-if=\"single\" ng-click=\"handlerMultiple()\" class=\"btn btn-sm btn-silver btn-default tool-tip\" title=\"多选\">多选</button>"
                    + "<button ng-if=\"!single\" ng-click=\"handlerConfirm()\" class=\"btn btn-sm btn-silver btn-default tool-tip\" title=\"确定所有选择\">确定</button>"
                    + "</div>",
                scope: {
                    chartObje: "=",
                    selectChange: "&",
                    resetChartSelect: "="
                },
                replace: false,
                transclude: true,
                controller: "chartSelectCtr"
            }
        }

        superApp.controller("chartSelectCtr", chartSelectCtr);
        chartSelectCtr.$inject = ["$rootScope", "$scope", "$log", "$state", "$timeout", "$window", "ajaxService", "toolService", "reportService"];

        function chartSelectCtr($rootScope, $scope, $log, $state, $timeout, $window, ajaxService, toolService, reportService) {
            $scope.InitPage = function () {
                $scope.error = false;
                $scope.single = true;
                $scope.selectData = [];
                if (!$scope.chartObje || !'selectOn' in $scope.chartObje) {
                    $scope.error = true;
                } else {
                    // 默认开启单选
                    $scope.handlerSingle();
                }

            }


            // 开启单选
            $scope.handlerSingle = function () {
                $scope.single = true;
                $scope.chartObje.selectOff()
                $scope.chartObje.selectOn("single", function (d) {
                    $scope.selectData = d;
                    $scope.$apply();
                });
            }

            // 开启多选
            $scope.handlerMultiple = function () {
                $scope.single = false;
                $scope.chartObje.selectOff();
                $scope.chartObje.selectOn("multiple", function (d) {
                    $scope.selectData = d;
                    $scope.$apply();
                });
            }

            // 多选确定
            $scope.handlerConfirm = function () {
                $scope.selectChange({ arg: $scope.selectData });
            }

            $scope.$watch('selectData', function (newVal, oldVal) {
                // 单选才每次回调 多选只在结束时回调
                if (newVal !== oldVal) {
                    if ($scope.single) {
                        $scope.selectChange({ arg: $scope.selectData });
                    }
                }
            }, true)

            // 重置图选择状态
            $scope.$watch('resetChartSelect', function (newVal, oldVal) {
                if (newVal) {
                    $scope.handlerSingle();
                    $timeout(function () {
                        $scope.resetChartSelect = false;
                    }, 0)
                }
            }, true)

        }
    })