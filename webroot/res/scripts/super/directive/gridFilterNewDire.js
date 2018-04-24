/*

模块名称：gridFilterDire
整理时间：2016-06-20
功能简介：表格查询指令

*/

define("superApp.gridFilterDire",
    ["angular", "super.superMessage", "select2"],
    function (angular, SUPER_CONSOLE_MESSAGE) {
        var superApp = angular.module("superApp.gridFilterDire", []);

        /*
        ** 创建人：高洪涛
        ** 创建日期：2016年5月29日01:45:27
        ** 功能说明：Grid查询指令
        ** 返回类型：无
        ** 调用方法：<div class="grid-filter" icon="sort-asc"></div>   icon="sort-asc"  初始化小箭头按钮的样式名称
        ** 说明：pageFindEntity结果中，必须要 pageFindEntity{searchContentList:[]}结构
        */
        superApp.directive('gridFilter', gridFilter);
        gridFilter.$inject = ["$log"];
        function gridFilter($log) {
            return {
                restrict: "ACE",
                scope: {
                    callback: "&",           // 开始筛选按钮回调方法，一般为父页面的获取对应表格的方法，将传回查询实体
                },
                templateUrl: SUPER_CONSOLE_MESSAGE.localUrl.girdFilterPath,
                replace: false,
                transclude: true,
                controller: "gridFilterController",
                link: function (scope, element, attrs) {
                    //定义当前指令的element存放变量，由link传入，由Controller接收使用
                    scope.thisElement = element;
                    //由link获取指令属性，并传入
                    scope.iconName = attrs.icon;
                    scope.tableid = attrs.tableid;
                    scope.filterName = attrs.filtername;
                    scope.filternamezh = attrs.filternamezh;
                    //filtertype：datetime、 string、double [default]、int
                    scope.filtertype = attrs.filtertype;
                    scope.parentId = attrs.parentid
                    // 如果没有提供外部查询参数
                    scope.filterFindEntity = {
                        filterName: scope.filterName,           //查询字段名字
                        filternamezh: scope.filternamezh,       //查询字段中文
                        filtertype: scope.filtertype,           //查询字段类型 filtertype：datetime、 string、double [default]、int、boolean（新增的布尔筛选）
                        isSort: false,                          //是否排序标识
                        sortName: "",                            //排序字段名称
                        sortType: "",                           //排序类型
                        searchType: "equal",                    //查询类型
                        searchOne: "",                          //查询内容1
                        searchTwo: "",                          //查询内容2
                        isTopFilter: false                       //是否上层查询条件，直接影响页面翻译查询条件内容，当为True时不翻译
                    };
                    scope.directiveID = attrs.id;

                    var tableObj = $("#" + scope.tableid);
                    //确定过滤面版对象
                    var tsgPanel = $(element).find(".tsg_panel:eq(0)");
                    //初始化小箭头样式
                    $(element).find(".tsg_btns .btn .sort_icn:eq(0)").addClass(attrs.icon);

                    //给所有的li编id
                    $(tableObj).find(".tsg_panel").each(function (index) {
                        scope.liSortID1 = "li_1" + "_" + scope.directiveID;
                        scope.liSortID2 = "li_2" + "_" + scope.directiveID;
                    });

                    //根据检索值预制类型，设置输入框是否能输入数字
                    if (scope.filtertype == "double" || scope.filtertype == "int") {
                        scope.filterFindEntity.searchType = "range";
                        $(element).find(".filter_input").attr("type", "number")
                        $(tsgPanel).find(".filter_text").html("数字检索");
                    } else if (scope.filtertype == "boolean") {
                        scope.filterFindEntity.searchType = "equal";
                        scope.filterFindEntity.searchOne = "true";
                        $(element).find(".filter_input").attr("type", "boolean")
                        $(tsgPanel).find(".filter_text").html("布尔检索");
                    }
                    else {
                        scope.filterFindEntity.searchType = "regExp";
                        $(element).find(".filter_input").attr("type", "text")
                        $(tsgPanel).find(".filter_text").html("文本检索");
                    }


                    //点击小箭头过滤面版
                    $(element).find(".tsg_btns .btn:eq(0)").click(function (event) {
                        //先把页面上所有的过滤面板隐藏掉
                        $(".grid_filter_panel .tsg_panel").each(function () {
                            $(this).hide();
                        });
                        //var tsgPanel = $(this).parent().parent().find(".tsg_panel:eq(0)");
                        //计算过滤面板的top 当前按钮的top + 当前按钮的height - 最上边头部的50偏移 + 当前按钮上下边线
                        //$log.log($(".view_product:eq(0)").scrollTop());

                        //如果是在弹出层里面
                        if ("_popWindow" == scope.parentId) {
                            var $ngdialog = $(".ngdialog-content:eq(0)");
                            var $ngdialogOffset = $ngdialog.offset();

                            //tsgPanelTop = $(this).offset().top - $(".ngdialog:eq(0)").scrollTop() + $(".view_topbar").height() - $ngdialogOffset.top;
                            tsgPanelTop = $(this).offset().top - $ngdialogOffset.top + $(this).height() + 2;
                            tsgPanelLeft = $(this).offset().left - $ngdialogOffset.left;


                        } else {

                            var tsgPanelTop = $(this).offset().top + $(this).height() - $(".view_topbar").height() + $(".view_product:eq(0)").scrollTop() + 1;
                            //计算过滤面版的left 当前按钮的Left -  左边树的宽度
                            var tsgPanelLeft = $(this).offset().left - $(".report_view_leftside").width() - 1;
                            //判断，如果当前显示的left超出窗口宽度，则减去超出偏移量
                            if (tsgPanelLeft + tsgPanel.width() > $(window).width() - $(".report_view_leftside").width() - 20) {
                                tsgPanelLeft = tsgPanelLeft - ((tsgPanelLeft + tsgPanel.width()) - ($(window).width() - $(".report_view_leftside").width() - 20));
                            }



                            //如果在 group 里面，减去 group 的偏移 
                            if (scope.parentId && scope.parentId != "undefined") {
                                //console.log(tsgPanelTop);
                                //console.log(tsgPanelLeft);
                                var $parentDiv = $("#" + scope.parentId);
                                var offset = $parentDiv.offset();
                                var offLeft = offset.left - $(".report_view_leftside").width() - 1;
                                var offTop = offset.top + $(".view_product:eq(0)").scrollTop() - $(".view_topbar").height();
                                tsgPanelTop -= offTop;
                                tsgPanelLeft -= offLeft;
                            }



                            //如果弹出层已超出窗口宽度，则反向
                            if (tsgPanelLeft + tsgPanel.width() > $(window).width()) {
                                tsgPanelLeft -= tsgPanel.width();
                            }
                        }
                        tsgPanel.css("top", tsgPanelTop + "px");
                        tsgPanel.css("left", tsgPanelLeft + "px");

                        $(element).find(".filter_input:eq(0)").focus();

                        //给过滤面板绑定事件，防止事件冒泡
                        $(tsgPanel).bind("click", function (event) {
                            //  阻止事件冒泡
                            event.stopPropagation();
                        });

                        //给document添加事件，执行取消面板操作
                        $(document).one("click", function () {
                            //
                            scope.$apply(function () {
                                scope.btn_QuXiao_OnClick();
                            });
                        });

                        tsgPanel.fadeIn();
                        //防止事件冒泡
                        event.stopPropagation();
                    });
                }
            };


        };

        superApp.controller("gridFilterController", gridFilterController);
        gridFilterController.$inject = ["$scope", "$log", "$state", "$window", "$compile", "ajaxService", "toolService"];
        function gridFilterController($scope, $log, $state, $window, $compile, ajaxService, toolService) {
            $scope.placeholderOne = "请输入您要查询的关键字";
            $scope.placeholderTwo = "请输入您要查询的关键字";
            //是否范围查询标识
            var element = null;
            var tableObj = null;
            var tsgPanel = null;
            //获取当前指令的element对象，由指令的link赋值
            //延迟获取
            setTimeout(function () {
                //$log.log($scope.iconName);
                element = $scope.thisElement;
                //获取对应列表对象
                tableObj = $("#" + $scope.tableid);
                //确定过滤面版对象
                tsgPanel = $(element).find(".tsg_panel:eq(0)");

            }, 10);


            $scope.tempFindEntity = {
                filterName: "",                         //查询字段名字
                filternamezh: "",                       //查询字段中文
                filtertype: "",                         //查询字段类型
                searchType: "",                         //查询类型
                searchOne: "",                          //查询内容1
                searchTwo: "",                          //查询内容2
                isTopFilter: false                      //是否上层查询条件，直接影响页面翻译查询条件内容，当为True时不翻译
            }
            //确定按钮点击事件
            $scope.btn_QueDing_OnClick = function () {
                if ($scope.filterFindEntity.searchOne == null) $scope.filterFindEntity.searchOne = "";
                if ($scope.filterFindEntity.searchTwo == null) $scope.filterFindEntity.searchTwo = "";

                $scope.QueDing_CallEvent();
            };

            //调用外部事件方法，用于设置当前查询实体信息
            $scope.QueDing_CallEvent = function () {
                if ($scope.filterFindEntity.searchOne == null) $scope.filterFindEntity.searchOne = "";
                if ($scope.filterFindEntity.searchTwo == null) $scope.filterFindEntity.searchTwo = "";

                $scope.filterFindEntity.filterName = $scope.filterName;
                $scope.filterFindEntity.filternamezh = $scope.filternamezh;
                $scope.filterFindEntity.filtertype = $scope.filtertype;
                //$scope.filterFindEntity.isSort = false;

                //点击确定按钮后，保留中间查询参数
                $scope.tempFindEntity.searchType = $scope.filterFindEntity.searchType;
                $scope.tempFindEntity.searchOne = $scope.filterFindEntity.searchOne;
                $scope.tempFindEntity.searchTwo = $scope.filterFindEntity.searchTwo;
                $scope.tempFindEntity.filterName = $scope.filterFindEntity.filterName;
                $scope.tempFindEntity.filternamezh = $scope.filterFindEntity.filternamezh;
                $scope.tempFindEntity.filtertype = $scope.filterFindEntity.filtertype;
                $scope.tempFindEntity.isTopFilter = $scope.filterFindEntity.isTopFilter;

                //设置对应过滤按钮图标
                //如果输入了查询信息，则证明要进行条件查询
                if ($scope.filterFindEntity.searchOne != "" || $scope.filterFindEntity.searchTwo != "") {
                    QueDing_ChangeFilterBtnCss("sort_filter");
                }
                else {
                    QueDing_ChangeFilterBtnCss("sort_arrow");
                }


                //判断当前过滤面板下的排序是否被选中，如果被选中则置当前查询实体的 isSort = true，并设置 sortName信息
                //$log.log($(tsgPanel).find(".filter_sort").hasClass("active"));
                if ($(tsgPanel).find(".filter_sort").hasClass("active")) {
                    //如果有被选中的
                    $scope.filterFindEntity.isSort = true;
                    $scope.filterFindEntity.sortName = $scope.filterName;
                    //$scope.filterFindEntity.sortType  不用赋值，已经在排序按钮点击时赋值了
                }
                else {
                    $scope.filterFindEntity.isSort = false;
                    $scope.filterFindEntity.sortName = "";
                    $scope.filterFindEntity.sortType = "";
                }
                $scope.callback({ arg1: $scope.filterFindEntity });

                $(tsgPanel).fadeOut();
            }

            //根据查询条件字符串，判断当前过滤按钮的样式，并进行变换
            function QueDing_ChangeFilterBtnCss(cssStr) {
                //正在表达式
                var sortRegExp = null;
                var nowFilterBtn = $(element).find(".btn_filter .sort_icn:eq(0)");

                var nowFilterBtn_Css = $(nowFilterBtn).attr("class");
                //先过滤出有排序样式的按钮
                var isChangeCss = false;
                //如果没有任何查询条件，则需要判断对应的过滤按钮当前图标状态
                sortRegExp = new RegExp("(asc)");
                if (sortRegExp.test(nowFilterBtn_Css)) {
                    $(nowFilterBtn).removeClass();
                    isChangeCss = true;
                    $(nowFilterBtn).addClass("sort_icn " + cssStr + "_asc");
                }
                else {
                    $(nowFilterBtn).removeClass();
                    isChangeCss = true;
                    sortRegExp = new RegExp("(desc)");
                    if (sortRegExp.test(nowFilterBtn_Css)) {
                        $(nowFilterBtn).addClass("sort_icn " + cssStr + "_desc");
                    }
                    else {
                        $(nowFilterBtn).addClass("sort_icn " + cssStr);
                    }
                }

                //再判断在没有排序情况下，即三角情况下变成filter
                if (!isChangeCss) {
                    //在变换样式没有标识的情况下，再进行一次判断
                    sortRegExp = new RegExp("(arrow)");
                    if (sortRegExp.test(nowFilterBtn_Css)) {
                        $(nowFilterBtn).removeClass();
                        $(nowFilterBtn).addClass("sort_icn " + cssStr);
                    }
                }
            }

            //取消按钮点击事件
            $scope.btn_QuXiao_OnClick = function () {
                if ($scope.tempFindEntity.searchType == "") $scope.tempFindEntity.searchType = "equal";
                $scope.filterFindEntity.searchType = $scope.tempFindEntity.searchType;
                $scope.filterFindEntity.searchOne = $scope.tempFindEntity.searchOne;
                $scope.filterFindEntity.searchTwo = $scope.tempFindEntity.searchTwo;
                $scope.filterFindEntity.filterName = $scope.tempFindEntity.filterName;
                $scope.filterFindEntity.filternamezh = $scope.tempFindEntity.filternamezh;
                $scope.filterFindEntity.filtertype = $scope.tempFindEntity.filtertype;
                $scope.filterFindEntity.isTopFilter = $scope.tempFindEntity.isTopFilter;
                $(tsgPanel).fadeOut();
            };

            //清空查询条件按钮点击事件
            $scope.btn_QingKong_OnClick = function () {
                //清空中间存储区数据
                //$scope.tempFindEntity.searchType = "equal";
                $scope.tempFindEntity.searchOne = "";
                $scope.tempFindEntity.searchTwo = "";
                $scope.tempFindEntity.filterName = "";
                $scope.tempFindEntity.filternamezh = "";
                //$scope.tempFindEntity.filtertype = "";
                $scope.tempFindEntity.isTopFilter = "";
                //清空查询实体数据
                //if ($scope.tempFindEntity.searchType == "") $scope.tempFindEntity.searchType = "equal";
                $scope.filterFindEntity.searchType = $scope.tempFindEntity.searchType;
                $scope.filterFindEntity.searchOne = $scope.tempFindEntity.searchOne;
                $scope.filterFindEntity.searchTwo = $scope.tempFindEntity.searchTwo;
                $scope.filterFindEntity.filterName = $scope.tempFindEntity.filterName;
                $scope.filterFindEntity.filternamezh = $scope.tempFindEntity.filternamezh;
                $scope.filterFindEntity.filtertype = $scope.tempFindEntity.filtertype;
                $scope.filterFindEntity.isTopFilter = $scope.tempFindEntity.isTopFilter;
                //调用确定按钮点击事件
                $scope.btn_QueDing_OnClick();
            };

            //查询类型OnChange事件
            $scope.ddl_SearchType_OnChange = function () {
                //$log.log($scope.filterFindEntity.searchType);
                //var tbxOneObj = $($scope.element).find(".filterOne:eq(0)");
                //var tbxTwoObj = $($scope.element).find(".filterTwo:eq(0)");
                $(element).find(".filter_input:eq(0)").focus();
                switch ($scope.filterFindEntity.searchType) {
                    case "equal":
                        $scope.placeholderOne = "请输入您要查询的关键字";
                        break;
                    case "$ne":
                        $scope.placeholderOne = "请输入您要查询的关键字";
                        break;
                    case "regExp":
                        $scope.placeholderOne = "模糊查询，只需要输入您要检索的部分内容";
                        break;
                    case "$in":
                        $scope.placeholderOne = "查询多个值，请用“英文逗号”或“回车”分开\n温馨提示：当您已经确认要筛选的基因点时，可将Excel中基因点的列值圈中拷贝即可进行检索！";
                        break;
                    case "$gt":
                        $scope.placeholderOne = "请输入您要查询的关键字";
                        break;
                    case "$lt":
                        $scope.placeholderOne = "请输入您要查询的关键字";
                        break;
                    case "$lte":
                        $scope.placeholderOne = "请输入您要查询的关键字";
                        break;
                    case "$gte":
                        $scope.placeholderOne = "请输入您要查询的关键字";
                        break;
                    case "range":
                        $scope.placeholderOne = "请输入开始值";
                        $scope.placeholderTwo = "请输入结束值";
                        break;
                    default:
                        $scope.placeholderOne = "请输入您要查询的关键字";
                        break;
                };
            };

        }
    });

