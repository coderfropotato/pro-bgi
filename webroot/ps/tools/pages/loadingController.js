define(['toolsApp'], function (toolsApp) {
    toolsApp.controller('loadingController', loadingController);
    loadingController.$inject = ["$rootScope", "$scope", "$log", "$state", "$timeout", "$window", "$compile", "ajaxService", "toolService", "svgService", "reportService"];
    function loadingController($rootScope, $scope, $log, $state, $timeout, $window, $compile, ajaxService, toolService, svgService, reportService) {

        $scope.InitPage = function () {
            $scope.loadingComplete = false;
        }
    }
});