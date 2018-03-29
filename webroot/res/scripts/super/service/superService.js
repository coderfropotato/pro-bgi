
/*
** 功能简介：基于Angular的工具类
** 创建人：高洪涛
** 创建时间：2015-12-28
** 版本：V1.6.0
*/

define("superApp.superService", ["super.superMessage", "ngDialog", "ngCookies"],
function (SUPER_CONSOLE_MESSAGE)
{
    //$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    var superApp = angular.module("superApp.superService", ["ngDialog", "ngCookies"]);

    this.options =
    {
        api:
        {
            base_url: SUPER_CONSOLE_MESSAGE.apiPath,
            chipseq_url: SUPER_CONSOLE_MESSAGE.chipseqApiPath,
            mrnaseq_url: SUPER_CONSOLE_MESSAGE.mrnaseqApiPath,
            gwas_url: SUPER_CONSOLE_MESSAGE.gwasApiPath,
            getGeneInfo_url:SUPER_CONSOLE_MESSAGE.getGeneInfoPath,
            mirna_url:SUPER_CONSOLE_MESSAGE.mirnaApiPath,
            rna16s_url:SUPER_CONSOLE_MESSAGE.rna16sApiPath,
            dna_url:SUPER_CONSOLE_MESSAGE.dnaApiPath,
            ITS_url:SUPER_CONSOLE_MESSAGE.itsApiPath,
            rad_url:SUPER_CONSOLE_MESSAGE.radApiPath,
            bsa_url:SUPER_CONSOLE_MESSAGE.bsaApiPath,
            manger_url:SUPER_CONSOLE_MESSAGE.mangerApiPath
        },
        loginUrl: SUPER_CONSOLE_MESSAGE.loginUrl,
        pathWayPath:SUPER_CONSOLE_MESSAGE.pathWayPath,
        motifPath:SUPER_CONSOLE_MESSAGE.motifPath,
        messageUrl: SUPER_CONSOLE_MESSAGE.messageUrl,
        testTitle: SUPER_CONSOLE_MESSAGE.testTitle,
        officialTitle: SUPER_CONSOLE_MESSAGE.officialTitle,
        popBDWindowPath: SUPER_CONSOLE_MESSAGE.popBDWindowPath,
    };



    //Ajax工具类
    superApp.service("ajaxService", AjaxS);
    AjaxS.$inject = ["$log", "$http", "$q", "$window", "toolService"];
    function AjaxS($log, $http, $q, $window, toolService)
    {
        //执行Ajax方法，执行前先验证token
        this.GetDeferData = function (ajaxConfig)
        {
            var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行 
            if (!this.validateWindowToken())
            {
                deferred.reject("NoAuth");
                window.location.href = window.location.href.replace(/ps\/.*/, options.messageUrl);
                return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API  
            }
            else
            {
                //params
                var selfAjaxConfig = {
                    method: "POST",
                    //headers: { "Content-Type": "application/json;charset=UTF-8", "X-Request-With": "null" }
                    headers: { "Content-Type": "application/json;charset=UTF-8" }
                };
                angular.extend(selfAjaxConfig, ajaxConfig);

                $http({
                    method: "POST",
                    url: options.api.base_url + "/swap_token",
                    headers: { "Content-Type": "application/json;charset=UTF-8" }
                })
                .success(function (data, status, headers, config)
                {
                    if (data == "false")
                    {
                        //没有授权了，返回登录窗口
                        window.location.href = window.location.href.replace(/ps\/.*/, options.loginUrl);
                    }
                    else
                    {
                        //重新赋值授权,然后执行政策逻辑
                        $window.sessionStorage.token = data;
                        $http({
                            method: selfAjaxConfig.method,
                            url: selfAjaxConfig.url,
                            data: selfAjaxConfig.data,
                            headers: selfAjaxConfig.headers
                        })
                        .success(function (data, status, headers, config)
                        {
                            deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了  
                        })
                        .error(function (data, status, headers, config)
                        {
                            try
                            {
                                if (status == "401")
                                {
                                    window.location.href = window.location.href.replace(/ps\/.*/, options.messageUrl);
                                    deferred.reject("NoAuth");
                                }
                                else
                                {
                                    $log.error(data);
                                    toolService.tableGridLoading.close(); //关闭浏览列表蒙版
                                    toolService.HideLoading(); //关闭页面等待蒙版
                                    toolService.popLoading.close(); //关闭页面等待效果2
                                    toolService.pageLoading.close(); //关闭页面等待蒙版
                                    window.location.href = window.location.href.replace(/ps\/.*/, options.messageUrl);
                                }
                            }
                            catch (e) { }
                        });
                    }
                })
                .error(function (data, status, headers, config)
                {
                    try
                    {
                        $log.error(data);
                        toolService.tableGridLoading.close(); //关闭浏览列表蒙版
                        toolService.HideLoading(); //关闭页面等待蒙版
                        toolService.popLoading.close(); //关闭页面等待效果2
                        toolService.pageLoading.close(); //关闭页面等待蒙版
                        window.location.href = window.location.href.replace(/ps\/.*/, options.messageUrl);
                        //var myPromise = toolService.popMesgWindow("对不起，服务器无响应，请尝试重新登录并重试！！");
                        //myPromise.then(function (value)
                        //{
                        //    window.location.href = window.location.href.replace(/ps\/.*/, options.loginUrl);
                        //    deferred.reject("NoAuth");
                        //});
                    }
                    catch (e) { }
                });


                return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API  
            }
        };

        // 合并多个Ajax的Promise，以解决依赖多个请求的问题，方法接收多个Ajax配置组成的数组
        this.GetMultiDeferData = function (ajaxConfigs) {
            if (!angular.isArray(ajaxConfigs)) return;
            var promises = ajaxConfigs.map(function (ajaxConfig) {
                return this.GetDeferData(ajaxConfig);
            }, this);
            return $q.all(promises);
        };

        //执行Ajax方法，不验证token
        this.GetDeferDataNoAuth = function (ajaxConfig)
        {
            //params
            var selfAjaxConfig = {
                method: "POST",
                //headers: { "Content-Type": "application/json;charset=UTF-8", "X-Request-With": "null" }
                headers: { "Content-Type": "application/json;charset=UTF-8" }
            };

            angular.extend(selfAjaxConfig, ajaxConfig);
            //$log.debug(selfAjaxConfig);
            //if (angular.isUndefined(ajaxConfig.headers))
            //{
            //    ajaxConfig.headers = { "Content-Type": "application/x-www-form-urlencoded" }
            //}
            var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行 
            $http({
                method: selfAjaxConfig.method,
                url: selfAjaxConfig.url,
                data: selfAjaxConfig.data,
                headers: selfAjaxConfig.headers
            })
            .success(function (data, status, headers, config)
            {
                deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了  
            })
            .error(function (data, status, headers, config)
            {
                try
                {
                    $log.error(data);
                    toolService.tableGridLoading.close(); //关闭浏览列表蒙版
                    toolService.HideLoading(); //关闭页面等待蒙版
                    toolService.popLoading.close(); //关闭页面等待效果2
                    toolService.popMesgWindow("对不起，服务器无响应，请尝试重新登录并重试！");
                    deferred.reject(data); // 声明执行失败，即服务器返回错误  
                }
                catch (e) { }
            });
            return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API  
        };

        //去后端验证有没有授权，如果有效时间范围内，重新获得授权
        this.validateToken = function ()
        {
            var retulst = true;
            //判断授权是否有值
            if ($window.sessionStorage.token == "undefined" || $window.sessionStorage.token == undefined)
            {
                return false;
            }

            //如果有值，则去后端验证授权
            $http({
                method: "POST",
                url: options.api.base_url + "/swap_token",
                headers: { "Content-Type": "application/json;charset=UTF-8", "X-Request-With": "null" }
            })
            .success(function (data, status, headers, config)
            {
                if (data == "false")
                {
                    //没有授权了，返回登录窗口
                    window.location.href = window.location.href.replace(/ps\/.*/, options.loginUrl);
                }
                else
                {
                    //重新赋值授权
                    $window.sessionStorage.token = data;
                }
            })
            .error(function (data, status, headers, config)
            {
                $log.error(data);
            });
            return true;
        }

        //验证客户端当前授权是否已丢弃
        this.validateWindowToken = function ()
        {
            if ($window.sessionStorage.token == "undefined"
                || $window.sessionStorage.token == undefined
                || $window.sessionStorage.token == "")
            {
                return false;
            }
            else
            {
                return true;
            }
        }
    }


    //工具类
    superApp.service("toolService", toolService);
    toolService.$inject = ["$rootScope", "$log", "$state", "$filter", "$window", "$sce", "ngDialog", "$cookies"];
    function toolService($rootScope, $log, $state, $filter, $window, $sce, ngDialog, $cookies)
    {
        /*
        ** 功能简介：操作成功后返回提示信息
        ** 参数说明：
        **      operateMsg:操作说明，譬如“用户添加”、“xx删除”等
        ** 返回类型：操作消息
        */
        this.operateSuccess = function (operateMsg)
        {
            return operateMsg + "成功！";
        }
        /*
        ** 功能简介：操作失败后返回提示信息
        ** 参数说明：
        **      operateMsg:操作说明，譬如“用户添加”、“xx删除”等
        ** 返回类型：操作消息
        */
        this.operateError = function (operateMsg)
        {
            return "对不起" + operateMsg + "失败，请重试或及时联系系统管理员！";
        }
        /*
        ** 功能简介：窗口跳转
        ** 参数说明：
        **      urlStr:跳转地址
        ** 返回类型：无返回值
        */
        this.goUrl = function (urlStr)
        {
            window.location.href = urlStr;
        };

        /*
        ** 功能说明：设置跟作用域loading变量为true，将现实框架级别的蒙版等待
        ** 返回类型：无返回值
        */
        this.ShowLoading = function ()
        {
            $rootScope.loading = true;
        }

        /*
        ** 功能说明：设置跟作用域loading变量为false，将现实框架级别的蒙版等待
        ** 返回类型：无返回值
        */
        this.HideLoading = function ()
        {
            $rootScope.loading = false;
        }

        /*
        ** 功能说明：关闭所有nglog打开的蒙版窗口
        ** 参数：value 供回调函数获取，请参考 popWindow
        ** 返回类型：无返回值
        */
        this.popCloseAll = function (value)
        {
            ngDialog.closeAll(value);
        }


        /*
        ** 功能说明：关闭nglog打开的最顶层窗口            (！！注意：若中间有LOADING穿插会出错)
        ** 参数：value 供回调函数获取，请参考 popWindow
        ** 返回类型：无返回值
        */
        this.popCloseTop = function (value)
        {
            ngDialog.closeTop(value);
        }

        /*
        ** 功能说明：关闭nglog打开的最顶层窗口
        ** 参数：value 供回调函数获取，请参考 popWindow
        ** 返回类型：无返回值
        */
        this.popClose = function (id, value)
        {
            ngDialog.close(id, value);
        }

        /*
        ** 功能说明：封装window的localStorage
        ** 返回类型：-
        */
        this.localStorage =
        {
            set: function (key, value)
            {
                if ($window.localStorage)
                {
                    $window.localStorage.setItem(key, value);
                }
            },
            get: function (key)
            {
                if ($window.localStorage)
                {
                    if (!angular.isUndefined($window.localStorage.getItem(key)))
                    {
                        return $window.localStorage.getItem(key);
                    }
                    else
                    {
                        return null;
                    }
                    //return $window.localStorage.getItem(key);
                }
            },
            remove: function (key)
            {
                if ($window.localStorage)
                {
                    $window.localStorage.removeItem(key);
                }
            },
            clear: function ()
            {
                if ($window.localStorage)
                {
                    $window.localStorage.clear();
                }
            }
        };

        /*
        ** 功能说明：封装window的sessionStorage
        ** 返回类型：-
        */
        this.sessionStorage =
        {
            set: function (key, value)
            {
                if ($window.sessionStorage)
                {
                    $window.sessionStorage.setItem(key, value);
                }
            },
            get: function (key)
            {
                if ($window.sessionStorage)
                {
                    if (!angular.isUndefined($window.sessionStorage.getItem(key)))
                    {
                        return $window.sessionStorage.getItem(key);
                    }
                    else
                    {
                        return null;
                    }
                    //return $window.sessionStorage.getItem(key);
                }
            },
            getJsonEntity: function (key)
            {
                if ($window.sessionStorage)
                {
                    if (!angular.isUndefined($window.sessionStorage.getItem(key)))
                    {
                        return JSON.parse($window.sessionStorage.getItem(key));
                    }
                    else
                    {
                        return null;
                    }
                    //return $window.sessionStorage.getItem(key);
                }
            },
            remove: function (key)
            {
                if ($window.sessionStorage)
                {
                    $window.sessionStorage.removeItem(key);
                }
            },
            clear: function ()
            {
                if ($window.sessionStorage)
                {
                    $window.sessionStorage.clear();
                }
            }
        };

        
        /*
        ** 功能说明：获取登录用户实体信息
        ** 返回类型：Object
        */
        this.GetUserInfoEntity = function ()
        {
            var userInfoEntity = this.sessionStorage.getJsonEntity("userInfoEntity");
            if (userInfoEntity == null)
            {
                try
                {
                    this.tableGridLoading.close(); //关闭浏览列表蒙版
                    this.HideLoading(); //关闭页面等待蒙版
                    this.popLoading.close(); //关闭页面等待效果2
                    window.location.href = window.location.href.replace(/ps\/.*/, options.messageUrl);
                    //var myPromise = this.popMesgWindow("对不起，您没有合法的授权信息，您需要重新登录获取授权！");
                    //myPromise.then(function (value)
                    //{
                    //    window.location.href = window.location.href.replace(/ps\/.*/, options.loginUrl);
                    //});
                }
                catch (e) { }
            }
            else
            {
                return userInfoEntity;
            }
        }

        /*
        ** 功能简介：弹出确认对话框
        ** 参数说明：
        **      popMesg:确认框中body中要显示的信息
        **      popTitle:确认框左上角的标题
        **      dialogClass:
        **          确认框的样式  dialog-default、dialog-info、dialog-danger、dialog-waring、dialog-success
        **          如果不传，默认为default
        ** 返回类型：可以回调 myPromise.then(),error();
        */
        this.popConfirm = function (popMesg, popTitle, dialogClass, top, width, height)
        {
            top = top ? top : 100;
            var _width = width ? width - 24 : 550;
            var _height = height ? height - 24 - 27 : 'auto';
            popTitle = (angular.isUndefined(popTitle) || popTitle == "") ? "系统消息" : popTitle;
            popMesg = (angular.isUndefined(popMesg) || popMesg == "") ? "-" : popMesg;
            dialogClass = (angular.isUndefined(dialogClass) || dialogClass == "") ? "dialog-default" : dialogClass;
            return ngDialog.openConfirm({
                plain: true,
                template: "<div class='ngdialog-message'><p>" + popMesg + "</p></div><div class='ngdialog-buttons'><button type='button' class='ngdialog-button btn-success' ng-click='confirm(true)'>确定</button><button type='button' class='ngdialog-button  btn-default' ng-click='closeThisDialog(false)'>取消</button></div>",
                className: "ngdialog-theme-default",
                dialogClass: dialogClass,
                title: popTitle,
                top: top,
                width: _width,
                height: _height
            });
        };

        /*
            ** 功能简介：弹出输入对话框，修改图的标题
            ** 参数说明：
            **      popTitle:确认框左上角的标题
            **      chartWidth：图的宽度
                    chartHeight：图高度
                    trans_y:偏移
            **      textNode：文本node
            **         value：输入框的value
            **      dialogClass:
            **          确认框的样式  dialog-default、dialog-info、dialog-danger、dialog-waring、dialog-success
            **          如果不传，默认为dialog-default
        */
        this.popPrompt = function (popTitle,chartWidth,chartHeight,textNode, value,trans_y ,dialogClass, top, width, height)
        {
            top = top ? top : 100;
            trans_y = trans_y ? trans_y : 0;
            var _width = width ? width - 24 : 450;
            var _height = height ? height - 24 - 27 : 'auto';
            popTitle = (angular.isUndefined(popTitle) || popTitle == "") ? "系统消息" : popTitle;
            value = (angular.isUndefined(value) || value == "") ? "请输入" : value;
            dialogClass = (angular.isUndefined(dialogClass) || dialogClass == "") ? "dialog-default" : dialogClass;
            ngDialog.open({
                plain: true,
                template: "<div><input type='text' id='TextInput' value='"+value+"' class='form-control'></div><div class='ngdialog-buttons'><button type='button' class='ngdialog-button btn-success' ng-click='confirm()'>确定</button><button type='button' class='ngdialog-button  btn-default' ng-click='closeThisDialog(false)'>取消</button></div>",
                className: "ngdialog-theme-default",
                dialogClass: dialogClass,
                title: popTitle,
                top: top,
                width: _width,
                height: _height,
                scope: $rootScope,
                controller: function ($rootScope) {
                    $rootScope.confirm = function (){
                        var val = $("#TextInput").val();
                        if(val != null && val !=""){
                            value = val;
                        }
                        textNode.textContent = value;
                        if(chartWidth != null && chartHeight == null){
                            var textWidth = textNode.getBoundingClientRect().width;
                            var transform_x = Math.ceil((chartWidth - textWidth)/2);
                            textNode.setAttribute("transform", "translate(" + transform_x + ","+trans_y+")");
                        }
                        if(chartHeight != null && chartWidth == null){
                            var textHeight = textNode.getBoundingClientRect().height;
                            var transform_y = Math.ceil((chartHeight - textHeight)/2);
                            textNode.setAttribute("transform", "translate(0," + transform_y + ") rotate(90)");
                        }
                       
                        ngDialog.close();
                    };
                }
            });
        };

        /*
        ** 功能简介：加载等待框显示与关闭
        ** 参数说明：
        **      popMesg:等待框中要显示的信息，默认：正在加载...
        ** 返回类型：无返回值
        */
        this.popLoading = {
            open: function (popMesg, width, height)
            {
                popMesg = (angular.isUndefined(popMesg) || popMesg == "") ? "正在加载..." : popMesg;
                var _width = width ? width : 110;
                var _height = height ? height : 110;
                ngDialog.open({
                    plain: true,
                    template: "<div class='ngdialog-message'><div class='loader-inner line-scale'><div></div><div></div><div></div><div></div><div></div></div><p  ng-click='closeThisDialog(false)'>" + popMesg + "</p></div>",
                    className: "ngdialog-theme-default ngdialog-loading",
                    closeByDocument: false,
                    closeByEscape: false,
                    width: _width,
                    height: _height
                });
            },
            close: function ()
            {
                ngDialog.close();
            }
        };

        /*
        ** 功能简介：保存成功，等待等消息提示框
        ** 参数说明：
        **      popMesg:提示框信息
        **      routeStr：当不为空时，提示框在规定时间关闭后进行路由跳转，为空时不跳转
        **      urlStr：当不为空时，提示框在规定时间关闭后进行页面跳转，为空时不跳转
        **      time：关闭时间，默认1秒
        ** 返回类型：无返回值
        */
        this.popTips = function (popMesg, routeStr, urlStr, time, width, height, top)
        {
            if (angular.isUndefined(routeStr))
            {
                routeStr = "";
            }
            if (angular.isUndefined(urlStr))
            {
                urlStr = "";
            }
            if (angular.isUndefined(time))
            {
                time = 1000;
            }
            popMesg = (angular.isUndefined(popMesg) || popMesg == "") ? "消息提示框" : popMesg;
            time = (angular.isUndefined(time) || time == "") ? 50 : time;
            width = (angular.isUndefined(width) || width == "") ? "190" : width;
            top = (angular.isUndefined(top) || top == "") ? "50" : top;
            height = (angular.isUndefined(height) || height == "") ? "50" : height;

            var dialog = ngDialog.open({
                plain: true,
                template: '<div class="ngdialog-message"><p>' + popMesg + '</p></div>',
                className: 'ngdialog-theme-default ngdialog-tips',
                overlay: false,
                width: width,
                height: height,
                top: top
            });
            setTimeout(function ()
            {
                if (angular.isUndefined(urlStr) || urlStr == "" || urlStr == null)
                {
                    if (angular.isUndefined(routeStr) || routeStr == "" || routeStr == null)
                    {
                        dialog.close();
                    }
                    else
                    {
                        //执行路由
                        $state.go(routeStr);
                        dialog.close();
                    }
                }
                else
                {
                    window.location.href = urlStr;
                }
            }, time);
        }

        this.popTipsTwo = function (popMesg, time, top)
        {
            if (angular.isUndefined(time))
            {
                time = 1000;
            }
            popMesg = (angular.isUndefined(popMesg) || popMesg == "") ? "消息提示框" : popMesg;
            time = (angular.isUndefined(time) || time == "") ? 50 : time;

            top = (angular.isUndefined(top) || top == "") ? "50" : top;


            var dialog = ngDialog.open({
                plain: true,
                template: '<div class="ngdialog-message ngdialog-messageTwo"><p>' + popMesg + '</p></div>',
                className: 'ngdialog-theme-default ngdialog-tips ngdialog-su',
                overlay: false,
                width: 190,
                height: 40,
                top: top
            });
            setTimeout(function ()
            {
                dialog.close();
                $("#" + dialog.id).remove();
            }, time);
        }

        /*
        ** 功能简介：iframe弹出框
        ** 注意事项：尽量少用，用这个控件要自行解决跨域问题
        ** 参数说明：
        **      url：iframe里面包含的页面路径
        **      title：弹出框标题
        **      width：弹出框宽度
        **      height：弹出框高度
        **      dialogClass：确认框的样式  dialog-default、dialog-info、dialog-danger、dialog-waring、dialog-success
        ** 返回类型：无返回值
        */
        this.popFrame = function (url, title, width, height, dialogClass, top)
        {
            top = top ? top : 100;
            var frameWidth = width ? width - 24 : 400;
            var frameHeight = height ? height - 24 - 27 : 'auto';
            dialogClass = (angular.isUndefined(popMesg) || popMesg == "") ? "dialog-default" : popMesg;
            ngDialog.open({
                plain: true,
                template: '<div class="ngdialog-message"><iframe frameborder="0" width="' + frameWidth + '" height="' + frameHeight + '" src="' + url + '"></iframe></div>',
                className: 'ngdialog-theme-default',
                closeByDocument: false,
                closeByEscape: false,
                width: width,
                height: height,
                title: title,
                dialogClass: dialogClass,
                top: top
            });
        }

        /*
        ** 功能简介：window提示框，里面可以嵌入html页面
        ** 注意事项：此方法利用 $http.GET，将目标页面的html加载到对应的div中，所以目标页面不需要引用任何css/js，标题，关闭，确定等按钮放在目标页面
        ** 参数说明：
        **      urlStr：目标页面路径
        **      title：弹出框标题
        **      width：弹出框宽度
        **      height：弹出框高度
        **      dialogClass：确认框的样式  dialog-default、dialog-info、dialog-danger、dialog-waring、dialog-success
        ** 返回类型：可以回调 myPromise.then(),error();
        */
        this.popConfirmWindow = function (urlStr, title, width, height, dialogClass, top)
        {
            top = top ? top : 100;
            title = (angular.isUndefined(title) || title == "") ? "系统消息" : title;
            width = (angular.isUndefined(width) || width == "") ? "500" : width;
            height = (angular.isUndefined(height) || height == "") ? "110" : height;
            dialogClass = (angular.isUndefined(dialogClass) || dialogClass == "") ? "dialog-default" : dialogClass;
            return ngDialog.openConfirm({
                //plain: true,
                template: urlStr,
                className: 'ngdialog-theme-default',
                closeByDocument: false,
                closeByEscape: false,
                width: width,
                height: height,
                title: title,
                dialogClass: dialogClass,
                top: top
            });
        }

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
        this.popMesgWindow = function (popMesg, popTitle, width, height, dialogClass, top)
        {
            top = top ? top : 100;
            popTitle = (angular.isUndefined(popTitle) || popTitle == "") ? "系统消息" : popTitle;
            popMesg = (angular.isUndefined(popMesg) || popMesg == "") ? "-" : popMesg;
            width = (angular.isUndefined(width) || width == "") ? "500" : width;
            height = (angular.isUndefined(height) || height == "") ? "110" : height;
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
        ** 功能简介：window框，里面可以嵌入html页面
        ** 注意事项：此方法利用 $http.GET，将目标页面的html加载到对应的div中，所以目标页面不需要引用任何css/js，标题，关闭，确定等按钮放在目标页面
        ** 参数说明：
        **      urlStr：目标页面路径
        **      title：弹出框标题
        **      width：弹出框宽度
        **      height：弹出框高度
        **      dialogClass：确认框的样式  dialog-default、dialog-info、dialog-danger、dialog-waring、dialog-success
        **      top：距离窗体顶部位置，默认100px;
        **      isShowClose：是否显示右上角关闭按钮，默认显示
        **      callBack：回调函数；  
               
        用法如窗体内： <div class="my_dialog_close" ng-click="closeThisDialog('save')">
        调用者controller 获取 closeThisDialog 所传入的参数，示例如下：
        $scope.winCallBack = function(value) {
        alert('value =' + value)
        return true; //返回真则关闭窗口
        return false; //返回假则不关闭
        }
        toolService.popWindow("userFileUpload.html", "点击“添加新文件”，或拖拽文件到列表", 850, 525, "dialog-default", 100, false, $scope.winCallBack);     
        
        ** 返回类型：可以回调 myPromise.then() , 仅作为兼容 myPromise, 建议使用回调函数 callBack; 
        */
        this.popWindow = function (urlStr, title, width, height, dialogClass, top, isShowClose, callBack, dialogID,closeByDocument)
        {

            top = top ? top : 100;
            var frameWidth = width ? width - 24 : 400;
            var frameHeight = height ? height - 24 - 27 : 'auto';
            isShowClose = (isShowClose != undefined) ? isShowClose : true;
            dialogClass = (angular.isUndefined(dialogClass) || dialogClass == "") ? "dialog-default" : dialogClass;
            var closeDoc = !!closeByDocument;
            return ngDialog.openConfirm({
                //plain: true,
                template: urlStr,
                className: 'ngdialog-theme-default',
                closeByDocument: closeDoc,
                closeByEscape: false,
                width: width,
                height: height,
                title: title,
                dialogClass: dialogClass,
                showClose: isShowClose,
                top: top,
                preCloseCallback: callBack,
                dialogID: dialogID
            });

        }

        /*
        ** 功能说明：手动改变表单验证对象
        ** 参数说明：
        **      form：传进来的表单对象
        **      input: 指定要更改的表单的名称NAME
        **      valid: ture | false 
        ** 返回类型：String
        */
        this.myCustomVerification = function (form, inputName, valid, msg)
        {
            var $thisInput = $("[name=" + inputName + "]");
            form.myErrList = removeNameFormStr(form.myErrList, inputName);  /* 自定义一个错误队列 */
            if (valid)
            {
                $thisInput.removeClass("ng-invalid").addClass("ng-valid").addClass("ng-touched");
                if (form.myErrList)
                {
                    form.$valid = false;   /* 待验证input列表非空 ，则表单为 false */
                    form.$invalid = true;
                }
            } else
            {
                $thisInput.addClass("ng-invalid").removeClass("ng-valid").addClass("ng-touched");
                form.$valid = false;   /* 只有一个为 false ，则表单为 false */
                form.$invalid = true;
                form.myErrList = addNameToStr(form.myErrList, inputName);  /* 自定义一个错误队列 */

                /*错误有提示*/
                if (msg)
                {
                    $("[name=" + inputName + "]").parent().find(".myvalidate-wrap-tips").html(msg);
                }
            }

            /* 手动更改form对象的值 */
            if (!isEmpty(form.$error) && form.$error.required.length > 0)
            {
                for (var i = 0; i < form.$error.required.length; i++)
                {
                    if (inputName == form.$error.required[i].$name)
                    {
                        form.$error.required[i].$invalid = !valid;
                        form.$error.required[i].$valid = valid;
                    }
                }
            }

            /* 没有任何错误，验证通过 */

            if (isEmpty(form.$error) && !form.myErrList)
            {
                form.$invalid = false;
                form.$valid = true;
            }

            /* 保存错误INPUT名称 */
            function addNameToStr(baseStr, value)
            {
                if (!baseStr)
                {
                    return value;
                } else
                {
                    return baseStr + "|" + value
                }
            }

            /* 移除错误INPUT名称 */
            function removeNameFormStr(baseStr, value)
            {
                if (!baseStr || value == baseStr)
                {
                    return "";
                } else
                {
                    var arr = baseStr.split("|");
                    var i = 0;
                    for (i = 0; i < arr.length && value != arr[i]; i++) { }
                    //alert("i=" + i);
                    if (i != arr.length)
                    {
                        for (j = i; j < arr.length - 1; j++)
                        {
                            arr[j] = arr[j + 1];
                        }
                        arr.length--;
                    }
                    var str = arr.join("|");
                    return str.replace("||", "|");
                }
            }

            function isEmpty(value)
            {
                return (Array.isArray(value) && value.length === 0)
                || (Object.prototype.isPrototypeOf(value) && Object.keys(value).length === 0);
            }

        }

        this.setFormInvalid = function (form, inputNames)
        {
            form.$invalid = true;
            form.$valid = false;
            form.myErrList = inputNames.join("|");
        }


        /*
        ** 功能说明：设置input控件验证信息方法
        ** 参数说明：
        **      inputName：input控件的name值
        **      msg：错误提示信息
        ** 返回类型：无返回
        */
        this.inputValidateMesg = {
            open: function (inputName, msg, isShowPanel)
            {
                var $thisInput = $("[name=" + inputName + "]");
                if ($thisInput.length < 1)
                {
                    $thisInput = $("#" + inputName);
                }
                $thisInput.addClass("ng-invalid").removeClass("ng-valid").addClass("ng-touched");

                if (isShowPanel)
                {
                    $thisInput.parent().find(".ng-validateMesg:eq(0)").html(msg);
                    $thisInput.parent().find(".ng-validateMesg:eq(0)").show();
                }
                else
                {
                    $thisInput.parent().find(".myvalidate-wrap-tips").html(msg);
                    $thisInput.parent().find(".ng-validateMesg:eq(0)").hide();
                }
            },
            close: function (inputName)
            {
                var $thisInput = $("[name=" + inputName + "]");
                if ($thisInput.length < 1)
                {
                    $thisInput = $("#" + inputName);
                }
                $thisInput.removeClass("ng-invalid").addClass("ng-valid").addClass("ng-touched");
                $thisInput.parent().find(".ng-validateMesg:eq(0)").html("");
                $thisInput.parent().find(".ng-validateMesg:eq(0)").hide();
            },
            closeALL: function (inputName)
            {
                var $thisInput = $("[name=" + inputName + "]");
                if ($thisInput.length < 1)
                {
                    $thisInput = $("#" + inputName);
                }
                $thisInput.find(".ng-validateMesg").html("");
                $thisInput.find(".ng-validateMesg").hide("");
                var inputObj = $thisInput.find(".ng-invalid");
                inputObj.removeClass("ng-invalid").addClass("ng-valid").addClass("ng-touched");
            }
        };



        /*
        ** 功能说明：设置input控件验证信息方法 - 跟指令 myFormValidate 配对
        ** 参数说明：
        **      inputName：input控件的name值
        **      msg：错误提示信息
        **      若有传入 msg ，则input验证置为无效； 否则为有效；
        ** 返回类型：无返回
        */
        this.myValidate = function (inputName, msg)
        {
            var $input = $("[name='" + inputName + "']");
            if ($input.length > 1)
            {
                alert("调用方法 'this.myValidate' 报错，请检查是否有重复的 name");
            }
            if ($input.length < 1) { return; }
            if (msg)
            {
                $input.parent().find(".myvalidate-wrap-tips").html(msg);
                $input.addClass("ng-invalid ng-touched");
            } else
            {
                $input.removeClass("ng-invalid ng-touched");
            }
        };

        /*
        ** 功能说明：获取字符串长度 （汉字算两个字节）
        ** 参数说明：
        **      val：传进来的字符串
        ** 返回类型：字符串长度
        */
        this.getByteLen = function (val)
        {
            var len = 0;
            for (var i = 0; i < val.length; i++)
            {
                var length = val.charCodeAt(i);
                if (length >= 0 && length <= 128)
                {
                    len += 1;
                }
                else
                {
                    len += 2;
                }
            }
            return len;
        }

        /*
        ** 功能说明：日期格式化方法
        ** 参数说明：
        **      value：传进来的参数
        **      formatStr：yyyy-MM-dd、yyyy-MM-dd HH-mm-dd，默认：yyyy-MM-dd
        ** 返回类型：String
        */
        this.formatDate = function (value, formatStr)
        {
            var dateFilter = $filter("date");
            formatStr = (formatStr == undefined || formatStr == "") ? "yyyy-MM-dd" : formatStr;
            return dateFilter(value, formatStr);
        }

        /*
        ** 功能说明：钱币格式化方法
        ** 参数说明：
        **      value：传进来的参数
        **      formatStr：默认：""
        {{ 12 | currency}}  <!--将12格式化为货币，默认单位符号为 '$', 小数默认2位-->
        {{ 12.45 | currency:'￥'}} <!--将12.45格式化为货币，使用自定义单位符号为 '￥', 小数默认2位-->
        {{ 12.45 | currency:'CHY￥':1}} <!--将12.45格式化为货币，使用自定义单位符号为 'CHY￥', 小数指定1位, 会执行四舍五入操作 -->
        {{ 12.55 | currency:undefined:0}} <!--将12.55格式化为货币， 不改变单位符号， 小数部分将四舍五入 -->
        ** 返回类型：String
        */
        this.formatManey = function (value, formatStr)
        {
            var _filter = $filter("currency");
            formatStr = (formatStr == undefined || formatStr == "") ? "" : formatStr;
            return _filter(value, formatStr);
        }

        /*
        ** 功能说明：将对象格式化成标准的JSON格式
        ** 参数说明：
        **      value：传进来的参数  {name:'Jack', age: 21}
        ** 返回类型：Json 对象
        */
        this.formatJson = function (value)
        {
            //var _filter = $filter("json");
            //return _filter(value);
            return eval("(" + value + ")")
        }

        /*
        ** 功能说明：钱币格式化方法
        ** 参数说明：
        **      input：选取前N个记录
        **      limit：选择要返回的记录数
        ** 说明示例：
        **      <div ng-init="myArr = [{name:'Tom', age:20}, {name:'Tom Senior', age:50}, {name:'May', age:21}, {name:'Jack', age:20}, {name:'Alice', age:22}]">
        **          <div ng-repeat="u in myArr | limitTo:2">
        **              <p>Name:{{u.name}}
        **              <p>Age:{{u.age}}
        **          </div>
        **      </div>
        ** 返回类型：Object
        */
        this.formatLimit = function (input, limit)
        {
            var _filter = $filter("limitTo");
            return _filter(input, limit);
        }

        /*
        ** 功能说明：将对象数组、Json进行排序
        ** 参数说明：
        **      array：目标参数
        **      sortPredicate：目标对象中要排序的自读['','',''],如果其中某个字段前面加上 - ，表示根据这个字段倒序
        如：['name','-deposit'] 表示：通过name字段正序排序，同时根据 deposit 进行倒序
        **      reverseOrder：整个结果集的正序/倒序显示 false/true  true:倒序，false：正序
        ** 说明示例：
        **      <div ng-init="myArr = [{name:'Tom', age:20, deposit: 300}, {name:'Tom', age:22, deposit: 200}, {name:'Tom Senior', age:50, deposit: 200}, {name:'May', age:21, deposit: 300}, {name:'Jack', age:20, deposit:100}, {name:'Alice', age:22, deposit: 150}]">
        **          <!--deposit前面的'-'表示deposit这列倒叙排序，默认为顺序排序参数reverseOrder：true表示结果集倒叙显示-->
        **          <div ng-repeat="u in myArr | orderBy:['name','-deposit']:true">
        **              <p>Name:{{u.name}}</p>
        **              <p>Deposit:{{u.deposit}}</p>
        **              <p>Age:{{u.age}}</p>
        **              <br />
        **          </div>
        **      </div>
        ** 返回类型：Object
        */
        this.formatOrderBy = function (array, sortPredicate, reverseOrder)
        {
            var _filter = $filter("orderBy");
            return _filter(array, sortPredicate, reverseOrder);
        }

        /*
        ** 功能说明：页面最上方的等待状态条
        ** 返回类型：无
        */
        var taskTimer = null;
        this.topLoading = {
            open: function ()
            {

                var templateStr = "<div class='progressMask'></div><div class='progress topProgress ' role='progressbar'  aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' >"
                            + "     <div class='progress-bar' ></div>"
                            + "</div>";
                $("body").append(templateStr);
                var zxcs = 1;
                var bc = 10; //步长
                var nowWidth = 20;
                taskTimer = setInterval(function ()
                {
                    nowWidth += Math.floor((100 - nowWidth) / 10);
                    if (nowWidth > 90)
                    {
                        $(".topProgress:eq(0)").find(".progress-bar:eq(0)").width($(".topProgress:eq(0)").width());
                        setTimeout(function ()
                        {
                            if (taskTimer != null)
                            {
                                clearInterval(taskTimer);
                            }

                            $(".topProgress:eq(0)").remove();
                            $(".progressMask:eq(0)").remove();
                        }, 2000)
                    }
                    else
                    {
                        $(".topProgress:eq(0)").find(".progress-bar:eq(0)").width(nowWidth + "%");
                    }
                }, 100);
            },
            close: function ()
            {
                setTimeout(function ()
                {
                    $(".topProgress:eq(0)").find(".progress-bar:eq(0)").width($(".topProgress:eq(0)").width());
                    if (taskTimer != null)
                    {
                        clearInterval(taskTimer);
                    }
                    $(".topProgress:eq(0)").remove();
                    $(".progressMask:eq(0)").remove();
                }, 0)

            }
        };

        /*
        ** 功能说明：自画浏览列表加载蒙版显示与关闭，
        ** 参数说明：
        **      tableID：调用层table对象
        **      markerHeight：蒙版的高度，如果不传如则默认从table对象左上角开始，一直到窗体最下方
        **      markerWidth：蒙版的宽度，如果不传如则默认为grid的宽度
        ** 返回类型：无
        */
        this.tableGridLoading = {
            open: function (tableID, markerHeight, markerWidth)
            {
                if ($("#pageLoading").length > 0) return;
                //获取蒙版的高度
                var _markerHeight = $(window).height() - $(tableID).offset().top;
                _markerHeight = markerHeight ? markerHeight : _markerHeight;
                //获取grid的left和top
                var _markerTop = $(tableID).offset().top;
                var _markerWidth = $(tableID).width() + 1;
                _markerWidth = markerWidth ? markerWidth : _markerWidth;
                var _markerLeft = $(tableID).offset().left;

                var templateStr = "<div class='gridModal' style='width:" + _markerWidth + "px;left:" + _markerLeft + "px;top:" + _markerTop + "px;height:" + _markerHeight + "px;'>"
                            + "     <div class='alert alert-info loadingText' style='top: 50%;margin-top:0px;position:fixed;'>正在加载...</div>"
                            + "</div>";
                $("body").append(templateStr);
            },
            close: function ()
            {
                $(".gridModal").remove();
            }
        };



        this.pageLoading = {
            open: function (mesg,width)
            {
                if (!mesg) mesg = "正在加载...";
                if (!width) width = "110";
                $rootScope.pageIsLoad = false;
                var templateStr = "<div id='pageLoading' class='ngdialog ngdialog-theme-default ngdialog-loading ng-scope selfLoading' ng-class='{showDialog:loading}'>"
                            + "        <div class='ngdialog-overlay'></div>"
                            + "        <div id='ngdialog-content' class='ngdialog-content my-ngdialog-content' style='width: " + width + "px; height: auto' >"
                            + "            <div class='ngdialog-message'>"
                            + "                <div id='loader-inner'class='loader-inner line-scale'>"
                            + "                    <div></div>"
                            + "                    <div></div>"
                            + "                    <div></div>"
                            + "                    <div></div>"
                            + "                    <div></div>"
                            + "                </div>"
                            + "                <p id='ngdialog1-aria-describedby' tabindex='-1' style='outline: 0px;'>"
                            + mesg
                            + "                    </p>"
                            + "            </div>"
                            + "            <div class='ngdialog-close'></div>"
                            + "        </div>"
                            + "    </div>";
                if ($("#pageLoading").length == 0)
                {
                    $("body").append(templateStr);
                }
            },
            close: function ()
            {
                $rootScope.pageIsLoad = true;
                $(".selfLoading").remove();
            }
        };


        /*
        ** 创建日期：2016-05-16
        ** 功能简介：图表内部 Loading 打开|关闭
        ** 参　　数："tableID" DIV 的 jQuery对象：
        **          "text" 指示的文字
                    "inPopWindow" 表格在 弹出层里面
                    "maskHeight" 蒙板高度（可选）
                    "icnPaddingTop" loading图标上边距（可选）

        toolService.gridFilterLoading.show(tableID,"正在加载，请稍候...");

        ** 返　　回：无

        ...
        </div>
        */
        this.gridFilterLoading = {

            open: function (tableID, text, inPopWindow, maskHeight, icnPaddingTop) {
                setTimeout(function ()
                {
                    var $graphGroup;
                    if (typeof tableID == "string")
                    {   //参数为 id 的情况
                        $graphGroup = $("#" + tableID);
                    } else
                    {
                        //参数为DIV元素对象的情况
                        $graphGroup = $(tableID);
                    }

                    
                    var $graphLoading = $graphGroup.find(".graph_loading:eq(0)");

                    if (!text)
                    {
                        text = "正在加载，请稍候";
                    }


                    if ($graphLoading && $graphLoading.length < 1)
                    {

                        var newHtml = "<div style='display:none' class='graph_loading'><span class='icn'></span><br /><span class='loadingMessage'>" + text + "</span></div>";
                        $graphGroup.append(newHtml);

                        $graphLoading = $graphGroup.find(".graph_loading:eq(0)");
                        
                    } else
                    {
                        $graphLoading.find(".loadingMessage:eq(0)").html(text);

                    }


                    var panelX, panelY, panelH, panelW, panelPaddingTop;
                    var pos = $graphGroup.offset();

                    //相对于外面的大DIV作偏移
                    var $contentPanel = $(".contentPanel:eq(0)");
                    var conPos = $contentPanel.offset();

                    if (!inPopWindow)
                    {
                        panelX = pos.left - conPos.left;
                        panelY = pos.top - conPos.top;
                        //panelW = $graphGroup.width();
                        panelW = $graphGroup.outerWidth();
                        panelPaddingTop = (panelH - 80) / 2;
                    }

                    if (icnPaddingTop)
                    {
                        panelPaddingTop = icnPaddingTop;
                    }

                    if (maskHeight)
                    {
                        panelH = maskHeight;
                        $graphLoading.css({
                            "height": panelH + "px"
                        });
                    }

                    $graphLoading.css({
                        //"left": panelX + "px",
                        //"top": panelY + "px",
                        "padding-top": panelPaddingTop + "px",
                        "width": panelW + "px"
                    });

                    //$graphLoading.css({ "left": panelX + "px", "top": panelY + "px"});

                    //console.log($graphLoading);
                    $graphLoading.fadeIn();
                }, 100);
                

            },
            close: function (tableID) {
                setTimeout(function ()
                {
                    var $graphGroup;
                    if (typeof tableID == "string")
                    {   //参数为 id 的情况
                        $graphGroup = $("#" + tableID);
                    } else
                    {
                        //参数为DIV元素对象的情况
                        $graphGroup = $(tableID);
                    }
                    var $graphLoading = $graphGroup.find(".graph_loading:eq(0)");
                    $graphLoading.fadeOut();
                },100);

            }
        }

        /*
        ** 创建日期：2016-05-16
        ** 功能简介：图表内部 Loading 打开|关闭
        ** 参　　数："divId" 字符串，当前所在图表的 id, 如 ：
        **          "text" 指示的文字

        reportService.GrphaLoading.Hide(options.divId);

        ** 返　　回：无
        ** 准备代码： 要在图表DIV中先放置代码
        <div class="graph_group">
        
        <div class="table_panel_loading"><span class="icn"></span><br /> “图2.3” 正在加载，请稍候...</div>

        ...
        </div>
        */
        this.tableGridPanelLoading = {

            open: function (divId, text)
            {

                var tObj;
                if (typeof divId == "string")
                { //参数为 id 的情况
                    tObj = document.getElementById(divId); //直接获取ID
                }
                else
                {
                    tObj = (("button" == divId.target.tagName.toLowerCase()) ? divId.target : divId.target.parentNode); // 防止点到按钮上的图标 
                }
                if (!text) text = "正在加载";
                var $obj = $(tObj);

                var $graphGroup = $obj;//.parent().parent().parent();
                var $graphLoading = $graphGroup.find(".table_panel_loading:eq(0)");
                if ($graphLoading && $graphLoading.length < 1)
                {

                    var newHtml = "<div 1style='display:none' class='table_panel_loading'><span class='icn'></span><br /><span class='loadingMessage'>" + text + "</span></div>";
                    $graphGroup.append(newHtml);

                    $graphLoading = $graphGroup.find(".table_panel_loading:eq(0)");
                } else
                {
                    $graphLoading.find(".loadingMessage:eq(0)").html(text);
                }
                //console.log($graphLoading.html());
                $graphLoading.fadeIn(function () { $(this).show(); });

            },
            close: function (divId)
            {

                var tObj;
                if (typeof divId == "string")
                { //参数为 id 的情况
                    tObj = document.getElementById(divId); //直接获取ID
                } else
                {
                    tObj = (("button" == divId.target.tagName.toLowerCase()) ? divId.target : divId.target.parentNode); // 防止点到按钮上的图标 
                }

                var $obj = $(tObj);

                var $graphGroup = $obj;//.parent().parent().parent();
                var $graphLoading = $graphGroup.find(".table_panel_loading");
                $graphLoading.fadeOut();

            }
        }


        /*
        ** 功能说明：获取页面url参数 暂时没用
        ** 参数说明：
        **      queryStringName：url参数名称
        ** 返回类型：参数值
        */
        this.getQueryString = function (queryStringName)
        {
            try
            {
                var returnValue = "";
                var URLString = new String(document.location);
                var serachLocation = -1;
                var queryStringLength = queryStringName.length;
                do
                {
                    serachLocation = URLString.indexOf(queryStringName + "\=");
                    if (serachLocation != -1)
                    {
                        if ((URLString.charAt(serachLocation - 1) == '?') || (URLString.charAt(serachLocation - 1) == '&'))
                        {
                            URLString = URLString.substr(serachLocation);
                            break;
                        }
                        URLString = URLString.substr(serachLocation + queryStringLength + 1);
                    }

                }
                while (serachLocation != -1)
                {
                    if (serachLocation != -1)
                    {
                        var seperatorLocation = URLString.indexOf("&");
                        if (seperatorLocation == -1)
                        {
                            returnValue = URLString.substr(queryStringLength + 1);
                        }
                        else
                        {
                            returnValue = URLString.substring(queryStringLength + 1, seperatorLocation);
                        }
                    }
                }
                return returnValue;
            } catch (e) { return ""; }
        };

        /*
        ** 功能说明：将浮点数四舍五入后保留目标小数点后位数
        ** 参数说明：
        **      x：保留小数点后位数
        ** 返回类型：value
        */
        this.toDecimal = function (x)
        {
            var f = parseFloat(x);
            if (isNaN(f))
            {
                return;
            }
            f = Math.round(x * 100) / 100;
            return f;
        };

        /*
        ** 功能说明：将浮点数保留2位小数，如：2，会在2后面补上00.即2.00 
        ** 参数说明：
        **      x：保留小数点后位数
        ** 返回类型：value
        */
        this.toDecimal2 = function (x)
        {
            var f = parseFloat(x);
            if (isNaN(f))
            {
                return false;
            }
            var f = Math.round(x * 100) / 100;
            var s = f.toString();
            var rs = s.indexOf('.');
            if (rs < 0)
            {
                rs = s.length;
                s += '.';
            }
            while (s.length <= rs + 2)
            {
                s += '0';
            }
            return s;
        };

        /*
        ** 创建人：高洪涛
        ** 时间：2016年6月15日16:32:42
        ** 功能说明：将浮点数保留 N 位小数
        ** 参数说明：
        **      value：输入值
        **      accuracy：保留小数点后位数
        ** 返回类型：value
        */
        this.toAccuracy = function (value, accuracy)
        {
            if (isNaN(parseFloat(value)))
            {
                return value;
            }
            else
            {
                var t = 1;
                var num = accuracy;
                for (; accuracy > 0; t *= 10, accuracy--);
                for (; accuracy < 0; t /= 10, accuracy++);

                var rlt = Math.round(value * t) / t;

                //补0
                var rlt = rlt.toString();
                var rs = rlt.indexOf('.');
                if (rs < 0)
                {
                    rs = rlt.length;
                    rlt += '.';
                }
                rs = Number(rs) + Number(num);
                while (rlt.length <= rs)
                {
                    rlt += '0';
                }
                return rlt;
            }
        };

        /*
        ** 功能说明：去掉前后空格
        ** 参数说明：
        **      str：要去掉空格的字符串
        ** 返回类型：去掉空格后的字符串
        */
        this.Trim = function (str)
        {
            return str.replace(/(^\s*)|(\s*$)/g, "");
        };
        /*
        ** 功能说明：软件参数验证
        ** 参数说明：
        **      MRZ：软件参数值
        **      CSZLX：参数值类型：
        1、整型(只能是整数。可使用科学计数法，不能是无理数)
        2、单选框
        3、数字(允许整型和浮点型，可使用科学计数法，不能是无理数)
        **      YZSTR：验证附加条件
        ** 返回类型：去掉空格后的字符串
        */
        //软件参数验证
        //司徒
        //2016年2月24日16:07:50
        this.rjcszValidate = function (MRZ, CSZLX, YZSTR)
        {
            if (angular.isUndefined(MRZ)) MRZ = "";
            MRZ = this.Trim(MRZ);
            if (MRZ == "")
            {
                return "软件参数值不能为空，请认真填写！";
            }
            else if (angular.equals(CSZLX, "1") && !this.checkInt(MRZ))
            {
                return "软件参数值只能是整型，可使用科学计数法，不能是无理数!如：1，3e2";
            }
            else if (angular.equals(CSZLX, "2"))
            {
                return "";
            }
            else if (angular.equals(CSZLX, "3") && !this.checkNumber(MRZ))
            {
                return "软件参数值只能是整型或浮点型，可使用科学计数法，不能是无理数!如：1，2.4，3e-2，3e2";
            }
            else
            {
                var value = this.getNumberValue(MRZ);
                if (YZSTR.length == 0)
                {
                    return "";
                }
                else
                {
                    if (this.checkSoftWareParameter(value, YZSTR))
                    {
                        return "";
                    }
                    else
                    {
                        return "软件参数值未在合法的区间内，具体合法区间请参照相关参数软件说明!";
                    }
                }
            }
        };

        //验证是否为整数，包括正负数，可以是科学计数法
        //司徒 2016年2月22日11:13:55
        this.checkInt = function (value)
        {
            value = value.toString().toUpperCase();
            if (value.indexOf("E") >= 0)
            {
                value = this.getNumberValue(value).toString();
                if (angular.equals(value, "Error"))
                {
                    return false;
                }
            }
            var reg = /^-?[0-9]\d*$/; //^-?[0-9]\d*$
            if (!reg.test(value))
            {
                return false;
            } else
            {
                return true;
            }
        };
        //验证是否为数字，包括正负数，整形，浮点型，科学计数法
        //司徒 2016年2月22日11:13:55
        this.checkNumber = function (value)
        {
            value = value.toString();
            var reg = /^[\+\-]?[\d]+([\.][\d]*)?([Ee][+-]?[\d]+)?$/;
            if (!reg.test(value))
            {
                return false;
            } else
            {
                return true;
            }
        };
        //验证录入的软件参数
        //司徒 2016年2月22日11:13:55
        this.checkSoftWareParameter = function (value, yzStr)
        {
            value = value.toString();
            var A = this.getNumberValue(value);
            if (eval(yzStr))
            {
                return true;
            } else
            {
                return false;
            }
        };
        //得到数字的值，如果是科学计数法，则返回所表示的实际值，如果不是 返回本身
        //司徒 2016年2月22日11:13:55
        this.getNumberValue = function (value)
        {
            value = value.toString().toUpperCase();
            if (!this.checkNumber(value))
            {
                return "Error";
            }
            var value = value.toUpperCase();
            if (value.indexOf("E") >= 0)
            {
                var valueArr = value.toUpperCase().split("E");
                return valueArr[0] * Math.pow(10, valueArr[1]);
            } else
            {
                return value;
            }
        };
        //获得数组排序方法
        //司徒 2016年3月3日16:46:15
        /*
        ** 本方法只适合一级数组排序
        ** 功能简介：返回JavaScript数据 array.sort(sortFunction) 中的 sortFunction参数
        ** 参数：order：asc or desc      sortBy：数组中排序的字段名字
        ** 补充人：高洪涛   2016年6月1日23:07:50
        */ 
        this.getSortFun = function (order, sortBy)
        {
            var ordAlpah = (order == "ASC") ? '>' : '<';
            var sortFun = new Function('a', 'b', 'return a.' + sortBy + ordAlpah + 'b.' + sortBy + '?1:-1');
            return sortFun;
        };

        /*
        ** 功能说明：获得Guid妈
        ** 返回类型：string
        */
        this.getGuid = function ()
        {
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++)
            {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "-";

            var uuid = s.join("");
            return uuid;
        };




        /*
        ** 功能说明：验证浏览器版本工具类
        ** 返回类型：string
        1、返回浏览器名称 : BrowserDetect.browser
        2、返回浏览器版本: BrowserDetect.version
        3、返回运行平台: BrowserDetect.OS
        */
        this.BrowserDetect = {
            init: function ()
            {
                this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
                this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";
                this.OS = this.searchString(this.dataOS) || "an unknown OS";
            },
            searchString: function (data)
            {
                for (var i = 0; i < data.length; i++)
                {
                    var dataString = data[i].string;
                    var dataProp = data[i].prop;
                    this.versionSearchString = data[i].versionSearch || data[i].identity;
                    if (dataString)
                    {
                        if (dataString.indexOf(data[i].subString) != -1)
                            return data[i].identity;
                    }
                    else if (dataProp)
                        return data[i].identity;
                }
            },
            searchVersion: function (dataString)
            {
                var index = dataString.indexOf(this.versionSearchString);
                if (index == -1) return;
                return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
            },
            dataBrowser:
            [
                {
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
            dataOS: [
                {
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
        ** 创建人：高洪涛
        ** 创建日期：2016年5月29日01:45:35
        ** 功能说明：获取查询实体信息，供表头查询使用
        ** 返回类型：pageFindEntity
        ** 说明：pageFindEntity结果中，必须要 pageFindEntity{searchContentList:[]}结构
        */
        this.GetGridFilterFindEntity = function (pageFindEntity, filterFindEntity)
        {
            if (filterFindEntity != null)
            {
                //实体操作信息 none：什么都不做   add：添加   remove：删除   extend：覆盖
                var entityFlag = "none";
                //赋值
                //如果当前实体标识为排序，则置排序信息
                if (filterFindEntity.isSort)
                {
                    //如果当前查询实体有排序，则记录排序字段
                    pageFindEntity.sortName = filterFindEntity.filterName;
                    pageFindEntity.sortType = filterFindEntity.sortType;
                }
                
                if (filterFindEntity.searchType == "range")
                {
                    if (filterFindEntity.searchOne.toString() == "" || filterFindEntity.searchTwo.toString() == "")
                    {
                        entityFlag = "remove";
                    }
                }
                if (filterFindEntity.searchOne.toString() == "")
                {
                    
                    entityFlag = "remove";
                    //return pageFindEntity;
                }
                if (entityFlag == "none")
                {
                    //首先判断当前查询实体中有没有指令传过来的实体，
                    //如果有则执行覆盖更新操作，如果没有则执行添加查询实体操作
                    entityFlag = "add";
                    angular.forEach(pageFindEntity.searchContentList, function (item, key)
                    {
                        //$log.log("filterName1 = " + item.filterName);
                        //$log.log("filterName2 = " + filterFindEntity.filterName);
                        if (angular.equals(item.filterName, filterFindEntity.filterName))
                        {
                            entityFlag = "extend";
                            angular.extend(item, filterFindEntity);

                        }
                        else
                        {
                            //如果当前为排序字段，设置其他的查询实体对象是否排序为否
                            if (filterFindEntity.isSort)
                            {
                                item.isSort = false;
                                item.sortType = "";
                            }
                        }
                    });
                }
                
                switch (entityFlag)
                {
                    case "add":
                        //如果没有重复的，则要新添加
                        pageFindEntity.searchContentList.push(filterFindEntity);
                        if (filterFindEntity.isSort)
                        {
                            //如果当前查询实体有排序，则记录排序字段
                            pageFindEntity.sortName = filterFindEntity.filterName;
                            pageFindEntity.sortType = filterFindEntity.sortType;
                        }
                        break;
                    case "remove":
                        angular.forEach(pageFindEntity.searchContentList, function (item, key)
                        {
                            //$log.log("filterName1 = " + item.filterName);
                            //$log.log("filterName2 = " + filterFindEntity.filterName);
                            if (angular.equals(item.filterName, filterFindEntity.filterName))
                            {
                                pageFindEntity.searchContentList.splice(key, 1);
                                return false;
                            }
                        });
                        break;
                    case "extend":
                        //什么不都做，覆盖操作在上面判断时已经做了
                        break;
                    case "none":
                        //什么不都做
                        break;
                    default:
                        break;
                }
            }
            else
            {
                //清空
                pageFindEntity.sortName = "";
                pageFindEntity.sortType = "";
                pageFindEntity.searchContentList = [];
            }

            //添加默认页面查询属性，目前只有LCID
            pageFindEntity = this.SetGridFilterFindEntity(pageFindEntity, "LCID", "string", "equal", this.sessionStorage.get("LCID"));
            return pageFindEntity;
        };

        

        /*
        ** 创建人：高洪涛
        ** 创建日期：2016年6月18日22:23:54
        ** 功能说明：向页面查询实体中的 searchContentList:[] 中添加项
        ** 返回类型：pageFindEntity
        ** 说明：pageFindEntity结果中，必须要 pageFindEntity{searchContentList:[]}结构
        */
        this.SetGridFilterFindEntity = function (pageFindEntity, filterName, filtertype, searchType, searchOne)
        {
            if (filterName == "")
            {
                return pageFindEntity;
            }
            else
            {
                var tempFindEntity = {
                    filterName: filterName,                         //查询字段名字
                    filternamezh: filterName,                       //查询字段中文
                    filtertype: filtertype,                         //查询字段类型
                    searchType: searchType,                         //查询类型
                    searchOne: searchOne,                           //查询内容1
                    searchTwo: "",                                  //查询内容2
                    isSort: false,                                  //是否排序，暂时没用
                    sortName: "",                                   //排序字段名，暂时没用
                    sortType: "",                                   //排序类型，暂时没用
                    isTopFilter:true                                //是否上层查询条件，直接影响页面翻译查询条件内容，当为True时不翻译
                };
                //判断有没有，如果没有则添加，有则更新
                var isAddFlag = true;
                //$log.log(pageFindEntity.searchContentList);
                for (var i = 0; i < pageFindEntity.searchContentList.length; i++)
                {
                    var item = pageFindEntity.searchContentList[i];
                    //$log.log("filterName1 = " + item.filterName);
                    //$log.log("filterName2 = " + filterFindEntity.filterName);
                    if (angular.equals(item.filterName, filterName))
                    {
                        isAddFlag = false;
                        break;
                    }
                }
                if (isAddFlag)
                {
                    //添加新的
                    pageFindEntity.searchContentList.push(tempFindEntity);
                }
                else
                {
                    angular.extend(item, tempFindEntity);
                }
                //$log.log(pageFindEntity.searchContentList);
                return pageFindEntity;
            }
        };

        /*
        ** 创建人：高洪涛
        ** 创建日期：2016年5月29日01:45:27
        ** 功能说明：根据页面查询实体获取查询条件文本信息
        ** 返回类型：$scope.trustAsHtml()
        ** 说明：pageFindEntity结果中，必须要 pageFindEntity{searchContentList:[]}结构
        */
        this.GetFilterContentText = function (pageFindEntity)
        {
            var filterText = "";
            var filterType = "";
            
            //angular.forEach(pageFindEntity.searchContentList, function (item, key)
            if (pageFindEntity.searchContentList.length > 0)
            {
                
                for (var i = 0; i < pageFindEntity.searchContentList.length; i++)
                {
                    var item = pageFindEntity.searchContentList[i];
                    //判断是不是页面顶层查询条件，如果是顶层则不做任何处理
                    if (!item.isTopFilter)
                    {
                        var filterType = GetFilterType(item.searchType);
                        if (item.searchOne == null) item.searchOne = "";
                        if (item.searchTwo == null) item.searchTwo = "";
                        //$log.log(filterType);

                        if (filterText == "")
                        {
                            filterText = "筛选条件：";           // 删除（1=1）
                            filterStatus = 0;                   // 用于判断下一次筛选前是否已有一次筛选
                        }

                        if (this.Trim(filterType) == "BETWEEN")
                        {
                            if (item.searchOne.toString() != "" && item.searchTwo.toString() != "")
                            {
                                if (filterStatus) {
                                    filterText += " <font color='red'>AND</font> ";
                                }
                                filterStatus = 1;
                                filterText += " ( " + item.filternamezh + "<font color='red'>" + filterType + "</font>" + item.searchOne + " ~ " + item.searchTwo + " ) ";
                            }

                        }

                        if (this.Trim(filterType) == "IN")
                        {
                            item.searchOne = item.searchOne.toString();
                            item.searchTwo="";
                            if (item.searchOne.toString() != "")
                            {
                                var tempSearchOne = item.searchOne;
                                var _array = tempSearchOne.split('\n');
                                if (_array.length > 10)
                                {
                                    for(var j=0;j<10;j++)
                                    {
                                        if (j == 0)
                                        {
                                            tempSearchOne = _array[j];
                                        }
                                        else
                                        {
                                            tempSearchOne += "<font color='red'> , </font>" + _array[j];
                                        }
                                    }
                                }
                                else
                                {
                                    for (var k = 0; k < _array.length; k++)
                                    {
                                        if (k == 0)
                                        {
                                            tempSearchOne = _array[k];
                                        }
                                        else
                                        {
                                            tempSearchOne += "<font color='red'> , </font>" + _array[k];
                                        }
                                    }
                                }
                                if (filterStatus) {
                                    filterText += " <font color='red'>AND</font> ";
                                }
                                filterStatus = 1;
                                filterText += " ( " + item.filternamezh + "<font color='red'>" + filterType + "</font>" + tempSearchOne + " ) ";
                            }
                        }

                        if (this.Trim(filterType) != "IN" && this.Trim(filterType) != "BETWEEN")
                        {
                            if (item.searchOne.toString() != "")
                            {
                                if (filterStatus) {
                                    filterText += " <font color='red'>AND</font> ";
                                }
                                filterStatus = 1;
                                filterText += " ( " + item.filternamezh + "<font color='red'>" + filterType + "</font>" + item.searchOne + " ) ";
                            }
                        }
                        //filterText = filterText + "(" + item.filterName + filterType + tiem.searchOne + ")";
                    }
                }
            }
            //判断有没有排序
            if (pageFindEntity.sortName != "")
            {
                if (filterText != "") filterText += "<br/>"
                filterText = filterText + "排序条件： " + pageFindEntity.sortName;
                if (pageFindEntity.sortType == "asc")
                {
                    filterText = filterText + " ，&nbsp;&nbsp;<font color='red'>升序</font>";
                }
                else
                {
                    filterText = filterText + " ，&nbsp;&nbsp;<font color='blue'>降序</font>";
                }
            }
            //filterType = "";
            //$log.log(filterText);
            return $sce.trustAsHtml(filterText);
        };

        function GetFilterType(searchType)
        {
            var filterType = "";
            switch (searchType)
            {
                case "equal":
                    filterType = " = ";
                    break;
                case "$ne":
                    filterType = " != "
                    break;
                case "regExp":
                    filterType = " LIKE ";
                    break;
                case "$in":
                    filterType = " IN ";
                    break;
                case "$gt":
                    filterType = " > ";
                    break;
                case "$lt":
                    filterType = " < ";
                    break;
                case "$lte":
                    filterType = " <= ";
                    break;
                case "$gte":
                    filterType = " >= ";
                    break;
                case "range":
                    filterType = " BETWEEN ";
                    break;
                default:
                    filterType = " = ";
                    break;
            };
            return filterType;
        };


        /*
        ** 功能说明：验证浏览器版本工具类
        ** 返回类型：string
        1、返回浏览器名称 : BrowserDetect.browser
        2、返回浏览器版本: BrowserDetect.version
        3、返回运行平台: BrowserDetect.OS
        */
        this.BrowserDetect = {
            init: function ()
            {
                this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
                this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";
                this.OS = this.searchString(this.dataOS) || "an unknown OS";
            },
            searchString: function (data)
            {
                for (var i = 0; i < data.length; i++)
                {
                    var dataString = data[i].string;
                    var dataProp = data[i].prop;
                    this.versionSearchString = data[i].versionSearch || data[i].identity;
                    if (dataString)
                    {
                        if (dataString.indexOf(data[i].subString) != -1)
                            return data[i].identity;
                    }
                    else if (dataProp)
                        return data[i].identity;
                }
            },
            searchVersion: function (dataString)
            {
                var index = dataString.indexOf(this.versionSearchString);
                if (index == -1) return;
                return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
            },
            dataBrowser:
            [
                {
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
            dataOS: [
                {
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
        **传入参数为cookie存放的路径和域名
        **
        */
        this.popBDWindow = function () {
            var domain = $window.document.domain;
            if($cookies.get('browserDetectFlag')){
                return false;
            }else{
                var expireDate = new Date();
                expireDate.setDate(expireDate.getDate()+1);
                $cookies.put('browserDetectFlag','true', { 'path':'/','domain':domain,'expires': expireDate});
                return ngDialog.open({
                    title:"浏览器兼容性提示",
                    template: options.popBDWindowPath,
                    width:720,
                    height:350,
                    closeByDocument:false
                })
            }
        }

    };





});