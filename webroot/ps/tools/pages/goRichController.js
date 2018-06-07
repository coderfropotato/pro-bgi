define(['toolsApp'], function(toolsApp) {
    toolsApp.controller('goRichController', goRichController);
    goRichController.$inject = ["$rootScope", "$scope", "$log", "$state", "$timeout", "$window", "$compile", "ajaxService", "toolService", "svgService", "reportService"];

    function goRichController($rootScope, $scope, $log, $state, $timeout, $window, $compile, ajaxService, toolService, svgService, reportService) {

        $scope.InitPage = function() {
            $timeout(function() {
                console.log(1);
            }, 300)

            $scope.test = 'goRich';
        }
    }
});