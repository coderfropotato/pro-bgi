define(['toolsApp'], function(toolsApp) {
    toolsApp.controller('helpController', helpController);
    helpController.$inject = ["$rootScope", "$scope", "$log", "$state", "$timeout", "$window", "$compile", "ajaxService", "toolService", "svgService", "reportService"];

    function helpController($rootScope, $scope, $log, $state, $timeout, $window, $compile, ajaxService, toolService, svgService, reportService) {
        toolService.pageLoading.open();
        $scope.InitPage = function() {
            $timeout(function() {
                toolService.pageLoading.close();
            }, 300)

            $scope.title= '帮助'
        }
    }
});