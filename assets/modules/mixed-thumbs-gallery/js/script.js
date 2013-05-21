if( $('.mixed-thumbs-gallery-wrapper').length > 0){

        // IE7 magic :(
        $('#mixed-thumbs-gallery li').fadeIn();
	$('#mixed-thumbs-gallery li').fadeOut();
	
	// start the Gallery
	$('#mixed-thumbs-gallery').flexslider({
                animation:"fade",
                slideshow:false,
                animationLoop:false,
                controlNav: false,
                sync:'#mixed-thumbs-thumbs',
                start: function(){
		      $('#mixed-thumbs-gallery li').eq(0).fadeIn();
                },
                after: function(){
        	       $('#mixed-thumbs-gallery .flex-active-slide').fadeIn();
                }
	});

	$('#mixed-thumbs-thumbs').flexslider({
                animation:"slide",
                slideshow:false,
                animationLoop:false,
                controlNav: false,
                direction:"vertical",
                itemWidth:95,
                smoothHeight:true,
                asNavFor:'#mixed-thumbs-gallery'
	});


        $('#mixed-thumbs-phone-thumbs').flexslider({
                animation:"slide",
                slideshow:false,
                animationLoop:false,
                controlNav: false,
                itemWidth:60,
                itemMargin:15,
                asNavFor:'#mixed-thumbs-gallery'
        });


	// swap out high res images functionality
	if($(window).width() > 600){

                $.each($('#mixed-thumbs-gallery img'), function(key, val){
                        if($(this).attr('data-high-res')){
                                $(this).attr('src', $(this).attr('data-high-res'));
                        }
                })
	}
}