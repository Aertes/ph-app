
$(function(){
    $(document)
	.on('click', '#menu', function(){
		$('.ui-menu').slideToggle(300);
    })
	.on('click', '.item h3', function(){
		$(this).next("ul").slideToggle(300).siblings("ul").slideUp(500);
		$(this).find('i').toggleClass('on');
	})
	.on('click', '.ui-footer-question h3', function(){
		$(this).next("ul").slideToggle(300).siblings("ul").slideUp(500);
		$(this).find('i').toggleClass('on');
	})
	.on('click', '.search',function(){
		$('.ui-header-nav').hide().next().show();
	})
	.on('click', '.close-btn', function(){
		$('.ui-header-search').hide().siblings().show();
	})
	
})
