define(['toolsApp'], function(toolsApp) {

    toolsApp.controller('toolsController', toolsController);
    toolsController.$inject = ["$rootScope", "$scope", "$log", "$state", "$interval", "$timeout", "$window", "$compile", "ajaxService", "toolService", "svgService", "reportService"];

    function toolsController($rootScope, $scope, $log, $state, $timeout, $interval, $window, $compile, ajaxService, toolService, svgService, reportService) {

        $scope.loadingComplete = false;
        $scope.InitPage = function() {
            $timeout(function() {
                $scope.loadingComplete = true;
            }, 300);
        }

        // 接受我的面板显示事件
        $rootScope.isExpand = false;
        $scope.$on('openAnalysisPop', function() {
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

        $rootScope.GetAnalysisList = function(pageNum) {
            $rootScope.analysisEntity.pageNum = pageNum;
            //配置请求参数
            $scope.analysisListUrl = options.api.java_url + '/analysis/GetAnalysisList'
            var ajaxConfig = {
                data: $rootScope.analysisEntity,
                url: $scope.analysisListUrl
            }
            var promise = ajaxService.GetDeferDataNoAuth(ajaxConfig);
            promise.then(function(res) {
                if (res.status != 200) {
                    $rootScope.analysisError = 'syserror';
                } else if (res.data.rows.length == 0) {
                    $rootScope.analysisError = 'nodata';
                    $rootScope.analysis = [];
                } else {
                    $rootScope.analysis = res.data.rows;
                    $rootScope.analysisError = false;
                }
            }, function() {
                $rootScope.analysisError = 'syserror'
            })
        }

        $rootScope.GetAnalysisList(1);

        setInterval(function() {
            $rootScope.GetAnalysisList(1);
        }, 1000 * 30)

        $rootScope.colorArr = ["#1f77b4", "#ff7f0e", "#aec7e8", "#ffbb78", "#2ca02c", "#ff9896", "#98df8a", "#d62728", "#8c564b", "#c49c94", "#e377c2", "#bcbd22", "#17becf", "#9edae5", "#e6550d", "#66CCCB", "#CCFF66", "#FF99CC", "#FF9999", "#FFCC99", "#FF6666", "#FFFF66", "#99CC66", "#666699", "#FF9999", "#99CC33", "#FF9900", "#FFCC00", "#FF0033", "#FF9966", "#FF9900", "#CCFF00", "#CC3399", "#99CC33", "#FF6600", "#993366", "#CCCC33", "#666633", "#66CCCC", "#666699", "#FF0033", "#333399", "#CCCC00", "#33CC99", "#FFFF00", "#336699", "#FFFF99", "#99CC99", "#666600", "#996633", "#FFFF99", "#99CC66", "#006600", "#66CC66", "#CCFF99", "#666600", "#CCCC66", "#CCFFCC", "#669933", "#CCCC33", "#663300", "#666633", "#999933", "#CC9966", "#003300", "#669933", "#CCCC99", "#006633", "#663300", "#CCCC66", "#666600", "#FFFFCC", "#999999", "#006633", "#333300", "#CCCC99", "#FFFFCC", "#CCFFFF", "#FFCCCC", "#99CCCA", "#3399CC", "#CCFFCC", "#99CCCB", "#FFFFCC", "#CCCCFF", "#99CCFF", "#FFCC99", "#FFFFCC", "#99CCFF", "#336699", "#99CCCC", "#99CCCC", "#CCFF99", "#CCCCFF", "#FFFFCC", "#CCFFFF", "#99CCCC", "#336699", "#99CCFF", "#CCFFFF", "#6699CC", "#99CC33", "#3399CC", "#0099CC", "#FFFFCC", "#666699", "#CCCCCD", "#003366", "#99CCFF", "#0099CC", "#6699CC", "#336699", "#CCCC99", "#003366", "#3399CC", "#003366", "#6699CC", "#006699", "#003366", "#006699", "#999933", "#336699", "#333333", "#FFFFCC", "#CCFFFF", "#99CCCE", "#FFCC99", "#FF9999", "#996699", "#CC9999", "#FFFFCC", "#CCCC99", "#FFFF99", "#CCCCFF", "#0099CC", "#CCCCCC", "#FF9966", "#FFCCCC", "#CC9966", "#CC9999", "#FFFF66", "#CC3333", "#003366", "#993333", "#CCCC00", "#663366", "#CCCC99", "#666666", "#CC9999", "#FFFF00", "#0066CC", "#CC0033", "#CCCC00", "#336633", "#990033", "#FFCC99", "#993333", "#CC9966", "#003300", "#FF0033", "#333399", "#CCCC00", "#CC0033", "#000000", "#003399", "#000000", "#99CC00", "#CC0033", "#999933", "#993333", "#333300", "#FFFF00", "#CCCC00", "#99CCFF", "#FFCC33", "#FFFFCC", "#FFFF33", "#99CCFF", "#FFFF00", "#9933FF", "#99CCFF", "#FFCC33", "#FFFF33", "#FFCC00", "#66CC00", "#FFFF99", "#FF9900", "#FFFF00", "#0099CC", "#FFCC00", "#0000CC", "#FFFF99", "#CC9999", "#FFFFCC", "#6666CC", "#999933", "#FFFFCC", "#CC99CC", "#CCCC00", "#666600", "#FFFF66", "#FF9966", "#FFFFCC", "#99CC99", "#FFCC33"];

    }
});