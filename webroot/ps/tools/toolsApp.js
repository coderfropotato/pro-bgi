define([
    "ui.router",
    "ui.bootstrap",
    "treeControl",
    "angularjs-date-picker",
    "superApp.superDire",
    "superApp.superService",
    "superApp.gridFilterDire",
    "superApp.svgExportDire",
    "superApp.toolTipDire",
    "superApp.reportService",
    "superApp.graphGroupBtnDire",
    "superApp.selectRangeDire",
    "superApp.gridExportDire",
    "superApp.selectColorDire",
    "superApp.colorSelectorDire",
    "superApp.heatmapSetDire",
    "superApp.imgExportDire",
    "superApp.tokenInterceptorFactory",
    "superApp.svgNewExportDire",
    "superApp.tableCopyDire",
    "superApp.theadControlDire",
    "superApp.analysisPopDire",
    "superApp.topQuickMenuDire",
    "superApp.reportPageTitleDire",
    "superApp.reportPageSubTitleDire",
    "superApp.reAnalysisDire"
], function () {
    var toolsApp = angular.module('toolsApp', [
        "ui.router",
        "ui.bootstrap",
        "treeControl",
        "720kb.datepicker",
        "superApp.superDire",
        "superApp.superService",
        "superApp.gridFilterDire",
        "superApp.svgExportDire",
        "superApp.toolTipDire",
        "superApp.reportService",
        "superApp.graphGroupBtnDire",
        "superApp.selectRangeDire",
        "superApp.gridExportDire",
        "superApp.selectColorDire",
        "superApp.colorSelectorDire",
        "superApp.heatmapSetDire",
        "superApp.imgExportDire",
        "superApp.tokenInterceptorFactory",
        "superApp.svgNewExportDire",
        "superApp.tableCopyDire",
        "superApp.theadControlDire",
        "superApp.analysisPopDire",
        "superApp.topQuickMenuDire",
        "superApp.reportPageTitleDire",
        "superApp.reportPageSubTitleDire",
        "superApp.reAnalysisDire"
    ]);
    toolsApp.config(["$logProvider", "$httpProvider", "$stateProvider", "$urlRouterProvider", function ($logProvider, $httpProvider, $stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/home/myAnalysis');
        $stateProvider
            .state("home", { url: "/home", templateUrl: "./index.html" })
            .state("heatmapGroup", {
                url: "/home/heatmapGroup/:id",
                templateUrl: "../tools/pages/heatmapGroup.html",
            })
            .state("heatmapSample", {
                url: "/home/heatmapSample/:id",
                templateUrl: "../tools/pages/heatmapSample.html",
            })
            .state("venn", {
                url: "/home/venn/:id",
                templateUrl: "../tools/pages/venn.html",
            })
            .state("myAnalysis", {
                url: "/home/myAnalysis",
                templateUrl: "../tools/pages/myAnalysis.html",
            })
            .state("loading", {
                url: "/home/loading",
                templateUrl: "../tools/pages/loading.html",
            })

        $httpProvider.interceptors.push("tokenInterceptorFactory");
    }]);
    return toolsApp;
})