define(['loginApp'], function (loginApp) {

    loginApp.controller('loginController', loginController);
    loginController.$inject = ['$rootScope', '$scope', '$log', '$window', 'toolLoginService'];
    function loginController($rootScope, $scope, $log, $window, toolLoginService) {
        $scope.formEntity = {
            'LCID': null,
            'Password': null
        };

        $scope.mangerLoginEntity = {
            "fields": {
                "pw": null
            }
        }

        $scope.loadingComplete = false; //是否加载完成

        //初始化页面参数
        $scope.InitPage = function () {
            $scope.tabIndex = 0;
            $scope.isLCSubmit = false;
            $scope.isMangerSubmit = false;
            $rootScope.isMangerSystem = false;
            $scope.lcLoginText = '登录并查看在线报告';
            $scope.mangerLoginText = '管理控制台登录';
            $window.sessionStorage.clear();
            $scope.validateBrowser();
            //古奥基因 0   理工大 -1    其他 1
            $scope.isTest = 0;
            $scope.pageTitle = $scope.isTest ? options.testTitle : options.officialTitle;
            toolLoginService.sessionStorage.set('isTest', $scope.isTest);
            $scope.loadingComplete = true;
            $rootScope.sk = "YANGWENDIAN19930";
            // $scope.jump()
            // $scope.GetIsTest();
            console.log("版权所有: 古奥基因(GOOALGENE) http://www.gooalgene.com  2016-2017 鄂ICP备16015451号-1");
        };

        $scope.jump = function(){
            //校验是否存在查询条件
            var query = window.location.search;
            if(!query){
                return
            }
            //校验查询条件关键字;校验值不符合要求直接删除掉
            var queryArr = query.substring(1, query.length).split("&");

            if(queryArr[0].split("=")[0] != "LCID" && queryArr[0].split("=")[0] != "lcid"){
                    window.location.href = window.location.href.replace(/login\/login\.html.*/, "login/login.html");
                    return;
            } 

            //Token跳转
            if(queryArr[0].split("=")[0] == "LCID" && queryArr[1].split("=")[0] == "Token"){
                var jumpLCID = query.split("&")[0].split("=")[1];
                var Token = query.split("&")[1].split("=")[1];
                $scope.jumpEntity = {
                    "fields": [
                        {
                            "Token": Token,
                            "LCID": jumpLCID,
                        }
                    ]
                }
                var jumpUrl = options.api.base_url + '/toReport'
            }
            //明码跳转
            if(queryArr[0].split("=")[0] == "lcid" && queryArr[1].split("=")[0] == "password"){
                var jumpLCID = query.split("&")[0].split("=")[1];
                var Password = query.split("&")[1].split("=")[1];
                $scope.jumpEntity = {
                    "LCID":jumpLCID,
                    "Password":Password
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
                success: function (responseData) {
                    if (responseData.Status === 'success') {
                        // 如果登录成功，那么这里要存储后天返回的LCID、XMID等信息，因为到跳转之后的页面会对这些信息进行有效性验证
                        toolLoginService.localStorage.set('token', responseData.Token);
                        toolLoginService.sessionStorage.set('LCID', jumpLCID);
                        toolLoginService.sessionStorage.set('LCMC', responseData.LCMC);
                        if (responseData.LCTYPE == "radseq") { responseData.LCTYPE = "RADseq" }
                        // window.location.href = window.location.href.replace('login/login.html', responseData.LCTYPE + '/index.html');
                        window.location.href = window.location.href.replace(/login\/login\.html.*/, responseData.LCTYPE + '/index.html');
                    } else {
                        window.location.href = window.location.href.replace(/login\/login\.html.*/, responseData.LCTYPE + '/index.html');
                    }
                },
                error: function (data) {
                    window.location.href = window.location.href.replace(/login\/login\.html.*/, "login/login.html");
                }
            });
           
        }

        //验证浏览器兼容性
        $scope.validateBrowser = function () {
            toolLoginService.BrowserDetect.init(); //alert(BrowserDetect.browser);
            //如果浏览器为ie且版本低于10，或者浏览器为Safari，则弹出提示框                                                                                                                                                                                                                                                                                                          
            if (toolLoginService.BrowserDetect.browser == 'Explorer' && parseInt(toolLoginService.BrowserDetect.version) < 10 || toolLoginService.BrowserDetect.browser == 'Safari') {
                // $scope.ShowGlobalMesgPanel();
                toolLoginService.popBDWindow();
            }
        };

        $scope.ShowGlobalMesgPanel = function () {
            $('.globalMesg').slideDown();
            $('.top_space').slideUp();
        };
        $scope.HideGlobalMesgPanel = function () {
            $('.globalMesg').slideUp();
            $('.top_space').slideDown();
        };

        $scope.tbx_password_OnKeyUp = function (e, flag) {
            var keycode = window.event ? e.keyCode : e.which;
            if (keycode == 13) {
                if (flag == 'lc') {
                    $scope.btn_lcLogin_OnClick();
                } else {
                    $scope.btn_mangerLogin_OnClick();
                }
            }
        };

        $scope.btn_lcLogin_OnClick = function () {
            if (!$scope.isLCSubmit) {
                // 判断登录按钮是否提交，如果正在提交则不执行
                $scope.isLCSubmit = true;
                $scope.lcLoginText = '正在登录...';
                LoginOn();
            }
        }

        $scope.btn_mangerLogin_OnClick = function () {
            if (!$scope.isMangerSubmit) {
                // 判断登录按钮是否提交，如果正在提交则不执行
                $scope.isMangerSubmit = true;
                $scope.mangerLoginText = '正在登录...';
                mangerLoginOn();
            }
        }

        function LoginOn() {
            $.ajax({
                url: options.api.base_url + '/login',
                type: 'POST',
                data: JSON.stringify($scope.formEntity),
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                withCredentials: true,
                cache: false,
                success: function (responseData) {
                    if (responseData.Status === 'success') {
                        // 如果登录成功，那么这里要存储后天返回的LCID、XMID等信息，因为到跳转之后的页面会对这些信息进行有效性验证
                        toolLoginService.localStorage.set('token', responseData.Token);
                        toolLoginService.sessionStorage.set('LCID', $scope.formEntity.LCID);
                        toolLoginService.sessionStorage.set('LCMC', responseData.LCMC);
                        // window.location.href = window.location.href.replace('login/login.html', responseData.LCTYPE + '/index.html');
                        window.location.href = window.location.href.replace('login/login.html', "mrna" + '/index.html');
                    } else {
                        if (responseData.Status == "Wrong username or password") {
                            var myPromise = toolLoginService.popMesgWindow('对不起，您输入的流程编号或密码错误！');
                        } else {
                            var myPromise = toolLoginService.popMesgWindow(responseData.Status);
                        }
                        myPromise.then(function (value) {
                            $scope.isLCSubmit = false;
                            $scope.lcLoginText = '登录并查看在线报告';
                        });
                    }
                },
                error: function (data) {
                    // 处理错误 .reject  
                    $log.debug('处理错误' + data);
                    $scope.isLCSubmit = false;
                    if ($scope.tabIndex == 0) {
                        $scope.isLCSubmit = false;
                        $scope.lcLoginText = '登录并查看在线报告';
                    }
                }
            });
        }

        function mangerLoginOn() {
            $.ajax({
                url: options.api.manager_base_url + '/admin/login',
                type: "POST",
                data: JSON.stringify($scope.mangerLoginEntity),
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                withCredentials: true,
                cache: false,
                success: function (res) {
                    if (res.exec == 0) {
                        toolLoginService.localStorage.set('token', res.fields[0].Token);
                        toolLoginService.sessionStorage.set("managerMail", res.fields[0].adminMail);
                        $rootScope.isMangerSystem = true;
                        window.location.href = window.location.href.replace('login/login.html', 'mangerSystem' + '/index.html');
                    } else {
                        if (res.execInfo == "系统错误，请联系管理员") {
                            var myPromise = toolLoginService.popMesgWindow('对不起，您输入的密码错误！');
                        } else {
                            var myPromise = toolLoginService.popMesgWindow(res.execInfo);
                        }
                        myPromise.then(function (value) {
                            $scope.isMangerSubmit = false;
                            $scope.mangerLoginText = '管理控制台登录';
                        });
                    }
                },
                error: function (data) {
                    // 处理错误 .reject  
                    $log.debug('处理错误' + data);
                    $scope.isMangerSubmit = false;
                    if ($scope.tabIndex == 1) {
                        $scope.isMangerSubmit = false;
                        $scope.mangerLoginText = '管理控制台登录';
                    }
                }
            })
        }

        //判断是否为测试版 
        $scope.isTest = false;
        $scope.GetIsTest = function () {
            $.ajax({
                url: options.api.base_url + '/GetServerVersion/GetVersion',
                type: 'GET',
                cache: false,
                success: function (data) {
                    $scope.$apply(function () {
                        $scope.isTest = data.isTest;
                        toolLoginService.sessionStorage.set('isTest', $scope.isTest);

                        if ($scope.isTest) {
                            $scope.pageTitle = options.testTitle;
                        }
                        else {
                            $scope.pageTitle = options.officialTitle;
                            var goStr = '<div class=\'top_nav_normal\'  ><ul><li><a href=\'./login.html\'>返回首页</a></li></ul></div>';
                            $('#div_goIndex').html(goStr);
                        }
                        $scope.loadingComplete = true;
                    });


                },
                error: function () {
                    toolLoginService.sessionStorage.set('isTest', false);
                    $scope.loadingComplete = true;
                }
            });
        }

    }
});