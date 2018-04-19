/**
 * 页面二级标题
 */
define("superApp.reportPageSubTitleDire",
    ["angular", "super.superMessage", "select2"],
    function (angular, SUPER_CONSOLE_MESSAGE) {
        var superApp = angular.module("superApp.reportPageSubTitleDire", []);
        superApp.directive('reportPageSubTitle', reportPageSubTitleDirective);
        reportPageSubTitleDirective.$inject = ["$log"];
        function reportPageSubTitleDirective($log) {
            return {
                restrict: "ACE",
                template: "<h5>{{one+'-'}}<span ng-if=\"two\">{{two+'-'}}</span>{{cur+'.'}}"
                    + "<span ng-if=\"index\">{{index}}</span>"
                    + "<span ng-if=\"!index\">1</span>        "
                    + "{{currentPage.JDMC}}</h5>",
                replace: false,
                transclude: true,
                controller: "reportPageSubTitleCtr",
                scope: {
                    currentPageDirective: "@", // 当前页面的指令
                    index: "@"    // 自定义索引  默认1
                }
            }
        }

        superApp.controller("reportPageSubTitleCtr", reportPageSubTitleCtr);
        reportPageSubTitleCtr.$inject = ["$rootScope", "$scope", "$log", "$state", "$window", "$compile", "ajaxService", "toolService", "reportService"];
        function reportPageSubTitleCtr($rootScope, $scope, $log, $state, $window, $compile, ajaxService, toolService, reportService) {
            $scope.currentPage = $rootScope.leftDataOrderByLjlj[$scope.currentPageDirective];
            $scope.id = $scope.currentPage.GNSID;
            $scope.one = 0;
            $scope.two = 0;
            $scope.cur = 0;

            // 总是截取id的最后两位
            if ($scope.id.length > 6) {
                $scope.one = +$scope.id.substring(0, 3);
                $scope.two = +$scope.id.substring(3, 6);
                $scope.cur = +$scope.id.substring(6);
            } else {
                $scope.one = +$scope.id.substring(0, 3);
                $scope.cur = +$scope.id.substring(3);
            }
        }
    });

