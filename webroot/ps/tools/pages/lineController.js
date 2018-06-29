define(['toolsApp'], function(toolsApp) {
    toolsApp.controller('lineController', lineController);
    lineController.$inject = ["$rootScope", "$scope", "$log", "$state", "$timeout", "$window", "$compile", "ajaxService", "toolService", "svgService", "reportService"];

    function lineController($rootScope, $scope, $log, $state, $timeout, $window, $compile, ajaxService, toolService, svgService, reportService) {
        toolService.pageLoading.close();
        toolService.pageLoading.open();
        $scope.InitPage = function() {
            $timeout(function() {
                toolService.pageLoading.close();
            }, 300)

            $scope.id = $state.params.id;
            $scope.lineWidth = 0;
            $scope.title = '折线图 ( ID：' + $scope.id + " ) ";
            $scope.lineError = false;
            $scope.curType = '';
            var g = JSON.parse(toolService.sessionStorage.get('CompareGroupList'));
            var sc = JSON.parse(toolService.sessionStorage.get('SampleDiffList'));
            var s = toolService.sessionStorage.get('SampleList');
            s = s.split(',');
            var sl = [];
            s.forEach(function(val, index) {
                sl.push({
                    name: val,
                    type: 'sample'
                })
            })
            var o = g.concat(sc);
            var gl = [];
            o.forEach(function(val, index) {
                gl.push({
                    name: val.name,
                    type: 'compareGroup'
                });
            })
            $scope.list = gl.concat(sl);

            $scope.GetLineChartData();
            $scope.GetLinks();

            // Geneid table params start
            $scope.pageFindEntity = {
                "id": $scope.id,
                "LCID": toolService.sessionStorage.get("LCID"),
                "pageSize": 10,
                "pageNum": 1,
                "searchContentList": [],
                "sortName": "",
                "sortType": ""
            };
            $scope.url = options.api.mrnaseq_url + '/table/GetLineTableData';
            $scope.panelId = "reanalysis_line_panel";
            $scope.tableId = "reanalysis_line_geneid_table";
            $scope.unselectId = "reanalysis_line_unselectid";
            $scope.filename = "基因表达量表格数据";
            $scope.geneList = '';
            $scope.changeFlag = false;
            $scope.isResetTheadControl = null;
            $scope.isResetTableStatus = null;
            $scope.isShowTheadControl = true;
            $scope.isReanalysis = true;
            $scope.reanalysisId = $scope.id;
            $scope.theadControlId = 'reanalysis_line_theadcontrol';
            // Geneid table params end
        }

        $scope.GetLineChartData = function(flag) {
            toolService.gridFilterLoading.open("analysis-linePanel");
            var ajaxConfig = {
                data: {
                    "LCID": toolService.sessionStorage.get('LCID'),
                    "id": $scope.id
                },
                url: options.api.mrnaseq_url + "/FoldLine/RE"
            }
            var promise = ajaxService.GetDeferData(ajaxConfig);
            promise.then(function(res) {
                if (res.Error) {
                    $scope.lineError = "syserror";
                } else if (res.length == 0) {
                    $scope.lineError = "nodata";
                } else {
                    $scope.lineError = false;
                    var x = res.baseThead[0].x;
                    $scope.chartData = [];
                    $scope.mapTheadJson = {};
                    var order = [];
                    $scope.lineWidth = ((Math.ceil(res.rows.length / 18) * 150) + res.baseThead.length * 30 + 60) || 500;
                    if($scope.lineWidth<500){
                        $scope.lineWidth = 500;
                    }
                    res.baseThead.forEach(function(val, index) {
                        if (index != 0) {
                            for (var key in val) {
                                $scope.mapTheadJson[val[key]] = key;
                                order.push(key);
                            }
                        }
                    })

                    res.rows.forEach(function(val, index) {
                        // $scope.chartData[index] = [];
                        for (var name in val) {
                            if (name !== x) {
                                $scope.chartData.push({
                                    category: val[x],
                                    key: $scope.mapTheadJson[name],
                                    value: val[name] || 0
                                });

                            }
                        }
                    })
                    var flag = '';
                    for (var key in res.baseThead[1]) {
                        flag = key;
                    }
                    $scope.list.forEach(function(val, index) {
                        if (val.name === flag) {
                            $scope.curType = val.type;
                        }
                    })

                    if(!$scope.curType) $scope.curType = 'sample';

                    if (!$scope.chartData.length) {
                        $scope.lineError = 'nodata';
                    } else {
                        $scope.chartData = $scope.sortArr(order, angular.copy($scope.chartData));
                        $scope.drawLineChart($scope.chartData);
                    }
                }
                toolService.gridFilterLoading.close("analysis-linePanel");

            }, function(errMsg) {
                $scope.lineError = "syserror";
                toolService.gridFilterLoading.close("analysis-linePanel");
            })
        }


        //画折线图
        $scope.lineOptions = {
            "id": "",
            "type": "line",
            "data": [],
            "width": 480,
            "height":400,
            "titleBox": {
                "title":"折线图",
                "show": true,
                "position": "top"
            },
            "legendBox": {
                "show": true,
                "position": "right"
            },
            "axisBox": {
                "xAxis": {
                    "type": "discrete",
                    "fontRotate": "auto",
                    "title": $scope.curType 
                },
                "yAxis": {
                    "title": "log10(FPKM+1)"
                }
            },
            "dataBox": {
                "normalColor": angular.copy($rootScope.colorArr),
                "curve":false,
            }
        }
        $scope.drawLineChart = function(data) {
            
            $("#lineChart_panel").html("");

            var width = $("#analysis-linePanel .graph_header").eq(0).width();

            $scope.lineOptions.id = "lineChart_panel";
            $scope.lineOptions.data = data;
            $scope.lineOptions.width = $scope.lineWidth
            $scope.linechart = new gooal.lineInit("#lineChart_panel", $scope.lineOptions)
            var linecharttooltip = $scope.linechart.addTooltip(linetooltipConfig);

            function linetooltipConfig(d) {
                linecharttooltip.html('GeneID：' + d.category + "<br>" + $scope.curType + "：" + d.key + "</br>" + "log10(FPKM+1): " + Math.log10(d.value+1) + "<br>FPKM " + d.key + "：" + d.value)
            }

            // 改色
            (function changeColor() {
                groupedbarGetItem();
                var index = '';

                function groupedbarGetItem() {
                    $scope.linechart.getLegendItem(function(d, i) {
                        reportService.selectColor(changeColorCallback);
                        index = i;
                    })

                    function changeColorCallback(color2) {
                        color = color2;
                        $scope.linechart.changeColor(index, color2);
                        $scope.lineOptions.dataBox.normalColor[index] = [color2];
                        groupedbarChangeColor(color2);
                    }
                }

                function groupedbarChangeColor(color) {
                    var width = $scope.linechart.getOptions().width;
                    $scope.linechart.redraw(width);
                    //改标题
                    $scope.linechart.dbClickTitle(function() {
                        var textNode = d3.select(this).node();
                        toolService.popPrompt(textNode, textNode.textContent);
                    })
                    groupedbarGetItem();
                }
            })()

            //改标题
            $scope.linechart.dbClickTitle(function() {
                var textNode = d3.select(this).node();
                toolService.popPrompt(textNode, textNode.textContent);
            })
        }


        //get links 
        $scope.linksError = false;
        $scope.GetLinks = function() {
            var promise = ajaxService.GetDeferData({
                data: {},
                url: options.api.java_url + "/analysis/parent/" + $scope.id
            })
            promise.then(function(res) {
                if (res.status != 200) {
                    $scope.linksError = "syserror";
                } else {
                    $scope.linksError = false;
                    $scope.links = res.data.links;
                }
            }, function(err) {
                console.log(err);
            })
        }

        // 查看links
        $scope.handlerSeeClick = function(item) {
            var type = item.chartType || item.charType;
            if (item.process == 0) {
                $window.open('../tools/index.html#/home/error/' + item.id);
            } else {
                // success
                $window.open('../tools/index.html#/home/' + type + '/' + item.id);
            }
        }

        $scope.sortArr = function(orderArr, arr) {
            var res = [];
            for (var i = 0; i < orderArr.length; i++) {
                for (var k = 0; k < arr.length; k++) {
                    if (orderArr[i] === arr[k].key) {
                        res.push(arr[k]);
                        arr.splice(k, 1);
                        k--;
                    }
                }
            }
            return res;
        }
    }
});