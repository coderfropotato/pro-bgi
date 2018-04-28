/*
**创建人：高洪涛
**创建时间：2016-1-7
**功能简介：过滤请求路径，增加蒙版效果
*/
define(["toolsApp"], function (toolsApp)
{
    
    toolsApp.factory("pageFactory", pageFactory);
    pageFactory.$inject = ["$log", "$rootScope"];
    function pageFactory($log, $rootScope)
    {
        //定义factory返回对象
        var myServices = {};    
        //定义参数对象
        var myObject = null;
    
        /**
         * 定义传递数据的set函数
         * @param {type} xxx
         * @returns {*}
         * @private
         */
        var _set = function (data) {
            myObject = data;     
        };

        /**
         * 定义获取数据的get函数
         * @param {type} xxx
         * @returns {*}
         * @private
         */
        var _get = function (isRemove)
        {
            if (angular.isUndefined(isRemove))
            {
                isRemove = false;
            }
            var temp = myObject;
            if(isRemove)
                myObject = null;
            return temp;
        };


        // Public APIs
        myServices.set = _set;
        myServices.get = _get;


        //韦因图数据
        var WNT_Parm = {};

        /**
         * 韦因图 set 函数
         * @param {type} xxx
         * @returns {*}
         * @private
         */
        var _setWNT = function (SeachGroupName, searchOne)
        {
            WNT_Parm.SeachGroupName = SeachGroupName;
            WNT_Parm.searchOne = searchOne;
        };

        /**
         * 韦因图 get函数
         * @param {type} xxx
         * @returns {*}
         * @private
         */
        var _getWNT = function ()
        {
            return WNT_Parm;
        };

        // Public APIs
        myServices.setWNT = _setWNT;
        myServices.getWNT = _getWNT;

        // 在controller中通过调set()和get()方法可实现提交或获取参数的功能
        return myServices;
    }
});
