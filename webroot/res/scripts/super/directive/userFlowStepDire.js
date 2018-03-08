/*
创建人：高洪涛
创建日期：2016年7月28日10:52:37
模块名称：toolTipDire
功能简介：用户流程添加，页面上方显示当前是第几步的控件
*/
define("superApp.userFlowStepDire",
["angular", "super.superMessage", "select2"],
function (angular, SUPER_CONSOLE_MESSAGE)
{
    var superApp = angular.module("superApp.userFlowStepDire", []);


    superApp.directive('userFlowStep', userFlowStepDirective);
    userFlowStepDirective.$inject = ["$log"];
    function userFlowStepDirective($log)
    {
        return {
            restrict: "ACE",
            templateUrl: SUPER_CONSOLE_MESSAGE.localUrl.userFlowStepPath,
            replace: false,
            transclude: true,
            controller: "userFlowStepController",
            scope: {
                liuChengStep:"="
            }
        }
    }

    superApp.controller("userFlowStepController", userFlowStepController);
    userFlowStepController.$inject = ["$scope", "$log", "$state", "$window", "$compile", "ajaxService", "toolService"];
    function userFlowStepController($scope, $log, $state, $window, $compile, ajaxService, toolService)
    {
    }

});

