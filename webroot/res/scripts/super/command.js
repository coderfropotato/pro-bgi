/*
    ** 创建人：  高洪涛
    ** 创建日期：2016-1-11
    ** 功能简介：供所有的查询页面的Grid使用，体外回调函数
    ** 调用示例：
    **           <a onclick=\"OutLinkCallBack('$scope.ProNumberOnClick')\" > ... </a>
    ** 前提约定：必须在当前Controller对应的html页面的最外层，加上一个属性：out-to="app"
    ** 示    例： <div out-to="app" ng-init="InitPage()"> ... </div>
    */
function OutLinkCallBack(callBack, paras)
{
    var appElement = document.querySelector("[out-to=app]");
    var $scope = angular.element(appElement).scope();
    var func = eval(callBack);
    //创建函数对象，并调用
    new func(paras);
    $scope.$apply();
}

function OutCallBack(callBack, paras)
{
    var appElement = document.querySelector("[out-to=app]");
    var $scope = angular.element(appElement).scope();
    var func = eval(callBack);
    //创建函数对象，并调用
    new func(paras);
}

function OutLinkCallBackForPager(callBack, paras)
{
    var appElement = document.querySelector("[out-pager=app]");
    var $scope = angular.element(appElement).scope();
    var func = eval(callBack);
    //创建函数对象，并调用
    new func(paras);
    $scope.$apply();
}