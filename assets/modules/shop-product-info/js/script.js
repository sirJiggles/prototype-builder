if( $('.shop-product-info').length > 0){

	// clicking on the color buttons chnage the select fallback value
	$('.color-controls a').click(function(e){
		e.preventDefault();
		$('.color-control-fallback').val($(this).attr('class'));
	})

	// clicking the tabs for the details
	$('p.tab-content').text($('.product-info-tabs li.active p').text());

	$('.product-info-tabs li h2 a').click(function(e){
		e.preventDefault();
		$('.product-info-tabs li.active').removeClass('active');
		$(this).parent().parent().addClass('active');
		$('p.tab-content').text($(this).parent().parent().find('p').text());
	})
	
}