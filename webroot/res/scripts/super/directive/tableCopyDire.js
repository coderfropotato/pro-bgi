/*

模块名称：tableCopyDire
整理时间：2017-12-15
功能简介：复制表格内容

*/

define("superApp.tableCopyDire", ["angular", "super.superMessage"],
    function (angular, SUPER_CONSOLE_MESSAGE) {
        var superApp = angular.module("superApp.tableCopyDire", []);

        /*
         ** 创建日期：2017-12-15
         ** 功能简介：复制表格
         ** 形如：<div class="table-copy" tableid="div_ReadsQuYuFenBu_CharPanel"></div>
         ** class="table-copy"：指令，必需
         ** tableid="div_ReadsQuYuFenBu_CharPanel"： 表格id
         */
        superApp.directive("tableCopy", tableCopy);
        tableCopy.$inject = ["$log", "$compile"];

        function tableCopy($log, $compile) {
            return {
                restrict: "ACE",
                controller: "tableCopyController",
                link: function (scope, element, attrs) {
                    var ele = $(element);
                    var btn = $compile("<button style='margin-bottom: 10px;' class='btn btn-default btn-sm btn-silver' ng-click=\"selectTableContents('" + attrs.tableid + "');\"> 复制</button> ")(scope);
                    ele.append(btn);
                }
            };
        };

        superApp.controller("tableCopyController", tableCopyController);
        tableCopyController.$inject = ["$scope", "$log", "$state", "$window", "$compile"];

        function tableCopyController($scope, $log, $state, $window, $compile) {
            $scope.selectTableContents = function (id) {
                var el = document.getElementById(id);
                var body = document.body, range, sel;
                var userAgent = navigator.userAgent;
                if (window.getSelection) {
                    range = document.createRange();
                    sel = window.getSelection();
                    sel.removeAllRanges();
                    if (userAgent.indexOf('Firefox') > -1) { //兼容火狐
                        range.selectNode(el);
                        sel.addRange(range);
                        document.execCommand('Copy');   //执行浏览器复制命令
                    } else {
                        range.selectNodeContents(el);
                        sel.addRange(range);
                        document.execCommand('copy');  //执行浏览器复制命令
                    }
                } else if (body.createTextRange) {
                    range = body.createTextRange();
                    range.moveToElementText(el);
                    range.select();
                    document.execCommand('copy', true);
                }
            }

        }
    });