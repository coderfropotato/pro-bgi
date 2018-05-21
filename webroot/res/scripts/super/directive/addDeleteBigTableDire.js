/**
 * Geneid 大表
 * 2018年5月21日11:00:47
 * 
 * 
 * 
 * <div class="add-delete-big-table" 
            page-entity="pageFindEntity" 
            url="url"
            content-id="panelId"
            table-id="tableId"
            unselect-gene-panel-id="unselectId"
            table-download-name="filename"
            gene-list="geneList"
            gene-list-change-flag="changeFlag"
            is-reset-thead-control="isResetTheadControl"
            is-reset-table-status="isResetTableStatus"
            handler-thead-change=""
        ></div>

    
 */

define("superApp.addDeleteBigTableDire",
    ["angular", "super.superMessage", "select2"],
    function (angular, SUPER_CONSOLE_MESSAGE) {
        var superApp = angular.module("superApp.addDeleteBigTableDire", []);
        superApp.directive('addDeleteBigTable', addDeleteBigTableDirective);
        addDeleteBigTableDirective.$inject = ["$log"];
        function addDeleteBigTableDirective($log) {
            return {
                restrict: "ACE",
                templateUrl: SUPER_CONSOLE_MESSAGE.localUrl.addDeleteTablePath,
                scope: {
                    // 获取数据的查询参数
                    pageEntity: "=",
                    // 获取数据url  /GeneID/GeneExpression_FPKM
                    url: "=",
                    // 父级容器id
                    contentId: "=",
                    // 表格id
                    tableId: "=",
                    // 未选择基因面板id
                    unselectGenePanelId: "=",
                    // 表格下载的名称
                    tableDownloadName: "=",
                    // 选择的基因集
                    geneList: "=",
                    // 基因集改变的标志
                    geneListChangeFlag: "=",
                    // 是否需要重置增删列指令的默认状态 不需要给null 需要默认false 需要重置的时候传true
                    isResetTheadControl: "=",
                    // 是否需要清除表格筛选状态 不需要给null 需要默认false 需要重置的时候传true
                    isResetTableStatus: "=",
                    // 增删列表头选择改变的回调 params {Object} a => {add:[],delete:[],all:[]}
                    handlertheadChange: "&"
                },
                replace: false,
                transclude: true,
                controller: "addDeletBigTableCtr"
            }
        }

        superApp.controller("addDeletBigTableCtr", addDeletBigTableCtr);
        addDeletBigTableCtr.$inject = ["$rootScope", "$scope", "$log", "$state", "$window", "$timeout", "ajaxService", "toolService", "reportService"];
        function addDeletBigTableCtr($rootScope, $scope, $log, $state, $window, $timeout, ajaxService, toolService, reportService) {
            toolService.pageLoading.open();
            $scope.InitPage = function () {
                // $scope.compareGroup = '';
                $scope.isBeginFilter = false;
                // 重置时使用
                $scope.initPageEntity = $scope.pageEntity;
                // 其他逻辑请求参数
                $scope.pageFindEntity = $scope.pageEntity;
                // 精度默认 全数据
                $scope.accuracy = -1;
                // 获取增删列dire数据
                $scope.allTableHeader = JSON.parse(toolService.sessionStorage.get('allThead'));
                // 获取表格数据
                $scope.GetBigTableData(1);
            };

            // watch table status 需要的时候重置表格的筛选状态
            if ($scope.isResetTableStatus != undefined && $scope.isResetTableStatus != null) {
                $scope.$watch('isResetTableStatus', function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                        if (newVal) {
                            if ($('#' + $scope.contentId + ' .grid-filter-begin > button').hasClass('active')) {
                                $timeout(function () {
                                    angular.element($('#' + $scope.contentId + ' .grid-filter-begin > button')).triggerHandler('click');
                                    $timeout(function () {
                                        $scope.filterText1 = toolService.GetFilterContentText($scope.pageFindEntity);
                                    }, 30)
                                }, 0);
                            }
                        }
                    }
                })
            }
            // 指定外部调用筛选指令的查询参数集合
            $scope.geneidCustomSearchType = "$in";
            $scope.geneidCustomSearchOne = "";

            // 改变筛选条件  切换比较组 框选基因  都需要重置 基因列表
            $scope.geneUnselectList = '';
            $scope.isShowGeneListPanel = false;

            // 基因列表 hover
            $scope.handlerMouseEnter = function () {
                $scope.isShowGeneListPanel = true;
            }
            $scope.handlerMouseLeave = function () {
                $scope.isShowGeneListPanel = false;
            }

            // 删除genelist某一项
            $scope.removeGeneItem = function (key) {
                delete $scope.geneUnselectList[key];
                for (var i = 0; i < $scope.bigTableData.rows.length; i++) {
                    if ($scope.bigTableData.rows[i][$scope.geneid_truekey] === key) {
                        $scope.bigTableData.rows[i].isChecked = true;
                        $scope.computedTheadStatus();
                        break;
                    }
                }
            }

            // 基因集改变后的公共逻辑
            $scope.handlerGeneListChangeCommon = function (geneList) {
                var searchOne = '';
                // 重置基因列表
                $scope.geneUnselectList = '';
                // 拼接GeneID
                searchOne = geneList.split('\n');
                // 如果没有点击筛选按钮 就点击
                if (!$('#' + $scope.contentId + ' .grid-filter-begin > button').hasClass('active')) {
                    $timeout(function () {
                        angular.element($('#' + $scope.contentId + ' .grid-filter-begin > button')).triggerHandler('click');
                        $scope.geneidCustomSearchOne = searchOne.substring(0, searchOne.length - 1);
                    }, 0);
                } else {
                    $scope.geneidCustomSearchOne = searchOne.substring(0, searchOne.length - 1);
                }
                // 重置未选择列表
                $scope.geneUnselectList = {};
                $scope.checkAll();
                $scope.checkedAll = true;
            }

            // 获取genelist 重新获取表格数据 渲染筛选条件
            $scope.setGeneList = function (geneList) {
                $scope.handlerGeneListChangeCommon(geneList);
            }

            // watch genelist flag的改变
            $scope.$watch('geneListChangeFlag', function (newVal, oldVal) {
                if (newVal != oldVal) {
                    if (newVal) {
                        $scope.handlerGeneListChangeCommon($scope.geneList);
                        $timeout(function () {
                            // 自动重置为初始状态 为了触发下一次change
                            $scope.geneListChangeFlag = false;
                        }, 30)
                    }
                }
            }, true)

            // thead change event
            $scope.theadChange = function (a) {
                var addThead = [];
                var deleteArr = [];
                $scope.add = [];
                // 当前新增的表头
                a.add.forEach(function (val, index) {
                    $scope.add = $scope.add.concat(val.children);
                })
                // 所有新加的表头
                a.all.forEach(function (val, index) {
                    addThead = addThead.concat(val.children);
                })
                // 当前删除的表头
                a.delete.forEach(function (val, index) {
                    deleteArr = deleteArr.concat(val.children);
                });

                for (var i = 0, len = deleteArr.length; i < len; i++) {
                    $scope.pageFindEntity.searchContentList.forEach(function (val, index) {
                        if (val.filterName !== 'LCID') {
                            if (val.filterName === deleteArr[i]) {
                                if (val.isSort) {
                                    val.isSort = false;
                                    $scope.pageFindEntity.sortName = '';
                                    $scope.pageFindEntity.sortnamezh = '';
                                    $scope.pageFindEntity.sortType = '';
                                }
                                $scope.pageFindEntity.searchContentList.splice(index, 1);
                            }
                        }
                    })
                }

                $scope.pageFindEntity.addThead = addThead;
                $scope.filterText1 = toolService.GetFilterContentText($scope.pageFindEntity);
                $scope.GetBigTableData();
                $scope.handlertheadChange && $scope.handlertheadChange(a);
            }


            // 初始化页面查询参数
            $scope.InitFindEntity1 = function (filterFindEntity) {
                //获得页面查询实体信息
                $scope.pageFindEntity = toolService.GetGridFilterFindEntity($scope.pageFindEntity, filterFindEntity);
                //获得页面查询条件转译信息
                $scope.filterText1 = toolService.GetFilterContentText($scope.pageFindEntity);
                // 重置未选择的GENE
                $scope.geneUnselectList = '';
                //获取基因表达量表
                $scope.GetBigTableData(1);
            };

            // 删除页面查询参数
            $scope.deleteFindEntity = function () {
                var filterName = angular.element(event.target).siblings('span').find('em').text();
                $scope.pageFindEntity = toolService.DeleteFilterFindEntity($scope.pageFindEntity, [filterName]);
                $scope.filterText1 = toolService.GetFilterContentText($scope.pageFindEntity);
                $scope.GetBigTableData(1);
            }

            // 获取大表数据
            $scope.GetBigTableData = function (pageNumber) {
                toolService.gridFilterLoading.open($scope.tableId);
                $scope.pageFindEntity = toolService.SetGridFilterFindEntity($scope.pageFindEntity, "LCID", "string", "equal", toolService.sessionStorage.get("LCID"));

                $scope.pageFindEntity.pageNum = pageNumber;
                $scope.exportLocationGOAnno = options.api.mrnaseq_url + $scope.url;
                var ajaxConfig = {
                    data: $scope.pageFindEntity,
                    url: $scope.exportLocationGOAnno,
                };
                var promise = ajaxService.GetDeferData(ajaxConfig);
                promise.then(function (responseData) {
                    if (responseData.Error) {
                        $scope.error = "syserror";
                    } else if (responseData.length == 0) {
                        $scope.error = "nodata";
                    } else {
                        $scope.error = "";
                        $scope.bigTableData = responseData;
                        $scope.bigTableData.thead = [];
                        // 第零个就是geneid
                        $scope.geneid = $scope.bigTableData.baseThead[0];
                        $scope.geneid_truekey = $scope.bigTableData.baseThead[0].true_key;

                        for (var key in $scope.bigTableData.rows[0]) {
                            $scope.bigTableData.thead.push(key);
                        }

                        // geneUnSelectList 是否包含回来的新数据
                        var isIn = false;
                        $scope.bigTableData.rows.map(function (value, index) {
                            value.isChecked = true;
                            if ($scope.geneUnselectList) {
                                for (var geneid in $scope.geneUnselectList) {
                                    if (value[$scope.geneid.true_key] === geneid) {
                                        value.isChecked = false;
                                        isIn = true;
                                    }
                                }
                            }
                        });

                        isIn ? $scope.checkedAll = false : $scope.checkedAll = true;
                    }

                    toolService.gridFilterLoading.close($scope.tableId);
                }, function (errorMesg) {
                    toolService.gridFilterLoading.close($scope.tableId);
                    $scope.error = "syserror";
                });
            };

            // 点击GeneID获取Gene信息
            $scope.showGeneInfo = function (GeneID) {
                var genomeVersion = toolService.sessionStorage.get('GenomeID');
                var geneInfo = {
                    genomeVersion: genomeVersion,
                    geneID: GeneID
                };
                pageFactory.set(geneInfo);
                toolService.popWindow("cyjyfx_2_pop.html", "基因" + GeneID + "信息", 640, 100, "dialog-default", 50, true, null);
            }

            // delete one filter content
            $scope.handleDelete = function (event) {
                var thead = angular.element(event.target).siblings('span').find('em').text();
                var clearBtn;
                // var count = 0;
                for (var i = 0; i < $('#' + $scope.contentId + ' table th .grid_head').length; i++) {
                    if ($.trim($('#' + $scope.contentId + ' table th .grid_head').eq(i).text()) === thead) {
                        clearBtn = $('#' + $scope.contentId + ' table th .grid_head').eq(i).parent().find('.btnPanel').children().last();
                        // count++;
                    }
                }
                // if (count > 1) {
                //     // 服务删除多个搜索条件
                //     $scope.pageFindEntity = toolService.DeleteFilterFindEntity($scope.pageFindEntity, thead);
                //     $scope.filterText1 = toolService.GetFilterContentText($scope.pageFindEntity);
                // } else {
                $timeout(function () {
                    clearBtn.triggerHandler("click");
                }, 0)
                // }
            }

            // 清空 未选中的基因集
            $scope.handlerClearUnselect = function () {
                $scope.geneUnselectList = {};
                $scope.bigTableData.rows.forEach(function (val, index) {
                    val.isChecked = true;
                });
                $scope.checkedAll = true;
            }
            // table 选中事件
            // 全选事件
            $scope.checkAll = function () {
                $scope.bigTableData.rows.forEach(function (val, index) {
                    val.isChecked = true;
                });
            }

            // 全不选事件
            $scope.unCheckAll = function () {
                angular.forEach($scope.bigTableData.rows, function (val, index) {
                    val.isChecked = false;
                });
            }

            // 全选点击事件
            $scope.handlerCheckedAll = function () {
                $scope.checkedAll = !$scope.checkedAll;
                $scope.checkedAll ? $scope.checkAll() : $scope.unCheckAll();
                // 全选取消geneUnselectList里的项
                if ($scope.geneUnselectList === '') $scope.geneUnselectList = {};
                if ($scope.checkedAll) {
                    for (var i = 0; i < $scope.bigTableData.rows.length; i++) {
                        if ($scope.geneUnselectList[$scope.bigTableData.rows[i][$scope.geneid['true_key']]]) {
                            delete $scope.geneUnselectList[$scope.bigTableData.rows[i][$scope.geneid['true_key']]];
                        }
                    }
                } else {
                    // 全不选
                    for (var j = 0; j < $scope.bigTableData.rows.length; j++) {
                        $scope.geneUnselectList[$scope.bigTableData.rows[j][$scope.geneid['true_key']]] = $scope.bigTableData.rows[j][$scope.geneid['true_key']];
                    }
                }

            }

            // 每一行点击选择
            $scope.handlerChecked = function (index, event) {
                $scope.bigTableData.rows[index].isChecked = !$scope.bigTableData.rows[index].isChecked;
                $scope.computedTheadStatus();
                // 如果没选中
                if ($scope.geneUnselectList === '') $scope.geneUnselectList = {};
                if (!$scope.bigTableData.rows[index].isChecked) {
                    $scope.geneUnselectList[$scope.bigTableData.rows[index][$scope.geneid['true_key']]] = $scope.bigTableData.rows[index][$scope.geneid['true_key']];
                    // animation
                    var $targetOffset = $("#"+$scope.unselectGenePanelId).offset();
                    var x1 = event.pageX;
                    var y1 = event.pageY;
                    var x2 = $targetOffset.left + 110;
                    var y2 = $targetOffset.top + 15;
                    reportService.flyDiv("<span class='glyphicon glyphicon-plus mkcheck flyCheck'></span>", x1, y1, x2, y2);
                } else {
                    // 如果是选中 就从geneUnselectList里删除
                    delete $scope.geneUnselectList[$scope.bigTableData.rows[index][$scope.geneid['true_key']]];
                }
            }

            // 判断是否全部选中或者全部没选中 联动表头
            $scope.computedTheadStatus = function () {
                var length = $scope.bigTableData.rows.length;
                var checkCount = 0;
                var unCheckCount = 0;

                $scope.bigTableData.rows.forEach(function (val, index) {
                    val.isChecked ? checkCount++ : unCheckCount++;
                });

                // 全选  全部选  一半一半
                if (checkCount === length) {
                    $scope.checkedAll = true;
                } else if (unCheckCount === length) {
                    $scope.checkedAll = false;
                } else {
                    $scope.checkedAll = false;
                }
            }

            // 筛选状态改变
            $scope.handlerFilterStatusChange = function (status) {
                $scope.isBeginFilter = status;
                if (!$scope.isBeginFilter) $scope.geneidCustomSearchOne = '';
            }

            // watch geneUnselectList 生成length
            $scope.geneUnselectListLength = 0;
            $scope.$watch('geneUnselectList', function (newVal, oldVal) {
                if (newVal != oldVal) {
                    $scope.geneUnselectListLength = 0;
                    if (newVal) {
                        for (var name in $scope.geneUnselectList) {
                            $scope.geneUnselectListLength++;
                        }
                    }
                }
            }, true)
        }
    });

