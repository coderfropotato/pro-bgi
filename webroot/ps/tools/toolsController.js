define(['toolsApp'], function (toolsApp) {

    toolsApp.controller('toolsController', toolsController);
    toolsController.$inject = ["$rootScope", "$scope", "$log", "$state", "$interval", "$timeout", "$window", "$compile", "ajaxService", "toolService", "svgService", "reportService"];
    function toolsController($rootScope, $scope, $log, $state, $timeout, $interval, $window, $compile, ajaxService, toolService, svgService, reportService) {

        $scope.loadingComplete = false;
        $scope.InitPage = function () {
            $timeout(function () {
                $scope.loadingComplete = true;
            }, 300);
        }

        // 接受我的面板显示事件
        $scope.isExpand = false;
        $scope.$on('openAnalysisPop', function () {
            // 展开我的分析面板
            $scope.isExpand = true;
        })
        // 获取我的分析页面
        $scope.analysisEntity = {
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

        $rootScope.GetAnalysisList = function (pageNum) {
            $scope.analysisEntity.pageNum = pageNum;
            //配置请求参数
            $scope.analysisListUrl = 'http://192.168.29.203/bgfxxt/analysis/GetAnalysisList'
            var ajaxConfig = {
                data: $scope.analysisEntity,
                url: $scope.analysisListUrl
            }
            var promise = ajaxService.GetDeferDataNoAuth(ajaxConfig);
            promise.then(function (res) {
                if (res.Error) {
                    $scope.analysisError = 'syserror';
                    return;
                } else if (res.rows.length == 0) {
                    $scope.analysisError = 'nodata';
                    $rootScope.analysis = [];
                    return;
                } else {
                    $rootScope.analysis = res.rows;
                    $scope.analysisError = false;
                }
            }, function () {
                $scope.analysisError = 'syserror'
            })
        }

        $rootScope.GetAnalysisList(1);

        setInterval(function () {
            $rootScope.GetAnalysisList(1);
        }, 1000 * 30)

    }
});