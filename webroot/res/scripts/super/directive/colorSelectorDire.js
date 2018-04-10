/*

模块名称：toolTipDire
整理时间：2016-06-20
功能简介：常用的界面工具提示类，如 下拉菜单、弹出提示框 等

*/



define("superApp.colorSelectorDire",
    ["angular", "super.superMessage", "select2"],
    function (angular, SUPER_CONSOLE_MESSAGE) {
        var superApp = angular.module("superApp.colorSelectorDire", []);



        /*
        ** 创建日期：2016-06-21
        ** 功能简介：选择颜色
        ** 形如：
        
        <div class="select-color" colorValue="color1"></div>
    
        其中： class="select-color"  是指令，必需
               colorValue="color1"  绑定的变量
    
        */
        superApp.directive('colorSelector', colorSelectorDirective);
        colorSelectorDirective.$inject = ["$log"];
        function colorSelectorDirective($log) {
            return {
                restrict: "ACE",
                template: "<div class='dropdown drop-menu'>"
                    + "<button class='btn_select' style='background:#f00;' ng-click='btnSelect_OnClick()'>&nbsp;</button>"
                    + "<div class='dropdown-menu color_list' style='margin:0;width:263px'>"
                    + "<ul>"
                    + "<li ng-repeat='color in colorList track by $index' ng-click='SetColor($event)' style='background:{{color}}'></li>"
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
                controller: "colorSelectorCtr"
            }
        }

        superApp.controller("colorSelectorCtr", colorSelectorCtr);
        colorSelectorCtr.$inject = ["$rootScope", "$scope", "$log", "$state", "$window", "ajaxService", "toolService", "reportService"];
        function colorSelectorCtr($rootScope, $scope, $log, $state, $window, ajaxService, toolService, reportService) {
            $scope.colorList = ["#FF0000", "#FFC000", "#FFFF00", "#92D050", "#00B050", "#00B0F0", "#0070C0", "#002060", "#7030A0", "#000000", "#FFE5E5", "#FFF9E5", "#FFFFE5", "#F4FAED", "#E5F7ED", "#E5F7FD", "#E5F0F9", "#E5E8EF", "#F0EAF5", "#EFEFEF", "#FFCCCC", "#FFF2CC", "#FFFFCC", "#E9F6DC", "#CCEFDC", "#CCEFFC", "#CCE2F2", "#CCD2DF", "#E2D6EC", "#DFDFDF", "#FF9999", "#FFE699", "#FFFF99", "#D3ECB9", "#99DF89", "#99DFF9", "#99C6E6", "#99A6BF", "#C6ACD9", "#BFBFBF", "#FF6666", "#FFD966", "#FFFF66", "#BEE396", "#66D096", "#66D0F6", "#66A9D9", "#6679A0", "#A983C6", "#A0A0A0", "#FF3333", "#FFCD33", "#FFFF33", "#A8D973", "#33C073", "#33C3F3", "#338DCD", "#334D80", "#8D59B3", "#000000"];
            $scope.SetColor = function ($event) {
                var color = $($event.target).css("background-color");
                $scope.colorValue = color;
                $scope.$btnSelect.css("background", color);
            }

            $scope.btnSelect_OnClick = function () {
                //关闭其它面板
                $(".color_list").hide();
            }

        }




    });

