
$(document).ready(function(){
	// banner
	TouchSlide({ 
		slideCell:"#bar",
		titCell:".flicking_con ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
		mainCell:".ui-silder", 
		effect:"leftLoop", 
		autoPage:true,//自动分页
		autoPlay:true //自动播放
	});

});