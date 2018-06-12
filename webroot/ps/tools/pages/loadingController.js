define(['toolsApp'], function (toolsApp) {
    toolsApp.controller('loadingController', loadingController);
    loadingController.$inject = ["$rootScope", "$scope", "$log", "$state", "$timeout", "$window", "$compile", "ajaxService", "toolService", "svgService", "reportService"];
    function loadingController($rootScope, $scope, $log, $state, $timeout, $window, $compile, ajaxService, toolService, svgService, reportService) {
        $scope.InitPage = function () {
            toolService.pageLoading.open('正在提交重分析，请稍后...');
        }
    }
});