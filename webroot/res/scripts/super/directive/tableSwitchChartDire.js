/**
 * 图表切换
 * left:图表切换按钮 下拉选择  right: 精度 刷新 下载 
 * 2018年5月23日11:13:01
 */

define("superApp.tableSwitchChartDire", ["angular", "super.superMessage", "select2"],
    function (angular, SUPER_CONSOLE_MESSAGE) {
        var superApp = angular.module("superApp.tableSwitchChartDire", []);
        superApp.directive('tableSwitchChart', tableSwitchChart);
        tableSwitchChart.$inject = ["$log"];

        function tableSwitchChart($log) {
            return {
                restrict: "ACE",
                templateUrl: SUPER_CONSOLE_MESSAGE.localUrl.tableSwitchChartPath,
                scope: {
                    // 图表容器
                    contentId: "=",
                    // 图表切换面板id
                    panelId: "=",
                    // 表容器id
                    chartId: "=",
                    // 默认显示表格(true)还是图(false)  
                    isTableShow: "=",
                    // 是否显示精度下拉菜单
                    showAccuracy: "=",
                    // 是否有下拉选择
                    showSelect: "=",
                    // 下拉列表数据
                    selectList: "=",
                    // 需要展示的下拉列表的数据key {name:1,value:123} key->name 如果是基本数据类型数组 key为''
                    key: "=",
                    // selectList 当前选择的数据  对应表格查询参数的 paramsKey
                    paramsKey: "=",
                    // 表格查询参数
                    pageEntity: "=",
                    // api url
                    url: "=",
                    // 表格数据到画图数据的转换函数
                    tabletochart: "&",
                    // 画图方法
                    drawchart: "&",
                    // 表格下载名称
                    tableDownloadName: "=",
                    // 图下载名称
                    chartDownloadName: "=",
                    // 下拉选择回调
                    selectChangeCallback: "&",
                    // 是否需要选择数据
                    isSelectChartData: "=",
                    // 图选择数据回调
                    chartSelectFn: "&",
                },
                replace: false,
                transclude: true,
                controller: "tableSwitchChartCtr"
            }
        }

        superApp.controller("tableSwitchChartCtr", tableSwitchChartCtr);
        tableSwitchChartCtr.$inject = ["$rootScope", "$scope", "$log", "$state", "$window", "ajaxService", "toolService", "reportService"];

        function tableSwitchChartCtr($rootScope, $scope, $log, $state, $window, ajaxService, toolService, reportService) {
            $scope.InitPage = function () {
                $scope.accuracy = -1;
                $scope.showAccuracy = !!$scope.showAccuracy;
                $scope.error = false;
                $scope.isSelectChartData = !!$scope.isSelectChartData;
                $scope.GetTableData();
            }

            $scope.GetTableData = function () {
                toolService.gridFilterLoading.open($scope.panelId);
                var ajaxConfig = {
                    data: $scope.pageEntity,
                    url: $scope.url,
                };

                var promise = ajaxService.GetDeferData(ajaxConfig);
                promise.then(function (responseData) {
                    if (responseData.Error) {
                        $scope.error = "syserror";
                    } else if (responseData.length == 0) {
                        $scope.error = "nodata";
                    } else {
                        $scope.error = "";
                        $scope.tableData = responseData;
                        $scope.chartData = $scope.tabletochart ? $scope.tabletochart({ res: responseData }) : angular.copy($scope.tableData);
                        $scope.chart = $scope.drawchart({ data: $scope.chartData });
                    }
                    toolService.gridFilterLoading.close($scope.panelId);
                }, function (errorMesg) {
                    toolService.gridFilterLoading.close($scope.panelId);
                    $scope.error = "syserror";
                });
            }

            $scope.handlerSelectChange = function () {
                $scope.GetTableData(1);
                $scope.selectChangeCallback && $scope.selectChangeCallback({ arg: $scope.pageEntity[$scope.paramsKey] })
            }

            // 选择图数据的时候
            $scope.onSelect = function (arg) {
                console.log(arg);
                $scope.chartSelectFn && $scope.chartSelectFn({ 'arg': arg });
            }

            // // redraw
            // var timer = null;
            // window.removeEventListener('resize', handlerResize);
            // window.addEventListener('resize', handlerResize, false)
            // function handlerResize() {
            //     clearTimeout(timer);
            //     timer = setTimeout(function () {
            //         if($scope.chart) $scope.chart.redraw(($('#' + $scope.contentId + ' .graph_header').eq(0).width()) * 0.9)
            //     }, 100)
            // }
        }
    })