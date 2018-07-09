/**
 * 我的分析面板
 * 2018年4月18日10:27:14 
 */

define("superApp.analysisPopDire", ["angular", "super.superMessage", "select2"],
    function (angular, SUPER_CONSOLE_MESSAGE) {
        var superApp = angular.module("superApp.analysisPopDire", []);
        superApp.directive('analysisPop', analysisPopDirective);
        analysisPopDirective.$inject = ["$log"];

        function analysisPopDirective($log) {
            return {
                restrict: "ACE",
                template: "<div ng-click=\"handlerReanalysisPopClick($event)\" class=\"analysis-panel\" ng-class=\"isExpand?'isActive':''\" >"
                    // + "<div ng-show=\"analysisList.length\" class=\"analysis-title\">我的分析<em>（只显示最新十条记录）</em></div>"
                    // + "<table class=\"table table-hover\">"
                    // + "<thead>"
                    // + "<tr><td class=\"text-center\">任务名称</td> <td class=\"text-center\">进度</td> <td class=\"text-center\">提交时间</td></tr>"
                    // + "</thead></table>" 
                    +
                    "<div class=\"table-wrap\"><table ng-show=\"!error && analysisList.length\" class=\"table table-hover\"><thead>" +
                    "<tr><th class=\"text-center\">任务名称</th> <th class=\"text-center\">进度</th> <th class=\"text-center\">提交时间</th><th class=\"text-center\">操作</th></tr>" +
                    "</thead><tbody>" +
                    "<tr ng-repeat=\"val in analysisList \" track by $index>"
                    //  | date:'yyyy-MM-dd hh:mm:ss'
                    +
                    "<td ><span uib-tooltip=\"{{val.projectName}}\" style='display:block;max-width:90px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;'>{{val.projectName}}</span></td><td><span ng-show=\"val.process==0\" style='color:#F04848;'><i class=\"iconfont icon-shibai\"></i></span><span ng-show=\"val.process==-1\" style='color:#32AAFF'><i class=\"iconfont icon-yunhangzhong1\"></i></span><span ng-show=\"val.process==1\" style='color:#63D359;'><i class=\"iconfont icon-wancheng\"></i></span></td><td>{{val.time}}</td><td ng-click=\"handlerAnalysisDetail(val)\"><span style=\"cursor:pointer;\">查看</span></td>" +
                    "</tr>" +
                    "</tbody>" +
                    "</table></div><p class='line' ng-show='analysisList.length'></p><p class='all' ng-show='analysisList.length>1'><a href='../../../../ps/tools/index.html#/home/myAnalysis' target='_blank'>查看全部</a></p>" +
                    "<div class=\"analysis-arrow\" ng-click=\"toggleShow($event)\"><i class=\"iconfont icon-jihua\"></i><div>我的分析</div></div>" +
                    "<p class=\"error-tips\" ng-show=\"(analysisList.length==0) && error=='nodata'\">暂无分析信息</p>" +
                    "<p class=\"error-tips\" ng-show=\"error=='syserror'\">服务器错误</p>" +
                    "</div>",
                scope: {
                    analysisList: "=",
                    handlerAnalysisDetail: "&",
                    isExpand: "=",
                    error: "="
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
                if (item.process == 1) {
                    // success + '/' + item.projectName
                    $window.open('../../../../ps/tools/index.html#/home/' + item.charType + '/' + item.id);
                } else if (item.process == -1) {
                    // pending
                    $window.open('../../../../ps/tools/index.html#/home/myAnalysis');
                } else {
                    // error
                    $window.open('../../../../ps/tools/index.html#/home/error/' + item.id);
                }
            }

            $scope.handlerReanalysisPopClick = function (event) {
                event.stopPropagation();
            }

            function documentClick() {
                $scope.isExpand = false;
                $scope.$apply();
            }
            document.removeEventListener('click',documentClick);
            document.addEventListener('click', documentClick, false);

        }
    });