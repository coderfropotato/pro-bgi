define(["toolsApp"], function (toolsApp) {
    toolsApp.controller("heatmapSampleController", heatmapSampleController);
    heatmapSampleController.$inject = ["$rootScope", "$scope", "$log", "$state", "$timeout", "$window", "$compile", "ajaxService", "toolService", "svgService", "reportService"];


    function heatmapSampleController($rootScope, $scope, $log, $state, $timeout, $window, $compile, ajaxService, toolService, svgService, reportService) {
        toolService.pageLoading.open();
        $scope.InitPage = function () {
            //定时关闭等待框
            setTimeout(
                function () {
                    toolService.pageLoading.close();
                }, 300);
            // custom title
            $scope.projectName = $state.params.projectName;
            $scope.id = $state.params.id;       // 重分析id
            // 项目：' + $scope.projectName + ',
            $scope.title = '聚类分析 ( ID：' + $scope.id + " ) ";

            $scope.isShowColorPanel = false; //是否显示颜色面板
            $scope.isShowSetPanel = false;  //是否显示设置面板
            $scope.isRefresh = false;  //是否点击了刷新
            $scope.compareGroup = '';
            $scope.isBeginFilter = false;
            //聚类图请求entity
            $scope.clusterEntity = {
                "LCID": toolService.sessionStorage.get("LCID"),
                "id": $scope.id,
            }

            //图颜色
            var colorArr = ["#bac5fd", "#ef9794", "#91d691"];
            toolService.sessionStorage.set('colors', colorArr);

            $scope.goAnnoFindEntity = {
                "id": $scope.id,
                "LCID": toolService.sessionStorage.get("LCID"),
                "pageSize": 10,
                "pageNum": 1,
                "searchContentList": [],
                "sortName": "",
                "sortType": ""
            };
            $scope.accuracy = -1;  // 精度默认 全数据

            $scope.setOption = {
                isShowName: false,
                isShowTopLine: true,
                sortNames: []
            }
            // 获取增删列dire数据
            $scope.allTableHeader = JSON.parse(toolService.sessionStorage.get('allThead'));
            // 获取聚类图数据
            $scope.GetHeatmapData();
            // 获取表格数据
            $scope.GetGOAnnoList(1);
            // 获取前置任务
            $scope.GetLinks();
        };

        //获取聚类图数据
        $scope.GetHeatmapData = function (flag) {
            $scope.isShowSetPanel = false;

            toolService.gridFilterLoading.open("analysis-heatmapClusterPanel");

            var ajaxConfig = {
                data: $scope.clusterEntity,
                url: options.api.mrnaseq_url + "/clusterHeatmap/GetClusterHeatmapData"
            }
            var promise = ajaxService.GetDeferData(ajaxConfig);
            promise.then(function (res) {
                if (res.Error) {
                    $scope.clusterError = "syserror";
                } else if (JSON.stringify(res) === '{}') { // js: JSON.stringify(res)==='{}' ;  jquery: $.isEmptyObject(res) ; es6: Object.keys(res).length === 0
                    $scope.clusterError = "nodata";
                } else {
                    $scope.clusterError = "";
                    res.heatmapData.reverse();
                    $scope.setOption.sortNames = res.heatmapData;

                    //场景：res.topClusterData可能为{}
                    if (JSON.stringify(res.topClusterData) === "{}") {
                        $scope.isTopCluster = false;
                    } else {
                        $scope.isTopCluster = true;
                    }

                    $scope.drawClusterHeatmap(res, $scope.setOption);

                    if (flag && flag === 'refresh') {
                        $scope.isRefresh = true;
                        $timeout(function () {
                            $scope.isRefresh = false;
                        }, 30)
                    }

                    $scope.chartData = res;
                }

                toolService.gridFilterLoading.close("analysis-heatmapClusterPanel");

            }, function (errMsg) {
                $scope.clusterError = "syserror";
                toolService.gridFilterLoading.close("analysis-heatmapClusterPanel");
            })
        }

        //设置面板点击确定的回调函数
        $scope.getSetOption = function (oSet) {
            $scope.drawClusterHeatmap($scope.chartData, oSet);
        }

        //画图
        $scope.drawClusterHeatmap = function (resdata, setOption) {
            d3.selectAll("#heatmapsample_chartClusterpic svg g").remove();
            //定义数据
            var cluster_data = resdata.leftClusterData,
                topCluster_data = resdata.topClusterData,
                heatmap_data = setOption.sortNames,
                valuemax = resdata.maxValue,
                valuemin = resdata.minValue;

            //定义图例的宽高
            var legend_width = 20;
            var legend_height = 210;

            //heatmap与右边文字的间距、图例与右边文字间距
            var space = 10;
            var legend_space = 5;

            //文字最长
            var max_x_textLength = d3.max(heatmap_data, function (d) {
                return d.name.length;
            })
            var max_y_textLength = 0;
            if (setOption.isShowName) {
                max_y_textLength = d3.max(heatmap_data[0].heatmap, function (d) {
                    return d.x.length;
                })
            } else {
                max_y_textLength = space / 8;
            }

            //下边文字高度、右边文字的宽度
            var XtextHeight = max_x_textLength * 8;
            var YtextWidth = max_y_textLength * 8;

            //预留间距
            var margin = { top: 40, bottom: 5, left: 10, right: 40 };

            //定义热图宽高
            var heatmap_width = 600,
                heatmap_height = 600;

            //定义折线宽高
            var cluster_height = heatmap_height,
                cluster_width = 100;
            var topCluster_width = 0,
                topCluster_height = 0;

            if (setOption.isShowTopLine && $scope.isTopCluster) {
                topCluster_width = heatmap_width;
                topCluster_height = 60;
            }

            //svg总宽高
            var totalWidth = margin.left + cluster_width + space + heatmap_width + space + YtextWidth + legend_space + legend_width + margin.right,
                totalHeight = margin.top + topCluster_height + heatmap_height + XtextHeight + margin.bottom;

            //计算单个rect长和宽
            var single_rect_width = heatmap_width / heatmap_data.length;
            var single_rect_height = heatmap_height / heatmap_data[0].heatmap.length;

            //定义渐变颜色
            var colorValue = toolService.sessionStorage.get("colors");
            var colorArr = colorValue.split(",");


            //定义图例比例尺
            var legend_yScale = d3.scaleLinear().range([0, legend_height])
                .domain([valuemin, valuemax]).clamp(true);

            var yAxis = d3.axisRight(legend_yScale).tickSizeOuter(0).ticks(5);  //设置Y轴

            //定义图例位置偏移
            var legendTrans_x = totalWidth - legend_width - margin.right,
                legendTrans_y = (heatmap_height - legend_height) / 2 + margin.top + topCluster_height;

            //定义容器
            var svg = d3.select("#heatmapsample_chartClusterpic svg").attr("width", totalWidth).attr("height", totalHeight);

            var body_g = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var heatmap_g = body_g.append("g").attr("class", "heatmap")
                .attr("transform", "translate(" + (cluster_width + space) + "," + topCluster_height + ")");

            var legend_g = svg.append("g").attr("class", "heatmapLegend")   //定义图例g
                .attr("transform", "translate(" + legendTrans_x + "," + legendTrans_y + ")");

            //画标题
            var title_y = margin.top / 2;
            svg.append("g")
                .attr("class", "heatmapTitle")
                .append("text")
                .attr("transform", "translate(" + (totalWidth / 2) + ", " + title_y + ")")
                .text("差异基因层次聚类图")
                .attr("font-size", "0.8em")
                .attr("text-anchor", "middle")
                .on("click", function () {
                    var textNode = d3.select(this).node();
                    toolService.popPrompt(textNode, textNode.textContent);
                })

            if (setOption.isShowTopLine && $scope.isTopCluster) {
                drawTopCluster();
            }
            drawCluster();
            drawHeatmap(colorArr);
            if (setOption.isShowName) {
                drawYText();
            }
            drawLegend(colorArr);

            //画聚类顶部折线图
            function drawTopCluster() {
                var topCluster = d3.cluster()
                    .size([topCluster_width, topCluster_height])
                    .separation(function () { return 1; });

                var topCluster_g = body_g.append("g").attr("class", "topCluster")
                    .attr("transform", "translate(700,0) rotate(90)");

                //根据数据建立模型
                var root = d3.hierarchy(topCluster_data);
                topCluster(root);

                topCluster_g.selectAll(".topClusterlink")
                    .data(root.links())
                    .enter().append("path")
                    .attr("fill", "none")
                    .attr("stroke-width", 1)
                    .attr("stroke", "#cccccc")
                    .attr("d", elbow);

            }

            //画聚类左边折线图
            function drawCluster() {
                var cluster = d3.cluster()
                    .size([cluster_height, cluster_width])
                    .separation(function () { return 1; });

                var cluster_g = body_g.append("g").attr("class", "cluster")
                    .attr("transform", "translate(0," + topCluster_height + ")");

                //根据数据建立模型
                var root = d3.hierarchy(cluster_data);
                cluster(root);

                cluster_g.selectAll(".heatMaplink")
                    .data(root.links())
                    .enter().append("path")
                    .attr("fill", "none")
                    .attr("stroke-width", 1)
                    .attr("stroke", "#cccccc")
                    .attr("d", elbow);

            }

            function elbow(d, i) {
                return "M" + d.source.y + "," + d.source.x
                    + "V" + d.target.x + "H" + d.target.y;
            }

            //热图交互时所需比例尺
            var xScale = d3.scaleBand()
                .range([0, heatmap_width])
                .domain(heatmap_data.map(function (d) { return d.name; }));

            var yScale = d3.scaleBand()
                .range([0, heatmap_height])
                .domain(heatmap_data[0].heatmap.map(function (d) { return d.x }));

            //画热图
            function drawHeatmap(colors) {
                d3.selectAll(".heatmapRects").remove();
                //颜色比例尺
                var colorScale = d3.scaleLinear().domain([valuemin, (valuemin + valuemax) / 2, valuemax]).range(colors).interpolate(d3.interpolateRgb);
                for (i = 0; i < heatmap_data.length; i++) {
                    var rect_g = heatmap_g.append("g").attr("class", "heatmapRects");
                    //画矩形
                    rect_g.selectAll("rect")
                        .data(heatmap_data[i].heatmap)
                        .enter()
                        .append("rect")
                        .attr("x", i * single_rect_width)
                        .attr("y", function (d, j) { return j * single_rect_height })
                        .attr("width", single_rect_width)
                        .attr("height", single_rect_height)
                        .attr("fill", function (d) { return colorScale(d.y) })

                    //添加x轴的名称
                    rect_g.append("text")
                        .style("font-family", "Consolas, Monaco, monospace")
                        .style("font-size", "0.8em")
                        .text(heatmap_data[i].name)
                        .attr("transform", "translate(" + (i * single_rect_width + single_rect_width / 2) + "," + (heatmap_height + 20) + ") rotate(25)").attr("text-anchor", "start");
                }
            }

            heatmapInteract();

            //热图交互
            function heatmapInteract() {
                //定义热图矩形交互
                var interact_g = heatmap_g.append("g");
                var big_rect = interact_g.append("rect")
                    .attr("width", heatmap_width)
                    .attr("height", heatmap_height)
                    .attr("fill", "transparent");

                var select_rect = interact_g.append("rect")
                    .attr("width", 0)
                    .attr("height", 0)
                    .attr("fill", "#f1f1f1")
                    .style("opacity", 0.4);

                var select_rw = heatmap_width, select_rh = 0;
                var trans_x = 0,
                    trans_y = 0;
                var down_x = 0,
                    down_y = 0;
                var isMousedown = false;
                big_rect.on("mousedown", function (ev) {
                    isMousedown = true;
                    var downEvent = ev || d3.event;

                    //当前down位置
                    down_x = downEvent.offsetX - margin.left - cluster_width - space;
                    down_y = downEvent.offsetY - margin.top - topCluster_height;
                    //当前down索引
                    downIndex = getIndex(down_x, down_y);
                    down_j = downIndex.y_index;
                    clearEventBubble(downEvent);
                })

                big_rect.on("mousemove", function (ev) {
                    var moveEvent = ev || d3.event;
                    var x_dis = moveEvent.offsetX - margin.left - cluster_width - space;
                    var y_dis = moveEvent.offsetY - margin.top - topCluster_height;

                    if (isMousedown) {
                        select_rh = Math.abs(y_dis - down_y);
                        trans_y = d3.min([y_dis, down_y]);
                        select_rect.attr("width", select_rw).attr("height", select_rh).attr("x", trans_x).attr("y", trans_y);
                    } else {
                        //当前move到的rect的索引
                        var index = getIndex(x_dis, y_dis);
                        var i = index.x_index, j = index.y_index;
                        var d = heatmap_data[i].heatmap[j];
                        var tipText = ["sample:" + heatmap_data[i].name, "gene: " + d.x, "value: " + d.y];
                        reportService.GenericTip.Show(d3.event, tipText);
                    }
                    clearEventBubble(moveEvent);
                });

                select_rect.on("mouseup", function (ev) {
                    isMousedown = false;
                    var upEvent = ev || d3.event;
                    //当前up位置
                    var up_x = upEvent.offsetX - margin.left - cluster_width - space;
                    var up_y = upEvent.offsetY - margin.top - topCluster_height;
                    // //down与up在同一位置，则不选中
                    // if (up_x == down_x && up_y == down_y) {
                    //     select_rect.attr("width", 0).attr("height", 0);
                    //     return;
                    // }
                    //当前up索引
                    var upIndex = getIndex(up_x, up_y);
                    var up_j = upIndex.y_index;

                    if (down_j > up_j) {
                        var geneId = resdata.heatmapData[0].heatmap.slice(up_j, down_j + 1);
                    } else {
                        var geneId = resdata.heatmapData[0].heatmap.slice(down_j, up_j + 1);
                    }
                    var resGeneId = [];
                    geneId.forEach(function (val, index) {
                        resGeneId.push(val.x);
                    });
                    $scope.setGeneList(resGeneId);

                    var high_j = d3.min([up_j, down_j]),
                        low_j = d3.max([up_j, down_j]);
                    var highHeight = high_j * single_rect_height;
                    var lowHeight = (low_j + 1) * single_rect_height;

                    select_rh = Math.abs(lowHeight - highHeight);
                    trans_y = d3.min([lowHeight, highHeight]);
                    select_rect.attr("width", select_rw).attr("height", select_rh).attr("x", trans_x).attr("y", trans_y);

                    clearEventBubble(upEvent);
                });

                big_rect.on("mouseup", function () {
                    clearEventBubble(d3.event);
                    select_rect.attr("width", 0).attr("height", 0);
                    isMousedown = false;
                })

                big_rect.on("mouseout", function () {
                    reportService.GenericTip.Hide();
                });

                $("#analysis-heatmapClusterPanel .tab-switch-chart").on("mousedown", function () {
                    select_rect.attr("width", 0).attr("height", 0);
                    isMousedown = false;
                })

                $("#analysis-heatmapClusterPanel .tab-switch-chart").on("mouseup", function () {
                    select_rect.attr("width", 0).attr("height", 0);
                    isMousedown = false;
                })
            }

            //获取heatmap横纵索引
            function getIndex(x, y) {
                var rect_i = 0, rect_j = 0;
                var heatmapData_len = heatmap_data.length;

                for (var i = 0; i < heatmapData_len; i++) {
                    if (i == heatmapData_len - 1) {
                        if (x > xScale(heatmap_data[i].name) && x < heatmap_width) {
                            rect_i = heatmapData_len - 1;
                        }
                    } else {
                        if (x > xScale(heatmap_data[i].name) && x < xScale(heatmap_data[i + 1].name)) {
                            rect_i = i;
                        }
                    }

                    var heatmap = heatmap_data[i].heatmap;
                    var heatmap_len = heatmap.length;

                    for (var j = 0; j < heatmap_len; j++) {
                        if (j == heatmap_len - 1) {
                            if (y > yScale(heatmap[j].x) && y < heatmap_height) {
                                rect_j = heatmap_len - 1;
                            }
                        } else {
                            if (y > yScale(heatmap[j].x) && y < yScale(heatmap[j + 1].x)) {
                                rect_j = j;
                            }
                        }
                    }
                }

                var indexObj = {
                    "x_index": rect_i,
                    "y_index": rect_j
                }
                return indexObj;

            }

            //阻止冒泡
            function clearEventBubble(evt) {
                if (evt.stopPropagation) {
                    evt.stopPropagation();
                } else {
                    evt.cancelBubble = true;
                }

                if (evt.preventDefault) {
                    evt.preventDefault();
                } else {
                    evt.returnValue = false;
                }

            }

            //画热图右边的文字名称
            function drawYText() {
                //添加heatmap的右边名称
                var y_texts = heatmap_g.append("g")
                    .attr("transform", "translate(" + (heatmap_width + space) + ",0)")
                    .selectAll("y_text")
                    .data(heatmap_data[0].heatmap)
                    .enter()
                    .append("text")
                    .style("font-family", "Consolas, Monaco, monospace")
                    .style("font-size", "0.8em")
                    .text(function (d) {
                        return d.x;
                    })
                    .attr("y", function (d, i) {
                        return i * single_rect_height + single_rect_height / 2 + 4;
                    })
            }

            //画图例
            function drawLegend(colors) {
                d3.selectAll(".heatmapLegend defs").remove();
                d3.selectAll(".heatmapLegend rect").remove();
                //线性填充
                var linearGradient = legend_g.append("defs")
                    .append("linearGradient")
                    .attr("id", "heatmapLinear_Color")
                    .attr("x1", "0%")
                    .attr("y1", "0%")
                    .attr("x2", "0%")
                    .attr("y2", "100%");

                for (var i = 0; i < colors.length; i++) {
                    linearGradient.append("stop")
                        .attr("offset", i * 50 + "%")
                        .style("stop-color", colors[i]);
                }

                //画图例矩形
                legend_g.append("rect").attr("width", legend_width).attr("height", legend_height)
                    .attr("fill", "url(#" + linearGradient.attr("id") + ")");
            }

            //点击图例改图颜色
            var legendClickRect_h = legend_height / colorArr.length;
            var legendClick_g = svg.append("g")
                .attr("transform", "translate(" + legendTrans_x + "," + legendTrans_y + ")");
            legendClick_g.selectAll(".legendClick_Rect")
                .data(colorArr)
                .enter()
                .append("rect")
                .attr("width", legend_width)
                .attr("height", legendClickRect_h)
                .attr("y", function (d, i) {
                    return i * legendClickRect_h;
                })
                .attr("fill", "transparent")
                .on("click", function (d, i) {
                    var oEvent = d3.event || event;
                    oEvent.stopPropagation();

                    $scope.colorArr_i = i;
                    $scope.isShowColorPanel = true;
                    $scope.$apply();        //保证页面isShowColorPanel实时更新为true
                });

            //色盘指令回调函数
            $scope.colorChange = function (curColor) {
                colorArr.splice($scope.colorArr_i, 1, curColor);
                toolService.sessionStorage.set("colors", colorArr);
                drawLegend(colorArr);
                drawHeatmap(colorArr);
                heatmapInteract();
            }

            //画图例的轴
            legend_g.append("g").attr("class", "heatmap_Axis")
                .attr("transform", "translate(" + legend_width + ",0)")
                .call(yAxis);

        }


        /* table start */
        // 指定外部调用筛选指令的查询参数集合
        $scope.geneidCustomSearchType = "$in";
        $scope.geneidCustomSearchOne = "";

        // test delete columns/ add columns
        // 改变筛选条件  切换比较组 框选基因  都需要重置 基因列表
        $scope.geneUnselectList = '';
        $scope.isShowGeneListPanel = false;

        // 基因列表 hover
        $scope.handlerMouseEnter = function () {
            $scope.isShowGeneListPanel = true;
        }
        $scope.handlerMouseLeave = function () {
            $scope.isShowGeneListPanel = false;
        }

        // 删除genelist某一项
        $scope.removeGeneItem = function (key) {
            delete $scope.geneUnselectList[key];
            for (var i = 0; i < $scope.GOAnnoData.rows.length; i++) {
                if ($scope.GOAnnoData.rows[i][$scope.geneid_truekey] === key) {
                    $scope.GOAnnoData.rows[i].isChecked = true;
                    $scope.computedTheadStatus();
                    break;
                }
            }
        }

        // 聚类图框选传 获取genelist 重新获取表格数据 渲染筛选条件
        $scope.setGeneList = function (geneList) {
            var searchOne = '';
            // 重置基因列表
            $scope.geneUnselectList = '';
            // 拼接GeneID
            geneList.forEach(function (val, index) {
                if (index === geneList.length - 1) {
                    searchOne += val;
                } else {
                    searchOne += val + '\n';
                }
            });
            // 如果没有点击筛选按钮 就点击
            if (!$('.grid-filter-begin > button').hasClass('active')) {
                $timeout(function () {
                    angular.element($('.grid-filter-begin > button')).triggerHandler('click');
                    $scope.geneidCustomSearchOne = searchOne;
                }, 0);
            } else {
                $scope.geneidCustomSearchOne = searchOne;
            }
            // 重置未选择列表
            $scope.geneUnselectList = {};
            $scope.checkAll();
            $scope.checkedAll = true;
        }

        // thead change event
        $scope.theadChange = function (a) {
            var addThead = [];
            var deleteArr = [];
            $scope.add = [];
            // 当前新增的表头
            a.add.forEach(function (val, index) {
                $scope.add = $scope.add.concat(val.children);
            })
            // 所有新加的表头
            a.all.forEach(function (val, index) {
                addThead = addThead.concat(val.children);
            })
            // 当前删除的表头
            a.delete.forEach(function (val, index) {
                deleteArr = deleteArr.concat(val.children);
            });

            for (var i = 0, len = deleteArr.length; i < len; i++) {
                $scope.goAnnoFindEntity.searchContentList.forEach(function (val, index) {
                    if (val.filterName !== 'LCID') {
                        if (val.filterName === deleteArr[i]) {
                            if (val.isSort) {
                                val.isSort = false;
                                $scope.goAnnoFindEntity.sortName = '';
                                $scope.goAnnoFindEntity.sortnamezh = '';
                                $scope.goAnnoFindEntity.sortType = '';
                            }
                            $scope.goAnnoFindEntity.searchContentList.splice(index, 1);
                        }
                    }


                })
            }

            $scope.goAnnoFindEntity.addThead = addThead;
            $scope.filterText1 = toolService.GetFilterContentText($scope.goAnnoFindEntity);
            $scope.GetGOAnnoList();

        }


        //过滤GO注释表格数据  
        $scope.InitFindEntity1 = function (filterFindEntity) {
            //获得页面查询实体信息
            $scope.goAnnoFindEntity = toolService.GetGridFilterFindEntity($scope.goAnnoFindEntity, filterFindEntity);
            //获得页面查询条件转译信息
            $scope.filterText1 = toolService.GetFilterContentText($scope.goAnnoFindEntity);
            // 重置未选择的GENE
            $scope.geneUnselectList = '';
            //获取基因表达量表
            $scope.GetGOAnnoList(1);
        };

        // 删除页面查询参数
        $scope.deleteFindEntity = function () {
            var filterName = angular.element(event.target).siblings('span').find('em').text();
            $scope.goAnnoFindEntity = toolService.DeleteFilterFindEntity($scope.goAnnoFindEntity, [filterName]);
            $scope.filterText1 = toolService.GetFilterContentText($scope.goAnnoFindEntity);
            $scope.GetGOAnnoList(1);
        }

        //获取注释表数据
        $scope.GetGOAnnoList = function (pageNumber) {
            toolService.gridFilterLoading.open("analysis-heatmapsample-table");
            // toolService.gridFilterLoading.open("analysis-heatmapClusterPanel");
            $scope.goAnnoFindEntity = toolService.SetGridFilterFindEntity($scope.goAnnoFindEntity, "LCID", "string", "equal", toolService.sessionStorage.get("LCID"));

            $scope.goAnnoFindEntity.pageNum = pageNumber;
            $scope.exportLocationGOAnno = options.api.mrnaseq_url + "/table/GetHeatmapTableData";
            var ajaxConfig = {
                data: $scope.goAnnoFindEntity,
                url: $scope.exportLocationGOAnno,
            };

            var promise = ajaxService.GetDeferData(ajaxConfig);
            promise.then(function (responseData) {
                if (responseData.Error) {
                    $scope.goAnnoError = "syserror";
                } else if (responseData.length == 0) {
                    $scope.goAnnoError = "nodata";
                } else {
                    $scope.goAnnoError = "";
                    $scope.GOAnnoData = responseData;
                    $scope.GOAnnoData.thead = [];
                    // 第零个就是geneid
                    $scope.geneid = $scope.GOAnnoData.baseThead[0];
                    $scope.geneid_truekey = $scope.GOAnnoData.baseThead[0].true_key;

                    for (var key in $scope.GOAnnoData.rows[0]) {
                        $scope.GOAnnoData.thead.push(key);
                    }

                    // geneUnSelectList 是否包含回来的新数据
                    var isIn = false;
                    $scope.GOAnnoData.rows.map(function (value, index) {
                        value.isChecked = true;
                        if ($scope.geneUnselectList) {
                            for (var geneid in $scope.geneUnselectList) {
                                if (value[$scope.geneid.true_key] === geneid) {
                                    value.isChecked = false;
                                    isIn = true;
                                }
                            }
                        }
                    });

                    isIn ? $scope.checkedAll = false : $scope.checkedAll = true;
                }
                toolService.gridFilterLoading.close("analysis-heatmapsample-table");
                // toolService.gridFilterLoading.close("analysis-heatmapClusterPanel");
            }, function (errorMesg) {
                toolService.gridFilterLoading.close("analysis-heatmapsample-table");
                // toolService.gridFilterLoading.close("analysis-heatmapClusterPanel");
                $scope.goAnnoError = "syserror";
            });
        };

        // 点击GeneID获取Gene信息
        $scope.showGeneInfo = function (GeneID) {
            var genomeVersion = toolService.sessionStorage.get('GenomeID');
            var geneInfo = {
                genomeVersion: genomeVersion,
                geneID: GeneID
            };
            pageFactory.set(geneInfo);
            toolService.popWindow("cyjyfx_2_pop.html", "基因" + GeneID + "信息", 640, 100, "dialog-default", 50, true, null);
        }

        // delete one filter content
        $scope.handleDelete = function (event) {
            var thead = angular.element(event.target).siblings('span').find('em').text();
            var clearBtn;
            for (var i = 0; i < $('table th .grid_head').length; i++) {
                if ($.trim($('table th .grid_head').eq(i).text()) === thead) {
                    clearBtn = $('table th .grid_head').eq(i).parent().find('.btnPanel').children().last();
                    break;
                }
            }
            $timeout(function () {
                clearBtn.triggerHandler("click");
            }, 0)
        }

        // 清空 未选中的基因集
        $scope.handlerClearUnselect = function () {
            $scope.geneUnselectList = {};
            $scope.GOAnnoData.rows.forEach(function (val, index) {
                val.isChecked = true;
            });
            $scope.checkedAll = true;
        }
        // table 选中事件
        // 全选事件
        $scope.checkAll = function () {
            $scope.GOAnnoData.rows.forEach(function (val, index) {
                val.isChecked = true;
            });
        }

        // 全不选事件
        $scope.unCheckAll = function () {
            angular.forEach($scope.GOAnnoData.rows, function (val, index) {
                val.isChecked = false;
            });
        }

        // 全选点击事件
        $scope.handlerCheckedAll = function () {
            $scope.checkedAll = !$scope.checkedAll;
            $scope.checkedAll ? $scope.checkAll() : $scope.unCheckAll();
            // 全选取消geneUnselectList里的项
            if ($scope.geneUnselectList === '') $scope.geneUnselectList = {};
            if ($scope.checkedAll) {
                for (var i = 0; i < $scope.GOAnnoData.rows.length; i++) {
                    if ($scope.geneUnselectList[$scope.GOAnnoData.rows[i][$scope.geneid['true_key']]]) {
                        delete $scope.geneUnselectList[$scope.GOAnnoData.rows[i][$scope.geneid['true_key']]];
                    }
                }
            } else {
                // 全不选
                for (var j = 0; j < $scope.GOAnnoData.rows.length; j++) {
                    $scope.geneUnselectList[$scope.GOAnnoData.rows[j][$scope.geneid['true_key']]] = $scope.GOAnnoData.rows[j][$scope.geneid['true_key']];
                }
            }

        }

        // 每一行点击选择
        $scope.handlerChecked = function (index, event) {
            $scope.GOAnnoData.rows[index].isChecked = !$scope.GOAnnoData.rows[index].isChecked;
            $scope.computedTheadStatus();
            // 如果没选中
            if ($scope.geneUnselectList === '') $scope.geneUnselectList = {};
            if (!$scope.GOAnnoData.rows[index].isChecked) {
                $scope.geneUnselectList[$scope.GOAnnoData.rows[index][$scope.geneid['true_key']]] = $scope.GOAnnoData.rows[index][$scope.geneid['true_key']];
                // animation
                var $targetOffset = $("#unselect").offset();
                var x1 = event.pageX;
                var y1 = event.pageY;
                var x2 = $targetOffset.left + 110;
                var y2 = $targetOffset.top + 15;
                reportService.flyDiv("<span class='glyphicon glyphicon-plus mkcheck flyCheck'></span>", x1, y1, x2, y2);
            } else {
                // 如果是选中 就从geneUnselectList里删除
                delete $scope.geneUnselectList[$scope.GOAnnoData.rows[index][$scope.geneid['true_key']]];
            }
        }

        // 判断是否全部选中或者全部没选中 联动表头
        $scope.computedTheadStatus = function () {
            var length = $scope.GOAnnoData.rows.length;
            var checkCount = 0;
            var unCheckCount = 0;

            $scope.GOAnnoData.rows.forEach(function (val, index) {
                val.isChecked ? checkCount++ : unCheckCount++;
            });

            // 全选  全部选  一半一半
            if (checkCount === length) {
                $scope.checkedAll = true;
            } else if (unCheckCount === length) {
                $scope.checkedAll = false;
            } else {
                $scope.checkedAll = false;
            }
        }

        // 筛选状态改变
        $scope.handlerFilterStatusChange = function (status) {
            $scope.isBeginFilter = status;
            if (!$scope.isBeginFilter) {
                $scope.geneidCustomSearchOne = '';
            }
        }


        //get links 
        $scope.linksError = false;
        $scope.GetLinks = function () {
            console.log($scope.id);
            var promise = ajaxService.GetDeferData({
                data: {},
                url: options.api.java_url + "/analysis/parent/" + $scope.id
            })
            promise.then(function (res) {
                if (res.status != 200) {
                    $scope.linksError = "syserror";
                } else {
                    $scope.linksError = false;
                    $scope.links = res.data.links;
                }
            }, function (err) {
                console.log(err);
            })
        }

        // 查看links
        $scope.handlerSeeClick = function (item) {
            var type = item.chartType || item.charType;
            if (item.process == 0) {
                $window.open('../tools/index.html#/home/error/' + item.id);
            } else {
                // success
                $window.open('../tools/index.html#/home/' + type + '/' + item.id + '/' + item.projectName);
            }
        }

        // 重分析服务回调
        $scope.reanalysisError = false;
        $scope.handlerReanalysis = function (params) {
            // params {'type': type, 'check': checkedItems,'chartType':chartType }
            $scope.reAnalysisEntity = { entity: '' };
            $scope.reAnalysisEntity.entity = angular.copy($scope.goAnnoFindEntity);
            $scope.reAnalysisEntity.geneUnselectList = [];
            $scope.reAnalysisEntity.url = angular.copy(options.api.mrnaseq_url + "/table/GetHeatmapTableData").split('mrna')[1];
            // $scope.reAnalysisEntity.allThead = [];

            if (params.chartType === 'heatmap') {
                $scope.reAnalysisEntity.chartType = params.type === 'group' ? 'heatmapGroup' : 'heatmapSample';
            } else {
                $scope.reAnalysisEntity.chartType = params.chartType;
            }

            $scope.reAnalysisEntity.chooseType = params.type;
            $scope.reAnalysisEntity.chooseList = angular.copy(params.check);

            for (var key in $scope.geneUnselectList) {
                $scope.reAnalysisEntity.geneUnselectList.push(key);
            }

            // 不要allThead 2018年6月6日10:46:06
            // $scope.bigTableData.baseThead.forEach(function (val, index) {
            //     $scope.reAnalysisEntity.allThead.push(val.true_key);
            // });

            var promise = ajaxService.GetDeferData({
                data: $scope.reAnalysisEntity,
                url: options.api.mrnaseq_url + "/analysis/ReAnalysis"
            })
            toolService.pageLoading.open('正在提交重分析申请，请稍后...');
            promise.then(function (res) {
                toolService.pageLoading.close();
                if (res.Error) {
                    $scope.reanalysisError = "syserror";
                    toolService.popMesgWindow(res.Error);
                } else {
                    $scope.reanalysisError = false;
                    $scope.$emit('openAnalysisPop');
                    $rootScope.GetAnalysisList(1);
                    toolService.popMesgWindow('重分析提交成功');
                    // if (res.isAnalysis) {
                    // 打开我的分析面板
                    $scope.$emit('openAnalysisPop');
                    // } else {
                    //     // 跳到详情页
                    //     var type = $scope.reAnalysisEntity.chartType;
                    //     var url = '../tools/index.html#/home/' + type + '/' + res.id;
                    //     $window.open(url);
                    // }
                }
            }, function (err) {
                toolService.popMesgWindow(err);
            })
        }


        // watch geneUnselectList 生成length
        $scope.geneUnselectListLength = 0;
        $scope.$watch('geneUnselectList', function (newVal, oldVal) {
            if (newVal != oldVal) {
                $scope.geneUnselectListLength = 0;
                if (newVal) {
                    for (var name in $scope.geneUnselectList) {
                        $scope.geneUnselectListLength++;
                    }
                }
            }
        }, true)

    };
});
