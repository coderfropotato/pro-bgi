define(['toolsApp'], function (toolsApp) {
    toolsApp.controller('helpController', helpController);
    helpController.$inject = ["$rootScope", "$scope", "$log", "$state", "$timeout", "$window", "$compile", "ajaxService", "toolService", "svgService", "reportService"];

    function helpController($rootScope, $scope, $log, $state, $timeout, $window, $compile, ajaxService, toolService, svgService, reportService) {
        toolService.pageLoading.open();
        $scope.InitPage = function () {
            $timeout(function () {
                toolService.pageLoading.close();
            }, 300)

            $scope.title = '帮助';
        }

        $scope.handlerAnchorClick = function (event) {
            var target = event.target.getAttribute('data-target');
            $('.help-anchor li').removeClass('active');
            $(event.target).addClass('active');
            var dis = $(target).offset().top;
            $('#div_ViewProduct').off();
            $('#div_ViewProduct').animate({ scrollTop: $('#div_ViewProduct').scrollTop() + dis }, function () {
                $('#div_ViewProduct').on('scroll', scrollFn);
            });
        }

        $('#div_ViewProduct').on('scroll', scrollFn);
        function scrollFn() {
            for (var i = 0; i < $('.help-title').length; i++) {
                if ($('.help-title').eq(i).offset().top >= 0) {
                    var target = $('.help-title').eq(i).attr('id');
                    $('.help-anchor li').removeClass('active');
                    $("[data-target=#" + target + "]").addClass('active');
                    return;
                }
            }
        }
    }
});