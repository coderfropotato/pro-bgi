/**
 * 图说明
 */
define("superApp.chartDescDire", ["angular", "super.superMessage", "select2"],
    function(angular, SUPER_CONSOLE_MESSAGE) {
        var superApp = angular.module("superApp.chartDescDire", []);
        superApp.directive('chartDesc', chartDescDirective);
        chartDescDirective.$inject = ["$log"];

        function chartDescDirective($log) {
            return {
                restrict: "ACE",
                template: "<div class=\"chart-desc-wrap\"><div  ng-class=\"{'active':show}\" ng-click=\"show = !show\"><i style=\"margin-right:4px;\" class=\"iconfont icon-shuoming\"></i><span>图说明</span></div><p class=\"table-chart-desc\" ng-show=\"show\">{{text}}</p></div>",
                replace: false,
                transclude: true,
                controller: "chartDescCtr",
                scope: {
                    text: "@"
                }
            }
        }

        superApp.controller("chartDescCtr", chartDescCtr);
        chartDescCtr.$inject = ["$rootScope", "$scope", "$log", "$state", "$window", "$compile", "ajaxService", "toolService", "reportService"];

        function chartDescCtr($rootScope, $scope, $log, $state, $window, $compile, ajaxService, toolService, reportService) {
            $scope.show = false;
        }
    });