/**
 * 重分析按钮组
 * 2018-4-23 14:04:35 reAnalysisDire 
 */

define("superApp.reAnalysisDire",
    ["angular", "super.superMessage", "select2"],
    function (angular, SUPER_CONSOLE_MESSAGE) {
        var superApp = angular.module("superApp.reAnalysisDire", []);
        superApp.directive('reAnalysis', reAnalysisDirective);
        reAnalysisDirective.$inject = ["$log"];
        // "<button ng-click=\"handlerReanalysisClick('heatmap')\" class=\"btn btn-default tool-tip pull-right\" title=\"聚类重分析\">聚类重分析</button>
        function reAnalysisDirective($log) {
            return {
                restrict: "ACE",
                replace: true,
                template: "<div class='re-analysis-panel clearfix'>"
               
                    + "<ul class='pull-right clearfix'>" 
                    + "<li class='pull-left tool-tip' title='聚类重分析' ng-click=\"handlerReanalysisClick('heatmap')\">聚类重分析</li>"
                    + "<li class='pull-left tool-tip' title='GO富集' ng-click=\"handlerReanalysisClick('goRich')\">GO富集</li>"
                    + "<li class='pull-left tool-tip' title='Pathway富集' ng-click=\"handlerReanalysisClick('pathwayRich')\">Pathway富集</li>"
                    + "<li class='pull-left tool-tip' title='GO分类' ng-click=\"handlerReanalysisClick('goClass')\">GO分类</li>"
                    + "<li class='pull-left tool-tip' title='Pathway分类' ng-click=\"handlerReanalysisClick('pathwayClass')\">Pathway分类</li>"
                    + "<li class='pull-left tool-tip' title='折线图' ng-click=\"handlerReanalysisClick('line')\">折线图</li>"
                    + "<li class='pull-left tool-tip' title='蛋白网络互作' ng-click=\"handlerReanalysisClick('net')\">蛋白网络互作</li>"
                    + "</ul>"
                    + "</div>",
                scope: {
                    callback: "&",
                    geneCount:"="
                },
                controller: "reAnalysisCtr"
            }
        }

        superApp.controller("reAnalysisCtr", reAnalysisCtr);
        reAnalysisCtr.$inject = ["$rootScope", "$scope", "$log", "$state", "$window", "$timeout", "ajaxService", "toolService", "reportService"];
        function reAnalysisCtr($rootScope, $scope, $log, $state, $window, $timeout, ajaxService, toolService, reportService) {
            $scope.reAnslysisError = false;

            $scope.handlerReanalysisClick = function (type) {
                // 只有line和聚类 需要选择比较组
                if (type == 'line' || type == 'heatmap') {
                    $scope.reAnalysisEntity = {
                        "LCID": toolService.sessionStorage.get('LCID'),
                        "chartType": type
                    }

                    var ajaxConfig = {
                        data: $scope.reAnalysisEntity,
                        url: options.api.mrnaseq_url + "/analysis/GetAnalysisPop",
                    };

                    var promise = ajaxService.GetDeferData(ajaxConfig);
                    promise.then(function (responseData) {
                        if (responseData.Error) {
                            $scope.reAnslysisError = "syserror";
                        } else if (responseData.data.length == 0) {
                            $scope.reAnslysisError = "nodata";
                        } else {
                            $scope.reAnslysisError = false;
                            toolService.popAnalysis(responseData, $scope.callback, type);
                        }
                    }, function (errorMesg) {
                        $scope.reAnslysisError = "syserror";
                    });
                } else {
                    // 不需要选择比较组的重分析类型  默认只返回重分析类型
                    $scope.callback({ options: { 'type': '', 'check': [], 'chartType': type } })
                }

            }
        }
    });

