define(['loginApp'], function(loginApp) {

    loginApp.controller('loginController', loginController);
    loginController.$inject = ['$rootScope', '$scope', '$log', '$window', '$timeout', 'toolLoginService'];

    function loginController($rootScope, $scope, $log, $window, $timeout, toolLoginService) {
        $scope.formEntity = {
            'LCID': null,
            'Password': null,
            'UUID': null,
            'code': null
        };

        $scope.mangerLoginEntity = {
            "fields": {
                "pw": null
            }
        }
        $scope.loadingComplete = false; //是否加载完成
        //初始化页面参数
        $scope.InitPage = function() {
            $scope.tabIndex = 0;
            $scope.isLCSubmit = false;
            $scope.isMangerSubmit = false;
            $rootScope.isMangerSystem = false;
            $scope.lcLoginText = '登录';
            $scope.mangerLoginText = '管理控制台登录';
            $scope.UUIDurl = options.api.java_url;
            $window.sessionStorage.clear();
            $scope.validateBrowser();
            //env bgi gooal
            // $scope.isTest = 0;
            $scope.pageTitle = options.env === 'bgi' ? options.officialTitle : options.gooalTitle;
            // toolLoginService.sessionStorage.set('isTest', $scope.isTest);
            $scope.loadingComplete = true;
            $scope.code();
            // $scope.jump()
            // $scope.GetIsTest();
            $scope.env = options.env;
            if ($scope.env === 'bgi') {
                $timeout(function() {
                    $('.bgi_top .logo_bgi,.bgi_top .setUp').show();
                    $('.bgi_content').show();
                    $scope.initBgiJquery();
                }, 100)
            } else {
                $('.bgi_top .logo_gooal,.bgi_top .setUp').show();
                $('.bgi-banner').remove();
                $scope.initGooalJquery();
            }

            // console.log("版权所有: 古奥基因(GOOALGENE) http://www.gooalgene.com  2016-2017 鄂ICP备16015451号-1");
        };

        function getUUID() {
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010  
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01  
            s[8] = s[13] = s[18] = s[23] = "-";
            var uuid = s.join("");
            return uuid;
        }

        $scope.code = function() {
            $scope.uuid = getUUID();
            $scope.formEntity.UUID = $scope.uuid;
        }

        $scope.renovate = function() {
            $scope.uuid = getUUID();
            var img = document.getElementById("imgcode");
            img.src = options.api.java_url + "/checkImg?uuid" + $scope.uuid;
            $scope.formEntity.UUID = $scope.uuid
        }


        $scope.jump = function() {
            //校验是否存在查询条件
            var query = window.location.search;
            if (!query) {
                return
            }
            //校验查询条件关键字;校验值不符合要求直接删除掉
            var queryArr = query.substring(1, query.length).split("&");

            if (queryArr[0].split("=")[0] != "LCID" && queryArr[0].split("=")[0] != "lcid") {
                window.location.href = window.location.href.replace(/login\/login\.html.*/, "login/login.html");
                return;
            }

            //Token跳转
            if (queryArr[0].split("=")[0] == "LCID" && queryArr[1].split("=")[0] == "Token") {
                var jumpLCID = query.split("&")[0].split("=")[1];
                var Token = query.split("&")[1].split("=")[1];
                $scope.jumpEntity = {
                    "fields": [{
                        "Token": Token,
                        "LCID": jumpLCID,
                    }]
                }
                var jumpUrl = options.api.base_url + '/toReport'
            }
            //明码跳转
            if (queryArr[0].split("=")[0] == "lcid" && queryArr[1].split("=")[0] == "password") {
                var jumpLCID = query.split("&")[0].split("=")[1];
                var Password = query.split("&")[1].split("=")[1];
                $scope.jumpEntity = {
                    "LCID": jumpLCID,
                    "Password": Password
                }
                var jumpUrl = options.api.base_url + '/login'
            }
            $.ajax({
                url: jumpUrl,
                type: 'POST',
                data: JSON.stringify($scope.jumpEntity),
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                withCredentials: true,
                cache: false,
                success: function(responseData) {
                    if (responseData.Status === 'success') {
                        // 如果登录成功，那么这里要存储后天返回的LCID、XMID等信息，因为到跳转之后的页面会对这些信息进行有效性验证
                        toolLoginService.localStorage.set('token', responseData.Token);
                        toolLoginService.sessionStorage.set('LCID', jumpLCID);
                        toolLoginService.sessionStorage.set('LCMC', responseData.LCMC);
                        if (responseData.LCTYPE == "radseq") {
                            responseData.LCTYPE = "RADseq"
                        }
                        // window.location.href = window.location.href.replace('login/login.html', responseData.LCTYPE + '/index.html');
                        window.location.href = window.location.href.replace(/login\/login\.html.*/, responseData.LCTYPE + '/index.html');
                    } else {
                        window.location.href = window.location.href.replace(/login\/login\.html.*/, responseData.LCTYPE + '/index.html');
                    }
                },
                error: function(data) {
                    window.location.href = window.location.href.replace(/login\/login\.html.*/, "login/login.html");
                }
            });

        }

        //验证浏览器兼容性
        $scope.validateBrowser = function() {
            toolLoginService.BrowserDetect.init(); //alert(BrowserDetect.browser);
            //如果浏览器为ie且版本低于10，或者浏览器为Safari，则弹出提示框                                                                                                                                                                                                                                                                                                          
            if (toolLoginService.BrowserDetect.browser == 'Explorer' && parseInt(toolLoginService.BrowserDetect.version) < 10 || toolLoginService.BrowserDetect.browser == 'Safari') {
                // $scope.ShowGlobalMesgPanel();
                toolLoginService.popBDWindow();
            }
        };

        $scope.ShowGlobalMesgPanel = function() {
            $('.globalMesg').slideDown();
            $('.top_space').slideUp();
        };
        $scope.HideGlobalMesgPanel = function() {
            $('.globalMesg').slideUp();
            $('.top_space').slideDown();
        };

        $scope.btn_lcLogin_OnClick = function() {
            if (!$scope.isLCSubmit) {
                // 判断登录按钮是否提交，如果正在提交则不执行
                $scope.isLCSubmit = true;
                $scope.lcLoginText = '正在登录...';
                LoginOn();
            }
        }

        $scope.resError = false;

        function LoginOn() {
            $.ajax({
                url: options.api.base_url + '/login',
                type: 'POST',
                data: JSON.stringify($scope.formEntity),
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                withCredentials: true,
                cache: false,
                success: function(responseData) {
                    if (responseData.Status === 'success') {
                        // 如果登录成功，那么这里要存储后天返回的LCID、XMID等信息，因为到跳转之后的页面会对这些信息进行有效性验证
                        toolLoginService.localStorage.set('token', responseData.Token);
                        toolLoginService.sessionStorage.set('LCID', $scope.formEntity.LCID);
                        toolLoginService.sessionStorage.set('LCMC', responseData.LCMC);
                        // window.location.href = window.location.href.replace('login/login.html', responseData.LCTYPE + '/index.html');
                        window.location.href = window.location.href.replace('login/login.html', "mrna" + '/index.html');
                        $scope.resError = false;
                    } else {
                        $scope.isLCSubmit = false;
                        $scope.lcLoginText = '登录';
                        $scope.resError = responseData.Error;
                        $scope.renovate();
                        $scope.$apply();
                    }
                },
                error: function(data) {
                    // 处理错误 .reject  
                    $scope.resError = false;
                    $log.debug('处理错误' + data);
                    $scope.isLCSubmit = false;
                    if ($scope.tabIndex == 0) {
                        $scope.isLCSubmit = false;
                        $scope.lcLoginText = '登录';
                    }
                    $scope.renovate();
                    $scope.$apply();
                }
            });
        }

        //判断是否为测试版 
        $scope.isTest = false;

        $scope.handlerKeyUp = function(event) {
            $scope.resError = false;
            if (event.keyCode === 13) {
                $scope.btn_lcLogin_OnClick();
            }
        }

        $scope.initGooalJquery = function() {
            var bodyH = document.documentElement.clientHeight || document.body.clientHeight || window.innerHeight;
            var conUl = $(".main_ul")[0];
            var liLen = $(".main_ul .content"); //获取li

            //设置Li的高度
            for (var i = 0; i < liLen.length; i++) {
                liLen[i].style.height = bodyH + "px";
            }
            conUl.style.height = bodyH * liLen.length + "px"; //设置ul的高
        }


        $scope.initBgiJquery = function() {
            // 锚点滚动
            scrollto('.nav-concat', '.concat-wrap');
            // 全屏滚动
            var type = true; //控制动画的开关
            var bodyW = document.documentElement.clientWidth || document.body.clientWidth || window.innerWidth;
            var bodyH = document.documentElement.clientHeight || document.body.clientHeight || window.innerHeight;
            var main = $(".main")[0];
            var conUl = $(".main_ul")[0];
            var liLen = $(".main_ul .content"); //获取li
            var autoPlayTimer = null;

            //设置Li的高度
            for (var i = 0; i < liLen.length; i++) {
                liLen[i].style.height = bodyH + "px";
            }
            conUl.style.height = bodyH * liLen.length + "px"; //设置ul的高

            //鼠标的滚轮事件(兼容 ie and chrome);
            main.onmousewheel = function(event) {
                var event = event || window.event;
                var direction = event.wheelDelta && (event.wheelDelta > 0 ? "mouseup" : "mousedown");
                //向上滚动
                if (direction == "mouseup") {
                    mouseTop();
                }
                //向下滚动
                if (direction == "mousedown") {
                    mouseBottom();
                }
            }

            //鼠标滚轮事件(兼容 firefox)
            document.body.addEventListener("DOMMouseScroll", function(event) {
                var direction = event.detail && (event.detail > 0 ? "mousedown" : "mouseup");
                //向下滚动
                if (direction == "mousedown") {
                    mouseBottom();
                }

                //向上滚动
                if (direction == "mouseup") {
                    mouseTop();
                }
            });


            //向上滚动代码函数
            function mouseTop() {
                //第二屏
                if (main.scrollTop >= liLen[2].offsetTop && type == true) {
                    type = false;
                    //延时滚动。要不然会先执行代码再执行滚轮，那样会多滚动出一截子。
                    setTimeout(function() {
                        AnimationTop(1);
                    }, 10);
                    return;
                }

                //第一屏
                if (main.scrollTop >= liLen[1].offsetTop && type == true) {
                    type = false;
                    //延时滚动。要不然会先执行代码再执行滚轮，那样会多滚动出一截子。
                    setTimeout(function() {
                        AnimationTop(0);
                    }, 10);
                    return;
                }
            }

            //向下滚动代码函数
            var firstFlag = true;

            function mouseBottom() {
                //第二屏
                if (main.scrollTop == liLen[0].offsetTop && type == true) {
                    if (firstFlag) {
                        timeFunt();
                        firstFlag = false;
                    }
                    type = false;
                    //延时滚动。要不然会先执行代码再执行滚轮，那样会多滚动出一截子。
                    setTimeout(function() {
                        AnimationBottom(1);
                    }, 10);
                    return;
                }

                //第三屏
                if (main.scrollTop <= liLen[1].offsetTop && type == true) {
                    type = false;
                    //延时滚动。要不然会先执行代码再执行滚轮，那样会多滚动出一截子。
                    setTimeout(function() {
                        AnimationBottom(2);
                    }, 10);
                    return;
                }
            }

            //向上滚轮动画函数
            function AnimationTop(num) {
                var t = setInterval(function() {
                    if (main.scrollTop > liLen[num].offsetTop) {
                        //控制移动速度（慢--快--慢）
                        // -- 慢
                        if (main.scrollTop >= liLen[num].offsetTop + (parseInt(liLen[num].style.height) / 11 * 9)) {
                            main.scrollTop -= 6;
                            // -- 快
                        } else if (main.scrollTop <= liLen[num].offsetTop + (parseInt(liLen[num].style.height) / 11 * 9) && main.scrollTop >= liLen[num].offsetTop + (parseInt(liLen[num].style.height) / 11 * 2)) {
                            main.scrollTop -= 12;
                            // -- 慢
                        } else if (main.scrollTop <= liLen[num].offsetTop + (parseInt(liLen[num].style.height) / 11 * 2) && main.scrollTop >= liLen[num].offsetTop) {
                            main.scrollTop -= 6;
                        }
                    } else {
                        main.scrollTop = liLen[num].offsetTop;
                        clearInterval(t);
                        type = true;
                    }
                }, 1);
            }

            //向下滚轮动画函数
            function AnimationBottom(num) {
                var t = setInterval(function() {
                    if (main.scrollTop < liLen[num].offsetTop) {
                        //控制移动速度（先快后慢）
                        // -- 慢
                        if (main.scrollTop <= liLen[num].offsetTop / 11 * 2) {
                            main.scrollTop += 6;
                            // -- 快
                        } else if (main.scrollTop >= liLen[num].offsetTop / 11 * 2 && main.scrollTop <= liLen[num].offsetTop / 11 * 10) {
                            main.scrollTop += 12;
                            // -- 慢
                        } else if (main.scrollTop >= liLen[num].offsetTop / 11 * 10 && main.scrollTop <= liLen[num].offsetTop) {
                            main.scrollTop += 6;
                        }
                    } else {
                        main.scrollTop = liLen[num].offsetTop;
                        clearInterval(t);
                        type = true;
                    }
                }, 1);
            }

            //幻灯片
            function timeFunt() {
                var count = $('.banner_teb').length,
                    i = 0,
                    t = 5000
                if (count > 1) {
                    // anchor click 
                    $('#productNav li').on('click', function() {
                        clearInterval(autoPlayTimer);
                        var index = $(this).index();
                        if (index !== i) toggleBanner(index);
                        i = index;
                        autoPlay();
                    })
                    autoPlay();
                }

                // auto play
                function autoPlay() {
                    autoPlayTimer = setInterval(function() {
                        toggleBanner((++i) % count);
                    }, t)
                }

                // toggle   
                function toggleBanner(index) {
                    $('.banner_teb').fadeOut().eq(index).fadeIn();
                    $('#productNav li').removeClass('current').eq(index).addClass('current');
                }
            }


            function scrollto(anchor, wrap) {
                $(anchor).on('click', function() {
                    $('.main').animate({
                        scrollTop: $(wrap).offset().top
                    });
                })
            }

            //获取页面各块级高度
            var bodyH = $(".main").height();
            var titH = $(".contactUs_tit").innerHeight() * 2;
            var liH = $(".friendshipLink_ul img").height() * 2;
            var QRCodeH = $(".QRCode").innerHeight();
            var ftConH = $(".ftCon").innerHeight();
            var padHeight = (bodyH - titH - liH - QRCodeH - ftConH - 120) / 4;
            //设置padding自适应高度
            $(".contactUs_ul li,.friendshipLink_ul li").css({
                "padding-top": padHeight,
                "padding-bottom": padHeight
            })
        }

        /**********登录弹窗显示隐藏*************/
        //点击登录按钮显示登录弹窗
        $(".loginBtn").click(function() {
            var userAgent = navigator.userAgent;
            var isChrome = userAgent.indexOf("Chrome") > -1
            $(".main_ul").css("filter", "blur(5px)");
            $(".mengc").show();
            if (isChrome) {
                $("#login").show();
            } else {
                $("#noChrome").show();
            }
            type = false;
            $scope.renovate();
            $scope.$apply();
        })

        $("#continueLogin").click(function() {
            $("#noChrome").hide();
            $(".main_ul").css("filter", "blur(5px)");
            $(".mengc").show();
            $("#login").show();
            type = false;
        })

        //点击登录弹窗关闭按钮隐藏登录弹窗
        $(".login_close").click(function() {
            type = true;
            $(".main_ul").css("filter", "none")
            $("#login").hide();
            $("#noChrome").hide();
            $(".mengc").hide();
        })

    }
});