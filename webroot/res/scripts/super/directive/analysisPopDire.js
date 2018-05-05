/**
 * 我的分析面板
 * 2018年4月18日10:27:14 
 */

define("superApp.analysisPopDire",
    ["angular", "super.superMessage", "select2"],
    function (angular, SUPER_CONSOLE_MESSAGE) {
        var superApp = angular.module("superApp.analysisPopDire", []);
        superApp.directive('analysisPop', analysisPopDirective);
        analysisPopDirective.$inject = ["$log"];
        function analysisPopDirective($log) {
            return {
                restrict: "ACE",
                template: "<div class=\"analysis-panel\" ng-class=\"isExpand?'isActive':''\" >"
                    + "<span ng-show=\"analysisList.length\" class=\"analysis-title\">我的分析</span>"
                    // + "<table class=\"table table-hover\">"
                    // + "<thead>"
                    // + "<tr><td class=\"text-center\">任务名称</td> <td class=\"text-center\">进度</td> <td class=\"text-center\">提交时间</td></tr>"
                    // + "</thead></table>" 
                    + "<div ng-show=\"analysisList.length\" class=\"table-wrap\"><table class=\"table table-hover\"><thead>"
                    + "<tr><th class=\"text-center\">任务名称</th> <th class=\"text-center\">进度</th> <th class=\"text-center\">提交时间</th><th class=\"text-center\">操作</th></tr>"
                    + "</thead><tbody>"
                    + "<tr ng-repeat=\"val in analysisList\" track by $index>"
                    + "<td>{{val.name}}</td><td>{{val.progress}}</td><td>{{val.time | date:'yyyy-MM-dd hh:mm:ss'}}</td><td ng-click=\"handlerAnalysisDetail(val)\">查看</td>"
                    +"</tr>"
                    + "</tbody>"
                    + "</table></div>"
                    + "<div class=\"analysis-arrow\" ng-click=\"toggleShow($event)\"><i class=\"icon\" ng-class=\"isExpand?'icon-angle-right':'icon-angle-left'\"></i></div>"
                    + "<p class=\"error-tips\" ng-show=\"!analysisList.length\">暂无分析信息</p></div>",
                scope: {
                    analysisList: "=",
                    handlerAnalysisDetail: "&",
                    isExpand:"=",
                },
                replace: false,
                transclude: true,
                controller: "analysisPopCtr"
            }
        }

        superApp.controller("analysisPopCtr", analysisPopCtr);
        analysisPopCtr.$inject = ["$rootScope", "$scope", "$log", "$state", "$window", "ajaxService", "toolService", "reportService"];
        function analysisPopCtr($rootScope, $scope, $log, $state, $window, ajaxService, toolService, reportService) {
            //切换显示面板
            $scope.toggleShow = function (ev) {
                $scope.isExpand = !$scope.isExpand;
                ev.stopPropagation();
            }
            // 查看分析详情
            $scope.handlerAnalysisDetail = function (item) {
                console.log(item);
            }

            // document.addEventListener('click', function () { 
            //     $scope.isExpand = false;
            //     $scope.$apply();
            // }, false);
        }
    });

