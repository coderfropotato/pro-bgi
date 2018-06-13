define(["toolsApp"], function(toolsApp) {
    toolsApp.controller("geneDetailController", geneDetailController);
    geneDetailController.$inject = ["$rootScope", "$scope", "$log", "$state", "$timeout", "$window", "$compile", "ajaxService", "toolService", "svgService", "reportService"];

    function geneDetailController($rootScope, $scope, $log, $state, $timeout, $window, $compile, ajaxService, toolService, svgService, reportService) {
        $scope.InitPage = function() {

            //gene id
            $scope.id = $state.params.id;

            $scope.title = $scope.id + "基因详情页";

            $scope.geneEntity = {
                "LCID": toolService.sessionStorage.get("LCID"),
                "id": $scope.id
            }

            $scope.literatureEntity = {
                "LCID": toolService.sessionStorage.get("LCID"),
                "id": $scope.id
            }

            //根据info判断是否存在此模块
            var details = toolService.sessionStorage.get('geneDetails');
            $scope.geneDetails = [];

            if (details.indexOf(",") != -1) {
                $scope.geneDetails = toolService.sessionStorage.get('geneDetails').split(",");
            } else if (details != "") {
                $scope.geneDetails.push(details);
            } else {
                $scope.geneDetails = [];
            }

            if ($scope.geneDetails.length) {
                $scope.isHasKegg = $.inArray("kegg", $scope.geneDetails) != -1;
                $scope.isHasGO = $.inArray("go", $scope.geneDetails) != -1;
                $scope.isHasSnp = $.inArray("snp", $scope.geneDetails) != -1;
                $scope.isHasIndel = $.inArray("indel", $scope.geneDetails) != -1;
                $scope.isHasFusion = $.inArray("fusion", $scope.geneDetails) != -1;
                $scope.isHasPhi = $.inArray("phi", $scope.geneDetails) != -1;
                $scope.isHasPrg = $.inArray("prg", $scope.geneDetails) != -1;
                $scope.isHasTf = $.inArray("tf", $scope.geneDetails) != -1;
                $scope.isHasNr = $.inArray("nr", $scope.geneDetails) != -1;
                $scope.isHasNt = $.inArray("nt", $scope.geneDetails) != -1;
                $scope.isHasSwissprot = $.inArray("swissprot", $scope.geneDetails) != -1;
                $scope.isHasPfam = $.inArray("pfam", $scope.geneDetails) != -1;
                //序列信息
                $scope.isHasCds = $.inArray("cds", $scope.geneDetails) != -1;
                $scope.isHasProtein = $.inArray("protein", $scope.geneDetails) != -1;
                $scope.isHasTranscript = $.inArray("transcript", $scope.geneDetails) != -1;
            }

            //点击按钮
            $scope.isShowPHIText = false; //判断是否展示phi详细说明
            $scope.isShowSequence = false; //有序列信息，判断是否展示

            $scope.projectType = toolService.sessionStorage.get("projectType");

            $scope.getGeneData();
            $scope.getLiterature();

        };

        // 获取gene数据
        $scope.getGeneData = function() {
            toolService.gridFilterLoading.open("div_geneDetail_page");
            var ajaxConfig = {
                data: $scope.geneEntity,
                url: options.api.mrnaseq_url + "/GeneDetail"
            };
            var promise = ajaxService.GetDeferData(ajaxConfig);
            promise.then(function(resData) {
                    if (resData.Error) {
                        toolService.popMesgWindow(resData.Error);
                    } else {
                        $scope.geneInfoList = resData.gene_info;
                        $scope.sampleExpData = resData.sample_expression;
                        $scope.lineData = resData.line;
                        $scope.groupDiffData = resData.group_diff;
                        $scope.sampleDiffData = resData.sample_diff;
                        $scope.timeCourseList = resData.time_course;
                        $scope.keggList = resData.kegg;
                        $scope.goList = resData.go;
                        $scope.phiList = resData.phi;
                        $scope.snpData = resData.snp;
                        $scope.indelData = resData.indel;
                        $scope.fusionData = resData.fusion;
                        $scope.transcript = resData.transcript;
                        $scope.cds = resData.cds;
                        $scope.protein = resData.protein;
                    }
                    toolService.gridFilterLoading.close("div_geneDetail_page");
                },
                function(errorMesg) {
                    toolService.popMesgWindow(resData.Error);
                    toolService.gridFilterLoading.close("div_geneDetail_page");
                });
        }

        //表达量折线图
        $scope.drawLine = function(resData) {
            $('#' + options.id).html('');
            var width = $('#geneDetail_line .chart_wrap').eq(0).width();
            var rows = resData.rows;
            var data = [];
            for (var i = 0; i < rows.length; i++) {
                data.push({
                    key: rows[i].key,
                    value: rows[i].value
                });
            }

            var options = {
                "id": "geneDetail_line_chart",
                "type": "linechart",
                "data": data,
                "width": width * 0.9,
                "titleBox": {
                    "show": true,
                    "position": "top",
                    "title": "FPKM value of gene in samples",
                    "editable": true
                },
                "axisBox": {
                    "xAxis": {
                        "title": "Sample name"
                    },
                    "yAxis": {
                        "title": "log10(FPKM+1)"
                    }
                },
                "legendBox": {
                    "show": false,
                },
            }

            $scope.linechart = new gooal.lineInit("#" + options.id, options);

            var linecharttooltip = $scope.linechart.addTooltip(linetooltipConfig);

            function linetooltipConfig(d) {
                linecharttooltip.html("Sample:" + d.key + "</br>" + "FPKM: " + d.value)
            }
        }

        //resize redraw
        var timer = null;
        window.removeEventListener('resize', handlerResize);
        window.addEventListener('resize', handlerResize, false)

        function handlerResize() {
            clearTimeout(timer);
            timer = setTimeout(function() {
                if ($scope.linechart) {
                    $scope.linechart.redraw($('#geneDetail_line .chart_wrap').eq(0).width() * 0.9);
                }
            }, 100)
        }

        //获取文献
        $scope.getLiterature = function() {
            toolService.gridFilterLoading.open("literature_panel");
            var ajaxConfig = {
                data: $scope.literatureEntity,
                url: options.api.mrnaseq_url + "/pubmed"
            };
            var promise = ajaxService.GetDeferData(ajaxConfig);
            promise.then(function(resData) {
                    if (resData.Error) {
                        //系统异常
                        $scope.pubmedError = "syserror";
                    } else if (resData.rows.length == 0) {
                        //无数据异常
                        $scope.pubmedError = "nodata";
                    } else {
                        //正常
                        $scope.pubmedError = "";
                        $scope.literature = resData.rows;
                    }
                    toolService.gridFilterLoading.close("literature_panel");
                },
                function(errorMesg) {
                    $scope.pubmedError = "syserror";
                    toolService.gridFilterLoading.close("literature_panel");
                });
        }

    };
});