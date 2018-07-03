//require(["jQueryEasyUi"]);
define("superApp.superDire",
    ["angular", "super.superMessage", "select2"],
    function (angular, SUPER_CONSOLE_MESSAGE) {
        var superApp = angular.module("superApp.superDire", []);

        //动态加载框架头
        superApp.directive('superFrameTop', superFrameTopDirective);
        superFrameTopDirective.$inject = ["$log"];
        function superFrameTopDirective($log) {
            return {
                restrict: "ACE",
                templateUrl: SUPER_CONSOLE_MESSAGE.localUrl.topPath,
                replace: false,
                transclude: false,
                scope: {
                    isbodyshow: "=",
                    topactiveindex: "="
                },
                controller: "frameTopCtr"
                //link: superFrameTopLink
            };

            //function superFrameTopLink(scope, element, attrs) {
            //    //通过AJax获取信息，获取登录授权信息等
            //    scope.applyTitle = SUPER_CONSOLE_MESSAGE.ayyleName.orderMangerTitle;
            //}
        }

        superApp.controller("frameTopCtr", frameTopCtr);
        frameTopCtr.$inject = ["$rootScope", "$scope", "$log", "$state", "$window", "ajaxService", "toolService"];
        function frameTopCtr($rootScope, $scope, $log, $state, $window, ajaxService, toolService) {
            ////初始化应用中心切换按钮状态
            //$scope.isShowTopMenu = false;
            //$scope.btn_ShowTopMenu = function (isShow)
            //{
            //    $scope.isShowTopMenu = isShow;
            //}

            /* 控制顶部用户下拉菜单显示 */
            //$scope.topUserInfo_IsOpen = true;

            $scope.isTest = $rootScope.isTest;

            $scope.topNav_UserInfo_OnMouseEnter = function () {
                $scope.topUserInfo_IsOpen = true;
            }
            $scope.topNav_UserInfo_OnMouseLeave = function () {
                $scope.topUserInfo_IsOpen = false;
            }

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

            //判断，如果token不存在则执行返回登录页
            //$scope.isbodyshow = true;
            $scope.isbodyshow = ajaxService.validateWindowToken();
            if (!$scope.isbodyshow) {
                window.location.href = "../login/login.html";
            }


            $scope.userInfoEntity = toolService.GetUserInfoEntity();

            $scope.LoginOut = function () {
                $window.sessionStorage.token = "";
                $window.sessionStorage.userInfoEntity = undefined;
                window.location.href = "../login/login.html";
            };
            $scope.EditPassword = function (url) {
                var parms = "EditPassword";
                $state.go(url, { flag: parms });
            };
            $scope.EditUser = function (url) {
                var parms = "EditUser";
                $state.go(url, { flag: parms });
            };
            $scope.UpdatePasswordManger = function () {
                toolService.sessionStorage.set("IsUpdatePassword", "true");
                $state.go("mangerconsole/userCenter");
            };
            $scope.myFile_OnClick = function () {
                var routerName = "userconsole/userFileList";
                var parms = encodeURI($scope.userInfoEntity.UploadFilesRootPath);
                $state.go(routerName, { FILEKEY: parms });
            }
        }


        //动态加载框架头
        superApp.directive('superMangerFrameTop', superMangerFrameTopDirective);
        superMangerFrameTopDirective.$inject = ["$log"];
        function superMangerFrameTopDirective($log) {
            return {
                restrict: "ACE",
                templateUrl: SUPER_CONSOLE_MESSAGE.localUrl.mangerTopPath,
                replace: false,
                transclude: false,
                scope: {
                    isbodyshow: "=",
                    topactiveindex: "="
                },
                controller: "mangerFrameTopCtr"
                //link: superFrameTopLink
            };

            //function superFrameTopLink(scope, element, attrs) {
            //    //通过AJax获取信息，获取登录授权信息等
            //    scope.applyTitle = SUPER_CONSOLE_MESSAGE.ayyleName.orderMangerTitle;
            //}
        }

        superApp.controller("mangerFrameTopCtr", mangerFrameTopCtr);
        mangerFrameTopCtr.$inject = ["$rootScope", "$scope", "$log", "$state", "$window", "ajaxService", "toolService"];
        function mangerFrameTopCtr($rootScope, $scope, $log, $state, $window, ajaxService, toolService) {
            ////初始化应用中心切换按钮状态
            //$scope.isShowTopMenu = false;
            //$scope.btn_ShowTopMenu = function (isShow)
            //{
            //    $scope.isShowTopMenu = isShow;
            //}


            $scope.isTest = $rootScope.isTest; //是否测试版

            /* 控制顶部用户下拉菜单显示 */
            //$scope.topUserInfo_IsOpen = true;
            $scope.topNav_UserInfo_OnMouseEnter = function () {
                $scope.topUserInfo_IsOpen = true;
            }
            $scope.topNav_UserInfo_OnMouseLeave = function () {
                $scope.topUserInfo_IsOpen = false;
            }

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

            //判断，如果token不存在则执行返回登录页
            $scope.isbodyshow = true;
            //$scope.isbodyshow = ajaxService.validateWindowToken();
            //if (!$scope.isbodyshow) {
            //    window.location.href = "../login/login.html";
            //}


            $scope.userInfoEntity = toolService.GetUserInfoEntity();

            $scope.LoginOut = function () {
                $window.sessionStorage.token = "";
                $window.sessionStorage.userInfoEntity = undefined;
                window.location.href = "../login/login.html";
            }

            $scope.myFile_OnClick = function () {
                var routerName = "userconsole/userFileList";
                var parms = encodeURI($scope.userInfoEntity.YHID + "^uploadFiles^");
                $state.go(routerName, { FILEKEY: parms });
            }
            $scope.EditPassword = function (url) {
                var parms = "EditPassword";
                $state.go(url, { flag: parms });
            };
            $scope.EditUser = function (url) {
                var parms = "EditUser";
                $state.go(url, { flag: parms });
            };
        }


        /*
        ** 创建人：高洪涛
        ** 创建日期：2015-12-16
        ** 功能简介：框架一级树指令
        */
        superApp.directive('superFrameLeft', superFrameLeftDirective);
        superFrameLeftDirective.$inject = ["$log"];
        function superFrameLeftDirective($log) {
            return {
                restrict: "ACE",
                replace: false,
                transclude: false,
                controller: "frameLeftCtr",
                scope: {
                    leftDataJson: "=",
                    isViewFull: "=",
                    isActiveName: "="
                },
                templateUrl: SUPER_CONSOLE_MESSAGE.localUrl.leftPath,
                //template: "<div style='color:#fff;'><br/><br/>内部：{{leftDataJson}}</div>",
                link: function superFrameLeftDirectiveLink(scope, element, attrs) {
                }
            };
        };

        superApp.controller("frameLeftCtr", frameLeftCtr);
        frameLeftCtr.$inject = ["$rootScope", "$scope", "$log", "$state", "ajaxService"];
        function frameLeftCtr($rootScope, $scope, $log, $state, ajaxService) {
            //二级节点展开与关闭事件
            $scope.LeftNav_Toggle = function (event, item) {
                item.folded = !item.folded;
            };

            $scope.sidebarFold_OnClick = function (event, item) {
                $scope.isViewFull = !$scope.isViewFull;
                //触发窗口大小改变事件 16-01-11
                //angular.element(window);
                setTimeout(function () {
                    $(window).resize();
                }, 100);
            };

            //功能树点击方法
            $scope.li_OnClick = function (event, item) {
                //$log.debug("item.urlView : " + angular.isString(item.urlView));

                if ($rootScope.selectItems != undefined) {
                    $rootScope.selectItems.length = 0;
                }
                else {
                    //$rootScope.selectItems = [];
                }
                if (item.LYLJ != "") {
                    $state.go(item.LYLJ);
                }
                else if (item.LJLJ != "") {
                    window.location.href = item.LJLJ;
                }
            };

            //监听选中信息
            $scope.$watch("isActiveName", function (newVal) {
                if (angular.isDefined(newVal)) {
                    setTimeout(function () {
                        $scope.$apply(function () {
                            angular.forEach($scope.leftDataJson, function (leftListitem, index, array) {
                                if (leftListitem.GNSID == newVal) {
                                    leftListitem.isActive = true;
                                }
                                else {
                                    leftListitem.isActive = false;
                                }
                            });
                        });
                    }, 200);
                }
            }, true);
        }

        /*
        ** 创建人：高洪涛
        ** 创建日期：2015-12-16
        ** 功能简介：根据PID获得子节点filter
        */
        superApp.filter("checkPidFilter", checkPidFilter);
        checkPidFilter.$inject = ["$log"];
        function checkPidFilter($log) {
            return function (input, pid) {
                //var args = Array.prototype.slice.call(arguments);
                //console.log("arguments=", params);

                if (isNaN(input)) {
                    var output = [];
                    angular.forEach(input, function (item, index, array) {
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

        /*  
        **  创建人：高洪涛
        **  创建日期：2016年6月15日16:07:52
        **  功能简介：小数点精度过滤
        */
        superApp.filter("accuracyFilter", accuracyFilter);
        accuracyFilter.$inject = ["$log", "toolService"];
        function accuracyFilter($log, toolService) {
            return function (input, accuracy) {
                if (accuracy == -1) return input;
                if (!isNaN(input)) {
                    //var reg = /^[-\+]?\d+(\.\d+)?$/;
                    var f = parseFloat(input);
                    if (isNaN(f)) {
                        return input;
                    }
                    else {
                        return toolService.toAccuracy(input, accuracy);
                    }
                }
                else {
                    return input;
                }
            }
        };

        superApp.filter('exponentialFilter', exponentialFilter);
        exponentialFilter.$inject = ['$log'];
        function exponentialFilter($log) {
            return function (input, accuracy) {
                if (accuracy == -1 || isNaN(input)) {                   // 查询全数据或者过滤项不是数字的情况，直接返回
                    return input;
                }
                if (input > 1e8) {
                    return input.toExponential(accuracy);
                }
                if (input.toExponential(accuracy) % 1 === 0) {          // 特殊处理，对于处理后为整数的情况，返回四舍五入的整数值
                    return Math.round(input.toExponential(accuracy));
                }
                return input.toExponential(accuracy);                   // 返回指定精度的指数计数
            }
        }

        superApp.filter('backFilter', backFilter);
        backFilter.$inject = ['$log'];
        function backFilter($log) {
            return function (input, someChar) {
                if (isNaN(input) || input == null) {
                    return input;
                }
                return input + someChar;
            }
        }

        superApp.filter('intersectionReplaceFilter', intersectionReplaceFilter);
        intersectionReplaceFilter.$inject = ['$log', '$sce'];
        function intersectionReplaceFilter($log, $sce) {
            return function (input) {
                return $sce.trustAsHtml(input.replace(/∩/g, '<span style=\"color: red;\">∩</span>'));
            }
        }

        superApp.filter('backFilter', backFilter);
        backFilter.$inject = ['$log'];
        function backFilter($log) {
            return function (input, someChar) {
                if (isNaN(input) || input == null) {
                    return input;
                }
                return input + someChar;
            }
        }

        // filter  按照特定的表头字段 把对应的内容转成分段的锚点并找出id
        superApp.filter('orderTheadToAnchor', orderTheadToAnchor);
        orderTheadToAnchor.$inject = ['$log', '$sce'];
        function orderTheadToAnchor($log, $sce) {
            return function (input, thead, compareGroup, method, reanalysisId,row) {
                var str = '';
                if (thead == 'kegg_subject_annotation' || thead == 'desc_kegg' || thead === 'kegg_desc') {
                    // 用； 切出大段
                    var list = input.split(';');
                    list.forEach(function (d, i) {
                        if (d.length && d) {
                            if (/\+/g.test(d)) {
                                // 有小段
                                var index = 0;
                                var l = d.split('+');
                                l.forEach(function (m, z) {
                                    if (/K\d+/g.test(m)) {
                                        if (index) {
                                            str += '<a class="k-number" target="_blank" href="https://www.kegg.jp/dbget-bin/www_bget?ko:' + m.split('//')[0] + '">' + m + '</a>';
                                        } else {
                                            str += '<a class="k-number" target="_blank" href="https://www.kegg.jp/dbget-bin/www_bget?ko:' + m.split('//')[0] + '">' + m + '</a>';
                                        }
                                        index++;
                                    } else {
                                        // 没有k号  就找出ko  https://www.kegg.jp/kegg-bin/show_pathway?ko04320
                                        str += '&emsp;<a class="ko-number" target="_blank" href="https://www.kegg.jp/kegg-bin/show_pathway?' + m.split('//')[0] + '">' + m + '</a>'
                                    }
                                })
                            } else {
                                // 没有小段  有K     只有:  K09100//single-minded; 
                                if (/^K/.test($.trim(d))) {
                                    str += '<a class="k-number" target="_blank" href="https://www.kegg.jp/dbget-bin/www_bget?ko:' + d.match(/K\d+/g) + '">' + d + '</a>';
                                } else if(/ko/g.test($.trim(d))) {
                                    // 没有小段没有k号  就找出ko  https://www.kegg.jp/kegg-bin/show_pathway?ko04320
                                    str += '&emsp;<a class="ko-number" target="_blank" href="https://www.kegg.jp/kegg-bin/show_pathway?' + d.split('//')[0] + '">' + d + '</a>'
                                }else{
                                    str+='<span>'+d+'</span>';
                                }
                            }
                        }
                    })
                } else if (thead === 'kegg_term_mix') {
                    // 根据LCID、ko、比较组、软件信息，跳转报告自带html
                    // ko03022//Basal transcription factors;ko05016//Huntington's disease;ko05168//Herpes simplex infection;ko04550//Signaling pathways regulating pluripotency of stem cells
                    var list = input.split(';');
                    list.forEach(function (val, index) {
                        if (val.length && $.trim(val)) {
                            // ../tools/index.html#/home/mapId?map={{item.id}}&comparegroup={{pageFindEntity.compareGroup}}&method={{method}}
                            str += '<a class="mapid" target="_blank" href="../../../../ps/tools/index.html#/home/mapId?map=' + val.split('//')[0].substring(2) + '&comparegroup=' + compareGroup + '&method=' + method + '" >' + val + '</a>';
                        }
                    })
                } else if (thead === 'kegg_term_mix_tools') {
                    // 跳转官网固定链接  
                    var list = input.split(';');
                    list.forEach(function (val, index) {
                        if (val.length && $.trim(val)) {
                            str += '<a class="ko-number" target="_blank" href="https://www.kegg.jp/kegg-bin/show_pathway?' + val.split('//')[0] + '">' + val + '</a>';
                        }
                    })

                } else if (thead === 'kegg_term_id') {
                    // ko03022  跳map
                    // 报告根据比较组和method  小工具根据重分析id
                    if (reanalysisId) {
                        // 有重分析id就用id
                        str += '<a class="mapid" target="_blank" href="../../../../ps/tools/index.html#/home/mapId?map=' + val.split('//')[0].substring(2) + '&taskId=' + reanalysisId + '" >' + val + '</a>';
                    } else {
                        // 没有就是报告内部跳转mapid
                        str += '<a class="mapid" target="_blank" href="../../../../ps/tools/index.html#/home/mapId?map=' + val.split('//')[0].substring(2) + '&comparegroup=' + compareGroup + '&method=' + method + '" >' + val + '</a>';
                    }
                } else if (thead.indexOf('kegg_term_mix_') != -1) {
                    // kegg_term_mix_dsaq131s5a4fq1
                    // 根据LCID、ko、任务ID，跳转重分析生成的html
                    var list = input.split(';');
                    list.forEach(function (val, index) {
                        if (val.length && $.trim(val)) {
                            var flag = index == 0 ? '' : ';';
                            str += '<a class="mapid" target="_blank" href="../../../../ps/tools/index.html#/home/mapId?map=' + val.split('//')[0].substring(2) + '&taskId=' + reanalysisId + '"  title="' + val.split('//')[0].substring(2) + '">' + flag + val + '</a>';
                        }
                    })
                } else if (thead === 'go_term_id') {
                    // 直接跳官网
                    // go_term(GO:123)
                    str += '<a class="go-number" href="http://amigo.geneontology.org/amigo/term/' + val + '">' + val + '</a>';
                } else if (thead === 'desc_go' || thead === 'go_desc' || thead === 'go_subject_annotation') {
                    // 没有 []
                    var list = input.split(';');
                    var index = 0;
                    list.forEach(function (val, index) {
                        if (val.length && $.trim(val)) {
                            // (val.match(/GO:\w+/))[0] val.split('//')[0]
                            str += '<a href="http://amigo.geneontology.org/amigo/term/' + (val.match(/GO:\w+/))[0] + '" target="_blank">' + val + '</a>';
                        }
                    })
                } else if (thead === 'go_term_mix' || thead === 'go_term_mix_tools' || thead.indexOf('go_term_mix_') != -1) {
                    //官网 [] 换行
                    // ['[p]GO:55156//DASDSADASDA','GO:1515Q//12312'] 
                    var list = input.split(';');
                    list.forEach(function (val, index) {
                        if (val.length && $.trim(val)) {
                            // 有 []
                            var flagtext = index == 0 ? "" : ";";
                            if (/\[([\s\S]*)\]/g.test(val)) {
                                var flag = val.match(/\[([\s\S]*)\]/g);
                                var s = val.split(flag);
                                str += '<span>' + flag + '</span>';
                                str += '<a href="http://amigo.geneontology.org/amigo/term/' + s[s.length - 1].split('//')[0] + '" target="_blank">' + flagtext + s[s.length - 1] + '</a>';
                            } else {
                                str += '<a href="http://amigo.geneontology.org/amigo/term/' + val.split('//')[0] + '" target="_blank">' + flagtext + val + '</a>';
                            }
                        }
                    })
                } else if(thead === 'tf_family'){
                    str+='<a href="'+row['tf_db_link']+'" target="_blank">'+input+'</a>'
                }
                return $sce.trustAsHtml(str);
            }

        }

        /*
        ** 创建人：高洪涛
        ** 创建日期：2015-12-16
        ** 功能简介：框架二级树指令
        */
        superApp.directive('superFrameChildLeft', superFrameChildLeftDirective);
        superFrameChildLeftDirective.$inject = ["$log"];
        function superFrameChildLeftDirective($log) {
            return {
                restrict: "ACE",
                replace: false,
                transclude: false,
                controller: "frameChildLeftCtr",
                scope: {
                    childLeftDataJson: "=",
                    isViewChildLeft: "="
                },
                templateUrl: SUPER_CONSOLE_MESSAGE.localUrl.childLeftPath,
                //template: "<div style='color:#fff;'><br/><br/>内部：{{leftDataJson}}</div>",
                link: function superFrameChildLeftDirectiveLink(scope, element, attrs) {
                }
            };
        };

        superApp.controller("frameChildLeftCtr", frameChildLeftCtr);
        frameChildLeftCtr.$inject = ["$scope", "$log", "$state", "ajaxService"];
        function frameChildLeftCtr($scope, $log, $state, ajaxService) {
            //此变量控制中间边栏收起按钮状态,设置默认
            $scope.isNavbarClose = false;

            //中间边栏收起/打开按钮点击事件
            $scope.btn_milldSide_OnClcik = function () {
                $scope.isViewChildLeft = !$scope.isViewChildLeft;
                $scope.isNavbarClose = !$scope.isNavbarClose
            };

            //功能树点击方法
            $scope.li_OnClick = function (event, item) {
                //$log.debug("item.urlView : " + angular.isString(item.urlView));
                if (item.LYLJ != "") {
                    $state.go(item.LYLJ);
                }
                else if (item.LJLJ != "") {
                    window.location.href = item.LJLJ;
                }
            };

        }

        /*
        ** 创建人：高洪涛
        ** 创建日期：2016-1-4
        ** 功能简介：验证提示框，使用Angular原生的验证指令
        */
        superApp.directive('superValidate', superValidateDirective);
        superValidateDirective.$inject = ["$log"];
        function superValidateDirective($log) {
            return {
                restrict: "ACE",
                link: function (scope, element, attrs) {
                    $element = $(element);
                    var direction = attrs["superValidateDirection"] ? attrs["superValidateDirection"] : "bottom";
                    $wrap = $element.wrap("<span class='myvalidate-wrap myvalidate-wrap-" + direction + "'></span>").parent();
                    $wrap.append("<span class='myvalidate-wrap-tips'>" + attrs["superValidate"] + "</span>");
                    $element.off("mouseover mouseout mouseleave blur keydown change");
                    $element.on("blur input change", function () {
                        $this = $(this);
                        //setTimeout(function () {
                        $this.addClass("zmax");
                        if (!$this.hasClass('my-form-invaild')) {
                            if (($this.hasClass('ng-invalid') && $this.hasClass('ng-touched'))) {
                                //$this.parent().addClass('show');
                                //$this.parent().find(".myvalidate-wrap-tips").stop().fadeTo('fast', 1.0);
                            }
                        }

                        /* 如果是select标签，并使用了 select2 组件
                        if ($this[0].tagName == "SELECT" || $this[0].tagName == "select") {
                        $this.parent().removeClass('show'); //点击后不弹出提示框，因为无法触发关闭事件
                        var $select2 = $this.prev();
                        if ($select2.hasClass("select2-container")) {
                        $select2.off("mouseover mouseenter keyup change mouseout mouseleave blur");
                        $select2.on("mouseenter", function () {
                        var $this = $(this);
                        //alert($this.parent().html());
                        if (($this.hasClass('ng-invalid') && $this.hasClass('ng-touched')) || $this.hasClass('my-form-invaild')) {
                        //$this.parent().addClass("show");
                        $this.parent().find(".myvalidate-wrap-tips").stop().fadeTo('fast', 1.0);
                        } else {
                        //$this.parent().removeClass("show");
                        $this.parent().find(".myvalidate-wrap-tips").stop().fadeTo('fast', 0.0, function () { $(this).hide(); });
                        }
                        });
                        $select2.on("mouseleave", function () {
                        var $this = $(this);
         
                        //$this.parent().removeClass("show");
                        $this.parent().find(".myvalidate-wrap-tips").stop().fadeTo('fast', 1.0);
                        });
                        }
                        } */

                    });
                    /*
                    $element.on("mouseover", function () {
         
                    $this = $(this);
                    $this.addClass("zmax");
                    if (($this.hasClass('ng-invalid') && $this.hasClass('ng-touched'))) {
                    $this.parent().find(".myvalidate-wrap-tips").stop().fadeTo('fast', 1.0);
                    }
         
                    });
                    $element.on("mouseout mouseleave blur", function () {
                    $this = $(this);
                    $this.removeClass("zmax");
                    //$this.parent().removeClass('show');
                    $this.parent().find(".myvalidate-wrap-tips").stop().fadeTo('fast', 0.0, function () { $(this).hide(); });
                    });*/
                }
            }
        }


        /*
        ** 创建人：高洪涛
        ** 创建日期：2016-1-4
        ** 功能简介：验证提示框，使用Angular原生的验证指令
        */
        superApp.directive('superTips', superTipsDirective);
        superTipsDirective.$inject = ["$log"];
        function superTipsDirective($log) {
            return {
                restrict: "ACE",
                link: function (scope, element, attrs) {
                    $element = $(element);
                    $wrap = $element.wrap("<span class='super-tips-wrap'></span>").parent();
                    $wrap.append("<span class='super-tips-show'></span>");
                    $wrap.hover(function () {
                        $this = $(this);
                        $this.find(".super-tips-show:eq(0)").html($this.find("span:eq(0)").text());
                        $this.addClass("zmax");
                        $this.addClass('show');
                    }, function () {
                        $this = $(this);
                        $this.removeClass("zmax");
                        $this.removeClass('show');
                    });
                }
            }
        }

        /*
        ** 创建人：高洪涛
        ** 创建日期：2016-1-4
        ** 功能简介：验证提示框，使用Angular原生的验证指令
        */
        superApp.directive("superPageLoading", superPageLoadingDirective);
        superPageLoadingDirective.$inject = ["$log"];
        function superPageLoadingDirective($log) {
            return {
                restrict: "ACE",
                scope: {
                    loading: "="
                },
                template: "<div class='ngdialog ngdialog-theme-default ngdialog-loading ng-scope hideDialog' ng-class='{showDialog:loading}'>"
                    + "        <div class='ngdialog-overlay'></div>"
                    + "        <div id='ngdialog-content' class='ngdialog-content my-ngdialog-content' style='width: 110px; height: auto' >"
                    + "            <div class='ngdialog-message'>"
                    + "                <div id='loader-inner'class='loader-inner line-scale'>"
                    + "                    <div></div>"
                    + "                    <div></div>"
                    + "                    <div></div>"
                    + "                    <div></div>"
                    + "                    <div></div>"
                    + "                </div>"
                    + "                <p id='ngdialog1-aria-describedby' tabindex='-1' style='outline: 0px;'>"
                    + "                    正在处理...</p>"
                    + "            </div>"
                    + "            <div class='ngdialog-close'></div>"
                    + "        </div>"
                    + "    </div>",
                link: function (scope, element, attrs) {
                    var _timer = null;
                    scope.$watch("loading", function (newVal) {
                        if (newVal) {
                            _timer = setTimeout(function () {
                                $("#ngdialog-content").width(200);
                                $("#ngdialog1-aria-describedby").html("系统长时间没有响应，请点击<br/><a href=\"JavaScript:;\" onclick=\"OutLinkCallBack('$scope.CloseDialog','')\">[关闭]</a>&nbsp;&nbsp;重试。");
                            }, 15000);
                        }
                        else {
                            clearTimeout(_timer);
                            $("#ngdialog-content").width(110);
                            $("#ngdialog1-aria-describedby").html("正在处理...");
                        }
                    }, true);
                },
                controller: ["$rootScope", "$scope", "$log", "$element", "toolService", function ($rootScope, $scope, $log, $element, toolService) {
                    $scope.CloseDialog = function () {
                        $("#ngdialog-content").width(110);
                        $("#ngdialog1-aria-describedby").html("正在处理...");
                        $rootScope.loading = false;
                    }
                }]
            }
        }

        /*
        ** 创建人：高洪涛
        ** 创建日期：2016-1-5
        ** 功能简介：下拉列表 
        */
        superApp.directive('superSelect', superSelectDirective);
        superSelectDirective.$inject = ["$log"];
        function superSelectDirective($log) {
            return {
                restrict: "ACE",
                scope: {
                    config: "=",
                    ngModel: "=",
                    outText: "=",
                    select2Model: "="
                },
                link: function (scope, element, attrs) {
                    var searchFlag = -1;
                    if (angular.isDefined(attrs["isSearch"])) {
                        searchFlag = (attrs["isSearch"] == "true") ? 1 : -1;
                    }

                    // 初始化
                    var tagName = element[0].tagName;
                    var config = {
                        /*allowClear: true,*/ //是否出现删除按钮
                        multiple: !!attrs.multiple,
                        minimumResultsForSearch: searchFlag,
                        placeholder: attrs.placeholder || " "   // 修复不出现删除按钮的情况
                    };

                    // 生成select
                    if (tagName === "SELECT") {
                        // 初始化
                        var $element = $(element);
                        delete config.multiple;

                        $element
                            .prepend("<option value=''></option>")
                            //.val("")
                            .select2(config);

                        $element.on("change", function () {
                            scope.outText = $element.select2("data").text;
                        });

                        // model - view
                        scope.$watch("ngModel", function (newVal) {
                            if (newVal == undefined) {
                                //$log.log(newVal);
                                return;
                            }
                            else {
                                setTimeout(function () {
                                    $element.find("[value^='?']").remove();    // 清除错误的数据
                                    $element.select2("val", newVal);
                                }, 0);
                            }
                        }, true);
                        return false;
                    }

                    // 处理input
                    if (tagName === "INPUT" && angular.isDefined(scope.config)) {
                        // 初始化
                        var $element = $(element);

                        // 获取内置配置
                        if (attrs.query) {
                            scope.config = select2Query[attrs.query]();
                        }

                        // 动态生成select2
                        scope.$watch("config", function () {
                            angular.extend(config, scope.config);
                            $element.select2("destroy").select2(config);
                        }, true);

                        // view - model
                        $element.on("change", function () {
                            scope.$apply(function () {
                                scope.select2Model = $element.select2("data");
                            });
                        });

                        // model - view
                        scope.$watch("select2Model", function (newVal) {
                            $element.select2("data", newVal);
                        }, true);

                        // model - view
                        scope.$watch("ngModel", function (newVal) {
                            // 跳过ajax方式以及多选情况
                            if (config.ajax || config.multiple) { return false }

                            $element.select2("val", newVal);
                        }, true);
                    }
                }
            }
        };

        /*
        ** 创建人：高洪涛
        ** 创建日期：2016-1-11
        ** 功能简介：浏览列表 Jquery - EasyUI - Grid 
        ** 调用示例：
        **      <div class="super-easy-ui-grid" grid-data="gridData" grid-config="gridConfig" grid="gridObj" showloading="gridShowLoading" hideloading="gridHideLoading">
        **          <table id='div_grid'></table>
        **      </div>
        ** 前提约定：当前 Controller 要实现 SearchData() 方法
        ** Controller端调用说明：
        1、设置config文件，请查看API中的gridOptions的项，可覆盖
        $scope.gridConfig =
        {
        gridOptions:
        {
        columns: 
        [[
        { field: 'ck', width: 15, checkbox: true },
        { field: 'rowIndex', title: '序号', width: 100 },
        { field: 'userName', title: '姓名', width: 400 },
        { field: 'userAge', title: '年龄', width: 200 }
        ]]
        }
        };
        2、设置grid数据源，格式：{total: "1554", pageNum: "1", pageSize: "30", rows: [{}]}
        $scope.gridData = responseData;
        3、帮助：http://www.cnblogs.com/qixuejia/p/3818704.html
         
        superApp.directive('superEasyUiGrid', superEasyUiGridDirective);
        superEasyUiGridDirective.$inject = ["$log"];
        function superEasyUiGridDirective($log) {
         
        //内部选中变量:{{gridData.selectedItems}}
        var templateStr = "<table class='easyui-datagrid'></table><div id='div_footPage' class='foot-page'></div>";
        var gridObj =
        {
        restrict: "ACE",
        scope: {
        gridData: "=",          //Grid的Json数据
        gridConfig: "=",        //表格初始化的参数设置
        grid: "=",              //Grid对外公布的自身Obj，Jquery对象
        showloading: "=",       //Grid的加载等待框，通过监听方式进行显示，如果外界想显示等待样式，符一个不重复的随机数
        hideloading: "="        //隐藏Grid加载等待框，原理同上
        },
        template: templateStr,
        controller: ["$rootScope", "$scope", "$log", "$element", "$compile", "pagerService",
        function ($rootScope, $scope, $log, $element, $compile, pagerService) {
        //将对象转换成jquery对象
        var eleObj = $($element);
        var footObj = eleObj.find(".foot-page:eq(0)");
        var gridObj = eleObj.find("table:eq(0)");
        $scope.tbxPageNum = 1;
         
        eleObj.css("position", "relative");
         
        var gridOptions = {
        //height: 500,
        //width: "auto",
        iconCls: 'icon-edit', //图标 
        loadMsg: '请稍候，正在加载数据...',
        rownumbers: false, //行号 
        nowrap: false,
        striped: false,
        border: true,
        //fit: true, //自动大小
        singleSelect: false,
        //autoRowHeight: true,
        pagination: false,
        remoteSort: false,
        scrollbarSize: 0,
        fitColumns: false,
        //multiSort:true,
        striped: true, //斑马线
        pageSize: 30
        };
        if ($scope.gridConfig == undefined) {
        eleObj.html("<div class='alert alert-info' role='alert'><strong>哦，对不起！</strong>当您看到这个警示信息时，说明当前页面发生未知错误，请及时联系系统管理员！</div>");
        return;
        }
        angular.extend(gridOptions, $scope.gridConfig.gridOptions);
         
        var dataGridObj = gridObj.datagrid(gridOptions);
         
        function dataGridObjResize(dataGridObj, gridObj) {
        var w = eleObj.width();
        dataGridObj.datagrid("resize", { width: w });
        }
        $(window).bind("resize", function () {
        dataGridObjResize(dataGridObj, gridObj);
        });
         
         
        //setTimeout(function ()
        //{
        //    dataGridObjResize(dataGridObj, gridObj);
        //}, 600);
         
        gridObj.datagrid(gridOptions);
        $scope.grid = gridObj;
         
        //var newsListPager = new Pager("newsListPager");
        var nowIndexPage = 1;
        //调用外部加载数据方法
        $scope.GoToPage = function (page) {
        if (page != undefined) {
        if (parseInt(page) <= 0) {
        page = 1;
        }
         
        var pageCount = Math.ceil($scope.gridData.total / $scope.gridData.pageSize);
        $scope.tbxPageNum = page = (page > pageCount) ? pageCount : page;
         
        if (nowIndexPage != page) {
         
        }
        //ShowLoadingPanel();
        nowIndexPage = page;
         
         
        if (parseInt(page) > pagerService.options.pageCount) {
        page = pagerService.options.pageCount;
        }
        pagerService.options.pageNum = page;
        }
        $scope.$parent.SearchData(page);
        }
         
        //调整页面输入框的KeyUp事件
        $scope.tbxPageNumKeyup = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
        $scope.GoToPage($scope.tbxPageNum);
        }
        };
         
        var pageHtmlStr = "";
        var $footPage = null;
        //监控数据是否发生变化，重新加载grid数据
        $scope.$watch("gridData", function (newVal) {
        if (!angular.isObject(newVal)) return;
        if (newVal.total == 0) {
        pagerService.ClearPage();
        footObj.html("<div style='color:red;'>对不起，没有检索到您想要的信息！</div>");
        gridObj.datagrid('loadData', { total: 0, rows: [] });
        return;
        }
         
        gridObj.datagrid('loadData', newVal.rows);
        footObj.html("");
        pagerService.ClearPage();
        //设置分页
        pagerService.options.total = newVal.total;
        pagerService.options.dataPanel = gridObj;
        pagerService.options.pageSize = newVal.pageSize;
        pagerService.options.pageNum = newVal.pageNum;
        pageHtmlStr = pagerService.InitPager(footObj, ((new Date()).getTime()), "left");
        //手工编译Angular
        $footPage = $(pageHtmlStr);
        footObj.append($footPage);
        angular.element(document).injector().invoke(function ($compile) {
        var as = angular.element($footPage).scope();
        $compile($footPage)(as);
        });
        HideLoadingPanel();
        }, true);
         
        //监听显示等待框标识，如果变动则执行显示
        $scope.$watch("showloading", function (newVal) {
        ShowLoadingPanel();
        }, true);
         
        //监听显示等待框标识，如果变动则执行隐藏
        $scope.$watch("hideloading", function (newVal) {
        HideLoadingPanel();
        }, true);
         
         
        var gridModel = null;
         
        function ShowLoadingPanel() {
        if ($rootScope.loading) return;
        if (gridModel == null) {
        gridModel = document.createElement("div");
        }
         
        eleObj.append(gridModel);
        gridModel.className = "gridModal";
        gridModel.innerHTML = "<div class='alert alert-info loadingText'>正在加载...</div>";
        }
         
        function HideLoadingPanel() {
        if (gridModel != null) {
        $(gridModel).remove();
        }
        }
        } ]
        };
        return gridObj
        };
        */

        /*
        ** 创建人：高洪涛
        ** 创建日期：2016-1-16
        ** 功能简介：div拖动事件
        ** 调用示例：<div draggable></div>
        ** 前提约定：当前div样式必须是浮动的
        */
        superApp.directive('draggable', draggableDirective);
        draggableDirective.$inject = ["$log", "$document"];
        function draggableDirective($log, $document) {
            return function (scope, element, attr) {
                var startX = 0, startY = 0, x = 0, y = 0;
                //element.css(
                //{
                //    position: 'relative',
                //    border: '1px solid red',
                //    backgroundColor: 'lightgrey',
                //    cursor: 'pointer'
                //});
                element.bind('mousedown', function (event) {

                    startX = event.screenX - x;
                    startY = event.screenY - y;
                    $document.bind('mousemove', mousemove);
                    $document.bind('mouseup', mouseup);
                });

                function mousemove(event) {
                    y = event.screenY - startY;
                    x = event.screenX - startX;
                    element.parent().css(
                        {
                            top: y + 'px',
                            left: x + 'px'
                        });
                }

                function mouseup() {
                    $document.unbind('mousemove', mousemove);
                    $document.unbind('mouseup', mouseup);
                }
            }
        };

        /*
        ** 创建人：高洪涛
        ** 创建日期：2016-1-16
        ** 功能简介：查询条件中录入框的OnKeyUp回车事件，自动回调当前Controller的SearchData()方法
        ** 调用示例：<input search-keyup callback="SearchData(arg1)" ng-model="findEntity.ym_number" class="form-control" type="text" placeholder="产品编号" />
        ** 前提约定：当前 Controller 要实现 SearchData() 或其他获取数据 方法
        */
        superApp.directive('searchKeyup', searchKeyupDirective);
        searchKeyupDirective.$inject = ["$log", "$document"];
        function searchKeyupDirective($log, $document) {
            return {
                restrict: "ACE",
                replace: false,
                transclude: false,
                scope: {
                    callback: "&"           //分页控件的回调事件，一般为父页面的 SearchData(pageNumber) 方法
                },
                link: function (scope, element, attr) {
                    $(element).bind('keyup', function (e) {
                        var keycode = window.event ? e.keyCode : e.which;
                        if (keycode == 13) {
                            scope.callback({ arg1: 1 });
                            //如果回车，调用父Controller的查询事件
                            //scope.SearchData(1);
                        }
                    });
                }
            }
        };

        /*
        ** 创建人：高洪涛
        ** 创建日期：2016-1-16
        ** 功能简介：修改页面保存按钮面板浮动效果
        ** 调用示例：<div class="pagePanel-footer" fix-footer> ... </div> 
        ** 前提约定：相对框架页面内容页面滚动的div浮动，这里用Jquery 获取了这个div的样式 super-frame-main 作为对象传输
        */
        superApp.directive("fixFooter", fixFooterDirective);
        fixFooterDirective.$inject = ["$rootScope", "$log", "$document", "$window"];
        function fixFooterDirective($rootScope, $log, $document, $window) {

            var footObj =
            {
                restrict: "ACE",
                link: function (scope, element, attr) {
                    //获取最外层panel对象，模板页路由视图外围对象，有滚动条样式的对象
                    var scollObj = $(".super-frame-main");

                    scollObj.bind("scroll", function () {
                        SetFooterBottom();
                    });
                    var $eleObj = $(element);
                    var jsObj_Top = $eleObj.offset().top;
                    var jsObj_Height = $eleObj.height();
                    SetFooterBottom();
                    function SetFooterBottom() {
                        //var letSideWidth = $(".view_leftside").width();//获取左边宽度
                        var scrollTop = scollObj.scrollTop();
                        var winHeight = $($window).height();
                        //$log.log("scrollTop:" + scrollTop);
                        //$log.log("winHeight:" + winHeight);
                        //$log.log("$element.height:" + jsObj_Height);
                        //$log.log("$element.top:" + jsObj_Top);
                        //if (scrollTop + winHeight - jsObj_Height < jsObj_Top)
                        if (scrollTop + winHeight < jsObj_Top) {
                            $eleObj.addClass("footer-fix");
                            //$eleObj.css("padding-left", (letSideWidth+14)+"px");
                        }
                        else {
                            $eleObj.removeClass("footer-fix");
                            //$eleObj.css("padding-left", "15px");
                        }
                    }
                }
            };
            return footObj
        };


        /*
        ** 创建日期：2016-1-29
        ** 功能简介：使一个左|右浮动的 DIV 高度直通到底
        */
        superApp.directive('divFullHeight', divFullHeightDirective);
        divFullHeightDirective.$inject = ["$log"];
        function divFullHeightDirective($log) {
            return {
                restrict: "ACE",
                link: function (scope, element, attrs) {
                    var $parentElement = $("." + attrs["parentElement"] + ":eq(0)");
                    $element = $(element);
                    $element.css("min-height", '0');
                    var maxHeight = Math.max($(window).height() - 60, $parentElement.height());

                    $element.css("min-height", maxHeight + 10 + 'px');
                    $(window).unbind("resize");
                    $(window).bind("resize", function () {
                        $element.css("min-height", '0');
                        var maxHeight = Math.max($(window).height() - 60, $parentElement.height());
                        $element.css("min-height", maxHeight + 10 + 'px');
                    })
                }
            }
        };


        /*
        ** 创建日期：2016-2-1
        ** 功能简介：使一DIV 相对另一个 DIV　做浮动
        ** 参数：为 fix-panel 传入一个 json 格式字符串。  target：相对 DIV 的 CLASS名称，position: 浮动是居左还是居右 (left|right), top：浮动的高度, div_scroll: 出滚动条的 DIV 的 CLASS 名称
        */
        superApp.directive('fixPanel', fixPanelDirective);
        fixPanelDirective.$inject = ["$log"];
        function fixPanelDirective($log) {
            return {
                restrict: "ACE",
                link: function (scope, element, attrs) {

                    var fixOptions = eval('(' + attrs["fixPanel"] + ')');


                    var $window = $(window);
                    var $element = $(element);
                    var $targetElement = $("." + fixOptions.target + ":eq(0)");
                    var $divScroll = $("." + fixOptions.div_scroll + ":eq(0)");
                    var _position = fixOptions.position;
                    var _top = fixOptions.top;

                    $element.parent().css({ "position": "relative" });
                    //$element.css({ "position": "fixed" });

                    $divScroll.bind("scroll", function () {

                        var _difHeight = $targetElement.height() - $element.height() + parseInt($element.parent().css("margin-top")) - parseInt($element.parent().css("padding-top"));

                        // $(".topbar_logo").html($targetElement.height() + ";" + $divScroll.scrollTop() + ";" + _difHeight);

                        if ($divScroll.scrollTop() > _difHeight) {
                            $element.css({ "position": "absolute", "bottom": "0" });
                        } else {
                            $element.css({ "position": "fixed", "bottom": "auto" });
                        }

                    })
                }
            }
        };

        superApp.directive("repeatDone", repeatDoneDirective);
        repeatDoneDirective.$inject = ["$log"];
        function repeatDoneDirective($log) {
            return {
                link: function (scope, element, attrs) {
                    if (scope.$last) {                   // 这个判断意味着最后一个 OK
                        scope.$eval(attrs.repeatDone)    // 执行绑定的表达式
                    }
                }
            }
        };


        /*
        ** 创建日期：2016-2-4
        ** 创建人：高洪涛
        ** 功能简介：自画table分页控件
        ** 参数：gridData: "=",          //Grid的Json数据
        isNoData: "=",          //是否有数据标识，直接影响父页面是否显示没有数据提示框标识
        side: "@",              //分页信息的居左、居右信息 left、right
        callback: "&"           //分页控件的回调事件，一般为父页面的 SearchData(pageNumber) 方法
        ** 调用示例：<div class="pager-grid" is-no-data="isNoData" grid-data="pageData" side="left" ng-hide="isNoData" callback="SearchData(arg1)"></div>
        */
        superApp.directive("pagerGrid", pagerGridDirective);
        pagerGridDirective.$inject = ["$log", "toolService"];
        function pagerGridDirective($log, toolService) {
            var templateStr = "<div id='div_footPage' class='foot-page'></div>";
            return {
                restrict: "ACE",
                replace: false,
                transclude: false,
                scope: {
                    gridData: "=",          //Grid的Json数据
                    isNoData: "=",          //是否有数据标识，直接影响父页面是否显示没有数据提示框标识
                    side: "@",              //分页信息的居左、居右信息 left、right
                    callback: "&"           //分页控件的回调事件，一般为父页面的 SearchData(pageNumber) 方法
                },
                template: templateStr,
                controller: ["$rootScope", "$scope", "$log", "$element", "$compile", "toolService",
                    function ($rootScope, $scope, $log, $element, $compile, toolService) {
                        //将对象转换成jquery对象
                        var eleObj = $($element);
                        var footObj = eleObj.find(".foot-page:eq(0)");
                        var gridObj = eleObj.find("table:eq(0)");
                        $scope.tbxPageNum = 1;
                        //$log.log(footObj.html());
                        //eleObj.css("position", "relative");

                        //function Initgo(pageNumber)
                        //{
                        //    var promise = $scope.callback({ arg1: pageNumber });
                        //    promise.then(function (responseData)
                        //    {
                        //        $scope.gridData = responseData;
                        //        $scope.ClearPage();
                        //        if ($scope.gridData.total == 0)
                        //        {
                        //            $scope.isNoData = true;
                        //            toolService.pageLoading.close();
                        //            toolService.tableGridLoading.close();
                        //            return;
                        //        }
                        //        toolService.pageLoading.close();
                        //        toolService.tableGridLoading.close();

                        //    },
                        //    function (errorMesg)
                        //    {
                        //        $scope.isNoData = true;
                        //    });
                        //};

                        ////第一次没有数据的时候，初始化
                        //Initgo(1);

                        $scope.$watch("gridData", function (newVal) {
                            if (!angular.isObject(newVal)) return;
                            $scope.ClearPage();
                            if (newVal.total == 0) {
                                $scope.isNoData = true;
                                toolService.tableGridLoading.close();
                                return;
                            }
                            $scope.isNoData = false;

                            //设置分页
                            $scope.options.total = newVal.total;
                            $scope.options.dataPanel = gridObj;
                            $scope.options.pageSize = newVal.pageSize;
                            $scope.options.pageNum = newVal.pageNum;
                            if (newVal.pageNum == 1) {
                                $scope.tbxPageNum = 1;
                            }
                            pageHtmlStr = $scope.InitPager(footObj, ((new Date()).getTime()), $scope.side);
                            //手工编译Angular
                            $footPage = $(pageHtmlStr);
                            footObj.append($footPage);
                            angular.element(document).injector().invoke(["$compile", function ($compile) {
                                var as = angular.element($footPage).scope();
                                $compile($footPage)(as);
                            }]);
                            toolService.tableGridLoading.close();
                            //toolService.pageLoading.close();
                        }, true);

                        $scope.GoToPage = function (page) {
                            //$log.log($scope.$parent.selectItems);
                            if (page != undefined) {
                                page = parseInt(Number(page));
                                page = page ? page : 1;
                                var pageCount = Math.ceil($scope.gridData.total / $scope.gridData.pageSize);
                                $scope.tbxPageNum = page = (page > pageCount) ? pageCount : page;
                                if (parseInt(page) > $scope.options.pageCount) {
                                    page = $scope.options.pageCount;
                                }
                                $scope.options.pageNum = page;

                                $scope.callback({ arg1: page });
                            }
                        }

                        $scope.options = {
                            pageSize: 30, //每页显示记录数
                            pageNum: 1, //当前页码
                            pageCount: undefined,
                            total: 0, //总记录数
                            dataPanelID: undefined, //数据显示控件ID
                            dataPanel: undefined,
                            gridPanel: undefined,
                            pagerPanel: null//分页控件父页面
                        };
                        $scope.startIndex = 0;
                        $scope.endIndex = 0;
                        $scope.pagerPanelID = "";

                        $scope.ClearPage = function () {
                            if ($scope.options.pagerPanel != null) {
                                $($scope.options.pagerPanel).html("");
                            }
                            $scope.options.pageNum = 1;
                            $scope.options.pageCount = undefined;
                            $scope.options.total = 0;
                            $scope.options.dataPanelID = undefined;
                            $scope.options.dataPanel = undefined;
                            $scope.options.pagerPanel = null;
                        }

                        $scope.InitPager = function (pagerPanel, pagerPanelID, align) {
                            $scope.options.pagerPanel = $(pagerPanel);
                            var pageHtmlStr = "";
                            $scope.pagerPanelID = pagerPanelID;
                            pageHtmlStr += "<div style=\"float: " + align + ";\">";
                            pageHtmlStr += "    <ul>";
                            //计算共多少页 向上取整,有小数就整数部分加1
                            $scope.options.pageCount = Math.ceil($scope.options.total / $scope.options.pageSize);

                            if ($scope.options.pageCount <= 0) {
                                $(pagerPanel).html("");
                                return; //如果没有数据，则返回
                            }

                            pageHtmlStr += "<li id=\"li_pr_" + pagerPanelID + "\" class=\"ghtao\"><a href=\"JavaScript:;\" title=\"上一页\" ng-click=\"GoToPage(" + (parseInt($scope.options.pageNum) - 1) + ")\">&laquo;</a></li>";

                            //计算当前页与第一页的距离，如果小于5 输出 1,2,3,4,5 ...max
                            var tempCount = parseInt($scope.options.pageNum);
                            var pageCountOffset = 3; //页面前后偏移量
                            var pageCountOffsetAll = pageCountOffset * 2 + 1; //根据页面偏移量计算出判断量

                            if ($scope.options.pageCount > 12) {
                                //alert("$scope.startIndex = " + $scope.startIndex + "  $scope.endIndex=" + $scope.endIndex + "  tempCount=" + tempCount);
                                if (tempCount == $scope.options.pageCount) {
                                    //判断是否点击最后一页
                                    $scope.startIndex = $scope.options.pageCount - pageCountOffsetAll;
                                    $scope.endIndex = $scope.options.pageCount;
                                    pageHtmlStr += $scope.GetPageHtml(1);
                                    pageHtmlStr += "<span class=\"dd\">...</span>";
                                    for (var i = $scope.startIndex; i <= $scope.endIndex; i++) {
                                        if ($scope.options.pageNum == i) {
                                            pageHtmlStr += $scope.GetPageHtml(i, "xz", "first");
                                        }
                                        else {
                                            pageHtmlStr += $scope.GetPageHtml(i);
                                        }
                                    }

                                }
                                else if (tempCount == 1) {


                                    //判断是否点击第一页
                                    $scope.startIndex = 1;
                                    $scope.endIndex = pageCountOffsetAll;
                                    for (var i = $scope.startIndex; i <= $scope.endIndex; i++) {
                                        if ($scope.options.pageNum == i) {
                                            pageHtmlStr += $scope.GetPageHtml(i, "xz", "first");
                                        }
                                        else {
                                            pageHtmlStr += $scope.GetPageHtml(i);
                                        }
                                    }
                                    if ($scope.endIndex != 0 && $scope.endIndex < $scope.options.pageCount) {
                                        pageHtmlStr += "<span class=\"dd\">...</span>";
                                        pageHtmlStr += $scope.GetPageHtml($scope.options.pageCount);
                                    }
                                }
                                else {
                                    //初始化页面偏移
                                    $scope.startIndex = $scope.options.pageNum - Math.floor(pageCountOffsetAll / 2);
                                    $scope.endIndex = $scope.options.pageNum + Math.floor(pageCountOffsetAll / 2);

                                    //点击其他页面逻辑
                                    if ($scope.endIndex == 0 && $scope.endIndex < (tempCount + pageCountOffsetAll - 1)) {
                                        //当第一次点击时，判断结束页面是否小于当前面加上偏移量，如果小于则 开始 = 当前，结束=当前+偏移
                                        $scope.startIndex = tempCount;
                                        $scope.endIndex = tempCount + pageCountOffsetAll - 1;

                                    }
                                    else if ($scope.endIndex > 0 && $scope.endIndex == tempCount) {
                                        $scope.startIndex = tempCount; //赋值，开始 = 当前页码
                                        $scope.endIndex = tempCount + pageCountOffsetAll; //赋值，结束 = 当前页码 + 偏移
                                        //此时要判断计算后的结束是否大于最大页数
                                        if ($scope.endIndex > $scope.options.pageCount) {
                                            $scope.endIndex = $scope.options.pageCount;
                                        }
                                    }
                                    else if ($scope.startIndex == tempCount) {
                                        //如果不是第一次点击，则需判断开始是否等于当前，如果等于当前，证明要进入上一组显示页码
                                        $scope.startIndex = tempCount - pageCountOffsetAll + 1;
                                        $scope.endIndex = tempCount;
                                    }


                                    if ($scope.startIndex > 0 && $scope.startIndex != 1) {
                                        //判断开始位置大于0，同时开始位置不等于1，说明不是第一组页码，则需要输出 1...
                                        pageHtmlStr += $scope.GetPageHtml(1);
                                        if ($scope.startIndex > 2) {
                                            pageHtmlStr += "<span class=\"dd\">...</span>";
                                        }
                                    }
                                    if ($scope.startIndex <= 0) {
                                        $scope.startIndex = 1;
                                        $scope.endIndex = pageCountOffsetAll;
                                    }

                                    if (($scope.options.pageCount - tempCount) < pageCountOffsetAll) {
                                        //alert(3);
                                        $scope.startIndex = $scope.options.pageCount - pageCountOffsetAll;
                                        $scope.endIndex = $scope.options.pageCount;
                                    }

                                    for (var i = $scope.startIndex; i <= $scope.endIndex; i++) {
                                        if ($scope.options.pageNum == i) {
                                            pageHtmlStr += $scope.GetPageHtml(i, "xz", "first");
                                        }
                                        else {
                                            pageHtmlStr += $scope.GetPageHtml(i);
                                        }
                                    }
                                    if ($scope.endIndex != 0 && $scope.endIndex < $scope.options.pageCount) {
                                        pageHtmlStr += "<span class=\"dd\">...</span>";
                                        pageHtmlStr += $scope.GetPageHtml($scope.options.pageCount);
                                    }
                                }
                            }
                            else {
                                for (var i = 1; i <= $scope.options.pageCount; i++) {
                                    if ($scope.options.pageNum == i) {
                                        pageHtmlStr += $scope.GetPageHtml(i, "xz");
                                    }
                                    else {
                                        pageHtmlStr += $scope.GetPageHtml(i);
                                    }
                                }
                            }

                            pageHtmlStr += "<li id=\"li_pr_" + pagerPanelID + "\"><a href=\"JavaScript:;\" title=\"下一页\" ng-click=\"GoToPage(" + (parseInt($scope.options.pageNum) + 1) + ")\">&raquo;</a></li>";
                            pageHtmlStr += "<span style=\"margin-left: 15px;\">向第</span>";
                            pageHtmlStr += "<span><input id=\"" + pagerPanelID + "_tbx_pageCount\" ng-model=\"tbxPageNum\" ng-keyup=\"PageNumKeyup($event)\"  name=\"tbx_pageCount\" class=\"form-control pageNum\" type=\"text\" style=\"padding-left:2px;padding-left:0px;\"  /></span>";
                            pageHtmlStr += "<span>&nbsp;/&nbsp;" + $scope.options.pageCount + "&nbsp;页</span>";
                            pageHtmlStr += "<span ><button class=\"btn btn-default btnGoPage\" type=\"button\" ng-click=\"GoToPage(tbxPageNum)\">跳转</button></span>";
                            pageHtmlStr += " <span style=\"margin-left: 10px;\">共 " + $scope.options.total + " 条记录</span>";
                            pageHtmlStr += "    </ul>";
                            pageHtmlStr += "</div>";
                            //$(pagerPanel).html(pageHtmlStr);
                            //document.getElementById(pagerPanelID + "_tbx_pageCount").value = $scope.options.pageNum;
                            return pageHtmlStr;
                        };

                        $scope.GetPageHtml = function (id, isXZ) {
                            var resultStr = "";
                            if (parseInt(id) <= 9) {
                                id = "0" + id;
                            }
                            if (isXZ != undefined) {
                                resultStr = "<li id=\"li_" + id + "\"><a href=\"JavaScript:;\" ng-click=\"GoToPage(" + id + ")\" class=\"xz\">" + id + "</a></li>";
                            }
                            else {
                                resultStr = "<li id=\"li_" + id + "\"><a href=\"JavaScript:;\" ng-click=\"GoToPage(" + id + ")\" >" + id + "</a></li>";
                            }
                            return resultStr;
                        };

                        $scope.PageNumKeyup = function (e) {
                            var keycode = window.event ? e.keyCode : e.which;
                            if (keycode == 13) {
                                $scope.tbxPageNum = parseInt(Number($scope.tbxPageNum));
                                $scope.tbxPageNum = $scope.tbxPageNum ? $scope.tbxPageNum : 1;
                                $scope.GoToPage($scope.tbxPageNum);
                            }
                        };

                    }]
            }
        };

        //自定义表单验证
        /*
        用法：
        【一】
        在需要验证的表单写上初始化代码：
        <form name="userAddForm" class="my-form-validate" my-form-is-valid="myFormIsValid" my-form-auto-check="myFormAutoCheck1">
        参数说明
        class="my-form-validate" 必填 
        myFormIsValid ：变量，返回表单是否验证通过（真）/ 不通过（假）
        myFormAutoCheck1 : 变量，每当此变量刷新，该表单便自动进行一次验证。一般用法，在 controller 里使用： $scope.myFormAutoCheck1 = Math.random();
         
        【二】
        在标签写上验证规则：
        <input my-validate="required||letter_number_line"  my-validate-err="登陆名称必填||登录名只能填字母、数字或下横线" ng-model="formEntity.DLM" type="text">
        my-validate ： 必须，里面是各种验证类型，多个验证使用 || 分隔。详见本指令里 checkValid 函数。
        my-validate-err ： 验证失败后的错误提示，多个提示使用 || 分隔。每个提示与验证一一对应。
         
        my-validate-reset="formEntity.DLMM2" 
        my-validate-reset : 当此 INPUT 输入新值的时候，将 ng-model 为 formEntity.DLMM2 的 INPUT 置空，一般用于确认密码
         
        */


        superApp.directive('myFormValidate', myFormValidateDirective);
        myFormValidateDirective.$inject = ["$log"];
        function myFormValidateDirective($log) {
            return {
                restrict: "ACE",
                scope: {
                    myFormIsValid: "=",
                    myFormAutoCheck: "="
                },
                link: myFormValidateLink
            };
            function myFormValidateLink(scope, element, attrs, accordionController) {
                //通过AJax获取信息，获取登录授权信息等
                $element = $(element);

                scope.myFormAutoCheck = false; //初始自动检测（如有）
                var $myValidateObjs = $element.find('[my-validate]');
                var arrInputList = new Array();  /* 验证状态列表 */
                scope.myFormIsValid = false; /* 初始化表单状态 */

                $myValidateObjs.each(function (i) {
                    $this = $(this);
                    /* 加入验证列表 */
                    $this.attr("my-validate-id", i);
                    if (-1 == $this.attr("my-validate").indexOf("required")) {
                        arrInputList[i] = true;  /* 非必填，默认置 true */
                    } else {
                        arrInputList[i] = false; /* 必填，默认置 false */
                    }
                    /*
                    $this.on("keyup change keydown", function () {
                        
                    });*/
                    /* 错误的弹出提示框，代码跟 superValidate 同理 */
                    createValidateMsg($this);
                });

                /* 自动验证变量监听,每当此值发生改变，表单重新验证 */
                scope.$watch(function () { return scope.myFormAutoCheck }, function (newValue, oldValue, scope) {
                    if (false === newValue) {
                    } else {
                        setTimeout(validateAll, 1000);
                    }
                });

                /* 给一个input初始化错误提示 */
                function createValidateMsg($this) {
                    var direction = (attrs["myValidateTipsDirection"]) ? attrs["myValidateTipsDirection"] : "bottom";
                    $wrap = $this.wrap("<span class='myvalidate-wrap myvalidate-wrap-" + direction + "'></span>").parent();
                    //$wrap.append("<span class='myvalidate-wrap-tips' style='display:none'>请填写</span>");
                    $wrap.append("<span class='myvalidate-wrap-tips'>请填写</span>");
                    $this.off("mouseover mouseout mouseleave blur keydown change");
                    $this.on("blur input change", function () {

                        checkThisInput($(this), true); /* 控件触发验证事件 */

                        /*
                        $this = $(this);
                        $this.addClass("zmax");
                        if ($this.hasClass('my-form-invaild')) {
                        //$this.parent().find(".myvalidate-wrap-tips").stop().fadeTo('fast', 1.0);
         
                        // 如果是select标签，并使用了 select2 组件
         
                        if ($this[0].tagName == "SELECT" || $this[0].tagName == "select") {
                        $this.parent().removeClass('show'); //点击后不弹出提示框，因为无法触发关闭事件
                        var $select2 = $this.parent().prev();
                        if ($select2.hasClass("select2-container")) {
                        $select2.off("mouseleave mouseenter");
                        $select2.on("mouseenter", function () {
                        var $this = $(this);
                        if ($this.hasClass('my-form-invaild')) {
                        $this.parent().find(".myvalidate-wrap-tips").stop().fadeTo('fast', 1.0);
                        } else {
                        $this.parent().find(".myvalidate-wrap-tips").stop().fadeTo('fast', 0.0, function () { $(this).hide(); });
                        }
                        });
                        $select2.on("mouseleave", function () {
                        var $this = $(this);
         
                        $this.parent().find(".myvalidate-wrap-tips").stop().fadeTo('fast', 0.0, function () { $(this).hide(); });
                        });
                        }
                        }
         
                        } else {
                        // $this.parent().find(".myvalidate-wrap-tips").stop().fadeTo('fast', 0.0, function () { $(this).hide(); });
                        }*/
                    });
                    /*
                    $this.on("mouseover", function () {
         
                    $this = $(this);
                    $this.addClass("zmax");
                    if ($this.hasClass('my-form-invaild')) {
                    $this.parent().find(".myvalidate-wrap-tips").stop().fadeTo('fast', 1.0);
                    }
         
                    });*/
                    /*
                    $this.on("blur mouseleave mouseout", function () {
                    $this = $(this);
                    $this.removeClass("zmax");
                    $this.parent().find(".myvalidate-wrap-tips").stop().fadeTo('fast', 0.0, function () { $(this).hide(); });
                    });*/
                }

                /* 验证表单 */
                function validateAll() {
                    /* 验证常驻表单 */
                    $myValidateObjs.each(function (i) {
                        checkThisInput($(this), true, true);
                    });
                }

                /* 验证指定input */
                /* 参数：指定input对象，错误是否置红，是否由用户手工调用（监听scope.myFormAutoCheck的调用）*/
                function checkThisInput($this, setStatus, isAuto) {
                    var vStr = $this.attr('my-validate');
                    var vErr = $this.attr('my-validate-err');
                    var value = $this.val();

                    /* 重置操作 */
                    if (!isAuto) {  /* 所有监听调用均不重置空 */
                        var validateReset = $this.attr("my-validate-reset");
                        if (validateReset) {
                            var vResets = validateReset.split("||");
                            for (var i = 0; i < vResets.length; i++) {
                                var $inputReset = $("[ng-model='" + vResets[i] + "']:eq(0)");
                                if ($inputReset.val()) {
                                    $inputReset.val("");  /*置空并置验证失败*/
                                    arrInputList[Number($inputReset.attr("my-validate-id"))] = false;
                                    setMyFormValid(false);
                                }
                            }
                        }
                    }

                    /* 检测是否合法 */
                    var isThisValid = checkValid(vStr, value, vErr);
                    if (true === isThisValid) {
                        if (setStatus) {
                            $this.removeClass("my-form-invaild");  /* 置控件样式 */
                        }
                        arrInputList[Number($this.attr("my-validate-id"))] = true;
                        if (checkAll()) {
                            setMyFormValid(true);
                        }
                    } else {
                        if (setStatus) {
                            $this.addClass("my-form-invaild");  /* 置控件样式 */
                            $this.parent().find(".myvalidate-wrap-tips").html(isThisValid);
                        }
                        arrInputList[Number($this.attr("my-validate-id"))] = false;
                        setMyFormValid(false);

                    }
                }

                /* 设置表单是否全部验证通过 */
                function setMyFormValid(valid) {
                    if (valid) {
                        scope.$apply(function () {
                            scope.myFormIsValid = true;
                        });
                    } else {
                        scope.$apply(function () {
                            scope.myFormIsValid = false;
                        });
                    }
                }

                /* 检测是否全部验证通过 */
                function checkAll() {
                    for (var key in arrInputList) {
                        if (false === arrInputList[key]) {
                            return false;
                        }
                    }
                    return true;
                }

                var confirm_list = ""; /* 两次确定值的判断 */

                /* 检测是否合法，若真:返为===true ;若假:返回相应提示值的字符串 */
                function checkValid(validateStr, value, validateErr) {
                    var vStr = validateStr ? validateStr.split("||") : "";  /* 验证条件数组 */
                    var vErr = validateErr ? validateErr.split("||") : "";  /* 错误信息数组 */

                    var re;
                    if (!vStr) return true; /* 无验证条件，直接返回true */

                    /* 循环所有检测条件，并进行验证 */
                    for (i = 0; i < vStr.length; i++) {
                        var thisStr = vStr[i] ? vStr[i] : "";
                        var thisErr = vErr[i] ? vErr[i] : "";
                        //alert("switch=" + thisStr);
                        /* 注意：除“必填项”外，所有都不作非空验证 */
                        switch (thisStr) {
                            /* 必填项 */
                            case "required":
                                if (!value) {
                                    return thisErr ? thisErr : "这是必填项";
                                }
                                break;
                            /* 电子邮件 */
                            case "email":
                                re = /\w@\w*\.\w/;
                                if (value && !re.test(value)) {
                                    return thisErr ? thisErr : "请填写正确的电子邮箱地址";
                                }
                                break;
                            /* 字母数字下横线 */
                            case "letter_number_line":
                                re = /^[0-9A-Za-z_]+$/;
                                if (value && !re.test(value)) {
                                    return thisErr ? thisErr : "只能填字母、数字或下横线";
                                }
                                break;
                            /* 非特殊符号和数字 */
                            case "word":
                                re = /^[A-Za-z\u4e00-\u9fa5_ ]+$/;
                                if (value && !re.test(value)) {
                                    return thisErr ? thisErr : "不能输入特殊字符和数字";
                                }
                                break;
                            /* 电话 */
                            case "tel":
                                //re = /^[0-9\-\+ ]+$/;
                                re = /(^(\d{2,4}[-_－— ]?)?\d{3,8}([-_－— ]?\d{3,8})?([-_－— ]?\d{1,7})?$)|(^0?1[35]\d{9}$)/;
                                if (value && !re.test(value)) {
                                    return thisErr ? thisErr : "电话格式不正确";
                                }
                                break;
                            /* 数字 */
                            case "num":
                                re = /^[0-9]+$/;
                                if (value && !re.test(value)) {
                                    return thisErr ? thisErr : "只能输入数字";
                                }
                                break;
                            /* 带小数点的数字 */
                            case "double":
                                re = /^[0-9]+[\.]*[0-9]*$/;
                                if (value && !re.test(value)) {
                                    return thisErr ? thisErr : "只能输入数字或小数点";
                                }
                                break;
                            /* 其它带参数的验证 */
                            default:
                                var otherValidate = thisStr.split("::"); //输入格式形如： 验证名::参数   regex::/\w@\w*\.\w/       
                                var validateName = otherValidate[0];
                                var validateParm = otherValidate[1];

                                if ("regex" == validateName) {
                                    /* 正则表达式 */
                                    re = eval(validateParm);
                                    if (value && !re.test(value)) {
                                        return thisErr ? thisErr : "正则验证失败";
                                    }
                                } else if ("lenRange" == validateName) {
                                    /* 字符串长度范围 */
                                    var parms = validateParm.split("-");
                                    var parm1 = Number(parms[0]);
                                    var parm2 = Number(parms[1]);
                                    if (value && (Number(value.length) < parm1 || Number(value.length) > parm2)) {
                                        return thisErr ? thisErr : "长度在 " + parm1 + " - " + parm2 + " 字符之间";
                                    }
                                } else if ("lenRangeByte" == validateName) {
                                    /* 字符串长度范围（字节） */
                                    var parms = validateParm.split("-");
                                    var parm1 = Number(parms[0]);
                                    var parm2 = Number(parms[1]);
                                    if (value) {
                                        var len = 0;
                                        for (var i = 0; i < value.length; i++) {
                                            var length = value.charCodeAt(i);
                                            if (length >= 0 && length <= 128) {
                                                len += 1;
                                            }
                                            else {
                                                len += 2;
                                            }
                                        }
                                        if (len < parm1 && len > parm2) {
                                            return thisErr ? thisErr : "长度在 " + parm1 + " - " + parm2 + " 字节之间";
                                        }
                                    }
                                } else if ("confirm" == validateName) {
                                    /* 确认字段 */
                                    var value2 = $("[ng-model='" + validateParm + "']:eq(0)").val();
                                    // alert(value + ";" + value2);
                                    if (value != value2) {
                                        return thisErr ? thisErr : "两次输入的值不相同";
                                    }
                                } else {
                                    //...其它请补充
                                }
                                break;
                        }
                    }
                    return true;
                }

            }
        }


        /*
        ** 创建日期：2016-2-29
        ** 功能简介：流程信息查看，锚点树功能
        */
        superApp.directive('docsSidenav', docsSidenavDirective);
        docsSidenavDirective.$inject = ["$log"];
        function docsSidenavDirective($log) {
            return {
                restrict: "ACE",
                link: function (scope, element, attrs) {

                    var $element = $(element);
                    var offsetTop = 60;
                    var scrollDivClass = "super-frame-main";
                    var $scrollDiv = $("." + scrollDivClass + ":eq(0)");
                    var $sideNav = $(".bs-docs-sidenav:eq(0)");

                    var userClicked = false; //是否用户主动点击

                    /* 获取所有锚点 */
                    //var $anchors = $("[docs-sidenav-anchor]");
                    $element.off("click");
                    $element.on("click", function (e) {
                        var $this = $(e.target);
                        var anchorName = $this.attr("docs-sidenav-anchor");
                        if (!anchorName) return;
                        var $anchor = $element.find("[docs-sidenav-name='" + anchorName + "']:eq(0)");
                        if ($anchor.length >= 1) {
                            var top = $anchor.offset().top;
                            var currentTop = $scrollDiv.scrollTop();

                            userClicked = true; //用户点击
                            $scrollDiv.stop().animate({ scrollTop: currentTop + top - offsetTop }, 400, function () { userClicked = false; });

                            $sideNav.find("li").removeClass("active");
                            var $li = $this.parent();
                            $li.addClass("active");
                            var $li_p = $li.parent().parent();
                            if ($li_p[0].tagName == "LI" || $li_p[0].tagName == "li") {
                                $li_p.addClass("active");
                            }
                        }
                    });
                    /* 绑定滚动事件 */
                    var $frameMain = $(".super-frame-main:eq(0)");
                    $frameMain.off("scroll");
                    $frameMain.on("scroll", function () {
                        if (userClicked) { return; } //若是用户点击，则不执行
                        var $anchorNames = $element.find("[docs-sidenav-name]");
                        var currentName = "";
                        var currentScrollTop = $frameMain.scrollTop();
                        var maxScrollTop = 0;
                        $anchorNames.each(function (i) {
                            var $this = $(this);
                            var thisTop = $this.offset().top;
                            //$log.log($this.attr("docs-sidenav-name") + "=" + (Number(thisTop) + Number(currentScrollTop)));
                            if (currentScrollTop >= thisTop + currentScrollTop - offsetTop - 20) {
                                if (maxScrollTop < thisTop + currentScrollTop - offsetTop - 20) {
                                    maxScrollTop = thisTop + currentScrollTop - offsetTop - 20;
                                    currentName = $this.attr("docs-sidenav-name");
                                }
                            }
                        });

                        var $currentLi = $element.find("[docs-sidenav-anchor='" + currentName + "']:eq(0)");
                        if ($currentLi.length < 1) return;
                        $sideNav.find("li").removeClass("active");
                        var $li = $currentLi.parent();
                        $li.addClass("active");

                        //$("#debug").html("n=" + currentName + ";t=" + maxScrollTop + "<br />" + $li.html());

                        var $li_p = $li.parent().parent();
                        if ($li_p[0].tagName == "LI" || $li_p[0].tagName == "li") {
                            $li_p.addClass("active");
                        }
                    });



                    /*
                    $element = $(element);
                    var direction = attrs["superValidateDirection"] ? attrs["superValidateDirection"] : "bottom";
                    $wrap = $element.wrap("<span class='myvalidate-wrap myvalidate-wrap-" + direction + "'></span>").parent();
                    $wrap.append("<span class='myvalidate-wrap-tips'>" + attrs["superValidate"] + "</span>");
                    $element.bind("mouseover mouseenter keyup", function () {
                    $this = $(this);
                    setTimeout(function () {
                    $this.addClass("zmax");
                    if (!$this.hasClass('my-form-invaild')) {
                    ;
                    if (($this.hasClass('ng-invalid') && $this.hasClass('ng-touched'))) {
                    $this.parent().addClass('show');
                    }
                    }
                    }, 200);
                    });
                    $element.bind("mouseout mouseleave blur", function () {
                    $this = $(this);
                    $this.removeClass("zmax");
                    $this.parent().removeClass('show');
                    });*/


                }
            }
        }


        /*
        ** 创建日期：2016-2-29
        ** 功能简介：日期选择控件
        */
        superApp.directive('datetimepicker', datepickerDirective);
        datepickerDirective.$inject = ["$log"];
        function datepickerDirective($log) {
            return {
                restrict: "ACE",
                link: function (scope, element, attrs) {
                    $element = $(element);
                    $element.datepicker();
                }
            }
        }

        /*
        ** 创建日期：2016-4-18
        ** 功能简介：管理员后台左侧树滚轮事件
        */
        superApp.directive('leftsideMousewheel', ngMousewheelDirective);
        ngMousewheelDirective.$inject = ["$log"];
        function ngMousewheelDirective($log) {
            return {
                restrict: "ACE",
                link: function (scope, element, attrs) {
                    element.bind("DOMMouseScroll mousewheel onmousewheel", function (event) {

                        //event.preventDefault();

                        /* 获取事件以及滚轮偏移量 */
                        var event = window.event || event;
                        //var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
                        var delta = (event.wheelDelta && (event.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie
                            (event.originalEvent.detail && (event.originalEvent.detail > 0 ? -1 : 1));              // firefox

                        //console.log("event=" + event + ";" + "delta=" + delta);

                        /* 获取基本信息 */
                        var $group = $(element).find(".sidebar_group:eq(0)");
                        var groupHeight = $group.height();
                        var elementHeight = $(element).height();
                        var g_marginTop = parseInt($group.css("margin-top"));

                        /* 若树高度不足，则不滚动 */
                        if (groupHeight < elementHeight) {
                            g_marginTop = 0;
                            $group.css("margin-top", g_marginTop + "px");
                            return;
                        }

                        /* 滚轮偏移量叠加 */
                        g_marginTop += delta * 20;

                        /* 滚动取值范围检测 */
                        if (g_marginTop > 0) {
                            g_marginTop = 0;
                        } else if (groupHeight + g_marginTop < elementHeight - 30) {
                            g_marginTop = elementHeight - groupHeight - 30;
                        }

                        $group.css("margin-top", g_marginTop + "px");

                    });
                }
            }
        };


        /*
        ** 创建日期：2016-06-17
        ** 功能简介：滑动条
        ** 依赖JS  res/script/lib/jquery/bootstrap.slider.js
        
           形如：
            <input super-slider id="ex4" type="text" data-slider-min="-5" data-slider-max="20" data-slider-step="1" data-slider-value="-3" data-slider-orientation="vertical" />
    
           参数说明：
           super-slider                         指令，必需
           ata-slider-min="-5"                  最小值
           data-slider-max="20"                 最大值
           data-slider-step="1"                 滑动值间隔
           data-slider-value="-3"               当前值
           data-slider-orientation="vertical"   非必须，是否垂直 （默认不写这个属性，即为水平）
    
        */
        //superApp.directive("superSlider", superSlider);
        //superSlider.$inject = ["$log", "$compile"];
        //function superSlider($log, $compile)
        //{
        //    return {
        //        //controller: "svgExportController",
        //        link: function (scope, element, attrs)
        //        {
        //            var $element = $(element);
        //            $element.slider({
        //                reversed: true
        //            });
        //        }
        //    };
        //};


    });

