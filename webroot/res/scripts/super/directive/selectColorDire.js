/*

模块名称：toolTipDire
整理时间：2016-06-20
功能简介：常用的界面工具提示类，如 下拉菜单、弹出提示框 等

*/



define("superApp.selectColorDire",
["angular", "super.superMessage", "select2"],
function (angular, SUPER_CONSOLE_MESSAGE) {
    var superApp = angular.module("superApp.selectColorDire", []);



    /*
    ** 创建日期：2016-06-21
    ** 功能简介：选择颜色
    ** 形如：
    
    <div class="select-color" colorValue="color1"></div>

    其中： class="select-color"  是指令，必需
           colorValue="color1"  绑定的变量

    */
    superApp.directive('selectColor', selectColorDirective);
    selectColorDirective.$inject = ["$log"];
    function selectColorDirective($log) {
        return {
            restrict: "ACE",
            template: "<div class='dropdown drop-menu'>"
                    + "<button class='btn_select' style='background:#f00;' ng-click='btnSelect_OnClick()'>&nbsp;</button>"
                    + "<div class='dropdown-menu color_list' style='margin:0;width:263px'>"
                    + "<ul>"
                    + "<li ng-click='SetColor($event)' style='background:#FF0000'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#FFC000'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#FFFF00'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#92D050'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#00B050'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#00B0F0'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#0070C0'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#002060'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#7030A0'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#606060'></li>"

                    + "<li ng-click='SetColor($event)' style='background:#FFE5E5'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#FFF9E5'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#FFFFE5'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#F4FAED'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#E5F7ED'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#E5F7FD'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#E5F0F9'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#E5E8EF'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#F0EAF5'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#EFEFEF'></li>"

                    + "<li ng-click='SetColor($event)' style='background:#FFCCCC'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#FFF2CC'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#FFFFCC'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#E9F6DC'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#CCEFDC'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#CCEFFC'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#CCE2F2'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#CCD2DF'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#E2D6EC'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#DFDFDF'></li>"

                    + "<li ng-click='SetColor($event)' style='background:#FF9999'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#FFE699'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#FFFF99'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#D3ECB9'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#99DFB9'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#99DFF9'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#99C6E6'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#99A6BF'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#C6ACD9'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#BFBFBF'></li>"

                    + "<li ng-click='SetColor($event)' style='background:#FF6666'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#FFD966'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#FFFF66'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#BEE396'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#66D096'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#66D0F6'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#66A9D9'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#6679A0'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#A983C6'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#A0A0A0'></li>"

                    + "<li ng-click='SetColor($event)' style='background:#FF3333'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#FFCD33'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#FFFF33'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#A8D973'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#33C073'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#33C0F3'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#338DCD'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#334D80'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#8D59B3'></li>"
                    + "<li ng-click='SetColor($event)' style='background:#808080'></li>"

                    + "</ul>"
                    + "</div>"
                    + "</div>",
            scope: {
                colorValue: "=",            //默认Tis初始值
            },
            link: function (scope, element, attrs) {

                //scope.numberlistcopy = angular.copy(scope.numberlist); //生成副本，使每个指令的数组独立，以便显示当前 active 
                //给过滤面板绑定事件，防止事件冒泡
                $(element).bind("click", function (event) {
                    //  阻止事件冒泡
                    event.stopPropagation();
                });

                //保存DIV元素对象
                scope.$element = $(element);　//指令所在元素
                scope.$btnSelect = $(element).find(".btn_select:eq(0)");  //颜色按钮
                
                scope.$btnSelect.css("background", scope.colorValue); //初始化颜色
            },
            controller: "selectColorCtr"
        }
    }

    superApp.controller("selectColorCtr", selectColorCtr);
    selectColorCtr.$inject = ["$rootScope", "$scope", "$log", "$state", "$window", "ajaxService", "toolService", "reportService"];
    function selectColorCtr($rootScope, $scope, $log, $state, $window, ajaxService, toolService, reportService) {

        $scope.SetColor = function ($event)
        {
            var color = $($event.target).css("background-color");
            $scope.colorValue = color;
            $scope.$btnSelect.css("background", color);
        }

        $scope.btnSelect_OnClick = function ()
        {
            //关闭其它面板
            $(".color_list").hide();
        }

    }




});

