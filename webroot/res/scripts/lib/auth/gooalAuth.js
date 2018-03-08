//禁止刷新，回退 
function onKeyDown()
{
    if ((event.altKey) || ((event.keyCode == 8) &&
                (event.srcElement.type != "text" &&
                event.srcElement.type != "textarea" &&
                event.srcElement.type != "password")) ||
                ((event.ctrlKey) && ((event.keyCode == 78) || (event.keyCode == 82))) ||
                (event.keyCode == 116) || (event.keyCode == 123))
    {
        event.keyCode = 0;
        event.returnValue = false;
    }
}

document.onkeydown = onKeyDown;

function stop()
{   //这个是禁用鼠标右键 
    return false;
}
document.oncontextmenu = stop;
///$(document).find("div").bind('oncontextmenu',stop); 
//document.body.oncontextmenu = document.body.ondragstart = document.body.onselectstart = document.body.onbeforecopy = function () { return false; }; 
//document.body.onselect = document.body.oncopy = document.body.onmouseup = function () { document.selection.empty(); }; 


$(document).ready(function ()
{
    $("body").css("display", "none");
    var tokenStr = GetQueryString("ids");
    $.ajax({
        url: "http://www.gooalgene.com:808/api/GooalReportAuth/ValidateReportToken?tokenStr=" + tokenStr,

        type: 'GET',
        cache: false,
        success: function (data)
        {
            if (data == "true")
            {
                $("body").css("display", "");
            }
            else
            {
                $("body").css("display", "");
                $("body").html("对不起,系统检测到您是非法访问,请使用正常的访问途径!");
            }
        },
        error: function ()
        {
            $("body").css("display", "");
            $("body").html("对不起,系统检测到您是非法访问,请使用正常的访问途径!");
        }
    });
});

//创建人：高洪涛
//创建日期：2016-4-19
//功能简介：获取页面传递参数的值
function GetQueryString(queryStringName)
{
    var returnValue = "";
    var URLString = new String(document.location);
    var serachLocation = -1;
    var queryStringLength = queryStringName.length;
    do
    {
        serachLocation = URLString.indexOf(queryStringName + "\=");
        if (serachLocation != -1)
        {
            if ((URLString.charAt(serachLocation - 1) == '?') || (URLString.charAt(serachLocation - 1) == '&'))
            {
                URLString = URLString.substr(serachLocation);
                break;
            }
            URLString = URLString.substr(serachLocation + queryStringLength + 1);
        }
    }
    while (serachLocation != -1)
    {
        if (serachLocation != -1)
        {
            var seperatorLocation = URLString.indexOf("&");
            if (seperatorLocation == -1)
            {
                returnValue = URLString.substr(queryStringLength + 1);
            }
            else
            {
                returnValue = URLString.substring(queryStringLength + 1, seperatorLocation);
            }
        }
    }
    return returnValue;
}