define(['toolsApp'], function(toolsApp) {
    toolsApp.controller('pathwayClassController', pathwayClassController);
    pathwayClassController.$inject = ["$rootScope", "$scope", "$log", "$state", "$timeout", "$window", "$compile", "ajaxService", "toolService", "svgService", "reportService"];

    function pathwayClassController($rootScope, $scope, $log, $state, $timeout, $window, $compile, ajaxService, toolService, svgService, reportService) {

        $scope.InitPage = function() {
            $timeout(function() {
                console.log(1);
            }, 300)

            $scope.test = 'pathwayClass';
        }
    }
});