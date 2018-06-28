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
                    + "<li class='pull-left' ng-class=\"{'disabled':heatmapError}\" uib-tooltip=\"{{heatmapError?'选择2-2000个基因作图':'聚类'}}\" ng-click=\"handlerReanalysisClick(heatmapError,'heatmap')\"><i class=\"iconfont icon-tools icon-juleizhongfenxi\"></i></li>"
                    + "<li class='pull-left' ng-class=\"{'disabled':goRichError}\"uib-tooltip=\"{{goRichError?'至少选择三个基因作图':'GO富集'}}\" ng-click=\"handlerReanalysisClick(goRichError,'goRich')\"><i class=\"iconfont icon-tools icon-go\"></i></li>"
                    + "<li class='pull-left' ng-class=\"{'disabled':pathwayRichError}\" uib-tooltip=\"{{pathwayRichError?'至少选择三个基因作图':'kegg富集'}}\" ng-click=\"handlerReanalysisClick(pathwayRichError,'pathwayRich')\"><i class=\"iconfont icon-tools icon-pathwayfuji\"></i></li>"
                    + "<li class='pull-left' ng-class=\"{'disabled':goClassError}\" uib-tooltip=\"{{goClassError?'至少选择一个基因作图':'GO分类'}}\" ng-click=\"handlerReanalysisClick(goClassError,'goClass')\"><i class=\"iconfont icon-tools icon-gofenlei\"></i></li>"
                    + "<li class='pull-left' ng-class=\"{'disabled':pathwayClassError}\" uib-tooltip=\"{{pathwayClassError?'至少选择一个基因作图':'kegg分类'}}\" ng-click=\"handlerReanalysisClick(pathwayClassError,'pathwayClass')\"><i class=\"iconfont icon-tools icon-pathwayfenlei\"></i></li>"
                    + "<li class='pull-left' ng-class=\"{'disabled':lineError}\" uib-tooltip=\"{{lineError?'选择1-10个基因作图':'折线图'}}\" ng-click=\"handlerReanalysisClick(lineError,'line')\"><i class=\"iconfont icon-tools icon-zhexiantu\"></i></li>"
                    + "<li class='pull-left' ng-class=\"{'disabled':netError}\" uib-tooltip=\"{{netError?'选择1-500个基因作图':'网路图'}}\" ng-click=\"handlerReanalysisClick(netError,'net')\"><i class=\"iconfont icon-tools icon-danbaiwangluohuzuo\"></i></li>"
                    + "</ul>"
                    + "</div>",
                scope: {
                    callback: "&",
                    geneCount: "="
                },
                controller: "reAnalysisCtr"
            }
        }

        superApp.controller("reAnalysisCtr", reAnalysisCtr);
        reAnalysisCtr.$inject = ["$rootScope", "$scope", "$log", "$state", "$window", "$timeout", "ajaxService", "toolService", "reportService"];
        function reAnalysisCtr($rootScope, $scope, $log, $state, $window, $timeout, ajaxService, toolService, reportService) {
            $scope.reAnslysisError = false;

            $scope.heatmapError = false;
            $scope.goClassError = false;
            $scope.goRichError = false;
            $scope.pathwayClassError = false;
            $scope.pathwayRichError = false;
            $scope.lineError = false;
            $scope.netError = false;

            $scope.handlerReanalysisClick = function (error, type) {
                if (!error) {
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
                        $scope.callback({ options: { 'type': '', 'check': [], 'chartType': type }, status: false });
                    }
                }
            }

            $scope.$watch('geneCount', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    if (newVal >= 1) {
                        if (newVal == 1) {
                            $scope.heatmapError = true;
                            $scope.goClassError = false;
                            $scope.goRichError = true;
                            $scope.pathwayClassError = false;
                            $scope.pathwayRichError = true;
                            $scope.lineError = false;
                            $scope.netError = false;
                        } else {
                            // >1   2|| 2+
                            if (newVal == 2) {
                                $scope.heatmapError = false;
                                $scope.goClassError = false;
                                $scope.goRichError = true;
                                $scope.pathwayClassError = false;
                                $scope.pathwayRichError = true;
                                $scope.lineError = false;
                                $scope.netError = false;
                            } else {
                                // 2+
                                if (newVal == 3) {
                                    $scope.heatmapError = false;
                                    $scope.goClassError = false;
                                    $scope.goRichError = false;
                                    $scope.pathwayClassError = false;
                                    $scope.pathwayRichError = false;
                                    $scope.lineError = false;
                                    $scope.netError = false;
                                } else {
                                    // 3-100
                                    if (newVal <= 100) {
                                        $scope.heatmapError = false;
                                        $scope.goClassError = false;
                                        $scope.goRichError = false;
                                        $scope.pathwayClassError = false;
                                        $scope.pathwayRichError = false;
                                        $scope.lineError = false;
                                        $scope.netError = false;
                                    } else {
                                        // 100-500
                                        $scope.lineError = true;
                                        if (newVal > 10 && newVal < 501) {
                                            $scope.heatmapError = false;
                                            $scope.goClassError = false;
                                            $scope.goRichError = false;
                                            $scope.pathwayClassError = false;
                                            $scope.pathwayRichError = false;
                                            $scope.netError = false;
                                        } else {
                                            // 500+
                                            if (newVal > 2000) {
                                                $scope.heatmapError = true;
                                            } else {
                                                $scope.heatmapError = false;
                                            }

                                            $scope.goClassError = false;
                                            $scope.goRichError = false;
                                            $scope.pathwayClassError = false;
                                            $scope.pathwayRichError = false;
                                            $scope.netError = true;
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        $scope.heatmapError = true;
                        $scope.goClassError = true;
                        $scope.goRichError = true;
                        $scope.pathwayClassError = true;
                        $scope.pathwayRichError = true;
                        $scope.lineError = true;
                        $scope.netError = true;
                    }
                }
            })
        }
    });

