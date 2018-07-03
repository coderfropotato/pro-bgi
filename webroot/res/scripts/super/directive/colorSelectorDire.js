/*

模块名称：colorSelectorDire
整理时间：2018-04-10
功能简介：自定义颜色选择器

*/



define("superApp.colorSelectorDire", ["angular", "super.superMessage", "select2"],
    function(angular, SUPER_CONSOLE_MESSAGE) {
        var superApp = angular.module("superApp.colorSelectorDire", []);



        /*
        ** 创建日期：2018-04-10
        ** 功能简介：选择颜色
        ** 形如：
        
        <div class="select-color" get-cur-color="colorChange(color)"></div>
    
        其中： class="select-color"  是指令，必需
                get-cur-color="colorChange(color)"  回调函数，获取当前选中的颜色
    
        */
        superApp.directive('colorSelector', colorSelectorDirective);
        colorSelectorDirective.$inject = ["$log"];

        function colorSelectorDirective($log) {
            return {
                restrict: "ACE",
                replace: true,
                template: "<div ng-show=\"isShow\" class='colors_select'>" +
                    // "<div class='colors colorInput'><input type='text' class='form-control' placeholder='请输入16进制颜色值' /><button class='btn btn-default btn-silver btn-sm'>确定</button></div>" +
                    "<div class='colors color_list'>" +
                    "<ul>" +
                    "<li ng-repeat='color in colorList track by $index' ng-click='SetColor($event,color)' style='background-color:{{color}}'></li>" +
                    "</ul>" +
                    "</div>" +
                    "</div>",
                scope: {
                    isShow: "=",
                    getCurColor: "&"
                },
                link: function(scope, element, attrs) {
                    $(element).parent().css("position", "relative");
                },
                controller: "colorSelectorCtr"
            }
        }

        superApp.controller("colorSelectorCtr", colorSelectorCtr);
        colorSelectorCtr.$inject = ["$rootScope", "$scope", "$log", "$state", "$window", "ajaxService", "toolService", "reportService"];

        function colorSelectorCtr($rootScope, $scope, $log, $state, $window, ajaxService, toolService, reportService) {
            $scope.colorList = ["#ff0000", "#ffffff", "#0070c0", "#92D050", "#00B050", "#00B0F0", "#0070C0", "#002060", "#7030A0", "#000000", "#FFE5E5", "#FFF9E5", "#FFFFE5", "#F4FAED", "#E5F7ED", "#E5F7FD", "#E5F0F9", "#E5E8EF", "#F0EAF5", "#EFEFEF", "#FFCCCC", "#FFF2CC", "#FFFFCC", "#E9F6DC", "#CCEFDC", "#CCEFFC", "#CCE2F2", "#CCD2DF", "#E2D6EC", "#DFDFDF", "#FF9999", "#FFE699", "#FFFF99", "#D3ECB9", "#99DF89", "#99DFF9", "#99C6E6", "#99A6BF", "#C6ACD9", "#BFBFBF", "#FF6666", "#FFD966", "#FFFF66", "#BEE396", "#66D096", "#66D0F6", "#66A9D9", "#6679A0", "#A983C6", "#A0A0A0", "#FF3333", "#FFCD33", "#FFFF33", "#A8D973", "#33C073", "#33C3F3", "#338DCD", "#334D80", "#8D59B3", "#000000"];

            $(document).on("click", function() {
                $scope.isShow = false;
                $scope.$apply();
            })

            //rgb颜色转换成16进制颜色值
            function RGBToHex(rgb) {
                if (rgb.indexOf("#") != -1) {
                    return rgb.toLowerCase();
                } else {
                    var regexp = /[0-9]{0,3}/g;
                    var re = rgb.match(regexp); //利用正则表达式去掉多余的部分，将rgb中的数字提取
                    var hexColor = "#";
                    var hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

                    for (var i = 0; i < re.length; i++) {
                        var r = null,
                            c = re[i],
                            l = c;
                        var hexAr = [];
                        while (c > 16) {
                            r = c % 16;
                            c = (c / 16) >> 0;
                            hexAr.push(hex[r]);
                        }
                        hexAr.push(hex[c]);
                        if (l < 16 && l != "") {
                            hexAr.push(0)
                        }
                        hexColor += hexAr.reverse().join('');
                    }

                    return hexColor.toLowerCase();
                }
            }

            // $(".colors_select").on("click", function(evt) {
            //     clearEventBubble(evt);
            // })

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

            $scope.SetColor = function($event, color) {
                clearEventBubble($event);
                var curColor = RGBToHex(color);
                $scope.isShow = false;

                $scope.getCurColor({ color: curColor }); //参数必须是对象
            }
        }

    });