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
                template: "<button class=\"btn btn-default\" ng-click=\"toggleShow()\">AddColumns</button>"
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
                    handlerTheadChange: "&"
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

            // 初始化点击私有数据
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
                            for (var i = 0; i < val.length; i++) {
                                for (var j = 0; j < $scope.data[index].list.length; j++) {
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
                    for (var i = 0; i < $scope.activeByClick[index].length; i++) {
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
            }

            //确定
            $scope.confirm = function () {
                $scope.show = false;
                $scope.initActiveByClick();
            }

            // 清除
            $scope.clear = function () {
                $scope.reset();
                $scope.remove = true;
                console.log($scope.allActiveItems);
            }

            // 应用
            $scope.apply = function () {
                $scope.initActiveByClick();
            }

            // 取消
            $scope.cancel = function () {

            }

            // 重置所有状态
            $scope.reset = function () {
                $scope.data.forEach(function (val, index) {
                    val.list.forEach(function (d, i) {
                        d.isActive = false;
                    })
                })
            }

        }
    });

