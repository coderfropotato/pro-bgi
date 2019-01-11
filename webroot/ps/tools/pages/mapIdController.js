define(['toolsApp'], function(toolsApp) {
    toolsApp.controller('mapIdController', mapIdController);
    mapIdController.$inject = ["$rootScope", "$http", "$scope", "$log", "$state", "$timeout", "$window", "$compile", "ajaxService", "toolService", "svgService", "reportService","pageFactory"];

    function mapIdController($rootScope, $http, $scope, $log, $state, $timeout, $window, $compile, ajaxService, toolService, svgService, reportService,pageFactory) {

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
            var mapId = "",
                compareGroup = "",
                method = "";
            $scope.taskId = "";
            var koNum = "";
            mapList.forEach(function(val, i) {
                if (val.indexOf("map") != -1) {
                    var str1 = val.substring(val.indexOf("=") + 1, val.length);
                    mapId = "map" + str1;
                    koNum = "ko" + str1;
                }
                if (val.indexOf("comparegroup") != -1) {
                    compareGroup = val.substring(val.indexOf("=") + 1, val.length);
                }
                if (val.indexOf("method") != -1) {
                    method = val.substring(val.indexOf("=") + 1, val.length);
                }
                if (val.indexOf("taskId") != -1) {
                    $scope.taskId = val.substring(val.indexOf("=") + 1, val.length);
                }
            })


            $scope.title = 'MapID：' + mapId;

            // Geneid table params start

            if ($scope.taskId) {
                $scope.mapIdEntity = {
                    "LCID": LCID,
                    "id": $scope.taskId,
                    "term_id": koNum,
                    "pageSize": 10,
                    "pageNum": 1,
                    "searchContentList": [],
                    "sortName": "",
                    "sortType": "",
                };

                $scope.pathWayIframeUrl = options.pathWayPath + "report_" + LCID + "/re_" + $scope.taskId + "/" + LCID + "_" + $scope.taskId + "/Pathway_map/" + mapId + ".html";
            } else {
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

                $scope.pathWayIframeUrl = options.pathWayPath + "report_" + LCID + "/" + LCID + "_xreport/Differentially_expressed_gene/Pathway_analysis/Pathway_enrichment/" + compareGroup + "/" + compareGroup + "." + method + "_Method_map/" + mapId + ".html";
            }
            $scope.reanalysisId = $scope.taskId;
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

        $scope.showGeneInfo = function(GeneID) {
            var genomeVersion = toolService.sessionStorage.get('speciesWeb') +'_' + JSON.parse(toolService.sessionStorage.get('refInfo'))['genome_version'];
            var geneInfo = {
                genomeVersion: genomeVersion,
                geneID: GeneID
            };
            pageFactory.set(geneInfo);
            toolService.popWindow("pages/geneInfo.html", "基因" + GeneID + "信息", 640, 100, "dialog-default", 50, true, null);
        }

    }
});