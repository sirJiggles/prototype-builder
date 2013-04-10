/* Mobile navigation */    
if ( $('.mobile-nav').length > 0 ){

    // click event for mobile button
    $('.mobile-nav').click(function(e){
        
        e.preventDefault();
        $('.mobile-nav').toggleClass('active');

        $('body').toggleClass('css-nav-open');

        if( $('body').hasClass('css-nav-open') ){

            // swipe event for controlling the nav
            hammer = new Hammer(document.getElementById("main-wrapper"));

            hammer.onswipe = function(event){
                if(event.direction == 'left'){
                    mobileNavToggle();
                }
            }

        }else{
            // remove the swipe event (to regain control)
            hammer.destroy()
        }  

        // CSS METHOD FIRST
        if (supports('transition')){
            return true;
        }

        // JS METHOD
        var speed = 500;
        if ($('.mobile-nav').hasClass('active')){
           
            $('#main-nav').stop().animate({
                left: '0' 
            }, speed);
            $('#main').stop().animate({
                left: '70%'
            }, speed);

        }else{
            
            $('#main-nav').stop().animate({
                left: '-100%' 
            }, speed);
            $('#main').stop().animate({
                left: '0'
            }, speed);
        }

    });

}
