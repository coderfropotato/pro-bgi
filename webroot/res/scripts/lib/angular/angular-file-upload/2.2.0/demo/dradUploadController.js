"use strict";
angular.module("upLoadApp", ["angularFileUpload"]).controller("dradUploadController",
["$scope", "$log", "$window", "FileUploader",
function ($scope, $log, $window,FileUploader)
{
    $scope.myTitle = "高洪涛";
    var fileOptions = {
        url: "http://localhost:18314/api/MyUpLoad/UpLoadFile",
        headers: { "Authorization": "GHTAO" + $window.sessionStorage.token },
        formData: { "userName": "gaohongtao" }
    };
    var uploader = $scope.uploader = new FileUploader(fileOptions);

    // FILTERS
    uploader.filters.push({
        name: 'customFilter',
        fn: function (item /*{File|FileLikeObject}*/, options)
        {
            return this.queue.length < 10;
        }
    });
    uploader.onSuccessItem = function (fileItem, response, status, headers)
    {
        //console.info('onSuccessItem', fileItem, response, status, headers);
        $scope.nowData = response;
        $log.log($scope.nowData.fileName);
    };
    uploader.onErrorItem = function (fileItem, response, status, headers)
    {

        if (status === 401)
        {
            alert("您还没有取得授权");
        }
        //console.info('onErrorItem', fileItem, response, status, headers);
    };

    $scope.initPage = function ()
    {

    }

    $scope.ShowDragUploadWindow = function ()
    {
        toolService.popFrame("../../super/super_DragUpload.html", "上传文件", 800, 620);
    }

}]);