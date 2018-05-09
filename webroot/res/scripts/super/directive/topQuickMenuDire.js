/**
 * 顶部快捷菜单导航
 */
define("superApp.topQuickMenuDire",
    ["angular", "super.superMessage", "select2"],
    function (angular, SUPER_CONSOLE_MESSAGE) {
        var superApp = angular.module("superApp.topQuickMenuDire", []);
        superApp.directive('topQuickMenu', topQuickMenuDirective);
        topQuickMenuDirective.$inject = ["$log"];
        function topQuickMenuDirective($log) {
            return {
                restrict: "ACE",
                template: "<dl class=\"quick_menu\" ng-if=\"quickMenuList.length > 1\" style=\"display: none; \""
                    + "ng-class=\"{ isShow: quickMenuList.length > 0 }\">"
                    + "<dd ng-repeat=\"quickItem in quickMenuList track by $index\""
                    + "ng-class=\"{active: quickItem.isActive,isShuoming: quickItem.type === 'sm',"
                    + "isJiehuo: quickItem.type === 'jh',quickItem: quickItem.type !== 'sm' && quickItem.type !== 'jh'"
                    + "} \" ng-bind=\"quickItem.JDMC\" ng-click=\"QuickMenu_OnClick(quickItem)\" title=\"{{ quickItem.JDMC }} \">"
                    + "</dd></dl>",
                replace: false,
                transclude: true,
                controller: "topQuickMenuCtr",
                scope: {
                    quickMenuList: "=",
                }
            }
        }

        superApp.controller("topQuickMenuCtr", topQuickMenuCtr);
        topQuickMenuCtr.$inject = ["$rootScope","$scope", "$log", "$state", "$window", "$compile", "ajaxService", "toolService", "reportService"];
        function topQuickMenuCtr($rootScope,$scope, $log, $state, $window, $compile, ajaxService, toolService, reportService) {
            $scope.QuickMenu_OnClick = function (item) {
                //如果点击的是当前选中的item，则什么都不执行
                if (item.isActive) return;
                if (item.LJLJ == null) return;
                angular.forEach($rootScope.quickMenuList, function (listItem, index, array) {
                    listItem.isActive = false;
                });
                item.isActive = true;
                //加载页面
                reportService.IndexLoadPage(item);
                //触发 Resize，包括窗口 Resize 事件，highchart 重画
                setTimeout(function () {
                    $(".directivePanel:visible .chart_graph").each(function () {
                        try //因为有的 chart_graph 并不是 highcharts
                        {
                            $(this).highcharts().reflow();
                        } catch (e) { }
                    });
                    $(window).resize();
                }, 100);
            }

        }
    });

