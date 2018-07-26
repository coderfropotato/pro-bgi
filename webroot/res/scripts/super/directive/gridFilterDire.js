/*

模块名称：gridFilterDire
整理时间：2016-06-20
功能简介：表格查询指令

*/

define("superApp.gridFilterDire", ["angular", "super.superMessage", "select2"],
    function(angular, SUPER_CONSOLE_MESSAGE) {
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
                    callback: "&", // 开始筛选按钮回调方法，一般为父页面的获取对应表格的方法，将传回查询实体
                },
                templateUrl: SUPER_CONSOLE_MESSAGE.localUrl.girdFilterPath,
                replace: false,
                transclude: true,
                controller: "gridFilterController",
                link: function(scope, element, attrs) {
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
                        // 接受外部查询参数
                    scope.searchType = attrs.searchtype;
                    scope.searchOne = attrs.searchone;
                    scope.geneidtruekey = attrs.geneidtruekey;

                    scope.filterFindEntity = {
                        filterName: scope.filterName, //查询字段名字
                        filternamezh: scope.filternamezh, //查询字段中文
                        filtertype: scope.filtertype, //查询字段类型 filtertype：datetime、 string、double [default]、int、boolean（新增的布尔筛选）
                        isSort: false, //是否排序标识
                        sortName: "", //排序字段名称
                        sortType: "", //排序类型
                        searchType: "equal", //查询类型
                        searchOne: "", //查询内容1
                        searchTwo: "", //查询内容2
                        isTopFilter: false //是否上层查询条件，直接影响页面翻译查询条件内容，当为True时不翻译
                    };

                    scope.tempFindEntity = {
                        filterName: "", //查询字段名字
                        filternamezh: "", //查询字段中文
                        filtertype: "", //查询字段类型
                        searchType: "equal", //查询类型
                        searchOne: "", //查询内容1
                        searchTwo: "", //查询内容2
                        isTopFilter: false //是否上层查询条件，直接影响页面翻译查询条件内容，当为True时不翻译
                    }


                    scope.directiveID = attrs.id;

                    var tableObj = $("#" + scope.tableid);
                    //确定过滤面版对象
                    var tsgPanel = $(element).find(".tsg_panel:eq(0)");
                    //初始化小箭头样式
                    $(element).find(".tsg_btns .btn .sort_icn:eq(0)").addClass(attrs.icon);

                    //给所有的li编id
                    $(tableObj).find(".tsg_panel").each(function(index) {
                        scope.liSortID1 = "li_1" + "_" + scope.directiveID;
                        scope.liSortID2 = "li_2" + "_" + scope.directiveID;
                    });

                    //根据检索值预制类型，设置输入框是否能输入数字
                    scope.isFirst = true;
                    computedPanelText();

                    function computedPanelText() {
                        if (scope.filtertype == "double" || scope.filtertype == "int") {
                            scope.filterFindEntity.searchType = "range";
                            $(element).find(".filter_input").attr("type", "number")
                            $(tsgPanel).find(".filter_text").html("数字检索");
                        } else if (scope.filtertype == "boolean") {
                            scope.filterFindEntity.searchType = "equal";
                            scope.filterFindEntity.searchOne = "true";
                            $(element).find(".filter_input").attr("type", "boolean")
                            $(tsgPanel).find(".filter_text").html("布尔检索");
                        } else {
                            scope.filterFindEntity.searchType = "regExp";
                            $(element).find(".filter_input").attr("type", "text")
                            $(tsgPanel).find(".filter_text").html("文本检索");
                        }

                    }


                    // 应用自定义查询条件
                    if (scope.searchOne && scope.filterFindEntity.filterName === scope.geneidtruekey) {
                        scope.filterFindEntity.searchOne = scope.searchOne;
                        scope.filterFindEntity.searchType = scope.searchType;
                    }
                    //点击小箭头过滤面版
                    $(element).find(".tsg_btns .btn:eq(0)").click(function(event) {
                        // 重新获取所有筛选面板的数据类型，避免增删列导致的
                        var filtType = $(this).parents('.grid_filter_panel').attr('filtertype');
                        scope.filtertype = filtType;
                        scope.tempFindEntity.filtertype = scope.filterFindEntity.filtertype = filtType;
                        if (scope.isFirst) {
                            computedPanelText();
                            scope.tempFindEntity.searchType = scope.filterFindEntity.searchType;
                            scope.isFirst = false;

                            // 如果是外部触发就用外面的类型 只有第0个（geneid）才需要应用外面的类型
                            // 搜索参数存在 并且是第零个
                            var index = scope.thisElement.index('#' + scope.tableid + ' .grid-filter');
                            if (scope.searchOne != undefined && scope.searchOne != null && scope.searchOne != '' && !index) {
                                scope.tempFindEntity.searchType = scope.filterFindEntity.searchType = scope.searchType;
                            }

                            switch (scope.filterFindEntity.searchType) {
                                case "equal":
                                    scope.placeholderOne = "请输入您要查询的关键字";
                                    break;
                                case "$ne":
                                    scope.placeholderOne = "请输入您要查询的关键字";
                                    break;
                                case "regExp":
                                    scope.placeholderOne = "模糊查询，只需要输入您要检索的部分内容";
                                    break;
                                case "$in":
                                    scope.placeholderOne = "查询多个值，请用“英文逗号”或“回车”分开\n温馨提示：当您已经确认要筛选的基因点时，可将Excel中基因点的列值圈中拷贝即可进行检索！";
                                    break;
                                case "$gt":
                                    scope.placeholderOne = "请输入您要查询的关键字";
                                    break;
                                case "$lt":
                                    scope.placeholderOne = "请输入您要查询的关键字";
                                    break;
                                case "$lte":
                                    scope.placeholderOne = "请输入您要查询的关键字";
                                    break;
                                case "$gte":
                                    scope.placeholderOne = "请输入您要查询的关键字";
                                    break;
                                case "range":
                                    scope.placeholderOne = "请输入最小值";
                                    scope.placeholderTwo = "请输入最大值";
                                    break;
                                default:
                                    scope.placeholderOne = "请输入您要查询的关键字";
                                    break;
                            };
                        }
                        scope.$apply();

                        //先把页面上所有的过滤面板隐藏掉
                        $(".grid_filter_panel .tsg_panel").each(function() {
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
                        $(tsgPanel).bind("click", function(event) {
                            //  阻止事件冒泡
                            event.stopPropagation();
                        });

                        //给document添加事件，执行取消面板操作
                        $(document).one("click", function() {
                            //
                            scope.$apply(function() {
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
        gridFilterController.$inject = ["$scope", "$timeout", "$log", "$state", "$window", "$compile", "ajaxService", "toolService"];

        function gridFilterController($scope, $timeout, $log, $state, $window, $compile, ajaxService, toolService) {
            $scope.placeholderOne = "请输入您要查询的关键字";
            $scope.placeholderTwo = "请输入您要查询的关键字";
            //是否范围查询标识
            var element = null;
            var tableObj = null;
            var tsgPanel = null;
            //获取当前指令的element对象，由指令的link赋值
            //延迟获取
            setTimeout(function() {
                //$log.log($scope.iconName);
                element = $scope.thisElement;
                //获取对应列表对象
                tableObj = $("#" + $scope.tableid);
                //确定过滤面版对象
                tsgPanel = $(element).find(".tsg_panel:eq(0)");

            }, 10);


            // $scope.tempFindEntity = {
            //     filterName: "", //查询字段名字
            //     filternamezh: "", //查询字段中文
            //     filtertype: "", //查询字段类型
            //     searchType: "", //查询类型
            //     searchOne: "", //查询内容1
            //     searchTwo: "", //查询内容2
            //     isTopFilter: false //是否上层查询条件，直接影响页面翻译查询条件内容，当为True时不翻译
            // }

            // 触发自定义查询参数的点击事件
            $timeout(function() {
                if ($scope.searchOne && $scope.filterFindEntity.filterName == $scope.geneidtruekey) {
                    $scope.btn_QueDing_OnClick();
                }
            }, 30);

            //确定按钮点击事件
            $scope.btn_QueDing_OnClick = function() {
                if ($scope.filterFindEntity.searchOne == null) $scope.filterFindEntity.searchOne = "";
                if ($scope.filterFindEntity.searchTwo == null) $scope.filterFindEntity.searchTwo = "";

                $scope.QueDing_CallEvent();
            };

            //调用外部事件方法，用于设置当前查询实体信息
            $scope.QueDing_CallEvent = function() {
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

                // reset searchone
                // if ($scope.searchOne && $scope.filterFindEntity.filterName == $scope.geneidtruekey) {
                //     $scope.filterFindEntity.searchOne = '';
                // }
                //设置对应过滤按钮图标
                //如果输入了查询信息，则证明要进行条件查询
                if ($scope.filterFindEntity.searchOne != "" || $scope.filterFindEntity.searchTwo != "") {
                    QueDing_ChangeFilterBtnCss("sort_filter");
                } else {
                    QueDing_ChangeFilterBtnCss("sort_arrow");
                }


                //判断当前过滤面板下的排序是否被选中，如果被选中则置当前查询实体的 isSort = true，并设置 sortName信息
                //$log.log($(tsgPanel).find(".filter_sort").hasClass("active"));
                if ($(tsgPanel).find(".filter_sort").hasClass("active")) {
                    //如果有被选中的
                    $scope.filterFindEntity.isSort = true;
                    $scope.filterFindEntity.sortName = $scope.filterName;
                    $scope.filterFindEntity.sortnamezh = $scope.filternamezh;
                    //$scope.filterFindEntity.sortType  不用赋值，已经在排序按钮点击时赋值了
                } else {
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
                } else {
                    $(nowFilterBtn).removeClass();
                    isChangeCss = true;
                    sortRegExp = new RegExp("(desc)");
                    if (sortRegExp.test(nowFilterBtn_Css)) {
                        $(nowFilterBtn).addClass("sort_icn " + cssStr + "_desc");
                    } else {
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
            $scope.btn_QuXiao_OnClick = function() {
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
            $scope.btn_QingKong_OnClick = function() {
                //清空中间存储区数据
                //$scope.tempFindEntity.searchType = "equal";
                $scope.tempFindEntity.searchOne = "";
                $scope.tempFindEntity.searchTwo = "";
                $scope.tempFindEntity.filterName = "";
                $scope.tempFindEntity.filternamezh = "";
                //$scope.tempFindEntity.filtertype = "";
                $scope.tempFindEntity.isTopFilter = "";
                //清空查询实体数据
                // if ($scope.tempFindEntity.searchType == "") $scope.tempFindEntity.searchType = "equal";
                // $scope.filterFindEntity.searchType = $scope.tempFindEntity.searchType;
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
            $scope.ddl_SearchType_OnChange = function() {
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
                        $scope.placeholderOne = "请输入最小值";
                        $scope.placeholderTwo = "请输入最大值";
                        break;
                    default:
                        $scope.placeholderOne = "请输入您要查询的关键字";
                        break;
                };
            };

            //排序按钮点击事件
            $scope.li_Sort_OnClick = function(e, sortType, objId) {
                //正在表达式
                var sortRegExp = null;
                //第一步：
                //首先将tableObj下，清除其他过滤面板下的对应样式
                //那就判断所有的排序按钮用包含排序样式的图标，去掉排序
                $(tableObj).find(".btn_filter").each(function() {
                    var sortSpanObj = $(this).find(".sort_icn:eq(0)");
                    sortRegExp = new RegExp("(asc|desc)");
                    var sortSpan_Css = $(sortSpanObj).attr("class");
                    //先过滤出有排序样式的按钮
                    if (sortRegExp.test(sortSpan_Css)) {
                        //在判断当前按钮样式
                        //如果是：sort_filter_asc or sort_filter_desc，则替换成 sort_filter
                        sortRegExp = new RegExp("(filter_asc|filter_desc)");
                        if (sortRegExp.test(sortSpan_Css)) {
                            //先清除
                            $(sortSpanObj).removeClass();
                            //再添加
                            $(sortSpanObj).addClass("sort_icn sort_filter");
                            return false;
                        }
                        //如果是：sort_arrow_asc or sort_arrow_desc，则替换成 sort_arrow
                        sortRegExp = new RegExp("(arrow_asc|arrow_desc)");
                        if (sortRegExp.test(sortSpan_Css)) {
                            //先清除
                            $(sortSpanObj).removeClass();
                            //再添加
                            $(sortSpanObj).addClass("sort_icn sort_arrow");
                            return false;
                        }
                    }

                });

                //获取当前点击排序对应的过滤按钮
                var nowFilterBtn = $(element).find(".tsg_btns .btn .sort_icn:eq(0)");
                var nowFilterBtn_Css = $(nowFilterBtn).attr("class");
                //判断，当前过滤按钮的样式是否包含 sort_filter or sort_filter_asc or sort_filter_desc
                //如果包含，就清除，并添加对应排序样式
                sortRegExp = new RegExp("(filter)");
                if (sortRegExp.test(nowFilterBtn_Css)) {
                    //先清除
                    $(nowFilterBtn).removeClass();
                    //再添加
                    $(nowFilterBtn).addClass("sort_icn sort_filter_" + sortType);
                }


                //第二步：
                //判断，当前过滤按钮的样式是否包含 sort_arrow or sort_arrow_asc or sort_arrow_desc
                //如果包含，就清除，并添加对应排序样式
                sortRegExp = new RegExp("(arrow)");
                if (sortRegExp.test(nowFilterBtn_Css)) {
                    //先清除
                    $(nowFilterBtn).removeClass();
                    //再添加
                    $(nowFilterBtn).addClass("sort_icn sort_arrow_" + sortType);
                }

                //第三步：
                //设置面板中的当前选中状态
                $(tableObj).find(".tsg_panel .tsg_menu .filter_sort").removeClass("active");
                $("#" + objId).addClass("active");

                //设置排序类型
                //$scope.filterFindEntity.filterName = $scope.filterName;
                $scope.filterFindEntity.sortType = sortType;
                //$scope.filterFindEntity.isSort = true;

                $scope.QueDing_CallEvent();
            };
        }

        /*
         ** 创建人：高洪涛
         ** 创建日期：2016年5月29日01:45:27
         ** 功能说明：开始调用 Grid查询指令
         ** 返回类型：无
         ** 调用方法：<div class="grid-filter-begin" tableid="table_cyjy" callback="GetDiffList(arg1)" callbackname="GetDiffList"></div>
         ** 参数：tableid：对应列表的ID名称   callback：回调浏览页页面的方法信息，返回查询实体     callbackname：回调方法名
         ** 说明：pageFindEntity结果中，必须要 pageFindEntity{searchContentList:[]}结构
         **
         **
         **
         **Update:2018年5月23日15:55:46
         **
         ** tips:如果涉及到的searchOne比较大 建议用自定义事件传参:见用法3
         ** targetController   <div class="grid-filter-begin" tableid... event-name="eventName"></div> 
         ** directiveController $scope.$on($scope.eventName,function(event,params){console.log(params)})
         **
         **用法（基础）1
         **<div class="grid-filter-begin"  tableid="table_jybdl" callback="InitFindEntity(arg1)" parentid="panel_jybdl"></div>
         **
         **用法2:根据geneidtruekey(需要从指令外部触发筛选的表头true_key) 目前只改变搜索条件的searchOne searchType
         **<div class="grid-filter-begin" tablehead="bigTableData.baseThead" tableid="{{tableId}}" callback="InitFindEntity1(arg1)" parentid="{{contentId}}" search-type="geneidCustomSearchType" geneidtruekey="geneid_truekey" search-one="geneidCustomSearchOne" filter-status-callback="handlerFilterStatusChange(status)"></div>
         ** 如果searchOne默认undefined或者null 运行逻辑跟基础用法一样
         **
         **用法3:在2的基础上优化searchOne过大的情况,用自定义事件来传递searchOne
         **<div class="grid-filter-begin" event-name="eventName" tablehead="bigTableData.baseThead" tableid="gene-annotation001001-2_bigTable" callback="InitFindEntity1(arg1)" parentid="panel_gene-annotation001001-2_table" search-type="geneidCustomSearchType" geneidtruekey="geneid_truekey" filter-status-callback="handlerFilterStatusChange(status)"></div>
         ** 默认传了eventName 自定义事件的参数 用来改变指令内部searchOne的值
         */
        superApp.directive('gridFilterBegin', gridFilterBegin);
        gridFilterBegin.$inject = ["$log"];

        function gridFilterBegin($log) {
            return {
                restrict: "ACE",
                scope: {
                    callback: "&", //开始筛选按钮回调方法，一般为父页面的获取对应表格的方法，将传回查询实体
                    clearFilter: "=", //关闭筛选
                    searchOne: "=",
                    searchType: "=",
                    tablehead: '=', // 表格数据，用来动态watch表格增删  修改筛选状态
                    geneidtruekey: "=",
                    eventName: "=", // 手动接受改变的searchOne的自定义事件名
                    filterStatusCallback: "&" // 是否筛选中，定义外部布局样式
                },
                template: " <button class=\"new-table-switch-btns noborder tool-tip\"  ng-click=\"btn_ShaXuan_OnClick()\" ng-class=\"{active:shaiXuanIsActive}\" title=\"筛选\">" +
                    "                    <span class=\"iconfont icon-shaixuan\"></span></button>",
                replace: false,
                transclude: true,
                controller: "gridFilterBeginController",
                link: function(scope, element, attrs) {
                    scope.parentId = attrs.parentid
                    scope.tableid = attrs.tableid;
                    //回调方法名称，供动态输出筛选面板diretive使用
                    scope.callbackname = attrs.callback.substring(0, attrs.callback.indexOf("("));
                    //scope.btn_ShaXuan_OnClick();
                    scope.apply;
                }
            };
        };

        superApp.controller("gridFilterBeginController", gridFilterBeginController);
        gridFilterBeginController.$inject = ["$scope", "$timeout", "$log", "$state", "$window", "$compile", "ajaxService", "toolService"];

        function gridFilterBeginController($scope, $timeout, $log, $state, $window, $compile, ajaxService, toolService) {
            $scope.clearFilter = function() {
                //清空
                $scope.shaiXuanIsActive = true;
                $scope.filterStatusCallback && $scope.filterStatusCallback({ status: $scope.shaiXuanIsActive });
                $scope.btn_ShaXuan_OnClick();
            }

            // 检查table数据变动，改变新数据的筛选状态
            // Add:2018年3月23日14:27:04
            $scope.$watch('tablehead', function(newValue, oldValue) {
                // dom渲染完再渲染
                $timeout(function() {
                    if (!newValue) return;
                    if (!angular.equals(newValue, oldValue)) {
                        var flag = !oldValue ? true : newValue.length > oldValue.length;
                        if ($scope.shaiXuanIsActive) {
                            if (flag) {
                                var count = oldValue ? oldValue.length : 0;
                                var dis = newValue.length - count;
                                var gridPanel = $("#" + $scope.tableid);
                                for (var i = count; i < newValue.length; i++) {
                                    var el = $(gridPanel).find(".grid_filter_panel").eq(i);
                                    $scope.compileTemplate(el, i);
                                }
                            }
                        }
                    }
                }, 30)
            }, true);

            // watch searchOne default ''
            if ($scope.searchOne != undefined && $scope.searchOne != null) {
                $scope.$watch('searchOne', function(newVal, oldVal) {
                    if (!angular.equals(newVal, oldVal)) {
                        if (newVal) {
                            $timeout(function() {
                                var curPanel = $("#" + $scope.tableid).find(".grid_filter_panel").eq(0);
                                $scope.compileTemplate(curPanel, 0);
                            }, 30);
                        }
                    }
                }, true);
            }

            // 没有searchOne 就手动emit  eventName限制
            if ($scope.eventName != undefined && $scope.eventName != null) {
                $scope.$on($scope.eventName, function(event, listStr) {
                    // 如果liststr为空  那就不需要重新编译
                    if (listStr) {
                        $scope.searchOne = listStr;
                        $timeout(function() {
                            var curPanel = $("#" + $scope.tableid).find(".grid_filter_panel").eq(0);
                            $scope.compileTemplate(curPanel, 0);
                        }, 30);
                    } else {
                        $scope.searchOne = '';
                    }
                })
            }

            // 编译模板
            // Modified:2018年3月23日14:27:40
            $scope.compileTemplate = function(el, index) {
                var tempDirHtmlStr = "";
                var $directiveObj = null;
                //查询字段名称
                var filtername = el.attr("filtername");
                //查询字段中文
                var filternamezh = el.attr("filternamezh");
                //查询字段类型 filtertype：datetime、 string、double、int、boolean（新增）
                var filtertype = el.attr("filtertype");

                // 接受自定义参数
                var searchType = el.attr('searchtype');
                var searchOne = el.attr('searchone');
                if (filtertype == undefined) filtertype = "double";
                var filterDireID = "div_filterDire_" + $scope.tableid + "_" + index;

                tempDirHtmlStr += " <div id=\"" + filterDireID + "\" class=\"grid-filter\" " +
                    " filtername=\"" + filtername + "\" " +
                    " filternamezh=\"" + filternamezh + "\" " +
                    " filtertype=\"" + filtertype + "\" ";

                if ($scope.searchOne != undefined && $scope.searchOne != null) {
                    tempDirHtmlStr += " searchtype=\"" + $scope.searchType + "\" " +
                        " searchone=\"" + $scope.searchOne + "\" ";
                }

                tempDirHtmlStr += " geneidtruekey=\"" + $scope.geneidtruekey + "\" " +
                    " callback=\"" + $scope.callbackname + "(arg1)\" " +
                    " parentid=\"" + $scope.parentId + "\" " +
                    " icon=\"sort_arrow\" tableid=\"" + $scope.tableid + "\"></div>";
                $directiveObj = $(tempDirHtmlStr);

                // 清除原来的结构 加了表格监听以后隐藏列的时候没有清空，所以新增的时候清空一下，避免出错。
                // Add：2018年3月23日14:30:08 
                el.html('');

                el.append($directiveObj);
                angular.element(document).injector().invoke(["$compile", function($compile) {
                    var as = angular.element($directiveObj).scope();
                    $compile($directiveObj)(as);
                }]);
            }


            //筛选按钮点击事件
            $scope.btn_ShaXuan_OnClick = function() {
                $scope.shaiXuanIsActive = !$scope.shaiXuanIsActive;
                $scope.filterStatusCallback && $scope.filterStatusCallback({ status: $scope.shaiXuanIsActive });

                //获取grid对象
                var gridPanel = $("#" + $scope.tableid);
                if ($scope.shaiXuanIsActive) {
                    //动态循环grid里面的指令面板，并动态输出指令
                    $(gridPanel).find(".grid_filter_panel").each(function(index) {
                        $scope.compileTemplate($(this), index);
                        //$log.log(filtername);
                    });
                    //$("#" + $scope.tableid).find(".btn_filter").css("visibility", "visible");
                } else {
                    $(gridPanel).find(".grid_filter_panel").each(function(index) {
                        $(this).html("");
                    });
                    try {
                        //调用父类查询事件
                        //$scope.$parent.GetDiffList(null);
                        $scope.callback({ arg1: null });
                    } catch (e) {}
                    //$("#" + $scope.tableid).find(".btn_filter").css("visibility", "hidden");
                }
            };
        }


    });