
/*

模块名称：toolTipDire
整理时间：2016-06-20
功能简介：常用的界面工具提示类，如 下拉菜单、弹出提示框 等

*/



define("superApp.toolTipDire",
    ["angular", "super.superMessage", "select2"],
    function (angular, SUPER_CONSOLE_MESSAGE) {
        var superApp = angular.module("superApp.toolTipDire", []);




        /*
        ** 创建日期：2016-05-30
        ** 功能简介：鼠标移上的 tips 提示框
        ** 形如：
        <button class="btn btn-default btn-silver btn-sm tool-tip" tool-tip-direct="top" title="弹出提示1" ng-click="btnRefresh_OnClick()">
        <span class="glyphicon glyphicon-refresh"></span>
        </button>
        其中：class="tool-tip" 必须 
        title="弹出提示1" 弹出的提示文字 ;
        tool-tip-direct="top" 弹出文字的位置，可选 [top|right|bottom|left]
        */
        superApp.directive('toolTip', toolTipDirective);
        toolTipDirective.$inject = ["$log"];
        function toolTipDirective($log) {
            return {
                restrict: "ACE",
                link: function (scope, element, attrs) {
                    var margin = 32; //提示框偏移 px
                    var $element = $(element);
                    $element.data("direct", (attrs.toolTipDirect) ? attrs.toolTipDirect : "top");
                    $element.data("toolTipID", "toolTipID_" + $element.attr("title"));
                    $element.data("title", $element.attr("title"));
                    $element.removeAttr("title"); //把title属性删掉，否则会显示浏览器自带的提示
                    $element.hover(function () {
                        var $this = $(this);
                        var $divToolTip = $("#" + $this.data("toolTipID"));
                        if ($divToolTip.length < 1) {
                            var $div = $("<div style='z-index:10001' id=" + $this.data("toolTipID") + " class='tooltip " + $this.data("direct") + "' role='tooltip'>");
                            var inner = $("<div class='tooltip-inner'></div>");
                            var arrow = "<div class='tooltip-arrow'></div></div>";
                            inner.text($this.data("title"))
                            $div.append(inner).append(arrow);
                            $("body").append($div);
                            $divToolTip = $("#" + $this.data("toolTipID"));
                        }

                        var tipsW, tipsH, pos, tX, tY, dW, dH;

                        //当前 tips 属性
                        tipsW = $divToolTip.width();
                        tipsH = $divToolTip.height();

                        //定位当前按钮
                        dW = parseInt($this.css('width'));
                        dH = parseInt($this.css('height'));
                        pos = $this.offset();

                        switch ($this.data("direct")) {
                            case "right":
                                tX = pos.left + margin;
                                tY = pos.top - tipsH / 2 + dH / 2;
                                break;
                            case "bottom":
                                tX = pos.left - tipsW / 2 + dW / 2;
                                tY = pos.top + margin;
                                break;
                            case "left":
                                tX = pos.left - dW - margin * 1.5;
                                tY = pos.top - tipsH / 2 + dH / 2;
                                break;
                            case "top":
                            default:
                                tX = pos.left - tipsW / 2 + dW / 2;
                                tY = pos.top - margin;
                                break;

                        }

                        $divToolTip.css({ "left": tX + "px", "top": tY + "px" });
                        $divToolTip.addClass("in");
                    }, function () {
                        var $this = $(this);
                        var $divToolTip = $("#" + $this.data("toolTipID"));
                        $divToolTip.removeClass("in");
                        setTimeout(function () { $divToolTip.remove(); }, 100);
                    });
                    $element.click(function () {
                        var $this = $(this);
                        var $divToolTip = $("#" + $this.data("toolTipID"));
                        $divToolTip.removeClass("in");
                        setTimeout(function () { $divToolTip.remove(); }, 100);
                    })
                }
            }
        }



        /*
        ** 创建日期：2016-05-30
        ** 功能简介：按钮下拉菜单
        ** 形如：
        <div class="dropdown drop-menu">
        <button class="btn btn-default btn-silver btn-sm tool-tip" title="导出">
        <span class="glyphicon glyphicon-picture"></span>
        <span class="icon-caret-down"></span>
        </button>
        <ul class="dropdown-menu">
        <li><a href="#">Action</a></li>
        <li><a href="#">Another action</a></li>
        <li><a href="#">Something else here</a></li>
        </ul>
        </div>
        其中：class="dropdown" 是 bootstrap 样式，必须； class="drop-menu" 是指令，必须
        <ul class="dropdown-menu">....</ul> 是下拉菜单的内容
             
        *****  注：约定，drop-menu 下第一个子元素为开关元素（按钮）  *****
    
        */
        superApp.directive('dropMenu', dropMenuDirective);
        dropMenuDirective.$inject = ["$log"];
        function dropMenuDirective($log) {
            return {
                restrict: "ACE",
                link: function (scope, element, attrs) {
                    var $element = $(element);
                    $element.find(".dropdown-menu:eq(0)").hide();
                    //它下面的第一个子元素点击事件 （约定第一个就是按钮，或者其它开关元素）
                    $element.find(":eq(0)").click(function (event) {
                        var $this = $(this);
                        var $dropdownMenu = $this.parent().find(".dropdown-menu:eq(0)");
                        setTimeout(function () {
                            var dWidth = $dropdownMenu.width();
                            var dLeft = $dropdownMenu.offset().left;
                            if ($(window).width() < (dWidth + dLeft)) {
                                $dropdownMenu.css({ "left": "inherit", "right": 0 });
                            }
                        }, 0)
                        $this.parent().addClass("drop-menu-show");
                        $this.parent().find(".dropdown-menu:eq(0)").stop().fadeIn();
                        event.stopPropagation();

                        //给document添加事件，执行取消面板操作
                        $(document).one("click", function () {
                            scope.$apply(function () {
                                $element.removeClass("drop-menu-show");
                                $element.find(".dropdown-menu:eq(0)").stop().fadeOut();
                            });
                        });
                    });

                    $element.find(".dropdown-menu:eq(0)").click(function () {
                        var $this = $(this);
                        $this.parent().removeClass("drop-menu-show");
                        $this.parent().find(".dropdown-menu:eq(0)").stop().fadeOut();
                    });
                }
            }
        }



        /*
        ** 创建日期：2016-06-08
        ** 功能简介：初始化颜色选择插件
        ** 形如：
        <input type="text" class="form-control form-minicolors" value="#ffa3a0" style="width:100px">
    
        其中：class="form-minicolors"  是指令，必需
        */
        superApp.directive('formMinicolors', formMinicolorsDirective);
        formMinicolorsDirective.$inject = ["$log"];
        function formMinicolorsDirective($log) {
            return {
                restrict: "ACE",
                link: function (scope, element, attrs) {
                    var $element = $(element);
                    $element.minicolors();
                }
            }
        }




        /*
        ** 创建日期：2016-05-30
        ** 功能简介：鼠标移上的 tips 提示框
        ** 形如：
    
        <a id="myID"  my-title="弹出提示1" class="pop-tip">Hover Me</a>
    
        其中：class="pop-tip" 必须 
        my-title="弹出提示1" 弹出的提示文字 ;
        */
        superApp.directive('popTip', popTipDirective);
        popTipDirective.$inject = ["$log"];
        function popTipDirective($log) {
            return {
                restrict: "ACE",
                scope: {
                    myTitle: "="
                },
                link: function (scope, element, attrs) {
                    //$log.log(scope.myAttr);
                    //$log.log(attrs.id);
                    if (scope.myTitle == "") return;
                    var margin = 2; //提示框偏移 px
                    var $element = $(element);
                    $element.data("direct", (attrs.toolTipDirect) ? attrs.toolTipDirect : "right");
                    $element.data("toolTipID", "toolTipID_" + attrs.id);
                    $element.data("title", scope.myTitle);
                    $element.removeAttr("title"); //把title属性删掉，否则会显示浏览器自带的提示
                    $element.hover(function () {
                        var $this = $(this);
                        $this.data("direct", ($this.attr('toolTipDirect')) ? $this.attr('toolTipDirect') : "right");
                        /* 判断元素是否位于极左 或 极右，如是，反向之 */
                        if ($this.data("direct") == "right") {
                            if ($this.offset().left + 200 > $(window).width()) {
                                $this.data("direct", "left");
                            }
                        }

                        if ($this.data("direct") == "left") {
                            if ($this.offset().left < 200) {
                                $this.data("direct", "right");
                            }
                        }


                        var $divToolTip = $("#" + $this.data("toolTipID"));
                        if ($divToolTip.length < 1) {
                            var toolTipHTML = "<div id=" + $this.data("toolTipID") + " class='tooltip " + $this.data("direct") + " poptip' role='tooltip'><div class='tooltip-arrow'></div><div class='tooltip-inner'>" + $this.data("title") + "</div></div>";
                            $("body").append(toolTipHTML);
                            $divToolTip = $("#" + $this.data("toolTipID"));
                        }

                        var tipsW, tipsH, pos, tX, tY, dW, dH;


                        //定位当前按钮
                        dW = parseInt($this.css('width'));
                        dH = parseInt($this.css('height'));
                        pos = $this.offset();

                        //当前 tips 属性
                        tipPad = parseInt($divToolTip.find(".tooltip-inner").css("padding-top"));
                        tipsW = $divToolTip.width();
                        tipsH = $divToolTip.height();

                        switch ($this.data("direct")) {
                            case "right":
                                //tipsH = dH - tipPad * 2;
                                $divToolTip.height(tipsH);
                                //$divToolTip.find(".tooltip-inner").height(tipsH);

                                tipsH = $divToolTip.height();
                                tX = pos.left + dW + margin;
                                tY = pos.top - tipsH / 2 + dH / 2;
                                break;
                            case "bottom":
                                tX = pos.left - tipsW / 2 + dW / 2;
                                tY = pos.top + margin;
                                break;
                            case "left":
                                //tipsH = dH - tipPad * 2;
                                $divToolTip.height(tipsH);
                                //$divToolTip.find(".tooltip-inner").height(tipsH);

                                tipsH = $divToolTip.height();
                                tX = pos.left - tipsW - margin - 10;
                                tY = pos.top - tipsH / 2 + dH / 2;
                                break;
                            case "top":
                            default:
                                tX = pos.left - tipsW / 2 + dW / 2;
                                tY = pos.top - margin;
                                break;

                        }

                        $divToolTip.css({ "left": tX + "px", "top": tY + "px" });
                        $divToolTip.addClass("in");
                    }, function () {
                        var $this = $(this);
                        var $divToolTip = $("#" + $this.data("toolTipID"));
                        $divToolTip.removeClass("in");
                        $divToolTip.remove();
                        // setTimeout(function () { $divToolTip.remove(); }, 100);
                        // $divToolTip.fadeOut();
                    });
                }
            }
        }


        /*
        ** 创建日期：2017-12-20
        ** 功能简介：鼠标移上的 GO和KOtips 提示框
        ** 形如：
    
        <a name="myID"  my-title="弹出提示1" class="pop-tip-go">Hover Me</a>
    
        <div name="{{$index}}"  toolTipDirect="left" class="pop-tip-go overflow-dot" ng-bind="fileListItem.GO" my-title="fileListItem.GO"></div>
        
        其中：class="pop-tip-go" 必须 
        my-title="弹出提示1" 弹出的提示文字 ;
        */
        superApp.directive('popTipGo', popTipGoDirective);
        popTipGoDirective.$inject = ["$log"];
        function popTipGoDirective($log) {
            return {
                restrict: "ACE",
                scope: {
                    myTitle: "="
                },
                link: function (scope, element, attrs) {
                    //$log.log(scope.myAttr);
                    //$log.log(attrs.id);
                    if (scope.myTitle == "") return;
                    var margin = 2; //提示框偏移 px
                    var $element = $(element);
                    $element.data("direct", (attrs.toolTipDirect) ? attrs.toolTipDirect : "right");
                    $element.data("toolTipID", "toolTipID_" + attrs.name);
                    $element.data("title", scope.myTitle);
                    $element.removeAttr("title"); //把title属性删掉，否则会显示浏览器自带的提示
                    $element.hover(function () {
                        //移除掉之前hover的div
                        $(".GOKOToolTip").remove();

                        var $this = $(this);
                        $this.data("direct", ($this.attr('toolTipDirect')) ? $this.attr('toolTipDirect') : "right");
                        /* 判断元素是否位于极左 或 极右，如是，反向之 */
                        if ($this.data("direct") == "right") {
                            if ($this.offset().left + 200 > $(window).width()) {
                                $this.data("direct", "left");
                            }
                        }

                        if ($this.data("direct") == "left") {
                            if ($this.offset().left < 200) {
                                $this.data("direct", "right");
                            }
                        }


                        var $divToolTip = $("#" + $this.data("toolTipID"));
                        if ($divToolTip.length < 1) {
                            var str = $this.data("title");
                            str = str.replace(/;/g, "<br>")
                            str = str.replace(/(GO:[0-9]+)/g, '<a href="http://amigo.geneontology.org/amigo/medial_search?q=$1" target="_blank">$1</a>')
                            var toolTipHTML = "<div id=" + $this.data("toolTipID") + " class='tooltip GOKOToolTip " + $this.data("direct") + " poptip' role='tooltip'><div class='tooltip-arrow'></div><div class='tooltip-inner'>" + str + "</div></div>";
                            $("body").append(toolTipHTML);

                            $divToolTip = $("#" + $this.data("toolTipID"));
                        }

                        var tipsW, tipsH, pos, tX, tY, dW, dH;


                        //定位当前按钮
                        dW = parseInt($this.css('width'));
                        dH = parseInt($this.css('height'));
                        pos = $this.offset();

                        //当前 tips 属性
                        tipPad = parseInt($divToolTip.find(".tooltip-inner").css("padding-top"));
                        tipsW = $divToolTip.width();
                        tipsH = $divToolTip.height();

                        switch ($this.data("direct")) {
                            case "right":
                                //tipsH = dH - tipPad * 2;
                                $divToolTip.height(tipsH);
                                //$divToolTip.find(".tooltip-inner").height(tipsH);

                                tipsH = $divToolTip.height();
                                tX = pos.left + dW + margin;
                                tY = pos.top - tipsH / 2 + dH / 2;
                                break;
                            case "bottom":
                                tX = pos.left - tipsW / 2 + dW / 2;
                                tY = pos.top + margin;
                                break;
                            case "left":
                                //tipsH = dH - tipPad * 2;
                                $divToolTip.height(tipsH);
                                //$divToolTip.find(".tooltip-inner").height(tipsH);

                                tipsH = $divToolTip.height();
                                tX = pos.left - tipsW - margin - 10;
                                tY = pos.top - tipsH / 2 + dH / 2;
                                break;
                            case "top":
                            default:
                                tX = pos.left - tipsW / 2 + dW / 2;
                                tY = pos.top - margin;
                                break;

                        }

                        $divToolTip.css({ "left": tX + "px", "top": tY + "px" });
                        $divToolTip.addClass("in");
                    }, function () {
                        var $this = $(this);
                        var $divToolTip = $("#" + $this.data("toolTipID"));
                        var timer = setTimeout(function () {
                            $divToolTip.removeClass("in");
                            $divToolTip.remove();
                        }, 100);

                        $divToolTip.hover(function () {
                            clearTimeout(timer)
                        }, function () {
                            $divToolTip.removeClass("in");
                            $divToolTip.remove();
                        })

                    });
                }
            }
        }


        /*
        ** 创建日期：2016-06-21
        ** 功能简介：帮助说明展开框 
        ** 形如：
        <div class="alert alert-warning drop-alert">
        <p>温馨提示：<a href="JavaScript:;" ng-click="ShowContent()">点击查看帮助说明</a></p>
        <div class="ddsm" style="display: none;">
        ..... 自己编写的内容 ......
        </div>
        </div>
    
        其中：class="drop-alert"  是指令，必需
        class="alert alert-warning"  bootstrap 样式，必需
        */
        superApp.directive('dropAlert', dropAlertDirective);
        dropAlertDirective.$inject = ["$log"];
        function dropAlertDirective($log) {
            return {
                restrict: "ACE",
                link: function (scope, element, attrs) {
                    //保存 div 对象
                    scope.$element = $(element);
                    scope.$ddsm = scope.$element.find(".ddsm:eq(0)");
                },
                controller: "dropAlertCtr"
            }
        }

        superApp.controller("dropAlertCtr", dropAlertCtr);
        dropAlertCtr.$inject = ["$rootScope", "$scope", "$log", "$state", "$window", "ajaxService", "toolService", "reportService"];
        function dropAlertCtr($rootScope, $scope, $log, $state, $window, ajaxService, toolService, reportService) {
            $scope.ShowContent = function () {
                if ($scope.$ddsm.is(":hidden")) {
                    $scope.$ddsm.stop().slideDown();
                } else {
                    $scope.$ddsm.stop().slideUp();
                }
            }
        }



        /*
        ** 创建日期：2016-07-05
        ** 功能简介：系统异常|没有数据 的提示
        ** 形如：
        <div class="table-nodata" error-type ="xiangGuanXingJianChaError"></div>
    
        其中：class="table-nodata"  是指令，必需
        error-type 传入的变量，若值为 false ，则不显示；值为 "syserror", 显示系统异常；值为 "nodata",显示没有数据。
        */
        superApp.directive('tableNodata', tableNodataDirective);
        tableNodataDirective.$inject = ["$log"];
        function tableNodataDirective($log) {
            return {
                restrict: "ACE",
                template: "<div class='table_noData' ng-show='errorType == \"nodata\"'>"
                    + "<div class='divCont'>"
                    + "<p>对不起，没有可显示的数据！</p>"
                    + "</div>"
                    + "</div>"
                    + "<div class='table_noData' ng-show='errorType == \"syserror\"'>"
                    + "<div class='divCont'>"
                    + "<p>对不起，系统异常！</p>"
                    + "</div>"
                    + "</div>"
                    + "<div class='table_noData' ng-show='errorType == \"fjnodata\"'>"
                    + "<p class='fjnodata_p'>没有结果！</p>"
                    + "</div>",
                scope: {
                    errorType: "="
                },
                link: function (scope, element, attrs) {

                }
            }
        }



        // pop over
        superApp.directive('popoverTable', popoverTable);
        popoverTable.$inject = ["$log"];
        function popoverTable($log) {
            return {
                restrict: "ACE",
                scope: {
                    myTitle: "=",
                    theadKey: "=",
                    // PathwayName的参数，后续的操作需要用到 compareGroup和method
                    pathwayid: "=",   // []
                    compare: "=",
                    method: "=",
                    //
                },
                controller: "popoverTableCtr",
                link: function (scope, element, attrs) {
                    scope.element = element;
                }
            }
        }

        superApp.controller("popoverTableCtr", popoverTableCtr);
        popoverTableCtr.$inject = ["$rootScope", "$scope", "$log", "$state", "$window", "$timeout", "ajaxService", "toolService", "reportService"];
        function popoverTableCtr($rootScope, $scope, $log, $state, $window, $timeout, ajaxService, toolService, reportService) {
            if ($scope.myTitle || $scope.myTitle == 0) {
                if ((!$scope.myTitle && $scope.myTitle != 0)) {
                    return;
                }
                // if (/go|kegg|nr|annotation|evalue/gi.test($scope.theadKey)) {
                // 如果超出了就加上
                $timeout(function () {
                    if ($($scope.element).width() < $($scope.element).children(":eq(0)").outerWidth()) {
                        var timer = null;
                        var obj = null;

                        $($scope.element).on('mouseenter', function (ev) {
                            if (obj) obj.remove();
                            var direc = 'left';
                            var leftPos = 0, topPos = 0;
                            // leftPos = $($scope.element).offset().left - 200;
                            topPos = $($scope.element).offset().top;

                            // 如果是ko
                            if (typeof $scope.myTitle === 'string') {
                                if (/Pathway\sName/g.test($scope.theadKey) && $scope.myTitle.indexOf('//') != -1) {
                                    var str = '';
                                    str += '<div class="tooltip ' + direc + ' poptip" style="max-width:600px;word-wrap:break-word; top:' + topPos + 'px; visibility:hidden;" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner">';
                                    for (var o = 0; o < $scope.pathwayid.length; o++) {
                                        str += '<a class="jump-to-tools-map-id" title=' + $scope.pathwayid[o].id + '>' + $scope.pathwayid[o].text + '</a><br>';
                                    }
                                    str += '</div></div>';
                                    obj = $(str);

                                } else if ($scope.myTitle.indexOf('GO:') != -1) {
                                    // 如果是带有 中括号 的GO：
                                    if (/\[[^]\]/g.test($scope.myTitle)) {
                                        var arr = $scope.myTitle.split(';');
                                        var str = '';
                                        str += '<div class="tooltip ' + direc + ' poptip" style="max-width:600px;word-wrap:break-word; top:' + topPos + 'px; visibility:hidden;" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner">';
                                        for (var o = 0; o < arr.length; o++) {
                                            // 有括号的 把中括号里面的拿出来
                                            var index = arr[o].indexOf('[');
                                            var lastIndex = arr[o].indexOf(']');
                                            if (index != -1 && lastIndex != -1) {
                                                if (arr[o]) {
                                                    var gotext = arr[o].substring(lastIndex + 1);
                                                    var goid = gotext.split(':')[1].split('//')[0];
                                                    var flag = arr[o].substring(index, lastIndex + 1);
                                                    str += '<span>' + flag + '</span><br>';
                                                    str += '<a class="go-jump" title=' + goid + '>' + arr[o].substring(lastIndex + 1) + '</a><br>'
                                                }
                                            } else {
                                                if (arr[o]) {
                                                    str += '<a class="go-jump" title=' + arr[o].split(':')[1].split('//')[0] + '>' + arr[o] + '</a><br>';
                                                }
                                            }
                                        }
                                        str += '</div></div>';
                                        obj = $(str);
                                    } else {
                                        // GO:
                                        var arr = $scope.myTitle.split(';')
                                        var str = '';
                                        str += '<div class="tooltip ' + direc + ' poptip" style="max-width:600px;word-wrap:break-word; top:' + topPos + 'px; visibility:hidden;" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner">';
                                        for (var i = 0; i < arr.length; i++) {
                                            if (arr[i] != '') {
                                                str += '<a class="go-jump" title=' + arr[i].split(':')[1].split('//')[0] + '>' + arr[i] + '</a><br>';
                                            }
                                        }
                                        str += '</div></div>';
                                        obj = $(str);
                                    }
                                } else if (/\[[^]\]/g.test($scope.myTitle)) {
                                    // 只有中括号 没有GO:
                                    var arr = $scope.myTitle.split(';');
                                    var str = '';
                                    str += '<div class="tooltip ' + direc + ' poptip" style="max-width:600px;word-wrap:break-word; top:' + topPos + 'px; visibility:hidden;" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner">';
                                    for (var k = 0; k < arr.length; k++) {
                                        if (/\[[^]\]/g.test(arr[k])) {
                                            var flag = arr[k].substring(arr[k].indexOf('['), arr[k].indexOf(']') + 1);
                                            str += '<span>' + flag + '</span><br>';
                                        }
                                        str += '<span class="kh-text">' + arr[k].substring(arr[k].indexOf(']') + 1) + '</span><br>'
                                    }
                                    str += '</div></div>';
                                    obj = $(str);
                                } else {
                                    if ($scope.myTitle.indexOf(';') != -1) {
                                        var title = $scope.myTitle.split(';');
                                        var str = '';
                                        str += '<div class="tooltip ' + direc + ' poptip" style="max-width:600px;word-wrap:break-word; top:' + topPos + 'px; visibility:hidden;" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner">';
                                        for (var k = 0; k < title.length; k++) {
                                            str += '<span>' + title[k] + '</span><br>';
                                        }
                                        str += '</div></div>';

                                        obj = $(str);
                                    } else {
                                        obj = $('<div class="tooltip ' + direc + ' poptip" style="max-width:600px;word-wrap:break-word; top:' + topPos + 'px; visibility:hidden;" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner">' + $scope.myTitle + '</div></div>');
                                    }
                                }
                            } else {
                                obj = $('<div class="tooltip ' + direc + ' poptip" style="max-width:600px;word-wrap:break-word; top:' + topPos + 'px; visibility:hidden;" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner">' + $scope.myTitle + '</div></div>');
                            }

                            $('body').append(obj);
                            obj.css('left', $($scope.element).offset().left - obj.outerWidth());

                            // 判断极值
                            if (obj.width() > ($($scope.element).offset().left)) {
                                obj.removeClass('left').addClass('right');
                                obj.css('left', $($scope.element).offset().left + $($scope.element).outerWidth())
                            }


                            obj.css('top', topPos - (obj.height() - $($scope.element).outerHeight()) / 2);
                            obj.css('visibility', 'visible');

                            obj.on('mouseenter', function () {
                                if (timer) clearTimeout(timer);
                            }).on('mouseleave', function () {
                                if (obj) obj.remove();
                            })


                            // 根据不同的表头做不同的逻辑处理
                            // mapid
                            var mapIdObj = obj.find('.jump-to-tools-map-id');
                            if (mapIdObj.length) {
                                mapIdObj.on('click', function () {
                                    var id = $(this).attr('title');
                                    window.open('../../../../ps/tools/index.html#/home/mapId?map=' + id + '&compareGroup=' + $scope.compare + '&method=' + $scope.method);
                                })
                            }
                            //  go 
                            var goObj = obj.find('.go-jump');
                            if (goObj.length) {
                                goObj.on('click', function () {
                                    var id = $(this).attr('title');
                                    window.open('http://amigo.geneontology.org/amigo/medial_search?q=GO:' + id);
                                })
                            }

                        }).on('mouseleave', function () {
                            if (timer) clearTimeout(timer);
                            timer = setTimeout(function () {
                                if (obj) obj.remove();
                            }, 50)
                        })
                        // }
                    }
                }, 0)

            }

        }


    });

