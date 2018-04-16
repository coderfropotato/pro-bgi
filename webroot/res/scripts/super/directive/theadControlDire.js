/*
模块名称：theadControlDire
整理时间：2018-4-10 11:29:04
功能简介：树形组件，控制表头的显示隐藏
*/

define("superApp.theadControlDire",
    ["angular", "super.superMessage", "select2"],
    function (angular, SUPER_CONSOLE_MESSAGE) {
        var superApp = angular.module("superApp.theadControlDire", []);

        superApp.directive('theadControlTree', theadControlTree);
        theadControlTree.$inject = ["$log"];
        function theadControlTree($log) {
            return {
                restrict: "ACE",
                template: '<treecontrol class="tree-light thead-tree" tree-model="treedata"'
                    + 'options="opts" on-selection="toggleStatus(node,$path())">'
                    + '<i class="icon" ng-class="{\'icon-check-empty\': node.isChecked === -1,'
                    + '\'icon-check\': node.isChecked === 1, \'icon-check-minus\': node.isChecked === 0}"></i>'
                    + 'label: {{ node.name }}'
                    + '({{ node.age }})'
                    + '</treecontrol >',
                scope: {
                    thead: "=",
                    callback: "&",
                    options: "=",
                    data: "="
                },
                replace: false,
                transclude: true,
                link: function (scope, element, attrs) {
                },
                controller: "theadControlTreeCtr"
            }
        }

        superApp.controller("theadControlTreeCtr", theadControlTreeCtr);
        theadControlTreeCtr.$inject = ["$rootScope", "$scope", "$log", "$state", "$window", "ajaxService", "toolService", "reportService"];
        function theadControlTreeCtr($rootScope, $scope, $log, $state, $window, ajaxService, toolService, reportService) {
            // tree options
            $scope.treeOptions = $scope.options || {
                nodeChildren: "children",
                dirSelectable: true,  // 目录是否可被选中
                multiSelection: true,  // 是否支持多选
                injectClasses: {
                    ul: "a1",
                    li: "a2",
                    liSelected: "a7",
                    iExpanded: "a3",
                    iCollapsed: "a4",
                    iLeaf: "a5",
                    label: "a6",
                    labelSelected: "a8"
                }
            };
            // tree data
            $scope.treedata = data || [
                {
                    "name": "Joe",
                    "age": "21",
                    "children": [
                        { "name": "Smith", "age": "42", "children": [] },
                        {
                            "name": "Gary",
                            "age": "21",
                            "children": [
                                {
                                    "name": "Jenifer",
                                    "age": "23",
                                    "children": [
                                        { "name": "Dani", "age": "32", "children": [] },
                                        { "name": "Max", "age": "34", "children": [] }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                { "name": "Albert", "age": "33", "children": [] },
                { "name": "Ron", "age": "29", "children": [] }
            ];

            // 初始化树节点信息 
            $scope.initTreeData = function (tree) {
                tree.forEach(function (val, index) {
                    val.isChecked = -1;
                    if (val.children.length) $scope.initTreeData(val.children);
                });
            }

            // 选中全部子级
            $scope.selectAllChildren = function (children) {
                children.forEach(function (val, index) {
                    val.isChecked = 1;
                    val.children.length && $scope.selectAllChildren(val.children);
                });
            }


            // 取消选中所有子级
            $scope.unSelectAllChildren = function (children) {
                children.forEach(function (val, index) {
                    val.isChecked = -1;
                    val.children.length && $scope.unSelectAllChildren(val.children);
                });
            }

            // 向上应用 check 状态
            $scope.upUnCheckToCheck = function (node, path) {
                $scope.setAllParentStatus(path);
            }

            // 向上应用 不确定 -> 取消 0 -> -1状态
            $scope.upNormalToUnCheck = function (node, path) {
                $scope.setAllParentStatus(path);
            }

            $scope.findSublings = function (node, path) {
                console.log(node, path);
                var name = node.name;
                // path第零个是自己,第一个是父级
                if (!path[1]) {
                    // 没有同级
                    return [];
                } else {
                    var parent = path[1];
                    for (var i = 0; i < parent.children.length; i++) {
                        if (name === parent.children[i].name) {
                            var arr = angular.copy(parent.children);
                            arr.splice(i, 1);
                            return arr;
                        }
                    }
                }
            }

            // 找到所有父级同级 设置所有的父级状态
            $scope.setAllParentStatus = function (path) {
                for (var j = 1; j < path.length; j++) {
                    if (path[j].children.length == 0) {
                        path[j].isChecked = path[j].children[0].isChecked;
                    } else {
                        var allChecked = 0
                        var allUnChecked = 0;
                        for (var k = 0; k < path[j].children.length; k++) {
                            if (path[j].children[k].isChecked === 1) {
                                allChecked++;
                            } else if (path[j].children[k].isChecked === -1) {
                                allUnChecked++;
                            }
                        }
                        if (allChecked === path[j].children.length) {
                            path[j].isChecked = 1;
                            continue;
                        } else if (allUnChecked === path[j].children.length) {
                            path[j].isChecked = -1;
                            continue;
                        } else {
                            path[j].isChecked = 0;
                            continue;
                        }
                    }
                }
            }
            // 同级是否选中
            // 点击切换选中状态
            $scope.toggleStatus = function (node, path) {
                switch (node.isChecked) {
                    case -1:
                        // 未选中->选中
                        node.isChecked = 1;
                        if (path.length != 1) {
                            // 不是root
                            // 点亮子级 && 向上查找
                            // 只需要跟同级比较，
                            // 如果同级选中了，那么所有的父级都选中，
                            // 如果同级没有选中，所有的父级都是不确定状态
                            // 如果同级不确定，所有的父级都是不确定
                            $scope.upUnCheckToCheck(node, path);
                        }
                        // 点亮子级
                        path[0].children.length && $scope.selectAllChildren(path[0].children);
                        break;
                    case 0:
                        // 不确定->取消
                        node.isChecked = -1;
                        if (path.length != 1) {
                            // 取消选中所有子级 && 向上查找
                            // 如果同级选中了，那么所有的父级都是不确定状态，
                            // 如果同级没有选中，所有的父级都是未选中状态
                            // 如果同级不确定，所有的父级都是未确定
                            $scope.upNormalToUnCheck(node, path);
                        }
                        path[0].children.length && $scope.unSelectAllChildren(path[0].children);
                        break;
                    case 1:
                        // 选中->未选中
                        node.isChecked = -1;
                        if (path.length != 1) {
                            // 向上查找
                            // 如果同级选中了，那么所有的父级都是不确定状态，
                            // 如果同级没有选中，所有的父级都是未选中状态
                            // 如果同级不确定，所有的父级都是不确定
                            $scope.upNormalToUnCheck(node, path);
                        }
                        path[0].children.length && $scope.unSelectAllChildren(path[0].children);
                        break;
                }
            }



            $scope.initTreeData($scope.treedata);
        }
    });

