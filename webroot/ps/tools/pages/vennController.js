define(['toolsApp'], function (toolsApp) {
    toolsApp.controller('vennController', vennController);
    vennController.$inject = ["$rootScope", "$scope", "$log", "$state", "$timeout", "$window", "$compile", "ajaxService", "toolService", "svgService", "reportService"];
    function vennController($rootScope, $scope, $log, $state, $timeout, $window, $compile, ajaxService, toolService, svgService, reportService) {

        $scope.InitPage = function () {
            $timeout(function () {
                console.log(1);
            }, 300)
            
            $scope.test = 'venn';
        }
    }
});