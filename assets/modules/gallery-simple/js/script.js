if ($('.gallery-simple').length > 0){

	$('.gallery-simple li').fadeOut();
	
	// start the Gallery
	$('.gallery-simple').flexslider({
        selector:".slides li",
        animation:"fade",
        animationSpeed: isTouchDevice() ? 400 : 1000,
        start: function(){
			$('.gallery-simple li').eq(0).fadeIn();
        },
        after: function(){
        	$('.flex-active-slide').fadeIn();
        }
	});

	// swap out high res images functionality
	if($(window).width() > 600){

		$.each($('.gallery-simple img'), function(key, val){
			$(this).attr('src', $(this).attr('data-high-res'));
		})
	}
}