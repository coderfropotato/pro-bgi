/*

模块名称：heatmapSetDire
整理时间：2018-04-10
功能简介：聚类图设置面板

*/



define("superApp.heatmapSetDire",
    ["angular", "super.superMessage", "select2"],
    function (angular, SUPER_CONSOLE_MESSAGE) {
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
            return {
                restrict: "ACE",
                replace: true,
                template: "<div class='dropdown'>" +
                    "<button class='btn btn-default  btn-silver btn-sm tool-tip' ng-click='isShowSetPanel = !isShowSetPanel' ng-class='{active:isShowSetPanel}' title='设置'>" +
                    " <span class='glyphicon glyphicon-cog'></span>" +
                    "</button>" +
                    " <div class='dropdown-menu-open drop_set heatsetPanel' ng-show='isShowSetPanel'>" +
                    "<p><span>是否显示行名称：</span><label><input type='radio' name='geneName' ng-value='true' ng-model='setOptions.isShowName'>是</label> <label><input type='radio' name='geneName' ng-value='false' ng-model='setOptions.isShowName' ng-checked='true'>否</label></p>" +
                    "<p><span>是否显示列聚类：</span><label><input type='radio' name='topCluster' ng-value='true' ng-model='setOptions.isShowTopLine' ng-checked='true'>是 </label><label><input type='radio' name='topCluster' ng-value='false'  ng-model='setOptions.isShowTopLine'>否</label> </p>" +
                    "<div class='oneline_foot heatsetFoot'>" +
                    "<div class='heatSort'>" +
                    "<ul>" +
                    "<div class='sortDiv' ng-repeat='sort in setOptions.sortNames track by $index'>" +
                    " <li ng-bind='sort.name'></li>" +
                    " <div class='moveBtns'>" +
                    "<button class='btn btn-default  btn-silver btn-sm tool-tip' ng-click='upMove(sort,$index)' title='上移' ng-disabled='setOptions.isShowTopLine===true || $index === 0'>" +
                    "<span class='glyphicon glyphicon-arrow-up'></span>" +
                    "</button>" +
                    "<button class='btn btn-default  btn-silver btn-sm tool-tip' ng-click='downMove(sort,$index)' title='下移' ng-disabled='setOptions.isShowTopLine===true || $index ===(setOptions.sortNames.length-1)'>" +
                    "<span class='glyphicon glyphicon-arrow-down'></span>" +
                    " </button>" +
                    " </div>" +
                    "</div>" +
                    "</ul>" +
                    " </div>" +
                    "<button class='btn btn-success btn-sm opreatBtns' ng-click='confirm()'> 确定</button>" +
                    "<button class='btn btn-default btn-sm opreatBtns' ng-click='cancel()'>取消</button>" +
                    "</div>" +
                    "</div>" +
                    "</div>",
                scope: {
                    rowNames: "=",
                    getSetOptions: "&"
                },
                link: function (scope, element, attrs) {
                },
                controller: "heatmapSetCtr"
            }
        }

        superApp.controller("heatmapSetCtr", heatmapSetCtr);
        heatmapSetCtr.$inject = ["$rootScope", "$scope", "$log", "$state", "$window", "ajaxService", "toolService", "reportService"];
        function heatmapSetCtr($rootScope, $scope, $log, $state, $window, ajaxService, toolService, reportService) {
            $scope.setOptions = {
                isShowName: false,
                isShowTopLine: true,
                sortNames: $scope.rowNames
            };
            $scope.confirmOptions = angular.copy($scope.setOptions);

            //上移
            $scope.upMove = function (item, index) {
                var tmp = angular.copy($scope.rowNames[index - 1]);
                $scope.rowNames[index - 1] = $scope.rowNames[index];
                $scope.rowNames[index] = tmp;
            }

            //下移
            $scope.downMove = function (item, index) {
                var tmp = angular.copy($scope.rowNames[index + 1]);
                $scope.rowNames[index + 1] = $scope.rowNames[index];
                $scope.rowNames[index] = tmp;
            }
            //确定
            $scope.confirm = function () {
                $scope.confirmOptions = angular.copy($scope.setOptions);
                $scope.confirmOptions.sortNames = angular.copy($scope.rowNames);
                $scope.isShowSetPanel = false;
                $scope.getSetOptions({ setObj: $scope.confirmOptions });
            }

            //取消
            $scope.cancel = function () {
                $scope.setOptions = angular.copy($scope.confirmOptions);
                $scope.setOptions.sortNames = angular.copy($scope.confirmOptions.sortNames);
                $scope.isShowSetPanel = false;
            }

        }




    });

