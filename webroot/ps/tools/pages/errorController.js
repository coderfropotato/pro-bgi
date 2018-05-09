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
            $scope.title = '错误信息 ( ID : ' + $state.params.id + ')';
            $scope.GetErrorMsg();
        }

        // 获取错误信息
        $scope.GetErrorMsg = function () {
            //配置请求参数
            var ajaxConfig = {
                data: {},
                url: options.api.java_url+"/analysis/explains/" + $state.params.id
            }
            var promise = ajaxService.GetDeferDataNoAuth(ajaxConfig);
            promise.then(function (res) {
                console.log(res)
                if (res.status != 200) {
                    $scope.error = 'syserror';
                    return;
                } else if (!res.data.explains) {
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