require.config({
    baseUrl: '../../',
    paths: {
        "jQuery": "res/scripts/lib/jquery/1.10.2/jquery.min",
        "jQueryDatapicker": "res/scripts/lib/jquery/jquery.datepicker",
        "bootstrapJs": "res/scripts/lib/bootstrap/3.3.2/js/bootstrap",
        "angular": "res/scripts/lib/angular/1.4.7/angular",
        "ngCookies": "res/scripts/lib/angular/1.4.7/angular-cookies.min",
        "angular-route": "res/scripts/lib/angular/1.4.7/angular-route.min",
        "ui.router": "res/scripts/lib/angular/angular-ui-router/0.2.15.1/angular-ui-router",
        "select2": "res/scripts/lib/angular/ng-select/3.4.8/select2",
        "ngDialog": "res/scripts/lib/angular/ng-dialog/0.5.1/ngDialog",
        "treeControl": "res/scripts/lib/angular/angular-tree-control/angular-tree-control",

        "highcharts": "res/scripts/lib/Highcharts/4.2.1/highcharts",
        "highcharts3d": "res/scripts/lib/Highcharts/4.2.1/highcharts-3d",
        "highcharts-more": "res/scripts/lib/Highcharts/4.2.1/highcharts-more",
        "heatmap": "res/scripts/lib/Highcharts/4.2.1/modules/heatmap",
        "highcharts-data": "res/scripts/lib/Highcharts/4.2.1/modules/data",
        "d3": "res/scripts/lib/d3/build/d3",
        "angularjs-date-picker":"res/scripts/lib/angularjs-datepicker/angular-datepicker.min",

        "super.superMessage": "config",
        "superApp.superDire": "res/scripts/super/directive/superDire",
        "superApp.reportDire": "res/scripts/super/directive/reportDire",
        "superApp.gridFilterDire": "res/scripts/super/directive/gridFilterDire",
        "superApp.svgExportDire": "res/scripts/super/directive/svgExportDire",
        "superApp.imgExportDire": "res/scripts/super/directive/imgExportDire",
        "superApp.toolTipDire": "res/scripts/super/directive/toolTipDire",
        "superApp.graphGroupBtnDire": "res/scripts/super/directive/graphGroupBtnDire",
        "superApp.selectRangeDire": "res/scripts/super/directive/selectRangeDire",
        "superApp.gridExportDire": "res/scripts/super/directive/gridExportDire",
        "superApp.selectColorDire": "res/scripts/super/directive/selectColorDire",
        "superApp.colorSelectorDire": "res/scripts/super/directive/colorSelectorDire",
        "superApp.heatmapSetDire": "res/scripts/super/directive/heatmapSetDire",
        "superApp.svgNewExportDire": "res/scripts/super/directive/svgNewExportDire",
        "superApp.tableCopyDire": "res/scripts/super/directive/tableCopyDire",
        "superApp.theadControlDire":"res/scripts/super/directive/theadControlDire",
        "superApp.analysisPopDire": "res/scripts/super/directive/analysisPopDire",
        "superApp.topQuickMenuDire": "res/scripts/super/directive/topQuickMenuDire",
        "superApp.reportPageTitleDire": "res/scripts/super/directive/reportPageTitleDire",
        "superApp.reportPageSubTitleDire": "res/scripts/super/directive/reportPageSubTitleDire",
        "superApp.reAnalysisDire": "res/scripts/super/directive/reAnalysisDire",
        
        "superApp.superService": "res/scripts/super/service/superService",
        "superApp.reportService": "res/scripts/super/service/reportService",
        
        "superApp.tokenInterceptorFactory": "res/scripts/super/factory/tokenInterceptorFactory",
        "superApp.markerFactory": "res/scripts/super/factory/markerFactory",

        "command": "res/scripts/super/command",


        'toolsApp': 'ps/tools/toolsApp',
        'toolsController': 'ps/tools/toolsController',
        "heatmapController": "ps/tools/pages/heatmapController",
        "vennController": "ps/tools/pages/vennController",
        "myAnalysisController":"ps/tools/pages/myAnalysisController"
    },
    shim: {
        "jQuery": { exports: "$" },
        "jQueryDatapicker": { deps: ["jQuery"] },
        "bootstrapJs": { deps: ["jQuery"] },
        "highcharts": { deps: ["jQuery"] },
        "reportApp.reportService": { deps: ["jQuery"] },
        "highcharts3d": { deps: ["highcharts"] },
        "highcharts-more": { deps: ["highcharts"] },
        "heatmap": { deps: ["highcharts"] },
        "highcharts-data": { deps: ["highcharts"] },
        "angular": { exports: "angular" },
        "ngCookies": { deps: ["angular"] },
        "ui.router": { deps: ["angular"] },
        "treeControl": { deps: ["angular"] },
        "d3": { exports: "d3" },
        "angularjs-date-picker":{deps:["angular"]}
    }
});

require([
    'jQuery',
    'angular', 
    'toolsApp',
    'toolsController',
    "heatmapController",
    "vennController",
    "myAnalysisController"
], function (jquery, angular) {
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['toolsApp']);
    });
})