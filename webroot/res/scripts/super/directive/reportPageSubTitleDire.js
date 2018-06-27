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
                template:
                    // "<h5><span ng-if=\"id.length==6\">{{one+'-'+two}}</span>"
                    // + "<span ng-if=\"id.length==9\">{{one+'-'+two+'-'+cur}}</span>"
                    // + "<span ng-if=\"index\">{{'.'+index}}</span>"
                    // + "<span ng-if=\"!index\">.1</span>        "
                    // + "{{currentPage.JDMC}}</h5>",
                    "<h5>{{text}}</h5>",
                replace: false,
                transclude: true,
                controller: "reportPageSubTitleCtr",
                scope: {
                    currentPageDirective: "@", // 当前页面的指令
                    index: "@"    // 自定义索引  默认1  当前不可用
                }
            }
        }

        superApp.controller("reportPageSubTitleCtr", reportPageSubTitleCtr);
        reportPageSubTitleCtr.$inject = ["$rootScope", "$scope", "$log", "$state", "$window", "$compile", "ajaxService", "toolService", "reportService"];
        function reportPageSubTitleCtr($rootScope, $scope, $log, $state, $window, $compile, ajaxService, toolService, reportService) {
            $scope.text = $rootScope.pageInfo[$scope.currentPageDirective].replace('_',' ');
            // $scope.currentPage = $rootScope.leftDataOrderByLjlj[$scope.currentPageDirective];
            // $scope.id = $scope.currentPage.GNSID;
            // // 在所有的页面里面找到当前页面的级别
            // $scope.one = 0;
            // $scope.two = 0;
            // $scope.cur = 0;
            
            // // 保存当前页面的标题，下载的时候需要用到
            // var pageTitleText = '';

            // // 当前页面是三级
            // if ($scope.id.length > 6) {
            //     var twoP = findParent($scope.id, $rootScope.oneLevel);
            //     var oneP = twoP.parent;
            //     $scope.one = findIndex(oneP.GNSID, $rootScope.oneLevel);
            //     $scope.two = findIndex(twoP.GNSID, oneP.children);
            //     $scope.cur = findIndex($scope.id, twoP.children);

            //     pageTitleText = $scope.one + '.' + $scope.two + '.' + $scope.cur + '_' + $scope.currentPage.JDMC;
            // } else {
            //     var p = findParent($scope.id, $rootScope.oneLevel);
            //     $scope.two = findIndex($scope.id, p.children);
            //     $scope.one = findIndex(p.GNSID, $rootScope.oneLevel);
                
            //     pageTitleText = $scope.one + '.' + $scope.two + '_' + $scope.currentPage.JDMC;
            // }

            // $rootScope.pageInfo[$scope.currentPageDirective] = pageTitleText;

            // function findParent(id, arr) {
            //     if (arr.length) {
            //         var list = [];
            //         for (var i = 0; i < arr.length; i++) {
            //             if (arr[i].children.length) {
            //                 list = list.concat(arr[i].children)
            //             } else {
            //                 if (arr[i].GNSID === id) {
            //                     return arr[i].parent;
            //                 }
            //             }
            //         }
            //         if (list.length) {
            //             return findParent(id, list);
            //         }
            //     }
            // }

            // function findIndex(id, arr) {
            //     for (var i = 0; i < arr.length; i++) {
            //         if (arr[i].GNSID === id) {
            //             return i + 1;
            //         }
            //     }
            // }
        }
    });

