if($('.shop-filters').length > 0){
	$('.shop-filters legend').click(function(e){
		e.preventDefault();

		var fieldset = $(this).parent();

		if ($(fieldset).hasClass('closed')){
			$(fieldset).find('.filters-wrapper').slideToggle();
		}

		$(fieldset).toggleClass('closed');

		if ($(fieldset).hasClass('closed')){
			$(fieldset).find('.filters-wrapper').slideToggle();
		}
	})

	// close them all first for small screens
	if($(window).width() <  520){
		$('.shop-filters fieldset').addClass('closed');
		$('.filters-wrapper').slideToggle();
	}
}	