define(['toolsApp'], function (toolsApp) {
    toolsApp.controller('myAnalysisController', myAnalysisController);
    myAnalysisController.$inject = ["$rootScope", "$scope", "$log", "$state", "$timeout", "$window", "$compile", "ajaxService", "toolService", "svgService", "reportService"];
    function myAnalysisController($rootScope, $scope, $log, $state, $timeout, $window, $compile, ajaxService, toolService, svgService, reportService) {

        $scope.InitPage = function () {
            $timeout(function () {
                console.log(1);
            }, 300)

            $scope.tableData = [
                {
                    name: "聚类",
                    status: "success",
                    link: [
                        {
                            type: "样本表达",
                            name: "项目1"
                        },
                        {
                            type: "样本表达",
                            name: "项目2"
                        },
                        {
                            type: "样本表达",
                            name: "项目3"
                        }
                    ],
                    submitTime: "2017-1-4 17:12:50"
                },
                {
                    name: "GO1",
                    status: "success",
                    link: [{
                        type: "样本表达",
                        name: "项目1"
                    }],
                    submitTime: "2017-1-4 17:12:50"
                },
                {
                    name: "文恩图",
                    status: "failure",
                    link: [{
                        type: "样本表达",
                        name: "项目1"
                    }],
                    submitTime: "2017-1-4 17:12:50"
                }, {
                    name: "聚类01",
                    status: "running",
                    link: [{
                        type: "样本表达",
                        name: "项目1"
                    }],
                    submitTime: "2017-1-4 17:12:50"
                }
            ];
        }
    }
});