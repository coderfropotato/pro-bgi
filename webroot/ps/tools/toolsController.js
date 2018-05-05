define(['toolsApp'], function (toolsApp) {

    toolsApp.controller('toolsController', toolsController);
    toolsController.$inject = ["$rootScope", "$scope", "$log", "$state", "$timeout", "$window", "$compile", "ajaxService", "toolService", "svgService", "reportService"];
    function toolsController($rootScope, $scope, $log, $state, $timeout, $window, $compile, ajaxService, toolService, svgService, reportService) {

        $scope.loadingComplete = false;
        $scope.InitPage = function () {
            $timeout(function () {
                $scope.loadingComplete = true;
            }, 300);
        }
    }
});