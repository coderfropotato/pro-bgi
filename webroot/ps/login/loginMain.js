require.config({
    baseUrl: '../../',
    paths: {
        'jQuery': 'res/scripts/lib/jquery/1.10.2/jquery.min',
        'angular': 'res/scripts/lib/angular/1.4.7/angular.min',
        'angular-route': 'res/scripts/lib/angular/1.4.7/angular-route.min',
        'ngCookies': 'res/scripts/lib/angular/1.4.7/angular-cookies.min',
        'ui.router': 'res/scripts/lib/angular/angular-ui-router/0.2.15.1/angular-ui-router',
        'ngDialog': 'res/scripts/lib/angular/ng-dialog/0.5.0/ngDialog',

        'super.superMessage': 'config',
        'superApp.loginService': 'res/scripts/super/service/loginService',

        'loginApp': 'ps/login/loginApp',
        'loginController': 'ps/login/loginController'
    },
    shim: {
        'jQuery': { exports: '$' },
	    'angular': { exports: 'angular' },
	    'bootstrapJs': { deps: ['jQuery'] },
	    'ui.router': { deps: ['angular'] },
        'ngCookies': { deps: ['angular'] }
    }
});

require(['jQuery', 'angular', 'loginApp', 'loginController'], function(jquery, angular) {
    angular.element(document).ready(function() {
        angular.bootstrap(document, ['loginApp']);
    });
})