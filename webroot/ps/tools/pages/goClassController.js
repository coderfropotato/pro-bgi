define(["toolsApp"], function (toolsApp) {
    toolsApp.controller("goClassController", goClassController);
    goClassController.$inject = ["$rootScope", "$scope", "$log", "$state", "$timeout", "$window", "$compile", "ajaxService", "toolService", "svgService", "reportService"];
    function goClassController($rootScope, $scope, $log, $state, $timeout, $window, $compile, ajaxService, toolService, svgService, reportService) {
        toolService.pageLoading.open();
        $scope.InitPage = function () {
            //定时关闭等待框
            setTimeout(function () {
                toolService.pageLoading.close();
            }, 300);

            // custom title
            $scope.projectName = $state.params.projectName;
            // 重分析id
            $scope.id = $state.params.id;       
            $scope.title = 'GO分类 ( ID：' + $scope.id + " ) ";
            // table-switch-chart params start
            $scope.contentId = "div_goClass_reanalysis";
            $scope.panelId = "panel_goClass_reanalysis";
            $scope.chartId = 'goClass_reanalysis_chart';
            $scope.isTableShow = false;
            $scope.showAccuracy = true;
            $scope.showSelect = true;
            $scope.tableDownloadName = "GO 分类";
            $scope.chartDownloadName = "GO 分类";

            var s = JSON.parse(toolService.sessionStorage.get('SampleDiffList'));
            var g = JSON.parse(toolService.sessionStorage.get('CompareGroupList'));

            $scope.CompareSampleList = [];
            g.concat(s).forEach(function (val, index) {
                $scope.CompareSampleList.push(val.name);
            })
            $scope.compareSample = $scope.CompareSampleList[0];
            $scope.selectList = $scope.CompareSampleList;

            $scope.paramsKey = 'compareGroup';
            $scope.paramsValue = $scope.compareSample;
            $scope.pageEntity = {
                "LCID": toolService.sessionStorage.get('LCID'),
                "compareGroup": $scope.compareSample
            }
            $scope.url = options.api.mrnaseq_url + "/TableAndChart/diffGoClass";
            // table-switch-chart-params end

            // Geneid table params start
            $scope.pageFindEntity = {
                "LCID": toolService.sessionStorage.get("LCID"),
                "pageSize": 10,
                "pageNum": 1,
                "searchContentList": [],
                "sortName": "",
                "sortType": "",
                "compareGroup": $scope.compareSample,
            };
            $scope.paramsKeyList = ['compareGroup'];
            $scope.paramsValueList = [$scope.compareSample];
            $scope.url2 = options.api.mrnaseq_url + '/DiffExpGeneClassTable/GoRichGene';
            $scope.panelId = "goClass_reanalysis-2_panel";
            $scope.tableId = "goClass_reanalysis-2_geneid_table";
            $scope.unselectId = "goClass_reanalysis-2_unselectid";
            $scope.filename = "GO分类";
            $scope.geneList = '';
            $scope.changeFlag = false;
            $scope.isResetTheadControl = null;
            $scope.isResetTableStatus = null;
            $scope.isShowTheadControl = true;
            $scope.isReanalysis = true;
            $scope.theadControlId = 'goClass_reanalysis-2_theadcontrol';
            // Geneid table params end

        };

        $scope.selectChangeCallback = function (arg) {
            $scope.paramsValueList = [arg];
        }

        $scope.tableToChartDataFn = function (res) {
            $scope.level1Key = res.baseThead[1]['true_key'];
            $scope.level2Key = res.baseThead[0]['true_key'];
            $scope.numKey = res.baseThead[2]['true_key'];
            var chartData = [];
            // {category: 0, key: 5, value: 23}
            // key1  key2 num
            res.rows.forEach(function (val, index) {
                var obj = { "category": "", "key": 0, "value": 0 };
                obj.category = val[$scope.level1Key];
                obj.key = val[$scope.level2Key];
                obj.value = val[$scope.numKey];
                // obj['gene_id'] = val['gene_id'];
                chartData.push(obj);
            })
            return chartData;
        }

        $scope.drawChartFn = function (data) {
            $('#' + $scope.chartId).html('');
            var width = $('#' + $scope.contentId + ' .graph_header').eq(0).width();
            $scope.barchart = new gooal.barInit("#" + $scope.chartId, {
                "id": $scope.chartId,
                "type": "groupedbar2",
                "data": data,
                "width": width * 0.9,
                "height": data.length * 15,
                "titleBox": {
                    "show": true,
                    "position": "top",
                    "title": "GO分类图",
                    "editable": true
                },
                "legendBox": {
                    "show": true
                },
                "dataBox": {
                    "direction": "horizontal"
                }
            });

            var group2tooltip = $scope.barchart.addTooltip(group2tooltipConfig);
            function group2tooltipConfig(d) {
                group2tooltip.html("key:" + d.key + "</br>" + "value: " + d.value + "</br>" + "Category: " + d.category)
            }

            return $scope.barchart;
        }
    };
});
