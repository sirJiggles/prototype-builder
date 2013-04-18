if ($('.gallery').length > 0){

	$('.gallery li').fadeOut();
	
	// start the Gallery
	$('.gallery').flexslider({
        selector:"ul li",
        animation:"fade",
        animationSpeed: isTouchDevice() ? 400 : 1000
	});

	// swap out high res images functionality
	if($(window).width() > 600){

		$.each($('.gallery img'), function(key, val){
			$(this).attr('src', $(this).attr('data-high-res'));
		})
	}
}