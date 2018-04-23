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
                template: "<div class=\"re-analysis-panel clearfix\"><button class=\"btn btn-default btn-silver pull-right\">重新分析</button></div>",
                scope: {
                },
                link: function (scope, element, attrs) {
                    scope.initOptions = angular.copy(scope.setOptions);
                },
                controller: "reAnalysisCtr"
            }
        }

        superApp.controller("reAnalysisCtr", reAnalysisCtr);
        reAnalysisCtr.$inject = ["$rootScope", "$scope", "$log", "$state", "$window", "ajaxService", "toolService", "reportService"];
        function reAnalysisCtr($rootScope, $scope, $log, $state, $window, ajaxService, toolService, reportService) {
           
        }
    });

