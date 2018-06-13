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
    "superApp.reAnalysisDire",
    "superApp.staticImgExportDire",
    "superApp.addDeleteBigTableDire",
    "superApp.littleTableDire",
    "superApp.bigTableDire",
    "superApp.tableSwitchChartDire",
    "superApp.chartSetDire"
], function() {
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
        "superApp.reAnalysisDire",
        "superApp.staticImgExportDire",
        "superApp.addDeleteBigTableDire",
        "superApp.littleTableDire",
        "superApp.bigTableDire",
        "superApp.tableSwitchChartDire",
        "superApp.chartSetDire"
    ]);
    toolsApp.config(["$logProvider", "$httpProvider", "$stateProvider", "$urlRouterProvider", function($logProvider, $httpProvider, $stateProvider, $urlRouterProvider) {
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
            .state("mapId", {
                url: "/home/mapId",
                templateUrl: "../tools/pages/mapId.html",
            })
            .state("goClass", {
                url: "/home/goClass/:id",
                templateUrl: "../tools/pages/goClass.html",
            })
            .state("goRich", {
                url: "/home/goRich/:id",
                templateUrl: "../tools/pages/goRich.html",
            })
            .state("pathwayClass", {
                url: "/home/pathwayClass/:id",
                templateUrl: "../tools/pages/pathwayClass.html",
            })
            .state("pathwayRich", {
                url: "/home/pathwayRich/:id",
                templateUrl: "../tools/pages/pathwayRich.html",
            })
            .state("line", {
                url: "/home/line/:id",
                templateUrl: "../tools/pages/line.html",
            })
            .state("net", {
                url: "/home/net/:id",
                templateUrl: "../tools/pages/net.html",
            })
            .state("geneDetail", {
                url: "/home/geneDetail/:id",
                templateUrl: "../tools/pages/geneDetail.html",
            })
            .state("loading", {
                url: "/home/loading",
                templateUrl: '../tools/pages/loading.html'
            })
            .state("error", {
                url: "/home/error/:id",
                templateUrl: "../tools/pages/error.html",
            })
            .state('errorMessage', {
                url: "/home/errorMessage",
                templateUrl: "../login/message.html"
            })

        $urlRouterProvider.otherwise('/home/errorMessage');

        $httpProvider.interceptors.push("tokenInterceptorFactory");
    }]);
    return toolsApp;
})