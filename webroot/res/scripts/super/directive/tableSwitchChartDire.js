/**
 * 图表切换
 * left:图表切换按钮 下拉选择  right: 精度 刷新 下载 
 * 2018年5月23日11:13:01
 */

define("superApp.tableSwitchChartDire", ["angular", "super.superMessage", "select2"],
    function(angular, SUPER_CONSOLE_MESSAGE) {
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
                    // 刷新点击回调
                    handlerRefreshClick: "&",
                    // 图的宽度比例 scale
                    scale: "=",
                    // 是否只要单选
                    onlySingle: "=",
                    // add 2018年6月12日10:32:01
                    // 是否显示前置任务
                    isShowBeforeTask: "=",
                    taskId: "=",
                    // 图表切换的图说明
                    chartDescribe: "@",
                },
                replace: false,
                transclude: true,
                controller: "tableSwitchChartCtr"
            }
        }

        superApp.controller("tableSwitchChartCtr", tableSwitchChartCtr);
        tableSwitchChartCtr.$inject = ["$rootScope", "$scope", "$log", "$state", "$window", "ajaxService", "toolService", "reportService"];

        function tableSwitchChartCtr($rootScope, $scope, $log, $state, $window, ajaxService, toolService, reportService) {
            $scope.InitPage = function() {
                $scope.accuracy = -1;
                $scope.showAccuracy = !!$scope.showAccuracy;
                $scope.error = false;
                $scope.isSelectChartData = !!$scope.isSelectChartData;
                $scope.resetChartSelect = false;
                $scope.isFirst = true;
                $scope.onlySingle = !!$scope.onlySingle;
                $scope.scale = $scope.scale || 0.8;
                if ($scope.isShowBeforeTask) $scope.GetLinks();
                $scope.GetTableData();
            }


            //get links 
            $scope.linksError = false;
            $scope.GetLinks = function() {
                var promise = ajaxService.GetDeferData({
                    data: {},
                    url: options.api.java_url + "/analysis/parent/" + $scope.taskId
                })
                promise.then(function(res) {
                    if (res.status != 200) {
                        $scope.linksError = "syserror";
                    } else {
                        $scope.linksError = false;
                        $scope.links = res.data.links;
                    }
                }, function(err) {
                    console.log(err);
                })
            }

            // 查看links
            $scope.handlerSeeClick = function(item) {
                var type = item.chartType || item.charType;
                if (item.process == 0) {
                    $window.open('../../../../ps/tools/index.html#/home/error/' + item.id);
                } else {
                    // success
                    $window.open('../../../../ps/tools/index.html#/home/' + type + '/' + item.id);
                }
            }

            $scope.GetTableData = function() {
                toolService.gridFilterLoading.open($scope.panelId);
                var ajaxConfig = {
                    data: $scope.pageEntity,
                    url: $scope.url,
                };

                var promise = ajaxService.GetDeferData(ajaxConfig);
                promise.then(function(responseData) {
                    if (responseData.Error) {
                        $scope.error = "syserror";
                    } else if (responseData.length == 0 || !responseData.rows.length) {
                        $scope.error = "nodata";
                    } else {
                        $scope.error = "";
                        $scope.tableData = responseData;
                        $scope.chartData = $scope.tabletochart ? $scope.tabletochart({ res: responseData }) : angular.copy($scope.tableData);
                        if ($scope.isFirst) {
                            $scope.chart = $scope.drawchart({ data: $scope.chartData });
                            $scope.applyChangeColor();
                            if ($scope.isSelectChartData) $scope.handlerSingle();
                        } else {
                            $scope.refreshRedraw = true;
                            if ($scope.refreshRedraw) {
                                $scope.chart = $scope.drawchart({ data: $scope.chartData });
                                $scope.applyChangeColor();
                                if ($scope.isSelectChartData) $scope.handlerSingle();
                            } else {
                                $scope.chart.options.data = $scope.chartData;
                                $scope.chart.redraw(($('#' + $scope.contentId + ' .graph_header').eq(0).width()) * $scope.scale);
                                //改标题
                                $scope.chart.dbClickTitle(function() {
                                    var textNode = d3.select(this).node();
                                    toolService.popPrompt(textNode);
                                })
                                $scope.chart.mouseoverTitle(function() {
                                    d3.select(this).attr("fill", "#5378f8");
                                    d3.select(this).append("title").text("双击修改");
                                })
                                $scope.chart.mouseoutTitle(function() {
                                    d3.select(this).attr("fill", "#000000");
                                    d3.select(this).select("title").remove();
                                })
                                $scope.applyChangeColor();
                                if ($scope.isSelectChartData) $scope.handlerSingle();
                            }
                        }
                        $scope.isFirst = false;
                    }
                    toolService.gridFilterLoading.close($scope.panelId);
                }, function(errorMesg) {
                    toolService.gridFilterLoading.close($scope.panelId);
                    $scope.error = "syserror";
                });
            }

            $scope.handlerSelectChange = function() {
                $scope.GetTableData();
                $scope.selectChangeCallback && $scope.selectChangeCallback({ arg: $scope.pageEntity[$scope.paramsKey] })
            }

            // 刷新
            $scope.handlerRefresh = function() {
                $scope.selectData = [];
                $scope.GetTableData();
                $scope.handlerRefreshClick && $scope.handlerRefreshClick();
            }

            // 选择图数据的时候
            $scope.onSelect = function(arg) {
                $scope.chartSelectFn && $scope.chartSelectFn({ 'arg': arg });
            }

            // 改色
            $scope.applyChangeColor = function() {
                (function changeColor() {
                    groupedbarGetItem();
                    var index = '';

                    function groupedbarGetItem() {
                        $scope.chart.getLegendItem(function(d, i) {
                            reportService.selectColor(changeColorCallback, $scope.panelId);
                            index = i;
                        })

                        function changeColorCallback(color2) {
                            color = color2;
                            $scope.chart.changeColor(index, color2);
                            $scope.chart.options.dataBox.normalColor[index] = [color2];
                            groupedbarChangeColor(color2);
                        }
                    }

                    function groupedbarChangeColor(color) {
                        var width = $scope.chart.getOptions().width;
                        var height = $scope.chart.getOptions().height;
                        $scope.chart.redraw(width);
                        //改标题
                        $scope.chart.dbClickTitle(function() {
                            var textNode = d3.select(this).node();
                            toolService.popPrompt(textNode);
                        })
                        $scope.chart.mouseoverTitle(function() {
                            d3.select(this).attr("fill", "#5378f8");
                            d3.select(this).append("title").text("双击修改");
                        })
                        $scope.chart.mouseoutTitle(function() {
                            d3.select(this).attr("fill", "#000000");
                            d3.select(this).select("title").remove();
                        })
                        $scope.applyChangeColor();
                        if ($scope.isSelectChartData) $scope.handlerSingle();
                        groupedbarGetItem();
                    }
                })()
            }


            // 选择图数据
            $scope.single = true;
            $scope.selectData = [];

            // 开启单选
            $scope.handlerSingle = function() {
                $scope.single = true;
                $scope.chart.selectOff()
                $scope.chart.selectOn("single", function(d) {
                    $scope.selectData = d;
                    $scope.$apply();
                });
            }

            // 开启多选
            $scope.handlerMultiple = function() {
                $scope.single = false;
                $scope.selectData = [];
                $scope.chart.selectOff();
                $scope.chart.selectOn("multiple", function(d) {
                    $scope.selectData = d;
                    $scope.$apply();
                });
            }

            // 多选确定
            $scope.handlerConfirm = function() {
                if (!$scope.single && $scope.selectData.length) {
                    $scope.chartSelectFn && $scope.chartSelectFn({ 'arg': $scope.selectData });
                }
            }

            $scope.$watch('selectData', function(newVal, oldVal) {
                // 单选才每次回调 多选只在结束时回调
                if (newVal !== oldVal) {
                    if ($scope.single) {
                        $scope.chartSelectFn && $scope.chartSelectFn({ 'arg': $scope.selectData });
                    }
                }
            })


            // redraw
            // var timer = null;
            // window.removeEventListener('resize', handlerResize);
            // window.addEventListener('resize', handlerResize, false)

            // function handlerResize() {
            //     clearTimeout(timer);
            //     timer = setTimeout(function () {
            //         if ($scope.chart) {
            //             var width = $scope.chart.getOptions().width;
            //             var height = $scope.chart.getOptions().height;
            //             $scope.chart.redraw(width);
            //             //改标题
            //             $scope.chart.dbClickTitle(function () {
            //                 var textNode = d3.select(this).node();
            //                 toolService.popPrompt(textNode);
            //             })
            //             $scope.applyChangeColor();
            //             if ($scope.isSelectChartData) $scope.handlerSingle();
            //         }
            //     }, 100)
            // }
        }
    })