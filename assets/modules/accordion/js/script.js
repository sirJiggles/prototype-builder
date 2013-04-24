if ($('.accordion').length > 0){
    
    $('.accordion article').slideToggle();

    $('.accordion-link').click(function(e){
        
        e.preventDefault();

        if (!$(this).next().hasClass('open')){

            $('.accordion article.open').slideToggle().removeClass('open');
            $(this).next().slideToggle().addClass('open');
        }

    });
}