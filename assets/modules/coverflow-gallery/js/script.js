   
// Change this variable to the class of the gallery
var galleryClass = '.gallery',
resizeDone=  false,
siteWrapper = '#site-wrapper';

if ($(galleryClass).length > 0){
    
    // Javascript for the coverflow gallerys
                
    // style objects for the js version of the fancy gallery
    var defaultLi = {
        marginTop:'52',
        marginRight:'68',
        marginBottom:'52',
        marginLeft:'68',
        'height':'306',
        'width':'380'
    },
    largeWeb = {
        'left':'219',
        'z-index':'3',
        'height':'410',
        'width':'517',
        'margin':'0'},
    largeWebLast = $.extend({}, largeWeb, {'left':'-195'}),
    smallWebRight = $.extend({'left':'-60','z-index':'2'}, defaultLi),
    smallWebLeft = $.extend({'left':'500','z-index':'1'}, defaultLi),
    smallWebLeftLast = $.extend({}, smallWebLeft, {'left':'39'}),
    smallWebLeftSecondLast = $.extend({}, defaultLi, {'left':'160'}),
    noGalleryLi = {margin:'0', left:'auto', 'height':'300'};

    var fancyGallery = true, containerSize = $(siteWrapper).width();

    // Custom function to adjuest the slides
    function adjustSlides(slider){
        
        //remove blur
        slider.slides.find('img').removeClass('blur');
        
        if (fancyGallery){
            
            var leftSlide = slider.animatingTo;

            // left slide blur
            if(slider.slides.eq(leftSlide -1)){
                slider.slides.eq(leftSlide -1).find('img').addClass('blur');
            }
            // right slide blur
            if(slider.slides.eq(leftSlide +1)){
                slider.slides.eq(leftSlide +1).find('img').addClass('blur');
            }

            if (supports('transition')){

                // CSS3 METHOD

                slider.slides.removeClass('small-web-left small-web-right large-web large-web-last small-web-left-last');
                slider.slides.addClass('css-slide');

                // first slide
                if (leftSlide == 0){
                    slider.slides.eq(leftSlide).addClass('large-web');
                    slider.slides.eq(leftSlide + 1).addClass('small-web-right');
                    return false;
                }

                // last slide
                if (leftSlide == slider.last){
                    slider.slides.eq(leftSlide).addClass('large-web-last');
                    slider.slides.eq(leftSlide - 1).addClass('small-web-left-last');
                    return false;
                }

                // anywhere in between
                slider.slides.eq(leftSlide -1).addClass('small-web-left');
                slider.slides.eq(leftSlide).addClass('large-web');
                slider.slides.eq(leftSlide + 1).addClass('small-web-right');

            }else{

                //JS METHOD


                // last slide
                if (leftSlide == slider.last){
                    slider.slides.eq(leftSlide).animate(largeWebLast);
                    slider.slides.eq(leftSlide - 1).animate(smallWebLeftLast);
                    slider.slides.eq(leftSlide - 2).animate(smallWebLeftSecondLast);
                    return false;
                }

                // anywhere in between
                slider.slides.eq(leftSlide -1).animate(smallWebLeft);
                slider.slides.eq(leftSlide).animate(largeWeb);
                slider.slides.eq(leftSlide + 1).animate(smallWebRight);

            }
        }
        
        slider.resize();
        

    }
    
    function checkForChange(slider){
        
        // if size has chnaged chnage the gallery
        if ($(siteWrapper).width() != containerSize){
            
            containerSize = $(siteWrapper).width();
            
            if($(siteWrapper).width() <= 940){
                fancyGallery = false;
                $(galleryClass).addClass('not-so-fancy');

                if(!supports('transition')){
                    slider.slides.animate(noGalleryLi);
                }else{
                    slider.slides.removeClass('small-web-left small-web-right large-web large-web-last small-web-left-last css-slide');
                }

            }else{
                fancyGallery = true;
                if (!supports('transition')){
                    slider.slides.animate(defaultLi);
                }else{
                    slider.slides.addClass('css-slide');
                }
                $(galleryClass).removeClass('not-so-fancy');
            }
            
            slider.doMath();
            slider.newSlides.width(slider.computedW);
            slider.setProps(slider.computedW, "setTotal");
        }
    }

    // This function sets up the slides and the resize event for the fancy slider 
    function setUpSlides(slider){

        if($(siteWrapper).width() <= 940){
            fancyGallery = false;
            $(galleryClass).addClass('not-so-fancy');
        }else{
            $(galleryClass).removeClass('not-so-fancy');
        }

        // only need to do anything for non js
        if (!supports('transition') && fancyGallery){
            slider.slides.animate(defaultLi);
        }

        slider.resize();
    }


    // init the gallery
    $(galleryClass).flexslider({
        animation:'slide',
        selector:"ul li",
        itemWidth:517,
        itemHeight:410,
        startAt:1,
        animationSpeed: isTouchDevice() ? 400 : 1000,
        start: function(slider){setUpSlides(slider);adjustSlides(slider);},
        before: function(slider){checkForChange(slider);adjustSlides(slider);}
    });


    // centre all pagination controls for gallerys
    $.each($('.flex-control-paging'), function(index, value){
        $(this).css('margin-left', '-'+($(this).outerWidth() / 2) + 'px');
    });
}