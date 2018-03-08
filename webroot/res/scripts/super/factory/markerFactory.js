/*
**创建人：高洪涛
**创建时间：2016-1-7
**功能简介：过滤请求路径，增加蒙版效果
*/
define("superApp.markerFactory", ["angular"], function (angular)
{
    var superApp = angular.module("superApp.markerFactory", []);

    superApp.factory("markerFactory", markerFactory);
    markerFactory.$inject = ["$log", "$rootScope"];
    function markerFactory($log, $rootScope)
    {
        var timestampMarker = {
            request: function (config)
            {
                //$rootScope.loading = (config.url.indexOf(".html") > 0) ? true : false;
                if (config.url.indexOf(".html") > 0)
                {
                    //$rootScope.loading = true;
                }
                config.requestTimestamp = new Date().getTime();
                return config;
            },
            response: function (response)
            {
                //if (response.config.url.indexOf(".html") > 0)
                //{
                //    $rootScope.loading = false;
                //}
                response.config.responseTimestamp = new Date().getTime();
                return response;
            }
        };
        return timestampMarker;
    }
});