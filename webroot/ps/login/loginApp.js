define(['ui.router', 'superApp.loginService'], function () {
    var loginApp = angular.module('loginApp', ['ui.router', 'superApp.loginService']);
    loginApp.config(["$logProvider", "$httpProvider",function ($logProvider, $httpProvider) {
        $logProvider.debugEnabled(true);
    }]);
    loginApp.directive('superValidate', superValidateDirective);
    superValidateDirective.$inject = ['$log'];
    function superValidateDirective($log) {
        return {
                restrict: 'ACE',
                link: function (scope, element, attrs)
                {
                    $element = $(element);
                    $wrap = $element.wrap("<span class='myvalidate-wrap'></span>").parent();
                    $wrap.append("<span class='myvalidate-wrap-tips'>" + attrs["superValidate"] + "</span>");
                    $element.hover(function ()
                    {
                        $this = $(this);
                        $this.addClass("zmax");
                        if ($this.hasClass('ng-invalid') && $this.hasClass('ng-touched'))
                        {
                            $this.parent().addClass('show');
                        }

                    }, function ()
                    {
                        $this = $(this);
                        $this.removeClass("zmax");
                        $this.parent().removeClass('show');
                    });
                }
            };
    }
    return loginApp;
})