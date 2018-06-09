define(['toolsApp'], function(toolsApp) {
    toolsApp.controller('mapIdController', mapIdController);
    mapIdController.$inject = ["$rootScope", "$http", "$scope", "$log", "$state", "$timeout", "$window", "$compile", "ajaxService", "toolService", "svgService", "reportService"];

    function mapIdController($rootScope, $http, $scope, $log, $state, $timeout, $window, $compile, ajaxService, toolService, svgService, reportService) {

        $scope.InitPage = function() {
            // 查询参数
            var LCID = toolService.sessionStorage.get('LCID');
            $scope.mapIdEntity = {
                "LCID": LCID,
                "pageNum": 1,
                "pageSize": 10,
            };

            var url = window.location.href;
            if (url.indexOf("?") != -1) {
                var urlArr = url.split("?");
                var mapPart = urlArr[1];
            }

            var mapList = mapPart.split("&");
            var mapIdList = [];
            mapList.forEach(function(val, i) {
                var str = val.substring(val.indexOf("=") + 1, val.length);
                mapIdList.push(str);
            })

            var mapId = "map" + mapIdList[0];
            var compareGroup = mapIdList[1];
            var method = mapIdList[2];

            $scope.title = 'MapID：' + mapId;
            $scope.pathWayIframeUrl = options.pathWayPath + "report_" + LCID + "/" + LCID + "_xreport/Differentially_expressed_gene/Pathway_analysis/Pathway_enrichment/" + compareGroup + "/" + compareGroup + "." + method + "_Method_map/" + mapId + ".html";

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
            var promise = ajaxService.GetDeferData(ajaxConfig);
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