/* 中文UTF-8 */

/* 切换显示模式（普通模式|迷你模式） */
function ViewBody_Toggle(){
	var div_ViewBody = $("#div_ViewBody");
	if (div_ViewBody.hasClass("view_full"))
	{
		$("#div_ViewBody").removeClass('view_full');
		$("#div_ViewBody").addClass('view_mini');
	}else{
		$("#div_ViewBody").removeClass('view_mini');
		$("#div_ViewBody").addClass('view_full');
	}
}


/* 左侧菜单 展开|收起 状态 */
function LeftNav_Toggle(obj){
	var OBJ = $(obj).parent();
	if (OBJ.hasClass("sidebar_nav_fold"))
	{
		OBJ.removeClass("sidebar_nav_fold");
		OBJ.find("ul").slideDown(100);
	}else{
		OBJ.addClass("sidebar_nav_fold");
		OBJ.find("ul").slideUp(100);
	}
}

/* 第二联菜单 展开|收起 状态 */
function NavShowChild_Toggle(obj){
	var OBJ = $(obj);
	if (OBJ.hasClass("nav_showchild"))
	{
		OBJ.removeClass("nav_showchild");
		OBJ.find("ul").slideUp(100);
	}else{
		OBJ.addClass("nav_showchild");
		OBJ.find("ul").slideDown(100);
	}
}


/* 展开|收起 按钮 状态 */
function NavbarCollapse_Toggle(obj){
	var OBJ = $(obj);
	if (OBJ.hasClass("parduct_navbar_collapse_closed"))
	{
		OBJ.removeClass("parduct_navbar_collapse_closed");
		$("#div_ViewProduct").addClass("view_product_col_1");
		//OBJ.find("ul").slideUp(100);
	}else{
		OBJ.addClass("parduct_navbar_collapse_closed");
		$("#div_ViewProduct").removeClass("view_product_col_1");
	}
}




