define(['toolsApp'], function (toolsApp) {

    toolsApp.controller('toolsController', toolsController);
    toolsController.$inject = ["$rootScope", "$scope", "$log", "$state", "$timeout", "$window", "$compile", "ajaxService", "toolService", "svgService", "reportService"];
    function toolsController($rootScope, $scope, $log, $state, $timeout, $window, $compile, ajaxService, toolService, svgService, reportService) {

        $scope.loadingComplete = false;
        $scope.InitPage = function () {
            $timeout(function () {
                $scope.loadingComplete = true;
                // $scope.testToken();
                // url传参
                function urlParams() {
                    console.log($window.location.href);
                    var search = $window.location.search.substring(1);
                    var type = search.split('&')[0].split('=')[1];
                    var id = search.split('&')[1].split('=')[1];
                    $state.go(type);
                }
                // session 穿传参
                sessionParams();
                function sessionParams(){
                    var type = toolService.sessionStorage.get('type');
                    var id = toolService.sessionStorage.get('id');
                    $state.go(type);
                }
            }, 300);

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