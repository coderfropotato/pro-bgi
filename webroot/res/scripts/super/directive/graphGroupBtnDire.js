/*
** 创建人：高洪涛
** 创建时间：2016年6月20日22:35:16
** 指令名称：graphGroupBtnDire
** 功能简介：统计图表与列表切换指令
*/
define("superApp.graphGroupBtnDire",
["angular", "super.superMessage", "select2"],
function (angular, SUPER_CONSOLE_MESSAGE) {
    var superApp = angular.module("superApp.graphGroupBtnDire", []);

    superApp.directive('graphViewBtn', graphViewBtn);
    graphViewBtn.$inject = ["$log"];
    function graphViewBtn($log)
    {
        return {
            restrict: "ACE",
            scope: {
                btnOneCallback: "&",           //按钮1回调方法
                btnTwoCallback: "&",           //按钮1回调方法
                isTable: "=",                  //是否显示表格视图按钮
                isTableShow: "="               //表格视图是否点击
            },
            template: "  <div class=\"btn-group pagePanel-heading-btn btn-group-switch\">"
                     + "     <button type=\"button\"  class=\"new-table-switch-btns  tool-tip\" ng-class=\"{active:!isTableShow}\" title=\"统计视图\" ng-click=\"btn_ShowGraph_OnClick()\"><span class=\"glyphicon glyphicon-stats\"></span></button> "
                     + "     <button type=\"button\" ng-if=\"isTable\" style=\"margin-left:-5px;\" class=\" new-table-switch-btns  tool-tip\" ng-class=\"{active:isTableShow}\" title=\"表格视图\" ng-click=\"btn_ShowTable_OnClick()\"><span class=\"glyphicon glyphicon-th-list\"></span></button>"
                     + " </dvi>",
            replace: false,
            transclude: true,
            controller: "graphViewBtnController",
            link: function (scope, element, attrs)
            {
                scope.apply;
                scope.charPanelID = attrs.charpanelid;
                scope.parentID = attrs.parentid ? attrs.parentid : attrs.charpanelid;
            }
        };
    };

    superApp.controller("graphViewBtnController", graphViewBtnController);
    graphViewBtnController.$inject = ["$scope", "$log", "$state", "$window", "$compile", "ajaxService", "toolService", "reportService"];
    function graphViewBtnController($scope, $log, $state, $window, $compile, ajaxService, toolService, reportService)
    {
        //显示图按钮点击事件
        $scope.btn_ShowGraph_OnClick = function ()
        {
            //reportService.GrphaLoading.Show($scope.parentID); //Loading
            $scope.ResizeBody();
            if ($scope.isTableShow)
            {
                $scope.btnOneCallback({ arg1: null });
            }
            $scope.isTableShow = false;
            //reportService.GrphaLoading.Hide($scope.parentID); //Loading
        };

        //点击表格按钮点击事件
        $scope.btn_ShowTable_OnClick = function ()
        {
            // $scope.ResizeBody();
            if (!$scope.isTableShow)
            {
                $scope.btnTwoCallback({ arg1: 1 });
            }
            $scope.isTableShow = true;
        };

        $scope.ResizeBody = function ()
        {
            setTimeout(function ()
            {
                $(".directivePanel:visible .chart_graph").each(function ()
                {
                    try //因为有的 chart_graph 并不是 highcharts
                    {
                        $(this).highcharts().reflow();
                    } catch (e) { }
                });
                //$(".chart_graph").highcharts().reflow();
                // $(window).resize();
            }, 10);
            //  $(window).resize();
        };
    }
});