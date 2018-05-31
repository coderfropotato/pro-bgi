define(['toolsApp'], function(toolsApp) {
    toolsApp.controller('mapIdController', mapIdController);
    mapIdController.$inject = ["$rootScope", "$http", "$scope", "$log", "$state", "$timeout", "$window", "$compile", "ajaxService", "toolService", "svgService", "reportService"];

    function mapIdController($rootScope, $http, $scope, $log, $state, $timeout, $window, $compile, ajaxService, toolService, svgService, reportService) {

        $scope.InitPage = function() {
            // 查询参数
            $scope.mapIdEntity = {
                LCID: toolService.sessionStorage.get('LCID'),
                pageNum: 1,
                pageSize: 10,
            };

            var url = window.location.href;
            if (url.indexOf("?") != -1) {
                var urlArr = url.split("?");
                var mapId = urlArr[1];
            }
            console.log(mapId);

            $scope.title = 'MapID：' + mapId;

            // $scope.GetmapIdList(1);
        }

        var oIframe = $("#mapIdIframe");
        oIframe.on("load", function() {
            var areas = oIframe.contents().find("map").children("area[target_gene]");
            console.log(areas);
            areas.on("click", function() {
                console.log($(this).attr("target_gene"));
            })
        })

        $scope.GetmapIdList = function(pageNum) {
            toolService.gridFilterLoading.open("mapId-table");
            $scope.mapIdEntity.pageNum = pageNum;
            //配置请求参数
            $scope.mapIdListUrl = options.api.java_url + '/mapId/GetmapIdList'
            var ajaxConfig = {
                data: $scope.mapIdEntity,
                url: $scope.mapIdListUrl
            }
            var promise = ajaxService.GetDeferDataNoAuth(ajaxConfig);
            promise.then(function(res) {
                toolService.gridFilterLoading.close("mapId-table");
                if (res.Error) {
                    $scope.mapIdError = 'syserror';
                    return;
                } else if (res.rows.length == 0) {
                    $scope.mapIdError = 'nodata';
                    return;
                } else {
                    $scope.mapIdError = "";
                    $scope.mapIdList = res;
                    $scope.mapIdError = false;
                }
            }, function() {
                $scope.mapIdError = 'syserror'
                toolService.gridFilterLoading.close("mapId-table");
            })
        }

    }
});