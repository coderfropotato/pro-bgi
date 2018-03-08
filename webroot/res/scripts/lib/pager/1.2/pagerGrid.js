
function PagerGrid(outObj)
{
    this.options =
    {
        pageSize: 30, //每页显示记录数
        pageNum: 1, //当前页码
        pageCount: undefined,
        total: 0, //总记录数
        dataPanelID: undefined, //数据显示控件ID
        dataPanel: undefined,
        gridPanel: undefined,
        pagerPanel: null//分页控件父页面
    };

    this.startIndex = 0;
    this.endIndex = 0;
    this.pagerPanelID = "";

    this.ClearPage = function ()
    {
        if (this.options.pagerPanel != null)
        {
            $(this.options.pagerPanel).html("");
        }
        this.options.pageNum = 1;
        this.options.pageCount = undefined;
        this.options.total = 0;
        this.options.dataPanelID = undefined;
        this.options.dataPanel = undefined;
        this.options.pagerPanel = null;
    }

    this.InitPager = function (pagerPanel, pagerPanelID, align)
    {
        this.options.pagerPanel = $(pagerPanel);
        var pageHtmlStr = "";
        this.pagerPanelID = pagerPanelID;
        pageHtmlStr += "<div style=\"float: " + align + ";\">";
        pageHtmlStr += "    <ul>";
        //计算共多少页 向上取整,有小数就整数部分加1
        this.options.pageCount = Math.ceil(this.options.total / this.options.pageSize);

        if (this.options.pageCount <= 0)
        {
            $(pagerPanel).html("");
            return; //如果没有数据，则返回
        }

        pageHtmlStr += "<li id=\"li_pr_" + pagerPanelID + "\" class=\"ghtao\"><a href=\"JavaScript:;\" title=\"上一页\" ng-click=\"GoToPage(" + (parseInt(this.options.pageNum) - 1) + ")\">&laquo;</a></li>";

        //计算当前页与第一页的距离，如果小于5 输出 1,2,3,4,5 ...max
        var tempCount = parseInt(this.options.pageNum);
        var pageCountOffset = 3; //页面前后偏移量
        var pageCountOffsetAll = pageCountOffset * 2 + 1; //根据页面偏移量计算出判断量

        if (this.options.pageCount > 12)
        {
            //alert("this.startIndex = " + this.startIndex + "  this.endIndex=" + this.endIndex + "  tempCount=" + tempCount);
            if (tempCount == this.options.pageCount)
            {
                //判断是否点击最后一页
                this.startIndex = this.options.pageCount - pageCountOffsetAll;
                this.endIndex = this.options.pageCount;
                pageHtmlStr += this.GetPageHtml(1);
                pageHtmlStr += "<span class=\"dd\">...</span>";
                for (var i = this.startIndex; i <= this.endIndex; i++)
                {
                    if (this.options.pageNum == i)
                    {
                        pageHtmlStr += this.GetPageHtml(i, "xz", "first");
                    }
                    else
                    {
                        pageHtmlStr += this.GetPageHtml(i);
                    }
                }

            }
            else if (tempCount == 1)
            {
                //判断是否点击第一页
                this.startIndex = 1;
                this.endIndex = pageCountOffsetAll;
                for (var i = this.startIndex; i <= this.endIndex; i++)
                {
                    if (this.options.pageNum == i)
                    {
                        pageHtmlStr += this.GetPageHtml(i, "xz", "first");
                    }
                    else
                    {
                        pageHtmlStr += this.GetPageHtml(i);
                    }
                }
                if (this.endIndex != 0 && this.endIndex < this.options.pageCount)
                {
                    pageHtmlStr += "<span class=\"dd\">...</span>";
                    pageHtmlStr += this.GetPageHtml(this.options.pageCount);
                }
            }
            else
            {
                //点击其他页面逻辑
                if (this.endIndex == 0 && this.endIndex < (tempCount + pageCountOffsetAll - 1))
                {
                    //当第一次点击时，判断结束页面是否小于当前面加上偏移量，如果小于则 开始 = 当前，结束=当前+偏移
                    this.startIndex = tempCount;
                    this.endIndex = tempCount + pageCountOffsetAll - 1;

                }
                else if (this.endIndex > 0 && this.endIndex == tempCount)
                {
                    this.startIndex = tempCount; //赋值，开始 = 当前页码
                    this.endIndex = tempCount + pageCountOffsetAll; //赋值，结束 = 当前页码 + 偏移
                    //此时要判断计算后的结束是否大于最大页数
                    if (this.endIndex > this.options.pageCount)
                    {
                        this.endIndex = this.options.pageCount;
                    }
                }
                else if (this.startIndex == tempCount)
                {
                    //如果不是第一次点击，则需判断开始是否等于当前，如果等于当前，证明要进入上一组显示页码
                    this.startIndex = tempCount - pageCountOffsetAll + 1;
                    this.endIndex = tempCount;
                }


                if (this.startIndex > 0 && this.startIndex != 1)
                {
                    //判断开始位置大于0，同时开始位置不等于1，说明不是第一组页码，则需要输出 1...
                    pageHtmlStr += this.GetPageHtml(1);
                    pageHtmlStr += "<span class=\"dd\">...</span>";
                }
                if (this.startIndex <= 0)
                {
                    this.startIndex = 1;
                    this.endIndex = pageCountOffsetAll;
                }

                if ((this.options.pageCount - tempCount) < pageCountOffsetAll)
                {
                    //alert(3);
                    this.startIndex = this.options.pageCount - pageCountOffsetAll;
                    this.endIndex = this.options.pageCount;
                }

                for (var i = this.startIndex; i <= this.endIndex; i++)
                {
                    if (this.options.pageNum == i)
                    {
                        pageHtmlStr += this.GetPageHtml(i, "xz", "first");
                    }
                    else
                    {
                        pageHtmlStr += this.GetPageHtml(i);
                    }
                }
                if (this.endIndex != 0 && this.endIndex < this.options.pageCount)
                {
                    pageHtmlStr += "<span class=\"dd\">...</span>";
                    pageHtmlStr += this.GetPageHtml(this.options.pageCount);
                }
            }
        }
        else
        {
            for (var i = 1; i <= this.options.pageCount; i++)
            {
                if (this.options.pageNum == i)
                {
                    pageHtmlStr += this.GetPageHtml(i, "xz");
                }
                else
                {
                    pageHtmlStr += this.GetPageHtml(i);
                }
            }
        }

        pageHtmlStr += "<li id=\"li_pr_" + pagerPanelID + "\"><a href=\"JavaScript:;\" title=\"下一页\" ng-click=\"GoToPage(" + (parseInt(this.options.pageNum) + 1) + ")\">&raquo;</a></li>";
        pageHtmlStr += "<span style=\"margin-left: 15px;\">向第</span>";
        pageHtmlStr += "<span><input id=\"" + pagerPanelID + "_tbx_pageCount\" ng-model=\"tbxPageNum\" ng-keyup=\"tbxPageNumKeyup($event)\"  name=\"tbx_pageCount\" class=\"form-control pageNum\" type=\"text\" style=\"padding-left:2px;padding-left:0px;\"  /></span>";
        pageHtmlStr += "<span>&nbsp;/&nbsp;" + this.options.pageCount + "&nbsp;页</span>";
        pageHtmlStr += "<span ><button class=\"btn btn-default btnGoPage\" type=\"button\" ng-click=\"GoToPage(tbxPageNum)\">跳转</button></span>";
        pageHtmlStr += " <span style=\"margin-left: 10px;\">共 " + this.options.total + " 条记录</span>";
        pageHtmlStr += "    </ul>";
        pageHtmlStr += "</div>";
        //$(pagerPanel).html(pageHtmlStr);

        //document.getElementById(pagerPanelID + "_tbx_pageCount").value = this.options.pageNum;
        return pageHtmlStr;
    };

    this.GetPageHtml = function (id, isXZ)
    {
        var resultStr = "";
        if (parseInt(id) <= 9)
        {
            id = "0" + id;
        }
        if (isXZ != undefined)
        {
            resultStr = "<li id=\"li_" + id + "\"><a href=\"JavaScript:;\" ng-click=\"GoToPage(" + id + ")\" class=\"xz\">" + id + "</a></li>";
        }
        else
        {
            resultStr = "<li id=\"li_" + id + "\"><a href=\"JavaScript:;\" ng-click=\"GoToPage(" + id + ")\" >" + id + "</a></li>";
        }
        return resultStr;
    };
}