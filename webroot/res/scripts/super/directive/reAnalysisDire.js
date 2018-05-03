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
        function reAnalysisDirective($log) {
            return {
                restrict: "ACE",
                replace: true,
                template: "<div class=\"re-analysis-panel clearfix\"><button ng-click=\"handlerReanalysisClick('heatmap')\" class=\"btn btn-default tool-tip pull-right\" title=\"聚类重分析\">聚类重分析</button></div>",
                scope: {
                    callback: "&",
                },
                controller: "reAnalysisCtr"
            }
        }

        superApp.controller("reAnalysisCtr", reAnalysisCtr);
        reAnalysisCtr.$inject = ["$rootScope", "$scope", "$log", "$state", "$window", "ajaxService", "toolService", "reportService"];
        function reAnalysisCtr($rootScope, $scope, $log, $state, $window, ajaxService, toolService, reportService) {
            $scope.reAnslysisError = false;

            $scope.handlerReanalysisClick = function (type) {
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
                        toolService.popAnalysis(responseData, $scope.callback);
                    }
                }, function (errorMesg) {
                    $scope.reAnslysisError = "syserror";
                });
            }
        }
    });

