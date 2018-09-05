define(["toolsApp"], function(toolsApp) {
    toolsApp.controller("geneDetailController", geneDetailController);
    geneDetailController.$inject = ["$rootScope", "$scope", "$log", "$state", "$timeout", "$window", "$compile", "ajaxService", "toolService", "svgService", "reportService"];

    function geneDetailController($rootScope, $scope, $log, $state, $timeout, $window, $compile, ajaxService, toolService, svgService, reportService) {
        $scope.InitPage = function() {

            toolService.pageLoading.open();
            //定时关闭等待框
            setTimeout(function() {
                toolService.pageLoading.close();
            }, 300);

            //gene id
            $scope.id = $state.params.id;

            $scope.title = $scope.id + " 基因详情";

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

            var sampleDiff = toolService.sessionStorage.get('sampleDiff'),
                groupDiff = toolService.sessionStorage.get('GroupDiff');
            var timeCourse = toolService.sessionStorage.get('timeCourse');
            if (sampleDiff && sampleDiff != "undefined") {
                $scope.isHasSampleDiff = true;
            } else {
                $scope.isHasSampleDiff = false;
            }
            if (groupDiff && groupDiff != "undefined") {
                $scope.isHasGroupDiff = true;
            } else {
                $scope.isHasGroupDiff = false;
            }
            if (timeCourse && timeCourse != "undefined") {
                $scope.isHasTimeCourse = true;
            } else {
                $scope.isHasTimeCourse = false;
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
                        //gene info
                        $scope.geneInfoList = resData.gene_info;
                        if ($scope.geneInfoList.length) {
                            $scope.geneInfoError = "";
                            for (var i = 0; i < $scope.geneInfoList.length; i++) {
                                if ($scope.geneInfoList[i].name == 'Gene ID' && $scope.geneInfoList[i].value != 'NA' && $scope.geneInfoList[i].gene_url) {
                                    $scope.isgeneLink = true;
                                } else {
                                    $scope.isgeneLink = false;
                                }
                            }
                        } else {
                            $scope.geneInfoError = "nodata";
                        }

                        //sample expression
                        $scope.sampleExpData = resData.sample_expression;
                        if (JSON.stringify($scope.sampleExpData) == "{}") {
                            $scope.sampleExpError = "nodata";
                        } else {
                            $scope.sampleExpError = "";
                        }

                        //line
                        $scope.lineData = resData.line;
                        if (JSON.stringify($scope.lineData) == "{}") {
                            $scope.lineError = "nodata";
                        } else {
                            $scope.lineError = "";
                            if ($scope.lineData.baseThead.length > 1) {
                                $scope.isHasLine = true;
                            } else {
                                $scope.isHasLine = false;
                            }
                        }

                        //group differences
                        $scope.groupDiffData = resData.group_diff;
                        if (JSON.stringify($scope.groupDiffData) == "{}") {
                            $scope.groupDiffError = "nodata";
                        } else {
                            $scope.groupDiffError = "";
                        }

                        //sample differences
                        $scope.sampleDiffData = resData.sample_diff;
                        if (JSON.stringify($scope.sampleDiffData) == "{}") {
                            $scope.sampleDiffError = "nodata";
                        } else {
                            $scope.sampleDiffError = "";
                        }

                        // time course
                        $scope.timeCourseList = resData.time_course;
                        if ($scope.timeCourseList.length) {
                            $scope.timeCourseError = "";
                        } else {
                            $scope.timeCourseError = "nodata";
                        }

                        //kegg
                        $scope.keggList = resData.kegg;
                        if ($scope.keggList.length) {
                            $scope.keggError = "";
                        } else {
                            $scope.keggError = "nodata";
                        }

                        //go
                        $scope.goList = resData.go;
                        if ($scope.goList.length) {
                            $scope.goError = "";
                        } else {
                            $scope.goError = "nodata";
                        }

                        //phi
                        $scope.phiList = resData.phi;
                        if ($scope.phiList.length) {
                            $scope.phiError = "";
                        } else {
                            $scope.phiError = "nodata";
                        }

                        //prg
                        $scope.prgList = resData.prg;
                        if ($scope.prgList.length) {
                            $scope.prgError = "";
                        } else {
                            $scope.prgError = "nodata";
                        }

                        //tf
                        $scope.tfList = resData.tf;
                        if ($scope.tfList.length) {
                            $scope.tfError = "";
                            for (var i = 0; i < $scope.tfList.length; i++) {
                                if ($scope.tfList[i].name == 'Family' && $scope.tfList[i].value != 'NA' && $scope.tfList[i].tf_db_link) {
                                    $scope.istfLink = true;
                                } else {
                                    $scope.istfLink = false;
                                }
                            }
                        } else {
                            $scope.tfError = "nodata";
                        }

                        //nr
                        $scope.nrList = resData.nr;
                        if ($scope.nrList.length) {
                            $scope.nrError = "";
                        } else {
                            $scope.nrError = "nodata";
                        }

                        //nt
                        $scope.ntList = resData.nt;
                        if ($scope.ntList.length) {
                            $scope.ntError = "";
                        } else {
                            $scope.ntError = "nodata";
                        }

                        //swissprot
                        $scope.swissprotList = resData.swissprot;
                        if ($scope.swissprotList.length) {
                            $scope.swissprotError = "";
                        } else {
                            $scope.swissprotError = "nodata";
                        }

                        //pfam
                        $scope.pfamList = resData.pfam;
                        if ($scope.pfamList.length) {
                            $scope.pfamError = "";
                        } else {
                            $scope.pfamError = "nodata";
                        }

                        //snp
                        $scope.snpData = resData.snp;
                        if (JSON.stringify($scope.snpData) == "{}") {
                            $scope.snpError = "nodata";
                        } else {
                            $scope.snpError = "";
                        }

                        //indel
                        $scope.indelData = resData.indel;
                        if (JSON.stringify($scope.indelData) == "{}") {
                            $scope.indelError = "nodata";
                        } else {
                            $scope.indelError = "";
                        }

                        //fusion
                        $scope.fusionData = resData.fusion;
                        if (JSON.stringify($scope.fusionData) == "{}") {
                            $scope.fusionError = "nodata";
                        } else {
                            $scope.fusionError = "";
                        }

                        //序列信息
                        $scope.transcript = resData.transcript;
                        $scope.cds = resData.cds;
                        $scope.protein = resData.protein;

                        if (!$scope.transcript && !$scope.cds && !$scope.protein) {
                            $scope.sequenceError = "nodata";
                        } else {
                            $scope.sequenceError = "";
                            $scope.transcriptList = [];
                            $scope.cdsList = [];
                            $scope.proteinList = [];

                            if ($scope.transcript) {
                                if ($scope.transcript.indexOf("\n") != -1) {
                                    $scope.transcriptList = resData.transcript.split("\n");
                                } else {
                                    $scope.transcriptList.push($scope.transcript);
                                }
                            }

                            if ($scope.cds) {
                                if ($scope.cds.indexOf("\n") != -1) {
                                    $scope.cdsList = resData.cds.split("\n");
                                } else {
                                    $scope.cdsList.push($scope.cds);
                                }
                            }

                            if ($scope.protein) {
                                if ($scope.protein.indexOf("\n") != -1) {
                                    $scope.proteinList = resData.protein.split("\n");
                                } else {
                                    $scope.proteinList.push($scope.protein);
                                }
                            }
                        }

                        //画折线图
                        $scope.drawLine($scope.lineData);
                    }
                    toolService.gridFilterLoading.close("div_geneDetail_page");
                },
                function(errorMesg) {
                    toolService.popMesgWindow(resData.Error);
                    toolService.gridFilterLoading.close("div_geneDetail_page");
                });
        }

        function addZero(n) {
            return n < 10 ? '0' + n : n;
        }

        //下载序列
        $scope.downloadSequence = function() {
            var content = "";
            var oDate = new Date();
            var date = oDate.getFullYear() + addZero(oDate.getMonth() + 1) + addZero(oDate.getDate()) + addZero(oDate.getHours()) + addZero(oDate.getMinutes());
            if ($scope.transcript || $scope.cds || $scope.protein) {
                content = $scope.transcript + $scope.cds + $scope.protein;
            }
            var data = new Blob([content], {
                type: "text/plain;charset=UTF-8"
            });
            var downloadUrl = window.URL.createObjectURL(data);
            var anchor = document.createElement("a");
            anchor.href = downloadUrl;
            anchor.download = "序列信息_" + date + ".txt";
            anchor.click();
            anchor.remove();
            window.URL.revokeObjectURL(data);
        }

        //表达量折线图
        $scope.drawLine = function(resData) {
            var width = (resData.baseThead.length * 20 + 80) < 600 ? 600 : resData.baseThead.length * 20 + 80;
            var rows = resData.rows;
            var baseThead = resData.baseThead;
            var data = [];

            for (var i = 0; i < baseThead.length; i++) {
                for (var key in baseThead[i]) {
                    data.push({
                        key: key,
                        value: Math.log10(rows[0][baseThead[i][key]] + 1),
                        hoverValue: rows[0][baseThead[i][key]]
                    })
                }

            }
            $('#geneDetail_line_chart').html('');
            var options = {
                "id": "geneDetail_line_chart",
                "type": "linechart",
                "data": data,
                "width": width,
                "titleBox": {
                    "show": true,
                    "position": "top",
                    "title": "FPKM value of gene in samples",
                    "editable": true
                },
                "axisBox": {
                    "xAxis": {
                        "title": "Sample name",
                        "type": "discrete"
                    },
                    "yAxis": {
                        "title": "log10(FPKM+1)"
                    }
                },
                "legendBox": {
                    "show": false,
                },
                "dataBox": {
                    "showLabel": false,
                    "normalColor": ["#5378F8"],
                    "curve": false,
                }
            }

            $scope.linechart = new gooal.lineInit("#" + options.id, options);

            var linecharttooltip = $scope.linechart.addTooltip(linetooltipConfig);

            function linetooltipConfig(d) {
                linecharttooltip.html("Sample:" + d.key + "</br>" + "FPKM: " + d.hoverValue)
            }
        }

        //resize redraw
        // var timer = null;
        // window.removeEventListener('resize', handlerResize);
        // window.addEventListener('resize', handlerResize, false)

        // function handlerResize() {
        //     var resizeWidth = 600;
        //     clearTimeout(timer);
        //     timer = setTimeout(function() {
        //         if ($scope.linechart) {
        //             $scope.linechart.redraw(resizeWidth);
        //         }
        //     }, 100)
        // }

        //获取文献
        $scope.getLiterature = function() {
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
                },
                function(errorMesg) {
                    $scope.pubmedError = "syserror";
                });
        }

    };
});