require.config({
    baseUrl: '../../',
    paths: {
        "jQuery": "res/scripts/lib/jquery/1.10.2/jquery.min",
        "jQueryDatapicker": "res/scripts/lib/jquery/jquery.datepicker",
        "ui.bootstrap": "res/scripts/lib/angularui-bootstrap/ui-bootstrap-tpls-2.5.0.min",
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
        "angularjs-date-picker": "res/scripts/lib/angularjs-datepicker/angular-datepicker.min",

        "super.superMessage": "config",
        "superApp.superDire": "res/scripts/super/directive/superDire",
        "superApp.gridFilterDire": "res/scripts/super/directive/gridFilterDire",
        "superApp.svgExportDire": "res/scripts/super/directive/svgExportDire",
        "superApp.imgExportDire": "res/scripts/super/directive/imgExportDire",
        "superApp.toolTipDire": "res/scripts/super/directive/toolTipDire",
        "superApp.graphGroupBtnDire": "res/scripts/super/directive/graphGroupBtnDire",
        "superApp.selectRangeDire": "res/scripts/super/directive/selectRangeDire",
        "superApp.gridExportDire": "res/scripts/super/directive/gridExportDire",
        "superApp.colorSelectorDire": "res/scripts/super/directive/colorSelectorDire",
        "superApp.heatmapSetDire": "res/scripts/super/directive/heatmapSetDire",
        "superApp.svgNewExportDire": "res/scripts/super/directive/svgNewExportDire",
        "superApp.tableCopyDire": "res/scripts/super/directive/tableCopyDire",
        "superApp.theadControlDire": "res/scripts/super/directive/theadControlDire",
        "superApp.analysisPopDire": "res/scripts/super/directive/analysisPopDire",
        "superApp.topQuickMenuDire": "res/scripts/super/directive/topQuickMenuDire",
        "superApp.reportPageTitleDire": "res/scripts/super/directive/reportPageTitleDire",
        "superApp.reportPageSubTitleDire": "res/scripts/super/directive/reportPageSubTitleDire",
        "superApp.reAnalysisDire": "res/scripts/super/directive/reAnalysisDire",
        "superApp.staticImgExportDire": "res/scripts/super/directive/staticImgExportDire",
        "superApp.addDeleteBigTableDire": "res/scripts/super/directive/addDeleteBigTableDire",
        "superApp.littleTableDire": "res/scripts/super/directive/littleTableDire",
        "superApp.bigTableDire": "res/scripts/super/directive/bigTableDire",
        "superApp.tableSwitchChartDire": "res/scripts/super/directive/tableSwitchChartDire",
        "superApp.chartSetDire": "res/scripts/super/directive/chartSetDire",
        "superApp.chartDescDire": "res/scripts/super/directive/chartDescDire",

        "superApp.superService": "res/scripts/super/service/superService",
        "superApp.reportService": "res/scripts/super/service/reportService",

        "superApp.tokenInterceptorFactory": "res/scripts/super/factory/tokenInterceptorFactory",
        "superApp.markerFactory": "res/scripts/super/factory/markerFactory",

        "command": "res/scripts/super/command",

        "pageFactory": "ps/tools/aFactory",

        'toolsApp': 'ps/tools/toolsApp',
        'toolsController': 'ps/tools/toolsController',

        "errorController": "ps/tools/pages/errorController",

        "mapIdController": "ps/tools/pages/mapIdController",

        "myAnalysisController": "ps/tools/pages/myAnalysisController",

        "vennController": "ps/tools/pages/vennController",
        "heatmapGroupController": "ps/tools/pages/heatmapGroupController",
        "heatmapSampleController": "ps/tools/pages/heatmapSampleController",
        "goClassController": "ps/tools/pages/goClassController",
        "goRichController": "ps/tools/pages/goRichController",
        "pathwayClassController": "ps/tools/pages/pathwayClassController",
        "pathwayRichController": "ps/tools/pages/pathwayRichController",
        "netController": "ps/tools/pages/netController",
        "lineController": "ps/tools/pages/lineController",
        "geneDetailController": "ps/tools/pages/geneDetailController",
        "loadingController": "ps/tools/pages/loadingController",
        "helpController": "ps/tools/pages/helpController",

        "geneInfoController":"ps/tools/pages/geneInfoController",
    },
    shim: {
        "jQuery": { exports: "$" },
        "jQueryDatapicker": { deps: ["jQuery"] },
        // "bootstrapJs": { deps: ["jQuery"] },
        "highcharts": { deps: ["jQuery"] },
        "reportApp.reportService": { deps: ["jQuery"] },
        "highcharts3d": { deps: ["highcharts"] },
        "highcharts-more": { deps: ["highcharts"] },
        "heatmap": { deps: ["highcharts"] },
        "highcharts-data": { deps: ["highcharts"] },
        "angular": { exports: "angular" },
        "ngCookies": { deps: ["angular"] },
        "ui.router": { deps: ["angular"] },
        "ui.bootstrap": { deps: ["angular"] },
        "treeControl": { deps: ["angular"] },
        "d3": { exports: "d3" },
        "angularjs-date-picker": { deps: ["angular"] }
    }
});

require([
    'jQuery',
    'angular',
    "d3",
    "highcharts",
    "highcharts3d",
    "highcharts-more",
    "heatmap",
    "highcharts-data",

    "pageFactory",
    'toolsApp',
    'toolsController',
    "errorController",
    "mapIdController",
    "myAnalysisController",

    "vennController",
    "heatmapGroupController",
    "heatmapSampleController",
    "goClassController",
    "goRichController",
    "pathwayClassController",
    "pathwayRichController",
    "netController",
    "lineController",
    "geneDetailController",
    "loadingController",
    "helpController",
    "geneInfoController"
], function(jquery, angular, d3) {
    window.d3 = d3;
    angular.element(document).ready(function() {
        angular.bootstrap(document, ['toolsApp']);
    });
})