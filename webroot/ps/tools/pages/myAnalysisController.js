define(['toolsApp'], function (toolsApp) {
    toolsApp.controller('myAnalysisController', myAnalysisController);
    myAnalysisController.$inject = ["$rootScope", "$http", "$scope", "$log", "$state", "$timeout", "$window", "$compile", "ajaxService", "toolService", "svgService", "reportService"];
    function myAnalysisController($rootScope, $http, $scope, $log, $state, $timeout, $window, $compile, ajaxService, toolService, svgService, reportService) {

        $scope.InitPage = function () {
            $timeout(function () {
            }, 300)

            // 是否显示查询面板
            $scope.isFilter = false;
            // 查询参数
            $scope.analysisEntity = {
                // toolService.sessionStorage.get('LCID')
                LCID: toolService.sessionStorage.get('LCID'),
                pageNum: 1,
                pageSize: 10,
                searchContent: {
                    timeStart: "",
                    timeEnd: "",
                    chartType: [],
                    status: []
                }
            };
            // 高级查询参数模板
            $scope.advanceParams = [
                {
                    "类型": [
                        { name: '聚类图', isActive: false },
                        { name: '维恩图', isActive: false },
                        { name: 'GO', isActive: false }
                    ]
                },
                {
                    "状态": [
                        { name: '成功', isActive: false },
                        { name: '失败', isActive: false },
                        { name: '运行中', isActive: false },
                        { name: '排队中', isActive: false }
                    ]
                }
            ]
            toolService.gridFilterLoading.open("myanalysis-table");

            $scope.analysisError = false;
            // url options.api.mrnaseq_url +'/analysis/GetAnalysisList'
            $scope.GetAnalysisList(1);
        }

        $scope.GetAnalysisList = function (pageNum) {
            toolService.gridFilterLoading.open("myanalysis-table");
            $scope.analysisEntity.pageNum = pageNum;
            //配置请求参数
            $scope.analysisListUrl = 'http://192.168.29.203/bgfxxt/analysis/GetAnalysisList'
            var ajaxConfig = {
                data: $scope.analysisEntity,
                url: $scope.analysisListUrl
            }
            var promise = ajaxService.GetDeferDataNoAuth(ajaxConfig);
            promise.then(function (res) {
                toolService.gridFilterLoading.close("myanalysis-table");
                if (res.Error) {
                    $scope.analysisError = 'syserror';
                    return;
                } else if (res.rows.length == 0) {
                    $scope.analysisError = 'nodata';
                    return;
                } else {
                    $scope.analysisList = res;
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

        // 查看
        $scope.handlerSeeClick = function (id, type) {
            $window.open('../tools/index.html#/home/' + type + '/' + id );
        }

        // 删除
        $scope.handlerDeleteClick = function (id) {
            //配置请求参数
            var ajaxConfig = {
                data: {},
                url: "http://192.168.29.203/bgfxxt/analysis/dalete/" + id
            }
            var promise = ajaxService.GetDeferDataNoAuth(ajaxConfig);
            promise.then(function (res) {
                if (res.status != 200) {
                    $scope.analysisError = 'syserror';
                    return;
                } else {
                    // success
                    $scope.GetAnalysisList(1);
                }
            }, function () {
                $scope.analysisError = 'syserror'
            })
        }

        // advance
        $scope.handlerParamsClick = function (item) {
            item.isActive = !item.isActive;
            console.log($scope.analysisEntity)
        }
        // document click close filter panel
        document.addEventListener('click', function () {
            $scope.isFilter = false;
            $scope.$apply();
        }, false);
    }
});