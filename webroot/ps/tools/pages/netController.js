define(['toolsApp'], function(toolsApp) {
    toolsApp.controller('netController', netController);
    netController.$inject = ["$rootScope", "$scope", "$log", "$state", "$timeout", "$window", "$compile", "ajaxService", "toolService", "svgService", "reportService"];

    function netController($rootScope, $scope, $log, $state, $timeout, $window, $compile, ajaxService, toolService, svgService, reportService) {
        toolService.pageLoading.open();
        $scope.InitPage = function() {
            $timeout(function() {
                toolService.pageLoading.close();
            }, 300)
            $scope.id = $state.params.id;
            $scope.title = '蛋白网络图 ( ID：' + $scope.id + " ) ";
            $scope.isShowSetPanel = false;

            // 默认force
            $scope.forceValue = 30;

            //net图配置
            $scope.myOptions = {
                id: "reAnalysis_net_panel_svg",
                width: 1000,
                height: 600,
                isMultiChoose: false, //是否多选状态
                colorArr: ["#0000ff", "#ff0000"],
                node_r_min: 3,
                node_r_max: 10,
                link_width_min: 1,
                link_width_max: 5,
                force: $scope.forceValue,
            }

            $scope.netEntity = {
                "LCID": toolService.sessionStorage.get('LCID'),
                "id": $scope.id,
                "score": 300
            }


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

            $scope.url = options.api.mrnaseq_url + '/Tools/PPIGeneIDTable';
            $scope.panelId = "div_reAnalysis_net_geneid";
            $scope.tableId = "reAnalysis_net_geneid_table";
            $scope.unselectId = "reAnalysis_net_unselectid";
            $scope.filename = "蛋白网络互作表";
            $scope.geneList = '';
            $scope.geneListChangeFlag = false;
            $scope.isResetTheadControl = null;
            $scope.isResetTableStatus = null;
            $scope.theadControlId = 'reAnalysis_net_theadcontrol';
            $scope.isShowTheadControl = true;
            $scope.reanalysisId = $scope.id;
            $scope.isReanalysis = true;
            // Geneid table end
            // 多选选中的基因数
            $scope.multiCount = {};
            $scope.GetNetData();
            $scope.GetTableData();

            $scope.GetLinks();
        }

        //获取net图的切换表格数据
        $scope.GetTableData = function() {
            toolService.gridFilterLoading.open("panel_reAnalysis_net");
            $scope.exportLocationTable = options.api.mrnaseq_url + "/Tools/PPIGeneralTable";
            var ajaxConfig = {
                data: $scope.netEntity,
                url: $scope.exportLocationTable
            };
            var promise = ajaxService.GetDeferData(ajaxConfig);
            promise.then(function(responseData) {
                    if (responseData.Error) {
                        //系统异常
                        $scope.tableError = "syserror";
                    } else if (responseData.length == 0) {
                        //无数据异常
                        $scope.tableError = "nodata";
                        $scope.imgError = "nodata";
                    } else {
                        //正常
                        $scope.tableError = "";
                        $scope.tableData = responseData;
                    }
                    toolService.gridFilterLoading.close("panel_reAnalysis_net");
                },
                function(errorMesg) {
                    $scope.tableError = "syserror";
                    toolService.gridFilterLoading.close("panel_reAnalysis_net");
                });
        }

        //获取net图数据
        $scope.GetNetData = function() {
            toolService.gridFilterLoading.open("panel_reAnalysis_net");
            var ajaxConfig = {
                data: $scope.netEntity,
                url: options.api.mrnaseq_url + "/net/GetNetData"
            };
            var promise = ajaxService.GetDeferData(ajaxConfig);
            promise.then(function(responseData) {
                    if (responseData.Error) {
                        //系统异常
                        $scope.error = "syserror";
                    } else if (responseData.length == 0) {
                        //无数据异常
                        $scope.error = "nodata";
                    } else {
                        //正常
                        $scope.error = "";
                        $scope.netData = responseData;
                        $scope.netDataInit = angular.copy(responseData)
                        $scope.drawNet(responseData, $scope.forceValue);

                    }
                    toolService.gridFilterLoading.close("panel_reAnalysis_net");
                },
                function(errorMesg) {
                    $scope.error = "syserror";
                    toolService.gridFilterLoading.close("panel_reAnalysis_net");
                });
        }

        //设置回调
        $scope.getSetOption = function(val) {
            $scope.forceValue = val;
            $scope.netData = angular.copy($scope.netDataInit);
            $scope.drawNet($scope.netData, val);
            $scope.changeFlag($scope.myOptions);
            $scope.changeFlag($scope.myOptions);
        }

        // 画net图
        $scope.drawNet = function(data, setforce) {
            var core_gene = "";

            $scope.myOptions.force = setforce;

            drawNetChart(data, $scope.myOptions)

            //获取当前选中基因列表
            $scope.getChooseGeneList = function(networkData) {
                var tempArray = [];
                for (var i = 0; i < networkData.nodes.length; i++) {
                    if (networkData.nodes[i].isNodeSelected) {
                        tempArray.push(networkData.nodes[i].id)
                    }
                }

                $scope.geneList = angular.copy(tempArray);
                $scope.geneListChangeFlag = true;
            }

            $scope.changeFlag = function(options) {
                options.isMultiChoose = !options.isMultiChoose;
                core_gene = "";
                d3.select("#" + options.id).selectAll(".node").each(function(d) {
                    d.isNodeSelected = false;
                    d3.select(this)
                        .attr('stroke-width', 0)
                })

                $scope.multiCount = {};

                if (!options.isMultiChoose) {
                    releaseMultiChoose()
                    noMultiChooseZoom()
                } else {
                    releaseZoom()
                    isMultiChoosePick()
                }

                //zoom
                function noMultiChooseZoom() {
                    var transform = d3.zoomIdentity;;
                    d3.select("#" + options.id).call(
                            d3.zoom()
                            .scaleExtent([0.1, 8])
                            .on("zoom", zoomed))
                        .on("dblclick.zoom", null);

                    function zoomed() {
                        d3.select('.main_group').attr("transform", d3.event.transform);
                    }
                }


                //多选
                function isMultiChoosePick() {
                    var isMouseDown = "false";
                    var isMouseMove = "false";
                    var startLoc = [];
                    var endLoc = [];


                    d3.select("#" + options.id).on("mousedown", function() {
                        isMouseDown = "true";

                        d3.select('#squareSelect').attr("transform", "translate(" + d3.event.offsetX + "," + d3.event.offsetY + ")");
                        startLoc = [d3.event.offsetX, d3.event.offsetY];
                    });

                    d3.select("#" + options.id).on("mousemove", function() {
                        if (isMouseDown == "true") {
                            isMouseMove = "true";

                            var width = d3.event.offsetX - startLoc[0];
                            var height = d3.event.offsetY - startLoc[1];
                            if (width < 0) {
                                d3.select('#squareSelect').attr("transform", "translate(" + d3.event.offsetX + "," + startLoc[1] + ")");
                            }
                            if (height < 0) {
                                d3.select('#squareSelect').attr("transform", "translate(" + startLoc[0] + "," + d3.event.offsetY + ")");
                            }
                            if (height < 0 && width < 0) {
                                d3.select('#squareSelect').attr("transform", "translate(" + d3.event.offsetX + "," + d3.event.offsetY + ")");
                            }
                            d3.select('#squareSelect').attr("width", Math.abs(width)).attr("height", Math.abs(height))
                        }

                    })

                    d3.select("#" + options.id).on("mouseup", function() {
                        if (isMouseDown == "true" && isMouseMove == "true") {
                            isMouseDown = "false";
                            isMouseMove = "false";

                            endLoc = [d3.event.offsetX, d3.event.offsetY];
                            var leftTop = [];
                            var rightBottom = []
                            if (endLoc[0] >= startLoc[0]) {
                                leftTop[0] = startLoc[0];
                                rightBottom[0] = endLoc[0];
                            } else {
                                leftTop[0] = endLoc[0];
                                rightBottom[0] = startLoc[0];
                            }

                            if (endLoc[1] >= startLoc[1]) {
                                leftTop[1] = startLoc[1];
                                rightBottom[1] = endLoc[1];
                            } else {
                                leftTop[1] = endLoc[1];
                                rightBottom[1] = startLoc[1];
                            }

                            // {scale,x,y}
                            var currentTransJson = getTranslation(d3.select(".main_group").attr("transform"))

                            d3.select("#" + options.id).selectAll(".node").each(function(d) {
                                var tempX = d.x * currentTransJson.scale + currentTransJson.transX;
                                var tempY = d.y * currentTransJson.scale + currentTransJson.transY;
                                if (tempX < rightBottom[0] && tempX > leftTop[0] && tempY > leftTop[1] && tempY < rightBottom[1]) {
                                    d.isNodeSelected = true;
                                    $scope.multiCount[d.id] = 1;
                                }

                                d3.select(this)
                                    .attr('stroke-width', function(d) {
                                        if (d.isNodeSelected == true) {
                                            return 1
                                        }
                                        return 0
                                    })

                            })

                            d3.select('#squareSelect').attr("width", 0).attr("height", 0);

                        } else {
                            isMouseDown = "false";
                            isMouseMove = "false";
                            $scope.multiCount = {};
                            d3.select("#" + options.id).selectAll(".node").each(function(d) {
                                d.isNodeSelected = false;
                                d3.select(this)
                                    .attr('stroke-width', function(d) {
                                        if (d.isNodeSelected == true) {
                                            return 1
                                        }
                                        return 0
                                    })
                            })


                        }

                        //转化transform属性 返回{scale,transX,transY}
                        function getTranslation(transform) {
                            var transJson = {};
                            if (!transform) {
                                transJson.scale = 1;
                                transJson.transX = 0;
                                transJson.transY = 0;
                            } else {
                                var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
                                g.setAttributeNS(null, "transform", transform);
                                var matrix = g.transform.baseVal.consolidate().matrix;
                                transJson.scale = matrix.a;
                                transJson.transX = matrix.e;
                                transJson.transY = matrix.f;
                            }
                            return transJson

                        }

                    })

                    d3.select("#" + options.id).on("mouseleave", function() {
                        isMouseDown = "false";
                        isMouseMove = "false";
                        d3.select('#squareSelect').attr("width", 0).attr("height", 0);
                    })

                }


                //解绑zoom
                function releaseZoom() {
                    d3.select("#" + options.id).on("mousedown.zoom", null);
                    d3.select("#" + options.id).on("mousemove.zoom", null);
                    d3.select("#" + options.id).on("mouseup.zoom", null);
                    d3.select("#" + options.id).on("mouseleave.zoom", null);
                    d3.select("#" + options.id).on("click", null);
                }
                //解绑多选时状态事件
                function releaseMultiChoose() {
                    d3.select("#" + options.id).on("mousedown", null);
                    d3.select("#" + options.id).on("mousemove", null);
                    d3.select("#" + options.id).on("mouseup", null);
                    d3.select("#" + options.id).on("mouseleave", null);
                    d3.select("#" + options.id).on("click", function() {
                        d3.select("#" + options.id).selectAll(".node").each(function(d) {
                            d.isNodeSelected = false;
                            d3.select(this)
                                .attr('stroke-width', function(d) {
                                    if (d.isNodeSelected == true) {
                                        return 1
                                    }
                                    return 0
                                })
                        })
                    })
                }
            }

            //画图
            function drawNetChart(networkData, options) {
                $("#" + options.id).html('');
                var height = options.height || 800,
                    width = options.width || 800

                var svg_main = d3.select("#" + options.id)
                    .attr('height', height)
                    .attr('width', width)
                    .append('g').attr('class', 'main_group')

                //node连接数,决定node的大小、颜色
                for (var i = 0; i < networkData.nodes.length; i++) {
                    var count = 0;
                    for (var j = 0; j < networkData.links.length; j++) {
                        if (networkData.nodes[i].id === networkData.links[j].source || networkData.nodes[i].id === networkData.links[j].target) {
                            count++;
                        }
                    }
                    networkData.nodes[i].value = count;
                }

                var colorArr = options.colorArr;

                var maxValue = d3.max(networkData.nodes, function(d) {
                    return d.value;
                })

                //定义比例尺
                //node
                var colorScale = d3.scaleLinear().domain([0, maxValue]).range(colorArr).interpolate(d3.interpolateRgb),
                    nodeRScale = d3.scaleLinear().domain([0, maxValue]).range([options.node_r_min, options.node_r_max]).clamp(true);
                //link
                var linkWidthScale = d3.scaleLinear().domain([150, 1000]).range(["#cccccc", "#000000"]).clamp(true);

                //生成力导图模型
                var simulation = d3.forceSimulation()
                    .force("link", d3.forceLink().iterations(4).id(function(d) {
                        return d.id;
                    }))
                    .force("charge", d3.forceManyBody().strength(-options.force || -20))
                    .force("center", d3.forceCenter(width / 2, height / 2))
                    .force("x", d3.forceX())
                    .force("y", d3.forceY());

                //生成线link
                var link = svg_main.append('g')
                    .attr('class', 'g_links')
                    .selectAll('line')
                    .data(networkData.links)
                    .enter()
                    .append('line')
                    .attr('stroke-width', 1)
                    .attr('stroke', function(d) {
                        return linkWidthScale(d.score);
                    })

                //生成节点node
                var node = svg_main.append('g')
                    .attr('class', 'g_nodes')
                    .selectAll('circle')
                    .data(networkData.nodes)
                    .enter()
                    .append('circle').attr("class", "node")
                    .attr('r', function(d) {
                        return nodeRScale(d.value);
                    })
                    .attr('fill', function(d) {
                        return colorScale(d.value);
                    })
                    .attr('stroke', "#000")
                    .attr('stroke-width', 0)
                    .on("mouseover", function(d) {
                        var tipText = [];
                        if (d.gene_symbol) {
                            tipText = ["Gene ID：" + d.gene_id, "Symbol/Other Gene ID：" + d.gene_symbol, "PPI Protein ID：" + d.ppi_protein_cluster1];
                        } else {
                            tipText = ["Gene ID：" + d.gene_id, "PPI Protein ID：" + d.ppi_protein_cluster1];
                        }
                        reportService.GenericTip.Show(d3.event, tipText);
                    })
                    .on("mouseout", function() {
                        reportService.GenericTip.Hide();
                    })
                    .on("click", function(d) {
                        d.isNodeSelected = true;
                        //遍历links 获取相邻ID的数组
                        var tempNodeArray = [];
                        tempNodeArray.push(d.id);
                        for (var i = 0; i < networkData.links.length; i++) {
                            if (d.id === networkData.links[i].source.id) {
                                tempNodeArray.push(networkData.links[i].target.id)
                            }
                            if (d.id === networkData.links[i].target.id) {
                                tempNodeArray.push(networkData.links[i].source.id)
                            }
                        }
                        //根据单选、多选状态 进行不同的处理
                        if (!options.isMultiChoose) {
                            $scope.multiCount = {};
                            core_gene = d.id;
                            //遍历node，清除其余目标node，
                            d3.select("#" + options.id).selectAll(".node").each(function(d) {
                                if (tempNodeArray.indexOf(d.id) != -1) {
                                    d.isNodeSelected = true;
                                    $scope.multiCount[d.id] = 1;
                                } else {
                                    d.isNodeSelected = false;
                                }
                                d3.select(this)
                                    .attr('stroke-width', function(d) {
                                        if (d.isNodeSelected == true) {
                                            return 1
                                        }
                                        return 0
                                    })
                            })
                            $scope.getChooseGeneList(networkData);
                        } else {
                            //遍历node，但是不清除其余目标node，
                            d3.select("#" + options.id).selectAll(".node").each(function(d) {
                                if (tempNodeArray.indexOf(d.id) > 0) {
                                    d.isNodeSelected = true;
                                }
                                d3.select(this)
                                    .attr('stroke-width', function(d) {
                                        if (d.isNodeSelected == true) {
                                            $scope.multiCount[d.id] = 1;
                                            return 1
                                        }
                                        return 0
                                    })
                            })

                        }
                        event.stopPropagation();
                    })
                    .call(d3.drag()
                        .on("start", dragstarted)
                        .on("drag", dragged)
                        .on("end", dragended));

                simulation
                    .nodes(networkData.nodes)
                    .on("tick", ticked)
                simulation.force("link")
                    .links(networkData.links)


                function ticked() {
                    node
                        .attr("cx", function(d) {
                            return d.x;
                        })
                        .attr("cy", function(d) {
                            return d.y;
                        });
                    link
                        .attr("x1", function(d) {
                            return d.source.x;
                        })
                        .attr("y1", function(d) {
                            return d.source.y;
                        })
                        .attr("x2", function(d) {
                            return d.target.x;
                        })
                        .attr("y2", function(d) {
                            return d.target.y;
                        });
                }

                function dragstarted(d) {
                    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                }

                function dragged(d) {
                    d.fx = d3.event.x;
                    d.fy = d3.event.y;
                }

                function dragended(d) {
                    if (!d3.event.active) simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                }

                var rect = d3.select("#" + options.id).append("rect")
                    .attr("width", 0)
                    .attr("height", 0)
                    .attr("fill", "rgba(33,20,50,0.3)")
                    .attr("stroke", "#ccc")
                    .attr("stroke-width", "1px")
                    .attr("transform", "translate(0,0)")
                    .attr("id", "squareSelect");

                noMultiChooseZoom();

                //zoom
                function noMultiChooseZoom() {
                    var transform = d3.zoomIdentity;;
                    d3.select("#" + options.id).call(
                            d3.zoom()
                            .scaleExtent([0.1, 8])
                            .on("zoom", zoomed))
                        .on("dblclick.zoom", null);

                    function zoomed() {
                        svg_main.attr("transform", d3.event.transform);
                    }
                }

            }
        }

        // genera count
        $scope.geneCount = 0;
        $scope.$watch('multiCount', function(newVal, oldVal) {
            if (newVal != oldVal) {
                $scope.geneCount = 0;
                if (!$.isEmptyObject(newVal)) {
                    for (var name in $scope.multiCount) {
                        $scope.geneCount++;
                    }
                }
            }
        }, true)

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