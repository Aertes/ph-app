
$(function(){
    $('#menu').on('click', function(){
		$('.ui-menu').slideToggle(300);
    })

	$('.item h3').on('click', function(){
		$(this).next("ul").slideToggle(300).siblings("ul").slideUp(500);
		$(this).find('i').toggleClass('on');
	})

	$('.ui-footer-question h3').on('click', function(){
		$(this).next("ul").slideToggle(300).siblings("ul").slideUp(500);
		$(this).find('i').toggleClass('on');
	})

	$('.search').on('click',function(){
		$('.ui-header-nav').hide().next().show();
	})

	$('.close-btn').on('click', function(){
		$('.ui-header-search').hide().siblings().show();
	})
	

})
