define(['toolsApp'], function(toolsApp) {
    toolsApp.controller('goRichController', goRichController);
    goRichController.$inject = ["$rootScope", "$scope", "$log", "$state", "$timeout", "$window", "$compile", "ajaxService", "toolService", "svgService", "reportService"];

    function goRichController($rootScope, $scope, $log, $state, $timeout, $window, $compile, ajaxService, toolService, svgService, reportService) {


        toolService.pageLoading.open();
        $scope.InitPage = function() {
            //定时关闭等待框
            setTimeout(
                function() {
                    toolService.pageLoading.close();
                }, 300);

            $scope.accuracy = -1;

            $scope.chartType = "bubble";

            $scope.isBeginFilter = false;

            // 重分析id
            $scope.id = $state.params.id;
            $scope.title = 'GO 富集 ( ID：' + $scope.id + " ) ";

            //go table entity
            $scope.pageEntity = {
                "pageNum": 1,
                "pageSize": 10,
                "LCID": toolService.sessionStorage.get("LCID"),
                "searchContentList": [],
                "sortName": "",
                "sortType": "",
                "id": $scope.id
            }

            //bubble table entity
            $scope.bubbleEntity = {
                "LCID": toolService.sessionStorage.get("LCID"),
                "list": [],
                "id": $scope.id
            }

            $scope.GetTableData(1);

            //默认
            $scope.isShowGoListPanel = false; // 是否显示选中的go list
            $scope.goSelectList = [];

            $scope.GetBubbleData();

            //交互表 --geneid表
            // Geneid table start
            $scope.geneIdTableEntity = {
                "LCID": toolService.sessionStorage.get("LCID"),
                "pageSize": 10,
                "pageNum": 1,
                "searchContentList": [],
                "sortName": "",
                "sortType": "",
                "id": $scope.id
            };

            $scope.paramsKeyList = ["list"]
            $scope.paramsValueList = [
                []
            ];
            $scope.url = options.api.mrnaseq_url + '/DiffExpGeneIDTable/GoRichGene';
            $scope.panelId = "div_reAnalysis_goRich_geneid";
            $scope.tableId = "reAnalysis_goRich_geneid_table";
            $scope.unselectId = "reAnalysis_goRich_unselectid";
            $scope.filename = "GO表";
            $scope.geneList = '';
            $scope.changeFlag = false;
            $scope.isResetTheadControl = null;
            $scope.isResetTableStatus = null;
            $scope.isShowTheadControl = true;
            $scope.isReanalysis = true;
            $scope.reanalysisId = $scope.id;
            $scope.theadControlId = 'reAnalysis_goRich_theadcontrol';
            // Geneid table end

            // 获取前置任务
            $scope.GetLinks();

        };

        // 默认单选
        $scope.single = true;

        //过滤查询参数 
        $scope.InitFindEntity = function(filterFindEntity) {
            $scope.pageEntity = toolService.GetGridFilterFindEntity($scope.pageEntity, filterFindEntity);
            $scope.filterText1 = toolService.GetFilterContentText($scope.pageEntity);
            $scope.GetTableData(1);
            for (var i = 0; i < $scope.tableData.rows.length; i++) {
                $scope.tableData.rows[i].isChecked = false;
            }
            $scope.goSelectList = [];
        };

        //获取GO富集表格数据
        $scope.GetTableData = function(pageNumber) {
            toolService.gridFilterLoading.open("reAnalysis_goRich_go");

            $scope.pageEntity = toolService.SetGridFilterFindEntity($scope.pageEntity, "LCID", "string", "equal", toolService.sessionStorage.get("LCID"));
            $scope.pageEntity.pageNum = pageNumber;

            $scope.exportLocationTable = options.api.mrnaseq_url + "/DiffExpGeneGeneralTable/GoRichTerm";
            var ajaxConfig = {
                data: $scope.pageEntity,
                url: $scope.exportLocationTable
            };
            var promise = ajaxService.GetDeferData(ajaxConfig);
            promise.then(function(resData) {
                    if (resData.Error) {
                        //系统异常
                        $scope.error = "syserror";
                    } else if (resData.length == 0) {
                        //无数据异常
                        $scope.error = "nodata";
                    } else {
                        //正常
                        $scope.error = "";
                        $scope.checkAll = false;
                        $scope.GoBaseThead = resData.baseThead[0];
                        $scope.goKey = $scope.GoBaseThead.true_key;

                        $scope.tableData = resData;
                        var count = 0;
                        $scope.tableData.rows.forEach(function(val, i) {
                            val.isChecked = false;
                            if ($scope.goSelectList.length) {
                                $scope.goSelectList.forEach(function(goVal, j) {
                                    if (goVal[$scope.goKey] === val[$scope.goKey]) {
                                        val.isChecked = true;
                                        count++;
                                    }
                                })
                            }
                        })

                        //是否全选
                        if (count === $scope.pageEntity.pageSize) {
                            $scope.checkAll = true;
                        } else {
                            $scope.checkAll = false;
                        }
                    }
                    toolService.gridFilterLoading.close("reAnalysis_goRich_go");
                },
                function(errorMesg) {
                    $scope.error = "syserror";
                    toolService.gridFilterLoading.close("reAnalysis_goRich_go");
                });
        }

        // 点击删除筛选条件
        $scope.handleDelete = function(event) {
            var thead = angular.element(event.target).siblings('span').find('em').text();
            var clearBtn;
            for (var i = 0; i < $('#reAnalysis_goRich_go table th .grid_head').length; i++) {
                if ($.trim($('#reAnalysis_goRich_go table th .grid_head').eq(i).text()) === thead) {
                    clearBtn = $('#reAnalysis_goRich_go table th .grid_head').eq(i).parent().find('.btnPanel').children().last();
                    break;
                }
            }
            $timeout(function() {
                clearBtn.triggerHandler("click");
            }, 0)
        }

        // 筛选状态改变
        $scope.handlerFilterStatusChange = function(status) {
            $scope.isBeginFilter = status;
        }

        //全选
        function checkedAll() {
            for (var i = 0; i < $scope.tableData.rows.length; i++) {
                $scope.tableData.rows[i].isChecked = true;
                if (!$scope.goSelectList.length) {
                    $scope.goSelectList.push($scope.tableData.rows[i])
                } else {
                    if (!isInArr($scope.tableData.rows[i][$scope.goKey], $scope.goSelectList)) {
                        $scope.goSelectList.push($scope.tableData.rows[i]);
                    }
                }
            }
        }

        //判断值是否在数组中
        function isInArr(x, arr) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i][$scope.goKey] === x) {
                    return true;
                }
            }
            return false;
        }

        //全不选
        function unCheckedAll() {
            for (var i = 0; i < $scope.tableData.rows.length; i++) {
                $scope.tableData.rows[i].isChecked = false;
                for (var k = 0; k < $scope.goSelectList.length; k++) {
                    if ($scope.goSelectList[k][$scope.goKey] === $scope.tableData.rows[i][$scope.goKey]) {
                        $scope.goSelectList.splice(k, 1);
                        k--;
                    }
                }
            }
        }

        //点击表头 table th （全选或全不选）
        $scope.toggleTHClick = function() {
            $scope.checkAll = !$scope.checkAll;
            $scope.checkAll ? checkedAll() : unCheckedAll();
            sortArr('go_qvalue', $scope.goSelectList);
        }

        //点击表格行 table td
        $scope.toggleTDClick = function(item, event) {
            item.isChecked = !item.isChecked;
            var isCheckedAll = true;

            for (var i = 0; i < $scope.tableData.rows.length; i++) {
                if (!$scope.tableData.rows[i].isChecked) {
                    isCheckedAll = false;
                }
                if ($scope.tableData.rows[i].isChecked) {
                    $scope.checkAll = true;
                }
            }

            if (!isCheckedAll) {
                $scope.checkAll = false;
            }

            if (item.isChecked) { // 选
                if (!isInArr(item[$scope.goKey], $scope.goSelectList)) {
                    $scope.goSelectList.push(item);
                }
                // animation
                var $targetOffset = $("#selectGoPanel").offset();
                var x1 = event.pageX;
                var y1 = event.pageY;
                var x2 = $targetOffset.left + 80;
                var y2 = $targetOffset.top + 15;
                reportService.flyDiv("<span class='glyphicon glyphicon-plus mkcheck flyCheck'></span>", x1, y1, x2, y2);
            } else { //未选
                for (var k = 0; k < $scope.goSelectList.length; k++) {
                    if (item[$scope.goKey] === $scope.goSelectList[k][$scope.goKey]) {
                        $scope.goSelectList.splice(k, 1);
                        break;
                    }
                }
            }
            sortArr('go_qvalue', $scope.goSelectList);
        }

        //排序
        function sortArr(key, arr) {
            arr.sort(function(a, b) {
                return a[key] - b[key];
            })
        }

        //GoList panel删除
        $scope.removeGoItem = function(item) {
            for (var i = 0; i < $scope.goSelectList.length; i++) {
                if (item[$scope.goKey] === $scope.goSelectList[i][$scope.goKey]) {
                    $scope.goSelectList.splice(i, 1);
                    break;
                }
            }
            for (var j = 0; j < $scope.tableData.rows.length; j++) {
                if (item[$scope.goKey] === $scope.tableData.rows[j][$scope.goKey]) {
                    $scope.tableData.rows[j].isChecked = false;
                    break;
                }
            }
            if ($scope.checkAll) $scope.checkAll = false;
        }

        //GoList panel清空
        $scope.clearGoList = function() {
            for (var i = 0; i < $scope.tableData.rows.length; i++) {
                $scope.tableData.rows[i].isChecked = false;
            }
            $scope.checkAll = false;
            $scope.goSelectList = [];
            $scope.bubbleEntity.list = $scope.goSelectList;
            $scope.GetBubbleData();
        }

        //重画
        $scope.reDrawChart = function() {
            var golist = [];
            if ($scope.goSelectList.length < 60) {
                for (var i = 0; i < $scope.goSelectList.length; i++) {
                    golist.push($scope.goSelectList[i][$scope.goKey]);
                }
            } else {
                for (var i = 0; i < 60; i++) {
                    golist.push($scope.goSelectList[i][$scope.goKey]);
                }
            }

            $scope.bubbleEntity.list = golist;
            $scope.GetBubbleData();

        }

        //获取气泡图表格数据
        $scope.GetBubbleData = function() {
            toolService.gridFilterLoading.open("reAnalysis_goRich_bubble");
            $scope.bubbleExportLocationTable = options.api.mrnaseq_url + "/DiffExpGeneBubble/GoRichTerm";
            var ajaxConfig = {
                data: $scope.bubbleEntity,
                url: $scope.bubbleExportLocationTable
            };
            var promise = ajaxService.GetDeferData(ajaxConfig);
            promise.then(function(responseData) {
                    if (responseData.Error) {
                        //系统异常
                        $scope.bubbleError = "syserror";
                    } else if (responseData.length == 0) {
                        //无数据异常
                        $scope.bubbleError = "nodata";
                    } else {
                        //正常
                        $scope.bubbleError = "";
                        $scope.bubbleTableData = responseData;
                        if ($scope.chartType == "bubble") {
                            $scope.drawBubble($scope.bubbleTableData);
                        } else {
                            $scope.drawColumn($scope.bubbleTableData);
                        }
                    }
                    toolService.gridFilterLoading.close("reAnalysis_goRich_bubble"); //Loading
                },
                function(errorMesg) {
                    $scope.bubbleError = "syserror";
                    toolService.gridFilterLoading.close("reAnalysis_goRich_bubble"); //Loading
                });
        };

        //点击图获取基因集
        $scope.GetGeneList = function(list) {
            var ajaxConfig = {
                data: {
                    "LCID": toolService.sessionStorage.get("LCID"),
                    "term_id": list,
                    "type": "go",
                    "id": $scope.id
                },
                url: options.api.mrnaseq_url + "/DiffExpGeneID/GetGeneByTerm",
            };
            var promise = ajaxService.GetDeferData(ajaxConfig);
            promise.then(function(responseData) {
                $scope.geneList = responseData;
                if (responseData.length) {
                    $scope.changeFlag = true;
                }
            }, function(errorMesg) {
                console.log(errorMesg);
            });
        }

        // 改色
        $scope.changeColor = function(chart, contentid, scale) {
            groupedbarGetItem();
            var index = '';

            function groupedbarGetItem() {
                chart.getLegendItem(function(d, i) {
                    reportService.selectColor(changeColorCallback);
                    index = i;
                })

                function changeColorCallback(color2) {
                    color = color2;
                    chart.changeColor(index, color2);
                    chart.options.dataBox.normalColor[index] = [color2];
                    groupedbarChangeColor(color2);
                }
            }

            function groupedbarChangeColor(color) {
                chart.redraw($('#' + contentid + ' .graph_header').eq(0).width() * scale);
                //改标题
                chart.dbClickTitle(function() {
                    var textNode = d3.select(this).node();
                    toolService.popPrompt(textNode, textNode.textContent);
                })
                $scope.changeColor(chart, contentid, scale);
                $scope.handlerSingle(chart);
                groupedbarGetItem();
            }
        }

        // 开启单选
        $scope.handlerSingle = function(chart) {
            $scope.single = true;
            chart.selectOff()
            chart.selectOn("single", function(d) {
                var list = [];
                for (var i = 0; i < d.length; i++) {
                    list.push(d[i].term_id);
                }
                $scope.GetGeneList(list);
            });
        }

        // 开启多选
        $scope.handlerMultiple = function(chart) {
            $scope.single = false;
            chart.selectOff();
            chart.selectOn("multiple", function(d) {
                $scope.multiplelist = [];
                for (var i = 0; i < d.length; i++) {
                    $scope.multiplelist.push(d[i].term_id);
                }

            });
        }

        // 多选确定
        $scope.handlerConfirm = function() {
            $scope.GetGeneList($scope.multiplelist);
        }

        //resize redraw
        var timer = null;
        window.removeEventListener('resize', handlerResize);
        window.addEventListener('resize', handlerResize, false)

        function handlerResize() {
            clearTimeout(timer);
            timer = setTimeout(function() {
                if ($scope.curChart) {
                    $scope.curChart.redraw(($('#reAnalysis_goRich_bubble .graph_header').eq(0).width()) * 0.8);
                    //改标题
                    $scope.curChart.dbClickTitle(function() {
                        var textNode = d3.select(this).node();
                        toolService.popPrompt(textNode, textNode.textContent);
                    })
                    if ($scope.chartType != "column") {
                        $scope.changeColor($scope.curChart, "reAnalysis_goRich_bubble", 0.8);
                    }
                    $scope.handlerSingle($scope.curChart);
                }
            }, 100)
        }

        //画气泡图   
        $scope.bubbleOptions = {
            "id": "div_reAnalysis_goRich_bubble",
            "type": "bubble",
            "data": [],
            "width": 0,
            "height": 0,
            "titleBox": {
                "show": true,
                "position": "top",
                "title": "Enriched GO Term",
            },
            "axisBox": {
                "xAxis": {
                    "title": "Rich Ratio"
                }
            },
            "legendBox": {
                "show": true,
                "colorTitle": "Qvalue",
                "sizeTitle": "Gene Number"
            },
            "dataBox": {
                "normalColor": ["#87CEFA", "#00008B"],
            }
        }
        $scope.drawBubble = function(resData) {
            var data = resData.rows;
            var bubbleData = [];
            for (i = 0; i < data.length; i++) {
                var dataObj = { "category1": data[i].go_qvalue, "category2": data[i].go_term_candidate_gene_num, "key": data[i].go_term, "value": data[i].go_rich_ratio, "term_id": data[i].go_term_id };
                bubbleData.push(dataObj);
            }
            $("#div_reAnalysis_goRich_bubble").html("");
            var width = $("#reAnalysis_goRich_bubble .graph_header").eq(0).width();

            $scope.bubbleOptions.data = bubbleData;
            $scope.bubbleOptions.width = width * 0.8;
            $scope.bubbleOptions.height = data.length * 30;

            $scope.bubble = new gooal.scatterInit("#div_reAnalysis_goRich_bubble", $scope.bubbleOptions);
            var bubbletooltip = $scope.bubble.addTooltip(bubbletooltipConfig);

            function bubbletooltipConfig(d) {
                bubbletooltip.html("Go term: " + d.key + "</br>" + "GO Term ID:" + d.term_id + "</br>" + "rich ratio:" + d.value + "</br>" + "qvalue: " + d.category1 + "</br>" + "基因数：" + d.category2);
            }

            $scope.changeColor($scope.bubble, "reAnalysis_goRich_bubble", 0.8);
            $scope.handlerSingle($scope.bubble);

            //改标题
            $scope.bubble.dbClickTitle(function() {
                var textNode = d3.select(this).node();
                toolService.popPrompt(textNode, textNode.textContent);
            })

            $scope.curChart = $scope.bubble;
        }

        //画柱状图   
        $scope.columnOptions = {
            "id": "div_reAnalysis_goRich_column",
            "type": "groupchart",
            "data": [],
            "width": 0,
            "height": 0,
            "titleBox": {
                "show": true,
                "title": "Enriched GO Term"
            },
            "axisBox": {
                "xAxis": {
                    "title": "-log10（Q value）",
                    "title2": "Term Candidate Gene Num"
                }
            },
            "legendBox": {
                "show": true,
            },
            "dataBox": {
                "normalColor": angular.copy($rootScope.colorArr),
            }
        }
        $scope.drawColumn = function(resData) {
            var data = resData.rows;
            $("#div_reAnalysis_goRich_column").html("");
            var width = $("#reAnalysis_goRich_bubble .graph_header").eq(0).width();
            var bardata = [],
                pointData = [];
            for (var i = 0; i < data.length; i++) {
                var barObj = { "key": data[i].go_term, "value": -Math.log10(data[i].go_qvalue), "term_id": data[i].go_term_id, "gene_num": data[i].go_term_candidate_gene_num, "qvalue": data[i].go_qvalue };
                bardata.push(barObj);

                var pointObj = { "key": data[i].go_term, "value": data[i].go_term_candidate_gene_num };
                pointData.push(pointObj);
            }

            $scope.columnOptions.type = "groupchart";
            $scope.columnOptions.width = width * 0.8;
            $scope.columnOptions.height = 30 * data.length;
            //data[0]为柱状图数据,data[1]为折线图数据
            $scope.columnOptions.data[0] = bardata;
            $scope.columnOptions.data[1] = pointData;

            $scope.barchart = new gooal.customInit("#div_reAnalysis_goRich_column", $scope.columnOptions);
            var groupcharttooltip = $scope.barchart.addTooltip(bartooltipConfig, linetooltipConfig)

            function bartooltipConfig(d) {
                groupcharttooltip[0].html("Go term:" + d.key + "</br>" + "GO Term ID:" + d.term_id + "</br>" + "Qvalue: " + d.qvalue + "</br>" + "-log10（Qvalue）: " + d.value + "</br>" + "基因数：" + d.gene_num)
            }

            function linetooltipConfig(d) {
                groupcharttooltip[1].html("Go term:" + d.key + "</br>" + "基因数： " + d.value)
            }

            // $scope.changeColor($scope.barchart, "reAnalysis_goRich_bubble", 0.8);
            $scope.handlerSingle($scope.barchart);

            //改标题
            $scope.barchart.dbClickTitle(function() {
                var textNode = d3.select(this).node();
                toolService.popPrompt(textNode, textNode.textContent);
            })

            $scope.curChart = $scope.barchart;

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

    }
});