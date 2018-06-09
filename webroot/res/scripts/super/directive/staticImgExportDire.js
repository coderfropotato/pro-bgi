define("superApp.staticImgExportDire", ["angular", "super.superMessage", "select2"],
    function(angular, SUPER_CONSOLE_MESSAGE) {
        var superApp = angular.module("superApp.staticImgExportDire", []);
        /*
         ** 创建日期：2017-06-19
         ** 功能简介：D3导出单张图片
         ** 形如：<div class="svg-new-export" chartid="div_ReadsQuYuFenBu_CharPanel" saveimgname="基因组区域比对分布统计" ></div>
         ** class="svg-new-export"：指令，必需
         ** chartid="div_ReadsQuYuFenBu_CharPanel"： chartid
         ** saveimgname="基因组区域比对分布统计"： 要保存的文件名
         */
        superApp.directive("staticImgExport", staticImgExport);
        staticImgExport.$inject = ["$log", "$compile"];

        function staticImgExport($log, $compile) {
            return {
                restrict: "ACE",
                template: "<div class='dropdown drop-menu'>" +
                    "<button class='btn btn-default btn-sm btn-silver tool-tip' title='导出'>" +
                    "<span class='glyphicon glyphicon-picture'></span> "
                    //+ "<span class='icon-caret-down'></span>"
                    +
                    "</button>" +
                    "<ul class='dropdown-menu'>" +
                    "</ul>" +
                    "</div>",
                scope: {
                    // pdfExportUrl: "=",
                    isExportPdf: "=",
                    findEntity: "=",
                    exportLocation: "=",
                    isExportSvg: "="
                },
                controller: "staticImgExportController",
                link: function(scope, element, attrs) {
                    var $element = $(element);
                    var $dropdownMenu = $element.find(".dropdown-menu:eq(0)");

                    var LI_1 = $compile("<li><a ng-click=\"export('" + attrs.chartid + "', '" + attrs.saveimgname + "', 'png')\" href=\"javascript:;\">导出 PNG 格式图片</a></li>")(scope);
                    var LI_2 = $compile("<li><a ng-click=\"export('" + attrs.chartid + "', '" + attrs.saveimgname + "', 'jpg')\" href=\"javascript:;\">导出 JPG 格式图片</a></li>")(scope);
                    var LI_3 = $compile("<li><a ng-click=\"export('" + attrs.chartid + "', '" + attrs.saveimgname + "', 'pdf')\" href=\"javascript:;\">导出 PDF 格式文件</a></li>")(scope);
                    var LI_4 = $compile("<li><a ng-click=\"export('" + attrs.chartid + "', '" + attrs.saveimgname + "', 'svg')\" href=\"javascript:;\">导出 svg 格式文件</a></li>")(scope);

                    $dropdownMenu.append(LI_1);
                    $dropdownMenu.append(LI_2);
                    if (scope.isExportPdf) $dropdownMenu.append(LI_3);
                    if (scope.isExportSvg) $dropdownMenu.append(LI_4);
                }
            };
        };


        superApp.controller("staticImgExportController", staticImgExportController);
        staticImgExportController.$inject = ["$scope", "$log", "$state", "$window", "$compile", "ajaxService", "toolService"];

        function staticImgExportController($scope, $log, $state, $window, $compile, ajaxService, toolService) {
            $scope.export = function(chartid, saveImgName, type) {
                if (!saveImgName) {
                    saveImgName = "图表";
                }
                if (!type) {
                    type = "png";
                }
                if (chartid) {
                    DownLoadImage(chartid, saveImgName, type);
                }
            };


            // img 转 base64
            function getBase64Image(img) {
                var canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, img.width, img.height);
                var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
                var dataURL = canvas.toDataURL("image/" + ext);
                return dataURL;
            }

            //下载
            function DownLoadImage(chartid, saveImgName, type) {
                type = type ? type : "png";
                var $chartDiv = $("#" + chartid);
                var $img = $chartDiv.find('img:visible').eq(0);

                var img_src = $img.attr('src');
                var base64 = "";

                if (img_src.indexOf(";base64,") != -1) {
                    base64 = $img.attr('src');
                    download();
                } else {
                    var image = new Image();
                    image.src = img_src;
                    image.onload = function() {
                        base64 = getBase64Image(image);
                        download();
                    }
                }

                function download() {
                    if (type == "jpg" || type == "png") {
                        var a = document.createElement('a');
                        a.href = base64;
                        a.download = type == "png" ? saveImgName + ".png" : saveImgName + ".jpg";
                        a.click();
                    } else {
                        // // pdf
                        // var oReq = new XMLHttpRequest();
                        // var URLToPDF = $scope.pdfExportUrl;
                        // oReq.open("POST", URLToPDF, true);
                        // oReq.responseType = "blob";

                        // oReq.onreadystatechange = function() {
                        //     if (oReq.readyState === 4) {
                        //         if (oReq.status >= 200 && oReq.status < 300 || oReq.status == 304) {
                        //             var file = new Blob([oReq.response], {
                        //                 type: 'application/pdf'
                        //             });
                        //             saveAs(file, saveImgName + ".pdf");
                        //         }
                        //     }
                        // }

                        // oReq.send();

                        $scope.findEntity.IsExportReport = true;
                        toolService.pageLoading.open("正在为您导出，请稍候...", 200);
                        var ajaxConfig = {
                            data: $scope.findEntity,
                            url: $scope.exportLocation
                        };
                        var promise = ajaxService.GetDeferData(ajaxConfig);
                        promise.then(function(responseData) {
                                if (responseData.Error) {
                                    //系统异常
                                    toolService.popMesgWindow("数据导出异常，请及时联系系统管理员！");
                                } else {
                                    //正常
                                    var fileInfo = responseData;

                                    if (type == "svg") {
                                        var svgXml = fileInfo.substring(fileInfo.indexOf("<svg"), fileInfo.lastIndexOf("</svg>"));
                                        var href = 'data:text/html;base64,' + window.btoa(unescape(encodeURIComponent(svgXml)));
                                        var a = document.createElement('a');
                                        document.body.appendChild(a);
                                        a.href = href;
                                        a.download = saveImgName + ".svg";
                                        setTimeout(function() {
                                            a.click();
                                            a.remove();
                                        }, 200);
                                    }

                                    if (type == "pdf") {
                                        // fileinfo是base64
                                        // var aEle = document.createElement("a");
                                        // document.body.appendChild(aEle);
                                        // aEle.href = 'data:application/pdf;base64,' + fileInfo;
                                        // aEle.download = saveImgName + ".pdf";
                                        // setTimeout(function() {
                                        //     aEle.click();
                                        //     aEle.remove();
                                        // }, 200);

                                        // $.ajax({
                                        //     type: 'HEAD', // 获取头信息，type=HEAD即可
                                        //     url: $scope.exportLocation,
                                        //     complete: function(xhr, data) {
                                        //         // 获取相关Http Response header
                                        //         var wpoInfo = {
                                        //             // 服务器端时间
                                        //             "date": xhr.getResponseHeader('Date'),
                                        //             // 如果开启了gzip，会返回这个东西
                                        //             "contentEncoding": xhr.getResponseHeader('Content-Encoding'),
                                        //             // keep-alive ？ close？
                                        //             "connection": xhr.getResponseHeader('Connection'),
                                        //             // 响应长度
                                        //             "contentLength": xhr.getResponseHeader('Content-Length'),
                                        //             // 服务器类型，apache？lighttpd？
                                        //             "server": xhr.getResponseHeader('Server'),
                                        //             "vary": xhr.getResponseHeader('Vary'),
                                        //             "transferEncoding": xhr.getResponseHeader('Transfer-Encoding'),
                                        //             // text/html ? text/xml?
                                        //             "contentType": xhr.getResponseHeader('Content-Type'),
                                        //             "cacheControl": xhr.getResponseHeader('Cache-Control'),
                                        //             // 生命周期？
                                        //             "exprires": xhr.getResponseHeader('Exprires'),
                                        //             "lastModified": xhr.getResponseHeader('Last-Modified'),
                                        //             "contentDisposition": xhr.getResponseHeader('Content-Disposition')
                                        //         };
                                        //         console.log(wpoInfo.contentDisposition);
                                        //         console.log(data);
                                        //         console.log(this);
                                        //     }
                                        // });

                                        // fileinfo是文件内容
                                        var aEle = document.createElement("a");
                                        document.body.appendChild(aEle);
                                        var file = new Blob([fileInfo], {
                                            type: 'application/pdf'
                                        });
                                        aEle.href = URL.createObjectURL(file);
                                        aEle.download = saveImgName + ".pdf";
                                        aEle.click();
                                        aEle.remove();
                                    }

                                }
                                toolService.pageLoading.close();
                            },
                            function(errorMesg) {
                                toolService.pageLoading.close();
                                toolService.popMesgWindow("数据导出异常，请及时联系系统管理员！");
                            });

                    }
                }


            };

        }


    });