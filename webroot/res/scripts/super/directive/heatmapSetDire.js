/*

模块名称：heatmapSetDire
整理时间：2018-04-10
功能简介：自定义颜色选择器

*/



define("superApp.heatmapSetDire",
    ["angular", "super.superMessage", "select2"],
    function (angular, SUPER_CONSOLE_MESSAGE) {
        var superApp = angular.module("superApp.heatmapSetDire", []);



        /*
        ** 创建日期：2018-04-10
        ** 功能简介：选择颜色
        ** 形如：
        
        <div class="select-color" get-cur-color="colorChange(color)"></div>
    
        其中： class="select-color"  是指令，必需
                get-cur-color="colorChange(color)"  回调函数，获取当前选中的颜色
    
        */
        superApp.directive('heatmapSet', heatmapSetDirective);
        heatmapSetDirective.$inject = ["$log"];
        function heatmapSetDirective($log) {
            return {
                restrict: "ACE",
                replace: true,
                template: "<div class='dropdown'>" +
                    "<button class='btn btn-default  btn-silver btn-sm tool-tip' ng-click='showSetPanel = !showSetPanel' ng-class='{active:showSetPanel}' title='设置'>" +
                    " <span class='glyphicon glyphicon-cog'></span>" +
                    "</button>" +
                    " <div class='dropdown-menu-open drop_set heatsetPanel' ng-show='showSetPanel'>" +
                    "<p><span>是否显示基因ID：</span><input type='radio'>是 &nbsp;<input type='radio'>否</p><p> <span>是否显示列聚类：</span><input type='radio'>是 &nbsp;<input type='radio'>否 </p>" +
                    "<div class='heatSort'>" +
                    "<ul>" +
                    " <li>head200w_9777</li>" +
                    " <div class='moveBtns'>" +
                    "<button class='btn btn-default  btn-silver btn-sm tool-tip' ng-click='upMove()' title='上移'>" +
                    "<span class='glyphicon glyphicon-arrow-up'></span>" +
                    "</button>" +
                    "<button class='btn btn-default  btn-silver btn-sm tool-tip' ng-click='downMove()' title='下移'>" +
                    "<span class='glyphicon glyphicon-arrow-down'></span>" +
                    " </button>" +
                    " </div>" +
                    "</ul>" +
                    " </div>" +
                    "<div class='oneline_foot heatsetFoot'>" +
                    "<button class='btn btn-success btn-sm' ng-click='confirmSet()'> 确定</button>" +
                    "<button class='btn btn-default btn-sm' ng-click='cancelSet()'>取消</button>" +
                    "</div>" +
                    "</div>" +
                    "</div>",
                scope: {
                   
                },
                link: function (scope, element, attrs) {
                    
                },
                controller: "heatmapSetCtr"
            }
        }

        superApp.controller("heatmapSetCtr", heatmapSetCtr);
        heatmapSetCtr.$inject = ["$rootScope", "$scope", "$log", "$state", "$window", "ajaxService", "toolService", "reportService"];
        function heatmapSetCtr($rootScope, $scope, $log, $state, $window, ajaxService, toolService, reportService) {
            
        }




    });

