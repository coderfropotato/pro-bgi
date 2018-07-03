/*
 ** 功能简介：基于Angular的工具类
 ** 创建人：高洪涛
 ** 创建时间：2015-12-28
 ** 版本：V1.6.0
 */

define("superApp.loginService", ["super.superMessage", "ngDialog", "ngCookies"],
    function(SUPER_CONSOLE_MESSAGE) {
        //$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        var superApp = angular.module("superApp.loginService", ["ngDialog", "ngCookies"]);

        this.options = {
            api: {
                base_url: SUPER_CONSOLE_MESSAGE.apiPath,
                manager_base_url: SUPER_CONSOLE_MESSAGE.m_apiPath,
                java_url: SUPER_CONSOLE_MESSAGE.javaApiPath
            },
            loginUrl: SUPER_CONSOLE_MESSAGE.loginUrl,
            messageUrl: SUPER_CONSOLE_MESSAGE.messageUrl,
            testTitle: SUPER_CONSOLE_MESSAGE.testTitle,
            officialTitle: SUPER_CONSOLE_MESSAGE.officialTitle,
            popBDWindowPath: SUPER_CONSOLE_MESSAGE.popBDWindowPath
        };



        //工具类
        superApp.service("toolLoginService", toolLoginService);
        toolLoginService.$inject = ["$rootScope", "$log", "$state", "$filter", "$window", "$sce", "ngDialog", "$cookies"];

        function toolLoginService($rootScope, $log, $state, $filter, $window, $sce, ngDialog, $cookies) {

            /*
            ** 功能说明：验证浏览器版本工具类
            ** 返回类型：string
            1、返回浏览器名称 : BrowserDetect.browser
            2、返回浏览器版本: BrowserDetect.version
            3、返回运行平台: BrowserDetect.OS
            */
            this.BrowserDetect = {
                init: function() {
                    this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
                    this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";
                    this.OS = this.searchString(this.dataOS) || "an unknown OS";
                },
                searchString: function(data) {
                    for (var i = 0; i < data.length; i++) {
                        var dataString = data[i].string;
                        var dataProp = data[i].prop;
                        this.versionSearchString = data[i].versionSearch || data[i].identity;
                        if (dataString) {
                            if (dataString.indexOf(data[i].subString) != -1)
                                return data[i].identity;
                        } else if (dataProp)
                            return data[i].identity;
                    }
                },
                searchVersion: function(dataString) {
                    var index = dataString.indexOf(this.versionSearchString);
                    if (index == -1) return;
                    return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
                },
                dataBrowser: [{
                        string: navigator.userAgent,
                        subString: "Chrome",
                        identity: "Chrome"
                    },
                    {
                        string: navigator.userAgent,
                        subString: "OmniWeb",
                        versionSearch: "OmniWeb/",
                        identity: "OmniWeb"
                    },
                    {
                        string: navigator.vendor,
                        subString: "Apple",
                        identity: "Safari",
                        versionSearch: "Version"
                    },
                    {
                        prop: window.opera,
                        identity: "Opera",
                        versionSearch: "Version"
                    },
                    {
                        string: navigator.vendor,
                        subString: "iCab",
                        identity: "iCab"
                    },
                    {
                        string: navigator.vendor,
                        subString: "KDE",
                        identity: "Konqueror"
                    },
                    {
                        string: navigator.userAgent,
                        subString: "Firefox",
                        identity: "Firefox"
                    },
                    {
                        string: navigator.vendor,
                        subString: "Camino",
                        identity: "Camino"
                    },
                    { // for newer Netscapes (6+)
                        string: navigator.userAgent,
                        subString: "Netscape",
                        identity: "Netscape"
                    },
                    {
                        string: navigator.userAgent,
                        subString: "MSIE",
                        identity: "Explorer",
                        versionSearch: "MSIE"
                    },
                    {
                        string: navigator.userAgent,
                        subString: "Gecko",
                        identity: "Mozilla",
                        versionSearch: "rv"
                    },
                    { // for older Netscapes (4-)
                        string: navigator.userAgent,
                        subString: "Mozilla",
                        identity: "Netscape",
                        versionSearch: "Mozilla"
                    }
                ],
                dataOS: [{
                        string: navigator.platform,
                        subString: "Win",
                        identity: "Windows"
                    },
                    {
                        string: navigator.platform,
                        subString: "Mac",
                        identity: "Mac"
                    },
                    {
                        string: navigator.userAgent,
                        subString: "iPhone",
                        identity: "iPhone/iPod"
                    },
                    {
                        string: navigator.platform,
                        subString: "Linux",
                        identity: "Linux"
                    }
                ]
            };


            /*
             ** 功能简介：弹出提示信息框，只有确定按钮
             ** 参数说明：
             **      popMesg:确认框中body中要显示的信息
             **      popTitle:确认框左上角的标题
             **      dialogClass:
             **          确认框的样式  dialog-default、dialog-info、dialog-danger、dialog-waring、dialog-success
             **          如果不传，默认为default
             ** 返回类型：可以回调 myPromise.then();
             */
            this.popMesgWindow = function(popMesg, popTitle, width, height, dialogClass, top) {
                top = top ? top : 100;
                popTitle = (angular.isUndefined(popTitle) || popTitle == "") ? "系统消息" : popTitle;
                popMesg = (angular.isUndefined(popMesg) || popMesg == "") ? "-" : popMesg;
                width = (angular.isUndefined(width) || width == "") ? "460" : width;
                height = (angular.isUndefined(height) || height == "") ? "100" : height;
                dialogClass = (angular.isUndefined(dialogClass) || dialogClass == "") ? "dialog-default" : dialogClass;
                return ngDialog.openConfirm({
                    plain: true,
                    template: "<div class='ngdialog-message'><p>" + popMesg + "</p></div><div class='ngdialog-buttons'><button type='button' class='ngdialog-button btn-success'  ng-click='confirm(true)'>确定</button></div>",
                    className: "ngdialog-theme-default",
                    dialogClass: dialogClass,
                    width: width,
                    height: height,
                    title: popTitle,
                    top: top
                });
            };

            /* 
             **传入参数为cookie存放的路径和域名
             **
             */
            this.popBDWindow = function() {
                var domain = $window.document.domain;
                if ($cookies.get('browserDetectFlag')) {
                    return false;
                } else {
                    var expireDate = new Date();
                    expireDate.setDate(expireDate.getDate() + 1);
                    $cookies.put('browserDetectFlag', 'true', { 'path': '/', 'domain': domain, 'expires': expireDate });
                    return ngDialog.open({
                        title: "浏览器兼容性提示",
                        template: options.popBDWindowPath,
                        width: 720,
                        height: 350,
                        closeByDocument: false
                    })
                }
            }


            /*
             ** 功能说明：封装window的sessionStorage
             ** 返回类型：-
             */
            this.sessionStorage = {
                set: function(key, value) {
                    if ($window.sessionStorage) {
                        $window.sessionStorage.setItem(key, value);
                    }
                },
                get: function(key) {
                    if ($window.sessionStorage) {
                        if (!angular.isUndefined($window.sessionStorage.getItem(key))) {
                            return $window.sessionStorage.getItem(key);
                        } else {
                            return null;
                        }
                        //return $window.sessionStorage.getItem(key);
                    }
                },
                getJsonEntity: function(key) {
                    if ($window.sessionStorage) {
                        if (!angular.isUndefined($window.sessionStorage.getItem(key))) {
                            return JSON.parse($window.sessionStorage.getItem(key));
                        } else {
                            return null;
                        }
                        //return $window.sessionStorage.getItem(key);
                    }
                },
                remove: function(key) {
                    if ($window.sessionStorage) {
                        $window.sessionStorage.removeItem(key);
                    }
                },
                clear: function() {
                    if ($window.sessionStorage) {
                        $window.sessionStorage.clear();
                    }
                }
            };


            this.localStorage = {
                set: function(key, value) {
                    if ($window.localStorage) {
                        $window.localStorage.setItem(key, value);
                    }
                },
                get: function(key) {
                    if ($window.localStorage) {
                        if (!angular.isUndefined($window.localStorage.getItem(key))) {
                            return $window.localStorage.getItem(key);
                        } else {
                            return null;
                        }
                        //return $window.localStorage.getItem(key);
                    }
                },
                getJsonEntity: function(key) {
                    if ($window.localStorage) {
                        if (!angular.isUndefined($window.localStorage.getItem(key))) {
                            return JSON.parse($window.localStorage.getItem(key));
                        } else {
                            return null;
                        }
                        //return $window.localStorage.getItem(key);
                    }
                },
                remove: function(key) {
                    if ($window.localStorage) {
                        $window.localStorage.removeItem(key);
                    }
                },
                clear: function() {
                    if ($window.localStorage) {
                        $window.localStorage.clear();
                    }
                }
            };

        }




    });