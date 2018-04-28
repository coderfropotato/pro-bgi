define([
    "ui.router",
    "treeControl",
    "angularjs-date-picker",
    "superApp.superDire",
    "superApp.superService",
    "superApp.reportDire",
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
        "treeControl",
        "720kb.datepicker",
        "superApp.superDire",
        "superApp.superService",
        "superApp.reportDire",
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
    toolsApp.config(["$logProvider", "$httpProvider", "$stateProvider", function ($logProvider, $httpProvider, $stateProvider) {
        $logProvider.debugEnabled(true);
        // router config 
        $stateProvider
            .state("home", { url: "/home", templateUrl: "./index.html" })
            .state("heatmapGroup", {
                url: "/home/heatmapGroup",
                templateUrl: "../tools/pages/heatmapGroup.html",
            })
            .state("heatmapSample", {
                url: "/home/heatmapSample",
                templateUrl: "../tools/pages/heatmapSample.html",
            })
            .state("venn", {
                url: "/home/venn",
                templateUrl: "../tools/pages/venn.html",
            })
            .state("myAnalysis", {
                url: "/home/myAnalysis",
                templateUrl: "../tools/pages/myAnalysis.html",
            })
    }]);
    return toolsApp;
})