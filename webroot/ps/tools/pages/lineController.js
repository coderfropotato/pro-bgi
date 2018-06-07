define(['toolsApp'], function(toolsApp) {
    toolsApp.controller('lineController', lineController);
    lineController.$inject = ["$rootScope", "$scope", "$log", "$state", "$timeout", "$window", "$compile", "ajaxService", "toolService", "svgService", "reportService"];

    function lineController($rootScope, $scope, $log, $state, $timeout, $window, $compile, ajaxService, toolService, svgService, reportService) {

        $scope.InitPage = function() {
            $timeout(function() {
                console.log(1);
            }, 300)

            $scope.test = 'line';
        }
    }
});