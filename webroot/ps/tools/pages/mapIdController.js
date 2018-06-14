define(['toolsApp'], function(toolsApp) {
    toolsApp.controller('mapIdController', mapIdController);
    mapIdController.$inject = ["$rootScope", "$http", "$scope", "$log", "$state", "$timeout", "$window", "$compile", "ajaxService", "toolService", "svgService", "reportService"];

    function mapIdController($rootScope, $http, $scope, $log, $state, $timeout, $window, $compile, ajaxService, toolService, svgService, reportService) {

        $scope.InitPage = function() {
            toolService.pageLoading.open();
            //定时关闭等待框
            setTimeout(function() {
                toolService.pageLoading.close();
            }, 300);

            // 查询参数
            var LCID = toolService.sessionStorage.get('LCID');

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
            // Geneid table params start
            var koNum = "ko" + mapIdList[0];
            $scope.mapIdEntity = {
                "LCID": LCID,
                "compareGroup": compareGroup,
                "term_id": koNum,
                "pageSize": 10,
                "pageNum": 1,
                "searchContentList": [],
                "sortName": "",
                "sortType": "",
            };
            $scope.url = options.api.mrnaseq_url + '/PathwayTable';
            $scope.panelId = "div_mapid_panel";
            $scope.tableId = "mapid_geneid_table";
            $scope.unselectId = "gene_mapid_unselectid";
            $scope.filename = "基因详情表";
            $scope.geneList = '';
            $scope.changeFlag = false;
            $scope.isResetTheadControl = null;
            $scope.isResetTableStatus = false;
            $scope.isShowTheadControl = true;
            $scope.isReanalysis = true;
            $scope.theadControlId = 'gene_mapid_theadcontrol';
            // Geneid table params end
        }

        var oIframe = $("#mapIdIframe");
        oIframe.on("load", function() {
            var areas = oIframe.contents().find("map").children("area[target_gene]");
            areas.on("click", function() {
                var selectList = [];
                var select = $(this).attr("target_gene");
                if (select.indexOf(",") != -1) {
                    selectList = select.split(",");
                } else if (!select) {
                    selectList = [];
                } else {
                    selectList.push(select);
                }
                $scope.changeFlag = true;
                $scope.geneList = selectList;
            })
        })

    }
});