/**
 * 大表
 * 下载  刷新 筛选 精度/可选 分页 页码
 * 2018年5月21日16:46:17
 */

define("superApp.bigTableDire", ["angular", "super.superMessage", "select2"],
    function (angular, SUPER_CONSOLE_MESSAGE) {
        var superApp = angular.module("superApp.bigTableDire", []);
        superApp.directive('bigTableDire', bigTableDirective);
        bigTableDirective.$inject = ["$log"];

        function bigTableDirective($log) {
            return {
                restrict: "ACE",
                templateUrl: SUPER_CONSOLE_MESSAGE.localUrl.bigTablePath,
                scope: {
                    // 表格数据查询参数
                    pageEntity: "=",
                    // 表格地址api
                    url: "=",
                    // 表格下载名称
                    tableDownloadName: "=",
                    // 面板id
                    panelId: "=",
                    // 表格面板id
                    tablePanelId: "=",
                    // 是否有下拉框
                    showSelect: "=",
                    // 下拉框的数据
                    selectList: "=",
                    // 下拉框数据key {name:key,value:"23"} key=>name
                    key: "=",
                    // 下拉框model 在pagefindEntity中的key
                    paramsKey: "=",
                    // 是否显示精度
                    showAccuracy: "=",
                    // 外部更新触发 不需要外部更新null 需要默认传false
                    outerUpdate: "=",
                    // 是否需要重置 不需要重置null 需要默认传false
                    showResetButton: "=",
                    // 是否需要重分析
                    isReanalysis: "=",
                    // isFilter  不需要外部更新null 需要默认传false
                    isFilter: "="
                },
                replace: false,
                transclude: true,
                controller: "bigTableCtr"
            }
        }

        superApp.controller("bigTableCtr", bigTableCtr);
        bigTableCtr.$inject = ["$rootScope", "$scope", "$log", "$state", "$window", "$timeout", "ajaxService", "toolService", "reportService"];

        function bigTableCtr($rootScope, $scope, $log, $state, $window, $timeout, ajaxService, toolService, reportService) {
            $scope.InitPage = function () {
                // 存之前的参数
                $scope.beforeEntity = angular.copy($scope.pageEntity);
                // 是否在筛选
                $scope.isBeginFilter = false;
                // 精度默认 全数据
                $scope.accuracy = -1;
                // 获取表格数据
                // genecount
                $scope.geneCount = 0;

                $scope.showReset = $scope.showResetButton != null;

                $scope.GetTableData(1);
            };

            //过滤查询参数 
            $scope.InitFindEntity = function (filterFindEntity) {
                $scope.pageEntity = toolService.GetGridFilterFindEntity($scope.pageEntity, filterFindEntity);
                $scope.filterText1 = toolService.GetFilterContentText($scope.pageEntity);
                $scope.GetTableData(1);
            };

            //获取注释表数据
            $scope.GetTableData = function (pageNumber) {
                toolService.gridFilterLoading.open($scope.panelId);
                $scope.pageEntity = toolService.SetGridFilterFindEntity($scope.pageEntity, "LCID", "string", "equal", toolService.sessionStorage.get("LCID"));

                $scope.pageEntity.pageNum = pageNumber;
                var ajaxConfig = {
                    data: $scope.pageEntity,
                    url: $scope.url,
                };

                var promise = ajaxService.GetDeferData(ajaxConfig);
                promise.then(function (responseData) {
                    if (responseData.Error) {
                        $scope.error = "syserror";
                        $scope.geneCount = 0;
                    } else if (responseData.length == 0) {
                        $scope.geneCount = 0;
                        $scope.error = "nodata";
                    } else {
                        $scope.error = "";
                        $scope.tableData = responseData;
                        $scope.geneCount = responseData.total;
                    }
                    toolService.gridFilterLoading.close($scope.panelId);
                }, function (errorMesg) {
                    toolService.gridFilterLoading.close($scope.panelId);
                    $scope.error = "syserror";
                });
            };

            // 点击删除筛选条件
            $scope.handleDelete = function (event) {
                var thead = angular.element(event.target).siblings('span').find('em').text();
                var clearBtn;
                for (var i = 0; i < $('#' + $scope.panelId + ' table th .grid_head').length; i++) {
                    if ($.trim($('#' + $scope.panelId + ' table th .grid_head').eq(i).text()) === thead) {
                        clearBtn = $('#' + $scope.panelId + ' table th .grid_head').eq(i).parent().find('.btnPanel').children().last();
                        break;
                    }
                }
                $timeout(function () {
                    clearBtn.triggerHandler("click");
                }, 0)
            }

            // 筛选状态改变
            $scope.handlerFilterStatusChange = function (status) {
                $scope.isBeginFilter = status;
            }

            $scope.reanalysisError = false;
            $scope.handlerReanalysis = function (params) {
                // params {'type': type, 'check': checkedItems,'chartType':chartType }

                $scope.reAnalysisEntity = {
                    entity: ''
                };
                $scope.reAnalysisEntity.entity = angular.copy($scope.pageEntity);
                $scope.reAnalysisEntity.geneUnselectList = [];
                $scope.reAnalysisEntity.url = angular.copy($scope.url).split('mrna')[1];
                // $scope.reAnalysisEntity.allThead = [];

                if (params.chartType === 'heatmap') {
                    $scope.reAnalysisEntity.chartType = params.type === 'group' ? 'heatmapGroup' : 'heatmapSample';
                } else {
                    $scope.reAnalysisEntity.chartType = params.chartType;
                }

                $scope.reAnalysisEntity.chooseType = params.type;
                $scope.reAnalysisEntity.chooseList = angular.copy(params.check);

                for (var key in $scope.geneUnselectList) {
                    $scope.reAnalysisEntity.geneUnselectList.push(key);
                }

                // 不要allThead 2018年6月6日10:46:06
                // $scope.bigTableData.baseThead.forEach(function (val, index) {
                //     $scope.reAnalysisEntity.allThead.push(val.true_key);
                // });
                var newFrame = window.open('../../../../ps/tools/index.html#/home/loading')
                var promise = ajaxService.GetDeferData({
                    data: $scope.reAnalysisEntity,
                    url: options.api.mrnaseq_url + "/analysis/ReAnalysis"
                })
                toolService.pageLoading.open('正在提交重分析申请，请稍后...');
                promise.then(function (res) {
                    toolService.pageLoading.close();
                    if (res.Error) {
                        newFrame.close();
                        $scope.reanalysisError = "syserror";
                        toolService.popMesgWindow(res.Error);
                    } else {
                        $scope.reanalysisError = false;
                        // $scope.$emit('openAnalysisPop');
                        $rootScope.GetAnalysisList(1);
                        // 如果不需要重新分析 就直接打开详情页
                        if (params.chartType === 'heatmap' || params.chartType === 'goRich' || params.chartType === 'pathwayRich') {
                            newFrame.close();
                            toolService.popMesgWindow('任务提交成功');
                        } else {
                            newFrame.location.href = '../../../../ps/tools/index.html#/home/' + $scope.reAnalysisEntity.chartType + '/' + res.id
                        }
                        var $targetOffset = $('.analysis-arrow').offset();
                        var x1 = $('.re-analysis-panel ul li').eq(2).offset().left;
                        var y1 = $('.re-analysis-panel ul li').eq(2).offset().top - 80;
                        var x2 = $targetOffset.left + 10;
                        var y2 = $targetOffset.top;
                        reportService.flyDiv("<span class='glyphicon glyphicon-plus mkcheck flyCheck'></span>", x1, y1, x2, y2);
                    }
                }, function (err) {
                    newFrame.close();
                    toolService.popMesgWindow(err);
                })
            }


            // 点击重置按钮 
            $scope.resetTable = function () {
                $scope.pageEntity = angular.copy($scope.beforeEntity);
                $scope.filterText1 = toolService.GetFilterContentText($scope.beforeEntity);
                $scope.GetTableData(1);
            }

            // 是否外部触发更新
            if ($scope.outerUpdate != undefined && $scope.outerUpdate != null) {
                $scope.$watch('outerUpdate', function (newVal, oldVal) {
                    if (newVal) {
                        $scope.filterText1 = toolService.GetFilterContentText($scope.pageEntity);
                        $scope.GetTableData(1);
                        $timeout(function () {
                            $scope.outerUpdate = false;
                        }, 30)
                    }
                })
            }

            // 外部控制筛选是否打开筛选状态
            if ($scope.isFilter != undefined && $scope.isFilter != null) {
                $scope.$watch('isFilter', function (newVal, oldVal) {
                    if (newVal) {
                        var filterBtn = $('#' + $scope.panelId + " .grid-filter-begin button");
                        if (!filterBtn.hasClass('active')) {
                            $timeout(function(){
                                angular.element(document.querySelector('#' + $scope.panelId + " .grid-filter-begin button")).triggerHandler('click');
                            },0)
                        }
                        
                        $timeout(function () {
                            $scope.isFilter = false;
                        }, 30)
                    }
                })
            }
        }
    });