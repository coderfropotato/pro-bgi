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
        $rootScope.isExpand = false;
        $scope.$on('openAnalysisPop', function () {
            // 展开我的分析面板
            $rootScope.isExpand = true;
        })
        // 获取我的分析页面
        $rootScope.analysisEntity = {
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
            $rootScope.analysisEntity.pageNum = pageNum;
            //配置请求参数
            $scope.analysisListUrl = options.api.java_url+'/analysis/GetAnalysisList'
            var ajaxConfig = {
                data: $rootScope.analysisEntity,
                url: $scope.analysisListUrl
            }
            var promise = ajaxService.GetDeferData(ajaxConfig);
            promise.then(function (res) {
                if (res.status!=200) {
                    $rootScope.analysisError = 'syserror';
                } else if (res.data.rows.length == 0) {
                    $rootScope.analysisError = 'nodata';
                    $rootScope.analysis = [];
                } else {
                    $rootScope.analysis = res.data.rows;
                    $rootScope.analysisError = false;
                }
            }, function () {
                $rootScope.analysisError = 'syserror'
            })
        }

        $rootScope.GetAnalysisList(1);

        setInterval(function () {
            $rootScope.GetAnalysisList(1);
        }, 1000 * 30)

        $rootScope.colorArr = ["#1f77b4","#ff7f0e","#aec7e8","#ffbb78","#2ca02c","#ff9896","#98df8a","#d62728","#8c564b","#c49c94","#e377c2","#bcbd22","#17becf","#9edae5","#e6550d",];

    }
});