/*

模块名称：toolTipDire
整理时间：2016-06-20
功能简介：常用的界面工具提示类，如 下拉菜单、弹出提示框 等

*/



define("superApp.selectRangeDire",
["angular", "super.superMessage", "select2"],
function (angular, SUPER_CONSOLE_MESSAGE) {
    var superApp = angular.module("superApp.selectRangeDire", []);



    /*
    ** 创建日期：2016-06-21
    ** 功能简介：文本框 选择范围数值 
    ** 形如：
    
    <div class="select-range" numberList="qjzList" numberValue="qjzValue" numberValid="qjzValid"></div>

    其中： class="select-range"  是指令，必需
           numberList="qjzList"  传入的数组，必需， 形如： [{ fwValue: 0},{ fwValue: 1} ... ]
           numberValue="qjzValue"  初始值，必需
           numberValid="qjzValid"  验证成功失败，必需

    */
    superApp.directive('selectRange', selectRangeDirective);
    selectRangeDirective.$inject = ["$log"];
    function selectRangeDirective($log) {
        return {
            restrict: "ACE",
            template: "<input type='number' class='form-control' ng-class='{\"my-form-invaild\":!numberValid}' ng-model='numberValue' ng-click='inpNumber_OnClick()' style='width:100px' value='-1' readonly />"
                      + "<div style='display:none' class='sr_panel'>"
                      + "<div class='div_field_filter'>"
                      + "<ul>"
                      + "<li ng-repeat='item in numberList'>"
                      + "<span class='label ng-binding label-default' ng-class='{\"label-success\":item.active}' ng-click='btnNumber_OnClick(item)' ng-bind='item.fwValue'></span>"
                      + "</li>"
                      + "</ul>"
                      + "</div>"
                      + "</div>",
            scope: {
                qjzList: "=",               //是整个应用此指令的数值列表[{startValue:"",startValueValid:"",endValue:"",endValueValid:""}]
                numberList: "=",            //默认Tis初始值
                numberValue: "=",           //当前选中值
                numberValid: "=",           //是否验证通过标识
                isInitNext: "=",            //是否根据当前值初始化下一个的值，在点击选中时触发
                nextIndex: "=",             //需要初始化下一个值的索引
                isStart: "=",                //模式初始qjzList值是，是否初始第一个值标识
                callback: "&"               //每次选中后的回调函数

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
                scope.$srPanel = $(element).find(".sr_panel:eq(0)");  //显示|隐藏 数字面板
            },
            controller: "selectRangeCtr"
        }
    }

    superApp.controller("selectRangeCtr", selectRangeCtr);
    selectRangeCtr.$inject = ["$rootScope", "$scope", "$log", "$state", "$window", "ajaxService", "toolService", "reportService"];
    function selectRangeCtr($rootScope, $scope, $log, $state, $window, ajaxService, toolService, reportService) {

        //数字 点击事件
        $scope.btnNumber_OnClick = function (item)
        {

            //隐藏数字面板
            $scope.$srPanel.fadeOut();
            $scope.$element.removeClass("zmax");

            //获得当前选中数字
            $scope.numberValue = item.fwValue;
            //置当前选中
            for (var i = 0; i < $scope.numberList.length; i++)
            {
                $scope.numberList[i].active = false;
            }
            item.active = true;

            //判断是否需要根据当前选中的值初始化下一个list的值
            if ($scope.isInitNext && $scope.qjzList[$scope.nextIndex])
            {
                if ($scope.isStart)
                {
                    $scope.qjzList[$scope.nextIndex].startValue = $scope.numberValue;
                }
                else
                {
                    $scope.qjzList[$scope.nextIndex].endValue = $scope.numberValue;
                }
            }
            if ($scope.callback){
                setTimeout(function ()
                {
                    $scope.$apply(function ()
                    {
                        $scope.callback();
                    });
                }, 100);
            }
        };

        //文本框 点击事件
        $scope.inpNumber_OnClick = function ()
        {

            //隐藏其它面板
            $(".sr_panel").each(function ()
            {
                $(this).hide();
                $(this).parent().removeClass("zmax");
            });

            //点击页面其它任意位置，隐藏数字面板
            $(document).one("click", function ()
            {
                $scope.$apply(function ()
                {
                    $scope.$srPanel.fadeOut();
                    $scope.$element.removeClass("zmax");
                });
            });

            //判断面板位置,若右超出则往左移
            if ($scope.$element.offset().left + $scope.$element.width() + $scope.$srPanel.width() > $(window).width())
            {
                //console.log($scope.$element.offset().left + ";" + $scope.$srPanel.width() + ";" + $(window).width());
                $scope.$srPanel.css("left", ($(window).width() - $scope.$element.offset().left - $scope.$srPanel.width() - $scope.$element.width()) + "px");
            } else
            {
                $scope.$srPanel.css("left",0);
            }

            //显示 数字面板
            $scope.$srPanel.fadeIn();
            $scope.$element.addClass("zmax");

            //根据默认值设置选中
            for (var i = 0; i < $scope.numberList.length; i++)
            {
                if ($scope.numberValue == $scope.numberList[i].fwValue)
                {
                    $scope.numberList[i].active = true;
                }
                else
                {
                    $scope.numberList[i].active = false;
                }
            }
        };

    }


});

