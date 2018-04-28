define(['toolsApp'], function (toolsApp) {
    toolsApp.controller('myAnalysisController', myAnalysisController);
    myAnalysisController.$inject = ["$rootScope", "$http", "$scope", "$log", "$state", "$timeout", "$window", "$compile", "ajaxService", "toolService", "svgService", "reportService"];
    function myAnalysisController($rootScope, $http, $scope, $log, $state, $timeout, $window, $compile, ajaxService, toolService, svgService, reportService) {

        $scope.InitPage = function () {
            $timeout(function () {
            }, 300)

            $scope.analysisList = {
                "pageNum": 1,
                "pageSize": 10,
                "total": 126,
                "rows": [
                    {
                        name: "聚类",
                        status: "success",
                        link: [
                            {
                                type: "样本表达",
                                name: "项目1"
                            },
                            {
                                type: "样本表达",
                                name: "项目2"
                            },
                            {
                                type: "样本表达",
                                name: "项目3"
                            }
                        ],
                        submitTime: "2017-1-4 17:12:50"
                    },
                    {
                        name: "GO1",
                        status: "success",
                        link: [{
                            type: "样本表达",
                            name: "项目1"
                        }],
                        submitTime: "2017-1-4 17:12:50"
                    },
                    {
                        name: "维恩图",
                        status: "failure",
                        link: [{
                            type: "样本表达",
                            name: "项目1"
                        }],
                        submitTime: "2017-1-4 17:12:50"
                    }, {
                        name: "聚类01",
                        status: "running",
                        link: [{
                            type: "样本表达",
                            name: "项目1"
                        }],
                        submitTime: "2017-1-4 17:12:50"
                    }
                ]
            };
            // 是否显示查询面板
            $scope.isFilter = false;
            // 查询参数
            $scope.analysisEntity = {
                LCID: "test01",
                pageNum: 1,
                pageSize: 10,
                searchContent: {
                    timeStart: "",
                    timeEnd: "",
                    chartType: [],
                    status: []
                },
                total:0
            };
            // toolService.gridFilterLoading.open("myanalysis-table");

            $scope.analysisError = false;
            // url options.api.mrnaseq_url +'/analysis/GetAnalysisList'
            $scope.GetAnalysisList(1);
        }

        $scope.GetAnalysisList = function (pageNum) {
            //loading
            // toolService.gridFilterLoading.open("myanalysis-table");
            $scope.analysisEntity.pageNum = pageNum;
            //配置请求参数
            $scope.analysisListUrl = 'http://192.168.29.203/bgfxxt/analysis/GetAnalysisList'
            var ajaxConfig = {
                data: $scope.analysisEntity,
                url: $scope.analysisListUrl
            }
            var promise = ajaxService.GetDeferDataNoAuth(ajaxConfig);
            promise.then(function (res) {
                console.log(res);
                toolService.gridFilterLoading.close("myanalysis-table");
                if (res.Error) {
                    $scope.analysisError = 'syserror';
                    return;
                } else if (res.analysisList.rows.length == 0) {
                    $scope.analysisError = 'nodata';
                    return;
                } else {
                    $scope.analysisList = res;
                    console.log($scope.analysisList);
                    $scope.analysisError = false;
                }
            }, function () {
                $scope.analysisError = 'syserror'
                toolService.gridFilterLoading.close("myanalysis-table");
            })
        }

        // 高级筛选
        $scope.handlerAdvanceClick = function (event) {
            $scope.isFilter = !$scope.isFilter;
            event.stopPropagation();
        }

        // 筛选面板点击事件
        $scope.handlerFilterPanelClick = function (event) {
            event.stopPropagation();
        }

        // 筛选
        $scope.handlerFilterClick = function () {
            $scope.isFilter = false;
        }

        // document click close filter panel
        document.addEventListener('click', function () {
            $scope.isFilter = false;
            $scope.$apply();
        }, false);
    }
});