define(['toolsApp'], function (toolsApp) {
    toolsApp.controller('heatmapController', heatmapController);
    heatmapController.$inject = ["$rootScope", "$scope", "$log", "$state", "$timeout", "$window", "$compile", "ajaxService", "toolService", "svgService", "reportService"];
    function heatmapController($rootScope, $scope, $log, $state, $timeout, $window, $compile, ajaxService, toolService, svgService, reportService) {

        toolService.pageLoading.open();
        $scope.InitPage = function () {
            //定时关闭等待框
            setTimeout(
                function () {
                    toolService.pageLoading.close();
                }, 300);

            $scope.isShowColorPanel = false;
            $scope.isShowSetPanel = false;
            $scope.isRefresh = false;

            $scope.clusterEntity = {
                "LCID": toolService.sessionStorage.get("LCID"),
                "id": "",
                "compareGroup": ""
            }

            $scope.groupList = ["gruop11111111111111", "gruop11111111111122", "gruop3333333311111111"];

            // 默认
            $scope.clusterEntity.compareGroup = $scope.groupList[0];

            var colorArr = ["#bac5fd", "#ef9794", "#91d691"];
            toolService.sessionStorage.set('colors', colorArr);

            /* table params */
            $scope.data = [
                {
                    groupName: "样本表达量", list: [
                        { name: "sampleA1", children: ["sampleA1"] },
                        { name: "sampleA2", children: ["sampleA2"] },
                        { name: "sampleA3", children: ["sampleA3"] },
                        { name: "sampleA4", children: ["sampleA4"] },
                        { name: "sampleA5", children: ["sampleA5"] },
                        { name: "sampleA6", children: ["sampleA6"] },
                        { name: "sampleA7", children: ["sampleA7"] },
                        { name: "sampleA8", children: ["sampleA8"] },
                        { name: "sampleA9", children: ["sampleA9"] },
                        { name: "sampleA10", children: ["sampleA10"] }
                    ]
                },
                {
                    groupName: "组间差异", list: [
                        { name: "sampleA1", children: ["sampleA1"] },
                        { name: "sampleA2", children: ["sampleA2"] },
                        { name: "sampleA3", children: ["sampleA3"] }
                    ]
                },
                {
                    groupName: "比对注释", list: [
                        { name: "A", children: ["A"] },
                        { name: "B", children: ["B"] },
                        { name: "C", children: ["C"] },
                        { name: "D", children: ["D"] }
                    ]
                },
                {
                    groupName: "其他", list: [
                        { name: "其他", children: ["null"] }
                    ]
                }
            ]

            $scope.goAnnoFindEntity = {
                "LCID": toolService.sessionStorage.get("LCID"),
                "pageSize": 10,
                "pageNum": 1,
                "searchContentList": [],
                "sortName": "",
                "sortType": "",
                "CompareGroup": "",
                "geneList": [],     // 聚类图选中的geneList
                "thead": [],          // 增删列
            };
            $scope.accuracy = 2;
            $scope.GetCompareGroupList();
            $scope.GetHeatmapData();
        };

        $scope.GetHeatmapData = function (flag) {
            $scope.isShowSetPanel = false;

            // toolService.gridFilterLoading.open("heatmapClusterPanel");
            // var ajaxConfig = {
            //     data: $scope.clusterEntity,
            //     url: options.api.mrnaseq_url + "/clusterHeatmap/GetClusterHeatmapData"
            // }
            // var promise = ajaxService.GetDeferData(ajaxConfig);
            // promise.then(function (res) {
            //     if (res.result) {
            //         $scope.clusterError = "syserror";
            //     } else if (res.heatmapData.length == 0) {
            //         $scope.clusterError = "nodata";
            //     } else {
            // $scope.clusterError="";
            //         $scope.setOption = {
            //             isShowName: false,
            //             isShowTopLine: true,
            //             sortNames: data.heatmapData
            //         }

            //         $scope.drawClusterHeatmap(data, $scope.setOption);

            //         if (flag && flag === 'refresh') {
            //             $scope.isRefresh = true;
            //             $timeout(function () {
            //                 $scope.isRefresh = false;
            //             }, 30)
            //         }

            //         $scope.chartData = data;
            //     }
            // })

            var data = {
                "maxValue": 2,
                "minValue": 0,
                "topClusterData": { "name": "TN3", "children": [{ "name": "SRR1370915" }, { "name": "TN2", "children": [{ "name": "SRR1370913" }, { "name": "TN1", "children": [{ "name": "SRR1370914" }, { "name": "SRR1370920" }] }] }] },
                "leftClusterData":
                    {
                        "name": "TN3637",
                        "children": [
                            {
                                "name": "TN3637",
                                "children": [
                                    {
                                        "name": "TN3629",
                                        "children": [
                                            {
                                                "name": "TN3613",
                                                "children": [
                                                    {
                                                        "name": "AT2G09340"
                                                    },
                                                    {
                                                        "name": "TN3583",
                                                        "children": [
                                                            {
                                                                "name": "TN3532",
                                                                "children": [
                                                                    {
                                                                        "name": "AT5G08840"
                                                                    },
                                                                    {
                                                                        "name": "AT2G13555"
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "name": "TN3533",
                                                                "children": [
                                                                    {
                                                                        "name": "AT5G22505"
                                                                    },
                                                                    {
                                                                        "name": "AT3G47348"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "name": "TN3614",
                                                "children": [
                                                    {
                                                        "name": "TN3584",
                                                        "children": [
                                                            {
                                                                "name": "AT1G06083"
                                                            },
                                                            {
                                                                "name": "AT3G02275"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "name": "TN3585",
                                                        "children": [
                                                            {
                                                                "name": "TN3534",
                                                                "children": [
                                                                    {
                                                                        "name": "AT4G09985"
                                                                    },
                                                                    {
                                                                        "name": "TN3442",
                                                                        "children": [
                                                                            {
                                                                                "name": "AT1G02710"
                                                                            },
                                                                            {
                                                                                "name": "AT4G05015"
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "name": "TN3535",
                                                                "children": [
                                                                    {
                                                                        "name": "AT3G08515"
                                                                    },
                                                                    {
                                                                        "name": "TN3443",
                                                                        "children": [
                                                                            {
                                                                                "name": "AT5G03460"
                                                                            },
                                                                            {
                                                                                "name": "AT1G07901"
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "name": "TN3630",
                                        "children": [
                                            {
                                                "name": "TN3615",
                                                "children": [
                                                    {
                                                        "name": "TN3586",
                                                        "children": [
                                                            {
                                                                "name": "TN3536",
                                                                "children": [
                                                                    {
                                                                        "name": "TN3444",
                                                                        "children": [
                                                                            {
                                                                                "name": "AT3G08365"
                                                                            },
                                                                            {
                                                                                "name": "TN3297",
                                                                                "children": [
                                                                                    {
                                                                                        "name": "AT2G09495"
                                                                                    },
                                                                                    {
                                                                                        "name": "TN3065",
                                                                                        "children": [
                                                                                            {
                                                                                                "name": "AT1G03550"
                                                                                            },
                                                                                            {
                                                                                                "name": "AT3G10185"
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                ]
                                                                            }
                                                                        ]
                                                                    },
                                                                    {
                                                                        "name": "TN3445",
                                                                        "children": [
                                                                            {
                                                                                "name": "TN3298",
                                                                                "children": [
                                                                                    {
                                                                                        "name": "AT4G22463"
                                                                                    },
                                                                                    {
                                                                                        "name": "TN3066",
                                                                                        "children": [
                                                                                            {
                                                                                                "name": "AT2G20390"
                                                                                            },
                                                                                            {
                                                                                                "name": "AT1G14205"
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                ]
                                                                            },
                                                                            {
                                                                                "name": "TN3299",
                                                                                "children": [
                                                                                    {
                                                                                        "name": "TN3067",
                                                                                        "children": [
                                                                                            {
                                                                                                "name": "AT2G18970"
                                                                                            },
                                                                                            {
                                                                                                "name": "TN2706",
                                                                                                "children": [
                                                                                                    {
                                                                                                        "name": "AT1G70690"
                                                                                                    },
                                                                                                    {
                                                                                                        "name": "AT4G09490"
                                                                                                    }
                                                                                                ]
                                                                                            }
                                                                                        ]
                                                                                    },
                                                                                    {
                                                                                        "name": "TN3068",
                                                                                        "children": [
                                                                                            {
                                                                                                "name": "AT1G08567"
                                                                                            },
                                                                                            {
                                                                                                "name": "TN2707",
                                                                                                "children": [
                                                                                                    {
                                                                                                        "name": "AT4G38860"
                                                                                                    },
                                                                                                    {
                                                                                                        "name": "AT3G02935"
                                                                                                    }
                                                                                                ]
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                ]
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "name": "TN3537",
                                                                "children": [
                                                                    {
                                                                        "name": "TN3446",
                                                                        "children": [
                                                                            {
                                                                                "name": "TN3300",
                                                                                "children": [
                                                                                    {
                                                                                        "name": "AT2G22088"
                                                                                    },
                                                                                    {
                                                                                        "name": "AT1G04105"
                                                                                    }
                                                                                ]
                                                                            },
                                                                            {
                                                                                "name": "TN3301",
                                                                                "children": [
                                                                                    {
                                                                                        "name": "AT2G42110"
                                                                                    },
                                                                                    {
                                                                                        "name": "TN3069",
                                                                                        "children": [
                                                                                            {
                                                                                                "name": "AT3G63420"
                                                                                            },
                                                                                            {
                                                                                                "name": "TN2708",
                                                                                                "children": [
                                                                                                    {
                                                                                                        "name": "AT4G01026"
                                                                                                    },
                                                                                                    {
                                                                                                        "name": "AT1G24600"
                                                                                                    }
                                                                                                ]
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                ]
                                                                            }
                                                                        ]
                                                                    },
                                                                    {
                                                                        "name": "TN3447",
                                                                        "children": [
                                                                            {
                                                                                "name": "TN3302",
                                                                                "children": [
                                                                                    {
                                                                                        "name": "AT1G77540"
                                                                                    },
                                                                                    {
                                                                                        "name": "TN3070",
                                                                                        "children": [
                                                                                            {
                                                                                                "name": "AT3G50210"
                                                                                            },
                                                                                            {
                                                                                                "name": "AT3G23325"
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                ]
                                                                            },
                                                                            {
                                                                                "name": "TN3303",
                                                                                "children": [
                                                                                    {
                                                                                        "name": "TN3071",
                                                                                        "children": [
                                                                                            {
                                                                                                "name": "AT1G02180"
                                                                                            },
                                                                                            {
                                                                                                "name": "AT1G22270"
                                                                                            }
                                                                                        ]
                                                                                    },
                                                                                    {
                                                                                        "name": "TN3072",
                                                                                        "children": [
                                                                                            {
                                                                                                "name": "AT4G19045"
                                                                                            },
                                                                                            {
                                                                                                "name": "AT2G41312"
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                ]
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "name": "TN3587",
                                                        "children": [
                                                            {
                                                                "name": "TN3538",
                                                                "children": [
                                                                    {
                                                                        "name": "TN3448",
                                                                        "children": [
                                                                            {
                                                                                "name": "TN3304",
                                                                                "children": [
                                                                                    {
                                                                                        "name": "AT4G36840"
                                                                                    },
                                                                                    {
                                                                                        "name": "TN3073",
                                                                                        "children": [
                                                                                            {
                                                                                                "name": "AT5G16140"
                                                                                            },
                                                                                            {
                                                                                                "name": "AT3G51220"
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                ]
                                                                            },
                                                                            {
                                                                                "name": "TN3305",
                                                                                "children": [
                                                                                    {
                                                                                        "name": "AT5G42110"
                                                                                    },
                                                                                    {
                                                                                        "name": "TN3074",
                                                                                        "children": [
                                                                                            {
                                                                                                "name": "TN2709",
                                                                                                "children": [
                                                                                                    {
                                                                                                        "name": "AT1G63170"
                                                                                                    },
                                                                                                    {
                                                                                                        "name": "AT3G50860"
                                                                                                    }
                                                                                                ]
                                                                                            },
                                                                                            {
                                                                                                "name": "TN2710",
                                                                                                "children": [
                                                                                                    {
                                                                                                        "name": "AT5G17650"
                                                                                                    },
                                                                                                    {
                                                                                                        "name": "TN2235",
                                                                                                        "children": [
                                                                                                            {
                                                                                                                "name": "AT4G38480"
                                                                                                            },
                                                                                                            {
                                                                                                                "name": "AT5G62430"
                                                                                                            }
                                                                                                        ]
                                                                                                    }
                                                                                                ]
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                ]
                                                                            }
                                                                        ]
                                                                    },
                                                                    {
                                                                        "name": "TN3449",
                                                                        "children": [
                                                                            {
                                                                                "name": "TN3306",
                                                                                "children": [
                                                                                    {
                                                                                        "name": "TN3075",
                                                                                        "children": [
                                                                                            {
                                                                                                "name": "AT1G15885"
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                ]
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                "heatmapData": [
                    {
                        "name": "head200w_01",
                        "heatmap": [
                            {
                                "x": "AT1G75510123456",
                                "y": 0.19057719806481
                            },
                            {
                                "x": "AT1G26750",
                                "y": 1.48171930093508
                            },
                            {
                                "x": "AT5G54250",
                                "y": 1.47815511971912
                            },
                            {
                                "x": "AT1G34780",
                                "y": 1.4876649117202
                            },
                            {
                                "x": "AT3G59600",
                                "y": 1.50643229591559
                            },
                            {
                                "x": "AT2G24290",
                                "y": 1.50856851828501
                            },
                            {
                                "x": "AT3G58670",
                                "y": 1.50245978106175
                            },
                            {
                                "x": "AT2G01080",
                                "y": 1.496322203366
                            }, {
                                "x": "AT2G45080",
                                "y": 0.906359757442846
                            },
                            {
                                "x": "AT2G17970",
                                "y": 0.922042916788755
                            },
                            {
                                "x": "AT1G09460",
                                "y": 0.922782888495231
                            },
                            {
                                "x": "AT3G12830",
                                "y": 0.92293103425644
                            },
                            {
                                "x": "AT5G04690",
                                "y": 0.58547275752019
                            },
                            {
                                "x": "AT5G52860",
                                "y": 0.585268437027508
                            },
                            {
                                "x": "AT5G11730",
                                "y": 0.582012315651184
                            },
                            {
                                "x": "AT2G16570",
                                "y": 0.581202085750145
                            },
                            {
                                "x": "AT5G23480",
                                "y": 0.580393364697527
                            },
                            {
                                "x": "AT5G59700",
                                "y": 0.597841220812404
                            },
                            {
                                "x": "AT5G16340",
                                "y": 0.589992302438348
                            },
                            {
                                "x": "AT1G74750",
                                "y": 0.589510720894029
                            },
                            {
                                "x": "AT2G46570",
                                "y": 0.637980087287756
                            },
                            {
                                "x": "AT3G60050",
                                "y": 0.639597536103406
                            },
                            {
                                "x": "AT1G74540",
                                "y": 0.640988731760263
                            },
                            {
                                "x": "AT3G46690",
                                "y": 0.647540563804015
                            },
                            {
                                "x": "AT4G13920",
                                "y": 0.648484661381618
                            },
                            {
                                "x": "AT3G26290",
                                "y": 0.64919408391875
                            },
                            {
                                "x": "AT3G07040",
                                "y": 0.645541145354123
                            }, {
                                "x": "AT4G10390",
                                "y": 0.663631476618582
                            },
                            {
                                "x": "AT1G26240",
                                "y": 0.664121087792201
                            },
                            {
                                "x": "AT1G47960",
                                "y": 1.13394913003213
                            },
                            {
                                "x": "AT1G45010",
                                "y": 1.13575943402153
                            },
                            {
                                "x": "AT4G26090",
                                "y": 1.14258537146995
                            },
                            {
                                "x": "AT4G22755",
                                "y": 1.13940283893153
                            },
                            {
                                "x": "AT3G12380",
                                "y": 1.13794180702007
                            },
                            {
                                "x": "AT4G15093",
                                "y": 1.13794180702007
                            },
                            {
                                "x": "AT5G50780",
                                "y": 1.19243834769679
                            },
                            {
                                "x": "AT5G24660",
                                "y": 1.65063406110623
                            },
                            {
                                "x": "AT3G48115",
                                "y": 1.56516638594323
                            },
                        ]
                    },
                    {
                        "name": "head200w_02",
                        "heatmap": [
                            {
                                "x": "AT1G75510123456",
                                "y": 0.286701532438409
                            },
                            {
                                "x": "AT1G26750",
                                "y": 0.89914619264261
                            },
                            {
                                "x": "AT5G54250",
                                "y": 0.898515416933
                            },
                            {
                                "x": "AT1G34780",
                                "y": 0.898305361792551
                            },
                            {
                                "x": "AT3G59600",
                                "y": 0.907645271263285
                            },
                            {
                                "x": "AT2G24290",
                                "y": 0.905932097052515
                            },
                            {
                                "x": "AT3G58670",
                                "y": 1.1866784267283
                            },
                            {
                                "x": "AT2G01080",
                                "y": 1.15832219853358
                            },
                            {
                                "x": "AT2G45080",
                                "y": 1.1633079243461
                            },
                            {
                                "x": "AT2G17970",
                                "y": 1.16864217587
                            },
                            {
                                "x": "AT1G09460",
                                "y": 0.64355089013376
                            },
                            {
                                "x": "AT3G12830",
                                "y": 0.642617446242545
                            },
                            {
                                "x": "AT5G04690",
                                "y": 0.642617446242545
                            },
                            {
                                "x": "AT5G52860",
                                "y": 0.739350683000292
                            },
                            {
                                "x": "AT5G11730",
                                "y": 0.739350683000292
                            },
                            {
                                "x": "AT2G16570",
                                "y": 0.7398364078822
                            },
                            {
                                "x": "AT5G23480",
                                "y": 0.739642052732706
                            },
                            {
                                "x": "AT5G59700",
                                "y": 0.700286361088874
                            },
                            {
                                "x": "AT5G16340",
                                "y": 0.702243007552311
                            },
                            {
                                "x": "AT1G74750",
                                "y": 0.701441495445502
                            },
                            {
                                "x": "AT2G46570",
                                "y": 0.707624562343354
                            },
                            {
                                "x": "AT3G60050",
                                "y": 0.70613797446551
                            },
                            {
                                "x": "AT1G74540",
                                "y": 0.672530060908573
                            },
                            {
                                "x": "AT3G46690",
                                "y": 0.674783492007874
                            },
                            {
                                "x": "AT4G13920",
                                "y": 0.674281718071923
                            },
                            {
                                "x": "AT3G26290",
                                "y": 0.682380514509639
                            },
                            {
                                "x": "AT3G07040",
                                "y": 0.682891739363393
                            },

                            {
                                "x": "AT4G10390",
                                "y": 1.60833095409556
                            },
                            {
                                "x": "AT1G26240",
                                "y": 1.57493464042063
                            },
                            {
                                "x": "AT1G47960",
                                "y": 1.75112051450415
                            },
                            {
                                "x": "AT1G45010",
                                "y": 1.66820690712266
                            },
                            {
                                "x": "AT4G26090",
                                "y": 1.69621559160848
                            },
                            {
                                "x": "AT4G22755",
                                "y": 1.69010482705113
                            },
                            {
                                "x": "AT3G12380",
                                "y": 1.62352985267147
                            },
                            {
                                "x": "AT4G15093",
                                "y": 1.60461291077915
                            },
                            {
                                "x": "AT5G50780",
                                "y": 1.62323249322939
                            },
                            {
                                "x": "AT5G24660",
                                "y": 1.06340475092421
                            },
                            {
                                "x": "AT3G48115",
                                "y": 1.07063105341942
                            }
                        ]
                    },
                    {
                        "name": "head200w_03",
                        "heatmap": [

                            {
                                "x": "AT1G75510123456",
                                "y": 0.39057719806481
                            },
                            {
                                "x": "AT1G26750",
                                "y": 1.48171930093508
                            },
                            {
                                "x": "AT5G54250",
                                "y": 1.47815511971912
                            },
                            {
                                "x": "AT1G34780",
                                "y": 1.4876649117202
                            },
                            {
                                "x": "AT3G59600",
                                "y": 1.50643229591559
                            },
                            {
                                "x": "AT2G24290",
                                "y": 1.50856851828501
                            },
                            {
                                "x": "AT3G58670",
                                "y": 1.50245978106175
                            },
                            {
                                "x": "AT2G01080",
                                "y": 1.496322203366
                            }, {
                                "x": "AT2G45080",
                                "y": 0.906359757442846
                            },
                            {
                                "x": "AT2G17970",
                                "y": 0.922042916788755
                            },
                            {
                                "x": "AT1G09460",
                                "y": 0.922782888495231
                            },
                            {
                                "x": "AT3G12830",
                                "y": 0.92293103425644
                            },
                            {
                                "x": "AT5G04690",
                                "y": 0.58547275752019
                            },
                            {
                                "x": "AT5G52860",
                                "y": 0.585268437027508
                            },
                            {
                                "x": "AT5G11730",
                                "y": 0.582012315651184
                            },
                            {
                                "x": "AT2G16570",
                                "y": 0.581202085750145
                            },
                            {
                                "x": "AT5G23480",
                                "y": 0.580393364697527
                            },
                            {
                                "x": "AT5G59700",
                                "y": 0.597841220812404
                            },
                            {
                                "x": "AT5G16340",
                                "y": 0.589992302438348
                            },
                            {
                                "x": "AT1G74750",
                                "y": 0.589510720894029
                            },
                            {
                                "x": "AT2G46570",
                                "y": 0.637980087287756
                            },
                            {
                                "x": "AT3G60050",
                                "y": 0.639597536103406
                            },
                            {
                                "x": "AT1G74540",
                                "y": 0.640988731760263
                            },
                            {
                                "x": "AT3G46690",
                                "y": 0.647540563804015
                            },
                            {
                                "x": "AT4G13920",
                                "y": 0.648484661381618
                            },
                            {
                                "x": "AT3G26290",
                                "y": 0.64919408391875
                            },
                            {
                                "x": "AT3G07040",
                                "y": 0.645541145354123
                            }, {
                                "x": "AT4G10390",
                                "y": 0.663631476618582
                            },
                            {
                                "x": "AT1G26240",
                                "y": 0.664121087792201
                            },
                            {
                                "x": "AT1G47960",
                                "y": 1.13394913003213
                            },
                            {
                                "x": "AT1G45010",
                                "y": 1.13575943402153
                            },
                            {
                                "x": "AT4G26090",
                                "y": 1.14258537146995
                            },
                            {
                                "x": "AT4G22755",
                                "y": 1.13940283893153
                            },
                            {
                                "x": "AT3G12380",
                                "y": 1.13794180702007
                            },
                            {
                                "x": "AT4G15093",
                                "y": 1.13794180702007
                            },
                            {
                                "x": "AT5G50780",
                                "y": 1.19243834769679
                            },
                            {
                                "x": "AT5G24660",
                                "y": 1.65063406110623
                            },
                            {
                                "x": "AT3G48115",
                                "y": 1.56516638594323
                            },
                        ]
                    }
                ]
            }

            $scope.setOption = {
                isShowName: false,
                isShowTopLine: true,
                sortNames: data.heatmapData
            }

            $scope.drawClusterHeatmap(data, $scope.setOption);

            if (flag && flag === 'refresh') {
                $scope.isRefresh = true;
                $timeout(function () {
                    $scope.isRefresh = false;
                }, 30)
            }

            $scope.chartData = data;
        }

        //设置面板点击确定的回调函数
        $scope.getSetOption = function (oSet) {
            $scope.drawClusterHeatmap($scope.chartData, oSet);
        }

        //画图
        $scope.drawClusterHeatmap = function (resdata, setOption) {
            d3.selectAll("#chartClusterpic svg g").remove();
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

            if (setOption.isShowTopLine) {
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
            var svg = d3.select("#chartClusterpic svg").attr("width", totalWidth).attr("height", totalHeight);

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
                    toolService.popPrompt("修改标题", textNode, textNode.textContent);
                })

            if (setOption.isShowTopLine) {
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

                var link = topCluster_g.selectAll(".topClusterlink")
                    .data(root.links())
                    .enter().append("path")
                    .attr("fill", "none")
                    .attr("stroke-width", 1)
                    .attr("stroke", "#cccccc")
                    .attr("d", elbow);

                var node = topCluster_g.selectAll(".topClusterNode")
                    .data(root.descendants())
                    .enter().append("g")
                    .attr("transform", function (d) {
                        return "translate(" + d.y + "," + d.x + ")";
                    });
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

                var link = cluster_g.selectAll(".heatMaplink")
                    .data(root.links())
                    .enter().append("path")
                    .attr("fill", "none")
                    .attr("stroke-width", 1)
                    .attr("stroke", "#cccccc")
                    .attr("d", elbow);

                var node = cluster_g.selectAll(".clusterNode")
                    .data(root.descendants())
                    .enter().append("g")
                    .attr("transform", function (d) {
                        return "translate(" + d.y + "," + d.x + ")";
                    })
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
                        .on("mouseover", function (d) {
                            var tipText = ["gene: " + d.x, "value: " + d.y]
                            reportService.GenericTip.Show(d3.event, tipText);
                        })
                        .on("mouseout", function (d) {
                            reportService.GenericTip.Hide();
                        })

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
                        var tipText = ["gene: " + d.x, "value: " + d.y]
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

                $("#heatmapClusterPanel .tab-switch-chart").on("mousedown", function () {
                    select_rect.attr("width", 0).attr("height", 0);
                    isMousedown = false;
                })

                $("#heatmapClusterPanel .tab-switch-chart").on("mouseup", function () {
                    select_rect.attr("width", 0).attr("height", 0);
                    isMousedown = false;
                })
            }

            //获取rect横纵索引
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
                if ($scope.GOAnnoData.rows[i].GeneID === key) {
                    $scope.GOAnnoData.rows[i].isChecked = true;
                    $scope.computedTheadStatus();
                    break;
                }
            }
        }

        $scope.addColumns = function () {
            $scope.GOAnnoData.rows.forEach(function (val, index) {
                val['testAdd'] = "add" + index;
            });
            $scope.GOAnnoData.thead.push('testAdd');
        }

        $scope.deleteColumns = function () {
            $scope.GOAnnoData.rows.forEach(function (val, index) {
                delete val.testAdd;
            });
            $scope.GOAnnoData.thead.pop();
        }
        // 聚类图框选传 获取genelist 重新获取表格数据 渲染筛选条件
        $scope.setGeneList = function (geneList) {
            var searchOne = '';

            // 重置基因列表
            $scope.geneUnselectList = '';
            // 拼接GeneID
            geneList.forEach(function (val, index) {
                searchOne += val + '\n';
            });
            // 如果没有点击筛选按钮 就点击
            if (!$('.grid-filter-begin > button').hasClass('active')) {
                $timeout(function () {
                    angular.element($('.grid-filter-begin > button')).triggerHandler('click');
                    $scope.geneidCustomSearchOne = searchOne.substring(0, searchOne.length - 1);
                }, 0);
            } else {
                $scope.geneidCustomSearchOne = searchOne.substring(0, searchOne.length - 1);
            }
        }

        // thead change event
        $scope.theadChange = function (a) {
            console.log('--------------------------------------------------')
            console.log(a);
            console.warn('调用')
        }

        // 获取比较组
        $scope.GetCompareGroupList = function () {
            $scope.CompareGroupList = toolService.sessionStorage.get("CompareGroup").split(",");
            //设置第一个选中
            $scope.goAnnoFindEntity.CompareGroup = $scope.CompareGroupList[0];
            $scope.GetGOAnnoList(1);
        };

        //过滤GO注释表格数据  
        $scope.InitFindEntity1 = function (filterFindEntity) {
            //获得页面查询实体信息
            console.log(filterFindEntity)
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
        $scope.GetGOAnnoList = function (pageNumber, CompareGroupChangeFlag) {
            toolService.gridFilterLoading.open("filter-table-id-1");
            $scope.goAnnoFindEntity = toolService.SetGridFilterFindEntity($scope.goAnnoFindEntity, "LCID", "string", "equal", toolService.sessionStorage.get("LCID"));
            $scope.goAnnoFindEntity = toolService.SetGridFilterFindEntity($scope.goAnnoFindEntity, "CompareGroup", "string", "equal", $scope.goAnnoFindEntity.CompareGroup);

            $scope.goAnnoFindEntity.pageNum = pageNumber;
            $scope.exportLocationGOAnno = options.api.mrnaseq_url + "/search/GONotesDifferential";
            var ajaxConfig = {
                data: $scope.goAnnoFindEntity,
                url: $scope.exportLocationGOAnno,
            };

            // 切换比较组的时候  重置未选择的基因列表
            if (CompareGroupChangeFlag) $scope.geneUnselectList = '';

            var promise = ajaxService.GetDeferData(ajaxConfig);
            promise.then(function (responseData) {
                if (responseData.Error) {
                    //系统异常
                    $scope.goAnnoError = "syserror";

                } else if (responseData.length == 0) {
                    //无数据异常
                    $scope.goAnnoFindEntity.searchContentList.length == 2 ? $scope.goAnnoError = "fjnodata" : $scope.goAnnoError = "nodata";
                } else {
                    $scope.goAnnoError = "";
                    $scope.GOAnnoData = responseData;
                    $scope.GOAnnoData.thead = [];

                    for (var key in $scope.GOAnnoData.rows[0]) {
                        $scope.GOAnnoData.thead.push(key);
                    }

                    // geneUnSelectList 是否包含回来的新数据
                    var isIn = false;
                    $scope.GOAnnoData.rows.map(function (value, index) {
                        value.isChecked = true;
                        var arr1 = value.GOID.split(',');
                        value.GOIDList = arr1;
                        if ($scope.geneUnselectList) {
                            for (var geneid in $scope.geneUnselectList) {
                                if (value.GeneID === geneid) {
                                    value.isChecked = false;
                                    isIn = true;
                                }
                            }
                        }
                    });
                    isIn ? $scope.checkedAll = false : $scope.checkedAll = true;


                }
                toolService.gridFilterLoading.close("filter-table-id-1");
            },
                function (errorMesg) {
                    toolService.gridFilterLoading.close("filter-table-id-1");
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
                    if ($scope.geneUnselectList[$scope.GOAnnoData.rows[i].GeneID]) {
                        delete $scope.geneUnselectList[$scope.GOAnnoData.rows[i].GeneID];
                    }
                }
            } else {
                // 全不选
                for (var j = 0; j < $scope.GOAnnoData.rows.length; j++) {
                    $scope.geneUnselectList[$scope.GOAnnoData.rows[j].GeneID] = $scope.GOAnnoData.rows[j].GeneID;
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
                $scope.geneUnselectList[$scope.GOAnnoData.rows[index].GeneID] = $scope.GOAnnoData.rows[index].GeneID;
                // animation
                var $targetOffset = $("#UnSelectedlist").offset();
                var x1 = event.pageX;
                var y1 = event.pageY;
                var x2 = $targetOffset.left + 110;
                var y2 = $targetOffset.top + 15;
                reportService.flyDiv("<span class='glyphicon glyphicon-plus mkcheck flyCheck'></span>", x1, y1, x2, y2);
            } else {
                // 如果是选中 就从geneUnselectList里删除
                delete $scope.geneUnselectList[$scope.GOAnnoData.rows[index].GeneID];
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
    }
});