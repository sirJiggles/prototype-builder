/* facebook mobile navigation */ 

// functions for the navigation
var toggleNav = {
    init:function(){

    },
    swipe:function(){

        $('body').toggleClass('nav-open');

    }

}


$(window).ready(function(){

    $('.nav-controls a').click(function(e){
        e.preventDefault();
        toggleNav.swipe();
    });

    // add a swipe event to the body for the nav
    swipeEvent.applyToElement('body', {callback:toggleNav.swipe});

    // add iscroll
    var scroller = new IScroll('#facebook-nav');

});

