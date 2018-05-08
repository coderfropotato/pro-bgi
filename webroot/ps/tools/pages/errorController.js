define(['toolsApp'], function (toolsApp) {
    toolsApp.controller('errorController', errorController);
    errorController.$inject = ["$rootScope", "$scope", "$log", "$state", "$timeout", "$window", "$compile", "ajaxService", "toolService", "svgService", "reportService"];
    function errorController($rootScope, $scope, $log, $state, $timeout, $window, $compile, ajaxService, toolService, svgService, reportService) {
        $scope.InitPage = function () {
            toolService.pageLoading.open();
            $timeout(function () {
                toolService.pageLoading.close();
            }, 300)

            $scope.error = false;
            $scope.id = $state.id;
        }

        // 获取错误信息
        $scope.GetErrorMsg = function () {
            //配置请求参数
            var ajaxConfig = {
                data: { id: $scope.id },
                url: "http://192.168.29.203/bgfxxt/analysis/dalete/" + id
            }
            var promise = ajaxService.GetDeferDataNoAuth(ajaxConfig);
            promise.then(function (res) {
                if (res.status != 200) {
                    $scope.error = 'syserror';
                    return;
                } else if (res.length === 0) {
                    $scope.error = 'nodata';
                } else {
                    $scope.error = false;
                    $scope.errormsg = res;
                }
            }, function () {
                $scope.error = 'syserror'
            })
        }
    }
});