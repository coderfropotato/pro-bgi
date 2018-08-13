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
                    "<button class='new-table-switch-btns noborder tool-tip' ng-click='setBtnClick($event)' ng-class='{active:isShow}' title='设置'>" +
                    " <span class='iconfont icon-shezhi'></span>" +
                    "</button>" +
                    " <div class='switchpanel dropdown-menu-open drop_set heatsetPanel' ng-show='isShow'>" +
                    "<p><span>{{setTitle}}：</span></p>" +
                    "<div ng-hide='isInput' class='onoffswitch' ng-click='showHideValue($event)'><input type='checkbox' id='oneOnoffswitch' name='onoffswitch' class='onoffswitch-checkbox' ng-model='isShowValue'><label class='onoffswitch-label' for='oneOnoffswitch'><div class='onoffswitch-inner'></div><div class='onoffswitch-switch'></div></label></div>" +
                    "<div ng-show='isInput' class='setInput'><input id='setValueInput' type='number' ng-value='setValue' class='form-control' ng-keyup='inputKeyup($event)' /><button class='btn btn-default btn-sm list_btn btn-silver' ng-click='getSetValue($event)'>确定</button></div>" +
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
        chartSetCtr.$inject = ["$scope"];

        function chartSetCtr($scope) {
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

            $(document).on("click", function() {
                $scope.isShow = false;
                $("#setValueInput").val($scope.setValue);
            })

            $("#setValueInput").on("click", function(ev) {
                clearEventBubble(ev);
            })

            $scope.setBtnClick = function(ev) {
                clearEventBubble(ev);
                $scope.isShow = !$scope.isShow;
                $("#setValueInput").val($scope.setValue);
            }

            $scope.showHideValue = function(ev) {
                clearEventBubble(ev);
                $scope.isShowValue = !$scope.isShowValue;
                $scope.isShow = false;
                $scope.getSetOption({ set: $scope.isShowValue })
            }

            $scope.getSetValue = function(ev) {
                clearEventBubble(ev);
                $scope.setValue = Number($("#setValueInput").val());
                $scope.isShow = false;
                $scope.getSetOption({ value: $scope.setValue })
            }

            $scope.inputKeyup = function(e) {
                var keycode = window.event ? e.keyCode : e.which;
                if (keycode == 13) {
                    $scope.getSetValue(e);
                }
            }

        }
    });