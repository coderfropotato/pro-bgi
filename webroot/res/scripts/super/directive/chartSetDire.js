/*

模块名称：chartSetDire
整理时间：2018-05-15
功能简介：图设置面板

*/

define("superApp.chartSetDire", ["angular", "super.superMessage", "select2"],
    function(angular, SUPER_CONSOLE_MESSAGE) {
        var superApp = angular.module("superApp.chartSetDire", []);

        /*
        ** 创建日期：2018-05-15
        ** 功能简介：设置图中名或数值的显示与否
        ** 形如：<div class="chart-set"></div>
                其中： class="chart-set"  是指令，必需；
        ** 默认：显示图中名或数值。
        */
        superApp.directive('chartSet', chartSetDirective);
        chartSetDirective.$inject = ["$log"];

        function chartSetDirective($log) {
            return {
                restrict: "ACE",
                replace: true,
                template: "<div class='dropdown'>" +
                    "<button class='btn btn-default  btn-silver btn-sm tool-tip' ng-click='isShow=!isShow' ng-class='{active:isShow}' title='设置'>" +
                    " <span class='glyphicon glyphicon-cog'></span>" +
                    "</button>" +
                    " <div class='switchpanel dropdown-menu-open drop_set heatsetPanel' ng-show='isShow'>" +
                    "<p><span>{{setTitle}}：</span></p>" +
                    "<div ng-hide='isInput' class='onoffswitch' ng-click='showHideValue()'><input type='checkbox' id='oneOnoffswitch' name='onoffswitch' class='onoffswitch-checkbox' ng-model='isShowValue'><label class='onoffswitch-label' for='oneOnoffswitch'><div class='onoffswitch-inner'></div><div class='onoffswitch-switch'></div></label></div>" +
                    "<div ng-show='isInput' class='setInput'><input id='setValueInput' type='number' ng-value='setValue' class='form-control' /><button class='btn btn-default btn-sm list_btn btn-silver' ng-click='getSetValue()'>确定</button></div>" +
                    "</div>" +
                    "</div>",
                scope: {
                    isShow: "=",
                    isShowValue: "=",
                    setTitle: "@",
                    getSetOption: "&",
                    isInput: "=",
                    setValue: "="
                },
                link: function(scope, element, attrs) {},
                controller: "chartSetCtr"
            }
        }

        superApp.controller("chartSetCtr", chartSetCtr);
        chartSetCtr.$inject = ["$rootScope", "$scope", "$log", "$state", "$window", "ajaxService", "toolService", "reportService"];

        function chartSetCtr($rootScope, $scope, $log, $state, $window, ajaxService, toolService, reportService) {
            $scope.isShow = false;

            $scope.showHideValue = function() {
                $scope.isShowValue = !$scope.isShowValue;
                $scope.isShow = false;
                $scope.getSetOption({ set: $scope.isShowValue })
            }

            $scope.getSetValue = function() {
                $scope.setValue = Number($("#setValueInput").val());
                $scope.isShow = false;
                $scope.getSetOption({ value: $scope.setValue })
            }

        }
    });