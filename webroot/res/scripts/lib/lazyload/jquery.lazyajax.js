/*
    创建人：高洪涛
    创建时间：2016-5-12
    调用方式：
    $(window).LazyAjaxProductList({
        parentCss:".floor",
        pos:260
    });
*/

$.fn.LazyAjaxProductList = function (options)
{
    var settings = {
        parentCss: null, //主Div样式
        pos: 820 //偏移量
    };

    $.extend(settings, options);

    //windows Scroll事件
    $(window).scroll(function ()
    {
        LazyLoadUpdate();
    });

    $(window).bind("resize", function ()
    {
        LazyLoadUpdate();
    });

    $(window).bind("onload", function ()
    {
        LazyLoadUpdate();
    });

    LazyLoadUpdate();
    //加载事件
    function LazyLoadUpdate()
    {
        var scrollTop = $(window).scrollTop();
        var winHeight = $(window).height();

        //先取出所有的待加载的div
        var lazyDivArray = $(settings.parentCss);
        lazyDivArray.each(function ()
        {
            var nowPanel = $(this);

            if (nowPanel.attr("data-more") == "false")
            {
                return;
            }

            var nowPanelTop = nowPanel.offset().top;
            var nowPenelHeight = nowPanel.height();
            //console.log(nowPanelTop);
            //console.log(scrollTop);
            //console.log(winHeight);
            if ((nowPanel.attr("data-load") == "now") || ((nowPanel.attr("data-more") == "true") && (nowPanelTop < scrollTop + winHeight - settings.pos)))
            {
                //alert(1);
                nowPanel.attr("data-more", "false");
                var typeID = nowPanel.attr("data-typeID"); //alert(typeID);
                var count = nowPanel.attr("data-count");
                jQuery.ajax({
                    type: "post",
                    data: "flag=GetProductList&typeID=" + typeID + "&count=" + count + "&i=" + Math.round(Math.random() * 10000),
                    url: "AJAX/InitProductList.aspx",
                    dataType: "text",
                    beforeSend: function (XMLHttpRequest)
                    {
                        proHtmlStr = "";
                    },
                    success: function (data, textStatus)
                    {
                        //alert(data);
                        if (data != "false")
                        {
                            //nowPanel.find(".proListPanel").hide();
                            nowPanel.find(".proListPanel").html(data);
                        }
                        else
                        {
                            ShowModalWindow("获取产品错误", "非常抱歉！<br/>获取产品列表信息失败，请及时联系系统管理员！", "", "panel-danger", "", "200");
                        }
                    },
                    complete: function (XMLHttpRequest, textStatus)
                    {
                        nowPanel.find(".proListPanel").show();
                        //下面这段是一张一张加载，不过也没还要引用  jquery.lazyload.js 组合使用
//                        nowPanel.find(".proListPanel").find("img[name='lazy']").lazyload({
//                            placeholder: "images/imgLoading.png",
//                            effect: "show"
//                        });
                    }
                });
            }

        });
    }
}






//$(window).scroll(function ()
//{
//    var scrollTop = $(window).scrollTop();
//    var winHeight = $(window).height();

//    //先取出所有的待加载的div
//    var lazyDivArray = $(".floor");
//    lazyDivArray.each(function ()
//    {
//        var nowPanel = $(this);
//        var nowPanelTop = nowPanel.offset().top;
//        var nowPenelHeight = nowPanel.height();
//        if ((nowPanel.attr("data-more") == "true") && (nowPanelTop < scrollTop + winHeight - 220))
//        {
//            nowPanel.attr("data-more", "false");
//            var typeID = nowPanel.attr("data-typeID");
//            var count = nowPanel.attr("data-count");
//            jQuery.ajax({
//                type: "post",
//                data: "flag=GetProductList&typeID=" + typeID + "&count=" + count + "&i=" + Math.round(Math.random() * 10000),
//                url: "AJAX/InitProductList.aspx",
//                dataType: "text",
//                beforeSend: function (XMLHttpRequest)
//                {
//                    proHtmlStr = "";
//                },
//                success: function (data, textStatus)
//                {
//                    //console.log(data);
//                    if (data != "false")
//                    {
//                        nowPanel.find(".proListPanel").html(data);
//                    }
//                    else
//                    {
//                        ShowError();
//                    }
//                },
//                complete: function (XMLHttpRequest, textStatus)
//                {
//                }
//            });
//        }

//    });
//});