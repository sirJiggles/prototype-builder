if ($('.accordion').length > 0){
    $('.accordion-slide').slideUp();

    $('.accordion-link').click(function(e){

        e.preventDefault();

        if (!$(this).hasClass('open')){

            $('.accordion-slide').slideUp();
            $(this).next().slideToggle();
            $('.accordion-link').removeClass('open');
            $(this).toggleClass('open');

        }
    });
}