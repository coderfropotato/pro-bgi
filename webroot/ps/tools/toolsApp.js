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
    toolsApp.config(["$logProvider", "$httpProvider", function ($logProvider, $httpProvider) {
        $logProvider.debugEnabled(true);
    }]);
    return toolsApp;
})