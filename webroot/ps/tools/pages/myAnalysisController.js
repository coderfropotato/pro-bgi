


define(['toolsApp'], function (toolsApp) {
    toolsApp.controller('myAnalysisController', myAnalysisController);
    myAnalysisController.$inject = ["$rootScope", "$http", "$scope", "$log", "$state", "$timeout", "$window", "$compile", "ajaxService", "toolService", "svgService", "reportService"];
    function myAnalysisController($rootScope, $http, $scope, $log, $state, $timeout, $window, $compile, ajaxService, toolService, svgService, reportService) {

        $scope.InitPage = function () {
            $timeout(function () {
            }, 300)
            // title
            $scope.title = '我的分析';
            // 是否显示查询面板
            $scope.isFilter = false;
            // 查询参数
            $scope.analysisEntity = {
                // toolService.sessionStorage.get('LCID')
                LCID: toolService.sessionStorage.get('LCID'),
                pageNum: 1,
                pageSize: 10,
                searchContent: {
                    label: "",
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
                        { name: '差异聚类', value: 'heatmapGroup', isActive: false },
                        { name: '表达量聚类', value: 'heatmapSample', isActive: false },
                        { name: 'GO 富集', value: 'goRich', isActive: false },
                        { name: 'KEGG 富集', value: 'pathwayRich', isActive: false },
                        { name: 'GO 分类', value: 'goClass', isActive: false },
                        { name: 'KEGG 分类', value: 'pathwayClass', isActive: false },
                        { name: '折线图', value: 'line', isActive: false },
                        { name: '蛋白网络图', value: 'net', isActive: false },
                    ]
                },
                {
                    "状态": [
                        { name: '成功', value: '1', isActive: false },
                        { name: '失败', value: '0', isActive: false },
                        { name: '运行中', value: '-1', isActive: false }
                    ]
                }
            ]
            $scope.beforeAdvanceParams = angular.copy($scope.advanceParams);

            toolService.gridFilterLoading.open("myanalysis-table");

            $scope.analysisError = false;
            // url options.api.mrnaseq_url +'/analysis/GetAnalysisList'
            $scope.GetAnalysisList(1);
        }

        $scope.GetAnalysisList = function (pageNum) {
            toolService.gridFilterLoading.open("myanalysis-table");
            $scope.analysisEntity.pageNum = pageNum;
            //配置请求参数
            $scope.analysisListUrl = options.api.java_url + '/analysis/GetAnalysisList'
            var ajaxConfig = {
                data: $scope.analysisEntity,
                url: $scope.analysisListUrl
            }
            var promise = ajaxService.GetDeferDataNoAuth(ajaxConfig);
            promise.then(function (res) {
                toolService.gridFilterLoading.close("myanalysis-table");
                if (res.status != 200) {
                    $scope.analysisError = 'syserror';
                } else if (res.data.rows.length == 0) {
                    $scope.analysisError = 'nodata';
                } else {
                    $scope.analysisList = res.data;
                    $scope.beforeList = angular.copy(res.data);
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

            $scope.analysisEntity.searchContent.chartType = [];
            $scope.analysisEntity.searchContent.status = [];
            for (var name in $scope.advanceParams[0]) {
                $scope.advanceParams[0][name].forEach(function (val, index) {
                    if (val.isActive) $scope.analysisEntity.searchContent.chartType.push(val.value);
                });
            }
            for (var name in $scope.advanceParams[1]) {
                $scope.advanceParams[1][name].forEach(function (val, index) {
                    if (val.isActive) $scope.analysisEntity.searchContent.status.push(val.value);
                });
            }

            $scope.GetAnalysisList(1);
        }

        $scope.handlerRemoveShow = function () {
            $('.tools-analysis-panel .filter .remove').show();
        }
        var timer = null;
        $scope.handlerRemoveHide = function () {
            if (timer) clearTimeout(timer);
            timer = setTimeout(function () {
                $('.tools-analysis-panel .filter .remove').hide();
            }, 120)
        }

        $scope.handlerRemoveIconShow = function () {
            clearTimeout(timer);
        }

        $scope.handlerClearSearch = function () {
            $scope.analysisEntity.searchContent.label = '';
            $scope.handlerFilterClick();
        }

        // 搜索
        var searchTimer = null;
        $scope.handlerSearch = function (event) {
            if (event.keyCode === 13) {
                // 回车立马搜索
                $scope.handlerFilterClick();
                if (searchTimer) clearTimeout(searchTimer);
            } else {
                // 不是回车就开定时器
                if (searchTimer) clearTimeout(searchTimer);
                searchTimer = setTimeout(function () {
                    $scope.handlerFilterClick();
                }, 1200);

            }
        }

        // 重置筛选条件
        $scope.handlerResetClick = function (event) {
            // 重置时间
            $scope.analysisEntity.searchContent.timeStart = '';
            $scope.analysisEntity.searchContent.timeEnd = '';

            // 重置筛选条件
            $scope.advanceParams = angular.copy($scope.beforeAdvanceParams);
            event.stopPropagation();
        }

        // 查看
        $scope.handlerSeeClick = function (item) {
            var type = item.chartType || item.charType;
            // process, id, type
            // error
            if (item.process == 0) {
                $window.open('../tools/index.html#/home/error/' + item.id);
            } else {
                // success
                $window.open('../tools/index.html#/home/' + type + '/' + item.id);
            }
        }

        // 删除
        $scope.handlerDeleteClick = function (id) {
            //配置请求参数
            var ajaxConfig = {
                data: {},
                url: options.api.java_url + "/analysis/delete/" + id
            }
            var promise = ajaxService.GetDeferData(ajaxConfig);
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

        // rename
        $scope.handlerEditClick = function (index, item) {
            $scope.analysisList.rows.forEach(function (val, index) {
                val.isEdit = false;
            })
            item.isEdit = true;
            if (timer) $timeout.cancel(timer);
            var timer = $timeout(function () {
                $('.editProject input').eq(index).get(0).focus();
            }, 0)
        }

        $scope.handlerEditClick2 = function (index, item) {
            $scope.analysisList.rows.forEach(function (val, index) {
                val.isEditRemark = false;
            })
            item.isEditRemark = true;
            if (timer) $timeout.cancel(timer);
            var timer = $timeout(function () {
                $('.editRemark input').eq(index).get(0).focus();
            }, 0)
        }

        // keyup
        // $scope.handlerKeyUp = function (event,index,item,value) {
        //     if (event.keyCode === 13) {
        //         $scope.handlerBlur(index,item,value);
        //     }
        // }
        $scope.projectIsSave = false;
        $scope.handlerBlur = function (index, item, value) {
            // 去掉空白字符
            if ($scope.projectIsSave) return;
            $scope.projectIsSave = true;
            if (/\s/g.test(value)) {
                value = value.replace(/\s/g, '');
            }
            if (!value) {
                item.projectName = $scope.beforeList.rows[index].projectName;
                item.isEdit = false;
                $scope.projectIsSave = false;
                return;
            }
            // 相比之前修改了
            if (!angular.equals(value, $scope.beforeList.rows[index].projectName) && value.length || value == 0) {
                //配置请求参数
                var ajaxConfig = {
                    data: {
                        id: item.id,
                        nickName: value
                    },
                    url: options.api.java_url + '/reanalysis/nickname'
                }
                var promise = ajaxService.GetDeferData(ajaxConfig);
                promise.then(function (res) {
                    if (res.status != 200) {
                        item.projectName = $scope.beforeList.rows[index].projectName;
                    } else {
                        // 更新之前的状态到最新的值
                        $scope.beforeList.rows[index].projectName = value;
                        item.isEdit = false;
                    }
                    $scope.projectIsSave = false;
                }, function (err) {
                    console.log(err);
                    $scope.projectIsSave = false;
                })
            } else {
                // 没有修改
                item.projectName = value;
                item.isEdit = false;
                $scope.projectIsSave = false;
            }
        }

        $scope.handlerKeyUp = function (event, index, item, value) {
            if (event.keyCode === 13) {
                if ($scope.projectIsSave) return;
                $scope.handlerBlur(index, item, value);
            } else {
                item.projectName = value.length > 50 ? value.substring(0, 50) : value;
            }
        }


        $scope.labelIsSave = false;
        $scope.handlerBlur2 = function (index, item, value) {
            if ($scope.labelIsSave) return;
            $scope.labelIsSave = true;
            // 去掉空白字符
            if (/\s/g.test(value)) {
                value = value.replace(/\s/g, '');
            }
            // 相比之前修改了
            if (!angular.equals(value, $scope.beforeList.rows[index].remark) && value.length || value == 0) {
                //配置请求参数
                var ajaxConfig = {
                    data: {
                        tid: item.id,
                        content: value
                    },
                    url: options.api.java_url + '/reanalysis/remark'
                }
                var promise = ajaxService.GetDeferData(ajaxConfig);
                promise.then(function (res) {
                    if (res.status != 200) {
                        item.remark = $scope.beforeList.rows[index].remark;
                        item.isEditRemark = false;
                    } else {
                        // 更新之前的状态到最新的值
                        $scope.beforeList.rows[index].remark = value;
                        item.isEditRemark = false;
                    }
                    $scope.labelIsSave = false;
                }, function (err) {
                    $scope.labelIsSave = false;
                    console.log(err);
                })
            } else {
                // 没有修改
                item.remark = value;
                item.isEditRemark = false;
                $scope.labelIsSave = false;
            }
        }

        $scope.handlerKeyUp2 = function (event, index, item, value) {
            if (event.keyCode === 13) {
                if ($scope.labelIsSave) return;
                $scope.handlerBlur2(index, item, value);
            } else {
                item.remark = value.length > 100 ? value.substring(0, 100) : value;
            }
        }


        // advance
        $scope.handlerParamsClick = function (item) {
            item.isActive = !item.isActive;
        }

        // document click close filter panel
        document.addEventListener('click', function () {
            $scope.isFilter = false;
            $scope.$apply();
        }, false);
    }
});