
$(document).ready(function(){

	$dragBln = false;
	
	$(".flex-viewport").touchSlider({
		flexible : true,
		speed : 200,
		paging : $(".flicking_con a"),
		counter : function (e){
			$(".flicking_con a").removeClass("on").eq(e.current-1).addClass("on");
		}
	});
	
	$(".flex-viewport").bind("mousedown", function() {
		$dragBln = false;
	});
	
	$(".flex-viewport").bind("dragstart", function() {
		$dragBln = true;
	});
	
	$(".flex-viewport a").click(function(){
		if($dragBln) {
			return false;
		}
	});
	
	timer = setInterval(function(){
		$("#btn_next").click();
	}, 1000);
	
	$(".ui-home-slider").hover(function(){
		clearInterval(timer);
	},function(){
		timer = setInterval(function(){
			$("#btn_next").click();
		},1000);
	});
	
	$(".flex-viewport").bind("touchstart",function(){
		clearInterval(timer);
	}).bind("touchend", function(){
		timer = setInterval(function(){
			$("#btn_next").click();
		}, 1000);
	});
	
});