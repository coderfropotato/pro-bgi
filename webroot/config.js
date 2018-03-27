﻿define([], function () {
    var base_url = "http://47.97.11.16:5002/api/1";  //正式
    // var base_url = "http://192.168.0.112:5002/api/1";  //开发
    //  var base_url = "http://172.168.1.115:5006/api/1";   //测试
    var manager_base_url = "http://172.168.1.115:5007/api/1"  //管理员
    // var geneInfo_url = "http://180.76.159.174:81/api";
    var geneInfo_url = "http://47.96.185.131:82/api"; // 新环境
    var SUPER_CONSOLE_MESSAGE =
        {
            testTitle: "生物云计算平台",
            officialTitle: "古奥基因云计算V1.0",
            localUrl:
            {
                topPath: "./include/include_top.html",
                leftPath: "./include/include_left.html",
                onLineReportTopPath: "./../include/include_rnaseqtop.html",
                onLineReportLeftPath: "./../include/include_rnaseqleft.html",
                girdFilterPath: "./../include/include_grid_filter.html",
            },
            messageUrl: "ps/login/message.html",
            loginUrl: "ps/login/login.html",
            popBDWindowPath: "./include/browser_detect_prompt.html",
            pathWayPath: "../../pathway/",
            motifPath: "../../motif/",

            apiPath: base_url,
            chipseqApiPath: base_url + "/chip",
            mrnaseqApiPath: base_url + "/mrna",
            gwasApiPath: base_url + "/gwas",
            getGeneInfoPath: geneInfo_url,
            mirnaApiPath: base_url + "/mirna",
            rna16sApiPath: base_url + "/rna16s",
            dnaApiPath: base_url + "/dna",
            itsApiPath: base_url + "/its",
            radApiPath: base_url + "/radseq",
            bsaApiPath: base_url + "/bsa",
            
            m_apiPath: manager_base_url,
            mangerApiPath: manager_base_url + "/load"
        };
    return SUPER_CONSOLE_MESSAGE;
});