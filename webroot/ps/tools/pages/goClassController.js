define(["toolsApp"], function(toolsApp) {
    toolsApp.controller("goClassController", goClassController);
    goClassController.$inject = ["$rootScope", "$scope", "$log", "$state", "$timeout", "$window", "$compile", "ajaxService", "toolService", "svgService", "reportService","pageFactory"];

    function goClassController($rootScope, $scope, $log, $state, $timeout, $window, $compile, ajaxService, toolService, svgService, reportService,pageFactory) {
        toolService.pageLoading.open();
        $scope.InitPage = function() {
            //定时关闭等待框
            setTimeout(function() {
                toolService.pageLoading.close();
            }, 300);

            // 重分析id
            $scope.id = $state.params.id;
            $scope.title = 'GO分类 ( ID：' + $scope.id + " ) ";


            // table-switch-chart params start
            $scope.contentId = "div_reanalysis_goClass";
            $scope.panelId = "panel_reanalysis_goClass";
            $scope.chartId = 'reanalysis_goClass_chart';
            $scope.isTableShow = false;
            $scope.showAccuracy = false;
            $scope.showSelect = true;
            $scope.tableDownloadName = "GO 分类";
            $scope.chartDownloadName = "GO 分类";
            $scope.isShowBeforeTask = true;

            $scope.isSelectChartData = true;
            $scope.pageEntity = {
                "LCID": toolService.sessionStorage.get('LCID'),
                "id": $scope.id
            }
            $scope.url = options.api.mrnaseq_url + "/ReGeneClass/goClass";
            $scope.scale = 0.9;
            // table-switch-chart-params end

            // Geneid table params start
            $scope.pageFindEntity = {
                "id": $scope.id,
                "LCID": toolService.sessionStorage.get("LCID"),
                "pageSize": 10,
                "pageNum": 1,
                "searchContentList": [],
                "sortName": "",
                "sortType": "",
            };
            $scope.url2 = options.api.mrnaseq_url + '/DiffExpGeneClassTable/GoRichGene';
            $scope.panelId2 = "reanalysis_goClass_2_panel";
            $scope.tableId2 = "reanalysis_goClass_2_geneid_table";
            $scope.unselectId2 = "reanalysis_goClass_2_unselectid";
            $scope.filename = "GO分类";
            $scope.geneList = "";
            $scope.changeFlag = false;
            $scope.isResetTheadControl = null;
            $scope.isResetTableStatus = false;
            $scope.isShowTheadControl = true;
            $scope.isReanalysis = true;
            $scope.reanalysisId = $scope.id;
            $scope.theadControlId = 'reanalysis_goClass_2_theadcontrol';
            // Geneid table params end

        };


        $scope.selectData = [];
        $scope.chartSelectFn = function(arg) {
            var select = [];
            arg.forEach(function(val, index) {
                select = select.concat(val.geneList);
            })
            if (!angular.equals($scope.selectData, select)) {
                $scope.selectData = angular.copy(select);
                $scope.geneList = select;
                $scope.changeFlag = true;
            }
        }

        $scope.handlerRefreshClick = function() {
            $scope.selectData = [];
            $scope.isResetTableStatus = true;
        }

        $scope.tableToChartDataFn = function(res) {
            $scope.level1Key = res.baseThead[1]['true_key'];
            $scope.level2Key = res.baseThead[0]['true_key'];
            $scope.numKey = res.baseThead[2]['true_key'];
            var chartData = [];
            // {category: 0, key: 5, value: 23}
            // key1  key2 num
            res.rows.forEach(function(val, index) {
                var obj = { "category": "", "key": 0, "value": 0, "geneList": [] };
                obj.category = val[$scope.level1Key];
                obj.key = val[$scope.level2Key];
                obj.value = val[$scope.numKey];
                obj.geneList = val['gene_id'];
                chartData.push(obj);
            })
            return chartData;
        }

        $scope.options = {
            "id": "",
            "type": "groupedbar2",
            "data": [],
            "width": 800,
            "height": 0,
            "titleBox": {
                "show": true,
                "position": "top",
                "title": "GO 分类",
                "editable": true
            },
            "axisBox": {
                "xAxis": {
                    "title": "Number of Genes",
                },
                "yAxis": {
                    "title": '',
                }
            },
            "legendBox": {
                "show": true
            },
            "dataBox": {
                "normalColor": angular.copy($rootScope.barColorArr),
                "direction": "horizontal"
            }
        }
        $scope.drawChartFn = function(data) {
            $('#' + $scope.chartId).html('');
            var width = $('#' + $scope.contentId + ' .graph_header').eq(0).width();

            $scope.options.id = $scope.chartId;
            $scope.options.data = data;
            $scope.options.height = (14 * data.length + 20) < 480 ? 480 : (14 * data.length + 20);

            $scope.barchart = new gooal.barInit("#" + $scope.chartId, $scope.options);

            var group2tooltip = $scope.barchart.addTooltip(group2tooltipConfig);

            function group2tooltipConfig(d) {
                group2tooltip.html("Level1: " + d.category + "<br>Level2:" + d.key + "</br>" + "Number of Genes: " + d.value)
            }
            //改标题
            $scope.barchart.dbClickTitle(function() {
                var textNode = d3.select(this).node();
                toolService.popPrompt(textNode);
            })
            $scope.barchart.mouseoverTitle(function() {
                d3.select(this).attr("fill", "#5378f8");
                d3.select(this).append("title").text("双击修改");
            })
            $scope.barchart.mouseoutTitle(function() {
                d3.select(this).attr("fill", "#000000");
                d3.select(this).select("title").remove();
            })
            return $scope.barchart;
        }

        $scope.showGeneInfo = function(GeneID) {
            var genomeVersion = toolService.sessionStorage.get('speciesWeb') +'_' + JSON.parse(toolService.sessionStorage.get('refInfo'))['genome_version'];
            var geneInfo = {
                genomeVersion: genomeVersion,
                geneID: GeneID
            };
            pageFactory.set(geneInfo);
            toolService.popWindow("pages/geneInfo.html", "基因" + GeneID + "信息", 640, 100, "dialog-default", 50, true, null);
        }
    };
});