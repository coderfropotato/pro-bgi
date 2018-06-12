/*
**创建人：高洪涛
**创建时间：2015-12-27
**功能简介：要往每个请求里面追加一个特殊的头信息了:[Authorization: GHTAO ] 
*/
define("superApp.tokenInterceptorFactory", ["angular"], function (angular)
{
    var superApp = angular.module("superApp.tokenInterceptorFactory", []);

    superApp.factory("tokenInterceptorFactory", tokenInterceptorFactory);
    tokenInterceptorFactory.$inject = ["$q", "$window", "$log"];
    function tokenInterceptorFactory($q, $window, $log)
    {
        return {
            request: function (config)
            {
                //$log.log("开始执行");
                config.headers = config.headers || {};
                //$log.debug("$window.sessionStorage.token=" + $window.sessionStorage.token);
                //alert($window.localStorage.token);
                if ($window.localStorage.token)
                {
                    config.headers.Authorization = "token " + $window.localStorage.token;
                    //$log.log("config.headers.Authorization = " + config.headers.Authorization);
                    // config.headers.Authorization.Parameter = "123";
                }
                return config;
            },
            
            response: function (response)
            {
                return response || $q.when(response);
            }
        };
    }

    //    superApp.factory("tokenInterceptorFactory", ["$q", "$window", "$log", function ($q, $window, $log)
    //    {
    //        return {
    //            request: function (config)
    //            {
    //                config.headers = config.headers || {};
    //                $log.debug("$window.sessionStorage.token=" + $window.sessionStorage.token);
    //                //alert($window.sessionStorage.token);
    //                if ($window.sessionStorage.token)
    //                {
    //                    config.headers.Authorization = "GHTAO" + $window.sessionStorage.token;
    //                }
    //                return config;
    //            },

    //            response: function (response)
    //            {
    //                return response || $q.when(response);
    //            }
    //        };
    //    } ]);


});