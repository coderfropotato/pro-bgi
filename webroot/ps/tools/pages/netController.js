define(['toolsApp'], function(toolsApp) {
    toolsApp.controller('netController', netController);
    netController.$inject = ["$rootScope", "$scope", "$log", "$state", "$timeout", "$window", "$compile", "ajaxService", "toolService", "svgService", "reportService"];

    function netController($rootScope, $scope, $log, $state, $timeout, $window, $compile, ajaxService, toolService, svgService, reportService) {

        $scope.InitPage = function() {
            $timeout(function() {
                console.log(1);
            }, 300)

            $scope.test = 'net';
        }
    }
});