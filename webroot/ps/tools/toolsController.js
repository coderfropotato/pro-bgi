define(['toolsApp'], function (toolsApp) {

    toolsApp.controller('toolsController', toolsController);
    toolsController.$inject = ["$rootScope", "$scope", "$log", "$state", "$timeout", "$window", "$compile", "ajaxService", "toolService", "svgService", "reportService"];
    function toolsController($rootScope, $scope, $log, $state, $timeout, $window, $compile, ajaxService, toolService, svgService, reportService) {

        $scope.loadingComplete = false;
        $scope.InitPage = function () {
            $timeout(function () {
                $scope.loadingComplete = true;
                $scope.testToken();
            }, 300)
        }

        $scope.testToken = function () {
            var ajaxConfig = {
                data: {
                    "LCID": toolService.sessionStorage.get("LCID"),
                },
                url: options.api.mrnaseq_url + "/BYJC/GetIndelLengthData"
            }
            var promise = ajaxService.GetDeferData(ajaxConfig);
            promise.then(function (res) {
                if (res.Error) {
                    $scope.IndelLengthError = 'syserror';
                    return;
                } else if (res.data.length == 0) {
                    $scope.IndelLengthError = 'nodata';
                    return;
                } else {
                    $scope.IndelLengthError = false;
                    $scope.drawData = res.data;
                }
            }, function () {
                $scope.IndelLengthError = 'syserror'
            })
        }
    }
});