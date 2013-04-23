if ($('.accordion').length > 0){
    
    $('.accordion-slide').slideUp();

    $('.accordion-link').click(function(e){
        
        e.preventDefault();
        if (!$(this).next().hasClass('open')){

            $('.accordion-slide').slideUp();
            $('.accordion-slide').removeClass('open');
            $(this).next().slideDown();
            $(this).next().addClass('open');

        }
    });
}