//require(["jQueryEasyUi"]);
define("superApp.reportDire",
    ["angular", "super.superMessage", "select2"],
    function (angular, SUPER_CONSOLE_MESSAGE) {
        var superApp = angular.module("superApp.reportDire", []);

        /*
        ** 创建人：高洪涛
        ** 创建日期：2016-5-23
        ** 功能简介：在线报告top页面指令
        */
        superApp.directive('superOnlinereportFrameTop', superOnlinereportFrameTop);
        superOnlinereportFrameTop.$inject = ["$log"];
        function superOnlinereportFrameTop($log) {
            return {
                restrict: "ACE",
                templateUrl: SUPER_CONSOLE_MESSAGE.localUrl.onLineReportTopPath,
                replace: false,
                transclude: false,
                scope: {
                    isbodyshow: "=",
                    topactiveindex: "="
                },
                controller: "OnLineReportFrameTopCtr"
            };
        };

        superApp.controller("OnLineReportFrameTopCtr", OnLineReportFrameTopCtr);
        OnLineReportFrameTopCtr.$inject = ["$rootScope", "$scope", "$log", "$state", "$timeout", "$window", "ajaxService", "toolService", "reportService"];
        function OnLineReportFrameTopCtr($rootScope, $scope, $log, $state, $timeout, $window, ajaxService, toolService, reportService) {

            $scope.isTest = $rootScope.isTest; //是否测试版
            $scope.isMangerSys = $rootScope.isMangerSystem;

            //获取用户实体信息
            $scope.userInfoEntity = toolService.GetUserInfoEntity();

            $scope.LCMC = (toolService.localStorage.get("LCMC") == 'undefined' || toolService.localStorage.get("LCMC") == "") ? "" : toolService.localStorage.get("LCMC");
            $scope.LCID = (toolService.sessionStorage.get("LCID") == 'undefined' || toolService.sessionStorage.get("LCID") == "") ? "" : toolService.sessionStorage.get("LCID")
            /* 控制顶部用户下拉菜单显示 */
            //$scope.topUserInfo_IsOpen = true;
            $scope.topNav_Help_OnMouseEnter = function () {
                $scope.topHelp_IsOpen = true;
            }
            $scope.topNav_Help_OnMouseLeave = function () {
                $scope.topHelp_IsOpen = false;
            }

            /* 控制顶部手机下拉菜单显示 */
            $scope.topMobile_IsOpen = false;
            $scope.topNav_Mobile_Toggle = function () {
                $scope.topMobile_IsOpen = !$scope.topMobile_IsOpen;
            }

            $scope.myAnalysisClick = function () {
                toolService.sessionStorage.set('type', 'myAnalysis');
                $window.open('../tools/index.html#/home/myAnalysis');
            }

            $scope.GoHome = function () {
                $timeout(function () {
                    var oUl = document.getElementsByClassName('sidebar_nav_pop')[0];
                    var firstLi = $('.sidebar_group ol li').eq(0);
                    firstLi = firstLi.get(0);
                    angular.element(firstLi).triggerHandler('click');
                    // slide
                    $('.sidebar_nav_two ol').not('.sidebar_nav_two ol:first').slideUp();
                    $('.sidebar_nav_two ol').eq(0).slideDown();

                    // isExpand
                    $rootScope.leftData.forEach(function (val, index) {
                        if (val.JDPID === '-1' && val.GNSID !== '001') {
                            val.isExpand = false;
                        }
                        // GNSID 001 JDPID -1
                        if (val.GNSID === '001' && val.JDPID === '-1') {
                            val.isExpand = true;
                        }
                    });
                }, 0)
            };

            $scope.ExportPDF = function () {

                //已加载的页面先更改宽度为1080px（1080px为了适配chrome打印）
                //将原页面的dom结构更新到新的dom结构中，highcharts会失效，因此，先修改原页面宽度，再将dom存起来。
                $("#div_ViewProduct").css("width", "1080px")
                $(".directivePanel").css("display", "block")
                $(".chart_graph").each(function () {
                    try {
                        $(this).highcharts().reflow();
                    } catch (e) { }
                });

                //将已加载的dom存在arr中
                var domArr = new Array();
                $(".directivePanel").each(function () {
                    domArr.push($(this));
                })
                //移除所有已加载页面
                $(".directivePanel").remove()
                //去掉页面头和左边栏
                document.body.innerHTML = document.getElementById("div_ViewProduct").innerHTML;
                //匹配ID类似 "div_001001_panel12"
                var reg1 = /div_(\d+)(_.+)/;
                //未加载的重新加载，已加载的更新到新的html中
                for (var i = 0; i < $rootScope.leftData.length; i++) {
                    //判断之前是否加载过;
                    var isINDomArray = false;
                    for (var j = 0; j < domArr.length; j++) {
                        if (domArr[j].attr('id').replace(reg1, "$1") === $rootScope.leftData[i].GNSID) {
                            isINDomArray = true;
                            $(".contentPanel").append(domArr[j]);
                            continue;
                        }
                    }
                    if (isINDomArray) {
                        continue
                    };
                    //未加载过的页面重新加载
                    reportService.IndexLoadPage($rootScope.leftData[i]);
                }
                $(".page_report").css("width", "1080px")
                $(".directivePanel").css("display", "block")
                setInterval(printpdf, 1000);

                function printpdf() {
                    toolService.pageLoading.open("正在生成报告");
                    var isLoading = false;
                    //根据是否有蒙板判断是否正在加载
                    $(".graph_loading").each(function () {
                        if (!($(this).css("display") === "none")) {
                            isLoading = true;
                            return;
                        }
                    }
                    )
                    //如果正在加载，则返回
                    if (isLoading) {
                        return
                    }
                    else {
                        clearInterval(printpdf);
                        //特殊处理OTU的heatmap图head
                        $(".div_field_filter").remove();
                        //去掉图head
                        $(".graph_header").remove();
                        //去掉页面下方便捷导航
                        $(".report-page-footer").remove();
                        //GWAS网络图刷新后需要时间
                        setTimeout(function () {
                            toolService.pageLoading.close();
                            window.print();
                            window.location.href = window.location.href
                        }, 2000)
                    }
                };

                return;
            }

        };

        /*
        ** 创建人：高洪涛
        ** 创建日期：2015-12-16
        ** 功能简介：框架一级树指令
        */
        superApp.directive('superOnlinereportFrameLeft', superOnlinereportFrameLeft);
        superOnlinereportFrameLeft.$inject = ["$log"];
        function superOnlinereportFrameLeft($log) {
            return {
                restrict: "ACE",
                replace: false,
                transclude: false,
                controller: "superOnlinereportFrameLeftCtr",
                scope: {
                    leftDataJson: "=",
                    isViewFull: "=",
                    isActiveName: "="
                },
                templateUrl: SUPER_CONSOLE_MESSAGE.localUrl.onLineReportLeftPath
            };
        };

        superApp.controller("superOnlinereportFrameLeftCtr", superOnlinereportFrameLeftCtr);
        superOnlinereportFrameLeftCtr.$inject = ["$rootScope", "$scope", "$log", "$state", "$timeout", "ajaxService", "reportService"];
        function superOnlinereportFrameLeftCtr($rootScope, $scope, $log, $state, $timeout, ajaxService, reportService) {
            //二级节点展开与关闭事件
            $scope.LeftNav_Toggle = function (event, item) {
                item.folded = !item.folded;
            };

            $scope.ResizeBody = function () {
                setTimeout(function () {
                    $(".directivePanel:visible .chart_graph").each(function () {
                        try //因为有的 chart_graph 并不是 highcharts
                        {
                            $(this).highcharts().reflow();
                        } catch (e) { }
                    });
                    //$(".chart_graph").highcharts().reflow();
                    $(window).resize();
                }, 100);
            };

            $scope.sidebarFold_OnClick = function (event, item) {
                $scope.isViewFull = !$scope.isViewFull;
                //触发窗口大小改变事件 16-01-11
                //angular.element(window);
                $scope.ResizeBody();
            };

            $scope.isExpand = function (item, index) {
                item.isExpand = !item.isExpand;

                if (item.isExpand) {
                    $('.sidebar_nav_two ol').slideUp();
                    $scope.leftDataJson.forEach(function (val, index) {
                        if (val.JDPID == -1 && val.GNSID != item.GNSID) val.isExpand = false;
                    });

                    $('.sidebar_nav_' + index).find('.sidebar_nav_two ol').slideDown();
                } else {
                    $('.sidebar_nav_' + index).find('.sidebar_nav_two ol').slideUp();
                }
            }

            // 二级菜单hover 默认传入三级菜单父级
            $scope.handlerMouseEnter = function (parent) {
                parent.showPop = true;
            }

            $scope.handlerMouseLeave = function (parent) {
                parent.showPop = false;
            }

            // 二级菜单点击事件
            $scope.handlerTwoClick = function (two) {
                var reg = new RegExp('^' + two.JDPID);
                var threeGNSID = two.GNSID + '001';
                var hasThreeChild = false;
                $rootScope.quickMenuList = [];


                if (two.children.length) {
                    $rootScope.quickMenuList = $rootScope.quickMenuList.concat(two.children);
                    reportService.IndexLoadPage(two.children[0]);
                    hasThreeChild = true;
                } else {
                    $rootScope.quickMenuList.push(two);
                    reportService.IndexLoadPage(two);
                    hasThreeChild = false;
                }

                $rootScope.leftData.forEach(function (val, index) {
                    val.isActive = false;
                    if (hasThreeChild) {
                        if (val.GNSID === two.children[0].GNSID) {
                            val.isActive = true;
                        }
                    }
                });

                two.isActive = true;
            }

            // 三级菜单点击加载页面
            $scope.handlerPopClick = function (threeItem, $event) {
                var tempItemJDPID = threeItem.JDPID;
                $rootScope.leftData.forEach(function (val, index) {
                    if (val.GNSID == tempItemJDPID) parent = val;
                });
                if (parent.LJLJ == null) return;
                if (!threeItem.isActive) {
                    // 重置所有三级菜单的激活状态
                    $rootScope.quickMenuList = [];
                    // 重置二级激活状态
                    $rootScope.leftData.forEach(function (val, index) {
                        if (val.GNSID === threeItem.JDPID) {
                            val.isActive = true;
                        } else {
                            val.isActive = false;
                        }

                        if (val.JDPID != -1 && val.Index !== '-2') {
                            if (val.JDPID == tempItemJDPID) {
                                $rootScope.quickMenuList.push(val);
                            }
                        }
                    });

                    threeItem.isActive = true;

                    // 三级菜单点击 加载三级页面
                    reportService.IndexLoadPage(threeItem);
                    $scope.ResizeBody();
                }
                $event.stopPropagation();
            }

            //监听选中信息，供index页或默认页显示的时候，设置左边树的选中值
            $scope.$watch("isActiveName", function (newVal) {
                if (angular.isDefined(newVal)) {
                    setTimeout(function () {
                        $scope.$apply(function () {
                            angular.forEach($scope.leftDataJson, function (leftListitem, index, array) {
                                if (leftListitem.GNSID == newVal) {
                                    //$scope.li_OnClick(leftListitem, $scope.leftDataJson)
                                    //默认执行第一个节点选中
                                    //reportService.IndexLoadPage(leftListitem);
                                    //$scope.ResizeBody();
                                    leftListitem.isActive = true;
                                    if (leftListitem.JDPID != -1 && leftListitem.Index == -2) {
                                        //证明当前选中的是二级菜单，则需要设置一级菜单也选中
                                        angular.forEach($scope.leftDataJson, function (listItem) {
                                            //设置对应的一级节点为选中
                                            if (listItem.GNSID == leftListitem.JDPID) {
                                                listItem.isActive = true;
                                            }

                                        });
                                        //将当前二级菜单的子级信息放入快速跳转菜单中 || 把自己放入快捷菜单
                                        if (leftListitem.hasChild) {
                                            // 吧三级菜单放入快捷菜单
                                            angular.forEach($scope.leftDataJson, function (val) {
                                                if (val.JDPID === leftListitem.GNSID) $rootScope.quickMenuList.push(val);
                                            })
                                        } else {
                                            // 如果没有三级 就当放自己
                                            $rootScope.quickMenuList.push(leftListitem);
                                        }
                                    }
                                }
                                else {
                                    leftListitem.isActive = false;
                                }
                            });

                        });
                    }, 200);
                }
            }, true);

        };

        /*function superOnlinereportFrameLeftCtr($rootScope, $scope, $log, $state, ajaxService, reportService)
        {
            //二级节点展开与关闭事件
            $scope.LeftNav_Toggle = function (event, item)
            {
                item.folded = !item.folded;
            };
    
            $scope.ResizeBody = function ()
            {
                setTimeout(function ()
                {
                    $(".directivePanel:visible .chart_graph").each(function ()
                    {
                        try //因为有的 chart_graph 并不是 highcharts
                        {
                            $(this).highcharts().reflow();
                        } catch (e) { }
                    });
                    //$(".chart_graph").highcharts().reflow();
                    $(window).resize();
                }, 100);
            };
    
            $scope.sidebarFold_OnClick = function (event, item)
            {
                $scope.isViewFull = !$scope.isViewFull;
                //触发窗口大小改变事件 16-01-11
                //angular.element(window);
                $scope.ResizeBody();
            };
            
    
    
            //功能树点击方法
            $scope.li_OnClick = function (item, itemList)
            {
                //如果点击的是当前选中的item，则什么都不执行
                if (item.isActive) return;
                if (item.LJLJ == null) return;
                //$log.log(item);
                //定义快速菜单信息
                $rootScope.quickMenuList = [];
                var tempItemJDPID = item.JDPID;
                //设置当前选中
                angular.forEach($scope.leftDataJson, function (leftListitem, index, array)
                {
                    //判断当前选中的目录有没有父目录，如果有父目录则需要置父目录的选中状态为选中
                    if (leftListitem.GNSID == item.JDPID)
                    {
                        leftListitem.isActive = true;
                    }
                    else
                    {
                        leftListitem.isActive = false;
                    }
                    //设置快速调转菜单的数据信息
                    if (tempItemJDPID != -1)
                    {
                        //证明当前选中的节点是二级菜单节点，此时需要获取同级所有的二级菜单信息
                        if (leftListitem.JDPID == tempItemJDPID)
                        {
                            $rootScope.quickMenuList.push(leftListitem);
                        }
                    }
                    else
                    {
                        $rootScope.quickMenuList = [];
                    }
                });
                item.isActive = true;
    
                //变换一下值，在菜单点击后隐藏后又还原，意在触发 ng-mouseleave，点击后隐藏菜单
                itemList.showUL = false;
                setTimeout(function ()
                {
                    itemList.showUL = true;
                },100);
    
                //加载页面
                reportService.IndexLoadPage(item);
    
    
                $scope.ResizeBody();
                //$log.log(contentPanel.html());
            };
    
            // 左侧菜单鼠标移上出菜单
            $scope.leftTree_OnMouseover = function (idIndex)
            {
                var $li = $(".sidebar_nav_" + idIndex);
    
                var $ul = $li.find("ul:eq(0)");
                var ulHeight = $ul.height();
                var liTop = $li.offset().top;
                if (ulHeight + liTop > $(window).height())
                {
                    $ul.css("top", (-1 * (ulHeight - 39)) + "px");
                } else
                {
                    $ul.css("top", "-1px");
                }
    
                //迷你模式下的判断
                if (!$scope.isViewFull)
                {
                    if ($li.find("ul:eq(0) li").length > 0)
                    {
                        $li.find(".sidebar-title-text:eq(0)").css("display", "none");
                    }
                }
            };
    
            // 左侧菜单鼠标移出恢复
            $scope.leftTree_OnMouseleave = function (idIndex)
            {
                var $li = $(".sidebar_nav_" + idIndex);
    
                //迷你模式下的判断
                if (!$scope.isViewFull)
                {
                    var $text = $li.find(".sidebar-title-text:eq(0)").css("display", "inline");
                }
            };
    
    
            //监听选中信息，供index页或默认页显示的时候，设置左边树的选中值
            $scope.$watch("isActiveName", function (newVal)
            {
                if (angular.isDefined(newVal))
                {
                    setTimeout(function ()
                    {
                        $scope.$apply(function ()
                        {
                            angular.forEach($scope.leftDataJson, function (leftListitem, index, array)
                            {
                                if (leftListitem.GNSID == newVal)
                                {
                                    //$scope.li_OnClick(leftListitem, $scope.leftDataJson)
                                    //默认执行第一个节点选中
                                    //reportService.IndexLoadPage(leftListitem);
                                    //$scope.ResizeBody();
                                    leftListitem.isActive = true;
                                    if (leftListitem.JDPID != -1)
                                    {
                                        //证明当前选中的是二级菜单，则需要设置一级菜单也选中
                                        angular.forEach($scope.leftDataJson, function (listItem)
                                        {
                                            //设置对应的一级节点为选中
                                            if (listItem.GNSID == leftListitem.JDPID)
                                            {
                                                listItem.isActive = true;
                                                //alert(1);
                                                
                                            }
                                            //将当前二级菜单的平级信息放入快速跳转菜单中
                                            if (listItem.JDPID == leftListitem.JDPID)
                                            {
                                                $rootScope.quickMenuList.push(listItem);
                                            }
                                        });
                                    }
                                }
                                else
                                {
                                    leftListitem.isActive = false;
                                }
                            });
                        });
                    }, 200);
                }
            }, true);
    
        };*/

        /*
        ** 创建人：高洪涛
        ** 创建日期：2015-12-16
        ** 功能简介：根据PID获得子节点filter
        */
        superApp.filter("checkPidFilter", checkPidFilter);
        checkPidFilter.$inject = ["$log"];
        function checkPidFilter($log) {
            return function (input, pid) {
                if (isNaN(input)) {
                    var output = [];
                    angular.forEach(input, function (item, index, array) {
                        // 二级菜单 GNSID => '001001'
                        if (item.JDPID === pid) {
                            output.push(item);
                        }
                    });
                    return output;
                }
                else {
                    return input;
                }
            }
        };


        /* 返回顶部 */
        superApp.directive('backToTop', backToTop);
        backToTop.$inject = ["$log"];
        function backToTop($log) {
            return {
                restrict: "ACE",
                link: function (scope, element, attrs) {

                    $(element).click(function () {
                        $(window).scrollTop(0);
                    });

                    $(window).on("scroll", function () {
                        if ($(window).scrollTop() > 600) {
                            $(element).fadeIn();
                        } else {
                            $(element).fadeOut();
                        }
                    });

                }
            };
        }



        /*
        ** 创建日期：2016-06-21
        ** 功能简介：在线报告 每个页面底部的 上一页、下一页
        */
        superApp.directive('reportPageFooter', reportPageFooter);
        reportPageFooter.$inject = ["$log", "$compile"];
        function reportPageFooter($log, $compile) {
            return {
                restrict: "ACE",
                replace: false,
                transclude: false,
                template: "<button ng-if='currentIndex!=0' ng-click='btnPrev_OnClick();' type='button' class='btn btn-default btn-sm'>"
                    + "<span class='glyphicon glyphicon-arrow-left'>"
                    + "</span>"
                    // + " {{menulist[currentIndex-1].TBTEXT}} {{menulist[currentIndex-1].JDMC}} "
                    + " {{currentIndex}} {{menulist[currentIndex-1].JDMC}} "
                    + "</button>"
                    + "<button ng-if='currentIndex<menulist.length - 1' ng-click='btnNext_OnClick();' type='button' class='btn btn-info btn-sm'>"
                    // + " {{menulist[currentIndex+1].TBTEXT}} {{menulist[currentIndex+1].JDMC}} "
                    + " {{currentIndex+2}} {{menulist[currentIndex+1].JDMC}}"
                    + "<span class='glyphicon glyphicon-arrow-right'>"
                    + "</span>"
                    + "</button>"
                    + "<button ng-if='currentIndex===menulist.length - 1 && nextSectionMenuList.length > 0' ng-click='btnNextChapter_OnClick();' type='button' class='btn btn-info btn-sm'>"
                    + " 下一章 "
                    + "<span class='glyphicon glyphicon-arrow-right'>"
                    + "</span>"
                    + "</button>",
                scope: {
                    menulist: "="
                },
                controller: "reportPageFooterCtr",
                link: function (scope, element, attrs) {
                    var $element = $(element);

                    //获取当前 active 索引
                    scope.currentIndex = 0;
                    // menu长度
                    scope.currentMenuLength = scope.menulist.length;

                    for (var i = 0; i < scope.menulist.length; i++) {
                        if (scope.menulist[i].isActive) {
                            scope.currentIndex = i;
                            break;
                        }
                    }

                }
            };
        };

        superApp.controller("reportPageFooterCtr", reportPageFooterCtr);
        reportPageFooterCtr.$inject = ["$rootScope", "$scope", "$log", "$state", "$window", "ajaxService", "toolService", "reportService"];
        function reportPageFooterCtr($rootScope, $scope, $log, $state, $window, ajaxService, toolService, reportService) {
            $scope.nextSectionMenuList = [];
            $scope.secGNSIDList = [];
            // 找到所有二级的GNSID
            $rootScope.leftData.forEach(function (val, index) {
                if (val.Index === '-2') {
                    $scope.secGNSIDList.push(val.GNSID);
                }
            });

            $scope.findNextSectionMenuList = function () {
                // 如果菜单长度是 0 ，那么是第一章菜单，循环找到第二章菜单
                if ($scope.menulist.length == 0) {
                    if ($rootScope.leftDataOrderById['001001001']) {
                        $rootScope.leftData.forEach(function (val, index) {
                            if (/^001001/.test(val.JDPID) && !val.hasChild) {
                                $scope.nextSectionMenuList.push(val);
                            }
                        })
                    } else {
                        $rootScope.leftData.forEach(function (val, index) {
                            if (/^001002/.test(val.GNSID) && !val.hasChild) {
                                $scope.nextSectionMenuList.push(val);
                            }
                        })
                    }
                    return;
                }

                var cur = $scope.menulist[$scope.menulist.length - 1]
                var nextStartsWidth, index;
                if (cur.Index !== '-2') {
                    // 三级页面
                    index = indexInArr(cur.JDPID, $scope.secGNSIDList).nextIndex;
                } else {
                    // 二级页面
                    index = indexInArr(cur.GNSID, $scope.secGNSIDList).nextIndex;
                }

                function indexInArr(a, arr) {
                    var len = arr.length;
                    for (var p = 0; p < len; p++) {
                        if (a === arr[p]) {
                            return { curIndex: p, nextIndex: p + 1 >= len ? null : p + 1 }
                        }
                    }
                }

                if (index === null) {
                    $scope.nextSectionMenuList = [];
                } else {
                    var reg = new RegExp("^" + $scope.secGNSIDList[index]);

                    angular.forEach($rootScope.leftData, function (listItem, index, array) {
                        // 直接无子集的二级
                        if (listItem.Index === '-2' && reg.test(listItem.GNSID) && !listItem.hasChild) {
                            $scope.nextSectionMenuList.push(listItem);
                        }
                        // 三级
                        if (reg.test(listItem.JDPID) && listItem.GNSID.length == 9) {
                            $scope.nextSectionMenuList.push(listItem);
                        }
                    });
                }
            }

            $scope.findNextSectionMenuList();

            $scope.btnPrev_OnClick = function () {
                $scope.QuickMenu_OnClick($scope.menulist[$scope.currentIndex - 1]);
            }

            $scope.btnNext_OnClick = function () {
                $scope.QuickMenu_OnClick($scope.menulist[$scope.currentIndex + 1]);
            }

            $scope.btnNextChapter_OnClick = function () {
                // 首先设置原来的子菜单选中状态为 false
                angular.forEach($rootScope.quickMenuList, function (menuItem) {
                    menuItem.isActive = false;
                })

                // 获取下一章菜单，并把新章和该章菜单中的第一个子菜单设置为选中
                $rootScope.quickMenuList = $scope.nextSectionMenuList;
                // start 2018年3月12日10:20:41 add Expand 
                var parentItemGNSID = $rootScope.quickMenuList[0].JDPID;

                // 是二级还是三级菜单
                // 如果是二级 就直接给active
                // 如果是三级 就找到二级给active
                // 展开主目录
                // 重置其他

                $rootScope.leftData.forEach(function (val, index) {
                    if (val.JDPID == -1 && val.GNSID === parentItemGNSID.substring(0, 3)) {
                        val.isExpand = true;

                        if (!$('#div_' + val.GNSID).parent().find('.sidebar_nav_two ol').is(':visible')) {
                            $('.sidebar_nav_two ol').slideUp();
                            $('#div_' + val.GNSID).parent().find('.sidebar_nav_two ol').slideDown();
                        }

                    } else {
                        if (val.isExpand != 'undefined') val.isExpand = false;
                    }

                    if (parentItemGNSID.length > 6) {
                        if (val.GNSID === parentItemGNSID.substring(0, 7)) {
                            val.isActive = true;
                        } else {
                            val.isActive = false;
                        }
                    } else {
                        if (val.GNSID === parentItemGNSID) {
                            val.isActive = true;
                        } else {
                            val.isActive = false;
                        }
                    }
                });
                // end 2018年3月12日10:22:12 add Expand 

                $rootScope.quickMenuList[0].isActive = true;
                // 点击下一章默认展开
                angular.forEach($rootScope.leftData, function (leftListItem) {
                    if (leftListItem.JDPID == -1) {
                        leftListItem.isActive = false;
                        if (leftListItem.GNSID == $rootScope.quickMenuList[0].JDPID) {
                            leftListItem.isActive = true;
                        }
                    }
                });

                reportService.IndexLoadPage($rootScope.quickMenuList[0]);
            }

            $scope.QuickMenu_OnClick = function (item) {
                //如果点击的是当前选中的item，则什么都不执行
                if (item.isActive) return;
                if (item.LJLJ == null) return;
                var flag = false;

                // 三级页面还是二级页面 二级false 三级true
                item.Index !== '-2' ? flag = true : flag = false;

                // 三级
                angular.forEach($rootScope.quickMenuList, function (listItem, index, array) {
                    listItem.isActive = false;
                });

                item.isActive = true;

                //加载页面
                reportService.IndexLoadPage(item);

                //触发 Resize，包括窗口 Resize 事件，highchart 重画
                setTimeout(function () {
                    $(".directivePanel:visible .chart_graph").each(function () {
                        try //因为有的 chart_graph 并不是 highcharts
                        {
                            $(this).highcharts().reflow();
                        } catch (e) { }
                    });
                    $(window).resize();
                }, 100);
            }
        }
    });

