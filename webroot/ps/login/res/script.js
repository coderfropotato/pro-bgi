window.onload = function(){
    var type = true;//控制动画的开关
    var bodyW = document.documentElement.clientWidth || document.body.clientWidth || window.innerWidth;
    var bodyH = document.documentElement.clientHeight || document.body.clientHeight || window.innerHeight;
    var main = $(".main")[0];
    var conUl = $(".main_ul")[0];
    var liLen = $(".main_ul .content");//获取li
    //设置Li的高度
    for (var i = 0; i < liLen.length; i++) {
        liLen[i].style.height = bodyH + "px";
    }
    conUl.style.height = bodyH * liLen.length + "px";//设置ul的高

    //鼠标的滚轮事件(兼容 ie and chrome);
    main.onmousewheel = function (event) {
        var event = event || window.event;
        var direction = event.wheelDelta && (event.wheelDelta > 0 ? "mouseup" : "mousedown");
        //向上滚动
        if (direction == "mouseup") {
            mouseTop();
        }
        //向下滚动
        if (direction == "mousedown") {
            mouseBottom();
        }
    }

    //鼠标滚轮事件(兼容 firefox)
    document.body.addEventListener("DOMMouseScroll", function (event) {
        var direction = event.detail && (event.detail > 0 ? "mousedown" : "mouseup");
        //向下滚动
        if (direction == "mousedown") {
            mouseBottom();
        }

        //向上滚动
        if (direction == "mouseup") {
            mouseTop();
        }
    });

    //向上滚动代码函数
    function mouseTop() {
        //第二屏
        if (main.scrollTop >= liLen[2].offsetTop && type == true) {
            type = false;
            //延时滚动。要不然会先执行代码再执行滚轮，那样会多滚动出一截子。
            setTimeout(function () {
                AnimationTop(1);
            }, 10);
            return;
        }

        //第一屏
        if (main.scrollTop >= liLen[1].offsetTop && type == true) {
            type = false;
            //延时滚动。要不然会先执行代码再执行滚轮，那样会多滚动出一截子。
            setTimeout(function () {
                AnimationTop(0);
            }, 10);
            return;
        }
    }

    //向下滚动代码函数
    function mouseBottom() {
        //第二屏
        if (main.scrollTop == liLen[0].offsetTop && type == true) {
            type = false;
            //延时滚动。要不然会先执行代码再执行滚轮，那样会多滚动出一截子。
            setTimeout(function () {
                AnimationBottom(1);
            }, 10);
            return;
        }

        //第三屏
        if (main.scrollTop <= liLen[1].offsetTop && type == true) {
            type = false;
            //延时滚动。要不然会先执行代码再执行滚轮，那样会多滚动出一截子。
            setTimeout(function () {
                AnimationBottom(2);
            }, 10);
            return;
        }
    }

    //向上滚轮动画函数
    function AnimationTop(num) {
        var t = setInterval(function () {
            if (main.scrollTop > liLen[num].offsetTop) {
                //控制移动速度（慢--快--慢）
                // -- 慢
                if (main.scrollTop >= liLen[num].offsetTop + (parseInt(liLen[num].style.height) / 11 * 9)) {
                    main.scrollTop -= 6;
                    // -- 快
                } else if (main.scrollTop <= liLen[num].offsetTop + (parseInt(liLen[num].style.height) / 11 * 9) && main.scrollTop >= liLen[num].offsetTop + (parseInt(liLen[num].style.height) / 11 * 2)) {
                    main.scrollTop -= 12;
                    // -- 慢
                } else if (main.scrollTop <= liLen[num].offsetTop + (parseInt(liLen[num].style.height) / 11 * 2) && main.scrollTop >= liLen[num].offsetTop) {
                    main.scrollTop -= 6;
                }
            } else {
                main.scrollTop = liLen[num].offsetTop;
                clearInterval(t);
                type = true;
            }
        }, 1);
    }

    //向下滚轮动画函数
    function AnimationBottom(num) {
        var t = setInterval(function () {
            if (main.scrollTop < liLen[num].offsetTop) {
                //控制移动速度（先快后慢）
                // -- 慢
                if (main.scrollTop <= liLen[num].offsetTop / 11 * 2) {
                    main.scrollTop += 6;
                    // -- 快
                } else if (main.scrollTop >= liLen[num].offsetTop / 11 * 2 && main.scrollTop <= liLen[num].offsetTop / 11 * 10) {
                    main.scrollTop += 12;
                    // -- 慢
                } else if (main.scrollTop >= liLen[num].offsetTop / 11 * 10 && main.scrollTop <= liLen[num].offsetTop) {
                    main.scrollTop += 6;
                }
            } else {
                main.scrollTop = liLen[num].offsetTop;
                clearInterval(t);
                type = true;
            }
        }, 1);
    }

    var index = 0;
    var maximg = 5;
    //滑动导航改变内容
    $("#productNav li").hover(function () {
        if (MyTime) {
            clearInterval(MyTime);
        }
        index = $("#productNav li").index(this);
        MyTime = setTimeout(function () {
            ShowjQueryFlash(index);
            $('#productContent').stop();
        }, 400);

    }, function () {
        clearInterval(MyTime);
        MyTime = setInterval(function () {
            ShowjQueryFlash(index);
            index++;
            if (index == maximg) { index = 0; }
        }, 3000);
    });

    //自动播放
    var MyTime = setInterval(function () {
        ShowjQueryFlash(index);
        index++;
        if (index == maximg) { index = 0; }
    }, 3000);
    function ShowjQueryFlash(i) {
        $("#productContent .banner_teb").eq(i).animate({ opacity: 1 }, 1000).css({ "z-index": "1" }).siblings().animate({ opacity: 0 }, 1000).css({ "z-index": "0" });
        $("#productNav li").eq(i).addClass("current").siblings().removeClass("current");
    }

    //点击登录按钮显示登录弹窗
    $(".loginBtn").click(function () {
        $(".mengc").show();
        $("#login").show(10);
    })
    //点击登录弹窗关闭按钮隐藏登录弹窗
    $("#closeBtn").click(function () {
        $("#login").hide();
        $(".mengc").hide(10);
    })
};