/**
 * 页面一级标题
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
                template: "<h2 class=\"alert alert-default\">"
                    + "<span class='one' ng-if=\"!customTitle\">{{one.JDMC}}<span class='two' ng-show=\"two\"> - {{two.JDMC}}<span ng-show=\"three\" class='three'> - {{three.JDMC}}</span></span></span>"
                    + "<span ng-if=\"customTitle\">{{customTitle}}</span></h2>",
                replace: false,
                transclude: true,
                controller: "reportPageTitleCtr",
                scope: {
                    currentPageDirective: "@",   // 当前页面的指令
                    customTitle: "="             // 自定义title
                }
            }
        }

        superApp.controller("reportPageTitleCtr", reportPageTitleCtr);
        reportPageTitleCtr.$inject = ["$rootScope", "$scope", "$log", "$state", "$window", "$compile", "ajaxService", "toolService", "reportService"];
        function reportPageTitleCtr($rootScope, $scope, $log, $state, $window, $compile, ajaxService, toolService, reportService) {
            if (!$scope.customTitle && $scope.currentPageDirective) {
                // 一级页面
                $scope.one = null;
                // 二级页面
                $scope.two = null;
                $scope.three = null;
                // 当前页面
                $scope.currentPage = $rootScope.leftDataOrderByLjlj[$scope.currentPageDirective];

                // 三级
                if ($scope.currentPage.GNSID.length > 6) {
                    var oneId = $scope.currentPage.GNSID.substring(0, 3);
                    var twoId = $scope.currentPage.GNSID.substring(0, 6);

                    $scope.one = $rootScope.leftDataOrderById[oneId];
                    $scope.two = $rootScope.leftDataOrderById[twoId];
                    $scope.three = $scope.currentPage;
                } else {
                    // 二级
                    var oneId = $scope.currentPage.JDPID;
                    $scope.two = $scope.currentPage;
                    $scope.one = $rootScope.leftDataOrderById[oneId]
                }
            }
        }
    });

