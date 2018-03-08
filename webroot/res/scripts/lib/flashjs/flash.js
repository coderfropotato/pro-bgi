var url = "";



function setURL(ip)
{
	url = "http://"+ip+":89/cookie/flashcookie.html";
}

function loadPage()
{
	location.replace(location.href);
}

////add by yxf@2014/08/27
/**
 *@描  述：增加UA判断，排除移动终端上报cookies值和时间间隔值
 *@返回值：
 *		true, 允许上报； false，不允许上报
 */
function IsCanReport2Ac(){
	
	var strUseAgent = navigator.userAgent.toLowerCase();
	
	//非windows nt
	var isWinNt = strUseAgent.indexOf("windows nt") > -1;
	if (!isWinNt){	return false;}
	
	//移动终端
	var isMobile = strUseAgent.indexOf("mobile") > -1;
	if (isMobile){	return false;}
	
	//为Android
	var isAndroid = strUseAgent.indexOf("android") > -1;
	if (isAndroid){	return false;}
	
	//为ios
	var isIOS = !!strUseAgent.match(/\(i[^;]+;( u;)? cpu.+mac os x/);
	if (isIOS){	return false;}
	
	//为Symbian
	var isSymbian = strUseAgent.indexOf("symbian") > -1;
	if (isSymbian){	return false;}

	//为iPhone
	var isIPhone = strUseAgent.indexOf("iphone") > -1;
	if (isIPhone){	return false;}
	
	//为ipad
	var isIPad = strUseAgent.indexOf("ipad") > -1;
	if (isIPad){ return false;}
	
	//为ipod
	var isIPod = strUseAgent.indexOf("ipod") > -1;
	if (isIPod){ return false;}
	
	//排除一些误判的app 特征字符串
	var isInvalidAppPos = strUseAgent.search(/ baidubrowser\/\d/);//-- 百度一下客户端
	if (-1 != isInvalidAppPos){ return false;}
	
	return true;
}
////end by yxf


// 写cookies
function setCookie(name,value)
{
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

// 读取cookies
function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
 
    if(arr=document.cookie.match(reg)){
	
		return (arr[2]);
	}else{
	
        return null;
	}
}

function supFlash(cookie)
{	
	if (false === IsCanReport2Ac()){
	
		loadPage();		
		return;
	}
	
	// 获取本地cookie值
	var td_cookie = getCookie("td_cookie");
	if (td_cookie == cookie){
	
		loadPage();		
		return;
	}
	setCookie("td_cookie", cookie);
	
	var flash = 0;
	var judgeIE = !-[1,];
	var ua = navigator.userAgent.toLowerCase();
	if (ua.indexOf("taobrowser") > 0 || ua.indexOf("lbbrowser") > 0) {
	
		loadPage();
		return;
	}
	var isIE = judgeIE || ua.indexOf("msie") > 0 || ua.indexOf("trident/7.0") > 0;
	if(isIE){
		try{
			var swf1 = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
			flash = 1;
		}
		catch(e){
			flash = 0;
		}
	}
	else {
		try{
			var swf2 = navigator.plugins['Shockwave Flash'];
			if(swf2 == undefined){
				flash = 0;
			}
			else {
				flash = 1;
			}
		}
		catch(e){
			flash = 0;
		}
	}

	if(flash === 0)
	{
		loadPage();
		return;
	}	
}

function jsSetCookie(cookie, uptime, oldtime)
{
	if(cookie == ""){
		loadPage();
		return;
	}
	
	if(url == ""){
		loadPage();
		return;
	}

	var ua = navigator.userAgent.toLowerCase();
	plugins=window.navigator.plugins;
	browserType=1;
	for(i=0;i<plugins.length;i++){
		if(plugins[i].filename=="pepflashplayer.dll"){
			browserType=0;
		}
	}
	if (browserType == 0 && ua.indexOf("metasr") > 0){
		browserType=2;
	}
	params=cookie+"&bt="+browserType+"&interval="+uptime+"&oldtime="+oldtime;	
	var script = document.createElement("script");
	script.type = "text/javascript";
	var done = false;
	script.onload = script.onreadystatechange = function(){
		if ( !done && (!this.readyState ||
				this.readyState === "loaded" || this.readyState === "complete") ) {
			done = true;
			this.onload = this.onreadystatechange = null;
			loadPage();
			return;
		}
	};
	script.src = url +"?"+params+"&"+Math.random();
	document.getElementsByTagName("head")[0].appendChild(script);
}

