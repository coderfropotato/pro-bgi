define([
    "ui.router",
    "treeControl",
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
    "superApp.imgExportDire",
    "superApp.tokenInterceptorFactory",
    "superApp.svgNewExportDire",
    "superApp.tableCopyDire"
], function () {
    var toolsApp = angular.module('toolsApp', [
        "ui.router",
        "treeControl",
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
        "superApp.imgExportDire",
        "superApp.tokenInterceptorFactory",
        "superApp.svgNewExportDire",
        "superApp.tableCopyDire"
    ]);
    toolsApp.config(["$logProvider", "$httpProvider", "$stateProvider", function ($logProvider, $httpProvider, $stateProvider) {
        $logProvider.debugEnabled(true);
        // router config 
        $stateProvider
            .state("home", { url: "/home", templateUrl: "./index.html" })
            .state("heatmap", {
                url: "/home/heatmap",
                cache:"true",
                templateUrl: "../tools/pages/heatmap.html",
            })
            .state("venn", {
                url: "/home/venn",
                cache:"true",
                templateUrl: "../tools/pages/venn.html",
            })
    }]);
    return toolsApp;
})