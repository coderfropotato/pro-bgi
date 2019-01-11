define(["toolsApp"], function (toolsApp)
{

    toolsApp.controller("geneInfoController", geneInfoController);
    geneInfoController.$inject = ["$rootScope", "$scope", "$log", "$state", "$timeout", "$window", "$compile", "ajaxService", "toolService", "svgService", "reportService", "pageFactory"];
    function geneInfoController($rootScope, $scope, $log, $state, $timeout, $window, $compile, ajaxService, toolService, svgService, reportService, pageFactory)
    {
        $scope.InitPage = function () {
            $scope.isGeneInfoLoaded = false;
            $scope.isNoData = false;
            var geneInfo = pageFactory.get('geneInfo');
            // "SIN1023336"
            var promise = ajaxService.GetDeferDataNoAuth(
                {
                    data: { "genename": geneInfo.geneID, "genegroup": geneInfo.genomeVersion },
                    url: options.api.getGeneInfo_url + "/CYJYFX/GetRapeInfoByGNAndGG"
                }
            );
            promise.then(function(responseData) {
                if (responseData.Result === 'Error') {
                    $scope.isGeneInfoLoaded = true;
                    $scope.isNoData = true;
                    $scope.geneInfoError = 'syserror';
                    return;
                }
                $scope.message = responseData;
                if ($scope.message.RapeExondbInfo.length === 0) {
                    $scope.geneInfoError = 'nodata';
                    $scope.isNoData = true;
                    $scope.isGeneInfoLoaded = true;
                    return;
                }
                var string = $scope.message.RapeExondbInfo[0].ExonRegion;
                var array1 = string.split('-').join(',').split(','),
                    array2 = $scope.message.returnPfamdbDT;
                if (array1[array1.length - 1] == '') {
                    array1.pop();
                }
                var series1 = [],
                    series2 = {
                        name: 'title',
                        data: []
                    };
                for (var i = 0; i < array1.length / 2; i++) {
                    series1[i] = {
                        data: [[Number(array1[2 * i]), Number(array1[2 * i + 1])]],
                        color: '#7cb5ec'
                    }
                }
                for (var i = 0; i < array2.length; i++) {
                    series2.data[i] = [array2[i].Start, array2[i].End];
                    series2.color = '#7cb5ec';
                }
                series2.data.push([-10, -10]);
                drawGeneStructureGraph(series1);
                drawDomainStructureGraph(series2);
                window.onresize = function () {
                    if (document.getElementById('geneStructureGraph') != null) {
                        drawGeneStructureGraph(series1);
                        drawDomainStructureGraph(series2);
                    }
                }
                $scope.isGeneInfoLoaded = true;
            });
        }
    };
    function drawGeneStructureGraph(series) {
        var width = 590, height = 100;
        Highcharts.chart('geneStructureGraph', {
            // 图表类型，以及反转等信息
            chart: {
                type: 'columnrange',
                inverted: true,
                plotBorderColor: '#FFFFFF',
                width: width,
                height: height                      // 图形的宽度和高度
            },
            // 图表标题
            title: {
                text: ''
            },
            // x轴设置
            xAxis: {
                labels: {
                    enabled: false                  // 不显示标签
                },
                tickColor: '#FFFFFF',               // 刻度为白色，即不显示刻度
                lineColor: '#FFFFFF',
            },
            // y轴设置
            yAxis: {
                title: '',                      // 无标题
                lineColor: '#C0D0E0',
                lineWidth: '1',
                gridLineColor: '#FFFFFF',       // 不显示网格线
                min: 0,                         // y轴从0开始，而不是负数
                tickPixelInterval: 60,          // 50px为一格
                minorTickInterval: 'auto',
                minorGridLineColor: '#FFFFFF',
                minorTickLength: 5,
                minorTickWidth: 1,
                minorTickColor: '#C0D0E0',
                minorTickPosition: 'inside',
                tickColor: '#C0D0E0',           // 刻度的颜色
                tickWidth: 1,                   // 刻度的宽度
                tickPosition: 'inside',         // 刻度的位置（default outside）
                className: 'highcharts-axis-line',
                labels: {                       // 设置坐标轴上的label
                    y: -10,
                    reserveSpace: true,
                },
                opposite: true,
                id: 'yAxis'                     // 设置ID，用于后面操作此轴
            },
            // 提示框
            tooltip: {
                // enabled: false                  // 不显示提示框
                positioner: function (w, h, point) {
                    return { x: point.plotX, y: 60 }    // 提示框的显示位置
                },
                formatter: function () {                // 提示框显示的内容
                    return this.point.low + '-' + this.point.high;
                }
            },
            // 版权信息
            credits: {
                enabled: false,
                text: 'Wutbiolab',                      // 版权信息的内容
                href: 'http://www.wutbiolab.cn/index'   // 版权信息的链接
            },
            plotOptions: {
                columnrange: {
                    dataLabels: {
                        enabled: false,
                        formatter: function () {
                            return this.value;
                        }
                    }
                }
            },

            legend: {
                enabled: false
            },

            series: series
        }, function (chart) {
            $('#geneStructureGraph g rect').attr('x', height - 70).attr('width', '10');      // 图中元素位置固定为同一水平线
        });
    }
    function drawDomainStructureGraph(series) {
        var width = 590, height = (series.data.length - 1) * 30 + 80;       // 高度跟随数组长度改变
        Highcharts.chart('domainStructureGraph', {
            chart: {
                type: 'columnrange',
                inverted: true,
                plotBorderColor: '#FFFFFF',
                width: width,
                height: height
            },
            title: {
                text: ''
            },
            xAxis: {
                labels: {
                    enabled: false                  // 不显示标签
                },
                tickColor: '#FFFFFF',               // 不显示刻度颜色
                lineColor: '#FFFFFF',
                opposite: true
            },
            yAxis: {
                title: '',                      // 无标题
                min: 0,
                lineColor: '#C0D0E0',
                lineWidth: '1',
                gridLineColor: '#FFFFFF',       // 不显示网格线
                tickPixelInterval: 50,          // 50px为一格
                minorTickInterval: 'auto',
                minorGridLineColor: '#FFFFFF',
                minorTickLength: 5,
                minorTickWidth: 1,
                minorTickColor: '#C0D0E0',
                minorTickPosition: 'inside',
                tickColor: '#C0D0E0',           // 刻度的颜色
                tickWidth: 1,                   // 刻度的宽度
                tickPosition: 'inside',         // 刻度的位置（default outside）
                className: 'highcharts-axis-line',
                labels: {
                    y: -10,
                    reserveSpace: true,
                },
                opposite: true,
                id: 'yAxis'                     // 设置ID，用于后面操作此轴
            },
            plotOptions: {
                columnrange: {
                    dataLabels: {
                        enabled: false,
                        formatter: function () {
                            return this.y;
                        }
                    }
                }
            },
            tooltip: {
                // enabled: false                  // 不显示提示框
                positioner: function (w, h, point) {
                    return { x: point.plotX, y: point.plotY + 48 }      // 提示框显示的位置
                },
                formatter: function () {                                // 提示框显示的内容
                    return this.point.low + '-' + this.point.high;
                }
            },
            credits: {
                enabled: false,
                text: 'Wutbiolab',                      // 版权信息的内容
                href: 'http://www.wutbiolab.cn/index'   // 版权信息的链接
            },
            legend: {
                enabled: false
            },
            series: [series]
        }, function(chart) {
            $('#domainStructureGraph .highcharts-series-group rect').attr('width', '10');
        });
    }

});
