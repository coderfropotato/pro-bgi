/**
 * 表头增删指令
 */
define("superApp.theadControlDire",
    ["angular", "super.superMessage", "select2"],
    function (angular, SUPER_CONSOLE_MESSAGE) {
        var superApp = angular.module("superApp.theadControlDire", []);
        /**
         * [
                { groupName: "样本表达量", list: ["sampleA1", "sampleA2", "sampleA3"] },
                { groupName: "样本差异", list: ["sampleA1", "sampleA2", "sampleA3"] },
                { groupName: "组间差异", list: ['A', "B", "C", "D"] },
                { groupName: "比对注释", list: ["GO", "KEGG", "COG", "Swissport"] },
                { groupName: "其他", list: ["null"] },
            ]
         */
        superApp.directive('theadControl', theadControlDirective);
        theadControlDirective.$inject = ["$log"];
        function theadControlDirective($log) {
            return {
                restrict: "ACE",
                template: "<button class=\"btn btn-default btn-silver btn-sm\" ng-click=\"toggleShow()\">AddColumns</button>"
                    + "<div ng-show=\"show\"  class=\"thead-control-dire\">"
                    + "<div ng-init=\"initData()\" class=\"thead-lists\"><ol><li ng-repeat=\"(index,group) in data\" track by $index>"
                    + "<ul>"
                    + "<li class=\"thead-title\">{{group.groupName}}</li>"
                    + "<li ng-repeat=\"item in group.list\" track by $index ng-class=\"{active:item.isActive}\" ng-click=\"handlerItemClick(item,index)\">{{item.name}}</li>"
                    + "</ul ></li ></ol>"
                    + "</div>"
                    + "<div class=\"thead-btns\">"
                    + "<button class=\"btn btn-default\" ng-click=\"cancel()\">取消</button>"
                    + "<button class=\"btn btn-default\" ng-click=\"apply()\">应用</button>"
                    + "<button class=\"btn btn-danger\" ng-click=\"clear()\">清除</button>"
                    + "<button class=\"btn btn-default\"  ng-click=\"confirm()\">确定</button>"
                    + "</div>"
                    + "</div>",
                replace: false,
                transclude: true,
                controller: "theadControlCtr",
                scope: {
                    data: "=",
                    handlerApplyThead: "&"
                }
            }
        }

        superApp.controller("theadControlCtr", theadControlCtr);
        theadControlCtr.$inject = ["$scope", "$log", "$state", "$window", "$compile", "ajaxService", "toolService"];
        function theadControlCtr($scope, $log, $state, $window, $compile, ajaxService, toolService) {

            // 初始化数据
            $scope.initData = function () {
                // 是否清除
                $scope.remove = false;
                // 按点击顺序存储选项
                // 所有当前的选中项
                $scope.activeByClick = [];
                // 是否显示面板
                $scope.show = false;
                // 历史所有选中的项
                $scope.allActiveItems = [];

                $scope.data.forEach(function (val, index) {

                    val.list.forEach(function (item, idx) {
                        var json = {};
                        json.name = item;
                        json.isActive = false;
                        val.list[idx] = json;
                    });

                    // 根据length 初始化私有数据
                    $scope.activeByClick.push([]);
                    $scope.allActiveItems.push([]);
                });
            }

            // 初始化当前点击选中项数组
            $scope.initActiveByClick = function () {
                $scope.activeByClick.length = 0;

                $scope.data.forEach(function (val, index) {
                    $scope.activeByClick.push([]);
                });
            }


            // 点击面板显示、隐藏
            $scope.toggleShow = function () {
                $scope.show = !$scope.show;
                if (!$scope.show) {
                    $scope.activeByClick.forEach(function (val, index) {
                        if (val.length) {
                            for (var i = 0, len = val.length; i < len; i++) {
                                for (var j = 0, l = $scope.data[index].list.length; j < l; j++) {
                                    if (val[i].name === $scope.data[index].list[j].name) {
                                        $scope.data[index].list[j].isActive = false;
                                        break;
                                    }
                                }
                            }
                        }
                    });

                    $scope.initActiveByClick();
                }
            }

            // 所有按钮的点击事件
            $scope.handlerItemClick = function (item, index) {
                item.isActive = !item.isActive;

                if (item.isActive) {
                    $scope.activeByClick[index].push(item);
                    $scope.allActiveItems[index].push(item);
                } else {
                    // 删除当前选择数组里对应的项
                    for (var i = 0, len = $scope.activeByClick[index].length; i < len; i++) {
                        if ($scope.activeByClick[index][i].name === item.name) {
                            $scope.activeByClick[index].splice(i, 1);
                            break;
                        }
                    }
                    // 删除历史选中的记录
                    $scope.allActiveItems[index].forEach(function (val, k) {
                        if (val.name === item.name) $scope.allActiveItems[index].splice(k, 1);
                    });
                }

                console.log($scope.allActiveItems);
            }

            // 确定
            $scope.confirm = function () {
                // 如果上一步是点的清除 那么就重置所有以选择的项
                if ($scope.remove) $scope.initAllActiveItems();
                // 点击应用 去掉remove状态
                $scope.remove = false;
                // 默认重置点击选择的项
                $scope.initActiveByClick();
                // 收起面板
                $scope.show = false;
                // 回调
                $scope.handlerApplyThead && $scope.handlerApplyThead(combineArr($scope.allActiveItems));
                console.log($scope.allActiveItems);
            }

            // 清除
            $scope.clear = function () {
                // 重复点击清除 return
                if ($scope.remove) return;
                // 如果没有选择
                if (isEmpty($scope.allActiveItems)) return;
                // 有选择项 就重置原始数据 保留历史选择记录
                $scope.reset();
                // 根据当前选择 删除历史记录
                $scope.deleteBycurrentActiveItems();
                // 重置当前选择
                $scope.initActiveByClick();
                // 添加remove标记
                $scope.remove = true;
                console.log($scope.allActiveItems);
            }

            // 应用
            $scope.apply = function () {
                // 如果上一步是点的清除 那么就重置所有以选择的项
                if ($scope.remove) $scope.initAllActiveItems();
                // 点击应用 去掉remove状态
                $scope.remove = false;
                // 如果没有点击选择过 就return
                if (isEmpty($scope.activeByClick)) return;
                // 默认重置点击选择的项
                $scope.initActiveByClick();
                // 回调
                $scope.handlerApplyThead && $scope.handlerApplyThead(combineArr($scope.allActiveItems));
                console.log($scope.allActiveItems);
            }

            // 取消
            $scope.cancel = function () {
                // 收起面板
                $scope.show = false;

                if ($scope.remove) {
                    $scope.remove = false;
                    // 根据历史选择记录 选中大数据
                    $scope.applyHistory();
                } else {
                    if (isEmpty($scope.activeByClick)) return;
                    // 根据当前选择重置大数据
                    $scope.cancelBycurrentActiveItems($scope.activeByClick, $scope.data);
                }
                // 重置当前选择
                $scope.initActiveByClick();
                console.log($scope.allActiveItems);
            }

            // 重置所有状态
            $scope.reset = function () {
                $scope.data.forEach(function (val, index) {
                    val.list.forEach(function (d, i) {
                        d.isActive = false;
                    })
                })
            }

            // 重置所有选择的项
            $scope.initAllActiveItems = function () {
                $scope.allActiveItems.length = 0;

                $scope.data.forEach(function (val, index) {
                    $scope.allActiveItems.push([]);
                });
            }

            // 根据历史选择确定大数据的选中状态
            $scope.applyHistory = function () {
                if (!isEmpty($scope.allActiveItems)) {
                    $scope.allActiveItems.forEach(function (val, index) {
                        if (val.length) {
                            val.forEach(function (d, i) {
                                for (var i = 0, len = $scope.data[index].list.length; i < len; i++) {
                                    if (d.name === $scope.data[index].list[i].name) {
                                        $scope.data[index].list[i].isActive = true;
                                        break;
                                    }
                                }
                            })
                        }
                    })
                }
            }

            // 根据当前选项  取消选中大数据
            $scope.cancelBycurrentActiveItems = function (arr, parentarr) {
                arr.forEach(function (val, index) {
                    if (val.length) {
                        for (var i = 0, len = parentarr.length; i < len; i++) {
                            var curList = parentarr[i].list;
                            for (var k = 0, l = curList.length; k < l; k++) {
                                if (val.name === curList[k].name) {
                                    curList[k].isActive = false;
                                    break;
                                }
                            }
                            break;
                        }
                    }
                })
            }

            // 根据当前选择删除历史记录
            $scope.deleteBycurrentActiveItems = function () {
                $scope.activeByClick.forEach(function (val, index) {
                    if (val.length) {
                        val.forEach(function (d, i) {
                            $scope.allActiveItems[index].splice(i, 1);
                        })
                    }
                });
            }

            // 按顺序拼接二维数组
            function combineArr(arr) {
                var res = [];
                for (var i = 0, len = arr.length; i < len; i++) {
                    if (arr[i].length) res = res.concat(arr[i]);
                }
                return res;
            }

            // 判断二维数组是否为空
            function isEmpty(arr) {
                var count = 0;
                for (var i = 0, len = arr.length; i < len; i++) {
                    if (!arr[i].length) count++;
                }
                return count === len;
            }

        }
    });

