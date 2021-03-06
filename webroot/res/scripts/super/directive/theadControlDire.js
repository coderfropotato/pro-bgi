/**
 * 表头增删指令
 */
define("superApp.theadControlDire",
    ["angular", "super.superMessage", "select2"],
    function (angular, SUPER_CONSOLE_MESSAGE) {
        var superApp = angular.module("superApp.theadControlDire", []);
        superApp.directive('theadControl', theadControlDirective);
        theadControlDirective.$inject = ["$log"];
        function theadControlDirective($log) {
            return {
                restrict: "ACE",
                templateUrl: SUPER_CONSOLE_MESSAGE.localUrl.theadControlPath,
                replace: false,
                transclude: true,
                controller: "theadControlCtr",
                scope: {
                    data: "=",
                    handleTheadChange: "&",
                    isReset: "=",
                    parentId: "@"
                },
                link: function (scope, element, attrs) {
                    scope.data.forEach(function (val, index) {
                        val.showMore = false;
                        val.isShowMore = false;
                    });
                    // 每一个标签的marginright
                    scope.mr = 12;
                }
            }
        }

        superApp.controller("theadControlCtr", theadControlCtr);
        theadControlCtr.$inject = ["$scope", "$timeout", "$log", "$state", "$window", "$compile", "ajaxService", "toolService"];
        function theadControlCtr($scope, $timeout, $log, $state, $window, $compile, ajaxService, toolService) {
            // 初始化数据
            $scope.initData = function () {
                // 是否清除
                $scope.remove = false;
                // 按点击顺序存储选项
                // 所有当前的选中项
                $scope.activeByClick = [];
                // 所有当前的取消项
                $scope.cancelByClick = [];
                // 是否显示面板
                $scope.show = false;
                // 历史所有选中的项
                $scope.allActiveItems = [];
                // 记住之前传入回掉的激活项
                $scope.beforeActiveItems = [];
                // 当前的tab
                $scope.currentIndex = 0;
                // 无数据
                $scope.nodata = false;
                if ($scope.data.length) {
                    $scope.data.forEach(function (val, index) {
                        val.list.forEach(function (item, idx) {
                            item.isActive = false;
                            item.index = index;
                        });
                        // 根据length 初始化私有数据
                        $scope.activeByClick.push([]);
                        $scope.cancelByClick.push([]);
                        $scope.allActiveItems.push([]);
                        $scope.beforeActiveItems.push([]);
                    });
                    $scope.nodata = false;
                } else {
                    $scope.nodata = true;
                }

                // 如果需要reset 就监听 重置完成就把isReset设为默认false
                if ($scope.isReset != undefined && $scope.isReset != null) {
                    $scope.$watch('isReset', function (newVal, oldVal) {
                        if (newVal) {
                            // 如果是reset
                            $scope.resetAll();
                            $timeout(function () {
                                $scope.isReset = false;
                            }, 0)
                        }
                    })
                }

            }

            // 初始化所有
            $scope.resetAll = function () {
                if ($scope.data.length) {
                    $scope.activeByClick.length = 0;
                    $scope.allActiveItems.length = 0;
                    $scope.beforeActiveItems.length = 0;
                    $scope.cancelByClick.length = 0;
                    $scope.data.forEach(function (val, index) {
                        val.list.forEach(function (item, idx) {
                            item.isActive = false;
                        });
                        // 根据length 初始化私有数据
                        $scope.activeByClick.push([]);
                        $scope.cancelByClick.push([]);
                        $scope.allActiveItems.push([]);
                        $scope.beforeActiveItems.push([]);
                    });
                    $scope.nodata = false;
                } else {
                    $scope.nodata = true;
                }

                // $scope.remove = false;
                // $scope.show = false;
            }

            // 初始化当前点击选中项数组
            $scope.initActiveByClick = function () {
                $scope.activeByClick.length = 0;
                $scope.remove = false;

                $scope.data.forEach(function (val, index) {
                    $scope.activeByClick.push([]);
                });
            }

            // 初始化当前取消选中数组
            $scope.initCancelByClick = function () {
                $scope.cancelByClick.length = 0;

                $scope.data.forEach(function (val, index) {
                    $scope.cancelByClick.push([]);
                });
            }

            // 点击面板显示、隐藏
            $scope.toggleShow = function () {
                if (!$scope.nodata) {
                    $scope.show = !$scope.show;
                    if (!$scope.show) {
                        $scope.activeByClick.forEach(function (val, index) {
                            if (val.length) {
                                for (var i = 0, len = val.length; i < len; i++) {
                                    for (var j = 0, l = $scope.data[index].list.length; j < l; j++) {
                                        if (val[i]._id === $scope.data[index].list[j]._id) {
                                            $scope.data[index].list[j].isActive = false;
                                            break;
                                        }
                                    }
                                }
                            }
                        });
                    } else {
                        $scope.initActiveByClick();
                        $scope.initCancelByClick();

                        // 显示面板的时候计算dom
                        $timeout(function () {
                            $scope.computedDOM();
                        }, 50)
                    }
                }
            }

            // 所有按钮的点击事件
            $scope.handlerItemClick = function (item, index) {
                if ($scope.remove) return;
                item.isActive = !item.isActive;
                if (item.isActive) {
                    $scope.activeByClick[index].push(item);
                    $scope.allActiveItems[index].push(item);
                } else {
                    // 删除当前选择数组里对应的项
                    for (var i = 0, len = $scope.activeByClick[index].length; i < len; i++) {
                        if ($scope.activeByClick[index][i]._id === item._id) {
                            $scope.activeByClick[index].splice(i, 1);
                            break;
                        }
                    }
                    // 删除历史选中的记录
                    $scope.allActiveItems[index].forEach(function (val, k) {
                        if (val._id === item._id) {
                            $scope.allActiveItems[index].splice(k, 1);
                        }
                    });

                    $scope.cancelByClick[index].push(item);
                    $scope.computedWrapWidth();
                }
            }

            // 确定
            $scope.confirm = function () {
                // 如果上一步是点的清除 那么就重置所有以选择的项
                if ($scope.remove) $scope.initAllActiveItems();
                // 点击应用 去掉remove状态
                $scope.remove = false;
                // 默认重置点击选择的项
                $scope.initActiveByClick();
                // 默认重置取消选择的项
                $scope.initCancelByClick();

                // 回调 值改变了才回调
                $scope.callback();
            }

            // // 清除
            // $scope.clear = function () {
            //     // 如果没有选择
            //     if (isEmpty($scope.allActiveItems)) return;
            //     // 有选择项 就重置原始数据 保留历史选择记录
            //     $scope.reset();
            //     // 根据当前选择 删除历史记录
            //     $scope.deleteBycurrentActiveItems();
            //     // 重置当前选择
            //     $scope.initActiveByClick();
            //     // 添加remove标记
            //     $scope.remove = true;
            // }

            // 清除
            $scope.clear = function () {
                $scope.initAllActiveItems();
                $scope.initActiveByClick();
                $scope.initCancelByClick();
                $scope.data.forEach(function (val, index) {
                    val.list.forEach(function (item, idx) {
                        item.isActive = false;
                    });
                })
                $scope.callback();
                //重新计算ul宽度
                $scope.computedWrapWidth();
            }

            // 应用
            $scope.apply = function () {
                // 如果上一步是点的清除 那么就重置所有以选择的项
                if ($scope.remove) $scope.initAllActiveItems();
                // 点击应用 去掉remove状态
                $scope.remove = false;
                // 如果没有点击选择过 
                // 只有可能点过remove 如果点过remove那么所有的激活项就是空
                // 如果之前的状态是空 那么就相等不回调
                // 如果之前不是空 那么就不想等 回调

                // 如果没有点过remove
                // 激活了某些选项 触发最底部的回调
                // 如果没有激活选项 那么之前的状态和当前的状态就是相等的 那么判断里的回调内部 还是不会回调
                if (isEmpty($scope.activeByClick)) {
                    $scope.callback();
                    return;
                }
                // 默认重置点击选择的项
                $scope.initActiveByClick();
                // 默认重置取消选择的项
                $scope.initCancelByClick();
                // 回调 值改变了才回调
                $scope.callback();
            }

            // // 取消
            // $scope.cancel = function () {
            //     // 收起面板
            //     $scope.show = false;

            //     if ($scope.remove) {
            //         $scope.remove = false;
            //         // 根据历史选择记录 选中大数据
            //         $scope.applyHistory();
            //     } else {
            //         if (isEmpty($scope.activeByClick) && isEmpty($scope.cancelByClick)) return;
            //         if (isEmpty($scope.activeByClick)) {
            //             // 把取消选中的项状态应用到原始数据
            //             $scope.cancelBycurrentActiveItems($scope.cancelByClick, $scope.data, true);

            //         } else {
            //             // 删除历史记录
            //             $scope.activeByClick.forEach(function (val, index) {
            //                 if (val.length) {
            //                     val.forEach(function (d, l) {
            //                         for (var i = 0; i < $scope.allActiveItems[index].length; i++) {
            //                             if (d._id === $scope.allActiveItems[index][i]._id) {
            //                                 $scope.allActiveItems[index].splice(i, 1);
            //                                 break;
            //                             }
            //                         }
            //                     })
            //                 }
            //             })
            //             // 根据当前选择重置大数据
            //             $scope.cancelBycurrentActiveItems($scope.activeByClick, $scope.data, false);
            //         }
            //     }
            //     // 重置当前选择
            //     $scope.initActiveByClick();
            //     // 默认重置取消选择的项
            //     $scope.initCancelByClick();
            // }

            // 取消
            $scope.cancel = function () {
                if (isEmpty($scope.activeByClick) && isEmpty($scope.cancelByClick)) return;
                if (isEmpty($scope.activeByClick)) {
                    // 把取消选中的项状态应用到原始数据
                    $scope.cancelBycurrentActiveItems($scope.cancelByClick, $scope.data, true);
                    
                    // 把取消的数据放到all里面
                    $scope.cancelByClick.forEach(function(val,index){
                        if(val.length){
                            for(var i=0;i<val.length;i++){
                                $scope.allActiveItems[index].push(val[i]);
                            }
                        }
                        
                    })
                } else {
                    // 删除历史记录
                    $scope.activeByClick.forEach(function (val, index) {
                        if (val.length) {
                            val.forEach(function (d, l) {
                                for (var i = 0; i < $scope.allActiveItems[index].length; i++) {
                                    if (d._id === $scope.allActiveItems[index][i]._id) {
                                        $scope.allActiveItems[index].splice(i, 1);
                                        break;
                                    }
                                }
                            })
                        }
                    })
                    // 根据当前选择重置大数据
                    $scope.cancelBycurrentActiveItems($scope.activeByClick, $scope.data, false);
                }
                // 重置当前选择
                $scope.initActiveByClick();
                // 默认重置取消选择的项
                $scope.initCancelByClick();
                //重新计算ul宽度
                $scope.computedWrapWidth();
            }

            // 重置所有状态
            $scope.reset = function () {
                $scope.data.forEach(function (val, index) {
                    val.list.forEach(function (d, i) {
                        d.isActive = false;
                    })
                })
            }

            // 回调
            $scope.callback = function () {
                if (!angular.equals($scope.beforeActiveItems, $scope.allActiveItems)) {
                    // $scope.handleTheadChange && $scope.handleTheadChange(combineArr($scope.allActiveItems));
                    var items = $scope.classify($scope.allActiveItems);
                    $scope.handleTheadChange && $scope.handleTheadChange({ arg: items });
                    // 更新旧值为新值
                    $scope.beforeActiveItems = angular.copy($scope.allActiveItems);
                }
            }

            // 每次回调 把删除的项和新增的项分类 返回出去
            $scope.classify = function () {
                // 当前选择是空  那么就是删除了之前所有
                var temp = { add: [], delete: [], all: [] };

                if (isEmpty($scope.allActiveItems)) {
                    // 全部是删除
                    temp.delete = combineArr(angular.copy($scope.beforeActiveItems));
                } else if (isEmpty($scope.beforeActiveItems)) {
                    // 全部是新增
                    temp.add = combineArr(angular.copy($scope.allActiveItems));
                } else {
                    // 一半一半
                    var before = combineArr($scope.beforeActiveItems);
                    var current = combineArr($scope.allActiveItems);

                    for (var j = 0, l = current.length; j < l; j++) {
                        // 当前选择的在之前选择里有 就在原来的数组里删除相同的  剩下的就是删除的
                        // 没有就是 新增
                        var status = isInArr(current[j], before);
                        if (status.flag) {
                            before.splice(status.index, 1);
                        } else {
                            temp.add.push(current[j]);
                        }
                    }
                    temp.delete = angular.copy(before);
                }
                temp.all = combineArr($scope.allActiveItems);
                return temp;
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
                                    if (d._id === $scope.data[index].list[i]._id) {
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
            $scope.cancelBycurrentActiveItems = function (arr, parentarr, flag) {
                arr.forEach(function (val, index) {
                    if (val.length) {
                        for (var i = 0; i < val.length; i++) {
                            var curList = parentarr[index].list;
                            for (var k = 0, l = curList.length; k < l; k++) {
                                if (val[i]._id === curList[k]._id) {
                                    curList[k].isActive = flag;
                                    break;
                                }
                            }
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

            // 是否在数组内 [{_id:xx,isActive:xx}]
            function isInArr(n, arr) {
                for (var i = 0, len = arr.length; i < len; i++) {
                    if (n._id === arr[i]._id) {
                        return { flag: true, index: i };
                    }
                }
                return { flag: false, index: null };
            }

            // 更多点击事件
            $scope.handlerIsShowMoreClick = function (index) {
                $scope.data[index].isShowMore = true;
            }

            // 收起点击事件
            $scope.handlerExpandClick = function (index) {
                $scope.data[index].isShowMore = false;
            }
            // 计算dom 是否显示更多
            $scope.computedDOM = function () {
                // $scope.width = $('#'+$scope.parentId+' .thead-control-dire ul').eq(0).width();
                // var aUl = $('#'+$scope.parentId+' .thead-control-dire ul');
                // var childLengthCollection = [];
                // for (var i = 0, len = aUl.length; i < len; i++) {
                //     var child = aUl.eq(i).children('li');
                //     var childLen = child.length;
                //     var sum = 0;
                //     for (var j = 0; j < childLen; j++) {
                //         sum += child.eq(j).outerWidth() + $scope.mr;
                //     }
                //     childLengthCollection.push(sum);
                // }

                // childLengthCollection.forEach(function (val, index) {
                //     if ($scope.data[index]){
                //         $scope.data[index].showMore = val > ($scope.width - 5)
                //     }
                // });
                // $scope.$apply();
            }

            $scope.allActive = [];
            $scope.$watch('allActiveItems', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    var res = [];
                    newVal.forEach(function (val, index) {
                        if (val.length) {
                            val.forEach(function (d, i) {
                                d.index = index;
                            })
                            res = res.concat(val);
                        }
                    })

                    $scope.allActive = res;
                    // $scope.computedWrapWidth();
                }
            }, true
            )

            $scope.computedWrapWidth = function () {
                $timeout(function () {
                    var oUl = $('.thead-control-wrap .item-wrap>ul');
                    var totalWidth = 0;
                    for (var i = 0; i < oUl.children('li').length; i++) {
                        totalWidth += $('.thead-control-wrap .item-wrap>ul').children('li').eq(i).outerWidth(true) + 1;
                    }
                    $('.thead-control-wrap .item-wrap>ul').css('width', totalWidth + 'px')
                }, 30)
            }


            $scope.handlerTabClick = function (index) {
                $scope.currentIndex = index;
            }

            // document resize 
            window.addEventListener('resize', function () {
                if ($scope.show) $scope.computedDOM();
            }, false);
        }
    });

