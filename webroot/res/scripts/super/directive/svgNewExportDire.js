/*

模块名称：svgNewExportDire
整理时间：2017-06-19
功能简介：静态图片导出功能，可保存成 PNG下载

*/

define("superApp.svgNewExportDire",
    ["angular", "super.superMessage", "select2"],
    function (angular, SUPER_CONSOLE_MESSAGE) {
        var superApp = angular.module("superApp.svgNewExportDire", []);
        /*
        ** 创建日期：2017-06-19
        ** 功能简介：D3导出单张图片
        ** 形如：<div class="svg-new-export" chartid="div_ReadsQuYuFenBu_CharPanel" saveimgname="基因组区域比对分布统计" ></div>
        ** class="svg-new-export"：指令，必需
        ** chartid="div_ReadsQuYuFenBu_CharPanel"： chartid
        ** saveimgname="基因组区域比对分布统计"： 要保存的文件名
        */
        superApp.directive("svgNewExport", svgNewExport);
        svgNewExport.$inject = ["$log", "$compile"];
        function svgNewExport($log, $compile) {
            return {
                restrict: "ACE",
                template: "<div class='dropdown drop-menu'>"
                + "<button style='margin-top:-1px;'  class='new-table-switch-btns noborder tool-tip' title='导出'>"
                + "<span class='glyphicon glyphicon-picture'></span> "
                //+ "<span class='icon-caret-down'></span>"
                + "</button>"
                + "<ul class='dropdown-menu'>"
                + "</ul>"
                + "</div>",
                controller: "svgNewExportController",
                link: function (scope, element, attrs) {
                    var $element = $(element);
                    var $dropdownMenu = $element.find(".dropdown-menu:eq(0)");

                    var LI_1 = $compile("<li><a ng-click=\"SvgNewExportImage('" + attrs.chartid + "', '" + attrs.saveimgname + "', 'png')\" href=\"javascript:;\">导出 PNG 格式图片</a></li>")(scope);
                    var LI_2 = $compile("<li><a ng-click=\"SvgNewExportImage('" + attrs.chartid + "', '" + attrs.saveimgname + "', 'jpg')\" href=\"javascript:;\">导出 JPG 格式图片</a></li>")(scope);
                    var LI_3 = $compile("<li><a ng-click=\"SvgNewExportImage('" + attrs.chartid + "', '" + attrs.saveimgname + "', 'svg')\" href=\"javascript:;\">导出 SVG 格式文件</a></li>")(scope);

                    $dropdownMenu.append(LI_1);
                    $dropdownMenu.append(LI_2);
                    $dropdownMenu.append(LI_3);
                }
            };
        };


        superApp.controller("svgNewExportController", svgNewExportController);
        svgNewExportController.$inject = ["$scope", "$log", "$state", "$window", "$compile", "ajaxService", "toolService"];
        function svgNewExportController($scope, $log, $state, $window, $compile, ajaxService, toolService) {
            //创建时间：2017-06-19
            //功能：导出图片
            //参数：chartid ; type 可选 "image/png" 或 "image/jpeg" ; saveImgName:保存文件名称
            $scope.SvgNewExportImage = function (chartid, saveImgName, type) {
                if (!saveImgName) {
                    saveImgName = "图表";
                }
                if (!type) {
                    type = "image/png";

                } else if ("jpg" == type) {
                    type = "image/jpeg";

                } else if ("png" == type) {
                    type = "image/png";
                }
                if (chartid) {
                    DownLoadImage(chartid, saveImgName, type);
                }
            };

            /*
            ** 创建日期：2017-06-19
            ** 功能简介：base64图片保存PNG
            ** 参数：img:<img>标签 , saveImgName:保存图片文件名 , type:类型 (默认 'image/png')
            ** 返回：一个RGB数组
            */
            function DownLoadImage(chartid, saveImgName, type) {
                type = type ? type : "image/png";
                var $chartDiv = $("#" + chartid);
                var $chartObj = $chartDiv.find("svg:eq(0)");
                $chartObj.attr('version','1.1');
                $chartObj.attr('xmlns','http://www.w3.org/2000/svg');


                var svgXml = $chartObj.prop("outerHTML");

                if(type != "svg"){
                    var image = new Image();
                    var canvas = document.createElement('canvas');  //准备空画布
                    canvas.width = $chartObj.width();
                    canvas.height = $chartObj.height();
    
                    var context = canvas.getContext('2d');  //取得画布的2d绘图上下文
                    context.fillStyle = "#ffffff";
                    context.fillRect(0, 0, canvas.width, canvas.height);
    
                    image.onload = function () {
                        context.drawImage(image, 0, 0);
                        var a = document.createElement('a');
                        document.body.appendChild(a);
                        a.href = canvas.toDataURL(type);  //将画布内的信息导出为png图片数据
                        type == "image/png" ? a.download = saveImgName + ".png" : a.download = saveImgName + ".jpg"; //导出的图片名称
                        a.click(); //点击触发下载
                        a.remove();
                    }
                    image.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svgXml))); //给图片对象写入base64编码的svg流

                }else{
                    var ajaxConfig = {
                        data: svgXml,
                        url: options.api.base_url + "/Transfer"
                    };
                    var promise = ajaxService.GetDeferData(ajaxConfig);
                    promise.then(function(responseData) {
                        if (responseData.Error) {
                            //系统异常
                            toolService.popMesgWindow("数据导出异常，请及时联系系统管理员！");
                        } else {
                            var fileInfo = responseData;
                            var aEle = document.createElement("a");
                            document.body.appendChild(aEle);
                            var file = new Blob([fileInfo], {
                                type: 'application/pdf;charset=utf-8;'
                            });
                            aEle.href = URL.createObjectURL(file);
                            if ($scope.isMultipleName) {
                                aEle.download = $scope.varFileName + ".svg";
                            } else {
                                aEle.download = saveImgName + ".svg";
                            }
                            aEle.click();
                            aEle.remove();
                        }
                    });

                    // var href = 'data:text/html;base64,' + window.btoa(unescape(encodeURIComponent(svgXml)));
                    // var a = document.createElement('a');
                    // document.body.appendChild(a);
                    // a.href = href;
                    // a.download = saveImgName + ".svg";
                    // setTimeout(function() {
                    //     a.click();
                    //     a.remove();
                    // }, 200);
                }
                
            };

        }


    });

