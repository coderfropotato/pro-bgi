/*

模块名称：heatmapSetDire
整理时间：2018-04-10
功能简介：聚类图设置面板

*/



define("superApp.heatmapSetDire", ["angular", "super.superMessage", "select2"],
    function(angular, SUPER_CONSOLE_MESSAGE) {
        var superApp = angular.module("superApp.heatmapSetDire", []);



        /*
        ** 创建日期：2018-04-10
        ** 功能简介：设置聚类图
        ** 形如：<div class="heatmap-set"></div>
                其中： class="heatmap-set"  是指令，必需；
        ** 默认：显示列聚类，隐藏列名。
                当隐藏列聚类时，可以进行行名排序，重新画图
        */
        superApp.directive('heatmapSet', heatmapSetDirective);
        heatmapSetDirective.$inject = ["$log"];

        function heatmapSetDirective($log) {
            // <label><input type='radio' name='geneName' ng-value='true' ng-model='setOptions.isShowName'>是</label> <label><input type='radio' name='geneName' ng-value='false' ng-model='setOptions.isShowName' ng-checked='true'>否</label>
            return {
                restrict: "ACE",
                replace: true,
                template: "<div class='dropdown'>" +
                    "<button class='new-table-switch-btns noborder tool-tip' ng-click='setBtnClick($event)' ng-class='{active:isShow}' title='设置'>" +
                    " <span class='iconfont icon-shezhi'></span>" +
                    "</button>" +
                    " <div class='switchpanel dropdown-menu-open drop_set heatsetPanel' ng-show='isShow'>" +
                    "<p><span>行名称：</span></p>" +
                    "<div class='onoffswitch' ng-click='nameSwitchClick($event)'><input type='checkbox' id='oneOnoffswitch' name='onoffswitch' class='onoffswitch-checkbox' ng-model='setOptions.isShowName'><label class='onoffswitch-label' for='oneOnoffswitch'><div class='onoffswitch-inner'></div><div class='onoffswitch-switch'></div></label></div>" +
                    "<p ng-show='isTopCluster'><span>列聚类：</span></p>" +
                    "<div ng-show='isTopCluster' class='onoffswitch' ng-click='topClusterClick($event)'><input type='checkbox' id='twoOnoffswitch' name='onoffswitch' class='onoffswitch-checkbox' ng-model='setOptions.isShowTopLine'><label class='onoffswitch-label' for='twoOnoffswitch'><div class='onoffswitch-inner'></div><div class='onoffswitch-switch'></div></label></div>" +
                    "<div class='oneline_foot heatsetFoot'>" +
                    "<div ng-show='isTopCluster' class='heatSort'>" +
                    "<ul>" +
                    "<div class='sortDiv' ng-repeat='sort in setOptions.sortNames track by $index'>" +
                    " <li ng-bind='sort.name'></li>" +
                    " <div class='moveBtns'>" +
                    "<button class='btn btn-default  btn-silver btn-sm tool-tip' ng-click='upMove($event,$index)' title='上移' ng-disabled='setOptions.isShowTopLine===true || $index === 0'>" +
                    "<span class='glyphicon glyphicon-arrow-up'></span>" +
                    "</button>" +
                    "<button class='btn btn-default  btn-silver btn-sm tool-tip' ng-click='downMove($event,$index)' title='下移' ng-disabled='setOptions.isShowTopLine===true || $index ===(setOptions.sortNames.length-1)'>" +
                    "<span class='glyphicon glyphicon-arrow-down'></span>" +
                    " </button>" +
                    " </div>" +
                    "</div>" +
                    "</ul>" +
                    " </div>" +
                    "</div>" +
                    "<div class='valueInput' style='margin-top:20px'>热图区宽度：<input placeholder='请输入' id='setoptionWidth' type='number' ng-value='{{setOptions.width}}' /><span>像素</span></div>" +
                    "<div class='valueInput' style='margin-bottom:10px'>热图区高度：<input placeholder='请输入' id='setoptionHeight' type='number' ng-value='{{setOptions.height}}' /><span>像素</span></div>" +
                    "<div class='tipTextInfo' ng-show='isShowTipText'>热图区宽、高请输入200-2000之间的数字。</div>" +
                    "<div class='ngdialog-buttons'>" +
                    "<button class='btn btn-success btn-sm opreatBtns sureBtn' ng-click='confirm($event,setOptions)'> 确定</button>" +
                    "<button class='btn btn-default btn-sm opreatBtns cancelBtn' ng-click='cancel($event)'>取消</button>" +
                    "</div>" +
                    "</div>" +
                    "</div>",
                scope: {
                    isShow: "=",
                    isTopCluster: "=",
                    setOptions: "=",
                    isRefresh: "=",
                    getSetOptions: "&",
                    compareGroup: "="
                },
                link: function(scope, element, attrs) {
                    scope.initOptions = angular.copy(scope.setOptions);
                    scope.confirmOptions = angular.copy(scope.setOptions);
                },
                controller: "heatmapSetCtr"
            }
        }

        superApp.controller("heatmapSetCtr", heatmapSetCtr);
        heatmapSetCtr.$inject = ["$scope"];

        function heatmapSetCtr($scope) {
            $scope.isShow = false;

            //阻止冒泡
            function clearEventBubble(evt) {
                if (evt.stopPropagation) {
                    evt.stopPropagation();
                } else {
                    evt.cancelBubble = true;
                }

                if (evt.preventDefault) {
                    evt.preventDefault();
                } else {
                    evt.returnValue = false;
                }
            }

            //设置按钮点击
            $scope.setBtnClick = function(ev) {
                clearEventBubble(ev);
                $scope.isShow = !$scope.isShow;
                $scope.isShowTipText = false;
                $("#setoptionWidth").val($scope.confirmOptions.width);
                $("#setoptionHeight").val($scope.confirmOptions.height);
                apply($scope.setOptions, $scope.confirmOptions);
                // $scope.setOptions = angular.copy($scope.confirmOptions);
            }

            //基因名 switch开关点击
            $scope.nameSwitchClick = function(ev) {
                clearEventBubble(ev);
                $scope.setOptions.isShowName = !$scope.setOptions.isShowName;
            }

            //顶部聚类折线 switch开关点击
            $scope.topClusterClick = function(ev) {
                clearEventBubble(ev);
                $scope.setOptions.isShowTopLine = !$scope.setOptions.isShowTopLine;
            }

            $(".switchpanel.heatsetPanel").on("click", function(ev) {
                clearEventBubble(ev);
            })

            $(document).on("click", function() {
                $scope.isShow = false;
            })

            //上移
            $scope.upMove = function(ev, index) {
                clearEventBubble(ev);
                var tmp = angular.copy($scope.setOptions.sortNames[index - 1]);
                $scope.setOptions.sortNames[index - 1] = $scope.setOptions.sortNames[index];
                $scope.setOptions.sortNames[index] = tmp;
            }

            //下移
            $scope.downMove = function(ev, index) {
                clearEventBubble(ev);
                var tmp = angular.copy($scope.setOptions.sortNames[index + 1]);
                $scope.setOptions.sortNames[index + 1] = $scope.setOptions.sortNames[index];
                $scope.setOptions.sortNames[index] = tmp;
            }

            //确定
            $scope.confirm = function(ev, option) {
                clearEventBubble(ev);
                var chartWidth = Number($("#setoptionWidth").val()),
                    chartHeight = Number($("#setoptionHeight").val());

                if ((chartWidth < 200 || chartWidth > 2000) || (chartHeight < 200 || chartHeight > 2000)) {
                    $scope.isShowTipText = true;
                    return;
                } else {
                    $scope.isShowTipText = false;

                    option.width = chartWidth;
                    option.height = chartHeight;

                    $scope.isShow = false;
                    $scope.confirmOptions = angular.copy(option);

                    if ($scope.confirmOptions.isShowTopLine) {
                        $scope.confirmOptions.sortNames = angular.copy($scope.initOptions.sortNames);
                        $scope.setOptions.sortNames = angular.copy($scope.initOptions.sortNames);
                    }

                    $scope.getSetOptions({ setObj: $scope.confirmOptions });
                }

            }

            //取消
            $scope.cancel = function(ev) {
                clearEventBubble(ev);
                $scope.isShowTipText = false;
                $("#setoptionWidth").val($scope.confirmOptions.width);
                $("#setoptionHeight").val($scope.confirmOptions.height);
                // $scope.setOptions = angular.copy($scope.confirmOptions);
                apply($scope.setOptions, $scope.confirmOptions);
                $scope.isShow = false;
            }

            $scope.$watch('isRefresh', function(newVal) {
                if (newVal) {
                    $scope.isShow = false;
                    $scope.confirmOptions = angular.copy($scope.initOptions);
                    // $scope.setOptions = angular.copy($scope.initOptions);
                    apply($scope.setOptions, $scope.confirmOptions);
                    $("#setoptionWidth").val($scope.initOptions.width);
                    $("#setoptionHeight").val($scope.initOptions.height);
                }
            })

            $scope.change = false;

            if ($scope.compareGroup) {
                $scope.$watch('compareGroup', function(newVal, oldVal) {
                    if (newVal != oldVal && !$scope.change) {
                        $scope.change = true;
                    }
                })
            }

            $scope.$watch('setOptions', function(newVal) {
                if (newVal) {
                    if ($scope.change) {
                        apply($scope.confirmOptions, newVal);
                        $scope.change = false;
                    }
                    apply($scope.setOptions, newVal);
                }
            }, true)


            function apply(src, target) {
                for (var name in src) {
                    src[name] = angular.copy(target[name]);
                }
            }

        }
    });