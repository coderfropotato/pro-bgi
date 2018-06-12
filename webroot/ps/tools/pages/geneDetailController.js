define(["toolsApp"], function(toolsApp) {
    toolsApp.controller("geneDetailController", geneDetailController);
    geneDetailController.$inject = ["$rootScope", "$scope", "$log", "$state", "$timeout", "$window", "$compile", "ajaxService", "toolService", "svgService", "reportService"];

    function geneDetailController($rootScope, $scope, $log, $state, $timeout, $window, $compile, ajaxService, toolService, svgService, reportService) {
        toolService.pageLoading.open();
        $scope.InitPage = function() {
            //定时关闭等待框
            setTimeout(function() {
                toolService.pageLoading.close();
            }, 300);

            //gene id
            $scope.id = $state.params.id;

            $scope.title = $scope.id + "基因详情页";

            $scope.projectType = toolService.sessionStorage.get("projectType");

            $scope.expressEntity = {
                "LCID": toolService.sessionStorage.get("LCID"),
                "sample": "HBRR1"
            }
            $scope.getExpressTable();

        };

        // 样本表达量
        $scope.getExpressTable = function() {
            toolService.gridFilterLoading.open("expressTable_panel");
            var ajaxConfig = {
                data: $scope.expressEntity,
                url: options.api.mrnaseq_url + "/SimpleTable/RawReadsClass"
            };
            var promise = ajaxService.GetDeferData(ajaxConfig);
            promise.then(function(resData) {
                    if (resData.Error) {
                        //系统异常
                        $scope.expressTableError = "syserror";
                    } else if (resData.length == 0) {
                        //无数据异常
                        $scope.expressTableError = "nodata";
                    } else {
                        //正常
                        $scope.expressTableError = "";
                        $scope.tableData = resData;
                    }
                    toolService.gridFilterLoading.close("expressTable_panel");
                },
                function(errorMesg) {
                    $scope.expressTableError = "syserror";
                    toolService.gridFilterLoading.close("expressTable_panel");
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

    };
});