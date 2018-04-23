define(['toolsApp'], function (toolsApp) {
    toolsApp.controller('heatmapController', heatmapController);
    heatmapController.$inject = ["$rootScope", "$scope", "$log", "$state", "$timeout", "$window", "$compile", "ajaxService", "toolService", "svgService", "reportService"];
    function heatmapController($rootScope, $scope, $log, $state, $timeout, $window, $compile, ajaxService, toolService, svgService, reportService) {

        $scope.InitPage = function () {
            $timeout(function () {
                console.log(1);
            }, 300)
            
            $scope.test = 'heatmap';
        }
    }
});