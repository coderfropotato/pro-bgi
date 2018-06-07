define(['toolsApp'], function(toolsApp) {
    toolsApp.controller('pathwayRichController', pathwayRichController);
    pathwayRichController.$inject = ["$rootScope", "$scope", "$log", "$state", "$timeout", "$window", "$compile", "ajaxService", "toolService", "svgService", "reportService"];

    function pathwayRichController($rootScope, $scope, $log, $state, $timeout, $window, $compile, ajaxService, toolService, svgService, reportService) {

        $scope.InitPage = function() {
            $timeout(function() {
                console.log(1);
            }, 300)

            $scope.test = 'pathwayRich';
        }
    }
});