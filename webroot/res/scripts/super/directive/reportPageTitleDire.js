/**
 * 顶部快捷菜单导航
 */
define("superApp.reportPageTitleDire",
    ["angular", "super.superMessage", "select2"],
    function (angular, SUPER_CONSOLE_MESSAGE) {
        var superApp = angular.module("superApp.reportPageTitleDire", []);
        superApp.directive('reportPageTitle', reportPageTitleDirective);
        reportPageTitleDirective.$inject = ["$log"];
        function reportPageTitleDirective($log) {
            return {
                restrict: "ACE",
                template: "<h2 class=\"alert alert-default\">{{one.JDMC}}<span ng-show=\"two\">-{{two.JDMC}}</span></h2>",
                replace: false,
                transclude: true,
                controller: "reportPageTitleCtr",
                scope: {
                    currentPageDirective: "@",
                }
            }
        }

        superApp.controller("reportPageTitleCtr", reportPageTitleCtr);
        reportPageTitleCtr.$inject = ["$rootScope", "$scope", "$log", "$state", "$window", "$compile", "ajaxService", "toolService", "reportService"];
        function reportPageTitleCtr($rootScope, $scope, $log, $state, $window, $compile, ajaxService, toolService, reportService) {
            console.log($scope.currentPageDirective);
            console.log($rootScope.leftData);

            // 一级页面
            $scope.one = null;
            // 二级页面
            $scope.two = null;

            var currentPage;
            for (var i = 0, len = $rootScope.leftData.length; i < len; i++) {
                if ($rootScope.leftData[i].LJLJ === $scope.currentPageDirective) {
                    currentPage = $rootScope.leftData[i];
                    break;
                }
            }
            console.log(currentPage)
            // 三级
            if (currentPage.GNSID.length > 6) {
                var oneId = currentPage.GNSID.substring(0, 3);
                var twoId = currentPage.GNSID.substring(0, 6);

                $scope.one = $rootScope.leftDataOrderById[oneId];
                $scope.two = $rootScope.leftDataOrderById[twoId];

                console.log($scope.one, $scope.two)
            } else {
                // 二级
                var oneId = currentPage.JDPID;
                $scope.one = $rootScope.leftDataOrderById[oneId]
                console.log($scope.one)
            }
        }
    });

